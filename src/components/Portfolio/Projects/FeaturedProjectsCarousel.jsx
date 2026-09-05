import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticButton from '../MagneticButton';
import KineticVelocityWrapper from '../KineticVelocityWrapper';
import { playMechanicalClick, playTabSwitch } from '../../../lib/sound';

const FLAGSHIP_CONFIGS = [
    {
        id: 101,
        title: 'PayStream Gateway',
        tagline: 'Motor Transacional de Pagamentos & Split de Liquidação',
        stepLabel: '01 • Motor Transacional',
        badge: 'Fintech de Alta Concorrência',
        stat: 'Idempotência Atômica',
        description: 'Gateway corporativo de pagamentos fintech com liquidação de split multipartes em centavos inteiros, idempotência atômica via restrição P2002 no PostgreSQL e webhooks assinados com HMAC-SHA256 com proteção contra timing attacks.',
        image: '/projects/paystream-dash.png',
        techs: ['Fastify', 'TypeScript', 'Prisma', 'PostgreSQL', 'HMAC-SHA256'],
        url: 'https://paystream-gateway.vercel.app',
        repo: 'https://github.com/pedrhenriqueol/paystream-gateway',
    },
    {
        id: 102,
        title: 'PortLog OS',
        tagline: 'Operações Portuárias & Telemetria Industrial',
        stepLabel: '02 • Operações Portuárias',
        badge: 'Logística Portuária & ZPEs',
        stat: '100% FSM Válida',
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
        stepLabel: '03 • Engenharia de Qualidade',
        badge: 'Observabilidade & TestOps',
        stat: 'NIST Nearest Rank Math',
        description: 'Plataforma corporativa de engenharia de testes com runner isolado, validação recursiva de esquemas OpenAPI/JSON Schema, testes de estresse no Chaos Lab e percentis de cauda p50/p90/p95/p99 padronizados pelo NIST.',
        image: '/projects/spectr-workbench.png',
        techs: ['React 18', 'TypeScript', 'OpenAPI', 'Chaos Lab', 'p95 SLA Math'],
        url: 'https://spectr-testops.vercel.app',
        repo: 'https://github.com/pedrhenriqueol/spectr-testops',
    },
];

