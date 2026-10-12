import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useVelocity, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Project, ProjectFilterType, ProjectViewMode } from '../../../types/project';
import { projectCategory } from '../../../utils/projects';
import { playTabSwitch, playMechanicalClick } from '../../../lib/sound';
import useSectionInView from '../../../hooks/useSectionInView';
import ProjectArtwork from './ProjectArtwork';
import '../project-cards.css';

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
    smoothProgress: any;
    onSelect: (project: Project) => void;
    onCardFocus: (index: number) => void;
    lang: string;
}

/**
 * CylindricalCorporateCard - Card individual na curvatura côncava 3D
 * com calibração precisa de z-index, opacidade, iluminação e isolamento de eventos.
 */
const CylindricalCorporateCard = memo(function CylindricalCorporateCard({
    project,
    index,
    activeIndex,
    smoothProgress,
    onSelect,
    onCardFocus,
    lang,
}: CylindricalCorporateCardProps) {
    const isCurrent = index === activeIndex;
    const reducedMotion = useReducedMotion();

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
    const hasArtwork = project.preview?.kind === 'architecture';

    // Badge de Categoria Formatado
    const categoryBadge = useMemo(() => {
        if (cat === 'fullstack') return lang === 'en' ? 'Full-Stack Web & ERP' : lang === 'es' ? 'Full-Stack Web y ERP' : 'Full-Stack Web & ERP';
        if (cat === 'desktop') return lang === 'en' ? 'Desktop & VCL Modernization' : lang === 'es' ? 'Desktop y Modernización VCL' : 'Desktop & Modernização VCL';
        if (cat === 'backend') return lang === 'en' ? 'Back-End & Utilities' : lang === 'es' ? 'Back-End y Utilidades' : 'Back-End & Utilitários';
        return lang === 'en' ? 'Software Engineering' : lang === 'es' ? 'Ingeniería de Software' : 'Engenharia de Software';
    }, [cat, lang]);

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
            className={`absolute top-0 left-1/2 -translate-x-1/2 w-[96%] sm:w-[86vw] md:w-[780px] lg:w-[860px] h-[550px] sm:h-[500px] md:h-[480px] will-change-transform select-none antialiased subpixel-antialiased ${
                isCurrent ? 'pointer-events-auto' : 'pointer-events-auto cursor-pointer'
            }`}
        >
            {/* Card Tridimensional com Borda Luminescente e Profundidade Escura */}
            <div
                inert={!isCurrent}
                className={`portfolio-surface portfolio-card-hover w-full h-full overflow-hidden flex flex-col md:flex-row relative group transition-colors duration-300 ${
                    isCurrent
                        ? 'border-white/20 pointer-events-auto'
                        : 'border-white/5 pointer-events-none'
                }`}
            >
                <div className="project-catalogue-visual w-full md:w-[46%] h-48 sm:h-56 md:h-full relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10 shrink-0 pointer-events-none">
                    {hasArtwork ? (
                        <ProjectArtwork project={project} language={lang} />
                    ) : (
                        <img
                            src={imageUrl}
                            alt={project.title}
                            width={640}
                            height={400}
                            loading="lazy"
                            decoding="async"
                            className={`w-full h-full object-cover object-left-top transition-transform duration-500 ${reducedMotion ? '' : 'group-hover:scale-[1.025]'}`}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = '/dashboard_placeholder.png';
                            }}
                        />
                    )}
                </div>

                <div className="project-catalogue-copy p-6 sm:p-7 md:p-8 flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        <span className="project-catalogue-category">{categoryBadge}</span>
                        <h3 className="project-catalogue-title">{project.title}</h3>
                        <p className="project-catalogue-description">
                            {project.description || project.details?.fullDescription}
                        </p>
                        <p className="project-catalogue-stack">
                            {(project.tags || []).slice(0, 4).join(' · ')}
                        </p>
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
                            className="portfolio-control flex-1 min-w-[140px] py-3 px-4 font-semibold text-xs transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer relative z-30"
                        >
                            <i aria-hidden="true" className="fas fa-microchip text-xs" />
                            <span>{lang === 'en' ? 'Technical Details' : lang === 'es' ? 'Detalles Técnicos' : 'Detalhes Técnicos'}</span>
                        </button>

                        {/* Botão Código-Fonte / Repositório ou Badge de Proteção Corporativa */}
                        {project.repo_link ? (
                            <a
                                href={project.repo_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                data-cursor-morph="true"
                                className="portfolio-control py-3 px-4 font-semibold text-xs transition-colors duration-200 flex items-center justify-center gap-2 relative z-30 cursor-pointer"
                                title={lang === 'en' ? 'Source Code on GitHub' : lang === 'es' ? 'Código Fuente en GitHub' : 'Código-Fonte no GitHub'}
                                aria-label={lang === 'en' ? `Source code of ${project.title} on GitHub` : lang === 'es' ? `Código fuente de ${project.title} en GitHub` : `Código-fonte de ${project.title} no GitHub`}
                            >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                </svg>
                                <span className="hidden sm:inline">{lang === 'en' ? 'Repository' : lang === 'es' ? 'Repositorio' : 'Repositório'}</span>
                            </a>
                        ) : (
                            <div
                                className="project-catalogue-private inline-flex items-center gap-1.5 select-none relative z-30"
                                title={lang === 'en' ? 'Private Corporate Intellectual Property' : lang === 'es' ? 'Propiedad Intelectual Corporativa Privada' : 'Propriedade Intelectual Corporativa Privada'}
                            >
                                <i aria-hidden="true" className="fas fa-lock text-[10px]" />
                                <span>{lang === 'en' ? 'Private source' : lang === 'es' ? 'Código privado' : 'Código privado'}</span>
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
                                className="p-3 bg-accent hover:bg-accent-hover text-darker font-bold text-xs rounded-[10px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent transition-colors duration-200 flex items-center justify-center shrink-0 shadow-md relative z-30 cursor-pointer"
                                title={lang === 'en' ? 'Access Online Demo' : lang === 'es' ? 'Acceder a Demostración Online' : 'Acessar Demonstração Online'}
                            >
                                <i aria-hidden="true" className="fas fa-external-link-alt text-xs" />
                            </a>
                        )}
                    </div>
                </div>
                {/* Match the former brightness attenuation with a simple overlay. */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 z-40 rounded-2xl bg-black pointer-events-none transition-opacity duration-300"
                    style={{ opacity: isCurrent ? 0 : .62 }}
                />
            </div>

            {/* Sombra de Profundidade Projetada no Solo - estritamente no card ativo */}
            {isCurrent && (
                <motion.div
                    style={{ opacity: shadowOpacity, background: 'radial-gradient(ellipse at center, rgba(0,0,0,.68), transparent 70%)' }}
                    className="absolute -bottom-12 left-12 right-12 h-16 rounded-full pointer-events-none"
                    aria-hidden="true"
                />
            )}
        </motion.div>
    );
});


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

