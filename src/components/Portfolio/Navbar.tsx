import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import MobileMenu from './NavBar/MobileMenu';

export interface NavbarProps {
    /** Controla se a página já foi desbloqueada pelo preloader */
    isLoaded?: boolean;
}

/**
 * Navbar — Barra Superior Minimalista & Fluida
 *
 * Inspirada na arquitetura visual de referência:
 * 1. Logotipo / Monograma (Esquerda): PH. minimalista e nítido
 * 2. Centro Limpo: sem e-mail ou elementos obstrutivos
 * 3. Navegação à Direita: SOBRE, EXPERIÊNCIA, PROJETOS, CONTATO em caixa alta
 * 4. Pílula de Idiomas (PT | EN | ES): cápsula com indicador ativo em pílula sólida
 * 5. Seletor de Paleta / Tema: botão circular minimalista com menu contextual
 * 6. Responsividade: menu deslizante para dispositivos móveis
 */
export default function Navbar({ isLoaded = true }: NavbarProps) {
    const { lang, setLang, t } = useLanguage();
    const { palette, palettes, setPalette } = useTheme();

    const [active, setActive]                 = useState<string>('home');
    const [visible, setVisible]               = useState<boolean>(true);
    const [scrolled, setScrolled]             = useState<boolean>(false);
    const [mobileOpen, setMobileOpen]         = useState<boolean>(false);
    const [paletteMenuOpen, setPaletteMenuOpen] = useState<boolean>(false);

    const lastY          = useRef<number>(0);
    const hideTimer      = useRef<ReturnType<typeof setTimeout> | null>(null);
    const progressRef    = useRef<HTMLDivElement | null>(null);
    const paletteMenuRef = useRef<HTMLDivElement | null>(null);

    // Links de navegação principais (padronizados em maiúsculas)
    const navLinks = useMemo(() => [
        { id: 'sobre',         label: (t('nav.sobre') || 'Sobre').toUpperCase() },
        { id: 'experiencia',   label: (t('nav.experiencia') || 'Experiência').toUpperCase() },
        { id: 'projetos',      label: (t('nav.projetos') || 'Projetos').toUpperCase() },
        { id: 'contato',       label: (t('nav.contato') || 'Contato').toUpperCase() },
    ], [t]);

    // Fechar dropdown de paleta ao clicar fora
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (paletteMenuRef.current && !paletteMenuRef.current.contains(e.target as Node)) {
                setPaletteMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Detecção de seção ativa via IntersectionObserver nativo
    useEffect(() => {
        const observers: IntersectionObserver[] = [];
        const ids = ['home', 'sobre', 'experiencia', 'projetos', 'contato'];

        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;

            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActive(id);
                    }
                },
                { threshold: 0.25, rootMargin: '-15% 0px -40% 0px' }
            );

            obs.observe(el);
            observers.push(obs);
        });

        return () => {
            observers.forEach((obs) => obs.disconnect());
        };
    }, []);

    // Barra de progresso e comportamento de ocultar/revelar no scroll
    useEffect(() => {
        const SHOW_THRESHOLD = 80;
        const JITTER_DELTA   = 8;
        let scrollRaf: number | null = null;

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

                const isScrolledNow = y > 30;
                setScrolled(prev => (prev !== isScrolledNow ? isScrolledNow : prev));

                const delta = y - lastY.current;
                if (y < SHOW_THRESHOLD) {
                    setVisible(true);
                } else if (Math.abs(delta) > JITTER_DELTA) {
                    if (delta > 0) {
                        if (hideTimer.current) clearTimeout(hideTimer.current);
                        hideTimer.current = setTimeout(() => setVisible(false), 80);
                    } else {
                        if (hideTimer.current) clearTimeout(hideTimer.current);
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
            if (hideTimer.current) clearTimeout(hideTimer.current);
        };
    }, []);

    // Rolagem suave nativa para as seções
    const scrollTo = useCallback((id: string) => {
        setMobileOpen(false);
        if (id === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    const languages: Array<{ code: 'pt' | 'en' | 'es'; label: string }> = [
        { code: 'pt', label: 'PT' },
        { code: 'en', label: 'EN' },
        { code: 'es', label: 'ES' },
    ];

    return (
        <motion.header
            initial={{ y: -12, opacity: 0 }}
            animate={isLoaded ? (visible ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }) : { y: -12, opacity: 0 }}
            transition={{
                type: 'spring',
                stiffness: 260,
                damping: 28,
                mass: 0.5,
            }}
            style={{ willChange: 'transform, opacity' }}
            className="fixed top-0 left-0 right-0 w-full z-50 transform-gpu bg-[#05070a]/80 backdrop-blur-md border-b border-white/[0.06] transition-colors duration-300"
        >
            {/* Linha sutil de progresso de rolagem no topo */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] z-10 bg-white/[0.03]">
                <div
                    ref={progressRef}
                    className="h-full bg-accent/80 will-change-[width]"
                    style={{ width: '0%' }}
                />
            </div>

            <div className={`transition-all duration-300 ${scrolled ? 'bg-[#05070a]/90' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
                    
                    {/* Logotipo / Monograma (Esquerda): PH. */}
                    <a
                        href="#home"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollTo('home');
                        }}
                        className="group flex items-center select-none cursor-pointer focus-visible:outline-none"
                        aria-label="Pedro Henrique - Início"
                    >
                        <span className="font-sans text-[19px] font-extrabold tracking-tight text-white group-hover:text-accent transition-colors">
                            PH<span className="text-emerald-400 font-extrabold ml-0.5">.</span>
                        </span>
                    </a>

                    {/* Grupo à Direita: Links + Pílula de Idiomas + Seletor de Paleta */}
                    <div className="flex items-center gap-6 lg:gap-8">

                        {/* Links de Navegação (Desktop) */}
                        <nav className="hidden md:flex items-center gap-6 lg:gap-7" aria-label="Navegação principal">
                            {navLinks.map(({ id, label }) => {
                                const isActive = active === id;
                                return (
                                    <button
                                        key={id}
                                        onClick={() => scrollTo(id)}
                                        className={`relative text-[11px] tracking-[0.2em] uppercase font-sans font-semibold transition-colors duration-200 py-1 cursor-pointer focus-visible:outline-none ${
                                            isActive ? 'text-white' : 'text-neutral-400 hover:text-white'
                                        }`}
                                        aria-current={isActive ? 'page' : undefined}
                                    >
                                        {label}
                                        {isActive && (
                                            <motion.span
                                                layoutId="active-nav-dot"
                                                className="absolute left-1/2 -bottom-0.5 -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                                                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Pílula Seletora de Idiomas (PT | EN | ES) */}
                        <div className="inline-flex items-center bg-white/[0.04] border border-white/10 rounded-full p-0.5 gap-0.5 select-none">
                            {languages.map((item) => {
                                const isSelected = lang === item.code;
                                return (
                                    <button
                                        key={item.code}
                                        type="button"
                                        onClick={() => setLang(item.code)}
                                        className={`relative px-2.5 py-0.5 text-[10px] font-bold tracking-wider rounded-full transition-all duration-200 cursor-pointer ${
                                            isSelected
                                                ? 'text-black'
                                                : 'text-neutral-400 hover:text-white'
                                        }`}
                                    >
                                        {isSelected && (
                                            <motion.span
                                                layoutId="active-lang-pill"
                                                className="absolute inset-0 bg-white rounded-full"
                                                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                                            />
                                        )}
                                        <span className="relative z-10">{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Seletor de Paleta / Tema Minimalista */}
                        <div className="relative" ref={paletteMenuRef}>
                            <button
                                type="button"
                                onClick={() => setPaletteMenuOpen(v => !v)}
                                className={`w-8 h-8 rounded-full border transition-all duration-200 flex items-center justify-center cursor-pointer focus-visible:outline-none ${
                                    paletteMenuOpen
                                        ? 'border-white/40 bg-white/10 text-white'
                                        : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 text-neutral-300 hover:text-white'
                                }`}
                                aria-label="Alterar paleta de cores"
                                title="Paleta de cores"
                            >
                                <i className="fas fa-palette text-xs" />
                            </button>

                            {/* Dropdown com a lista de paletas do design system */}
                            <AnimatePresence>
                                {paletteMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -6, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -6, scale: 0.96 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-2 w-48 bg-[#090b10] border border-white/15 rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.85)] p-1.5 z-50 backdrop-blur-md"
                                    >
                                        <div className="text-[9px] uppercase tracking-widest text-neutral-400 px-2.5 py-1.5 font-semibold border-b border-white/5 mb-1 flex items-center justify-between">
                                            <span>Paletas</span>
                                            <i className="fas fa-swatchbook text-accent/80 text-[10px]" />
                                        </div>

                                        {Object.entries(palettes).map(([id, p]) => {
                                            const isCurrent = palette === id;
                                            const name = t(p.nameKey) !== p.nameKey ? t(p.nameKey) : p.defaultName;
                                            return (
                                                <button
                                                    key={id}
                                                    type="button"
                                                    onClick={() => {
                                                        setPalette(id);
                                                        setPaletteMenuOpen(false);
                                                    }}
                                                    className={`w-full text-left px-2.5 py-2 text-[10px] tracking-wider uppercase font-medium transition-all duration-150 flex items-center justify-between rounded-lg cursor-pointer ${
                                                        isCurrent
                                                            ? 'text-white bg-white/10 border border-white/20'
                                                            : 'text-neutral-300 hover:text-white hover:bg-white/5 border border-transparent'
                                                    }`}
                                                >
                                                    <span className="truncate max-w-[105px]">{name}</span>
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        {p.preview.map((c: string, idx: number) => (
                                                            <span
                                                                key={idx}
                                                                className="w-2 h-2 rounded-full border border-black/40 shadow-xs"
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

                        {/* Hamburger Button (Mobile) */}
                        <button
                            className="md:hidden flex flex-col gap-[5px] p-2 group cursor-pointer focus-visible:outline-none"
                            onClick={() => setMobileOpen(v => !v)}
                            aria-label="Abrir menu de navegação"
                        >
                            <motion.span
                                animate={mobileOpen ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }}
                                className="block w-5 h-px bg-white group-hover:bg-accent transition-colors duration-200"
                            />
                            <motion.span
                                animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                                className="block w-5 h-px bg-white group-hover:bg-accent transition-colors duration-200"
                            />
                            <motion.span
                                animate={mobileOpen ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }}
                                className="block w-5 h-px bg-white group-hover:bg-accent transition-colors duration-200"
                            />
                        </button>

                    </div>

                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <MobileMenu
                isOpen={mobileOpen}
                navLinks={navLinks}
                active={active}
                scrollTo={scrollTo}
                onClose={() => setMobileOpen(false)}
                t={t}
            />
        </motion.header>
    );
}
