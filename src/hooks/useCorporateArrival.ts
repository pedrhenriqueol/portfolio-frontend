import { useLayoutEffect, type RefObject } from 'react';
import { useLenis } from '../components/providers/SmoothScrollProvider';
import { createSceneStyles } from '../utils/sceneStyles';

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => value * value * (3 - 2 * value);

// Native coordinates stay stable if the following scene moves the outer
// content wrapper during departure. Only the section itself supplies a rect.
function nativeTop(node: HTMLElement, root: HTMLElement) {
    let top = 0;
    let current: HTMLElement | null = node;
    while (current && current !== root) {
        top += current.offsetTop;
        const parent = current.offsetParent as HTMLElement | null;
        if (parent) top += parent.clientTop;
        current = parent;
    }
    return top;
}

/** A brief native arrival opens the catalogue; its body never pins or clips. */
export function useCorporateArrival(ref: RefObject<HTMLElement | null>, language: string, count: number) {
    const lenis = useLenis();

    useLayoutEffect(() => {
        const root = ref.current;
        if (!root) return;
        const header = root.querySelector<HTMLElement>('.corporate-arrival-header')!;
        const copy = root.querySelector<HTMLElement>('.corporate-arrival-copy')!;
        const number = root.querySelector<HTMLElement>('.corporate-arrival-number')!;
        const rule = root.querySelector<HTMLElement>('.corporate-arrival-rule-active')!;
        const stem = root.querySelector<HTMLElement>('.corporate-arrival-stem')!;
        const marker = root.querySelector<HTMLElement>('.corporate-arrival-marker')!;
        const body = root.querySelector<HTMLElement>('.corporate-arrival-body')!;
        // Move each existing group's wrapper with its clipping region: moving
        // the segmented bar inside overflow-hidden would cut off its buttons.
        // These layers own no Motion transform or fixed descendants.
        const controls = [...body.querySelectorAll<HTMLElement>('.portfolio-segmented')]
            .slice(0, 2).map(node => node.parentElement!);
        const media = matchMedia('(min-width: 1024px) and (min-height: 640px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
        const styles = createSceneStyles();
        let enabled = false;
        let start = 0;
        let distance = 1;
        let scrollPosition = window.scrollY;
        let lastProgress = NaN;
        let frame = 0;
        let measureFrame = 0;
        let disposed = false;

        const paint = () => {
            frame = 0;
            if (disposed || !enabled) return;
            // Keyboard access takes precedence over decoration. Controls never
            // become invisible or inert, including while scrolling backwards.
            const progress = body.contains(document.activeElement) ? 1
                : clamp((scrollPosition - start) / distance);
            if (progress === lastProgress) return;
            lastProgress = progress;
            root.dataset.corporateProgress = progress.toFixed(4);
            const arrival = ease(progress);
            const opening = ease(clamp((progress - .18) / .72));
            const copyY = ((1 - arrival) * 20).toFixed(3);
            const controlsY = ((1 - opening) * 12).toFixed(3);
            styles.set(copy, 'opacity', (.75 + arrival * .25).toFixed(3));
            styles.set(copy, 'transform', `translateY(${copyY}px)`);
            styles.set(number, 'opacity', (.45 + arrival * .55).toFixed(3));
            styles.set(number, 'transform', `translateY(${((1 - arrival) * 24).toFixed(3)}px)`);
            styles.set(rule, 'transform', `scaleX(${(.12 + arrival * .88).toFixed(4)})`);
            styles.set(stem, 'transform', `scaleY(${opening.toFixed(4)})`);
            styles.set(marker, 'transform', `translateY(${(opening * 18).toFixed(3)}px)`);
            styles.set(marker, 'opacity', (.3 + opening * .7).toFixed(3));
            controls.forEach(control => {
                styles.set(control, 'opacity', (.65 + opening * .35).toFixed(3));
                styles.set(control, 'transform', `translateY(${controlsY}px)`);
            });
        };
        const measure = () => {
            measureFrame = 0;
            if (disposed) return;
            const rect = root.getBoundingClientRect();
            const zoom = rect.width / root.offsetWidth || 1;
            const next = media.matches && header.offsetHeight * zoom < innerHeight * .6;
            if (next !== enabled) {
                enabled = next;
                styles.clear();
            }
            root.dataset.corporateArrival = String(enabled);
            // Finish while the title remains in the upper half of the viewport,
            // ahead of its filters. No extra travel is added to the document.
            start = rect.top + window.scrollY + nativeTop(header, root) * zoom - innerHeight * .78;
            distance = Math.max(1, innerHeight * .38);
            scrollPosition = window.scrollY;
            lastProgress = NaN;
            if (enabled) paint();
            else delete root.dataset.corporateProgress;
        };
        const schedulePaint = () => { if (!disposed && !frame) frame = requestAnimationFrame(paint); };
        const scheduleMeasure = () => { if (!disposed && !measureFrame) measureFrame = requestAnimationFrame(measure); };
        const onNative = () => { scrollPosition = window.scrollY; schedulePaint(); };
        const onLenis = (instance: { scroll: number }) => { scrollPosition = instance.scroll; schedulePaint(); };
        const observer = new ResizeObserver(scheduleMeasure);
        observer.observe(header);
        const main = root.closest('main');
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
            disposed = true;
            cancelAnimationFrame(frame);
            cancelAnimationFrame(measureFrame);
            observer.disconnect();
            if (lenis) lenis.off('scroll', onLenis);
            else window.removeEventListener('scroll', onNative);
            root.removeEventListener('focusin', schedulePaint);
            root.removeEventListener('focusout', schedulePaint);
            window.removeEventListener('resize', scheduleMeasure);
            media.removeEventListener('change', scheduleMeasure);
            styles.clear();
            delete root.dataset.corporateArrival;
            delete root.dataset.corporateProgress;
        };
    }, [ref, language, count, lenis]);
}
