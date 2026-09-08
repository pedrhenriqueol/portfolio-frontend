import { lazy, Suspense, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import InteractiveParticleField from './components/Portfolio/InteractiveParticleField';
import CustomCursor from './components/Portfolio/CustomCursor';
import ClickSparks from './components/Portfolio/ClickSparks';
import Header from './components/Portfolio/Header';
import HeroSection from './components/Portfolio/HeroSection';
import AboutSection from './components/Portfolio/AboutSection';
import SoundEngine from './components/Portfolio/SoundEngine';
import Dock from './components/Portfolio/Workstation/Dock';
import StatusBar from './components/Portfolio/Workstation/StatusBar';
import SystemPreloader from './components/Portfolio/SystemPreloader';
import AmbientBackdrop from './components/Portfolio/AmbientBackdrop';
import { useLanguage } from './context/LanguageContext';

const Cylindrical3DShowcase        = lazy(() => import('./components/Portfolio/Projects/Cylindrical3DShowcase'));
const ProfessionalJourneyTimeline = lazy(() => import('./components/Portfolio/ProfessionalJourneyTimeline'));
const SkillsSection                = lazy(() => import('./components/Portfolio/SkillsSection'));
const ProjectsSection          = lazy(() => import('./components/Portfolio/ProjectsSection'));
const ProjectInspectorDrawer   = lazy(() => import('./components/Portfolio/ProjectInspectorDrawer'));
const ContactSection           = lazy(() => import('./components/Portfolio/ContactSection'));
const CommandPalette           = lazy(() => import('./components/Portfolio/CommandPalette'));
const LiveTelemetryMesh        = lazy(() => import('./components/Portfolio/Workstation/LiveTelemetryMesh'));
import FixedBackdrop from './components/Portfolio/FixedBackdrop';
import ModalErrorBoundary from './components/Portfolio/Common/ModalErrorBoundary';
import SectionDivider from './components/Portfolio/Common/SectionDivider';

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

export default function App() {
    const { t } = useLanguage();

    const experiencesData = t('experience.list');
    const skillsData = t('skills.list');
    const projectsData = t('projects.list');

    const EXPERIENCES = Array.isArray(experiencesData) ? experiencesData : [];
    const SKILLS = Array.isArray(skillsData) ? skillsData : [];
    const PROJECTS = Array.isArray(projectsData) ? projectsData : [];

    // ── Boot Sequence & Preloader State ──
    const [isLoaded, setIsLoaded] = useState(false);

    const handlePreloaderComplete = useCallback(() => {
        setIsLoaded(true);
    }, []);

    // ── Workstation State ──
    const [telemetryOpen, setTelemetryOpen] = useState(false);
    const [avgLatency, setAvgLatency] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);

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
        <div className="min-h-screen bg-[#090b10] text-white font-sans selection:bg-accent selection:text-[#090b10] relative">
            {/* ── Substrato Fixo Monolítico (#090b10 com Iluminação Especular Superior) ── */}
            <FixedBackdrop />

            {/* ── Sequência de Inicialização / Preloader Minimalista Jesper Landberg ── */}
            <AnimatePresence mode="wait">
                {!isLoaded && (
                    <SystemPreloader
                        key="system-preloader"
                        onComplete={handlePreloaderComplete}
                    />
                )}
            </AnimatePresence>

            {/* ── Camadas Globais Fixadas na Viewport (NUNCA dentro de containers transformados) ── */}
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

            {/* ── Hero & Conteúdo Principal (Elevação do Fundo — Revelação em Pinça) ── */}
            <motion.div
                initial={{ y: 14, opacity: 0, scale: 0.98 }}
                animate={isLoaded ? { y: 0, opacity: 1, scale: 1 } : { y: 14, opacity: 0, scale: 0.98 }}
                transition={{
                    type: 'spring',
                    stiffness: 240,
                    damping: 26,
                    mass: 0.6,
                }}
                style={{ willChange: isLoaded ? 'auto' : 'transform, opacity' }}
                className="relative z-10 w-full"
            >
                {/* ── Iluminação Volumétrica de Dupla Camada (Cones Fixos + Spotlight Reativo ao Scroll) ── */}
                <AmbientBackdrop />

                {/* ── Container Principal Estático, Estável e Ortogonal (Padrão Rauno Freiberg) ── */}
                <main className="relative z-10 w-full overflow-x-hidden bg-transparent pb-8 lg:pb-10">
                    <HeroSection />
                    <AboutSection />

                    {/* ── Filamento Óptico Esvaecido: Transição para os Sistemas 3D ── */}
                    <SectionDivider marker="+" />

                    {/* ── Camada 1: Destaque Principal (Showcase Cilíndrico 3D em Escala Monumental) ── */}
                    <Suspense fallback={<SectionSkeleton />}>
                        <Cylindrical3DShowcase
                            onSelectProject={setSelectedProject}
                            projects={PROJECTS}
                        />
                    </Suspense>

                    {/* ── Filamento Óptico Esvaecido: Transição para a Trajetória Profissional ── */}
                    <SectionDivider marker="+" />
                    
                    <Suspense fallback={<SectionSkeleton />}>
                        <ProfessionalJourneyTimeline experiences={EXPERIENCES} />
                    </Suspense>

                    {/* ── Filamento Óptico Esvaecido: Transição para Stack & Habilidades ── */}
                    <SectionDivider marker="+" />

                    <Suspense fallback={<SectionSkeleton />}>
                        <SkillsSection skills={SKILLS} />
                    </Suspense>

                    {/* ── Filamento Óptico Esvaecido: Transição para Repositório Corporativo ── */}
                    <SectionDivider marker="+" />

                    {/* ── Camada 2: Projetos Corporativos & Soluções (Grid com Filtros) ── */}
                    <Suspense fallback={<SectionSkeleton />}>
                        <ProjectsSection 
                            projects={PROJECTS} 
                        />
                    </Suspense>

                    {/* ── Filamento Óptico Esvaecido: Transição para Contato & Terminal ── */}
                    <SectionDivider marker="+" />

                    <Suspense fallback={<SectionSkeleton />}>
                        <ContactSection />
                    </Suspense>
                </main>

                <footer className="bg-transparent py-12 text-center text-gray-500 text-sm lg:pb-14">
                    <SectionDivider className="mb-8" marker="◇" />
                    <p>© {new Date().getFullYear()} {t('contact.rights')}</p>
                </footer>
            </motion.div>

            {/* Global Console para projetos inspecionados via KineticShowcase */}
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
