import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

// ── Tecnologias com cores vibrantes para glow individual ──
const TECH_ITEMS = [
    { name: 'Delphi 11',     icon: 'fas fa-desktop',             color: '#E63946', category: 'Desktop & ERP' },
    { name: 'UniGui Web',    icon: 'fas fa-globe',               color: '#457B9D', category: 'Desktop & Web' },
    { name: 'React 19',      icon: 'fab fa-react',               color: '#61DAFB', category: 'Frontend' },
    { name: 'TypeScript',    icon: 'fab fa-js-square',           color: '#3178C6', category: 'Fullstack' },
    { name: 'PHP / Laravel', icon: 'fab fa-laravel',             color: '#FF2D20', category: 'Backend' },
    { name: 'SQL Server',    icon: 'fas fa-database',            color: '#CC292B', category: 'Database' },
    { name: 'MySQL',         icon: 'fas fa-server',              color: '#00758F', category: 'Database' },
    { name: 'Postman (QA)',  icon: 'fas fa-paper-plane',         color: '#FF6C37', category: 'QA & Testes' },
    { name: 'Docker',        icon: 'fab fa-docker',              color: '#2496ED', category: 'DevOps' },
    { name: 'Java / Swing',  icon: 'fab fa-java',                color: '#ED8B00', category: 'Backend' },
    { name: 'Python / Flask',icon: 'fab fa-python',              color: '#3776AB', category: 'Backend' },
    { name: 'Tailwind CSS',  icon: 'fab fa-css3-alt',            color: '#38BDF8', category: 'Frontend' },
    { name: 'ACBr Fiscal',   icon: 'fas fa-file-invoice-dollar', color: '#10B981', category: 'Fiscal' },
    { name: 'Git & GitHub',  icon: 'fab fa-github',              color: '#F05032', category: 'DevOps' },
    { name: 'Linux Server',  icon: 'fab fa-linux',               color: '#FCC624', category: 'DevOps' },
    { name: 'APIs RESTful',  icon: 'fas fa-network-wired',       color: '#A855F7', category: 'Backend' },
    { name: 'Scrum / Kanban',icon: 'fas fa-tasks',               color: '#F59E0B', category: 'Metodologia' },
    { name: 'Regressão QA',  icon: 'fas fa-bug',                 color: '#EC4899', category: 'QA & Testes' },
];

// Distribuição de Fibonacci na esfera (pontos uniformemente espaçados)
function fibonacciSphere(count) {
    const phi = Math.PI * (3 - Math.sqrt(5));
    const points = [];
    for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const theta = phi * i;
        points.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
    }
    return points;
}

