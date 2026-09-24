import React, { useRef, lazy, Suspense, useState, useEffect, useCallback, memo } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import MagneticButton from '../Portfolio/MagneticButton';
import { useLanguage } from '../../context/LanguageContext';

const InteractiveTerminal = lazy(() => import('../Portfolio/InteractiveTerminal'));

/* ══════════════════════════════════════════════════════════════════
 * HeroAboutScrolly — Cena de Scrollytelling Pinned (Hero ➔ Sobre Mim)
 * ══════════════════════════════════════════════════════════════════
 *
 * Arquitetura de Pinned Container inspirada no padrão MoncyDev:
 * - Contêiner pai de 260vh atua como linha do tempo física.
 * - Filho sticky (h-screen) ancora o palco visual na viewport.
 * - `scrollYProgress` normalizado (0→1) interpola todas as camadas.
 *
 * Performance (Low-End Guard):
 * - Anima exclusivamente `transform` (x, y, scale) e `opacity`.
 * - Zero reflows: nenhuma propriedade de layout (top, left, width, height, margin).
 * - `will-change: transform, opacity` aplicado cirurgicamente apenas nos nós animados.
 * - `transform: translateZ(0)` força composição em camada GPU.
 * ══════════════════════════════════════════════════════════════════ */

/* ── Sub-componente: Indicador de Scroll ── */
const ScrollIndicator = memo(function ScrollIndicator({
    opacity,
    lang,
}: {
    opacity: MotionValue<number>;
    lang: string;
}) {
    const label =
        lang === 'en'
            ? 'Scroll to explore'
            : lang === 'es'
            ? 'Desplaza para explorar'
            : 'Role para explorar';

    return (
        <motion.div
            style={{ opacity }}
            className="absolute bottom-8 left-1/2 flex flex-col items-center gap-2 pointer-events-none z-30"
        >
            <span className="font-mono text-[11px] tracking-[0.2em] text-neutral-500 uppercase">
                {label}
            </span>
            <motion.svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="text-neutral-500"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
                <path
                    d="M10 4v12m0 0l-4-4m4 4l4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </motion.svg>
        </motion.div>
    );
});

/* ── Sub-componente: Bloco textual do Hero (camada esquerda) ── */
const HeroTextBlock = memo(function HeroTextBlock({
    opacity,
    x,
    scale,
    lang,
    t,
}: {
    opacity: MotionValue<number>;
    x: MotionValue<number>;
    scale: MotionValue<number>;
    lang: string;
    t: (key: string) => any;
}) {
    return (
        <motion.div
            style={{
                opacity,
                x,
                scale,
                willChange: 'transform, opacity',
                transform: 'translateZ(0)',
            }}
            className="lg:col-span-5 text-center lg:text-left space-y-6 min-h-[420px] sm:min-h-[460px] flex flex-col justify-center"
        >
            <span className="font-mono text-[11px] tracking-[0.25em] text-neutral-400 uppercase block">
                {lang === 'en'
                    ? '// 00. SOFTWARE ENGINEERING & QA'
                    : lang === 'es'
                    ? '// 00. INGENIERÍA DE SOFTWARE & QA'
                    : '// 00. ENGENHARIA DE SOFTWARE & QA'}
            </span>

            {/* Altura mínima fixada para evitar Layout Shift (CLS) no TypeAnimation */}
            <div className="min-h-[96px] sm:min-h-[130px] md:min-h-[160px] flex items-center">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif text-white tracking-tight leading-none">
                    <TypeAnimation
                        sequence={['PEDRO\nHENRIQUE', 8000, 'PEDRO\nHENRIQUE', 1000]}
                        wrapper="span"
                        cursor={true}
                        repeat={Infinity}
                        style={{ whiteSpace: 'pre-line' }}
                        className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-400 inline-block font-serif"
                    />
                </h1>
            </div>

            <h3 className="text-xl md:text-2xl text-neutral-300 font-serif font-light">
                {t('hero.developer')}{' '}
                <span className="text-white italic font-serif">{t('hero.role')}</span>
            </h3>

            <p className="text-neutral-400 max-w-lg mx-auto lg:mx-0 text-base sm:text-lg leading-relaxed min-h-[72px]">
                {t('hero.description')}{' '}
                <strong className="text-white font-medium">Delphi (Desktop/UniGui)</strong>,{' '}
                <strong className="text-white font-medium">PHP/Laravel</strong>
                {lang === 'en' ? ' and ' : lang === 'es' ? ' y ' : ' e '}
                <strong className="text-white font-medium">React</strong>.
            </p>

            {/* Botões CTA */}
            <div className="flex flex-col sm:flex-row gap-3.5 pt-4 justify-center lg:justify-start items-center">
                <MagneticButton strength={0.35}>
                    <a
                        href="#projetos"
                        data-cursor-morph="true"
                        className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-mono text-xs font-semibold tracking-tight transition-all active:scale-[0.98] shadow-sm inline-flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden"
                    >
                        {t('hero.verProjetos')}
                    </a>
                </MagneticButton>

                <MagneticButton strength={0.3}>
                    <a
                        href="/curriculo_pedro_henrique.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        download="curriculo_pedro_henrique.pdf"
                        data-cursor-morph="true"
                        className="px-5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.15] text-neutral-200 font-mono text-xs font-medium transition-all inline-flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:outline-hidden"
                    >
                        <i className="fas fa-file-pdf text-neutral-400" />
                        {t('hero.downloadCV') || 'Download CV'}
                    </a>
                </MagneticButton>

                {/* Redes Sociais */}
                <div className="flex justify-center gap-2.5">
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
                    ].map((s, idx) => (
                        <MagneticButton key={idx} strength={0.3}>
                            <a
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-cursor-morph="true"
                                className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] text-neutral-300 hover:text-white transition-all inline-flex items-center justify-center active:scale-[0.98] cursor-pointer focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:outline-hidden"
                                aria-label={s.label}
                            >
                                {s.icon}
                            </a>
                        </MagneticButton>
                    ))}
                </div>
            </div>
        </motion.div>
    );
});

