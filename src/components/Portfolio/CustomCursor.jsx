import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

// Diâmetro padrão reduzido em 40% (~22px, base anterior de 36px)
const DEFAULT_SIZE = 22;

// Física de mola fluida e amortecida (Framer Motion Spring Physics)
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
        mode: 'default', // 'default' | 'text' | 'mold' | 'expand'
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

    // Desativa cursor customizado em dispositivos touch
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

    // Sincroniza o fator de zoom global do index.css (0.8)
    useEffect(() => {
        const updateZoom = () => {
            cachedZoomRef.current = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
        };
        updateZoom();
        window.addEventListener('resize', updateZoom, { passive: true });
        return () => window.removeEventListener('resize', updateZoom);
    }, []);

    // Atualiza o estado do cursor no frame de renderização da GPU
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

        if (targetData?.type === 'mold') {
            const rect = targetData.el.getBoundingClientRect();
            const comp = window.getComputedStyle(targetData.el);
            let radius = comp.borderRadius || '12px';

            if (radius.includes('%') || parseFloat(radius) >= 20) {
                radius = '9999px';
            } else {
                radius = `${(parseFloat(radius) || 8) + 4}px`;
            }

            const pad = 3;
            const targetLeft = rect.left / zoom - pad;
            const targetTop = rect.top / zoom - pad;
            const targetWidth = rect.width / zoom + pad * 2;
            const targetHeight = rect.height / zoom + pad * 2;

            // Atração magnética sutil em direção ao cursor dentro do botão
            const centerX = targetLeft + targetWidth / 2;
            const centerY = targetTop + targetHeight / 2;
            const pullX = (currentPos.x - centerX) * 0.12;
            const pullY = (currentPos.y - centerY) * 0.12;

            setCursorState({
                mode: 'mold',
                x: targetLeft + pullX,
                y: targetTop + pullY,
                width: targetWidth,
                height: targetHeight,
                borderRadius: radius,
                isNoMorph: false,
                isOffscreen: false,
            });
        } else if (targetData?.type === 'text') {
            // Superfície de texto: expansão suave de 60%
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
        } else if (targetData?.type === 'expand') {
            // Outros elementos clicáveis
            setCursorState({
                mode: 'expand',
                x: currentPos.x - DEFAULT_SIZE / 2,
                y: currentPos.y - DEFAULT_SIZE / 2,
                width: DEFAULT_SIZE,
                height: DEFAULT_SIZE,
                borderRadius: '50%',
                isNoMorph: false,
                isOffscreen: false,
            });
        } else {
            // Estado livre: tamanho padrão (22px)
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

    // Identifica o tipo de elemento sob o ponteiro do mouse
    const resolveTarget = (el) => {
        if (!el || el === document.body || el === document.documentElement) return null;
        if (el.closest('[data-no-morph="true"], .no-morph, canvas')) return null;

        // 1. Elementos moldáveis (botões, links, pílulas, switches de aba)
        const moldCandidate = el.closest(
            'button, a, [data-cursor-morph="true"], .cursor-morph, [role="button"], input[type="submit"], input[type="button"]'
        );
        if (moldCandidate && !moldCandidate.closest('[data-no-morph="true"], .no-morph')) {
            const rect = moldCandidate.getBoundingClientRect();
            const w = rect.width / cachedZoomRef.current;
            const h = rect.height / cachedZoomRef.current;
            if (w >= 20 && h >= 18 && w <= 380 && h <= 96) {
                return { type: 'mold', el: moldCandidate };
            }
        }

        // 2. Superfícies de texto (títulos, subtítulos, parágrafos, biografia, tags)
        const textCandidate = el.closest(
            'h1, h2, h3, h4, h5, h6, p, span, strong, em, b, i, blockquote, li, code, label'
        );
        if (textCandidate && !textCandidate.closest('[data-no-morph="true"], .no-morph')) {
            const text = textCandidate.textContent?.trim?.();
            if (text && text.length > 0) {
                return { type: 'text', el: textCandidate };
            }
        }

        // 3. Demais elementos interativos (inputs, textareas, selects, cards clicáveis)
        const expandCandidate = el.closest(
            'input, textarea, select, [data-cursor="expand"], .cursor-pointer'
        );
        if (expandCandidate && !expandCandidate.closest('[data-no-morph="true"], .no-morph')) {
            return { type: 'expand', el: expandCandidate };
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

            // Verificação em tempo real da área da Esfera 3D
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
            if (targetRef.current?.type === 'mold') {
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

        // Handlers de saída e entrada suave na Esfera 3D
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
                    : cursorState.mode === 'mold'
                    ? {
                          x: cursorState.x,
                          y: cursorState.y,
                          width: cursorState.width,
                          height: cursorState.height,
                          borderRadius: cursorState.borderRadius,
                          opacity: 1,
                          scale: 1,
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          boxShadow: '0 0 24px rgba(255, 255, 255, 0.08)',
                          backdropFilter: 'blur(2px)',
                          WebkitBackdropFilter: 'blur(2px)',
                          mixBlendMode: 'normal',
                      }
                    : cursorState.mode === 'text'
                    ? {
                          // Aumento suave de 60% do tamanho em superfícies de texto com mix-blend-mode difference
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
                    : cursorState.mode === 'expand'
                    ? {
                          x: mousePos.x - DEFAULT_SIZE / 2,
                          y: mousePos.y - DEFAULT_SIZE / 2,
                          width: DEFAULT_SIZE,
                          height: DEFAULT_SIZE,
                          borderRadius: '50%',
                          opacity: 1,
                          scale: 1.35,
                          backgroundColor: '#ffffff',
                          border: '0px solid transparent',
                          boxShadow: 'none',
                          backdropFilter: 'none',
                          WebkitBackdropFilter: 'none',
                          mixBlendMode: 'difference',
                      }
                    : {
                          // Tamanho normal (22px) em repouso
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
