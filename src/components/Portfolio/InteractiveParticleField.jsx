import React, { useEffect, useRef } from 'react';

/**
 * InteractiveParticleField - Lusion-inspired Physical Particle Mesh in Canvas 2D
 * 
 * - Discrete technical grid nodes and subtle connections in translucent slate/white.
 * - Cursor acceleration generates gentle dispersion waves up to 180px.
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

        // Mouse coordinates, velocity and dynamic radius
        const mouse = {
            x: -1000,
            y: -1000,
            lastX: -1000,
            lastY: -1000,
            speed: 0,
            baseRadius: 120,
            currentRadius: 120,
        };

        let particles = [];

        // Density & Physics constants
        const SPACING = 54; // pixels between nodes
        const SPRING_K = 0.045; // Spring stiffness
        const DAMPING = 0.86; // Velocity friction
        const REPULSION_FORCE = 8.0;

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
                        baseAlpha: (i + j) % 5 === 0 ? 0.11 : 0.05,
                    });
                }
            }
        };

        let lastMoveTime = performance.now();

        const handleMouseMove = (e) => {
            const now = performance.now();
            const dt = Math.max(now - lastMoveTime, 1);
            const dist = Math.hypot(e.clientX - mouse.x, e.clientY - mouse.y);
            mouse.speed = dist / dt; // px/ms

            mouse.lastX = mouse.x;
            mouse.lastY = mouse.y;
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            lastMoveTime = now;

            // Onda de dispersão suave expandindo o raio de força conforme a aceleração do mouse
            const targetRadius = Math.min(180, mouse.baseRadius + mouse.speed * 30);
            mouse.currentRadius = targetRadius;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
            mouse.speed = 0;
            mouse.currentRadius = mouse.baseRadius;
        };

        const handleVisibilityChange = () => {
            isVisible = !document.hidden;
            if (isVisible) {
                render();
            }
        };

        const render = () => {
            if (!isVisible) return;

            const width = window.innerWidth;
            const height = window.innerHeight;

            ctx.clearRect(0, 0, width, height);

            // Decaimento suave do raio de dispersão do mouse
            mouse.currentRadius += (mouse.baseRadius - mouse.currentRadius) * 0.08;

            const activeRadius = mouse.currentRadius;
            const displacedNodes = [];

            // 1. Atualização da física de cada partícula
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Repulsão pelo cursor do mouse
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.hypot(dx, dy);

                if (dist < activeRadius && dist > 0.1) {
                    const factor = (1 - dist / activeRadius);
                    const angle = Math.atan2(dy, dx);
                    // Força amplificada com a aceleração do mouse
                    const force = factor * (REPULSION_FORCE + mouse.speed * 4);
                    p.vx -= Math.cos(angle) * force;
                    p.vy -= Math.sin(angle) * force;
                }

                // Mola retornando ao repouso (Hooke's Law + Damping)
                const ax = (p.originX - p.x) * SPRING_K;
                const ay = (p.originY - p.y) * SPRING_K;

                p.vx = (p.vx + ax) * DAMPING;
                p.vy = (p.vy + ay) * DAMPING;

                p.x += p.vx;
                p.y += p.vy;

                const displacement = Math.hypot(p.x - p.originX, p.y - p.originY);
                if (displacement > 2) {
                    displacedNodes.push(p);
                }

                // Desenha a partícula
                const dynamicAlpha = Math.min(p.baseAlpha + displacement * 0.02, 0.45);

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius + (displacement > 3 ? 0.4 : 0), 0, Math.PI * 2);
                ctx.fillStyle = displacement > 4
                    ? `rgba(217, 119, 87, ${dynamicAlpha})`
                    : `rgba(255, 255, 255, ${dynamicAlpha})`;
                ctx.fill();
            }

            // 2. Conexões translúcidas e campo de luz difuso estilo Lusion
            if (mouse.x > 0 && mouse.y > 0) {
                const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, activeRadius * 0.9);
                gradient.addColorStop(0, 'rgba(217, 119, 87, 0.045)');
                gradient.addColorStop(0.5, 'rgba(217, 119, 87, 0.015)');
                gradient.addColorStop(1, 'rgba(217, 119, 87, 0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, activeRadius * 0.9, 0, Math.PI * 2);
                ctx.fill();
            }

            const maxConnectDist = 68;
            for (let i = 0; i < displacedNodes.length; i++) {
                for (let j = i + 1; j < displacedNodes.length; j++) {
                    const p1 = displacedNodes[i];
                    const p2 = displacedNodes[j];
                    const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                    if (dist < maxConnectDist) {
                        const alpha = (1 - dist / maxConnectDist) * 0.18;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(217, 119, 87, ${alpha})`;
                        ctx.lineWidth = 0.85;
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

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
