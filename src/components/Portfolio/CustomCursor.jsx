import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

const DEFAULT_SIZE = 18;

// Física de mola calibrada (Framer Motion Spring Physics)
const SPRING_TRANSITION = {
    type: 'spring',
    stiffness: 380,
    damping: 30,
    mass: 0.5,
};

export default function CustomCursor() {
    const [isTouch, setIsTouch] = useState(false);
    const [cursorState, setCursorState] = useState({
        x: -100,
        y: -100,
        width: DEFAULT_SIZE,
        height: DEFAULT_SIZE,
        borderRadius: '50%',
        isMorphing: false,
        isNoMorph: false,
        isOffscreen: true,
    });

    const posRef = useRef({ x: -100, y: -100 });
    const targetRef = useRef(null);
    const isNoMorphRef = useRef(false);
    const isOffscreenRef = useRef(true);
    const rafRef = useRef(null);
    const cachedZoomRef = useRef(1);

    // Detecta dispositivos de toque (mobile/tablets) para desativar cursor virtual
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

    // Sincroniza zoom do index.css (0.8)
    useEffect(() => {
        const updateZoom = () => {
            cachedZoomRef.current = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
        };
        updateZoom();
        window.addEventListener('resize', updateZoom, { passive: true });
        return () => window.removeEventListener('resize', updateZoom);
    }, []);

    // Atualização de estado no frame da GPU (RAF)
    const updateCursor = useCallback(() => {
        const zoom = cachedZoomRef.current;
        const trigger = targetRef.current;

        if (trigger && !isNoMorphRef.current && !isOffscreenRef.current) {
            const rect = trigger.getBoundingClientRect();
            const comp = window.getComputedStyle(trigger);
            let radius = comp.borderRadius || '12px';

            if (radius.includes('%') || parseFloat(radius) >= 24) {
                radius = '9999px';
            } else {
                radius = `${(parseFloat(radius) || 8) + 3}px`;
            }

            const pad = 3;
            const targetLeft = rect.left / zoom - pad;
            const targetTop = rect.top / zoom - pad;
            const targetWidth = rect.width / zoom + pad * 2;
            const targetHeight = rect.height / zoom + pad * 2;

            // Atração magnética sutil em direção ao cursor dentro do botão
            const centerX = targetLeft + targetWidth / 2;
            const centerY = targetTop + targetHeight / 2;
            const pullX = (posRef.current.x - centerX) * 0.12;
            const pullY = (posRef.current.y - centerY) * 0.12;

            setCursorState({
                x: targetLeft + pullX,
                y: targetTop + pullY,
                width: targetWidth,
                height: targetHeight,
                borderRadius: radius,
                isMorphing: true,
                isNoMorph: false,
                isOffscreen: false,
            });
        } else {
            setCursorState({
                x: posRef.current.x - DEFAULT_SIZE / 2,
                y: posRef.current.y - DEFAULT_SIZE / 2,
                width: DEFAULT_SIZE,
                height: DEFAULT_SIZE,
                borderRadius: '50%',
                isMorphing: false,
                isNoMorph: isNoMorphRef.current,
                isOffscreen: isOffscreenRef.current,
            });
        }
    }, []);

    // Eventos de movimento e tracking cirúrgico
    useEffect(() => {
        if (isTouch) return;

        const onMouseMove = (e) => {
            const zoom = cachedZoomRef.current;
            posRef.current = {
                x: e.clientX / zoom,
                y: e.clientY / zoom,
            };
            isOffscreenRef.current = false;

            // Verificação em tempo real de áreas restritas (Globo 3D / Canvas / Terminais)
            const noMorphTarget = e.target?.closest?.('[data-no-morph="true"], .no-morph, canvas');
            isNoMorphRef.current = Boolean(noMorphTarget);

            // Delimitação estrita dos triggers interativos permitidos
            const triggerEl = e.target?.closest?.(
                '[data-cursor-morph="true"], .cursor-morph, [data-cursor="magnetic"]'
            );
            targetRef.current = triggerEl && !isNoMorphRef.current ? triggerEl : null;

            if (!rafRef.current) {
                rafRef.current = requestAnimationFrame(() => {
                    rafRef.current = null;
                    updateCursor();
                });
            }
        };

        const onScroll = () => {
            if (targetRef.current) {
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

        // Eventos customizados para desativação no Globo 3D
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
            className="pointer-events-none fixed top-0 left-0 z-[99999] will-change-transform transform-gpu"
            animate={{
                x: cursorState.x,
                y: cursorState.y,
                width: cursorState.width,
                height: cursorState.height,
                borderRadius: cursorState.borderRadius,
                opacity: isHidden ? 0 : 1,
                scale: isHidden ? 0.5 : 1,
                backgroundColor: cursorState.isMorphing
                    ? 'rgba(255, 255, 255, 0.05)'
                    : '#ffffff',
                border: cursorState.isMorphing
                    ? '1px solid rgba(255, 255, 255, 0.4)'
                    : '0px solid transparent',
                boxShadow: cursorState.isMorphing
                    ? '0 0 20px rgba(255, 255, 255, 0.08)'
                    : 'none',
                backdropFilter: cursorState.isMorphing ? 'blur(2px)' : 'none',
                WebkitBackdropFilter: cursorState.isMorphing ? 'blur(2px)' : 'none',
                mixBlendMode: cursorState.isMorphing ? 'normal' : 'difference',
            }}
            transition={SPRING_TRANSITION}
        />
    );
}
