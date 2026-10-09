import { useLayoutEffect, type RefObject } from 'react';

const phase = (value: number, from: number, to: number) => Math.min(1, Math.max(0, (value - from) / (to - from)));
const smooth = (value: number) => value * value * (3 - 2 * value);
const mix = (from: number, to: number, value: number) => from + (to - from) * value;

/** One bounded composition: introduction, profile, then the complete dashboard.
 * Only the terminal's isolated body changes height; the scene's layout markers
 * remain stationary. No wheel interception, cloned controls or delayed scrub.
 */
export function useHeroHandoff(ref: RefObject<HTMLElement | null>) {
    useLayoutEffect(() => {
        const root = ref.current;
        if (!root) return;
        const frame = root.querySelector<HTMLElement>('.hero-story-layout')!;
        const copy = root.querySelector<HTMLElement>('.hero-copy-motion')!;
        const profile = root.querySelector<HTMLElement>('.hero-intro-motion')!;
        const credentials = root.querySelector<HTMLElement>('.hero-credentials')!;
        const metrics = root.querySelector<HTMLElement>('.hero-metrics')!;
        const anchor = root.querySelector<HTMLElement>('.hero-about-anchor')!;
        const media = matchMedia('(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)');
        let enabled = false;
        let raf = 0;
        let disposed = false;
        let start = 0;
        let distance = 1;
        let width = 1;
        let homeTop = 0;
        let profileTop = 0;
        let finalTop = 0;
        let collapsedHeight = 340;
        const expandedHeight = 540;
        const written = new Set<string>();
        const set = (name: string, value: number, unit = '') => {
            const key = `--${name}`;
            written.add(key);
            root.style.setProperty(key, `${value}${unit}`);
        };

        const paint = () => {
            raf = 0;
            if (disposed) return;
            const progress = enabled ? phase(scrollY, start, start + distance) : 0;
            const travel = smooth(phase(progress, .06, .48));
            const exit = smooth(phase(progress, .08, .34));
            const reveal = phase(progress, .4, .64);
            const assemble = smooth(phase(progress, .66, .92));
            set('scene-progress', progress);
            set('hero-exit', exit);
            set('profile-reveal', enabled ? reveal : 1);
            set('credentials-reveal', enabled ? phase(progress, .79, .94) : 1);
            set('metrics-reveal', enabled ? phase(progress, .9, 1) : 1);
            set('terminal-x', width * .54 * (1 - travel), 'px');
            set('terminal-y', mix(homeTop, finalTop, assemble), 'px');
            set('terminal-scale', 1 + .12 * Math.sin(Math.PI * travel));
            set('terminal-tilt', -8 * Math.sin(Math.PI * travel), 'deg');
            set('terminal-height', mix(expandedHeight, collapsedHeight, assemble), 'px');
            set('credentials-y', mix(homeTop, finalTop, assemble) + mix(expandedHeight, collapsedHeight, assemble) + 24, 'px');
            set('profile-y', mix(profileTop, finalTop, assemble), 'px');
            copy.inert = enabled && exit > .85;
            profile.inert = enabled && reveal < .98;
            credentials.inert = enabled && progress < .94;
            metrics.inert = enabled && progress < .99;
        };
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(paint);
        };
        const measure = () => {
            if (disposed) return;
            cancelAnimationFrame(raf);
            const rect = root.getBoundingClientRect();
            const zoom = rect.width / root.offsetWidth || 1;
            const viewport = innerHeight / zoom;
            // Measure the candidate desktop composition before deciding whether
            // all real content fits. Fallbacks preserve type size and reading order.
            root.dataset.connected = String(media.matches);
            set('scene-height', viewport, 'px');
            width = frame.offsetWidth;
            const profileHeight = profile.offsetHeight;
            const credentialsHeight = credentials.offsetHeight;
            const metricsHeight = metrics.offsetHeight;
            collapsedHeight = Math.min(350, viewport - 192 - metricsHeight - 40 - credentialsHeight - 24);
            const finalHeight = Math.max(profileHeight, collapsedHeight + 24 + credentialsHeight) + 40 + metricsHeight;
            enabled = media.matches && collapsedHeight >= 260 && finalHeight + 192 <= viewport
                && Math.max(copy.offsetHeight, expandedHeight * 1.12) + 192 <= viewport;
            root.dataset.connected = String(enabled);
            homeTop = Math.max(96, (viewport - expandedHeight) / 2);
            profileTop = Math.max(96, (viewport - profileHeight) / 2);
            finalTop = Math.max(96, (viewport - finalHeight) / 2);
            const run = viewport * 1.65;
            set('scene-run', enabled ? run : 0, 'px');
            set('copy-y', Math.max(96, (viewport - copy.offsetHeight) / 2), 'px');
            set('credentials-y', finalTop + collapsedHeight + 24, 'px');
            set('metrics-y', finalTop + finalHeight - metricsHeight, 'px');
            start = rect.top + scrollY;
            distance = run * zoom;
            const anchorTop = enabled ? run : (profile.getBoundingClientRect().top - root.getBoundingClientRect().top) / zoom - 100;
            anchor.style.top = `${Math.max(0, anchorTop)}px`;
            anchor.dataset.navAt = String(enabled ? start + distance * .4 : start + anchorTop * zoom - innerHeight * .3);
            paint();
        };
        const observer = new ResizeObserver(measure);
        // The terminal body deliberately changes height inside an absolute layer.
        // Observe only intrinsic reading content and stationary scene boundaries.
        [frame, copy, profile, credentials, metrics].forEach(node => observer.observe(node));
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', measure);
        media.addEventListener('change', measure);
        document.fonts.ready.then(measure);
        measure();
        return () => {
            disposed = true;
            cancelAnimationFrame(raf);
            observer.disconnect();
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', measure);
            media.removeEventListener('change', measure);
            written.forEach(name => root.style.removeProperty(name));
            delete root.dataset.connected;
            anchor.style.removeProperty('top');
            delete anchor.dataset.navAt;
            [copy, profile, credentials, metrics].forEach(node => { node.inert = false; });
        };
    }, [ref]);
}
