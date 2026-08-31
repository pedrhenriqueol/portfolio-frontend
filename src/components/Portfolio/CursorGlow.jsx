import { useEffect, useRef, useState } from 'react';

const isTouchDevice = () =>
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

export default function CursorMorph() {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isTouchDevice()) return;

        const dot = dotRef.current;
        const ring = ringRef.current;
        if (!dot) return;

        let mouseX = -200;
        let mouseY = -200;
        let ringX = -200;
        let ringY = -200;
        let rafId = null;
        let cachedZoom = 1;

        const updateZoom = () => {
            cachedZoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
        };
        updateZoom();
        window.addEventListener('resize', updateZoom, { passive: true });

        const onMouseMove = (e) => {
            mouseX = e.clientX / cachedZoom;
            mouseY = e.clientY / cachedZoom;

            // O ponto central segue o cursor instantaneamente para máxima precisão
            dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

            // Detecta se está sobre elemento interativo para expandir a lente de contraste
            const target = e.target;
            const isInteractive = Boolean(
                target.closest('button, a, input, textarea, select, [role="button"], .cursor-pointer, [data-cursor-hover="true"]')
            );
            setIsHovered(isInteractive);
        };

        // Loop de inércia suave para o anel / halo externo
        const render = () => {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;

            if (ring) {
                ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
            }

            rafId = requestAnimationFrame(render);
        };

        rafId = requestAnimationFrame(render);
        window.addEventListener('mousemove', onMouseMove, { passive: true });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', updateZoom);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    if (isTouchDevice()) return null;

    return (
        <>
            {/* Lente de Contraste Invertido (Mix Blend Difference) */}
            <div
                ref={dotRef}
                className="pointer-events-none fixed top-0 left-0 z-[99999] rounded-full bg-white transition-[width,height,opacity] duration-200 ease-out transform -translate-x-1/2 -translate-y-1/2 will-change-transform"
                style={{
                    width: isHovered ? '42px' : '12px',
                    height: isHovered ? '42px' : '12px',
                    mixBlendMode: 'difference',
                    opacity: isHovered ? 0.95 : 0.85,
                }}
            />

            {/* Halo / Anel Externo Fluido Sutil */}
            <div
                ref={ringRef}
                className="pointer-events-none fixed top-0 left-0 z-[99998] rounded-full border border-accent/40 transition-[width,height,opacity,border-color] duration-300 ease-out transform -translate-x-1/2 -translate-y-1/2 will-change-transform"
                style={{
                    width: isHovered ? '56px' : '28px',
                    height: isHovered ? '56px' : '28px',
                    opacity: isHovered ? 0.4 : 0.25,
                    boxShadow: isHovered ? '0 0 15px rgba(var(--color-accent-rgb, 200, 150, 100), 0.25)' : 'none',
                }}
            />
        </>
    );
}
