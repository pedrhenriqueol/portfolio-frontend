import { useEffect, useRef } from 'react';

const isTouchDevice = () =>
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

// Particle colors — cycling through the brand palette
const COLORS = [
    'rgba(102,252,241,ALPHA)',  // secondary (teal)
    'rgba(69,162,158,ALPHA)',   // accent (muted teal)
    'rgba(197,198,199,ALPHA)',  // primary (light grey)
    'rgba(102,252,241,ALPHA)',  // secondary (repeat for bias)
];

export default function CursorTrail() {
    const canvasRef = useRef(null);

    if (isTouchDevice()) return null;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let particles = [];
        let animId = null;
        let colorIdx = 0;

        const resize = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const onMove = (e) => {
            const zoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
            const x = e.clientX / zoom;
            const y = e.clientY / zoom;

            // Emit 2-3 particles per frame of movement
            const count = 2 + Math.floor(Math.random() * 2);
            for (let i = 0; i < count; i++) {
                colorIdx = (colorIdx + 1) % COLORS.length;
                const size = 2 + Math.random() * 3;
                particles.push({
                    x,
                    y,
                    vx: (Math.random() - 0.5) * 1.2,
                    vy: (Math.random() - 0.5) * 1.2 - 0.4,
                    size,
                    alpha: 0.7 + Math.random() * 0.3,
                    decay: 0.02 + Math.random() * 0.025,
                    color: COLORS[colorIdx],
                    glow: size * 3,
                });
            }
        };

        const draw = () => {
            // Clear with full transparency each frame
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.025;        // slight gravity
                p.alpha -= p.decay;
                p.size  *= 0.97;      // slowly shrink

                if (p.alpha <= 0 || p.size < 0.3) {
                    particles.splice(i, 1);
                    continue;
                }

                const colorStr = p.color.replace('ALPHA', p.alpha.toFixed(3));
                const glowStr  = p.color.replace('ALPHA', (p.alpha * 0.5).toFixed(3));

                // Glow
                ctx.save();
                ctx.shadowBlur  = p.glow;
                ctx.shadowColor = colorStr;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = colorStr;
                ctx.fill();
                ctx.restore();

                // Inner bright core
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${(p.alpha * 0.6).toFixed(3)})`;
                ctx.fill();
            }

            animId = requestAnimationFrame(draw);
        };

        window.addEventListener('mousemove', onMove);
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
