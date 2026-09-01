import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';

export default function ThemeDropdown({ isMobile = false, onSelect }) {
    const { palette, paletteData, palettes, setPalette } = useTheme();
    const { t } = useLanguage();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (isMobile) return;
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isMobile]);

    if (isMobile) {
        return (
            <div className="mb-6 p-3 bg-white/[0.02] border border-white/5 rounded-xs">
                <div className="text-[9px] uppercase tracking-widest text-primary/60 font-semibold mb-2.5 flex items-center justify-between">
                    <span>{t('palette.title')}</span>
                    <i className="fas fa-palette text-accent" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {Object.entries(palettes).map(([id, p]) => {
                        const isCurrent = palette === id;
                        const name = t(p.nameKey) !== p.nameKey ? t(p.nameKey) : p.defaultName;
                        return (
                            <button
                                key={id}
                                onClick={() => {
                                    setPalette(id);
                                    if (onSelect) onSelect();
                                }}
                                className={`p-2 text-[9px] tracking-wider uppercase font-medium transition-all duration-150 flex items-center justify-between rounded-xs border cursor-pointer ${
                                    isCurrent
                                        ? 'text-accent bg-accent/10 border-accent/30'
                                        : 'text-primary bg-black/30 border-white/5 hover:border-white/20'
                                }`}
                            >
                                <span className="truncate mr-1">{name}</span>
                                <div className="flex items-center gap-0.5 shrink-0">
                                    {p.preview.map((c, idx) => (
                                        <span
                                            key={idx}
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="relative hidden sm:block" ref={dropdownRef}>
            <button
                onClick={() => setOpen(prev => !prev)}
                className="flex items-center gap-2 border border-white/10 hover:border-accent/40 text-primary hover:text-accent text-[10px] tracking-widest uppercase px-3 py-2 transition-all duration-200 cursor-pointer rounded-xs"
                aria-label="Selecionar paleta de cores"
                title={t('palette.title')}
            >
                <div className="flex items-center gap-1">
                    {paletteData?.preview?.map((c, idx) => (
                        <span
                            key={idx}
                            className="w-2 h-2 rounded-full border border-black/30 shadow-xs"
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>
                <i className="fas fa-palette text-[10px] ml-0.5 text-accent" />
                <i className={`fas fa-chevron-down text-[8px] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-1.5 w-48 bg-darker border border-primary/20 shadow-[0_16px_40px_rgba(0,0,0,0.85)] p-1.5 z-50 backdrop-blur-xl rounded-sm"
                    >
                        <div className="text-[9px] uppercase tracking-widest text-primary/60 px-2.5 py-1.5 font-semibold border-b border-white/5 mb-1 flex items-center justify-between">
                            <span>{t('palette.title')}</span>
                            <i className="fas fa-swatchbook text-accent/70" />
                        </div>
                        {Object.entries(palettes).map(([id, p]) => {
                            const isCurrent = palette === id;
                            const name = t(p.nameKey) !== p.nameKey ? t(p.nameKey) : p.defaultName;
                            return (
                                <button
                                    key={id}
                                    onClick={() => {
                                        setPalette(id);
                                        setOpen(false);
                                        if (onSelect) onSelect();
                                    }}
                                    className={`w-full text-left px-2.5 py-2 text-[10px] tracking-wider uppercase font-medium transition-all duration-150 flex items-center justify-between rounded-xs cursor-pointer ${
                                        isCurrent
                                            ? 'text-accent bg-accent/10 border border-accent/25'
                                            : 'text-primary hover:text-secondary hover:bg-white/5 border border-transparent'
                                    }`}
                                >
                                    <span className="truncate max-w-[105px]">{name}</span>
                                    <div className="flex items-center gap-1 shrink-0">
                                        {p.preview.map((c, idx) => (
                                            <span
                                                key={idx}
                                                className="w-2.5 h-2.5 rounded-full border border-black/40 shadow-xs"
                                                style={{ backgroundColor: c }}
                                            />
                                        ))}
                                    </div>
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
