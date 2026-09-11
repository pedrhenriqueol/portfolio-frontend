import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

/* ── Som de tecla mecânica via Web Audio API ── */
function playMechanicalKey(freq = 700, duration = 0.04) {
    try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + duration);
        gain.gain.setValueAtTime(0.035, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {}
}

/* ── Relógio ao vivo de Fortaleza (UTC-3) ── */
function LiveClock({ lang }: { lang: string }) {
    const [time, setTime] = useState('');

    useEffect(() => {
        const locale = lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : 'pt-BR';
        let timer: number | null = null;

        const update = () => {
            if (document.hidden) return;
            setTime(
                new Date().toLocaleTimeString(locale, {
                    timeZone: 'America/Fortaleza',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                })
            );
        };

        const startTimer = () => {
            if (!timer) {
                update();
                timer = window.setInterval(update, 1000);
            }
        };

        const stopTimer = () => {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        };

        startTimer();

        const onVisChange = () => {
            if (document.hidden) {
                stopTimer();
            } else {
                startTimer();
            }
        };

        document.addEventListener('visibilitychange', onVisChange, { passive: true });

        return () => {
            stopTimer();
            document.removeEventListener('visibilitychange', onVisChange);
        };
    }, [lang]);

    return <span className="tabular-nums font-mono font-bold text-white text-xl sm:text-2xl tracking-tight">{time || '10:00:00'}</span>;
}

/* ── Card com Spotlight Radial dinâmico que segue o cursor ── */
function BentoSpotlightCard({
    children,
    className = '',
    onClick,
}: {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}) {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onClick={onClick}
            className={`bg-[#080a0f]/80 backdrop-blur-xl border border-white/[0.07] rounded-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] relative overflow-hidden group transition-all duration-300 hover:border-white/[0.14] ${className}`}
        >
            {/* Spotlight externo na borda */}
            <div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"
                style={{
                    background: 'radial-gradient(550px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(34, 211, 238, 0.12), transparent 50%)',
                }}
            />
            {/* Spotlight interno de preenchimento */}
            <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"
                style={{
                    background: 'radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(52, 211, 153, 0.05), transparent 45%)',
                }}
            />
            <div className="relative z-20 h-full flex flex-col justify-between">
                {children}
            </div>
        </div>
    );
}

/* ── Contador com aceleração suave ativado por viewport ── */
function AnimatedCounter({
    targetValue,
    suffix = '',
    isVisible,
}: {
    targetValue: number;
    suffix?: string;
    isVisible: boolean;
}) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isVisible) return;
        const startTime = performance.now();
        const duration = 1200;

        let frameId: number;
        const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Curva easeOutExpo
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCount(Math.round(ease * targetValue));

            if (progress < 1) {
                frameId = requestAnimationFrame(step);
            }
        };

        frameId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frameId);
    }, [isVisible, targetValue]);

    return (
        <span className="tabular-nums font-mono font-bold text-white text-base sm:text-lg">
            {count}{suffix}
        </span>
    );
}

