import { useEffect, useRef } from 'react';

const isTouchDevice = () =>
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

const SIZE = 20;
const BEZIER = 'cubic-bezier(0.16, 1, 0.3, 1)';
const T_MORPH = `transform 0.35s ${BEZIER}, width 0.35s ${BEZIER}, height 0.35s ${BEZIER}, border-radius 0.35s ${BEZIER}, opacity 0.2s ease`;
const T_FREE  = `width 0.25s ${BEZIER}, height 0.25s ${BEZIER}, border-radius 0.25s ${BEZIER}, opacity 0.2s ease`;

export default function CursorMorph() {
    const elRef = useRef(null);

    useEffect(() => {
        if (isTouchDevice()) return;

        const el = elRef.current;
        if (!el) return;

        let mouseX = -200;
        let mouseY = -200;
        let activeCard = null;
        let cachedRect = null;
        let returnTimeout = null;
        let moveRaf = null;
        let cachedZoom = 0.8;

        const updateZoom = () => {
            cachedZoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
        };
        updateZoom();
        window.addEventListener('resize', updateZoom, { passive: true });

        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (moveRaf) return;

            moveRaf = requestAnimationFrame(() => {
                moveRaf = null;
                const curX = mouseX / cachedZoom - SIZE / 2;
                const curY = mouseY / cachedZoom - SIZE / 2;

                if (activeCard && cachedRect) {
                    el.style.transform = `translate3d(${cachedRect.left}px, ${cachedRect.top}px, 0)`;
                } else {
                    el.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
                }
            });
        };

        // Usa event delegation para capturar hover de cards SEM getBoundingClientRect() contínuo
        const onMouseOver = (e) => {
            const target = e.target;
            if (!target || target.closest('[data-no-morph="true"], .no-morph')) return;

            const card = target.closest('[data-cursor-morph="true"], .cursor-morph');
            if (card && card !== activeCard) {
                activeCard = card;
                const r = card.getBoundingClientRect();
                const radius = getComputedStyle(card).borderRadius || '16px';
                cachedRect = {
                    left: r.left / cachedZoom,
                    top:  r.top  / cachedZoom,
                    w:    r.width / cachedZoom,
                    h:    r.height / cachedZoom,
                };

                if (returnTimeout) clearTimeout(returnTimeout);
                el.style.transition   = T_MORPH;
                el.style.width        = `${cachedRect.w}px`;
                el.style.height       = `${cachedRect.h}px`;
                el.style.borderRadius = radius;
                el.style.transform    = `translate3d(${cachedRect.left}px, ${cachedRect.top}px, 0)`;
            }
        };

        const onMouseOut = (e) => {
            if (activeCard && (!e.relatedTarget || !activeCard.contains(e.relatedTarget))) {
                activeCard = null;
                cachedRect = null;

                const curX = mouseX / cachedZoom - SIZE / 2;
                const curY = mouseY / cachedZoom - SIZE / 2;

                el.style.transition   = T_MORPH;
                el.style.width        = `${SIZE}px`;
                el.style.height       = `${SIZE}px`;
                el.style.borderRadius = '50%';
                el.style.transform    = `translate3d(${curX}px, ${curY}px, 0)`;

                if (returnTimeout) clearTimeout(returnTimeout);
                returnTimeout = setTimeout(() => {
                    if (!activeCard) {
                        el.style.transition = T_FREE;
                    }
                }, 350);
            }
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        document.addEventListener('mouseover', onMouseOver, { passive: true });
        document.addEventListener('mouseout', onMouseOut, { passive: true });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseover', onMouseOver);
            document.removeEventListener('mouseout', onMouseOut);
            window.removeEventListener('resize', updateZoom);
            if (returnTimeout) clearTimeout(returnTimeout);
            if (moveRaf) cancelAnimationFrame(moveRaf);
        };
    }, []);

    if (isTouchDevice()) return null;

    return (
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
    );
}
