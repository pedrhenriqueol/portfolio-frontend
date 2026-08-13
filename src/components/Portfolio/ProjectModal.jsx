import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

export default function ProjectModal({ project, onClose }) {
    const { t } = useLanguage();

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);

        // Bloqueia scroll, esconde navbar
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');

        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
            document.body.classList.remove('modal-open');
        };
    }, [onClose]);

    if (!project?.details) return null;
    const { subtitle, fullDescription, highlights } = project.details;
    const coverImage = project.image_url || '/dashboard_placeholder.png';

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={onClose}
                className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md"
            >
                {/* Modal Container */}
                <motion.div
                    key="modal"
                    initial={{ opacity: 0, scale: 0.96, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-dark border border-white/10 rounded-2xl shadow-2xl flex flex-col"
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        aria-label="Fechar"
                        className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/20 text-white/80 hover:text-white hover:bg-black/60 transition-all duration-300 group"
                    >
                        <i className="fas fa-times group-hover:rotate-90 transition-transform duration-300" />
                    </button>

                    {/* Banner Image */}
                    <div className="relative w-full h-48 sm:h-72 shrink-0 overflow-hidden bg-darker">
                        <img 
                            src={coverImage} 
                            alt={project.title} 
                            className="w-full h-full object-cover opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/dashboard_placeholder.png';
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
                        
                        {/* Title overlay */}
                        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 flex flex-col justify-end">
                            <h2 className="text-3xl sm:text-5xl font-display font-bold text-secondary mb-2 sm:mb-3 tracking-wide drop-shadow-lg">
                                {project.title}
                            </h2>
                            <p className="text-primary text-sm sm:text-lg font-medium max-w-2xl drop-shadow-md">
                                {subtitle}
                            </p>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 sm:p-8 space-y-8 flex-grow">
                        
                        {/* Tags & Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/5 pb-6">
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs font-medium text-accent bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {(!project.repo_link && !project.demo_link) && (
                                    <span className="text-xs font-medium text-primary/70 bg-darker border border-primary/10 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                        <i className="fas fa-lock text-[10px]" /> {t('projects.privado')}
                                    </span>
                                )}
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-3 shrink-0">
                                {project.repo_link && (
                                    <a href={project.repo_link} target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-darker border border-white/10 rounded-lg text-primary text-sm font-medium hover:border-accent/40 hover:text-accent transition-all duration-200 flex items-center gap-2">
                                        <i className="fas fa-code" /> {t('projects.btnRepo')}
                                    </a>
                                )}
                                {project.demo_link && (
                                    <a href={project.demo_link} target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-accent text-darker rounded-lg text-sm font-semibold hover:bg-accent-hover transition-all duration-200 flex items-center gap-2 shadow-[0_0_15px_rgba(217,119,87,0.3)] hover:shadow-[0_0_25px_rgba(217,119,87,0.5)]">
                                        <i className="fas fa-external-link-alt" /> {t('projects.btnDemo')}
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column: Description */}
                            <div className="lg:col-span-1 space-y-4">
                                <h3 className="text-xs font-bold text-accent uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-4 h-[1px] bg-accent" />
                                    {t('projects.modalSobre')}
                                </h3>
                                <p className="text-primary/90 leading-relaxed text-sm">
                                    {fullDescription}
                                </p>
                            </div>

                            {/* Right Column: Highlights */}
                            <div className="lg:col-span-2 space-y-5">
                                <h3 className="text-xs font-bold text-accent uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-4 h-[1px] bg-accent" />
                                    {t('projects.modalDestaques')}
                                </h3>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {highlights.map((item, i) => (
                                        <motion.li
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + i * 0.05 }}
                                            className="flex items-start gap-3 bg-darker/50 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                                        >
                                            <span className="shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(217,119,87,0.8)]" />
                                            <span className="text-primary/80 text-sm leading-relaxed">
                                                {item}
                                            </span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
