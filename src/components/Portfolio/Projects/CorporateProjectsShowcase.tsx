import React, { useState, useRef, useId, useCallback, useMemo, memo, forwardRef } from 'react';
import { motion, AnimatePresence, LayoutGroup, useIsPresent, useReducedMotion, type Variants } from 'framer-motion';
import type { Project, ProjectFilterType, ProjectViewMode } from '../../../types/project';
import { projectCategory } from '../../../utils/projects';
import { playTabSwitch, playMechanicalClick } from '../../../lib/sound';
import ProjectArtwork from './ProjectArtwork';
import '../project-cards.css';

interface CorporateProjectsShowcaseProps {
    projects: Project[];
    onSelectProject: (project: Project) => void;
    t?: (key: string) => string;
    lang?: string;
}

const EASE_OUT: [number, number, number, number] = [.22, 1, .36, 1];
const EASE_IN_OUT: [number, number, number, number] = [.76, 0, .24, 1];
const pad = (n: number) => String(n).padStart(2, '0');

const words = (lang: string) => ({
    index: lang === 'en' ? 'Index' : lang === 'es' ? 'Índice' : 'Índice',
    indexTitle: lang === 'en' ? 'Numbered index' : lang === 'es' ? 'Índice numerado' : 'Índice numerado',
    table: lang === 'en' ? 'Specs table' : lang === 'es' ? 'Tabla técnica' : 'Tabela densa',
    tableTitle: lang === 'en' ? 'Engineering specs table' : lang === 'es' ? 'Tabla de especificaciones' : 'Tabela de especificações de engenharia',
    details: lang === 'en' ? 'Technical details' : lang === 'es' ? 'Detalles técnicos' : 'Detalhes técnicos',
    repo: lang === 'en' ? 'Repository' : lang === 'es' ? 'Repositorio' : 'Repositório',
    repoTitle: lang === 'en' ? 'Source code on GitHub' : lang === 'es' ? 'Código fuente en GitHub' : 'Código-fonte no GitHub',
    private: lang === 'en' ? 'Private source' : lang === 'es' ? 'Código privado' : 'Código privado',
    privateTitle: lang === 'en' ? 'Private corporate intellectual property' : lang === 'es' ? 'Propiedad intelectual corporativa privada' : 'Propriedade intelectual corporativa privada',
    demo: lang === 'en' ? 'Online demo' : lang === 'es' ? 'Demo online' : 'Demonstração online',
    architecture: lang === 'en' ? 'Architecture' : lang === 'es' ? 'Arquitectura' : 'Arquitetura',
    database: lang === 'en' ? 'Data' : lang === 'es' ? 'Datos' : 'Dados',
    listLabel: lang === 'en' ? 'Enterprise systems index' : lang === 'es' ? 'Índice de sistemas corporativos' : 'Índice de sistemas corporativos',
    filters: lang === 'en' ? 'Project categories' : lang === 'es' ? 'Categorías de proyectos' : 'Categorias de projetos',
    views: lang === 'en' ? 'Catalogue view' : lang === 'es' ? 'Vista del catálogo' : 'Visualização do catálogo',
    preview: lang === 'en' ? 'Project preview' : lang === 'es' ? 'Vista previa del proyecto' : 'Prévia do projeto',
    hint: lang === 'en' ? 'Hover, focus or use ↑ ↓ to preview' : lang === 'es' ? 'Pasa el cursor, enfoca o usa ↑ ↓ para ver' : 'Passe o cursor, foque ou use ↑ ↓ para visualizar',
    tableHint: lang === 'en' ? 'Software Engineering & Compliance' : lang === 'es' ? 'Ingeniería de Software y Cumplimiento' : 'Engenharia de Software & Conformidade',
    empty: lang === 'en' ? 'No systems in this category.' : lang === 'es' ? 'No hay sistemas en esta categoría.' : 'Nenhum sistema nesta categoria.',
    unspecified: lang === 'en' ? 'Not specified' : lang === 'es' ? 'No especificado' : 'Não especificado',
    count: (n: number) => (lang === 'en' ? `${n} system${n !== 1 ? 's' : ''} in view` : lang === 'es' ? `${n} sistema${n !== 1 ? 's' : ''} en vista` : `${n} sistema${n !== 1 ? 's' : ''} em exibição`),
    stable: lang === 'en' ? 'Stable Production' : lang === 'es' ? 'Producción Estable' : 'Produção Estável',
    inspect: lang === 'en' ? 'Inspect' : lang === 'es' ? 'Inspeccionar' : 'Inspecionar',
});

