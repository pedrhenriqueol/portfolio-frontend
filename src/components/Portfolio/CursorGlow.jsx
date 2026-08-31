import { useEffect, useRef } from 'react';

const isTouchDevice = () =>
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

const DEFAULT_SIZE = 36;
const HOVER_SIZE = 64;

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
        let loopRaf = null;
        let cachedZoom = 0.8;
        let isHovered = false;

        const updateZoom = () => {
            cachedZoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
        };
        updateZoom();
        window.addEventListener('resize', updateZoom, { passive: true });

        // Loop contínuo com física suave e delay elegante atrás da seta nativa do mouse
        const renderLoop = () => {
            const targetX = mouseX / cachedZoom;
            const targetY = mouseY / cachedZoom;

            // Fator de interpolação mais suave (0.11) para a bola seguir levemente atrás do cursor
            ringX += (targetX - ringX) * 0.11;
            ringY += (targetY - ringY) * 0.11;

            cursorEl.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

            loopRaf = requestAnimationFrame(renderLoop);
        };
        loopRaf = requestAnimationFrame(renderLoop);

        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Detecta elementos interativos
            const target = e.target;
            const interactive = Boolean(
                target.closest('button, a, input, textarea, select, [role="button"], .cursor-pointer, [data-cursor-hover="true"], h1, h2, h3, [data-sphere-node]')
            );

            if (interactive !== isHovered) {
                isHovered = interactive;
                const targetSize = isHovered ? HOVER_SIZE : DEFAULT_SIZE;
                cursorEl.style.width = `${targetSize}px`;
                cursorEl.style.height = `${targetSize}px`;
                cursorEl.style.opacity = isHovered ? '0.85' : '0.65';
            }
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', updateZoom);
            if (loopRaf) cancelAnimationFrame(loopRaf);
        };
    }, []);

    if (isTouchDevice()) return null;

    return (
        <div
            ref={cursorRef}
            className="pointer-events-none fixed top-0 left-0 z-[99999] rounded-full will-change-transform"
            style={{
                width:           `${DEFAULT_SIZE}px`,
                height:          `${DEFAULT_SIZE}px`,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                opacity:         0.65,
                mixBlendMode:    'difference',
                transition:      'width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease',
                transform:       'translate3d(-200px, -200px, 0) translate(-50%, -50%)',
            }}
        />
    );
}
