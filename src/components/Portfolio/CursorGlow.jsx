import { useEffect, useRef } from 'react';

const isTouchDevice = () =>
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

const SIZE = 20;
const BEZIER = 'cubic-bezier(0.16, 1, 0.3, 1)';
const T_MORPH = `transform 0.38s ${BEZIER}, width 0.38s ${BEZIER}, height 0.38s ${BEZIER}, border-radius 0.38s ${BEZIER}, opacity 0.2s ease`;
const T_SCROLL = `width 0.38s ${BEZIER}, height 0.38s ${BEZIER}, border-radius 0.38s ${BEZIER}, opacity 0.2s ease`;
const T_FREE  = `width 0.28s ${BEZIER}, height 0.28s ${BEZIER}, border-radius 0.28s ${BEZIER}, opacity 0.2s ease`;

export default function CursorMorph() {
    const elRef = useRef(null);
    const contrastRef = useRef(null);

    useEffect(() => {
        if (isTouchDevice()) return;

        const el = elRef.current;
        const contrast = contrastRef.current;
        if (!el) return;

        let mouseX = -200;
        let mouseY = -200;
        let activeCard = null;
        let returnTimeout = null;
        let moveRaf = null;
        let scrollRaf = null;
        let cachedZoom = 0.8;

        const updateZoom = () => {
            cachedZoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
        };
        updateZoom();
        window.addEventListener('resize', updateZoom, { passive: true });

        // Identifica com precisão qualquer card morphável na página
        const findCard = (target) => {
            if (!target || target === document.body || target === document.documentElement) return null;
            if (target.closest('[data-no-morph="true"], .no-morph, nav, input, textarea')) return null;

            const candidate = target.closest(
                '[data-cursor-morph="true"], .cursor-morph, .rounded-2xl.border, .rounded-xl.border, [class*="rounded-2xl"][class*="border"], [class*="rounded-xl"][class*="border"], .group.border'
            );
            if (!candidate || candidate.closest('[data-no-morph="true"], .no-morph')) return null;

            const rect = candidate.getBoundingClientRect();
            const w = rect.width / cachedZoom;
            const h = rect.height / cachedZoom;

            // Filtro de dimensões adequadas para morph
            if (w >= 60 && h >= 40 && w <= (window.innerWidth / cachedZoom) * 0.98 && h <= 1600) {
                return candidate;
            }
            return null;
        };

        const updatePosition = (isScroll = false) => {
            if (activeCard) {
                const rect = activeCard.getBoundingClientRect();
                const radius = getComputedStyle(activeCard).borderRadius || '16px';
                const left = rect.left / cachedZoom;
                const top  = rect.top / cachedZoom;
                const w    = rect.width / cachedZoom;
                const h    = rect.height / cachedZoom;

                el.style.transition   = isScroll ? T_SCROLL : T_MORPH;
                el.style.width        = `${w}px`;
                el.style.height       = `${h}px`;
                el.style.borderRadius = radius;
                el.style.transform    = `translate3d(${left}px, ${top}px, 0)`;
            } else {
                const curX = mouseX / cachedZoom - SIZE / 2;
                const curY = mouseY / cachedZoom - SIZE / 2;
                el.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
            }
        };

        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Atualiza a lente de contraste (segue o cursor sempre)
            if (contrast) {
                const cx = mouseX / cachedZoom;
                const cy = mouseY / cachedZoom;
                contrast.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
            }

            if (moveRaf) return;

            moveRaf = requestAnimationFrame(() => {
                moveRaf = null;
                const card = findCard(e.target);

                if (card !== activeCard) {
                    activeCard = card;
                    if (returnTimeout) clearTimeout(returnTimeout);

                    if (activeCard) {
                        updatePosition(false);
                    } else {
                        const curX = mouseX / cachedZoom - SIZE / 2;
                        const curY = mouseY / cachedZoom - SIZE / 2;

                        el.style.transition   = T_MORPH;
                        el.style.width        = `${SIZE}px`;
                        el.style.height       = `${SIZE}px`;
                        el.style.borderRadius = '50%';
                        el.style.transform    = `translate3d(${curX}px, ${curY}px, 0)`;

                        returnTimeout = setTimeout(() => {
                            if (!activeCard) {
                                el.style.transition = T_FREE;
                            }
                        }, 380);
                    }
                } else if (!activeCard) {
                    const curX = mouseX / cachedZoom - SIZE / 2;
                    const curY = mouseY / cachedZoom - SIZE / 2;
                    el.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
                }
            });
        };

        const onScroll = () => {
            if (activeCard) {
                if (!scrollRaf) {
                    scrollRaf = requestAnimationFrame(() => {
                        scrollRaf = null;
                        updatePosition(true);
                    });
                }
            }
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', updateZoom);
            if (returnTimeout) clearTimeout(returnTimeout);
            if (moveRaf) cancelAnimationFrame(moveRaf);
            if (scrollRaf) cancelAnimationFrame(scrollRaf);
        };
    }, []);

    if (isTouchDevice()) return null;

    return (
        <>
            {/* Cursor morph original — envolve cards */}
            <div
                ref={elRef}
                className="pointer-events-none fixed top-0 left-0 z-[99998] transform-gpu"
                style={{
                    width:         `${SIZE}px`,
                    height:        `${SIZE}px`,
                    borderRadius:  '50%',
                    border:        '1.5px solid var(--color-border)',
                    background:    'var(--color-border)',
                    boxShadow:     'none',
                    transition:    T_FREE,
                    willChange:    'transform, width, height, border-radius',
                    transform:     'translate3d(-200px, -200px, 0)',
                    contain:       'layout style',
                }}
            />

            {/* Lente de contraste invertido — segue o cursor, aplica difference */}
            <div
                ref={contrastRef}
                className="pointer-events-none fixed top-0 left-0 z-[99999] rounded-full bg-white/90 -translate-x-1/2 -translate-y-1/2 will-change-transform"
                style={{
                    width:        '8px',
                    height:       '8px',
                    mixBlendMode: 'difference',
                    transform:    'translate3d(-200px, -200px, 0)',
                }}
            />
        </>
    );
}
