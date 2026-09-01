import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

export default function ProjectModal({ project, onClose }) {
    const { t } = useLanguage();

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);

        // Bloqueia scroll do body enquanto o modal estiver ativo
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
        /* Backdrop com blur */
        <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
            role="dialog"
            aria-modal="true"
        >
            {/* Modal Container */}
            <motion.div
                key="modal"
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 20 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-dark border border-white/10 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] flex flex-col my-auto"
            >
                {/* ── Sticky Header: Botão de fechar sempre acessível durante a rolagem ── */}
                <div className="sticky top-0 z-50 flex items-center justify-between px-5 sm:px-8 py-3.5 bg-darker/95 backdrop-blur-xl border-b border-white/10 shadow-md">
                    <div className="flex items-center gap-3 truncate pr-4">
                        <span className="text-xs font-mono font-semibold text-accent uppercase tracking-wider hidden sm:inline">
                            Estudo de Caso
                        </span>
                        <span className="text-primary/40 hidden sm:inline">•</span>
                        <h3 className="text-sm sm:text-base font-serif font-bold text-white truncate">
                            {project.title}
                        </h3>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        {project.demo_link && (
                            <a
                                href={project.demo_link}
                                target="_blank"
                                rel="noreferrer"
                                data-cursor-morph="true"
                                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 bg-accent/15 text-accent border border-accent/30 rounded-lg text-xs font-semibold hover:bg-accent hover:text-darker transition-all"
                            >
                                <i className="fas fa-external-link-alt text-[10px]" />
                                <span>Demo</span>
                            </a>
                        )}

                        <button
                            onClick={onClose}
                            aria-label={t('projects.modalFechar') || 'Fechar'}
                            data-cursor-morph="true"
                            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/15 hover:border-accent/40 transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-hidden"
                            title="Fechar (ESC)"
                        >
                            <i className="fas fa-times text-sm" />
                        </button>
                    </div>
                </div>

                {/* Banner Image */}
                <div className="relative w-full h-52 sm:h-72 shrink-0 overflow-hidden bg-darker">
                    <img
                        src={coverImage}
                        alt={project.title}
                        decoding="async"
                        className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/dashboard_placeholder.png';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />

                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 flex flex-col justify-end">
                        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-secondary mb-1.5 tracking-wide drop-shadow-lg">
                            {project.title}
                        </h2>
                        <p className="text-primary text-xs sm:text-sm font-medium max-w-2xl drop-shadow-md font-sans">
                            {subtitle}
                        </p>
                    </div>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-8 space-y-8 flex-grow font-sans">

                    {/* Tags, Metrics & Actions */}
                    <div className="flex flex-col gap-4 border-b border-white/5 pb-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs font-mono text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {(!project.repo_link && !project.demo_link) && (
                                    <span className="text-xs font-mono text-primary/80 bg-darker border border-primary/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                                        <i className="fas fa-shield-alt text-accent text-[10px]" /> {t('projects.privado')}
                                    </span>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 shrink-0">
                                {project.repo_link && (
                                    <a
                                        href={project.repo_link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-4 py-2 bg-darker border border-white/10 rounded-lg text-primary text-xs sm:text-sm font-medium hover:border-accent/40 hover:text-accent transition-all duration-200 flex items-center gap-2 cursor-pointer"
                                    >
                                        <i className="fas fa-code" /> {t('projects.btnRepo')}
                                    </a>
                                )}
                                {project.demo_link && (
                                    <a
                                        href={project.demo_link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-4 py-2 bg-accent text-darker rounded-lg text-xs sm:text-sm font-semibold hover:bg-accent-hover transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-accent/40 cursor-pointer"
                                    >
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
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {highlights.map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-3 bg-darker/60 p-3.5 rounded-xl border border-white/5 hover:border-accent/20 transition-colors"
                                    >
                                        <span className="shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-accent shadow-xs shadow-accent" />
                                        <span className="text-secondary/85 text-xs sm:text-sm leading-relaxed">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Architecture Diagram Block */}
                    {architecture && architecture.length > 0 && (
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <h3 className="text-xs font-bold text-accent uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-4 h-[1px] bg-accent" />
                                {t('projects.modalArquitetura')}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {architecture.map((arch, i) => (
                                    <div key={i} className="bg-darker/90 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 text-accent font-semibold text-xs tracking-wider uppercase mb-1">
                                                <i className="fas fa-layer-group text-[10px]" />
                                                <span>{arch.layer}</span>
                                            </div>
                                            <h4 className="text-white font-bold text-sm mb-1">{arch.tech}</h4>
                                            <p className="text-primary/70 text-xs">{arch.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Challenge vs Solution */}
                    {(challenge || solution) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                            {challenge && (
                                <div className="space-y-3 bg-darker/40 p-5 rounded-xl border border-white/5">
                                    <h3 className="text-xs font-bold text-accent uppercase tracking-[0.2em] flex items-center gap-2">
                                        <i className="fas fa-exclamation-triangle text-amber-400/80" />
                                        {t('projects.modalDesafio') || t('projects.modalChallengeTitle') || 'Desafio Técnico'}
                                    </h3>
                                    <p className="text-primary/90 text-xs sm:text-sm leading-relaxed">
                                        {challenge}
                                    </p>
                                </div>
                            )}
                            {solution && (
                                <div className="space-y-3 bg-darker/40 p-5 rounded-xl border border-white/5">
                                    <h3 className="text-xs font-bold text-accent uppercase tracking-[0.2em] flex items-center gap-2">
                                        <i className="fas fa-check-circle text-green-400/80" />
                                        {t('projects.modalSolucao') || t('projects.modalSolutionTitle') || 'Solução de Engenharia'}
                                    </h3>
                                    <p className="text-primary/90 text-xs sm:text-sm leading-relaxed">
                                        {solution}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
