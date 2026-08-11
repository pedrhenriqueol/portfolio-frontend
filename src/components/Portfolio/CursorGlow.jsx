import { useEffect, useRef } from 'react';

const isTouchDevice = () =>
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

// Throttle helper
const throttle = (fn, ms) => {
    let last = 0;
    return (...args) => {
        const now = Date.now();
        if (now - last < ms) return;
        last = now;
        fn(...args);
    };
};

export default function CursorTrail() {
    const canvasRef = useRef(null);

    if (isTouchDevice()) return null;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let particles = [];
        let animId    = null;

        const resize = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize, { passive: true });

        // Throttled: máximo 60fps de emissão = mais leve
        const onMove = throttle((e) => {
            const zoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
            const x = e.clientX / zoom;
            const y = e.clientY / zoom;

            // Apenas 1 partícula por evento throttled — suave e leve
            const size = 1.8 + Math.random() * 2.5;
            particles.push({
                x: x + (Math.random() - 0.5) * 6,
                y: y + (Math.random() - 0.5) * 6,
                vx: (Math.random() - 0.5) * 0.7,
                vy: (Math.random() - 0.5) * 0.7 - 0.3,
                size,
                alpha: 0.55 + Math.random() * 0.25,
                decay: 0.018 + Math.random() * 0.012,
                // Cor aleatória entre teal suave e branco translúcido
                r: Math.random() > 0.4 ? 102 : 200,
                g: Math.random() > 0.4 ? 252 : 220,
                b: Math.random() > 0.4 ? 241 : 255,
            });

            // Limita o pool de partículas para não explodir a memória
            if (particles.length > 60) particles.splice(0, particles.length - 60);
        }, 16); // ~60fps

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x    += p.vx;
                p.y    += p.vy;
                p.vy   += 0.018;   // gravidade bem suave
                p.alpha -= p.decay;
                p.size  *= 0.985;  // encolhe devagar

                if (p.alpha <= 0.02 || p.size < 0.4) {
                    particles.splice(i, 1);
                    continue;
                }

                // Sem shadowBlur — usa apenas fillStyle com alpha baixo (muito mais leve)
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.alpha.toFixed(3)})`;
                ctx.fill();

                // Núcleo branco sutil — só um círculo menor, sem shadow
                if (p.size > 1.2) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * 0.35, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255,255,255,${(p.alpha * 0.4).toFixed(3)})`;
                    ctx.fill();
                }
            }

            animId = requestAnimationFrame(draw);
        };

        window.addEventListener('mousemove', onMove, { passive: true });
        animId = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed top-0 left-0 z-[9999]"
            style={{ width: '100vw', height: '100vh' }}
        />
    );
}
