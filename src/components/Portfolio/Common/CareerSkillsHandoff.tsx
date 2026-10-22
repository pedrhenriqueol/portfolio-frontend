import { useRef, type ReactNode } from 'react';
import { useCareerSkillsHandoff } from '../../../hooks/useCareerSkillsHandoff';
import '../career-skills-handoff.css';

/**
 * Palco sticky de transição cinemática entre o fim da Experiência Profissional (2024)
 * e a Especialização Técnica (Bento Grid 12 colunas / Visualizador 3D).
 */
export default function CareerSkillsHandoff({
    heading,
    children,
    mode,
    language,
}: {
    heading: ReactNode;
    children: ReactNode;
    mode: 'bento' | '3d';
    language: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    useCareerSkillsHandoff(ref, mode, language);

    return (
        <div ref={ref} className="career-skills-handoff" data-mode={mode}>
            <div id="habilidades" className="career-skills-anchor" aria-hidden="true" />
            <div className="career-skills-frame">
                <svg
                    className="career-skills-thread"
                    aria-hidden="true"
                    focusable="false"
                    preserveAspectRatio="none"
                >
                    <path data-skills-source-thread fill="none" />
                    <path data-skills-source-active fill="none" pathLength="1" />
                    <path data-skills-heading-bridge fill="none" />
                    <path data-skills-guide-base fill="none" />
                    <path data-skills-guide-active fill="none" pathLength="1" />
                    <circle data-skills-source-halo r="9" />
                    <circle data-skills-source-marker r="3.6" />
                </svg>

                <div className="career-skills-content">
                    <div className="career-skills-heading">{heading}</div>
                    <div className="career-skills-body">{children}</div>
                </div>
            </div>
        </div>
    );
}
