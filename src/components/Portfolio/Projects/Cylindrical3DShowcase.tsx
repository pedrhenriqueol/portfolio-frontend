import { useProjectPresentation } from '../../../hooks/useProjectPresentation';
import '../projects-focus.css';
import React, { useState, useRef, useEffect, useCallback, memo, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';
import MagneticButton from '../MagneticButton';
import { playMechanicalClick, playTabSwitch } from '../../../lib/sound';
import useSectionInView from '../../../hooks/useSectionInView';
import { useLanguage } from '../../../context/LanguageContext';
import { FLAGSHIP_CONFIGS, FLAGSHIP_CONFIGS_I18N, type FlagshipProject } from '../../../data/flagshipProjects';

export { FLAGSHIP_CONFIGS, FLAGSHIP_CONFIGS_I18N };
export type { FlagshipProject, ProjectHudMetric } from '../../../data/flagshipProjects';

/* ──────────────────────────────────────────────────────────────────────────
   Featured case-study stage
   One continuous value (`stage`, 0…n-1) drives every layer:
   - product frame: diagonal clip-path wipe + counter-zoom + light edge
   - screenshot camera: horizontal pan driven by raw scroll travel
   - copy: line-by-line masked exit/entry with stagger
   - odometers (counter + background numeral) and the vertical rail/orb
   Only transform, opacity and clip-path are animated.
   ────────────────────────────────────────────────────────────────────────── */

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (n: number) => n * n * (3 - 2 * n);
const easeInOut = (n: number) => (n < .5 ? 4 * n * n * n : 1 - Math.pow(-2 * n + 2, 3) / 2);
const pad = (n: number) => String(n).padStart(2, '0');
const LINE_STAGGER = .032;
const WIPE_SKEW = 16;

const copyFor = (lang: string) => ({
    eyebrow: lang === 'en' ? 'SELECTED WORK' : lang === 'es' ? 'PROYECTOS SELECCIONADOS' : 'PROJETOS SELECIONADOS',
    current: lang === 'en' ? 'Current project' : lang === 'es' ? 'Proyecto actual' : 'Projeto atual',
    nav: lang === 'en' ? 'Featured projects' : lang === 'es' ? 'Proyectos destacados' : 'Projetos em destaque',
    caseLabel: lang === 'en' ? 'Case' : lang === 'es' ? 'Caso' : 'Case',
    details: lang === 'en' ? 'Technical details' : lang === 'es' ? 'Detalles técnicos' : 'Detalhes técnicos',
    demo: lang === 'en' ? 'Live demo' : lang === 'es' ? 'Demo en vivo' : 'Ver demonstração',
    repo: lang === 'en' ? 'Source code on GitHub' : lang === 'es' ? 'Código fuente en GitHub' : 'Código-fonte no GitHub',
    stack: lang === 'en' ? 'Stack' : 'Stack',
    prev: lang === 'en' ? 'Previous project' : lang === 'es' ? 'Proyecto anterior' : 'Projeto anterior',
    next: lang === 'en' ? 'Next project' : lang === 'es' ? 'Siguiente proyecto' : 'Próximo projeto',
    cueScroll: lang === 'en' ? 'Scroll to explore · or use the arrows' : lang === 'es' ? 'Desplázate para explorar · o usa las flechas' : 'Role para explorar · ou use as setas',
    cueDrag: lang === 'en' ? 'Drag to explore · or use the arrows' : lang === 'es' ? 'Arrastra para explorar · o usa las flechas' : 'Arraste para explorar · ou use as setas',
    screenshot: lang === 'en' ? 'Interface preview' : lang === 'es' ? 'Vista previa de la interfaz' : 'Prévia da interface',
    live: lang === 'en' ? 'live' : lang === 'es' ? 'en vivo' : 'online',
});

const hostOf = (url: string) => {
    try { return new URL(url).host; } catch { return url; }
};

/** Line mask: the line leaves upward while the next project's line rises from below. */
const MaskLine = memo(function MaskLine({
    stage, index, line, count, children, className = '',
}: { stage: MotionValue<number>; index: number; line: number; count: number; children: ReactNode; className?: string }) {
    const y = useTransform(stage, (raw: number) => {
        const p = Math.max(0, Math.min(count - 1, raw));
        const e = p - index;
        const s = line * LINE_STAGGER;
        if (e <= 0) return `${((1 - easeInOut(clamp01((e + .5 - s) / .3))) * 140).toFixed(2)}%`;
        return `${(-easeInOut(clamp01((e - s) / .3)) * 140).toFixed(2)}%`;
    });
    return (
        <span className={`pf-mask ${className}`}>
            <motion.span className="pf-mask-inner" style={{ y }}>{children}</motion.span>
        </span>
    );
});

/** Character scramble that settles into the real metric when the case becomes active. */
const ScrambleText = memo(function ScrambleText({ text, active }: { text: string; active: boolean }) {
    const reducedMotion = useReducedMotion();
    const [output, setOutput] = useState(text);
    useEffect(() => {
        if (!active || reducedMotion) { setOutput(text); return; }
        const glyphs = '0123456789#%/<>_=+ABCDEFXZ';
        let raf = 0;
        let begin = 0;
        const tick = (now: number) => {
            if (!begin) begin = now;
            const t = Math.min(1, (now - begin) / 720);
            const settled = Math.floor(t * text.length);
            let next = '';
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                next += i < settled || char === ' ' ? char : glyphs[(Math.random() * glyphs.length) | 0];
            }
            setOutput(next);
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        const delay = window.setTimeout(() => { raf = requestAnimationFrame(tick); }, 240);
        return () => { clearTimeout(delay); cancelAnimationFrame(raf); };
    }, [active, text, reducedMotion]);
    return (
        <>
            <span className="sr-only">{text}</span>
            <span aria-hidden="true">{output}</span>
        </>
    );
});

/** Vertical reel of numbers; one reel step equals one em. */
const Odometer = memo(function Odometer({ stage, count, className = '' }: { stage: MotionValue<number>; count: number; className?: string }) {
    const y = useTransform(stage, (raw: number) => `${(-Math.max(0, Math.min(count - 1, raw)) * 100 / count).toFixed(3)}%`);
    return (
        <span className={`pf-odo ${className}`} aria-hidden="true">
            <motion.span className="pf-odo-reel" style={{ y }}>
                {Array.from({ length: count }, (_, i) => <span key={i}>{pad(i + 1)}</span>)}
            </motion.span>
        </span>
    );
});

/** One screenshot layer of the product frame. Layer i is wiped in while the stage moves from i-1 to i. */
const MediaLayer = memo(function MediaLayer({
    project, index, stage, travel, active, screenshotLabel,
}: { project: FlagshipProject; index: number; stage: MotionValue<number>; travel: MotionValue<number>; active: boolean; screenshotLabel: string }) {
    const imgRef = useRef<HTMLImageElement>(null);
    const shift = useMotionValue(0);
    const coverScale = useMotionValue(1);
    const reducedMotion = useReducedMotion();
    const reveal = (p: number) => (index === 0 ? 1 : clamp01(p - (index - 1)));
    const clipPath = useTransform(stage, (p: number) => {
        const r = reveal(p);
        if (r >= 1) return 'none';
        const left = (1 - easeInOut(r)) * (100 + WIPE_SKEW) - WIPE_SKEW;
        return `polygon(${(left + WIPE_SKEW).toFixed(2)}% 0%, 100% 0%, 100% 100%, ${left.toFixed(2)}% 100%)`;
    });
    const layerX = useTransform(stage, (p: number) => `${(-easeInOut(clamp01(p - index)) * 7).toFixed(3)}%`);
    const shade = useTransform(stage, (p: number) => easeInOut(clamp01(p - index)) * .72);
    const edgeX = useTransform(stage, (p: number) => {
        const left = (1 - easeInOut(reveal(p))) * (100 + WIPE_SKEW) - WIPE_SKEW;
        return `${(left + WIPE_SKEW / 2).toFixed(2)}%`;
    });
    const edgeOpacity = useTransform(stage, (p: number) => (index === 0 ? 0 : Math.sin(Math.PI * reveal(p))));
    const imageTransform = useTransform([stage, travel, shift, coverScale], ([p, t, s, cover]: number[]) => {
        const zoom = cover * (reducedMotion ? 1 : 1.14 - .14 * easeInOut(reveal(p)));
        const pan = reducedMotion ? .5 : smooth(clamp01((t - index + .6) / 1.3));
        return `translate3d(${(-pan * s).toFixed(2)}px, 0, 0) scale(${zoom.toFixed(4)})`;
    });

    useEffect(() => {
        const img = imgRef.current;
        const frame = img?.parentElement;
        if (!img || !frame) return;
        // Wider viewports must remain covered too. Use a top-left origin so
        // the measured overflow and camera translation share one coordinate space.
        const measure = () => {
            const cover = Math.max(1, frame.offsetWidth / Math.max(1, img.offsetWidth));
            coverScale.set(cover);
            shift.set(Math.max(0, img.offsetWidth * cover - frame.offsetWidth));
        };
        const observer = new ResizeObserver(measure);
        observer.observe(frame);
        img.addEventListener('load', measure);
        measure();
        return () => { observer.disconnect(); img.removeEventListener('load', measure); };
    }, [shift, coverScale]);

    return (
        <motion.div className="pf-media-layer" aria-hidden={!active} style={{ clipPath, x: layerX, zIndex: index + 1 }}>
            <motion.img
                ref={imgRef}
                src={project.image}
                alt={`${screenshotLabel} — ${project.title}`}
                width={1024}
                height={521}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
                className="pf-media-image"
                style={{ transform: imageTransform, transformOrigin: 'top left' }}
                onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/dashboard_placeholder.png')) target.src = '/dashboard_placeholder.png';
                }}
            />
            <motion.span className="pf-media-shade" style={{ opacity: shade }} aria-hidden="true" />
            <motion.span className="pf-wipe-edge" style={{ x: edgeX, opacity: edgeOpacity }} aria-hidden="true">
                <span />
            </motion.span>
        </motion.div>
    );
});

