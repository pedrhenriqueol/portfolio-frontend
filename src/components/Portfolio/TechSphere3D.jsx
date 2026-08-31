import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

// ── Tecnologias com categorização clara, cores e descrições de contexto ──
const TECH_ITEMS = [
    { id: 'delphi',    name: 'Delphi 11',      icon: 'fas fa-desktop',             color: '#E63946', category: 'Backend & ERP', desc: 'VCL / UniGui, Sistemas ERP & PDV' },
    { id: 'unigui',    name: 'UniGui Web',     icon: 'fas fa-globe',               color: '#457B9D', category: 'Backend & ERP', desc: 'Aplicações Web em tempo real com Delphi' },
    { id: 'react',     name: 'React 19',       icon: 'fab fa-react',               color: '#61DAFB', category: 'Frontend',      desc: 'SPAs, Componentes reativos & Hooks' },
    { id: 'ts',        name: 'TypeScript',     icon: 'fab fa-js-square',           color: '#3178C6', category: 'Frontend',      desc: 'Tipagem estrita & Código escalável' },
    { id: 'laravel',   name: 'PHP / Laravel',  icon: 'fab fa-laravel',             color: '#FF2D20', category: 'Backend & ERP', desc: 'APIs RESTful, Eloquent & Arquitetura MVC' },
    { id: 'sqlserver', name: 'SQL Server',     icon: 'fas fa-database',            color: '#CC292B', category: 'Database',       desc: 'Tuning de queries, Índices & Stored Procedures' },
    { id: 'mysql',     name: 'MySQL',          icon: 'fas fa-server',              color: '#00758F', category: 'Database',       desc: 'Modelagem relacional & Otimização' },
    { id: 'postman',   name: 'QA & Postman',   icon: 'fas fa-paper-plane',         color: '#FF6C37', category: 'DevOps & QA',   desc: 'Testes de integração & Validação de endpoints' },
    { id: 'docker',    name: 'Docker',         icon: 'fab fa-docker',              color: '#2496ED', category: 'DevOps & QA',   desc: 'Containers & Ambientes padronizados' },
    { id: 'java',      name: 'Java / Swing',   icon: 'fab fa-java',                color: '#ED8B00', category: 'Backend & ERP', desc: 'Estruturas de dados & POO' },
    { id: 'python',    name: 'Python / Flask', icon: 'fab fa-python',              color: '#3776AB', category: 'Backend & ERP', desc: 'Automações, Scripts & Micro-APIs' },
    { id: 'tailwind',  name: 'Tailwind CSS',   icon: 'fab fa-css3-alt',            color: '#38BDF8', category: 'Frontend',      desc: 'Design systems, Layouts fluidos & Responsividade' },
    { id: 'acbr',      name: 'ACBr Fiscal',    icon: 'fas fa-file-invoice-dollar', color: '#10B981', category: 'Backend & ERP', desc: 'Emissão NF-e, NFC-e & Legislação Fiscal' },
    { id: 'git',       name: 'Git & GitHub',   icon: 'fab fa-github',              color: '#F05032', category: 'DevOps & QA',   desc: 'CI/CD, Versionamento & Workflows' },
    { id: 'linux',     name: 'Linux Server',   icon: 'fab fa-linux',               color: '#FCC624', category: 'DevOps & QA',   desc: 'Deploy, Configuração Nginx & Shell Script' },
    { id: 'rest',      name: 'APIs RESTful',   icon: 'fas fa-network-wired',       color: '#A855F7', category: 'Backend & ERP', desc: 'Contratos de dados, JSON & Autenticação Sanctum' },
    { id: 'scrum',     name: 'Scrum / Kanban', icon: 'fas fa-tasks',               color: '#F59E0B', category: 'DevOps & QA',   desc: 'Metodologias ágeis & Entregas contínuas' },
    { id: 'qa',        name: 'Regressão QA',   icon: 'fas fa-bug',                 color: '#EC4899', category: 'DevOps & QA',   desc: 'Prevenção de bugs & Testes de carga' },
];

const CATEGORIES = [
    { id: 'all',          labelPt: 'Todos',          labelEn: 'All',           labelEs: 'Todos' },
    { id: 'Frontend',     labelPt: 'Frontend',       labelEn: 'Frontend',      labelEs: 'Frontend' },
    { id: 'Backend & ERP',labelPt: 'Backend & ERP',  labelEn: 'Backend & ERP', labelEs: 'Backend & ERP' },
    { id: 'Database',     labelPt: 'Banco de Dados', labelEn: 'Database',      labelEs: 'Base de Datos' },
    { id: 'DevOps & QA',  labelPt: 'DevOps & QA',    labelEn: 'DevOps & QA',   labelEs: 'DevOps & QA' },
];

