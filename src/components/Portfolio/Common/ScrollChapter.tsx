import { useLayoutEffect, useRef, type ReactNode } from 'react';
import SectionDivider from './SectionDivider';

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
        const paint = () => {
            frame = 0;
            if (disposed) return;
            const progress = Math.min(1, Math.max(0, (scrollY - start) / distance));
            if (progress === lastProgress) return;
            lastProgress = progress;
            root.style.setProperty('--chapter-enter', String(media.matches ? progress : 1));
            previous?.style.setProperty('--chapter-exit', String(media.matches ? progress : 0));
        };
        const measure = () => {
            if (disposed) return;
            cancelAnimationFrame(frame);
            const heading = root.querySelector('[data-chapter-heading]');
            start = root.getBoundingClientRect().top + scrollY - innerHeight * .86;
            const end = (heading || root).getBoundingClientRect().top + scrollY - innerHeight * .34;
            distance = Math.max(1, end - start);
            lastProgress = NaN;
            paint();
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(paint);
        };
        const observer = new ResizeObserver(measure);
        observer.observe(root);
        // Includes changes above this chapter (fonts, language, lazy sections).
        if (root.parentElement) observer.observe(root.parentElement);
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
            root.style.removeProperty('--chapter-enter');
            previous?.style.removeProperty('--chapter-exit');
        };
    }, [opening]);

    return (
        <div ref={ref} className="scroll-chapter" data-opening={opening || undefined}>
            {!opening && <SectionDivider className="chapter-divider my-4 md:my-6" marker="+" />}
            {children}
        </div>
    );
}