/* ── Easter Egg 2: Modal de Benchmark Interativo de Query T-SQL ── */
function SqlBenchmarkModal({
    isOpen,
    onClose,
    lang,
}: {
    isOpen: boolean;
    onClose: () => void;
    lang: string;
}) {
    const [isReplaying, setIsReplaying] = useState(false);
    const [replayProgress, setReplayProgress] = useState(100);

    const runBenchmarkSimulation = () => {
        setIsReplaying(true);
        setReplayProgress(0);
        playMechanicalKey(900, 0.05);

        const start = performance.now();
        const duration = 900;

        const update = (now: number) => {
            const elapsed = now - start;
            const pct = Math.min(100, Math.round((elapsed / duration) * 100));
            setReplayProgress(pct);

            if (pct < 100) {
                requestAnimationFrame(update);
            } else {
                setIsReplaying(false);
                playMechanicalKey(1200, 0.07);
            }
        };

        requestAnimationFrame(update);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop escurecido com blur */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                />

                {/* Janela de Terminal / Drawer */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: 15 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    className="relative z-10 w-full max-w-2xl bg-[#080a0f] border border-cyan-500/30 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_30px_rgba(6,182,212,0.15)] overflow-hidden font-mono text-xs"
                >
                    {/* Topbar da janela */}
                    <div className="h-10 px-4 bg-white/[0.03] border-b border-white/[0.08] flex items-center justify-between select-none">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 cursor-pointer" onClick={onClose} />
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                            <span className="ml-2 text-neutral-300 font-semibold text-[11px]">
                                sql-profiler.exe • Execution Plan Benchmark
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-neutral-400 hover:text-white transition-colors text-xs px-1.5 py-0.5 rounded hover:bg-white/10"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="p-5 md:p-6 space-y-5">
                        {/* Target Query */}
                        <div className="bg-black/50 p-3 rounded-lg border border-white/[0.06] text-neutral-300">
                            <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">// CONSULTA ANALISADA (T-SQL)</div>
                            <code className="text-cyan-300 text-[11.5px] block font-mono">
                                SELECT * FROM Transacoes WITH(NOLOCK) WHERE Status = 'PENDENTE' AND DataCriacao &gt;= '2026-01-01'
                            </code>
                        </div>

                        {/* Comparação lado a lado (Antes vs Depois) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Antes */}
                            <div className="bg-rose-500/[0.04] border border-rose-500/30 rounded-xl p-4 space-y-2.5">
                                <div className="flex items-center justify-between border-b border-rose-500/20 pb-2">
                                    <span className="text-rose-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                        Antes da Otimização
                                    </span>
                                    <span className="text-rose-300 font-mono text-[10px] bg-rose-500/10 px-1.5 py-0.5 rounded">
                                        COST: 82%
                                    </span>
                                </div>
                                <div className="space-y-1.5 text-neutral-300 text-[11px]">
                                    <div className="flex justify-between">
                                        <span className="text-neutral-400">Operador:</span>
                                        <strong className="text-rose-400">Table Scan (Clustered)</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-400">Tempo Execução:</span>
                                        <strong className="text-amber-400">2.140 ms</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-400">Leituras Lógicas:</span>
                                        <span className="text-neutral-200">8.420 páginas</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-400">Diagnóstico:</span>
                                        <span className="text-rose-300">N+1 Loop / I/O Spike</span>
                                    </div>
                                </div>
                            </div>

                            {/* Depois */}
                            <div className="bg-emerald-500/[0.04] border border-emerald-500/30 rounded-xl p-4 space-y-2.5">
                                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                                    <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        Depois da Otimização
                                    </span>
                                    <span className="text-emerald-300 font-mono text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                        COST: 18%
                                    </span>
                                </div>
                                <div className="space-y-1.5 text-neutral-300 text-[11px]">
                                    <div className="flex justify-between">
                                        <span className="text-neutral-400">Operador:</span>
                                        <strong className="text-emerald-400">Index Seek (Nonclustered)</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-400">Tempo Execução:</span>
                                        <strong className="text-emerald-300">412 ms (-80.7%)</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-400">Leituras Lógicas:</span>
                                        <span className="text-emerald-200">12 páginas</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-400">Índice:</span>
                                        <span className="text-cyan-300 font-mono text-[10px]">IX_Transacoes_Audit</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Barra de progresso de simulação */}
                        {isReplaying && (
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-cyan-400">
                                    <span>Simulando execução do benchmark...</span>
                                    <span>{replayProgress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-75"
                                        style={{ width: `${replayProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Ações */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
                            <button
                                type="button"
                                disabled={isReplaying}
                                onClick={runBenchmarkSimulation}
                                className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold transition-all flex items-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                            >
                                <span>⚡</span>
                                <span>{isReplaying ? 'Executando...' : 'Re-executar Teste / Benchmark'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 transition-colors cursor-pointer"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

export default function AboutSection() {
    const { t, lang } = useLanguage();

    const [isSectionVisible, setIsSectionVisible] = useState(false);
    const [isClockFlipped, setIsClockFlipped] = useState(false);
    const [showSqlModal, setShowSqlModal] = useState(false);
    const [tacticalMode, setTacticalMode] = useState(false);

    const sectionRef = useRef<HTMLElement>(null);
    const clickCountRef = useRef(0);
    const clickTimerRef = useRef<number | null>(null);

    // Observa entrada da seção para disparar contadores numéricos
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

    // Triplo clique no badge 'Disponível' para ativar o modo tático
    const handleBadgeClick = () => {
        clickCountRef.current += 1;
        if (clickTimerRef.current) window.clearTimeout(clickTimerRef.current);

        if (clickCountRef.current >= 3) {
            clickCountRef.current = 0;
            setTacticalMode(prev => !prev);
            playMechanicalKey(1000, 0.08);
            return;
        }

        clickTimerRef.current = window.setTimeout(() => {
            clickCountRef.current = 0;
        }, 400);
    };

    // Cross-talk bridge com o Terminal Copilot
    const handleTechChipClick = useCallback((tech: string) => {
        playMechanicalKey(650, 0.04);

        const queryMap: Record<string, string> = {
            'Delphi 11': 'Qual a sua experiência prática com Delphi 11 e modernização na Qualisoft?',
            'UniGui': 'Como você realizou a migração de desktop VCL para a web com UniGui?',
            'Laravel': 'Como você constrói APIs REST e microsserviços em PHP e Laravel?',
            'React': 'Como você utiliza React e TypeScript no desenvolvimento de frontends modernos?',
            'TypeScript': 'Qual o seu padrão de uso de TypeScript e tipagem estrita no código?',
            'Tailwind': 'Como você aplica Tailwind CSS e design tokens em interfaces de alta densidade?',
            'SQL Server': 'Como funciona o tuning de queries e diagnósticos no Microsoft SQL Server?',
            'MySQL': 'Qual sua experiência com bancos de dados relacionais MySQL?',
            'PostgreSQL': 'Como você modela esquemas e transações no PostgreSQL?',
            'Indexação': 'Como você otimiza índices compostos para eliminar Table Scans?',
            'Tuning': 'Quais técnicas de query tuning e execution plan você utiliza?',
            'Postman': 'Como você automatiza testes de API e regressão com Postman na SETE Tecnologia?',
            'Testes Funcionais': 'Como você modela suítes de testes funcionais e regressivos?',
            'Scrum / Kanban': 'Como é a sua rotina com metodologias ágeis em equipes de engenharia?',
            'ZPEs / Portos': 'Como funciona a validação em sistemas críticos de logística aduaneira e ZPEs?',
        };

        const query = queryMap[tech] || `Qual sua experiência técnica com ${tech}?`;

        // Scroll suave até o Terminal
        const termEl = document.getElementById('terminal') || document.getElementById('home');
        if (termEl) {
            termEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Dispara o evento de foco e injeção do comando
        window.setTimeout(() => {
            window.dispatchEvent(
                new CustomEvent('focus-terminal', {
                    detail: { command: query },
                })
            );
        }, 300);
    }, []);

    const pillars = [
        {
            icon: 'fas fa-laptop-code',
            title: lang === 'en' ? 'Fullstack & Modernization' : lang === 'es' ? 'Fullstack y Modernización' : 'Fullstack & Modernização',
            desc: lang === 'en'
                ? 'Expert in transitioning legacy monoliths into modern SPAs and decoupled RESTful APIs.'
                : lang === 'es'
                ? 'Especialista en migración de monolitos heredados a SPAs modernas y APIs REST desacopladas.'
                : 'Especialista em transição de monolitos legados para SPAs modernas e APIs REST desacopladas.',
            tags: ['Delphi 11', 'UniGui', 'Laravel', 'React', 'TypeScript', 'Tailwind'],
        },
        {
            icon: 'fas fa-database',
            title: lang === 'en' ? 'Databases & Performance' : lang === 'es' ? 'Bases de Datos y Rendimiento' : 'Bancos de Dados & Performance',
            desc: lang === 'en'
                ? 'Critical query refactoring (N+1 resolution), smart indexing and transactional integrity.'
                : lang === 'es'
                ? 'Refactorización crítica de consultas N+1, indexación inteligente e integridad transaccional.'
                : 'Refatoração de queries críticas N+1, indexação inteligente e garantia de integridade transacional.',
            tags: ['SQL Server', 'MySQL', 'PostgreSQL', 'Indexação', 'Tuning'],
        },
        {
            icon: 'fas fa-shield-alt',
            title: lang === 'en' ? 'QA & Mission-Critical Systems' : lang === 'es' ? 'QA y Sistemas Críticos' : 'QA & Sistemas Críticos',
            desc: lang === 'en'
                ? 'Requirements engineering, automated/manual tests via Postman and regression protection.'
                : lang === 'es'
                ? 'Ingeniería de requisitos, pruebas automatizadas/manuales con Postman y blindaje contra regresiones.'
                : 'Engenharia de requisitos, testes automatizados/manuais via Postman e blindagem contra regressões.',
            tags: ['Postman', 'Testes Funcionais', 'Scrum / Kanban', 'ZPEs / Portos'],
        },
    ];

    return (
        <section id="sobre" ref={sectionRef} className="py-24 md:py-36 bg-transparent relative select-text">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Section Header com estética industrial ── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.7 }}
                    className="text-center md:text-left mb-14"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="font-mono text-[11px] tracking-[0.25em] text-neutral-300 uppercase">
                            // 01. BIOGRAFIA & DIRETRIZES TÉCNICAS
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-3">
                        {t('about.title')}
                    </h2>
                    <p className="text-neutral-400 max-w-2xl font-sans text-sm sm:text-base leading-relaxed">
                        {t('about.subtitle') || 'Engenharia de software focada em modernização, alta disponibilidade e impacto real em produção.'}
                    </p>
                </motion.div>

                {/* ── Bento Grid de Alta Densidade com Efeito Spotlight ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

                    {/* 1. Card Principal de Bio & Métricas (7 Colunas) */}
                    <BentoSpotlightCard className="lg:col-span-7 p-7 sm:p-9">
                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono">
                                    <i className="fas fa-terminal text-[11px]" />
                                    {t('about.resumoTitle')}
                                </span>

                                {/* Badge com easter egg de triplo clique */}
                                <button
                                    type="button"
                                    onClick={handleBadgeClick}
                                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer select-none ${
                                        tacticalMode
                                            ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] animate-pulse'
                                            : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:border-emerald-400/60'
                                    }`}
                                    title={tacticalMode ? 'Modo Tático Ativo! Clique 3x para retornar' : 'Disponível para desafios (Triplo-clique: Modo Tático)'}
                                >
                                    <span className={`w-2 h-2 rounded-full ${tacticalMode ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
                                    <span>
                                        {tacticalMode
                                            ? 'TÁTICO: 180 FPS // LATENCY 0.5ms'
                                            : lang === 'en'
                                            ? 'Available'
                                            : lang === 'es'
                                            ? 'Disponible'
                                            : 'Disponível'}
                                    </span>
                                </button>
                            </div>

                            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                                {t('about.resumo1')}{' '}
                                <span className="text-white font-semibold underline decoration-cyan-400/40 underline-offset-4">{t('about.resumo1_highlight1')}</span>{' '}
                                {t('about.resumo1_rest')}{' '}
                                <span className="text-white font-semibold underline decoration-cyan-400/40 underline-offset-4">{t('about.resumo1_highlight2')}</span>
                            </p>

                            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                                {t('about.resumo2')}{' '}
                                <span className="text-white font-semibold">Delphi (Desktop &amp; UniGui)</span>,{' '}
                                <span className="text-white font-semibold">PHP/Laravel</span>,{' '}
                                <span className="text-white font-semibold">React + TypeScript</span> e{' '}
                                <span className="text-white font-semibold">Tailwind CSS</span>. {t('about.resumo2_rest')}{' '}
                                <span className="text-secondary font-semibold font-mono">{t('about.resumo2_highlight')}</span>{' '}
                                
                                {/* Easter Egg 2: Trigger de benchmark SQL */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        playMechanicalKey(800, 0.05);
                                        setShowSqlModal(true);
                                    }}
                                    className="inline-flex items-center gap-1.5 ml-1 px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-400 text-amber-300 font-mono text-[11px] transition-all cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.15)] hover:scale-105 active:scale-95"
                                    title="Abrir comparação interativa de Execution Plan T-SQL"
                                >
                                    <span>⚡</span>
                                    <span>Simular Query</span>
                                </button>
                                {t('about.resumo2_final')}
                            </p>

                            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                                {t('about.resumo3')}{' '}
                                <span className="text-emerald-400 font-semibold font-mono">{t('about.resumo3_highlight')}</span>{' '}
                                {t('about.resumo3_final')} {t('about.resumo4')}{' '}
                                <span className="text-cyan-300 font-semibold">{t('about.resumo4_highlight1')}</span>{' '}
                                {t('about.resumo4_rest')}{' '}
                                <span className="text-cyan-300 font-semibold">{t('about.resumo4_highlight2')}</span>
                            </p>
                        </div>

                        {/* Strip de Métricas Vivas com Contadores Interativos */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 mt-6 border-t border-white/[0.06]">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 mb-1">
                                    <i className="fas fa-briefcase text-cyan-400 text-xs" />
                                    <AnimatedCounter targetValue={10} suffix="+" isVisible={isSectionVisible} />
                                </div>
                                <span className="text-[11px] text-neutral-400 font-sans leading-tight">
                                    {t('about.highlights')?.[0] || (lang === 'en' ? '10+ months experience' : '10+ meses de experiência')}
                                </span>
                            </div>

                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 mb-1">
                                    <i className="fas fa-users text-emerald-400 text-xs" />
                                    <AnimatedCounter targetValue={100} suffix="+" isVisible={isSectionVisible} />
                                </div>
                                <span className="text-[11px] text-neutral-400 font-sans leading-tight">
                                    {t('about.highlights')?.[1] || (lang === 'en' ? '100+ daily active users' : '100+ usuários diários')}
                                </span>
                            </div>

                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 mb-1">
                                    <i className="fas fa-tachometer-alt text-amber-400 text-xs" />
                                    <AnimatedCounter targetValue={4} suffix="×" isVisible={isSectionVisible} />
                                </div>
                                <span className="text-[11px] text-neutral-400 font-sans leading-tight">
                                    {t('about.highlights')?.[3] || (lang === 'en' ? 'Faster query execution' : 'Queries mais rápidas')}
                                </span>
                            </div>

                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 mb-1">
                                    <i className="fas fa-check-double text-indigo-400 text-xs" />
                                    <AnimatedCounter targetValue={100} suffix="%" isVisible={isSectionVisible} />
                                </div>
                                <span className="text-[11px] text-neutral-400 font-sans leading-tight">
                                    {lang === 'en' ? 'Fiscal compliance (ACBr)' : lang === 'es' ? 'Cumplimiento fiscal (ACBr)' : 'Conformidade fiscal (ACBr)'}
                                </span>
                            </div>
                        </div>
                    </BentoSpotlightCard>

                    {/* 2. Coluna Lateral Direita (5 Colunas) */}
                    <div className="lg:col-span-5 flex flex-col gap-6">

                        {/* Card Educação */}
                        <BentoSpotlightCard className="p-7">
                            <span className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono mb-4">
                                <i className="fas fa-graduation-cap text-[11px]" />
                                {t('about.educacaoTitle')}
                            </span>

                            <div className="space-y-4">
                                <div className="border-l-2 border-cyan-400/60 pl-4 space-y-0.5">
                                    <h4 className="text-sm sm:text-base font-bold text-white font-serif">{t('about.edu1Title')}</h4>
                                    <p className="text-xs text-neutral-400 font-mono">{t('about.edu1Desc')}</p>
                                </div>
                                <div className="border-l-2 border-white/20 pl-4 space-y-0.5">
                                    <h4 className="text-sm sm:text-base font-bold text-white font-serif">{t('about.edu2Title')}</h4>
                                    <p className="text-xs text-neutral-400 font-mono">{t('about.edu2Desc')}</p>
                                </div>
                            </div>
                        </BentoSpotlightCard>

                        {/* Card Localização & Easter Egg 1: Workstation Hardware Telemetry (Flip 3D) */}
                        <BentoSpotlightCard className="p-7">
                            <div className="relative w-full h-full min-h-[125px] [perspective:1000px]">
                                <div
                                    className={`w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
                                        isClockFlipped ? '[transform:rotateY(180deg)]' : ''
                                    }`}
                                >
                                    {/* Frente: Relógio ao vivo de Fortaleza */}
                                    <div className="w-full h-full [backface-visibility:hidden] flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                                                    {lang === 'en' ? 'LOCAL TIME (UTC-3)' : 'HORA LOCAL (UTC-3)'}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        playMechanicalKey(750, 0.04);
                                                        setIsClockFlipped(true);
                                                    }}
                                                    className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all cursor-pointer select-none hover:scale-105 active:scale-95"
                                                    title="Clique para ver especificações da workstation"
                                                >
                                                    [Click: Specs]
                                                </button>
                                            </div>
                                            <LiveClock lang={lang} />
                                            <span className="text-xs text-neutral-400 font-mono block mt-1">Fortaleza, CE — Brasil</span>
                                        </div>

                                        <div
                                            onClick={() => {
                                                playMechanicalKey(750, 0.04);
                                                setIsClockFlipped(true);
                                            }}
                                            className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-400/50 hover:bg-cyan-500/20 flex items-center justify-center shrink-0 cursor-pointer transition-all group/clock shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                                            title="Ver telemetria de hardware da máquina"
                                        >
                                            <i className="fas fa-clock text-cyan-400 text-lg group-hover/clock:scale-110 group-hover/clock:text-cyan-300 transition-all" />
                                        </div>
                                    </div>

                                    {/* Verso: Telemetria de Hardware da Workstation */}
                                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between p-1 bg-black/50 rounded-xl">
                                        <div className="flex items-center justify-between border-b border-white/[0.08] pb-1.5 mb-1.5">
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                                <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
                                                    // WORKSTATION TELEMETRY
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    playMechanicalKey(550, 0.04);
                                                    setIsClockFlipped(false);
                                                }}
                                                className="w-5 h-5 rounded flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors text-xs font-mono cursor-pointer"
                                                title="Voltar ao relógio"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                                            <div className="bg-white/[0.03] p-1.5 rounded border border-white/[0.05]">
                                                <span className="text-[9px] text-neutral-400 block">CHIPSET:</span>
                                                <span className="text-white font-semibold">Ryzen 5 3500X</span>
                                            </div>
                                            <div className="bg-white/[0.03] p-1.5 rounded border border-white/[0.05]">
                                                <span className="text-[9px] text-neutral-400 block">GPU:</span>
                                                <span className="text-white font-semibold">Radeon RX 580</span>
                                            </div>
                                            <div className="bg-white/[0.03] p-1.5 rounded border border-white/[0.05]">
                                                <span className="text-[9px] text-neutral-400 block">DISPLAY:</span>
                                                <span className="text-emerald-400 font-semibold">180Hz Display</span>
                                            </div>
                                            <div className="bg-white/[0.03] p-1.5 rounded border border-white/[0.05]">
                                                <span className="text-[9px] text-neutral-400 block">MOUSE:</span>
                                                <span className="text-cyan-300 font-semibold">Rapoo VT7 @ 1000Hz</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </BentoSpotlightCard>

                    </div>
                </div>

                {/* ── 3 Pilares de Atuação Técnica com Cross-Talk Bridge ao Terminal ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {pillars.map((p, idx) => (
                        <BentoSpotlightCard key={idx} className="p-6">
                            <div>
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200 shadow-sm">
                                    <i className={`${p.icon} text-cyan-400 text-sm`} />
                                </div>
                                <h4 className="text-lg font-bold text-white font-serif mb-2 group-hover:text-cyan-300 transition-colors">
                                    {p.title}
                                </h4>
                                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-4">
                                    {p.desc}
                                </p>
                            </div>

                            {/* Easter Egg 3: Chips interativos que scrollam e perguntam ao Copilot */}
                            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.06]">
                                {p.tags.map((tag, tIdx) => (
                                    <button
                                        key={tIdx}
                                        type="button"
                                        onClick={() => handleTechChipClick(tag)}
                                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-neutral-300 border border-white/[0.07] hover:border-cyan-500/40 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all cursor-pointer flex items-center gap-1 active:scale-95 group/chip shadow-xs"
                                        title={`Perguntar ao Copilot sobre ${tag}`}
                                    >
                                        <span>{tag}</span>
                                        <span className="text-[8px] opacity-0 group-hover/chip:opacity-100 text-cyan-400 transition-opacity">❯</span>
                                    </button>
                                ))}
                            </div>
                        </BentoSpotlightCard>
                    ))}
                </div>

            </div>

            {/* Modal de Benchmark Interativo SQL */}
            <SqlBenchmarkModal
                isOpen={showSqlModal}
                onClose={() => setShowSqlModal(false)}
                lang={lang}
            />
        </section>
    );
}
