import React, { lazy, Suspense, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import InteractiveParticleField from './components/Portfolio/InteractiveParticleField';
import CustomCursor from './components/Portfolio/CustomCursor';
import ClickSparks from './components/Portfolio/ClickSparks';
import Navbar from './components/Portfolio/Navbar';
import AboutExperienceStory from './components/Portfolio/AboutExperienceStory';
import Skills from './components/Portfolio/Skills';
import Projects from './components/Portfolio/Projects';
import Contact from './components/Portfolio/Contact';
import SoundEngine from './components/Portfolio/SoundEngine';
import Dock from './components/Portfolio/Workstation/Dock';
import SystemPreloader from './components/Portfolio/SystemPreloader';
import FixedBackdrop from './components/Portfolio/FixedBackdrop';
import ModalErrorBoundary from './components/Portfolio/Common/ModalErrorBoundary';
import SectionDivider from './components/Portfolio/Common/SectionDivider';
import ScrollChapter from './components/Portfolio/Common/ScrollChapter';
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
        // Reveal Home immediately, without CSS smooth scrolling or a stale
        // browser-restored position. Explicit hash links are aligned below.
        if (!window.location.hash) {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
        setIsLoaded(true);
    }, []);

    // Keep a direct link aligned while fonts and lazy sections settle.
    // Stop correcting as soon as the visitor starts interacting.
    useEffect(() => {
        if (!isLoaded || !window.location.hash) return;
        let cancelled = false;
        let frame = 0;
        let observer: ResizeObserver | null = null;
        const cancel = () => {
            cancelled = true;
            cancelAnimationFrame(frame);
            observer?.disconnect();
        };
        const events = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const;
        events.forEach(event => window.addEventListener(event, cancel, { passive: true, once: true }));
        const align = () => {
            if (cancelled) return;
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                if (cancelled) return;
                try {
                    const id = decodeURIComponent(window.location.hash.slice(1));
                    const target = document.getElementById(id);
                    const terminalScene = id === 'terminal' && target?.closest<HTMLElement>('.hero-story[data-connected="true"]');
                    if (terminalScene) {
                        window.scrollTo({ top: terminalScene.getBoundingClientRect().top + window.scrollY, behavior: 'instant' });
                    } else {
                        target?.scrollIntoView({ behavior: 'instant', block: 'start' });
                    }
                } catch { /* Ignore malformed URLs. */ }
            });
        };
        document.fonts.ready.then(() => {
            if (cancelled) return;
            observer = new ResizeObserver(align);
            const main = document.querySelector('main');
            if (main) observer.observe(main);
            align();
        });
        return () => {
            cancel();
            events.forEach(event => window.removeEventListener(event, cancel));
        };
    }, [isLoaded]);

    // ── Workstation State ──
    const [telemetryOpen, setTelemetryOpen] = useState<boolean>(false);
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
            <Suspense fallback={null}>
                <LiveTelemetryMesh
                    isOpen={telemetryOpen}
                    onClose={() => setTelemetryOpen(false)}
                />
            </Suspense>

            {/* ── Navbar (Fixo no Topo com Revelação Sincronizada) ── */}
            <Navbar isLoaded={isLoaded} />

            {/* ── Camada Superior (HUD / HTML Tradicional com Rolagem Vertical Nativa) ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="relative z-10 w-full pointer-events-auto"
            >
                <main className="relative min-h-screen bg-transparent text-neutral-100 overflow-x-clip selection:bg-white/20 selection:text-white">
                    <ScrollChapter opening>
                        <AboutExperienceStory experiences={EXPERIENCES} />
                    </ScrollChapter>
                    <ScrollChapter opening><Skills skills={SKILLS} /></ScrollChapter>
                    <ScrollChapter><Projects projects={PROJECTS} onSelectProject={setSelectedProject} /></ScrollChapter>
                    <ScrollChapter><Contact /></ScrollChapter>
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
