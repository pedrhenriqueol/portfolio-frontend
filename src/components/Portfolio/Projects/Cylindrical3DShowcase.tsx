import { useProjectPresentation } from '../../../hooks/useProjectPresentation';
import '../projects-focus.css';
import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useVelocity, useReducedMotion, type MotionValue } from 'framer-motion';
import MagneticButton from '../MagneticButton';
import { playMechanicalClick, playTabSwitch } from '../../../lib/sound';
import useSectionInView from '../../../hooks/useSectionInView';
import { useLanguage } from '../../../context/LanguageContext';

export interface ProjectHudMetric {
    value: string;
    label: string;
}

export interface FlagshipProject {
    id: number;
    title: string;
    tagline: string;
    stepLabel: string;
    badge: string;
    stat: string;
    metrics: [ProjectHudMetric, ProjectHudMetric];
    description: string;
    image: string;
    techs: string[];
    url: string;
    repo: string;
}

export const FLAGSHIP_CONFIGS: FlagshipProject[] = [
    {
        id: 101,
        title: 'PayStream Gateway',
        tagline: 'Motor Transacional de Pagamentos & Split de Liquidação',
        stepLabel: 'Motor Transacional',
        badge: 'Fintech de Alta Concorrência',
        stat: 'Idempotência Atômica',
        metrics: [
            { value: 'P2002 ACID', label: 'Idempotência Atômica' },
            { value: '100% Inteiro', label: 'Split em Centavos' },
        ],
        description: 'Gateway corporativo de pagamentos fintech com liquidação de split multipartes em centavos inteiros, idempotência atômica via restrição P2002 no PostgreSQL e webhooks assinados com HMAC-SHA256 com proteção contra timing attacks.',
        image: '/projects/paystream-dash.png',
        techs: ['Fastify', 'TypeScript', 'Prisma', 'PostgreSQL', 'HMAC-SHA256'],
        url: 'https://paystream-gateaway.vercel.app',
        repo: 'https://github.com/pedrhenriqueol/paystream-gateway',
    },
    {
        id: 102,
        title: 'PortLog OS',
        tagline: 'Operações Portuárias & Telemetria Industrial',
        stepLabel: 'Operações Portuárias',
        badge: 'Logística Portuária & ZPEs',
        stat: '100% FSM Válida',
        metrics: [
            { value: '100% FSM', label: 'Transições Válidas' },
            { value: 'Multi-Tenant', label: 'Isolamento por Terminal' },
        ],
        description: 'Sistema operacional portuário com governança multi-tenant estrita por terminal, máquina de estados finita (FSM) no Kanban de manutenção de guindastes pesados (STS/RTG) e telemetria preditiva IoT em tempo real.',
        image: '/projects/portlog-dash.png',
        techs: ['React', 'TypeScript', 'Fastify', 'Prisma', 'Multi-tenant', 'FSM'],
        url: 'https://portlog-os.vercel.app',
        repo: 'https://github.com/pedrhenriqueol/portlog-os',
    },
    {
        id: 103,
        title: 'SPECTR TestOps',
        tagline: 'Engenharia de Qualidade & Resiliência de APIs',
        stepLabel: 'Engenharia de Qualidade',
        badge: 'Observabilidade & TestOps',
        stat: 'NIST Nearest Rank Math',
        metrics: [
            { value: 'p50–p99 NIST', label: 'Telemetria de Cauda' },
            { value: 'Chaos Lab', label: 'Injeção de Falhas' },
        ],
        description: 'Plataforma corporativa de engenharia de testes com runner isolado, validação recursiva de esquemas OpenAPI/JSON Schema, testes de estresse no Chaos Lab e percentis de cauda p50/p90/p95/p99 padronizados pelo NIST.',
        image: '/projects/spectr-workbench.png',
        techs: ['React 18', 'TypeScript', 'OpenAPI', 'Chaos Lab', 'p95 SLA Math'],
        url: 'https://spectr-testops.vercel.app',
        repo: 'https://github.com/pedrhenriqueol/spectr-testops',
    },
];