interface CaseCopyProps {
    project: FlagshipProject;
    index: number;
    count: number;
    active: boolean;
    stage: MotionValue<number>;
    lang: string;
    onInspect: (project: FlagshipProject) => void;
}

/** Text column for one case; all cases share one grid cell and swap line by line. */
const CaseCopy = memo(function CaseCopy({ project, index, count, active, stage, lang, onInspect }: CaseCopyProps) {
    const words = copyFor(lang);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        // Keep keyboard navigation in the gallery when scrolling retires a case.
        if (!active && ref.current?.contains(document.activeElement)) {
            ref.current.closest<HTMLElement>('section')?.focus({ preventScroll: true });
        }
    }, [active]);
    const line = (n: number, children: ReactNode, className?: string) => (
        <MaskLine stage={stage} index={index} line={n} count={count} className={className}>{children}</MaskLine>
    );

    return (
        <div ref={ref} className="pf-copy" data-active={active} inert={!active} aria-hidden={!active}>
            <div className="pf-copy-top">
                {line(0, (
                    <span className="pf-kicker">
                        <span className="pf-kicker-index">{words.caseLabel} {pad(index + 1)}</span>
                        <span className="pf-kicker-rule" aria-hidden="true" />
                        <span className="pf-kicker-badge">{project.badge}</span>
                    </span>
                ))}
                {line(1, <h3 className="pf-title">{project.title}</h3>, 'pf-mask--title')}
                {line(2, <p className="pf-tagline">{project.tagline}</p>)}
                {line(3, <p className="pf-description">{project.description}</p>)}
            </div>

            <div className="pf-copy-bottom">
                {line(4, (
                    <div className="pf-metrics">
                        {project.metrics.map((metric, i) => (
                            <div key={metric.label} className="pf-metric" style={{ '--metric-delay': `${i * 120 + 260}ms` } as React.CSSProperties}>
                                <span className="pf-metric-value"><ScrambleText text={metric.value} active={active} /></span>
                                <span className="pf-metric-label">{metric.label}</span>
                                <span className="pf-metric-bar" aria-hidden="true" />
                            </div>
                        ))}
                    </div>
                ))}
                {line(5, (
                    <div className="pf-stack">
                        <span className="pf-stack-label">{words.stack}</span>
                        <ul>
                            {project.techs.map((tech, i) => (
                                <li key={tech} className="pf-chip" style={{ '--chip-delay': `${i * 45 + 320}ms` } as React.CSSProperties}>{tech}</li>
                            ))}
                        </ul>
                    </div>
                ), 'pf-mask--roomy')}
                {line(6, (
                    <div className="pf-actions">
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onInspect(project); }}
                            data-cursor-morph="true"
                            className="portfolio-control pf-action pf-action--ghost"
                        >
                            <i aria-hidden="true" className="fas fa-microchip text-xs" />
                            <span>{words.details}</span>
                        </button>
                        <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            data-cursor-morph="true"
                            className="portfolio-button portfolio-button-primary pf-action pf-action--primary"
                        >
                            <span>{words.demo}</span>
                            <span className="pf-action-arrow" aria-hidden="true">↗</span>
                        </a>
                        <a
                            href={project.repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            data-cursor-morph="true"
                            className="portfolio-control pf-action pf-action--icon"
                            title={words.repo}
                            aria-label={`${project.title} — ${words.repo}`}
                        >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                            </svg>
                        </a>
                    </div>
                ), 'pf-mask--roomy')}
            </div>
        </div>
    );
});

