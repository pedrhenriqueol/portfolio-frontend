import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectInspectorDrawer from './ProjectInspectorDrawer';
import ModalErrorBoundary from './Common/ModalErrorBoundary';
import ProjectCard from './Projects/ProjectCard';
import { useLanguage } from '../../context/LanguageContext';
import { FILTER_ICONS, projectCategory } from '../../utils/projects';
import { playTabSwitch, playMechanicalClick } from '../../lib/sound';

export default function ProjectsSection({ projects, viewMode: propViewMode, onViewModeChange }) {
    const [selected, setSelected]   = useState(null);
    const [activeFilter, setFilter] = useState('all');
    const [internalViewMode, setInternalViewMode] = useState('grid');
    const viewMode = propViewMode !== undefined ? propViewMode : internalViewMode;
    const setViewMode = onViewModeChange || setInternalViewMode;
    const { t, lang } = useLanguage();

    const FILTERS = useMemo(() => [
        { id: 'all',       label: t('projects.filterAll')       || 'Todos' },
        { id: 'fullstack', label: t('projects.filterFullstack') || 'Web / Fullstack' },
        { id: 'desktop',   label: t('projects.filterDesktop')   || 'Desktop / Delphi' },
        { id: 'backend',   label: t('projects.filterBackend')   || 'Backend & APIs' },
        { id: 'outros',    label: t('projects.filterOthers')    || 'Outros' },
    ], [t]);

    const FLAGSHIP_IDS = [101, 102, 103];

    // Separação em Camadas: Remove a tríade flagship para eliminar 100% da duplicação
    const corporateProjects = useMemo(() => {
        if (!Array.isArray(projects)) return [];
        return projects.filter(p => !FLAGSHIP_IDS.includes(p.id));
    }, [projects]);

    const filtered = useMemo(() => {
        if (activeFilter === 'all') return corporateProjects;
        return corporateProjects.filter(p => projectCategory(p) === activeFilter);
    }, [corporateProjects, activeFilter]);

    return (
        <section id="projetos" className="grid-bg py-20 md:py-24 bg-dark relative border-t border-primary/30">
            {/* Drawer de Detalhes Técnicos com AnimatePresence e Error Boundary */}
            <ModalErrorBoundary onClose={() => setSelected(null)}>
                <AnimatePresence mode="wait">
                    {selected && (
                        <ProjectInspectorDrawer
                            key={`inspector-${selected.id}`}
                            project={selected}
                            onClose={() => setSelected(null)}
                        />
                    )}
                </AnimatePresence>
            </ModalErrorBoundary>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Camada 2: Projetos Corporativos & Soluções */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-10"
                >
                    <span className="text-accent text-[11px] font-semibold tracking-[0.25em] uppercase mb-2 block font-sans">
                        {lang === 'en' ? 'CORPORATE PORTFOLIO & SOLUTIONS' : 'PORTFÓLIO CORPORATIVO & SOLUÇÕES'}
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-4">
                        {lang === 'en' ? 'Enterprise Systems & Utilities' : 'Projetos Corporativos & Soluções'}
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto font-sans text-sm sm:text-base">
                        {lang === 'en'
                            ? 'ERP administration, legacy desktop migration, fiscal compliance, and software engineering tools.'
                            : 'Sistemas de gestão empresarial (ERP/PDV), modernização de legados, módulos fiscais e utilitários.'}
                    </p>
                </motion.div>

                {/* Filters + View Toggle bar */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8"
                >
                    {/* Filter tabs com overflow rígido e máscara de gradiente */}
                    <div className="relative max-w-full w-full sm:w-auto overflow-hidden">
                        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-dark to-transparent z-10 sm:hidden" />
                        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-dark to-transparent z-10 sm:hidden" />
                        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 px-1">
                            {FILTERS.map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => {
                                        playTabSwitch();
                                        setFilter(f.id);
                                    }}
                                    data-cursor-morph="true"
                                    className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider border rounded-full transition-all duration-200 cursor-pointer shrink-0 ${
                                        activeFilter === f.id
                                            ? 'bg-accent text-darker border-accent shadow-xs font-bold'
                                            : 'bg-darker/50 text-primary border-primary/25 hover:border-accent/40 hover:text-accent'
                                    }`}
                                >
                                    <i className={`${FILTER_ICONS[f.id]} text-[9px]`} />
                                    <span>{f.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* View toggle (Grid / Lista) */}
                    <div className="flex items-center gap-1 bg-darker border border-primary/20 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            data-cursor-morph="true"
                            className={`px-3 py-1.5 rounded-md text-[11px] flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                                viewMode === 'grid' ? 'bg-accent text-darker font-semibold shadow-xs' : 'text-primary hover:text-accent'
                            }`}
                        >
                            <i className="fas fa-th-large text-[10px]" />
                            <span className="hidden sm:inline">Grid</span>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            data-cursor-morph="true"
                            className={`px-3 py-1.5 rounded-md text-[11px] flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                                viewMode === 'list' ? 'bg-accent text-darker font-semibold shadow-xs' : 'text-primary hover:text-accent'
                            }`}
                        >
                            <i className="fas fa-list text-[10px]" />
                            <span className="hidden sm:inline">{lang === 'en' ? 'List' : 'Lista'}</span>
                        </button>
                    </div>
                </motion.div>

                {/* Count indicator */}
                <p className="text-primary/75 text-xs font-mono mb-6">
                    {lang === 'en'
                        ? `${filtered.length} project${filtered.length !== 1 ? 's' : ''} found`
                        : lang === 'es'
                        ? `${filtered.length} proyecto${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`
                        : `${filtered.length} projeto${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`}
                </p>

                {/* Projects Display com transição suave nos filtros */}
                <div className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${activeFilter}-${viewMode}`}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.28, ease: 'easeOut' }}
                        >
                            {viewMode === 'grid' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filtered.length > 0 ? (
                                        filtered.map((project, index) => (
                                            <ProjectCard
                                                key={project.id}
                                                project={project}
                                                viewMode="grid"
                                                index={index}
                                                onSelect={setSelected}
                                                t={t}
                                                lang={lang}
                                            />
                                        ))
                                    ) : (
                                        <div className="text-gray-400 col-span-3 text-center py-16">
                                            <i className="fas fa-inbox text-2xl mb-3 block text-primary/40" />
                                            <p className="font-sans text-sm">{t('projects.empty')}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filtered.length > 0 ? (
                                        filtered.map((project, index) => (
                                            <ProjectCard
                                                key={project.id}
                                                project={project}
                                                viewMode="list"
                                                index={index}
                                                onSelect={setSelected}
                                                t={t}
                                                lang={lang}
                                            />
                                        ))
                                    ) : (
                                        <div className="text-gray-400 text-center py-16">
                                            <i className="fas fa-inbox text-2xl mb-3 block text-primary/40" />
                                            <p className="font-sans text-sm">{t('projects.empty')}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
