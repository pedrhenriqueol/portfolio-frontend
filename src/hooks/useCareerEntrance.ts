import { useLayoutEffect, type RefObject } from 'react';

/** Coordinates one bounded native sticky scene, with stable native hash links. */
export function useCareerEntrance(ref: RefObject<HTMLElement | null>, onProgress: (progress: number) => void) {
    useLayoutEffect(() => {
        const root = ref.current;
        if (!root) return;
        const frame = root.querySelector<HTMLElement>('.career-entrance-frame')!;
        const pillars = root.querySelector<HTMLElement>('.career-pillars-layout')!;
        const incoming = root.querySelector<HTMLElement>('.career-incoming-layout')!;
        const heading = root.querySelector<HTMLElement>('.career-heading')!;
        const summary = root.querySelector<HTMLElement>('.career-summary')!;
        const first = root.querySelector<HTMLElement>('[data-career-first-layout]')!;
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
        let threadStart = 0;
        let threadTop = 0;
        let threadCenter = 0;
        let pending = 0;
        let disposed = false;

        const layoutTop = (node: HTMLElement) => {
            let top = 0;
            for (let current: HTMLElement | null = node; current && current !== frame; current = current.offsetParent as HTMLElement | null) top += current.offsetTop;
            return top;
        };
        const paint = () => {
            pending = 0;
            if (disposed) return;
            const progress = enabled ? Math.min(1, Math.max(0, (scrollY - start) / distance)) : 1;
            const outgoing = enabled ? Math.min(1, Math.max(0, (progress - .12) / .30)) : 0;
            const entering = enabled ? Math.min(1, Math.max(0, (progress - .42) / .28)) : 1;
            const headerEnter = enabled ? Math.min(1, Math.max(0, (progress - .18) / .25)) : 1;
            const middleExit = enabled ? Math.min(1, progress / .18) : 0;
            const spread = enabled ? Math.min(1, progress / .32) : 0;
            root.style.setProperty('--career-progress', String(progress));
            root.style.setProperty('--career-outgoing', String(outgoing));
            root.style.setProperty('--career-entering', String(entering));
            root.style.setProperty('--career-header-enter', String(headerEnter));
            root.style.setProperty('--career-middle-exit', String(middleExit));
            root.style.setProperty('--career-spread', String(spread));
            // Layer transforms remain decorative; hidden controls never become
            // invisible Tab targets. Hash navigation lands on the final frame.
            pillars.inert = enabled && outgoing >= .94;
            if (middlePillar) middlePillar.inert = enabled && middleExit >= .94;
            incoming.inert = false;
            heading.inert = enabled && headerEnter < .98;
            summary.inert = enabled && entering < .98;
            first.inert = enabled && entering < .98;
            if (enabled) {
                const half = width / 2;
                // The axis is vertical before the milestone becomes visible,
                // so the connecting line never crosses its year or text.
                const turn = Math.min(1, progress / .42);
                const startX = 24 + (half - 24) * turn;
                const endX = width - 24 + (half - width + 24) * turn;
                const startY = threadStart + (threadTop - threadStart) * turn;
                const middleY = threadStart + (threadCenter - threadStart) * turn;
                const endY = threadStart + (height - threadStart) * turn;
                const path = `M ${startX} ${startY} Q ${half} ${middleY} ${endX} ${endY}`;
                base.setAttribute('d', path);
                active.setAttribute('d', path);
                active.style.strokeDashoffset = String(1 - turn);
            }
            onProgress(progress);
        };
        const measure = () => {
            if (disposed) return;
            cancelAnimationFrame(pending);
            const zoom = root.getBoundingClientRect().width / root.offsetWidth || 1;
            const viewport = innerHeight / zoom;
            const inset = Math.max(100, viewport * .09);
            const contentHeight = incoming.offsetHeight;
            height = Math.max(contentHeight, pillars.offsetHeight);
            width = frame.offsetWidth;
            // The laterals must leave the heading's column without leaving
            // the viewport. A cramped desktop keeps its readable native flow.
            const lateralRoom = (innerWidth / zoom - width) / 2 - 24;
            enabled = media.matches && height + inset + 48 < viewport && lateralRoom >= width * .24;
            root.dataset.scene = enabled ? 'connected' : 'flow';
            const travel = enabled ? viewport * .62 : 0;
            root.style.setProperty('--career-frame-height', `${height}px`);
            root.style.setProperty('--career-travel', `${travel}px`);
            root.style.setProperty('--career-inset', `${inset}px`);
            root.style.setProperty('--career-spread-distance', `${width * .24}px`);
            // A stationary sibling represents the scroll position at which the
            // incoming composition is complete. It never inherits transforms.
            anchor.style.top = `${enabled ? travel : incoming.offsetTop}px`;
            anchor.style.scrollMarginTop = `${enabled ? inset : 100}px`;
            const rootTop = root.getBoundingClientRect().top + scrollY;
            start = rootTop - inset * zoom;
            distance = Math.max(1, travel * zoom);
            if (enabled) {
                threadStart = Math.min(height - 8, pillars.offsetHeight + 20);
                threadTop = layoutTop(first);
                threadCenter = threadTop + first.offsetHeight / 2;
                svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
            }
            paint();
        };
        const onScroll = () => { if (!pending) pending = requestAnimationFrame(paint); };
        const observer = new ResizeObserver(measure);
        [root, frame, incoming, pillars, first].forEach(node => observer.observe(node));
        const main = root.closest('main');
        if (main) observer.observe(main);
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', measure);
        media.addEventListener('change', measure);
        document.fonts.ready.then(measure);
        measure();
        return () => {
            disposed = true;
            cancelAnimationFrame(pending);
            observer.disconnect();
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', measure);
            media.removeEventListener('change', measure);
            delete root.dataset.scene;
            pillars.inert = false;
            incoming.inert = false;
            heading.inert = false;
            summary.inert = false;
            first.inert = false;
            if (middlePillar) middlePillar.inert = false;
            anchor.style.removeProperty('top');
            anchor.style.removeProperty('scroll-margin-top');
            ['--career-frame-height', '--career-travel', '--career-inset', '--career-progress', '--career-outgoing', '--career-entering', '--career-header-enter', '--career-middle-exit', '--career-spread', '--career-spread-distance'].forEach(name => root.style.removeProperty(name));
        };
    }, [ref, onProgress]);
}

