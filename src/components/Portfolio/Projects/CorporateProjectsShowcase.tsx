import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useVelocity, AnimatePresence } from 'framer-motion';
import { Project, ProjectFilterType, ProjectViewMode } from '../../../types/project';
import { projectCategory } from '../../../utils/projects';
import { playTabSwitch, playMechanicalClick } from '../../../lib/sound';

interface CorporateProjectsShowcaseProps {
    projects: Project[];
    onSelectProject: (project: Project) => void;
    t?: (key: string) => string;
    lang?: string;
}

interface CylindricalCorporateCardProps {
    project: Project;
    index: number;
    activeIndex: number;
    totalInView: number;
    smoothProgress: any;
    onSelect: (project: Project) => void;
    onCardFocus: (index: number) => void;
    lang: string;
}

/**
 * CylindricalCorporateCard - Card individual na curvatura côncava 3D
 * com calibração precisa de z-index, opacidade, iluminação e isolamento de eventos.
 */
function CylindricalCorporateCard({
    project,
    index,
    activeIndex,
    totalInView,
    smoothProgress,
    onSelect,
    onCardFocus,
    lang,
}: CylindricalCorporateCardProps) {
    const isCurrent = index === activeIndex;

    // ── 1. Gestão Estrita de Z-Index & Empilhamento Espacial ──
    // O card central/ativo recebe prioridade z-index 50; os adjacentes decrescem
    const zIndex = isCurrent ? 50 : Math.max(10, 30 - Math.abs(index - activeIndex));

    // ── 2. Cinemática Cilíndrica Tridimensional ──
    // Deslocamento X com 115% de espaçamento lateral evitando colisões de bordas
    const translateX = useTransform(smoothProgress, (p: number) => `${(index - p) * 115}%`);
    // Rotação Y côncava (-24deg por unidade de deslocamento)
    const rotateY = useTransform(smoothProgress, (p: number) => `${(index - p) * -24}deg`);
    // Recuo no eixo Z: 0px no centro, -220px nos cartões laterais
    const translateZ = useTransform(smoothProgress, (p: number) => `${-Math.abs(index - p) * 220}px`);
    // Escala proporcional à distância angular
    const scale = useTransform(smoothProgress, (p: number) => Math.max(0.85, 1 - Math.abs(index - p) * 0.15));
    // Atenuação de opacidade para foco óptico dramático
    const opacity = useTransform(smoothProgress, (p: number) => Math.max(0.2, 1 - Math.abs(index - p) * 0.6));
    const shadowOpacity = useTransform(smoothProgress, (p: number) => Math.max(0, 0.85 - Math.abs(index - p) * 0.45));

    const handleContainerClick = () => {
        if (!isCurrent) {
            onCardFocus(index);
        }
    };

    const cat = projectCategory(project);
    const imageUrl = project.image_url || project.image || '/dashboard_placeholder.png';

    // Badge de Categoria Formatado
    const categoryBadge = useMemo(() => {
        if (cat === 'fullstack') return 'Full-Stack Web & ERP';
        if (cat === 'desktop') return 'Desktop & Modernização VCL';
        if (cat === 'backend') return 'Back-End & Utilitários';
        return 'Engenharia de Software';
    }, [cat]);

    // Métrica de Destaque
    const highlightMetric = useMemo(() => {
        if (project.details?.metrics?.[0]) {
            const m = project.details.metrics[0];
            return typeof m === 'object' && m.value ? m.value : String(m);
        }
        if (project.architectureDetails?.volume) {
            return project.architectureDetails.volume;
        }
        return 'Produção Estável';
    }, [project]);

    return (
        <motion.div
            style={{
                translateX,
                rotateY,
                translateZ,
                scale,
                opacity,
                zIndex,
                isolation: 'isolate',
                transformStyle: 'preserve-3d',
                transformOrigin: '50% 50%',
            }}
            onClick={handleContainerClick}
            className={`absolute top-0 left-1/2 -translate-x-1/2 w-[92vw] sm:w-[86vw] md:w-[780px] lg:w-[860px] h-[530px] sm:h-[500px] md:h-[480px] will-change-transform select-none antialiased subpixel-antialiased ${
                isCurrent ? 'pointer-events-auto' : 'pointer-events-auto cursor-pointer'
            }`}
        >
            {/* Card Tridimensional com Borda Luminescente e Profundidade Escura */}
            <div
                className={`w-full h-full rounded-2xl bg-[#0C0F17] border border-white/15 overflow-hidden flex flex-col md:flex-row shadow-[0_30px_90px_rgba(0,0,0,0.95)] relative group transition-all duration-300 ${
                    isCurrent
                        ? 'brightness-100 pointer-events-auto'
                        : 'brightness-[0.38] backdrop-blur-[1px] filter pointer-events-none'
                }`}
            >
                {/* ── Lado Esquerdo: Imagem de Alta Fidelidade com Gradiente de Imersão ── */}
                <div className="w-full md:w-[46%] h-48 sm:h-56 md:h-full relative overflow-hidden bg-[#06080D] border-b md:border-b-0 md:border-r border-white/10 shrink-0 pointer-events-none">
                    <img
                        src={imageUrl}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-left-top transform group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = '/dashboard_placeholder.png';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0C0F17] via-transparent to-transparent opacity-70 pointer-events-none" />

                    {/* Badge de Categoria com Indicador Ativo */}
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-darker/95 border border-accent/40 backdrop-blur-md shadow-lg pointer-events-none">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span className="text-[10px] sm:text-[11px] font-mono font-bold text-accent">
                            {categoryBadge}
                        </span>
                    </div>

                    {/* Número do Slide no Showcase */}
                    <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/80 border border-white/10 text-[10px] font-mono text-primary/70 pointer-events-none">
                        <span>#</span>
                        <span className="text-white font-bold">{String(index + 1).padStart(2, '0')}</span>
                        <span>/</span>
                        <span>{String(totalInView).padStart(2, '0')}</span>
                    </div>
                </div>

                {/* ── Lado Direito: Especificações de Engenharia & Ações sem Conflito ── */}
                <div className="p-6 sm:p-7 md:p-8 flex-1 flex flex-col justify-between overflow-hidden bg-[#0C0F17]">
                    <div>
                        {/* Cabeçalho do Card: Identificador + Métrica Confiável */}
                        <div className="flex items-center justify-between gap-3 mb-2.5">
                            <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
                                {project.architectureDetails?.architectureType ? 'ARQUITETURA CORPORATIVA' : `# 0${index + 1}. SISTEMA EMPRESARIAL`}
                            </span>
                            <span className="text-[10px] sm:text-[11px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/25 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shrink-0 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                {highlightMetric}
                            </span>
                        </div>

                        {/* Título do Projeto */}
                        <h3 className="text-2xl sm:text-3xl font-serif text-white font-bold tracking-tight mb-1.5 group-hover:text-accent transition-colors truncate">
                            {project.title}
                        </h3>

                        {/* Subtítulo / Tagline Arquitetural */}
                        <p className="text-primary/90 text-xs sm:text-sm font-sans font-medium mb-3">
                            {project.details?.subtitle || project.description || 'Solução corporativa orientada a resiliência e integridade.'}
                        </p>

                        {/* Descrição Detalhada */}
                        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 font-sans line-clamp-3 md:line-clamp-4">
                            {project.details?.fullDescription || project.description}
                        </p>

                        {/* Badges de Stack Técnica */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {(project.tags || []).slice(0, 5).map((tech) => (
                                <span
                                    key={tech}
                                    className="text-[11px] font-mono text-white/90 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md transition-colors hover:border-accent/40"
                                >
                                    {tech}
                                </span>
                            ))}
                            {(project.tags || []).length > 5 && (
                                <span className="text-[10px] font-mono text-primary/60 self-center px-1">
                                    +{(project.tags || []).length - 5}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* ── Rodapé Integrado: Ações Diretas com z-index e pointer-events calibrados ── */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-white/10 mt-auto relative z-20">
                        {/* Botão Detalhes Técnicos (Abre Inspector Drawer) */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                playMechanicalClick();
                                onSelect(project);
                            }}
                            data-cursor-morph="true"
                            className="flex-1 min-w-[140px] py-3 px-4 bg-accent/20 border border-accent/40 hover:bg-accent hover:text-darker text-accent font-semibold text-xs rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 relative z-30"
                        >
                            <i className="fas fa-microchip text-xs" />
                            <span>Detalhes Técnicos</span>
                        </button>

                        {/* Botão Código-Fonte / Repositório ou Badge de Proteção Corporativa */}
                        {project.repo_link ? (
                            <a
                                href={project.repo_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                data-cursor-morph="true"
                                className="py-3 px-4 bg-dark/90 hover:bg-dark border border-white/15 hover:border-accent/50 text-white font-semibold text-xs rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 shadow-sm relative z-30 cursor-pointer"
                                title="Código-Fonte no GitHub"
                                aria-label={`Código-fonte de ${project.title} no GitHub`}
                            >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                </svg>
                                <span className="hidden sm:inline">Repositório</span>
                            </a>
                        ) : (
                            <div
                                className="py-3 px-3.5 bg-amber-500/10 border border-amber-500/25 text-amber-400 font-mono text-xs rounded-xl flex items-center justify-center gap-1.5 select-none relative z-30"
                                title="Propriedade Intelectual Corporativa Privada"
                            >
                                <i className="fas fa-lock text-[10px]" />
                                <span className="text-[11px] font-semibold">Corporativo Privado</span>
                            </div>
                        )}

                        {/* Botão de Demonstração (se houver) */}
                        {project.demo_link && (
                            <a
                                href={project.demo_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                data-cursor-morph="true"
                                className="p-3 bg-accent hover:bg-accent-hover text-darker font-bold text-xs rounded-xl transition-all duration-200 flex items-center justify-center shrink-0 shadow-md active:scale-95 relative z-30 cursor-pointer"
                                title="Acessar Demonstração Online"
                            >
                                <i className="fas fa-external-link-alt text-xs" />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Sombra de Profundidade Projetada no Solo */}
            <motion.div
                style={{ opacity: shadowOpacity }}
                className="absolute -bottom-8 left-10 right-10 h-8 bg-black/95 blur-2xl rounded-full pointer-events-none"
            />
        </motion.div>
    );
}

/**
 * CorporateProjectsShowcase - Esteira Cilíndrica 3D com Rotação Espacial e Física de Inércia
 * para a Seção "Projetos Corporativos & Soluções".
 */
export default function CorporateProjectsShowcase({
    projects = [],
    onSelectProject,
    t,
    lang = 'pt',
}: CorporateProjectsShowcaseProps) {
    const [activeFilter, setActiveFilter] = useState<ProjectFilterType>('all');
    const [viewMode, setViewMode] = useState<ProjectViewMode>('grid');
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // ── Definição dos Filtros de Categoria com Layout Compartilhado ──
    const FILTERS = useMemo(() => [
        { id: 'all' as const,       label: lang === 'en' ? '# ALL' : '# TODOS' },
        { id: 'fullstack' as const, label: '# WEB / FULLSTACK' },
        { id: 'desktop' as const,   label: '# DESKTOP / DELPHI' },
        { id: 'backend' as const,   label: '# BACK-END / APIS' },
    ], [lang]);

    // Filtragem dos projetos corporativos
    const filteredProjects = useMemo(() => {
        if (!Array.isArray(projects)) return [];
        if (activeFilter === 'all') return projects;
        return projects.filter(p => projectCategory(p) === activeFilter);
    }, [projects, activeFilter]);

    const totalSlides = filteredProjects.length;

    // ── Motion Values com Mola Amortecida (Jesper Landberg Physics) ──
    const progress = useMotionValue(0);
    const smoothProgress = useSpring(progress, {
        stiffness: 220,
        damping: 26,
        mass: 0.5,
    });

    // Skew e rotação Z reativa à velocidade do arraste
    const progressVelocity = useVelocity(smoothProgress);
    const velocityRotateZ = useTransform(progressVelocity, [-8, 0, 8], [2.8, 0, -2.8]);
    const velocitySkewX = useTransform(progressVelocity, [-8, 0, 8], [-1.8, 0, 1.8]);

    // Refs para arraste contínuo
    const isDraggingRef = useRef(false);
    const hasDraggedRef = useRef(false);
    const startXRef = useRef(0);
    const startProgressRef = useRef(0);
    const lastXRef = useRef(0);
    const lastTimeRef = useRef(0);
    const velocityRef = useRef(0);

    // Sincronização do activeIndex com o valor da mola
    useEffect(() => {
        const unsubscribe = smoothProgress.on('change', (v: number) => {
            const rounded = Math.round(v);
            if (rounded >= 0 && rounded < totalSlides && rounded !== activeIndex) {
                setActiveIndex(rounded);
            }
        });
        return () => unsubscribe();
    }, [smoothProgress, activeIndex, totalSlides]);

    // Navegação programática para um índice alvo
    const navigateTo = useCallback((targetIndex: number) => {
        if (totalSlides === 0) return;
        const clamped = Math.max(0, Math.min(totalSlides - 1, targetIndex));
        progress.set(clamped);
        setActiveIndex(clamped);
        playTabSwitch();
    }, [progress, totalSlides]);

    // Reset ao mudar de categoria
    const handleFilterChange = useCallback((filterId: ProjectFilterType) => {
        playTabSwitch();
        setActiveFilter(filterId);
        progress.set(0);
        setActiveIndex(0);
    }, [progress]);

    const handlePrev = useCallback(() => {
        if (totalSlides === 0) return;
        const current = Math.round(progress.get());
        const prev = current > 0 ? current - 1 : totalSlides - 1;
        navigateTo(prev);
    }, [navigateTo, progress, totalSlides]);

    const handleNext = useCallback(() => {
        if (totalSlides === 0) return;
        const current = Math.round(progress.get());
        const next = current < totalSlides - 1 ? current + 1 : 0;
        navigateTo(next);
    }, [navigateTo, progress, totalSlides]);

    // ── Gestão de Arraste com Inércia & Snap Magnético ──
    const handlePointerDown = (e: React.PointerEvent) => {
        if (totalSlides <= 1) return;
        if (e.button !== undefined && e.button !== 0) return;
        isDraggingRef.current = true;
        hasDraggedRef.current = false;
        startXRef.current = e.clientX;
        startProgressRef.current = progress.get();
        lastXRef.current = e.clientX;
        lastTimeRef.current = performance.now();
        velocityRef.current = 0;

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerUp);
    };

    const handlePointerMove = (e: PointerEvent) => {
        if (!isDraggingRef.current) return;
        const now = performance.now();
        const dt = Math.max(now - lastTimeRef.current, 1);
        const dx = e.clientX - lastXRef.current;
        velocityRef.current = dx / dt; // px/ms
        lastXRef.current = e.clientX;
        lastTimeRef.current = now;

        const totalDeltaX = e.clientX - startXRef.current;
        if (Math.abs(totalDeltaX) > 8) {
            hasDraggedRef.current = true;
        }

        // Sensibilidade de arraste adaptada à largura
        const dragDistance = 340;
        const newProgress = startProgressRef.current - totalDeltaX / dragDistance;
        // Permite leve overscroll com resistência elástica nas pontas
        const clamped = Math.max(-0.25, Math.min(totalSlides - 0.75, newProgress));
        progress.set(clamped);
    };

    const handlePointerUp = () => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;

        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerUp);

        const currentP = progress.get();
        // Injeção de inércia baseada na velocidade do ponteiro
        const inertiaOffset = velocityRef.current * 0.35;
        const target = Math.round(currentP - inertiaOffset);
        const clampedTarget = Math.max(0, Math.min(totalSlides - 1, target));

        progress.set(clampedTarget);
        setActiveIndex(clampedTarget);
    };

    // Suporte a teclado quando o elemento estiver focado
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            handlePrev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            handleNext();
        }
    };

    // Metadados para o Modo Tabela Densa
    const getProjectDatabase = (p: Project) => {
        const tags = p.tags || [];
        if (tags.includes('SQL Server')) return 'SQL Server';
        if (tags.includes('MySQL')) return 'MySQL';
        if (tags.includes('PostgreSQL')) return 'PostgreSQL';
        return 'Relacional / Embed';
    };

    const getProjectArchitecture = (p: Project) => {
        if (p.architectureDetails?.architectureType) {
            return p.architectureDetails.architectureType.split(':')[0].trim();
        }
        if (p.details?.architecture?.[0]?.tech) {
            return p.details.architecture[0].tech.split('+')[0].trim();
        }
        if ((p.tags || []).includes('Multi-tenant')) return 'Multi-tenant Lógico';
        if ((p.tags || []).includes('UniGui')) return 'RAD ServerModule Web';
        if ((p.tags || []).includes('Laravel')) return 'REST API Desacoplada';
        return 'MVC / Modular';
    };

    return (
        <div
            ref={containerRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="w-full relative outline-hidden space-y-6 select-none"
            aria-label="Esteira Cilíndrica 3D de Projetos Corporativos"
        >
            {/* ── Barra Superior: Seletor de Categorias com layoutId + Alternador de Visualização ── */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Categorias em Pílulas com Indicador de Layout Compartilhado */}
                <div className="relative max-w-full w-full sm:w-auto overflow-hidden">
                    <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-dark to-transparent z-10 sm:hidden" />
                    <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-dark to-transparent z-10 sm:hidden" />
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 px-1 bg-black/40 border border-white/10 rounded-2xl p-1.5 backdrop-blur-md">
                        {FILTERS.map((f) => {
                            const isActive = activeFilter === f.id;
                            return (
                                <button
                                    key={f.id}
                                    onClick={() => handleFilterChange(f.id)}
                                    data-cursor-morph="true"
                                    className={`relative px-3.5 py-1.5 text-xs font-mono font-semibold tracking-wider rounded-xl transition-colors cursor-pointer shrink-0 ${
                                        isActive ? 'text-white font-bold' : 'text-primary/70 hover:text-white'
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeCorporateCategoryTab"
                                            className="absolute inset-0 bg-accent/20 border border-accent/50 rounded-xl shadow-[0_0_15px_rgba(255,108,55,0.25)]"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{f.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Alternador de Modo: Esteira Cilíndrica 3D vs Tabela Densa de Especificações */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-xl p-1 backdrop-blur-md">
                        <button
                            onClick={() => {
                                playMechanicalClick();
                                setViewMode('grid');
                            }}
                            data-cursor-morph="true"
                            title="Modo Esteira Cilíndrica 3D"
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                                viewMode === 'grid'
                                    ? 'bg-accent text-darker font-bold shadow-xs'
                                    : 'text-primary/70 hover:text-white'
                            }`}
                        >
                            <i className="fas fa-cube text-[10px]" />
                            <span>Esteira 3D</span>
                        </button>
                        <button
                            onClick={() => {
                                playMechanicalClick();
                                setViewMode('table');
                            }}
                            data-cursor-morph="true"
                            title="Modo Tabela de Especificações de Engenharia"
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                                viewMode === 'table'
                                    ? 'bg-accent text-darker font-bold shadow-xs'
                                    : 'text-primary/70 hover:text-white'
                            }`}
                        >
                            <i className="fas fa-table-list text-[10px]" />
                            <span>{lang === 'en' ? 'Specs Table' : 'Tabela Densa'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Contador Informativo e Status da Esteira */}
            <div className="flex items-center justify-between text-xs font-mono text-primary/60 border-b border-white/5 pb-2">
                <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    <span>
                        {filteredProjects.length}{' '}
                        {lang === 'en'
                            ? `system${filteredProjects.length !== 1 ? 's' : ''} in category`
                            : `sistema${filteredProjects.length !== 1 ? 's' : ''} corporativo${filteredProjects.length !== 1 ? 's' : ''}`}
                    </span>
                </span>
                <span className="text-[11px] text-accent/80 hidden sm:inline">
                    {viewMode === 'grid' ? '← Arraste horizontal com física de inércia →' : 'Engenharia de Software & Conformidade'}
                </span>
            </div>

            {/* ── Visualização Alternável: 3D Cylindrical Stage ou Tabela Densa ── */}
            <AnimatePresence mode="wait">
                {viewMode === 'grid' ? (
                    <motion.div
                        key="corporate-cylindrical-view"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="relative w-full overflow-hidden py-4 sm:py-6"
                    >
                        {/* ── Palco 3D Tridimensional com Curvatura Cilíndrica e Perspectiva ── */}
                        <div
                            onPointerDown={handlePointerDown}
                            className="relative w-full h-[560px] sm:h-[530px] md:h-[510px] cursor-grab active:cursor-grabbing select-none"
                            style={{
                                perspective: '1200px',
                                perspectiveOrigin: '50% 50%',
                            }}
                        >
                            <motion.div
                                style={{
                                    rotateZ: velocityRotateZ,
                                    skewX: velocitySkewX,
                                    transformStyle: 'preserve-3d',
                                }}
                                className="w-full h-full relative"
                            >
                                {filteredProjects.map((project, index) => (
                                    <CylindricalCorporateCard
                                        key={`corp-card-${project.id}`}
                                        project={project}
                                        index={index}
                                        activeIndex={activeIndex}
                                        totalInView={totalSlides}
                                        smoothProgress={smoothProgress}
                                        onSelect={onSelectProject}
                                        onCardFocus={navigateTo}
                                        lang={lang}
                                    />
                                ))}
                            </motion.div>
                        </div>

                        {/* ── Controles Sincronizados de Navegação da Esteira ── */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-white/5 relative z-40">
                            {/* Pílulas Indicadoras de Índice com Clique Direto */}
                            <div className="flex items-center gap-2">
                                {filteredProjects.map((p, idx) => {
                                    const isCurrent = idx === activeIndex;
                                    return (
                                        <button
                                            key={`pill-${p.id}`}
                                            onClick={() => navigateTo(idx)}
                                            data-cursor-morph="true"
                                            className={`transition-all duration-300 rounded-full cursor-pointer ${
                                                isCurrent
                                                    ? 'w-8 h-2 bg-accent shadow-[0_0_12px_rgba(255,108,55,0.6)]'
                                                    : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                                            }`}
                                            title={`Navegar para ${p.title}`}
                                            aria-label={`Ir para projeto ${idx + 1}: ${p.title}`}
                                        />
                                    );
                                })}
                            </div>

                            {/* Setas de Avanço com Ergonomia e Som Mecânico */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handlePrev}
                                    data-cursor-morph="true"
                                    className="w-10 h-10 rounded-xl bg-black/60 border border-white/15 hover:border-accent/60 text-white hover:text-accent flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-lg backdrop-blur-md"
                                    title="Projeto Anterior (Seta Esquerda)"
                                    aria-label="Projeto Anterior"
                                >
                                    <i className="fas fa-chevron-left text-xs" />
                                </button>
                                <span className="font-mono text-xs text-primary/70 px-1">
                                    <strong className="text-white font-bold">{activeIndex + 1}</strong>
                                    <span className="mx-1 text-primary/40">/</span>
                                    <span>{totalSlides}</span>
                                </span>
                                <button
                                    onClick={handleNext}
                                    data-cursor-morph="true"
                                    className="w-10 h-10 rounded-xl bg-black/60 border border-white/15 hover:border-accent/60 text-white hover:text-accent flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-lg backdrop-blur-md"
                                    title="Próximo Projeto (Seta Direita)"
                                    aria-label="Próximo Projeto"
                                >
                                    <i className="fas fa-chevron-right text-xs" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    /* ── Tabela Densa de Engenharia & Especificações ── */
                    <motion.div
                        key="corporate-table-view"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.22 }}
                        className="rounded-2xl border border-white/10 bg-darker/80 backdrop-blur-xl overflow-hidden shadow-2xl"
                    >
                        <div className="overflow-x-auto scrollbar-thin">
                            <table className="w-full text-left text-xs font-mono border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 bg-black/40 text-[11px] uppercase tracking-wider text-primary/60">
                                        <th className="py-3 px-4">Sistema / Projeto</th>
                                        <th className="py-3 px-4">Arquitetura & Padrão</th>
                                        <th className="py-3 px-4">Stack / Tecnologias</th>
                                        <th className="py-3 px-4">Banco de Dados</th>
                                        <th className="py-3 px-4">Métrica & Escopo</th>
                                        <th className="py-3 px-4 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredProjects.map((project) => {
                                        const cat = projectCategory(project);
                                        const img = project.image_url || project.image || '/dashboard_placeholder.png';
                                        return (
                                            <motion.tr
                                                key={`row-${project.id}`}
                                                layout
                                                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                                                className="group hover:bg-white/[0.02] transition-colors"
                                            >
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg bg-black/60 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                                                            <img
                                                                src={img}
                                                                alt={project.title}
                                                                className="w-full h-full object-cover"
                                                                onError={(e: any) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = '/dashboard_placeholder.png';
                                                                }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-white group-hover:text-accent transition-colors">
                                                                {project.title}
                                                            </div>
                                                            <span className="text-[10px] text-primary/60 uppercase">
                                                                {cat}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4 text-gray-300">
                                                    <div className="flex items-center gap-1.5">
                                                        <i className="fas fa-sitemap text-accent/80 text-[10px]" />
                                                        <span>{getProjectArchitecture(project)}</span>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <div className="flex flex-wrap gap-1 max-w-[240px]">
                                                        {(project.tags || []).slice(0, 3).map((tag, tIdx) => (
                                                            <span
                                                                key={tIdx}
                                                                className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-primary/80"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                        {(project.tags || []).length > 3 && (
                                                            <span className="text-[10px] text-primary/40">
                                                                +{(project.tags || []).length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px]">
                                                        {getProjectDatabase(project)}
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-4 text-emerald-400 font-semibold text-[11px]">
                                                    {project.details?.metrics?.[0]
                                                        ? (typeof project.details.metrics[0] === 'object' ? project.details.metrics[0].value : project.details.metrics[0])
                                                        : (project.details?.subtitle || 'Produção Estável')}
                                                </td>

                                                <td className="py-3.5 px-4 text-right">
                                                    <button
                                                        onClick={() => {
                                                            playMechanicalClick();
                                                            onSelectProject(project);
                                                        }}
                                                        data-cursor-morph="true"
                                                        className="px-3 py-1.5 rounded-lg bg-accent/15 border border-accent/40 text-accent hover:bg-accent hover:text-darker text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                                                    >
                                                        <i className="fas fa-microchip text-[10px]" />
                                                        <span>Inspecionar</span>
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
