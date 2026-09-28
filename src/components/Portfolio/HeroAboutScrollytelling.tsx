import React, { useRef, lazy, Suspense, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import MagneticButton from './MagneticButton';
import { useLanguage } from '../../context/LanguageContext';

const InteractiveTerminal = lazy(() => import('./InteractiveTerminal'));

/**
 * HeroAboutScrollytelling:
 * Coreografia de Scrollytelling Pinned Stage inspirada na referência técnica de alto padrão:
 * 
 * 1. Dobra 1 (Hero State - 0.00 a 0.35):
 *    - Esquerda: Identificação, tipografia display monumental, badge de status, biografia e CTAs magnéticos.
 *    - Direita: Cockpit de engenharia (InteractiveTerminal).
 * 
 * 2. Transição Imersiva (Cross-fade Coreografado - 0.25 a 0.60):
 *    - Textos do Hero deslizam para a esquerda com fade out e blur progressivo.
 *    - O elemento pivô (Terminal) translada suavemente para a direita e reduz levemente a escala (profundidade de câmera 3D).
 *    - A seção "O QUE EU FAÇO" surge com tipografia brutalista à esquerda e cards técnicos à direita.
 * 
 * 3. Dobra 2 ("O QUE EU FAÇO" - 0.55 a 0.88):
 *    - Tipografia de impacto: "O QUE" em branco puro e "EU FAÇO" em verde esmeralda.
 *    - Dois cards de capacidade técnica com spotlight nativo via CSS Custom Properties (--mouse-x, --mouse-y).
 *    - Âncora de navegação fluida "Minha carreira & experiência ➔" apontando para a Bento Grid completa em #sobre.
 * 
 * 4. Desbloqueio e Saída Natural (0.88 a 1.00):
 *    - O palco sticky desliza suavemente junto com a rolagem nativa da janela.
 *    - Zero Scroll Hijacking: 100% dirigido por window.scrollY, sem overflow-y interno capturando a roda do mouse.
 */
export default function HeroAboutScrollytelling() {
    const { t, lang } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);

    // Mapeamento do scroll nativo da janela ao longo da pista de 220vh
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    // ── Interpolações GPU-only (Compositor Thread): Hero ──
    const heroTextX = useTransform(scrollYProgress, [0.1, 0.42], [0, -120]);
    const heroTextOpacity = useTransform(scrollYProgress, [0.1, 0.38], [1, 0]);
    const heroTextFilter = useTransform(scrollYProgress, [0.1, 0.38], ['blur(0px)', 'blur(8px)']);

    // Elemento Pivô (Terminal): translada em X e assume papel de background técnico
    const pivotX = useTransform(scrollYProgress, [0.1, 0.55], [0, 120]);
    const pivotScale = useTransform(scrollYProgress, [0.1, 0.55], [1, 0.88]);
    const pivotOpacity = useTransform(scrollYProgress, [0.38, 0.65], [1, 0.7]);

    // ── Interpolações GPU-only (Compositor Thread): "O QUE EU FAÇO" ──
    const aboutTitleX = useTransform(scrollYProgress, [0.35, 0.65], [-90, 0]);
    const aboutTitleOpacity = useTransform(scrollYProgress, [0.35, 0.62], [0, 1]);
    const aboutTitleFilter = useTransform(scrollYProgress, [0.35, 0.62], ['blur(8px)', 'blur(0px)']);

    const aboutCardsX = useTransform(scrollYProgress, [0.4, 0.7], [90, 0]);
    const aboutCardsOpacity = useTransform(scrollYProgress, [0.4, 0.68], [0, 1]);
    const aboutCardsFilter = useTransform(scrollYProgress, [0.4, 0.68], ['blur(8px)', 'blur(0px)']);

    // Visibilidade estrita dos ponteiros para blindar contra cliques fantasmas
    const heroPointerEvents = useTransform(scrollYProgress, (v) => (v < 0.4 ? 'auto' : 'none'));
    const aboutPointerEvents = useTransform(scrollYProgress, (v) => (v > 0.4 ? 'auto' : 'none'));

    // Manipulador de spotlight nativo nos cards (Zero useState / Zero re-render overhead)
    const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    }, []);

    return (
        <section
            id="home"
            ref={containerRef}
            className="relative w-full h-[220vh] bg-transparent"
        >
            {/* ── Palco Fixo Pinned na Viewport (100% Window Scroll / Sem Trava de Rolagem) ── */}
            <div 
                className="sticky top-0 h-screen w-full flex items-center justify-center pointer-events-none"
                style={{ overflow: 'clip' }}
            >
                
                {/* ── Dock Lateral Esquerda (Redes Sociais Fixas) ── */}
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
                    {/* FASE 1: HERO STATE (Textos Iniciais + Cockpit Terminal)            */}
                    {/* ═════════════════════════════════════════════════════════════════ */}
                    <div className="absolute inset-x-6 sm:inset-x-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        
                        {/* Coluna de Texto Hero (Esquerda) */}
                        <motion.div
                            style={{
                                x: heroTextX,
                                opacity: heroTextOpacity,
                                filter: heroTextFilter,
                                pointerEvents: heroPointerEvents,
                            }}
                            className="lg:col-span-5 text-center lg:text-left space-y-5"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="font-mono text-[11px] tracking-[0.22em] text-neutral-300 uppercase">
                                    {lang === 'en'
                                        ? '// 00. FULLSTACK SOFTWARE ENGINEER'
                                        : lang === 'es'
                                        ? '// 00. INGENIERO DE SOFTWARE FULLSTACK'
                                        : '// 00. ENGENHARIA DE SOFTWARE & QA'}
                                </span>
                            </div>

                            <div>
                                <span className="text-emerald-400 text-lg sm:text-xl font-serif italic block mb-1">
                                    {lang === 'en' ? "Hello! I'm" : lang === 'es' ? '¡Hola! Soy' : 'Olá! Eu sou'}
                                </span>
                                <h1 className="text-4xl sm:text-6xl md:text-7xl font-sans font-black text-white tracking-tight leading-none uppercase">
                                    Pedro<br />Henrique
                                </h1>
                            </div>

                            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto lg:mx-0">
                                {lang === 'en'
                                    ? 'Specialist in modern web architecture, enterprise legacy modernization (Delphi/Laravel), and high-reliability systems.'
                                    : lang === 'es'
                                    ? 'Especialista en arquitectura web moderna, modernización de sistemas heredados (Delphi/Laravel) y alta disponibilidad.'
                                    : 'Especialista em arquitetura web moderna, modernização de sistemas corporativos (Delphi/Laravel) e alta disponibilidade.'}
                            </p>

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
                                        {t('hero.downloadCV') || 'Download CV'}
                                    </a>
                                </MagneticButton>
                            </div>
                        </motion.div>

                        {/* Coluna Direita: Interactive Terminal (Elemento Pivô de Transição) */}
                        <motion.div
                            style={{
                                x: pivotX,
                                scale: pivotScale,
                                opacity: pivotOpacity,
                            }}
                            className="hidden sm:flex lg:col-span-7 justify-center pointer-events-auto"
                        >
                            <div className="w-full max-w-xl">
                                <Suspense fallback={<div className="h-64 rounded-xl bg-white/[0.02] border border-white/10 animate-pulse" />}>
                                    <InteractiveTerminal />
                                </Suspense>
                            </div>
                        </motion.div>
                    </div>

                    {/* ═════════════════════════════════════════════════════════════════ */}
                    {/* FASE 2: "O QUE EU FAÇO" STATE (Exatamente como na Referência)     */}
                    {/* ═════════════════════════════════════════════════════════════════ */}
                    <div className="absolute inset-x-6 sm:inset-x-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pointer-events-none">
                        
                        {/* Coluna Esquerda: Tipografia Monumental "O QUE EU FAÇO" */}
                        <motion.div
                            style={{
                                x: aboutTitleX,
                                opacity: aboutTitleOpacity,
                                filter: aboutTitleFilter,
                                pointerEvents: aboutPointerEvents,
                            }}
                            className="lg:col-span-5 space-y-6 text-left"
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
                                <h2 className="text-5xl sm:text-7xl font-sans font-black tracking-tight leading-none uppercase text-emerald-400 drop-shadow-[0_2px_18px_rgba(52,211,153,0.25)]">
                                    {lang === 'en' ? 'I DO' : lang === 'es' ? 'HAGO' : 'EU FAÇO'}
                                </h2>
                            </div>

                            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed max-w-md">
                                {lang === 'en'
                                    ? 'Engineering solutions from end-to-end: system architecture, API performance tuning, database optimization, and modern reactive frontends.'
                                    : lang === 'es'
                                    ? 'Ingeniería de software de punta a punta: arquitectura de sistemas, optimización de APIs, ajuste de bases de datos e interfaces reactivas.'
                                    : 'Engenharia de software de ponta a ponta: arquitetura de sistemas, tuning de APIs, modelagem de bancos relacionais e interfaces reativas modernas.'}
                            </p>

                            <div className="pt-2">
                                <MagneticButton strength={0.35}>
                                    <a
                                        href="#sobre"
                                        className="inline-flex items-center gap-3 font-mono text-sm tracking-tight text-white hover:text-emerald-300 transition-colors group cursor-pointer pointer-events-auto"
                                    >
                                        <span>
                                            {lang === 'en'
                                                ? 'My career & experience'
                                                : lang === 'es'
                                                ? 'Mi carrera y experiencia'
                                                : 'Minha carreira & experiência'}
                                        </span>
                                        <span className="w-8 h-8 rounded-full border border-white/20 group-hover:border-emerald-400/50 bg-white/5 flex items-center justify-center transition-all group-hover:translate-x-1">
                                            ➔
                                        </span>
                                    </a>
                                </MagneticButton>
                            </div>
                        </motion.div>

                        {/* Coluna Direita: Cards de Engenharia com Spotlight e Alta Densidade */}
                        <motion.div
                            style={{
                                x: aboutCardsX,
                                opacity: aboutCardsOpacity,
                                filter: aboutCardsFilter,
                                pointerEvents: aboutPointerEvents,
                            }}
                            className="lg:col-span-7 space-y-4"
                        >
                            {/* Card 1: Full Stack & Arquitetura */}
                            <div 
                                onMouseMove={handleCardMouseMove}
                                style={{ transform: 'translateZ(0)' }}
                                className="relative p-6 sm:p-7 rounded-2xl border border-white/[0.08] bg-[#0c1017]/85 backdrop-blur-sm shadow-xl space-y-3 transition-all hover:border-emerald-500/40 group overflow-hidden pointer-events-auto"
                            >
                                <div
                                    className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"
                                    style={{
                                        background: 'radial-gradient(500px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(52, 211, 153, 0.08), transparent 60%)',
                                    }}
                                />
                                <div className="relative z-20 flex items-center justify-between">
                                    <h3 className="font-mono text-sm font-bold tracking-wider uppercase text-white flex items-center gap-2.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                                        FULL STACK &amp; ARQUITETURA
                                    </h3>
                                    <span className="text-[10px] font-mono text-neutral-400 border border-white/10 px-2.5 py-0.5 rounded-full bg-white/[0.02]">
                                        CORE
                                    </span>
                                </div>
                                <p className="relative z-20 text-neutral-300 text-xs sm:text-sm leading-relaxed">
                                    {lang === 'en'
                                        ? 'End-to-end web products: responsive interfaces, RESTful APIs, third-party integrations, and robust business logic.'
                                        : lang === 'es'
                                        ? 'Productos web de punta a punta: interfaces reactivas, APIs RESTful, integraciones y lógica de negocio sólida.'
                                        : 'Produtos web de ponta a ponta: interfaces reativas, APIs RESTful, integrações e regras de negócio sólidas com arquitetura limpa.'}
                                </p>
                                <div className="relative z-20 flex flex-wrap gap-1.5 pt-2">
                                    {['TypeScript', 'React.js', 'PHP/Laravel', 'Delphi/UniGui', 'SQL Server', 'Docker'].map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-white/[0.04] border border-white/[0.08] text-neutral-300 group-hover:border-white/20 transition-colors"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Card 2: Produção & Performance */}
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
                                        PRODUÇÃO &amp; PERFORMANCE
                                    </h3>
                                    <span className="text-[10px] font-mono text-emerald-400/90 border border-emerald-500/25 px-2.5 py-0.5 rounded-full bg-emerald-500/[0.04]">
                                        QUALITY
                                    </span>
                                </div>
                                <p className="relative z-20 text-neutral-300 text-xs sm:text-sm leading-relaxed">
                                    {lang === 'en'
                                        ? 'Focus on post-deploy reliability: sub-100ms LCP, database query optimization, automated test pipelines, and zero layout shift.'
                                        : lang === 'es'
                                        ? 'Enfoque en resiliencia post-despliegue: LCP sub-100ms, optimización de queries, pruebas de API y cero saltos de diseño.'
                                        : 'Foco na resiliência em produção: LCP sub-100ms, eliminação de Table Scans via Index Seek, testes automatizados e zero layout shift.'}
                                </p>
                                <div className="relative z-20 flex flex-wrap gap-1.5 pt-2">
                                    {['Core Web Vitals', 'Index Seek Tuning', 'Postman QA', 'CI/CD Pipelines'].map((tag) => (
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

                {/* ── Indicador de Rolagem Sutil no Rodapé do Palco ── */}
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
