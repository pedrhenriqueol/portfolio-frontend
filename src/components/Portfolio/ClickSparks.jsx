import { useState, useEffect } from 'react';

const COLORS = ['#66FCF1', '#45A29E', '#ffffff', '#818CF8', '#F59E0B'];

export default function ClickSparks() {
    const [sparks, setSparks] = useState([]);

    useEffect(() => {
        const handleClick = (e) => {
            const zoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
            const x = e.clientX / zoom;
            const y = e.clientY / zoom;

            const newSparks = Array.from({ length: 10 }, (_, i) => ({
                id: `${Date.now()}-${i}`,
                x,
                y,
                angle: (360 / 10) * i + (Math.random() * 20 - 10),
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                size: 2 + Math.random() * 4,
                distance: 30 + Math.random() * 60,
                duration: 0.35 + Math.random() * 0.3,
            }));

            setSparks(prev => [...prev, ...newSparks]);

            setTimeout(() => {
                setSparks(prev => prev.filter(s => !newSparks.some(n => n.id === s.id)));
            }, 800);
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9996] overflow-hidden">
            {sparks.map(({ id, x, y, angle, color, size, distance, duration }) => {
                const rad = (angle * Math.PI) / 180;
                const tx = Math.cos(rad) * distance;
                const ty = Math.sin(rad) * distance;

                return (
                    <div
                        key={id}
                        className="absolute rounded-full"
                        style={{
                            left: x - size / 2,
                            top: y - size / 2,
                            width: size,
                            height: size,
                            backgroundColor: color,
                            boxShadow: `0 0 ${size * 3}px ${color}`,
                            animation: `spark-fly ${duration}s ease-out forwards`,
                            '--tx': `${tx}px`,
                            '--ty': `${ty}px`,
                        }}
                    />
                );
            })}
        </div>
    );
}
