import { useRef, type ReactNode } from 'react';
import { useCareerSkillsHandoff } from '../../../hooks/useCareerSkillsHandoff';
import '../career-skills-handoff.css';

/**
 * Palco de transição cinemática entre o fim da Experiência Profissional (2024)
 * e a Especialização Técnica (Bento Grid 12 colunas / Visualizador 3D).
 *
 * Arquitetura anti-sobreposição:
 * - `.career-skills-intro-track` fixa temporariamente o cabeçalho + câmara óptica de bifurcação SVG
 *   (posicionada abaixo dos botões de modo, sem cruzar textos).
 * - `.career-skills-body` permanece em fluxo natural logo abaixo da câmara de bifurcação,
 *   desdobrando os 4 cards espacialmente do eixo central sem nunca colidir com o título.
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

            <div className="career-skills-intro-track">
                <div className="career-skills-intro-frame">
                    <svg
                        className="career-skills-thread"
                        aria-hidden="true"
                        focusable="false"
                        preserveAspectRatio="none"
                    >
                        {/* Feixe de entrada vindo do fim do trilho 2024 até o topo do cabeçalho */}
                        <path data-skills-source-thread fill="none" />
                        <path data-skills-source-active fill="none" pathLength="1" />

                        {/* Câmara óptica de bifurcação (abaixo dos botões -> topo das 3 colunas do Bento Grid) */}
                        <path data-skills-heading-bridge fill="none" />
                        <path data-skills-branch-base="0" fill="none" />
                        <path data-skills-branch-base="1" fill="none" />
                        <path data-skills-branch-base="2" fill="none" />
                        <path data-skills-branch-active="0" fill="none" pathLength="1" />
                        <path data-skills-branch-active="1" fill="none" pathLength="1" />
                        <path data-skills-branch-active="2" fill="none" pathLength="1" />

                        {/* Orb principal de entrada + 3 Orbs de distribuição nas colunas */}
                        <circle data-skills-source-halo r="8" />
                        <circle data-skills-source-marker r="3.4" />
                        <circle data-skills-branch-orb="0" r="2.8" />
                        <circle data-skills-branch-orb="1" r="3.2" />
                        <circle data-skills-branch-orb="2" r="2.8" />
                    </svg>

                    <div className="career-skills-heading">
                        <div className="career-skills-heading-inner">{heading}</div>
                    </div>
                </div>
            </div>

            <div className="career-skills-body">{children}</div>
        </div>
    );
}
