import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion';
import MagneticButton from '../MagneticButton';
import { playMechanicalClick, playTabSwitch } from '../../../lib/sound';

export interface FlagshipProject {
    id: number;
    title: string;
    tagline: string;
    stepLabel: string;
    badge: string;
    stat: string;
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
        stepLabel: '# 01. Motor Transacional',
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
        stepLabel: '# 02. Operações Portuárias',
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
        stepLabel: '# 03. Engenharia de Qualidade',
        badge: 'Observabilidade & TestOps',
        stat: 'NIST Nearest Rank Math',
        description: 'Plataforma corporativa de engenharia de testes com runner isolado, validação recursiva de esquemas OpenAPI/JSON Schema, testes de estresse no Chaos Lab e percentis de cauda p50/p90/p95/p99 padronizados pelo NIST.',
        image: '/projects/spectr-workbench.png',
        techs: ['React 18', 'TypeScript', 'OpenAPI', 'Chaos Lab', 'p95 SLA Math'],
        url: 'https://spectr-testops.vercel.app',
        repo: 'https://github.com/pedrhenriqueol/spectr-testops',
    },
];

interface CylindricalCardProps {
    project: FlagshipProject;
    index: number;
    smoothProgress: any;
    onSelect: (project: FlagshipProject) => void;
    onCardFocus: (index: number) => void;
}

/**
 * CylindricalCard - Card 3D individual em escala monumental com anatomia técnica integrada
 */
function CylindricalCard({
    project,
    index,
    smoothProgress,
    onSelect,
    onCardFocus,
}: CylindricalCardProps) {
    // ── Transformações 3D Cilíndricas (stiffness: 260, damping: 28) ──
    // Foco: rotateY(0deg), translateZ(0px), scale(1.0), opacity: 1.0, zIndex: 30
    // Adjacentes: rotateY(±28deg), translateZ(-160px), scale(0.92), opacity: 0.45, zIndex: 10
    const rotateY = useTransform(smoothProgress, (p: number) => `${(index - p) * 28}deg`);
    const translateZ = useTransform(smoothProgress, (p: number) => `${-Math.abs(index - p) * 160}px`);
    const translateX = useTransform(smoothProgress, (p: number) => `${(index - p) * 82}%`);
    const scale = useTransform(smoothProgress, (p: number) => Math.max(0.82, 1 - Math.abs(index - p) * 0.08));
    const opacity = useTransform(smoothProgress, (p: number) => Math.max(0.2, 1 - Math.abs(index - p) * 0.55));
    const zIndex = useTransform(smoothProgress, (p: number) => (Math.abs(index - p) < 0.5 ? 30 : 10));
    const shadowOpacity = useTransform(smoothProgress, (p: number) => Math.max(0, 0.85 - Math.abs(index - p) * 0.4));

    const handleClick = (e: React.MouseEvent) => {
        const currentP = smoothProgress.get();
        const diff = Math.abs(index - currentP);
        // Se for um card lateral clicado, gira a esteira para focalizá-lo
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
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[92vw] sm:w-[86vw] md:w-[780px] lg:w-[860px] h-[520px] sm:h-[500px] md:h-[480px] will-change-transform select-none antialiased subpixel-antialiased"
        >
            {/* Card Tridimensional Principal em Escala Monumental */}
            <div className="w-full h-full rounded-2xl bg-[#0C0F17] border border-white/15 overflow-hidden flex flex-col md:flex-row shadow-[0_30px_90px_rgba(0,0,0,0.95)] relative group backdrop-blur-[2px]">
                
                {/* ── Lado Esquerdo: Área Visual e Preview Nítido com Aspect Ratio Consistente ── */}
                <div className="w-full md:w-[48%] h-48 sm:h-56 md:h-full relative overflow-hidden bg-[#06080D] border-b md:border-b-0 md:border-r border-white/10 shrink-0">
                    <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-left-top transform group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = '/dashboard_placeholder.png';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0C0F17] via-transparent to-transparent opacity-60 pointer-events-none" />
                    
                    {/* Badge de Categoria com Indicador de Status ao Vivo */}
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-darker/95 border border-accent/40 backdrop-blur-md shadow-lg pointer-events-none">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] sm:text-[11px] font-mono font-bold text-accent">
                            {project.badge}
                        </span>
                    </div>
                </div>

                {/* ── Lado Direito: Especificações Técnicas e Anatomia Integrada (Totalmente Opaco) ── */}
                <div className="p-6 sm:p-7 md:p-8 flex-1 flex flex-col justify-between overflow-hidden bg-[#0C0F17]">
                    <div>
                        {/* Cabeçalho Interno: Tag de Passo + Indicador de Confiabilidade */}
                        <div className="flex items-center justify-between gap-3 mb-2.5">
                            <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
                                {project.stepLabel}
                            </span>
                            <span className="text-[10px] sm:text-[11px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/25 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shrink-0 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                {project.stat}
                            </span>
                        </div>

                        {/* Título do Sistema */}
                        <h3 className="text-2xl sm:text-3xl font-serif text-white font-bold tracking-tight mb-1.5 group-hover:text-accent transition-colors truncate">
                            {project.title}
                        </h3>

                        {/* Tagline de Arquitetura */}
                        <p className="text-primary/90 text-xs sm:text-sm font-sans font-medium mb-3">
                            {project.tagline}
                        </p>

                        {/* Descrição Detalhada da Arquitetura */}
                        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 font-sans line-clamp-3 md:line-clamp-4">
                            {project.description}
                        </p>

                        {/* Badges de Stack Técnica Refinadas */}
                        <div className="flex flex-wrap gap-1.5 mb-5">
                            {project.techs.map((tech) => (
                                <span
                                    key={tech}
                                    className="text-[11px] font-mono text-white/90 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md transition-colors hover:border-accent/40"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* ── Rodapé Integrado: Ações Diretas no Card (Sem HUD Separado) ── */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-white/10 mt-auto">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(project);
                            }}
                            data-cursor-morph="true"
                            className="flex-1 min-w-[135px] py-3 px-4 bg-accent/20 border border-accent/40 hover:bg-accent hover:text-darker text-accent font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
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
                            className="flex-1 min-w-[155px] py-3 px-4 bg-accent text-darker font-bold text-xs rounded-xl hover:bg-accent-hover transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
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
                            className="p-3 bg-dark border border-white/15 text-primary hover:text-white rounded-xl transition-colors active:scale-95"
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
                className="absolute -bottom-8 left-10 right-10 h-8 bg-black/95 blur-2xl rounded-full pointer-events-none"
            />
        </motion.div>
    );
}

