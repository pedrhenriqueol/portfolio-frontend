import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

// ── Cores Padronizadas e Harmoniosas por Categoria (Design Editorial Consistente) ──
const CATEGORY_THEME = {
    'Front-end':    { color: '#60A5FA' }, // Azul Sereno
    'Frontend':     { color: '#60A5FA' },
    'Back-end':     { color: '#F87171' }, // Vermelho Suave Coral
    'Backend & ERP':{ color: '#F87171' },
    'Database':     { color: '#34D399' }, // Verde Esmeralda
    'DevOps & QA':  { color: '#FBBF24' }, // Dourado Âmbar
};

const CATEGORIES = [
    { id: 'all',          labelPt: 'Todos',          labelEn: 'All',           labelEs: 'Todos' },
    { id: 'Front-end',    labelPt: 'Frontend',       labelEn: 'Frontend',      labelEs: 'Frontend' },
    { id: 'Back-end',     labelPt: 'Backend & ERP',  labelEn: 'Backend & ERP', labelEs: 'Backend & ERP' },
    { id: 'Database',     labelPt: 'Banco de Dados', labelEn: 'Database',      labelEs: 'Base de Datos' },
    { id: 'DevOps & QA',  labelPt: 'DevOps & QA',    labelEn: 'DevOps & QA',   labelEs: 'DevOps & QA' },
];

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