/* ── Sub-componente: Terminal Interativo (camada direita) ── */
const HeroTerminalBlock = memo(function HeroTerminalBlock({
    opacity,
    x,
    scale,
}: {
    opacity: MotionValue<number>;
    x: MotionValue<number>;
    scale: MotionValue<number>;
}) {
    return (
        <motion.div
            style={{
                opacity,
                x,
                scale,
                willChange: 'transform, opacity',
                transform: 'translateZ(0)',
            }}
            className="lg:col-span-7 flex justify-center lg:justify-end w-full"
        >
            <div id="terminal" className="relative w-full max-w-xl xl:max-w-2xl">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/[0.03] blur-[100px] rounded-full pointer-events-none" />
                <Suspense fallback={
                    <div className="w-full h-[500px] md:h-[540px] rounded-2xl bg-[#080a0f]/90 border border-white/10 p-6 flex flex-col justify-between animate-pulse">
                        <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                            <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                            <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                            <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                            <div className="w-24 h-3 rounded bg-white/10 ml-auto" />
                        </div>
                        <div className="space-y-4 py-6 flex-grow">
                            <div className="w-3/4 h-3 rounded bg-white/10" />
                            <div className="w-1/2 h-3 rounded bg-white/10" />
                            <div className="w-5/6 h-3 rounded bg-white/10" />
                        </div>
                        <div className="w-full h-10 rounded bg-white/10" />
                    </div>
                }>
                    <InteractiveTerminal />
                </Suspense>
            </div>
        </motion.div>
    );
});

/* ══════════════════════════════════════════════════════════════════
 * COMPONENTE PRINCIPAL: HeroAboutScrolly
 * ══════════════════════════════════════════════════════════════════ */