const categoryLabel = (project: Project, lang: string) => {
    const cat = projectCategory(project);
    if (cat === 'fullstack') return lang === 'es' ? 'Full-Stack Web y ERP' : 'Full-Stack Web & ERP';
    if (cat === 'desktop') return lang === 'en' ? 'Desktop & VCL Modernization' : lang === 'es' ? 'Desktop y Modernización VCL' : 'Desktop & Modernização VCL';
    if (cat === 'backend') return lang === 'en' ? 'Back-End & Utilities' : lang === 'es' ? 'Back-End y Utilidades' : 'Back-End & Utilitários';
    return lang === 'en' ? 'Software Engineering' : lang === 'es' ? 'Ingeniería de Software' : 'Engenharia de Software';
};

// Metadados para o Modo Tabela Densa
const getProjectDatabase = (p: Project, lang: string) => {
    if (p.architectureDetails?.database) return p.architectureDetails.database;
    const tags = p.tags || [];
    if (tags.includes('SQL Server')) return 'SQL Server';
    if (tags.includes('MySQL')) return 'MySQL';
    if (tags.includes('PostgreSQL')) return 'PostgreSQL';
    return words(lang).unspecified;
};

const getProjectArchitecture = (p: Project, lang: string) => {
    if (p.architectureDetails?.architectureType) {
        return p.architectureDetails.architectureType.split(':')[0].trim();
    }
    if ((p.tags || []).includes('Multi-tenant')) return lang === 'en' ? 'Logical Multi-tenant' : lang === 'es' ? 'Multi-tenant Lógico' : 'Multi-tenant Lógico';
    if ((p.tags || []).includes('UniGui')) return 'RAD ServerModule Web';
    if ((p.tags || []).includes('Laravel')) return lang === 'en' ? 'Decoupled REST API' : lang === 'es' ? 'API REST Desacoplada' : 'REST API Desacoplada';
    if (p.details?.architecture?.[0]?.tech) {
        return p.details.architecture[0].tech.split('+')[0].trim();
    }
    return 'MVC / Modular';
};

const getProjectMetric = (p: Project, fallback: string) => {
    const metric = p.details?.metrics?.[0];
    if (metric) return typeof metric === 'object' ? metric.value : metric;
    return p.details?.subtitle || fallback;
};

const GithubIcon = () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
);

/* ── Index row ─────────────────────────────────────────────────────────── */

interface IndexRowProps {
    project: Project;
    index: number;
    active: boolean;
    lang: string;
    previewId: string;
    onActivate: (index: number) => void;
    onKeyNav: (event: React.KeyboardEvent, index: number) => void;
    rowRef: (node: HTMLButtonElement | null) => void;
}

