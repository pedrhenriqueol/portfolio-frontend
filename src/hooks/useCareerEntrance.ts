import { useLayoutEffect, type RefObject } from 'react';
import { useLenis } from '../components/providers/SmoothScrollProvider';
import { createSceneStyles, setSceneInert } from '../utils/sceneStyles';

const phase = (value: number, from: number, to: number) => {
    const p = Math.min(1, Math.max(0, (value - from) / (to - from)));
    return p * p * (3 - 2 * p);
};

/** Coordinates one bounded native sticky scene, with stable native hash links. */
export function useCareerEntrance(ref: RefObject<HTMLElement | null>, onProgress: (progress: number) => void) {
    const lenis = useLenis();

    useLayoutEffect(() => {
        const root = ref.current;
        if (!root) return;
        const frame = root.querySelector<HTMLElement>('.career-entrance-frame')!;
        const pillars = root.querySelector<HTMLElement>('.career-pillars-layout')!;
        const incoming = root.querySelector<HTMLElement>('.career-incoming-layout')!;
        const pillarsMotion = root.querySelector<HTMLElement>('.career-pillars-motion')!;
        const firstTrack = root.querySelector<HTMLElement>('.career-first-track')!;
        const lateralPillars = pillars.querySelectorAll<HTMLElement>('.chapter-tail > :first-child, .chapter-tail > :last-child');
        const heading = root.querySelector<HTMLElement>('.career-heading')!;
        const summary = root.querySelector<HTMLElement>('.career-summary')!;
        const first = root.querySelector<HTMLElement>('[data-career-first-layout]')!;
        const firstMeta = first.querySelector<HTMLElement>('[data-career-first-meta]')!;
        const firstHeader = first.querySelector<HTMLElement>('[data-career-card-header]')!;
        const anchor = root.querySelector<HTMLElement>('.career-scene-anchor')!;
        const svg = root.querySelector<SVGSVGElement>('.career-scene-thread')!;
        const base = root.querySelector<SVGPathElement>('[data-career-thread-base]')!;
        const active = root.querySelector<SVGPathElement>('[data-career-thread-active]')!;
        const middlePillar = pillars.querySelector<HTMLElement>('.chapter-tail > :nth-child(2)');
        const media = matchMedia('(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)');
        let enabled = false;
        let start = 0;
        let distance = 1;
        let width = 1;
        let height = 1;
        let travel = 0;
        let threadStart = 0;
        let threadTop = 0;
        let threadCenter = 0;
        let scrollPosition = lenis ? lenis.scroll : window.scrollY;
        let lastProgress = NaN;
        let lastPath = "";
        const layout = createSceneStyles();
        const motion = createSceneStyles();
        let pending = 0;
        let disposed = false;

        const incomingTop = (node: HTMLElement) => {
            let top = 0;
            for (let current: HTMLElement | null = node; current && current !== incoming; current = current.offsetParent as HTMLElement | null) top += current.offsetTop;
            return top;
        };
        const paint = () => {
            pending = 0;
            if (disposed) return;
            const progress = enabled ? Math.min(1, Math.max(0, (scrollPosition - start) / distance)) : 1;
            if (progress === lastProgress) return;
            lastProgress = progress;
            root.dataset.sceneProgress = String(progress);
            // Clear the center pillar and spread laterals before the career
            // heading rises, preventing ghost overlap in the upper band.
            const outgoing = enabled ? phase(progress, .02, .28) : 0;
            const middleExit = enabled ? phase(progress, 0, .16) : 0;
            const spread = enabled ? phase(progress, 0, .28) : 0;
            const headerEnter = enabled ? phase(progress, .22, .48) : 1;
            const summaryEnter = enabled ? phase(progress, .36, .60) : 1;
            const entering = enabled ? phase(progress, .44, .78) : 1;
            if (enabled) {
                motion.set(pillarsMotion, '--career-outgoing', String(outgoing));
                motion.set(summary, '--career-entering', String(summaryEnter));
                motion.set(firstTrack, '--career-entering', String(entering));
                motion.set(heading, '--career-header-enter', String(headerEnter));
                if (middlePillar) motion.set(middlePillar, '--career-middle-exit', String(middleExit));
                lateralPillars.forEach(node => motion.set(node, '--career-spread', String(spread)));
            } else {
                motion.clear();
            }
            setSceneInert(pillars, enabled && outgoing >= .94);
            if (middlePillar) setSceneInert(middlePillar, enabled && middleExit >= .94);
            setSceneInert(heading, enabled && headerEnter < .98);
            setSceneInert(summary, enabled && summaryEnter < .98);
            setSceneInert(first, enabled && entering < .98);
            if (enabled) {
                const half = width / 2;
                // The axis aligns vertically before the milestone becomes visible,
                // so the connecting line never crosses its year or text.
                const turn = phase(progress, .04, .44);
                const startX = 24 + (half - 24) * turn;
                const endX = width - 24 + (half - width + 24) * turn;
                const startY = threadStart + (threadTop - threadStart) * turn;
                const middleY = threadStart + (threadCenter - threadStart) * turn;
                // The remainder stays in native flow while this frame pins.
                // Its top converges to the frame bottom at the real release.
                const continuationY = height + (1 - progress) * travel;
                const endY = threadStart + (continuationY - threadStart) * turn;
                const path = `M ${startX} ${startY} Q ${half} ${middleY} ${endX} ${endY}`;
                if (path !== lastPath) {
                    base.setAttribute('d', path);
                    active.setAttribute('d', path);
                    lastPath = path;
                }
                motion.set(active, 'stroke-dashoffset', String(1 - turn));
            }
            onProgress(progress);
        };
        const schedulePaint = () => { if (!pending) pending = requestAnimationFrame(paint); };
        const onNativeScroll = () => { scrollPosition = window.scrollY; schedulePaint(); };
        const onLenisScroll = (instance: { scroll: number }) => { scrollPosition = instance.scroll; schedulePaint(); };
        const measure = () => {
            if (disposed) return;
            cancelAnimationFrame(pending);
            pending = 0;
            const zoom = root.getBoundingClientRect().width / root.offsetWidth || 1;
            const viewport = innerHeight / zoom;
            const inset = Math.max(100, viewport * .09);
            const contentHeight = incoming.offsetHeight;
            height = Math.max(contentHeight, pillars.offsetHeight);
            width = frame.offsetWidth;
            const firstTop = incomingTop(first);
            const firstLeadHeight = Math.max(firstMeta.offsetHeight, firstHeader.offsetHeight);
            // The laterals must leave the heading's column without leaving
            // the viewport. A cramped desktop keeps its readable native flow.
            const lateralRoom = (innerWidth / zoom - width) / 2 - 24;
            // Pin the complete, continuous card. Only its identification needs
            // to fit initially; the responsibilities remain attached below the
            // fold and become readable through native scroll after release.
            const openingHeight = Math.max(firstTop + firstLeadHeight, pillars.offsetHeight);
            enabled = media.matches && openingHeight + inset + 48 < viewport && lateralRoom >= width * .24;
            root.dataset.scene = enabled ? 'connected' : 'flow';
            travel = enabled ? viewport * .86 : 0;
            layout.set(root, '--career-frame-height', `${height}px`);
            layout.set(root, '--career-travel', `${travel}px`);
            layout.set(root, '--career-inset', `${inset}px`);
            layout.set(root, '--career-spread-distance', `${width * .24}px`);
            layout.set(root, '--career-first-center', `${firstLeadHeight / 2}px`);
            layout.set(first, '--career-first-center', `${firstLeadHeight / 2}px`);
            // A stationary sibling represents the scroll position at which the
            // incoming composition is complete. It never inherits transforms.
            layout.set(anchor, 'top', `${enabled ? travel : incoming.offsetTop}px`);
            layout.set(anchor, 'scroll-margin-top', `${enabled ? inset : 100}px`);
            scrollPosition = lenis ? lenis.scroll : window.scrollY;
            const rootTop = root.getBoundingClientRect().top + window.scrollY;
            start = rootTop - inset * zoom;
            distance = Math.max(1, travel * zoom);
            if (enabled) {
                threadStart = pillars.offsetHeight + 20;
                threadTop = firstTop;
                threadCenter = threadTop + firstLeadHeight / 2;
                svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
            }
            lastProgress = NaN;
            paint();
        };
        const observer = new ResizeObserver(measure);
        [root, frame, incoming, pillars, first, firstMeta, firstHeader].forEach(node => observer.observe(node));
        const main = root.closest('main');
        if (main) observer.observe(main);
        if (lenis) lenis.on('scroll', onLenisScroll);
        else window.addEventListener('scroll', onNativeScroll, { passive: true });
        window.addEventListener('resize', measure);
        media.addEventListener('change', measure);
        document.fonts.ready.then(measure);
        measure();
        return () => {
            disposed = true;
            cancelAnimationFrame(pending);
            observer.disconnect();
            if (lenis) lenis.off('scroll', onLenisScroll);
            else window.removeEventListener('scroll', onNativeScroll);
            window.removeEventListener('resize', measure);
            media.removeEventListener('change', measure);
            delete root.dataset.scene;
            delete root.dataset.sceneProgress;
            [pillars, heading, summary, first].forEach(node => setSceneInert(node, false));
            if (middlePillar) setSceneInert(middlePillar, false);
            motion.clear();
            layout.clear();
        };
    }, [ref, onProgress, lenis]);
}

