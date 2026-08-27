import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useFont } from '../../context/FontContext';

export default function NavBar() {
    const { lang, setLang, t } = useLanguage();
    const { palette, paletteData, palettes, setPalette } = useTheme();
    const { font, fontData, fonts, setFont } = useFont();
    const [active, setActive]                 = useState('home');
    const [visible, setVisible]               = useState(true);
    const [scrolled, setScrolled]             = useState(false);
    const [mobileOpen, setMobileOpen]         = useState(false);
    const [dropdownOpen, setDropdownOpen]     = useState(false);
    const [paletteDropdown, setPaletteDropdown] = useState(false);
    const [fontDropdown, setFontDropdown]     = useState(false);
    const lastY           = useRef(0);
    const hideTimer       = useRef(null);
    const dropdownRef     = useRef(null);
    const paletteRef      = useRef(null);
    const fontRef         = useRef(null);
    const progressRef     = useRef(null);
    const activeRef       = useRef('home');

    const navLinks = useMemo(() => [
        { id: 'home',          label: t('nav.home') },
        { id: 'sobre',         label: t('nav.sobre') },
        { id: 'experiencia',   label: t('nav.experiencia') },
        { id: 'conhecimentos', label: t('nav.conhecimentos') },
        { id: 'projetos',      label: t('nav.projetos') },
    ], [t]);

    const flags = { pt: '🇧🇷 PT', en: '🇺🇸 EN', es: '🇪🇸 ES' };

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target))
                setDropdownOpen(false);
            if (paletteRef.current && !paletteRef.current.contains(e.target))
                setPaletteDropdown(false);
            if (fontRef.current && !fontRef.current.contains(e.target))
                setFontDropdown(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Detecção de seção ativa via IntersectionObserver (processado off-main-thread pelo browser)
    useEffect(() => {
        const observers = [];
        const ids = ['home', 'sobre', 'experiencia', 'conhecimentos', 'projetos'];

        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;

            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        activeRef.current = id;
                        setActive(id);
                    }
                },
                { threshold: 0.25, rootMargin: '-10% 0px -50% 0px' }
            );

            obs.observe(el);
            observers.push(obs);
        });

        return () => observers.forEach((obs) => obs.disconnect());
    }, [navLinks]);

    useEffect(() => {
        const SHOW_THRESHOLD = 80;
        const JITTER_DELTA   = 8;
        let scrollRaf = null;

        const onScroll = () => {
            if (scrollRaf) return;

            scrollRaf = requestAnimationFrame(() => {
                scrollRaf = null;
                const y    = window.scrollY;
                const maxY = document.documentElement.scrollHeight - window.innerHeight;
                const pct  = maxY > 0 ? (y / maxY) * 100 : 0;

                if (progressRef.current) {
                    progressRef.current.style.width = `${pct}%`;
                }

                const isScrolledNow = y > 40;
                setScrolled(prev => prev !== isScrolledNow ? isScrolledNow : prev);

                const delta = y - lastY.current;
                if (y < SHOW_THRESHOLD) {
                    setVisible(true);
                } else if (Math.abs(delta) > JITTER_DELTA) {
                    if (delta > 0) {
                        clearTimeout(hideTimer.current);
                        hideTimer.current = setTimeout(() => setVisible(false), 80);
                        setDropdownOpen(false);
                        setPaletteDropdown(false);
                    } else {
                        clearTimeout(hideTimer.current);
                        setVisible(true);
                    }
                }
                lastY.current = y;
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        return () => {
            window.removeEventListener('scroll', onScroll);
            if (scrollRaf) cancelAnimationFrame(scrollRaf);
            clearTimeout(hideTimer.current);
        };
    }, []);

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
            className="fixed top-0 w-full z-50 transform-gpu"
        >
            {/* Scroll progress bar */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] z-10 bg-white/5">
                <div
                    ref={progressRef}
                    className="h-full bg-accent will-change-[width]"
                    style={{ width: '0%' }}
                />
            </div>

            <div
                className={`border-b transition-all duration-500 backdrop-blur-md ${
                    scrolled ? 'bg-darker/95 border-primary/20' : 'bg-darker/70 border-white/5'
                }`}
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
                    <div className="flex items-center gap-2.5 shrink-0">

                        {/* Palette Selector Dropdown */}
                        <div className="relative hidden sm:block" ref={paletteRef}>
                            <button
                                onClick={() => { setPaletteDropdown(!paletteDropdown); setFontDropdown(false); setDropdownOpen(false); }}
                                className="flex items-center gap-2 border border-white/10 hover:border-accent/40 text-primary hover:text-accent text-[10px] tracking-widest uppercase px-3 py-2 transition-all duration-200"
                                style={{ borderRadius: '2px' }}
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
                                <i className={`fas fa-palette text-[10px] ml-0.5 text-accent`} />
                                <i className={`fas fa-chevron-down text-[8px] transition-transform duration-200 ${paletteDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {paletteDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-1.5 w-48 bg-darker border border-primary/20 shadow-[0_16px_40px_rgba(0,0,0,0.85)] p-1.5 z-50 backdrop-blur-xl"
                                        style={{ borderRadius: '4px' }}
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
                                                    onClick={() => { setPalette(id); setPaletteDropdown(false); }}
                                                    className={`w-full text-left px-2.5 py-2 text-[10px] tracking-wider uppercase font-medium transition-all duration-150 flex items-center justify-between rounded-xs ${
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

                        {/* Font Selector Dropdown (Temporário para testes de tipografia) */}
                        <div className="relative hidden sm:block" ref={fontRef}>
                            <button
                                onClick={() => { setFontDropdown(!fontDropdown); setPaletteDropdown(false); setDropdownOpen(false); }}
                                className="flex items-center gap-2 border border-white/10 hover:border-accent/40 text-primary hover:text-accent text-[10px] tracking-widest uppercase px-3 py-2 transition-all duration-200"
                                style={{ borderRadius: '2px' }}
                                aria-label="Selecionar tipografia"
                                title="Tipografia (Temporário para desenvolvimento)"
                            >
                                <span className="text-accent font-bold font-serif text-xs">Aa</span>
                                <span className="truncate max-w-[90px] text-[10px] font-sans">{fontData?.name}</span>
                                <i className={`fas fa-chevron-down text-[8px] transition-transform duration-200 ${fontDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {fontDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-1.5 w-64 bg-darker border border-primary/20 shadow-[0_16px_40px_rgba(0,0,0,0.85)] p-2 z-50 backdrop-blur-xl"
                                        style={{ borderRadius: '4px' }}
                                    >
                                        <div className="text-[9px] uppercase tracking-widest text-primary/60 px-2 py-1.5 font-semibold border-b border-white/5 mb-1.5 flex items-center justify-between">
                                            <span>Tipografia (Teste)</span>
                                            <span className="text-[8px] text-accent/80 font-mono">5 Estilos</span>
                                        </div>
                                        <div className="space-y-1">
                                            {Object.entries(fonts).map(([id, f]) => {
                                                const isCurrent = font === id;
                                                return (
                                                    <button
                                                        key={id}
                                                        onClick={() => { setFont(id); setFontDropdown(false); }}
                                                        className={`w-full text-left p-2 rounded-xs border transition-all duration-150 flex flex-col gap-0.5 ${
                                                            isCurrent
                                                                ? 'bg-accent/10 border-accent/30 text-white'
                                                                : 'bg-black/20 border-transparent text-primary hover:text-white hover:bg-white/5 hover:border-white/10'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between w-full">
                                                            <span className="text-[11px] font-bold text-secondary" style={{ fontFamily: f.serif }}>
                                                                {f.name}
                                                            </span>
                                                            <span className="text-[8px] uppercase tracking-widest text-accent/90 border border-accent/20 px-1 rounded">
                                                                {f.tag}
                                                            </span>
                                                        </div>
                                                        <div className="text-[9px] text-gray-400 font-sans truncate">
                                                            {f.previewSerif} + {f.previewSans}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

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
                                        className="absolute right-0 mt-1.5 w-28 bg-darker border border-primary/20 shadow-[0_16px_40px_rgba(0,0,0,0.7)] overflow-hidden z-50 backdrop-blur-xl"
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
                            className="hidden sm:inline-flex items-center uppercase text-[10px] tracking-[0.22em] font-semibold px-5 py-2.5 text-darker bg-accent hover:bg-accent-hover transition-colors duration-300 shadow-sm"
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
                        className="md:hidden overflow-hidden border-b border-primary/20 bg-darker/98 backdrop-blur-2xl"
                    >
                        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col">

                            {/* Mobile Language Selector */}
                            <div className="flex gap-2 mb-4">
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

                            {/* Mobile Palette Selector */}
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
                                                onClick={() => { setPalette(id); setMobileOpen(false); }}
                                                className={`p-2 text-[9px] tracking-wider uppercase font-medium transition-all duration-150 flex items-center justify-between rounded-xs border ${
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
                            {/* Mobile Font Selector (Temporário para testes) */}
                            <div className="mb-6 p-3 bg-white/[0.02] border border-white/5 rounded-xs">
                                <div className="text-[9px] uppercase tracking-widest text-primary/60 font-semibold mb-2.5 flex items-center justify-between">
                                    <span>Tipografia (Teste)</span>
                                    <i className="fas fa-font text-accent" />
                                </div>
                                <div className="space-y-1.5">
                                    {Object.entries(fonts).map(([id, f]) => {
                                        const isCurrent = font === id;
                                        return (
                                            <button
                                                key={id}
                                                onClick={() => { setFont(id); setMobileOpen(false); }}
                                                className={`w-full p-2 text-left rounded-xs border transition-all duration-150 flex items-center justify-between ${
                                                    isCurrent
                                                        ? 'text-accent bg-accent/10 border-accent/30'
                                                        : 'text-primary bg-black/30 border-white/5 hover:border-white/20'
                                                }`}
                                            >
                                                <div>
                                                    <span className="text-[10px] font-bold block text-secondary" style={{ fontFamily: f.serif }}>{f.name}</span>
                                                    <span className="text-[8px] text-gray-400 font-sans">{f.previewSerif} + {f.previewSans}</span>
                                                </div>
                                                <span className="text-[8px] uppercase tracking-widest text-accent/80 border border-accent/20 px-1 rounded">
                                                    {f.tag}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
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
