import { useEffect } from 'react';
import { motion } from 'framer-motion';
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
    const { subtitle, fullDescription, highlights, metrics, architecture, challenge, solution } = project.details;
    const coverImage = project.image_url || '/dashboard_placeholder.png';

    return (
        /* Backdrop */
        <motion.div
            key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={onClose}
                className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto"
            >
                {/* Modal Container */}
                <motion.div
                    key="modal"
                    initial={{ opacity: 0, scale: 0.96, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-dark border border-white/10 rounded-2xl shadow-2xl flex flex-col my-auto"
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        aria-label={t('projects.modalFechar') || 'Fechar'}
                        className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white/80 hover:text-white hover:bg-black/80 transition-all duration-300 group cursor-pointer"
                    >
                        <i className="fas fa-times group-hover:rotate-90 transition-transform duration-300" />
                    </button>

                    {/* Banner Image */}
                    <div className="relative w-full h-52 sm:h-80 shrink-0 overflow-hidden bg-darker">
                        <img 
                            src={coverImage} 
                            alt={project.title} 
                            decoding="async"
                            className="w-full h-full object-cover opacity-75 hover:opacity-100 transition-opacity duration-700"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/dashboard_placeholder.png';
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
                        
                        {/* Title overlay */}
                        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 flex flex-col justify-end">
                            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-secondary mb-2 tracking-wide drop-shadow-lg">
                                {project.title}
                            </h2>
                            <p className="text-primary text-sm sm:text-base font-medium max-w-2xl drop-shadow-md">
                                {subtitle}
                            </p>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 sm:p-8 space-y-8 flex-grow">
                        
                        {/* Tags, Metrics & Actions */}
                        <div className="flex flex-col gap-4 border-b border-white/5 pb-6">
                            <div className="flex flex-wrap items-center justify-between gap-4">
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
                                        <span className="text-xs font-medium text-primary/80 bg-darker border border-primary/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                            <i className="fas fa-shield-alt text-accent text-[10px]" /> {t('projects.privado')}
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
                                        <a href={project.demo_link} target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-accent text-darker rounded-lg text-sm font-semibold hover:bg-accent-hover transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-accent/40">
                                            <i className="fas fa-external-link-alt" /> {t('projects.btnDemo')}
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Metrics Highlights if available */}
                            {metrics && metrics.length > 0 && (
                                <div className="flex flex-wrap gap-2.5 pt-2">
                                    {metrics.map((metric, idx) => {
                                        const isObj = typeof metric === 'object' && metric !== null;
                                        const iconClass = isObj ? metric.icon : 'fas fa-chart-line';
                                        const labelText = isObj ? `${metric.label ? `${metric.label}: ` : ''}${metric.value}` : metric;

                                        return (
                                            <span key={idx} className="text-xs font-mono font-medium bg-darker/90 border border-primary/30 text-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm hover:border-accent/40 transition-colors">
                                                <i className={`${iconClass} text-accent text-xs`} />
                                                <span>{labelText}</span>
                                            </span>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Description & Technical Highlights */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column: Description */}
                            <div className="lg:col-span-1 space-y-4">
                                <h3 className="text-xs font-bold text-accent uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-4 h-[1px] bg-accent" />
                                    {t('projects.modalSobre')}
                                </h3>
                                <p className="text-primary/95 leading-relaxed text-sm">
                                    {fullDescription}
                                </p>
                            </div>

                            {/* Right Column: Highlights */}
                            <div className="lg:col-span-2 space-y-5">
                                <h3 className="text-xs font-bold text-accent uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-4 h-[1px] bg-accent" />
                                    {t('projects.modalDestaques')}
                                </h3>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    {highlights.map((item, i) => (
                                        <motion.li
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.05 + i * 0.04 }}
                                            className="flex items-start gap-3 bg-darker/60 p-3.5 rounded-xl border border-white/5 hover:border-accent/20 transition-colors"
                                        >
                                            <span className="shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-accent shadow-sm shadow-accent" />
                                            <span className="text-secondary/85 text-xs sm:text-sm leading-relaxed">
                                                {item}
                                            </span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Architecture Diagram Block (if provided) */}
                        {architecture && architecture.length > 0 && (
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <h3 className="text-xs font-bold text-accent uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-4 h-[1px] bg-accent" />
                                    {t('projects.modalArquitetura') || 'Fluxo & Diagrama de Arquitetura'}
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-darker/80 p-4 rounded-xl border border-white/10 relative">
                                    {architecture.map((layer, idx) => (
                                        <div key={idx} className="flex flex-col justify-between p-3.5 rounded-lg bg-dark/70 border border-white/5 relative group hover:border-accent/40 transition-colors">
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold">
                                                        {`0${idx + 1}. ${layer.layer}`}
                                                    </span>
                                                </div>
                                                <div className="text-xs font-bold text-secondary mb-1">
                                                    {layer.tech}
                                                </div>
                                                <div className="text-[11px] text-primary/80 leading-relaxed">
                                                    {layer.role}
                                                </div>
                                            </div>
                                            {idx < architecture.length - 1 && (
                                                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-accent/60 text-xs">
                                                    <i className="fas fa-chevron-right" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Case Study: Challenge vs. Solution */}
                        {challenge && solution && (
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <h3 className="text-xs font-bold text-accent uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-4 h-[1px] bg-accent" />
                                    {t('projects.modalCaseStudy') || 'Estudo de Caso — Desafio vs. Solução'}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Challenge Card */}
                                    <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 space-y-2">
                                        <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                                            <i className="fas fa-exclamation-triangle" />
                                            <span>{t('projects.modalChallengeTitle') || 'Desafio Técnico'}</span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-primary/90 leading-relaxed">
                                            {challenge}
                                        </p>
                                    </div>

                                    {/* Solution Card */}
                                    <div className="p-4 rounded-xl bg-green-950/20 border border-green-500/20 space-y-2">
                                        <div className="flex items-center gap-2 text-green-400 font-bold text-xs uppercase tracking-wider">
                                            <i className="fas fa-check-circle" />
                                            <span>{t('projects.modalSolutionTitle') || 'Solução de Engenharia'}</span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-primary/90 leading-relaxed">
                                            {solution}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </motion.div>
            </motion.div>
    );
}