const IndexRow = memo(forwardRef<HTMLLIElement, IndexRowProps>(function IndexRow({ project, index, active, lang, previewId, onActivate, onKeyNav, rowRef }, ref) {
    const reducedMotion = useReducedMotion();
    const isPresent = useIsPresent();
    const tags = (project.tags || []).slice(0, 3).join(' · ');
    return (
        <motion.li
            ref={ref}
            layout={reducedMotion ? false : 'position'}
            className="ci-item"
            data-active={active}
            inert={!isPresent}
            aria-hidden={!isPresent || undefined}
            initial={reducedMotion ? false : { opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0, transition: { duration: .6, ease: EASE_OUT, delay: index * .055 } }}
            exit={reducedMotion ? undefined : { opacity: 0, x: 28, transition: { duration: .28, ease: EASE_IN_OUT } }}
            transition={{ layout: { type: 'spring', stiffness: 380, damping: 36 } }}
        >
            {/* Shell owned by the collection handoff scene (transform/opacity). */}
            <div className="ci-row-shell" data-index-row>
                <button
                    ref={rowRef}
                    type="button"
                    className="ci-row"
                    aria-pressed={active}
                    aria-controls={previewId}
                    data-cursor-morph="true"
                    onMouseEnter={() => onActivate(index)}
                    onFocus={() => onActivate(index)}
                    onClick={() => onActivate(index)}
                    onKeyDown={(e) => onKeyNav(e, index)}
                >
                    {active && (
                        <motion.span
                            layoutId="ci-active-surface"
                            className="ci-row-surface"
                            transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 38 }}
                            aria-hidden="true"
                        />
                    )}
                    <span className="ci-node" aria-hidden="true"><span /></span>
                    <span className="ci-num" aria-hidden="true">
                        <span className="ci-num-outline">{pad(index + 1)}</span>
                        <span className="ci-num-fill">{pad(index + 1)}</span>
                    </span>
                    <span className="ci-row-main">
                        <span className="ci-row-title">{project.title}</span>
                        <span className="ci-row-meta">
                            <span>{categoryLabel(project, lang)}</span>
                            {tags && <span className="ci-row-tags">{tags}</span>}
                        </span>
                    </span>
                    <span className="ci-row-access" aria-hidden="true">
                        {project.repo_link ? <GithubIcon /> : <i className="fas fa-lock text-[10px]" />}
                    </span>
                    <span className="ci-row-arrow" aria-hidden="true">→</span>
                    <span className="ci-row-sweep" aria-hidden="true" />
                </button>
            </div>
        </motion.li>
    );
}));

/* ── Preview panel ─────────────────────────────────────────────────────── */

const panelVariants: Variants = {
    initial: { clipPath: 'inset(0% 0% 100% 0% round 16px)' },
    enter: { clipPath: 'inset(0% 0% 0% 0% round 16px)', transition: { duration: .75, ease: EASE_IN_OUT, when: 'beforeChildren', staggerChildren: .055, delayChildren: .05 } },
    exit: { opacity: 0, y: -18, scale: .985, transition: { duration: .32, ease: EASE_IN_OUT } },
};
const itemVariants: Variants = {
    initial: { opacity: 0, y: 22 },
    enter: { opacity: 1, y: 0, transition: { duration: .55, ease: EASE_OUT } },
};

interface PreviewProps {
    project: Project;
    index: number;
    total: number;
    lang: string;
    onSelect: (project: Project) => void;
}

