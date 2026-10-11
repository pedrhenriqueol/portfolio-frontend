import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import type { MotionValue } from 'framer-motion';
import { useLenis } from '../components/providers/SmoothScrollProvider';
import { setProjectFocus } from '../context/ProjectFocusContext';
import { createSceneStyles } from '../utils/sceneStyles';

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => n * n * (3 - 2 * n);

/** Native vertical travel drives the existing gallery; only the inner frame pins. */
export function useProjectPresentation(
    ref: RefObject<HTMLElement | null>, progress: MotionValue<number>,
    dragging: RefObject<boolean>, count: number, language: string,
) {
    const lenis = useLenis();
    const [presenting, setPresenting] = useState(false);
    const navigation = useRef<((index: number) => boolean) | null>(null);

    useLayoutEffect(() => {
        const root = ref.current;
        if (!root) return;
        const content = root.querySelector<HTMLElement>('.project-focus-layout')!;
        const gallery = root.querySelector<HTMLElement>('.project-focus-gallery')!;
        const skills = root.closest('main')?.querySelector<HTMLElement>('.career-skills-body .chapter-tail');
        const media = matchMedia('(min-width: 1024px) and (min-height: 700px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
        const layout = createSceneStyles();
        const motion = createSceneStyles();
        let enabled = false;
        let start = 0;
        let run = 1;
        let step = 1;
        let lead = 0;
        let approach = 1;
        let focusStart = 0;
        let focusEnd = 0;
        let scrollPosition = window.scrollY;
        let frame = 0;
        let measureFrame = 0;
        let disposed = false;
        let lastProgress = NaN;
        let manualNavigation = false;
        let navigationToken = 0;
        let navigationTimer = 0;

        const paint = () => {
            frame = 0;
            if (disposed || !enabled) return;
            const reveal = ease(clamp((scrollPosition - start + approach) / approach));
            const focused = scrollPosition >= focusStart && scrollPosition <= focusEnd;
            setProjectFocus(focused);
            // Focus navigation exposes the composition immediately, even on approach.
            const visible = content.contains(document.activeElement) ? 1 : reveal;
            motion.set(content, 'opacity', String(.55 + visible * .45));
            motion.set(gallery, 'transform', `translateY(${(1 - visible) * 32}px)`);
            if (skills) {
                const outgoing = ease(clamp((scrollPosition - start + innerHeight * .5) / (innerHeight * .5)));
                motion.set(skills, 'opacity', String(1 - outgoing * .9));
                motion.set(skills, 'transform', `translateY(${-outgoing * 20}px) scale(${1 - outgoing * .025})`);
            }
            if (dragging.current || manualNavigation) return;
            const travel = Math.max(0, Math.min(count - 1, (scrollPosition - start - lead) / step));
            const index = Math.floor(travel);
            // Brief readable stops followed by a continuous, reversible move.
            const value = Math.min(count - 1, index + ease(clamp((travel - index - .2) / .7)));
            if (value !== lastProgress || value !== progress.get()) {
                lastProgress = value;
                progress.set(value);
            }
        };
        const schedulePaint = () => { if (!frame) frame = requestAnimationFrame(paint); };
        const measure = () => {
            measureFrame = 0;
            if (disposed) return;
            const zoom = root.getBoundingClientRect().width / root.offsetWidth || 1;
            const viewport = innerHeight / zoom;
            const height = viewport - 100;
            layout.set(root, '--project-card-height', `${Math.max(480, Math.min(680, viewport - 420))}px`);
            const contentHeight = content.offsetHeight;
            const next = media.matches && count > 1 && contentHeight + 32 < height;
            setPresenting(next);
            if (root.dataset.presentation !== String(next)) root.dataset.presentation = String(next);
            if (next !== enabled) {
                enabled = next;
                motion.clear();
                if (!enabled) setProjectFocus(false);
            }
            layout.set(root, '--project-frame-height', `${height}px`);
            layout.set(root, '--project-stage-offset', `${Math.min(80, Math.max(16, (height - contentHeight) * .3))}px`);
            step = innerHeight * .9;
            lead = innerHeight * .25;
            run = step * (count - 1) + innerHeight * .6;
            layout.set(root, '--project-run', `${enabled ? run / zoom : 0}px`);
            start = root.getBoundingClientRect().top + window.scrollY - 100 * zoom;
            focusStart = start - innerHeight * .12;
            focusEnd = (root.closest('#projetos') || root).getBoundingClientRect().bottom + window.scrollY - innerHeight * .22;
            approach = innerHeight * .85;
            scrollPosition = window.scrollY;
            lastProgress = NaN;
            paint();
        };
        const scheduleMeasure = () => { if (!disposed && !measureFrame) measureFrame = requestAnimationFrame(measure); };
        const onNative = () => { scrollPosition = window.scrollY; schedulePaint(); };
        const onLenis = (instance: { scroll: number }) => { scrollPosition = instance.scroll; schedulePaint(); };
        navigation.current = (index) => {
            if (!enabled) return false;
            // Land in the readable part of each stop. The document remains the scroller.
            const top = start + lead + step * (index + .1);
            const token = ++navigationToken;
            manualNavigation = true;
            progress.set(index);
            clearTimeout(navigationTimer);
            const finish = () => {
                if (disposed || token !== navigationToken) return;
                manualNavigation = false;
                lastProgress = NaN;
                scrollPosition = window.scrollY;
                schedulePaint();
            };
            // Keep a manual selection authoritative while the document catches up.
            if (lenis && getComputedStyle(document.body).overflowY !== 'hidden') lenis.scrollTo(top, { duration: .65, onComplete: finish });
            else window.scrollTo({ top, behavior: 'smooth' });
            navigationTimer = window.setTimeout(finish, 1000);
            return true;
        };
        const interruptNavigation = () => {
            if (!manualNavigation) return;
            ++navigationToken;
            clearTimeout(navigationTimer);
            manualNavigation = false;
            lastProgress = NaN;
        };
        const observer = new ResizeObserver(scheduleMeasure);
        observer.observe(content);
        const main = root.closest('main');
        if (main) observer.observe(main);
        if (lenis) lenis.on('scroll', onLenis);
        else window.addEventListener('scroll', onNative, { passive: true });
        root.addEventListener('focusin', schedulePaint);
        window.addEventListener('resize', scheduleMeasure);
        window.addEventListener('wheel', interruptNavigation, { passive: true });
        window.addEventListener('pointerdown', interruptNavigation, { passive: true });
        window.addEventListener('keydown', interruptNavigation);
        media.addEventListener('change', scheduleMeasure);
        document.fonts.ready.then(scheduleMeasure);
        measure();
        return () => {
            disposed = true;
            cancelAnimationFrame(frame);
            cancelAnimationFrame(measureFrame);
            clearTimeout(navigationTimer);
            observer.disconnect();
            if (lenis) lenis.off('scroll', onLenis);
            else window.removeEventListener('scroll', onNative);
            root.removeEventListener('focusin', schedulePaint);
            window.removeEventListener('resize', scheduleMeasure);
            window.removeEventListener('wheel', interruptNavigation);
            window.removeEventListener('pointerdown', interruptNavigation);
            window.removeEventListener('keydown', interruptNavigation);
            media.removeEventListener('change', scheduleMeasure);
            navigation.current = null;
            delete root.dataset.presentation;
            layout.clear();
            motion.clear();
            setProjectFocus(false);
        };
    }, [ref, progress, dragging, count, language, lenis]);

    const navigatePresentation = useCallback((index: number) => navigation.current?.(index) || false, []);
    return { presenting, navigatePresentation };
}
