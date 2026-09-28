import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import LanguageDropdown from './NavBar/LanguageDropdown';
import ThemeDropdown from './NavBar/ThemeDropdown';
import MobileMenu from './NavBar/MobileMenu';

export interface NavbarProps {
    /** Controla se a página já foi desbloqueada pelo preloader */
    isLoaded?: boolean;
}

/**
 * Navbar — Barra Superior Minimalista & Fluida
 *
 * Características Técnicas & Estéticas:
 * 1. Vidro Translúcido: bg-[#05070a]/80 backdrop-blur-md border-b border-white/[0.06]
 * 2. Monograma: PH. minimalista com ponto estilizado linkado ao topo (#home)
 * 3. Links Ancorados: SOBRE, EXPERIÊNCIA, PROJETOS, CONTATO em maiúsculas refinadas
 * 4. Status Indicator: Indicador online pulsante em tempo real + seletores de idioma/tema
 * 5. Low-End Guard: Otimizado para GPU via will-change, zero layout shifts, scroll throttled por RAF
 */
export default function Navbar({ isLoaded = true }: NavbarProps) {
    const { t } = useLanguage();
    const [active, setActive]         = useState<string>('home');
    const [visible, setVisible]       = useState<boolean>(true);
    const [scrolled, setScrolled]     = useState<boolean>(false);
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);

    const lastY       = useRef<number>(0);
    const hideTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
    const progressRef = useRef<HTMLDivElement | null>(null);

    // Links de navegação principais (padronizados em maiúsculas)
    const navLinks = useMemo(() => [
        { id: 'sobre',         label: (t('nav.sobre') || 'Sobre').toUpperCase() },
        { id: 'experiencia',   label: (t('nav.experiencia') || 'Experiência').toUpperCase() },
        { id: 'projetos',      label: (t('nav.projetos') || 'Projetos').toUpperCase() },
        { id: 'contato',       label: (t('nav.contato') || 'Contato').toUpperCase() },
    ], [t]);

    // Detecção de seção ativa via IntersectionObserver e Scroll
    useEffect(() => {
        const observers: IntersectionObserver[] = [];
        const ids = ['experiencia', 'conhecimentos', 'projetos', 'contato'];

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

        // Detecção refinada para o Pinned Stage (Hero e Sobre Mim)
        const checkHeroAndSobre = () => {
            const y = window.scrollY;
            if (y < window.innerHeight * 0.4) {
                setActive('home');
                return;
            }

            const stageEl = document.getElementById('pinned-stage');
            if (stageEl) {
                const rect = stageEl.getBoundingClientRect();
                // Durante a fase ativa de Sobre Mim no palco fixo
                if (rect.top <= 100 && rect.bottom >= window.innerHeight * 0.25) {
                    if (rect.top <= -window.innerHeight * 0.3) {
                        setActive('sobre');
                    }
                }
            }
        };

        window.addEventListener('scroll', checkHeroAndSobre, { passive: true });
        checkHeroAndSobre();

        return () => {
            observers.forEach((obs) => obs.disconnect());
            window.removeEventListener('scroll', checkHeroAndSobre);
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

    // Rolagem inteligente para seções ou para o palco fixo
    const scrollTo = useCallback((id: string) => {
        setMobileOpen(false);
        if (id === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (id === 'sobre') {
            const stage = document.getElementById('pinned-stage');
            if (stage) {
                const stageTop = stage.getBoundingClientRect().top + window.scrollY;
                // Posiciona no ponto onde Sobre Mim está totalmente visível (~65% da pista de 220vh)
                const targetY = stageTop + window.innerHeight * 1.35;
                window.scrollTo({ top: targetY, behavior: 'smooth' });
                return;
            }
        }

        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

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
            {/* Linha ultra-sutil de progresso de scroll no topo */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] z-10 bg-white/[0.04]">
                <div
                    ref={progressRef}
                    className="h-full bg-accent/80 will-change-[width]"
                    style={{ width: '0%' }}
                />
            </div>

            <div className={`transition-all duration-300 ${scrolled ? 'bg-[#05070a]/90' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
                    
                    {/* Logotipo / Monograma (Esquerda) */}
                    <a
                        href="#home"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollTo('home');
                        }}
                        className="group flex items-center select-none cursor-pointer focus-visible:outline-none"
                        aria-label="Pedro Henrique - Início"
                    >
                        <span className="font-mono text-[17px] font-bold tracking-tight text-white group-hover:text-accent transition-colors">
                            PH<span className="text-emerald-400 font-bold ml-0.5">.</span>
                        </span>
                    </a>

                    {/* Links de Navegação (Centro / Direita) */}
                    <nav className="hidden md:flex items-center gap-8 lg:gap-10" aria-label="Navegação principal">
                        {navLinks.map(({ id, label }) => {
                            const isActive = active === id;
                            return (
                                <button
                                    key={id}
                                    onClick={() => scrollTo(id)}
                                    className={`relative text-[11px] tracking-[0.22em] uppercase font-mono font-medium transition-colors duration-200 py-1 cursor-pointer focus-visible:outline-none ${
                                        isActive ? 'text-white' : 'text-neutral-400 hover:text-white'
                                    }`}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    {label}
                                    <span
                                        className={`absolute left-0 -bottom-1 h-[1.5px] bg-white transition-all duration-300 ease-out ${
                                            isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-60'
                                        }`}
                                    />
                                </button>
                            );
                        })}
                    </nav>

                    {/* Ações à Direita: Status Online, Idioma, Tema e Mobile Toggle */}
                    <div className="flex items-center gap-3 shrink-0">
                        {/* Indicador de Status Ativo (● online) */}
                        <div className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] tracking-wider uppercase select-none">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                            </span>
                            <span>online</span>
                        </div>

                        {/* Dropdowns de Tema e Idioma */}
                        <ThemeDropdown />
                        <LanguageDropdown />

                        {/* Hamburger Button (Mobile) */}
                        <button
                            className="md:hidden flex flex-col gap-[5px] p-2 group cursor-pointer focus-visible:outline-none"
                            onClick={() => setMobileOpen(v => !v)}
                            aria-label="Menu"
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
