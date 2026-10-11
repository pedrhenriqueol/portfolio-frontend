import { useLayoutEffect, useRef, type RefObject } from 'react';
import { useLenis } from '../components/providers/SmoothScrollProvider';
import { createSceneStyles, setSceneInert } from '../utils/sceneStyles';

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const phase = (value: number, from: number, to: number) => clamp((value - from) / (to - from));
const smooth = (value: number) => value * value * (3 - 2 * value);
const px = (value: number) => `${value.toFixed(3)}px`;

/** The final featured stop hands its real frame to one native catalogue.
 * The source wrapper has no properties owned by the gallery/presentation hook;
 * the target layer excludes the fixed inspector and Contact's outgoing wrapper. */
export function useProjectCollectionHandoff(ref: RefObject<HTMLElement | null>, language: string, count: number) {
    const lenis = useLenis();
    const focusSnapshot = useRef<{ node: HTMLElement; top: number } | null>(null);

    useLayoutEffect(() => {
        const root = ref.current;
        if (!root) return;
        const track = root.querySelector<HTMLElement>('.project-collection-track')!;
        const arrival = root.querySelector<HTMLElement>('.project-collection-arrival')!;
        const header = root.querySelector<HTMLElement>('.corporate-arrival-header')!;
        const anchor = root.querySelector<HTMLElement>('.project-collection-anchor')!;
        const main = root.closest('main');
        const projectsRoot = root.closest('#projetos');
        const media = matchMedia('(min-width: 1024px) and (min-height: 700px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
        const layout = createSceneStyles();
        const motion = createSceneStyles();
        let sourceRoot: HTMLElement | null = null;
        let source: HTMLElement | null = null;
        let sourceFrame: HTMLElement | null = null;
        let divider: HTMLElement | null = null;
        let enabled = false;
        let start = 0;
        let distance = 1;
        let width = 1;
        let viewport = 1;
        let scrollPosition = window.scrollY;
        let lastProgress = NaN;
        let frame = 0;
        let measureFrame = 0;
        let disposed = false;

        const restoreInteraction = () => {
            if (source) setSceneInert(source, false);
            setSceneInert(arrival, false);
        };
        const paint = () => {
            frame = 0;
            if (disposed || !enabled || !source) return;
            const progress = clamp((scrollPosition - start) / distance);
            const retire = smooth(phase(progress, .015, .30));
            const appear = smooth(phase(progress, .14, .42));
            const enter = smooth(phase(progress, 0, .75));
            // A disappearing collection retires focus to its stationary section,
            // without moving the document or trapping keyboard navigation.
            if (retire > .86 && source.contains(document.activeElement)) sourceRoot?.focus({ preventScroll: true });
            if (appear < .98 && arrival.contains(document.activeElement)) root.focus({ preventScroll: true });
            setSceneInert(source, retire > .86);
            setSceneInert(arrival, appear < .98);
            if (progress === lastProgress) return;
            lastProgress = progress;
            root.dataset.collectionProgress = progress.toFixed(4);
            motion.set(source, 'opacity', (1 - retire).toFixed(5));
            motion.set(source, 'transform', retire === 0 ? 'none' : `perspective(1400px) translate3d(${px(-width * .32 * retire)}, ${px(-viewport * .025 * retire)}, 0) rotateY(${(-6 * retire).toFixed(4)}deg) scale(${(1 - .23 * retire).toFixed(5)})`);
            motion.set(arrival, 'opacity', appear.toFixed(5));
            motion.set(arrival, 'transform', enter === 1 ? 'none' : `perspective(1400px) translate3d(${px(width * .52 * (1 - enter))}, ${px(viewport * .1 * (1 - enter))}, 0) rotateY(${(10 * (1 - enter)).toFixed(4)}deg) scale(${(.86 + .14 * enter).toFixed(5)})`);
        };
        const schedulePaint = () => { if (!disposed && !frame) frame = requestAnimationFrame(paint); };
        const scheduleMeasure = () => { if (!disposed && !measureFrame) measureFrame = requestAnimationFrame(measure); };
        const sourceAttributes = new MutationObserver(scheduleMeasure);
        const observer = new ResizeObserver(scheduleMeasure);

        const preserveFocus = (active: HTMLElement | null, previousTop: number | null) => {
            if (!active || previousTop === null || !active.isConnected) return;
            const delta = active.getBoundingClientRect().top - previousTop;
            const target = enabled ? Math.max(start + distance * .75, window.scrollY + delta) : window.scrollY + delta;
            if (Math.abs(target - window.scrollY) > 1) window.scrollTo({ top: target, behavior: 'instant' });
            const rect = active.getBoundingClientRect();
            if (rect.top < 80 || rect.bottom > innerHeight - 24) active.scrollIntoView({ block: 'center', behavior: 'instant' });
            scrollPosition = window.scrollY;
            if (enabled) paint();
        };

        const measure = () => {
            measureFrame = 0;
            if (disposed) return;
            // Either lazy collection may mount first. Requery and subscribe to
            // the featured scene when it becomes available or changes its fit.
            const nextRoot = projectsRoot?.querySelector<HTMLElement>('.project-focus-track') || null;
            if (nextRoot !== sourceRoot) {
                if (sourceRoot) {
                    observer.unobserve(sourceRoot);
                    sourceRoot.removeEventListener('focusin', schedulePaint);
                    sourceRoot.removeEventListener('focusout', schedulePaint);
                }
                sourceAttributes.disconnect();
                sourceRoot = nextRoot;
                if (sourceRoot) {
                    observer.observe(sourceRoot);
                    sourceAttributes.observe(sourceRoot, { attributes: true, attributeFilter: ['data-presentation'] });
                    sourceRoot.addEventListener('focusin', schedulePaint);
                    sourceRoot.addEventListener('focusout', schedulePaint);
                }
            }
            source = sourceRoot?.querySelector<HTMLElement>('.project-collection-source') || null;
            sourceFrame = sourceRoot?.querySelector<HTMLElement>('.project-focus-frame') || null;
            divider = projectsRoot?.querySelector<HTMLElement>('.project-collection-divider') || null;
            const rect = root.getBoundingClientRect();
            const zoom = rect.width / root.offsetWidth || 1;
            viewport = innerHeight / zoom;
            width = arrival.offsetWidth;
            const next = media.matches && count > 0 && !!source && !!sourceFrame
                && sourceRoot?.dataset.presentation === 'true'
                && header.offsetHeight + 100 + 80 < viewport;
            const active = document.activeElement instanceof HTMLElement && arrival.contains(document.activeElement)
                ? document.activeElement : null;
            const previousFocusTop = active && focusSnapshot.current?.node === active ? focusSnapshot.current.top
                : active ? active.getBoundingClientRect().top : null;
            focusSnapshot.current = null;
            if (!next) {
                enabled = false;
                root.dataset.collectionConnected = 'false';
                delete root.dataset.collectionProgress;
                delete anchor.dataset.navAt;
                motion.clear();
                layout.clear();
                restoreInteraction();
                preserveFocus(active, previousFocusTop);
                return;
            }
            enabled = true;
            root.dataset.collectionConnected = 'true';
            const sourceZoom = sourceRoot!.getBoundingClientRect().width / sourceRoot!.offsetWidth || zoom;
            const inset = parseFloat(getComputedStyle(sourceFrame!).top) || 100;
            const sourceTop = sourceRoot!.getBoundingClientRect().top + window.scrollY;
            const sourceRun = Math.max(0, sourceRoot!.offsetHeight - sourceFrame!.offsetHeight) * sourceZoom;
            // Preserve the last featured reading stop: current three-slide
            // release is start+2.4H, so this begins at start+2.15H.
            start = sourceTop - inset * sourceZoom + sourceRun - innerHeight * .25;
            distance = innerHeight * .7;
            layout.set(root, '--collection-inset', px(inset));
            layout.set(root, '--collection-run', px(distance / zoom));
            layout.set(root, '--collection-height', px(arrival.offsetHeight));
            // Add back only this scene's previous overlap to recover its native
            // position. Resize, language and table changes never accumulate it.
            const previousOverlap = parseFloat(root.style.getPropertyValue('--collection-overlap')) || 0;
            const nativeTrackTop = track.getBoundingClientRect().top + window.scrollY + previousOverlap * zoom;
            const desiredTrackTop = start + inset * zoom;
            layout.set(root, '--collection-overlap', px(Math.max(0, (nativeTrackTop - desiredTrackTop) / zoom)));
            layout.set(anchor, 'top', px(distance / zoom));
            layout.set(anchor, 'scroll-margin-top', px(inset));
            anchor.dataset.navAt = String(start + distance * .7);
            if (divider) layout.set(divider, 'visibility', 'hidden');
            scrollPosition = window.scrollY;
            // Restoring the desktop pin can add the featured run above a
            // focused catalogue. Settle this frame before paint retires focus
            // based on the document position from the former native layout.
            if (active && scrollPosition < start + distance * .75) {
                window.scrollTo({ top: start + distance, behavior: 'instant' });
                scrollPosition = window.scrollY;
            }
            lastProgress = NaN;
            paint();
            preserveFocus(active, previousFocusTop);
        };
        const onNative = () => { scrollPosition = window.scrollY; schedulePaint(); };
        const onLenis = (instance: { scroll: number }) => { scrollPosition = instance.scroll; schedulePaint(); };
        observer.observe(arrival);
        if (main) observer.observe(main);
        if (lenis) lenis.on('scroll', onLenis);
        else window.addEventListener('scroll', onNative, { passive: true });
        root.addEventListener('focusin', schedulePaint);
        root.addEventListener('focusout', schedulePaint);
        window.addEventListener('resize', scheduleMeasure);
        media.addEventListener('change', scheduleMeasure);
        document.fonts.ready.then(scheduleMeasure);
        measure();

        return () => {
            const active = document.activeElement;
            if (active instanceof HTMLElement && arrival.contains(active)) {
                focusSnapshot.current = { node: active, top: active.getBoundingClientRect().top };
            }
            disposed = true;
            cancelAnimationFrame(frame);
            cancelAnimationFrame(measureFrame);
            observer.disconnect();
            sourceAttributes.disconnect();
            sourceRoot?.removeEventListener('focusin', schedulePaint);
            sourceRoot?.removeEventListener('focusout', schedulePaint);
            if (lenis) lenis.off('scroll', onLenis);
            else window.removeEventListener('scroll', onNative);
            root.removeEventListener('focusin', schedulePaint);
            root.removeEventListener('focusout', schedulePaint);
            window.removeEventListener('resize', scheduleMeasure);
            media.removeEventListener('change', scheduleMeasure);
            motion.clear();
            layout.clear();
            restoreInteraction();
            delete root.dataset.collectionConnected;
            delete root.dataset.collectionProgress;
            delete anchor.dataset.navAt;
        };
    }, [ref, language, count, lenis]);
}
