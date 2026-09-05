import React, { useEffect, useRef } from 'react';

/**
 * InteractiveParticleField - Lusion-inspired Physical Particle Mesh in Canvas 2D
 * 
 * - Discrete technical grid nodes in translucent slate/white.
 * - Cursor exerts elastic repulsion force within 120px radius.
 * - Restored to rest position via Hooke's Law spring-damping physics.
 * - requestAnimationFrame paused when document is hidden (zero battery drain).
 * - High-DPI (Retina) calibration and automatic window resize.
 */
export default function InteractiveParticleField() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let animationFrameId = null;
        let isVisible = !document.hidden;

        // Mouse coordinates and radius
        const mouse = { x: -1000, y: -1000, radius: 120 };

        // Grid particles array
        let particles = [];

        // Density configuration
        const SPACING = 55; // pixels between nodes
        const SPRING_K = 0.04; // Spring stiffness
        const DAMPING = 0.86; // Velocity damping (friction)
        const REPULSION_FORCE = 7.5; // Mouse push strength

        const handleResize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const width = window.innerWidth;
            const height = window.innerHeight;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            ctx.scale(dpr, dpr);

            // Rebuild particles grid across viewport
            particles = [];
            const cols = Math.ceil(width / SPACING) + 1;
            const rows = Math.ceil(height / SPACING) + 1;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const originX = i * SPACING;
                    const originY = j * SPACING;
                    particles.push({
                        originX,
                        originY,
                        x: originX,
                        y: originY,
                        vx: 0,
                        vy: 0,
                        radius: (i + j) % 4 === 0 ? 1.4 : 1.0,
                        baseAlpha: (i + j) % 5 === 0 ? 0.12 : 0.06,
                    });
                }
            }
        };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        const handleVisibilityChange = () => {
            isVisible = !document.hidden;
            if (isVisible) {
                lastTime = performance.now();
                render();
            }
        };

        let lastTime = performance.now();

        const render = () => {
            if (!isVisible) return;

            const width = window.innerWidth;
            const height = window.innerHeight;

            ctx.clearRect(0, 0, width, height);

            // Render loop with physics step
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // 1. Mouse Repulsion Force
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.hypot(dx, dy);

                if (dist < mouse.radius && dist > 0.1) {
                    const factor = (1 - dist / mouse.radius);
                    const angle = Math.atan2(dy, dx);
                    const force = factor * REPULSION_FORCE;
                    p.vx -= Math.cos(angle) * force;
                    p.vy -= Math.sin(angle) * force;
                }

                // 2. Spring force returning to rest origin (Hooke's Law + Damping)
                const ax = (p.originX - p.x) * SPRING_K;
                const ay = (p.originY - p.y) * SPRING_K;

                p.vx = (p.vx + ax) * DAMPING;
                p.vy = (p.vy + ay) * DAMPING;

                p.x += p.vx;
                p.y += p.vy;

                // 3. Draw particle
                const displacement = Math.hypot(p.x - p.originX, p.y - p.originY);
                const dynamicAlpha = Math.min(p.baseAlpha + displacement * 0.015, 0.45);

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius + (displacement > 2 ? 0.4 : 0), 0, Math.PI * 2);
                ctx.fillStyle = displacement > 4 
                    ? `rgba(217, 119, 87, ${dynamicAlpha})` // Sutil tom accent ao deslocar
                    : `rgba(255, 255, 255, ${dynamicAlpha})`;
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(render);
        };

        // Initialize
        handleResize();
        render();

        window.addEventListener('resize', handleResize, { passive: true });
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="fixed inset-0 pointer-events-none z-0 will-change-transform"
        />
    );
}
