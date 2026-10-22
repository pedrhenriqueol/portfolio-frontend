import { useLayoutEffect, type RefObject } from 'react';
import { useLenis } from '../components/providers/SmoothScrollProvider';
import { createSceneStyles, setSceneInert } from '../utils/sceneStyles';

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => value * value * (3 - 2 * value);

/**
 * Clean compositor-only entrance for the Skills section after the Career Focus Showcase.
 */
export function useCareerSkillsHandoff(ref: RefObject<HTMLElement | null>, mode: 'bento' | '3d', language: string) {
    const lenis = useLenis();

    useLayoutEffect(() => {
        const root = ref.current;
        if (!root) return;
        const heading = root.querySelector<HTMLElement>('.career-skills-heading');
        const body = root.querySelector<HTMLElement>('.career-skills-body');
        if (!heading || !body) return;

        const media = matchMedia('(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)');
        const motion = createSceneStyles();

        let enabled = false;
        let start = 0;
        let revealDistance = 1;
        let scrollPosition = lenis ? lenis.scroll : window.scrollY;
        let lastState = '';
        let pending = 0;
        let measurePending = 0;
        let disposed = false;

        const paint = () => {
            pending = 0;
            if (disposed) return;

            const reveal = enabled && !heading.contains(document.activeElement)
                ? smooth(clamp((scrollPosition - start + revealDistance) / revealDistance))
                : 1;

            const state = reveal.toFixed(4);
            if (state === lastState) return;
            lastState = state;

            root.dataset.skillsReveal = String(reveal);
            setSceneInert(heading, enabled && reveal < 0.98);

            if (!enabled) {
                motion.clear();
                return;
            }

            motion.set(heading, 'opacity', String(0.45 + reveal * 0.55));
            motion.set(heading, 'transform', `translate3d(0, ${((1 - reveal) * 24).toFixed(2)}px, 0)`);
        };

        const schedulePaint = () => {
            if (!disposed && !pending) pending = requestAnimationFrame(paint);
        };
        const onNativeScroll = () => {
            scrollPosition = window.scrollY;
            schedulePaint();
        };
        const onLenisScroll = (instance: { scroll: number }) => {
            scrollPosition = instance.scroll;
            schedulePaint();
        };

        const measure = () => {
            measurePending = 0;
            if (disposed) return;
            cancelAnimationFrame(pending);
            pending = 0;
            enabled = media.matches;
            root.dataset.connected = 'false';
            scrollPosition = lenis ? lenis.scroll : window.scrollY;
            const rect = root.getBoundingClientRect();
            start = rect.top + window.scrollY - innerHeight * 0.25;
            revealDistance = innerHeight * 0.55;
            lastState = '';
            paint();
        };

        const scheduleMeasure = () => {
            if (!disposed && !measurePending) measurePending = requestAnimationFrame(measure);
        };
        const observer = new ResizeObserver(scheduleMeasure);
        [root, heading, body].forEach((node) => observer.observe(node));
        const main = root.closest('main');
        if (main) observer.observe(main);

        if (lenis) lenis.on('scroll', onLenisScroll);
        else window.addEventListener('scroll', onNativeScroll, { passive: true });
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
            if (lenis) lenis.off('scroll', onLenisScroll);
            else window.removeEventListener('scroll', onNativeScroll);
            window.removeEventListener('resize', scheduleMeasure);
            root.removeEventListener('focusin', schedulePaint);
            root.removeEventListener('focusout', schedulePaint);
            media.removeEventListener('change', scheduleMeasure);
            setSceneInert(heading, false);
            delete root.dataset.connected;
            delete root.dataset.skillsReveal;
            motion.clear();
        };
    }, [ref, mode, language, lenis]);
}
