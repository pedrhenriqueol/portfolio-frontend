import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import NavLogo from './NavBar/NavLogo';
import LanguageDropdown from './NavBar/LanguageDropdown';
import ThemeDropdown from './NavBar/ThemeDropdown';
import MobileMenu from './NavBar/MobileMenu';

export interface HeaderProps {
    /** Controla se a página já foi desbloqueada pelo preloader */
    isLoaded?: boolean;
}

/**
 * Header — Barra Superior Coreografada (Revelação em Pinça / Pincer Reveal)
 *
 * Características Cinemáticas e Técnicas:
 * 1. Zero Delay: Inicia no mesmo frame em que isLoaded torna-se true.
 * 2. Mola Calibrada: stiffness 260, damping 28, mass 0.5 (descida suave de y: -12px a 0).
 * 3. Anti-Flicker: Fundo e borda pré-renderizados (bg-[#090b10]/80 backdrop-blur-md border-b border-white/5)
 *    animando estritamente opacidade e translação no eixo Y.
 * 4. will-change: transform, opacity para composição em GPU sem travamentos.
 */
export default function Header({ isLoaded = true }: HeaderProps) {
    const { t } = useLanguage();
    const [active, setActive]         = useState<string>('home');
    const [visible, setVisible]       = useState<boolean>(true);
    const [scrolled, setScrolled]     = useState<boolean>(false);
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);

    const lastY       = useRef<number>(0);
    const hideTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
    const progressRef = useRef<HTMLDivElement | null>(null);

    const navLinks = useMemo(() => [
        { id: 'home',          label: t('nav.home') },
        { id: 'sobre',         label: t('nav.sobre') },
        { id: 'experiencia',   label: t('nav.experiencia') },
        { id: 'conhecimentos', label: t('nav.conhecimentos') },
        { id: 'projetos',      label: t('nav.projetos') },
    ], [t]);

    // Detecção de seção ativa via IntersectionObserver
    useEffect(() => {
        const observers: IntersectionObserver[] = [];
        const ids = ['home', 'sobre', 'experiencia', 'conhecimentos', 'projetos'];

        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;

            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActive(id);
                    }
                },
                { threshold: 0.25, rootMargin: '-10% 0px -50% 0px' }
            );

            obs.observe(el);
            observers.push(obs);
        });

        return () => observers.forEach((obs) => obs.disconnect());
    }, []);

    // Controle de barra de progresso e ocultamento automático no scroll
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

                const isScrolledNow = y > 40;
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

    const scrollTo = useCallback((id: string) => {
        setMobileOpen(false);
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
    }, []);

    return (
        <motion.header
            initial={{ y: -12, opacity: 0 }}
            animate={isLoaded ? (visible ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }) : { y: -12, opacity: 0 }}
            transition={{
                type: 'spring',
                stiffness: 260,
                damping: 28,
                mass: 0.5,
            }}
            style={{ willChange: 'transform, opacity' }}
            className="fixed top-0 left-0 right-0 w-full z-50 transform-gpu bg-[#090b10]/80 backdrop-blur-md border-b border-white/5"
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
                className={`transition-all duration-300 ${
                    scrolled ? 'bg-darker/90' : 'bg-transparent'
                }`}
            >
                <div className={`max-w-6xl mx-auto px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-14' : 'h-[4.5rem]'}`}>
                    {/* Logo */}
                    <NavLogo onClick={() => scrollTo('home')} />

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-9" aria-label="Navegação principal">
                        {navLinks.map(({ id, label }) => {
                            const isActive = active === id;
                            return (
                                <button
                                    key={id}
                                    onClick={() => scrollTo(id)}
                                    className="relative group text-[11px] tracking-[0.22em] uppercase font-medium transition-colors duration-300 py-1 cursor-pointer"
                                    style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-primary)' }}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    {label}
                                    <span
                                        className="absolute left-0 -bottom-0.5 h-px bg-accent transition-all duration-500 ease-in-out"
                                        style={{ width: isActive ? '100%' : '0%' }}
                                    />
                                    <span className="absolute left-0 -bottom-0.5 h-px bg-accent/35 w-0 group-hover:w-full transition-all duration-400 ease-in-out" />
                                </button>
                            );
                        })}
                    </nav>

                    {/* Right Side: Theme, Language, Contact CTA & Mobile Toggle */}
                    <div className="flex items-center gap-2.5 shrink-0">
                        <ThemeDropdown />
                        <LanguageDropdown />

                        {/* CTA button */}
                        <button
                            onClick={() => scrollTo('contato')}
                            className="hidden sm:inline-flex items-center uppercase text-[10px] tracking-[0.22em] font-semibold px-5 py-2.5 text-darker bg-accent hover:bg-accent-hover transition-colors duration-300 shadow-sm cursor-pointer rounded-xs"
                        >
                            {t('nav.contato')}
                        </button>

                        {/* Hamburger Button */}
                        <button
                            className="md:hidden flex flex-col gap-[5px] p-2 group cursor-pointer"
                            onClick={() => setMobileOpen(v => !v)}
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
