import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import type { MotionValue } from 'framer-motion';
import { useLenis } from '../components/providers/SmoothScrollProvider';
import { setProjectFocus } from '../context/ProjectFocusContext';
import { createSceneStyles, setSceneInert } from '../utils/sceneStyles';

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => n * n * (3 - 2 * n);

/**
 * Sticky Focus Presentation Engine for the Career Journey section.
 * Uses the exact same compositor-only architecture as `useProjectPresentation`:
 * 1. Smoothly recedes the 3 Pillar cards from "Sobre Mim" in 3D depth (zero black void).
 * 2. Pins the Career Focus Stage (`position: sticky`) and drives the 3 milestones
 *    (2026 -> 2025 -> 2024) continuously via native vertical scroll.
 */
export function useCareerPresentation(
    ref: RefObject<HTMLElement | null>,
    progress: MotionValue<number>,
    dragging: RefObject<boolean>,
    count: number,
    language: string,
) {
    const lenis = useLenis();
    const [presenting, setPresenting] = useState(false);
    const navigation = useRef<((index: number) => boolean) | null>(null);

    useLayoutEffect(() => {
        const root = ref.current;
        if (!root) return;
        const content = root.querySelector<HTMLElement>('.career-focus-layout');
        const gallery = root.querySelector<HTMLElement>('.career-focus-gallery');
        if (!content || !gallery) return;

        const wrapper = root.closest('.career-scene-wrapper') || root.parentElement;
        const pillarsTail = wrapper?.querySelector<HTMLElement>('.career-pillars-bridge .chapter-tail') || null;
        const pillarCards = pillarsTail
            ? Array.from(pillarsTail.children).filter((el): el is HTMLElement => el instanceof HTMLElement)
            : [];

        const media = matchMedia(
            '(min-width: 1024px) and (min-height: 680px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
        );
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
        let scrollPosition = lenis ? lenis.scroll : window.scrollY;
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
            setProjectFocus(focused, 'career');

            const visible = content.contains(document.activeElement) ? 1 : reveal;
            motion.set(content, 'opacity', String(0.5 + visible * 0.5));
            motion.set(gallery, 'transform', `translate3d(0, ${(1 - visible) * 28}px, 0) scale(${(0.98 + visible * 0.02).toFixed(4)})`);

            if (pillarsTail) {
                const outgoingWindow = innerHeight * 0.62;
                const outgoing = ease(clamp((scrollPosition - start + outgoingWindow) / outgoingWindow));
                const pillarsFocused = pillarsTail.contains(document.activeElement);

                if (pillarsFocused) {
                    motion.set(pillarsTail, 'opacity', '1');
                    motion.set(pillarsTail, 'transform', 'translate3d(0, 0, 0) scale(1)');
                    pillarCards.forEach((card) => {
                        motion.set(card, 'transform', 'translate3d(0, 0, 0) scale(1)');
                        motion.set(card, 'opacity', '1');
                    });
                    setSceneInert(pillarsTail, false);
                } else {
                    motion.set(pillarsTail, 'opacity', String((1 - outgoing * 0.92).toFixed(4)));
                    motion.set(
                        pillarsTail,
                        'transform',
                        `translate3d(0, ${(-outgoing * 24).toFixed(2)}px, 0) scale(${(1 - outgoing * 0.035).toFixed(4)})`
                    );
                    pillarCards.forEach((card, idx) => {
                        const lateralDir = idx === 0 ? -1 : idx === 2 ? 1 : 0;
                        const tx = lateralDir * outgoing * 22;
                        const ty = idx === 1 ? -outgoing * 18 : -outgoing * 8;
                        const sc = idx === 1 ? 1 - outgoing * 0.04 : 1 - outgoing * 0.025;
                        motion.set(
                            card,
                            'transform',
                            `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${sc.toFixed(4)})`
                        );
                    });
                    setSceneInert(pillarsTail, outgoing >= 0.95);
                }
            }

            if (dragging.current || manualNavigation) return;

            const travel = Math.max(0, Math.min(count - 1, (scrollPosition - start - lead) / step));
            const index = Math.floor(travel);
            // Brief readable stops followed by a continuous, reversible move (same curve as Featured Projects).
            const value = Math.min(count - 1, index + ease(clamp((travel - index - 0.2) / 0.7)));
            if (value !== lastProgress || value !== progress.get()) {
                lastProgress = value;
                progress.set(value);
            }
        };

        const schedulePaint = () => {
            if (!frame) frame = requestAnimationFrame(paint);
        };

        const measure = () => {
            measureFrame = 0;
            if (disposed) return;
            const zoom = root.getBoundingClientRect().width / root.offsetWidth || 1;
            const viewport = innerHeight / zoom;
            const height = viewport - 100;

            layout.set(root, '--career-card-height', `${Math.max(480, Math.min(640, viewport - 410))}px`);
            const contentHeight = content.offsetHeight;
            const next = media.matches && count > 1 && contentHeight + 24 < height;
            setPresenting(next);

            if (root.dataset.presentation !== String(next)) {
                root.dataset.presentation = String(next);
            }
            if (next !== enabled) {
                enabled = next;
                motion.clear();
                if (pillarsTail) setSceneInert(pillarsTail, false);
                if (!enabled) setProjectFocus(false, 'career');
            }

            layout.set(root, '--career-frame-height', `${height}px`);
            layout.set(root, '--career-stage-offset', `${Math.min(72, Math.max(12, (height - contentHeight) * 0.28))}px`);

            step = innerHeight * 0.9;
            lead = innerHeight * 0.22;
            run = step * (count - 1) + innerHeight * 0.58;
            layout.set(root, '--career-run', `${enabled ? run / zoom : 0}px`);

            start = root.getBoundingClientRect().top + window.scrollY - 100 * zoom;
            focusStart = start - innerHeight * 0.14;
            focusEnd = root.getBoundingClientRect().bottom + window.scrollY - innerHeight * 0.22;
            approach = innerHeight * 0.82;

            if (enabled) {
                root.dataset.navAt = String(start - innerHeight * 0.18);
            } else {
                delete root.dataset.navAt;
            }

            scrollPosition = lenis ? lenis.scroll : window.scrollY;
            lastProgress = NaN;
            paint();
        };

        const scheduleMeasure = () => {
            if (!disposed && !measureFrame) measureFrame = requestAnimationFrame(measure);
        };
        const onNative = () => {
            scrollPosition = window.scrollY;
            schedulePaint();
        };
        const onLenis = (instance: { scroll: number }) => {
            scrollPosition = instance.scroll;
            schedulePaint();
        };

        navigation.current = (index: number) => {
            if (!enabled) return false;
            const top = start + lead + step * (index + 0.1);
            const token = ++navigationToken;
            manualNavigation = true;
            progress.set(index);
            clearTimeout(navigationTimer);
            const finish = () => {
                if (disposed || token !== navigationToken) return;
                manualNavigation = false;
                lastProgress = NaN;
                scrollPosition = lenis ? lenis.scroll : window.scrollY;
                schedulePaint();
            };
            if (lenis && getComputedStyle(document.body).overflowY !== 'hidden') {
                lenis.scrollTo(top, { duration: 0.65, onComplete: finish });
            } else {
                window.scrollTo({ top, behavior: 'smooth' });
            }
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
        if (pillarsTail) observer.observe(pillarsTail);
        const main = root.closest('main');
        if (main) observer.observe(main);

        if (lenis) lenis.on('scroll', onLenis);
        else window.addEventListener('scroll', onNative, { passive: true });

        root.addEventListener('focusin', schedulePaint);
        if (pillarsTail) pillarsTail.addEventListener('focusin', schedulePaint);
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
            if (pillarsTail) {
                pillarsTail.removeEventListener('focusin', schedulePaint);
                setSceneInert(pillarsTail, false);
            }
            window.removeEventListener('resize', scheduleMeasure);
            window.removeEventListener('wheel', interruptNavigation);
            window.removeEventListener('pointerdown', interruptNavigation);
            window.removeEventListener('keydown', interruptNavigation);
            media.removeEventListener('change', scheduleMeasure);
            navigation.current = null;
            delete root.dataset.presentation;
            delete root.dataset.navAt;
            layout.clear();
            motion.clear();
            setProjectFocus(false, 'career');
        };
    }, [ref, progress, dragging, count, language, lenis]);

    const navigatePresentation = useCallback((index: number) => navigation.current?.(index) || false, []);
    return { presenting, navigatePresentation };
}