export default function TechSphere3D({ skills = [] }) {
    const { t, lang } = useLanguage();
    const containerRef = useRef(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [hoveredTech, setHoveredTech] = useState(null);
    const [activeTech, setActiveTech] = useState(null);

    // Estado físico: velocidade base ultra-lenta constante e natural
    const angleRef = useRef({ x: 0.15, y: 0 });
    const BASE_SPEED = { rx: 0.0003, ry: 0.0006 };
    const speedRef = useRef({ rx: BASE_SPEED.rx, ry: BASE_SPEED.ry });
    const isDraggingRef = useRef(false);
    const dragDistanceRef = useRef(0);
    const lastMouseRef = useRef({ x: 0, y: 0 });
    const isVisibleRef = useRef(true);

    // Obtém as tecnologias traduzidas dinamicamente do LanguageContext
    const localizedSkills = useMemo(() => {
        const list = (skills && skills.length > 0) ? skills : (t('skills.list') || []);
        return list.map((item) => ({
            ...item,
            icon: item.icon_class || item.icon || 'fas fa-code',
            color: CATEGORY_THEME[item.category]?.color || item.color || '#8C6A4A',
        }));
    }, [skills, t]);

    const baseItems = useMemo(() => fibonacciSphere(localizedSkills), [localizedSkills]);
    const [projected, setProjected] = useState([]);

    // ── Projeção Matemática 3D → 2D com distribuição espaçosa (sem colisão) ──
    const project = useCallback(() => {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
        const RADIUS = isMobile ? 165 : 240;
        const FOV = isMobile ? 380 : 500;

        const ax = angleRef.current.x;
        const ay = angleRef.current.y;
        const sinX = Math.sin(ax), cosX = Math.cos(ax);
        const sinY = Math.sin(ay), cosY = Math.cos(ay);

        const result = baseItems.map((item) => {
            // Rotação Y
            const x1 = item.ox * cosY - item.oz * sinY;
            const z1 = item.oz * cosY + item.ox * sinY;
            // Rotação X
            const y2 = item.oy * cosX - z1 * sinX;
            const z2 = z1 * cosX + item.oy * sinX;

            const scale = FOV / (FOV + z2 * RADIUS);
            const depth = (z2 + 1) / 2; // 0 = fundo, 1 = frente

            const isFiltered = selectedCategory !== 'all';
            const isMatch = !isFiltered || item.category === selectedCategory;

            return {
                ...item,
                left: x1 * RADIUS * scale,
                top: y2 * RADIUS * scale,
                scale: scale * (0.65 + depth * 0.35) * (isMatch ? 1 : 0.75),
                depth,
                z2,
                zIndex: Math.floor((z2 + 1) * 100),
                alpha: (0.15 + depth * 0.85) * (isMatch ? 1 : 0.2),
                isMatch,
            };
        });

        setProjected(result);
    }, [baseItems, selectedCategory]);

    // ── Loop de Animação a 60 FPS ──
    useEffect(() => {
        let raf;
        const lerp = (a, b, t) => a + (b - a) * t;

        const tick = () => {
            if (!isVisibleRef.current) return;

            if (!isDraggingRef.current) {
                // Mantém a rotação lenta e suave constante
                speedRef.current.rx = lerp(speedRef.current.rx, BASE_SPEED.rx, 0.03);
                speedRef.current.ry = lerp(speedRef.current.ry, BASE_SPEED.ry, 0.03);

                angleRef.current.x += speedRef.current.rx;
                angleRef.current.y += speedRef.current.ry;
            }

            project();
            raf = requestAnimationFrame(tick);
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisibleRef.current = entry.isIntersecting;
                if (entry.isIntersecting) raf = requestAnimationFrame(tick);
                else cancelAnimationFrame(raf);
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

    // ── Interações de Mouse e Touch ──
    const onMouseDown = (e) => {
        if (e.button !== 0) return;
        isDraggingRef.current = true;
        dragDistanceRef.current = 0;
        lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
        if (!isDraggingRef.current) {
            // Mouse se mexendo dentro sem clicar: inclinação suave e sutil
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const mx = e.clientX - (rect.left + rect.width / 2);
                const my = e.clientY - (rect.top + rect.height / 2);
                speedRef.current = {
                    rx: -my * 0.000008 + BASE_SPEED.rx,
                    ry: mx * 0.000008 + BASE_SPEED.ry,
                };
            }
            return;
        }

        // Mouse clicado e arrastando: velocidade ágil e responsiva
        const dx = e.clientX - lastMouseRef.current.x;
        const dy = e.clientY - lastMouseRef.current.y;
        dragDistanceRef.current += Math.abs(dx) + Math.abs(dy);

        angleRef.current.y += dx * 0.007;
        angleRef.current.x -= dy * 0.007;

        speedRef.current = {
            rx: -dy * 0.0015,
            ry: dx * 0.0015,
        };

        lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
        isDraggingRef.current = false;
    };

    const onTouchStart = (e) => {
        if (e.touches.length !== 1) return;
        isDraggingRef.current = true;
        dragDistanceRef.current = 0;
        lastMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchMove = (e) => {
        if (!isDraggingRef.current || e.touches.length !== 1) return;
        const dx = e.touches[0].clientX - lastMouseRef.current.x;
        const dy = e.touches[0].clientY - lastMouseRef.current.y;
        dragDistanceRef.current += Math.abs(dx) + Math.abs(dy);

        angleRef.current.y += dx * 0.008;
        angleRef.current.x -= dy * 0.008;

        speedRef.current = {
            rx: -dy * 0.002,
            ry: dx * 0.002,
        };

        lastMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
        isDraggingRef.current = false;
    };

    const handleNodeClick = (tech) => {
        if (dragDistanceRef.current > 6) return;
        setActiveTech(activeTech?.id === tech.id ? null : tech);
    };

    // Resgata o item ativo/hover atualizado com o idioma corrente
    const currentDetailTech = useMemo(() => {
        const activeOrHover = hoveredTech || activeTech;
        if (!activeOrHover) return null;
        return localizedSkills.find(s => s.id === activeOrHover.id) || activeOrHover;
    }, [hoveredTech, activeTech, localizedSkills]);

    return (
        <div className="relative w-full flex flex-col items-center select-none">
            {/* ── Barra Superior de Categorias ── */}
            <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2 mb-6 flex-wrap px-2">
                {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    const label = lang === 'en' ? cat.labelEn : lang === 'es' ? cat.labelEs : cat.labelPt;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setSelectedCategory(cat.id);
                                if (activeTech && activeTech.category !== cat.id && cat.id !== 'all') {
                                    setActiveTech(null);
                                }
                            }}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                                isSelected
                                    ? 'bg-accent text-darker shadow-[0_0_15px_rgba(var(--color-accent-rgb,140,106,74),0.4)] scale-105'
                                    : 'bg-darker/80 border border-primary/20 text-gray-400 hover:text-white hover:border-primary/40'
                            }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            {/* ── Container do Globo 3D ── */}
            <div
                ref={containerRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onMouseLeave={() => {
                    isDraggingRef.current = false;
                    speedRef.current = { rx: BASE_SPEED.rx, ry: BASE_SPEED.ry };
                    setHoveredTech(null);
                }}
                className="relative w-full h-[480px] sm:h-[540px] md:h-[580px] flex items-center justify-center overflow-hidden rounded-3xl bg-dark/40 border border-primary/20 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.6)] cursor-grab active:cursor-grabbing"
            >
                {/* Iluminação de fundo */}
                <div className="absolute w-96 h-96 rounded-full bg-accent/10 blur-[130px] pointer-events-none" />
                <div className="absolute w-72 h-72 rounded-full bg-secondary/10 blur-[90px] pointer-events-none" />

                {/* Anéis orbitais decorativos sutis */}
                <div
                    className="absolute pointer-events-none animate-[spin_120s_linear_infinite]"
                    style={{
                        width: 490,
                        height: 490,
                        borderRadius: '50%',
                        border: '1px dashed rgba(var(--color-accent-rgb, 140, 106, 74), 0.25)',
                        opacity: 0.35,
                    }}
                />
                <div
                    className="absolute pointer-events-none animate-[spin_180s_linear_infinite_reverse]"
                    style={{
                        width: 430,
                        height: 430,
                        borderRadius: '50%',
                        border: '1px solid rgba(255, 255, 255, 0.04)',
                        transform: 'rotateX(68deg) rotateZ(30deg)',
                        opacity: 0.3,
                    }}
                />

                {/* Linhas de Constelação SVG Ultra-Leves */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <g transform={`translate(${containerRef.current ? containerRef.current.clientWidth / 2 : 300}, ${containerRef.current ? containerRef.current.clientHeight / 2 : 250})`}>
                        {projected.map((nodeA, i) =>
                            projected.slice(i + 1).map((nodeB) => {
                                if (nodeA.depth < 0.35 || nodeB.depth < 0.35) return null;
                                const dx = nodeA.left - nodeB.left;
                                const dy = nodeA.top - nodeB.top;
                                const dist = Math.sqrt(dx * dx + dy * dy);
                                if (dist > 140) return null;

                                const opacity = (1 - dist / 140) * ((nodeA.depth + nodeB.depth) / 2) * 0.25;
                                if (opacity < 0.02) return null;

                                return (
                                    <line
                                        key={`line-${nodeA.id}-${nodeB.id}`}
                                        x1={nodeA.left}
                                        y1={nodeA.top}
                                        x2={nodeB.left}
                                        y2={nodeB.top}
                                        stroke={nodeA.color}
                                        strokeOpacity={opacity}
                                        strokeWidth="1"
                                    />
                                );
                            })
                        )}
                    </g>
                </svg>

                {/* ── Nós Esféricos Limpos, Discretos e com Espaçamento Adequado ── */}
                <div className="relative w-0 h-0 flex items-center justify-center pointer-events-none">
                    {projected.map((node) => {
                        const isHovered = hoveredTech?.id === node.id;
                        const isSelected = activeTech?.id === node.id;

                        return (
                            <div
                                key={node.id}
                                onClick={() => handleNodeClick(node)}
                                onMouseEnter={() => setHoveredTech(node)}
                                onMouseLeave={() => setHoveredTech(null)}
                                className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full group pointer-events-auto transition-[box-shadow,border-color,background-color] duration-200 cursor-pointer"
                                style={{
                                    transform: `translate3d(${node.left}px, ${node.top}px, 0) scale(${node.scale * (isHovered || isSelected ? 1.15 : 1)})`,
                                    zIndex: (isHovered || isSelected) ? 9999 : node.zIndex,
                                    opacity: (isHovered || isSelected) ? 1 : node.alpha,
                                    backgroundColor: (isHovered || isSelected)
                                        ? 'rgba(15, 12, 10, 0.95)'
                                        : 'rgba(24, 18, 15, 0.85)',
                                    borderColor: (isHovered || isSelected)
                                        ? node.color
                                        : `${node.color}35`,
                                    borderWidth: '1px',
                                    boxShadow: (isHovered || isSelected)
                                        ? `0 0 20px ${node.color}50, inset 0 0 10px ${node.color}20`
                                        : '0 4px 12px rgba(0, 0, 0, 0.4)',
                                    pointerEvents: node.depth > 0.35 && node.isMatch ? 'auto' : 'none',
                                }}
                            >
                                {/* Ícone compacto e elegante (w-6 h-6) */}
                                <div
                                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                                    style={{ backgroundColor: `${node.color}20` }}
                                >
                                    <i
                                        className={`${node.icon} text-xs sm:text-sm`}
                                        style={{ color: node.color }}
                                    />
                                </div>

                                {/* Nome da tecnologia */}
                                <span className="text-[11px] sm:text-xs font-semibold tracking-wide font-sans text-gray-200 whitespace-nowrap group-hover:text-white transition-colors">
                                    {node.name}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* ── Card Flutuante de Destaque / Detalhes Dinâmico com Idioma ── */}
                <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 flex items-center justify-between sm:justify-end gap-3 pointer-events-none z-50">
                    <AnimatePresence mode="wait">
                        {currentDetailTech ? (
                            <motion.div
                                key={`${currentDetailTech.id}-${lang}`}
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="px-5 py-3.5 rounded-2xl bg-darker/95 border shadow-2xl backdrop-blur-xl max-w-sm"
                                style={{ borderColor: `${currentDetailTech.color}60` }}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: `${currentDetailTech.color}25` }}
                                    >
                                        <i
                                            className={`${currentDetailTech.icon} text-xl`}
                                            style={{ color: currentDetailTech.color }}
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-white font-sans">
                                                {currentDetailTech.name}
                                            </span>
                                            <span
                                                className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                                                style={{
                                                    backgroundColor: `${currentDetailTech.color}20`,
                                                    color: currentDetailTech.color,
                                                }}
                                            >
                                                {currentDetailTech.category}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-gray-300 font-sans mt-0.5 leading-snug">
                                            {currentDetailTech.desc}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="idle-guide"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-xs font-sans text-gray-400 flex items-center gap-2.5 bg-darker/80 px-4 py-2 rounded-full border border-primary/20 shadow-lg backdrop-blur-sm"
                            >
                                <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                                {lang === 'en'
                                    ? 'Click and drag to spin the 3D Tech Galaxy'
                                    : lang === 'es'
                                        ? 'Haz clic y arrastra para girar la Galaxia 3D'
                                        : 'Clique e arraste para girar a Galáxia Tech 3D'}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