export default function FeaturedProjectsCarousel({ onSelectProject, projects = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef(null);

    const totalSlides = FLAGSHIP_CONFIGS.length;

    const goToPrev = useCallback(() => {
        playTabSwitch();
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : totalSlides - 1));
    }, [totalSlides]);

    const goToNext = useCallback(() => {
        playTabSwitch();
        setCurrentIndex(prev => (prev < totalSlides - 1 ? prev + 1 : 0));
    }, [totalSlides]);

    const handleSelectSlide = useCallback((index) => {
        if (index === currentIndex) return;
        playTabSwitch();
        setCurrentIndex(index);
    }, [currentIndex]);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') {
            goToPrev();
        } else if (e.key === 'ArrowRight') {
            goToNext();
        }
    };

    const handleDragEnd = (event, info) => {
        const threshold = 35;
        const velocityThreshold = 180;

        if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
            goToNext();
        } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
            goToPrev();
        }
    };

    const handleInspect = (config) => {
        playMechanicalClick();
        if (onSelectProject) {
            const fullProject = projects.find(p => p.id === config.id) || config;
            onSelectProject(fullProject);
        }
    };

    return (
        <KineticVelocityWrapper>
            <section
                id="projetos-destaque"
                tabIndex={0}
                onKeyDown={handleKeyDown}
                className="py-16 md:py-24 bg-darker relative border-t border-primary/20 overflow-hidden focus:outline-none"
            >
                {/* Iluminação de fundo cinemática */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[350px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* ── Header da Seção com Vocabulário Estritamente Técnico ── */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div>
                            <span className="text-accent text-[11px] font-mono font-bold tracking-[0.25em] uppercase block mb-2">
                                PROJETOS EM DESTAQUE ── ARQUITETURAS EM PRODUÇÃO
                            </span>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white font-bold">
                                Sistemas & Arquiteturas em Produção
                            </h2>
                            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mt-2 font-sans">
                                Sistemas de missão crítica desenvolvidos com foco em concorrência, idempotência contábil, governança multi-tenant e validação de contratos.
                            </p>
                        </div>

                        {/* Controles de Navegação & Dica de Arraste */}
                        <div className="flex items-center gap-4 shrink-0">
                            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-primary/70 bg-darker/90 px-3.5 py-1.5 rounded-full border border-white/10">
                                <i className="fas fa-hand-pointer text-accent text-xs" />
                                <span>Arraste para explorar os sistemas</span>
                            </div>

                            {/* Botões Magnéticos de Navegação Anterior / Próximo */}
                            <div className="flex items-center gap-2">
                                <MagneticButton
                                    onClick={goToPrev}
                                    aria-label="Projeto Anterior"
                                    data-cursor-morph="true"
                                    className="w-10 h-10 rounded-xl bg-dark/90 border border-white/15 text-primary hover:text-white hover:border-accent/50 transition-colors shadow-sm active:scale-95"
                                >
                                    <i className="fas fa-chevron-left text-xs" />
                                </MagneticButton>
                                <MagneticButton
                                    onClick={goToNext}
                                    aria-label="Próximo Projeto"
                                    data-cursor-morph="true"
                                    className="w-10 h-10 rounded-xl bg-dark/90 border border-white/15 text-primary hover:text-white hover:border-accent/50 transition-colors shadow-sm active:scale-95"
                                >
                                    <i className="fas fa-chevron-right text-xs" />
                                </MagneticButton>
                            </div>
                        </div>
                    </div>

                    {/* ── Indicadores de Progresso com layoutId e Spring Physics (Rauno Freiberg) ── */}
                    <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-none py-1">
                        {FLAGSHIP_CONFIGS.map((item, idx) => {
                            const isActive = idx === currentIndex;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleSelectSlide(idx)}
                                    data-cursor-morph="true"
                                    className={`relative px-4 py-2 rounded-xl text-xs font-mono transition-colors flex items-center gap-2.5 cursor-pointer shrink-0 border ${
                                        isActive
                                            ? 'text-accent font-bold border-accent/60'
                                            : 'text-primary/70 border-white/10 hover:text-white hover:border-white/20'
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="featuredPillActive"
                                            className="absolute inset-0 bg-accent/15 rounded-xl border border-accent shadow-[0_0_15px_rgba(217,119,87,0.25)]"
                                            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                                        />
                                    )}
                                    <span className={`relative z-10 w-2 h-2 rounded-full ${isActive ? 'bg-accent animate-pulse' : 'bg-white/25'}`} />
                                    <span className="relative z-10">{item.stepLabel}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* ── Palco de Profundidade & Arraste Manual (Drag & Swipe com Mola Amortecida) ── */}
                    <div ref={containerRef} className="relative overflow-hidden rounded-3xl">
                        <motion.div
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={handleDragEnd}
                            className="w-full cursor-grab active:cursor-grabbing select-none"
                        >
                            <AnimatePresence mode="wait">
                                {(() => {
                                    const activeProject = FLAGSHIP_CONFIGS[currentIndex];
                                    return (
                                        <motion.div
                                            key={activeProject.id}
                                            initial={{ opacity: 0, x: 40, scale: 0.97 }}
                                            animate={{ opacity: 1, x: 0, scale: 1 }}
                                            exit={{ opacity: 0, x: -40, scale: 0.97 }}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 260,
                                                damping: 25,
                                            }}
                                            className="w-full rounded-2xl bg-[#0E1118] border border-white/15 overflow-hidden flex flex-col lg:flex-row shadow-[0_25px_70px_rgba(0,0,0,0.75)] group"
                                        >
                                            {/* Lado Esquerdo: Imagem / Mockup Real */}
                                            <div className="w-full lg:w-1/2 min-h-[260px] sm:min-h-[340px] lg:min-h-[420px] relative overflow-hidden bg-[#07090D] border-b lg:border-b-0 lg:border-r border-white/10 shrink-0">
                                                <img
                                                    src={activeProject.image}
                                                    alt={activeProject.title}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover object-left-top transform group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100 pointer-events-none"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/dashboard_placeholder.png';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0E1118] via-transparent to-transparent opacity-70 pointer-events-none" />
                                                
                                                {/* Badge Superior */}
                                                <span className="absolute top-4 left-4 bg-darker/90 border border-accent/40 text-accent text-[10px] font-mono font-bold px-3 py-1 rounded-full backdrop-blur-md">
                                                    {activeProject.badge}
                                                </span>
                                            </div>

                                            {/* Lado Direito: Especificações Técnicas de Engenharia */}
                                            <div className="p-6 sm:p-8 lg:p-10 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex items-center justify-between gap-3 mb-2.5">
                                                        <span className="text-[11px] font-mono text-accent uppercase tracking-wider font-bold">
                                                            {activeProject.stepLabel}
                                                        </span>
                                                        <span className="text-[11px] font-mono text-green-400 bg-green-400/10 border border-green-400/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                                            {activeProject.stat}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-white font-bold mb-1 group-hover:text-accent transition-colors">
                                                        {activeProject.title}
                                                    </h3>
                                                    <p className="text-primary/90 text-sm font-sans mb-4">
                                                        {activeProject.tagline}
                                                    </p>
                                                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
                                                        {activeProject.description}
                                                    </p>

                                                    {/* Tags de Tecnologias */}
                                                    <div className="flex flex-wrap gap-2 mb-8">
                                                        {activeProject.techs.map((tech, i) => (
                                                            <span
                                                                key={i}
                                                                className="text-[11px] font-mono text-white/90 bg-white/5 border border-white/10 px-3 py-1 rounded-lg"
                                                            >
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Botões de Ação com Botão Magnético e Vocabulário Normalizado */}
                                                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                                                    <button
                                                        onClick={() => handleInspect(activeProject)}
                                                        data-cursor-morph="true"
                                                        className="flex-1 min-w-[140px] py-3 px-4 bg-accent/20 border border-accent/40 hover:bg-accent hover:text-darker text-accent font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                                                    >
                                                        <i className="fas fa-microchip text-xs" />
                                                        <span>Detalhes Técnicos</span>
                                                    </button>
                                                    
                                                    <MagneticButton
                                                        as="a"
                                                        href={activeProject.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        data-cursor-morph="true"
                                                        className="py-3 px-5 bg-accent text-darker font-bold text-xs sm:text-sm rounded-xl hover:bg-accent-hover transition-all flex items-center gap-2 shadow-md active:scale-95"
                                                    >
                                                        <span>Acessar Demonstração</span>
                                                        <i className="fas fa-external-link-alt text-[10px]" />
                                                    </MagneticButton>

                                                    <MagneticButton
                                                        as="a"
                                                        href={activeProject.repo}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        data-cursor-morph="true"
                                                        className="p-3 bg-darker border border-white/15 text-primary hover:text-white rounded-xl transition-colors active:scale-95"
                                                        title="Código-Fonte no GitHub"
                                                    >
                                                        <i className="fab fa-github text-base" />
                                                    </MagneticButton>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })()}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Footer Minimalista de Status */}
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-primary/50 gap-2 border-t border-white/5 pt-4">
                        <span>Arquiteturas em Produção • Fastify, PostgreSQL, WebSockets</span>
                        <span>Navegação manual por clique ou swipe • {currentIndex + 1} de {totalSlides}</span>
                    </div>
                </div>
            </section>
        </KineticVelocityWrapper>
    );
}
