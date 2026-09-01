import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

// Diâmetro padrão em repouso (22px, tamanho ideal sem poluição visual)
const DEFAULT_SIZE = 22;

// Física de mola calibrada e orgânica (Framer Motion Spring Physics)
const SPRING_TRANSITION = {
    type: 'spring',
    damping: 25,
    stiffness: 250,
    mass: 0.6,
};

export default function CustomCursor() {
    const [isTouch, setIsTouch] = useState(false);
    const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
    const [cursorState, setCursorState] = useState({
        mode: 'default', // 'default' | 'text' | 'button' | 'card'
        x: -100,
        y: -100,
        width: DEFAULT_SIZE,
        height: DEFAULT_SIZE,
        borderRadius: '50%',
        isNoMorph: false,
        isOffscreen: true,
    });

    const posRef = useRef({ x: -100, y: -100 });
    const targetRef = useRef(null);
    const isNoMorphRef = useRef(false);
    const isOffscreenRef = useRef(true);
    const rafRef = useRef(null);
    const cachedZoomRef = useRef(1);

    // Desativa o cursor virtual em dispositivos touch
    useEffect(() => {
        const checkTouch = () => {
            return (
                'ontouchstart' in window ||
                navigator.maxTouchPoints > 0 ||
                window.matchMedia('(pointer: coarse)').matches
            );
        };
        setIsTouch(checkTouch());
    }, []);

    // Sincroniza o zoom global do CSS (0.8)
    useEffect(() => {
        const updateZoom = () => {
            cachedZoomRef.current = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
        };
        updateZoom();
        window.addEventListener('resize', updateZoom, { passive: true });
        return () => window.removeEventListener('resize', updateZoom);
    }, []);

    // Atualiza estado e dimensões com renderização suave
    const updateCursor = useCallback(() => {
        const zoom = cachedZoomRef.current;
        const currentPos = posRef.current;
        const targetData = targetRef.current;

        setMousePos({ x: currentPos.x, y: currentPos.y });

        if (isNoMorphRef.current || isOffscreenRef.current) {
            setCursorState(prev => ({
                ...prev,
                mode: 'default',
                isNoMorph: isNoMorphRef.current,
                isOffscreen: isOffscreenRef.current,
            }));
            return;
        }

        if (targetData?.type === 'button' || targetData?.type === 'card') {
            const isButton = targetData.type === 'button';
            const rect = targetData.el.getBoundingClientRect();
            const comp = window.getComputedStyle(targetData.el);
            let radius = comp.borderRadius || '16px';

            if (radius.includes('%') || parseFloat(radius) >= 24) {
                radius = isButton ? '9999px' : '24px';
            } else {
                radius = `${(parseFloat(radius) || 12) + (isButton ? 3 : 2)}px`;
            }

            const pad = isButton ? 3 : 4;
            const targetLeft = rect.left / zoom - pad;
            const targetTop = rect.top / zoom - pad;
            const targetWidth = rect.width / zoom + pad * 2;
            const targetHeight = rect.height / zoom + pad * 2;

            // Atração magnética sutil (mais expressiva em botões, micro-parallax em cards grandes)
            const centerX = targetLeft + targetWidth / 2;
            const centerY = targetTop + targetHeight / 2;
            let pullX = 0;
            let pullY = 0;

            if (isButton) {
                pullX = (currentPos.x - centerX) * 0.14;
                pullY = (currentPos.y - centerY) * 0.14;
            } else {
                pullX = Math.max(-6, Math.min(6, (currentPos.x - centerX) * 0.02));
                pullY = Math.max(-6, Math.min(6, (currentPos.y - centerY) * 0.02));
            }

            setCursorState({
                mode: isButton ? 'button' : 'card',
                x: targetLeft + pullX,
                y: targetTop + pullY,
                width: targetWidth,
                height: targetHeight,
                borderRadius: radius,
                isNoMorph: false,
                isOffscreen: false,
            });
        } else if (targetData?.type === 'text') {
            // Superfície de texto livre: expansão suave de 60% com mix-blend-mode difference
            setCursorState({
                mode: 'text',
                x: currentPos.x - DEFAULT_SIZE / 2,
                y: currentPos.y - DEFAULT_SIZE / 2,
                width: DEFAULT_SIZE,
                height: DEFAULT_SIZE,
                borderRadius: '50%',
                isNoMorph: false,
                isOffscreen: false,
            });
        } else {
            // Estado livre: tamanho normal (22px)
            setCursorState({
                mode: 'default',
                x: currentPos.x - DEFAULT_SIZE / 2,
                y: currentPos.y - DEFAULT_SIZE / 2,
                width: DEFAULT_SIZE,
                height: DEFAULT_SIZE,
                borderRadius: '50%',
                isNoMorph: false,
                isOffscreen: false,
            });
        }
    }, []);

    // Identifica o elemento e categoria sob o ponteiro
    const resolveTarget = (el) => {
        if (!el || el === document.body || el === document.documentElement) return null;
        if (el.closest('[data-no-morph="true"], .no-morph, canvas')) return null;

        // 1. Botões, links, switches e pílulas de filtro (maior prioridade interativa)
        const buttonCandidate = el.closest(
            'button, a, [data-cursor-morph="true"], .cursor-morph, [role="button"], input[type="submit"], input[type="button"]'
        );
        if (buttonCandidate && !buttonCandidate.closest('[data-no-morph="true"], .no-morph')) {
            const rect = buttonCandidate.getBoundingClientRect();
            const w = rect.width / cachedZoomRef.current;
            const h = rect.height / cachedZoomRef.current;
            if (w >= 18 && h >= 18 && w <= 420 && h <= 100) {
                return { type: 'button', el: buttonCandidate };
            }
        }

        // 2. Cards de conteúdo (Sobre Mim, Educação, Experiência, Projetos, Skills, Bento Grid)
        const cardCandidate = el.closest(
            '[data-cursor-card="true"], [data-cursor="morph"], [data-cursor-card], .rounded-2xl.border, .rounded-xl.border, [class*="rounded-2xl"][class*="border"], [class*="rounded-xl"][class*="border"], .group.border'
        );
        if (
            cardCandidate &&
            cardCandidate !== document.body &&
            cardCandidate !== document.documentElement &&
            cardCandidate.tagName !== 'SECTION' &&
            cardCandidate.tagName !== 'MAIN' &&
            !cardCandidate.closest('[data-no-morph="true"], .no-morph')
        ) {
            const rect = cardCandidate.getBoundingClientRect();
            const w = rect.width / cachedZoomRef.current;
            const h = rect.height / cachedZoomRef.current;
            if (w >= 70 && h >= 40 && w <= 1400 && h <= 950) {
                return { type: 'card', el: cardCandidate };
            }
        }

        // 3. Superfícies de texto livre (títulos, cabeçalhos, parágrafos fora de cards)
        const textCandidate = el.closest(
            'h1, h2, h3, h4, h5, h6, p, span, strong, em, b, i, blockquote, li, code, label'
        );
        if (textCandidate && !textCandidate.closest('[data-no-morph="true"], .no-morph')) {
            const text = textCandidate.textContent?.trim?.();
            if (text && text.length > 0) {
                return { type: 'text', el: textCandidate };
            }
        }

        return null;
    };

    useEffect(() => {
        if (isTouch) return;

        const onMouseMove = (e) => {
            const zoom = cachedZoomRef.current;
            posRef.current = {
                x: e.clientX / zoom,
                y: e.clientY / zoom,
            };
            isOffscreenRef.current = false;

            // Verificação em tempo real de saída suave na área do Canvas 3D
            const hitNoMorph = Boolean(e.target?.closest?.('[data-no-morph="true"], .no-morph, canvas'));
            isNoMorphRef.current = hitNoMorph;

            targetRef.current = hitNoMorph ? null : resolveTarget(e.target);

            if (!rafRef.current) {
                rafRef.current = requestAnimationFrame(() => {
                    rafRef.current = null;
                    updateCursor();
                });
            }
        };

        const onScroll = () => {
            if (targetRef.current?.type === 'button' || targetRef.current?.type === 'card') {
                if (!rafRef.current) {
                    rafRef.current = requestAnimationFrame(() => {
                        rafRef.current = null;
                        updateCursor();
                    });
                }
            }
        };

        const onMouseLeave = () => {
            isOffscreenRef.current = true;
            targetRef.current = null;
            updateCursor();
        };

        const onMouseEnter = () => {
            isOffscreenRef.current = false;
            updateCursor();
        };

        // Handlers de saída e retorno suaves na Esfera 3D
        const onNoMorphEnter = () => {
            isNoMorphRef.current = true;
            targetRef.current = null;
            updateCursor();
        };

        const onNoMorphLeave = () => {
            isNoMorphRef.current = false;
            updateCursor();
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true });
        document.addEventListener('mouseleave', onMouseLeave);
        document.addEventListener('mouseenter', onMouseEnter);
        window.addEventListener('cursor-no-morph-enter', onNoMorphEnter);
        window.addEventListener('cursor-no-morph-leave', onNoMorphLeave);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('scroll', onScroll);
            document.removeEventListener('mouseleave', onMouseLeave);
            document.removeEventListener('mouseenter', onMouseEnter);
            window.removeEventListener('cursor-no-morph-enter', onNoMorphEnter);
            window.removeEventListener('cursor-no-morph-leave', onNoMorphLeave);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [isTouch, updateCursor]);

    if (isTouch) return null;

    const isHidden = cursorState.isOffscreen || cursorState.isNoMorph;

    return (
        <motion.div
            className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform transform-gpu"
            animate={
                isHidden
                    ? {
                          x: mousePos.x - DEFAULT_SIZE / 2,
                          y: mousePos.y - DEFAULT_SIZE / 2,
                          width: DEFAULT_SIZE,
                          height: DEFAULT_SIZE,
                          borderRadius: '50%',
                          opacity: 0,
                          scale: 0.5,
                          backgroundColor: '#ffffff',
                          border: '0px solid transparent',
                          boxShadow: 'none',
                          backdropFilter: 'none',
                          WebkitBackdropFilter: 'none',
                          mixBlendMode: 'difference',
                      }
                    : cursorState.mode === 'button'
                    ? {
                          // Morph translúcido em botões: contorno suave e texto 100% legível
                          x: cursorState.x,
                          y: cursorState.y,
                          width: cursorState.width,
                          height: cursorState.height,
                          borderRadius: cursorState.borderRadius,
                          opacity: 1,
                          scale: 1,
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          boxShadow: '0 0 20px rgba(255, 255, 255, 0.08)',
                          backdropFilter: 'blur(2px)',
                          WebkitBackdropFilter: 'blur(2px)',
                          mixBlendMode: 'normal',
                      }
                    : cursorState.mode === 'card'
                    ? {
                          // Morph translúcido elegante em cards: contorno sem fundo branco opaco
                          x: cursorState.x,
                          y: cursorState.y,
                          width: cursorState.width,
                          height: cursorState.height,
                          borderRadius: cursorState.borderRadius,
                          opacity: 1,
                          scale: 1,
                          backgroundColor: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          boxShadow: '0 0 30px rgba(255, 255, 255, 0.04)',
                          backdropFilter: 'blur(2px)',
                          WebkitBackdropFilter: 'blur(2px)',
                          mixBlendMode: 'normal',
                      }
                    : cursorState.mode === 'text'
                    ? {
                          // Expansão suave de 60% em textos livres com inversão dinâmica
                          x: mousePos.x - DEFAULT_SIZE / 2,
                          y: mousePos.y - DEFAULT_SIZE / 2,
                          width: DEFAULT_SIZE,
                          height: DEFAULT_SIZE,
                          borderRadius: '50%',
                          opacity: 1,
                          scale: 1.6,
                          backgroundColor: '#ffffff',
                          border: '0px solid transparent',
                          boxShadow: 'none',
                          backdropFilter: 'none',
                          WebkitBackdropFilter: 'none',
                          mixBlendMode: 'difference',
                      }
                    : {
                          // Estado livre padrão: bolinha compacta de 22px
                          x: mousePos.x - DEFAULT_SIZE / 2,
                          y: mousePos.y - DEFAULT_SIZE / 2,
                          width: DEFAULT_SIZE,
                          height: DEFAULT_SIZE,
                          borderRadius: '50%',
                          opacity: 1,
                          scale: 1,
                          backgroundColor: '#ffffff',
                          border: '0px solid transparent',
                          boxShadow: 'none',
                          backdropFilter: 'none',
                          WebkitBackdropFilter: 'none',
                          mixBlendMode: 'difference',
                      }
            }
            transition={SPRING_TRANSITION}
        />
    );
}
