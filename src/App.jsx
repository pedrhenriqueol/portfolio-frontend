import CursorTrail from './components/Portfolio/CursorGlow';
import NavBar from './components/Portfolio/NavBar';
import HeroSection from './components/Portfolio/HeroSection';
import AboutSection from './components/Portfolio/AboutSection';
import ExperienceSection from './components/Portfolio/ExperienceSection';
import SkillsSection from './components/Portfolio/SkillsSection';
import ProjectsSection from './components/Portfolio/ProjectsSection';
import ContactSection from './components/Portfolio/ContactSection';
import { useLanguage } from './context/LanguageContext';

export default function App() {
    const { t } = useLanguage();

    const EXPERIENCES = t('experience.list');
    const SKILLS = t('skills.list');
    const PROJECTS = t('projects.list');

    return (
        <div className="min-h-screen bg-darker text-white font-sans selection:bg-accent selection:text-darker">
            <CursorTrail />

            <NavBar />

            <main>
                <HeroSection />
                <AboutSection />
                <ExperienceSection experiences={EXPERIENCES} />
                <SkillsSection skills={SKILLS} />
                <ProjectsSection projects={PROJECTS} />
                <ContactSection />
            </main>

            <footer className="bg-dark border-t border-primary/20 py-6 text-center text-gray-500 text-sm">
                <p>© {new Date().getFullYear()} {t('contact.rights')}</p>
            </footer>
        </div>
    );
}
