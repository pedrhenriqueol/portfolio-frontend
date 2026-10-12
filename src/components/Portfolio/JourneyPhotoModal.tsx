import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import JourneyMigrationDiagram from './JourneyMigrationDiagram';
import './journey-record.css';

export interface JourneyMilestoneArchive {
    id: string;
    year: string;
    company: string;
    role: string;
    archiveTitle: string;
    image?: string;
    media?: 'process';
    mediaCaption: string;
    date: string;
    location: string;
    description: string;
    contributions: string[];
    results: { label: string; value: string }[];
    technologies: string[];
}

interface JourneyPhotoModalProps {
    isOpen: boolean;
    onClose: () => void;
    milestone: JourneyMilestoneArchive | null;
}

const COPY = {
    pt: { journey: 'Trajetória', close: 'Fechar registro', content: 'Conteúdo do registro', context: 'Contexto', contributions: 'Minha contribuição', education: 'Aprendizado na prática', results: 'Resultados', technologies: 'Ferramentas e tecnologias' },
    en: { journey: 'Journey', close: 'Close record', content: 'Record content', context: 'Context', contributions: 'My contribution', education: 'Hands-on learning', results: 'Results', technologies: 'Tools and technologies' },
    es: { journey: 'Trayectoria', close: 'Cerrar registro', content: 'Contenido del registro', context: 'Contexto', contributions: 'Mi contribución', education: 'Aprendizaje práctico', results: 'Resultados', technologies: 'Herramientas y tecnologías' },
};

/** A single reading surface; the timeline remains stationary behind its portal. */
function JourneyArchiveDialog({ milestone, onClose }: { milestone: JourneyMilestoneArchive; onClose: () => void }) {
    const { lang } = useLanguage();
    const copy = COPY[lang as keyof typeof COPY] || COPY.pt;
    const reducedMotion = useReducedMotion();
    const overlayRef = useRef<HTMLDivElement>(null);
    const dialogRef = useRef<HTMLElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;
    const titleId = `${milestone.id}-title`;
    const descriptionId = `${milestone.id}-description`;

    useEffect(() => {
        const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const overflow = document.body.style.overflow;
        const paddingRight = document.body.style.paddingRight;
        const scrollbar = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
        const zoom = Number.parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
        const inertSiblings = Array.from(document.body.children)
            .filter((node): node is HTMLElement => node instanceof HTMLElement && node !== overlayRef.current)
            .map(node => ({ node, inert: node.inert }));

        inertSiblings.forEach(({ node }) => { node.inert = true; });
        if (scrollbar) document.body.style.paddingRight = `${Number.parseFloat(getComputedStyle(document.body).paddingRight) + scrollbar / zoom}px`;
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus({ preventScroll: true });

        const focusable = () => Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])') || [])
            .filter(node => !node.hasAttribute('disabled') && !node.closest('[inert]') && node.getClientRects().length > 0);
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                event.stopPropagation();
                return;
            }
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                onCloseRef.current();
            } else if (event.key === 'Tab') {
                const items = focusable();
                const first = items[0];
                const last = items[items.length - 1];
                if (!first) {
                    event.preventDefault();
                    dialogRef.current?.focus({ preventScroll: true });
                } else if (event.shiftKey && (document.activeElement === first || !dialogRef.current?.contains(document.activeElement))) {
                    event.preventDefault();
                    last.focus({ preventScroll: true });
                } else if (!event.shiftKey && (document.activeElement === last || !dialogRef.current?.contains(document.activeElement))) {
                    event.preventDefault();
                    first.focus({ preventScroll: true });
                }
            }
        };
        const handleFocus = (event: FocusEvent) => {
            if (event.target instanceof Node && !dialogRef.current?.contains(event.target)) closeRef.current?.focus({ preventScroll: true });
        };
        document.addEventListener('keydown', handleKeyDown, true);
        document.addEventListener('focusin', handleFocus);
        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
            document.removeEventListener('focusin', handleFocus);
            inertSiblings.forEach(({ node, inert }) => { node.inert = inert; });
            document.body.style.overflow = overflow;
            document.body.style.paddingRight = paddingRight;
            if (previousFocus?.isConnected && !previousFocus.closest('[inert]')) previousFocus.focus({ preventScroll: true });
        };
    }, []);

    return (
        <motion.div
            ref={overlayRef}
            data-lenis-prevent
            className="journey-record-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : .2 }}
            onClick={event => { if (event.target === event.currentTarget) onClose(); }}
        >
            <motion.article
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                tabIndex={-1}
                className="journey-record"
                initial={reducedMotion ? false : { opacity: 0, y: 24, scale: .98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                transition={{ duration: reducedMotion ? 0 : .3, ease: [.22, 1, .36, 1] }}
            >
                <header className="journey-record-header">
                    <span className="journey-record-eyebrow">{copy.journey} <span aria-hidden="true">/</span> {milestone.year}</span>
                    <button ref={closeRef} type="button" onClick={onClose} className="journey-record-close" aria-label={copy.close}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg>
                    </button>
                </header>

                <div className="journey-record-body" data-lenis-prevent role="region" aria-label={copy.content} tabIndex={0}>
                    <div className="journey-record-intro">
                        <p className="journey-record-company">{milestone.company}</p>
                        <h2 id={titleId}>{milestone.role}</h2>
                        <p className="journey-record-meta"><span>{milestone.date}</span><span>{milestone.location}</span></p>
                    </div>

                    <figure className={`journey-record-media${milestone.media === 'process' ? ' journey-record-media-process' : ''}`}>
                        {milestone.media === 'process'
                            ? <JourneyMigrationDiagram language={lang} />
                            : <img src={milestone.image} alt={milestone.mediaCaption} className="journey-record-image" />}
                        <figcaption>{milestone.mediaCaption}</figcaption>
                    </figure>

                    <div className="journey-record-context">
                        <div>
                            <h3>{copy.context}</h3>
                            <p id={descriptionId}>{milestone.description}</p>
                        </div>
                        <div>
                            <h3>{milestone.year === '2024' ? copy.education : copy.contributions}</h3>
                            <ul>{milestone.contributions.map(item => <li key={item}>{item}</li>)}</ul>
                        </div>
                    </div>

                    {milestone.results.length > 0 && (
                        <section className="journey-record-results" aria-label={copy.results}>
                            <h3>{copy.results}</h3>
                            <dl>{milestone.results.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
                        </section>
                    )}

                    <div className="journey-record-tools"><h3>{copy.technologies}</h3><p>{milestone.technologies.join(' · ')}</p></div>
                </div>
            </motion.article>
        </motion.div>
    );
}

export const JourneyPhotoModal: React.FC<JourneyPhotoModalProps> = ({ isOpen, onClose, milestone }) => createPortal(
    <AnimatePresence>
        {isOpen && milestone && <JourneyArchiveDialog key={milestone.id} milestone={milestone} onClose={onClose} />}
    </AnimatePresence>,
    document.body,
);

export default JourneyPhotoModal;