export const FLAGSHIP_CONFIGS_I18N: Record<string, FlagshipProject[]> = {
    pt: FLAGSHIP_CONFIGS,
    en: [
        {
            id: 101,
            title: 'PayStream Gateway',
            tagline: 'Transactional Payment Engine & Settlement Split',
            stepLabel: 'Transaction Engine',
            badge: 'High-Concurrency Fintech',
            stat: 'Atomic Idempotency',
            metrics: [
                { value: 'P2002 ACID', label: 'Atomic Idempotency' },
                { value: '100% Integer', label: 'Full-Cent Split' },
            ],
            description: 'Enterprise fintech payment gateway featuring full-cent multipart split settlement, atomic idempotency via PostgreSQL P2002 constraint, and HMAC-SHA256 signed webhooks protected against timing attacks.',
            image: '/projects/paystream-dash.png',
            techs: ['Fastify', 'TypeScript', 'Prisma', 'PostgreSQL', 'HMAC-SHA256'],
            url: 'https://paystream-gateaway.vercel.app',
            repo: 'https://github.com/pedrhenriqueol/paystream-gateway',
        },
        {
            id: 102,
            title: 'PortLog OS',
            tagline: 'Port Operations & Industrial Telemetry',
            stepLabel: 'Port Operations',
            badge: 'Port Logistics & FTZ',
            stat: '100% Valid FSM',
            metrics: [
                { value: '100% FSM', label: 'Valid State Transitions' },
                { value: 'Multi-Tenant', label: 'Per-Terminal Isolation' },
            ],
            description: 'Port operating system with strict per-terminal multi-tenant governance, finite state machine (FSM) for heavy crane maintenance Kanban (STS/RTG), and real-time IoT predictive telemetry.',
            image: '/projects/portlog-dash.png',
            techs: ['React', 'TypeScript', 'Fastify', 'Prisma', 'Multi-tenant', 'FSM'],
            url: 'https://portlog-os.vercel.app',
            repo: 'https://github.com/pedrhenriqueol/portlog-os',
        },
        {
            id: 103,
            title: 'SPECTR TestOps',
            tagline: 'API Quality Engineering & Resilience Platform',
            stepLabel: 'Quality Engineering',
            badge: 'Observability & TestOps',
            stat: 'NIST Nearest Rank Math',
            metrics: [
                { value: 'p50–p99 NIST', label: 'Tail Latency Math' },
                { value: 'Chaos Lab', label: 'Fault Injection' },
            ],
            description: 'Enterprise test engineering platform featuring isolated test runner, recursive OpenAPI/JSON Schema validation, Chaos Lab resilience testing, and NIST-standardized tail latency percentiles (p50/p90/p95/p99).',
            image: '/projects/spectr-workbench.png',
            techs: ['React 18', 'TypeScript', 'OpenAPI', 'Chaos Lab', 'p95 SLA Math'],
            url: 'https://spectr-testops.vercel.app',
            repo: 'https://github.com/pedrhenriqueol/spectr-testops',
        },
    ],
    es: [
        {
            id: 101,
            title: 'PayStream Gateway',
            tagline: 'Motor Transaccional de Pagos y Split de Liquidación',
            stepLabel: 'Motor Transaccional',
            badge: 'Fintech de Alta Concurrencia',
            stat: 'Idempotencia Atómica',
            metrics: [
                { value: 'P2002 ACID', label: 'Idempotencia Atómica' },
                { value: '100% Entero', label: 'Split en Centavos' },
            ],
            description: 'Pasarela corporativa de pagos fintech con liquidación de split multipartes en centavos enteros, idempotencia atómica vía restricción P2002 en PostgreSQL y webhooks firmados con HMAC-SHA256 contra timing attacks.',
            image: '/projects/paystream-dash.png',
            techs: ['Fastify', 'TypeScript', 'Prisma', 'PostgreSQL', 'HMAC-SHA256'],
            url: 'https://paystream-gateaway.vercel.app',
            repo: 'https://github.com/pedrhenriqueol/paystream-gateway',
        },
        {
            id: 102,
            title: 'PortLog OS',
            tagline: 'Operaciones Portuarias y Telemetría Industrial',
            stepLabel: 'Operaciones Portuarias',
            badge: 'Logística Portuaria y ZPEs',
            stat: '100% FSM Válida',
            metrics: [
                { value: '100% FSM', label: 'Transiciones Válidas' },
                { value: 'Multi-Tenant', label: 'Aislamiento por Terminal' },
            ],
            description: 'Sistema operativo portuario con gobernanza multi-tenant estricta por terminal, máquina de estados finitos (FSM) en Kanban de mantenimiento de grúas pesadas (STS/RTG) y telemetría predictiva IoT en tiempo real.',
            image: '/projects/portlog-dash.png',
            techs: ['React', 'TypeScript', 'Fastify', 'Prisma', 'Multi-tenant', 'FSM'],
            url: 'https://portlog-os.vercel.app',
            repo: 'https://github.com/pedrhenriqueol/portlog-os',
        },
        {
            id: 103,
            title: 'SPECTR TestOps',
            tagline: 'Ingeniería de Calidad y Resiliencia de APIs',
            stepLabel: 'Ingeniería de Calidad',
            badge: 'Observabilidad y TestOps',
            stat: 'NIST Nearest Rank Math',
            metrics: [
                { value: 'p50–p99 NIST', label: 'Telemetría de Cola' },
                { value: 'Chaos Lab', label: 'Inyección de Fallos' },
            ],
            description: 'Plataforma corporativa de ingeniería de pruebas con ejecutor aislado, validación recursiva de esquemas OpenAPI/JSON Schema, pruebas de estrés en Chaos Lab y percentiles NIST p50/p90/p95/p99.',
            image: '/projects/spectr-workbench.png',
            techs: ['React 18', 'TypeScript', 'OpenAPI', 'Chaos Lab', 'p95 SLA Math'],
            url: 'https://spectr-testops.vercel.app',
            repo: 'https://github.com/pedrhenriqueol/spectr-testops',
        },
    ],
};

