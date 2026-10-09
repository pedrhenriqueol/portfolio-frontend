import { useLayoutEffect, type RefObject } from 'react';

/** Measure stationary markers; paint only raw scroll values on the corridor. */
export function useJourneyHandoff(ref: RefObject<HTMLElement | null>) {
    useLayoutEffect(() => {
        const root = ref.current;
        if (!root) return;
        const from = root.querySelector<HTMLElement>('[data-journey-from]')!;
        const slot = root.querySelector<HTMLElement>('[data-journey-guide-slot]')!;
        const heading = root.querySelector<HTMLElement>('.journey-heading-motion')!;
        const tail = root.querySelector<HTMLElement>('#about-details .chapter-tail')!;
        const guide = root.querySelector<HTMLElement>('.journey-guide-sticky')!;
        const media = matchMedia('(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)');
        let frame = 0;
        let start = 0;
        let distance = 1;
        let enabled = false;
        let disposed = false;

        const paint = () => {
            frame = 0;
            if (disposed) return;
            const progress = enabled ? Math.min(1, Math.max(0, (scrollY - start) / distance)) : 1;
            root.style.setProperty('--journey-progress', String(progress));
            root.style.setProperty('--guide-travel', String(Math.min(1, progress / .65)));
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(paint);
        };
        const measure = () => {
            if (disposed) return;
            cancelAnimationFrame(frame);
            const rect = root.getBoundingClientRect();
            const zoom = rect.width / root.offsetWidth || 1;
            const viewport = innerHeight / zoom;
            enabled = media.matches && tail.offsetHeight + heading.offsetHeight + 160 < viewport;
            root.dataset.connected = String(enabled);
            root.style.setProperty('--journey-viewport', `${viewport}px`);
            // The slot and marker never transform, including in the fallback.
            const slotRect = slot.getBoundingClientRect();
            const fromTop = (from.getBoundingClientRect().top - rect.top) / zoom;
            const slotTop = (slotRect.top - rect.top) / zoom;
            const railTop = enabled ? fromTop + 24 : slotTop;
            const railEnd = slotTop + slot.offsetHeight;
            const inset = Math.max(112, viewport * .34);
            root.style.setProperty('--guide-left', `${(slotRect.left - rect.left) / zoom + slot.offsetWidth / 2 - guide.offsetWidth / 2}px`);
            root.style.setProperty('--guide-drift', `${root.offsetWidth / 2 - ((slotRect.left - rect.left) / zoom + slot.offsetWidth / 2)}px`);
            root.style.setProperty('--guide-start', `${railTop}px`);
            root.style.setProperty('--guide-height', `${Math.max(guide.offsetHeight, railEnd - railTop)}px`);
            root.style.setProperty('--guide-inset', `${inset}px`);
            // Enter with the last cards still visible. Native capture starts
            // at railTop-inset; release occurs at railEnd-guideHeight-inset.
            const rootTop = rect.top + scrollY;
            start = rootTop + railTop * zoom - innerHeight * .84;
            const end = rootTop + (railEnd - guide.offsetHeight - inset) * zoom;
            distance = Math.max(1, end - start);
            paint();
        };

        const observer = new ResizeObserver(measure);
        [root, slot, heading, tail, guide].forEach(node => observer.observe(node));
        if (root.closest('main')) observer.observe(root.closest('main')!);
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', measure);
        media.addEventListener('change', measure);
        document.fonts.ready.then(measure);
        measure();
        return () => {
            disposed = true;
            cancelAnimationFrame(frame);
            observer.disconnect();
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', measure);
            media.removeEventListener('change', measure);
            delete root.dataset.connected;
            ['--journey-progress', '--guide-travel', '--journey-viewport', '--guide-left', '--guide-drift', '--guide-start', '--guide-height', '--guide-inset'].forEach(name => root.style.removeProperty(name));
        };
    }, [ref]);
}
