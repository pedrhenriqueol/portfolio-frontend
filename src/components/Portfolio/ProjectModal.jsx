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

    return (
        <AnimatePresence>
            {/* Backdrop — cobre 100% da viewport, ignora scroll */}
            <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 99999,
                    backgroundColor: 'rgba(0,0,0,0.85)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                }}
            >
                {/* Modal card — centralizado, nunca afetado por scroll */}
                <motion.div
                    key="modal"
                    initial={{ opacity: 0, scale: 0.94, y: 24 }}
                    animate={{ opacity: 1, scale: 1,    y: 0  }}
                    exit={{   opacity: 0, scale: 0.94,  y: 24 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '640px',
                        maxHeight: '85vh',
                        overflowY: 'auto',
                        backgroundColor: '#1F2833',
                        border: '1px solid rgba(102,252,241,0.25)',
                        borderRadius: '16px',
                        boxShadow: '0 0 80px rgba(102,252,241,0.10), 0 32px 80px rgba(0,0,0,0.7)',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {/* Header */}
                    <div style={{
                        position: 'sticky', top: 0, zIndex: 10,
                        backgroundColor: '#1F2833',
                        borderBottom: '1px solid rgba(197,198,199,0.15)',
                        padding: '20px 28px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '16px',
                    }}>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
                                {project.title}
                            </h2>
                            <p className="text-secondary text-sm mt-1">{subtitle}</p>
                        </div>
                        <button
                            onClick={onClose}
                            aria-label="Fechar"
                            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-primary/30 text-gray-400 hover:border-secondary/50 hover:text-secondary transition-all duration-200"
                        >
                            <i className="fas fa-times" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="px-7 py-6 space-y-6">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="text-xs font-semibold text-accent bg-accent/10 border border-accent/30 px-3 py-1 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                            <span className="text-xs font-semibold text-gray-500 bg-darker border border-primary/20 px-3 py-1 rounded-full flex items-center gap-1">
                                <i className="fas fa-lock text-[10px]" /> {t('projects.privado')}
                            </span>
                        </div>

                        {/* Descrição completa */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
                                {t('projects.modalSobre')}
                            </h3>
                            <p className="text-gray-400 leading-relaxed">{fullDescription}</p>
                        </div>

                        {/* Destaques técnicos */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                                <i className="fas fa-microchip text-secondary mr-2" />
                                {t('projects.modalDestaques')}
                            </h3>
                            <ul className="space-y-3">
                                {highlights.map((item, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.08 + i * 0.05 }}
                                        className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed"
                                    >
                                        <span className="shrink-0 w-5 h-5 mt-0.5 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center">
                                            <i className="fas fa-check text-secondary text-[9px]" />
                                        </span>
                                        {item}
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-7 py-4 border-t border-primary/20 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 rounded-lg bg-secondary text-darker text-sm font-semibold hover:bg-accent transition-colors duration-200"
                        >
                            {t('projects.modalFechar')}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
