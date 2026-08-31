import { useEffect, useRef } from 'react';

const isTouchDevice = () =>
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

const DEFAULT_SIZE = 24;
const HOVER_SIZE = 52;
const BEZIER = 'cubic-bezier(0.16, 1, 0.3, 1)';
const T_MORPH = `transform 0.38s ${BEZIER}, width 0.38s ${BEZIER}, height 0.38s ${BEZIER}, border-radius 0.38s ${BEZIER}, opacity 0.2s ease`;
const T_SCROLL = `width 0.38s ${BEZIER}, height 0.38s ${BEZIER}, border-radius 0.38s ${BEZIER}, opacity 0.2s ease`;
const T_FREE  = `width 0.28s ${BEZIER}, height 0.28s ${BEZIER}, border-radius 0.28s ${BEZIER}, opacity 0.2s ease`;

export default function CursorMorph() {
    const morphElRef = useRef(null);
    const contrastElRef = useRef(null);

    useEffect(() => {
        if (isTouchDevice()) return;

        const morphEl = morphElRef.current;
        const contrastEl = contrastElRef.current;
        if (!morphEl || !contrastEl) return;

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
                '[data-cursor-morph="true"], .cursor-morph, .rounded-2xl.border, .rounded-xl.border, [class*="rounded-2xl"][class*="border"], [class*="rounded-xl"][class*="border"]'
            );
            if (!candidate || candidate.closest('[data-no-morph="true"], .no-morph')) return null;

            const rect = candidate.getBoundingClientRect();
            const w = rect.width / cachedZoom;
            const h = rect.height / cachedZoom;

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
                const curX = mouseX / cachedZoom - DEFAULT_SIZE / 2;
                const curY = mouseY / cachedZoom - DEFAULT_SIZE / 2;
                morphEl.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
                morphEl.style.opacity   = '0';
            }
        };

        // Loop contínuo para o cursor de contraste (inércia fluida de 60fps)
        const renderLoop = () => {
            const targetX = mouseX / cachedZoom;
            const targetY = mouseY / cachedZoom;

            ringX += (targetX - ringX) * 0.22;
            ringY += (targetY - ringY) * 0.22;

            contrastEl.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

            loopRaf = requestAnimationFrame(renderLoop);
        };
        loopRaf = requestAnimationFrame(renderLoop);

        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Detecta se está sobre elemento interativo (links, botões, títulos clicáveis)
            const target = e.target;
            const interactive = Boolean(
                target.closest('button, a, input, textarea, select, [role="button"], .cursor-pointer, [data-cursor-hover="true"], h1, h2, h3')
            );

            if (interactive !== isHovered) {
                isHovered = interactive;
                const targetSize = isHovered ? HOVER_SIZE : DEFAULT_SIZE;
                contrastEl.style.width  = `${targetSize}px`;
                contrastEl.style.height = `${targetSize}px`;
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
                        const curX = mouseX / cachedZoom - DEFAULT_SIZE / 2;
                        const curY = mouseY / cachedZoom - DEFAULT_SIZE / 2;

                        morphEl.style.transition   = T_MORPH;
                        morphEl.style.width        = `${DEFAULT_SIZE}px`;
                        morphEl.style.height       = `${DEFAULT_SIZE}px`;
                        morphEl.style.borderRadius = '50%';
                        morphEl.style.transform    = `translate3d(${curX}px, ${curY}px, 0)`;

                        returnTimeout = setTimeout(() => {
                            if (!activeCard) {
                                morphEl.style.transition = T_FREE;
                                morphEl.style.opacity    = '0';
                            }
                        }, 380);
                    }
                } else if (!activeCard) {
                    const curX = mouseX / cachedZoom - DEFAULT_SIZE / 2;
                    const curY = mouseY / cachedZoom - DEFAULT_SIZE / 2;
                    morphEl.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
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
            {/* Lente de Contraste Invertido (Inverte texto e cores suavemente com alto contraste) */}
            <div
                ref={contrastElRef}
                className="pointer-events-none fixed top-0 left-0 z-[99999] rounded-full will-change-transform"
                style={{
                    width:         `${DEFAULT_SIZE}px`,
                    height:        `${DEFAULT_SIZE}px`,
                    backgroundColor: '#ffffff',
                    mixBlendMode:  'difference',
                    transition:    'width 0.28s cubic-bezier(0.16, 1, 0.3, 1), height 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform:     'translate3d(-200px, -200px, 0) translate(-50%, -50%)',
                }}
            />

            {/* Envoltório Morph dos Cards (Aparece ao pairar sobre cards normais e abraça o formato) */}
            <div
                ref={morphElRef}
                className="pointer-events-none fixed top-0 left-0 z-[99998] transform-gpu"
                style={{
                    width:         `${DEFAULT_SIZE}px`,
                    height:        `${DEFAULT_SIZE}px`,
                    borderRadius:  '50%',
                    border:        '1.5px solid var(--color-accent)',
                    background:    'rgba(var(--color-accent-rgb, 140, 106, 74), 0.1)',
                    boxShadow:     '0 0 20px rgba(var(--color-accent-rgb, 140, 106, 74), 0.15)',
                    opacity:       0,
                    transition:    T_FREE,
                    willChange:    'transform, width, height, border-radius, opacity',
                    transform:     'translate3d(-200px, -200px, 0)',
                    contain:       'layout style',
                }}
            />
        </>
    );
}
