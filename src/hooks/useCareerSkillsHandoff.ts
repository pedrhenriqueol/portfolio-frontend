import { useLayoutEffect, type RefObject } from 'react';
import { useLenis } from '../components/providers/SmoothScrollProvider';
import { setProjectFocus } from '../context/ProjectFocusContext';
import { createSceneStyles, setSceneInert } from '../utils/sceneStyles';

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => value * value * (3 - 2 * value);
const phase = (value: number, from: number, to: number) =>
    smooth(clamp((value - from) / Math.max(0.0001, to - from)));
const px = (value: number) => `${value.toFixed(2)}px`;
/** Raio visual do retículo da estação 2024 (36px / 2). */
const NODE_RADIUS = 18;

interface Point {
    x: number;
    y: number;
}

interface CardGeometry {
    node: HTMLElement;
    body: HTMLElement | null;
    /** Deslocamento horizontal inicial em direção ao eixo central (px). */
    dx: number;
    scaleStart: number;
    /** Centro horizontal natural do card relativo ao `.career-skills-body`. */
    naturalCenterX: number;
    /** Topo natural do card relativo ao `.career-skills-body`. */
    naturalTop: number;
}

type Curve = [Point, Point, Point, Point];

const pointOnCurve = (points: Curve, t: number): Point => {
    const u = 1 - t;
    return {
        x:
            u ** 3 * points[0].x +
            3 * u ** 2 * t * points[1].x +
            3 * u * t ** 2 * points[2].x +
            t ** 3 * points[3].x,
        y:
            u ** 3 * points[0].y +
            3 * u ** 2 * t * points[1].y +
            3 * u * t ** 2 * points[2].y +
            t ** 3 * points[3].y,
    };
};

const curveToPath = (curve: Curve): string => {
    const c = (p: Point) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    return `M ${c(curve[0])} C ${c(curve[1])}, ${c(curve[2])}, ${c(curve[3])}`;
};

function offsetRelativeTo(node: HTMLElement, ancestor: HTMLElement): Point {
    let x = 0;
    let y = 0;
    let current: HTMLElement | null = node;
    while (current && current !== ancestor) {
        x += current.offsetLeft;
        y += current.offsetTop;
        current = current.offsetParent as HTMLElement | null;
    }
    return { x, y };
}

/**
 * Transição cinemática de alto desempenho entre o fim da Experiência Profissional (2024)
 * e a Especialização Técnica, inspirada na coreografia espacial da seção de Contato:
 * - Feixe óptico Bezier contínuo, ancorado ao vivo no nó 2024 (sem cortes no trilho)
 * - Elevação e escala monumental do título "Especialização técnica."
 * - Bifurcação tripla cujos ramos acompanham ao vivo o topo das 3 colunas do Bento Grid
 * - Desdobramento horizontal dos cards a partir do eixo central, sem sobreposição
 * - Fase final de repouso (progresso 0.9 -> 1) para liberar o palco sticky sem solavancos
 */
