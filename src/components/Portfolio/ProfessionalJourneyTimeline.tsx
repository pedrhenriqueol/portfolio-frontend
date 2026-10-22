import React, { useRef, useState, useMemo, useCallback, useEffect, memo } from 'react';
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    useVelocity,
    useReducedMotion,
    type MotionValue,
} from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useCareerPresentation } from '../../hooks/useCareerEntrance';
import useSectionInView from '../../hooks/useSectionInView';
import CareerEntranceStage from './Common/CareerEntranceStage';
import SectionDivider from './Common/SectionDivider';
import MagneticButton from './MagneticButton';
import JourneyPhotoModal, { JourneyMilestoneArchive } from './JourneyPhotoModal';
import JourneyMigrationDiagram from './JourneyMigrationDiagram';
import { playMechanicalClick, playTabSwitch } from '../../lib/sound';
import './career-entrance.css';

/** Faz highlight de métricas numéricas e termos técnicos-chave no texto */
function HighlightedText({ text }: { text: string }) {
    const pattern = /(\d+[\+\-]?\s*(?:ms|s|%|usuários|bugs|travamentos|Endpoints)?(?:\s*diários)?|<\d+ms|N\+1|100\+|8\+|Multi-tenant|RBAC|ZPEs?|ePita|UniGui|Laravel|ACBr)/g;
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

export interface TimelineResponsibilityGroup {
    title: string;
    icon?: string;
    items: string[];
}

export interface JourneyExperienceItem {
    id?: number;
    company: string;
    role: string;
    period: string;
    techBadges?: string[];
    groups?: TimelineResponsibilityGroup[];
}

interface CareerHudMetric {
    value: string;
    label: string;
}

interface CareerMilestoneSlide {
    id: string;
    year: string;
    stepLabel: string;
    company: string;
    role: string;
    period: string;
    location: string;
    statusLabel: string;
    isCurrent: boolean;
    summary: string;
    metrics: [CareerHudMetric, CareerHudMetric];
    techBadges: string[];
    groups: TimelineResponsibilityGroup[];
    archive: JourneyMilestoneArchive;
}

interface CareerFocusCardProps {
    milestone: CareerMilestoneSlide;
    index: number;
    activeIndex: number;
    smoothProgress: MotionValue<number>;
    onInspectArchive: (archive: JourneyMilestoneArchive) => void;
    onCardFocus: (index: number) => void;
    presenting: boolean;
    lang: string;
}

/**
 * CareerFocusCard - Card 3D individual da Experiência Profissional no Palco em Foco.
 * Segue exatamente a mesma arquitetura compositor-only (`translate3d`, `scale`, `opacity`)
 * dos 3 Projetos em Destaque (`CylindricalCard`).
 */
const CareerFocusCard = memo(function CareerFocusCard({
    milestone,
    index,
    activeIndex,
    smoothProgress,
    onInspectArchive,
    onCardFocus,
    presenting,
    lang,
}: CareerFocusCardProps) {
    const isCurrent = index === activeIndex;
    const reducedMotion = useReducedMotion();
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isCurrent && cardRef.current?.contains(document.activeElement)) {
            cardRef.current.closest<HTMLElement>('section')?.focus({ preventScroll: true });
        }
    }, [isCurrent]);

    const zIndex = isCurrent ? 50 : 20 - Math.abs(index - activeIndex);

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
            className={`career-focus-card absolute top-0 left-1/2 -translate-x-1/2 w-[96%] sm:w-[86vw] md:w-[820px] lg:w-[920px] h-[720px] sm:h-[560px] md:h-[520px] will-change-transform select-none antialiased subpixel-antialiased ${
                isCurrent ? 'pointer-events-auto' : 'pointer-events-auto cursor-pointer'
            }`}
        >
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

                {/* ── Lado Esquerdo: Identidade Monumental do Ano, Preview Técnico & Métricas HUD ── */}
                <div className="w-full md:w-[40%] h-52 sm:h-56 md:h-full relative overflow-hidden bg-[#06080D] border-b md:border-b-0 md:border-r border-dashed border-white/15 shrink-0 flex flex-col justify-between">
                    {/* Área Visual Superior (Imagem do Registro ou Diagrama Arquitetural) */}
                    <div className="relative flex-1 min-h-[140px] overflow-hidden bg-[#07090e]">
                        {milestone.archive.media === 'process' ? (
                            <div className="w-full h-full flex items-center justify-center p-3 bg-[#07090e]">
                                <JourneyMigrationDiagram language={lang} compact />
                            </div>
                        ) : (
                            <img
                                src={milestone.archive.image}
                                alt={milestone.company}
                                width={640}
                                height={400}
                                loading="lazy"
                                decoding="async"
                                className={`w-full h-full object-cover object-center transition-transform duration-500 ${
                                    reducedMotion ? '' : 'group-hover:scale-[1.03]'
                                }`}
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#06080D] via-[#06080D]/45 to-transparent pointer-events-none" />

                        {/* Status Chip Superior */}
                        <div className="portfolio-chip-dashed absolute top-3.5 left-3.5 z-10 flex items-center gap-2 bg-darker/95 pointer-events-none">
                            <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                    milestone.isCurrent ? 'bg-emerald-400 animate-pulse' : 'bg-accent'
                                }`}
                            />
                            <span className="text-[10px] font-mono text-secondary">
                                {milestone.statusLabel}
                            </span>
                        </div>

                        {/* Ano Escultural sobreposto na base da mídia */}
                        <div className="absolute bottom-2.5 left-4 right-4 flex items-baseline justify-between pointer-events-none">
                            <span
                                style={{
                                    WebkitTextStroke: '1.5px color-mix(in srgb, var(--color-secondary) 65%, rgba(255, 255, 255, 0.3))',
                                    textShadow: '0 0 32px color-mix(in srgb, var(--color-accent) 28%, transparent)',
                                }}
                                className="text-4xl sm:text-5xl md:text-6xl font-mono font-black text-transparent tracking-tight leading-none select-none"
                            >
                                {milestone.year}
                            </span>
                            <span className="font-mono text-[10px] text-neutral-300 bg-black/70 px-2 py-0.5 rounded border border-white/10">
                                {milestone.location}
                            </span>
                        </div>
                    </div>

                    {/* Base Esquerda: Resumo Executivo + 2 Métricas HUD Emolduradas */}
                    <div className="p-4 sm:p-5 bg-[#080b11] border-t border-dashed border-white/12 space-y-3">
                        <p className="text-neutral-300 text-[11.5px] sm:text-xs font-sans leading-relaxed line-clamp-2">
                            {milestone.summary}
                        </p>

                        <div className="grid grid-cols-2 gap-2">
                            {milestone.metrics.map((metric) => (
                                <div key={metric.label} className="portfolio-hud-metric">
                                    <span className="font-mono text-xs sm:text-[13px] font-semibold text-secondary block leading-tight">
                                        {metric.value}
                                    </span>
                                    <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-neutral-400 block mt-0.5 truncate">
                                        {metric.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Lado Direito: Empresa, Cargo, Frentes de Engenharia & Dossiê ── */}
                <div className="p-5 sm:p-6 md:p-6 flex-1 flex flex-col justify-between overflow-hidden">
                    <div className="min-h-0 flex-1 flex flex-col">
                        {/* Cabeçalho Interno: Índice 01 + Ano + Período */}
                        <div className="portfolio-project-meta flex items-center justify-between gap-3 mb-1.5">
                            <div className="flex items-baseline gap-2.5 min-w-0">
                                <span className="font-mono text-lg sm:text-xl font-semibold text-secondary leading-none tracking-tight">
                                    {formattedIndex}
                                </span>
                                <span className="text-white/20 font-mono text-xs">/</span>
                                <span className="font-serif italic text-xs sm:text-sm text-accent truncate">
                                    {milestone.year} · {milestone.stepLabel}
                                </span>
                            </div>
                            <span className="portfolio-chip-dashed flex items-center gap-1.5 shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent/80" />
                                {milestone.period}
                            </span>
                        </div>

                        {/* Nome da Empresa / Instituição */}
                        <h3 className="text-2xl sm:text-[26px] font-serif text-primary font-normal tracking-tight leading-tight mb-0.5 truncate">
                            {milestone.company}
                        </h3>

                        {/* Cargo / Função */}
                        <p className="text-secondary/90 text-xs sm:text-[13px] font-sans font-medium mb-3 truncate">
                            {milestone.role}
                        </p>

                        {/* Frentes de Atuação & Entregas Técnicas */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 overflow-y-auto pr-1 scrollbar-none">
                            {milestone.groups.slice(0, 2).map((group, gIdx) => (
                                <div
                                    key={gIdx}
                                    className="p-3 rounded bg-white/[0.015] border border-dashed border-white/[0.1] space-y-1.5"
                                >
                                    <div className="flex items-center gap-1.5 text-secondary font-semibold text-[10.5px] tracking-wider uppercase font-mono">
                                        <i aria-hidden="true" className={`${group.icon || 'fas fa-check-circle'} text-[10px] text-accent`} />
                                        <span className="truncate">{group.title}</span>
                                    </div>
                                    <ul className="space-y-1">
                                        {group.items.slice(0, 2).map((item, iIdx) => (
                                            <li
                                                key={iIdx}
                                                className="text-neutral-300 text-[11.5px] leading-snug flex items-start gap-1.5 line-clamp-2"
                                            >
                                                <span className="text-accent mt-1 text-[7px] shrink-0">•</span>
                                                <span>
                                                    <HighlightedText text={item} />
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* Badges de Stack Técnica com Borda Tracejada */}
                        <div className="flex flex-wrap gap-1.5 mt-auto pb-2">
                            {milestone.techBadges.slice(0, 7).map((badge) => (
                                <span key={badge} className="portfolio-chip-dashed">
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* ── Rodapé Integrado: Ação Direta para Dossiê Técnico ── */}
                    <div className="portfolio-hud-divider flex flex-wrap items-center justify-between gap-2.5 pt-3 mt-1 relative z-20">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onInspectArchive(milestone.archive);
                            }}
                            data-cursor-morph="true"
                            className="portfolio-button portfolio-button-primary flex-1 !min-h-[38px] !py-2 !px-4 font-semibold text-xs flex items-center justify-center gap-2 shadow-md relative z-30 cursor-pointer"
                        >
                            <i aria-hidden="true" className="fas fa-folder-open text-xs" />
                            <span>
                                {lang === 'en'
                                    ? 'Inspect Technical Record & Evidence'
                                    : lang === 'es'
                                    ? 'Inspeccionar Registro Técnico'
                                    : 'Inspecionar Registro Técnico & Evidências'}
                            </span>
                            <span aria-hidden="true">↗</span>
                        </button>
                    </div>
                </div>

                {/* Escurecimento compositor-only nos cards laterais inativos */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 z-40 rounded-2xl bg-black pointer-events-none transition-opacity duration-300"
                    style={{ opacity: isCurrent ? 0 : 0.6 }}
                />
            </div>

            {/* Sombra de Profundidade Projetada no Solo - estritamente no card ativo */}
            {isCurrent && (
                <motion.div
                    style={{
                        opacity: shadowOpacity,
                        background: 'radial-gradient(ellipse at center, rgba(0,0,0,.68), transparent 70%)',
                    }}
                    className="absolute -bottom-12 left-12 right-12 h-16 rounded-full pointer-events-none"
                    aria-hidden="true"
                />
            )}
        </motion.div>
    );
});

interface ProfessionalJourneyTimelineProps {
    experiences?: JourneyExperienceItem[];
    guidedIntro?: boolean;
    entrancePillars?: React.ReactNode;
}

export const ProfessionalJourneyTimeline: React.FC<ProfessionalJourneyTimelineProps> = ({
    experiences = [],
    entrancePillars,
}) => {
    const { lang = 'pt' } = useLanguage();
    const reducedMotion = useReducedMotion();
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedArchive, setSelectedArchive] = useState<JourneyMilestoneArchive | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { containerRef: sectionRef, isInView } = useSectionInView({ rootMargin: '200px 0px' });

    // Métricas executivas da trajetória
    const summaryStats = useMemo(
        () => [
            {
                value: '10+ ' + (lang === 'en' ? 'Months' : 'Meses'),
                label: lang === 'en' ? 'Production' : lang === 'es' ? 'Producción' : 'Em produção',
                icon: 'fas fa-calendar-check',
            },
            {
                value: '100+ ' + (lang === 'en' ? 'Users' : lang === 'es' ? 'Usuarios' : 'Usuários'),
                label: lang === 'en' ? 'Daily on ERP' : lang === 'es' ? 'Diarios en ERP' : 'Diários no ERP',
                icon: 'fas fa-users',
            },
            {
                value: lang === 'en' ? '25% Fewer Bugs' : '25% Menos Bugs',
                label: lang === 'en' ? 'Proactive QA' : lang === 'es' ? 'QA preventivo' : 'QA preventivo',
                icon: 'fas fa-shield-alt',
            },
            {
                value: lang === 'en' ? '4× Faster' : lang === 'es' ? '4× Más Rápido' : '4× Mais Rápido',
                label: lang === 'en' ? 'SQL (<500ms)' : 'Queries (<500ms)',
                icon: 'fas fa-bolt',
            },
        ],
        [lang]
    );

    const ARCHIVES: Record<string, JourneyMilestoneArchive> = useMemo(
        () => ({
            '2026': {
                id: 'archive-2026',
                year: '2026',
                company: 'SETE Tecnologia',
                role:
                    lang === 'en'
                        ? 'Quality assurance & software testing'
                        : lang === 'es'
                        ? 'Calidad y pruebas de software'
                        : 'Qualidade de software & testes',
                archiveTitle:
                    lang === 'en'
                        ? 'View the ePita quality assurance record'
                        : lang === 'es'
                        ? 'Ver el registro de calidad ePita'
                        : 'Ver registro de qualidade do ePita',
                image: '/projects/epta_qa_split_2026.png',
                mediaCaption:
                    lang === 'en'
                        ? 'ePita — login, registration approval and access monitoring screens.'
                        : lang === 'es'
                        ? 'ePita — pantallas de acceso, aprobación de registros y seguimiento de accesos.'
                        : 'ePita — telas de acesso, aprovação de cadastros e acompanhamento de acessos.',
                date: lang === 'en' ? 'Jun 2026 — Present' : 'Jun 2026 — Presente',
                location:
                    lang === 'en'
                        ? 'Fortaleza, CE · Remote / hybrid'
                        : 'Fortaleza, CE · Remoto / híbrido',
                description:
                    lang === 'en'
                        ? 'Quality assurance for ePita customs and port logistics systems, with a focus on operational rules, integrations and data consistency.'
                        : lang === 'es'
                        ? 'Aseguramiento de calidad en sistemas aduaneros y logísticos portuarios ePita, con foco en reglas operacionales, integraciones y consistencia de datos.'
                        : 'Garantia de qualidade em sistemas alfandegários e logísticos portuários ePita, com foco em regras operacionais, integrações e consistência de dados.',
                contributions:
                    lang === 'en'
                        ? [
                              'Map business rules and requirements with operational teams.',
                              'Execute functional, regression and API integration tests with Postman.',
                              'Validate transactions and investigate data consistency in SQL Server.',
                          ]
                        : lang === 'es'
                        ? [
                              'Mapear reglas de negocio y requisitos con los equipos operacionales.',
                              'Ejecutar pruebas funcionales, de regresión e integración de APIs con Postman.',
                              'Validar transacciones e investigar la consistencia de datos en SQL Server.',
                          ]
                        : [
                              'Mapear regras de negócio e requisitos com as equipes operacionais.',
                              'Executar testes funcionais, regressivos e de integração de APIs com Postman.',
                              'Validar transações e investigar a consistência de dados em SQL Server.',
                          ],
                results: [
                    {
                        label:
                            lang === 'en'
                                ? 'Fewer regressions'
                                : lang === 'es'
                                ? 'Menos regresiones'
                                : 'Menos regressões',
                        value: '25%',
                    },
                    {
                        label:
                            lang === 'en'
                                ? 'Audited endpoints'
                                : lang === 'es'
                                ? 'Endpoints auditados'
                                : 'Endpoints auditados',
                        value: '100+',
                    },
                ],
                technologies: ['Postman', 'SQL Server', 'APIs REST', 'Scrum / Kanban'],
            },
            '2025': {
                id: 'archive-2025',
                year: '2025',
                company: 'Qualisoft Sistemas',
                role:
                    lang === 'en'
                        ? 'Full stack development & legacy modernization'
                        : lang === 'es'
                        ? 'Desarrollo full stack & modernización de legados'
                        : 'Desenvolvimento full stack & modernização de legados',
                archiveTitle:
                    lang === 'en'
                        ? 'View the Qualisoft development record'
                        : lang === 'es'
                        ? 'Ver el registro de desarrollo Qualisoft'
                        : 'Ver registro de desenvolvimento na Qualisoft',
                media: 'process',
                mediaCaption:
                    lang === 'en'
                        ? 'Technical summary of my work. The diagram represents the workstreams; it is not a product screenshot.'
                        : lang === 'es'
                        ? 'Síntesis técnica de mi trabajo. El diagrama representa los frentes de desarrollo; no es una captura del producto.'
                        : 'Síntese técnica da minha atuação. O diagrama representa as frentes de trabalho, sem reproduzir uma tela do produto.',
                date: lang === 'en' ? 'Aug 2025 — Jun 2026' : 'Ago 2025 — Jun 2026',
                location: 'Fortaleza, CE',
                description:
                    lang === 'en'
                        ? 'Development of ERP management interfaces and APIs, alongside the modernization of a Delphi desktop application for the web.'
                        : lang === 'es'
                        ? 'Desarrollo de interfaces de gestión y APIs para ERP, junto con la modernización de una aplicación Delphi de escritorio para la web.'
                        : 'Desenvolvimento de interfaces de gestão e APIs para ERP, junto à modernização de uma aplicação Delphi desktop para a web.',
                contributions:
                    lang === 'en'
                        ? [
                              'Build management interfaces with React and TypeScript, integrated with Laravel REST APIs.',
                              'Contribute to the modernization of Delphi/VCL systems with Delphi 11 and UniGui.',
                              'Refactor SQL Server/MySQL queries and indexes to improve report response times.',
                          ]
                        : lang === 'es'
                        ? [
                              'Desarrollar interfaces de gestión con React y TypeScript, integradas con APIs REST Laravel.',
                              'Participar en la modernización de sistemas Delphi/VCL con Delphi 11 y UniGui.',
                              'Refactorizar consultas e índices SQL Server/MySQL para mejorar el tiempo de los informes.',
                          ]
                        : [
                              'Desenvolver interfaces de retaguarda com React e TypeScript, integradas a APIs REST Laravel.',
                              'Participar da modernização de sistemas Delphi/VCL com Delphi 11 e UniGui.',
                              'Refatorar consultas e índices SQL Server/MySQL para melhorar a resposta dos relatórios.',
                          ],
                results: [
                    {
                        label:
                            lang === 'en'
                                ? 'Queries, previously 2s'
                                : lang === 'es'
                                ? 'Consultas, antes 2s'
                                : 'Consultas, antes 2s',
                        value: '<500ms',
                    },
                    {
                        label:
                            lang === 'en'
                                ? 'Daily ERP users'
                                : lang === 'es'
                                ? 'Usuarios diarios del ERP'
                                : 'Usuários diários no ERP',
                        value: '100+',
                    },
                ],
                technologies: ['React', 'TypeScript', 'PHP / Laravel', 'Delphi 11', 'UniGui', 'SQL Server', 'MySQL'],
            },
            '2024': {
                id: 'archive-2024',
                year: '2024',
                company: 'EEEP Luiza de Teodoro Vieira',
                role:
                    lang === 'en'
                        ? 'High school & technical education in IT'
                        : lang === 'es'
                        ? 'Bachillerato & formación técnica en informática'
                        : 'Ensino médio & formação técnica em informática',
                archiveTitle:
                    lang === 'en'
                        ? 'View the EEEP technical class record'
                        : lang === 'es'
                        ? 'Ver el registro de la clase técnica EEEP'
                        : 'Ver registro da turma técnica EEEP',
                image: '/projects/eeep_turma_2024.jpg',
                mediaCaption:
                    lang === 'en'
                        ? 'Technical IT class at EEEP Luiza de Teodoro Vieira, photographed in 2024.'
                        : lang === 'es'
                        ? 'Clase técnica de informática de EEEP Luiza de Teodoro Vieira, fotografiada en 2024.'
                        : 'Turma técnica em informática da EEEP Luiza de Teodoro Vieira, fotografada em 2024.',
                date: lang === 'en' ? 'Jan 2023 — Dec 2025' : lang === 'es' ? 'Ene 2023 — Dic 2025' : 'Jan 2023 — Dez 2025',
                location: 'Pacatuba, CE',
                description:
                    lang === 'en'
                        ? 'Integrated high school and technical IT education, completed in 2025. The programme combined programming fundamentals with practical web, design and robotics projects.'
                        : lang === 'es'
                        ? 'Bachillerato integrado con formación técnica en informática, concluido en 2025. La formación combinó fundamentos de programación con proyectos prácticos de web, diseño y robótica.'
                        : 'Ensino médio integrado à formação técnica em informática, concluído em 2025. A formação combinou fundamentos de programação com projetos práticos de web, design e robótica.',
                contributions:
                    lang === 'en'
                        ? [
                              'Practice algorithms, data structures and object-oriented programming with Python and Java.',
                              'Build web interfaces with HTML, CSS and JavaScript.',
                              'Explore UI/UX design and robotics through integrated projects.',
                          ]
                        : lang === 'es'
                        ? [
                              'Practicar algoritmos, estructuras de datos y programación orientada a objetos con Python y Java.',
                              'Construir interfaces web con HTML, CSS y JavaScript.',
                              'Explorar diseño UI/UX y robótica en proyectos integradores.',
                          ]
                        : [
                              'Praticar algoritmos, estruturas de dados e orientação a objetos com Python e Java.',
                              'Construir interfaces web com HTML, CSS e JavaScript.',
                              'Explorar UI/UX Design e robótica em projetos integradores.',
                          ],
                results: [],
                technologies: [
                    'Python',
                    'Java',
                    'HTML',
                    'CSS',
                    'JavaScript',
                    'UI/UX',
                    lang === 'en' ? 'Robotics' : 'Robótica',
                ],
            },
        }),
        [lang]
    );

    const milestoneSlides: CareerMilestoneSlide[] = useMemo(() => {
        const seteExp = experiences.find((e) => e.id === 2) || {
            company: 'SETE Tecnologia',
            role:
                lang === 'en'
                    ? 'Software Quality Assurance (QA) & Testing Analyst — Intern'
                    : lang === 'es'
                    ? 'Analista de Calidad de Software (QA) y Pruebas — Pasantía'
                    : 'Analista de Qualidade de Software (QA) e Testes — Estágio',
            period: lang === 'en' ? 'Jun 2026 — Present' : 'Jun 2026 — Presente',
            techBadges: [
                'QA',
                'Testes de Regressão',
                'Postman',
                'APIs RESTful',
                'SQL Server',
                'Scrum / Kanban',
                'Engenharia de Requisitos',
            ],
            groups: [
                {
                    title:
                        lang === 'en'
                            ? 'Quality Assurance & Requirements'
                            : lang === 'es'
                            ? 'Garantía de Calidad y Requisitos'
                            : 'Garantia de Qualidade & Requisitos',
                    icon: 'fas fa-shield-alt',
                    items: [
                        'Atuação em sistemas de missão crítica no setor logístico e portuário (ZPEs).',
                        'Mapeamento de 100% dos requisitos operacionais e regras de negócio com múltiplos setores.',
                    ],
                },
                {
                    title:
                        lang === 'en'
                            ? 'API & SQL Validation'
                            : lang === 'es'
                            ? 'Validación de APIs y SQL'
                            : 'Validação de APIs & SQL',
                    icon: 'fas fa-database',
                    items: [
                        'Consumo e testes de integração de serviços RESTful com collections estruturadas no Postman.',
                        'Execução de queries diagnósticas e validação de transações no core ePita com SQL Server.',
                    ],
                },
            ],
        };

        const qualiExp = experiences.find((e) => e.id === 1) || {
            company: 'Qualisoft Sistemas',
            role:
                lang === 'en'
                    ? 'Full Stack Developer (React / TypeScript / PHP / Delphi / SQL) — Intern'
                    : lang === 'es'
                    ? 'Desarrollador Full Stack (React / TypeScript / PHP / Delphi / SQL) — Pasantía'
                    : 'Desenvolvedor Full Stack (React / TypeScript / PHP / Delphi / SQL) — Estágio',
            period: lang === 'en' ? 'Aug 2025 — Jun 2026' : 'Ago 2025 — Jun 2026',
            techBadges: [
                'React',
                'TypeScript',
                'PHP / Laravel',
                'Delphi 11',
                'UniGui',
                'MySQL',
                'SQL Server',
                'ACBr',
            ],
            groups: [
                {
                    title:
                        lang === 'en'
                            ? 'Full Stack & Web Modules'
                            : lang === 'es'
                            ? 'Full Stack y Módulos Web'
                            : 'Full Stack & Módulos Web',
                    icon: 'fas fa-laptop-code',
                    items: [
                        'Implementação em produção de React + TypeScript integrada a APIs RESTful em PHP / Laravel.',
                        'Migração de monolito Delphi VCL para arquitetura Web moderna com Delphi 11 + UniGui.',
                    ],
                },
                {
                    title:
                        lang === 'en'
                            ? 'Database Tuning & Performance'
                            : lang === 'es'
                            ? 'Optimización SQL y Rendimiento'
                            : 'Otimização de Banco & Performance',
                    icon: 'fas fa-tachometer-alt',
                    items: [
                        'Refatoração de consultas SQL Server/MySQL reduzindo tempo de relatórios de 2s para <500ms.',
                        'Criação de procedures, índices compostos e integração fiscal ACBr para 100+ usuários diários.',
                    ],
                },
            ],
        };

        const tecnicoExp = {
            company: 'EEEP Luiza de Teodoro Vieira',
            role:
                lang === 'en'
                    ? 'Integrated High School & Technical IT Diploma'
                    : lang === 'es'
                    ? 'Bachillerato Integrado con Técnico en Informática'
                    : 'Ensino Médio Integrado ao Técnico em Informática',
            period: lang === 'en' ? 'Jan 2023 — Dec 2025' : lang === 'es' ? 'Ene 2023 — Dic 2025' : 'Jan 2023 — Dez 2025',
            techBadges: [
                'Python',
                'Java',
                'HTML5',
                'CSS3',
                'JavaScript',
                'Robótica',
                'UI/UX Design',
                'Algoritmos',
            ],
            groups: [
                {
                    title:
                        lang === 'en'
                            ? 'Programming & Web Development'
                            : lang === 'es'
                            ? 'Programación y Desarrollo Web'
                            : 'Programação & Desenvolvimento Web',
                    icon: 'fas fa-code',
                    items: [
                        lang === 'en'
                            ? 'Hands-on training in algorithmic logic, data structures, and OOP with Python and Java.'
                            : lang === 'es'
                            ? 'Formación práctica en lógica algorítmica, estructuras de datos y POO con Python y Java.'
                            : 'Formação prática em lógica algorítmica, estruturas de dados e POO com Python e Java.',
                        lang === 'en'
                            ? 'Building semantic web interfaces with HTML5, modern CSS3, and interactive JavaScript.'
                            : lang === 'es'
                            ? 'Construcción de interfaces web semánticas con HTML5, CSS3 moderno y JavaScript.'
                            : 'Construção de aplicações e interfaces web com HTML5 semântico, CSS3 e JavaScript.',
                    ],
                },
                {
                    title:
                        lang === 'en'
                            ? 'Design, Robotics & Applied Projects'
                            : lang === 'es'
                            ? 'Diseño, Robótica y Proyectos Prácticos'
                            : 'Design, Robótica & Projetos Práticos',
                    icon: 'fas fa-robot',
                    items: [
                        lang === 'en'
                            ? 'Assembly of robotics projects integrating automation and programmable microcontrollers.'
                            : lang === 'es'
                            ? 'Montaje de proyectos prácticos de robótica integrando automatización y hardware.'
                            : 'Montagem de projetos práticos de robótica integrando automação e hardware programável.',
                        lang === 'en'
                            ? 'Core UI/UX Design concepts, visual prototyping, and clean code principles.'
                            : lang === 'es'
                            ? 'Conceptos fundamentales de UI/UX Design, prototipado visual y código limpio.'
                            : 'Conceitos fundamentais de UI/UX Design, prototipagem visual e princípios de código limpo.',
                    ],
                },
            ],
        };

        return [
            {
                id: 'milestone-2026',
                year: '2026',
                stepLabel: 'SETE Tecnologia · QA',
                company: seteExp.company,
                role: seteExp.role,
                period: ARCHIVES['2026'].date,
                location: ARCHIVES['2026'].location,
                statusLabel:
                    lang === 'en'
                        ? 'CURRENTLY IN PRODUCTION'
                        : lang === 'es'
                        ? 'ACTUALMENTE EN PRODUCCIÓN'
                        : 'ATUALMENTE EM PRODUÇÃO',
                isCurrent: true,
                summary:
                    lang === 'en'
                        ? 'Quality assurance, operational rules mapping in FTZs, and transaction validation in the ePita core.'
                        : lang === 'es'
                        ? 'Aseguramiento de calidad, mapeo de reglas operacionales en ZPEs y validación de transacciones en el core ePita.'
                        : 'Garantia de qualidade, mapeamento de regras operacionais em ZPEs e validação de transações no core ePita.',
                metrics: [
                    {
                        value: '25% Menos Bugs',
                        label: lang === 'en' ? 'Proactive QA Shielding' : 'Blindagem Regressiva',
                    },
                    {
                        value: '100+ Endpoints',
                        label: lang === 'en' ? 'Postman & SQL Audits' : 'Auditados via Postman/SQL',
                    },
                ],
                techBadges: seteExp.techBadges || [],
                groups: seteExp.groups || [],
                archive: ARCHIVES['2026'],
            },
            {
                id: 'milestone-2025',
                year: '2025',
                stepLabel: 'Qualisoft · Full Stack',
                company: qualiExp.company,
                role: qualiExp.role,
                period: ARCHIVES['2025'].date,
                location: ARCHIVES['2025'].location,
                statusLabel:
                    lang === 'en'
                        ? 'SUCCESSFULLY COMPLETED'
                        : lang === 'es'
                        ? 'CONCLUIDO CON ÉXITO'
                        : 'CONCLUÍDO COM SUCESSO',
                isCurrent: false,
                summary:
                    lang === 'en'
                        ? 'Legacy Desktop VCL monolith modernization to Web via UniGui, Laravel APIs, and query tuning from 2s to <500ms.'
                        : lang === 'es'
                        ? 'Modernización de monolito Desktop VCL a Web vía UniGui, APIs Laravel y optimización de consultas de 2s a <500ms.'
                        : 'Modernização de monolito Desktop VCL para Web via UniGui, APIs Laravel e tuning de queries de 2s para <500ms.',
                metrics: [
                    {
                        value: '2s ➔ <500ms',
                        label: lang === 'en' ? 'SQL Query Optimization' : 'Tuning de Queries SQL',
                    },
                    {
                        value: '100+ Usuários',
                        label: lang === 'en' ? 'Daily Active ERP Users' : 'Ativos Diários no ERP',
                    },
                ],
                techBadges: qualiExp.techBadges || [],
                groups: qualiExp.groups || [],
                archive: ARCHIVES['2025'],
            },
            {
                id: 'milestone-2024',
                year: '2024',
                stepLabel: 'EEEP · Base Técnica',
                company: tecnicoExp.company,
                role: tecnicoExp.role,
                period: ARCHIVES['2024'].date,
                location: ARCHIVES['2024'].location,
                statusLabel:
                    lang === 'en'
                        ? 'TECHNICAL DIPLOMA · 2023–2025'
                        : lang === 'es'
                        ? 'DIPLOMA TÉCNICO · 2023–2025'
                        : 'ENSINO MÉDIO & TÉCNICO',
                isCurrent: false,
                summary:
                    lang === 'en'
                        ? 'High School and Technical Diploma in IT: algorithmic logic with Python & Java, web interfaces, UI/UX design, and robotics.'
                        : lang === 'es'
                        ? 'Bachillerato y Técnico en Informática: programación con Python y Java, interfaces web, diseño UI/UX y robótica.'
                        : 'Ensino Médio e Técnico em Informática: programação com Python e Java, web com HTML/CSS/JS, robótica e UI/UX Design.',
                metrics: [
                    {
                        value: '3 Anos (Integrado)',
                        label: lang === 'en' ? 'Algorithms & OOP Base' : 'Algoritmos & Base POO',
                    },
                    {
                        value: 'Web & Robótica',
                        label: lang === 'en' ? 'Applied IT Engineering' : 'Projetos Integradores',
                    },
                ],
                techBadges: tecnicoExp.techBadges,
                groups: tecnicoExp.groups,
                archive: ARCHIVES['2024'],
            },
        ];
    }, [experiences, lang, ARCHIVES]);

    // ── Motion Values de Posição com Mola Amortecida & Inércia (Mesma Física dos 3 Projetos) ──
    const progress = useMotionValue(0);
    const smoothProgress = useSpring(progress, {
        stiffness: 220,
        damping: 26,
        mass: 0.5,
    });
    const cardProgress = reducedMotion ? progress : smoothProgress;

    const progressVelocity = useVelocity(smoothProgress);
    const velocityRotateZ = useTransform(progressVelocity, [-8, 0, 8], [3.6, 0, -3.6]);
    const velocitySkewX = useTransform(progressVelocity, [-8, 0, 8], [-2.2, 0, 2.2]);

    const isDraggingRef = useRef(false);
    const hasDraggedRef = useRef(false);
    const startXRef = useRef(0);
    const startProgressRef = useRef(0);
    const lastXRef = useRef(0);
    const lastTimeRef = useRef(0);
    const velocityRef = useRef(0);

    const totalSlides = milestoneSlides.length;
    const { presenting, navigatePresentation } = useCareerPresentation(
        sectionRef,
        progress,
        isDraggingRef,
        totalSlides,
        lang
    );
    const countProgress = useTransform(cardProgress, (value: number) => (value + 1) / totalSlides);

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

    const navigateTo = useCallback(
        (targetIndex: number) => {
            const clamped = Math.max(0, Math.min(totalSlides - 1, targetIndex));
            if (!navigatePresentation(clamped)) {
                progress.set(clamped);
                setActiveIndex(clamped);
            }
            playTabSwitch();
        },
        [progress, totalSlides, navigatePresentation]
    );

    const handleCardFocus = useCallback(
        (index: number) => {
            if (!hasDraggedRef.current) navigateTo(index);
        },
        [navigateTo]
    );

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

    const handlePointerDown = (e: React.PointerEvent) => {
        if (!isInView) return;
        hasDraggedRef.current = false;
        if ((e.target as HTMLElement).closest('button, a, input')) return;
        if (e.button !== undefined && e.button !== 0) return;
        isDraggingRef.current = true;
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
        velocityRef.current = dx / dt;
        lastXRef.current = e.clientX;
        lastTimeRef.current = now;

        const totalDeltaX = e.clientX - startXRef.current;
        if (Math.abs(totalDeltaX) > 8) {
            hasDraggedRef.current = true;
        }

        const DRAG_FACTOR = 460;
        const targetProgress = startProgressRef.current - totalDeltaX / DRAG_FACTOR;
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
        const v = velocityRef.current;
        let targetIndex = Math.round(currentP - v * 0.22);
        targetIndex = Math.max(0, Math.min(totalSlides - 1, targetIndex));

        navigateTo(targetIndex);
    };

    const handleInspectArchive = useCallback((archive: JourneyMilestoneArchive) => {
        if (hasDraggedRef.current) return;
        playMechanicalClick();
        setSelectedArchive(archive);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            handlePrev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            handleNext();
        }
    };

    const activeSlide = milestoneSlides[activeIndex] || milestoneSlides[0];

    return (
        <CareerEntranceStage pillars={entrancePillars}>
            {entrancePillars && <SectionDivider className="my-2 md:my-4" marker="+" />}

            <section
                ref={sectionRef}
                id="experiencia"
                tabIndex={0}
                aria-labelledby="experience-heading"
                onKeyDown={handleKeyDown}
                className="career-focus-track bg-transparent focus:outline-none"
            >
                <div className="career-focus-frame">
                    <div className="career-collection-source">
                        <div className="career-focus-layout">
                            <header className="career-focus-header">
                                <div>
                                    <span className="portfolio-eyebrow">
                                        {lang === 'en'
                                            ? 'CAREER & OPERATIONAL ENGINEERING'
                                            : lang === 'es'
                                            ? 'TRAYECTORIA E INGENIERÍA OPERACIONAL'
                                            : 'TRAJETÓRIA & ENGENHARIA OPERACIONAL'}
                                    </span>
                                    <h2 id="experience-heading" className="portfolio-title">
                                        {lang === 'en' ? (
                                            <>
                                                Professional <em>experience.</em>
                                            </>
                                        ) : lang === 'es' ? (
                                            <>
                                                Experiencia <em>profesional.</em>
                                            </>
                                        ) : (
                                            <>
                                                Experiência <em>profissional.</em>
                                            </>
                                        )}
                                    </h2>
                                </div>

                                <div className="career-focus-header-right">
                                    {/* Strip de Métricas Executivas em Alta Densidade */}
                                    <div className="career-focus-metrics-strip" aria-label="Métricas de impacto">
                                        {summaryStats.map((stat, idx) => (
                                            <div key={idx} className="career-focus-metric-pill">
                                                <i
                                                    aria-hidden="true"
                                                    className={`${stat.icon} text-xs text-accent shrink-0`}
                                                />
                                                <div className=" leading-tight">
                                                    <span className="font-mono text-xs font-bold text-white block">
                                                        {stat.value}
                                                    </span>
                                                    <span className="text-[10px] text-neutral-400 font-sans block">
                                                        {stat.label}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Contador HUD & Barra de Progresso Contínua */}
                                    <div
                                        className="career-focus-count"
                                        aria-label={
                                            lang === 'en'
                                                ? 'Current milestone'
                                                : lang === 'es'
                                                ? 'Hito actual'
                                                : 'Marco atual'
                                        }
                                    >
                                        <div className="career-focus-count-top">
                                            <span aria-live="polite">
                                                <strong>{String(activeIndex + 1).padStart(2, '0')}</strong> /{' '}
                                                {String(totalSlides).padStart(2, '0')}
                                            </span>
                                            <span className="font-mono text-[10px] text-accent">
                                                {activeSlide.year}
                                            </span>
                                        </div>
                                        <div className="career-focus-progress-rail" aria-hidden="true">
                                            <motion.div style={{ scaleX: countProgress }} />
                                        </div>
                                    </div>
                                </div>
                            </header>

                            <div className="career-focus-gallery">
                                <div
                                    ref={containerRef}
                                    onPointerDown={handlePointerDown}
                                    style={{
                                        perspective: presenting ? undefined : '1400px',
                                        perspectiveOrigin: '50% 50%',
                                        isolation: 'isolate',
                                        transformStyle: presenting ? 'flat' : 'preserve-3d',
                                    }}
                                    className="career-focus-stage w-full mx-auto min-h-[740px] sm:min-h-[580px] flex items-center justify-center relative overflow-visible cursor-grab active:cursor-grabbing select-none"
                                >
                                    <motion.div
                                        style={{
                                            rotateZ: presenting || reducedMotion ? 0 : velocityRotateZ,
                                            skewX: presenting || reducedMotion ? 0 : velocitySkewX,
                                            transformStyle: presenting ? 'flat' : 'preserve-3d',
                                        }}
                                        className="relative w-full h-full min-h-[720px] sm:min-h-[560px] lg:min-h-[520px]"
                                    >
                                        {milestoneSlides.map((milestone, idx) => (
                                            <CareerFocusCard
                                                key={milestone.id}
                                                milestone={milestone}
                                                index={idx}
                                                activeIndex={activeIndex}
                                                smoothProgress={cardProgress}
                                                onInspectArchive={handleInspectArchive}
                                                onCardFocus={handleCardFocus}
                                                presenting={presenting}
                                                lang={lang}
                                            />
                                        ))}
                                    </motion.div>
                                </div>
                            </div>

                            <div className="career-focus-controls">
                                <div
                                    className="career-focus-tabs scrollbar-none"
                                    aria-label={
                                        lang === 'en'
                                            ? 'Career milestones'
                                            : lang === 'es'
                                            ? 'Hitos profesionales'
                                            : 'Marcos da carreira'
                                    }
                                >
                                    {milestoneSlides.map((item, idx) => {
                                        const isReached = idx <= activeIndex;
                                        return (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => navigateTo(idx)}
                                                aria-pressed={idx === activeIndex}
                                                data-cursor-morph="true"
                                                className="career-focus-tab cursor-pointer"
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className="w-2 h-2 rounded-full transition-colors duration-200"
                                                    style={{
                                                        backgroundColor: isReached
                                                            ? 'var(--color-secondary)'
                                                            : 'rgba(255,255,255,0.2)',
                                                        boxShadow:
                                                            idx === activeIndex
                                                                ? '0 0 10px var(--color-accent)'
                                                                : 'none',
                                                    }}
                                                />
                                                <span>
                                                    {item.year} · {item.stepLabel}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <MagneticButton
                                        onClick={handlePrev}
                                        aria-label={
                                            lang === 'en'
                                                ? 'Previous Milestone'
                                                : lang === 'es'
                                                ? 'Hito anterior'
                                                : 'Marco Anterior'
                                        }
                                        data-cursor-morph="true"
                                        className="portfolio-control w-10 h-10 transition-colors"
                                    >
                                        <i aria-hidden="true" className="fas fa-chevron-left text-xs" />
                                    </MagneticButton>
                                    <MagneticButton
                                        onClick={handleNext}
                                        aria-label={
                                            lang === 'en'
                                                ? 'Next Milestone'
                                                : lang === 'es'
                                                ? 'Siguiente hito'
                                                : 'Próximo Marco'
                                        }
                                        data-cursor-morph="true"
                                        className="portfolio-control w-10 h-10 transition-colors"
                                    >
                                        <i aria-hidden="true" className="fas fa-chevron-right text-xs" />
                                    </MagneticButton>
                                </div>
                            </div>

                            <p className="career-focus-cue">
                                {presenting
                                    ? lang === 'en'
                                        ? 'Scroll to explore career milestones · or use the arrows'
                                        : lang === 'es'
                                        ? 'Desplázate para explorar la trayectoria · o usa las flechas'
                                        : 'Role para explorar a trajetória · ou use as setas'
                                    : lang === 'en'
                                    ? 'Drag to explore career milestones · or use the arrows'
                                    : lang === 'es'
                                    ? 'Arrastra para explorar la trayectoria · o usa las flechas'
                                    : 'Arraste para explorar a trajetória · ou use as setas'}
                            </p>
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
        </CareerEntranceStage>
    );
};

export default memo(ProfessionalJourneyTimeline);
