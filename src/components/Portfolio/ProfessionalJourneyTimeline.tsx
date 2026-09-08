import React, { useRef, useState, memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import JourneyPhotoModal, { JourneyMilestoneArchive } from './JourneyPhotoModal';
import TechCompanionCritter from './TechCompanionCritter';

/** Faz highlight de métricas numéricas e termos técnicos-chave no texto */
function HighlightedText({ text }: { text: string }) {
    const pattern = /(\d+[\+\-]?\s*(?:ms|s|%|usuários|bugs|travamentos|Endpoints)?(?:\s*diários)?|<\d+ms|N\+1|100\+|8\+|Multi-tenant|RBAC|ZPE|ePita)/g;
    const parts = text.split(pattern);
    return (
        <>
            {parts.map((part, i) =>
                pattern.test(part) ? (
                    <span key={i} className="text-secondary font-semibold font-mono">
                        {part}
                    </span>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </>
    );
}

/** Card de Experiência com Micro-tilt 3D Suave */
const TimelineExperienceCard = memo(function TimelineExperienceCard({
    company,
    role,
    period,
    isCurrent,
    techBadges,
    groups,
    lang,
}: {
    company: string;
    role: string;
    period: string;
    isCurrent?: boolean;
    techBadges?: string[];
    groups?: { title: string; icon?: string; items: string[] }[];
    lang: string;
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const rectRef = useRef<DOMRect | null>(null);
    const xPct = useMotionValue(0);
    const yPct = useMotionValue(0);

    const springConfig = { damping: 24, stiffness: 200, mass: 0.4 };
    const xSpring = useSpring(xPct, springConfig);
    const ySpring = useSpring(yPct, springConfig);

    const rotateX = useTransform(ySpring, [-0.5, 0.5], ['3deg', '-3deg']);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], ['-3deg', '3deg']);

    const handleMouseEnter = () => {
        if (cardRef.current) {
            rectRef.current = cardRef.current.getBoundingClientRect();
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        if (!rectRef.current) {
            rectRef.current = cardRef.current.getBoundingClientRect();
        }
        const rect = rectRef.current;
        xPct.set((e.clientX - rect.left) / rect.width - 0.5);
        yPct.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
        rectRef.current = null;
        xPct.set(0);
        yPct.set(0);
    };

    return (
        <div style={{ perspective: 1000 }} className="w-full">
            <motion.div
                ref={cardRef}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                }}
                data-cursor-card="true"
                className="bg-white/[0.02] border border-white/[0.08] hover:border-accent/50 transition-colors duration-300 shadow-2xl rounded-2xl overflow-hidden group will-change-transform backdrop-blur-sm"
            >
                {/* Cabeçalho do Card */}
                <div className="p-6 sm:p-7 border-b border-white/[0.06] bg-white/[0.015]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl sm:text-2xl font-bold font-serif text-white group-hover:text-secondary transition-colors">
                                {company}
                            </h3>
                            {isCurrent && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-green-500/10 text-green-400 border border-green-500/30">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    {lang === 'en' ? 'Current Role' : lang === 'es' ? 'Puesto Actual' : 'Cargo Atual'}
                                </span>
                            )}
                        </div>
                        <span className="text-xs font-mono text-primary/70 bg-white/[0.03] px-3 py-1 rounded-md border border-white/[0.08] self-start sm:self-auto">
                            {period}
                        </span>
                    </div>

                    <p className="text-secondary font-medium text-sm sm:text-base font-sans mb-4">
                        {role}
                    </p>

                    {/* Tech Badges */}
                    {techBadges && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {techBadges.map((badge, bIdx) => (
                                <span
                                    key={bIdx}
                                    className="text-[11px] font-mono text-primary/80 bg-primary/10 px-2.5 py-0.5 rounded border border-primary/20"
                                >
                                    {badge}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Grupos de Atuação / Responsabilidades */}
                {groups && groups.length > 0 && (
                    <div className="p-6 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.01]">
                        {groups.map((group, gIdx) => (
                            <div key={gIdx} className="space-y-2.5">
                                <div className="flex items-center gap-2 text-accent font-semibold text-xs tracking-wider uppercase font-sans">
                                    <i className={`${group.icon || 'fas fa-check-circle'} text-[11px]`} />
                                    <span>{group.title}</span>
                                </div>
                                <ul className="space-y-2">
                                    {group.items && group.items.map((item, iIdx) => (
                                        <li key={iIdx} className="text-gray-300 text-xs sm:text-sm leading-relaxed flex items-start gap-2">
                                            <span className="text-accent mt-1.5 text-[8px] shrink-0">•</span>
                                            <span><HighlightedText text={item} /></span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
});

interface ProfessionalJourneyTimelineProps {
    experiences?: any[];
}

export const ProfessionalJourneyTimeline: React.FC<ProfessionalJourneyTimelineProps> = ({ experiences = [] }) => {
    const { t, lang } = useLanguage();
    const sectionRef = useRef<HTMLElement>(null);
    const timelineTrackRef = useRef<HTMLDivElement>(null);
    const [selectedArchive, setSelectedArchive] = useState<JourneyMilestoneArchive | null>(null);

    // ── CALIBRAÇÃO DO PROGRESSO ADIANTADO & FÍSICA DE MOLA ──
    // O trajeto inicia imediatamente quando o topo do container alcança a borda inferior da tela (100%)
    // e conclui antecipadamente (70%), mantendo a bolinha e o feixe sempre bem à frente do olhar
    const { scrollYProgress } = useScroll({
        target: timelineTrackRef,
        offset: ['start 100%', 'end 70%'],
    });

    // Mola ultrarrápida com resposta instantânea e peso orgânico
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 450,
        damping: 26,
        mass: 0.06,
    });

    // Mapeamento hiper-adiantado: o puck e o feixe cruzam os marcos à frente do leitor
    const trackerTop = useTransform(smoothProgress, [0, 0.72], ['0%', '100%'], { clamp: true });
    const lineHeight = useTransform(smoothProgress, [0, 0.72], ['0%', '100%'], { clamp: true });

    // Micro-escalas reativas nos anos monumentais (sincronizadas com o percurso adiantado)
    const year2026Scale = useTransform(smoothProgress, [0, 0.04, 0.10], [1, 1.05, 1]);
    const year2025Scale = useTransform(smoothProgress, [0.26, 0.34, 0.42], [1, 1.05, 1]);
    const year2024Scale = useTransform(smoothProgress, [0.60, 0.68, 0.76], [1, 1.05, 1]);

    // Reatividade orgânica dos nós de estação (2026, 2025, 2024) sincronizados com o puck adiantado:
    // Marco 2026: acende prontamente logo no primeiro scroll
    const node2026Border = useTransform(smoothProgress, [0, 0.04], ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.85)']);
    const node2026Bg = useTransform(smoothProgress, [0, 0.04], ['rgba(255,255,255,0.3)', '#ffffff']);
    const node2026Shadow = useTransform(smoothProgress, [0, 0.04], ['0 0 0px rgba(255,255,255,0)', '0 0 12px rgba(255,255,255,0.4)']);
    const node2026Scale = useTransform(smoothProgress, [0, 0.04], [1, 1.1]);

    // Marco central de 2025 (Qualisoft): acende no exato momento em que o puck passa por ele (~48% da altura do trilho)
    const node2025Border = useTransform(smoothProgress, [0.28, 0.36], ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.85)']);
    const node2025Bg = useTransform(smoothProgress, [0.28, 0.36], ['rgba(255,255,255,0.3)', '#ffffff']);
    const node2025Shadow = useTransform(smoothProgress, [0.28, 0.36], ['0 0 0px rgba(255,255,255,0)', '0 0 12px rgba(255,255,255,0.4)']);
    const node2025Scale = useTransform(smoothProgress, [0.28, 0.36], [1, 1.1]);

    // Marco final de 2024 (EEEP): acende quando a bolinha atinge o pouso final na base da timeline
    const node2024Border = useTransform(smoothProgress, [0.62, 0.70], ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.85)']);
    const node2024Bg = useTransform(smoothProgress, [0.62, 0.70], ['rgba(255,255,255,0.3)', '#ffffff']);
    const node2024Shadow = useTransform(smoothProgress, [0.62, 0.70], ['0 0 0px rgba(255,255,255,0)', '0 0 12px rgba(255,255,255,0.4)']);
    const node2024Scale = useTransform(smoothProgress, [0.62, 0.70], [1, 1.1]);

    // Métricas executivas da trajetória
    const summaryStats = [
        {
            value: '10+ ' + (lang === 'en' ? 'Months' : 'Meses'),
            label: lang === 'en' ? 'Production experience' : lang === 'es' ? 'Experiencia en producción' : 'Experiência em produção',
            icon: 'fas fa-calendar-check',
        },
        {
            value: '100+ ' + (lang === 'en' ? 'Users' : lang === 'es' ? 'Usuarios' : 'Usuários'),
            label: lang === 'en' ? 'Daily on ERP systems' : lang === 'es' ? 'Diarios en sistemas ERP' : 'Diários em sistemas ERP',
            icon: 'fas fa-users',
        },
        {
            value: lang === 'en' ? '25% Fewer Bugs' : '25% Menos Bugs',
            label: lang === 'en' ? 'Via proactive QA' : lang === 'es' ? 'Vía QA preventivo' : 'Via QA preventivo',
            icon: 'fas fa-shield-alt',
        },
        {
            value: lang === 'en' ? '4× Faster' : lang === 'es' ? '4× Más Rápido' : '4× Mais Rápido',
            label: lang === 'en' ? 'Optimized queries (<500ms)' : lang === 'es' ? 'Consultas optimizadas (<500ms)' : 'Queries otimizadas (<500ms)',
            icon: 'fas fa-bolt',
        },
    ];

    // Registros fotográficos e operacionais associados a cada marco temporal
    const ARCHIVES: Record<string, JourneyMilestoneArchive> = {
        '2026': {
            id: 'archive-2026',
            year: '2026',
            company: 'SETE Tecnologia // ZPE Porto Logistics',
            role: 'Analista de QA & Testes de Software',
            archiveTitle: 'ZPE Logística Portuária // ePita QA Core',
            archiveSubtitle: 'Ambiente de Testes & Validação de Sistemas de Missão Crítica',
            image: '/projects/portlog-dash.png',
            badge: 'TESTES HOMOLOGADOS EM PRODUÇÃO',
            date: 'Jun 2026 — Presente',
            location: 'Fortaleza, CE // Remoto & Híbrido',
            description:
                'Ambiente operacional de garantia de qualidade para sistemas alfandegários e logísticos portuários. Execução de suites completas no Postman, mapeamento estrito de regras de negócio em ZPEs e auditoria de consistência em queries SQL Server de alta criticidade.',
            telemetry: [
                { label: 'Redução de Bugs', value: '25% Menos Regressões', highlight: true },
                { label: 'Endpoints Auditados', value: '100+ Endpoints' },
                { label: 'Queries Validadas', value: '<50ms Tempo Médio' },
                { label: 'Metodologia', value: 'Scrum / Kanban' },
            ],
            tags: ['#QA-ENGINEERING', '#SQL-SERVER', '#POSTMAN', '#TEST-REGRESSIVO', '#SCRUM-KANBAN'],
        },
        '2025': {
            id: 'archive-2025',
            year: '2025',
            company: 'Qualisoft Sistemas // ERP & Fiscal Solutions',
            role: 'Desenvolvedor Back-End (PHP / Delphi / SQL)',
            archiveTitle: 'Modernização de Legados // Delphi 11 + UniGui + Laravel',
            archiveSubtitle: 'Engenharia de Migração Desktop-to-Web e Tuning de Banco',
            image: '/unigui_migration_mockup.jpg',
            badge: 'MODERNIZAÇÃO CONCLUÍDA',
            date: 'Ago 2025 — Jun 2026',
            location: 'Fortaleza, CE',
            description:
                'Bancada de desenvolvimento e modernização de arquitetura monolítica legado Delphi para Web via UniGui e APIs Laravel. Refatoração de relatórios pesados de 2s para <500ms com índices compostos em SQL Server/MySQL e integração de mensageria fiscal ACBr.',
            telemetry: [
                { label: 'Otimização Queries', value: '4× Mais Rápido', highlight: true },
                { label: 'Tempo de Resposta', value: '<500ms (antes 2s)' },
                { label: 'Usuários Ativos', value: '100+ Diários' },
                { label: 'Arquitetura', value: 'UniGui + Laravel REST' },
            ],
            tags: ['#LEGACY-MODERNIZATION', '#DELPHI-11', '#LARAVEL-PHP', '#REACT-TS', '#SQL-SERVER'],
        },
        '2024': {
            id: 'archive-2024',
            year: '2024',
            company: 'EEEP Luiza de Teodoro Vieira',
            role: 'Ensino Médio Integrado ao Técnico em Informática',
            archiveTitle: 'Formação Técnica // EEEP Luiza de Teodoro Vieira',
            archiveSubtitle: 'Ensino Médio Integrado ao Técnico em Informática (2023 — 2025)',
            image: '/java_inventory_mockup.png',
            badge: 'FORMAÇÃO TÉCNICA (2023 — 2025)',
            date: 'Jan 2023 — Dez 2025',
            location: 'Pacatuba, CE',
            description:
                'Período formativo integral na EEEP Luiza de Teodoro Vieira. Estudos práticos e consolidados em lógica e algoritmos, programação com Python e Java, desenvolvimento web (HTML5, CSS3, JavaScript), fundamentos de UI/UX Design e projetos de robótica e automação.',
            telemetry: [
                { label: 'Linguagens Base', value: 'Python & Java', highlight: true },
                { label: 'Desenvolvimento Web', value: 'HTML, CSS & JS' },
                { label: 'Design & Hardware', value: 'UI/UX & Robótica' },
                { label: 'Ciclo Formativo', value: '2023 — 2025 (Concluído)' },
            ],
            tags: ['#EEEP-LUIZA-TEODORO', '#TECNICO-INFORMATICA', '#PYTHON', '#JAVA', '#HTML-CSS-JS', '#ROBOTICA', '#DESIGN'],
        },
    };

    // Dados dinâmicos para cada um dos 3 marcos (2026, 2025, 2024)
    const seteExp = experiences.find(e => e.id === 2) || {
        company: 'SETE Tecnologia',
        role: 'Analista de Qualidade de Software (QA) e Testes — Estágio',
        period: 'Junho de 2026 - Presente',
        techBadges: ['QA', 'Testes de Regressão', 'Postman', 'APIs RESTful', 'SQL Server', 'Scrum / Kanban', 'Engenharia de Requisitos'],
        groups: [
            {
                title: 'Garantia de Qualidade & Requisitos',
                icon: 'fas fa-shield-alt',
                items: [
                    'Atuação em sistemas de missão crítica no setor logístico e portuário (ZPEs).',
                    'Mapeamento de 100% dos requisitos operacionais e regras de negócio com múltiplos setores.',
                    'Execução de testes funcionais e de regressão ágeis blindando entregas de software.',
                ],
            },
            {
                title: 'Validação de APIs & SQL',
                icon: 'fas fa-database',
                items: [
                    'Consumo e testes de integração de serviços RESTful com collections estruturadas no Postman.',
                    'Execução de queries diagnósticas e validação de transações no core ePita com SQL Server.',
                ],
            },
        ],
    };

    const qualiExp = experiences.find(e => e.id === 1) || {
        company: 'Qualisoft Sistemas',
        role: 'Desenvolvedor Back-End (PHP / Delphi / SQL) — Estágio',
        period: 'Agosto de 2025 - Junho de 2026',
        techBadges: ['PHP / Laravel', 'Delphi 11', 'UniGui', 'MySQL', 'SQL Server', 'ACBr', 'RESTful APIs', 'FortesReport'],
        groups: [
            {
                title: 'Otimização de Banco & Performance',
                icon: 'fas fa-tachometer-alt',
                items: [
                    'Refatoração de consultas SQL Server/MySQL reduzindo tempo de relatórios de 2s para <500ms.',
                    'Criação de procedures e views analíticas para ERP com centenas de operações diárias.',
                ],
            },
            {
                title: 'Back-End & Modernização Web',
                icon: 'fas fa-sync-alt',
                items: [
                    'Engenharia de migração de monolito Delphi VCL para arquitetura Web moderna com Delphi 11 + UniGui.',
                    'Construção de APIs RESTful em Laravel e integração fiscal ACBr para NF-e/NFC-e.',
                ],
            },
        ],
    };

    const tecnicoExp = {
        company: 'EEEP Luiza de Teodoro Vieira',
        role: 'Ensino Médio Integrado ao Técnico em Informática',
        period: 'Janeiro de 2023 - Dezembro de 2025',
        techBadges: ['Python', 'Java', 'HTML5', 'CSS3', 'JavaScript', 'Robótica', 'UI/UX Design', 'Algoritmos', 'Lógica de Programação'],
        groups: [
            {
                title: 'Programação & Desenvolvimento Web',
                icon: 'fas fa-code',
                items: [
                    'Formação prática e contínua em lógica algorítmica, estruturas de dados e programação orientada a objetos com Python e Java.',
                    'Construção de aplicações e interfaces web aplicando padrões semânticos de HTML5, estilização moderna com CSS3 e dinamismo com JavaScript.',
                ],
            },
            {
                title: 'Design, Robótica & Projetos Práticos',
                icon: 'fas fa-robot',
                items: [
                    'Desenvolvimento e montagem de projetos práticos de robótica e circuitos integrando automação e hardware programável.',
                    'Conceitos fundamentais de UI/UX Design, prototipagem visual e princípios de organização e código limpo.',
                ],
            },
        ],
    };

    return (
        <section
            id="experiencia"
            ref={sectionRef}
            className="py-20 md:py-28 bg-transparent relative border-t border-white/[0.06] overflow-hidden"
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">

                {/* ── Section Header com Easter Egg Sentinela 1 ── */}
                <div className="relative text-center mb-14">
                    <div className="flex justify-center mb-4">
                        <TechCompanionCritter
                            variant="sentinel-timeline"
                            captionPosition="top"
                            className="transition-transform duration-300 hover:scale-105"
                        />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.65 }}
                    >
                        <span className="text-accent text-[11px] font-semibold tracking-[0.25em] uppercase mb-2 block font-sans">
                            {t('experience.tag') || 'TRAJETÓRIA // MY JOURNEY'}
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-4">
                            {t('experience.title') || 'Trajetória Profissional'}
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto font-sans text-sm sm:text-base">
                            {t('experience.subtitle') || 'Evolução técnica contínua: do domínio de engenharia e modernização de legados à garantia de qualidade em ambientes de missão crítica.'}
                        </p>
                    </motion.div>
                </div>

                {/* ── Career Summary Stats Strip ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
                >
                    {summaryStats.map((stat, idx) => (
                        <div
                            key={idx}
                            data-cursor-card="true"
                            className="bg-white/[0.02] border border-white/[0.08] backdrop-blur-sm rounded-xl p-4 flex items-center gap-3.5 hover:border-accent/40 transition-all duration-200 shadow-lg"
                        >
                            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                                <i className={`${stat.icon} text-accent text-sm`} />
                            </div>
                            <div>
                                <div className="text-sm sm:text-base font-bold text-white font-mono">{stat.value}</div>
                                <div className="text-[11px] text-gray-400 leading-tight font-sans">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* ── Espinha Dorsal Central & Timeline Alternada (Zig-Zag) ── */}
                <div ref={timelineTrackRef} className="relative w-full max-w-5xl mx-auto py-12">

                    {/* ══════════════════════════════════════════════════════════
                        TRILHO CENTRAL MINIMALISTA (md+) — FILAMENTO FINO DE 2PX
                        Sincronia suave 1:1 focal com o centro da tela
                        ══════════════════════════════════════════════════════════ */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-[2px] hidden md:block pointer-events-none z-10">
                        {/* 1. Trilho Base Guia (Filamento escuro sutil de fundo) */}
                        <div className="absolute inset-0 bg-white/10 rounded-full" />

                        {/* 2. Feixe Ativo Preenchido (Gradiente luminoso que desce suavemente) */}
                        <motion.div
                            className="absolute top-0 left-0 right-0 bg-gradient-to-b from-white via-white/80 to-white/30 rounded-full origin-top"
                            style={{ height: lineHeight }}
                        />

                        {/* 3. Puck / Marcador Rastreador (Ponto tátil que lidera a leitura) */}
                        <motion.div
                            className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)] border-2 border-[#090b10] flex items-center justify-center -translate-y-1/2 z-20"
                            style={{ top: trackerTop }}
                        >
                            <div className="w-1 h-1 rounded-full bg-[#090b10]" />
                        </motion.div>
                    </div>

                    {/* ══════════════════════════════════════════════════════════
                        TRILHO LATERAL MINIMALISTA (< md)
                        ══════════════════════════════════════════════════════════ */}
                    <div className="absolute left-4 sm:left-6 top-4 bottom-4 w-[2px] md:hidden pointer-events-none z-10">
                        {/* 1. Trilho Base Guia Mobile */}
                        <div className="absolute inset-0 bg-white/10 rounded-full" />

                        {/* 2. Feixe Ativo Mobile */}
                        <motion.div
                            className="absolute top-0 left-0 right-0 bg-gradient-to-b from-white via-white/80 to-white/30 rounded-full origin-top"
                            style={{ height: lineHeight }}
                        />

                        {/* 3. Puck Mobile */}
                        <motion.div
                            className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)] border-2 border-[#090b10] flex items-center justify-center -translate-y-1/2 z-20"
                            style={{ top: trackerTop }}
                        >
                            <div className="w-1 h-1 rounded-full bg-[#090b10]" />
                        </motion.div>
                    </div>

                    {/* Grid / Itens da Timeline: 2026, 2025, 2024 */}
                    <div className="space-y-24 md:space-y-36 pl-8 sm:pl-12 md:pl-0">

                        {/* ══════════════════════════════════════════════════════════
                            MARCO 2026: SETE TECNOLOGIA (Analista de QA & Testes)
                            Desktop: Esquerda = Ano 2026 + Pasta | Direita = Card QA
                            ══════════════════════════════════════════════════════════ */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center"
                        >
                            {/* Nó Central de Conexão do Marco 2026 (Desktop md+) */}
                            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 items-center justify-center z-30 pointer-events-none">
                                <motion.div
                                    style={{
                                        borderColor: node2026Border,
                                        boxShadow: node2026Shadow,
                                        scale: node2026Scale,
                                    }}
                                    className="w-6 h-6 rounded-full border-2 bg-[#090b10] flex items-center justify-center transition-colors duration-200"
                                >
                                    <motion.div
                                        style={{ backgroundColor: node2026Bg }}
                                        className="w-2 h-2 rounded-full transition-colors duration-200"
                                    />
                                </motion.div>
                            </div>

                            {/* Nó Lateral Mobile 2026 (< md) */}
                            <div className="md:hidden absolute -left-7 sm:-left-11 top-1/2 -translate-y-1/2 flex items-center justify-center z-30 pointer-events-none">
                                <motion.div
                                    style={{
                                        borderColor: node2026Border,
                                        boxShadow: node2026Shadow,
                                        scale: node2026Scale,
                                    }}
                                    className="w-5 h-5 rounded-full border-2 bg-[#090b10] flex items-center justify-center transition-colors duration-200"
                                >
                                    <motion.div
                                        style={{ backgroundColor: node2026Bg }}
                                        className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
                                    />
                                </motion.div>
                            </div>

                            {/* Lado Esquerdo: Ano Escultural Monumental + Botão de Pasta Técnica */}
                            <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-3">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-green-500/10 text-green-400 border border-green-500/30">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    <span>ATUALMENTE // EM PRODUÇÃO</span>
                                </div>

                                {/* Ano Monumental em Outline com micro-escala reativa */}
                                <motion.span
                                    style={{
                                        scale: year2026Scale,
                                        WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.25)',
                                        textShadow: '0 0 40px rgba(255,255,255,0.05)',
                                    }}
                                    className="text-6xl sm:text-7xl md:text-8xl font-mono font-black text-transparent select-none tracking-tight block origin-center md:origin-right"
                                >
                                    2026
                                </motion.span>

                                <p className="text-xs font-mono text-gray-400 max-w-xs">
                                    Garantia de qualidade, mapeamento de regras operacionais em ZPEs e validação de transações no core ePita.
                                </p>

                                {/* Botão de Pasta Interativo: Registro Operacional */}
                                <button
                                    onClick={() => setSelectedArchive(ARCHIVES['2026'])}
                                    data-cursor-morph="true"
                                    className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-accent/15 border border-white/15 hover:border-accent/40 text-xs font-mono text-gray-200 hover:text-white transition-all duration-300 shadow-md group cursor-pointer active:scale-95"
                                >
                                    <span className="text-base group-hover:scale-110 transition-transform">🗂️</span>
                                    <span className="font-semibold tracking-wide">Registro Operacional</span>
                                    <span className="text-[10px] text-accent group-hover:translate-x-0.5 transition-transform">// Ver Arquivo</span>
                                </button>
                            </div>

                            {/* Lado Direito: Card Detalhado de QA */}
                            <div>
                                <TimelineExperienceCard
                                    company={seteExp.company}
                                    role={seteExp.role}
                                    period={seteExp.period}
                                    isCurrent={true}
                                    techBadges={seteExp.techBadges}
                                    groups={seteExp.groups}
                                    lang={lang}
                                />
                            </div>
                        </motion.div>

                        {/* ══════════════════════════════════════════════════════════
                            MARCO 2025: QUALISOFT SISTEMAS (Back-End / Fullstack)
                            Desktop: Esquerda = Card Qualisoft | Direita = Ano 2025 + Pasta
                            ══════════════════════════════════════════════════════════ */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center"
                        >
                            {/* Nó Central de Conexão do Marco 2025 (Desktop md+) */}
                            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 items-center justify-center z-30 pointer-events-none">
                                <motion.div
                                    style={{
                                        borderColor: node2025Border,
                                        boxShadow: node2025Shadow,
                                        scale: node2025Scale,
                                    }}
                                    className="w-6 h-6 rounded-full border-2 bg-[#090b10] flex items-center justify-center transition-colors duration-200"
                                >
                                    <motion.div
                                        style={{ backgroundColor: node2025Bg }}
                                        className="w-2 h-2 rounded-full transition-colors duration-200"
                                    />
                                </motion.div>
                            </div>

                            {/* Nó Lateral Mobile 2025 (< md) */}
                            <div className="md:hidden absolute -left-7 sm:-left-11 top-1/2 -translate-y-1/2 flex items-center justify-center z-30 pointer-events-none">
                                <motion.div
                                    style={{
                                        borderColor: node2025Border,
                                        boxShadow: node2025Shadow,
                                        scale: node2025Scale,
                                    }}
                                    className="w-5 h-5 rounded-full border-2 bg-[#090b10] flex items-center justify-center transition-colors duration-200"
                                >
                                    <motion.div
                                        style={{ backgroundColor: node2025Bg }}
                                        className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
                                    />
                                </motion.div>
                            </div>

                            {/* Lado Esquerdo (Desktop): Card Detalhado Qualisoft */}
                            <div className="order-2 md:order-1">
                                <TimelineExperienceCard
                                    company={qualiExp.company}
                                    role={qualiExp.role}
                                    period={qualiExp.period}
                                    isCurrent={false}
                                    techBadges={qualiExp.techBadges}
                                    groups={qualiExp.groups}
                                    lang={lang}
                                />
                            </div>

                            {/* Lado Direito (Desktop): Ano 2025 Monumental + Botão de Pasta Técnica */}
                            <div className="order-1 md:order-2 flex flex-col items-center md:items-start text-center md:text-left space-y-3">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-accent/10 text-secondary border border-accent/30">
                                    <i className="fas fa-check text-[10px]" />
                                    <span>CONCLUÍDO COM SUCESSO</span>
                                </div>

                                {/* Ano Monumental em Outline com micro-escala reativa */}
                                <motion.span
                                    style={{
                                        scale: year2025Scale,
                                        WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.25)',
                                        textShadow: '0 0 40px rgba(255,255,255,0.05)',
                                    }}
                                    className="text-6xl sm:text-7xl md:text-8xl font-mono font-black text-transparent select-none tracking-tight block origin-center md:origin-left"
                                >
                                    2025
                                </motion.span>

                                <p className="text-xs font-mono text-gray-400 max-w-xs">
                                    Modernização monolito Desktop VCL para Web via UniGui, APIs Laravel e tuning de queries de 2s para &lt;500ms.
                                </p>

                                {/* Botão de Pasta Interativo: Arquivo de Desenvolvimento */}
                                <button
                                    onClick={() => setSelectedArchive(ARCHIVES['2025'])}
                                    data-cursor-morph="true"
                                    className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-accent/15 border border-white/15 hover:border-accent/40 text-xs font-mono text-gray-200 hover:text-white transition-all duration-300 shadow-md group cursor-pointer active:scale-95"
                                >
                                    <span className="text-base group-hover:scale-110 transition-transform">🗂️</span>
                                    <span className="font-semibold tracking-wide">Arquivo de Desenvolvimento</span>
                                    <span className="text-[10px] text-accent group-hover:translate-x-0.5 transition-transform">// Ver Arquivo</span>
                                </button>
                            </div>
                        </motion.div>

                        {/* ══════════════════════════════════════════════════════════
                            MARCO 2024: EEEP LUIZA DE TEODORO VIEIRA (Formação Técnica)
                            Desktop: Esquerda = Ano 2024 + Pasta | Direita = Card Acadêmico
                            ══════════════════════════════════════════════════════════ */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center"
                        >
                            {/* Nó Central de Conexão do Marco 2024 (Desktop md+) */}
                            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 items-center justify-center z-30 pointer-events-none">
                                <motion.div
                                    style={{
                                        borderColor: node2024Border,
                                        boxShadow: node2024Shadow,
                                        scale: node2024Scale,
                                    }}
                                    className="w-6 h-6 rounded-full border-2 bg-[#090b10] flex items-center justify-center transition-colors duration-200"
                                >
                                    <motion.div
                                        style={{ backgroundColor: node2024Bg }}
                                        className="w-2 h-2 rounded-full transition-colors duration-200"
                                    />
                                </motion.div>
                            </div>

                            {/* Nó Lateral Mobile 2024 (< md) */}
                            <div className="md:hidden absolute -left-7 sm:-left-11 top-1/2 -translate-y-1/2 flex items-center justify-center z-30 pointer-events-none">
                                <motion.div
                                    style={{
                                        borderColor: node2024Border,
                                        boxShadow: node2024Shadow,
                                        scale: node2024Scale,
                                    }}
                                    className="w-5 h-5 rounded-full border-2 bg-[#090b10] flex items-center justify-center transition-colors duration-200"
                                >
                                    <motion.div
                                        style={{ backgroundColor: node2024Bg }}
                                        className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
                                    />
                                </motion.div>
                            </div>

                            {/* Lado Esquerdo: Ano 2024 Monumental + Botão de Pasta Técnica */}
                            <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-3">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-white/5 text-primary border border-white/10">
                                    <i className="fas fa-graduation-cap text-[10px]" />
                                    <span>ENSINO MÉDIO & TÉCNICO // 2023 - 2025</span>
                                </div>

                                {/* Ano Monumental em Outline com micro-escala reativa */}
                                <motion.span
                                    style={{
                                        scale: year2024Scale,
                                        WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.25)',
                                        textShadow: '0 0 40px rgba(255,255,255,0.05)',
                                    }}
                                    className="text-6xl sm:text-7xl md:text-8xl font-mono font-black text-transparent select-none tracking-tight block origin-center md:origin-right"
                                >
                                    2024
                                </motion.span>

                                <p className="text-xs font-mono text-gray-400 max-w-xs">
                                    Ensino Médio e Técnico em Informática na EEEP Luiza de Teodoro Vieira: programação com Python e Java, web com HTML/CSS/JS, robótica e design.
                                </p>

                                {/* Botão de Pasta Interativo: Registro Técnico */}
                                <button
                                    onClick={() => setSelectedArchive(ARCHIVES['2024'])}
                                    data-cursor-morph="true"
                                    className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-accent/15 border border-white/15 hover:border-accent/40 text-xs font-mono text-gray-200 hover:text-white transition-all duration-300 shadow-md group cursor-pointer active:scale-95"
                                >
                                    <span className="text-base group-hover:scale-110 transition-transform">🗂️</span>
                                    <span className="font-semibold tracking-wide">Registro Técnico // EEEP</span>
                                    <span className="text-[10px] text-accent group-hover:translate-x-0.5 transition-transform">// Ver Arquivo</span>
                                </button>
                            </div>

                            {/* Lado Direito: Card do Técnico em Informática EEEP */}
                            <div>
                                <TimelineExperienceCard
                                    company={tecnicoExp.company}
                                    role={tecnicoExp.role}
                                    period={tecnicoExp.period}
                                    isCurrent={false}
                                    techBadges={tecnicoExp.techBadges}
                                    groups={tecnicoExp.groups}
                                    lang={lang}
                                />
                            </div>
                        </motion.div>

                    </div>
                </div>

            </div>

            {/* Modal / Lightbox de Registro Operacional */}
            <JourneyPhotoModal
                isOpen={Boolean(selectedArchive)}
                onClose={() => setSelectedArchive(null)}
                milestone={selectedArchive}
            />
        </section>
    );
};

export default ProfessionalJourneyTimeline;
