import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectInspectorDrawer from './ProjectInspectorDrawer';
import ModalErrorBoundary from './Common/ModalErrorBoundary';
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
        <section id="projetos" className="grid-bg py-20 md:py-24 bg-dark relative border-t border-primary/30">
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
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-10"
                >
                    <span className="text-accent text-[11px] font-semibold tracking-[0.25em] uppercase mb-2 block font-sans">
                        {lang === 'en' ? 'CORPORATE PORTFOLIO & SOLUTIONS' : 'PORTFÓLIO CORPORATIVO & SOLUÇÕES'}
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-4">
                        {lang === 'en' ? 'Enterprise Systems & Utilities' : 'Projetos Corporativos & Soluções'}
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto font-sans text-sm sm:text-base">
                        {lang === 'en'
                            ? 'ERP administration, legacy desktop migration, fiscal compliance, and software engineering tools.'
                            : 'Sistemas de gestão empresarial (ERP/PDV), modernização de legados, módulos fiscais e utilitários.'}
                    </p>
                </motion.div>

                {/* Esteira Cilíndrica 3D com Rotação Espacial e Filtros com layoutId */}
                <CorporateProjectsShowcase
                    projects={corporateProjects}
                    onSelectProject={setSelected}
                    t={t}
                    lang={lang}
                />
            </div>
        </section>
    );
}

