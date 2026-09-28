import React, { useRef, lazy, Suspense, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import MagneticButton from './MagneticButton';
import { useLanguage } from '../../context/LanguageContext';

const InteractiveTerminal = lazy(() => import('./InteractiveTerminal'));

/**
 * HeroAboutScrollytelling:
 * Coreografia de animação cinemática por rolagem com Palco Fixo (Pinned Stage).
 * 
 * FASE 1 (0.00 - 0.25): Hero em destaque total (Texto de impacto + Cockpit Terminal + Dock de redes).
 * FASE 2 (0.25 - 0.50): Transição fluida de saída (Hero foge com blur progressivo; Terminal desliza com scale-down).
 * FASE 3 (0.45 - 0.85): Entrada sincronizada de "O QUE EU FAÇO" (Tipografia brutalista + 2 cards técnicos de alta densidade).
 * FASE 4 (0.85 - 1.00): Liberação natural do palco para a sequência da página (Zero scroll-hijacking / 100% window scroll).
 */
export default function HeroAboutScrollytelling() {
    const { t, lang } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);

    // Mapeamento do scroll nativo da janela ao longo da pista de 220vh
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    // ── FASE 2: Transição Fluida de Saída do Hero (Compositor GPU-Only) ──
    const heroTextOpacity = useTransform(scrollYProgress, [0.20, 0.38], [1, 0]);
    const heroTextX = useTransform(scrollYProgress, [0.20, 0.38], [0, -100]);
    const heroTextFilter = useTransform(scrollYProgress, [0.20, 0.38], ['blur(0px)', 'blur(8px)']);

    // O Terminal translada suavemente e reduz de escala para abrir espaço cênico
    const terminalScale = useTransform(scrollYProgress, [0.25, 0.45], [1, 0.90]);
    const terminalX = useTransform(scrollYProgress, [0.25, 0.45], ['0%', '-25%']);
    const terminalOpacity = useTransform(scrollYProgress, [0.25, 0.42, 0.52], [1, 0.6, 0]);

    // ── FASE 3: Entrada Sincronizada do Bloco "O QUE EU FAÇO" (Compositor GPU-Only) ──
    const aboutTitleOpacity = useTransform(scrollYProgress, [0.42, 0.55], [0, 1]);
    const aboutTitleX = useTransform(scrollYProgress, [0.42, 0.55], [-60, 0]);
    const aboutTitleFilter = useTransform(scrollYProgress, [0.42, 0.55], ['blur(8px)', 'blur(0px)']);

    const aboutCardsOpacity = useTransform(scrollYProgress, [0.45, 0.58], [0, 1]);
    const aboutCardsX = useTransform(scrollYProgress, [0.45, 0.58], [80, 0]);
    const aboutCardsFilter = useTransform(scrollYProgress, [0.45, 0.58], ['blur(8px)', 'blur(0px)']);

    // Pointer Events dinâmicos para proteção rigorosa contra cliques fantasmas
    const heroPointerEvents = useTransform(scrollYProgress, (v) => (v < 0.40 ? 'auto' : 'none'));
    const aboutPointerEvents = useTransform(scrollYProgress, (v) => (v >= 0.45 && v <= 0.95 ? 'auto' : 'none'));

    // Manipulador de spotlight nativo nos cartões de engenharia (Zero useState / Zero re-render overhead)
    const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    }, []);

    return (
        <section
            id="home"
            ref={containerRef}
            className="relative w-full h-[220vh] bg-[#05070a]"
        >
            {/* ── Palco Visual Travado na Viewport (Sem Capturar a Roda do Mouse) ── */}
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center pointer-events-none">
                
                {/* ── Dock Lateral Esquerda (Atalhos Sociais Fixos) ── */}
                <div className="hidden xl:flex fixed left-8 bottom-12 flex-col items-center gap-5 z-20 pointer-events-auto">
                    {[
                        {
                            href: 'https://github.com/pedrhenriqueol',
                            label: 'GitHub',
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                    <path d="M9 18c-4.51 2-5-2-7-2" />
                                </svg>
                            ),
                        },
                        {
                            href: 'https://www.linkedin.com/in/pedro-henrique-b0a015391/',
                            label: 'LinkedIn',
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                    <rect x="2" y="9" width="4" height="12" />
                                    <circle cx="4" cy="4" r="2" />
                                </svg>
                            ),
                        },
                        {
                            href: 'mailto:pedro.henrique.contato@gmail.com',
                            label: 'E-mail',
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="20" height="16" x="2" y="4" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                            ),
                        },
                    ].map((item, idx) => (
                        <MagneticButton key={idx} strength={0.3}>
                            <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={item.label}
                                className="w-10 h-10 rounded-full border border-white/10 bg-[#0c0e14]/60 hover:bg-white/10 backdrop-blur-sm flex items-center justify-center text-neutral-400 hover:text-white transition-all shadow-sm"
                            >
                                {item.icon}
                            </a>
                        </MagneticButton>
                    ))}
                    <div className="w-[1px] h-12 bg-white/15" />
                </div>

                <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full relative h-full flex items-center">
                    
                    {/* ═════════════════════════════════════════════════════════════════ */}
                    {/* FASE 1: HERO EM DESTAQUE (0.00 a 0.25 do scroll)                  */}
                    {/* ═════════════════════════════════════════════════════════════════ */}
                    <div className="absolute inset-x-6 sm:inset-x-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        
                        {/* Coluna Esquerda: Apresentação */}
                        <motion.div
                            style={{
                                x: heroTextX,
                                opacity: heroTextOpacity,
                                filter: heroTextFilter,
                                pointerEvents: heroPointerEvents,
                            }}
                            className="lg:col-span-5 text-center lg:text-left space-y-5 will-change-[transform,opacity]"
                        >
                            {/* Badge superior: "Olá! Eu sou" em verde esmeralda com fundo translúcido sutil */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                                <span className="font-serif italic text-emerald-400 text-sm font-medium tracking-wide">
                                    {lang === 'en' ? "Hello! I'm" : lang === 'es' ? '¡Hola! Soy' : 'Olá! Eu sou'}
                                </span>
                            </div>

                            {/* Título de impacto: "PEDRO HENRIQUE" em tipografia bold de alto contraste */}
                            <div>
                                <h1 className="text-4xl sm:text-6xl md:text-7xl font-sans font-black text-white tracking-tight leading-none uppercase drop-shadow-sm">
                                    Pedro<br />Henrique
                                </h1>
                            </div>

                            {/* Subtítulo técnico */}
                            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto lg:mx-0">
                                {lang === 'en'
                                    ? 'Specialist in modern web architecture, enterprise legacy modernization (Delphi/Laravel), and high-reliability systems.'
                                    : lang === 'es'
                                    ? 'Especialista en arquitectura web moderna, modernización de sistemas heredados (Delphi/Laravel) y alta disponibilidad.'
                                    : 'Especialista em arquitetura web moderna, modernização de sistemas corporativos (Delphi/Laravel) e alta disponibilidade.'}
                            </p>

                            {/* Botões de Ação */}
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                                <MagneticButton strength={0.35}>
                                    <a
                                        href="#projetos"
                                        className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-mono text-xs font-semibold tracking-tight transition-all active:scale-[0.98] shadow-sm inline-flex items-center justify-center cursor-pointer pointer-events-auto"
                                    >
                                        {t('hero.verProjetos') || 'Ver Projetos'}
                                    </a>
                                </MagneticButton>
                                <MagneticButton strength={0.3}>
                                    <a
                                        href="/curriculo_pedro_henrique.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download="curriculo_pedro_henrique.pdf"
                                        className="px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-200 font-mono text-xs font-medium transition-all inline-flex items-center justify-center gap-2 active:scale-[0.98] pointer-events-auto"
                                    >
                                        <i className="fas fa-file-pdf text-neutral-400" />
                                        {t('hero.downloadCV') || 'Baixar CV'}
                                    </a>
                                </MagneticButton>
                            </div>
                        </motion.div>

                        {/* Coluna Direita: Interactive Terminal (Cockpit de Engenharia) */}
                        <motion.div
                            style={{
                                x: terminalX,
                                scale: terminalScale,
                                opacity: terminalOpacity,
                            }}
                            className="hidden sm:flex lg:col-span-7 justify-center pointer-events-auto will-change-[transform,opacity]"
                        >
                            <div className="w-full max-w-xl">
                                <Suspense fallback={<div className="h-64 rounded-xl bg-white/[0.02] border border-white/10 animate-pulse" />}>
                                    <InteractiveTerminal />
                                </Suspense>
                            </div>
                        </motion.div>
                    </div>

                    {/* ═════════════════════════════════════════════════════════════════ */}
                    {/* FASE 3: ENTRADA DO BLOCO "O QUE EU FAÇO" (0.45 a 0.85 do scroll)  */}
                    {/* ═════════════════════════════════════════════════════════════════ */}
                    <div className="absolute inset-x-6 sm:inset-x-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pointer-events-none">
                        
                        {/* Coluna Esquerda: Tipografia Brutalista & Posicionamento */}
                        <motion.div
                            style={{
                                x: aboutTitleX,
                                opacity: aboutTitleOpacity,
                                filter: aboutTitleFilter,
                                pointerEvents: aboutPointerEvents,
                            }}
                            className="lg:col-span-5 space-y-6 text-left will-change-[transform,opacity]"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span className="font-mono text-[11px] tracking-[0.22em] text-emerald-300 uppercase">
                                    {lang === 'en' ? '// 01. CAPABILITIES & SCOPE' : lang === 'es' ? '// 01. CAPACIDADES Y ALCANCE' : '// 01. ESCOPO & CAPACIDADES'}
                                </span>
                            </div>

                            <div className="space-y-1">
                                <h2 className="text-5xl sm:text-7xl font-sans font-black tracking-tight leading-none uppercase text-white drop-shadow-sm">
                                    {lang === 'en' ? 'WHAT' : lang === 'es' ? 'LO QUE' : 'O QUE'}
                                </h2>
                                <h2 className="text-5xl sm:text-7xl font-sans font-black tracking-tight leading-none uppercase text-[#10b981] drop-shadow-[0_2px_20px_rgba(16,185,129,0.30)]">
                                    {lang === 'en' ? 'I DO' : lang === 'es' ? 'HAGO' : 'EU FAÇO'}
                                </h2>
                            </div>

                            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed max-w-md">
                                {lang === 'en'
                                    ? 'Software Engineer focused on mission-critical enterprise systems, legacy modernization, high-scale APIs, and rigorous software quality.'
                                    : lang === 'es'
                                    ? 'Ingeniero de Software enfocado en sistemas corporativos de misión crítica, modernización legacy, APIs de alta escala y rigurosa calidad de software.'
                                    : 'Engenheiro de Software com foco em sistemas corporativos de missão crítica, modernização de legados, APIs de alta escala e qualidade rigorosa de software.'}
                            </p>

                            <div className="pt-2">
                                <MagneticButton strength={0.35}>
                                    <a
                                        href="#sobre"
                                        className="inline-flex items-center gap-3 font-mono text-sm tracking-tight text-white hover:text-emerald-300 transition-colors group cursor-pointer pointer-events-auto"
                                    >
                                        <span>
                                            {lang === 'en'
                                                ? 'My career & experience ↓'
                                                : lang === 'es'
                                                ? 'Mi carrera y experiencia ↓'
                                                : 'Minha carreira & experiência ↓'}
                                        </span>
                                        <span className="w-8 h-8 rounded-full border border-white/20 group-hover:border-emerald-400/50 bg-white/5 flex items-center justify-center transition-all group-hover:translate-y-0.5">
                                            ↓
                                        </span>
                                    </a>
                                </MagneticButton>
                            </div>
                        </motion.div>

                        {/* Coluna Direita: 2 Cards Técnicos de Engenharia com Efeito Spotlight */}
                        <motion.div
                            style={{
                                x: aboutCardsX,
                                opacity: aboutCardsOpacity,
                                filter: aboutCardsFilter,
                                pointerEvents: aboutPointerEvents,
                            }}
                            className="lg:col-span-7 space-y-4 will-change-[transform,opacity]"
                        >
                            {/* Card 1: FULL STACK & ARQUITETURA CORPORATIVA */}
                            <div 
                                onMouseMove={handleCardMouseMove}
                                style={{ transform: 'translateZ(0)' }}
                                className="relative p-6 sm:p-7 rounded-2xl border border-white/[0.08] bg-[#0c1017]/85 backdrop-blur-sm shadow-xl space-y-3 transition-all hover:border-emerald-500/40 group overflow-hidden pointer-events-auto"
                            >
                                <div
                                    className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"
                                    style={{
                                        background: 'radial-gradient(500px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(16, 185, 129, 0.08), transparent 60%)',
                                    }}
                                />
                                <div className="relative z-20 flex items-center justify-between">
                                    <h3 className="font-mono text-sm font-bold tracking-wider uppercase text-white flex items-center gap-2.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                                        FULL STACK &amp; ARQUITETURA CORPORATIVA
                                    </h3>
                                    <span className="text-[10px] font-mono text-neutral-400 border border-white/10 px-2.5 py-0.5 rounded-full bg-white/[0.02]">
                                        CORE
                                    </span>
                                </div>
                                <p className="relative z-20 text-neutral-300 text-xs sm:text-sm leading-relaxed">
                                    {lang === 'en'
                                        ? 'End-to-end web products: modern SPAs, decoupled REST APIs, legacy monolith transitions, and clean domain architectures.'
                                        : lang === 'es'
                                        ? 'Productos web de punta a punta: SPAs modernas, APIs REST desacopladas, transición de monolitos y arquitectura limpia.'
                                        : 'Produtos web de ponta a ponta: SPAs modernas, APIs REST desacopladas, modernização de legados corporativos e regras de negócio sólidas.'}
                                </p>
                                <div className="relative z-20 flex flex-wrap gap-1.5 pt-2">
                                    {['Delphi/UniGui', 'PHP/Laravel', 'React', 'TypeScript', 'SQL Server', 'Docker'].map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-white/[0.04] border border-white/[0.08] text-neutral-300 group-hover:border-white/20 transition-colors"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Card 2: PRODUÇÃO, BANCO DE DADOS & QA */}
                            <div 
                                onMouseMove={handleCardMouseMove}
                                style={{ transform: 'translateZ(0)' }}
                                className="relative p-6 sm:p-7 rounded-2xl border border-dashed border-emerald-500/30 bg-[#0c1017]/75 backdrop-blur-sm shadow-xl space-y-3 transition-all hover:border-emerald-500/60 group overflow-hidden pointer-events-auto"
                            >
                                <div
                                    className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"
                                    style={{
                                        background: 'radial-gradient(500px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(6, 182, 212, 0.08), transparent 60%)',
                                    }}
                                />
                                <div className="relative z-20 flex items-center justify-between">
                                    <h3 className="font-mono text-sm font-bold tracking-wider uppercase text-emerald-300 flex items-center gap-2.5">
                                        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                                        PRODUÇÃO, BANCO DE DADOS &amp; QA
                                    </h3>
                                    <span className="text-[10px] font-mono text-emerald-400/90 border border-emerald-500/25 px-2.5 py-0.5 rounded-full bg-emerald-500/[0.04]">
                                        RELIABILITY
                                    </span>
                                </div>
                                <p className="relative z-20 text-neutral-300 text-xs sm:text-sm leading-relaxed">
                                    {lang === 'en'
                                        ? 'Post-deploy reliability: sub-100ms LCP, SQL query execution tuning, automated API testing suites, and continuous delivery.'
                                        : lang === 'es'
                                        ? 'Resiliencia en producción: LCP sub-100ms, optimización de queries SQL, pruebas automatizadas de API y entrega continua.'
                                        : 'Foco na resiliência em produção: LCP sub-100ms, query tuning no SQL Server (Index Seek), esteiras de testes automatizados e observabilidade.'}
                                </p>
                                <div className="relative z-20 flex flex-wrap gap-1.5 pt-2">
                                    {['Otimização de Queries', 'Testes Automatizados', 'CI/CD', 'Observabilidade'].map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-emerald-500/[0.06] border border-emerald-500/25 text-emerald-300 group-hover:border-emerald-500/40 transition-colors"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                        </motion.div>
                    </div>

                </div>

                {/* ── FASE 1: Indicador de Rolagem Sutil no Rodapé do Palco ── */}
                <div className="absolute bottom-6 inset-x-0 flex justify-center pointer-events-none">
                    <motion.div
                        style={{ opacity: heroTextOpacity }}
                        className="flex flex-col items-center gap-1.5 text-neutral-500 font-mono text-[10px] uppercase tracking-widest"
                    >
                        <span>Scroll</span>
                        <div className="w-4 h-7 rounded-full border border-neutral-600 flex items-start justify-center p-1">
                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                                className="w-1 h-1.5 rounded-full bg-emerald-400"
                            />
                        </div>
                    </motion.div>
                </div>

            </div>
        </section>
    );
}