const PreviewPanel = memo(forwardRef<HTMLElement, PreviewProps>(function PreviewPanel({ project, index, total, lang, onSelect }, ref) {
    const reducedMotion = useReducedMotion();
    const isPresent = useIsPresent();
    const w = words(lang);
    const hasArtwork = project.preview?.kind === 'architecture';
    const imageUrl = project.image_url || project.image || '/dashboard_placeholder.png';
    const item = reducedMotion ? undefined : itemVariants;

    return (
        <motion.article
            ref={ref}
            className="ci-panel"
            inert={!isPresent}
            aria-hidden={!isPresent || undefined}
            variants={reducedMotion ? undefined : panelVariants}
            initial="initial"
            animate="enter"
            exit="exit"
        >
            <motion.div variants={item} className="ci-panel-visual">
                {hasArtwork ? (
                    <ProjectArtwork project={project} language={lang} className="ci-artwork" />
                ) : (
                    <img
                        src={imageUrl}
                        alt={project.title}
                        width={640}
                        height={400}
                        loading="lazy"
                        decoding="async"
                        className="ci-panel-image"
                        onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.src.endsWith('/dashboard_placeholder.png')) target.src = '/dashboard_placeholder.png';
                        }}
                    />
                )}
                <span className="ci-panel-scan" aria-hidden="true" />
            </motion.div>

            <div className="ci-panel-copy">
                <motion.div variants={item} className="ci-panel-kicker">
                    <span>{pad(index + 1)} <i>/</i> {pad(total)}</span>
                    <span className="ci-panel-rule" aria-hidden="true" />
                    <span className="ci-panel-category">{categoryLabel(project, lang)}</span>
                </motion.div>
                <motion.h3 variants={item} className="ci-panel-title">{project.title}</motion.h3>
                <motion.p variants={item} className="ci-panel-description">
                    {project.description || project.details?.fullDescription}
                </motion.p>
                <motion.dl variants={item} className="ci-panel-specs">
                    <div><dt>{w.architecture}</dt><dd>{getProjectArchitecture(project, lang)}</dd></div>
                    <div><dt>{w.database}</dt><dd>{getProjectDatabase(project, lang)}</dd></div>
                </motion.dl>
                <motion.ul variants={item} className="ci-panel-tags">
                    {(project.tags || []).slice(0, 5).map(tag => <li key={tag}>{tag}</li>)}
                </motion.ul>
                <motion.div variants={item} className="ci-panel-actions">
                    <button
                        type="button"
                        onClick={() => { playMechanicalClick(); onSelect(project); }}
                        data-cursor-morph="true"
                        className="portfolio-control ci-panel-action ci-panel-action--main"
                    >
                        <i aria-hidden="true" className="fas fa-microchip text-xs" />
                        <span>{w.details}</span>
                    </button>
                    {project.repo_link ? (
                        <a
                            href={project.repo_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-cursor-morph="true"
                            className="portfolio-control ci-panel-action"
                            title={w.repoTitle}
                            aria-label={`${project.title} — ${w.repoTitle}`}
                        >
                            <GithubIcon />
                            <span>{w.repo}</span>
                        </a>
                    ) : (
                        <span className="ci-panel-private" title={w.privateTitle}>
                            <i aria-hidden="true" className="fas fa-lock text-[10px]" />
                            <span>{w.private}</span>
                        </span>
                    )}
                    {project.demo_link && (
                        <a
                            href={project.demo_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-cursor-morph="true"
                            className="portfolio-button portfolio-button-primary ci-panel-action"
                            title={w.demo}
                            aria-label={`${project.title} — ${w.demo}`}
                        >
                            <i aria-hidden="true" className="fas fa-external-link-alt text-xs" />
                        </a>
                    )}
                </motion.div>
            </div>
        </motion.article>
    );
}));

/* ── Dense table row, kept as the second view ────────────────────────── */

interface CorporateTableRowProps {
    project: Project;
    onSelectProject: (project: Project) => void;
    lang: string;
}

