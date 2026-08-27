import { useState, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import ProjectModal from './ProjectModal';
import { useLanguage } from '../../context/LanguageContext';

const FILTER_ICONS = {
    all:       'fas fa-th-large',
    fullstack: 'fas fa-globe',
    desktop:   'fas fa-desktop',
    backend:   'fas fa-server',
    outros:    'fas fa-code-branch',
};

const TAG_MAP = {
    fullstack: ['React', 'TypeScript', 'Laravel', 'Multi-tenant', 'RBAC', 'Dashboard', 'API REST', 'Tailwind CSS'],
    desktop:   ['Delphi 11', 'UniGui', 'Java', 'Swing', 'JVCL', 'ACBr', 'FortesReport'],
    backend:   ['PHP', 'Python', 'Flask', 'Node.js', 'MySQL', 'SQL Server', 'PostgreSQL'],
    outros:    ['Tkinter', 'Paradox', 'BDE'],
};

function projectCategory(project) {
    const tags = project.tags || [];
    if (tags.some(t => TAG_MAP.fullstack.includes(t))) return 'fullstack';
    if (tags.some(t => TAG_MAP.desktop.includes(t)))   return 'desktop';
    if (tags.some(t => TAG_MAP.backend.includes(t)))   return 'backend';
    return 'outros';
}

export default function ProjectsSection({ projects }) {
    const [selected,   setSelected]   = useState(null);
    const [activeFilter, setFilter]   = useState('all');
    const [viewMode,   setViewMode]   = useState('grid'); // 'grid' | 'list'
    const { t } = useLanguage();

    const FILTERS = [
        { id: 'all',       label: t('projects.filterAll')       || 'Todos' },
        { id: 'fullstack', label: t('projects.filterFullstack') || 'Web / Fullstack' },
        { id: 'desktop',   label: t('projects.filterDesktop')   || 'Desktop / Delphi' },
        { id: 'backend',   label: t('projects.filterBackend')   || 'Backend & APIs' },
        { id: 'outros',    label: t('projects.filterOthers')    || 'Outros' },
    ];

    const filtered = useMemo(() => {
        if (!projects) return [];
        if (activeFilter === 'all') return projects;
        return projects.filter(p => projectCategory(p) === activeFilter);
    }, [projects, activeFilter]);

    return (
        <section id="projetos" className="grid-bg py-24 bg-dark relative border-t border-primary/30">
            {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-10"
                >
                    <span className="text-accent text-[11px] font-semibold tracking-[0.25em] uppercase mb-2 block font-sans">
                        {t('projects.tag')}
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-4">{t('projects.title')}</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto font-sans text-sm sm:text-base">
                        {t('projects.subtitle')}
                    </p>
                </motion.div>

                {/* Filters + View Toggle bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10"
                >
                    {/* Filter tabs */}
                    <div className="flex flex-wrap items-center gap-2">
                        {FILTERS.map(f => (
                            <button
                                key={f.id}
                                onClick={() => setFilter(f.id)}
                                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider border rounded-full transition-all duration-200 ${
                                    activeFilter === f.id
                                        ? 'bg-accent text-darker border-accent'
                                        : 'bg-darker/50 text-primary border-primary/25 hover:border-accent/40 hover:text-accent'
                                }`}
                            >
                                <i className={`${FILTER_ICONS[f.id]} text-[9px]`} />
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* View toggle */}
                    <div className="flex items-center gap-1 bg-darker border border-primary/20 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-3 py-1.5 rounded-md text-[11px] flex items-center gap-1.5 transition-all duration-200 ${
                                viewMode === 'grid' ? 'bg-accent text-darker font-semibold' : 'text-primary hover:text-accent'
                            }`}
                        >
                            <i className="fas fa-th-large text-[10px]" />
                            <span className="hidden sm:inline">Grid</span>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1.5 rounded-md text-[11px] flex items-center gap-1.5 transition-all duration-200 ${
                                viewMode === 'list' ? 'bg-accent text-darker font-semibold' : 'text-primary hover:text-accent'
                            }`}
                        >
                            <i className="fas fa-list text-[10px]" />
                            <span className="hidden sm:inline">Lista</span>
                        </button>
                    </div>
                </motion.div>

                {/* Count indicator */}
                <p className="text-primary/40 text-xs font-mono mb-6">
                    {filtered.length} projeto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
                </p>

                {/* Grid View */}
                <LayoutGroup>
                    <AnimatePresence mode="popLayout">
                        {viewMode === 'grid' ? (
                            <motion.div
                                key="grid"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {filtered.length > 0 ? (
                                    filtered.map((project, index) => {
                                        const hasDetails = Boolean(project.details);
                                        const isPrivate  = !project.repo_link && !project.demo_link;
                                        return (
                                            <motion.div
                                                layout
                                                key={project.id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.92 }}
                                                transition={{ duration: 0.35, delay: index * 0.06 }}
                                            >
                                                <div
                                                    className={`bg-darker rounded-xl overflow-hidden border border-primary/30 group hover:border-secondary/50 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition-all duration-300 flex flex-col h-full ${hasDetails ? 'cursor-pointer' : ''}`}
                                                    onClick={hasDetails ? () => setSelected(project) : undefined}
                                                >
                                                    {/* Thumbnail */}
                                                    <div className="h-44 overflow-hidden relative bg-dark">
                                                        <div className="absolute inset-0 bg-darker/30 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                                        <img
                                                            src={project.image_url || '/dashboard_placeholder.png'}
                                                            alt={project.title}
                                                            loading="lazy"
                                                            decoding="async"
                                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                                            onError={(e) => { e.target.onerror = null; e.target.src = '/dashboard_placeholder.png'; }}
                                                        />
                                                        {hasDetails && (
                                                            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                <span className="bg-secondary/90 text-darker text-sm font-bold px-5 py-2 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-sm">
                                                                    <i className="fas fa-info-circle" />
                                                                    {t('projects.btnDetails')}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {/* Category badge */}
                                                        <span className="absolute top-3 left-3 z-20 bg-darker/80 border border-primary/30 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm capitalize">
                                                            {projectCategory(project)}
                                                        </span>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="p-6 flex flex-col flex-grow relative">
                                                        <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-secondary transition-colors duration-300">
                                                            {project.title}
                                                        </h3>
                                                        {project.tags && (
                                                            <div className="flex flex-wrap gap-2 mb-4">
                                                                {project.tags.map((tag, idx) => (
                                                                    <span key={idx} className="text-xs font-medium text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full group-hover:border-accent/50 transition-colors duration-300">
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                        <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">{project.description}</p>
                                                        <div className="flex gap-3 mt-auto">
                                                            {hasDetails && (
                                                                <button onClick={(e) => { e.stopPropagation(); setSelected(project); }}
                                                                    className="flex-1 text-center py-2 px-4 bg-darker border border-white/10 text-primary text-sm font-medium rounded-lg hover:border-accent/40 hover:text-accent transition-all duration-200 flex items-center justify-center gap-2">
                                                                    <i className="fas fa-info-circle" />{t('projects.btnDetails')}
                                                                </button>
                                                            )}
                                                            {project.repo_link && (
                                                                <a href={project.repo_link} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                                                                    className="flex-1 text-center py-2 px-4 bg-darker border border-white/10 text-primary text-sm font-medium rounded-lg hover:border-accent/40 hover:text-accent transition-all duration-200">
                                                                    <i className="fas fa-code mr-2" />{t('projects.btnRepo')}
                                                                </a>
                                                            )}
                                                            {!hasDetails && isPrivate && (
                                                                <span className="flex-1 text-center py-2 px-4 bg-darker border border-primary/20 text-gray-600 text-sm font-medium rounded-lg cursor-not-allowed select-none">
                                                                    <i className="fas fa-lock mr-2" />{t('projects.privado')}
                                                                </span>
                                                            )}
                                                            {project.demo_link && (
                                                                <a href={project.demo_link} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                                                                    className="flex-1 text-center py-2 px-4 bg-accent text-darker text-sm font-semibold rounded-lg hover:bg-accent-hover transition-all duration-200">
                                                                    <i className="fas fa-external-link-alt mr-2" />{t('projects.btnDemo')}
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                ) : (
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500 col-span-3 text-center py-12">
                                        <i className="fas fa-inbox text-2xl mb-3 block text-primary/30" />
                                        {t('projects.empty')}
                                    </motion.p>
                                )}
                            </motion.div>
                        ) : (
                            /* List View */
                            <motion.div
                                key="list"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-3"
                            >
                                {filtered.length > 0 ? (
                                    filtered.map((project, index) => {
                                        const hasDetails = Boolean(project.details);
                                        return (
                                            <motion.div
                                                layout
                                                key={project.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                                className={`group flex items-center gap-6 bg-darker border border-primary/25 rounded-xl p-5 hover:border-secondary/40 transition-all duration-300 ${hasDetails ? 'cursor-pointer' : ''}`}
                                                onClick={hasDetails ? () => setSelected(project) : undefined}
                                            >
                                                <img
                                                    src={project.image_url || '/dashboard_placeholder.png'}
                                                    alt={project.title}
                                                    className="w-16 h-16 rounded-lg object-cover shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = '/dashboard_placeholder.png'; }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="text-white font-bold text-sm group-hover:text-secondary transition-colors truncate">{project.title}</h3>
                                                        <span className="text-[10px] text-primary/50 border border-primary/20 rounded-full px-2 py-0.5 shrink-0 capitalize">{projectCategory(project)}</span>
                                                    </div>
                                                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{project.description}</p>
                                                    {project.tags && (
                                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                                            {project.tags.slice(0, 4).map((tag, idx) => (
                                                                <span key={idx} className="text-[10px] text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">{tag}</span>
                                                            ))}
                                                            {project.tags.length > 4 && <span className="text-[10px] text-primary/40">+{project.tags.length - 4}</span>}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    {hasDetails && (
                                                        <button onClick={(e) => { e.stopPropagation(); setSelected(project); }}
                                                            className="px-3 py-1.5 border border-primary/25 text-primary text-[11px] rounded-lg hover:border-accent/40 hover:text-accent transition-all">
                                                            <i className="fas fa-info-circle mr-1" />Ver
                                                        </button>
                                                    )}
                                                    {project.repo_link && (
                                                        <a href={project.repo_link} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                                                            className="px-3 py-1.5 border border-primary/25 text-primary text-[11px] rounded-lg hover:border-accent/40 hover:text-accent transition-all">
                                                            <i className="fab fa-github" />
                                                        </a>
                                                    )}
                                                    <i className="fas fa-chevron-right text-primary/30 text-xs group-hover:text-accent group-hover:translate-x-1 transition-all duration-200" />
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                ) : (
                                    <p className="text-gray-500 text-center py-12">{t('projects.empty')}</p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </LayoutGroup>
            </div>
        </section>
    );
}
