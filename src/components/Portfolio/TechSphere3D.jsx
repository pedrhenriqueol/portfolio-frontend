import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

// ── Design System: Categorias ──
const CATEGORY_THEME = {
    'Front-end':     { color: '#60A5FA', label: 'Frontend' },
    'Frontend':      { color: '#60A5FA', label: 'Frontend' },
    'Back-end':      { color: '#F87171', label: 'Backend & ERP' },
    'Backend & ERP': { color: '#F87171', label: 'Backend & ERP' },
    'Database':      { color: '#34D399', label: 'Banco de Dados' },
    'DevOps & QA':   { color: '#FBBF24', label: 'DevOps & QA' },
};

const CATEGORIES = [
    { id: 'all',          labelPt: 'Todas',          labelEn: 'All',           labelEs: 'Todas' },
    { id: 'Front-end',    labelPt: 'Frontend',       labelEn: 'Frontend',      labelEs: 'Frontend' },
    { id: 'Back-end',     labelPt: 'Backend & ERP',  labelEn: 'Backend & ERP', labelEs: 'Backend & ERP' },
    { id: 'Database',     labelPt: 'Banco de Dados', labelEn: 'Database',      labelEs: 'Base de Datos' },
    { id: 'DevOps & QA',  labelPt: 'DevOps & QA',    labelEn: 'DevOps & QA',   labelEs: 'DevOps & QA' },
];

// Distribuição uniforme de Fibonacci na esfera 3D
function createSphereNodes(items) {
    const N = items.length;
    if (N === 0) return { nodes: [], edges: [] };
    const phi = Math.PI * (3 - Math.sqrt(5)); // Ângulo áureo ~2.399 rad

    const nodes = items.map((item, i) => {
        const y = 1 - (i / Math.max(N - 1, 1)) * 2;
        const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = phi * i;

        return {
            ...item,
            index: i,
            ox: Math.cos(theta) * radiusAtY,
            oy: y,
            oz: Math.sin(theta) * radiusAtY,
        };
    });

    // Pré-computação das arestas estáticas da constelação (distância 3D < 0.72)
    const edges = [];
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].ox - nodes[j].ox;
            const dy = nodes[i].oy - nodes[j].oy;
            const dz = nodes[i].oz - nodes[j].oz;
            const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (dist3D < 0.72) {
                edges.push([i, j]);
            }
        }
    }

    return { nodes, edges };
}

