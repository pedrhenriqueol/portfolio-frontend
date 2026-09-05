import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState(0);
    const inputRef = useRef(null);
    const listRef = useRef(null);
    const { t, lang, setLang } = useLanguage();
    const { palettes, setPalette } = useTheme();

    /* ── Comandos Disponíveis ── */
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
            group: lang === 'en' ? 'Flagship Projects' : lang === 'es' ? 'Proyectos Principales' : 'Projetos em Destaque',
            items: [
                {
                    id: 'proj-paystream',
                    icon: 'fas fa-coins',
                    label: 'PayStream Gateway (Fintech Core Banking)',
                    hint: 'Fastify + Prisma + HMAC',
                    action: () => {
                        scrollTo('projetos');
                        window.open('https://github.com/pedrhenriqueol/paystream-gateway', '_blank');
                    },
                },
                {
                    id: 'proj-portlog',
                    icon: 'fas fa-ship',
                    label: 'PortLog OS (Terminal Operations & FSM)',
                    hint: 'React + Multi-tenant + IoT',
                    action: () => {
                        scrollTo('projetos');
                        window.open('https://github.com/pedrhenriqueol/portlog-os', '_blank');
                    },
                },
                {
                    id: 'proj-spectr',
                    icon: 'fas fa-vial',
                    label: 'SPECTR TestOps (API Quality & Chaos Lab)',
                    hint: 'Postman-grade + OpenAPI + SLA',
                    action: () => {
                        scrollTo('projetos');
                        window.open('https://github.com/pedrhenriqueol/spectr-testops', '_blank');
                    },
                },
            ],
        },
        {
            group: lang === 'en' ? 'Live Deploys' : lang === 'es' ? 'Deploys en Vivo' : 'Deploys ao Vivo',
            items: [
                {
                    id: 'deploy-paystream',
                    icon: 'fas fa-rocket',
                    label: 'PayStream Gateway — Vercel Production',
                    hint: 'paystream-gateway.vercel.app',
                    action: () => window.open('https://paystream-gateway.vercel.app', '_blank'),
                },
                {
                    id: 'deploy-portlog',
                    icon: 'fas fa-rocket',
                    label: 'PortLog OS — Vercel Production',
                    hint: 'portlog-os.vercel.app',
                    action: () => window.open('https://portlog-os.vercel.app', '_blank'),
                },
                {
                    id: 'deploy-spectr',
                    icon: 'fas fa-rocket',
                    label: 'SPECTR TestOps — Vercel Production',
                    hint: 'spectr-testops.vercel.app',
                    action: () => window.open('https://spectr-testops.vercel.app', '_blank'),
                },
            ],
        },
        {
            group: lang === 'en' ? 'Engineering' : lang === 'es' ? 'Ingeniería' : 'Engenharia',
            items: [
                {
                    id: 'health-check',
                    icon: 'fas fa-heartbeat',
                    label: lang === 'en' ? 'Health Check — API Mesh Scan' : lang === 'es' ? 'Health Check — Escaneo de API Mesh' : 'Health Check — Varredura da Malha de APIs',
                    hint: '3 endpoints',
                    action: () => {
                        window.dispatchEvent(new CustomEvent('trigger-health-check'));
                        window.dispatchEvent(new CustomEvent('open-telemetry'));
                        toast(lang === 'en' ? 'Health check triggered! 📡' : lang === 'es' ? '¡Health check iniciado! 📡' : 'Health check disparado! 📡');
                    },
                },
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

    /* ── Lista Filtrada ── */
    const flat = useMemo(() => {
        const q = query.toLowerCase().trim();
        if (!q) {
            return commands.flatMap(g => g.items.map(item => ({ ...item, group: g.group })));
        }
        return commands.flatMap(g =>
            g.items
                .filter(item => item.label.toLowerCase().includes(q) || (item.hint && item.hint.toLowerCase().includes(q)))
                .map(item => ({ ...item, group: g.group }))
        );
    }, [query, commands]);

    /* ── Toast Helper ── */
    const [toastMsg, setToastMsg] = useState('');
    const toastTimer = useRef(null);
    const toast = useCallback((msg) => {
        setToastMsg(msg);
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToastMsg(''), 2400);
    }, []);

    /* ── Atalho Global (Ctrl+K / Cmd+K e ESC) ── */
    useEffect(() => {
        const onKey = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setOpen(v => !v);
                setQuery('');
                setSelected(0);
            }
            if (e.key === 'Escape' && open) {
                e.preventDefault();
                setOpen(false);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    /* ── Lock de Scroll e Foco Automático ao Abrir ── */
    useEffect(() => {
        if (open) {
            setSelected(0);
            document.body.style.overflow = 'hidden';
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
            return () => {
                clearTimeout(timer);
                document.body.style.overflow = '';
            };
        }
    }, [open]);

    /* ── Navegação por Teclado e Foco ── */
    const onInputKey = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelected(s => Math.min(s + 1, flat.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelected(s => Math.max(s - 1, 0));
        } else if (e.key === 'Enter' && flat[selected]) {
            e.preventDefault();
            flat[selected].action();
            setOpen(false);
            setQuery('');
        }
    };

    // Auto-scroll do item selecionado na lista
    useEffect(() => {
        if (listRef.current) {
            const activeEl = listRef.current.querySelector(`[data-index="${selected}"]`);
            if (activeEl) {
                activeEl.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [selected]);

    const run = useCallback((item) => {
        item.action();
        setOpen(false);
        setQuery('');
    }, []);

    return (
        <>
            {/* Botão de Dica Flutuante Desktop */}
            <button
                onClick={() => setOpen(true)}
                className="hidden lg:flex fixed bottom-6 right-6 z-[9990] items-center gap-2 bg-darker/90 border border-primary/25 text-primary text-[11px] tracking-widest uppercase px-4 py-2.5 rounded-full backdrop-blur-xl shadow-xl hover:border-accent/50 hover:text-accent transition-all duration-200 group cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-hidden"
                aria-label="Abrir command palette"
                title="Command Palette (Ctrl+K)"
            >
                <i className="fas fa-search text-[10px]" />
                <span>Ctrl</span>
                <span className="border border-primary/30 rounded px-1 text-[10px]">K</span>
            </button>

            {/* Toast Feedback */}
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

            {/* Modal Command Palette */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="cp-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 z-[99990] flex items-start justify-center pt-[12vh] px-4 bg-black/70 backdrop-blur-sm"
                        role="dialog"
                        aria-modal="true"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: -10 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-xl bg-darker/98 border border-white/15 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col"
                        >
                            {/* Input de Busca */}
                            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
                                <i className="fas fa-search text-accent/80 text-sm" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        setSelected(0);
                                    }}
                                    onKeyDown={onInputKey}
                                    placeholder={lang === 'en' ? 'Type a command or search...' : lang === 'es' ? 'Escribe un comando o busca...' : 'Digite um comando ou busque...'}
                                    className="flex-1 bg-transparent text-white placeholder-primary/40 font-sans text-sm outline-hidden"
                                    aria-label="Buscar comandos"
                                />
                                <kbd className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-primary/70 border border-white/10">
                                    ESC
                                </kbd>
                            </div>

                            {/* Lista de Resultados */}
                            <div
                                ref={listRef}
                                className="max-h-[360px] overflow-y-auto p-2 space-y-1 text-sm font-sans"
                            >
                                {flat.length > 0 ? (
                                    flat.map((item, idx) => {
                                        const isSelected = selected === idx;
                                        return (
                                            <button
                                                key={`${item.id}-${idx}`}
                                                data-index={idx}
                                                onClick={() => run(item)}
                                                onMouseEnter={() => setSelected(idx)}
                                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                                                    isSelected
                                                        ? 'bg-accent/15 border border-accent/30 text-white'
                                                        : 'hover:bg-white/5 text-primary border border-transparent'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3 truncate">
                                                    <span className="w-6 flex items-center justify-center text-sm shrink-0">
                                                        {item.icon.startsWith('fa') ? (
                                                            <i className={`${item.icon} ${isSelected ? 'text-accent' : 'text-primary/60'}`} />
                                                        ) : (
                                                            <span>{item.icon}</span>
                                                        )}
                                                    </span>
                                                    <span className="truncate font-medium text-xs sm:text-sm">
                                                        {item.label}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0 ml-2">
                                                    {item.preview && (
                                                        <div className="flex items-center gap-1 mr-1">
                                                            {item.preview.map((c, i) => (
                                                                <span key={i} className="w-2.5 h-2.5 rounded-full border border-black/30" style={{ backgroundColor: c }} />
                                                            ))}
                                                        </div>
                                                    )}
                                                    {item.hint && (
                                                        <span className="text-[10px] text-primary/60 font-mono hidden sm:inline">
                                                            {item.hint}
                                                        </span>
                                                    )}
                                                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 text-primary/60">
                                                        {item.group}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })
                                ) : (
                                    <div className="py-8 text-center text-primary/50 text-xs font-mono">
                                        {lang === 'en' ? 'No commands found.' : lang === 'es' ? 'No se encontraron comandos.' : 'Nenhum comando encontrado.'}
                                    </div>
                                )}
                            </div>

                            {/* Footer do Palette */}
                            <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 bg-white/[0.01] text-[10px] font-mono text-primary/60">
                                <div className="flex items-center gap-2">
                                    <span>↑↓ navegar</span>
                                    <span>•</span>
                                    <span>↵ selecionar</span>
                                </div>
                                <span>{flat.length} {lang === 'en' ? 'options' : 'opções'}</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
