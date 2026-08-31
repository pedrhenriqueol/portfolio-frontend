import { useEffect, useRef } from 'react';

const isTouchDevice = () =>
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

const SIZE = 24;
const HOVER_SIZE = 48;
const BEZIER = 'cubic-bezier(0.16, 1, 0.3, 1)';
const T_MORPH = `transform 0.38s ${BEZIER}, width 0.38s ${BEZIER}, height 0.38s ${BEZIER}, border-radius 0.38s ${BEZIER}, opacity 0.2s ease`;
const T_SCROLL = `width 0.38s ${BEZIER}, height 0.38s ${BEZIER}, border-radius 0.38s ${BEZIER}, opacity 0.2s ease`;
const T_FREE  = `width 0.28s ${BEZIER}, height 0.28s ${BEZIER}, border-radius 0.28s ${BEZIER}, opacity 0.2s ease`;

export default function CursorMorph() {
    const morphElRef = useRef(null);
    const dotElRef = useRef(null);

    useEffect(() => {
        if (isTouchDevice()) return;

        const morphEl = morphElRef.current;
        const dotEl = dotElRef.current;
        if (!morphEl || !dotEl) return;

        let mouseX = -200;
        let mouseY = -200;
        let ringX = -200;
        let ringY = -200;
        let activeCard = null;
        let returnTimeout = null;
        let moveRaf = null;
        let scrollRaf = null;
        let loopRaf = null;
        let cachedZoom = 0.8;
        let isHovered = false;

        const updateZoom = () => {
            cachedZoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
        };
        updateZoom();
        window.addEventListener('resize', updateZoom, { passive: true });

        // Identifica com precisão se o cursor está sobre um card morphável
        const findCard = (target) => {
            if (!target || target === document.body || target === document.documentElement) return null;
            if (target.closest('[data-no-morph="true"], .no-morph, nav, input, textarea, canvas, svg')) return null;

            const candidate = target.closest(
                '[data-cursor-morph="true"], .cursor-morph, .rounded-2xl.border, .rounded-xl.border, [class*="rounded-2xl"][class*="border"], [class*="rounded-xl"][class*="border"], .group.border'
            );
            if (!candidate || candidate.closest('[data-no-morph="true"], .no-morph')) return null;

            const rect = candidate.getBoundingClientRect();
            const w = rect.width / cachedZoom;
            const h = rect.height / cachedZoom;

            // Filtro de dimensões adequadas para morph
            if (w >= 70 && h >= 45 && w <= (window.innerWidth / cachedZoom) * 0.98 && h <= 1600) {
                return candidate;
            }
            return null;
        };

        const updateMorphPosition = (isScroll = false) => {
            if (activeCard) {
                const rect = activeCard.getBoundingClientRect();
                const radius = getComputedStyle(activeCard).borderRadius || '16px';
                const left = rect.left / cachedZoom;
                const top  = rect.top / cachedZoom;
                const w    = rect.width / cachedZoom;
                const h    = rect.height / cachedZoom;

                morphEl.style.transition   = isScroll ? T_SCROLL : T_MORPH;
                morphEl.style.width        = `${w}px`;
                morphEl.style.height       = `${h}px`;
                morphEl.style.borderRadius = radius;
                morphEl.style.transform    = `translate3d(${left}px, ${top}px, 0)`;
                morphEl.style.opacity      = '0.35';
            } else {
                const curX = mouseX / cachedZoom - (isHovered ? HOVER_SIZE : SIZE) / 2;
                const curY = mouseY / cachedZoom - (isHovered ? HOVER_SIZE : SIZE) / 2;
                morphEl.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
                morphEl.style.opacity   = '0';
            }
        };

        // Loop contínuo para o ponto central e inércia suave do halo (60-120fps fluido)
        const renderLoop = () => {
            const targetX = mouseX / cachedZoom;
            const targetY = mouseY / cachedZoom;

            ringX += (targetX - ringX) * 0.25;
            ringY += (targetY - ringY) * 0.25;

            // Ponto central preciso (sem atraso)
            dotEl.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;

            // Halo suave quando não está abraçando um card
            if (!activeCard) {
                const size = isHovered ? HOVER_SIZE : SIZE;
                morphEl.style.transform = `translate3d(${ringX - size / 2}px, ${ringY - size / 2}px, 0)`;
            }

            loopRaf = requestAnimationFrame(renderLoop);
        };
        loopRaf = requestAnimationFrame(renderLoop);

        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Detecta elementos interativos para expandir o halo suavemente
            const target = e.target;
            const interactive = Boolean(
                target.closest('button, a, input, textarea, select, [role="button"], .cursor-pointer, [data-cursor-hover="true"]')
            );

            if (interactive !== isHovered) {
                isHovered = interactive;
                if (!activeCard) {
                    const targetSize = isHovered ? HOVER_SIZE : SIZE;
                    morphEl.style.width  = `${targetSize}px`;
                    morphEl.style.height = `${targetSize}px`;
                    morphEl.style.opacity = isHovered ? '0.7' : '0.4';
                }
            }

            if (moveRaf) return;

            moveRaf = requestAnimationFrame(() => {
                moveRaf = null;
                const card = findCard(e.target);

                if (card !== activeCard) {
                    activeCard = card;
                    if (returnTimeout) clearTimeout(returnTimeout);

                    if (activeCard) {
                        updateMorphPosition(false);
                    } else {
                        const targetSize = isHovered ? HOVER_SIZE : SIZE;
                        const curX = ringX - targetSize / 2;
                        const curY = ringY - targetSize / 2;

                        morphEl.style.transition   = T_MORPH;
                        morphEl.style.width        = `${targetSize}px`;
                        morphEl.style.height       = `${targetSize}px`;
                        morphEl.style.borderRadius = '50%';
                        morphEl.style.transform    = `translate3d(${curX}px, ${curY}px, 0)`;
                        morphEl.style.opacity      = isHovered ? '0.7' : '0.4';

                        returnTimeout = setTimeout(() => {
                            if (!activeCard) {
                                morphEl.style.transition = T_FREE;
                            }
                        }, 380);
                    }
                }
            });
        };

        const onScroll = () => {
            if (activeCard && !scrollRaf) {
                scrollRaf = requestAnimationFrame(() => {
                    scrollRaf = null;
                    updateMorphPosition(true);
                });
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
            if (loopRaf) cancelAnimationFrame(loopRaf);
        };
    }, []);

    if (isTouchDevice()) return null;

    return (
        <>
            {/* Ponto central discreto e elegante com a cor de destaque da paleta */}
            <div
                ref={dotElRef}
                className="pointer-events-none fixed top-0 left-0 z-[99999] rounded-full will-change-transform"
                style={{
                    width:           '6px',
                    height:          '6px',
                    backgroundColor: 'var(--color-accent, #8C6A4A)',
                    boxShadow:       '0 0 8px rgba(var(--color-accent-rgb, 140, 106, 74), 0.8)',
                    transform:       'translate3d(-200px, -200px, 0) translate(-50%, -50%)',
                }}
            />

            {/* Halo fluido que se expande ao hover e faz Morph ao abraçar os cards */}
            <div
                ref={morphElRef}
                className="pointer-events-none fixed top-0 left-0 z-[99998] transform-gpu"
                style={{
                    width:         `${SIZE}px`,
                    height:        `${SIZE}px`,
                    borderRadius:  '50%',
                    border:        '1.5px solid var(--color-accent, #8C6A4A)',
                    background:    'rgba(var(--color-accent-rgb, 140, 106, 74), 0.08)',
                    boxShadow:     '0 0 16px rgba(var(--color-accent-rgb, 140, 106, 74), 0.12)',
                    opacity:       0.4,
                    transition:    T_FREE,
                    willChange:    'transform, width, height, border-radius, opacity',
                    transform:     'translate3d(-200px, -200px, 0)',
                    contain:       'layout style',
                }}
            />
        </>
    );
}
