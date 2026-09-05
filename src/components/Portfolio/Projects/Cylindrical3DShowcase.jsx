import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion';
import MagneticButton from '../MagneticButton';
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

/**
 * CylindricalCard - Card 3D individual posicionado ao longo da curvatura cilíndrica
 */
function CylindricalCard({ project, index, smoothProgress, onSelect, onCardFocus }) {
    // Diferença em tempo real (i - progress)
    const rotateY = useTransform(smoothProgress, (p) => `${(index - p) * 32}deg`);
    const translateZ = useTransform(smoothProgress, (p) => `${-Math.abs(index - p) * 160}px`);
    const translateX = useTransform(smoothProgress, (p) => `${(index - p) * 72}%`);
    const scale = useTransform(smoothProgress, (p) => Math.max(0.76, 1 - Math.abs(index - p) * 0.12));
    const opacity = useTransform(smoothProgress, (p) => Math.max(0.22, 1 - Math.abs(index - p) * 0.42));
    const zIndex = useTransform(smoothProgress, (p) => Math.round(50 - Math.abs(index - p) * 15));
    const shadowOpacity = useTransform(smoothProgress, (p) => Math.max(0, 0.7 - Math.abs(index - p) * 0.35));

    const handleClick = (e) => {
        const currentP = smoothProgress.get();
        const diff = Math.abs(index - currentP);
        // Se for um card lateral, focar nele
        if (diff >= 0.4) {
            e.stopPropagation();
            onCardFocus(index);
        }
    };

    return (
        <motion.div
            style={{
                translateX,
                rotateY,
                translateZ,
                scale,
                opacity,
                zIndex,
                transformStyle: 'preserve-3d',
                transformOrigin: '50% 50%',
            }}
            onClick={handleClick}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[88vw] sm:w-[74vw] md:w-[680px] lg:w-[840px] h-[480px] sm:h-[440px] lg:h-[420px] will-change-transform select-none"
        >
            {/* Card Tridimensional Principal */}
            <div className="w-full h-full rounded-2xl bg-[#0E1118] border border-white/15 overflow-hidden flex flex-col md:flex-row shadow-[0_25px_80px_rgba(0,0,0,0.85)] relative group">
                {/* Lado Esquerdo: Imagem / Mockup Real */}
                <div className="w-full md:w-1/2 h-44 sm:h-52 md:h-full relative overflow-hidden bg-[#07090D] border-b md:border-b-0 md:border-r border-white/10 shrink-0 pointer-events-none">
                    <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-left-top transform group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/dashboard_placeholder.png';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0E1118] via-transparent to-transparent opacity-70" />
                    
                    {/* Badge Superior */}
                    <span className="absolute top-3.5 left-3.5 bg-darker/90 border border-accent/40 text-accent text-[10px] font-mono font-bold px-3 py-1 rounded-full backdrop-blur-md">
                        {project.badge}
                    </span>
                </div>

                {/* Lado Direito: Especificações Técnicas de Engenharia */}
                <div className="p-5 sm:p-7 md:p-8 flex-1 flex flex-col justify-between overflow-hidden">
                    <div>
                        <div className="flex items-center justify-between gap-3 mb-2">
                            <span className="text-[11px] font-mono text-accent uppercase tracking-wider font-bold">
                                {project.stepLabel}
                            </span>
                            <span className="text-[10px] font-mono text-green-400 bg-green-400/10 border border-green-400/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                {project.stat}
                            </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-white font-bold mb-1 group-hover:text-accent transition-colors truncate">
                            {project.title}
                        </h3>
                        <p className="text-primary/90 text-xs sm:text-sm font-sans mb-3 line-clamp-1">
                            {project.tagline}
                        </p>
                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3 font-sans">
                            {project.description}
                        </p>

                        {/* Tags de Tecnologias */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {project.techs.map((tech, i) => (
                                <span
                                    key={i}
                                    className="text-[10px] sm:text-[11px] font-mono text-white/90 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-md"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-white/10">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(project);
                            }}
                            data-cursor-morph="true"
                            className="flex-1 min-w-[130px] py-2.5 px-3.5 bg-accent/20 border border-accent/40 hover:bg-accent hover:text-darker text-accent font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                        >
                            <i className="fas fa-microchip text-xs" />
                            <span>Detalhes Técnicos</span>
                        </button>
                        
                        <MagneticButton
                            as="a"
                            href={project.url}
                            target="_blank"
                            rel="noreferrer"
                            data-cursor-morph="true"
                            className="py-2.5 px-4 bg-accent text-darker font-bold text-xs rounded-xl hover:bg-accent-hover transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                        >
                            <span>Acessar Demonstração</span>
                            <i className="fas fa-external-link-alt text-[9px]" />
                        </MagneticButton>

                        <MagneticButton
                            as="a"
                            href={project.repo}
                            target="_blank"
                            rel="noreferrer"
                            data-cursor-morph="true"
                            className="p-2.5 bg-darker border border-white/15 text-primary hover:text-white rounded-xl transition-colors active:scale-95"
                            title="Código-Fonte no GitHub"
                        >
                            <i className="fab fa-github text-sm" />
                        </MagneticButton>
                    </div>
                </div>
            </div>

            {/* Sombra de Profundidade Projetada no Solo */}
            <motion.div
                style={{ opacity: shadowOpacity }}
                className="absolute -bottom-8 left-10 right-10 h-8 bg-black/80 blur-2xl rounded-full pointer-events-none"
            />
        </motion.div>
    );
}

/**
 * Cylindrical3DShowcase - Esteira Cilíndrica 3D com Física de Inércia e Curvatura Espacial
 */
export default function Cylindrical3DShowcase({ onSelectProject, projects = [] }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef(null);

    // ── Motion Values de Posição Bruta e Mola Amortecida (Rauno Freiberg / Jesper Landberg) ──
    const progress = useMotionValue(0);
    const smoothProgress = useSpring(progress, {
        stiffness: 220,
        damping: 26,
        mass: 0.8,
    });

    // Velocity Skew no eixo Z (inclinação orgânica proporcional à velocidade do arraste)
    const progressVelocity = useVelocity(smoothProgress);
    const velocityRotateZ = useTransform(progressVelocity, [-6, 0, 6], [3.5, 0, -3.5]);

    // Refs para arraste e inércia contínua
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const startProgressRef = useRef(0);
    const lastXRef = useRef(0);
    const lastTimeRef = useRef(0);
    const velocityRef = useRef(0);

    const totalSlides = FLAGSHIP_CONFIGS.length;

    // Atualiza o estado visual do índice ativo conforme o progresso da mola
    useEffect(() => {
        const unsubscribe = smoothProgress.on('change', (v) => {
            const rounded = Math.round(v);
            if (rounded >= 0 && rounded < totalSlides && rounded !== activeIndex) {
                setActiveIndex(rounded);
            }
        });
        return () => unsubscribe();
    }, [smoothProgress, activeIndex, totalSlides]);

    const navigateTo = useCallback((targetIndex) => {
        const clamped = Math.max(0, Math.min(totalSlides - 1, targetIndex));
        progress.set(clamped);
        setActiveIndex(clamped);
        playTabSwitch();
    }, [progress, totalSlides]);

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

    // ── Gestão de Arraste com Inércia & Momentum ──
    const handlePointerDown = (e) => {
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

    const handlePointerMove = (e) => {
        if (!isDraggingRef.current) return;
        const now = performance.now();
        const dt = Math.max(now - lastTimeRef.current, 1);
        const dx = e.clientX - lastXRef.current;
        velocityRef.current = dx / dt; // px/ms
        lastXRef.current = e.clientX;
        lastTimeRef.current = now;

        const totalDeltaX = e.clientX - startXRef.current;
        // 420px de deslocamento correspondem a 1 slide completo
        const DRAG_FACTOR = 420;
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

        // Projeção com inércia e desaceleração orgânica
        let targetIndex = Math.round(currentP - v * 0.16);
        targetIndex = Math.max(0, Math.min(totalSlides - 1, targetIndex));

        progress.set(targetIndex);
        setActiveIndex(targetIndex);
        playTabSwitch();
    };

    const handleInspect = (config) => {
        playMechanicalClick();
        if (onSelectProject) {
            const fullProject = projects.find((p) => p.id === config.id) || config;
            onSelectProject(fullProject);
        }
    };

    // Navegação por teclado
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') {
            handlePrev();
        } else if (e.key === 'ArrowRight') {
            handleNext();
        }
    };

    return (
        <section
            id="projetos-destaque"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="py-16 md:py-24 bg-darker relative border-t border-primary/20 overflow-hidden focus:outline-none"
        >
            {/* Iluminação de fundo cinemática */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* ── Header da Seção ── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <span className="text-accent text-[11px] font-mono font-bold tracking-[0.25em] uppercase block mb-2">
                            PROJETOS EM DESTAQUE ── ARQUITETURAS EM PRODUÇÃO
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white font-bold">
                            Sistemas & Arquiteturas em Produção
                        </h2>
                        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mt-2 font-sans">
                            Esteira de engenharia de alta performance exibida em projeção cilíndrica 3D contínua, com inércia física e zero cortes secos de layout.
                        </p>
                    </div>

                    {/* Controles de Navegação & Dica de Arraste */}
                    <div className="flex items-center gap-4 shrink-0">
                        <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-primary/70 bg-darker/90 px-3.5 py-1.5 rounded-full border border-white/10">
                            <i className="fas fa-arrows-alt-h text-accent text-xs" />
                            <span>Arraste com o mouse para girar a esteira 3D</span>
                        </div>

                        {/* Botões Magnéticos de Navegação */}
                        <div className="flex items-center gap-2">
                            <MagneticButton
                                onClick={handlePrev}
                                aria-label="Projeto Anterior"
                                data-cursor-morph="true"
                                className="w-10 h-10 rounded-xl bg-dark/90 border border-white/15 text-primary hover:text-white hover:border-accent/50 transition-colors shadow-sm active:scale-95"
                            >
                                <i className="fas fa-chevron-left text-xs" />
                            </MagneticButton>
                            <MagneticButton
                                onClick={handleNext}
                                aria-label="Próximo Projeto"
                                data-cursor-morph="true"
                                className="w-10 h-10 rounded-xl bg-dark/90 border border-white/15 text-primary hover:text-white hover:border-accent/50 transition-colors shadow-sm active:scale-95"
                            >
                                <i className="fas fa-chevron-right text-xs" />
                            </MagneticButton>
                        </div>
                    </div>
                </div>

                {/* ── Indicadores de Progresso com layoutId e Spring Physics ── */}
                <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-none py-1">
                    {FLAGSHIP_CONFIGS.map((item, idx) => {
                        const isActive = idx === activeIndex;
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigateTo(idx)}
                                data-cursor-morph="true"
                                className={`relative px-4 py-2 rounded-xl text-xs font-mono transition-colors flex items-center gap-2.5 cursor-pointer shrink-0 border ${
                                    isActive
                                        ? 'text-accent font-bold border-accent/60'
                                        : 'text-primary/70 border-white/10 hover:text-white hover:border-white/20'
                                }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="cylindricalPillActive"
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

                {/* ── Viewport da Esteira Cilíndrica 3D com Perspectiva Fotográfica ── */}
                <div
                    ref={containerRef}
                    onPointerDown={handlePointerDown}
                    style={{
                        perspective: '1400px',
                        perspectiveOrigin: '50% 50%',
                    }}
                    className="relative w-full h-[510px] sm:h-[470px] lg:h-[450px] overflow-hidden cursor-grab active:cursor-grabbing select-none"
                >
                    {/* Track de Transformação 3D com Velocity Skew no eixo Z */}
                    <motion.div
                        style={{
                            rotateZ: velocityRotateZ,
                            transformStyle: 'preserve-3d',
                        }}
                        className="relative w-full h-full will-change-transform"
                    >
                        {FLAGSHIP_CONFIGS.map((project, idx) => (
                            <CylindricalCard
                                key={project.id}
                                project={project}
                                index={idx}
                                smoothProgress={smoothProgress}
                                onSelect={handleInspect}
                                onCardFocus={navigateTo}
                            />
                        ))}
                    </motion.div>
                </div>

                {/* Footer Minimalista de Status */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-primary/50 gap-2 border-t border-white/5 pt-4">
                    <span>Esteira Cilíndrica Tridimensional • Perspectiva 1400px • Inércia de Mola</span>
                    <span>Navegação contínua por arraste e botões • {activeIndex + 1} de {totalSlides}</span>
                </div>
            </div>
        </section>
    );
}
