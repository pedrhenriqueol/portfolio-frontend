import { useEffect, useRef } from 'react';

const isTouchDevice = () =>
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

const DEFAULT_SIZE = 32;
const TEXT_HOVER_SIZE = 56;
const BEZIER = 'cubic-bezier(0.16, 1, 0.3, 1)';
const T_MORPH = `transform 0.38s ${BEZIER}, width 0.38s ${BEZIER}, height 0.38s ${BEZIER}, border-radius 0.38s ${BEZIER}, opacity 0.22s ease`;
const T_SCROLL = `width 0.38s ${BEZIER}, height 0.38s ${BEZIER}, border-radius 0.38s ${BEZIER}, opacity 0.22s ease`;

export default function CursorMorph() {
    const contrastRef = useRef(null);
    const morphRef = useRef(null);

    useEffect(() => {
        if (isTouchDevice()) return;

        const contrastEl = contrastRef.current;
        const morphEl = morphRef.current;
        if (!contrastEl || !morphEl) return;

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

        // Identifica se o cursor está sobre um card ou botão morphável
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

        const updateMorphPosition = (isScroll = false) => {
            if (activeCard) {
                const rect = activeCard.getBoundingClientRect();
                const radius = getComputedStyle(activeCard).borderRadius || '16px';
                const left = rect.left / cachedZoom;
                const top = rect.top / cachedZoom;
                const w = rect.width / cachedZoom;
                const h = rect.height / cachedZoom;

                morphEl.style.transition = isScroll ? T_SCROLL : T_MORPH;
                morphEl.style.width = `${w}px`;
                morphEl.style.height = `${h}px`;
                morphEl.style.borderRadius = radius;
                morphEl.style.transform = `translate3d(${left}px, ${top}px, 0)`;
                morphEl.style.opacity = '0.4';

                // A bolinha se desintegra e fica invisível
                contrastEl.style.opacity = '0';
            } else {
                // Ao sair do card, o morph faz fade out imediatamente no lugar (sem virar segunda bola)
                morphEl.style.opacity = '0';

                // A bolinha reaparece perfeitamente na posição real com sua física contínua
                contrastEl.style.opacity = '1';
            }
        };

        // Loop contínuo com física de inércia suave (0.02)
        const renderLoop = () => {
            const targetX = mouseX / cachedZoom;
            const targetY = mouseY / cachedZoom;

            ringX += (targetX - ringX) * 0.02;
            ringY += (targetY - ringY) * 0.02;

            contrastEl.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

            loopRaf = requestAnimationFrame(renderLoop);
        };
        loopRaf = requestAnimationFrame(renderLoop);

        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Detecta se está sobre texto
            const isText = checkIsText(e.target);
            if (isText !== isTextHovered) {
                isTextHovered = isText;
                const targetSize = isTextHovered ? TEXT_HOVER_SIZE : DEFAULT_SIZE;
                contrastEl.style.width = `${targetSize}px`;
                contrastEl.style.height = `${targetSize}px`;
            }

            if (moveRaf) return;

            moveRaf = requestAnimationFrame(() => {
                moveRaf = null;
                const card = findCard(e.target);

                if (card !== activeCard) {
                    activeCard = card;

                    if (activeCard) {
                        // Ao entrar no card, posiciona o morph inicialmente na posição da bolinha para abrir fluido
                        if (morphEl.style.opacity === '0' || !morphEl.style.opacity) {
                            const size = isTextHovered ? TEXT_HOVER_SIZE : DEFAULT_SIZE;
                            morphEl.style.transition = 'none';
                            morphEl.style.width = `${size}px`;
                            morphEl.style.height = `${size}px`;
                            morphEl.style.borderRadius = '50%';
                            morphEl.style.transform = `translate3d(${ringX - size / 2}px, ${ringY - size / 2}px, 0)`;
                            // Força reflow para aplicar animação de expansão a partir da bolinha
                            void morphEl.offsetWidth;
                        }
                        updateMorphPosition(false);
                    } else {
                        updateMorphPosition(false);
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
            if (moveRaf) cancelAnimationFrame(moveRaf);
            if (scrollRaf) cancelAnimationFrame(scrollRaf);
            if (loopRaf) cancelAnimationFrame(loopRaf);
        };
    }, []);

    if (isTouchDevice()) return null;

    return (
        <>
            {/* 1. Bola de contraste invertido (expande em textos e se desintegra ao entrar em morph) */}
            <div
                ref={contrastRef}
                className="pointer-events-none fixed top-0 left-0 z-[99999] rounded-full will-change-transform"
                style={{
                    width: `${DEFAULT_SIZE}px`,
                    height: `${DEFAULT_SIZE}px`,
                    backgroundColor: '#ffffff',
                    mixBlendMode: 'difference',
                    opacity: 1,
                    transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease',
                    transform: 'translate3d(-200px, -200px, 0) translate(-50%, -50%)',
                }}
            />

            {/* 2. Efeito Morph único (surge suavemente da bolinha e abraça o card, desaparecendo sem criar anel fantasma) */}
            <div
                ref={morphRef}
                className="pointer-events-none fixed top-0 left-0 z-[99998] transform-gpu"
                style={{
                    width: `${DEFAULT_SIZE}px`,
                    height: `${DEFAULT_SIZE}px`,
                    borderRadius: '50%',
                    border: '1.5px solid var(--color-accent, #8C6A4A)',
                    background: 'rgba(var(--color-accent-rgb, 140, 106, 74), 0.08)',
                    boxShadow: '0 0 20px rgba(var(--color-accent-rgb, 140, 106, 74), 0.15)',
                    opacity: 0,
                    transition: 'opacity 0.22s ease',
                    willChange: 'transform, width, height, border-radius, opacity',
                    transform: 'translate3d(-200px, -200px, 0)',
                    contain: 'layout style',
                }}
            />
        </>
    );
}
