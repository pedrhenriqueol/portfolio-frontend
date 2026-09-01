import { useEffect, useRef } from 'react';

const isTouchDevice = () =>
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

const DEFAULT_SIZE = 32;
const TEXT_HOVER_SIZE = 56;
const BEZIER = 'cubic-bezier(0.16, 1, 0.3, 1)';
const T_MORPH = `transform 0.38s ${BEZIER}, width 0.38s ${BEZIER}, height 0.38s ${BEZIER}, border-radius 0.38s ${BEZIER}, background-color 0.32s ease, border-color 0.32s ease, box-shadow 0.32s ease`;
const T_SCROLL = `width 0.38s ${BEZIER}, height 0.38s ${BEZIER}, border-radius 0.38s ${BEZIER}`;
const T_FREE = `width 0.32s ${BEZIER}, height 0.32s ${BEZIER}, border-radius 0.32s ${BEZIER}, background-color 0.32s ease, border-color 0.32s ease, box-shadow 0.32s ease`;

export default function CursorMorph() {
    const cursorRef = useRef(null);

    useEffect(() => {
        if (isTouchDevice()) return;

        const cursorEl = cursorRef.current;
        if (!cursorEl) return;

        let mouseX = -200;
        let mouseY = -200;
        let ringX = -200;
        let ringY = -200;
        let activeCard = null;
        let moveRaf = null;
        let scrollRaf = null;
        let loopRaf = null;
        let cachedZoom = 0.8;
        let isTextHovered = false;

        const updateZoom = () => {
            cachedZoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
        };
        updateZoom();
        window.addEventListener('resize', updateZoom, { passive: true });

        // Identifica com precisão se o cursor está sobre um card ou botão morphável
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

            if (w >= 70 && h >= 45 && w <= (window.innerWidth / cachedZoom) * 0.98 && h <= 1600) {
                return candidate;
            }
            return null;
        };

        // Identifica se está sobre texto legível que NÃO seja morph
        const checkIsText = (target) => {
            if (!target) return false;
            if (findCard(target)) return false;

            const textEl = target.closest(
                'h1, h2, h3, h4, h5, h6, p, span, strong, em, b, i, code, label, blockquote, li'
            );
            if (!textEl) return false;

            const hasText = textEl.textContent && textEl.textContent.trim().length > 0;
            return hasText;
        };

        // Aplica o morph / elasticidade contínua no elemento único
        const updateCursorState = (isScroll = false) => {
            if (activeCard) {
                const rect = activeCard.getBoundingClientRect();
                const radius = getComputedStyle(activeCard).borderRadius || '16px';
                const left = rect.left / cachedZoom;
                const top = rect.top / cachedZoom;
                const w = rect.width / cachedZoom;
                const h = rect.height / cachedZoom;

                cursorEl.style.transition = isScroll ? T_SCROLL : T_MORPH;
                cursorEl.style.mixBlendMode = 'normal';
                cursorEl.style.backgroundColor = 'rgba(var(--color-accent-rgb, 140, 106, 74), 0.08)';
                cursorEl.style.border = '1.5px solid var(--color-accent, #8C6A4A)';
                cursorEl.style.boxShadow = '0 0 24px rgba(var(--color-accent-rgb, 140, 106, 74), 0.18)';
                cursorEl.style.borderRadius = radius;
                cursorEl.style.width = `${w}px`;
                cursorEl.style.height = `${h}px`;
                cursorEl.style.transform = `translate3d(${left}px, ${top}px, 0)`;
            } else {
                const size = isTextHovered ? TEXT_HOVER_SIZE : DEFAULT_SIZE;
                const curX = ringX - size / 2;
                const curY = ringY - size / 2;

                cursorEl.style.transition = T_FREE;
                cursorEl.style.mixBlendMode = 'difference';
                cursorEl.style.backgroundColor = '#ffffff';
                cursorEl.style.border = 'none';
                cursorEl.style.boxShadow = 'none';
                cursorEl.style.borderRadius = '50%';
                cursorEl.style.width = `${size}px`;
                cursorEl.style.height = `${size}px`;
                cursorEl.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
            }
        };

        // Loop contínuo com física suave (0.02)
        const renderLoop = () => {
            const targetX = mouseX / cachedZoom;
            const targetY = mouseY / cachedZoom;

            ringX += (targetX - ringX) * 0.02;
            ringY += (targetY - ringY) * 0.02;

            // Se o cursor estiver livre (fora de um card), atualiza a translação contínua
            if (!activeCard) {
                const size = isTextHovered ? TEXT_HOVER_SIZE : DEFAULT_SIZE;
                cursorEl.style.transform = `translate3d(${ringX - size / 2}px, ${ringY - size / 2}px, 0)`;
            }

            loopRaf = requestAnimationFrame(renderLoop);
        };
        loopRaf = requestAnimationFrame(renderLoop);

        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Detecta se está sobre texto legível
            const isText = checkIsText(e.target);
            if (isText !== isTextHovered) {
                isTextHovered = isText;
                if (!activeCard) {
                    const targetSize = isTextHovered ? TEXT_HOVER_SIZE : DEFAULT_SIZE;
                    cursorEl.style.width = `${targetSize}px`;
                    cursorEl.style.height = `${targetSize}px`;
                }
            }

            if (moveRaf) return;

            moveRaf = requestAnimationFrame(() => {
                moveRaf = null;
                const card = findCard(e.target);

                if (card !== activeCard) {
                    activeCard = card;
                    updateCursorState(false);
                }
            });
        };

        const onScroll = () => {
            if (activeCard && !scrollRaf) {
                scrollRaf = requestAnimationFrame(() => {
                    scrollRaf = null;
                    updateCursorState(true);
                });
            }
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', updateZoom);
            if (moveRaf) cancelAnimationFrame(moveRaf);
            if (scrollRaf) cancelAnimationFrame(scrollRaf);
            if (loopRaf) cancelAnimationFrame(loopRaf);
        };
    }, []);

    if (isTouchDevice()) return null;

    return (
        /* Elemento Único e Elástico: Bola nítida em modo difference e morph elegante */
        <div
            ref={cursorRef}
            className="pointer-events-none fixed top-0 left-0 z-[99999] will-change-transform transform-gpu"
            style={{
                width: `${DEFAULT_SIZE}px`,
                height: `${DEFAULT_SIZE}px`,
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                mixBlendMode: 'difference',
                transform: 'translate3d(-200px, -200px, 0)',
                contain: 'layout style',
            }}
        />
    );
}
