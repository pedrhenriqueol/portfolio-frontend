import React, { Suspense, lazy } from 'react';
import SectionDivider from './Common/SectionDivider';

const Cylindrical3DShowcase = lazy(() => import('./Projects/Cylindrical3DShowcase'));
const ProjectsSection = lazy(() => import('./ProjectsSection'));

function SectionSkeleton() {
    return (
        <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
            <div className="h-4 w-28 bg-white/10 rounded mb-4 mx-auto" />
            <div className="h-10 w-64 bg-white/5 rounded mb-12 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-48 bg-white/[0.02] border border-white/[0.06] rounded-2xl" />
                <div className="h-48 bg-white/[0.02] border border-white/[0.06] rounded-2xl" />
                <div className="h-48 bg-white/[0.02] border border-white/[0.06] rounded-2xl" />
            </div>
        </div>
    );
}

export interface ProjectsProps {
    projects: any[];
    onSelectProject?: (project: any) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ projects = [], onSelectProject }) => {
    return (
        <section id="projetos" className="relative w-full">
            {/* Camada 1: Destaque Principal (Showcase Cilíndrico 3D Monumental) */}
            <Suspense fallback={<SectionSkeleton />}>
                <Cylindrical3DShowcase
                    onSelectProject={onSelectProject}
                    projects={projects}
                />
            </Suspense>

            {/* Transição Óptica Modular */}
            <SectionDivider marker="+" />

            {/* Camada 2: Repositório Corporativo & Soluções (Grid com Filtros Dinâmicos) */}
            <Suspense fallback={<SectionSkeleton />}>
                <ProjectsSection projects={projects} />
            </Suspense>
        </section>
    );
};

export default React.memo(Projects);