interface CorporateTableRowProps {
    project: Project;
    onSelectProject: (project: Project) => void;
    lang: string;
}

const CorporateTableRow = memo(function CorporateTableRow({ project, onSelectProject, lang }: CorporateTableRowProps) {
    const cat = projectCategory(project);
    const img = project.image_url || project.image || '/dashboard_placeholder.png';

    const handleInspect = useCallback(() => {
        playMechanicalClick();
        onSelectProject(project);
    }, [project, onSelectProject]);

    return (
        <motion.tr
            layout
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="group hover:bg-white/[0.02] transition-colors"
        >
            <td className="py-3.5 px-4">
                <div className="flex items-center gap-3">
                    <div className="portfolio-icon overflow-hidden shrink-0 flex items-center justify-center">
                        {project.preview?.kind === 'architecture' ? (
                            <i aria-hidden="true" className={project.architectureDetails?.ecosystemIcon || (cat === 'desktop' ? 'fas fa-desktop' : cat === 'backend' ? 'fas fa-code' : 'fas fa-layer-group')} />
                        ) : (
                            <img src={img} alt="" width={36} height={36} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                        )}
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
                    <i aria-hidden="true" className="fas fa-sitemap text-accent/80 text-[10px]" />
                    <span>{getProjectArchitecture(project)}</span>
                </div>
            </td>

            <td className="py-3.5 px-4">
                <div className="flex flex-wrap gap-1 max-w-[240px]">
                    {(project.tags || []).slice(0, 3).map((tag, tIdx) => (
                        <span
                            key={tIdx}
                            className="portfolio-chip"
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
                <span className="portfolio-chip">
                    {getProjectDatabase(project)}
                </span>
            </td>

            <td className="py-3.5 px-4 text-emerald-400 font-semibold text-[11px]">
                {project.details?.metrics?.[0]
                    ? (typeof project.details.metrics[0] === 'object' ? project.details.metrics[0].value : project.details.metrics[0])
                    : (project.details?.subtitle || (lang === 'en' ? 'Stable Production' : lang === 'es' ? 'Producción Estable' : 'Produção Estável'))}
            </td>

            <td className="py-3.5 px-4 text-right">
                <button
                    onClick={handleInspect}
                    data-cursor-morph="true"
                    className="portfolio-control px-3 py-1.5 text-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                    <i aria-hidden="true" className="fas fa-microchip text-[10px]" />
                    <span>{lang === 'en' ? 'Inspect' : lang === 'es' ? 'Inspeccionar' : 'Inspecionar'}</span>
                </button>
            </td>
        </motion.tr>
    );
});

/**
 * CorporateProjectsShowcase - Esteira Cilíndrica 3D com Rotação Espacial e Física de Inércia
 * para a Seção "Projetos Corporativos & Soluções".
 */
const CorporateProjectsShowcase = memo(function CorporateProjectsShowcase({
    projects = [],
    onSelectProject,
    t,
    lang = 'pt',
}: CorporateProjectsShowcaseProps) {
    const reducedMotion = useReducedMotion();
    const [activeFilter, setActiveFilter] = useState<ProjectFilterType>('all');
    const [viewMode, setViewMode] = useState<ProjectViewMode>('grid');
    const [activeIndex, setActiveIndex] = useState(0);
    const { containerRef: sectionRef, isInView } = useSectionInView({ rootMargin: '200px 0px' });

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

    // Sincronização do activeIndex com o valor da mola (apenas quando visível)
    useEffect(() => {
        if (!isInView) return;
        const unsubscribe = smoothProgress.on('change', (v: number) => {
            const rounded = Math.round(v);
            if (rounded >= 0 && rounded < totalSlides && rounded !== activeIndex) {
                setActiveIndex(rounded);
            }
        });
        return () => unsubscribe();
    }, [smoothProgress, activeIndex, totalSlides, isInView]);

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

    // ── Gestão de Arraste com Inércia & Snap Magnético (apenas quando visível) ──
    const handlePointerDown = (e: React.PointerEvent) => {
        if (!isInView) return;
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

    return (
        <div
            ref={sectionRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            style={{
                transform: 'translateZ(0)',
                isolation: 'isolate',
                transformStyle: 'preserve-3d',
            }}
            className="w-full relative outline-hidden space-y-6 select-none"
            aria-label="Esteira Cilíndrica 3D de Projetos Corporativos"
        >
            {/* ── Barra Superior: Seletor de Categorias com layoutId + Alternador de Visualização ── */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Categorias em Pílulas com Indicador de Layout Compartilhado */}
                <div className="relative max-w-full w-full sm:w-auto overflow-hidden">
                    <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-dark to-transparent z-10 sm:hidden" />
                    <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-dark to-transparent z-10 sm:hidden" />
                    <div className="portfolio-segmented flex items-center gap-1.5 overflow-x-auto scrollbar-none">
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
                                            className="absolute inset-0 bg-accent/10 border border-accent/25 rounded-[10px]"
                                            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
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
                    <div className="portfolio-segmented flex items-center gap-1">
                        <button
                            onClick={() => {
                                playMechanicalClick();
                                setViewMode('grid');
                            }}
                            data-cursor-morph="true"
                            aria-pressed={viewMode === 'grid'}
                            title={lang === 'en' ? '3D Cylindrical Stage Mode' : lang === 'es' ? 'Modo Escenario Cilíndrico 3D' : 'Modo Esteira Cilíndrica 3D'}
                            className={`portfolio-control px-3 py-1.5 text-xs font-mono flex items-center gap-1.5 cursor-pointer ${
                                viewMode === 'grid'
                                    ? 'font-bold'
                                    : 'text-primary/70 hover:text-white'
                            }`}
                        >
                            <i aria-hidden="true" className="fas fa-cube text-[10px]" />
                            <span>{lang === 'en' ? '3D Stage' : lang === 'es' ? 'Escenario 3D' : 'Esteira 3D'}</span>
                        </button>
                        <button
                            onClick={() => {
                                playMechanicalClick();
                                setViewMode('table');
                            }}
                            data-cursor-morph="true"
                            aria-pressed={viewMode === 'table'}
                            title={lang === 'en' ? 'Engineering Specs Table Mode' : lang === 'es' ? 'Modo Tabla de Especificaciones' : 'Modo Tabela de Especificações de Engenharia'}
                            className={`portfolio-control px-3 py-1.5 text-xs font-mono flex items-center gap-1.5 cursor-pointer ${
                                viewMode === 'table'
                                    ? 'font-bold'
                                    : 'text-primary/70 hover:text-white'
                            }`}
                        >
                            <i aria-hidden="true" className="fas fa-table-list text-[10px]" />
                            <span>{lang === 'en' ? 'Specs Table' : lang === 'es' ? 'Tabla Técnica' : 'Tabela Densa'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Contador Informativo e Status da Esteira */}
            <div className="flex items-center justify-between text-xs font-mono text-primary/60 border-b border-white/5 pb-2">
                <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
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
                        initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: reducedMotion ? 0 : -6 }}
                        transition={{ duration: reducedMotion ? 0 : .65, ease: [.22, 1, .36, 1] }}
                        className="relative w-full overflow-hidden py-4 sm:py-6"
                    >
                        {/* ── Palco 3D Tridimensional com Curvatura Cilíndrica e Perspectiva ── */}
                        <div
                            onPointerDown={handlePointerDown}
                            className="relative w-full h-[590px] sm:h-[530px] md:h-[510px] cursor-grab active:cursor-grabbing select-none"
                            style={{
                                perspective: '1200px',
                                perspectiveOrigin: '50% 50%',
                                isolation: 'isolate',
                                transformStyle: 'preserve-3d',
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
                                            className={`transition-colors duration-300 rounded-full cursor-pointer ${
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
                                    className="portfolio-control w-10 h-10 flex items-center justify-center transition-colors cursor-pointer"
                                    title="Projeto Anterior (Seta Esquerda)"
                                    aria-label="Projeto Anterior"
                                >
                                    <i aria-hidden="true" className="fas fa-chevron-left text-xs" />
                                </button>
                                <span className="font-mono text-xs text-primary/70 px-1">
                                    <strong className="text-white font-bold">{activeIndex + 1}</strong>
                                    <span className="mx-1 text-primary/40">/</span>
                                    <span>{totalSlides}</span>
                                </span>
                                <button
                                    onClick={handleNext}
                                    data-cursor-morph="true"
                                    className="portfolio-control w-10 h-10 flex items-center justify-center transition-colors cursor-pointer"
                                    title="Próximo Projeto (Seta Direita)"
                                    aria-label="Próximo Projeto"
                                >
                                    <i aria-hidden="true" className="fas fa-chevron-right text-xs" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    /* ── Tabela Densa de Engenharia & Especificações ── */
                    <motion.div
                        key="corporate-table-view"
                        initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: reducedMotion ? 0 : -6 }}
                        transition={{ duration: reducedMotion ? 0 : .65, ease: [.22, 1, .36, 1] }}
                        className="portfolio-surface overflow-hidden"
                    >
                        <div className="overflow-x-auto scrollbar-thin">
                            <table className="w-full text-left text-xs font-mono border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 bg-black/40 text-[11px] uppercase tracking-wider text-primary/60">
                                        <th className="py-3 px-4">{lang === 'en' ? 'System / Project' : lang === 'es' ? 'Sistema / Proyecto' : 'Sistema / Projeto'}</th>
                                        <th className="py-3 px-4">{lang === 'en' ? 'Architecture & Pattern' : lang === 'es' ? 'Arquitectura y Patrón' : 'Arquitetura & Padrão'}</th>
                                        <th className="py-3 px-4">{lang === 'en' ? 'Stack / Technologies' : lang === 'es' ? 'Stack / Tecnologías' : 'Stack / Tecnologias'}</th>
                                        <th className="py-3 px-4">{lang === 'en' ? 'Database' : lang === 'es' ? 'Base de Datos' : 'Banco de Dados'}</th>
                                        <th className="py-3 px-4">{lang === 'en' ? 'Metric & Scope' : lang === 'es' ? 'Métrica y Alcance' : 'Métrica & Escopo'}</th>
                                        <th className="py-3 px-4 text-right">{lang === 'en' ? 'Action' : lang === 'es' ? 'Acción' : 'Ação'}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredProjects.map((project) => (
                                        <CorporateTableRow
                                            key={`row-${project.id}`}
                                            project={project}
                                            onSelectProject={onSelectProject}
                                            lang={lang}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

export default CorporateProjectsShowcase;