/** Rail node: lights when the stage reaches it. */
const RailNode = memo(function RailNode({
    item, index, count, active, stage, onSelect,
}: { item: FlagshipProject; index: number; count: number; active: boolean; stage: MotionValue<number>; onSelect: (i: number) => void }) {
    const glow = useTransform(stage, (p: number) => clamp01(1 - Math.abs(p - index) * 1.6));
    return (
        <button
            type="button"
            className="pf-rail-node"
            aria-pressed={active}
            onClick={() => onSelect(index)}
            data-cursor-morph="true"
            style={{ '--node-pos': count > 1 ? index / (count - 1) : 0 } as React.CSSProperties}
        >
            <span className="pf-rail-dot" aria-hidden="true">
                <motion.span className="pf-rail-dot-glow" style={{ opacity: glow, scale: glow }} />
            </span>
            <span className="pf-rail-text">
                <span className="pf-rail-index">{pad(index + 1)}</span>
                <span className="pf-rail-label">{item.stepLabel}</span>
            </span>
        </button>
    );
});

interface Cylindrical3DShowcaseProps {
    onSelectProject?: (project: FlagshipProject | Record<string, unknown>) => void;
    projects?: Array<FlagshipProject | (Record<string, unknown> & { id?: number })>;
}

/**
 * Featured projects — case-study stage pinned to native scroll.
 * Keeps the public contract used by the collection handoff:
 * `.project-focus-track`, `.project-focus-frame`, `.project-collection-source`
 * and `data-presentation` on the section.
 */
