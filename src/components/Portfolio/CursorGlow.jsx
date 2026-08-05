import { useEffect, useRef, useState } from 'react';

// Touch devices don't have a cursor — skip entirely
const isTouchDevice = () =>
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

const TRAIL_LENGTH = 10;

export default function CursorGlow() {
    const glowRef   = useRef(null);
    const outerRef  = useRef(null);
    const pos       = useRef({ x: -200, y: -200 });
    const curr      = useRef({ x: -200, y: -200 });
    const raf       = useRef(null);
    const [trail, setTrail] = useState(() =>
        Array.from({ length: TRAIL_LENGTH }, () => ({ x: -200, y: -200 }))
    );
    const trailPos  = useRef(Array.from({ length: TRAIL_LENGTH }, () => ({ x: -200, y: -200 })));

    if (isTouchDevice()) return null;

    useEffect(() => {
        const onMove = (e) => {
            const zoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
            pos.current = { x: e.clientX / zoom, y: e.clientY / zoom };
        };

        const lerp = (a, b, t) => a + (b - a) * t;

        const loop = () => {
            // Lerp main cursor
            curr.current.x = lerp(curr.current.x, pos.current.x, 0.12);
            curr.current.y = lerp(curr.current.y, pos.current.y, 0.12);

            const x = curr.current.x;
            const y = curr.current.y;

            if (glowRef.current) {
                glowRef.current.style.transform = `translate(${x - 160}px, ${y - 160}px)`;
            }
            if (outerRef.current) {
                outerRef.current.style.transform = `translate(${x - 12}px, ${y - 12}px)`;
            }

            // Shift trail: each dot follows the one in front with more lag
            const trail = trailPos.current;
            for (let i = trail.length - 1; i > 0; i--) {
                trail[i].x = lerp(trail[i].x, trail[i - 1].x, 0.4);
                trail[i].y = lerp(trail[i].y, trail[i - 1].y, 0.4);
            }
            trail[0].x = lerp(trail[0].x, x, 0.5);
            trail[0].y = lerp(trail[0].y, y, 0.5);

            setTrail(trail.map(p => ({ ...p })));

            raf.current = requestAnimationFrame(loop);
        };

        window.addEventListener('mousemove', onMove);
        raf.current = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener('mousemove', onMove);
            cancelAnimationFrame(raf.current);
        };
    }, []);

    return (
        <>
            {/* Grande halo suave */}
            <div
                ref={glowRef}
                className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform"
                style={{
                    width: 320,
                    height: 320,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(102,252,241,0.07) 0%, transparent 70%)',
                }}
            />

            {/* Cursor ring */}
            <div
                ref={outerRef}
                className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform"
                style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    border: '1.5px solid rgba(102,252,241,0.5)',
                    backdropFilter: 'blur(2px)',
                }}
            />

            {/* Comet trail */}
            {trail.map((p, i) => {
                const scale  = 1 - i / TRAIL_LENGTH;
                const opacity = (1 - i / TRAIL_LENGTH) * 0.55;
                const size   = 6 * scale;
                return (
                    <div
                        key={i}
                        className="pointer-events-none fixed top-0 left-0 z-[9998] will-change-transform rounded-full"
                        style={{
                            width:  size,
                            height: size,
                            transform: `translate(${p.x - size / 2}px, ${p.y - size / 2}px)`,
                            opacity,
                            background: `rgba(102,252,241,${0.8 * scale})`,
                            boxShadow: `0 0 ${size * 2}px rgba(102,252,241,${0.4 * scale})`,
                        }}
                    />
                );
            })}
        </>
    );
}