export function useCareerSkillsHandoff(
    ref: RefObject<HTMLElement | null>,
    mode: 'bento' | '3d',
    language: string
) {
    const lenis = useLenis();

    useLayoutEffect(() => {
        const root = ref.current;
        if (!root) return;

        const introTrack = root.querySelector<HTMLElement>('.career-skills-intro-track');
        const introFrame = root.querySelector<HTMLElement>('.career-skills-intro-frame');
        const heading = root.querySelector<HTMLElement>('.career-skills-heading');
        const headingInner =
            root.querySelector<HTMLElement>('.career-skills-heading-inner') || heading;
        const title = heading?.querySelector<HTMLElement>('h2') || null;
        const body = root.querySelector<HTMLElement>('.career-skills-body');
        const anchor = root.querySelector<HTMLElement>('#habilidades');
        const svg = root.querySelector<SVGSVGElement>('.career-skills-thread');

        const sourceThread = root.querySelector<SVGPathElement>('[data-skills-source-thread]');
        const sourceActive = root.querySelector<SVGPathElement>('[data-skills-source-active]');
        const headingBridge = root.querySelector<SVGPathElement>('[data-skills-heading-bridge]');
        const branchBasePaths = [0, 1, 2].map((i) =>
            root.querySelector<SVGPathElement>(`[data-skills-branch-base="${i}"]`)
        );
        const branchActivePaths = [0, 1, 2].map((i) =>
            root.querySelector<SVGPathElement>(`[data-skills-branch-active="${i}"]`)
        );
        const marker = root.querySelector<SVGCircleElement>('[data-skills-source-marker]');
        const halo = root.querySelector<SVGCircleElement>('[data-skills-source-halo]');
        const branchOrbs = [0, 1, 2].map((i) =>
            root.querySelector<SVGCircleElement>(`[data-skills-branch-orb="${i}"]`)
        );

        if (!introTrack || !introFrame || !heading || !body) return;

        const media = matchMedia(
            '(min-width: 1024px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)'
        );
        const layout = createSceneStyles();
        const motion = createSceneStyles();

        let sourceNode: HTMLElement | null = null;
        let enabled = false;
        let disposed = false;
        let paintFrame = 0;
        let measureFrame = 0;
        let lastMeasureSig = '';

        let zoom = 1;
        let inset = 92;
        let introHeight = 260;
        let introTravel = 220;
        let frameWidth = 1120;
        let topHubPoint: Point = { x: 560, y: -4 };
        let forkOriginPoint: Point = { x: 560, y: 210 };
        const incomingCurve: Curve = [
            { x: 560, y: -140 },
            { x: 560, y: -80 },
            { x: 560, y: -32 },
            { x: 560, y: -4 },
        ];
        let branchCurves: Curve[] = [];
        let cardGeometries: CardGeometry[] = [];

        const clearInteraction = () => {
            setSceneInert(heading, false);
            setSceneInert(body, false);
            setProjectFocus(false, 'skills');
        };

        const paint = () => {
            paintFrame = 0;
            if (disposed || !enabled) return;

            // ── Leituras de geometria agrupadas ANTES de qualquer escrita (zero layout thrashing) ──
            const vh = window.innerHeight;
            const trackRect = introTrack.getBoundingClientRect();
            const frameRect = introFrame.getBoundingClientRect();
            const bodyRect = body.getBoundingClientRect();
            const sourceRect = sourceNode ? sourceNode.getBoundingClientRect() : null;

            const insetPx = inset * zoom;
            const travelPx = Math.max(1, introTravel * zoom);

            // Progresso contínuo: abordagem (45%) + pin sticky (55%), lido da viewport real
            const approach = phase(vh - trackRect.top, vh * 0.12, vh - insetPx);
            const pinProgress = clamp((insetPx - trackRect.top) / travelPx);
            const totalProgress = clamp(approach * 0.45 + pinProgress * 0.55);

            const interacting =
                heading.contains(document.activeElement) || body.contains(document.activeElement);
            const progress = interacting ? Math.max(0.92, totalProgress) : totalProgress;
            const entry = interacting ? 1 : approach;

            setProjectFocus(
                trackRect.top <= vh * 0.78 && pinProgress < 0.9 && !interacting,
                'skills'
            );

            root.dataset.skillsReveal = progress.toFixed(4);

            // 1. Elevação e Escala Monumental do Cabeçalho "Especialização técnica."
            //    Conclui em 0.58 para que o título esteja em repouso bem antes da liberação do sticky.
            const lift = phase(progress, 0.06, 0.58);
            const headingY = (1 - lift) * 30;
            const headingOpacity = clamp(0.15 + entry * 0.85);
            motion.set(heading, 'opacity', headingOpacity.toFixed(4));
            motion.set(heading, 'transform', `translate3d(0, ${px(headingY)}, 0)`);
            if (title) {
                const titleScale = 1.16 - lift * 0.16;
                motion.set(title, 'transform', `scale(${titleScale.toFixed(4)})`);
            }

            // 2. Desdobramento horizontal dos cards a partir do eixo central.
            //    Sem deslocamento vertical nem rotação: a subida natural do fluxo durante o pin
            //    já fornece o movimento vertical; somar dy/rot causava o "solavanco" final.
            //    Toda a coreografia dos cards termina até 0.88 (fase de repouso 0.88 -> 1).
            const cardTx: number[] = [];
            if (cardGeometries.length > 0) {
                cardGeometries.forEach((geom, idx) => {
                    const stagger = idx * 0.03;
                    const cardUnfold = phase(progress, 0.24 + stagger, 0.79 + stagger);
                    const cardEntry = phase(progress, 0.16 + stagger, 0.6 + stagger);
                    const tx = geom.dx * (1 - cardUnfold);
                    const sc = geom.scaleStart + cardUnfold * (1 - geom.scaleStart);
                    cardTx[idx] = tx;

                    motion.set(geom.node, 'opacity', (0.12 + cardEntry * 0.88).toFixed(4));
                    motion.set(
                        geom.node,
                        'transform',
                        `translate3d(${px(tx)}, 0, 0) scale(${sc.toFixed(4)})`
                    );

                    if (geom.body) {
                        const bodyReveal = phase(progress, 0.34 + stagger, 0.82 + stagger);
                        motion.set(geom.body, 'opacity', (0.3 + bodyReveal * 0.7).toFixed(4));
                    }
                });
            } else {
                const bodyGrow = phase(progress, 0.22, 0.84);
                motion.set(body, 'opacity', (0.15 + bodyGrow * 0.85).toFixed(4));
                motion.set(body, 'transform', `scale(${(0.94 + bodyGrow * 0.06).toFixed(4)})`);
            }

            // 3. Feixe Óptico de Entrada ancorado AO VIVO na base do nó 2024 (trilho contínuo, sem corte)
            if (sourceRect) {
                const sourceX = (sourceRect.left + sourceRect.width * 0.5 - frameRect.left) / zoom;
                const sourceCenterY = (sourceRect.top + sourceRect.height * 0.5 - frameRect.top) / zoom;
                const sourceY = Math.min(topHubPoint.y - 24, sourceCenterY + NODE_RADIUS);
                const span = topHubPoint.y - sourceY;

                incomingCurve[0] = { x: sourceX, y: sourceY };
                incomingCurve[1] = { x: sourceX, y: sourceY + span * 0.45 };
                incomingCurve[2] = { x: topHubPoint.x, y: sourceY + span * 0.78 };
                incomingCurve[3] = topHubPoint;

                const dIn = curveToPath(incomingCurve);
                sourceThread?.setAttribute('d', dIn);
                sourceActive?.setAttribute('d', dIn);
            }

            const inDraw = phase(progress, 0.02, 0.46);
            const forkDraw = phase(progress, 0.34, 0.8);
            const inkFade = 1 - phase(progress, 0.9, 1) * 0.55;

            if (sourceThread) {
                motion.set(sourceThread, 'opacity', (entry * 0.45).toFixed(4));
            }
            if (sourceActive) {
                motion.set(sourceActive, 'stroke-dashoffset', (1 - inDraw).toFixed(4));
                motion.set(sourceActive, 'opacity', (inDraw * 0.92).toFixed(4));
            }
            if (headingBridge) {
                motion.set(headingBridge, 'opacity', (forkDraw * inkFade * 0.45).toFixed(4));
            }

            const inDot = pointOnCurve(incomingCurve, inDraw);
            const inOrbOpacity = phase(progress, 0.02, 0.14) * (1 - phase(progress, 0.42, 0.54));
            if (marker) {
                marker.setAttribute('cx', inDot.x.toFixed(1));
                marker.setAttribute('cy', inDot.y.toFixed(1));
                motion.set(marker, 'opacity', inOrbOpacity.toFixed(4));
            }
            if (halo) {
                halo.setAttribute('cx', inDot.x.toFixed(1));
                halo.setAttribute('cy', inDot.y.toFixed(1));
                motion.set(halo, 'opacity', (inOrbOpacity * 0.5).toFixed(4));
            }

            // 4. Bifurcação Tripla: os ramos terminam AO VIVO no topo de cada coluna do Bento Grid,
            //    acompanhando tanto a subida do fluxo durante o pin quanto o desdobramento horizontal.
            const bodyTopInFrame = (bodyRect.top - frameRect.top) / zoom;
            const bodyLeftInFrame = (bodyRect.left - frameRect.left) / zoom;

            branchCurves = [0, 1, 2].map((idx) => {
                const geom = cardGeometries[idx];
                const targetX = geom
                    ? bodyLeftInFrame + geom.naturalCenterX + (cardTx[idx] || 0)
                    : frameWidth * (0.2 + idx * 0.3);
                const targetY = geom
                    ? bodyTopInFrame + geom.naturalTop - 2
                    : bodyTopInFrame - 2;
                const endY = Math.max(forkOriginPoint.y + 12, targetY);
                const midY = forkOriginPoint.y + Math.min(46, (endY - forkOriginPoint.y) * 0.5);
                const curve: Curve = [
                    forkOriginPoint,
                    { x: forkOriginPoint.x, y: midY },
                    { x: targetX, y: midY },
                    { x: targetX, y: endY },
                ];
                return curve;
            });

            const branchOrbOpacity = phase(progress, 0.34, 0.46) * (1 - phase(progress, 0.76, 0.88));
            branchCurves.forEach((curve, idx) => {
                const d = curveToPath(curve);
                const basePath = branchBasePaths[idx];
                const activePath = branchActivePaths[idx];
                const orb = branchOrbs[idx];

                if (basePath) {
                    basePath.setAttribute('d', d);
                    motion.set(basePath, 'opacity', (forkDraw * inkFade * 0.48).toFixed(4));
                }
                if (activePath) {
                    activePath.setAttribute('d', d);
                    motion.set(activePath, 'stroke-dashoffset', (1 - forkDraw).toFixed(4));
                    motion.set(activePath, 'opacity', (forkDraw * inkFade * 0.9).toFixed(4));
                }
                if (orb) {
                    const pt = pointOnCurve(curve, forkDraw);
                    orb.setAttribute('cx', pt.x.toFixed(1));
                    orb.setAttribute('cy', pt.y.toFixed(1));
                    motion.set(orb, 'opacity', branchOrbOpacity.toFixed(4));
                }
            });

            setSceneInert(heading, false);
            setSceneInert(body, false);
        };

        const schedulePaint = () => {
            if (!disposed && !paintFrame) {
                paintFrame = requestAnimationFrame(paint);
            }
        };

        const measure = () => {
            measureFrame = 0;
            if (disposed) return;

            zoom = root.getBoundingClientRect().width / (root.offsetWidth || 1) || 1;
            const vh = window.innerHeight;
            const viewport = vh / zoom;
            const nextEnabled = media.matches;

            const headingH = (headingInner ?? heading).offsetHeight;
            const bodyW = body.offsetWidth;
            const bodyH = body.offsetHeight;
            const sig = `${Math.round(vh)}:${Math.round(bodyW)}:${Math.round(bodyH)}:${nextEnabled}:${mode}:${language}:${Math.round(headingH)}`;

            if (nextEnabled !== enabled) {
                enabled = nextEnabled;
                clearInteraction();
            }
            root.dataset.connected = String(enabled);

            const main = root.closest('main');
            sourceNode = main?.querySelector<HTMLElement>('[data-career-node="2024"]') || null;

            if (!enabled) {
                layout.clear();
                motion.clear();
                delete root.dataset.skillsReveal;
                if (anchor) delete anchor.dataset.navAt;
                return;
            }

            if (sig === lastMeasureSig) {
                paint();
                return;
            }
            lastMeasureSig = sig;

            // Câmara óptica dedicada de 54px abaixo dos botões (sem tocar em nenhum texto)
            const forkChamberH = 54;
            inset = Math.max(88, viewport * 0.085);
            introHeight = headingH + forkChamberH;
            introTravel = Math.min(240, Math.max(150, viewport * 0.28));
            frameWidth = introFrame.clientWidth || root.clientWidth || 1120;

            layout.set(root, '--skills-inset', px(inset));
            layout.set(root, '--skills-intro-height', px(introHeight));
            layout.set(root, '--skills-intro-travel', px(introTravel));

            if (anchor) {
                layout.set(anchor, 'top', px(introTravel * 0.5));
                const trackDocTop = introTrack.getBoundingClientRect().top + window.scrollY;
                anchor.dataset.navAt = String(trackDocTop - inset * zoom + introTravel * zoom * 0.45);
            }

            if (svg) {
                svg.setAttribute('viewBox', `0 0 ${frameWidth} ${introHeight}`);
            }

            const halfX = frameWidth * 0.5;
            topHubPoint = { x: halfX, y: -4 };
            forkOriginPoint = { x: halfX, y: headingH + 8 };

            // Ponte horizontal sutil na origem da câmara óptica (abaixo dos botões)
            if (headingBridge) {
                const bridgeW = Math.min(180, frameWidth * 0.18);
                headingBridge.setAttribute(
                    'd',
                    `M ${(halfX - bridgeW * 0.5).toFixed(1)} ${forkOriginPoint.y.toFixed(1)} L ${(halfX + bridgeW * 0.5).toFixed(1)} ${forkOriginPoint.y.toFixed(1)}`
                );
            }

            // Geometria natural dos cards (transforms não afetam offsetLeft/offsetTop)
            const skillCards = Array.from(body.querySelectorAll<HTMLElement>('[data-skill-card]'));
            const bodyHalf = bodyW * 0.5;

            cardGeometries = skillCards.map((card, idx) => {
                const pos = offsetRelativeTo(card, body);
                const naturalCenterX = pos.x + card.offsetWidth * 0.5;
                return {
                    node: card,
                    body: card.querySelector<HTMLElement>('.portfolio-hud-body'),
                    // Convergência suave (14%) rumo ao eixo: com scale 0.92 os cards nunca se sobrepõem
                    dx: (bodyHalf - naturalCenterX) * 0.14,
                    scaleStart: idx === 3 ? 0.95 : 0.92,
                    naturalCenterX,
                    naturalTop: pos.y,
                };
            });

            paint();
        };

        const scheduleMeasure = () => {
            if (!disposed && !measureFrame) measureFrame = requestAnimationFrame(measure);
        };

        // Observa apenas os contêineres de tamanho intrínseco (nunca o track/frame sticky)
        const observer = new ResizeObserver(scheduleMeasure);
        if (headingInner) observer.observe(headingInner);
        observer.observe(body);

        if (lenis) lenis.on('scroll', schedulePaint);
        window.addEventListener('scroll', schedulePaint, { passive: true });
        window.addEventListener('resize', scheduleMeasure);
        root.addEventListener('focusin', schedulePaint);
        root.addEventListener('focusout', schedulePaint);
        media.addEventListener('change', scheduleMeasure);
        document.fonts.ready.then(scheduleMeasure);
        measure();

        return () => {
            disposed = true;
            cancelAnimationFrame(paintFrame);
            cancelAnimationFrame(measureFrame);
            observer.disconnect();
            if (lenis) lenis.off('scroll', schedulePaint);
            window.removeEventListener('scroll', schedulePaint);
            window.removeEventListener('resize', scheduleMeasure);
            root.removeEventListener('focusin', schedulePaint);
            root.removeEventListener('focusout', schedulePaint);
            media.removeEventListener('change', scheduleMeasure);
            clearInteraction();
            delete root.dataset.connected;
            delete root.dataset.skillsReveal;
            if (anchor) delete anchor.dataset.navAt;
            layout.clear();
            motion.clear();
        };
    }, [ref, mode, language, lenis]);
}