export default function HeroAboutScrolly() {
    const { t, lang } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);

    /* ── Progresso normalizado (0 → 1) do scroll dentro do container de 260vh ── */
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    /* ═══════════════════════════════════════════
     * MAPA DE INTERPOLAÇÃO DAS CAMADAS
     * ═══════════════════════════════════════════ */

    /* ── A. Bloco Hero: Texto (0.0 → 0.35) ── */
    const heroTextOpacity = useTransform(scrollYProgress, [0, 0.20, 0.35], [1, 1, 0]);
    const heroTextX = useTransform(scrollYProgress, [0, 0.20, 0.35], [0, 0, -70]);
    const heroTextScale = useTransform(scrollYProgress, [0, 0.20, 0.35], [1, 1, 0.96]);

    /* ── A. Bloco Hero: Terminal (0.0 → 0.45) ── */
    const heroTerminalOpacity = useTransform(scrollYProgress, [0, 0.20, 0.45], [1, 1, 0]);
    const heroTerminalX = useTransform(scrollYProgress, [0, 0.20, 0.45], [0, 0, 30]);
    const heroTerminalScale = useTransform(scrollYProgress, [0, 0.20, 0.45], [1, 1, 0.90]);

    /* ── B. Bloco Sobre Mim (0.35 → 0.85) ── */
    const aboutOpacity = useTransform(scrollYProgress, [0.30, 0.45, 0.85, 1.0], [0, 1, 1, 1]);
    const aboutX = useTransform(scrollYProgress, [0.30, 0.45], [70, 0]);
    const aboutScale = useTransform(scrollYProgress, [0.30, 0.45], [0.97, 1]);

    /* ── Indicador de Scroll: Fade out nos primeiros 15% ── */
    const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.12, 0.18], [1, 0.4, 0]);

    /* ── Background blobs com máscara gradual de desvanecimento na base ── */
    const heroBlobsOpacity = useTransform(scrollYProgress, [0, 0.25, 0.45], [1, 0.5, 0]);

    return (
        <div
            ref={containerRef}
            className="relative bg-[#05070a]"
            style={{ height: '260vh' }}
        >
            {/* ── Palco Fixo: Sticky na viewport (h-screen) ── */}
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

                {/* ── Background blobs decorativos ── */}
                <motion.div
                    style={{ opacity: heroBlobsOpacity }}
                    className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
                >
                    <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-cyan-500/[0.03] blur-[120px] rounded-full transform-gpu" />
                    <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-emerald-500/[0.02] blur-[120px] rounded-full transform-gpu" />
                </motion.div>

                {/* Floating particles aceleradas por GPU */}
                <motion.div
                    style={{ opacity: heroBlobsOpacity }}
                    className="absolute inset-0 pointer-events-none overflow-hidden"
                >
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-white/[0.06] pointer-events-none transform-gpu"
                            style={{
                                width: 8 + i * 5,
                                height: 8 + i * 5,
                                left: `${12 + i * 18}%`,
                                top: `${22 + (i % 3) * 22}%`,
                                animation: `float-particle ${3.5 + i * 0.6}s ease-in-out infinite`,
                                animationDelay: `${i * 0.8}s`,
                                willChange: 'transform, opacity',
                            }}
                        />
                    ))}
                </motion.div>

                {/* ═══════════════════════════════════════════
                 * CAMADA HERO (Texto + Terminal)
                 * ═══════════════════════════════════════════ */}
                <motion.div
                    style={{
                        opacity: heroTextOpacity,
                        willChange: 'transform, opacity',
                    }}
                    className="absolute inset-0 flex items-center justify-center z-10"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
                            <HeroTextBlock
                                opacity={heroTextOpacity}
                                x={heroTextX}
                                scale={heroTextScale}
                                lang={lang}
                                t={t}
                            />
                            <HeroTerminalBlock
                                opacity={heroTerminalOpacity}
                                x={heroTerminalX}
                                scale={heroTerminalScale}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* ═══════════════════════════════════════════
                 * CAMADA SOBRE MIM (Entrada Revelação)
                 * ═══════════════════════════════════════════ */}
                <motion.div
                    style={{
                        opacity: aboutOpacity,
                        x: aboutX,
                        scale: aboutScale,
                        willChange: 'transform, opacity',
                        transform: 'translateZ(0)',
                    }}
                    className="absolute inset-0 flex items-center justify-center z-20"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <AboutMeInlineContent lang={lang} t={t} />
                    </div>
                </motion.div>

                {/* ── Indicador de scroll na base do viewport ── */}
                <ScrollIndicator opacity={scrollIndicatorOpacity} lang={lang} />

                {/* ── Gradiente de fade na base do palco sticky ── */}
                <div
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-b from-transparent via-[#05070a]/75 to-[#05070a] pointer-events-none z-30"
                />
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════════
 * AboutMeInlineContent — Conteúdo embutido da seção Sobre Mim
 *
 * Versão compacta e focada para exibição dentro do scrollytelling.
 * Exibe: header, bio resumida, métricas e pilares.
 * O conteúdo completo (Bento Grid, projetos-chave, SQL Benchmark)
 * permanece acessível na seção standalone <AboutSection /> que
 * será renderizada no fluxo normal após o container de 260vh.
 * ══════════════════════════════════════════════════════════════════ */
const AboutMeInlineContent = memo(function AboutMeInlineContent({
    lang,
    t,
}: {
    lang: string;
    t: (key: string) => any;
}) {
    const [isSectionVisible, setIsSectionVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsSectionVisible(true);
                }
            },
            { threshold: 0.15 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const aboutMetrics = [
        {
            icon: 'fas fa-calendar-check',
            value: 10,
            suffix: '+',
            label: t('about.highlights')?.[0] || (lang === 'en' ? '10+ months experience' : '10+ meses de experiência'),
        },
        {
            icon: 'fas fa-users',
            value: 100,
            suffix: '+',
            label: t('about.highlights')?.[1] || (lang === 'en' ? '100+ daily active users' : '100+ usuários diários'),
        },
        {
            icon: 'fas fa-bolt',
            value: 4,
            suffix: '×',
            label: t('about.highlights')?.[3] || (lang === 'en' ? 'Faster query execution' : 'Queries 4× mais rápidas'),
        },
        {
            icon: 'fas fa-shield-alt',
            value: 100,
            suffix: '%',
            label: lang === 'en' ? 'Fiscal compliance (ACBr)' : lang === 'es' ? 'Cumplimiento fiscal (ACBr)' : 'Conformidade fiscal (ACBr)',
        },
    ];

    return (
        <div ref={sectionRef} className="space-y-8">
            {/* ── Section Header ── */}
            <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.07] mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                    <span className="font-mono text-[11px] tracking-[0.25em] text-neutral-400 uppercase">
                        {lang === 'en'
                            ? '// 01. BIOGRAPHY & TECHNICAL GUIDELINES'
                            : lang === 'es'
                            ? '// 01. BIOGRAFÍA Y DIRECTRICES TÉCNICAS'
                            : '// 01. BIOGRAFIA & DIRETRIZES TÉCNICAS'}
                    </span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-3">
                    {t('about.title')}
                </h2>
                <p className="text-neutral-400 max-w-2xl font-sans text-sm sm:text-base leading-relaxed">
                    {t('about.subtitle') || 'Engenharia de software focada em modernização, alta disponibilidade e impacto real em produção.'}
                </p>
            </div>

            {/* ── Métricas em grade horizontal ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {aboutMetrics.map((metric, idx) => (
                    <div
                        key={idx}
                        style={{ transform: 'translateZ(0)' }}
                        className="bg-[#0c0e14]/90 backdrop-blur-sm border border-white/[0.07] rounded-2xl p-4 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
                    >
                        <i className={`${metric.icon} text-lg text-neutral-500 mb-2 block`} />
                        <span className="tabular-nums font-mono font-bold text-white text-xl tracking-tight block">
                            {isSectionVisible ? metric.value : 0}{metric.suffix}
                        </span>
                        <span className="text-neutral-400 text-xs mt-1 block leading-tight">
                            {metric.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* ── Bio resumida ── */}
            <div
                style={{ transform: 'translateZ(0)' }}
                className="bg-[#0c0e14]/90 backdrop-blur-sm border border-white/[0.07] rounded-2xl p-5 md:p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
            >
                <span className="flex items-center gap-2 text-[10px] font-semibold text-neutral-400 uppercase tracking-widest font-mono mb-3">
                    <i className="fas fa-terminal text-[10px] text-neutral-500" />
                    {t('about.resumoTitle')}
                </span>
                <div className="space-y-3 text-neutral-300 text-sm sm:text-base leading-relaxed">
                    {(Array.isArray(t('about.bio')) ? t('about.bio') : [t('about.bio')]).map(
                        (paragraph: string, idx: number) => (
                            <p key={idx}>{paragraph}</p>
                        )
                    )}
                </div>
            </div>
        </div>
    );
});
