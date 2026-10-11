import { useCallback, useLayoutEffect, useRef, type RefObject } from 'react';
import { useLenis } from '../components/providers/SmoothScrollProvider';
import { setProjectFocus } from '../context/ProjectFocusContext';
import { createSceneStyles, setSceneInert } from '../utils/sceneStyles';

const phase = (value: number, from: number, to: number) => Math.max(0, Math.min(1, (value - from) / (to - from)));
const smooth = (value: number) => value * value * (3 - 2 * value);
const px = (value: number) => `${value.toFixed(3)}px`;
type Point = { x: number; y: number };
const pointOnCurve = (points: Point[], t: number): Point => {
    const u = 1 - t;
    return {
        x: u ** 3 * points[0].x + 3 * u ** 2 * t * points[1].x + 3 * u * t ** 2 * points[2].x + t ** 3 * points[3].x,
        y: u ** 3 * points[0].y + 3 * u ** 2 * t * points[1].y + 3 * u * t ** 2 * points[2].y + t ** 3 * points[3].y,
    };
};
function positionIn(node: HTMLElement, root: HTMLElement): Point {
    let x = 0, y = 0;
    for (let current: HTMLElement | null = node; current && current !== root; current = current.offsetParent as HTMLElement | null) {
        x += current.offsetLeft;
        y += current.offsetTop;
    }
    return { x, y };
}

/** The real form surface starts as a letter, unfolds and settles into its
 * reading layout. Scroll never mounts another form or interrupts a draft. */