export default function TechSphere3D({ skills = [] }) {
    const { t, lang } = useLanguage();
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const nodeElementsRef = useRef([]);
    const iconWrappersRef = useRef([]);
    const iconElementsRef = useRef([]);
    const labelElementsRef = useRef([]);

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [hoveredTech, setHoveredTech] = useState(null);
    const [activeTech, setActiveTech] = useState(null);

    // Refs mutáveis para evitar re-renders no RAF
    const selectedCategoryRef = useRef('all');
    const hoveredTechIdRef = useRef(null);
    const activeTechIdRef = useRef(null);
    const isGlobeHoveredRef = useRef(false);

    useEffect(() => {
        selectedCategoryRef.current = selectedCategory;
    }, [selectedCategory]);

    // Parâmetros de física e rotação contínua
    const angleRef = useRef({ x: 0.2, y: 0.1 });
    const speedRef = useRef({ rx: 0.0008, ry: 0.0016 });
    const targetSpeed = useRef({ rx: 0.0008, ry: 0.0016 });
    const isDraggingRef = useRef(false);
    const dragDistanceRef = useRef(0);
    const lastPointerRef = useRef({ x: 0, y: 0 });
    const isVisibleRef = useRef(true);
    const rafIdRef = useRef(null);

    // Tecnologias formatadas com cores oficiais de marca
    const localizedSkills = useMemo(() => {
        const raw = (skills && Array.isArray(skills) && skills.length > 0) ? skills : t('skills.list');
        const list = Array.isArray(raw) ? raw : [];
        return list.map((item) => ({
            ...item,
            icon: item?.icon_class || item?.icon || 'fas fa-code',
            brandColor: item?.color || CATEGORY_THEME[item?.category]?.color || '#8C6A4A',
            color: item?.color || CATEGORY_THEME[item?.category]?.color || '#8C6A4A',
        }));
    }, [skills, t]);

    const { nodes: baseNodes, edges: staticEdges } = useMemo(
        () => createSphereNodes(localizedSkills),
        [localizedSkills]
    );

    // Buffers reutilizáveis para coordenadas projetadas (Zero GC / Zero alocações no loop)
    const projectedCoords = useRef([]);
    useEffect(() => {
        projectedCoords.current = baseNodes.map(() => ({ px: 0, py: 0, z2: 0, scale: 1 }));
    }, [baseNodes]);

    // Função de atualização visual dos nós (cor/hover/foco) sem re-render do React
    const updateNodeVisuals = useCallback((targetHoverId, targetActiveId, isGlobeHovered) => {
        const domNodes = nodeElementsRef.current;
        const wrappers = iconWrappersRef.current;
        const icons = iconElementsRef.current;
        const labels = labelElementsRef.current;

        for (let i = 0; i < baseNodes.length; i++) {
            const node = baseNodes[i];
            const wrapper = wrappers[i];
            const icon = icons[i];
            const label = labels[i];
            if (!wrapper || !icon || !label) continue;

            const isFocused = (targetHoverId === node.id) || (targetActiveId === node.id);
            const brand = node.brandColor || node.color;

            if (isFocused) {
                // Nó focado/hovered: Acende com glow e cor oficial de marca vibrante
                wrapper.style.backgroundColor = `${brand}25`;
                wrapper.style.borderColor = brand;
                wrapper.style.boxShadow = `0 0 24px ${brand}99`;
                icon.style.color = brand;
                icon.style.filter = `drop-shadow(0 0 8px ${brand}80)`;

                label.style.color = '#FFFFFF';
                label.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
                label.style.borderColor = brand;
            } else if (isGlobeHovered) {
                // Cursor dentro do Globo: Revela cores de marca com estética límpida
                wrapper.style.backgroundColor = 'rgba(18, 20, 26, 0.85)';
                wrapper.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                wrapper.style.boxShadow = 'none';
                icon.style.color = brand;
                icon.style.filter = 'none';

                label.style.color = '#E5E7EB';
                label.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                label.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            } else {
                // Repouso/Idle (Cursor fora do Globo): Monocromático elegante e sóbrio
                wrapper.style.backgroundColor = 'rgba(18, 20, 26, 0.85)';
                wrapper.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                wrapper.style.boxShadow = 'none';
                icon.style.color = '#D1D5DB';
                icon.style.filter = 'none';

                label.style.color = '#9CA3AF';
                label.style.backgroundColor = 'rgba(0, 0, 0, 0.65)';
                label.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            }
        }
    }, [baseNodes]);

    // Loop de renderização 3D a 60 FPS diretos no DOM e Canvas (SEM re-render React)
    const runFrame = useCallback(() => {
        if (!isVisibleRef.current) return;

        // Inércia e amortecimento
        if (!isDraggingRef.current) {
            speedRef.current.rx += (targetSpeed.current.rx - speedRef.current.rx) * 0.04;
            speedRef.current.ry += (targetSpeed.current.ry - speedRef.current.ry) * 0.04;
        }

        angleRef.current.x += speedRef.current.rx;
        angleRef.current.y += speedRef.current.ry;

        const ax = angleRef.current.x;
        const ay = angleRef.current.y;
        const cosX = Math.cos(ax), sinX = Math.sin(ax);
        const cosY = Math.cos(ay), sinY = Math.sin(ay);

        const SPHERE_RADIUS = 200;
        const FOV = 440;

        const currentCat = selectedCategoryRef.current;
        const hovId = hoveredTechIdRef.current;
        const actId = activeTechIdRef.current;

        const domNodes = nodeElementsRef.current;
        const coords = projectedCoords.current;

        // 1. Projeção e Atualização Direta nos Elementos DOM dos Nós
        for (let i = 0; i < baseNodes.length; i++) {
            const node = baseNodes[i];
            const el = domNodes[i];

            // Rotação Y
            const x1 = node.ox * cosY + node.oz * sinY;
            const z1 = -node.ox * sinY + node.oz * cosY;

            // Rotação X
            const y1 = node.oy * cosX - z1 * sinX;
            const z2 = node.oy * sinX + z1 * cosX;

            const zDist = z2 * SPHERE_RADIUS;
            const scale = FOV / (FOV - zDist);
            const px = x1 * SPHERE_RADIUS * scale;
            const py = y1 * SPHERE_RADIUS * scale;
            const clampedScale = Math.min(1.35, Math.max(0.7, scale));
            const depthAlpha = Math.max(0.2, (z2 + 1.2) / 2.2);

            coords[i].px = px;
            coords[i].py = py;
            coords[i].z2 = z2;
            coords[i].scale = clampedScale;

            if (el) {
                const isFiltered = currentCat !== 'all' && node.category !== currentCat;
                const isFocused = (hovId === node.id) || (actId === node.id);
                const finalScale = isFocused ? clampedScale * 1.25 : clampedScale;
                const finalAlpha = isFiltered ? 0.12 : isFocused ? 1 : depthAlpha;
                const finalZIndex = isFocused ? 999 : Math.round((z2 + 2) * 100);

                el.style.transform = `translate3d(${px}px, ${py}px, 0) scale(${finalScale})`;
                el.style.opacity = finalAlpha;
                el.style.zIndex = finalZIndex;
            }
        }

        // 2. Renderização das Linhas de Constelação no Canvas 2D
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const cx = canvas.width / 2;
                const cy = canvas.height / 2;
                ctx.lineWidth = 1;

                for (let e = 0; e < staticEdges.length; e++) {
                    const [i, j] = staticEdges[e];
                    const p1 = coords[i];
                    const p2 = coords[j];

                    const avgZ = (p1.z2 + p2.z2) / 2;
                    const lineAlpha = Math.max(0, (avgZ + 0.8) * 0.18);

                    if (lineAlpha > 0.01) {
                        ctx.strokeStyle = `rgba(214, 210, 196, ${lineAlpha})`;
                        ctx.beginPath();
                        ctx.moveTo(cx + p1.px, cy + p1.py);
                        ctx.lineTo(cx + p2.px, cy + p2.py);
                        ctx.stroke();
                    }
                }
            }
        }

        rafIdRef.current = requestAnimationFrame(runFrame);
    }, [baseNodes, staticEdges]);

    // Visibilidade em tela via IntersectionObserver: Pausa 100% o loop quando fora do viewport
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const isNowVisible = entry.isIntersecting;
                isVisibleRef.current = isNowVisible;

                if (isNowVisible) {
                    if (!rafIdRef.current) {
                        rafIdRef.current = requestAnimationFrame(runFrame);
                    }
                } else {
                    if (rafIdRef.current) {
                        cancelAnimationFrame(rafIdRef.current);
                        rafIdRef.current = null;
                    }
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(el);
        if (isVisibleRef.current && !rafIdRef.current) {
            rafIdRef.current = requestAnimationFrame(runFrame);
        }

        return () => {
            observer.disconnect();
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
            }
        };
    }, [runFrame]);

    // Redimensionamento do Canvas
    useEffect(() => {
        const updateCanvasSize = () => {
            if (containerRef.current && canvasRef.current) {
                canvasRef.current.width = containerRef.current.clientWidth;
                canvasRef.current.height = containerRef.current.clientHeight;
            }
        };
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize, { passive: true });
        return () => window.removeEventListener('resize', updateCanvasSize);
    }, []);

    // Interações de Arrastar com Damping (Mouse e Touch)
    const onPointerDown = (e) => {
        isDraggingRef.current = true;
        dragDistanceRef.current = 0;
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const y = e.touches ? e.touches[0].clientY : e.clientY;
        lastPointerRef.current = { x, y };
    };

    const onPointerMove = useCallback((e) => {
        if (!isDraggingRef.current) return;
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const y = e.touches ? e.touches[0].clientY : e.clientY;
        const dx = x - lastPointerRef.current.x;
        const dy = y - lastPointerRef.current.y;

        dragDistanceRef.current += Math.abs(dx) + Math.abs(dy);

        speedRef.current.ry = dx * 0.0032;
        speedRef.current.rx = -dy * 0.0032;

        lastPointerRef.current = { x, y };
    }, []);

    const onPointerUp = useCallback(() => {
        isDraggingRef.current = false;
    }, []);

    useEffect(() => {
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerup', onPointerUp);
        return () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        };
    }, [onPointerMove, onPointerUp]);

    const activeItemData = activeTech || hoveredTech;

    return (
        <div className="relative w-full py-2 select-none flex flex-col items-center">
            {/* Categorias Filtro */}
            <div className="flex flex-wrap justify-center gap-2 mb-6 z-20">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                            selectedCategory === cat.id
                                ? 'bg-accent text-darker shadow-sm'
                                : 'bg-darker/60 text-primary border border-primary/25 hover:border-accent/40 hover:text-accent'
                        }`}
                    >
                        {lang === 'en' ? cat.labelEn : lang === 'es' ? cat.labelEs : cat.labelPt}
                    </button>
                ))}
            </div>

            {/* Container da Esfera / Constelação Orbital */}
            <div
                ref={containerRef}
                data-no-morph="true"
                onPointerDown={onPointerDown}
                onPointerEnter={() => {
                    isGlobeHoveredRef.current = true;
                    updateNodeVisuals(hoveredTechIdRef.current, activeTechIdRef.current, true);
                    window.dispatchEvent(new CustomEvent('cursor-no-morph-enter'));
                }}
                onPointerLeave={() => {
                    isGlobeHoveredRef.current = false;
                    hoveredTechIdRef.current = null;
                    setHoveredTech(null);
                    updateNodeVisuals(null, activeTechIdRef.current, false);
                    window.dispatchEvent(new CustomEvent('cursor-no-morph-leave'));
                }}
                className="no-morph relative w-full max-w-[580px] h-[480px] mt-8 flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden rounded-3xl"
                style={{ touchAction: 'none' }}
            >
                {/* Canvas com conexões pré-computadas de constelação */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 pointer-events-none w-full h-full z-0"
                />

                {/* Glow Radial Central */}
                <div className="absolute inset-0 bg-radial from-secondary/5 via-transparent to-transparent pointer-events-none" />

                {/* Nós da Esfera (Renderização HD Ultra Nítida) */}
                {baseNodes.map((node, idx) => {
                    const brand = node.brandColor || node.color;

                    return (
                        <div
                            key={node.id}
                            ref={(el) => (nodeElementsRef.current[idx] = el)}
                            style={{
                                position: 'absolute',
                                transform: 'translate3d(0px, 0px, 0) scale(1)',
                                willChange: 'transform, opacity',
                            }}
                            className="cursor-pointer flex flex-col items-center justify-center pointer-events-none"
                        >
                            {/* Card do Ícone */}
                            <div
                                ref={(el) => (iconWrappersRef.current[idx] = el)}
                                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-md border transition-all duration-300 pointer-events-auto"
                                style={{
                                    backgroundColor: 'rgba(18, 20, 26, 0.85)',
                                    borderColor: 'rgba(255, 255, 255, 0.12)',
                                }}
                                onMouseEnter={() => {
                                    hoveredTechIdRef.current = node.id;
                                    setHoveredTech(node);
                                    updateNodeVisuals(node.id, activeTechIdRef.current, true);
                                }}
                                onMouseLeave={() => {
                                    hoveredTechIdRef.current = null;
                                    setHoveredTech(null);
                                    updateNodeVisuals(null, activeTechIdRef.current, isGlobeHoveredRef.current);
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (dragDistanceRef.current < 6) {
                                        const newActive = activeTechIdRef.current === node.id ? null : node;
                                        activeTechIdRef.current = newActive?.id ?? null;
                                        setActiveTech(newActive);
                                        updateNodeVisuals(hoveredTechIdRef.current, newActive?.id ?? null, isGlobeHoveredRef.current);
                                    }
                                }}
                            >
                                <i
                                    ref={(el) => (iconElementsRef.current[idx] = el)}
                                    className={`${node.icon} text-lg sm:text-xl transition-all duration-300`}
                                    style={{
                                        color: '#D1D5DB',
                                    }}
                                />
                            </div>

                            {/* Label da Tecnologia (Tipografia HD Nítida Anti-Aliasing com subpixel rendering) */}
                            <span
                                ref={(el) => (labelElementsRef.current[idx] = el)}
                                className="mt-1.5 text-[11px] font-sans font-semibold tracking-wide whitespace-nowrap px-2.5 py-0.5 rounded-full shadow-md pointer-events-none transition-all duration-300 antialiased"
                                style={{
                                    color: '#9CA3AF',
                                    backgroundColor: 'rgba(0, 0, 0, 0.65)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    textRendering: 'optimizeLegibility',
                                    WebkitFontSmoothing: 'antialiased',
                                    MozOsxFontSmoothing: 'grayscale',
                                }}
                            >
                                {node.name}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Painel Inferior de Detalhes da Tecnologia Selecionada (HD Styling) */}
            <div className="min-h-[76px] w-full max-w-lg mt-2 flex items-center justify-center px-4">
                <AnimatePresence mode="wait">
                    {activeItemData ? (
                        <motion.div
                            key={activeItemData.id}
                            initial={{ opacity: 0, y: 10, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.96 }}
                            transition={{ duration: 0.2 }}
                            className="w-full bg-darker/95 border border-white/15 p-3.5 rounded-2xl flex items-center gap-4 shadow-2xl backdrop-blur-md"
                        >
                            <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-white/10"
                                style={{ backgroundColor: `${activeItemData.brandColor || activeItemData.color}25` }}
                            >
                                <i
                                    className={`${activeItemData.icon} text-xl`}
                                    style={{ color: activeItemData.brandColor || activeItemData.color }}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-white font-bold text-sm tracking-wide truncate antialiased">
                                        {activeItemData.name}
                                    </h4>
                                    <span
                                        className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border border-white/10 font-medium"
                                        style={{
                                            color: activeItemData.brandColor || activeItemData.color,
                                            backgroundColor: `${activeItemData.brandColor || activeItemData.color}15`,
                                        }}
                                    >
                                        {activeItemData.category}
                                    </span>
                                </div>
                                <p className="text-gray-300 text-xs font-sans mt-0.5 line-clamp-1 antialiased leading-relaxed">
                                    {activeItemData.desc || 'Tecnologia utilizada em produção e desenvolvimento de software.'}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-gray-400 font-sans tracking-wide flex items-center gap-2 antialiased"
                        >
                            <i className="fas fa-arrows-alt text-[10px] text-accent animate-pulse" />
                            {lang === 'en' ? 'Drag constellation to rotate or click any node to inspect' : lang === 'es' ? 'Arrastra la constelación para rotar o haz clic para inspeccionar' : 'Arraste a constelação para girar ou clique em um nó para inspecionar'}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
