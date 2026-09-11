import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SkillsOrbital3D, { TechItem } from './SkillsOrbital3D';

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

const BENTO_CARDS: TechnicalCard[] = [
    {
        id: 'qa-validation',
        title: 'Garantia da Qualidade (QA)',
        badge: 'Ambientes Críticos',
        icon: 'fas fa-shield-halved',
        colSpan: 'md:col-span-1 lg:col-span-4 flex flex-col justify-between',
        items: [
            {
                name: 'Postman',
                desc: 'Modelagem de collections, testes de schema JSON e asserções automatizadas de status code.',
            },
            {
                name: 'Testes de Regressão',
                desc: 'Validação de ponta a ponta (E2E) para regras operacionais e fluxos de ZPEs/portuários.',
            },
            {
                name: 'Engenharia de Requisitos',
                desc: 'Rastreamento de inconsistências funcionais e alinhamento com metodologias ágeis.',
            },
        ],
    },
    {
        id: 'reverse-legacy',
        title: 'Modernização & Legados',
        badge: 'Sustentação ERP',
        icon: 'fas fa-terminal',
        colSpan: 'md:col-span-1 lg:col-span-4 flex flex-col justify-between',
        items: [
            {
                name: 'Delphi 6 & 11',
                desc: 'Refatoração de regras de negócio em monolitos legados de alta carga.',
            },
            {
                name: 'UniGui Web',
                desc: 'Transição de aplicações desktop VCL para arquitetura web moderna.',
            },
            {
                name: 'Componentes Fiscais & Relatórios',
                desc: 'Integração ACBr (NFe/MDFe) e relatórios via FortesReport.',
            },
        ],
    },
    {
        id: 'backend-architecture',
        title: 'Backend & Serviços REST',
        badge: 'Arquitetura REST',
        icon: 'fas fa-server',
        colSpan: 'md:col-span-2 lg:col-span-4 flex flex-col justify-between',
        items: [
            {
                name: 'PHP 8.x & Laravel',
                desc: 'Construção de APIs estruturadas em camadas de serviço, DTOs e Eloquent ORM.',
            },
            {
                name: 'Sistemas Multi-Tenant',
                desc: 'Modelagem de bancos de dados isolados para redes de filiais corporativas.',
            },
            {
                name: 'Resiliência & Segurança',
                desc: 'Tratamento de exceções, autenticação via tokens e controle granular de acessos.',
            },
        ],
    },
    {
        id: 'database-tuning',
        title: 'Bancos de Dados & SQL',
        badge: 'Transacional',
        icon: 'fas fa-database',
        colSpan: 'md:col-span-1 lg:col-span-5 flex flex-col justify-between',
        items: [
            {
                name: 'Microsoft SQL Server',
                desc: 'Diagnóstico de planos de execução, índices cobertos e eliminação de gargalos N+1.',
            },
            {
                name: 'MySQL / PostgreSQL',
                desc: 'Modelagem relacional, constraints de integridade e auditoria de logs fiscais.',
            },
        ],
    },
    {
        id: 'frontend-modern',
        title: 'Frontend & Interatividade',
        badge: 'Alta Densidade',
        icon: 'fas fa-layer-group',
        colSpan: 'md:col-span-1 lg:col-span-7 flex flex-col justify-between',
        items: [
            {
                name: 'React & TypeScript',
                desc: 'Interfaces tipadas rigorosamente, gerenciamento de estado previsível e custom hooks.',
            },
            {
                name: 'Tailwind CSS',
                desc: 'Estilização utilitária industrial, design systems de baixa latência e micro-interações táteis.',
            },
            {
                name: 'Server-Sent Events (SSE)',
                desc: 'Consumo de fluxos de streaming token a token em tempo real.',
            },
        ],
    },
];

interface SkillsProps {
    skills?: TechItem[];
}

export default function Skills({ skills = [] }: SkillsProps) {
    const [viewMode, setViewMode] = useState<'bento' | '3d'>('bento');

    return (
        <section id="conhecimentos" className="py-24 md:py-32 bg-transparent relative select-text">
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
                            Stack & Habilidades
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-3">
                        Especialização <span className="italic font-serif">técnica.</span>
                    </h2>
                    <p className="text-neutral-400 max-w-2xl mx-auto font-sans text-sm sm:text-base leading-relaxed mb-6">
                        Competências comprovadas em engenharia reversa de sistemas legados, garantia da qualidade em fluxos críticos, arquitetura de APIs e interfaces industriais de alta densidade.
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
                            Grade Técnica
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
                            Visualizador 3D
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
                                    {BENTO_CARDS.map((card, cardIndex) => {
                                        const isSpanned = card.id === 'frontend-modern';

                                        return (
                                            <motion.div
                                                key={card.id}
                                                initial={{ opacity: 0, y: 15 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.4, delay: cardIndex * 0.05 }}
                                                className={`bg-[#0c0e14]/70 backdrop-blur-xl border border-white/[0.07] rounded-2xl p-5 md:p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] transition-all duration-200 hover:border-white/[0.12] ${
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
                                    })}
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
                                <SkillsOrbital3D skills={skills} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </section>
    );
}
