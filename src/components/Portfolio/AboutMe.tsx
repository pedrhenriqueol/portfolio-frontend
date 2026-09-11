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

    return (
        <span className="font-mono text-xl md:text-2xl text-white tracking-tight font-semibold tabular-nums">
            {time || '10:00:00'}
        </span>
    );
}

/* ── Chassis de Cartão Unificado com Spotlight Monocromático ── */
function BentoCard({
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
            className={`bg-[#0c0e14]/70 backdrop-blur-xl border border-white/[0.07] rounded-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] relative overflow-hidden group transition-all duration-200 hover:border-white/[0.12] hover:bg-[#0c0e14]/85 ${className}`}
        >
            {/* Spotlight monocromático ultra-suave */}
            <div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"
                style={{
                    background: 'radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255, 255, 255, 0.04), transparent 60%)',
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
        <span className="tabular-nums font-mono font-bold text-white tracking-tight">
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

                {/* Janela de Terminal / Drawer sóbrio */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    className="relative z-10 w-full max-w-2xl bg-[#080a0f] border border-white/[0.09] rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden font-mono text-xs"
                >
                    {/* Topbar da janela */}
                    <div className="h-10 px-4 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between select-none">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 cursor-pointer" onClick={onClose} />
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                            <span className="ml-2 text-neutral-400 font-medium text-[11px]">
                                sql-profiler.exe • Execution Plan Benchmark
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-neutral-400 hover:text-white transition-colors text-xs px-1.5 py-0.5 rounded hover:bg-white/10 cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="p-5 md:p-6 space-y-5">
                        {/* Target Query */}
                        <div className="bg-black/40 p-3 rounded-lg border border-white/[0.05] text-neutral-300">
                            <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">// CONSULTA ANALISADA (T-SQL)</div>
                            <code className="text-neutral-200 text-[11.5px] block font-mono">
                                SELECT * FROM Transacoes WITH(NOLOCK) WHERE Status = 'PENDENTE' AND DataCriacao &gt;= '2026-01-01'
                            </code>
                        </div>

                        {/* Comparação lado a lado (Antes vs Depois) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Antes */}
                            <div className="bg-rose-500/[0.03] border border-rose-500/20 rounded-xl p-4 space-y-2.5">
                                <div className="flex items-center justify-between border-b border-rose-500/15 pb-2">
                                    <span className="text-rose-400 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
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
                                        <strong className="text-rose-400 font-medium">Table Scan (Clustered)</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-400">Tempo Execução:</span>
                                        <strong className="text-amber-400 font-medium">2.140 ms</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-400">Leituras Lógicas:</span>
                                        <span className="text-neutral-300">8.420 páginas</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-400">Diagnóstico:</span>
                                        <span className="text-rose-300">N+1 Loop / I/O Spike</span>
                                    </div>
                                </div>
                            </div>

                            {/* Depois */}
                            <div className="bg-emerald-500/[0.03] border border-emerald-500/20 rounded-xl p-4 space-y-2.5">
                                <div className="flex items-center justify-between border-b border-emerald-500/15 pb-2">
                                    <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
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
                                        <strong className="text-emerald-400 font-medium">Index Seek (Nonclustered)</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-400">Tempo Execução:</span>
                                        <strong className="text-emerald-300 font-medium">412 ms (-80.7%)</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-400">Leituras Lógicas:</span>
                                        <span className="text-emerald-200">12 páginas</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-400">Índice:</span>
                                        <span className="text-neutral-300 font-mono text-[10px]">IX_Transacoes_Audit</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Barra de progresso de simulação */}
                        {isReplaying && (
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-neutral-400">
                                    <span>Simulando execução do benchmark...</span>
                                    <span>{replayProgress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-400 transition-all duration-75"
                                        style={{ width: `${replayProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Ações */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                            <button
                                type="button"
                                disabled={isReplaying}
                                onClick={runBenchmarkSimulation}
                                className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] text-neutral-200 font-medium transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                <span className="text-emerald-400">⚡</span>
                                <span>{isReplaying ? 'Executando...' : 'Re-executar Teste / Benchmark'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-neutral-400 hover:text-white transition-colors cursor-pointer"
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

export default function AboutMe() {
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

    // ── Métricas estatísticas estruturadas (padrão de ícone em caixa lateral) ──
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

                {/* ── Section Header com estética sóbria e industrial ── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.7 }}
                    className="text-center md:text-left mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.07] mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                        <span className="font-mono text-[11px] tracking-[0.25em] text-neutral-400 uppercase">
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

                {/* ── Bento Grid Superior (lg:grid-cols-12 gap-5) ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">

                    {/* Coluna Esquerda: Card Resumo Profissional (lg:col-span-8) */}
                    <BentoCard className="lg:col-span-8 p-5 md:p-6 h-full flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-[10px] font-semibold text-neutral-400 uppercase tracking-widest font-mono">
                                    <i className="fas fa-terminal text-[10px] text-neutral-500" />
                                    {t('about.resumoTitle')}
                                </span>

                                {/* StatusBadge Canônico Unificado */}
                                <button
                                    type="button"
                                    onClick={handleBadgeClick}
                                    className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full font-mono text-[11px] transition-all duration-200 cursor-pointer select-none ${
                                        tacticalMode
                                            ? 'bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                                            : 'bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-300 hover:border-emerald-500/40'
                                    }`}
                                    title={tacticalMode ? 'Modo Tático Ativo! Clique 3x para retornar' : 'Disponível para desafios (Triplo-clique: Modo Tático)'}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full ${tacticalMode ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
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

                            {/* Parágrafos biográficos limpos e unificados */}
                            <p className="text-neutral-300 text-xs md:text-[13px] leading-relaxed tracking-normal font-normal">
                                {t('about.resumo1')}{' '}
                                <strong className="text-white font-medium">{t('about.resumo1_highlight1')}</strong>{' '}
                                {t('about.resumo1_rest')}{' '}
                                <strong className="text-white font-medium">{t('about.resumo1_highlight2')}</strong>
                            </p>

                            <p className="text-neutral-300 text-xs md:text-[13px] leading-relaxed tracking-normal font-normal">
                                {t('about.resumo2')}{' '}
                                <strong className="text-white font-medium">Delphi (Desktop &amp; UniGui)</strong>,{' '}
                                <strong className="text-white font-medium">PHP/Laravel</strong>,{' '}
                                <strong className="text-white font-medium">React + TypeScript</strong> e{' '}
                                <strong className="text-white font-medium">Tailwind CSS</strong>. {t('about.resumo2_rest')}{' '}
                                <strong className="text-white font-medium">{t('about.resumo2_highlight')}</strong> {t('about.resumo2_final')}
                            </p>

                            <p className="text-neutral-300 text-xs md:text-[13px] leading-relaxed tracking-normal font-normal">
                                {t('about.resumo3')}{' '}
                                <strong className="text-white font-medium">{t('about.resumo3_highlight')}</strong>{' '}
                                {t('about.resumo3_final')} {t('about.resumo4')}{' '}
                                <strong className="text-white font-medium">{t('about.resumo4_highlight1')}</strong>{' '}
                                {t('about.resumo4_rest')}{' '}
                                <strong className="text-white font-medium">{t('about.resumo4_highlight2')}</strong>
                            </p>
                        </div>

                        {/* Benchmark de Banco de Dados Discreto */}
                        <button
                            type="button"
                            onClick={() => {
                                playMechanicalKey(800, 0.05);
                                setShowSqlModal(true);
                            }}
                            className="text-[10px] font-mono text-neutral-400 hover:text-neutral-200 transition-colors flex items-center gap-1.5 pt-3 mt-4 border-t border-white/[0.04] cursor-pointer group/query w-fit"
                            title="Ver análise de plano de execução T-SQL"
                        >
                            <span className="text-emerald-400">›</span>
                            <span>query_profile: 2s ➔ 412ms (ver análise)</span>
                        </button>
                    </BentoCard>

                    {/* Coluna Direita: Educação & Hora Local (lg:col-span-4 flex flex-col gap-5) */}
                    <div className="lg:col-span-4 flex flex-col gap-5">

                        {/* Card Educação */}
                        <BentoCard className="p-5 md:p-6 flex-1 flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-3">
                                <span className="flex items-center gap-2 text-[10px] font-semibold text-neutral-400 uppercase tracking-widest font-mono">
                                    <i className="fas fa-graduation-cap text-[10px] text-neutral-500" />
                                    {t('about.educacaoTitle')}
                                </span>
                            </div>

                            <div className="space-y-3.5">
                                <div className="border-l-2 border-white/20 pl-3.5 space-y-0.5">
                                    <h4 className="text-xs sm:text-[13px] font-medium text-white font-sans">{t('about.edu1Title')}</h4>
                                    <p className="text-[11px] text-neutral-400 font-mono">{t('about.edu1Desc')}</p>
                                </div>
                                <div className="border-l-2 border-white/10 pl-3.5 space-y-0.5">
                                    <h4 className="text-xs sm:text-[13px] font-medium text-white font-sans">{t('about.edu2Title')}</h4>
                                    <p className="text-[11px] text-neutral-400 font-mono">{t('about.edu2Desc')}</p>
                                </div>
                            </div>
                        </BentoCard>

                        {/* Card Hora Local (Flip 3D) */}
                        <BentoCard className="p-5 md:p-6 flex-1 flex flex-col justify-between">
                            <div className="relative w-full h-full min-h-[120px] [perspective:1000px]">
                                <div
                                    className={`w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
                                        isClockFlipped ? '[transform:rotateY(180deg)]' : ''
                                    }`}
                                >
                                    {/* Frente: Relógio com elegância de consola */}
                                    <div
                                        onClick={() => {
                                            playMechanicalKey(750, 0.04);
                                            setIsClockFlipped(true);
                                        }}
                                        className="w-full h-full [backface-visibility:hidden] flex flex-col justify-between cursor-pointer group/clock select-none"
                                        title="Clique para ver especificações da workstation"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                                                {lang === 'en' ? 'LOCAL TIME (UTC-3)' : 'HORA LOCAL (UTC-3)'}
                                            </span>
                                            <span className="text-[10px] font-mono text-neutral-500 group-hover/clock:text-neutral-300 transition-colors flex items-center gap-1">
                                                specs ↻
                                            </span>
                                        </div>

                                        <div className="my-auto py-1">
                                            <LiveClock lang={lang} />
                                        </div>

                                        <div className="text-xs text-neutral-400 font-mono flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                                            <span>Fortaleza, CE — Brasil</span>
                                        </div>
                                    </div>

                                    {/* Verso: Telemetria de Hardware da Workstation */}
                                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between p-1 bg-black/40 rounded-xl">
                                        <div className="flex items-center justify-between border-b border-white/[0.06] pb-1.5 mb-1.5">
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                <span className="text-[10px] font-mono font-medium text-neutral-300 uppercase tracking-wider">
                                                    // WORKSTATION TELEMETRY
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
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
                                            <div className="bg-white/[0.02] p-1.5 rounded border border-white/[0.05]">
                                                <span className="text-[9px] text-neutral-500 block">CHIPSET</span>
                                                <span className="text-neutral-200 font-medium">Ryzen 5 3500X</span>
                                            </div>
                                            <div className="bg-white/[0.02] p-1.5 rounded border border-white/[0.05]">
                                                <span className="text-[9px] text-neutral-500 block">GPU</span>
                                                <span className="text-neutral-200 font-medium">Radeon RX 580</span>
                                            </div>
                                            <div className="bg-white/[0.02] p-1.5 rounded border border-white/[0.05]">
                                                <span className="text-[9px] text-neutral-500 block">DISPLAY</span>
                                                <span className="text-neutral-200 font-medium">180Hz Display</span>
                                            </div>
                                            <div className="bg-white/[0.02] p-1.5 rounded border border-white/[0.05]">
                                                <span className="text-[9px] text-neutral-500 block">PERIFÉRICO</span>
                                                <span className="text-neutral-200 font-medium">Rapoo VT7 @ 1000Hz</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </BentoCard>

                    </div>
                </div>

                {/* ── Grid Independente de Métricas Estatísticas (Padrão Unificado) ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-5"
                >
                    {aboutMetrics.map((m, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-3.5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.10] hover:bg-white/[0.04] transition-all"
                        >
                            {/* Box do Ícone */}
                            <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-neutral-300 shrink-0">
                                <i className={`${m.icon} text-sm`} />
                            </div>
                            {/* Texto da Métrica */}
                            <div className="flex flex-col min-w-0">
                                <span className="font-mono text-base md:text-lg font-bold text-white tracking-tight">
                                    <AnimatedCounter targetValue={m.value} suffix={m.suffix} isVisible={isSectionVisible} />
                                </span>
                                <span className="text-[11px] text-neutral-400 font-sans truncate" title={m.label}>
                                    {m.label}
                                </span>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* ── Grid Inferior: 3 Pilares de Especialidades (grid-cols-1 md:grid-cols-3 gap-5) ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {pillars.map((p, idx) => (
                        <BentoCard key={idx} className="p-5 md:p-6 h-full flex flex-col justify-between">
                            <div>
                                <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-3 text-neutral-300">
                                    <i className={`${p.icon} text-xs`} />
                                </div>
                                <h4 className="text-base font-semibold text-white font-serif mb-1.5">
                                    {p.title}
                                </h4>
                                <p className="text-neutral-400 text-xs sm:text-[13px] leading-relaxed mb-4">
                                    {p.desc}
                                </p>
                            </div>

                            {/* TechChips Canônicos com Bridge ao Terminal */}
                            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.04]">
                                {p.tags.map((tag, tIdx) => (
                                    <button
                                        key={tIdx}
                                        type="button"
                                        onClick={() => handleTechChipClick(tag)}
                                        className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.07] text-neutral-300 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.14] font-mono text-[11px] transition-colors select-none cursor-pointer flex items-center gap-1 active:scale-95"
                                        title={`Perguntar ao Copilot sobre ${tag}`}
                                    >
                                        <span>{tag}</span>
                                    </button>
                                ))}
                            </div>
                        </BentoCard>
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
