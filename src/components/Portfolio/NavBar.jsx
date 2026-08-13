import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

export default function NavBar() {
    const { lang, setLang, t } = useLanguage();
    const [active, setActive]         = useState('home');
    const [scrollPct, setScrollPct]   = useState(0);
    const [visible, setVisible]       = useState(true);
    const [scrolled, setScrolled]     = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const lastY      = useRef(0);
    const hideTimer  = useRef(null);
    const dropdownRef = useRef(null);

    const navLinks = [
        { id: 'home',          label: t('nav.home') },
        { id: 'sobre',         label: t('nav.sobre') },
        { id: 'experiencia',   label: t('nav.experiencia') },
        { id: 'conhecimentos', label: t('nav.conhecimentos') },
        { id: 'projetos',      label: t('nav.projetos') },
    ];

    const flags = { pt: '🇧🇷 PT', en: '🇺🇸 EN', es: '🇪🇸 ES' };

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target))
                setDropdownOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        const SHOW_THRESHOLD = 80;
        const JITTER_DELTA   = 6;
        const onScroll = () => {
            const y    = window.scrollY;
            const maxY = document.body.scrollHeight - window.innerHeight;
            setScrollPct(maxY > 0 ? (y / maxY) * 100 : 0);
            setScrolled(y > 40);
            const delta = y - lastY.current;
            if (y < SHOW_THRESHOLD) {
                setVisible(true);
            } else if (Math.abs(delta) > JITTER_DELTA) {
                if (delta > 0) {
                    clearTimeout(hideTimer.current);
                    hideTimer.current = setTimeout(() => setVisible(false), 80);
                    setDropdownOpen(false);
                } else {
                    clearTimeout(hideTimer.current);
                    setVisible(true);
                }
            }
            lastY.current = y;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            clearTimeout(hideTimer.current);
        };
    }, []);

    useEffect(() => {
        const detectActive = () => {
            const trigger = window.innerHeight * 0.4;
            let current = navLinks[0].id;
            for (const { id } of navLinks) {
                const el = document.getElementById(id);
                if (!el) continue;
                if (el.getBoundingClientRect().top <= trigger) current = id;
            }
            setActive(current);
        };
        window.addEventListener('scroll', detectActive, { passive: true });
        detectActive();
        return () => window.removeEventListener('scroll', detectActive);
    }, [navLinks]);

    const scrollTo = (id) => {
        setMobileOpen(false);
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 320);
    };

    return (
        <motion.nav
            initial={{ y: 0 }}
            animate={{ y: visible ? 0 : -100 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-0 w-full z-50"
        >
            {/* Scroll progress bar */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] z-10 bg-white/5">
                <motion.div
                    className="h-full bg-accent"
                    style={{ width: `${scrollPct}%` }}
                    transition={{ duration: 0.1 }}
                />
            </div>

            {/* Main header */}
            <div
                className="border-b transition-all duration-500"
                style={{
                    background:     scrolled ? 'rgba(10,10,11,0.97)' : 'rgba(10,10,11,0.72)',
                    backdropFilter: 'blur(16px)',
                    borderColor:    'rgba(255,255,255,0.06)',
                }}
            >
                <div className={`max-w-6xl mx-auto px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-14' : 'h-[4.5rem]'}`}>

                    {/* Logo */}
                    <button
                        onClick={() => scrollTo('home')}
                        className="group flex items-center gap-0.5 shrink-0"
                        aria-label="Ir para o inicio"
                    >
                        <span className="font-bold text-base tracking-[0.08em] text-secondary group-hover:text-white transition-colors duration-300 uppercase">
                            Pedro Henrique
                        </span>
                        <span className="text-accent font-bold text-lg leading-none">.</span>
                        <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-accent opacity-75 animate-pulse shrink-0" />
                    </button>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-9" aria-label="Navegacao principal">
                        {navLinks.map(({ id, label }) => {
                            const isActive = active === id;
                            return (
                                <button
                                    key={id}
                                    onClick={() => scrollTo(id)}
                                    className="relative group text-[11px] tracking-[0.22em] uppercase font-medium transition-colors duration-300 py-1"
                                    style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-primary)' }}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    {label}
                                    <span
                                        className="absolute left-0 -bottom-0.5 h-px bg-accent transition-all duration-500 ease-in-out"
                                        style={{ width: isActive ? '100%' : '0%' }}
                                    />
                                    <span className="absolute left-0 -bottom-0.5 h-px bg-accent/35 w-0 group-hover:w-full transition-all ease-in-out" style={{ transitionDuration: '400ms' }} />
                                </button>
                            );
                        })}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center gap-3 shrink-0">

                        {/* Language Dropdown */}
                        <div className="relative hidden sm:block" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-1.5 border border-white/10 hover:border-accent/35 text-primary hover:text-accent text-[10px] tracking-widest uppercase px-3 py-2 transition-all duration-200"
                                style={{ borderRadius: '2px' }}
                                aria-label="Selecionar idioma"
                            >
                                <span>{flags[lang]}</span>
                                <i className={`fas fa-chevron-down text-[9px] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {dropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-1.5 w-28 bg-[#0f0f0f] border border-white/8 shadow-[0_16px_40px_rgba(0,0,0,0.7)] overflow-hidden"
                                        style={{ borderRadius: '2px' }}
                                    >
                                        {['pt', 'en', 'es'].map((l) => (
                                            <button
                                                key={l}
                                                onClick={() => { setLang(l); setDropdownOpen(false); }}
                                                className={`w-full text-left px-4 py-2.5 text-[10px] tracking-widest uppercase font-medium transition-colors duration-150 ${
                                                    lang === l
                                                        ? 'text-accent bg-accent/8'
                                                        : 'text-primary hover:text-secondary hover:bg-white/4'
                                                }`}
                                            >
                                                {flags[l]}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* CTA — editorial flat */}
                        <button
                            onClick={() => scrollTo('contato')}
                            className="hidden sm:inline-flex items-center uppercase text-[10px] tracking-[0.22em] font-semibold px-5 py-2.5 text-darker bg-accent hover:bg-accent-hover transition-colors duration-300"
                            style={{ borderRadius: '2px' }}
                        >
                            {t('nav.contato')}
                        </button>

                        {/* Hamburger */}
                        <button
                            className="md:hidden flex flex-col gap-[5px] p-2 group"
                            onClick={() => setMobileOpen((v) => !v)}
                            aria-label="Menu"
                        >
                            <motion.span
                                animate={mobileOpen ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }}
                                className="block w-5 h-px bg-primary group-hover:bg-accent transition-colors duration-200"
                            />
                            <motion.span
                                animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                                className="block w-5 h-px bg-primary group-hover:bg-accent transition-colors duration-200"
                            />
                            <motion.span
                                animate={mobileOpen ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }}
                                className="block w-5 h-px bg-primary group-hover:bg-accent transition-colors duration-200"
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.28, ease: 'easeInOut' }}
                        className="md:hidden overflow-hidden border-b border-white/5"
                        style={{ background: 'rgba(10,10,11,0.99)', backdropFilter: 'blur(20px)' }}
                    >
                        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col">

                            <div className="flex gap-2 mb-6">
                                {['pt', 'en', 'es'].map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => { setLang(l); setMobileOpen(false); }}
                                        className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all duration-200 ${
                                            lang === l
                                                ? 'border-accent text-accent bg-accent/8'
                                                : 'border-white/10 text-primary hover:border-white/20 hover:text-secondary'
                                        }`}
                                        style={{ borderRadius: '2px' }}
                                    >
                                        {flags[l]}
                                    </button>
                                ))}
                            </div>

                            {[...navLinks, { id: 'contato', label: t('nav.contato') }].map(({ id, label }, i) => (
                                <motion.button
                                    key={id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.045 }}
                                    onClick={() => scrollTo(id)}
                                    className={`w-full text-left py-4 text-[11px] tracking-[0.22em] uppercase font-medium border-b transition-colors duration-200 flex items-center justify-between ${
                                        active === id
                                            ? 'text-accent border-white/8'
                                            : 'text-primary border-white/5 hover:text-secondary'
                                    }`}
                                >
                                    {label}
                                    {active === id && (
                                        <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
