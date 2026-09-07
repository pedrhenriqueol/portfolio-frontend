import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface JourneyMilestoneArchive {
    id: string;
    year: string;
    company: string;
    role: string;
    archiveTitle: string;
    archiveSubtitle: string;
    image: string;
    badge: string;
    date: string;
    location: string;
    description: string;
    telemetry: {
        label: string;
        value: string;
        highlight?: boolean;
    }[];
    tags: string[];
}

interface JourneyPhotoModalProps {
    isOpen: boolean;
    onClose: () => void;
    milestone: JourneyMilestoneArchive | null;
}

export const JourneyPhotoModal: React.FC<JourneyPhotoModalProps> = ({
    isOpen,
    onClose,
    milestone,
}) => {
    // Tecla ESC para fechar
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    return (
        <AnimatePresence>
            {isOpen && milestone && (
                <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
                    {/* Backdrop com desfoque e escurecimento */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
                    />

                    {/* Janela Modal estilo Arquivo Técnico */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.94, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 15 }}
                        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
                        className="relative z-10 w-full max-w-4xl bg-darker border border-white/15 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden my-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Barra Superior da Janela */}
                        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-white/10 bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                                </div>
                                <span className="h-4 w-[1px] bg-white/10 mx-1" />
                                <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
                                    <i className="fas fa-folder-open text-accent" />
                                    <span className="font-semibold text-white tracking-wide">
                                        ARCHIVE // {milestone.year}
                                    </span>
                                    <span className="text-gray-500 hidden sm:inline">— {milestone.archiveTitle}</span>
                                </div>
                            </div>

                            {/* Botão Fechar com Atalho ESC */}
                            <div className="flex items-center gap-2">
                                <span className="hidden sm:inline text-[10px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                                    ESC
                                </span>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                                    aria-label="Fechar Arquivo"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Corpo do Arquivo: Imagem / Snapshot + Telemetria */}
                        <div className="p-5 sm:p-7 space-y-6 max-h-[80vh] overflow-y-auto">
                            {/* Snapshot Visual com Moldura Técnica */}
                            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/50 shadow-inner group">
                                <img
                                    src={milestone.image}
                                    alt={milestone.archiveTitle}
                                    className="w-full h-64 sm:h-96 object-cover object-top transition-transform duration-500 group-hover:scale-[1.01]"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                                {/* Badge Flutuante no Snapshot */}
                                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                                    <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-darker/90 text-secondary border border-accent/40 backdrop-blur-md">
                                        {milestone.badge}
                                    </span>
                                    <div className="flex items-center gap-2 text-[11px] font-mono text-gray-300 bg-darker/90 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                                        <i className="fas fa-calendar-alt text-accent" />
                                        <span>{milestone.date}</span>
                                        <span className="text-gray-500">•</span>
                                        <i className="fas fa-map-marker-alt text-accent" />
                                        <span>{milestone.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Informações Executivas do Marco */}
                            <div>
                                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
                                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                                        {milestone.archiveSubtitle}
                                    </h3>
                                    <span className="text-xs font-mono text-accent">
                                        {milestone.company}
                                    </span>
                                </div>
                                <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-sans">
                                    {milestone.description}
                                </p>
                            </div>

                            {/* Faixa de Telemetria Operacional */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                                {milestone.telemetry.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="p-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-accent/30 transition-colors"
                                    >
                                        <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                                            {item.label}
                                        </div>
                                        <div className={`text-base sm:text-lg font-mono font-bold ${item.highlight ? 'text-secondary' : 'text-white'}`}>
                                            {item.value}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Tags Técnicas de Validação */}
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                                {milestone.tags.map((tag, tIdx) => (
                                    <span
                                        key={tIdx}
                                        className="text-xs font-mono px-3 py-1 rounded-md bg-white/5 text-primary/80 border border-white/10"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Rodapé com Fechamento Rápido */}
                        <div className="px-5 sm:px-7 py-4 border-t border-white/10 bg-white/[0.01] flex items-center justify-between text-xs font-mono text-gray-500">
                            <span>SISTEMA DE ARQUIVOS // REGISTRO TÉCNICO AUTÊNTICO</span>
                            <button
                                onClick={onClose}
                                className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer font-sans text-xs font-medium"
                            >
                                Fechar Registro
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default JourneyPhotoModal;