export default function Cylindrical3DShowcase({ onSelectProject, projects = [] }: Cylindrical3DShowcaseProps) {
    const { lang = 'pt' } = useLanguage();
    const words = copyFor(lang);
    const reducedMotion = useReducedMotion();
    const flagshipItems = FLAGSHIP_CONFIGS_I18N[lang] || FLAGSHIP_CONFIGS;
    const totalSlides = flagshipItems.length;
    const [activeIndex, setActiveIndex] = useState(0);
    const { containerRef: sectionRef, isInView } = useSectionInView({ rootMargin: '200px 0px' });

    const progress = useMotionValue(0);
    const travel = useMotionValue(0);
    const smoothProgress = useSpring(progress, { stiffness: 170, damping: 26, mass: .55 });
    const stage = reducedMotion ? progress : smoothProgress;

    const isDraggingRef = useRef(false);
    const pointerIdRef = useRef<number | null>(null);
    const cancelledGestureRef = useRef(false);
    const startXRef = useRef(0);
    const startYRef = useRef(0);
    const dragDistanceRef = useRef(520);
    const startProgressRef = useRef(0);
    const lastXRef = useRef(0);
    const lastTimeRef = useRef(0);
    const velocityRef = useRef(0);

    const { presenting, navigatePresentation } = useProjectPresentation(sectionRef, progress, isDraggingRef, totalSlides, lang, travel);

    const railFill = useTransform(stage, (p: number) => clamp01(p / Math.max(1, totalSlides - 1)));
    const orbY = useTransform(stage, (p: number) => `${(clamp01(p / Math.max(1, totalSlides - 1)) * 100).toFixed(3)}%`);
    const countFill = useTransform(stage, (p: number) => clamp01((p + 1) / totalSlides));

    useEffect(() => {
        if (!isInView) return;
        const syncActive = (v: number) => {
            const rounded = Math.max(0, Math.min(totalSlides - 1, Math.round(v)));
            setActiveIndex(prev => (prev === rounded ? prev : rounded));
        };
        syncActive(stage.get());
        const unsubscribe = stage.on('change', syncActive);
        return () => unsubscribe();
    }, [stage, totalSlides, isInView]);

    const navigateTo = useCallback((targetIndex: number) => {
        const clamped = Math.max(0, Math.min(totalSlides - 1, targetIndex));
        if (!navigatePresentation(clamped)) {
            progress.set(clamped);
            travel.set(clamped);
            setActiveIndex(clamped);
        }
        playTabSwitch();
    }, [progress, travel, totalSlides, navigatePresentation]);

    const handlePrev = useCallback(() => {
        const current = Math.round(progress.get());
        navigateTo(current > 0 ? current - 1 : totalSlides - 1);
    }, [navigateTo, progress, totalSlides]);

    const handleNext = useCallback(() => {
        const current = Math.round(progress.get());
        navigateTo(current < totalSlides - 1 ? current + 1 : 0);
    }, [navigateTo, progress, totalSlides]);

    const handlePointerMove = useCallback((e: PointerEvent) => {
        if (pointerIdRef.current !== e.pointerId || cancelledGestureRef.current) return;
        const totalDeltaX = e.clientX - startXRef.current;
        const totalDeltaY = e.clientY - startYRef.current;
        if (!isDraggingRef.current) {
            if (Math.max(Math.abs(totalDeltaX), Math.abs(totalDeltaY)) <= 8) return;
            // A vertical touch keeps its native page scroll and never selects a case.
            if (Math.abs(totalDeltaY) >= Math.abs(totalDeltaX)) {
                cancelledGestureRef.current = true;
                return;
            }
            isDraggingRef.current = true;
        }
        const now = performance.now();
        const dt = Math.max(now - lastTimeRef.current, 1);
        velocityRef.current = (e.clientX - lastXRef.current) / dt;
        lastXRef.current = e.clientX;
        lastTimeRef.current = now;
        const target = startProgressRef.current - totalDeltaX / dragDistanceRef.current;
        progress.set(Math.max(-.2, Math.min(totalSlides - .8, target)));
        travel.set(Math.max(0, Math.min(totalSlides - 1, target)));
    }, [progress, travel, totalSlides]);

    const handlePointerUp = useCallback((e: PointerEvent) => {
        if (pointerIdRef.current !== e.pointerId) return;
        pointerIdRef.current = null;
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerUp);
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;
        const target = Math.round(progress.get() - velocityRef.current * .22);
        navigateTo(Math.max(0, Math.min(totalSlides - 1, target)));
    }, [handlePointerMove, navigateTo, progress, totalSlides]);

    const handlePointerDown = (e: React.PointerEvent) => {
        if (!isInView) return;
        if ((e.target as HTMLElement).closest('button, a, input, select, textarea')) return;
        if (!e.isPrimary || e.button !== 0 || pointerIdRef.current !== null) return;
        pointerIdRef.current = e.pointerId;
        cancelledGestureRef.current = false;
        isDraggingRef.current = false;
        startXRef.current = e.clientX;
        startYRef.current = e.clientY;
        dragDistanceRef.current = Math.max(280, Math.min(520, e.currentTarget.clientWidth));
        startProgressRef.current = progress.get();
        lastXRef.current = e.clientX;
        lastTimeRef.current = performance.now();
        velocityRef.current = 0;
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerUp);
    };

    useEffect(() => () => {
        isDraggingRef.current = false;
        pointerIdRef.current = null;
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerUp);
    }, [handlePointerMove, handlePointerUp]);

    const handleInspect = useCallback((config: FlagshipProject) => {
        playMechanicalClick();
        if (onSelectProject) {
            const fullProject = projects.find((p) => p.id === config.id) || config;
            onSelectProject(fullProject);
        }
    }, [onSelectProject, projects]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.altKey || e.ctrlKey || e.metaKey || (e.target as HTMLElement).closest('input, textarea, select, [contenteditable="true"]')) return;
        if (e.key === 'ArrowLeft') { e.preventDefault(); handlePrev(); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); handleNext(); }
        else if (e.key === 'Home') { e.preventDefault(); navigateTo(0); }
        else if (e.key === 'End') { e.preventDefault(); navigateTo(totalSlides - 1); }
    };

    const activeProject = flagshipItems[activeIndex] || flagshipItems[0];

    return (
        <section
            ref={sectionRef}
            id="projetos-destaque"
            tabIndex={0}
            aria-labelledby="featured-projects-heading"
            onKeyDown={handleKeyDown}
            className="project-focus-track bg-transparent focus:outline-none"
        >
            <span className="pf-intro-beam" aria-hidden="true" />
            <div className="project-focus-frame">
                <div className="project-collection-source">
                    <div className="project-focus-layout">
                        <header className="project-focus-header">
                            <div className="pf-heading">
                                <span className="pf-intro-mask"><span data-pf-intro-line className="portfolio-eyebrow">{words.eyebrow}</span></span>
                                <h2 id="featured-projects-heading" className="portfolio-title pf-heading-title">
                                    <span className="pf-intro-mask pf-intro-mask--title">
                                        <span data-pf-intro-line>
                                            {lang === 'en' ? <>Featured <em>projects.</em></> : lang === 'es' ? <>Proyectos <em>destacados.</em></> : <>Projetos em <em>destaque.</em></>}
                                        </span>
                                    </span>
                                </h2>
                            </div>
                            <div className="project-focus-count" aria-label={words.current}>
                                <div className="project-focus-count-top">
                                    <span className="project-focus-count-label">{words.caseLabel}</span>
                                    <span className="pf-count-digits">
                                        <span className="sr-only" aria-live="polite">{pad(activeIndex + 1)} / {pad(totalSlides)}</span>
                                        <strong><Odometer stage={stage} count={totalSlides} /></strong>
                                        <span aria-hidden="true"> / {pad(totalSlides)}</span>
                                    </span>
                                </div>
                                <div className="project-focus-progress-rail" aria-hidden="true">
                                    <motion.div style={{ scaleX: countFill }} />
                                </div>
                            </div>
                        </header>

                        <div className="project-focus-gallery">
                            <div
                                onPointerDown={handlePointerDown}
                                className="project-focus-stage pf-stage"
                                data-presenting={presenting}
                                style={{ touchAction: 'pan-y pinch-zoom' }}
                            >
                                <nav className="pf-rail" aria-label={words.nav}>
                                    <span className="pf-rail-track" aria-hidden="true">
                                        <span className="pf-rail-base" />
                                        <motion.span className="pf-rail-fill" style={{ scaleY: railFill }} />
                                        <motion.span className="pf-rail-orb-lane" style={{ y: orbY }}>
                                            <span className="pf-rail-orb" />
                                        </motion.span>
                                    </span>
                                    {flagshipItems.map((item, idx) => (
                                        <RailNode key={item.id} item={item} index={idx} count={totalSlides}
                                            active={idx === activeIndex} stage={stage} onSelect={navigateTo} />
                                    ))}
                                </nav>

                                <div className="pf-media" data-cursor-card="true">
                                    <div className="pf-media-chrome" aria-hidden="true">
                                        <span className="pf-media-dots"><i /><i /><i /></span>
                                        <span className="pf-media-url">
                                            <span className="pf-media-lock">●</span>
                                            <span className="pf-media-host-stack">
                                                {flagshipItems.map((item, idx) => (
                                                    <MaskLine key={item.id} stage={stage} index={idx} line={0} count={totalSlides} className="pf-media-host">
                                                        {hostOf(item.url)}
                                                    </MaskLine>
                                                ))}
                                            </span>
                                        </span>
                                        <span className="pf-media-live"><span />{words.live}</span>
                                    </div>
                                    <div className="pf-media-viewport">
                                        {flagshipItems.map((item, idx) => (
                                            <MediaLayer key={item.id} project={item} index={idx} stage={stage} travel={travel}
                                                active={idx === activeIndex} screenshotLabel={words.screenshot} />
                                        ))}
                                        <span className="pf-media-vignette" aria-hidden="true" />
                                        <span className="pf-media-badge" aria-hidden="true">
                                            <span className="pf-media-badge-dot" />
                                            {activeProject.stat}
                                        </span>
                                    </div>
                                    <span className="portfolio-hud-corners" aria-hidden="true">
                                        <span className="portfolio-hud-corner-bl" />
                                        <span className="portfolio-hud-corner-br" />
                                    </span>
                                    <span className="pf-curtain" aria-hidden="true" />
                                </div>

                                <div className="pf-copy-panel">
                                    <Odometer stage={stage} count={totalSlides} className="pf-ghost-number" />
                                    <div className="pf-copy-stack">
                                        {flagshipItems.map((item, idx) => (
                                            <CaseCopy key={item.id} project={item} index={idx} count={totalSlides}
                                                active={idx === activeIndex} stage={stage} lang={lang} onInspect={handleInspect} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="project-focus-controls">
                            <p className="project-focus-cue">
                                <span className="pf-cue-line" aria-hidden="true" />
                                {presenting ? words.cueScroll : words.cueDrag}
                            </p>
                            <div className="flex items-center gap-2 shrink-0">
                                <MagneticButton onClick={handlePrev} aria-label={words.prev}
                                    data-cursor-morph="true" className="portfolio-control w-10 h-10 transition-colors">
                                    <i aria-hidden="true" className="fas fa-chevron-left text-xs" />
                                </MagneticButton>
                                <MagneticButton onClick={handleNext} aria-label={words.next}
                                    data-cursor-morph="true" className="portfolio-control w-10 h-10 transition-colors">
                                    <i aria-hidden="true" className="fas fa-chevron-right text-xs" />
                                </MagneticButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