interface CylindricalCardProps {
    project: FlagshipProject;
    index: number;
    activeIndex: number;
    smoothProgress: MotionValue<number>;
    onSelect: (project: FlagshipProject) => void;
    onCardFocus: (index: number) => void;
    presenting: boolean;
    lang?: string;
}

/**
 * CylindricalCard - Card 3D individual com isolamento de empilhamento estrito,
 * separação espacial calibrada, cantoneiras HUD e métricas emolduradas (Proposta D).
 */
const CylindricalCard = memo(function CylindricalCard({
    project,
    index,
    activeIndex,
    smoothProgress,
    onSelect,
    onCardFocus,
    presenting,
    lang = 'pt',
}: CylindricalCardProps) {
    const isCurrent = index === activeIndex;
    const reducedMotion = useReducedMotion();
    const cardRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        // Keep keyboard navigation in the gallery when wheel movement retires a card.
        if (!isCurrent && cardRef.current?.contains(document.activeElement)) {
            cardRef.current.closest<HTMLElement>('section')?.focus({ preventScroll: true });
        }
    }, [isCurrent]);

    // ── 1. Gestão Estrita de Z-Index & Empilhamento ──
    const zIndex = isCurrent ? 50 : 20 - Math.abs(index - activeIndex);

    // ── 2. Calibração Espacial Tridimensional ──
    const translateX = useTransform(smoothProgress, (p: number) => `${(index - p) * 115}%`);
    const rotateY = useTransform(smoothProgress, (p: number) => `${(index - p) * -24}deg`);
    const translateZ = useTransform(smoothProgress, (p: number) => `${-Math.abs(index - p) * 220}px`);
    const scale = useTransform(smoothProgress, (p: number) => Math.max(0.86, 1 - Math.abs(index - p) * 0.14));
    const presentingScale = useTransform(smoothProgress, (p: number) => Math.max(0.935, 1 - Math.abs(index - p) * 0.065));
    const opacity = useTransform(smoothProgress, (p: number) => Math.max(0.2, 1 - Math.abs(index - p) * 0.6));
    const shadowOpacity = useTransform(smoothProgress, (p: number) => Math.max(0, 0.85 - Math.abs(index - p) * 0.45));

    const handleCardContainerClick = () => {
        if (!isCurrent) {
            onCardFocus(index);
        }
    };

    const formattedIndex = String(index + 1).padStart(2, '0');

    return (
        <motion.div
            style={{
                translateX,
                rotateY: presenting ? 0 : rotateY,
                translateZ: presenting ? 0 : translateZ,
                scale: presenting ? presentingScale : scale,
                opacity: presenting ? 1 : opacity,
                zIndex,
                isolation: 'isolate',
                transformStyle: presenting ? 'flat' : 'preserve-3d',
                transformOrigin: '50% 50%',
            }}
            onClick={handleCardContainerClick}
            className={`project-focus-card absolute top-0 left-1/2 -translate-x-1/2 w-[96%] sm:w-[86vw] md:w-[780px] lg:w-[860px] h-[680px] sm:h-[520px] md:h-[500px] will-change-transform select-none antialiased subpixel-antialiased ${
                isCurrent ? 'pointer-events-auto' : 'pointer-events-auto cursor-pointer'
            }`}
        >
            {/* Card Tridimensional Principal em Escala Monumental */}
            <div
                ref={cardRef}
                inert={!isCurrent}
                className={`portfolio-surface portfolio-card-hover w-full h-full overflow-hidden flex flex-col md:flex-row relative group transition-colors duration-300 ${
                    isCurrent
                        ? 'border-white/20 pointer-events-auto'
                        : 'border-white/5 pointer-events-none'
                }`}
            >
                {/* Cantoneiras Técnicas em L no card ativo */}
                {isCurrent && (
                    <div className="portfolio-hud-corners" aria-hidden="true">
                        <span className="portfolio-hud-corner-bl" />
                        <span className="portfolio-hud-corner-br" />
                    </div>
                )}

                {/* ── Lado Esquerdo: Área Visual e Preview Nítido ── */}
                <div className="w-full md:w-[46%] h-44 sm:h-52 md:h-full relative overflow-hidden bg-[#06080D] border-b md:border-b-0 md:border-r border-dashed border-white/15 shrink-0 pointer-events-none">
                    <img
                        src={project.image}
                        alt={project.title}
                        width={640}
                        height={400}
                        loading="lazy"
                        decoding="async"
                        className={`w-full h-full object-cover object-left-top transition-transform duration-500 ${reducedMotion ? "" : "group-hover:scale-[1.025]"}`}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = '/dashboard_placeholder.png';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0C0F17] via-transparent to-transparent opacity-35 pointer-events-none" />
                    
                    {/* Badge de Categoria com Indicador de Status ao Vivo */}
                    <div className="portfolio-chip-dashed absolute top-3.5 left-3.5 z-10 flex items-center gap-2 bg-darker/95 pointer-events-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        <span className="text-[10px] font-mono text-secondary">
                            {project.badge}
                        </span>
                    </div>
                </div>

                {/* ── Lado Direito: Especificações Técnicas, Métricas HUD e Anatomia Integrada ── */}
                <div className="p-5 sm:p-6 md:p-7 flex-1 flex flex-col justify-between overflow-hidden">
                    <div>
                        {/* Cabeçalho Interno: Índice 01 + Subtítulo Serif/Cursiva + Stat Chip */}
                        <div className="portfolio-project-meta flex items-center justify-between gap-3 mb-2">
                            <div className="flex items-baseline gap-2.5 min-w-0">
                                <span className="font-mono text-lg sm:text-xl font-semibold text-secondary leading-none tracking-tight">
                                    {formattedIndex}
                                </span>
                                <span className="text-white/20 font-mono text-xs">/</span>
                                <span className="font-serif italic text-xs sm:text-sm text-accent truncate">
                                    {project.badge}
                                </span>
                            </div>
                            <span className="portfolio-chip-dashed flex items-center gap-1.5 shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent/80" />
                                {project.stat}
                            </span>
                        </div>

                        {/* Título do Sistema */}
                        <h3 className="text-2xl sm:text-[28px] font-serif text-primary font-normal tracking-tight leading-tight mb-1 truncate">
                            {project.title}
                        </h3>

                        {/* Tagline de Arquitetura */}
                        <p className="text-secondary/90 text-xs sm:text-[13px] font-sans font-medium mb-2.5 truncate">
                            {project.tagline}
                        </p>

                        {/* Descrição Detalhada da Arquitetura */}
                        <p className="text-neutral-300 text-xs sm:text-[13px] leading-relaxed mb-3.5 font-sans line-clamp-2 md:line-clamp-3">
                            {project.description}
                        </p>

                        {/* ── Proposta D: 2 Blocos de Métrica/Arquitetura Emoldurados com Cantoneiras e Borda Tracejada ── */}
                        <div className="grid grid-cols-2 gap-2.5 mb-3.5">
                            {project.metrics.map((metric) => (
                                <div key={metric.label} className="portfolio-hud-metric">
                                    <span className="font-mono text-xs sm:text-[13px] font-semibold text-secondary block leading-tight">
                                        {metric.value}
                                    </span>
                                    <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-neutral-400 block mt-0.5 truncate">
                                        {metric.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Badges de Stack Técnica com Borda Tracejada */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {project.techs.map((tech) => (
                                <span
                                    key={tech}
                                    className="portfolio-chip-dashed"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* ── Rodapé Integrado: Ações Diretas no Card sem Interceptação ── */}
                    <div className="portfolio-hud-divider flex flex-wrap items-center gap-2.5 pt-3.5 mt-auto relative z-20">
                        {/* Botão Detalhes Técnicos */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(project);
                            }}
                            data-cursor-morph="true"
                            className="portfolio-control flex-1 min-w-[130px] py-2.5 px-3.5 font-semibold text-xs transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer relative z-30"
                        >
                            <i aria-hidden="true" className="fas fa-microchip text-xs" />
                            <span>{lang === 'en' ? 'Technical Details' : lang === 'es' ? 'Detalles Técnicos' : 'Detalhes Técnicos'}</span>
                        </button>
                        
                        {/* Botão Acessar Demonstração */}
                        <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            data-cursor-morph="true"
                            className="portfolio-button portfolio-button-primary flex-1 min-w-[150px] !min-h-[38px] !py-2.5 !px-4 font-semibold flex items-center justify-center gap-1.5 shadow-md relative z-30 cursor-pointer"
                        >
                            <span>{lang === 'en' ? 'Live Demo' : lang === 'es' ? 'Demostración en Vivo' : 'Acessar Demonstração'}</span>
                            <i aria-hidden="true" className="fas fa-external-link-alt text-[9px]" />
                        </a>

                        {/* Botão de Repositório GitHub */}
                        <a
                            href={project.repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            data-cursor-morph="true"
                            className="portfolio-control p-2.5 flex items-center justify-center shrink-0 relative z-30 cursor-pointer"
                            title={lang === 'en' ? 'Source Code on GitHub' : lang === 'es' ? 'Código Fuente en GitHub' : 'Código-Fonte no GitHub'}
                            aria-label={lang === 'en' ? `${project.title} source code on GitHub` : `Código-fonte de ${project.title} no GitHub`}
                        >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                            </svg>
                        </a>
                    </div>
                </div>
                {/* Shade the side cards without filtering their entire 3D surface. */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 z-40 rounded-2xl bg-black pointer-events-none transition-opacity duration-300"
                    style={{ opacity: isCurrent ? 0 : .6 }}
                />
            </div>

            {/* Sombra de Profundidade Projetada no Solo - estritamente no card ativo */}
            {isCurrent && (
                <motion.div
                    style={{ opacity: shadowOpacity, background: 'radial-gradient(ellipse at center, rgba(0,0,0,.68), transparent 70%)' }}
                    className="absolute -bottom-12 left-12 right-12 h-16 rounded-full pointer-events-none"
                    aria-hidden="true"
                />
            )}
        </motion.div>
    );
});


interface Cylindrical3DShowcaseProps {
    onSelectProject?: (project: FlagshipProject | Record<string, unknown>) => void;
    projects?: Array<FlagshipProject | (Record<string, unknown> & { id?: number })>;
}

/**
 * Cylindrical3DShowcase - Showcase Cilíndrico 3D em ESCALA MONUMENTAL
 */
export default function Cylindrical3DShowcase({ onSelectProject, projects = [] }: Cylindrical3DShowcaseProps) {
    const { lang = 'pt' } = useLanguage();
    const reducedMotion = useReducedMotion();
    const flagshipItems = FLAGSHIP_CONFIGS_I18N[lang] || FLAGSHIP_CONFIGS;
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const { containerRef: sectionRef, isInView } = useSectionInView({ rootMargin: '200px 0px' });

    // ── Motion Values de Posição com Mola Amortecida & Inércia (Jesper Landberg Physics) ──
    const progress = useMotionValue(0);
    const smoothProgress = useSpring(progress, {
        stiffness: 220,
        damping: 26,
        mass: 0.5,
    });
    const cardProgress = reducedMotion ? progress : smoothProgress;

    // Velocity Skew nos eixos Z e X (inclinação orgânica proporcional à velocidade do arraste)
    const progressVelocity = useVelocity(smoothProgress);
    const velocityRotateZ = useTransform(progressVelocity, [-8, 0, 8], [3.6, 0, -3.6]);
    const velocitySkewX = useTransform(progressVelocity, [-8, 0, 8], [-2.2, 0, 2.2]);

    // Refs para arraste e inércia contínua
    const isDraggingRef = useRef(false);
    const hasDraggedRef = useRef(false);
    const startXRef = useRef(0);
    const startProgressRef = useRef(0);
    const lastXRef = useRef(0);
    const lastTimeRef = useRef(0);
    const velocityRef = useRef(0);

    const totalSlides = flagshipItems.length;
    const { presenting, navigatePresentation } = useProjectPresentation(sectionRef, progress, isDraggingRef, totalSlides, lang);
    const countProgress = useTransform(cardProgress, (value: number) => (value + 1) / totalSlides);

    // Atualiza o estado visual do índice ativo conforme o progresso da mola (apenas quando visível)
    useEffect(() => {
        if (!isInView) return;
        const unsubscribe = cardProgress.on('change', (v: number) => {
            const rounded = Math.round(v);
            if (rounded >= 0 && rounded < totalSlides && rounded !== activeIndex) {
                setActiveIndex(rounded);
            }
        });
        return () => unsubscribe();
    }, [cardProgress, activeIndex, totalSlides, isInView]);

    const navigateTo = useCallback((targetIndex: number) => {
        const clamped = Math.max(0, Math.min(totalSlides - 1, targetIndex));
        if (!navigatePresentation(clamped)) {
            progress.set(clamped);
            setActiveIndex(clamped);
        }
        playTabSwitch();
    }, [progress, totalSlides, navigatePresentation]);

    const handleCardFocus = useCallback((index: number) => {
        // A drag can end over the retiring card; its synthetic click must not undo the snap.
        if (!hasDraggedRef.current) navigateTo(index);
    }, [navigateTo]);

    const handlePrev = useCallback(() => {
        const current = Math.round(progress.get());
        const prev = current > 0 ? current - 1 : totalSlides - 1;
        navigateTo(prev);
    }, [navigateTo, progress, totalSlides]);

    const handleNext = useCallback(() => {
        const current = Math.round(progress.get());
        const next = current < totalSlides - 1 ? current + 1 : 0;
        navigateTo(next);
    }, [navigateTo, progress, totalSlides]);

    // ── Gestão de Arraste com Inércia & Momentum (Desativada quando fora do viewport) ──
    const handlePointerDown = (e: React.PointerEvent) => {
        if (!isInView) return;
        hasDraggedRef.current = false;
        if ((e.target as HTMLElement).closest('button, a, input')) return;
        if (e.button !== undefined && e.button !== 0) return;
        isDraggingRef.current = true;
        hasDraggedRef.current = false;
        startXRef.current = e.clientX;
        startProgressRef.current = progress.get();
        lastXRef.current = e.clientX;
        lastTimeRef.current = performance.now();
        velocityRef.current = 0;

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerUp);
    };

    const handlePointerMove = (e: PointerEvent) => {
        if (!isDraggingRef.current) return;
        const now = performance.now();
        const dt = Math.max(now - lastTimeRef.current, 1);
        const dx = e.clientX - lastXRef.current;
        velocityRef.current = dx / dt; // px/ms
        lastXRef.current = e.clientX;
        lastTimeRef.current = now;

        const totalDeltaX = e.clientX - startXRef.current;
        if (Math.abs(totalDeltaX) > 8) {
            hasDraggedRef.current = true;
        }

        // 460px de deslocamento correspondem a 1 slide completo
        const DRAG_FACTOR = 460;
        const targetProgress = startProgressRef.current - (totalDeltaX / DRAG_FACTOR);
        const bounded = Math.max(-0.25, Math.min(totalSlides - 0.75, targetProgress));
        progress.set(bounded);
    };

    const handlePointerUp = () => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;

        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerUp);

        const currentP = progress.get();
        const v = velocityRef.current; // px / ms

        // Projeção com inércia contínua e desaceleração orgânica (Jesper Landberg Momentum)
        let targetIndex = Math.round(currentP - v * 0.22);
        targetIndex = Math.max(0, Math.min(totalSlides - 1, targetIndex));

        navigateTo(targetIndex);
    };

    const handleInspect = (config: FlagshipProject) => {
        if (hasDraggedRef.current) return;
        playMechanicalClick();
        if (onSelectProject) {
            const fullProject = projects.find((p) => p.id === config.id) || config;
            onSelectProject(fullProject);
        }
    };

    // Navegação por teclado acessível
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            handlePrev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            handleNext();
        }
    };

    return (
        <section
            ref={sectionRef}
            id="projetos-destaque"
            tabIndex={0}
            aria-labelledby="featured-projects-heading"
            onKeyDown={handleKeyDown}
            className="project-focus-track bg-transparent focus:outline-none"
        >
            <div className="project-focus-frame">
            <div className="project-collection-source">
            <div className="project-focus-layout">
                <header className="project-focus-header">
                    <div>
                        <span className="portfolio-eyebrow">
                            {lang === 'en' ? 'SELECTED WORK' : lang === 'es' ? 'PROYECTOS SELECCIONADOS' : 'PROJETOS SELECIONADOS'}
                        </span>
                        <h2 id="featured-projects-heading" className="portfolio-title">
                            {lang === 'en' ? <>Featured <em>projects.</em></> : lang === 'es' ? <>Proyectos <em>destacados.</em></> : <>Projetos em <em>destaque.</em></>}
                        </h2>
                    </div>
                    <div className="project-focus-count" aria-label={lang === 'en' ? 'Current project' : lang === 'es' ? 'Proyecto actual' : 'Projeto atual'}>
                        <span aria-live="polite">
                            <strong>{String(activeIndex + 1).padStart(2, '0')}</strong> / {String(totalSlides).padStart(2, '0')}
                        </span>
                        <div className="project-focus-progress-rail" aria-hidden="true">
                            <motion.div style={{ scaleX: countProgress }} />
                        </div>
                    </div>
                </header>

                <div className="project-focus-gallery">
                <div
                    ref={containerRef}
                    onPointerDown={handlePointerDown}
                    style={{ perspective: presenting ? undefined : '1400px', perspectiveOrigin: '50% 50%', isolation: 'isolate', transformStyle: presenting ? 'flat' : 'preserve-3d' }}
                    className="project-focus-stage w-full mx-auto min-h-[710px] sm:min-h-[560px] flex items-center justify-center relative overflow-visible cursor-grab active:cursor-grabbing select-none"
                >
                    <motion.div
                        style={{ rotateZ: presenting || reducedMotion ? 0 : velocityRotateZ, skewX: presenting || reducedMotion ? 0 : velocitySkewX, transformStyle: presenting ? 'flat' : 'preserve-3d' }}
                        className="relative w-full h-full min-h-[680px] sm:min-h-[520px] lg:min-h-[520px]"
                    >
                        {flagshipItems.map((project, idx) => (
                            <CylindricalCard key={project.id} project={project} index={idx} activeIndex={activeIndex}
                                smoothProgress={cardProgress} onSelect={handleInspect} onCardFocus={handleCardFocus} lang={lang} presenting={presenting} />
                        ))}
                    </motion.div>
                </div>
                </div>

                <div className="project-focus-controls">
                    <div className="project-focus-tabs scrollbar-none" aria-label={lang === 'en' ? 'Featured projects' : lang === 'es' ? 'Proyectos destacados' : 'Projetos em destaque'}>
                        {flagshipItems.map((item, idx) => (
                            <button key={item.id} onClick={() => navigateTo(idx)} aria-pressed={idx === activeIndex}
                                className="project-focus-tab cursor-pointer" data-cursor-morph="true">
                                {item.stepLabel}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <MagneticButton onClick={handlePrev} aria-label={lang === 'en' ? 'Previous Project' : lang === 'es' ? 'Proyecto anterior' : 'Projeto Anterior'}
                            data-cursor-morph="true" className="portfolio-control w-10 h-10 transition-colors">
                            <i aria-hidden="true" className="fas fa-chevron-left text-xs" />
                        </MagneticButton>
                        <MagneticButton onClick={handleNext} aria-label={lang === 'en' ? 'Next Project' : lang === 'es' ? 'Siguiente proyecto' : 'Próximo Projeto'}
                            data-cursor-morph="true" className="portfolio-control w-10 h-10 transition-colors">
                            <i aria-hidden="true" className="fas fa-chevron-right text-xs" />
                        </MagneticButton>
                    </div>
                </div>
                <p className="project-focus-cue">
                    {presenting
                        ? (lang === 'en' ? 'Scroll to explore · or use the arrows' : lang === 'es' ? 'Desplázate para explorar · o usa las flechas' : 'Role para explorar · ou use as setas')
                        : (lang === 'en' ? 'Drag to explore · or use the arrows' : lang === 'es' ? 'Arrastra para explorar · o usa las flechas' : 'Arraste para explorar · ou use as setas')}
                </p>
            </div>
            </div>
            </div>
        </section>
    );
}