export function useContactStory(ref: RefObject<HTMLElement | null>, language: string) {
    const lenis = useLenis();
    const finishRef = useRef<(() => void) | null>(null);
    const focusSnapshot = useRef<{ node: HTMLElement; top: number } | null>(null);

    useLayoutEffect(() => {
        const root = ref.current;
        if (!root) return;
        const content = root.querySelector<HTMLElement>('.contact-story-content')!;
        const heading = root.querySelector<HTMLElement>('.contact-story-heading')!;
        const title = heading.querySelector<HTMLElement>('h2')!;
        const channels = root.querySelector<HTMLElement>('.contact-story-channels')!;
        const form = root.querySelector<HTMLElement>('.contact-story-form')!;
        const body = form.querySelector<HTMLElement>('.contact-form-body')!;
        const preview = form.querySelector<HTMLElement>('.contact-message-preview')!;
        const flap = form.querySelector<SVGPathElement>('[data-contact-flap]')!;
        const cue = root.querySelector<HTMLElement>('.contact-story-cue')!;
        const anchor = root.querySelector<HTMLElement>('#contato')!;
        const thread = root.querySelector<SVGPathElement>('[data-contact-thread]')!;
        const traveller = root.querySelector<SVGCircleElement>('[data-contact-traveller]')!;
        let outgoing: HTMLElement | null = null;
        const media = matchMedia('(min-width: 1024px) and (min-height: 700px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
        const layout = createSceneStyles();
        const motion = createSceneStyles();
        let enabled = false, disposed = false;
        let frame = 0, measureFrame = 0;
        let start = 0, run = 1, finish = 0;
        let headingY = 0, messageX = 0, messageY = 0;
        let scaleX = 1, scaleY = 1, cueFocusY = 0;
        let incomingCurve: Point[] = [], messageCurve: Point[] = [];
        let scrollPosition = window.scrollY;
        let lastProgress = NaN, lastFocus = false, lastCueFocus = false;

        const clearInteraction = () => {
            [channels, form, cue].forEach(node => setSceneInert(node, false));
            setProjectFocus(false, 'contact');
        };
        const paint = () => {
            frame = 0;
            if (disposed || !enabled) return;
            const actual = phase(scrollPosition, start, start + run);
            const interacting = channels.contains(document.activeElement) || form.contains(document.activeElement);
            const cueFocused = cue.contains(document.activeElement);
            const progress = interacting ? Math.max(.86, actual) : actual;
            setProjectFocus(scrollPosition >= start - innerHeight * .55 && actual < .86 && !interacting, 'contact');
            if (progress === lastProgress && interacting === lastFocus && cueFocused === lastCueFocus) return;
            lastProgress = progress;
            lastFocus = interacting;
            lastCueFocus = cueFocused;
            root.dataset.sceneProgress = progress.toFixed(4);
            const lift = smooth(phase(progress, .20, .57));
            const unfold = smooth(phase(progress, .08, .34));
            const grow = smooth(phase(progress, .27, .76));
            const reveal = smooth(phase(progress, .60, .82));
            const links = smooth(phase(progress, .58, .82));
            const sealExit = smooth(phase(progress, .42, .64));
            const cueExit = smooth(phase(progress, .12, .29));
            const travel = smooth(phase(progress, 0, .76));
            const dot = travel < .45 ? pointOnCurve(incomingCurve, travel / .45)
                : pointOnCurve(messageCurve, (travel - .45) / .55);
            const ink = 1 - smooth(phase(progress, .73, .88));
            if (reveal === 1 && cueFocused) root.focus({ preventScroll: true });
            motion.set(heading, 'transform', `translateY(${px(headingY * (1 - lift))})`);
            motion.set(title, 'transform', `scale(${(1.55 - lift * .55).toFixed(5)})`);
            // One surface, two geometries: envelope -> full message form.
            motion.set(form, 'transform', `translate3d(${px(messageX * (1 - grow))}, ${px(messageY * (1 - grow))}, 0) rotate(${(-7 * (1 - grow)).toFixed(3)}deg) scale(${(scaleX + grow * (1 - scaleX)).toFixed(5)}, ${(scaleY + grow * (1 - scaleY)).toFixed(5)})`);
            motion.set(body, 'opacity', reveal.toFixed(5));
            motion.set(body, 'transform', `translateY(${px((1 - reveal) * 24)})`);
            motion.set(preview, 'opacity', (1 - sealExit).toFixed(5));
            motion.set(flap, 'transform', `scaleY(${(1 - unfold * 1.55).toFixed(5)})`);
            motion.set(channels, 'transform', `translate3d(${px((1 - links) * -36)}, ${px((1 - links) * 20)}, 0)`);
            motion.set(channels, 'opacity', links.toFixed(5));
            motion.set(thread, 'stroke-dashoffset', (1 - travel).toFixed(5));
            motion.set(thread, 'opacity', (ink * .45).toFixed(5));
            motion.set(traveller, 'transform', `translate(${px(dot.x)}, ${px(dot.y)})`);
            motion.set(traveller, 'opacity', ink.toFixed(5));
            // The quiet cue remains a visible-on-focus route until the form
            // itself is ready for Tab. Its focused position clears the scene.
            motion.set(cue, 'transform', `translateY(${px(cueFocused ? cueFocusY : -cueExit * 12)})`);
            motion.set(cue, 'left', cueFocused ? 'auto' : '50%');
            motion.set(cue, 'right', cueFocused ? '1.5rem' : 'auto');
            motion.set(cue, 'translate', cueFocused ? '0 0' : '-50% 0');
            motion.set(cue, 'opacity', (cueFocused && reveal < 1 ? 1 : 1 - cueExit).toFixed(5));
            motion.set(cue, 'visibility', reveal === 1 ? 'hidden' : 'visible');
            motion.set(cue, 'pointer-events', cueExit === 1 && !cueFocused ? 'none' : 'auto');
            setSceneInert(channels, links < .98 && !interacting);
            setSceneInert(form, reveal < .98 && !interacting);
            setSceneInert(cue, reveal === 1);
        };
        const paintOutgoing = () => {
            if (!enabled || !outgoing) return;
            const exit = smooth(phase(scrollPosition, start - innerHeight * .65, start - innerHeight * .05));
            const focused = outgoing.contains(document.activeElement);
            motion.set(outgoing, 'opacity', (focused ? 1 : 1 - exit * .85).toFixed(5));
            motion.set(outgoing, 'transform', `translateY(${px(focused ? 0 : -exit * 64)}) scale(${focused ? 1 : (1 - exit * .035).toFixed(5)})`);
        };
        const schedulePaint = () => { if (!disposed && !frame) frame = requestAnimationFrame(() => { paintOutgoing(); paint(); }); };
        const complete = () => {
            if (enabled) {
                if (lenis) lenis.scrollTo(finish, { immediate: true, force: true });
                else window.scrollTo({ top: finish, behavior: 'instant' });
                scrollPosition = finish;
            }
            paintOutgoing();
            paint();
            root.querySelector<HTMLInputElement>('#contact-name')?.focus({ preventScroll: enabled });
        };
        finishRef.current = complete;
        const onFocus = (event: FocusEvent) => {
            if (!enabled) return;
            const target = event.target as Node;
            if ((channels.contains(target) || form.contains(target)) && scrollPosition < start + run * .86) {
                if (lenis) lenis.scrollTo(finish, { immediate: true, force: true });
                else window.scrollTo({ top: finish, behavior: 'instant' });
                scrollPosition = finish;
            }
            schedulePaint();
        };
        const measure = () => {
            measureFrame = 0;
            if (disposed) return;
            const zoom = root.getBoundingClientRect().width / root.offsetWidth || 1;
            const available = innerHeight / zoom - 132;
            const height = content.offsetHeight;
            const next = media.matches && height + 24 <= available;
            const name = root.querySelector<HTMLElement>('#contact-name')!;
            const cueHadFocus = cue.contains(document.activeElement)
                || !!focusSnapshot.current && cue.contains(focusSnapshot.current.node);
            const active = cueHadFocus && !next ? name
                : document.activeElement instanceof HTMLElement && content.contains(document.activeElement) ? document.activeElement : null;
            const previousFocusTop = cueHadFocus ? null
                : active && focusSnapshot.current?.node === active ? focusSnapshot.current.top
                : enabled !== next && active ? active.getBoundingClientRect().top : null;
            focusSnapshot.current = null;
            outgoing = root.closest('main')?.querySelector<HTMLElement>('[data-corporate-content]') || null;
            if (next !== enabled) { enabled = next; motion.clear(); clearInteraction(); }
            root.dataset.connected = String(enabled);
            run = innerHeight * 1.6;
            const contentTop = Math.max(12, (available - height) / 2);
            layout.set(root, '--contact-frame-height', px(available));
            layout.set(root, '--contact-run', px(enabled ? run / zoom : 0));
            layout.set(root, '--contact-content-top', px(contentTop));
            layout.set(anchor, 'top', px(enabled ? run * .9 / zoom : 0));
            start = root.getBoundingClientRect().top + window.scrollY - 100 * zoom;
            finish = start + run * .9;
            if (enabled) anchor.dataset.navAt = String(start + run * .45);
            else delete anchor.dataset.navAt;
            headingY = Math.max(0, available * .18 - contentTop);
            const centre = { x: content.clientWidth / 2, y: available * .62 - contentTop };
            messageX = centre.x - form.offsetLeft - form.offsetWidth / 2;
            messageY = centre.y - form.offsetTop - form.offsetHeight / 2;
            scaleX = Math.min(1, 360 / form.offsetWidth);
            scaleY = Math.min(1, 240 / form.offsetHeight);
            const cueTop = available * .62 + 240 / 2 + 36;
            layout.set(cue, 'top', px(cueTop));
            cueFocusY = 8 - cueTop;
            const target = positionIn(name, content);
            target.x -= 16;
            target.y += name.offsetHeight / 2;
            incomingCurve = [{ x: content.clientWidth * .12, y: -180 }, { x: content.clientWidth * .01, y: centre.y * .5 }, { x: centre.x - 160, y: centre.y }, centre];
            messageCurve = [centre, { x: centre.x + 200, y: centre.y + 60 }, { x: target.x - 80, y: target.y + 80 }, target];
            const c = (p: Point) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
            thread.setAttribute('d', `M ${c(incomingCurve[0])} C ${incomingCurve.slice(1).map(c).join(' ')} C ${messageCurve.slice(1).map(c).join(' ')}`);
            scrollPosition = window.scrollY;
            lastProgress = NaN;
            if (enabled) { paintOutgoing(); paint(); }
            else { clearInteraction(); delete root.dataset.sceneProgress; }
            // The invitation disappears in native flow. Keep its keyboard
            // route useful when a media/Lenis change rebuilds this effect.
            if (cueHadFocus) {
                const destination = enabled && lastProgress < .82 ? cue.querySelector<HTMLButtonElement>('button') : name;
                destination?.focus({ preventScroll: true });
                if (enabled) paint();
                else name.scrollIntoView({ block: 'center', behavior: 'instant' });
            }
            if (active && previousFocusTop !== null) {
                const delta = active.getBoundingClientRect().top - previousFocusTop;
                if (Math.abs(delta) > 1) window.scrollBy({ top: delta, behavior: 'instant' });
                const rect = active.getBoundingClientRect();
                if (rect.top < 80 || rect.bottom > innerHeight - 24) active.scrollIntoView({ block: 'center', behavior: 'instant' });
                scrollPosition = window.scrollY;
                if (enabled) { paintOutgoing(); paint(); }
            }
        };
        const scheduleMeasure = () => { if (!disposed && !measureFrame) measureFrame = requestAnimationFrame(measure); };
        const onNative = () => { scrollPosition = window.scrollY; schedulePaint(); };
        const onLenis = (instance: { scroll: number }) => { scrollPosition = instance.scroll; schedulePaint(); };
        const observer = new ResizeObserver(scheduleMeasure);
        observer.observe(content);
        const main = root.closest('main');
        if (main) observer.observe(main);
        root.addEventListener('focusin', onFocus);
        root.addEventListener('focusout', schedulePaint);
        if (lenis) lenis.on('scroll', onLenis);
        else window.addEventListener('scroll', onNative, { passive: true });
        window.addEventListener('resize', scheduleMeasure);
        media.addEventListener('change', scheduleMeasure);
        document.fonts.ready.then(scheduleMeasure);
        measure();
        return () => {
            const active = document.activeElement;
            if (active instanceof HTMLElement && (content.contains(active) || cue.contains(active))) focusSnapshot.current = { node: active, top: active.getBoundingClientRect().top };
            disposed = true;
            cancelAnimationFrame(frame);
            cancelAnimationFrame(measureFrame);
            observer.disconnect();
            root.removeEventListener('focusin', onFocus);
            root.removeEventListener('focusout', schedulePaint);
            if (lenis) lenis.off('scroll', onLenis);
            else window.removeEventListener('scroll', onNative);
            window.removeEventListener('resize', scheduleMeasure);
            media.removeEventListener('change', scheduleMeasure);
            finishRef.current = null;
            motion.clear(); layout.clear(); clearInteraction();
            delete root.dataset.connected; delete root.dataset.sceneProgress; delete anchor.dataset.navAt;
        };
    }, [ref, language, lenis]);

    return useCallback(() => finishRef.current?.(), []);
}
