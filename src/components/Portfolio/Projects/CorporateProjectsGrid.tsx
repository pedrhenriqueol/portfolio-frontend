import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, ProjectFilterType, ProjectViewMode } from '../../../types/project';
import { projectCategory, FILTER_ICONS } from '../../../utils/projects';
import ProjectCard from './ProjectCard';
import { playTabSwitch, playMechanicalClick } from '../../../lib/sound';

interface CorporateProjectsGridProps {
    projects: Project[];
    onSelectProject: (project: Project) => void;
    t?: (key: string) => string;
    lang?: string;
}

export default function CorporateProjectsGrid({
    projects,
    onSelectProject,
    t,
    lang = 'pt',
}: CorporateProjectsGridProps) {
    const [activeFilter, setActiveFilter] = useState<ProjectFilterType>('all');
    const [viewMode, setViewMode] = useState<ProjectViewMode>('grid');

    const FILTERS = useMemo(() => [
        { id: 'all' as const,       label: lang === 'en' ? '# ALL' : '# TODOS' },
        { id: 'fullstack' as const, label: lang === 'en' ? '# WEB / FULLSTACK' : '# WEB / FULLSTACK' },
        { id: 'desktop' as const,   label: lang === 'en' ? '# DESKTOP / DELPHI' : '# DESKTOP / DELPHI' },
        { id: 'backend' as const,   label: lang === 'en' ? '# BACK-END / APIS' : '# BACK-END / APIS' },
    ], [lang]);

    const filteredProjects = useMemo(() => {
        if (!Array.isArray(projects)) return [];
        if (activeFilter === 'all') return projects;
        return projects.filter(p => projectCategory(p) === activeFilter);
    }, [projects, activeFilter]);

    const handleFilterChange = useCallback((filterId: ProjectFilterType) => {
        playTabSwitch();
        setActiveFilter(filterId);
    }, []);

    const handleViewModeChange = useCallback((mode: ProjectViewMode) => {
        playMechanicalClick();
        setViewMode(mode);
    }, []);

    // Extração auxiliar de metadados de engenharia para o Modo Tabela
    const getProjectDatabase = (p: Project) => {
        const tags = p.tags || [];
        if (tags.includes('SQL Server')) return 'SQL Server';
        if (tags.includes('MySQL')) return 'MySQL';
        if (tags.includes('PostgreSQL')) return 'PostgreSQL';
        return 'Relacional / Embed';
    };

    const getProjectArchitecture = (p: Project) => {
        if (p.details?.architecture?.[0]?.tech) {
            return p.details.architecture[0].tech.split('+')[0].trim();
        }
        if ((p.tags || []).includes('Multi-tenant')) return 'Multi-tenant Lógico';
        if ((p.tags || []).includes('UniGui')) return 'RAD ServerModule Web';
        if ((p.tags || []).includes('Laravel')) return 'REST API Desacoplada';
        return 'Camada de Serviços';
    };

    const getProjectKeyMetric = (p: Project) => {
        const metric = p.details?.metrics?.[0];
        if (typeof metric === 'object' && metric?.value) return metric.value;
        if (p.details?.subtitle) return p.details.subtitle;
        return 'Produção Estável';
    };

    return (
        <div className="space-y-6">
            {/* ── Barra de Controles: Filtros com layoutId + Alternador Grid vs Tabela ── */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Filtros com indicador deslizante de layout compartilhado */}
                <div className="relative max-w-full w-full sm:w-auto overflow-hidden">
                    <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-dark to-transparent z-10 sm:hidden" />
                    <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-dark to-transparent z-10 sm:hidden" />
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 px-1 bg-black/40 border border-white/10 rounded-2xl p-1.5 backdrop-blur-md">
                        {FILTERS.map((f) => {
                            const isActive = activeFilter === f.id;
                            return (
                                <button
                                    key={f.id}
                                    onClick={() => handleFilterChange(f.id)}
                                    data-cursor-morph="true"
                                    className={`relative px-3.5 py-1.5 text-xs font-mono font-semibold tracking-wider rounded-xl transition-colors cursor-pointer shrink-0 ${
                                        isActive ? 'text-white font-bold' : 'text-primary/70 hover:text-white'
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeCategoryTab"
                                            className="absolute inset-0 bg-accent/20 border border-accent/50 rounded-xl shadow-[0_0_15px_rgba(255,108,55,0.25)]"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{f.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Alternador de Modo: Grade vs Tabela Densa */}
                <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-xl p-1 backdrop-blur-md">
                    <button
                        onClick={() => handleViewModeChange('grid')}
                        data-cursor-morph="true"
                        title="Modo Grade 3D"
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                            viewMode === 'grid'
                                ? 'bg-accent text-darker font-bold shadow-xs'
                                : 'text-primary/70 hover:text-white'
                        }`}
                    >
                        <i className="fas fa-th-large text-[10px]" />
                        <span>Grid</span>
                    </button>
                    <button
                        onClick={() => handleViewModeChange('table')}
                        data-cursor-morph="true"
                        title="Modo Tabela de Especificações de Engenharia"
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                            viewMode === 'table'
                                ? 'bg-accent text-darker font-bold shadow-xs'
                                : 'text-primary/70 hover:text-white'
                        }`}
                    >
                        <i className="fas fa-table-list text-[10px]" />
                        <span>{lang === 'en' ? 'Specs Table' : 'Tabela Densa'}</span>
                    </button>
                </div>
            </div>

            {/* Contador de Projetos */}
            <div className="flex items-center justify-between text-xs font-mono text-primary/60 border-b border-white/5 pb-2">
                <span>
                    {filteredProjects.length}{' '}
                    {lang === 'en'
                        ? `system${filteredProjects.length !== 1 ? 's' : ''} in focus`
                        : `sistema${filteredProjects.length !== 1 ? 's' : ''} corporativo${filteredProjects.length !== 1 ? 's' : ''}`}
                </span>
                <span className="text-[11px] text-accent/80">
                    {viewMode === 'grid' ? 'Micro-Tilt 3D Ativo' : 'Engineering Specs Density View'}
                </span>
            </div>

            {/* ── Visualização Fluida com Framer Motion layout ── */}
            <AnimatePresence mode="wait">
                {viewMode === 'grid' ? (
                    <motion.div
                        key="corporate-grid-view"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.22 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                    >
                        {filteredProjects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                layout
                                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                                className="h-full"
                            >
                                <ProjectCard
                                    project={project}
                                    index={index}
                                    viewMode="grid"
                                    onSelect={() => onSelectProject(project)}
                                    t={t}
                                    lang={lang}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="corporate-table-view"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.22 }}
                        className="rounded-2xl border border-white/10 bg-darker/80 backdrop-blur-xl overflow-hidden shadow-2xl"
                    >
                        <div className="overflow-x-auto scrollbar-thin">
                            <table className="w-full text-left text-xs font-mono border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 bg-black/40 text-[11px] uppercase tracking-wider text-primary/60">
                                        <th className="py-3 px-4">Sistema / Projeto</th>
                                        <th className="py-3 px-4">Arquitetura & Padrão</th>
                                        <th className="py-3 px-4">Stack / Tecnologias</th>
                                        <th className="py-3 px-4">Banco de Dados</th>
                                        <th className="py-3 px-4">Métrica & Escopo</th>
                                        <th className="py-3 px-4 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredProjects.map((project) => {
                                        const cat = projectCategory(project);
                                        return (
                                            <motion.tr
                                                key={`row-${project.id}`}
                                                layout
                                                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                                                className="group hover:bg-white/[0.02] transition-colors"
                                            >
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg bg-black/60 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                                                            {project.image_url ? (
                                                                <img
                                                                    src={project.image_url}
                                                                    alt={project.title}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e: any) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = '/dashboard_placeholder.png';
                                                                    }}
                                                                />
                                                            ) : (
                                                                <i className="fas fa-cube text-primary/40 text-xs" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-white group-hover:text-accent transition-colors">
                                                                {project.title}
                                                            </div>
                                                            <span className="text-[10px] text-primary/60 uppercase">
                                                                {cat}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4 text-gray-300">
                                                    <div className="flex items-center gap-1.5">
                                                        <i className="fas fa-sitemap text-accent/80 text-[10px]" />
                                                        <span>{getProjectArchitecture(project)}</span>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <div className="flex flex-wrap gap-1 max-w-[240px]">
                                                        {(project.tags || []).slice(0, 3).map((tag, tIdx) => (
                                                            <span
                                                                key={tIdx}
                                                                className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-primary/80"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                        {(project.tags || []).length > 3 && (
                                                            <span className="text-[10px] text-primary/40">
                                                                +{(project.tags || []).length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px]">
                                                        {getProjectDatabase(project)}
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-4 text-emerald-400 font-semibold text-[11px]">
                                                    {getProjectKeyMetric(project)}
                                                </td>

                                                <td className="py-3.5 px-4 text-right">
                                                    <button
                                                        onClick={() => {
                                                            playMechanicalClick();
                                                            onSelectProject(project);
                                                        }}
                                                        data-cursor-morph="true"
                                                        className="px-3 py-1.5 rounded-lg bg-accent/15 border border-accent/40 text-accent hover:bg-accent hover:text-darker text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                                                    >
                                                        <i className="fas fa-microchip text-[10px]" />
                                                        <span>Inspecionar</span>
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
