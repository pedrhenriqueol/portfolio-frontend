import { useLayoutEffect, useRef, type ReactNode } from 'react';
import SectionDivider from './SectionDivider';
import { createSceneStyles } from '../../../utils/sceneStyles';
import { useLenis } from '../../providers/SmoothScrollProvider';

/** The anchor keeps its layout box; only its child is animated. */
export function ChapterHeading({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <div data-chapter-heading className={className}><div className="chapter-heading-content">{children}</div></div>;
}

/** One progress value hands the outgoing cards to the next heading and line.
 * No transform on section roots: their fixed dialogs keep the viewport as
 * their containing block, and all controls stay in the native document flow.
 */
export default function ScrollChapter({ children, opening = false }: { children: ReactNode; opening?: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const lenis = useLenis();
    useLayoutEffect(() => {
        const root = ref.current;
        if (!root || opening) return;
        const previous = root.previousElementSibling as HTMLElement | null;
        const media = matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)');
        let start = 0;
        let distance = 1;
        let frame = 0;
        let disposed = false;
        let lastProgress = NaN;
        let scrollPosition = lenis ? lenis.scroll : window.scrollY;
        let headingContent: HTMLElement | null = null;
        let tails: HTMLElement[] = [];
        let dividerLine: HTMLElement | null = null;
        let dividerMarker: HTMLElement | null = null;
        let enabled = media.matches;
        const styles = createSceneStyles();
        const paint = () => {
            frame = 0;
            if (disposed) return;
            if (!enabled) return;
            const progress = Math.min(1, Math.max(0, (scrollPosition - start) / distance));
            if (progress === lastProgress) return;
            lastProgress = progress;
            if (headingContent) styles.set(headingContent, 'transform', `translateY(${(1 - progress) * 96}px) scale(${.90 + progress * .10})`);
            tails.forEach(tail => styles.set(tail, 'transform', `translateY(${progress * 32}px) scale(${1 - progress * .075})`));
            if (dividerLine) styles.set(dividerLine, 'transform', `scaleX(${.15 + progress * .85})`);
            if (dividerMarker) styles.set(dividerMarker, 'transform', `rotate(${progress * 180}deg)`);
        };
        const measure = () => {
            if (disposed) return;
            cancelAnimationFrame(frame);
            frame = 0;
            styles.clear();
            const heading = root.querySelector('[data-chapter-heading]');
            headingContent = heading?.querySelector<HTMLElement>('.chapter-heading-content') || null;
            tails = previous ? [...previous.querySelectorAll<HTMLElement>('.chapter-tail')] : [];
            dividerLine = root.querySelector<HTMLElement>(':scope > .chapter-divider > div');
            dividerMarker = root.querySelector<HTMLElement>(':scope > .chapter-divider > span');
            enabled = media.matches;
            scrollPosition = window.scrollY;
            start = root.getBoundingClientRect().top + scrollPosition - innerHeight * .86;
            const end = (heading || root).getBoundingClientRect().top + scrollPosition - innerHeight * .34;
            distance = Math.max(1, end - start);
            lastProgress = NaN;
            paint();
        };
        const onLenisScroll = (instance: { scroll: number }) => {
            // Lenis updates this public value for smooth and native navigation.
            scrollPosition = instance.scroll;
            if (!frame) frame = requestAnimationFrame(paint);
        };
        const onNativeScroll = () => {
            scrollPosition = window.scrollY;
            if (!frame) frame = requestAnimationFrame(paint);
        };
        const observer = new ResizeObserver(measure);
        observer.observe(root);
        // Includes changes above this chapter (fonts, language, lazy sections).
        if (root.parentElement) observer.observe(root.parentElement);
        if (lenis) lenis.on('scroll', onLenisScroll);
        else window.addEventListener('scroll', onNativeScroll, { passive: true });
        window.addEventListener('resize', measure);
        media.addEventListener('change', measure);
        document.fonts.ready.then(measure);
        measure();
        return () => {
            disposed = true;
            cancelAnimationFrame(frame);
            observer.disconnect();
            if (lenis) lenis.off('scroll', onLenisScroll);
            else window.removeEventListener('scroll', onNativeScroll);
            window.removeEventListener('resize', measure);
            media.removeEventListener('change', measure);
            styles.clear();
        };
    }, [opening, lenis]);

    return (
        <div ref={ref} className="scroll-chapter" data-opening={opening || undefined}>
            {!opening && <SectionDivider className="chapter-divider my-4 md:my-6" marker="+" />}
            {children}
        </div>
    );
}
