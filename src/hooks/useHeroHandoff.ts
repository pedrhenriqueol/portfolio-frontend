import { useLayoutEffect, type RefObject } from 'react';
import { useLenis } from '../components/providers/SmoothScrollProvider';
import { createSceneStyles, setSceneInert } from '../utils/sceneStyles';

const phase = (value: number, from: number, to: number) => Math.min(1, Math.max(0, (value - from) / (to - from)));
const smooth = (value: number) => value * value * (3 - 2 * value);
const mix = (from: number, to: number, value: number) => from + (to - from) * value;
const px = (value: number) => `${value.toFixed(3)}px`;

/** One native sticky composition. Scroll writes only to the moving layers;
 * only the contained terminal body needs layout while its height folds. */
export function useHeroHandoff(ref: RefObject<HTMLElement | null>) {
    const lenis = useLenis();

    useLayoutEffect(() => {
        const root = ref.current;
        if (!root) return;
        const frame = root.querySelector<HTMLElement>('.hero-story-layout')!;
        const copy = root.querySelector<HTMLElement>('.hero-copy-motion')!;
        const terminal = root.querySelector<HTMLElement>('.hero-terminal-rail')!;
        const terminalBox = root.querySelector<HTMLElement>('#terminal')!;
        const profile = root.querySelector<HTMLElement>('.hero-intro-motion')!;
        const credentials = root.querySelector<HTMLElement>('.hero-credentials')!;
        const metrics = root.querySelector<HTMLElement>('.hero-metrics')!;
        const anchor = root.querySelector<HTMLElement>('.hero-about-anchor')!;
        const media = matchMedia('(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)');
        const layout = createSceneStyles();
        const motion = createSceneStyles();
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
        let scrollPosition = lenis ? lenis.scroll : window.scrollY;
        let lastProgress = NaN;
        const expandedHeight = 540;

        const paint = () => {
            raf = 0;
            if (disposed) return;
            const progress = enabled ? phase(scrollPosition, start, start + distance) : 0;
            if (progress === lastProgress) return;
            lastProgress = progress;
            root.dataset.sceneProgress = String(progress);
            if (!enabled) {
                motion.clear();
                [copy, profile, credentials, metrics].forEach(node => setSceneInert(node, false));
                return;
            }
            const travel = smooth(phase(progress, .04, .46));
            // The profile takes over while the name fades; the completed
            // dashboard keeps a comfortable reading interval before release.
            const exit = smooth(phase(progress, .06, .36));
            const reveal = smooth(phase(progress, .24, .62));
            const assemble = smooth(phase(progress, .54, .86));
            const terminalY = mix(homeTop, finalTop, assemble);
            const terminalHeight = mix(expandedHeight, collapsedHeight, assemble);
            const credentialsReveal = smooth(phase(progress, .66, .86));
            const metricsReveal = smooth(phase(progress, .74, .90));

            motion.set(copy, 'transform', `translate3d(${px(exit * -28)}, ${px(exit * -8)}, ${px(exit * -80)}) scale(${(1 - exit * .04).toFixed(4)})`);
            motion.set(copy, 'opacity', String(1 - exit));
            motion.set(terminal, 'transform', `translate3d(${px(width * .54 * (1 - travel))}, ${px(terminalY)}, 0) rotateY(${(-6.5 * Math.sin(Math.PI * travel)).toFixed(3)}deg) scale(${(1 + .085 * Math.sin(Math.PI * travel)).toFixed(5)})`);
            motion.set(terminalBox, '--terminal-height', px(terminalHeight));

            // Proposta B: Varredura progressiva com Feather Mask (borda de penumbra suave de cima para baixo)
            motion.set(profile, 'transform', `translate3d(${px((1 - reveal) * 28)}, ${px(mix(profileTop, finalTop, assemble) + (1 - reveal) * 14)}, 0)`);
            motion.set(profile, '--hero-reveal', reveal.toFixed(4));
            motion.set(profile, 'opacity', String(Math.min(1, reveal * 1.85)));

            motion.set(credentials, 'transform', `translate3d(0, ${px(terminalY + terminalHeight + 24 + (1 - credentialsReveal) * 18)}, 0)`);
            motion.set(credentials, '--credentials-reveal', credentialsReveal.toFixed(4));
            motion.set(credentials, 'opacity', String(credentialsReveal));

            motion.set(metrics, 'transform', `translate3d(0, ${px((1 - metricsReveal) * 18)}, 0)`);
            motion.set(metrics, 'opacity', String(metricsReveal));

            setSceneInert(copy, exit > .85);
            setSceneInert(profile, reveal < .98);
            setSceneInert(credentials, credentialsReveal < .98);
            setSceneInert(metrics, metricsReveal < .98);
        };
        const schedulePaint = () => { if (!raf) raf = requestAnimationFrame(paint); };
        const onNativeScroll = () => { scrollPosition = window.scrollY; schedulePaint(); };
        const onLenisScroll = (instance: { scroll: number }) => { scrollPosition = instance.scroll; schedulePaint(); };
        const measure = () => {
            if (disposed) return;
            cancelAnimationFrame(raf);
            raf = 0;
            const rect = root.getBoundingClientRect();
            const zoom = rect.width / root.offsetWidth || 1;
            const viewport = innerHeight / zoom;
            root.dataset.connected = String(media.matches);
            layout.set(root, '--scene-height', px(viewport));
            width = frame.offsetWidth;
            const profileHeight = profile.offsetHeight;
            const credentialsHeight = credentials.offsetHeight;
            const metricsHeight = metrics.offsetHeight;
            collapsedHeight = Math.min(350, viewport - 192 - metricsHeight - 40 - credentialsHeight - 24);
            const finalHeight = Math.max(profileHeight, collapsedHeight + 24 + credentialsHeight) + 40 + metricsHeight;
            enabled = media.matches && collapsedHeight >= 260 && finalHeight + 192 <= viewport
                && Math.max(copy.offsetHeight, expandedHeight * 1.12) + 192 <= viewport;
            root.dataset.connected = String(enabled);
            if (!enabled) motion.clear();
            homeTop = Math.max(96, (viewport - expandedHeight) / 2);
            profileTop = Math.max(96, (viewport - profileHeight) / 2);
            finalTop = Math.max(96, (viewport - finalHeight) / 2);
            const run = viewport * 1.65;
            layout.set(root, '--scene-run', px(enabled ? run : 0));
            layout.set(root, '--copy-y', px(Math.max(96, (viewport - copy.offsetHeight) / 2)));
            layout.set(root, '--metrics-y', px(finalTop + finalHeight - metricsHeight));
            scrollPosition = lenis ? lenis.scroll : window.scrollY;
            start = rect.top + window.scrollY;
            distance = run * zoom;
            const anchorTop = enabled ? run : (profile.getBoundingClientRect().top - root.getBoundingClientRect().top) / zoom - 100;
            layout.set(anchor, 'top', px(Math.max(0, anchorTop)));
            anchor.dataset.navAt = String(enabled ? start + distance * .4 : start + anchorTop * zoom - innerHeight * .3);
            lastProgress = NaN;
            paint();
        };
        const observer = new ResizeObserver(measure);
        [frame, copy, profile, credentials, metrics].forEach(node => observer.observe(node));
        if (lenis) lenis.on('scroll', onLenisScroll);
        else window.addEventListener('scroll', onNativeScroll, { passive: true });
        window.addEventListener('resize', measure);
        media.addEventListener('change', measure);
        document.fonts.ready.then(measure);
        measure();
        return () => {
            disposed = true;
            cancelAnimationFrame(raf);
            observer.disconnect();
            if (lenis) lenis.off('scroll', onLenisScroll);
            else window.removeEventListener('scroll', onNativeScroll);
            window.removeEventListener('resize', measure);
            media.removeEventListener('change', measure);
            motion.clear();
            layout.clear();
            delete root.dataset.connected;
            delete root.dataset.sceneProgress;
            delete anchor.dataset.navAt;
            [copy, profile, credentials, metrics].forEach(node => setSceneInert(node, false));
        };
    }, [ref, lenis]);
}
