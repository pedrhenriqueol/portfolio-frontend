import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

// Diâmetro padrão em repouso (22px)
const DEFAULT_SIZE = 22;

// Física de mola ultra-fluida e responsiva
const SPRING_TRANSITION = {
    type: 'spring',
    damping: 26,
    stiffness: 260,
    mass: 0.55,
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
    const lastCardRef = useRef(null);
    const leaveCardTimerRef = useRef(null);
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

    // Atualiza estado e dimensões com precisão pixel-perfect
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

        if (targetData?.type === 'button') {
            const rect = targetData.el.getBoundingClientRect();
            const comp = window.getComputedStyle(targetData.el);
            let radius = comp.borderRadius || '12px';

            if (radius.includes('%') || parseFloat(radius) >= 20) {
                radius = '9999px';
            } else {
                radius = `${(parseFloat(radius) || 8) + 3}px`;
            }

            const pad = 3;
            const targetLeft = rect.left / zoom - pad;
            const targetTop = rect.top / zoom - pad;
            const targetWidth = rect.width / zoom + pad * 2;
            const targetHeight = rect.height / zoom + pad * 2;

            const centerX = targetLeft + targetWidth / 2;
            const centerY = targetTop + targetHeight / 2;
            const pullX = (currentPos.x - centerX) * 0.14;
            const pullY = (currentPos.y - centerY) * 0.14;

            setCursorState({
                mode: 'button',
                x: targetLeft + pullX,
                y: targetTop + pullY,
                width: targetWidth,
                height: targetHeight,
                borderRadius: radius,
                isNoMorph: false,
                isOffscreen: false,
            });
        } else if (targetData?.type === 'card') {
            // Morph em cards: fixação precisa nas bordas do card sob zoom
            const rect = targetData.el.getBoundingClientRect();
            const comp = window.getComputedStyle(targetData.el);
            let radius = comp.borderRadius || '16px';

            if (radius.includes('%') || parseFloat(radius) >= 24) {
                radius = '24px';
            } else {
                radius = comp.borderRadius || '16px';
            }

            const targetLeft = rect.left / zoom;
            const targetTop = rect.top / zoom;
            const targetWidth = rect.width / zoom;
            const targetHeight = rect.height / zoom;

            setCursorState({
                mode: 'card',
                x: targetLeft,
                y: targetTop,
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
            // Estado livre: bolinha compacta de 22px
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

        // 1. Botões, links, switches e pílulas (maior prioridade interativa)
        const buttonCandidate = el.closest(
            'button, a, [data-cursor-morph="true"], .cursor-morph, [role="button"], input[type="submit"], input[type="button"]'
        );
        if (buttonCandidate && !buttonCandidate.closest('[data-no-morph="true"], .no-morph')) {
            const rect = buttonCandidate.getBoundingClientRect();
            const w = rect.width / cachedZoomRef.current;
            const h = rect.height / cachedZoomRef.current;
            if (w >= 16 && h >= 16 && w <= 380 && h <= 90) {
                return { type: 'button', el: buttonCandidate };
            }
        }

        // 2. Cards explícitos (Sobre Mim: Bio, Educação, Horário, 3 Pilares; Experiência: Stats, Timeline)
        // Exclui especificamente Projetos e Grade Detalhada de Habilidades conforme solicitado
        const cardCandidate = el.closest('[data-cursor-card="true"]');
        if (
            cardCandidate &&
            !cardCandidate.closest('[data-no-morph="true"], [data-no-card-morph="true"], #projetos, #conhecimentos')
        ) {
            const rect = cardCandidate.getBoundingClientRect();
            const w = rect.width / cachedZoomRef.current;
            const h = rect.height / cachedZoomRef.current;
            if (w >= 70 && h >= 40 && w <= 1400 && h <= 950) {
                return { type: 'card', el: cardCandidate };
            }
        }

        // 3. Superfícies de texto livre fora de cards
        const textCandidate = el.closest(
            'h1, h2, h3, h4, h5, h6, p, span, strong, em, b, i, blockquote, li, code, label'
        );
        if (textCandidate && !textCandidate.closest('[data-no-morph="true"], .no-morph, [data-cursor-card="true"]')) {
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

            // Verificação de saída suave na área do Canvas 3D
            const hitNoMorph = Boolean(e.target?.closest?.('[data-no-morph="true"], .no-morph, canvas'));
            isNoMorphRef.current = hitNoMorph;

            if (hitNoMorph) {
                targetRef.current = null;
                lastCardRef.current = null;
                if (leaveCardTimerRef.current) clearTimeout(leaveCardTimerRef.current);
            } else {
                const detected = resolveTarget(e.target);

                if (detected?.type === 'card') {
                    // Cancela qualquer timer de saída: transição direta e suave entre cards
                    if (leaveCardTimerRef.current) {
                        clearTimeout(leaveCardTimerRef.current);
                        leaveCardTimerRef.current = null;
                    }
                    lastCardRef.current = detected;
                    targetRef.current = detected;
                } else if (detected?.type === 'button' || detected?.type === 'text') {
                    if (leaveCardTimerRef.current) clearTimeout(leaveCardTimerRef.current);
                    lastCardRef.current = null;
                    targetRef.current = detected;
                } else {
                    // Se estiver no gap entre cards (ao mover de um card para o outro):
                    // Mantém o estado do card por 70ms para permitir que a mola deslize direto para o próximo card sem pipocar em branco!
                    if (lastCardRef.current && !leaveCardTimerRef.current) {
                        leaveCardTimerRef.current = setTimeout(() => {
                            lastCardRef.current = null;
                            leaveCardTimerRef.current = null;
                            targetRef.current = null;
                            updateCursor();
                        }, 70);
                    } else if (!lastCardRef.current) {
                        targetRef.current = null;
                    }
                }
            }

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
            lastCardRef.current = null;
            if (leaveCardTimerRef.current) clearTimeout(leaveCardTimerRef.current);
            updateCursor();
        };

        const onMouseEnter = () => {
            isOffscreenRef.current = false;
            updateCursor();
        };

        const onNoMorphEnter = () => {
            isNoMorphRef.current = true;
            targetRef.current = null;
            lastCardRef.current = null;
            if (leaveCardTimerRef.current) clearTimeout(leaveCardTimerRef.current);
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
            if (leaveCardTimerRef.current) clearTimeout(leaveCardTimerRef.current);
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
                          // Morph em botões: contorno translúcido fino sem blur
                          x: cursorState.x,
                          y: cursorState.y,
                          width: cursorState.width,
                          height: cursorState.height,
                          borderRadius: cursorState.borderRadius,
                          opacity: 1,
                          scale: 1,
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.45)',
                          boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'none',
                          WebkitBackdropFilter: 'none',
                          mixBlendMode: 'normal',
                      }
                    : cursorState.mode === 'card'
                    ? {
                          // Morph em cards: 100% transparente (ZERO opacidade, ZERO blur, texto 100% nítido)
                          x: cursorState.x,
                          y: cursorState.y,
                          width: cursorState.width,
                          height: cursorState.height,
                          borderRadius: cursorState.borderRadius,
                          opacity: 1,
                          scale: 1,
                          backgroundColor: 'transparent',
                          border: '1.5px solid rgba(var(--color-accent-rgb, 140, 106, 74), 0.55)',
                          boxShadow: '0 0 25px rgba(var(--color-accent-rgb, 140, 106, 74), 0.15)',
                          backdropFilter: 'none',
                          WebkitBackdropFilter: 'none',
                          mixBlendMode: 'normal',
                      }
                    : cursorState.mode === 'text'
                    ? {
                          // Expansão suave de 60% em textos livres fora de cards
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
