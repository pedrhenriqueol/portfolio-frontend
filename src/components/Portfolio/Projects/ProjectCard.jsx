import { motion } from 'framer-motion';
import { projectCategory } from '../../../utils/projects';

export default function ProjectCard({ project, viewMode = 'grid', index = 0, onSelect, t, lang }) {
    const hasDetails = Boolean(project?.details);
    const isPrivate = !project?.repo_link && !project?.demo_link;
    const category = projectCategory(project);
    const coverImage = project?.image_url || '/dashboard_placeholder.png';

    if (viewMode === 'list') {
        return (
            <motion.div
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className={`group flex items-center gap-4 sm:gap-6 bg-darker border border-primary/30 rounded-xl p-4 sm:p-5 hover:border-secondary/40 transition-all duration-300 ${
                    hasDetails ? 'cursor-pointer' : ''
                }`}
                onClick={hasDetails ? () => onSelect(project) : undefined}
            >
                <img
                    src={coverImage}
                    alt={project.title}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover shrink-0 opacity-85 group-hover:opacity-100 transition-opacity"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/dashboard_placeholder.png';
                    }}
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-bold text-sm group-hover:text-secondary transition-colors truncate">
                            {project.title}
                        </h3>
                        <span className="text-[10px] text-primary/70 border border-primary/20 rounded-full px-2 py-0.5 shrink-0 capitalize">
                            {category}
                        </span>
                    </div>
                    <p className="text-gray-300 text-xs leading-relaxed line-clamp-2">{project.description}</p>
                    {project.tags && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {project.tags.slice(0, 4).map((tag, idx) => (
                                <span key={idx} className="text-[10px] text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">
                                    {tag}
                                </span>
                            ))}
                            {project.tags.length > 4 && (
                                <span className="text-[10px] text-primary/70">+{project.tags.length - 4}</span>
                            )}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {hasDetails && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(project);
                            }}
                            data-cursor-morph="true"
                            className="px-3 py-1.5 border border-primary/30 text-primary text-[11px] rounded-lg hover:border-accent/40 hover:text-accent transition-all cursor-pointer"
                        >
                            <i className="fas fa-info-circle mr-1 text-accent" />
                            {lang === 'en' ? 'View' : 'Ver'}
                        </button>
                    )}
                    {project.repo_link && (
                        <a
                            href={project.repo_link}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            data-cursor-morph="true"
                            className="px-3 py-1.5 border border-primary/30 text-primary text-[11px] rounded-lg hover:border-accent/40 hover:text-accent transition-all cursor-pointer"
                        >
                            <i className="fab fa-github" />
                        </a>
                    )}
                    <i className="fas fa-chevron-right text-primary/40 text-xs group-hover:text-accent group-hover:translate-x-1 transition-all duration-200" />
                </div>
            </motion.div>
        );
    }

    // Grid View
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
        >
            <div
                className={`bg-darker rounded-xl overflow-hidden border border-primary/30 group hover:border-secondary/50 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition-all duration-300 flex flex-col h-full ${
                    hasDetails ? 'cursor-pointer' : ''
                }`}
                onClick={hasDetails ? () => onSelect(project) : undefined}
            >
                {/* Thumbnail */}
                <div className="h-44 overflow-hidden relative bg-dark">
                    <div className="absolute inset-0 bg-darker/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <img
                        src={coverImage}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/dashboard_placeholder.png';
                        }}
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
                    <span className="absolute top-3 left-3 z-20 bg-darker/90 border border-primary/40 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm capitalize shadow">
                        {category}
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
                                <span
                                    key={idx}
                                    className="text-xs font-medium text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full group-hover:border-accent/50 transition-colors duration-300"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                    <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-grow">{project.description}</p>
                    <div className="flex gap-3 mt-auto">
                        {hasDetails && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelect(project);
                                }}
                                data-cursor-morph="true"
                                className="flex-1 text-center py-2 px-4 bg-darker border border-white/15 text-primary text-sm font-medium rounded-lg hover:border-accent/40 hover:text-accent transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <i className="fas fa-info-circle text-accent" />
                                {t('projects.btnDetails')}
                            </button>
                        )}
                        {project.repo_link && (
                            <a
                                href={project.repo_link}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                data-cursor-morph="true"
                                className="flex-1 text-center py-2 px-4 bg-darker border border-white/15 text-primary text-sm font-medium rounded-lg hover:border-accent/40 hover:text-accent transition-all duration-200 flex items-center justify-center cursor-pointer"
                            >
                                <i className="fas fa-code mr-2" />
                                {t('projects.btnRepo')}
                            </a>
                        )}
                        {!hasDetails && isPrivate && (
                            <span className="flex-1 text-center py-2 px-4 bg-darker border border-primary/20 text-primary/60 text-sm font-medium rounded-lg cursor-not-allowed select-none flex items-center justify-center">
                                <i className="fas fa-lock mr-2" />
                                {t('projects.privado')}
                            </span>
                        )}
                        {project.demo_link && (
                            <a
                                href={project.demo_link}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                data-cursor-morph="true"
                                className="flex-1 text-center py-2 px-4 bg-accent text-darker text-sm font-semibold rounded-lg hover:bg-accent-hover transition-all duration-200 flex items-center justify-center cursor-pointer"
                            >
                                <i className="fas fa-external-link-alt mr-2" />
                                {t('projects.btnDemo')}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
