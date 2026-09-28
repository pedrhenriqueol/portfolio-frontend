import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Hero from './Hero';
import { LiveClock } from './AboutMe';
import { useLanguage } from '../../context/LanguageContext';

/**
 * HeroAboutPinnedStage — Palco Fixo de Scrollytelling
 *
 * Coreografia Temporal (Pista de 220vh):
 * - Fase 0 (0.00): Hero limpo à esquerda, Terminal ancorado à direita.
 * - Fase 1 (0.20 a 0.35): Textos do Hero deslizam e somem (opacity: 1 -> 0, x: 0 -> -60px).
 * - Fase 2 (0.15 a 0.65): Terminal atua como pivô de transição (scale: 1 -> 0.90, x: 0 -> -35px).
 * - Fase 3 (0.40 a 0.90): Entrada do Sobre Mim (resumo e métricas) da direita (opacity: 0 -> 1, x: 60px -> 0).
 * - Fase 4 (0.90 a 1.00): Desengate natural do sticky para o fluxo nativo.
 *
 * Performance:
 * - Aceleração exclusiva por GPU (transform e opacity)
 * - Zero overflow interno (eliminando qualquer travamento de scroll do mouse)
 * - will-change: transform, opacity em nós animados
 */
export default function HeroAboutPinnedStage() {
    const trackRef = useRef<HTMLDivElement>(null);
    const { t, lang } = useLanguage();

    // Reset de scroll no topo ao recarregar a página
    useEffect(() => {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
    }, []);

    // Progresso de scroll normalizado (0 -> 1) na pista de 220vh
    const { scrollYProgress } = useScroll({
        target: trackRef,
        offset: ['start start', 'end end'],
    });

    // ── Fase 1: Saída do Hero (0.20 a 0.35) ──
    const heroTextOpacity = useTransform(scrollYProgress, [0, 0.20, 0.35], [1, 1, 0]);
    const heroTextX       = useTransform(scrollYProgress, [0, 0.20, 0.35], [0, 0, -60]);
    const heroPointerEvents = useTransform(scrollYProgress, (v: number) =>
        v > 0.35 ? 'none' : 'auto'
    );

    // ── Fase 2: Terminal como Pivô de Transição (0.15 a 0.65) ──
    const terminalScale   = useTransform(scrollYProgress, [0, 0.15, 0.65], [1, 1, 0.90]);
    const terminalX       = useTransform(scrollYProgress, [0, 0.15, 0.65], [0, 0, -35]);
    const terminalOpacity = useTransform(scrollYProgress, [0, 0.65, 0.85], [1, 1, 0]);

    // ── Fase 3: Entrada do Sobre Mim da Direita (0.40 a 0.90) ──
    const aboutOpacity    = useTransform(scrollYProgress, [0.40, 0.70, 0.90], [0, 0.8, 1]);
    const aboutX          = useTransform(scrollYProgress, [0.40, 0.80], [60, 0]);
    const aboutPointerEvents = useTransform(scrollYProgress, (v: number) =>
        v < 0.40 ? 'none' : 'auto'
    );

    const metrics = [
        {
            value: '10+',
            label: lang === 'en' ? 'Months Exp.' : lang === 'es' ? 'Meses Exp.' : 'Meses de Exp.',
            icon: 'fas fa-calendar-check',
        },
        {
            value: '100+',
            label: lang === 'en' ? 'Active Users' : lang === 'es' ? 'Usuarios Activos' : 'Usuários Ativos',
            icon: 'fas fa-users',
        },
        {
            value: '99.8%',
            label: lang === 'en' ? 'Availability' : lang === 'es' ? 'Disponibilidad' : 'Disponibilidade',
            icon: 'fas fa-shield-alt',
        },
        {
            value: '15+',
            label: lang === 'en' ? 'Microservices' : lang === 'es' ? 'Microservicios' : 'Microsserviços',
            icon: 'fas fa-network-wired',
        },
    ];

    const techChips = ['Delphi 11', 'UniGui', 'PHP/Laravel', 'React', 'TypeScript', 'SQL Server', 'Postman'];

    return (
        <div
            id="pinned-stage"
            ref={trackRef}
            className="relative h-[220vh] bg-[#05070a] w-full"
        >
            {/* ── Palco Fixo (Sticky Viewport) ── */}
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

                {/* ── Camada 1: Hero (Texto + Terminal Pivô) ── */}
                <motion.div
                    className="absolute inset-0 w-full h-full z-10 flex items-center justify-center"
                    style={{
                        pointerEvents: heroPointerEvents,
                        transform: 'translateZ(0)',
                    }}
                >
                    <div className="w-full h-full flex items-center justify-center">
                        <Hero
                            heroTextOpacity={heroTextOpacity}
                            heroTextX={heroTextX}
                            terminalScale={terminalScale}
                            terminalX={terminalX}
                            terminalOpacity={terminalOpacity}
                        />
                    </div>
                </motion.div>

                {/* ── Camada 2: Sobre Mim — Resumo Profissional e Métricas (Fase 3) ── */}
                <motion.div
                    id="sobre"
                    className="absolute inset-0 w-full h-full z-20 flex items-center justify-center px-4 sm:px-6 lg:px-8"
                    style={{
                        opacity: aboutOpacity,
                        x: aboutX,
                        pointerEvents: aboutPointerEvents,
                        willChange: 'transform, opacity',
                        transform: 'translateZ(0)',
                    }}
                >
                    <div className="w-full max-w-6xl mx-auto space-y-6">

                        {/* Cabeçalho da Seção */}
                        <div className="text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-2.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span className="font-mono text-[10px] tracking-[0.22em] text-neutral-400 uppercase">
                                    {lang === 'en'
                                        ? '// 01. BIOGRAPHY & TECHNICAL GUIDELINES'
                                        : lang === 'es'
                                        ? '// 01. BIOGRAFÍA Y DIRECTRICES TÉCNICAS'
                                        : '// 01. BIOGRAFIA & DIRETRIZES TÉCNICAS'}
                                </span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-white tracking-tight">
                                {t('about.title') || 'Sobre Mim'}
                            </h2>
                            <p className="text-neutral-400 font-sans text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                                {t('about.subtitle') || 'Engenharia de software focada em modernização, alta disponibilidade e impacto real em produção.'}
                            </p>
                        </div>

                        {/* Grid Principal: Bio + Relógio e Métricas */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

                            {/* Card Resumo Profissional (8 colunas) */}
                            <div className="lg:col-span-8 bg-[#0c0e14]/90 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] flex flex-col justify-between space-y-5">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-[10px] font-semibold text-neutral-400 uppercase tracking-widest font-mono">
                                            <i className="fas fa-terminal text-[10px] text-neutral-500" />
                                            {t('about.resumoTitle') || 'DEV // ARQUITETURA'}
                                        </span>

                                        {/* Status Badge */}
                                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full font-mono text-[10px] bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-300 select-none">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                            <span>
                                                {lang === 'en' ? 'Available for challenges' : lang === 'es' ? 'Disponible para desafíos' : 'Disponível para desafios'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Texto Biográfico de Alta Densidade */}
                                    <p className="text-neutral-300 text-xs sm:text-[13px] leading-relaxed">
                                        {t('about.resumo1') || 'Desenvolvedor com foco em modernização de sistemas corporativos legados, engenharia reversa e sustentação de operações críticas.'}{' '}
                                        <strong className="text-white font-medium">Delphi (Desktop/UniGui)</strong>,{' '}
                                        <strong className="text-white font-medium">PHP/Laravel</strong>,{' '}
                                        <strong className="text-white font-medium">React com TypeScript</strong> e{' '}
                                        <strong className="text-white font-medium">Microsoft SQL Server</strong>.
                                    </p>
                                </div>

                                {/* Tech Chips */}
                                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.04]">
                                    {techChips.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.07] text-neutral-300 font-mono text-[11px] select-none"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Card Lateral: Relógio Local + Métricas (4 colunas) */}
                            <div className="lg:col-span-4 flex flex-col gap-4">

                                {/* Card Hora Local */}
                                <div className="bg-[#0c0e14]/90 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] flex flex-col justify-between">
                                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-1">
                                        <span>{lang === 'en' ? 'LOCAL TIME (UTC-3)' : 'HORA LOCAL (UTC-3)'}</span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    </div>
                                    <div className="py-1">
                                        <LiveClock lang={lang} />
                                    </div>
                                    <span className="text-[11px] text-neutral-400 font-mono">
                                        Fortaleza, CE — {lang === 'en' ? 'Brazil' : 'Brasil'}
                                    </span>
                                </div>

                                {/* Grid de Métricas Principais (2x2) */}
                                <div className="grid grid-cols-2 gap-3 flex-1">
                                    {metrics.map((m, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-[#0c0e14]/90 backdrop-blur-sm border border-white/[0.08] rounded-xl p-3.5 flex flex-col justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
                                        >
                                            <i className={`${m.icon} text-neutral-400 text-xs`} />
                                            <div className="mt-2">
                                                <span className="font-mono text-lg font-bold text-white tracking-tight block">
                                                    {m.value}
                                                </span>
                                                <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 block mt-0.5">
                                                    {m.label}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>

                        </div>

                    </div>
                </motion.div>

                {/* ── Gradiente de Transição na Base ── */}
                <div
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#05070a] pointer-events-none z-30"
                />
            </div>
        </div>
    );
}
