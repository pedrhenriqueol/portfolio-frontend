import { useState, useMemo, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import ProjectInspectorDrawer from './ProjectInspectorDrawer';
import ModalErrorBoundary from './Common/ModalErrorBoundary';
import CorporateProjectsShowcase from './Projects/CorporateProjectsShowcase';
import { useLanguage } from '../../context/LanguageContext';
import { useCorporateArrival } from '../../hooks/useCorporateArrival';
import './corporate-arrival.css';
import './project-collection-handoff.css';
import './corporate-index.css';

const FLAGSHIP_IDS = [101, 102, 103];

export default function ProjectsSection({ projects }) {
    const [selected, setSelected] = useState(null);
    const { t, lang } = useLanguage();
    const sectionRef = useRef(null);

    // Separação em Camadas: Remove a tríade flagship para eliminar 100% da duplicação
    const corporateProjects = useMemo(() => {
        if (!Array.isArray(projects)) return [];
        return projects.filter(p => !FLAGSHIP_IDS.includes(p.id));
    }, [projects]);
    useCorporateArrival(sectionRef, lang, corporateProjects.length);

    const catalogueLabel = lang === 'en' ? 'In the catalogue'
        : lang === 'es' ? 'En el catálogo' : 'No catálogo';
    const countLabel = lang === 'en' ? `${corporateProjects.length} systems in the catalogue`
        : lang === 'es' ? `${corporateProjects.length} sistemas en el catálogo`
        : `${corporateProjects.length} sistemas no catálogo`;

    return (
        <section ref={sectionRef} tabIndex={-1} aria-labelledby="corporate-projects-heading" className="corporate-arrival bg-transparent relative outline-none">
            <span id="projetos-corporativos" className="project-collection-anchor" aria-hidden="true" />
            {/* Drawer de Detalhes Técnicos com AnimatePresence e Error Boundary */}
            <div className="corporate-arrival-inspector">
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
            </div>

            <div className="project-collection-track">
                <div className="project-collection-frame">
                    <div data-corporate-content className="corporate-arrival-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="project-collection-arrival">
                            <header className="corporate-arrival-header">
                                <div className="corporate-arrival-copy">
                                    <span className="portfolio-eyebrow mb-3 block">
                                        {lang === 'en'
                                            ? 'ENTERPRISE REPOSITORY & SOLUTIONS'
                                            : lang === 'es'
                                            ? 'REPOSITORIO CORPORATIVO Y SOLUCIONES'
                                            : 'REPOSITÓRIO CORPORATIVO & SOLUÇÕES'}
                                    </span>
                                    <h2 id="corporate-projects-heading" className="portfolio-title mb-4">
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
                                </div>
                                <div className="corporate-arrival-count">
                                    <span className="sr-only">{countLabel}</span>
                                    <div className="corporate-arrival-count-window" aria-hidden="true">
                                        <span className="corporate-arrival-number">{String(corporateProjects.length).padStart(2, '0')}</span>
                                    </div>
                                    <span className="corporate-arrival-count-label" aria-hidden="true">{catalogueLabel}</span>
                                </div>
                            </header>

                            <div className="corporate-arrival-guide" aria-hidden="true">
                                <span className="corporate-arrival-rule" />
                                <span className="corporate-arrival-rule-active" />
                                <span className="corporate-arrival-stem" />
                                <span className="corporate-arrival-marker" />
                            </div>

                            {/* Índice editorial numerado e tabela de especificações. */}
                            <div className="corporate-arrival-body">
                                <div className="chapter-tail">
                                    <CorporateProjectsShowcase
                                        projects={corporateProjects}
                                        onSelectProject={setSelected}
                                        t={t}
                                        lang={lang}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

