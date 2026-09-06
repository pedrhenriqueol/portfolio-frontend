import React, { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Project } from '../../../types/project';
import { projectCategory } from '../../../utils/projects';
import ProjectThumbnail from './ProjectThumbnail';
import { playMechanicalClick } from '../../../lib/sound';

interface ProjectCardProps {
    project: Project;
    viewMode?: 'grid' | 'list';
    index?: number;
    onSelect: (project: Project) => void;
    t?: (key: string) => string;
    lang?: string;
}

/**
 * ProjectCard - Card Cinemático 3D com Micro-Tilt Tátil e Iluminação Especular
 * 
 * - Física de inclinação espacial 3D interpolada por mola (rotateX, rotateY máx ±5°).
 * - Efeito de spotlight luminoso injetado diretamente no DOM via CSS Custom Properties (--mouse-x, --mouse-y).
 * - Ergonomia tátil com feedback haptic e vocabulário técnico rigoroso em PT-BR.
 */
export default function ProjectCard({
    project,
    viewMode = 'grid',
    index = 0,
    onSelect,
    t,
    lang = 'pt',
}: ProjectCardProps) {
    const hasDetails = Boolean(project?.details || project?.architectureDetails);
    const isPrivate = !project?.repo_link && !project?.demo_link;
    const category = projectCategory(project);

    const cardRef = useRef<HTMLDivElement>(null);

    // ── Física de Micro-Tilt 3D Tátil (Jesper Landberg / Rauno Freiberg) ──
    const xPct = useMotionValue(0);
    const yPct = useMotionValue(0);

    const springConfig = { damping: 26, stiffness: 240, mass: 0.5 };
    const xSpring = useSpring(xPct, springConfig);
    const ySpring = useSpring(yPct, springConfig);

    // Rotação sutil limitada a ±5° para manter a legibilidade do conteúdo
    const rotateX = useTransform(ySpring, [-0.5, 0.5], ['5deg', '-5deg']);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], ['-5deg', '5deg']);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Injeção de coordenadas diretamente nas CSS Custom Properties (Zero Re-render)
        cardRef.current.style.setProperty('--mouse-x', `${mouseX}px`);
        cardRef.current.style.setProperty('--mouse-y', `${mouseY}px`);
        cardRef.current.style.setProperty('--glow-opacity', '1');

        // Cálculo relativo ao centro do card (-0.5 a 0.5)
        xPct.set(mouseX / rect.width - 0.5);
        yPct.set(mouseY / rect.height - 0.5);
    }, [xPct, yPct]);

    const handleMouseLeave = useCallback(() => {
        if (!cardRef.current) return;
        cardRef.current.style.setProperty('--glow-opacity', '0');
        xPct.set(0);
        yPct.set(0);
    }, [xPct, yPct]);

    const handleInspectClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        playMechanicalClick();
        onSelect(project);
    }, [onSelect, project]);

    // ── MODO DE VISUALIZAÇÃO EM LISTA ──
    if (viewMode === 'list') {
        const coverImage = project?.image_url || '/dashboard_placeholder.png';
        return (
            <motion.div
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.28, delay: index * 0.03 }}
                className={`group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 bg-darker border border-primary/30 rounded-xl p-4 sm:p-5 hover:border-accent/40 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-300 ${
                    hasDetails ? 'cursor-pointer' : ''
                }`}
                onClick={hasDetails ? () => onSelect(project) : undefined}
            >
                <div className="w-full sm:w-28 h-28 sm:h-20 rounded-lg overflow-hidden shrink-0 relative bg-[#0F1117] border border-white/10">
                    <img
                        src={coverImage}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        onError={(e: any) => {
                            e.target.onerror = null;
                            e.target.src = '/dashboard_placeholder.png';
                        }}
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <h3 className="text-white font-bold text-base group-hover:text-accent transition-colors truncate">
                            {project.title}
                        </h3>
                        <span className="text-[10px] text-primary/80 border border-primary/30 rounded-full px-2 py-0.5 shrink-0 capitalize font-mono">
                            {category}
                        </span>
                    </div>

                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-2.5">
                        {project.description}
                    </p>

                    {project.tags && (
                        <div className="flex flex-wrap gap-1.5">
                            {project.tags.slice(0, 5).map((tag, idx) => (
                                <span key={idx} className="text-[10px] text-accent bg-accent/10 border border-accent/25 px-2 py-0.5 rounded-full font-mono">
                                    {tag}
                                </span>
                            ))}
                            {project.tags.length > 5 && (
                                <span className="text-[10px] text-primary/70 font-mono">+{project.tags.length - 5}</span>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                    {hasDetails && (
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={handleInspectClick}
                            data-cursor-morph="true"
                            className="py-1.5 px-3 border border-white/15 bg-darker/80 text-primary text-xs font-semibold rounded-lg hover:border-accent/40 hover:text-accent transition-all cursor-pointer flex items-center gap-1.5"
                        >
                            <i className="fas fa-microchip text-accent text-[11px]" />
                            <span>Detalhes Técnicos</span>
                        </motion.button>
                    )}

                    {project.repo_link && (
                        <a
                            href={project.repo_link}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            data-cursor-morph="true"
                            className="p-2 border border-white/15 bg-darker/80 text-primary hover:text-white hover:border-white/30 text-xs rounded-lg transition-all cursor-pointer flex items-center justify-center"
                            title="Código-Fonte no GitHub"
                        >
                            <i className="fab fa-github text-[13px]" />
                        </a>
                    )}

                    {project.demo_link && (
                        <a
                            href={project.demo_link}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            data-cursor-morph="true"
                            className="py-1.5 px-3 bg-accent text-darker text-xs font-bold rounded-lg hover:bg-accent-hover transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                            <span>Acessar Demonstração</span>
                            <i className="fas fa-external-link-alt text-[9px]" />
                        </a>
                    )}
                </div>
            </motion.div>
        );
    }

    // ── MODO DE VISUALIZAÇÃO EM GRADE COM MICRO-TILT 3D ──
    return (
        <div style={{ perspective: 1000 }} className="h-full">
            <motion.div
                layout
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.32, delay: index * 0.04 }}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                }}
                className={`bg-darker rounded-2xl overflow-hidden border border-primary/30 group hover:border-accent/50 hover:shadow-[0_24px_50px_rgba(0,0,0,0.65)] transition-shadow duration-300 flex flex-col h-full relative will-change-transform ${
                    hasDetails ? 'cursor-pointer' : ''
                }`}
                onClick={hasDetails ? () => onSelect(project) : undefined}
            >
                {/* ── Spotlight Mouse Glow Overlay (Zero Re-render) ── */}
                <div
                    className="absolute inset-0 z-10 pointer-events-none select-none rounded-2xl transition-opacity duration-200"
                    style={{
                        opacity: 'var(--glow-opacity, 0)',
                        background: 'radial-gradient(450px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), rgba(255, 108, 55, 0.09), transparent 50%)',
                    }}
                />

                {/* ── Thumbnail Real do Projeto ── */}
                <ProjectThumbnail 
                    project={project} 
                    category={category} 
                    hasDetails={hasDetails} 
                    t={t} 
                />

                {/* ── Conteúdo Técnico do Card ── */}
                <div className="p-5 sm:p-6 flex flex-col flex-grow relative bg-[#0B0D13]">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors duration-300">
                        {project.title}
                    </h3>

                    {project.tags && (
                        <div className="flex flex-wrap gap-1.5 mb-3.5">
                            {project.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="text-[11px] font-mono font-medium text-accent bg-accent/10 border border-accent/20 px-2.5 py-0.5 rounded-full group-hover:border-accent/40 transition-colors duration-300"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-5 flex-grow font-sans">
                        {project.description}
                    </p>

                    {/* ── Footer de Ações com Ergonomia e Vocabulário Técnico ── */}
                    <div className="mt-auto pt-4 border-t border-white/10 flex flex-col gap-2.5">
                        <div className="flex items-center gap-2">
                            {hasDetails && (
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleInspectClick}
                                    data-cursor-morph="true"
                                    className="flex-1 py-2 px-2.5 bg-darker/80 border border-white/15 text-primary hover:text-accent hover:border-accent/40 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                                >
                                    <i className="fas fa-microchip text-accent text-[11px] shrink-0" />
                                    <span className="truncate">Detalhes Técnicos</span>
                                </motion.button>
                            )}

                            {project.repo_link ? (
                                <a
                                    href={project.repo_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    data-cursor-morph="true"
                                    className="flex-1 py-2 px-2.5 bg-darker/80 border border-white/15 text-primary hover:text-white hover:border-white/30 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                                >
                                    <i className="fab fa-github text-[13px] shrink-0" />
                                    <span className="truncate">Código-Fonte</span>
                                </a>
                            ) : isPrivate ? (
                                <span className="flex-1 py-2 px-2.5 bg-darker/40 border border-primary/20 text-primary/50 text-xs font-medium rounded-lg select-none flex items-center justify-center gap-1.5 cursor-not-allowed" title="Sistema Corporativo Interno Privado">
                                    <i className="fas fa-lock text-[10px] shrink-0" />
                                    <span className="truncate">Corporativo</span>
                                </span>
                            ) : null}
                        </div>

                        {project.demo_link && (
                            <a
                                href={project.demo_link}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                data-cursor-morph="true"
                                className="w-full py-2.5 px-4 bg-accent text-darker font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-accent-hover hover:shadow-[0_0_20px_rgba(255,108,55,0.3)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-center active:scale-95"
                            >
                                <span>Acessar Demonstração</span>
                                <i className="fas fa-external-link-alt text-[10px]" />
                            </a>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
