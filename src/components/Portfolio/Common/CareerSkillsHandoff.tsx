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
                        <path data-skills-source-thread fill="none" />
                        <path data-skills-heading-bridge fill="none" />
                        <circle data-skills-source-marker r="3" />
                        <path data-skills-guide-base fill="none" />
                        <path data-skills-guide-active fill="none" />
                    </svg>
                    <div className="career-skills-heading">{heading}</div>
                </div>
            </div>
            <div className="career-skills-body">{children}</div>
        </div>
    );
}
