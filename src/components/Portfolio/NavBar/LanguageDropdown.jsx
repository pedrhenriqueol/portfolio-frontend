import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../context/LanguageContext';

const FLAGS = { pt: '🇧🇷 PT', en: '🇺🇸 EN', es: '🇪🇸 ES' };

export default function LanguageDropdown({ isMobile = false, onSelect }) {
    const { lang, setLang } = useLanguage();
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
            <div className="flex gap-2 mb-4">
                {['pt', 'en', 'es'].map((l) => (
                    <button
                        key={l}
                        onClick={() => {
                            setLang(l);
                            if (onSelect) onSelect();
                        }}
                        className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all duration-200 rounded-xs cursor-pointer ${
                            lang === l
                                ? 'border-accent text-accent bg-accent/8'
                                : 'border-white/10 text-primary hover:border-white/20 hover:text-secondary'
                        }`}
                    >
                        {FLAGS[l]}
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div className="relative hidden sm:block" ref={dropdownRef}>
            <button
                onClick={() => setOpen(prev => !prev)}
                className="flex items-center gap-1.5 border border-white/10 hover:border-accent/35 text-primary hover:text-accent text-[10px] tracking-widest uppercase px-3 py-2 transition-all duration-200 rounded-xs cursor-pointer"
                aria-label="Selecionar idioma"
            >
                <span>{FLAGS[lang]}</span>
                <i className={`fas fa-chevron-down text-[9px] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-1.5 w-28 bg-darker border border-primary/20 shadow-[0_16px_40px_rgba(0,0,0,0.7)] overflow-hidden z-50 backdrop-blur-xl rounded-xs"
                    >
                        {['pt', 'en', 'es'].map((l) => (
                            <button
                                key={l}
                                onClick={() => {
                                    setLang(l);
                                    setOpen(false);
                                    if (onSelect) onSelect();
                                }}
                                className={`w-full text-left px-4 py-2.5 text-[10px] tracking-widest uppercase font-medium transition-colors duration-150 cursor-pointer ${
                                    lang === l
                                        ? 'text-accent bg-accent/8'
                                        : 'text-primary hover:text-secondary hover:bg-white/5'
                                }`}
                            >
                                {FLAGS[l]}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
