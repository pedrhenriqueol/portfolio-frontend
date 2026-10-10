import { useLayoutEffect, type RefObject } from 'react';
import { createSceneStyles, setSceneInert } from '../utils/sceneStyles';

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const layoutLeft = (node: HTMLElement, root: HTMLElement) => {
    let left = 0;
    let current: HTMLElement | null = node;
    while (current && current !== root) {
        left += current.offsetLeft;
        const parent = current.offsetParent as HTMLElement | null;
        if (parent) left += parent.clientLeft;
        current = parent;
    }
    return left;
};

/** One bounded introduction connects the real career rail to either skills view. */
export function useCareerSkillsHandoff(ref: RefObject<HTMLElement | null>, mode: 'bento' | '3d', language: string) {
    useLayoutEffect(() => {
        const root = ref.current;
        if (!root) return;
        const track = root.querySelector<HTMLElement>('.career-skills-intro-track')!;
        const frame = root.querySelector<HTMLElement>('.career-skills-intro-frame')!;
        const heading = root.querySelector<HTMLElement>('.career-skills-heading')!;
        const body = root.querySelector<HTMLElement>('.career-skills-body')!;
        const anchor = root.querySelector<HTMLElement>('.career-skills-anchor')!;
        const svg = root.querySelector<SVGSVGElement>('.career-skills-thread')!;
        const sourcePath = svg.querySelector<SVGPathElement>('[data-skills-source-thread]')!;
        const marker = svg.querySelector<SVGCircleElement>('[data-skills-source-marker]')!;
        const guideBase = svg.querySelector<SVGPathElement>('[data-skills-guide-base]')!;
        const guideActive = svg.querySelector<SVGPathElement>('[data-skills-guide-active]')!;
        const rail = [...(root.closest('main')?.querySelectorAll<HTMLElement>('.career-remainder > .career-timeline-rail') || [])]
            .find(node => node.classList.contains('md:block'));
        const media = matchMedia('(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)');
        const layout = createSceneStyles();
        const motion = createSceneStyles();
        const paths = new Map<SVGPathElement, string>();
        let enabled = false;
        let width = 1;
        let height = 1;
        let travel = 0;
        let start = 0;
        let distance = 1;
        let revealDistance = 1;
        let sourceX = 0;
        let sourceY = 0;
        let guideTop = 0;
        let targets: number[] = [];
        let lastState = '';
        let pending = 0;
        let measurePending = 0;
        let disposed = false;

        const writePath = (node: SVGPathElement, path: string) => {
            if (paths.get(node) === path) return;
            paths.set(node, path);
            node.setAttribute('d', path);
        };
        const paint = () => {
            pending = 0;
            if (disposed) return;
            const progress = enabled ? clamp((scrollY - start) / distance) : 1;
            // The heading finishes its entrance before it pins, so the pin
            // never opens on an empty viewport or hides readable controls.
            const reveal = enabled && !heading.contains(document.activeElement)
                ? clamp((scrollY - start + revealDistance) / revealDistance) : 1;
            const state = `${progress}:${reveal}`;
            if (state === lastState) return;
            lastState = state;
            root.dataset.sceneProgress = String(progress);
            root.dataset.skillsReveal = String(reveal);
            setSceneInert(heading, enabled && reveal < .98);
            if (!enabled) {
                motion.clear();
                return;
            }
            motion.set(heading, 'opacity', String(reveal));
            motion.set(heading, 'transform', `translateY(${(1 - reveal) * 16}px)`);
            const half = width / 2;
            // Both ends are native document positions. As the introduction
            // pins, its local source moves up and its body converges below it.
            const source = sourceY - progress * travel;
            writePath(sourcePath, `M ${sourceX} ${source} L ${half} 8`);
            const endY = height + (1 - progress) * travel - 12;
            const fork = clamp((progress - .12) / .72);
            const splitY = guideTop + Math.min(20, Math.max(0, (endY - guideTop) * .3));
            const guide = targets.map(target => {
                const x = half + (target - half) * fork;
                return `M ${half} ${guideTop} L ${half} ${splitY} Q ${half} ${endY} ${x} ${endY}`;
            }).join(' ');
            writePath(guideBase, guide);
            writePath(guideActive, guide);
            motion.set(guideActive, 'opacity', String(.35 + fork * .65));
        };
        const measure = () => {
            measurePending = 0;
            if (disposed) return;
            cancelAnimationFrame(pending);
            pending = 0;
            const rootRect = root.getBoundingClientRect();
            const zoom = rootRect.width / root.offsetWidth || 1;
            const viewport = innerHeight / zoom;
            const inset = Math.max(100, viewport * .09);
            width = frame.offsetWidth;
            height = heading.offsetHeight + 32 + 56;
            enabled = media.matches && !!rail && height + inset + 48 < viewport;
            root.dataset.connected = String(enabled);
            // Only the introduction owns extra travel; neither selected view
            // has to fit the viewport, and mode changes preserve its instance.
            travel = enabled ? viewport * .32 : 0;
            layout.set(root, '--skills-intro-height', `${height}px`);
            layout.set(root, '--skills-intro-travel', `${travel}px`);
            layout.set(root, '--skills-intro-inset', `${inset}px`);
            layout.set(anchor, 'top', `${travel}px`);
            layout.set(anchor, 'scroll-margin-top', `${enabled ? inset : 100}px`);
            const trackRect = track.getBoundingClientRect();
            const trackTop = trackRect.top + scrollY;
            start = trackTop - inset * zoom;
            distance = Math.max(1, travel * zoom);
            revealDistance = innerHeight * .24;
            if (enabled && rail) {
                const railRect = rail.getBoundingClientRect();
                sourceX = (railRect.left + railRect.width / 2 - trackRect.left) / zoom;
                sourceY = (railRect.bottom + scrollY - trackTop) / zoom;
                guideTop = height - 56 + 12;
                const cards = [...body.querySelectorAll<HTMLElement>('[data-skill-card]')].slice(0, 3);
                // Cache native layout centers: the chapter's outgoing scale
                // can be active when resize or lazy content triggers a measure.
                // Offset coordinates already use the SVG's unzoomed CSS units.
                const trackLeft = layoutLeft(track, root);
                targets = mode === 'bento' && cards.length === 3
                    ? cards.map(card => layoutLeft(card, root) + card.offsetWidth / 2 - trackLeft)
                    : [width / 2];
                svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
                marker.setAttribute('cx', String(width / 2));
                marker.setAttribute('cy', '8');
            }
            lastState = '';
            paint();
        };
        const schedulePaint = () => { if (!disposed && !pending) pending = requestAnimationFrame(paint); };
        const scheduleMeasure = () => { if (!disposed && !measurePending) measurePending = requestAnimationFrame(measure); };
        const observer = new ResizeObserver(scheduleMeasure);
        [root, heading, body, ...(rail ? [rail] : [])].forEach(node => observer.observe(node));
        const main = root.closest('main');
        if (main) observer.observe(main);
        const mutations = new MutationObserver(scheduleMeasure);
        mutations.observe(body, { childList: true, subtree: true });
        window.addEventListener('scroll', schedulePaint, { passive: true });
        window.addEventListener('resize', scheduleMeasure);
        root.addEventListener('focusin', schedulePaint);
        root.addEventListener('focusout', schedulePaint);
        media.addEventListener('change', scheduleMeasure);
        document.fonts.ready.then(scheduleMeasure);
        measure();
        return () => {
            disposed = true;
            cancelAnimationFrame(pending);
            cancelAnimationFrame(measurePending);
            observer.disconnect();
            mutations.disconnect();
            window.removeEventListener('scroll', schedulePaint);
            window.removeEventListener('resize', scheduleMeasure);
            root.removeEventListener('focusin', schedulePaint);
            root.removeEventListener('focusout', schedulePaint);
            media.removeEventListener('change', scheduleMeasure);
            setSceneInert(heading, false);
            delete root.dataset.connected;
            delete root.dataset.sceneProgress;
            delete root.dataset.skillsReveal;
            motion.clear();
            layout.clear();
        };
    }, [ref, mode, language]);
}
