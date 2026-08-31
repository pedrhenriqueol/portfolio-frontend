import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

// ── Tech items com cores vibrantes para glow individual ──
const TECH_SPHERE_ITEMS = [
    { name: 'Delphi 11',     icon: 'fas fa-desktop',             color: '#E63946', category: 'Desktop & ERP',       level: 4 },
    { name: 'UniGui Web',    icon: 'fas fa-globe',               color: '#457B9D', category: 'Desktop & Web',       level: 4 },
    { name: 'React 19',      icon: 'fab fa-react',               color: '#61DAFB', category: 'Frontend',            level: 4 },
    { name: 'TypeScript',    icon: 'fab fa-js-square',           color: '#3178C6', category: 'Fullstack',           level: 4 },
    { name: 'PHP / Laravel', icon: 'fab fa-laravel',             color: '#FF2D20', category: 'Backend',             level: 4 },
    { name: 'SQL Server',    icon: 'fas fa-database',            color: '#CC292B', category: 'Database',            level: 4 },
    { name: 'MySQL',         icon: 'fas fa-server',              color: '#00758F', category: 'Database',            level: 4 },
    { name: 'Postman (QA)',  icon: 'fas fa-paper-plane',         color: '#FF6C37', category: 'QA & Testes',         level: 4 },
    { name: 'Docker',        icon: 'fab fa-docker',              color: '#2496ED', category: 'DevOps',              level: 3 },
    { name: 'Java / Swing',  icon: 'fab fa-java',                color: '#ED8B00', category: 'Backend & Desktop',   level: 3 },
    { name: 'Python / Flask',icon: 'fab fa-python',              color: '#3776AB', category: 'Backend',             level: 3 },
    { name: 'Tailwind CSS',  icon: 'fab fa-css3-alt',            color: '#38BDF8', category: 'Frontend',            level: 4 },
    { name: 'ACBr Fiscal',   icon: 'fas fa-file-invoice-dollar', color: '#10B981', category: 'Sistemas Fiscais',    level: 4 },
    { name: 'Git & GitHub',  icon: 'fab fa-github',              color: '#F05032', category: 'DevOps',              level: 4 },
    { name: 'Linux Server',  icon: 'fab fa-linux',               color: '#FCC624', category: 'DevOps',              level: 3 },
    { name: 'APIs RESTful',  icon: 'fas fa-network-wired',       color: '#A855F7', category: 'Backend',             level: 4 },
    { name: 'Scrum / Kanban',icon: 'fas fa-tasks',               color: '#F59E0B', category: 'Metodologia',         level: 3 },
    { name: 'Regressão QA',  icon: 'fas fa-bug',                 color: '#EC4899', category: 'QA & Testes',         level: 4 },
];

// ── Helpers ──
const LEVEL_LABELS = { 5: 'Especialista', 4: 'Avançado', 3: 'Intermediário', 2: 'Básico' };
const LEVEL_LABELS_EN = { 5: 'Expert', 4: 'Advanced', 3: 'Intermediate', 2: 'Basic' };
const LEVEL_LABELS_ES = { 5: 'Experto', 4: 'Avanzado', 3: 'Intermedio', 2: 'Básico' };

function getLevelLabel(level, lang) {
    if (lang === 'en') return LEVEL_LABELS_EN[level] || '';
    if (lang === 'es') return LEVEL_LABELS_ES[level] || '';
    return LEVEL_LABELS[level] || '';
}

// Distribuição de Fibonacci na esfera
function fibonacciSphere(items) {
    const N = items.length;
    const phi = Math.PI * (3 - Math.sqrt(5));
    return items.map((item, i) => {
        const y = 1 - (i / (N - 1)) * 2;
        const radius = Math.sqrt(1 - y * y);
        const theta = phi * i;
        return {
            ...item,
            ox: Math.cos(theta) * radius,
            oy: y,
            oz: Math.sin(theta) * radius,
        };
    });
}

// Distância 2D projetada entre dois nós
function projDist(a, b) {
    const dx = a.left - b.left;
    const dy = a.top - b.top;
    return Math.sqrt(dx * dx + dy * dy);
}

