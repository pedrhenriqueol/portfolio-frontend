import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export default function CommandPalette() {
    const [open, setOpen]   = useState(false);
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState(0);
    const inputRef = useRef(null);
    const { t, lang, setLang } = useLanguage();
    const { palettes, setPalette, palette: currentPalette } = useTheme();

    /* ── Commands ── */
    const commands = useMemo(() => [
        {
            group: lang === 'en' ? 'Navigation' : lang === 'es' ? 'Navegación' : 'Navegação',
            items: [
                { id: 'nav-home',    icon: 'fas fa-home',        label: 'Home',            action: () => scrollTo('home') },
                { id: 'nav-sobre',   icon: 'fas fa-user',        label: t('nav.sobre'),    action: () => scrollTo('sobre') },
                { id: 'nav-exp',     icon: 'fas fa-briefcase',   label: t('nav.experiencia'), action: () => scrollTo('experiencia') },
                { id: 'nav-skills',  icon: 'fas fa-code',        label: t('nav.conhecimentos'), action: () => scrollTo('conhecimentos') },
                { id: 'nav-proj',    icon: 'fas fa-folder',      label: t('nav.projetos'), action: () => scrollTo('projetos') },
                { id: 'nav-contact', icon: 'fas fa-envelope',    label: t('nav.contato'),  action: () => scrollTo('contato') },
            ],
        },
        {
            group: lang === 'en' ? 'Actions' : lang === 'es' ? 'Acciones' : 'Ações',
            items: [
                {
                    id: 'dl-cv-pt',
                    icon: 'fas fa-file-pdf',
                    label: lang === 'en' ? 'Download Resume (PDF)' : lang === 'es' ? 'Descargar Currículum (PDF)' : 'Baixar Currículo (PDF)',
                    hint: 'PDF',
                    action: () => {
                        const link = document.createElement('a');
                        link.href = '/curriculo_pedro_henrique.pdf';
                        link.download = 'curriculo_pedro_henrique.pdf';
                        link.click();
                    },
                },
                {
                    id: 'copy-email',
                    icon: 'fas fa-copy',
                    label: lang === 'en' ? 'Copy Email' : lang === 'es' ? 'Copiar Correo' : 'Copiar E-mail',
                    hint: 'pedrohc.forza@gmail.com',
                    action: () => {
                        navigator.clipboard.writeText('pedrohc.forza@gmail.com');
                        toast(lang === 'en' ? 'Email copied! 📋' : lang === 'es' ? '¡Correo copiado! 📋' : 'E-mail copiado! 📋');
                    },
                },
                {
                    id: 'open-github',
                    icon: 'fab fa-github',
                    label: lang === 'en' ? 'Open GitHub' : lang === 'es' ? 'Abrir GitHub' : 'Abrir GitHub',
                    action: () => window.open('https://github.com/pedrhenriqueol', '_blank'),
                },
                {
                    id: 'open-linkedin',
                    icon: 'fab fa-linkedin',
                    label: lang === 'en' ? 'Open LinkedIn' : lang === 'es' ? 'Abrir LinkedIn' : 'Abrir LinkedIn',
                    action: () => window.open('https://www.linkedin.com/in/pedro-henrique-b0a015391/', '_blank'),
                },
                {
                    id: 'play-games',
                    icon: 'fas fa-gamepad',
                    label: lang === 'en' ? 'Play Terminal Games (Snake, Quiz, Matrix)' : lang === 'es' ? 'Jugar Minijuegos en la Terminal (Snake, Quiz, Matrix)' : 'Jogar Minijogos no Terminal (Snake, QA Quiz, Matrix)',
                    hint: 'Terminal Arcade 🎮',
                    action: () => {
                        scrollTo('home');
                        setTimeout(() => {
                            window.dispatchEvent(new CustomEvent('focus-terminal', { detail: { command: 'pedro --games' } }));
                        }, 120);
                        toast(lang === 'en' ? 'Terminal Arcade launched! 🕹️' : lang === 'es' ? '¡Terminal Arcade activado! 🕹️' : 'Terminal Arcade ativado! 🕹️');
                    },
                },
            ],
        },
        {
            group: lang === 'en' ? 'Language' : lang === 'es' ? 'Idioma' : 'Idioma',
            items: [
                { id: 'lang-pt', icon: '🇧🇷', label: 'Português (BR)', action: () => setLang('pt') },
                { id: 'lang-en', icon: '🇺🇸', label: 'English',         action: () => setLang('en') },
                { id: 'lang-es', icon: '🇪🇸', label: 'Español',         action: () => setLang('es') },
            ],
        },
        {
            group: lang === 'en' ? 'Theme' : lang === 'es' ? 'Tema' : 'Tema',
            items: Object.entries(palettes).map(([id, p]) => ({
                id: `theme-${id}`,
                icon: 'fas fa-palette',
                label: p.defaultName,
                preview: p.preview,
                action: () => setPalette(id),
            })),
        },
    ], [t, lang, setLang, palettes, setPalette]);

    /* ── Flat filtered list ── */
    const flat = useMemo(() => {
        const q = query.toLowerCase();
        const all = commands.flatMap(g =>
            g.items
                .filter(item => item.label.toLowerCase().includes(q))
                .map(item => ({ ...item, group: g.group }))
        );
        return all;
    }, [query, commands]);

    /* ── Toast helper ── */
    const [toastMsg, setToastMsg] = useState('');
    const toastTimer = useRef(null);
    const toast = useCallback((msg) => {
        setToastMsg(msg);
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToastMsg(''), 2400);
    }, []);

    /* ── Keyboard shortcuts ── */
    useEffect(() => {
        const onKey = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setOpen(v => !v);
                setQuery('');
                setSelected(0);
            }
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    useEffect(() => {
        if (open) {
            setSelected(0);
            setTimeout(() => inputRef.current?.focus(), 60);
        }
    }, [open]);

    /* ── Arrow navigation ── */
    const onInputKey = (e) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, flat.length - 1)); }
        if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
        if (e.key === 'Enter' && flat[selected]) {
            flat[selected].action();
            setOpen(false);
            setQuery('');
        }
    };

    const run = useCallback((item) => {
        item.action();
        setOpen(false);
        setQuery('');
    }, []);

    return (
        <>
            {/* Hint button — desktop only */}
            <button
                onClick={() => setOpen(true)}
                className="hidden lg:flex fixed bottom-6 right-6 z-[9990] items-center gap-2 bg-darker/90 border border-primary/25 text-primary text-[11px] tracking-widest uppercase px-4 py-2.5 rounded-full backdrop-blur-xl shadow-xl hover:border-accent/50 hover:text-accent transition-all duration-200 group"
                aria-label="Abrir command palette"
                title="Command Palette (Ctrl+K)"
            >
                <i className="fas fa-search text-[10px]" />
                <span>Ctrl</span>
                <span className="border border-primary/30 rounded px-1">K</span>
            </button>

            {/* Toast */}
            <AnimatePresence>
                {toastMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-20 right-6 z-[99999] bg-darker border border-accent/30 text-secondary text-sm px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-xl"
                    >
                        {toastMsg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Palette */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="cp-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="fixed inset-0 z-[99990] flex items-start justify-center pt-[12vh] px-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    >
                        <motion.div
                            key="cp-panel"
                            initial={{ opacity: 0, scale: 0.96, y: -12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: -12 }}
                            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                            className="w-full max-w-xl bg-darker border border-primary/20 rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.9)] overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Search input */}
                            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-primary/15">
                                <i className="fas fa-search text-primary/50 text-sm shrink-0" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={e => { setQuery(e.target.value); setSelected(0); }}
                                    onKeyDown={onInputKey}
                                    placeholder={lang === 'en' ? 'Search commands, navigate, change theme...' : lang === 'es' ? 'Buscar comandos, navegar, cambiar tema...' : 'Buscar comandos, navegar, trocar tema...'}
                                    className="flex-1 bg-transparent text-white text-sm placeholder-primary/40 outline-none font-sans"
                                    aria-label="Pesquisar comandos"
                                />
                                <kbd className="hidden sm:flex items-center gap-1 text-[10px] text-primary/40 border border-primary/20 rounded px-1.5 py-0.5">
                                    ESC
                                </kbd>
                            </div>

                            {/* Results */}
                            <div className="max-h-[360px] overflow-y-auto py-2">
                                {flat.length === 0 ? (
                                    <p className="text-center text-primary/40 text-sm py-8">
                                        {lang === 'en' ? 'No results found.' : lang === 'es' ? 'No se encontraron resultados.' : 'Nenhum resultado encontrado.'}
                                    </p>
                                ) : (
                                    (() => {
                                        let globalIdx = 0;
                                        const groups = {};
                                        flat.forEach(item => {
                                            if (!groups[item.group]) groups[item.group] = [];
                                            groups[item.group].push({ ...item, _idx: globalIdx++ });
                                        });
                                        return Object.entries(groups).map(([group, items]) => (
                                            <div key={group}>
                                                <p className="text-[10px] uppercase tracking-widest text-primary/35 font-semibold px-4 pt-3 pb-1.5">{group}</p>
                                                {items.map((item) => {
                                                    const isActive = selected === item._idx;
                                                    const isCurrent = item.id === `theme-${currentPalette}` || item.id === `lang-${lang}`;
                                                    return (
                                                        <button
                                                            key={item.id}
                                                            onClick={() => run(item)}
                                                            onMouseEnter={() => setSelected(item._idx)}
                                                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100 ${
                                                                isActive ? 'bg-accent/10 text-white' : 'text-primary hover:bg-white/4'
                                                            }`}
                                                        >
                                                            <span className="w-6 text-center text-sm shrink-0">
                                                                {typeof item.icon === 'string' && item.icon.startsWith('fa')
                                                                    ? <i className={`${item.icon} ${isActive ? 'text-accent' : 'text-primary/60'}`} />
                                                                    : item.icon}
                                                            </span>
                                                            <span className="flex-1 text-sm font-medium truncate">{item.label}</span>
                                                            {item.preview && (
                                                                <span className="flex gap-1 shrink-0">
                                                                    {item.preview.map((c, i) => (
                                                                        <span key={i} className="w-3 h-3 rounded-full border border-black/30" style={{ backgroundColor: c }} />
                                                                    ))}
                                                                </span>
                                                            )}
                                                            {item.hint && <span className="text-[10px] text-primary/40 shrink-0">{item.hint}</span>}
                                                            {isCurrent && <span className="text-[9px] text-accent/70 border border-accent/25 px-1.5 py-0.5 rounded shrink-0">Ativo</span>}
                                                            {isActive && <i className="fas fa-arrow-right text-[9px] text-accent/70 shrink-0" />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ));
                                    })()
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-primary/10 text-[10px] text-primary/30 font-mono">
                                <span><kbd className="border border-primary/20 rounded px-1">↑</kbd><kbd className="border border-primary/20 rounded px-1 ml-0.5">↓</kbd> navegar</span>
                                <span><kbd className="border border-primary/20 rounded px-1">↵</kbd> executar</span>
                                <span><kbd className="border border-primary/20 rounded px-1">ESC</kbd> fechar</span>
                                <span className="ml-auto flex items-center gap-1"><i className="fas fa-search text-[9px]" /> Command Palette</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
