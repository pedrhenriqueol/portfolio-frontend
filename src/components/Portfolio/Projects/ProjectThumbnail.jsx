import React from 'react';

/**
 * ProjectThumbnail Component
 * Suporta dois modos visuais:
 * - 'split': Dual-Pane (40% tela de autenticação / 60% console principal ou telemetria)
 * - 'single': Panorâmico com enquadramento nítido do workbench / dashboard
 */
export default function ProjectThumbnail({ project, category, hasDetails, t }) {
    const isSplit = project?.thumbnail_mode === 'split' && project?.split_images;
    const coverImage = project?.image_url || '/dashboard_placeholder.png';

    return (
        <div className="relative w-full aspect-[16/9] sm:aspect-[16/10] overflow-hidden rounded-t-xl bg-[#0F1117] border-b border-white/10 group/thumb select-none">
            {isSplit ? (
                /* ── MODO SPLIT DUAL-PANE (40% Auth / 60% Dashboard) ── */
                <div className="w-full h-full flex transform group-hover:scale-[1.02] transition-transform duration-500 ease-out">
                    {/* Lado Esquerdo (40%): Tela de Login / Auth */}
                    <div className="w-[40%] h-full relative overflow-hidden border-r border-white/10 bg-[#0A0C10]">
                        <img
                            src={project.split_images.left}
                            alt={`${project.title} - Login`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/dashboard_placeholder.png';
                            }}
                        />
                        {/* Pill discreta de identificação da tela */}
                        <span className="absolute top-2.5 left-2.5 z-20 px-1.5 py-0.5 rounded text-[8px] font-mono font-medium tracking-wide uppercase bg-black/70 text-white/75 border border-white/10 backdrop-blur-xs">
                            Auth
                        </span>
                    </div>

                    {/* Lado Direito (60%): Dashboard / Telemetria */}
                    <div className="w-[60%] h-full relative overflow-hidden bg-[#0A0C10]">
                        <img
                            src={project.split_images.right}
                            alt={`${project.title} - Console`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover object-left-top transform group-hover:scale-105 transition-transform duration-700"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/dashboard_placeholder.png';
                            }}
                        />
                        {/* Pill discreta de identificação do console */}
                        <span className="absolute top-2.5 right-2.5 z-20 px-1.5 py-0.5 rounded text-[8px] font-mono font-medium tracking-wide uppercase bg-black/70 text-accent border border-accent/20 backdrop-blur-xs">
                            Console
                        </span>
                    </div>
                </div>
            ) : (
                /* ── MODO SINGLE PANORÂMICO (100% Workbench / Full Cover) ── */
                <div className="w-full h-full relative overflow-hidden bg-[#0A0C10]">
                    <img
                        src={coverImage}
                        alt={project?.title || 'Preview'}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-top transform group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/dashboard_placeholder.png';
                        }}
                    />
                    {project?.thumbnail_mode === 'single' && (
                        <span className="absolute top-2.5 right-2.5 z-20 px-1.5 py-0.5 rounded text-[8px] font-mono font-medium tracking-wide uppercase bg-black/70 text-accent border border-accent/20 backdrop-blur-xs">
                            Workbench
                        </span>
                    )}
                </div>
            )}

            {/* ── Gradiente de Fade Escuro na Base para Fusão com o Card ── */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0F1117] via-[#0F1117]/60 to-transparent pointer-events-none z-10" />

            {/* ── Badge de Categoria ── */}
            {category && (
                <span className="absolute top-3 left-3 z-20 bg-darker/90 border border-primary/40 text-primary text-[10px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-sm capitalize shadow-md">
                    {category}
                </span>
            )}

            {/* ── Overlay Interativo ao Passar o Mouse (Quick Details Hint) ── */}
            {hasDetails && (
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="bg-secondary/90 text-darker text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl backdrop-blur-sm transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                        <i className="fas fa-info-circle text-[11px]" />
                        {t ? t('projects.btnDetails') : 'Detalhes Técnicos'}
                    </span>
                </div>
            )}
        </div>
    );
}
