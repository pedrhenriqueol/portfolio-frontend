import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import ProjectInspectorDrawer from './ProjectInspectorDrawer';
import ModalErrorBoundary from './Common/ModalErrorBoundary';
import Reveal from './Common/Reveal';
import CorporateProjectsShowcase from './Projects/CorporateProjectsShowcase';
import { useLanguage } from '../../context/LanguageContext';

export default function ProjectsSection({ projects }) {
    const [selected, setSelected] = useState(null);
    const { t, lang } = useLanguage();

    const FLAGSHIP_IDS = [101, 102, 103];

    // Separação em Camadas: Remove a tríade flagship para eliminar 100% da duplicação
    const corporateProjects = useMemo(() => {
        if (!Array.isArray(projects)) return [];
        return projects.filter(p => !FLAGSHIP_IDS.includes(p.id));
    }, [projects]);

    return (
        <section id="projetos-corporativos" className="py-24 md:py-36 bg-transparent relative">
            {/* Drawer de Detalhes Técnicos com AnimatePresence e Error Boundary */}
            <ModalErrorBoundary onClose={() => setSelected(null)}>
                <AnimatePresence mode="wait">
                    {selected && (
                        <ProjectInspectorDrawer
                            key={`inspector-${selected.id}`}
                            project={selected}
                            onClose={() => setSelected(null)}
                        />
                    )}
                </AnimatePresence>
            </ModalErrorBoundary>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Camada 2: Projetos Corporativos & Soluções */}
                <Reveal className="mb-10">
                    <span className="portfolio-eyebrow mb-3 block">
                        {lang === 'en'
                            ? '// 04.02. ENTERPRISE REPOSITORY & SOLUTIONS'
                            : lang === 'es'
                            ? '// 04.02. REPOSITORIO CORPORATIVO Y SOLUCIONES'
                            : '// 04.02. REPOSITÓRIO CORPORATIVO & SOLUÇÕES'}
                    </span>
                    <h2 className="portfolio-title mb-4">
                        {lang === 'en'
                            ? 'Enterprise Systems & Utilities'
                            : lang === 'es'
                            ? 'Sistemas Empresariales y Utilidades'
                            : 'Projetos Corporativos & Soluções'}
                    </h2>
                    <p className="portfolio-lede max-w-2xl">
                        {lang === 'en'
                            ? 'ERP administration, legacy desktop migration, fiscal compliance, and software engineering tools.'
                            : lang === 'es'
                            ? 'Sistemas de gestión empresarial (ERP/POS), modernización de sistemas legacy, módulos fiscales y utilidades.'
                            : 'Sistemas de gestão empresarial (ERP/PDV), modernização de legados, módulos fiscais e utilitários.'}
                    </p>
                </Reveal>

                {/* Esteira Cilíndrica 3D com Rotação Espacial e Filtros com layoutId */}
                <div className="chapter-tail">
                <CorporateProjectsShowcase
                    projects={corporateProjects}
                    onSelectProject={setSelected}
                    t={t}
                    lang={lang}
                />
                </div>
            </div>
        </section>
    );
}

