import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function ClickSparks() {
    const { paletteData } = useTheme();
    const canvasRef = useRef(null);
    const sparksRef = useRef([]);
    const rafRef    = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });

        let cachedZoom = 0.8;
        const resize = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
            cachedZoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
        };
        resize();
        window.addEventListener('resize', resize, { passive: true });

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const now = performance.now();
            const active = [];

            for (let i = 0; i < sparksRef.current.length; i++) {
                const s = sparksRef.current[i];
                const elapsed = (now - s.start) / 1000;
                const progress = elapsed / s.duration;

                if (progress < 1) {
                    const currentDist = s.distance * (1 - Math.pow(1 - progress, 3));
                    const px = s.x + Math.cos(s.angle) * currentDist;
                    const py = s.y + Math.sin(s.angle) * currentDist;
                    const alpha = 1 - progress;

                    ctx.save();
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = s.color;
                    ctx.beginPath();
                    ctx.arc(px, py, s.size * (1 - progress * 0.5), 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();

                    active.push(s);
                }
            }

            sparksRef.current = active;

            if (active.length > 0) {
                rafRef.current = requestAnimationFrame(draw);
            } else {
                rafRef.current = null;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };

        const onClick = (e) => {
            const x = e.clientX / cachedZoom;
            const y = e.clientY / cachedZoom;
            const colors = paletteData?.sparks || ['#8C6A4A', '#A37E5A', '#4B342A', '#D1C7BD', '#231B16'];
            const now = performance.now();

            const count = 8;
            for (let i = 0; i < count; i++) {
                const angle = ((Math.PI * 2) / count) * i + (Math.random() * 0.4 - 0.2);
                sparksRef.current.push({
                    x,
                    y,
                    angle,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    size: 2 + Math.random() * 3,
                    distance: 35 + Math.random() * 50,
                    duration: 0.35 + Math.random() * 0.25,
                    start: now,
                });
            }

            if (!rafRef.current) {
                rafRef.current = requestAnimationFrame(draw);
            }
        };

        window.addEventListener('click', onClick, { passive: true });

        return () => {
            window.removeEventListener('click', onClick);
            window.removeEventListener('resize', resize);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [paletteData]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[9996]"
            style={{ contain: 'strict' }}
        />
    );
}
