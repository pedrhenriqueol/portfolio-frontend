import { useRef, type ReactNode } from 'react';
import { useCareerSkillsHandoff } from '../../../hooks/useCareerSkillsHandoff';
import '../career-skills-handoff.css';

/** The introduction pins briefly; the selected skills view stays in native flow. */
export default function CareerSkillsHandoff({ heading, children, mode, language }: {
    heading: ReactNode;
    children: ReactNode;
    mode: 'bento' | '3d';
    language: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    useCareerSkillsHandoff(ref, mode, language);

    return (
        <div ref={ref} className="career-skills-handoff" data-mode={mode}>
            <div className="career-skills-intro-track">
                <div id="habilidades" className="career-skills-anchor" aria-hidden="true" />
                <div className="career-skills-intro-frame">
                    <svg className="career-skills-thread" aria-hidden="true" focusable="false" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="skills-laser-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.45" />
                                <stop offset="60%" stopColor="var(--color-accent)" stopOpacity="0.95" />
                                <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity="1" />
                            </linearGradient>
                        </defs>
                        <path data-skills-source-thread fill="none" />
                        <path data-skills-heading-bridge fill="none" />
                        <circle data-skills-source-halo r="8" />
                        <circle data-skills-source-marker r="3.5" />
                        <path data-skills-guide-base fill="none" />
                        <path data-skills-guide-active fill="none" />
                        <circle data-skills-fork-orb="0" r="3.4" />
                        <circle data-skills-fork-orb="1" r="3.4" />
                        <circle data-skills-fork-orb="2" r="3.4" />
                    </svg>
                    <div className="career-skills-heading">{heading}</div>
                </div>
            </div>
            <div className="career-skills-body">{children}</div>
        </div>
    );
}
