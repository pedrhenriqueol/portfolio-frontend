import React, { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { projectCategory } from '../../../utils/projects';
import ProjectThumbnail from './ProjectThumbnail';

/**
 * ProjectCard - Card Refatorado com Tilt Magnético 3D, Spotlight CSS e Vocabulário PT-BR Técnico
 * 
 * - Rotação tridimensional (rotateX, rotateY) baseada no centro do card (máx 6°).
 * - Física de mola desacoplada via useSpring (stiffness: 220, damping: 25).
 * - Spotlight radial injetado via CSS Custom Properties (--mouse-x, --mouse-y) sem re-render.
 * - Vocabulário estritamente técnico em Português: "Acessar Demonstração", "Detalhes Técnicos", "Código-Fonte".
 */
export default function ProjectCard({ project, viewMode = 'grid', index = 0, onSelect, t, lang }) {
    const hasDetails = Boolean(project?.details);
    const isPrivate = !project?.repo_link && !project?.demo_link;
    const category = projectCategory(project);

    const cardRef = useRef(null);

    // ── Física de Tilt Magnético 3D desacoplada ──
    const xPct = useMotionValue(0);
    const yPct = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 220, mass: 0.5 };
    const xSpring = useSpring(xPct, springConfig);
    const ySpring = useSpring(yPct, springConfig);

    const rotateX = useTransform(ySpring, [-0.5, 0.5], ['6deg', '-6deg']);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], ['-6deg', '6deg']);

    const handleMouseMove = useCallback((e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // 1. Injeta coordenadas no CSS para o Spotlight luminoso sem disparar re-render
        cardRef.current.style.setProperty('--mouse-x', `${mouseX}px`);
        cardRef.current.style.setProperty('--mouse-y', `${mouseY}px`);
        cardRef.current.style.setProperty('--glow-opacity', '1');

        // 2. Calcula deslocamento relativo normalizado em relação ao centro (-0.5 a 0.5)
        xPct.set(mouseX / rect.width - 0.5);
        yPct.set(mouseY / rect.height - 0.5);
    }, [xPct, yPct]);

    const handleMouseLeave = useCallback(() => {
        if (!cardRef.current) return;
        cardRef.current.style.setProperty('--glow-opacity', '0');
        xPct.set(0);
        yPct.set(0);
    }, [xPct, yPct]);

    // ── MODO DE VISUALIZAÇÃO EM LISTA ──
    if (viewMode === 'list') {
        const coverImage = project?.image_url || '/dashboard_placeholder.png';
        return (
            <motion.div
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className={`group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 bg-darker border border-primary/30 rounded-xl p-4 sm:p-5 hover:border-secondary/50 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-300 ${
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
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/dashboard_placeholder.png';
                        }}
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <h3 className="text-white font-bold text-base group-hover:text-secondary transition-colors truncate">
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
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(project);
                            }}
                            data-cursor-morph="true"
                            className="py-1.5 px-3 border border-white/15 bg-darker/80 text-primary text-xs font-semibold rounded-lg hover:border-accent/40 hover:text-accent transition-all cursor-pointer flex items-center gap-1.5"
                        >
                            <i className="fas fa-info-circle text-accent text-[11px]" />
                            <span>Detalhes Técnicos</span>
                        </button>
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

    // ── MODO DE VISUALIZAÇÃO EM GRID COM TILT MAGNÉTICO 3D ──
    return (
        <div style={{ perspective: 1000 }} className="h-full">
            <motion.div
                layout
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                }}
                className={`bg-darker rounded-xl overflow-hidden border border-primary/30 group hover:border-secondary/50 hover:shadow-[0_25px_60px_rgba(0,0,0,0.65)] transition-shadow duration-300 flex flex-col h-full relative will-change-transform ${
                    hasDetails ? 'cursor-pointer' : ''
                }`}
                onClick={hasDetails ? () => onSelect(project) : undefined}
            >
                {/* ── 0. Spotlight Mouse Glow Overlay (Zero Re-render) ── */}
                <div
                    className="absolute inset-0 z-10 pointer-events-none select-none rounded-xl transition-opacity duration-200"
                    style={{
                        opacity: 'var(--glow-opacity, 0)',
                        background: 'radial-gradient(500px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), rgba(var(--color-accent-rgb), 0.085), transparent 45%)',
                    }}
                />

                {/* ── 1. Thumbnail Real (Split Dual-Pane ou Single Panorâmico) ── */}
                <ProjectThumbnail 
                    project={project} 
                    category={category} 
                    hasDetails={hasDetails} 
                    t={t} 
                />

                {/* ── 2. Conteúdo do Card ── */}
                <div className="p-5 sm:p-6 flex flex-col flex-grow relative bg-[#0B0D13]">
                    <div className="absolute top-0 right-0 w-28 h-28 bg-secondary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5 group-hover:text-secondary transition-colors duration-300">
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

                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-5 flex-grow">
                        {project.description}
                    </p>

                    {/* ── 3. Footer de Ações com Hierarquia e Vocabulário Normalizado ── */}
                    <div className="mt-auto pt-4 border-t border-white/10 flex flex-col gap-2.5">
                        <div className="flex items-center gap-2">
                            {hasDetails && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelect(project);
                                    }}
                                    data-cursor-morph="true"
                                    className="flex-1 py-2 px-2.5 bg-darker/80 border border-white/15 text-primary hover:text-accent hover:border-accent/40 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                                >
                                    <i className="fas fa-microchip text-accent text-[11px] shrink-0" />
                                    <span className="truncate">Detalhes Técnicos</span>
                                </button>
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
                                <span className="flex-1 py-2 px-2.5 bg-darker/40 border border-primary/20 text-primary/50 text-xs font-medium rounded-lg select-none flex items-center justify-center gap-1.5 cursor-not-allowed" title="Sistema Corporativo Privado">
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
