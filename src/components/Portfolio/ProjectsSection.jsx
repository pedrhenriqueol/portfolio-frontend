import { useState } from 'react';
import { motion } from 'framer-motion';
import ProjectModal from './ProjectModal';
import { useLanguage } from '../../context/LanguageContext';

export default function ProjectsSection({ projects }) {
    const [selected, setSelected] = useState(null);
    const { t } = useLanguage();

    return (
        <section id="projetos" className="grid-bg py-24 bg-dark relative border-t border-primary/30">
            {/* Modal */}
            {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="text-accent text-[11px] font-semibold tracking-[0.25em] uppercase mb-2 block font-sans">
                        PORTFÓLIO
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-4">{t('projects.title')}</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto font-sans text-sm sm:text-base">
                        {t('projects.subtitle')}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects && projects.length > 0 ? (
                        projects.map((project, index) => {
                            const hasDetails = Boolean(project.details);
                            const isPrivate  = !project.repo_link && !project.demo_link;

                            return (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
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
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/dashboard_placeholder.png';
                                                }}
                                            />
                                            {/* "Saiba Mais" badge for private+details projects */}
                                            {hasDetails && (
                                                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <span className="bg-secondary/90 text-darker text-sm font-bold px-5 py-2 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-sm">
                                                        <i className="fas fa-info-circle" />
                                                        {t('projects.btnDetails')}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-darker/80 via-transparent to-transparent" />
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

                                            <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                                                {project.description}
                                            </p>

                                            <div className="flex gap-3 mt-auto">
                                                {hasDetails && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setSelected(project); }}
                                                        className="flex-1 text-center py-2 px-4 bg-darker border border-white/10 text-primary text-sm font-medium rounded-lg hover:border-accent/40 hover:text-accent transition-all duration-200 flex items-center justify-center gap-2"
                                                    >
                                                        <i className="fas fa-info-circle" />
                                                        {t('projects.btnDetails')}
                                                    </button>
                                                )}
                                                {project.repo_link && (
                                                    <a
                                                        href={project.repo_link}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="flex-1 text-center py-2 px-4 bg-darker border border-white/10 text-primary text-sm font-medium rounded-lg hover:border-accent/40 hover:text-accent transition-all duration-200"
                                                    >
                                                        <i className="fas fa-code mr-2" />{t('projects.btnRepo')}
                                                    </a>
                                                )}
                                                {!hasDetails && isPrivate && (
                                                    <span className="flex-1 text-center py-2 px-4 bg-darker border border-primary/20 text-gray-600 text-sm font-medium rounded-lg cursor-not-allowed select-none">
                                                        <i className="fas fa-lock mr-2" />Privado
                                                    </span>
                                                )}
                                                {project.demo_link && (
                                                    <a
                                                        href={project.demo_link}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="flex-1 text-center py-2 px-4 bg-accent text-darker text-sm font-semibold rounded-lg hover:bg-accent-hover transition-all duration-200"
                                                    >
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
                        <p className="text-gray-500 col-span-3 text-center">{t('projects.empty')}</p>
                    )}
                </div>
            </div>
        </section>
    );
}