const CorporateTableRow = memo(function CorporateTableRow({ project, onSelectProject, lang }: CorporateTableRowProps) {
    const reducedMotion = useReducedMotion();
    const cat = projectCategory(project);
    const img = project.image_url || project.image || '/dashboard_placeholder.png';
    const w = words(lang);

    const handleInspect = useCallback(() => {
        playMechanicalClick();
        onSelectProject(project);
    }, [project, onSelectProject]);

    return (
        <motion.tr layout={!reducedMotion} transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 30 }} className="group hover:bg-white/[0.02] transition-colors">
            <th scope="row" className="py-3.5 px-4 font-normal">
                <div className="flex items-center gap-3">
                    <div className="portfolio-icon overflow-hidden shrink-0 flex items-center justify-center">
                        {project.preview?.kind === 'architecture' ? (
                            <i aria-hidden="true" className={project.architectureDetails?.ecosystemIcon || (cat === 'desktop' ? 'fas fa-desktop' : cat === 'backend' ? 'fas fa-code' : 'fas fa-layer-group')} />
                        ) : (
                            <img src={img} alt="" width={36} height={36} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                        )}
                    </div>
                    <div>
                        <div className="font-bold text-white group-hover:text-accent transition-colors">{project.title}</div>
                        <span className="text-[10px] text-primary/60 uppercase">{categoryLabel(project, lang)}</span>
                    </div>
                </div>
            </th>
            <td className="py-3.5 px-4 text-gray-300">
                <div className="flex items-center gap-1.5">
                    <i aria-hidden="true" className="fas fa-sitemap text-accent/80 text-[10px]" />
                    <span>{getProjectArchitecture(project, lang)}</span>
                </div>
            </td>
            <td className="py-3.5 px-4">
                <div className="flex flex-wrap gap-1 max-w-[240px]">
                    {(project.tags || []).slice(0, 3).map((tag, tIdx) => (
                        <span key={tIdx} className="portfolio-chip">{tag}</span>
                    ))}
                    {(project.tags || []).length > 3 && (
                        <span className="text-[10px] text-primary/40">+{(project.tags || []).length - 3}</span>
                    )}
                </div>
            </td>
            <td className="py-3.5 px-4"><span className="portfolio-chip">{getProjectDatabase(project, lang)}</span></td>
            <td className="py-3.5 px-4 text-emerald-400 font-semibold text-[11px]">{getProjectMetric(project, w.stable)}</td>
            <td className="py-3.5 px-4 text-right">
                <button type="button" onClick={handleInspect} aria-label={`${w.details} — ${project.title}`} data-cursor-morph="true" className="portfolio-control px-3 py-1.5 text-xs cursor-pointer inline-flex items-center gap-1.5">
                    <i aria-hidden="true" className="fas fa-microchip text-[10px]" />
                    <span>{w.inspect}</span>
                </button>
            </td>
        </motion.tr>
    );
});

/**
 * CorporateProjectsShowcase — editorial numbered index with a sticky,
 * morphing preview. Rows reorder with FLIP on filter changes; a shared
 * active surface glides between rows; the preview re-composes with a
 * clip-path shutter and staggered content. The dense table remains as a view.
 */
