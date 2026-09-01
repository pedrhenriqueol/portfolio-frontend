import { useEffect, useRef } from 'react';

const DEFAULT_SIZE = 26;
const TEXT_HOVER_SIZE = 44;

const isTouchDevice = () => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export default function CursorGlow() {
    const cursorRef = useRef(null);

    useEffect(() => {
        if (isTouchDevice()) return;

        const cursorEl = cursorRef.current;
        if (!cursorEl) return;

        let mouseX = -200;
        let mouseY = -200;
        let ringX = -200;
        let ringY = -200;
        let curSize = DEFAULT_SIZE;
        let targetSize = DEFAULT_SIZE;
        let isInsideNoMorphArea = false;

        // Propriedades contínuas do Morph interpoladas a 60fps
        let morphState = {
            active: false,
            left: 0,
            top: 0,
            width: DEFAULT_SIZE,
            height: DEFAULT_SIZE,
            radius: '50%',
            progress: 0, // 0 = esfera livre, 1 = morph no card
        };

        let targetMorph = {
            active: false,
            left: 0,
            top: 0,
            width: DEFAULT_SIZE,
            height: DEFAULT_SIZE,
            radius: '50%',
        };

        let currentCard = null;
        let moveRaf = null;
        let loopRaf = null;
        let cachedZoom = 0.8;

        const updateZoom = () => {
            cachedZoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
        };
        updateZoom();
        window.addEventListener('resize', updateZoom, { passive: true });

        // Listeners para sincronização global de bounds da esfera/globo
        const onNoMorphEnter = () => {
            isInsideNoMorphArea = true;
            targetMorph.active = false;
            currentCard = null;
            cursorEl.style.opacity = '0';
        };

        const onNoMorphLeave = () => {
            isInsideNoMorphArea = false;
            cursorEl.style.opacity = '1';
        };

        window.addEventListener('cursor-no-morph-enter', onNoMorphEnter);
        window.addEventListener('cursor-no-morph-leave', onNoMorphLeave);

        // Identifica com precisão se o cursor está sobre um card ou botão morphável
        const findCard = (target) => {
            if (!target || target === document.body || target === document.documentElement) return null;
            if (isInsideNoMorphArea || target.closest('[data-no-morph="true"], .no-morph, nav, input, textarea, canvas, svg')) return null;

            const candidate = target.closest(
                '[data-cursor-morph="true"], .cursor-morph, .rounded-2xl.border, .rounded-xl.border, [class*="rounded-2xl"][class*="border"], [class*="rounded-xl"][class*="border"], .group.border'
            );
            if (!candidate || candidate.closest('[data-no-morph="true"], .no-morph')) return null;

            if (candidate === currentCard) return candidate;

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
            if (!target || isInsideNoMorphArea) return false;
            if (findCard(target)) return false;

            const textEl = target.closest(
                'h1, h2, h3, h4, h5, h6, p, span, strong, em, b, i, code, label, blockquote, li'
            );
            if (!textEl) return false;

            const hasText = textEl.textContent && textEl.textContent.trim().length > 0;
            return hasText;
        };

        const lerp = (a, b, t) => a + (b - a) * t;

        // Loop contínuo com interpolação física ultra-suave a 60 FPS
        const renderLoop = () => {
            const targetX = mouseX / cachedZoom;
            const targetY = mouseY / cachedZoom;

            // Tracking contínuo com interpolação orgânica (sempre segue a posição real sem travar)
            ringX += (targetX - ringX) * 0.14;
            ringY += (targetY - ringY) * 0.14;

            // Transição física orgânica de tamanho para textos
            curSize = lerp(curSize, targetSize, 0.12);

            // Interpolação suave do estado Morph (0 = livre, 1 = card)
            const targetProgress = targetMorph.active ? 1 : 0;
            morphState.progress = lerp(morphState.progress, targetProgress, 0.14);

            if (targetMorph.active) {
                morphState.left = lerp(morphState.left, targetMorph.left, 0.16);
                morphState.top = lerp(morphState.top, targetMorph.top, 0.16);
                morphState.width = lerp(morphState.width, targetMorph.width, 0.16);
                morphState.height = lerp(morphState.height, targetMorph.height, 0.16);
                morphState.radius = targetMorph.radius;
            }

            if (morphState.progress > 0.01) {
                // Estado híbrido/interpolando entre bolinha e card
                const p = morphState.progress;
                const ballLeft = ringX - curSize / 2;
                const ballTop = ringY - curSize / 2;

                const curLeft = lerp(ballLeft, morphState.left, p);
                const curTop = lerp(ballTop, morphState.top, p);
                const curW = lerp(curSize, morphState.width, p);
                const curH = lerp(curSize, morphState.height, p);

                cursorEl.style.transform = `translate3d(${curLeft}px, ${curTop}px, 0)`;
                cursorEl.style.width = `${curW}px`;
                cursorEl.style.height = `${curH}px`;
                cursorEl.style.borderRadius = p > 0.5 ? morphState.radius : '50%';

                if (p > 0.6) {
                    cursorEl.style.mixBlendMode = 'normal';
                    cursorEl.style.backgroundColor = 'rgba(var(--color-accent-rgb, 140, 106, 74), 0.08)';
                    cursorEl.style.border = '1.5px solid var(--color-accent, #8C6A4A)';
                    cursorEl.style.boxShadow = '0 0 24px rgba(var(--color-accent-rgb, 140, 106, 74), 0.18)';
                } else {
                    cursorEl.style.mixBlendMode = 'difference';
                    cursorEl.style.backgroundColor = '#ffffff';
                    cursorEl.style.border = 'none';
                    cursorEl.style.boxShadow = 'none';
                }
            } else {
                // Estado 100% livre esférico
                const curLeft = ringX - curSize / 2;
                const curTop = ringY - curSize / 2;

                cursorEl.style.transform = `translate3d(${curLeft}px, ${curTop}px, 0)`;
                cursorEl.style.width = `${curSize}px`;
                cursorEl.style.height = `${curSize}px`;
                cursorEl.style.borderRadius = '50%';
                cursorEl.style.mixBlendMode = 'difference';
                cursorEl.style.backgroundColor = '#ffffff';
                cursorEl.style.border = 'none';
                cursorEl.style.boxShadow = 'none';
            }

            loopRaf = requestAnimationFrame(renderLoop);
        };
        loopRaf = requestAnimationFrame(renderLoop);

        const updateCardDimensions = (card) => {
            if (!card) {
                targetMorph.active = false;
                currentCard = null;
                return;
            }
            currentCard = card;
            const rect = card.getBoundingClientRect();
            targetMorph.active = true;
            targetMorph.left = rect.left / cachedZoom;
            targetMorph.top = rect.top / cachedZoom;
            targetMorph.width = rect.width / cachedZoom;
            targetMorph.height = rect.height / cachedZoom;
            targetMorph.radius = getComputedStyle(card).borderRadius || '16px';
        };

        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Verificação em tempo real de bounds no-morph
            const hitNoMorph = e.target && (e.target.closest('[data-no-morph="true"], .no-morph, canvas') !== null);
            if (hitNoMorph !== isInsideNoMorphArea) {
                isInsideNoMorphArea = hitNoMorph;
                cursorEl.style.opacity = hitNoMorph ? '0' : '1';
                if (hitNoMorph) {
                    targetMorph.active = false;
                    currentCard = null;
                }
            }

            if (isInsideNoMorphArea) return;

            // Detecta texto e define o tamanho alvo para interpolação suave
            const isText = checkIsText(e.target);
            targetSize = isText ? TEXT_HOVER_SIZE : DEFAULT_SIZE;

            if (moveRaf) return;

            moveRaf = requestAnimationFrame(() => {
                moveRaf = null;
                const card = findCard(e.target);
                if (card) {
                    if (!targetMorph.active) {
                        morphState.left = ringX - curSize / 2;
                        morphState.top = ringY - curSize / 2;
                        morphState.width = curSize;
                        morphState.height = curSize;
                    }
                    updateCardDimensions(card);
                } else {
                    targetMorph.active = false;
                    currentCard = null;
                }
            });
        };

        const onScroll = () => {
            if (targetMorph.active) {
                const hoveredEl = document.elementFromPoint(mouseX, mouseY);
                const card = findCard(hoveredEl);
                if (card) updateCardDimensions(card);
                else {
                    targetMorph.active = false;
                    currentCard = null;
                }
            }
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', updateZoom);
            window.removeEventListener('cursor-no-morph-enter', onNoMorphEnter);
            window.removeEventListener('cursor-no-morph-leave', onNoMorphLeave);
            if (moveRaf) cancelAnimationFrame(moveRaf);
            if (loopRaf) cancelAnimationFrame(loopRaf);
        };
    }, []);

    if (isTouchDevice()) return null;

    return (
        /* Cursor com transição fluida de opacidade, escala e aceleração por GPU */
        <div
            ref={cursorRef}
            className="pointer-events-none fixed top-0 left-0 z-[99999] will-change-transform transform-gpu transition-opacity duration-200 ease-out"
            style={{
                width: `${DEFAULT_SIZE}px`,
                height: `${DEFAULT_SIZE}px`,
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                mixBlendMode: 'difference',
                transform: 'translate3d(-200px, -200px, 0)',
                contain: 'layout style',
                opacity: 1,
            }}
        />
    );
}
