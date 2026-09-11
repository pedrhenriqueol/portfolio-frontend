import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TechItem {
    id?: string | number;
    name: string;
    category?: string;
    icon?: string;
    icon_class?: string;
    color?: string;
    desc?: string;
    brandColor?: string;
    ox?: number;
    oy?: number;
    oz?: number;
    index?: number;
}

const CATEGORY_THEME: Record<string, { color: string; label: string }> = {
    'Front-end':     { color: '#60A5FA', label: 'Frontend' },
    'Frontend':      { color: '#60A5FA', label: 'Frontend' },
    'Back-end':      { color: '#F87171', label: 'Backend & ERP' },
    'Backend & ERP': { color: '#F87171', label: 'Backend & ERP' },
    'Database':      { color: '#34D399', label: 'Banco de Dados' },
    'DevOps & QA':   { color: '#FBBF24', label: 'DevOps & QA' },
};

const CATEGORIES = [
    { id: 'all',          label: 'Todas' },
    { id: 'Front-end',    label: 'Frontend' },
    { id: 'Back-end',     label: 'Backend & ERP' },
    { id: 'Database',     label: 'Banco de Dados' },
    { id: 'DevOps & QA',  label: 'DevOps & QA' },
];

const DEFAULT_SKILLS: TechItem[] = [
    { id: 1,  name: 'TypeScript',    category: 'Front-end',   icon: 'fab fa-js-square',   color: '#3178C6', desc: 'Tipagem estrita e sistemas robustos' },
    { id: 2,  name: 'React.js',      category: 'Front-end',   icon: 'fab fa-react',       color: '#61DAFB', desc: 'Interfaces modernas e reativas' },
    { id: 3,  name: 'Tailwind CSS',  category: 'Front-end',   icon: 'fab fa-css3-alt',    color: '#38BDF8', desc: 'Design industrial e responsivo' },
    { id: 4,  name: 'Delphi 11/6',   category: 'Back-end',    icon: 'fas fa-desktop',     color: '#EE3124', desc: 'Modernização e engenharia legada' },
    { id: 5,  name: 'PHP & Laravel', category: 'Back-end',    icon: 'fab fa-laravel',     color: '#FF2D20', desc: 'APIs RESTful e arquitetura backend' },
    { id: 6,  name: 'SQL Server',    category: 'Database',    icon: 'fas fa-database',    color: '#CC292B', desc: 'Tuning e procedimentos transacionais' },
    { id: 7,  name: 'PostgreSQL',    category: 'Database',    icon: 'fas fa-database',    color: '#336791', desc: 'Modelagem relacional e integridade' },
    { id: 8,  name: 'Postman & QA',  category: 'DevOps & QA', icon: 'fas fa-vial',        color: '#FF6C37', desc: 'Testes de API e cobertura de fluxos' },
    { id: 9,  name: 'Git & GitHub',  category: 'DevOps & QA', icon: 'fab fa-git-alt',     color: '#F05032', desc: 'Versionamento e CI/CD' },
    { id: 10, name: 'Docker',        category: 'DevOps & QA', icon: 'fab fa-docker',      color: '#2496ED', desc: 'Containerização e ambientes' },
];

function createSphereNodes(items: TechItem[]) {
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

    const edges: [number, number][] = [];
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = (nodes[i].ox ?? 0) - (nodes[j].ox ?? 0);
            const dy = (nodes[i].oy ?? 0) - (nodes[j].oy ?? 0);
            const dz = (nodes[i].oz ?? 0) - (nodes[j].oz ?? 0);
            const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (dist3D < 0.72) {
                edges.push([i, j]);
            }
        }
    }

    return { nodes, edges };
}

interface SkillsOrbital3DProps {
    skills?: TechItem[];
}