export default function TechSphere3D() {
    const { lang } = useLanguage();
    const containerRef = useRef(null);
    const [hoveredTech, setHoveredTech] = useState(null);
    const angleRef = useRef({ x: 0, y: 0 });
    const speedRef = useRef({ rx: 0.003, ry: 0.005 });
    const isVisibleRef = useRef(true);
    const isDraggingRef = useRef(false);
    const lastMouseRef = useRef({ x: 0, y: 0 });
    const nodesRef = useRef([]);

    // Nós base imutáveis
    const baseItems = useMemo(() => fibonacciSphere(TECH_SPHERE_ITEMS), []);

    const [projected, setProjected] = useState([]);

    // ── Projeção 3D → 2D com depth info ──
    const project = useCallback(() => {
        const ax = angleRef.current.x;
        const ay = angleRef.current.y;
        const sinX = Math.sin(ax), cosX = Math.cos(ax);
        const sinY = Math.sin(ay), cosY = Math.cos(ay);
        const RADIUS = 180;
        const FOV = 380;

        const result = baseItems.map(item => {
            // Rotação Y
            const x1 = item.ox * cosY - item.oz * sinY;
            const z1 = item.oz * cosY + item.ox * sinY;
            // Rotação X
            const y2 = item.oy * cosX - z1 * sinX;
            const z2 = z1 * cosX + item.oy * sinX;

            const scale = FOV / (FOV + z2 * RADIUS);
            // Depth normalized 0→1 (0=farthest, 1=nearest)
            const depth = (z2 + 1) / 2;

            return {
                ...item,
                left: x1 * RADIUS * scale,
                top: y2 * RADIUS * scale,
                scale,
                depth,
                z2,
                zIndex: Math.floor((z2 + 1) * 100),
                // Visual depth effects
                alpha: 0.15 + depth * 0.85,
                blurPx: depth < 0.3 ? (0.3 - depth) * 5 : 0,
                glowIntensity: 0.1 + depth * 0.5,
            };
        });

        nodesRef.current = result;
        setProjected(result);
    }, [baseItems]);

    // ── Animation loop ──
    useEffect(() => {
        let raf;

        const tick = () => {
            if (!isVisibleRef.current) return;

            if (!isDraggingRef.current) {
                angleRef.current.x += speedRef.current.rx;
                angleRef.current.y += speedRef.current.ry;
            }

            project();
            raf = requestAnimationFrame(tick);
        };

        // IntersectionObserver para pausar quando fora da tela
        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisibleRef.current = entry.isIntersecting;
                if (entry.isIntersecting) {
                    raf = requestAnimationFrame(tick);
                } else {
                    cancelAnimationFrame(raf);
                }
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) observer.observe(containerRef.current);
        raf = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(raf);
            observer.disconnect();
        };
    }, [project]);

    // ── Mouse interaction ──
    const onMouseMove = useCallback((e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const mx = e.clientX - (rect.left + rect.width / 2);
        const my = e.clientY - (rect.top + rect.height / 2);

        speedRef.current = {
            rx: -my * 0.000035,
            ry: mx * 0.000035,
        };
    }, []);

    const onMouseLeave = useCallback(() => {
        isDraggingRef.current = false;
        speedRef.current = { rx: 0.003, ry: 0.005 };
        setHoveredTech(null);
    }, []);

    // ── Constellation lines (SVG) ──
    const constellationLines = useMemo(() => {
        if (projected.length === 0) return [];
        const THRESHOLD = 120;
        const lines = [];

        for (let i = 0; i < projected.length; i++) {
            for (let j = i + 1; j < projected.length; j++) {
                const d = projDist(projected[i], projected[j]);
                if (d < THRESHOLD) {
                    const avgDepth = (projected[i].depth + projected[j].depth) / 2;
                    const opacity = (1 - d / THRESHOLD) * avgDepth * 0.35;
                    if (opacity > 0.02) {
                        lines.push({
                            x1: projected[i].left,
                            y1: projected[i].top,
                            x2: projected[j].left,
                            y2: projected[j].top,
                            opacity,
                            color: projected[i].color,
                        });
                    }
                }
            }
        }
        return lines;
    }, [projected]);

    return (
        <div
            ref={containerRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className="relative w-full h-[420px] sm:h-[500px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing overflow-hidden rounded-2xl bg-dark/40 border border-primary/20 backdrop-blur-sm shadow-2xl"
        >
            {/* ── Background ambient glows ── */}
            <div className="absolute w-72 h-72 rounded-full bg-accent/8 blur-[100px] pointer-events-none" />
            <div className="absolute w-48 h-48 rounded-full bg-secondary/10 blur-[60px] pointer-events-none" />

            {/* ── Anel equatorial com gradiente ── */}
            <div
                className="absolute pointer-events-none animate-[spin_80s_linear_infinite]"
                style={{
                    width: 360,
                    height: 360,
                    borderRadius: '50%',
                    border: '1px solid transparent',
                    backgroundImage: 'linear-gradient(var(--color-dark), var(--color-dark)), linear-gradient(135deg, var(--color-accent) 0%, transparent 40%, transparent 60%, var(--color-accent) 100%)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                    opacity: 0.2,
                }}
            />

            {/* ── Segundo anel inclinado ── */}
            <div
                className="absolute pointer-events-none animate-[spin_120s_linear_infinite_reverse]"
                style={{
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    border: '1px dashed',
                    borderColor: 'var(--color-border)',
                    transform: 'rotateX(65deg) rotateZ(25deg)',
                    opacity: 0.15,
                }}
            />

            {/* ── Constellation lines SVG ── */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ overflow: 'visible' }}
            >
                <g transform={`translate(${containerRef.current?.clientWidth / 2 || 200}, ${containerRef.current?.clientHeight / 2 || 210})`}>
                    {constellationLines.map((line, i) => (
                        <line
                            key={i}
                            x1={line.x1}
                            y1={line.y1}
                            x2={line.x2}
                            y2={line.y2}
                            stroke={line.color}
                            strokeWidth={0.8}
                            strokeOpacity={line.opacity}
                            strokeLinecap="round"
                        />
                    ))}
                </g>
            </svg>

            {/* ── 3D Orbiting Nodes ── */}
            <div className="relative w-0 h-0 flex items-center justify-center">
                {projected.map((node) => {
                    const isHovered = hoveredTech?.name === node.name;
                    const nodeScale = node.scale * (isHovered ? 1.35 : 1);

                    return (
                        <div
                            key={node.name}
                            onMouseEnter={() => setHoveredTech(node)}
                            onMouseLeave={() => setHoveredTech(null)}
                            style={{
                                transform: `translate3d(${node.left}px, ${node.top}px, 0) scale(${nodeScale})`,
                                zIndex: isHovered ? 999 : node.zIndex,
                                opacity: isHovered ? 1 : node.alpha,
                                filter: node.blurPx > 0.2 && !isHovered
                                    ? `blur(${node.blurPx}px)`
                                    : 'none',
                            }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-[filter] duration-200 ease-out cursor-pointer group"
                        >
                            {/* Glow aura behind icon */}
                            <div
                                className="absolute rounded-full transition-all duration-300 ease-out"
                                style={{
                                    width: isHovered ? 56 : 44,
                                    height: isHovered ? 56 : 44,
                                    background: `radial-gradient(circle, ${node.color}${isHovered ? '30' : '15'} 0%, transparent 70%)`,
                                    boxShadow: isHovered
                                        ? `0 0 24px ${node.color}40, 0 0 48px ${node.color}20`
                                        : `0 0 12px ${node.color}${Math.round(node.glowIntensity * 25).toString(16).padStart(2, '0')}`,
                                }}
                            />

                            {/* Icon container */}
                            <div
                                className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 ease-out"
                                style={{
                                    backgroundColor: isHovered
                                        ? `${node.color}20`
                                        : 'rgba(26, 19, 16, 0.85)',
                                    borderColor: isHovered
                                        ? `${node.color}80`
                                        : 'rgba(255,255,255,0.08)',
                                    boxShadow: isHovered
                                        ? `inset 0 0 12px ${node.color}15`
                                        : 'none',
                                }}
                            >
                                <i
                                    className={`${node.icon} text-base sm:text-lg transition-colors duration-200`}
                                    style={{
                                        color: isHovered ? node.color : `${node.color}${Math.round(node.alpha * 200 + 55).toString(16).padStart(2, '0')}`,
                                        textShadow: isHovered ? `0 0 8px ${node.color}60` : 'none',
                                    }}
                                />
                            </div>

                            {/* Inline name label — only for front nodes */}
                            {node.depth > 0.5 && (
                                <span
                                    className="absolute -bottom-5 text-[9px] sm:text-[10px] font-mono font-semibold whitespace-nowrap text-center transition-opacity duration-200"
                                    style={{
                                        color: isHovered ? node.color : 'rgba(255,255,255,0.45)',
                                        opacity: isHovered ? 1 : node.depth * 0.8,
                                        textShadow: isHovered ? `0 0 6px ${node.color}40` : 'none',
                                    }}
                                >
                                    {node.name}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ── Expanded Tooltip Panel ── */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 flex items-center justify-between sm:justify-end gap-3 pointer-events-none">
                <AnimatePresence mode="wait">
                    {hoveredTech ? (
                        <motion.div
                            key={hoveredTech.name}
                            initial={{ opacity: 0, y: 12, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="px-5 py-3.5 rounded-xl bg-darker/95 border shadow-2xl backdrop-blur-md min-w-[220px]"
                            style={{ borderColor: `${hoveredTech.color}50` }}
                        >
                            <div className="flex items-center gap-3 mb-2.5">
                                <div
                                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: `${hoveredTech.color}18` }}
                                >
                                    <i
                                        className={`${hoveredTech.icon} text-lg`}
                                        style={{ color: hoveredTech.color }}
                                    />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-white font-mono leading-tight">
                                        {hoveredTech.name}
                                    </div>
                                    <div className="text-[10px] font-sans" style={{ color: `${hoveredTech.color}cc` }}>
                                        {hoveredTech.category}
                                    </div>
                                </div>
                            </div>

                            {/* Level bar */}
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(hoveredTech.level / 5) * 100}%` }}
                                        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
                                        className="h-full rounded-full"
                                        style={{
                                            background: `linear-gradient(90deg, ${hoveredTech.color}80, ${hoveredTech.color})`,
                                            boxShadow: `0 0 8px ${hoveredTech.color}60`,
                                        }}
                                    />
                                </div>
                                <span
                                    className="text-[9px] font-mono font-semibold whitespace-nowrap"
                                    style={{ color: hoveredTech.color }}
                                >
                                    {getLevelLabel(hoveredTech.level, lang)}
                                </span>
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