export default function TechSphere3D() {
    const { lang } = useLanguage();
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const nodesRef = useRef([]);
    const angleRef = useRef({ x: 0, y: 0 });
    const targetSpeedRef = useRef({ rx: 0.004, ry: 0.006 });
    const currentSpeedRef = useRef({ rx: 0.004, ry: 0.006 });
    const isVisibleRef = useRef(true);
    const mouseInRef = useRef(false);
    const [hoveredTech, setHoveredTech] = useState(null);
    const sizeRef = useRef({ w: 0, h: 0 });

    // Pontos base na esfera
    const basePoints = useMemo(() => fibonacciSphere(TECH_ITEMS.length), []);

    // ── Canvas constellation lines ──
    const drawConstellations = useCallback((nodes) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const cx = w / 2;
        const cy = h / 2;
        const THRESHOLD = 110;

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].px - nodes[j].px;
                const dy = nodes[i].py - nodes[j].py;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < THRESHOLD) {
                    const avgDepth = (nodes[i].depth + nodes[j].depth) / 2;
                    const opacity = (1 - dist / THRESHOLD) * avgDepth * 0.3;
                    if (opacity > 0.015) {
                        ctx.beginPath();
                        ctx.moveTo(cx + nodes[i].px, cy + nodes[i].py);
                        ctx.lineTo(cx + nodes[j].px, cy + nodes[j].py);
                        ctx.strokeStyle = `rgba(140, 106, 74, ${opacity})`;
                        ctx.lineWidth = 0.7;
                        ctx.stroke();
                    }
                }
            }
        }
    }, []);

    // ── Main animation loop (requestAnimationFrame, no React state in loop) ──
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let raf;
        const RADIUS = 170;
        const FOV = 400;
        const lerp = (a, b, t) => a + (b - a) * t;

        // Inicializa refs dos DOM nodes
        const nodeEls = container.querySelectorAll('[data-sphere-node]');

        const tick = () => {
            if (!isVisibleRef.current) return;

            // Suaviza velocidade de rotação (inércia)
            currentSpeedRef.current.rx = lerp(currentSpeedRef.current.rx, targetSpeedRef.current.rx, 0.05);
            currentSpeedRef.current.ry = lerp(currentSpeedRef.current.ry, targetSpeedRef.current.ry, 0.05);

            angleRef.current.x += currentSpeedRef.current.rx;
            angleRef.current.y += currentSpeedRef.current.ry;

            const ax = angleRef.current.x;
            const ay = angleRef.current.y;
            const sinX = Math.sin(ax), cosX = Math.cos(ax);
            const sinY = Math.sin(ay), cosY = Math.cos(ay);

            const projected = [];

            basePoints.forEach((pt, i) => {
                // Rotação Y → X
                const x1 = pt.x * cosY - pt.z * sinY;
                const z1 = pt.z * cosY + pt.x * sinY;
                const y2 = pt.y * cosX - z1 * sinX;
                const z2 = z1 * cosX + pt.y * sinX;

                const scale = FOV / (FOV + z2 * RADIUS);
                const depth = (z2 + 1) / 2; // 0=atrás, 1=frente

                const px = x1 * RADIUS * scale;
                const py = y2 * RADIUS * scale;

                projected.push({ px, py, depth, scale, z2 });

                // Atualiza DOM diretamente (bypass React re-render para 60fps)
                const el = nodeEls[i];
                if (el) {
                    const nodeScale = scale * (depth > 0.85 ? 1.05 : 1);
                    const alpha = 0.12 + depth * 0.88;
                    const blur = depth < 0.28 ? (0.28 - depth) * 6 : 0;
                    const glow = depth * 0.5;

                    el.style.transform = `translate3d(${px}px, ${py}px, 0) scale(${nodeScale})`;
                    el.style.zIndex = Math.floor((z2 + 1) * 100);
                    el.style.opacity = alpha;
                    el.style.filter = blur > 0.3 ? `blur(${blur}px)` : 'none';

                    // Glow aura
                    const aura = el.firstChild;
                    if (aura) {
                        aura.style.boxShadow = `0 0 ${8 + glow * 16}px ${TECH_ITEMS[i].color}${Math.round(glow * 35).toString(16).padStart(2, '0')}`;
                    }
                }
            });

            nodesRef.current = projected;
            drawConstellations(projected);

            raf = requestAnimationFrame(tick);
        };

        // IntersectionObserver — pausa fora da viewport
        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisibleRef.current = entry.isIntersecting;
                if (entry.isIntersecting) raf = requestAnimationFrame(tick);
                else cancelAnimationFrame(raf);
            },
            { threshold: 0.1 }
        );
        observer.observe(container);
        raf = requestAnimationFrame(tick);

        return () => { cancelAnimationFrame(raf); observer.disconnect(); };
    }, [basePoints, drawConstellations]);

    // ── Resize canvas ──
    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const resizeCanvas = () => {
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            sizeRef.current = { w: rect.width, h: rect.height };
        };
        resizeCanvas();
        const ro = new ResizeObserver(resizeCanvas);
        ro.observe(container);
        return () => ro.disconnect();
    }, []);

    // ── Mouse interaction — reatividade ao movimento ──
    const onMouseMove = useCallback((e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const mx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const my = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

        // Velocidade proporcional à distância do centro
        targetSpeedRef.current = {
            rx: -my * 0.012,
            ry: mx * 0.012,
        };
    }, []);

    const onMouseLeave = useCallback(() => {
        mouseInRef.current = false;
        targetSpeedRef.current = { rx: 0.004, ry: 0.006 };
        setHoveredTech(null);
    }, []);

    const onMouseEnter = useCallback(() => {
        mouseInRef.current = true;
    }, []);

    return (
        <div
            ref={containerRef}
            onMouseMove={onMouseMove}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="relative w-full h-[420px] sm:h-[500px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing overflow-hidden rounded-2xl bg-dark/40 border border-primary/20 backdrop-blur-sm shadow-2xl"
        >
            {/* Background ambient glows */}
            <div className="absolute w-72 h-72 rounded-full bg-accent/8 blur-[100px] pointer-events-none" />
            <div className="absolute w-48 h-48 rounded-full bg-secondary/10 blur-[60px] pointer-events-none" />

            {/* Anel equatorial com gradiente */}
            <div
                className="absolute pointer-events-none animate-[spin_80s_linear_infinite]"
                style={{
                    width: 360, height: 360, borderRadius: '50%',
                    border: '1px solid transparent',
                    backgroundImage: 'linear-gradient(var(--color-dark), var(--color-dark)), linear-gradient(135deg, var(--color-accent) 0%, transparent 40%, transparent 60%, var(--color-accent) 100%)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                    opacity: 0.2,
                }}
            />

            {/* Segundo anel inclinado */}
            <div
                className="absolute pointer-events-none animate-[spin_120s_linear_infinite_reverse]"
                style={{
                    width: 300, height: 300, borderRadius: '50%',
                    border: '1px dashed', borderColor: 'var(--color-border)',
                    transform: 'rotateX(65deg) rotateZ(25deg)', opacity: 0.15,
                }}
            />

            {/* Canvas para linhas de constelação (performance) */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* Nós 3D orbitando — manipulados via DOM direto para 60fps */}
            <div className="relative w-0 h-0 flex items-center justify-center">
                {TECH_ITEMS.map((item, i) => (
                    <div
                        key={item.name}
                        data-sphere-node={i}
                        onMouseEnter={() => setHoveredTech(item)}
                        onMouseLeave={() => setHoveredTech(null)}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer group"
                        style={{ willChange: 'transform, opacity, filter' }}
                    >
                        {/* Glow aura */}
                        <div
                            className="absolute rounded-full"
                            style={{
                                width: 44, height: 44,
                                background: `radial-gradient(circle, ${item.color}15 0%, transparent 70%)`,
                            }}
                        />

                        {/* Icon container */}
                        <div
                            className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full border border-white/8 bg-[rgba(26,19,16,0.85)] group-hover:border-accent/60 transition-colors duration-150"
                        >
                            <i
                                className={`${item.icon} text-base sm:text-lg`}
                                style={{ color: item.color }}
                            />
                        </div>

                        {/* Name label — aparece no hover */}
                        <span className="absolute -bottom-5 text-[9px] sm:text-[10px] font-mono font-semibold whitespace-nowrap text-white/0 group-hover:text-white/90 transition-all duration-200"
                            style={{ textShadow: `0 0 6px ${item.color}40` }}
                        >
                            {item.name}
                        </span>
                    </div>
                ))}
            </div>

            {/* Tooltip com nome e categoria */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 flex items-center justify-between sm:justify-end gap-3 pointer-events-none">
                <AnimatePresence mode="wait">
                    {hoveredTech ? (
                        <motion.div
                            key={hoveredTech.name}
                            initial={{ opacity: 0, y: 12, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="px-5 py-3 rounded-xl bg-darker/95 border shadow-2xl backdrop-blur-md"
                            style={{ borderColor: `${hoveredTech.color}50` }}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: `${hoveredTech.color}18` }}
                                >
                                    <i className={`${hoveredTech.icon} text-lg`} style={{ color: hoveredTech.color }} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-white font-mono leading-tight">{hoveredTech.name}</div>
                                    <div className="text-[10px] font-sans" style={{ color: `${hoveredTech.color}cc` }}>{hoveredTech.category}</div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="idle-hint"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-[11px] font-mono text-gray-500 flex items-center gap-2 bg-darker/60 px-3.5 py-1.5 rounded-full border border-white/5"
                        >
                            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                            {lang === 'en'
                                ? 'Move mouse to explore the Tech Constellation'
                                : lang === 'es'
                                    ? 'Mueve el mouse para explorar la Constelación Tech'
                                    : 'Mova o mouse para explorar a Constelação Tech'}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
