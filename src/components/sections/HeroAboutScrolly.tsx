import React, { useRef, lazy, Suspense, memo } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import MagneticButton from '../Portfolio/MagneticButton';
import AboutMeContent from './AboutMeContent';
import { useLanguage } from '../../context/LanguageContext';

const InteractiveTerminal = lazy(() => import('../Portfolio/InteractiveTerminal'));

/* ══════════════════════════════════════════════════════════════════
 * HeroAboutScrolly — Palco Unificado de Scrollytelling Pinned
 * ══════════════════════════════════════════════════════════════════
 *
 * Arquitetura:
 * - <section> pai de 260vh atua como pista de rolagem (scroll runway).
 * - Filho <div sticky top-0 h-screen> ancora o palco na viewport.
 * - `scrollYProgress` normalizado (0→1) interpola todas as camadas.
 *
 * ⚠ REGRA CRÍTICA DE CSS:
 * - NENHUM ancestral deste componente pode ter `overflow: hidden`,
 *   `overflow-y: hidden` ou `transform` (incluindo scale/translate).
 *   Qualquer dessas propriedades cria um containing block que
 *   INVALIDA o cálculo de `position: sticky` pelo navegador.
 * - Para suprimir scrollbar horizontal, usar `overflow-x: clip`.
 *
 * Performance (Low-End Guard):
 * - Anima exclusivamente `transform` (x, y, scale) e `opacity`.
 * - Zero propriedades de layout (top, left, width, height, margin).
 * - `will-change: transform, opacity` cirurgicamente nos nós animados.
 * ══════════════════════════════════════════════════════════════════ */

/* ── Indicador de Scroll ── */
const ScrollHint = memo(function ScrollHint({
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
            className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[11px] text-neutral-400 flex items-center gap-2 pointer-events-none select-none z-30"
        >
            <span className="tracking-[0.2em] uppercase">{label}</span>
            <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
                ↓
            </motion.span>
        </motion.div>
    );
});

/* ── Bloco textual do Hero (coluna esquerda) ── */
const HeroTextLayer = memo(function HeroTextLayer({
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
            style={{ opacity, x, scale, willChange: 'transform, opacity' }}
            className="lg:col-span-5 pointer-events-auto z-10"
        >
            <div className="space-y-4 text-center lg:text-left">
                <span className="font-mono text-[11px] tracking-[0.25em] text-neutral-400 uppercase block">
                    {lang === 'en'
                        ? '// 00. SOFTWARE ENGINEERING & QA'
                        : lang === 'es'
                        ? '// 00. INGENIERÍA DE SOFTWARE & QA'
                        : '// 00. ENGENHARIA DE SOFTWARE & QA'}
                </span>

                {/* Altura fixa para zero CLS no TypeAnimation */}
                <div className="min-h-[96px] sm:min-h-[130px] md:min-h-[160px] flex items-center justify-center lg:justify-start">
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

                {/* CTAs */}
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
            </div>
        </motion.div>
    );
});

/* ══════════════════════════════════════════════════════════════════
 * COMPONENTE PRINCIPAL: HeroAboutScrolly
 * ══════════════════════════════════════════════════════════════════ */
export default function HeroAboutScrolly() {
    const { t, lang } = useLanguage();
    const stageRef = useRef<HTMLDivElement>(null);

    /* ── Progresso normalizado (0 → 1) ao longo dos 260vh ── */
    const { scrollYProgress } = useScroll({
        target: stageRef,
        offset: ['start start', 'end end'],
    });

    /* ═══════════════════════════════════════════
     * MAPA DE INTERPOLAÇÃO — GPU COMPOSITOR ONLY
     * ═══════════════════════════════════════════ */

    /* 1. Hero Texto: visível 0→0.20, some para a esquerda 0.20→0.32 */
    const heroOpacity = useTransform(scrollYProgress, [0, 0.20, 0.32], [1, 1, 0]);
    const heroX = useTransform(scrollYProgress, [0, 0.32], [0, -80]);
    const heroScale = useTransform(scrollYProgress, [0, 0.32], [1, 0.95]);

    /* 2. Terminal Pivô: translada para a esquerda 0.20→0.45, reduz escala */
    const terminalX = useTransform(scrollYProgress, [0.20, 0.45], [0, -200]);
    const terminalScale = useTransform(scrollYProgress, [0.20, 0.45], [1, 0.88]);
    const terminalOpacity = useTransform(scrollYProgress, [0.20, 0.40, 0.50], [1, 1, 0]);

    /* 3. Sobre Mim: entra da direita 0.35→0.48, fixo 0.48→0.85, fade final 0.88→0.95 */
    const aboutOpacity = useTransform(scrollYProgress, [0.35, 0.48, 0.85, 0.95], [0, 1, 1, 0]);
    const aboutX = useTransform(scrollYProgress, [0.35, 0.48], [80, 0]);

    /* 4. Indicador de scroll: fade nos primeiros 12% */
    const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

    /* 5. Background blobs */
    const blobsOpacity = useTransform(scrollYProgress, [0, 0.25, 0.45], [1, 0.5, 0]);

    return (
        <section
            ref={stageRef}
            id="home"
            className="relative bg-[#05070a]"
            style={{ height: '260vh' }}
        >
            {/* ══════ PALCO STICKY — ANCORADO NA VIEWPORT ══════ */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center" style={{ overflow: 'clip' }}>

                {/* Background blobs decorativos */}
                <motion.div
                    style={{ opacity: blobsOpacity }}
                    className="absolute inset-0 z-0 pointer-events-none"
                >
                    <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-cyan-500/[0.03] blur-[120px] rounded-full transform-gpu" />
                    <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-emerald-500/[0.02] blur-[120px] rounded-full transform-gpu" />
                </motion.div>

                {/* Floating particles */}
                <motion.div
                    style={{ opacity: blobsOpacity }}
                    className="absolute inset-0 pointer-events-none"
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

                {/* ═══ GRID DE CONTEÚDO PRINCIPAL ═══ */}
                <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center relative">

                    {/* CAMADA HERO — Coluna Esquerda */}
                    <HeroTextLayer
                        opacity={heroOpacity}
                        x={heroX}
                        scale={heroScale}
                        lang={lang}
                        t={t}
                    />

                    {/* CAMADA TERMINAL — Coluna Direita (Pivô de Transição) */}
                    <motion.div
                        style={{
                            x: terminalX,
                            scale: terminalScale,
                            opacity: terminalOpacity,
                            willChange: 'transform, opacity',
                        }}
                        className="lg:col-span-7 flex justify-center lg:justify-end pointer-events-auto z-20"
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

                </div>

                {/* ═══ CAMADA SOBRE MIM — Posição absoluta, entra ocupando o espaço ═══ */}
                <motion.div
                    style={{
                        opacity: aboutOpacity,
                        x: aboutX,
                        willChange: 'transform, opacity',
                    }}
                    className="absolute inset-x-4 sm:inset-x-6 lg:inset-x-8 top-1/2 -translate-y-1/2 pointer-events-auto z-30"
                >
                    <div className="max-w-7xl mx-auto">
                        <AboutMeContent />
                    </div>
                </motion.div>

                {/* Indicador de scroll */}
                <ScrollHint opacity={hintOpacity} lang={lang} />

                {/* Gradiente de fade na base */}
                <div
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-b from-transparent via-[#05070a]/75 to-[#05070a] pointer-events-none z-40"
                />
            </div>
        </section>
    );
}
