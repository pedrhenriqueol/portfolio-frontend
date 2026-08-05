import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = {
    pt: [
        { id: 'home',         label: 'Home' },
        { id: 'sobre',        label: 'Sobre' },
        { id: 'experiencia',  label: 'Experiência' },
        { id: 'conhecimentos',label: 'Skills' },
        { id: 'projetos',     label: 'Projetos' },
    ],
    en: [
        { id: 'home',         label: 'Home' },
        { id: 'sobre',        label: 'About' },
        { id: 'experiencia',  label: 'Experience' },
        { id: 'conhecimentos',label: 'Skills' },
        { id: 'projetos',     label: 'Projects' },
    ],
    es: [
        { id: 'home',         label: 'Inicio' },
        { id: 'sobre',        label: 'Sobre Mí' },
        { id: 'experiencia',  label: 'Experiencia' },
        { id: 'conhecimentos',label: 'Habilidades' },
        { id: 'projetos',     label: 'Proyectos' },
    ]
};

export default function NavBar() {
    const [lang, setLang]             = useState('pt');
    const [active, setActive]         = useState('home');
    const [scrollPct, setScrollPct]   = useState(0);
    const [visible, setVisible]       = useState(true);
    const [scrolled, setScrolled]     = useState(false); // compact mode
    const [mobileOpen, setMobileOpen] = useState(false);
    const lastY   = useRef(0);
    const hideTimer = useRef(null);

    /* ── Scroll: progress + smart hide/show ── */
    useEffect(() => {
        const SHOW_THRESHOLD = 80;   // px abaixo do topo para começar a esconder
        const JITTER_DELTA   = 6;    // px mínimos de movimento para reagir

        const onScroll = () => {
            const y    = window.scrollY;
            const maxY = document.body.scrollHeight - window.innerHeight;

            // Barra de progresso
            setScrollPct(maxY > 0 ? (y / maxY) * 100 : 0);

            // Modo compacto (fundo mais opaco + sombra maior)
            setScrolled(y > 40);

            const delta = y - lastY.current;

            if (y < SHOW_THRESHOLD) {
                // Sempre visível no topo
                setVisible(true);
            } else if (Math.abs(delta) > JITTER_DELTA) {
                if (delta > 0) {
                    // Scrollando pra baixo — agenda sumir após breve delay (evita flash em cliques de âncora)
                    clearTimeout(hideTimer.current);
                    hideTimer.current = setTimeout(() => setVisible(false), 80);
                } else {
                    // Scrollando pra cima — aparece imediatamente
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

    /* ── Active section: scroll-based (getBoundingClientRect — sem falhas) ── */
    useEffect(() => {
        const detectActive = () => {
            // "Linha de gatilho" = 40% do topo da viewport
            const trigger = window.innerHeight * 0.4;
            let current = NAV_LINKS[lang][0].id;

            for (const { id } of NAV_LINKS[lang]) {
                const el = document.getElementById(id);
                if (!el) continue;
                // Última seção cujo topo já cruzou a linha de gatilho = seção atual
                if (el.getBoundingClientRect().top <= trigger) {
                    current = id;
                }
            }

            setActive(current);
        };

        window.addEventListener('scroll', detectActive, { passive: true });
        detectActive(); // Detecta já na montagem (sem esperar scroll)

        return () => window.removeEventListener('scroll', detectActive);
    }, []);

    const scrollTo = (id) => {
        // Fecha o menu primeiro, depois scrolla após a animação terminar
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
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-0 w-full z-50"
        >
            {/* ── Scroll progress bar ── */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary/10 z-10">
                <motion.div
                    className="h-full bg-gradient-to-r from-secondary to-accent"
                    style={{ width: `${scrollPct}%` }}
                    transition={{ duration: 0.1 }}
                />
            </div>

            {/* ── Navbar body ── */}
            <div
                className="border-b shadow-[0_4px_30px_rgba(0,0,0,0.4)] transition-all duration-300"
                style={{
                    background:  scrolled ? 'rgba(15,17,24,0.92)' : 'rgba(31,40,51,0.65)',
                    backdropFilter: 'blur(20px)',
                    borderColor: scrolled ? 'rgba(102,252,241,0.12)' : 'rgba(255,255,255,0.05)',
                    boxShadow:   scrolled ? '0 4px 40px rgba(0,0,0,0.55)' : '0 4px 30px rgba(0,0,0,0.3)',
                }}
            >
                <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8 transition-all duration-300 ${scrolled ? 'h-14' : 'h-16'}`}>

                    {/* Logo */}
                    <button
                        onClick={() => scrollTo('home')}
                        className="group flex items-center gap-1 shrink-0"
                    >
                        <span className="text-white font-black text-xl tracking-tight group-hover:text-secondary transition-colors duration-300">
                            PEDRO
                        </span>
                        <span className="text-secondary font-black text-xl tracking-tight group-hover:drop-shadow-[0_0_10px_rgba(102,252,241,0.8)] transition-all duration-300">
                            .DEV
                        </span>
                        <span className="ml-1 w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                    </button>

                    {/* ── Desktop nav ── */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_LINKS[lang].map(({ id, label }) => {
                            const isActive = active === id;
                            return (
                                <button
                                    key={id}
                                    onClick={() => scrollTo(id)}
                                    className="relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg group"
                                    style={{ color: isActive ? '#66FCF1' : '#9CA3AF' }}
                                >
                                    {/* Hover bg */}
                                    <span className="absolute inset-0 rounded-lg bg-secondary/0 group-hover:bg-secondary/8 transition-colors duration-200" />

                                    {label}

                                    {/* Active underline indicator */}
                                    {isActive && (
                                        <motion.span
                                            layoutId="nav-indicator"
                                            className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-secondary to-accent"
                                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* ── CTA + Hamburger ── */}
                    <div className="flex items-center gap-3 shrink-0">
                        {/* Language Selector */}
                        <div className="hidden sm:flex bg-secondary/10 rounded-lg p-1 border border-secondary/20">
                            {['pt', 'en', 'es'].map((l) => (
                                <button
                                    key={l}
                                    onClick={() => setLang(l)}
                                    className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all uppercase ${
                                        lang === l
                                            ? 'bg-secondary text-darker shadow-[0_0_10px_rgba(102,252,241,0.5)]'
                                            : 'text-gray-400 hover:text-secondary'
                                    }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>

                        {/* CTA button */}
                        <motion.button
                            onClick={() => scrollTo('contato')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            className="hidden sm:flex items-center gap-2 bg-secondary/10 border border-secondary/40 text-secondary text-sm font-semibold px-4 py-2 rounded-lg hover:bg-secondary hover:text-darker hover:shadow-[0_0_20px_rgba(102,252,241,0.4)] transition-all duration-300"
                        >
                            <i className="fas fa-paper-plane text-xs" />
                            {lang === 'pt' ? 'Contato' : lang === 'en' ? 'Contact' : 'Contacto'}
                        </motion.button>

                        {/* Mobile hamburger */}
                        <button
                            className="md:hidden flex flex-col gap-1.5 p-2 group"
                            onClick={() => setMobileOpen((v) => !v)}
                            aria-label="Menu"
                        >
                            <motion.span
                                animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                                className="block w-6 h-0.5 bg-gray-300 group-hover:bg-secondary transition-colors"
                            />
                            <motion.span
                                animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                                className="block w-6 h-0.5 bg-gray-300 group-hover:bg-secondary transition-colors"
                            />
                            <motion.span
                                animate={mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                                className="block w-6 h-0.5 bg-gray-300 group-hover:bg-secondary transition-colors"
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Mobile menu ── */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{   opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="md:hidden overflow-hidden bg-darker/95 backdrop-blur-xl border-b border-white/5"
                    >
                        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
                            {/* Mobile Language Selector */}
                            <div className="flex gap-2 mb-4 px-2">
                                {['pt', 'en', 'es'].map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => setLang(l)}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all uppercase border ${
                                            lang === l
                                                ? 'bg-secondary text-darker border-secondary shadow-sm'
                                                : 'bg-white/5 text-gray-400 border-white/10 hover:border-secondary/50 hover:text-white'
                                        }`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>

                            {[...NAV_LINKS[lang], { id: 'contato', label: lang === 'pt' ? 'Contato' : lang === 'en' ? 'Contact' : 'Contacto' }].map(({ id, label }, i) => (
                                <motion.button
                                    key={id}
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1,  x: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                    onClick={() => scrollTo(id)}
                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
                                        active === id
                                            ? 'bg-secondary/10 text-secondary border border-secondary/20'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    {active === id && <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />}
                                    {label}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
