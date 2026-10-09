import { useLayoutEffect, type RefObject } from 'react';

/** Native sticky geometry, measured without reading animated bounding boxes. */
export function useHeroHandoff(ref: RefObject<HTMLElement | null>) {
    useLayoutEffect(() => {
        const root = ref.current;
        if (!root) return;
        const copy = root.querySelector<HTMLElement>('.hero-copy-motion')!;
        const terminal = root.querySelector<HTMLElement>('.hero-terminal-sticky')!;
        const intro = root.querySelector<HTMLElement>('.hero-intro-motion')!;
        const media = matchMedia('(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)');
        let frame = 0;
        let start = 0;
        let distance = 1;
        let enabled = false;
        let disposed = false;

        const paint = () => {
            frame = 0;
            if (disposed) return;
            const progress = enabled ? Math.min(1, Math.max(0, (window.scrollY - start) / distance)) : 0;
            const copyExit = enabled ? Math.min(1, Math.max(0, (progress - .12) / .5)) : 0;
            const aboutEnter = enabled ? Math.min(1, Math.max(0, (progress - .22) / .66)) : 1;
            // A brief push-in precedes the retreat into the About composition.
            // These values still follow the actual scroll, without easing lag.
            const terminalScale = progress < .25
                ? 1 + .08 * progress / .25
                : 1.08 - .24 * (progress - .25) / .75;
            root.style.setProperty('--handoff', String(progress));
            root.style.setProperty('--hero-exit', String(copyExit));
            root.style.setProperty('--about-enter', String(aboutEnter));
            root.style.setProperty('--terminal-scale', String(terminalScale));
            // The exiting CTAs must not remain invisible keyboard targets.
            copy.inert = copyExit >= .85;
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(paint);
        };
        const measure = () => {
            if (disposed) return;
            cancelAnimationFrame(frame);
            // The existing site uses CSS zoom. offsetHeight is unzoomed, rects
            // and scrollY are viewport pixels; keep those units distinct.
            const zoom = root.getBoundingClientRect().width / root.offsetWidth || 1;
            const viewport = innerHeight / zoom;
            const header = 88;
            enabled = media.matches && Math.max(copy.offsetHeight, terminal.offsetHeight * 1.08, intro.offsetHeight) + header + 48 < viewport;
            root.dataset.connected = String(enabled);
            root.style.setProperty('--story-viewport', `${viewport}px`);
            const stickyTop = Math.max(header, (viewport - terminal.offsetHeight) / 2);
            root.style.setProperty('--terminal-top', `${stickyTop}px`);
            root.style.setProperty('--copy-top', `${Math.max(header, (viewport - copy.offsetHeight) / 2)}px`);
            start = root.getBoundingClientRect().top + window.scrollY;
            // The column releases as its bottom reaches the sticky terminal's
            // bottom: column height - terminal height - header/centering inset.
            distance = Math.max(1, (root.offsetHeight - terminal.offsetHeight - stickyTop) * zoom);
            paint();
        };
        const observer = new ResizeObserver(measure);
        [root, copy, terminal, intro].forEach(node => observer.observe(node));
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
            root.style.removeProperty('--handoff');
            root.style.removeProperty('--hero-exit');
            root.style.removeProperty('--about-enter');
            root.style.removeProperty('--terminal-scale');
            root.style.removeProperty('--story-viewport');
            root.style.removeProperty('--terminal-top');
            root.style.removeProperty('--copy-top');
            copy.inert = false;
        };
    }, [ref]);
}