const CorporateProjectsShowcase = memo(function CorporateProjectsShowcase({
    projects = [],
    onSelectProject,
    lang = 'pt',
}: CorporateProjectsShowcaseProps) {
    const reducedMotion = useReducedMotion();
    const w = words(lang);
    const instanceId = useId();
    const previewId = `corporate-preview-${instanceId}`;
    const contentId = `corporate-content-${instanceId}`;
    const [activeFilter, setActiveFilter] = useState<ProjectFilterType>('all');
    const [viewMode, setViewMode] = useState<ProjectViewMode>('grid');
    const [activeProjectId, setActiveProjectId] = useState<Project['id'] | null>(null);
    const rowRefs = useRef(new Map<Project['id'], HTMLButtonElement>());

    const FILTERS = useMemo(() => [
        { id: 'all' as const, label: lang === 'en' ? '# ALL' : '# TODOS' },
        { id: 'fullstack' as const, label: '# WEB / FULLSTACK' },
        { id: 'desktop' as const, label: '# DESKTOP / DELPHI' },
        { id: 'backend' as const, label: '# BACK-END / APIS' },
    ], [lang]);

    const filteredProjects = useMemo(() => {
        if (!Array.isArray(projects)) return [];
        if (activeFilter === 'all') return projects;
        return projects.filter(p => projectCategory(p) === activeFilter);
    }, [projects, activeFilter]);

    const total = filteredProjects.length;
    const safeIndex = Math.max(0, filteredProjects.findIndex(project => project.id === activeProjectId));
    const activeProject = filteredProjects[safeIndex];

    const activate = useCallback((index: number) => {
        const project = filteredProjects[index];
        if (!project || project.id === activeProject?.id) return;
        playTabSwitch();
        setActiveProjectId(project.id);
    }, [filteredProjects, activeProject?.id]);

    const handleFilterChange = useCallback((filterId: ProjectFilterType) => {
        if (filterId === activeFilter) return;
        playTabSwitch();
        setActiveFilter(filterId);
        setActiveProjectId(null);
    }, [activeFilter]);

    const handleKeyNav = useCallback((event: React.KeyboardEvent, index: number) => {
        let next = -1;
        if (event.key === 'ArrowDown') next = Math.min(total - 1, index + 1);
        else if (event.key === 'ArrowUp') next = Math.max(0, index - 1);
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = total - 1;
        if (next < 0) return;
        event.preventDefault();
        const project = filteredProjects[next];
        if (project) rowRefs.current.get(project.id)?.focus();
    }, [total, filteredProjects]);

    const spineScale = total > 0 ? (safeIndex + .5) / total : 0;

    return (
        <LayoutGroup id={instanceId}>
        <div className="ci-root w-full relative" aria-label={w.listLabel} role="region">
            {/* ── Toolbar: categories with shared indicator + view switch ── */}
            <div className="ci-toolbar">
                <div className="relative max-w-full w-full sm:w-auto overflow-hidden">
                    <div role="group" aria-label={w.filters} className="portfolio-segmented flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                        {FILTERS.map((f) => {
                            const isActive = activeFilter === f.id;
                            return (
                                <button
                                    key={f.id}
                                    type="button"
                                    onClick={() => handleFilterChange(f.id)}
                                    data-cursor-morph="true"
                                    aria-pressed={isActive}
                                    aria-controls={contentId}
                                    className={`relative px-3.5 py-1.5 text-xs font-mono font-semibold tracking-wider rounded-xl transition-colors cursor-pointer shrink-0 ${isActive ? 'text-white font-bold' : 'text-primary/70 hover:text-white'}`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeCorporateCategoryTab"
                                            className="absolute inset-0 bg-accent/10 border border-accent/25 rounded-[10px]"
                                            transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 450, damping: 35 }}
                                            aria-hidden="true"
                                        />
                                    )}
                                    <span className="relative z-10">{f.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div role="group" aria-label={w.views} className="portfolio-segmented flex items-center gap-1">
                    {([
                        { id: 'grid' as const, icon: 'fas fa-list-ol', label: w.index, title: w.indexTitle },
                        { id: 'table' as const, icon: 'fas fa-table-list', label: w.table, title: w.tableTitle },
                    ]).map(option => (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => { playMechanicalClick(); setViewMode(option.id); }}
                            data-cursor-morph="true"
                            aria-pressed={viewMode === option.id}
                            aria-controls={contentId}
                            title={option.title}
                            className={`portfolio-control px-3 py-1.5 text-xs font-mono flex items-center gap-1.5 cursor-pointer ${viewMode === option.id ? 'font-bold' : 'text-primary/70 hover:text-white'}`}
                        >
                            <i aria-hidden="true" className={`${option.icon} text-[10px]`} />
                            <span>{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="ci-status">
                <span className="flex items-center gap-2">
                    <span className="ci-status-dot" aria-hidden="true" />
                    <span aria-live="polite">{w.count(total)}</span>
                </span>
                <span className="ci-status-hint">{viewMode === 'grid' ? w.hint : w.tableHint}</span>
            </div>

            <AnimatePresence mode="wait" initial={false}>
                {total === 0 ? (
                    <motion.p id={contentId} key="corporate-empty-view" className="portfolio-surface ci-empty" role="status" initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .2 }}>
                        {w.empty}
                    </motion.p>
                ) : viewMode === 'grid' ? (
                    <motion.div
                        id={contentId}
                        key="corporate-index-view"
                        className="ci-index"
                        initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
                        transition={{ duration: reducedMotion ? 0 : .5, ease: EASE_OUT }}
                    >
                        <div className="ci-list-wrap">
                            <span className="ci-spine" aria-hidden="true">
                                <span className="ci-spine-base" />
                                <motion.span
                                    className="ci-spine-fill"
                                    initial={false}
                                    animate={{ scaleY: spineScale }}
                                    transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 160, damping: 26 }}
                                />
                            </span>
                            <LayoutGroup id="corporate-index">
                                <ol className="ci-list">
                                    <AnimatePresence mode="popLayout" initial={false}>
                                        {filteredProjects.map((project, index) => (
                                            <IndexRow
                                                key={`row-${project.id}`}
                                                project={project}
                                                index={index}
                                                active={index === safeIndex}
                                                lang={lang}
                                                previewId={previewId}
                                                onActivate={activate}
                                                onKeyNav={handleKeyNav}
                                                rowRef={(node) => {
                                                    if (node) rowRefs.current.set(project.id, node);
                                                    else rowRefs.current.delete(project.id);
                                                }}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </ol>
                            </LayoutGroup>
                        </div>

                        <aside id={previewId} className="ci-preview" aria-label={w.preview}>
                            <div className="ci-preview-frame">
                                <AnimatePresence mode="popLayout" initial={false}>
                                    {activeProject && (
                                        <PreviewPanel
                                            key={`preview-${activeProject.id}`}
                                            project={activeProject}
                                            index={safeIndex}
                                            total={total}
                                            lang={lang}
                                            onSelect={onSelectProject}
                                        />
                                    )}
                                </AnimatePresence>
                                <span className="portfolio-hud-corners" aria-hidden="true">
                                    <span className="portfolio-hud-corner-bl" />
                                    <span className="portfolio-hud-corner-br" />
                                </span>
                                <span className="ci-preview-curtain" aria-hidden="true" />
                            </div>
                        </aside>
                    </motion.div>
                ) : (
                    <motion.div
                        id={contentId}
                        key="corporate-table-view"
                        initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: reducedMotion ? 0 : -6 }}
                        transition={{ duration: reducedMotion ? 0 : .65, ease: EASE_OUT }}
                        className="portfolio-surface overflow-hidden"
                    >
                        <div className="overflow-x-auto scrollbar-thin" tabIndex={0} role="region" aria-label={w.tableTitle}>
                            <table aria-label={w.tableTitle} className="w-full min-w-[760px] text-left text-xs font-mono border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 bg-black/40 text-[11px] uppercase tracking-wider text-primary/60">
                                        <th scope="col" className="py-3 px-4">{lang === 'en' ? 'System / Project' : lang === 'es' ? 'Sistema / Proyecto' : 'Sistema / Projeto'}</th>
                                        <th scope="col" className="py-3 px-4">{lang === 'en' ? 'Architecture & Pattern' : lang === 'es' ? 'Arquitectura y Patrón' : 'Arquitetura & Padrão'}</th>
                                        <th scope="col" className="py-3 px-4">{lang === 'en' ? 'Stack / Technologies' : lang === 'es' ? 'Stack / Tecnologías' : 'Stack / Tecnologias'}</th>
                                        <th scope="col" className="py-3 px-4">{lang === 'en' ? 'Database' : lang === 'es' ? 'Base de Datos' : 'Banco de Dados'}</th>
                                        <th scope="col" className="py-3 px-4">{lang === 'en' ? 'Metric & Scope' : lang === 'es' ? 'Métrica y Alcance' : 'Métrica & Escopo'}</th>
                                        <th scope="col" className="py-3 px-4 text-right">{lang === 'en' ? 'Action' : lang === 'es' ? 'Acción' : 'Ação'}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredProjects.map((project) => (
                                        <CorporateTableRow key={`row-${project.id}`} project={project} onSelectProject={onSelectProject} lang={lang} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
        </LayoutGroup>
    );
});

export default CorporateProjectsShowcase;