interface Cylindrical3DShowcaseProps {
    onSelectProject?: (project: any) => void;
    projects?: any[];
}

/**
 * Cylindrical3DShowcase - Showcase Cilíndrico 3D em ESCALA MONUMENTAL
 */
export default function Cylindrical3DShowcase({ onSelectProject, projects = [] }: Cylindrical3DShowcaseProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // ── Motion Values de Posição com Mola Amortecida (stiffness: 260, damping: 28) ──
    const progress = useMotionValue(0);
    const smoothProgress = useSpring(progress, {
        stiffness: 260,
        damping: 28,
        mass: 0.6,
    });

    // Velocity Skew no eixo Z (inclinação orgânica proporcional à velocidade do arraste)
    const progressVelocity = useVelocity(smoothProgress);
    const velocityRotateZ = useTransform(progressVelocity, [-6, 0, 6], [2.8, 0, -2.8]);

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
        const unsubscribe = smoothProgress.on('change', (v: number) => {
            const rounded = Math.round(v);
            if (rounded >= 0 && rounded < totalSlides && rounded !== activeIndex) {
                setActiveIndex(rounded);
            }
        });
        return () => unsubscribe();
    }, [smoothProgress, activeIndex, totalSlides]);

    const navigateTo = useCallback((targetIndex: number) => {
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
    const handlePointerDown = (e: React.PointerEvent) => {
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
        velocityRef.current = dx / dt; // px/ms
        lastXRef.current = e.clientX;
        lastTimeRef.current = now;

        const totalDeltaX = e.clientX - startXRef.current;
        // 450px de deslocamento correspondem a 1 slide completo
        const DRAG_FACTOR = 450;
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

    const handleInspect = (config: FlagshipProject) => {
        playMechanicalClick();
        if (onSelectProject) {
            const fullProject = projects.find((p) => p.id === config.id) || config;
            onSelectProject(fullProject);
        }
    };

    // Navegação por teclado acessível
    const handleKeyDown = (e: React.KeyboardEvent) => {
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[480px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* ── Header da Seção com Tipografia Nítida & Subtítulo Sóbrio ── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <span className="text-accent text-[11px] font-mono font-bold tracking-[0.25em] uppercase block mb-2">
                            PROJETOS EM DESTAQUE ── ARQUITETURAS EM PRODUÇÃO
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-serif">
                            Sistemas & Arquiteturas em Produção
                        </h2>
                        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mt-2.5 font-sans leading-relaxed">
                            Sistemas corporativos de missão crítica desenvolvidos com foco em concorrência, idempotência contábil e telemetria preditiva.
                        </p>
                    </div>

                    {/* Controles de Navegação & Dica de Arraste */}
                    <div className="flex items-center gap-4 shrink-0">
                        <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-primary/70 bg-darker/90 px-3.5 py-1.5 rounded-full border border-white/10 pointer-events-none">
                            <i className="fas fa-arrows-alt-h text-accent text-xs" />
                            <span>Arraste para girar a esteira 3D</span>
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

                {/* ── Seletor de Abas Superior Sincronizado com layoutId ── */}
                <div className="flex items-center gap-2.5 mb-10 overflow-x-auto scrollbar-none py-1">
                    {FLAGSHIP_CONFIGS.map((item, idx) => {
                        const isActive = idx === activeIndex;
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigateTo(idx)}
                                data-cursor-morph="true"
                                className={`relative px-4 py-2.5 rounded-xl text-xs font-mono transition-colors flex items-center gap-2.5 cursor-pointer shrink-0 border ${
                                    isActive
                                        ? 'text-accent font-bold border-accent/60'
                                        : 'text-primary/70 border-white/10 hover:text-white hover:border-white/20'
                                }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="monumentalPillActive"
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

                {/* ── Viewport da Esteira Cilíndrica 3D em Escala Monumental ── */}
                <div
                    ref={containerRef}
                    onPointerDown={handlePointerDown}
                    style={{
                        perspective: '1400px',
                        perspectiveOrigin: '50% 50%',
                    }}
                    className="w-full max-w-6xl mx-auto min-h-[520px] sm:min-h-[550px] lg:min-h-[620px] flex items-center justify-center relative overflow-visible cursor-grab active:cursor-grabbing select-none"
                >
                    {/* Track central 3D com Velocity Skew no eixo Z */}
                    <motion.div
                        style={{
                            rotateZ: velocityRotateZ,
                            transformStyle: 'preserve-3d',
                        }}
                        className="relative w-full h-full min-h-[480px] sm:min-h-[500px] lg:min-h-[520px] will-change-transform"
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
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-primary/50 gap-2 border-t border-white/5 pt-4">
                    <span>Projeção Cilíndrica 3D • DOM Nativo Vetorial • Perspectiva 1400px</span>
                    <span>Navegação contínua por arraste, abas e teclado • {activeIndex + 1} de {totalSlides}</span>
                </div>
            </div>
        </section>
    );
}