/** The continuing tracker follows the reading line in viewport pixels, even
 * with the site's CSS zoom. Milestone positions come from their real layout. */
export function useCareerRemainder(ref: RefObject<HTMLElement | null>, enabled: boolean, onProgress: (progress: number, station2025: number, station2024: number) => void) {
    useLayoutEffect(() => {
        const root = ref.current;
        if (!root || !enabled) return;
        const rows = ['2025', '2024'].map(year => root.querySelector<HTMLElement>(`[data-career-year="${year}"]`)!);
        let start = 0;
        let distance = 1;
        let stations = [.25, .75];
        let frame = 0;
        let disposed = false;
        const paint = () => {
            frame = 0;
            if (!disposed) onProgress(Math.min(1, Math.max(0, (scrollY - start) / distance)), stations[0], stations[1]);
        };
        const measure = () => {
            if (disposed) return;
            cancelAnimationFrame(frame);
            const rect = root.getBoundingClientRect();
            const zoom = rect.width / root.offsetWidth || 1;
            const lineHeight = Math.max(1, root.offsetHeight - 16);
            start = rect.top + scrollY - innerHeight * .55;
            distance = lineHeight * zoom;
            stations = rows.map(row => {
                let top = 0;
                for (let node: HTMLElement | null = row; node && node !== root; node = node.offsetParent as HTMLElement | null) top += node.offsetTop;
                return Math.min(1, Math.max(0, (top + row.offsetHeight / 2) / lineHeight));
            });
            paint();
        };
        const scroll = () => { if (!frame) frame = requestAnimationFrame(paint); };
        const observer = new ResizeObserver(measure);
        [root, ...rows].forEach(node => observer.observe(node));
        const main = root.closest('main');
        if (main) observer.observe(main);
        window.addEventListener('scroll', scroll, { passive: true });
        window.addEventListener('resize', measure);
        document.fonts.ready.then(measure);
        measure();
        return () => {
            disposed = true;
            cancelAnimationFrame(frame);
            observer.disconnect();
            window.removeEventListener('scroll', scroll);
            window.removeEventListener('resize', measure);
        };
    }, [ref, enabled, onProgress]);
}
