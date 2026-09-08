import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Diâmetro base em repouso (22px)
const DEFAULT_SIZE = 22;

// Física de mola atenuada e sem oscilação agressiva
const SPRING_TRANSITION = {
    type: 'spring',
    damping: 28,
    stiffness: 320,
    mass: 0.4,
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

            setCursorMode('button');
            setButtonDimensions(prev => {
                if (prev.width === targetWidth && prev.height === targetHeight && prev.borderRadius === radius) {
                    return prev;
                }
                return { width: targetWidth, height: targetHeight, borderRadius: radius };
            });
        } else {
            // Estado livre: bolinha branca removida, mantendo o cursor nativo e o InteractiveParticleField
            cursorX.set(currentPos.x - DEFAULT_SIZE / 2);
            cursorY.set(currentPos.y - DEFAULT_SIZE / 2);
            setCursorMode('hidden');
        }
    }, [cursorX, cursorY]);

    // Identifica o elemento e categoria sob o ponteiro
    const resolveTarget = (el) => {
        if (!el || el === document.body || el === document.documentElement) return null;
        if (el.closest('[data-no-morph="true"], .no-morph, canvas')) return null;

        // Micro-elementos clicáveis compactos (Botões CTA, Badges, Links, Pílulas de filtro, Fechar modal)
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
            if (targetRef.current?.type === 'button') {
                const el = targetRef.current.el;
                const rect = el.getBoundingClientRect();
                const zoom = cachedZoomRef.current;
                const mouseX = posRef.current.x * zoom;
                const mouseY = posRef.current.y * zoom;
                if (
                    mouseX < rect.left - 15 ||
                    mouseX > rect.right + 15 ||
                    mouseY < rect.top - 15 ||
                    mouseY > rect.bottom + 15
                ) {
                    targetRef.current = null;
                }
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
                cursorMode === 'button'
                    ? {
                          // Sticky morph magnético em botões compactos e micro-alvos clicáveis
                          width: buttonDimensions.width,
                          height: buttonDimensions.height,
                          borderRadius: buttonDimensions.borderRadius,
                          opacity: 1,
                          scale: 1,
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'none',
                          WebkitBackdropFilter: 'none',
                          mixBlendMode: 'normal',
                      }
                    : {
                          // Oculto em repouso: zero bolinha branca visível
                          width: DEFAULT_SIZE,
                          height: DEFAULT_SIZE,
                          borderRadius: '50%',
                          opacity: 0,
                          scale: 0.5,
                          backgroundColor: 'transparent',
                          border: '0px solid transparent',
                          boxShadow: 'none',
                          backdropFilter: 'none',
                          WebkitBackdropFilter: 'none',
                          mixBlendMode: 'normal',
                      }
            }
            transition={SPRING_TRANSITION}
        />
    );
}
