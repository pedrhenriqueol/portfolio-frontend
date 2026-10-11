import { useCallback, useLayoutEffect, useRef, type RefObject } from 'react';
import { useLenis } from '../components/providers/SmoothScrollProvider';
import { setProjectFocus } from '../context/ProjectFocusContext';
import { createSceneStyles, setSceneInert } from '../utils/sceneStyles';

const phase = (value: number, from: number, to: number) => Math.max(0, Math.min(1, (value - from) / (to - from)));
const smooth = (value: number) => value * value * (3 - 2 * value);
const px = (value: number) => `${value.toFixed(3)}px`;

/** One invitation becomes the real channels/form. Native scroll owns the camera;
 * form state and layout survive resizing, reverse travel and direct links. */
export function useContactStory(ref: RefObject<HTMLElement | null>, language: string) {
    const lenis = useLenis();
    const finishRef = useRef<(() => void) | null>(null);

    useLayoutEffect(() => {
        const root = ref.current;
        if (!root) return;
        const content = root.querySelector<HTMLElement>('.contact-story-content')!;
        const heading = root.querySelector<HTMLElement>('.contact-story-heading')!;
        const channels = root.querySelector<HTMLElement>('.contact-story-channels')!;
        const form = root.querySelector<HTMLElement>('.contact-story-form')!;
        const cue = root.querySelector<HTMLElement>('.contact-story-cue')!;
        const anchor = root.querySelector<HTMLElement>('#contato')!;
        const thread = root.querySelector<SVGPathElement>('[data-contact-thread]')!;
        let outgoing: HTMLElement | null = null;
        const media = matchMedia('(min-width: 1024px) and (min-height: 700px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
        const layout = createSceneStyles();
        const motion = createSceneStyles();
        let enabled = false;
        let disposed = false;
        let frame = 0;
        let measureFrame = 0;
        let start = 0;
        let run = 1;
        let finish = 0;
        let shift = 0;
        let headlineY = 0;
        let cueFocusY = 0;
        let scrollPosition = window.scrollY;
        let lastProgress = NaN;
        let lastFocus = false;
        let lastCueFocus = false;

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
            const progress = interacting ? Math.max(.84, actual) : actual;
            const focus = scrollPosition >= start - innerHeight * .55 && actual < .84 && !interacting;
            setProjectFocus(focus, 'contact');
            if (progress === lastProgress && interacting === lastFocus && cueFocused === lastCueFocus) return;
            lastProgress = progress;
            lastFocus = interacting;
            lastCueFocus = cueFocused;
            root.dataset.sceneProgress = progress.toFixed(4);
            const lift = smooth(phase(progress, .06, .34));
            const appear = smooth(phase(progress, .18, .36));
            const transfer = smooth(phase(progress, .36, .67));
            const open = smooth(phase(progress, .49, .79));
            const cueExit = smooth(phase(progress, .06, .22));
            if (open === 1 && cueFocused) root.focus({ preventScroll: true });
            motion.set(heading, 'transform', `translateY(${px(headlineY * (1 - lift))}) scale(${(1.55 - lift * .55).toFixed(5)})`);
            motion.set(channels, 'transform', `translate3d(${px(shift * (1 - transfer))}, ${px((1 - appear) * 40)}, 0) scale(${(.92 + transfer * .08).toFixed(5)})`);
            motion.set(channels, 'opacity', appear.toFixed(5));
            motion.set(form, 'transform', `translate3d(${px((1 - open) * 88)}, ${px((1 - open) * 24)}, 0)`);
            motion.set(form, 'opacity', open.toFixed(5));
            // After the visual cue fades it remains a skip route that reveals
            // on keyboard focus, until the form itself enters the Tab order.
            motion.set(cue, 'transform', `translateY(${px(cueFocused ? cueFocusY : -cueExit * 12)})`);
            motion.set(cue, 'left', cueFocused ? 'auto' : '50%');
            motion.set(cue, 'right', cueFocused ? '1.5rem' : 'auto');
            motion.set(cue, 'translate', cueFocused ? '0 0' : '-50% 0');
            motion.set(cue, 'opacity', (cueFocused && open < 1 ? 1 : 1 - cueExit).toFixed(5));
            motion.set(cue, 'visibility', open === 1 ? 'hidden' : 'visible');
            motion.set(cue, 'pointer-events', cueExit === 1 && !cueFocused ? 'none' : 'auto');
            motion.set(thread, 'stroke-dashoffset', (1 - transfer).toFixed(5));
            motion.set(thread, 'opacity', (appear * (1 - open * .65)).toFixed(5));
            // Hidden controls never receive a stray click; the invitation remains
            // a keyboard route to the fully open form during the introduction.
            setSceneInert(channels, appear < .95 && !interacting);
            setSceneInert(form, open < .98 && !interacting);
            setSceneInert(cue, open === 1);
        };
        // The previous catalogue retires before the pinned invitation takes over.
        const paintOutgoing = () => {
            if (!enabled || !outgoing) return;
            const exit = smooth(phase(scrollPosition, start - innerHeight * .65, start - innerHeight * .05));
            const focused = outgoing.contains(document.activeElement);
            motion.set(outgoing, 'opacity', (focused ? 1 : 1 - exit * .7).toFixed(5));
            motion.set(outgoing, 'transform', `translateY(${px(focused ? 0 : -exit * 24)})`);
        };
        const schedulePaint = () => {
            if (!frame) frame = requestAnimationFrame(() => { paintOutgoing(); paint(); });
        };
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
            if ((channels.contains(target) || form.contains(target)) && scrollPosition < start + run * .84) {
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
            const active = document.activeElement instanceof HTMLElement && content.contains(document.activeElement)
                ? document.activeElement : null;
            const previousFocusTop = enabled !== next && active ? active.getBoundingClientRect().top : null;
            // The catalogue is lazy loaded; remeasure its handoff layer once
            // Suspense resolves instead of retaining the initial null reference.
            outgoing = root.closest('main')?.querySelector<HTMLElement>('[data-corporate-content]') || null;
            if (next !== enabled) {
                enabled = next;
                motion.clear();
                clearInteraction();
            }
            root.dataset.connected = String(enabled);
            run = innerHeight * 1.35;
            layout.set(root, '--contact-frame-height', px(available));
            layout.set(root, '--contact-run', px(enabled ? run / zoom : 0));
            layout.set(root, '--contact-content-top', px(Math.max(12, (available - height) / 2)));
            layout.set(anchor, 'top', px(enabled ? run * .9 / zoom : 0));
            start = root.getBoundingClientRect().top + window.scrollY - 100 * zoom;
            finish = start + run * .9;
            if (enabled) anchor.dataset.navAt = String(start + run * .4);
            else delete anchor.dataset.navAt;
            shift = (content.clientWidth - channels.offsetWidth) / 2 - channels.offsetLeft;
            headlineY = Math.max(0, (available - heading.offsetHeight * 1.55) / 2 - (available - height) / 2);
            const contentTop = Math.max(12, (available - height) / 2);
            const cueTop = contentTop + headlineY + heading.offsetHeight * 1.55 + 32;
            layout.set(cue, 'top', px(cueTop));
            cueFocusY = 8 - cueTop;
            // The connector lives only in the breathing space above the cards.
            const middle = content.clientWidth / 2;
            const y = heading.offsetHeight + 20;
            const left = channels.offsetLeft + channels.offsetWidth / 2;
            const right = form.offsetLeft + form.offsetWidth / 2;
            thread.setAttribute('d', `M ${middle} ${y - 12} V ${y} Q ${middle} ${y + 12} ${middle - 12} ${y + 12} H ${left + 12} Q ${left} ${y + 12} ${left} ${y + 24} M ${middle} ${y} Q ${middle} ${y + 12} ${middle + 12} ${y + 12} H ${right - 12} Q ${right} ${y + 12} ${right} ${y + 24}`);
            scrollPosition = window.scrollY;
            lastProgress = NaN;
            if (enabled) { paintOutgoing(); paint(); }
            else {
                clearInteraction();
                delete root.dataset.sceneProgress;
            }
            // Changing viewport or form feedback may release the pin. Keep
            // the existing focused field at its reading position in the flow.
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
            motion.clear();
            layout.clear();
            clearInteraction();
            delete root.dataset.connected;
            delete root.dataset.sceneProgress;
            delete anchor.dataset.navAt;
        };
    }, [ref, language, lenis]);

    return useCallback(() => finishRef.current?.(), []);
}
