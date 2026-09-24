import React, { lazy, Suspense, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import InteractiveParticleField from './components/Portfolio/InteractiveParticleField';
import CustomCursor from './components/Portfolio/CustomCursor';
import ClickSparks from './components/Portfolio/ClickSparks';
import Header from './components/Portfolio/Header';
import Hero from './components/Portfolio/Hero';
import AboutMe from './components/Portfolio/AboutMe';
import Experience from './components/Portfolio/Experience';
import Skills from './components/Portfolio/Skills';
import Projects from './components/Portfolio/Projects';
import Contact from './components/Portfolio/Contact';
import SoundEngine from './components/Portfolio/SoundEngine';
import Dock from './components/Portfolio/Workstation/Dock';
import StatusBar from './components/Portfolio/Workstation/StatusBar';
import SystemPreloader from './components/Portfolio/SystemPreloader';
import AmbientBackdrop from './components/Portfolio/AmbientBackdrop';
import FixedBackdrop from './components/Portfolio/FixedBackdrop';
import ModalErrorBoundary from './components/Portfolio/Common/ModalErrorBoundary';
import SectionDivider from './components/Portfolio/Common/SectionDivider';
import { useLanguage } from './context/LanguageContext';

const ProjectInspectorDrawer = lazy(() => import('./components/Portfolio/ProjectInspectorDrawer'));
const CommandPalette         = lazy(() => import('./components/Portfolio/CommandPalette'));
const LiveTelemetryMesh      = lazy(() => import('./components/Portfolio/Workstation/LiveTelemetryMesh'));

export default function App() {
    const { t } = useLanguage();

    const experiencesData = t('experience.list');
    const skillsData = t('skills.list');
    const projectsData = t('projects.list');

    const EXPERIENCES = Array.isArray(experiencesData) ? experiencesData : [];
    const SKILLS = Array.isArray(skillsData) ? skillsData : [];
    const PROJECTS = Array.isArray(projectsData) ? projectsData : [];

    // ── Boot Sequence & Preloader State ──
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const handlePreloaderComplete = useCallback(() => {
        setIsLoaded(true);
    }, []);

    // ── Workstation State ──
    const [telemetryOpen, setTelemetryOpen] = useState<boolean>(false);
    const [avgLatency, setAvgLatency] = useState<number | null>(null);
    const [selectedProject, setSelectedProject] = useState<any>(null);

    const toggleTelemetry = useCallback(() => {
        setTelemetryOpen(v => !v);
    }, []);

    // Listen for open-telemetry events from CommandPalette
    useEffect(() => {
        const handler = () => setTelemetryOpen(true);
        window.addEventListener('open-telemetry', handler);
        return () => window.removeEventListener('open-telemetry', handler);
    }, []);

    return (
        <div
            className="min-h-screen bg-[#05070a] text-white font-sans selection:bg-white selection:text-black relative"
            style={{ overflowX: 'clip' }}
        >
            {/* ── Substrato Fixo Monolítico (#05070a com Iluminação Especular Superior) ── */}
            <FixedBackdrop />

            {/* ── Sequência de Inicialização / Preloader Minimalista ── */}
            <AnimatePresence mode="wait">
                {!isLoaded && (
                    <SystemPreloader
                        key="system-preloader"
                        onComplete={handlePreloaderComplete}
                    />
                )}
            </AnimatePresence>

            {/* ── Camadas Globais Fixadas na Viewport ── */}
            <InteractiveParticleField />
            <CustomCursor />
            <ClickSparks />
            <SoundEngine />

            <Suspense fallback={null}>
                <CommandPalette />
            </Suspense>

            {/* ── Workstation Layer (Overlays Fixos na Viewport) ── */}
            <Dock
                onToggleTelemetry={toggleTelemetry}
                isTelemetryOpen={telemetryOpen}
            />
            <StatusBar avgLatency={avgLatency} />
            <Suspense fallback={null}>
                <LiveTelemetryMesh
                    isOpen={telemetryOpen}
                    onClose={() => setTelemetryOpen(false)}
                    onLatencyUpdate={setAvgLatency}
                />
            </Suspense>

            {/* ── Header (Fixo no Topo com Revelação Sincronizada) ── */}
            <Header isLoaded={isLoaded} />

            {/* ── Iluminação Volumétrica de Dupla Camada ── */}
            <div className="relative z-10 w-full pointer-events-none">
                <AmbientBackdrop />
            </div>

            {/* ── Conteúdo Principal com Fluxo de Rolagem Nativo ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="relative z-10 w-full"
            >
                <main className="relative min-h-screen bg-[#05070a] text-neutral-100 overflow-x-clip selection:bg-white/20 selection:text-white">
                    <Hero />
                    <AboutMe />
                    <SectionDivider marker="+" />
                    <Experience experiences={EXPERIENCES} />
                    <SectionDivider marker="+" />
                    <Skills skills={SKILLS} />
                    <SectionDivider marker="+" />
                    <Projects projects={PROJECTS} onSelectProject={setSelectedProject} />
                    <SectionDivider marker="+" />
                    <Contact />
                </main>

                <footer className="bg-transparent py-12 text-center text-gray-500 text-sm lg:pb-14">
                    <SectionDivider className="mb-8" marker="◇" />
                    <p>© {new Date().getFullYear()} {t('contact.rights')}</p>
                </footer>
            </motion.div>

            {/* Global Console para projetos inspecionados via Drawer */}
            <Suspense fallback={null}>
                <ModalErrorBoundary onClose={() => setSelectedProject(null)}>
                    <AnimatePresence mode="wait">
                        {selectedProject && (
                            <ProjectInspectorDrawer
                                key={`inspector-${selectedProject.id}`}
                                project={selectedProject}
                                onClose={() => setSelectedProject(null)}
                            />
                        )}
                    </AnimatePresence>
                </ModalErrorBoundary>
            </Suspense>
        </div>
    );
}
