import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Diâmetro base em repouso (22px)
const DEFAULT_SIZE = 22;

// Física de resposta instantânea e amortecimento suave (sem delay)
const SPRING_TRANSITION = {
    type: 'spring',
    damping: 36,
    stiffness: 750,
    mass: 0.1,
};

export default function CustomCursor() {
    const [isTouch, setIsTouch] = useState(false);
    const [cursorMode, setCursorMode] = useState('hidden'); // 'default' | 'card' | 'button' | 'hidden'
    const [buttonDimensions, setButtonDimensions] = useState({
        width: DEFAULT_SIZE,
        height: DEFAULT_SIZE,
        borderRadius: '50%',
    });

    // Posições desacopladas do estado React (Zero Re-render durante mousemove)
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const smoothX = useSpring(cursorX, SPRING_TRANSITION);
    const smoothY = useSpring(cursorY, SPRING_TRANSITION);

    const posRef = useRef({ x: -100, y: -100 });
    const targetRef = useRef(null);
    const isNoMorphRef = useRef(false);
    const isOffscreenRef = useRef(true);
    const rafRef = useRef(null);
    const cachedZoomRef = useRef(0.8);

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

    // Sincroniza o zoom global do CSS (0.8) com fallback universal
    useEffect(() => {
        const updateZoom = () => {
            const styleZoom = parseFloat(getComputedStyle(document.documentElement).zoom);
            if (!isNaN(styleZoom) && styleZoom > 0) {
                cachedZoomRef.current = styleZoom;
                return;
            }
            if (document.documentElement.clientWidth > 0) {
                const ratio = window.innerWidth / document.documentElement.clientWidth;
                if (ratio > 0.4 && ratio < 2.0) {
                    cachedZoomRef.current = ratio;
                    return;
                }
            }
            cachedZoomRef.current = 0.8;
        };
        updateZoom();
        window.addEventListener('resize', updateZoom, { passive: true });
        return () => window.removeEventListener('resize', updateZoom);
    }, []);

    // Atualiza estado e dimensões aceleradas por GPU sem forçar re-render em cada pixel
    const updateCursor = useCallback(() => {
        const zoom = cachedZoomRef.current;
        const currentPos = posRef.current;
        const targetData = targetRef.current;

        const isHidden = isNoMorphRef.current || isOffscreenRef.current;
        if (isHidden) {
            cursorX.set(currentPos.x - DEFAULT_SIZE / 2);
            cursorY.set(currentPos.y - DEFAULT_SIZE / 2);
            setCursorMode(prev => (prev === 'hidden' ? prev : 'hidden'));
            return;
        }

        if (targetData?.type === 'button') {
            // Micro-elementos clicáveis: morph magnético restrito com atração sutil
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

            cursorX.set(targetLeft + pullX);
            cursorY.set(targetTop + pullY);

            setCursorMode(prev => (prev === 'button' ? prev : 'button'));
            setButtonDimensions(prev => {
                if (prev.width === targetWidth && prev.height === targetHeight && prev.borderRadius === radius) {
                    return prev;
                }
                return { width: targetWidth, height: targetHeight, borderRadius: radius };
            });
        } else if (targetData?.type === 'card' || targetData?.type === 'text') {
            // Cards Grandes & Superfícies de Leitura: bolinha segue livremente com escala 1.8
            cursorX.set(currentPos.x - DEFAULT_SIZE / 2);
            cursorY.set(currentPos.y - DEFAULT_SIZE / 2);
            setCursorMode(prev => (prev === 'card' ? prev : 'card'));
        } else {
            // Estado livre padrão: bolinha circular de 22px
            cursorX.set(currentPos.x - DEFAULT_SIZE / 2);
            cursorY.set(currentPos.y - DEFAULT_SIZE / 2);
            setCursorMode(prev => (prev === 'default' ? prev : 'default'));
        }
    }, [cursorX, cursorY]);

    // Identifica o elemento e categoria sob o ponteiro
    const resolveTarget = (el) => {
        if (!el || el === document.body || el === document.documentElement) return null;
        if (el.closest('[data-no-morph="true"], .no-morph, canvas')) return null;

        // 1. Micro-elementos clicáveis compactos (Botões CTA, Badges, Links, Pílulas de filtro, Fechar modal)
        const buttonCandidate = el.closest(
            'button, a, [data-cursor-morph="true"], .cursor-morph, [role="button"], input[type="submit"], input[type="button"]'
        );
        if (buttonCandidate && !buttonCandidate.closest('[data-no-morph="true"], .no-morph')) {
            const rect = buttonCandidate.getBoundingClientRect();
            const w = rect.width / cachedZoomRef.current;
            const h = rect.height / cachedZoomRef.current;
            // Limita a alvos interativos compactos (evita cards inteiros)
            if (w >= 16 && h >= 16 && w <= 380 && h <= 90) {
                return { type: 'button', el: buttonCandidate };
            }
        }

        // 2. Cards Grandes (Sobre Mim, Experiência, Projetos, etc.) e containers de leitura
        const cardCandidate = el.closest(
            '[data-cursor-card="true"], [data-cursor-card], .rounded-2xl.border, .rounded-xl.border, [class*="rounded-2xl"][class*="border"], [class*="rounded-xl"][class*="border"], .group.border'
        );
        if (
            cardCandidate &&
            cardCandidate !== document.body &&
            cardCandidate !== document.documentElement &&
            cardCandidate.tagName !== 'SECTION' &&
            cardCandidate.tagName !== 'MAIN' &&
            !cardCandidate.closest('[data-no-morph="true"], .no-morph')
        ) {
            return { type: 'card', el: cardCandidate };
        }

        // 3. Superfícies de texto livre fora de cards
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

            // Verificação de saída suave na área do Canvas 3D
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
            const zoom = cachedZoomRef.current;
            const mouseX = posRef.current.x * zoom;
            const mouseY = posRef.current.y * zoom;

            // Se o mouse estiver sobre a página enquanto ela rola, atualiza dinamicamente o alvo
            if (mouseX >= 0 && mouseY >= 0 && mouseX <= window.innerWidth && mouseY <= window.innerHeight) {
                const elUnderPointer = document.elementFromPoint(mouseX, mouseY);
                const hitNoMorph = Boolean(elUnderPointer?.closest?.('[data-no-morph="true"], .no-morph, canvas'));
                isNoMorphRef.current = hitNoMorph;
                targetRef.current = hitNoMorph ? null : resolveTarget(elUnderPointer);
            }

            if (!rafRef.current) {
                rafRef.current = requestAnimationFrame(() => {
                    rafRef.current = null;
                    updateCursor();
                });
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

    return (
        <motion.div
            className="pointer-events-none fixed top-0 left-0 z-[999999] will-change-transform transform-gpu"
            style={{
                x: smoothX,
                y: smoothY,
            }}
            animate={
                cursorMode === 'hidden'
                    ? {
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
                    : cursorMode === 'button'
                    ? {
                          // Sticky morph magnético em botões compactos e micro-alvos clicáveis
                          width: buttonDimensions.width,
                          height: buttonDimensions.height,
                          borderRadius: buttonDimensions.borderRadius,
                          opacity: 1,
                          scale: 1,
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'none',
                          WebkitBackdropFilter: 'none',
                          mixBlendMode: 'normal',
                      }
                    : cursorMode === 'card'
                    ? {
                          // Cards Grandes & Superfícies: anel sutil translúcido, sem criar bolinha opaca que confunda com o puck da timeline
                          width: DEFAULT_SIZE,
                          height: DEFAULT_SIZE,
                          borderRadius: '50%',
                          opacity: 0.35,
                          scale: 1.15,
                          backgroundColor: 'transparent',
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          boxShadow: 'none',
                          backdropFilter: 'none',
                          WebkitBackdropFilter: 'none',
                          mixBlendMode: 'normal',
                      }
                    : {
                          // Estado livre padrão: ponto compacto de precisão
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          opacity: 0.75,
                          scale: 1.0,
                          backgroundColor: 'rgba(255, 255, 255, 0.85)',
                          border: '0px solid transparent',
                          boxShadow: '0 0 6px rgba(255, 255, 255, 0.3)',
                          backdropFilter: 'none',
                          WebkitBackdropFilter: 'none',
                          mixBlendMode: 'normal',
                      }
            }
            transition={SPRING_TRANSITION}
        />
    );
}
