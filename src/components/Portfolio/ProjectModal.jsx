import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectModal({ project, onClose }) {
    // Fecha com ESC
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    if (!project?.details) return null;
    const { subtitle, fullDescription, highlights } = project.details;

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={onClose}
                className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center sm:p-4"
            >
                {/* Modal card */}
                <motion.div
                    key="modal"
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0  }}
                    exit={{   opacity: 0, y: 60  }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full sm:max-w-2xl max-h-[92dvh] sm:max-h-[88vh] overflow-y-auto bg-darker border-t sm:border border-secondary/30 rounded-t-3xl sm:rounded-2xl shadow-[0_0_80px_rgba(102,252,241,0.12)] flex flex-col"
                >
                    {/* Mobile drag handle */}
                    <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
                        <div className="w-10 h-1 rounded-full bg-primary/30" />
                    </div>
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-darker border-b border-primary/20 px-8 py-5 flex items-start justify-between gap-4">
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
                    <div className="px-8 py-6 space-y-6">
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
                                <i className="fas fa-lock text-[10px]" /> Repositório Privado
                            </span>
                        </div>

                        {/* Descrição completa */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
                                Sobre o Projeto
                            </h3>
                            <p className="text-gray-400 leading-relaxed">{fullDescription}</p>
                        </div>

                        {/* Destaques técnicos */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                                <i className="fas fa-microchip text-secondary mr-2" />
                                Destaques Técnicos
                            </h3>
                            <ul className="space-y-3">
                                {highlights.map((item, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + i * 0.06 }}
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
                    <div className="px-8 py-4 border-t border-primary/20 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 rounded-lg bg-secondary text-darker text-sm font-semibold hover:bg-accent transition-colors duration-200"
                        >
                            Fechar
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
