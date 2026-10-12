import type { Project, ProjectArchitecturePreview, ProjectArtworkText } from '../../../types/project';
import './project-artwork.css';

interface ProjectArtworkProps {
    project: Project;
    language?: string;
    compact?: boolean;
    className?: string;
}

const copy = {
    pt: { label: 'Visão de arquitetura', fallback: 'Estrutura do projeto', caption: 'Diagrama técnico' },
    en: { label: 'Architecture overview', fallback: 'Project structure', caption: 'Technical diagram' },
    es: { label: 'Visión de arquitectura', fallback: 'Estructura del proyecto', caption: 'Diagrama técnico' },
};

function localized(text: ProjectArtworkText, language: string) {
    return text[language === 'en' || language === 'es' ? language : 'pt'];
}

/** Decorative topology marker, drawn locally without imagery or running animation. */
function TopologyMark({ composition }: { composition: ProjectArchitecturePreview['composition'] }) {
    return (
        <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className="project-artwork__mark">
            {composition === 'branch' ? (
                <>
                    <path d="M20 10V19M9 28V19H31V28" />
                    <circle cx="20" cy="7" r="3" /><circle cx="9" cy="31" r="3" /><circle cx="31" cy="31" r="3" />
                </>
            ) : composition === 'migration' ? (
                <>
                    <rect x="2" y="12" width="12" height="16" rx="2" /><rect x="26" y="12" width="12" height="16" rx="2" />
                    <path d="M17 20H23M21 17L24 20L21 23" />
                </>
            ) : composition === 'entropy' ? (
                <>
                    <rect x="9" y="18" width="22" height="16" rx="3" /><path d="M14 18V12A6 6 0 0 1 26 12V18M20 24V28" />
                </>
            ) : composition === 'request' ? (
                <>
                    <path d="M7 12H32M27 7L32 12L27 17M33 28H8M13 23L8 28L13 33" />
                </>
            ) : (
                <>
                    <rect x="6" y="4" width="28" height="8" rx="2" /><rect x="6" y="16" width="28" height="8" rx="2" /><rect x="6" y="28" width="28" height="8" rx="2" />
                    <path d="M20 12V16M20 24V28" />
                </>
            )}
        </svg>
    );
}

/**
 * Honest cover artwork for projects without a public screen capture.
 * Node content comes from the documented project; the cover communicates its
 * architecture instead of inventing a dashboard, client data or measurements.
 */
export function ProjectArtwork({ project, language = 'pt', compact = false, className = '' }: ProjectArtworkProps) {
    const words = copy[language === 'en' || language === 'es' ? language : 'pt'];
    const preview = project.preview;
    const nodes = preview?.nodes ?? (project.details?.architecture ?? []).slice(0, 4).map(layer => ({
        label: { pt: layer.layer, en: layer.layer, es: layer.layer },
        technology: layer.tech,
    }));
    const title = preview ? localized(preview.title, language) : words.fallback;
    const composition = preview?.composition ?? 'stack';
    const description = nodes.map(node => `${localized(node.label, language)}: ${node.technology}`).join(' → ');

    return (
        <figure
            className={`project-artwork${compact ? ' project-artwork--compact' : ''} ${className}`.trim()}
            data-composition={composition}
            role="img"
            aria-label={`${words.label} — ${project.title}. ${description}`}
        >
            <div className="project-artwork__content">
                <header className="project-artwork__heading">
                    <span className="project-artwork__eyebrow">{words.label}</span>
                    <div className="project-artwork__title-row">
                        <span className="project-artwork__title">{title}</span>
                        <TopologyMark composition={composition} />
                    </div>
                </header>

                <ol className="project-artwork__flow">
                    {nodes.map((node, index) => (
                        <li key={`${node.technology}-${index}`} className="project-artwork__node">
                            <span className="project-artwork__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                            <span className="project-artwork__node-copy">
                                <span className="project-artwork__node-label">{localized(node.label, language)}</span>
                                <span className="project-artwork__technology">{node.technology}</span>
                            </span>
                        </li>
                    ))}
                </ol>

                <figcaption className="project-artwork__caption">
                    <span>{preview?.caption || (project.tags ?? []).slice(0, 3).join(' · ')}</span>
                    <span>{words.caption}</span>
                </figcaption>
            </div>
        </figure>
    );
}

export default ProjectArtwork;
