import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

interface SmoothScrollContextValue {
    lenis: Lenis | null;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({ lenis: null });

export function useLenis() {
    return useContext(SmoothScrollContext).lenis;
}

/** Smooth desktop wheel input while keeping the real document as the scroller. */
export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
    const [lenis, setLenis] = useState<Lenis | null>(null);

    useEffect(() => {
        const media = matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
        let instance: Lenis | null = null;

        // Native navigation, focus and scrollbar dragging take precedence over
        // an unfinished wheel movement. Use the public API to cancel momentum.
        const cancelMomentum = () => {
            if (instance?.isScrolling === 'smooth') {
                instance.stop();
                instance.start();
            }
        };
        const syncNativeScroll = () => {
            // A native scrollbar drag or external scrollTo can bypass pointer
            // events. Preserve that actual position instead of resuming a tween.
            if (instance?.isScrolling === 'smooth' && Math.abs(window.scrollY - instance.animatedScroll) > 2) cancelMomentum();
        };
        const syncLock = () => {
            if (!instance) return;
            const overflow = getComputedStyle(document.body).overflowY;
            if (overflow === 'hidden' || overflow === 'clip') instance.stop();
            else instance.start();
        };
        const syncEnabled = () => {
            instance?.destroy();
            instance = null;
            if (media.matches) {
                instance = new Lenis({
                    autoRaf: true,
                    smoothWheel: true,
                    syncTouch: false,
                    lerp: .08,
                    wheelMultiplier: 1,
                    anchors: false,
                    virtualScroll: ({ deltaX, deltaY, event }) => {
                        const nested = event.composedPath().some(node => node instanceof HTMLElement && node.hasAttribute('data-lenis-prevent'));
                        // Preserve touch, browser zoom and horizontal gestures.
                        if (nested || event.type.includes('touch') || event.ctrlKey || event.metaKey || event.shiftKey || Math.abs(deltaX) > Math.abs(deltaY) || event.defaultPrevented) {
                            cancelMomentum();
                            return false;
                        }
                        return true;
                    },
                });
                syncLock();
            }
            setLenis(instance);
        };
        const locks = new MutationObserver(syncLock);
        locks.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] });
        window.addEventListener('pointerdown', cancelMomentum, true);
        window.addEventListener('keydown', cancelMomentum, true);
        window.addEventListener('hashchange', cancelMomentum);
        window.addEventListener('scroll', syncNativeScroll, { passive: true });
        media.addEventListener('change', syncEnabled);
        syncEnabled();

        return () => {
            locks.disconnect();
            window.removeEventListener('pointerdown', cancelMomentum, true);
            window.removeEventListener('keydown', cancelMomentum, true);
            window.removeEventListener('hashchange', cancelMomentum);
            window.removeEventListener('scroll', syncNativeScroll);
            media.removeEventListener('change', syncEnabled);
            instance?.destroy();
        };
    }, []);

    return <SmoothScrollContext.Provider value={{ lenis }}>{children}</SmoothScrollContext.Provider>;
}
