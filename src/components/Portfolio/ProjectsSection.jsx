import { useState, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import ProjectModal from './ProjectModal';
import ProjectCard from './Projects/ProjectCard';
import { useLanguage } from '../../context/LanguageContext';
import { FILTER_ICONS, projectCategory } from '../../utils/projects';

export default function ProjectsSection({ projects }) {
    const [selected, setSelected]         = useState(null);
    const [activeFilter, setFilter]       = useState('all');
    const [viewMode, setViewMode]         = useState('grid'); // 'grid' | 'list'
    const { t, lang } = useLanguage();

    const FILTERS = useMemo(() => [
        { id: 'all',       label: t('projects.filterAll')       || 'Todos' },
        { id: 'fullstack', label: t('projects.filterFullstack') || 'Web / Fullstack' },
        { id: 'desktop',   label: t('projects.filterDesktop')   || 'Desktop / Delphi' },
        { id: 'backend',   label: t('projects.filterBackend')   || 'Backend & APIs' },
        { id: 'outros',    label: t('projects.filterOthers')    || 'Outros' },
    ], [t]);

    const filtered = useMemo(() => {
        if (!Array.isArray(projects)) return [];
        if (activeFilter === 'all') return projects;
        return projects.filter(p => projectCategory(p) === activeFilter);
    }, [projects, activeFilter]);

    return (
        <section id="projetos" className="grid-bg py-24 bg-dark relative border-t border-primary/30">
            {/* Modal de Detalhes com transição de saída suportada por AnimatePresence */}
            <AnimatePresence>
                {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
            </AnimatePresence>

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
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-4">
                        {t('projects.title')}
                    </h2>
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
                                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider border rounded-full transition-all duration-200 cursor-pointer ${
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
                            className={`px-3 py-1.5 rounded-md text-[11px] flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                                viewMode === 'grid' ? 'bg-accent text-darker font-semibold' : 'text-primary hover:text-accent'
                            }`}
                        >
                            <i className="fas fa-th-large text-[10px]" />
                            <span className="hidden sm:inline">Grid</span>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1.5 rounded-md text-[11px] flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                                viewMode === 'list' ? 'bg-accent text-darker font-semibold' : 'text-primary hover:text-accent'
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

                {/* Projects Display */}
                <LayoutGroup>
                    <AnimatePresence mode="popLayout">
                        {viewMode === 'grid' ? (
                            <motion.div
                                key="grid"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
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
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-400 col-span-3 text-center py-12">
                                        <i className="fas fa-inbox text-2xl mb-3 block text-primary/40" />
                                        {t('projects.empty')}
                                    </motion.p>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-3"
                            >
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
                                    <p className="text-gray-400 text-center py-12">{t('projects.empty')}</p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </LayoutGroup>
            </div>
        </section>
    );
}