// Distribuição esférica de Fibonacci perfeitamente balanceada
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
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [hoveredTech, setHoveredTech] = useState(null);
    const [activeTech, setActiveTech] = useState(null);

    // Estado físico e de rotação
    const angleRef = useRef({ x: 0.15, y: 0 });
    const velocityRef = useRef({ vx: 0.002, vy: 0.0035 });
    const isDraggingRef = useRef(false);
    const lastMouseRef = useRef({ x: 0, y: 0 });
    const dragDistanceRef = useRef(0);
    const isVisibleRef = useRef(true);
    const isHoveringNodeRef = useRef(false);
    const nodesDataRef = useRef([]);

    const basePoints = useMemo(() => fibonacciSphere(TECH_ITEMS.length), []);

    // ── Desenho de Constelações em Canvas com Linhas Sutis e Limpas ──
    const drawConstellations = useCallback((nodes) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const cx = w / 2;
        const cy = h / 2;
        const THRESHOLD = 140; // Limite mais seletivo para evitar teia densa

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const nodeA = nodes[i];
                const nodeB = nodes[j];

                // Nós muito no fundo não traçam linhas para evitar poluição visual
                if (nodeA.depth < 0.35 || nodeB.depth < 0.35) continue;

                // Se houver filtro ativo, prioriza nós da categoria selecionada
                const isFiltered = selectedCategory !== 'all';
                const matchA = !isFiltered || TECH_ITEMS[i].category === selectedCategory;
                const matchB = !isFiltered || TECH_ITEMS[j].category === selectedCategory;

                const dx = nodeA.px - nodeB.px;
                const dy = nodeA.py - nodeB.py;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < THRESHOLD) {
                    const avgDepth = (nodeA.depth + nodeB.depth) / 2;
                    let opacity = (1 - dist / THRESHOLD) * avgDepth * 0.25;

                    if (isFiltered) {
                        opacity = (matchA && matchB) ? opacity * 1.8 : opacity * 0.05;
                    }

                    if (opacity > 0.03) {
                        const x1 = cx + nodeA.px;
                        const y1 = cy + nodeA.py;
                        const x2 = cx + nodeB.px;
                        const y2 = cy + nodeB.py;

                        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
                        gradient.addColorStop(0, TECH_ITEMS[i].color + Math.round(opacity * 255).toString(16).padStart(2, '0'));
                        gradient.addColorStop(1, TECH_ITEMS[j].color + Math.round(opacity * 255).toString(16).padStart(2, '0'));

                        ctx.beginPath();
                        ctx.moveTo(x1, y1);
                        ctx.lineTo(x2, y2);
                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = (matchA && matchB && isFiltered) ? 1.0 : 0.6;
                        ctx.stroke();
                    }
                }
            }
        }
    }, [selectedCategory]);

    // ── Loop de Animação com Física e Inércia Suave ──
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let raf;
        const lerp = (a, b, t) => a + (b - a) * t;

        const tick = () => {
            if (!isVisibleRef.current) return;

            const isMobile = window.innerWidth < 640;
            const RADIUS = isMobile ? 165 : 240; // Raio orbital ampliado para dar respiro aos nós
            const FOV = isMobile ? 420 : 520;

            // Física de inércia: quando solta do drag, desacelera suavemente até a rotação base
            if (!isDraggingRef.current) {
                if (isHoveringNodeRef.current) {
                    // Desacelera a rotação quando o usuário está focando em um nó
                    velocityRef.current.vx = lerp(velocityRef.current.vx, 0.0004, 0.05);
                    velocityRef.current.vy = lerp(velocityRef.current.vy, 0.0008, 0.05);
                } else {
                    // Retorna suavemente para a velocidade orbital padrão
                    velocityRef.current.vx = lerp(velocityRef.current.vx, 0.0018, 0.02);
                    velocityRef.current.vy = lerp(velocityRef.current.vy, 0.003, 0.02);
                }

                angleRef.current.x += velocityRef.current.vx;
                angleRef.current.y += velocityRef.current.vy;
            }

            const ax = angleRef.current.x;
            const ay = angleRef.current.y;
            const sinX = Math.sin(ax), cosX = Math.cos(ax);
            const sinY = Math.sin(ay), cosY = Math.cos(ay);

            const nodeEls = container.querySelectorAll('[data-sphere-node]');
            const projected = [];

            basePoints.forEach((pt, i) => {
                // Rotação Y e depois X
                const x1 = pt.x * cosY - pt.z * sinY;
                const z1 = pt.z * cosY + pt.x * sinY;
                const y2 = pt.y * cosX - z1 * sinX;
                const z2 = z1 * cosX + pt.y * sinX;

                const scale = FOV / (FOV + z2 * RADIUS);
                const depth = (z2 + 1) / 2; // 0 = fundo absoluto, 1 = frente absoluta

                const px = x1 * RADIUS * scale;
                const py = y2 * RADIUS * scale;

                projected.push({ px, py, depth, scale, z2 });

                const el = nodeEls[i];
                if (el) {
                    const isFiltered = selectedCategory !== 'all';
                    const isMatch = !isFiltered || TECH_ITEMS[i].category === selectedCategory;

                    // Nós da frente ficam com escala total; nós do fundo ficam bem menores e translúcidos
                    const depthScale = 0.55 + depth * 0.45; // Varia de 0.55 a 1.0
                    const finalScale = scale * depthScale * (isMatch ? 1 : 0.7);
                    
                    // Nós do fundo têm opacidade muito mais baixa para nunca sobrepor os da frente
                    const baseAlpha = depth < 0.3 ? 0.08 : (0.15 + depth * 0.85);
                    const finalAlpha = isMatch ? baseAlpha : baseAlpha * 0.15;

                    el.style.transform = `translate3d(${px}px, ${py}px, 0) scale(${finalScale})`;
                    el.style.zIndex = Math.floor((z2 + 1) * 100);
                    el.style.opacity = finalAlpha;
                    el.style.pointerEvents = (depth > 0.45 && isMatch) ? 'auto' : 'none';
                }
            });

            nodesDataRef.current = projected;
            drawConstellations(projected);

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

        observer.observe(container);
        raf = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(raf);
            observer.disconnect();
        };
    }, [basePoints, drawConstellations, selectedCategory]);

    // ── Redimensionamento do Canvas ──
    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const handleResize = () => {
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        };

        handleResize();
        const ro = new ResizeObserver(handleResize);
        ro.observe(container);
        return () => ro.disconnect();
    }, []);

    // ── Controles de Arrastar com Inércia / Touch & Mouse Drag ──
    const onMouseDown = (e) => {
        if (e.button !== 0) return;
        isDraggingRef.current = true;
        dragDistanceRef.current = 0;
        lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
        if (!isDraggingRef.current) {
            // Se o mouse estiver apenas movendo sobre a área, gera um torque sutil
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const mx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
                const my = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
                velocityRef.current.vx = -my * 0.005;
                velocityRef.current.vy = mx * 0.005;
            }
            return;
        }

        const dx = e.clientX - lastMouseRef.current.x;
        const dy = e.clientY - lastMouseRef.current.y;
        dragDistanceRef.current += Math.abs(dx) + Math.abs(dy);

        // Rotação direta com a movimentação
        angleRef.current.y += dx * 0.006;
        angleRef.current.x -= dy * 0.006;

        // Armazena a velocidade do lançamento para a inércia
        velocityRef.current = {
            vx: -dy * 0.0025,
            vy: dx * 0.0025,
        };

        lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
        isDraggingRef.current = false;
    };

    // Suporte a Touch em Dispositivos Móveis
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

        angleRef.current.y += dx * 0.007;
        angleRef.current.x -= dy * 0.007;

        velocityRef.current = {
            vx: -dy * 0.003,
            vy: dx * 0.003,
        };

        lastMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
        isDraggingRef.current = false;
    };

    // Ação ao clicar em um nó
    const handleNodeClick = (tech) => {
        if (dragDistanceRef.current > 6) return; // Evita disparar se estava arrastando
        setActiveTech(activeTech?.id === tech.id ? null : tech);
    };

    return (
        <div
            data-no-morph="true"
            className="no-morph relative w-full flex flex-col items-center"
        >
            {/* ── Barra Superior de Filtros por Categoria ── */}
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
                data-no-morph="true"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onMouseLeave={() => {
                    isDraggingRef.current = false;
                    isHoveringNodeRef.current = false;
                    setHoveredTech(null);
                }}
                className="no-morph relative w-full h-[480px] sm:h-[540px] md:h-[580px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing overflow-hidden rounded-3xl bg-dark/40 border border-primary/20 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
            >
                {/* Iluminação volumétrica de fundo */}
                <div className="absolute w-96 h-96 rounded-full bg-accent/10 blur-[130px] pointer-events-none" />
                <div className="absolute w-72 h-72 rounded-full bg-secondary/10 blur-[90px] pointer-events-none" />

                {/* Anéis orbitais decorativos finos e minimalistas */}
                <div
                    className="absolute pointer-events-none animate-[spin_100s_linear_infinite]"
                    style={{
                        width: 480,
                        height: 480,
                        borderRadius: '50%',
                        border: '1px dashed rgba(var(--color-accent-rgb, 140, 106, 74), 0.25)',
                        opacity: 0.35,
                    }}
                />
                <div
                    className="absolute pointer-events-none animate-[spin_160s_linear_infinite_reverse]"
                    style={{
                        width: 420,
                        height: 420,
                        borderRadius: '50%',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        transform: 'rotateX(68deg) rotateZ(25deg)',
                        opacity: 0.3,
                    }}
                />

                {/* Canvas de constelações com linhas dinâmicas */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                />

                {/* ── Nós 3D Elegantes, Compactos e Sem Poluição Visual ── */}
                <div className="relative w-0 h-0 flex items-center justify-center pointer-events-none">
                    {TECH_ITEMS.map((item, i) => {
                        const isHovered = hoveredTech?.id === item.id;
                        const isSelected = activeTech?.id === item.id;

                        return (
                            <div
                                key={item.id}
                                data-sphere-node={i}
                                data-no-morph="true"
                                onClick={() => handleNodeClick(item)}
                                onMouseEnter={() => {
                                    isHoveringNodeRef.current = true;
                                    setHoveredTech(item);
                                }}
                                onMouseLeave={() => {
                                    isHoveringNodeRef.current = false;
                                    setHoveredTech(null);
                                }}
                                className="no-morph absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer group pointer-events-auto transition-[box-shadow,border-color,background-color,transform] duration-200"
                                style={{
                                    backgroundColor: (isHovered || isSelected)
                                        ? 'rgba(15, 12, 10, 0.95)'
                                        : 'rgba(20, 15, 13, 0.75)',
                                    borderColor: (isHovered || isSelected)
                                        ? item.color
                                        : 'rgba(255, 255, 255, 0.08)',
                                    borderWidth: '1px',
                                    boxShadow: (isHovered || isSelected)
                                        ? `0 0 20px ${item.color}40, inset 0 0 10px ${item.color}15`
                                        : '0 2px 10px rgba(0, 0, 0, 0.3)',
                                    backdropFilter: 'blur(6px)',
                                }}
                            >
                                {/* Ícone compacto com fundo colorido suave */}
                                <div
                                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shrink-0"
                                    style={{ backgroundColor: `${item.color}18` }}
                                >
                                    <i
                                        className={`${item.icon} text-xs sm:text-sm`}
                                        style={{ color: item.color }}
                                    />
                                </div>

                                {/* Nome da tecnologia limpo e sem ocupar espaço excessivo */}
                                <span className="text-[11px] sm:text-xs font-medium tracking-wide font-sans text-gray-200 whitespace-nowrap group-hover:text-white transition-colors">
                                    {item.name}
                                </span>

                                {/* Ponto colorido discreto */}
                                <span
                                    className="w-1 h-1 rounded-full transition-transform group-hover:scale-150 shrink-0"
                                    style={{ backgroundColor: item.color }}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* ── Card Flutuante de Destaque / Detalhes ao Hover ou Clique ── */}
                <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 flex items-center justify-between sm:justify-end gap-3 pointer-events-none z-50">
                    <AnimatePresence mode="wait">
                        {(hoveredTech || activeTech) ? (
                            <motion.div
                                key={(hoveredTech || activeTech).id}
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="px-5 py-3.5 rounded-2xl bg-darker/95 border shadow-2xl backdrop-blur-xl max-w-sm"
                                style={{ borderColor: `${(hoveredTech || activeTech).color}60` }}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: `${(hoveredTech || activeTech).color}25` }}
                                    >
                                        <i
                                            className={`${(hoveredTech || activeTech).icon} text-xl`}
                                            style={{ color: (hoveredTech || activeTech).color }}
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-white font-sans">
                                                {(hoveredTech || activeTech).name}
                                            </span>
                                            <span
                                                className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                                                style={{
                                                    backgroundColor: `${(hoveredTech || activeTech).color}20`,
                                                    color: (hoveredTech || activeTech).color,
                                                }}
                                            >
                                                {(hoveredTech || activeTech).category}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-gray-300 font-sans mt-0.5 leading-snug">
                                            {(hoveredTech || activeTech).desc}
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
