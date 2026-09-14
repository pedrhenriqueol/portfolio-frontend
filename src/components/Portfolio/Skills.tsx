import React, { useState, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SkillsOrbital3D, { TechItem } from './SkillsOrbital3D';
import { useLanguage } from '../../context/LanguageContext';

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

/* ── Card de Especialidade Técnica Isolado e Memoizado (Zero Re-renders) ── */
const BentoSkillCard = memo(function BentoSkillCard({
    card,
    cardIndex,
}: {
    card: TechnicalCard;
    cardIndex: number;
}) {
    const isSpanned = card.id === 'frontend-modern';

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: cardIndex * 0.05 }}
            style={{ transform: 'translateZ(0)' }}
            className={`bg-[#0c0e14]/90 backdrop-blur-sm border border-white/[0.07] rounded-2xl p-5 md:p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] transition-all duration-200 hover:border-white/[0.12] will-change-transform ${
                card.colSpan
            }`}
        >
            <div>
                {/* Cabeçalho do Card (Sem Truncate) */}
                <div className="flex items-center justify-between gap-3 mb-5 pb-3.5 border-b border-white/[0.05]">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-neutral-300 shrink-0">
                            <i className={`${card.icon} text-xs`} />
                        </div>
                        <h3 className="font-sans text-sm md:text-[15px] font-semibold text-white whitespace-normal">
                            {card.title}
                        </h3>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-neutral-400 border border-white/[0.08] shrink-0 whitespace-nowrap">
                        {card.badge}
                    </span>
                </div>

                {/* Itens Internos (High Data-Density) */}
                {isSpanned ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {card.items.map((item, idx) => (
                            <div
                                key={item.name}
                                className={`border-b sm:border-b-0 ${
                                    idx < card.items.length - 1
                                        ? 'sm:border-r border-white/[0.05] sm:pr-4'
                                        : ''
                                } pb-3 sm:pb-0 last:border-0 last:pb-0`}
                            >
                                <span className="font-mono text-xs font-semibold text-white block mb-1">
                                    {item.name}
                                </span>
                                <p className="text-[12px] text-neutral-400 font-sans leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {card.items.map((item) => (
                            <div
                                key={item.name}
                                className="border-b border-white/[0.04] pb-3 mb-3 last:border-0 last:pb-0 last:mb-0"
                            >
                                <span className="font-mono text-xs font-semibold text-white block mb-1">
                                    {item.name}
                                </span>
                                <p className="text-[12px] text-neutral-400 font-sans leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
});

export function Skills({ skills = [] }: { skills?: TechItem[] }) {
    const { lang = 'pt' } = useLanguage();
    const [viewMode, setViewMode] = useState<'bento' | '3d'>('bento');

    const bentoCards = useMemo(() => {
        return BENTO_CARDS_I18N[lang] || BENTO_CARDS_I18N.pt;
    }, [lang]);

    return (
        <section id="habilidades" className="py-24 md:py-36 bg-transparent relative select-text">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* ── Cabeçalho Limpo da Seção ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.07] mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <span className="text-[11px] tracking-wider text-neutral-400 uppercase font-mono">
                            {lang === 'en' ? 'Stack & Skills' : lang === 'es' ? 'Stack y Habilidades' : 'Stack & Habilidades'}
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-3">
                        {lang === 'en' ? (
                            <>Technical <span className="italic font-serif">specialization.</span></>
                        ) : lang === 'es' ? (
                            <>Especialización <span className="italic font-serif">técnica.</span></>
                        ) : (
                            <>Especialização <span className="italic font-serif">técnica.</span></>
                        )}
                    </h2>
                    <p className="text-neutral-400 max-w-2xl mx-auto font-sans text-sm sm:text-base leading-relaxed mb-6">
                        {lang === 'en'
                            ? 'Proven competencies in legacy system reverse engineering, critical workflow QA, API architecture, and high-density industrial interfaces.'
                            : lang === 'es'
                            ? 'Competencias comprobadas en ingeniería inversa de sistemas heredados, aseguramiento de calidad en flujos críticos, arquitectura de APIs e interfaces industriales.'
                            : 'Competências comprovadas em engenharia reversa de sistemas legados, garantia da qualidade em fluxos críticos, arquitetura de APIs e interfaces industriais de alta densidade.'}
                    </p>

                    {/* ── Seletor Minimalista de Modos (Grade Técnica vs 3D) ── */}
                    <div className="inline-flex items-center p-1 rounded-xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-md">
                        <button
                            type="button"
                            onClick={() => setViewMode('bento')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                                viewMode === 'bento'
                                    ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                                    : 'text-neutral-400 hover:text-white'
                            }`}
                        >
                            {lang === 'en' ? 'Technical Grid' : lang === 'es' ? 'Cuadrícula Técnica' : 'Grade Técnica'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('3d')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                                viewMode === '3d'
                                    ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                                    : 'text-neutral-400 hover:text-white'
                            }`}
                        >
                            {lang === 'en' ? '3D Visualizer' : lang === 'es' ? 'Visualizador 3D' : 'Visualizador 3D'}
                        </button>
                    </div>
                </motion.div>

                {/* ── Conteúdo Alternável com Cross-Fade Suave ── */}
                <div className="min-h-[480px] w-full">
                    <AnimatePresence mode="wait">
                        {viewMode === 'bento' ? (
                            <motion.div
                                key="bento-view"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
                                    {bentoCards.map((card, cardIndex) => (
                                        <BentoSkillCard
                                            key={card.id}
                                            card={card}
                                            cardIndex={cardIndex}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="3d-view"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full flex justify-center"
                            >
                                <SkillsOrbital3D skills={skills} active={viewMode === '3d'} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </section>
    );
}

export default memo(Skills);
