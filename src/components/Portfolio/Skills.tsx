import { ChapterHeading } from './Common/ScrollChapter';
import CareerSkillsHandoff from './Common/CareerSkillsHandoff';
import React, { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import SkillsOrbital3D, { TechItem } from './SkillsOrbital3D';
import { useLanguage } from '../../context/LanguageContext';
import { playMechanicalClick } from '../../lib/sound';

interface TechnicalCard {
    id: string;
    title: string;
    badge: string;
    icon: string;
    colSpan: string;
    items: {
        name: string;
        desc: string;
    }[];
}

const BENTO_CARDS_I18N: Record<string, TechnicalCard[]> = {
    pt: [
        {
            id: 'qa-validation',
            title: 'Garantia da Qualidade (QA)',
            badge: 'Ambientes Críticos',
            icon: 'fas fa-shield-halved',
            colSpan: 'md:col-span-1 lg:col-span-4 flex flex-col justify-between',
            items: [
                {
                    name: 'Testes de API & Contratos',
                    desc: 'Modelagem de coleções no Postman com validação estrita de status codes, headers e integridade de schemas JSON.',
                },
                {
                    name: 'Cobertura Regressiva',
                    desc: 'Blindagem de fluxos críticos de aduana e ZPEs contra regressões funcionais em ambiente de produção.',
                },
                {
                    name: 'Auditoria de Dados SQL',
                    desc: 'Consultas diagnósticas para rastreamento de anomalias em bases transacionais de alta concorrência.',
                },
            ],
        },
        {
            id: 'legacy-delphi',
            title: 'Engenharia de Sistemas Delphi',
            badge: 'Modernização & VCL',
            icon: 'fas fa-server',
            colSpan: 'md:col-span-1 lg:col-span-4 flex flex-col justify-between',
            items: [
                {
                    name: 'Migração Web (UniGui)',
                    desc: 'Transição de monolitos desktop para interfaces web corporativas mantendo regras de negócio estáveis.',
                },
                {
                    name: 'Modernização Delphi 11',
                    desc: 'Refatoração e manutenção preventiva em bases de código Delphi 6/7 para arquitetura moderna de 64 bits.',
                },
                {
                    name: 'Módulos Fiscais (ACBr)',
                    desc: 'Conformidade contábil e emissão em conformidade estrita com SEFAZ através da suíte ACBr.',
                },
            ],
        },
        {
            id: 'backend-db',
            title: 'Backend & Bancos de Dados',
            badge: 'Alta Performance',
            icon: 'fas fa-database',
            colSpan: 'md:col-span-2 lg:col-span-4 flex flex-col justify-between',
            items: [
                {
                    name: 'APIs RESTful em Laravel',
                    desc: 'Desenvolvimento de endpoints orientados a domínio com autenticação e validação estrita de payload.',
                },
                {
                    name: 'Query Tuning (SQL Server)',
                    desc: 'Otimização de planos de execução, resolução de gargalos N+1 e indexação inteligente.',
                },
                {
                    name: 'Modelagem Relacional',
                    desc: 'Esquemas transacionais no MySQL e PostgreSQL com chaves compostas e integridade referencial.',
                },
            ],
        },
        {
            id: 'frontend-modern',
            title: 'Frontend Moderno & Interfaces Industriais',
            badge: 'UI Engenharia',
            icon: 'fab fa-react',
            colSpan: 'col-span-1 md:col-span-2 lg:col-span-12',
            items: [
                {
                    name: 'React 19 & TypeScript',
                    desc: 'Aplicações Single Page (SPA) de alta fidelidade com tipagem estrita e gestão determinística de estado.',
                },
                {
                    name: 'Design System & Tailwind',
                    desc: 'Tokens semânticos de alta densidade visual, paletas industriais sob medida e zero vazamento de estilos.',
                },
                {
                    name: 'Micro-Animações com Física',
                    desc: 'Orquestração fluida em Framer Motion com molas, aceleração por GPU e ausência total de Layout Shift.',
                },
            ],
        },
    ],
    en: [
        {
            id: 'qa-validation',
            title: 'Quality Assurance (QA)',
            badge: 'Mission-Critical',
            icon: 'fas fa-shield-halved',
            colSpan: 'md:col-span-1 lg:col-span-4 flex flex-col justify-between',
            items: [
                {
                    name: 'API & Contract Testing',
                    desc: 'Postman collection modeling with strict validation of status codes, headers, and JSON schema integrity.',
                },
                {
                    name: 'Regression Coverage',
                    desc: 'Shielding critical customs and FTZ workflows against functional regressions in production.',
                },
                {
                    name: 'SQL Data Auditing',
                    desc: 'Diagnostic queries for anomaly tracing across high-concurrency transactional databases.',
                },
            ],
        },
        {
            id: 'legacy-delphi',
            title: 'Delphi Systems Engineering',
            badge: 'Modernization & VCL',
            icon: 'fas fa-server',
            colSpan: 'md:col-span-1 lg:col-span-4 flex flex-col justify-between',
            items: [
                {
                    name: 'Web Migration (UniGui)',
                    desc: 'Transitioning desktop monoliths to enterprise web interfaces while keeping business rules stable.',
                },
                {
                    name: 'Delphi 11 Modernization',
                    desc: 'Refactoring and preventive maintenance on Delphi 6/7 codebases towards modern 64-bit architecture.',
                },
                {
                    name: 'Fiscal & Tax Modules (ACBr)',
                    desc: 'Accounting compliance and invoicing in strict alignment with tax authorities via ACBr suite.',
                },
            ],
        },
        {
            id: 'backend-db',
            title: 'Backend & Databases',
            badge: 'High Performance',
            icon: 'fas fa-database',
            colSpan: 'md:col-span-2 lg:col-span-4 flex flex-col justify-between',
            items: [
                {
                    name: 'RESTful APIs in Laravel',
                    desc: 'Domain-driven endpoint development with authentication and strict payload validation.',
                },
                {
                    name: 'Query Tuning (SQL Server)',
                    desc: 'Execution plan optimization, N+1 query elimination, and intelligent compound indexing.',
                },
                {
                    name: 'Relational Modeling',
                    desc: 'Transactional schemas in MySQL and PostgreSQL with composite keys and referential integrity.',
                },
            ],
        },
        {
            id: 'frontend-modern',
            title: 'Modern Frontend & Industrial UI',
            badge: 'UI Engineering',
            icon: 'fab fa-react',
            colSpan: 'col-span-1 md:col-span-2 lg:col-span-12',
            items: [
                {
                    name: 'React 19 & TypeScript',
                    desc: 'High-fidelity Single Page Applications (SPAs) with strict typing and deterministic state management.',
                },
                {
                    name: 'Design System & Tailwind',
                    desc: 'High data-density semantic tokens, bespoke industrial palettes, and zero visual style leakage.',
                },
                {
                    name: 'Physics Micro-Animations',
                    desc: 'Fluid Framer Motion spring physics, GPU acceleration, and zero Cumulative Layout Shift (CLS).',
                },
            ],
        },
    ],
    es: [
        {
            id: 'qa-validation',
            title: 'Aseguramiento de Calidad (QA)',
            badge: 'Entornos Críticos',
            icon: 'fas fa-shield-halved',
            colSpan: 'md:col-span-1 lg:col-span-4 flex flex-col justify-between',
            items: [
                {
                    name: 'Pruebas de API y Contratos',
                    desc: 'Modelado de colecciones en Postman con validación estricta de códigos de estado, cabeceras y esquemas JSON.',
                },
                {
                    name: 'Cobertura de Regresión',
                    desc: 'Blindaje de flujos críticos de aduanas y ZPEs contra regresiones funcionales en producción.',
                },
                {
                    name: 'Auditoría de Datos SQL',
                    desc: 'Consultas de diagnóstico para rastreo de anomalías en bases transaccionales de alta concurrencia.',
                },
            ],
        },
        {
            id: 'legacy-delphi',
            title: 'Ingeniería de Sistemas Delphi',
            badge: 'Modernización y VCL',
            icon: 'fas fa-server',
            colSpan: 'md:col-span-1 lg:col-span-4 flex flex-col justify-between',
            items: [
                {
                    name: 'Migración Web (UniGui)',
                    desc: 'Transición de monolitos de escritorio a interfaces web corporativas manteniendo reglas de negocio estables.',
                },
                {
                    name: 'Modernización Delphi 11',
                    desc: 'Refactorización y mantenimiento preventivo en bases Delphi 6/7 hacia arquitectura moderna de 64 bits.',
                },
                {
                    name: 'Módulos Fiscales (ACBr)',
                    desc: 'Cumplimiento contable y facturación en estricta conformidad fiscal mediante la suite ACBr.',
                },
            ],
        },
        {
            id: 'backend-db',
            title: 'Backend y Bases de Datos',
            badge: 'Alto Rendimiento',
            icon: 'fas fa-database',
            colSpan: 'md:col-span-2 lg:col-span-4 flex flex-col justify-between',
            items: [
                {
                    name: 'APIs RESTful en Laravel',
                    desc: 'Desarrollo de endpoints orientados al dominio con autenticación y validación estricta de payload.',
                },
                {
                    name: 'Query Tuning (SQL Server)',
                    desc: 'Optimización de planes de ejecución, eliminación de consultas N+1 e indexación inteligente.',
                },
                {
                    name: 'Modelado Relacional',
                    desc: 'Esquemas transaccionales en MySQL y PostgreSQL con claves compuestas e integridad referencial.',
                },
            ],
        },
        {
            id: 'frontend-modern',
            title: 'Frontend Moderno e Interfaces Industriales',
            badge: 'Ingeniería de UI',
            icon: 'fab fa-react',
            colSpan: 'col-span-1 md:col-span-2 lg:col-span-12',
            items: [
                {
                    name: 'React 19 y TypeScript',
                    desc: 'Aplicaciones Single Page (SPA) de alta fidelidad con tipado estricto y gestión determinista de estado.',
                },
                {
                    name: 'Design System y Tailwind',
                    desc: 'Tokens semánticos de alta densidad de datos, paletas industriales a medida y cero fuga de estilos.',
                },
                {
                    name: 'Micro-Animaciones con Física',
                    desc: 'Orquestación fluida con Framer Motion, resortes físicos, aceleración por GPU y cero Layout Shift.',
                },
            ],
        },
    ],
};

/* ── Card de Especialidade Técnica com Moldura HUD Tracejada, Cantoneiras e Ignição "Pisca" ── */
const BentoSkillCard = memo(function BentoSkillCard({
    card,
    cardIndex,
    lang,
}: {
    card: TechnicalCard;
    cardIndex: number;
    lang: string;
}) {
    const isSpanned = card.id === 'frontend-modern';
    const [isIgnited, setIsIgnited] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsIgnited(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.16 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const handleToggle = useCallback(() => {
        playMechanicalClick();
        setIsExpanded(prev => !prev);
    }, []);

    return (
        <div
            ref={cardRef}
            data-skill-card={card.id}
            data-hud-ignited={isIgnited ? 'true' : 'false'}
            style={{
                ['--hud-delay' as string]: `${cardIndex * 95}ms`,
            }}
            className={`portfolio-hud-frame p-5 md:p-6 ${card.colSpan}`}
        >
            {/* Cantoneiras Técnicas em L (┌ ┐ └ ┘) */}
            <div className="portfolio-hud-corners" aria-hidden="true">
                <span className="portfolio-hud-corner-bl" />
                <span className="portfolio-hud-corner-br" />
            </div>

            <div className="portfolio-hud-body h-full flex flex-col justify-between">
                <div>
                    {/* Cabeçalho do Card com Badge Tracejado e Toggle Quadrado [v]/[^] */}
                    <div className="flex items-center justify-between gap-3 mb-4 pb-3.5 border-b border-dashed border-white/[0.12]">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="portfolio-icon flex items-center justify-center shrink-0">
                                <i aria-hidden="true" className={`${card.icon} text-xs`} />
                            </div>
                            <h3 className="font-serif text-base md:text-[17px] font-semibold text-white whitespace-normal leading-snug">
                                {card.title}
                            </h3>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <span className="portfolio-chip-dashed shrink-0 whitespace-nowrap">
                                {card.badge}
                            </span>
                            <button
                                type="button"
                                onClick={handleToggle}
                                aria-expanded={isExpanded}
                                aria-label={
                                    isExpanded
                                        ? (lang === 'en' ? `Collapse ${card.title}` : lang === 'es' ? `Contraer ${card.title}` : `Recolher ${card.title}`)
                                        : (lang === 'en' ? `Expand ${card.title}` : lang === 'es' ? `Expandir ${card.title}` : `Expandir ${card.title}`)
                                }
                                title={
                                    isExpanded
                                        ? (lang === 'en' ? 'Compact view' : lang === 'es' ? 'Vista compacta' : 'Visão compacta')
                                        : (lang === 'en' ? 'Detailed view' : lang === 'es' ? 'Vista detallada' : 'Visão detalhada')
                                }
                                className="portfolio-hud-toggle"
                            >
                                <i
                                    aria-hidden="true"
                                    className={`fas fa-chevron-down text-[9px] transition-transform duration-200 ${
                                        isExpanded ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Itens Internos (High Data-Density com recolhimento suave das descrições) */}
                    {isSpanned ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {card.items.map((item, idx) => (
                                <div
                                    key={item.name}
                                    className={`border-b sm:border-b-0 ${
                                        idx < card.items.length - 1
                                            ? 'sm:border-r border-dashed border-white/[0.1] sm:pr-4'
                                            : ''
                                    } pb-3 sm:pb-0 last:border-0 last:pb-0`}
                                >
                                    <span className="font-mono text-xs font-semibold text-white flex items-center gap-1.5 mb-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent/80 shrink-0" />
                                        {item.name}
                                    </span>
                                    <AnimatePresence initial={false}>
                                        {isExpanded && (
                                            <motion.p
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                                                className="text-[13px] sm:text-sm text-neutral-400 font-sans leading-relaxed overflow-hidden"
                                            >
                                                {item.desc}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {card.items.map((item) => (
                                <div
                                    key={item.name}
                                    className="border-b border-dashed border-white/[0.08] pb-2.5 last:border-0 last:pb-0"
                                >
                                    <span className="font-mono text-xs font-semibold text-white flex items-center gap-1.5 mb-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent/80 shrink-0" />
                                        {item.name}
                                    </span>
                                    <AnimatePresence initial={false}>
                                        {isExpanded && (
                                            <motion.p
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                                                className="text-[13px] sm:text-sm text-neutral-400 font-sans leading-relaxed overflow-hidden"
                                            >
                                                {item.desc}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

export function Skills({ skills = [] }: { skills?: TechItem[] }) {
    const { lang = 'pt' } = useLanguage();
    const reducedMotion = useReducedMotion();
    const [viewMode, setViewMode] = useState<'bento' | '3d'>('bento');

    const bentoCards = useMemo(() => {
        return BENTO_CARDS_I18N[lang] || BENTO_CARDS_I18N.pt;
    }, [lang]);

    const heading = (
        <ChapterHeading className="text-center">
                <span className="portfolio-eyebrow">
                    {lang === 'en' ? 'Stack & Skills' : lang === 'es' ? 'Stack y Habilidades' : 'Stack & Habilidades'}
                </span>
            <h2 id="skills-heading" className="portfolio-title mb-3">
                {lang === 'en' ? (
                    <>Technical <span className="italic font-serif">specialization.</span></>
                ) : lang === 'es' ? (
                    <>Especialización <span className="italic font-serif">técnica.</span></>
                ) : (
                    <>Especialização <span className="italic font-serif">técnica.</span></>
                )}
            </h2>
            <p className="portfolio-lede max-w-2xl mx-auto mb-6">
                {lang === 'en'
                    ? 'Proven competencies in legacy system reverse engineering, critical workflow QA, API architecture, and high-density industrial interfaces.'
                    : lang === 'es'
                    ? 'Competencias comprobadas en ingeniería inversa de sistemas heredados, aseguramiento de calidad en flujos críticos, arquitectura de APIs e interfaces industriales.'
                    : 'Competências comprovadas em engenharia reversa de sistemas legados, garantia da qualidade em fluxos críticos, arquitetura de APIs e interfaces industriais de alta densidade.'}
            </p>

            {/* ── Seletor Minimalista de Modos (Grade Técnica vs 3D) ── */}
            <div className="portfolio-segmented inline-flex items-center p-1">
                <button
                    type="button"
                    onClick={() => setViewMode('bento')}
                    aria-pressed={viewMode === 'bento'}
                    className={`portfolio-control px-3.5 py-1.5 text-xs font-mono cursor-pointer ${
                        viewMode === 'bento'
                            ? 'font-semibold'
                            : 'text-neutral-400 hover:text-white'
                    }`}
                >
                    {lang === 'en' ? 'Technical Grid' : lang === 'es' ? 'Cuadrícula Técnica' : 'Grade Técnica'}
                </button>
                <button
                    type="button"
                    onClick={() => setViewMode('3d')}
                    aria-pressed={viewMode === '3d'}
                    className={`portfolio-control px-3.5 py-1.5 text-xs font-mono cursor-pointer ${
                        viewMode === '3d'
                            ? 'font-semibold'
                            : 'text-neutral-400 hover:text-white'
                    }`}
                >
                    {lang === 'en' ? '3D Visualizer' : lang === 'es' ? 'Visualizador 3D' : 'Visualizador 3D'}
                </button>
            </div>
        </ChapterHeading>
    );

    return (
        <section aria-labelledby="skills-heading" className="career-skills-section bg-transparent relative select-text">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <CareerSkillsHandoff mode={viewMode} language={lang} heading={heading}>

                    {/* ── Conteúdo Alternável com Cross-Fade Suave ── */}
                    <div className="chapter-tail min-h-[480px] w-full">
                        <AnimatePresence mode="wait">
                            {viewMode === 'bento' ? (
                                <motion.div
                                    key="bento-view"
                                    initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: reducedMotion ? 0 : -12 }}
                                    transition={{ duration: reducedMotion ? 0 : .65, ease: [.22, 1, .36, 1] }}
                                    className="w-full"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
                                        {bentoCards.map((card, cardIndex) => (
                                            <BentoSkillCard
                                                key={card.id}
                                                card={card}
                                                cardIndex={cardIndex}
                                                lang={lang}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="3d-view"
                                    initial={reducedMotion ? false : { opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
                                    transition={{ duration: reducedMotion ? 0 : .65, ease: [.22, 1, .36, 1] }}
                                    className="w-full flex justify-center"
                                >
                                    <SkillsOrbital3D skills={skills} active={viewMode === '3d'} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </CareerSkillsHandoff>

            </div>
        </section>
    );
}

export default memo(Skills);