export default function SkillsOrbital3D({ skills = [] }: SkillsOrbital3DProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nodeElementsRef = useRef<(HTMLDivElement | null)[]>([]);
    const iconWrappersRef = useRef<(HTMLDivElement | null)[]>([]);
    const iconElementsRef = useRef<(HTMLElement | null)[]>([]);
    const labelElementsRef = useRef<(HTMLElement | null)[]>([]);

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [hoveredTech, setHoveredTech] = useState<TechItem | null>(null);
    const [activeTech, setActiveTech] = useState<TechItem | null>(null);

    const selectedCategoryRef = useRef('all');
    const hoveredTechIdRef = useRef<string | number | null>(null);
    const activeTechIdRef = useRef<string | number | null>(null);

    useEffect(() => {
        selectedCategoryRef.current = selectedCategory;
    }, [selectedCategory]);

    const angleRef = useRef({ x: 0.2, y: 0.1 });
    const speedRef = useRef({ rx: 0.0008, ry: 0.0016 });
    const targetSpeed = useRef({ rx: 0.0008, ry: 0.0016 });
    const isDraggingRef = useRef(false);
    const dragDistanceRef = useRef(0);
    const lastPointerRef = useRef({ x: 0, y: 0 });
    const isVisibleRef = useRef(true);
    const rafIdRef = useRef<number | null>(null);

    const localizedSkills = useMemo(() => {
        const raw = skills && skills.length > 0 ? skills : DEFAULT_SKILLS;
        return raw.map((item) => ({
            ...item,
            icon: item.icon_class || item.icon || 'fas fa-code',
            brandColor: item.color || CATEGORY_THEME[item.category || '']?.color || '#8C6A4A',
            color: item.color || CATEGORY_THEME[item.category || '']?.color || '#8C6A4A',
        }));
    }, [skills]);

    const { nodes: baseNodes, edges: staticEdges } = useMemo(
        () => createSphereNodes(localizedSkills),
        [localizedSkills]
    );

    const projectedCoords = useRef<{ px: number; py: number; z2: number; scale: number }[]>([]);
    useEffect(() => {
        projectedCoords.current = baseNodes.map(() => ({ px: 0, py: 0, z2: 0, scale: 1 }));
    }, [baseNodes]);

    const updateNodeVisuals = useCallback((targetHoverId: string | number | null, targetActiveId: string | number | null) => {
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
            const brand = node.brandColor || node.color || '#FFFFFF';

            if (isFocused) {
                wrapper.style.backgroundColor = `${brand}25`;
                wrapper.style.borderColor = brand;
                wrapper.style.boxShadow = `0 0 28px ${brand}99`;
                wrapper.style.transform = 'scale(1.2)';
                icon.style.color = brand;
                icon.style.filter = `drop-shadow(0 0 8px ${brand}80)`;
                icon.style.transform = 'scale(1.08)';

                label.style.color = '#FFFFFF';
                label.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
                label.style.borderColor = brand;
                label.style.transform = 'scale(1.05) translateY(2px)';
            } else {
                wrapper.style.backgroundColor = 'rgba(18, 20, 26, 0.85)';
                wrapper.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                wrapper.style.boxShadow = 'none';
                wrapper.style.transform = 'scale(1)';
                icon.style.color = '#D1D5DB';
                icon.style.filter = 'none';
                icon.style.transform = 'scale(1)';

                label.style.color = '#9CA3AF';
                label.style.backgroundColor = 'rgba(0, 0, 0, 0.65)';
                label.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                label.style.transform = 'scale(1) translateY(0)';
            }
        }
    }, [baseNodes]);

    const runFrame = useCallback(() => {
        if (!isVisibleRef.current) return;

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

        for (let i = 0; i < baseNodes.length; i++) {
            const node = baseNodes[i];
            const el = domNodes[i];

            const ox = node.ox ?? 0;
            const oy = node.oy ?? 0;
            const oz = node.oz ?? 0;

            const x1 = ox * cosY + oz * sinY;
            const z1 = -ox * sinY + oz * cosY;

            const y1 = oy * cosX - z1 * sinX;
            const z2 = oy * sinX + z1 * cosX;

            const zDist = z2 * SPHERE_RADIUS;
            const scale = FOV / (FOV - zDist);
            const px = x1 * SPHERE_RADIUS * scale;
            const py = y1 * SPHERE_RADIUS * scale;
            const clampedScale = Math.min(1.35, Math.max(0.7, scale));
            const depthAlpha = Math.max(0.2, (z2 + 1.2) / 2.2);

            if (coords[i]) {
                coords[i].px = px;
                coords[i].py = py;
                coords[i].z2 = z2;
                coords[i].scale = clampedScale;
            }

            if (el) {
                const isFiltered = currentCat !== 'all' && node.category !== currentCat;
                const isFocused = (hovId === node.id) || (actId === node.id);
                const finalAlpha = isFiltered ? 0.12 : isFocused ? 1 : depthAlpha;
                const finalZIndex = isFocused ? 999 : Math.round((z2 + 2) * 100);

                el.style.transform = `translate3d(${px}px, ${py}px, 0) scale(${clampedScale})`;
                el.style.opacity = String(finalAlpha);
                el.style.zIndex = String(finalZIndex);
            }
        }

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
                    if (!p1 || !p2) continue;

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

    const onPointerDown = (e: React.PointerEvent | React.TouchEvent | React.MouseEvent) => {
        isDraggingRef.current = true;
        dragDistanceRef.current = 0;
        const touch = 'touches' in e && e.touches.length > 0 ? e.touches[0] : (e as React.MouseEvent);
        lastPointerRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const onPointerMove = useCallback((e: PointerEvent) => {
        if (!isDraggingRef.current) return;
        const dx = e.clientX - lastPointerRef.current.x;
        const dy = e.clientY - lastPointerRef.current.y;

        dragDistanceRef.current += Math.abs(dx) + Math.abs(dy);
        speedRef.current.ry = dx * 0.0032;
        speedRef.current.rx = -dy * 0.0032;

        lastPointerRef.current = { x: e.clientX, y: e.clientY };
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
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                            selectedCategory === cat.id
                                ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                                : 'bg-white/[0.03] border border-white/[0.07] text-neutral-400 hover:text-white'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Container da Esfera / Constelação Orbital */}
            <div
                ref={containerRef}
                onPointerDown={onPointerDown}
                onPointerLeave={() => {
                    hoveredTechIdRef.current = null;
                    setHoveredTech(null);
                    updateNodeVisuals(null, activeTechIdRef.current);
                }}
                className="relative w-full max-w-[580px] h-[460px] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden rounded-3xl"
                style={{ touchAction: 'none' }}
            >
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 pointer-events-none w-full h-full z-0"
                />

                <div className="absolute inset-0 bg-radial from-white/[0.02] via-transparent to-transparent pointer-events-none" />

                {baseNodes.map((node, idx) => (
                    <div
                        key={node.id}
                        ref={(el) => { nodeElementsRef.current[idx] = el; }}
                        style={{
                            position: 'absolute',
                            transform: 'translate3d(0px, 0px, 0) scale(1)',
                            willChange: 'transform, opacity',
                        }}
                        className="cursor-pointer flex flex-col items-center justify-center pointer-events-none"
                    >
                        <div
                            ref={(el) => { iconWrappersRef.current[idx] = el; }}
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-lg border border-white/10 pointer-events-auto cursor-pointer will-change-transform"
                            style={{
                                backgroundColor: 'rgba(18, 20, 26, 0.95)',
                                borderColor: 'rgba(255, 255, 255, 0.12)',
                                transform: 'scale(1)',
                                transformOrigin: 'center center',
                                transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease, border-color 0.25s ease',
                            }}
                            onPointerDown={onPointerDown}
                            onMouseEnter={() => {
                                if (!isDraggingRef.current) {
                                    hoveredTechIdRef.current = node.id ?? null;
                                    setHoveredTech(node);
                                    updateNodeVisuals(node.id ?? null, activeTechIdRef.current);
                                }
                            }}
                            onMouseLeave={() => {
                                hoveredTechIdRef.current = null;
                                setHoveredTech(null);
                                updateNodeVisuals(null, activeTechIdRef.current);
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (dragDistanceRef.current < 6) {
                                    const newActive = activeTechIdRef.current === node.id ? null : node;
                                    activeTechIdRef.current = newActive?.id ?? null;
                                    setActiveTech(newActive);
                                    updateNodeVisuals(hoveredTechIdRef.current, newActive?.id ?? null);
                                }
                            }}
                        >
                            <i
                                ref={(el) => { iconElementsRef.current[idx] = el; }}
                                className={`${node.icon} text-lg sm:text-xl will-change-transform`}
                                style={{
                                    color: '#D1D5DB',
                                    transform: 'scale(1)',
                                    transformOrigin: 'center center',
                                    transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), color 0.25s ease, filter 0.3s ease',
                                }}
                            />
                        </div>

                        <span
                            ref={(el) => { labelElementsRef.current[idx] = el; }}
                            className="mt-1.5 text-[11px] font-sans font-semibold tracking-wide whitespace-nowrap px-2.5 py-0.5 rounded-full shadow-md pointer-events-none antialiased will-change-transform"
                            style={{
                                color: '#9CA3AF',
                                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                textRendering: 'optimizeLegibility',
                                WebkitFontSmoothing: 'antialiased',
                                transform: 'scale(1) translateY(0)',
                                transformOrigin: 'top center',
                                transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), color 0.25s ease, background-color 0.25s ease, border-color 0.25s ease',
                            }}
                        >
                            {node.name}
                        </span>
                    </div>
                ))}
            </div>

            {/* Painel Inferior de Detalhes da Tecnologia Selecionada */}
            <div className="min-h-[76px] w-full max-w-lg mt-2 flex items-center justify-center px-4">
                <AnimatePresence mode="wait">
                    {activeItemData ? (
                        <motion.div
                            key={activeItemData.id}
                            initial={{ opacity: 0, y: 10, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.96 }}
                            transition={{ duration: 0.2 }}
                            className="w-full bg-[#0c0e14]/90 border border-white/10 p-3.5 rounded-2xl flex items-center gap-4 shadow-xl backdrop-blur-md"
                        >
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/10"
                                style={{ backgroundColor: `${activeItemData.brandColor || activeItemData.color}25` }}
                            >
                                <i
                                    className={`${activeItemData.icon} text-lg`}
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
                                <p className="text-neutral-400 text-xs font-sans mt-0.5 line-clamp-1 antialiased leading-relaxed">
                                    {activeItemData.desc || 'Tecnologia utilizada em produção e desenvolvimento de software.'}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.p
                            key="tech-sphere-prompt"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-xs text-neutral-500 font-sans tracking-wide flex items-center gap-2 antialiased"
                        >
                            <i className="fas fa-arrows-alt text-[10px] text-neutral-400 animate-pulse" />
                            Arraste a constelação para girar ou clique em um nó para inspecionar
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
