import { lazy, Suspense } from 'react';
import CustomCursor from './components/Portfolio/CustomCursor';
import ClickSparks from './components/Portfolio/ClickSparks';
import NavBar from './components/Portfolio/NavBar';
import HeroSection from './components/Portfolio/HeroSection';
import AboutSection from './components/Portfolio/AboutSection';
import SoundEngine from './components/Portfolio/SoundEngine';
import { useLanguage } from './context/LanguageContext';

// ── Lazy-loaded below-the-fold sections for instant first load & optimal TTI ──
const ExperienceSection = lazy(() => import('./components/Portfolio/ExperienceSection'));
const SkillsSection     = lazy(() => import('./components/Portfolio/SkillsSection'));
const ProjectsSection   = lazy(() => import('./components/Portfolio/ProjectsSection'));
const ContactSection    = lazy(() => import('./components/Portfolio/ContactSection'));
const CommandPalette    = lazy(() => import('./components/Portfolio/CommandPalette'));

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

    return (
        <div className="min-h-screen bg-darker text-white font-sans selection:bg-accent selection:text-darker">
            {/* Global micro-effects */}
            <CustomCursor />
            <ClickSparks />
            <SoundEngine />
            
            <Suspense fallback={null}>
                <CommandPalette />
            </Suspense>

            <NavBar />

            <main>
                <HeroSection />
                <AboutSection />
                
                <Suspense fallback={<SectionSkeleton />}>
                    <ExperienceSection experiences={EXPERIENCES} />
                </Suspense>

                <Suspense fallback={<SectionSkeleton />}>
                    <SkillsSection skills={SKILLS} />
                </Suspense>

                <Suspense fallback={<SectionSkeleton />}>
                    <ProjectsSection projects={PROJECTS} />
                </Suspense>

                <Suspense fallback={<SectionSkeleton />}>
                    <ContactSection />
                </Suspense>
            </main>

            <footer className="bg-dark border-t border-primary/20 py-6 text-center text-gray-500 text-sm">
                <p>© {new Date().getFullYear()} {t('contact.rights')}</p>
            </footer>
        </div>
    );
}
