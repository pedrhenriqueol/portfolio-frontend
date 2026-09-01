import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

// ── Design System: Cores Harmoniosas por Categoria ──
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
    if (N === 0) return [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Ângulo áureo ~2.399 rad

    return items.map((item, i) => {
        const y = 1 - (i / Math.max(N - 1, 1)) * 2;
        const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = phi * i;

        return {
            ...item,
            ox: Math.cos(theta) * radiusAtY,
            oy: y,
            oz: Math.sin(theta) * radiusAtY,
        };
    });
}

export default function TechSphere3D({ skills = [] }) {
    const { t, lang } = useLanguage();
    const containerRef = useRef(null);
    const canvasRef = useRef(null);

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [hoveredTech, setHoveredTech] = useState(null);
    const [activeTech, setActiveTech] = useState(null);
    const [projectedNodes, setProjectedNodes] = useState([]);

    // Parâmetros de física e rotação contínua
    const angleRef = useRef({ x: 0.2, y: 0.1 });
    const speedRef = useRef({ rx: 0.0008, ry: 0.0016 });
    const targetSpeed = useRef({ rx: 0.0008, ry: 0.0016 });
    const isDraggingRef = useRef(false);
    const dragDistanceRef = useRef(0);
    const lastPointerRef = useRef({ x: 0, y: 0 });
    const isVisibleRef = useRef(true);

    // Tecnologias formatadas e categorizadas
    const localizedSkills = useMemo(() => {
        const raw = (skills && Array.isArray(skills) && skills.length > 0) ? skills : t('skills.list');
        const list = Array.isArray(raw) ? raw : [];
        return list.map((item) => ({
            ...item,
            icon: item?.icon_class || item?.icon || 'fas fa-code',
            color: CATEGORY_THEME[item?.category]?.color || '#8C6A4A',
        }));
    }, [skills, t]);

    const baseNodes = useMemo(() => createSphereNodes(localizedSkills), [localizedSkills]);

    // Visibilidade em tela via IntersectionObserver para 100% de economia de CPU/GPU fora do viewport
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisibleRef.current = entry.isIntersecting;
            },
            { threshold: 0.1 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Loop de renderização 3D (Posicionamento dos nós + Canvas de conexões)
    useEffect(() => {
        let animId;
        const canvas = canvasRef.current;
        const ctx = canvas ? canvas.getContext('2d') : null;

        const updateSphere = () => {
            if (!isVisibleRef.current) {
                animId = requestAnimationFrame(updateSphere);
                return;
            }

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

            // Projeção dos nós esféricos
            const projected = baseNodes.map((node) => {
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

                // Opacidade baseada em profundidade Z (nós da frente são nítidos, fundo é suave)
                const depthAlpha = Math.max(0.2, (z2 + 1.2) / 2.2);

                return {
                    ...node,
                    px,
                    py,
                    z2,
                    scale: Math.min(1.35, Math.max(0.7, scale)),
                    zIndex: Math.round((z2 + 2) * 100),
                    depthAlpha,
                };
            });

            setProjectedNodes(projected);

            // Renderiza linhas de conexão da constelação no Canvas
            if (ctx && canvas) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const cx = canvas.width / 2;
                const cy = canvas.height / 2;

                ctx.lineWidth = 1;

                for (let i = 0; i < projected.length; i++) {
                    const n1 = projected[i];
                    for (let j = i + 1; j < projected.length; j++) {
                        const n2 = projected[j];

                        // Distância euclidiana 3D
                        const dx = n1.ox - n2.ox;
                        const dy = n1.oy - n2.oy;
                        const dz = n1.oz - n2.oz;
                        const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

                        // Conecta apenas nós vizinhos na constelação (< 0.72)
                        if (dist3D < 0.72) {
                            const avgZ = (n1.z2 + n2.z2) / 2;
                            const lineAlpha = Math.max(0, (avgZ + 0.8) * 0.18);

                            if (lineAlpha > 0.01) {
                                ctx.strokeStyle = `rgba(214, 210, 196, ${lineAlpha})`;
                                ctx.beginPath();
                                ctx.moveTo(cx + n1.px, cy + n1.py);
                                ctx.lineTo(cx + n2.px, cy + n2.py);
                                ctx.stroke();
                            }
                        }
                    }
                }
            }

            animId = requestAnimationFrame(updateSphere);
        };

        animId = requestAnimationFrame(updateSphere);
        return () => cancelAnimationFrame(animId);
    }, [baseNodes]);

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
                onPointerEnter={() => window.dispatchEvent(new CustomEvent('cursor-no-morph-enter'))}
                onPointerLeave={() => window.dispatchEvent(new CustomEvent('cursor-no-morph-leave'))}
                className="no-morph relative w-full max-w-[580px] h-[480px] mt-8 flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden rounded-3xl"
                style={{ touchAction: 'none' }}
            >
                {/* Canvas com conexões sutis de constelação */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 pointer-events-none w-full h-full z-0"
                />

                {/* Glow Radial Central */}
                <div className="absolute inset-0 bg-radial from-secondary/5 via-transparent to-transparent pointer-events-none" />

                {/* Nós da Esfera (sem texto invertido, sempre virados para frente) */}
                {projectedNodes.map((node) => {
                    const isFiltered = selectedCategory !== 'all' && node.category !== selectedCategory;
                    const isFocused = (hoveredTech?.id === node.id) || (activeTech?.id === node.id);
                    const finalScale = isFocused ? node.scale * 1.25 : node.scale;
                    const finalAlpha = isFiltered ? 0.12 : isFocused ? 1 : node.depthAlpha;

                    return (
                        <div
                            key={node.id}
                            style={{
                                position: 'absolute',
                                transform: `translate3d(${node.px}px, ${node.py}px, 0) scale(${finalScale})`,
                                zIndex: isFocused ? 999 : node.zIndex,
                                opacity: finalAlpha,
                                willChange: 'transform, opacity',
                            }}
                            className="pointer-events-auto cursor-pointer flex flex-col items-center justify-center transition-opacity duration-200"
                            onMouseEnter={() => setHoveredTech(node)}
                            onMouseLeave={() => setHoveredTech(null)}
                            onClick={() => {
                                if (dragDistanceRef.current < 6) {
                                    setActiveTech(activeTech?.id === node.id ? null : node);
                                }
                            }}
                        >
                            <div
                                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-md border transition-all duration-200"
                                style={{
                                    backgroundColor: isFocused
                                        ? 'rgba(255, 255, 255, 0.2)'
                                        : 'rgba(18, 20, 26, 0.85)',
                                    boxShadow: isFocused ? `0 0 20px ${node.color}90` : 'none',
                                    borderColor: isFocused ? node.color : 'rgba(255,255,255,0.12)',
                                }}
                            >
                                <i className={`${node.icon} text-lg sm:text-xl`} style={{ color: node.color }} />
                            </div>

                            {/* Label da Tecnologia (Sempre legível e nítido) */}
                            <span
                                className="mt-1.5 text-[10.5px] font-mono tracking-tight whitespace-nowrap font-bold px-2 py-0.5 rounded-full shadow-md pointer-events-none"
                                style={{
                                    color: isFocused ? '#FFFFFF' : node.color,
                                    backgroundColor: isFocused ? 'rgba(0,0,0,0.92)' : 'rgba(0,0,0,0.6)',
                                    border: isFocused ? `1px solid ${node.color}` : '1px solid rgba(255,255,255,0.08)',
                                }}
                            >
                                {node.name}
                            </span>
                        </div>
                    );
                })}
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
                            className="w-full bg-darker/95 border border-primary/30 p-3.5 rounded-2xl flex items-center gap-4 shadow-xl backdrop-blur-md"
                        >
                            <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-white/10"
                                style={{ backgroundColor: `${activeItemData.color}25` }}
                            >
                                <i className={`${activeItemData.icon} text-xl`} style={{ color: activeItemData.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-white font-bold text-sm tracking-wide truncate">
                                        {activeItemData.name}
                                    </h4>
                                    <span
                                        className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border border-white/10 font-medium"
                                        style={{ color: activeItemData.color, backgroundColor: `${activeItemData.color}15` }}
                                    >
                                        {activeItemData.category}
                                    </span>
                                </div>
                                <p className="text-primary/75 text-xs font-sans mt-0.5 line-clamp-1">
                                    {activeItemData.desc || 'Tecnologia utilizada em produção e desenvolvimento de software.'}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-primary/70 font-mono tracking-wider flex items-center gap-2"
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
