import { lazy, Suspense, useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import InteractiveParticleField from './components/Portfolio/InteractiveParticleField';
import CustomCursor from './components/Portfolio/CustomCursor';
import ClickSparks from './components/Portfolio/ClickSparks';
import NavBar from './components/Portfolio/NavBar';
import HeroSection from './components/Portfolio/HeroSection';
import AboutSection from './components/Portfolio/AboutSection';
import SoundEngine from './components/Portfolio/SoundEngine';
import Dock from './components/Portfolio/Workstation/Dock';
import StatusBar from './components/Portfolio/Workstation/StatusBar';
import { useLanguage } from './context/LanguageContext';

// ── Lazy-loaded below-the-fold sections for instant first load & optimal TTI ──
const FeaturedProjectsCarousel = lazy(() => import('./components/Portfolio/Projects/FeaturedProjectsCarousel'));
const ExperienceSection        = lazy(() => import('./components/Portfolio/ExperienceSection'));
const SkillsSection            = lazy(() => import('./components/Portfolio/SkillsSection'));
const ProjectsSection          = lazy(() => import('./components/Portfolio/ProjectsSection'));
const ProjectModal             = lazy(() => import('./components/Portfolio/ProjectModal'));
const ContactSection           = lazy(() => import('./components/Portfolio/ContactSection'));
const CommandPalette           = lazy(() => import('./components/Portfolio/CommandPalette'));
const LiveTelemetryMesh        = lazy(() => import('./components/Portfolio/Workstation/LiveTelemetryMesh'));

function SectionSkeleton() {
    return (
        <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
            <div className="h-4 w-28 bg-primary/20 rounded mb-4 mx-auto" />
            <div className="h-10 w-64 bg-primary/15 rounded mb-12 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-48 bg-darker/60 border border-white/5 rounded-2xl" />
                <div className="h-48 bg-darker/60 border border-white/5 rounded-2xl" />
                <div className="h-48 bg-darker/60 border border-white/5 rounded-2xl" />
            </div>
        </div>
    );
}

export default function App() {
    const { t } = useLanguage();

    const experiencesData = t('experience.list');
    const skillsData = t('skills.list');
    const projectsData = t('projects.list');

    const EXPERIENCES = Array.isArray(experiencesData) ? experiencesData : [];
    const SKILLS = Array.isArray(skillsData) ? skillsData : [];
    const PROJECTS = Array.isArray(projectsData) ? projectsData : [];

    // ── Workstation State ──
    const [telemetryOpen, setTelemetryOpen] = useState(false);
    const [avgLatency, setAvgLatency] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [selectedProject, setSelectedProject] = useState(null);

    const toggleTelemetry = useCallback(() => {
        setTelemetryOpen(v => !v);
    }, []);

    const toggleViewMode = useCallback(() => {
        setViewMode(v => v === 'grid' ? 'list' : 'grid');
    }, []);

    // Listen for open-telemetry events from CommandPalette
    useEffect(() => {
        const handler = () => setTelemetryOpen(true);
        window.addEventListener('open-telemetry', handler);
        return () => window.removeEventListener('open-telemetry', handler);
    }, []);

    return (
        <div className="min-h-screen bg-darker text-white font-sans selection:bg-accent selection:text-darker relative">
            {/* Lusion Canvas 2D Physical Particle Field */}
            <InteractiveParticleField />

            {/* Global micro-effects */}
            <CustomCursor />
            <ClickSparks />
            <SoundEngine />
            
            <Suspense fallback={null}>
                <CommandPalette />
            </Suspense>

            {/* ── Workstation Layer (Additive — does NOT replace existing content) ── */}
            <Dock
                onToggleTelemetry={toggleTelemetry}
                isTelemetryOpen={telemetryOpen}
                viewMode={viewMode}
                onToggleViewMode={toggleViewMode}
            />
            <StatusBar avgLatency={avgLatency} />
            <Suspense fallback={null}>
                <LiveTelemetryMesh
                    isOpen={telemetryOpen}
                    onClose={() => setTelemetryOpen(false)}
                    onLatencyUpdate={setAvgLatency}
                />
            </Suspense>

            <NavBar />

            <main className="pb-8 lg:pb-10">
                <HeroSection />
                <AboutSection />

                {/* ── Camada 1: Destaque Principal (Carrossel Arrastável Sem Scroll Hijacking) ── */}
                <Suspense fallback={<SectionSkeleton />}>
                    <FeaturedProjectsCarousel
                        onSelectProject={setSelectedProject}
                        projects={PROJECTS}
                    />
                </Suspense>
                
                <Suspense fallback={<SectionSkeleton />}>
                    <ExperienceSection experiences={EXPERIENCES} />
                </Suspense>

                <Suspense fallback={<SectionSkeleton />}>
                    <SkillsSection skills={SKILLS} />
                </Suspense>

                {/* ── Camada 2: Projetos Corporativos & Soluções (Grid com Filtros) ── */}
                <Suspense fallback={<SectionSkeleton />}>
                    <ProjectsSection 
                        projects={PROJECTS} 
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                    />
                </Suspense>

                <Suspense fallback={<SectionSkeleton />}>
                    <ContactSection />
                </Suspense>
            </main>

            {/* Global Modal para projetos inspecionados via KineticShowcase */}
            <AnimatePresence>
                {selectedProject && (
                    <Suspense fallback={null}>
                        <ProjectModal
                            project={selectedProject}
                            onClose={() => setSelectedProject(null)}
                        />
                    </Suspense>
                )}
            </AnimatePresence>

            <footer className="bg-dark border-t border-primary/20 py-6 text-center text-gray-500 text-sm lg:pb-8">
                <p>© {new Date().getFullYear()} {t('contact.rights')}</p>
            </footer>
        </div>
    );
}