/** The continuing tracker follows the reading line in viewport pixels, even
 * with the site's CSS zoom. Milestone positions come from their real layout. */
export function useCareerRemainder(
    ref: RefObject<HTMLElement | null>,
    enabled: boolean,
    onProgress: (progress: number, station2025: number, station2024: number) => void,
    onFirstProgress?: (progress: number) => void,
) {
    const lenis = useLenis();

    useLayoutEffect(() => {
        const root = ref.current;
        if (!root || !enabled) return;
        const firstTrack = root.closest('section')?.querySelector<HTMLElement>('.career-first-track');
        const rows = ['2025', '2024'].map(year => root.querySelector<HTMLElement>(`[data-career-year="${year}"]`)!);
        let start = 0;
        let distance = 1;
        let firstStart = 0;
        let firstDistance = 1;
        let stations = [.25, .75];
        let scrollPosition = lenis ? lenis.scroll : window.scrollY;
        let lastProgress = NaN;
        let lastFirstProgress = NaN;
        let frame = 0;
        let disposed = false;
        const paint = () => {
            frame = 0;
            if (disposed) return;
            const progress = Math.min(1, Math.max(0, (scrollPosition - start) / distance));
            const firstProgress = Math.min(1, Math.max(0, (scrollPosition - firstStart) / firstDistance));
            if (onFirstProgress && firstProgress !== lastFirstProgress) {
                lastFirstProgress = firstProgress;
                onFirstProgress(firstProgress);
            }
            if (progress === lastProgress) return;
            lastProgress = progress;
            onProgress(progress, stations[0], stations[1]);
        };
        const schedulePaint = () => { if (!frame) frame = requestAnimationFrame(paint); };
        const onNativeScroll = () => { scrollPosition = window.scrollY; schedulePaint(); };
        const onLenisScroll = (instance: { scroll: number }) => { scrollPosition = instance.scroll; schedulePaint(); };
        const measure = () => {
            if (disposed) return;
            cancelAnimationFrame(frame);
            frame = 0;
            const rect = root.getBoundingClientRect();
            const zoom = rect.width / root.offsetWidth || 1;
            const lineHeight = Math.max(1, root.offsetHeight - 16);
            scrollPosition = lenis ? lenis.scroll : window.scrollY;
            start = rect.top + window.scrollY - innerHeight * .55;
            distance = lineHeight * zoom;
            if (firstTrack) {
                const firstLine = firstTrack.querySelector<HTMLElement>('.career-first-native-line');
                const targetBox = (firstLine || firstTrack).getBoundingClientRect();
                firstStart = targetBox.top + window.scrollY - innerHeight * .55;
                firstDistance = Math.max(1, targetBox.height);
            } else {
                firstStart = start;
                firstDistance = 1;
            }
            stations = rows.map(row => {
                let top = 0;
                for (let node: HTMLElement | null = row; node && node !== root; node = node.offsetParent as HTMLElement | null) top += node.offsetTop;
                return Math.min(1, Math.max(0, (top + row.offsetHeight / 2) / lineHeight));
            });
            lastProgress = NaN;
            lastFirstProgress = NaN;
            paint();
        };
        const observer = new ResizeObserver(measure);
        [root, ...(firstTrack ? [firstTrack] : []), ...rows].forEach(node => observer.observe(node));
        const main = root.closest('main');
        if (main) observer.observe(main);
        if (lenis) lenis.on('scroll', onLenisScroll);
        else window.addEventListener('scroll', onNativeScroll, { passive: true });
        window.addEventListener('resize', measure);
        document.fonts.ready.then(measure);
        measure();
        return () => {
            disposed = true;
            cancelAnimationFrame(frame);
            observer.disconnect();
            if (lenis) lenis.off('scroll', onLenisScroll);
            else window.removeEventListener('scroll', onNativeScroll);
            window.removeEventListener('resize', measure);
        };
    }, [ref, enabled, onProgress, onFirstProgress, lenis]);
}
