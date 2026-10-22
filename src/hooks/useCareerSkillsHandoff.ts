import { useLayoutEffect, type RefObject } from 'react';
import { useLenis } from '../components/providers/SmoothScrollProvider';
import { setProjectFocus } from '../context/ProjectFocusContext';
import { createSceneStyles, setSceneInert } from '../utils/sceneStyles';

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => value * value * (3 - 2 * value);
const phase = (value: number, from: number, to: number) =>
    smooth(clamp((value - from) / Math.max(0.0001, to - from)));
const px = (value: number) => `${value.toFixed(2)}px`;

interface Point {
    x: number;
    y: number;
}

interface CardGeometry {
    node: HTMLElement;
    body: HTMLElement | null;
    dx: number;
    dy: number;
    rot: number;
    scaleStart: number;
    topAnchorX: number;
}

const pointOnCurve = (points: [Point, Point, Point, Point], t: number): Point => {
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

function offsetLeftRelativeTo(node: HTMLElement, ancestor: HTMLElement): number {
    let x = 0;
    let current: HTMLElement | null = node;
    while (current && current !== ancestor) {
        x += current.offsetLeft;
        current = current.offsetParent as HTMLElement | null;
    }
    return x;
}

/**
 * Transição cinemática de alto desempenho entre o fim da Experiência Profissional (2024)
 * e a Especialização Técnica, inspirada na coreografia espacial da seção de Contato:
 * - Recuo em profundidade do último marco da carreira (2024)
 * - Feixe óptico Bezier + Orb luminoso viajante do fim do trilho 2024 até o topo do cabeçalho
 * - Elevação e escala monumental do título "Especialização técnica."
 * - Câmara óptica de bifurcação tripla (abaixo dos botões, sem cruzar textos)
 * - Desdobramento espacial dos 4 cards do eixo central para o Bento Grid sem sobrepor o título
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

        let outgoing: HTMLElement | null = null;
        let careerRail: HTMLElement | null = null;
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
        let incomingCurve: [Point, Point, Point, Point] = [
            { x: 560, y: -140 },
            { x: 560, y: -80 },
            { x: 560, y: -32 },
            { x: 560, y: -4 },
        ];
        let branchCurves: [Point, Point, Point, Point][] = [];
        let cardGeometries: CardGeometry[] = [];

        const clearInteraction = () => {
            setSceneInert(heading, false);
            setSceneInert(body, false);
            setProjectFocus(false, 'skills');
        };

        const paint = () => {
            paintFrame = 0;
            if (disposed || !enabled) return;

            const vh = window.innerHeight;
            const trackRect = introTrack.getBoundingClientRect();
            const insetPx = inset * zoom;
            const travelPx = Math.max(1, introTravel * zoom);

            // Progresso contínuo da abordagem e do pin a partir da posição real na viewport
            const approach = phase(vh - trackRect.top, vh * 0.12, vh - insetPx);
            const pinProgress = clamp((insetPx - trackRect.top) / travelPx);
            const totalProgress = clamp(approach * 0.45 + pinProgress * 0.55);

            const interacting =
                heading.contains(document.activeElement) || body.contains(document.activeElement);
            const progress = interacting ? Math.max(0.92, totalProgress) : totalProgress;
            const entry = interacting ? 1 : approach;

            // 1. Recuo suave em profundidade do marco final 2024 da seção anterior
            if (outgoing) {
                const outgoingFocused = outgoing.contains(document.activeElement);
                const exit = outgoingFocused ? 0 : phase(progress, 0.04, 0.54);
                motion.set(outgoing, 'opacity', (1 - exit * 0.72).toFixed(4));
                motion.set(
                    outgoing,
                    'transform',
                    `translate3d(0, ${px(-exit * 34)}, 0) scale(${(1 - exit * 0.035).toFixed(4)})`
                );
            }

            setProjectFocus(
                trackRect.top <= vh * 0.78 && pinProgress < 0.9 && !interacting,
                'skills'
            );

            root.dataset.skillsReveal = progress.toFixed(4);

            // 2. Elevação e Escala Monumental do Cabeçalho "Especialização técnica."
            const lift = phase(progress, 0.06, 0.58);
            const headingY = (1 - lift) * 32;
            const headingOpacity = clamp(0.15 + entry * 0.85);
            motion.set(heading, 'opacity', headingOpacity.toFixed(4));
            motion.set(heading, 'transform', `translate3d(0, ${px(headingY)}, 0)`);
            if (title) {
                const titleScale = 1.18 - lift * 0.18;
                motion.set(title, 'transform', `scale(${titleScale.toFixed(4)})`);
            }

            // 3. Desdobramento Espacial dos 4 Cards do Bento Grid (sempre abaixo do cabeçalho, dy >= 0)
            if (cardGeometries.length > 0) {
                cardGeometries.forEach((geom, idx) => {
                    const stagger = idx * 0.045;
                    const cardUnfold = phase(progress, 0.22 + stagger, 0.86 + stagger);
                    const cardEntry = phase(progress, 0.14 + stagger, 0.62 + stagger);
                    const tx = geom.dx * (1 - cardUnfold);
                    const ty = geom.dy * (1 - cardUnfold);
                    const rot = geom.rot * (1 - cardUnfold);
                    const sc = geom.scaleStart + cardUnfold * (1 - geom.scaleStart);

                    motion.set(geom.node, 'opacity', (0.2 + cardEntry * 0.8).toFixed(4));
                    motion.set(
                        geom.node,
                        'transform',
                        `translate3d(${px(tx)}, ${px(ty)}, 0) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(4)})`
                    );

                    if (geom.body) {
                        const bodyReveal = phase(progress, 0.32 + stagger, 0.88 + stagger);
                        motion.set(geom.body, 'opacity', (0.35 + bodyReveal * 0.65).toFixed(4));
                        motion.set(
                            geom.body,
                            'transform',
                            `translate3d(0, ${px((1 - bodyReveal) * 10)}, 0)`
                        );
                    }
                });
            } else {
                const bodyGrow = phase(progress, 0.2, 0.82);
                motion.set(body, 'opacity', (0.2 + bodyGrow * 0.8).toFixed(4));
                motion.set(
                    body,
                    'transform',
                    `translate3d(0, ${px((1 - bodyGrow) * 32)}, 0) scale(${(0.92 + bodyGrow * 0.08).toFixed(4)})`
                );
            }

            // 4. Feixe Óptico de Entrada (do fim do trilho 2024 até o topo do eyebrow, sem cruzar textos)
            if (careerRail) {
                const railRect = careerRail.getBoundingClientRect();
                const frameRect = introFrame.getBoundingClientRect();
                const sourceX = (railRect.left + railRect.width * 0.5 - frameRect.left) / zoom;
                const rawSourceY = (railRect.bottom - frameRect.top) / zoom;
                const sourceY = Math.max(-220, Math.min(topHubPoint.y - 28, rawSourceY));

                incomingCurve[0] = { x: sourceX, y: sourceY };
                incomingCurve[1] = {
                    x: sourceX,
                    y: sourceY + (topHubPoint.y - sourceY) * 0.45,
                };
                incomingCurve[2] = {
                    x: topHubPoint.x,
                    y: sourceY + (topHubPoint.y - sourceY) * 0.78,
                };
                incomingCurve[3] = topHubPoint;

                const c = (p: Point) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
                const dIn = `M ${c(incomingCurve[0])} C ${c(incomingCurve[1])}, ${c(incomingCurve[2])}, ${c(incomingCurve[3])}`;
                sourceThread?.setAttribute('d', dIn);
                sourceActive?.setAttribute('d', dIn);
            }

            const inDraw = phase(progress, 0.02, 0.46);
            const forkDraw = phase(progress, 0.34, 0.86);
            const inkFade = 1 - phase(progress, 0.86, 0.99) * 0.65;

            if (sourceThread) {
                motion.set(sourceThread, 'opacity', (entry * inkFade * 0.45).toFixed(4));
            }
            if (sourceActive) {
                motion.set(sourceActive, 'stroke-dashoffset', (1 - inDraw).toFixed(4));
                motion.set(sourceActive, 'opacity', (inDraw * inkFade * 0.92).toFixed(4));
            }
            if (headingBridge) {
                motion.set(headingBridge, 'opacity', (forkDraw * inkFade * 0.45).toFixed(4));
            }

            const inDot = pointOnCurve(incomingCurve, inDraw);
            const inOrbOpacity =
                phase(progress, 0.02, 0.16) * (1 - phase(progress, 0.42, 0.56));
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

            // 5. Bifurcação Tripla na Câmara Óptica Inferior + 3 Orbs distribuindo para as colunas
            branchCurves.forEach((curve, idx) => {
                const basePath = branchBasePaths[idx];
                const activePath = branchActivePaths[idx];
                const orb = branchOrbs[idx];

                if (basePath) {
                    motion.set(basePath, 'opacity', (forkDraw * inkFade * 0.48).toFixed(4));
                }
                if (activePath) {
                    motion.set(activePath, 'stroke-dashoffset', (1 - forkDraw).toFixed(4));
                    motion.set(activePath, 'opacity', (forkDraw * inkFade * 0.9).toFixed(4));
                }
                if (orb) {
                    const pt = pointOnCurve(curve, forkDraw);
                    const branchOrbOpacity =
                        phase(progress, 0.34, 0.48) * (1 - phase(progress, 0.82, 0.96));
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

            const headingH = headingInner ? headingInner.offsetHeight : heading.offsetHeight;
            const bodyW = body.offsetWidth;
            const sig = `${Math.round(vh)}:${Math.round(bodyW)}:${nextEnabled}:${mode}:${language}:${Math.round(headingH)}`;

            if (nextEnabled !== enabled) {
                enabled = nextEnabled;
                clearInteraction();
            }
            root.dataset.connected = String(enabled);

            const main = root.closest('main');
            const row2024 = main?.querySelector<HTMLElement>('[data-career-row="2024"]') || null;
            outgoing = row2024?.parentElement || row2024;
            careerRail = main?.querySelector<HTMLElement>('.career-master-rail') || null;

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

            const c = (p: Point) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;

            // Ponte horizontal sutil na origem da câmara óptica (abaixo dos botões)
            if (headingBridge) {
                const bridgeW = Math.min(180, frameWidth * 0.18);
                headingBridge.setAttribute(
                    'd',
                    `M ${(halfX - bridgeW * 0.5).toFixed(1)} ${forkOriginPoint.y.toFixed(1)} L ${(halfX + bridgeW * 0.5).toFixed(1)} ${forkOriginPoint.y.toFixed(1)}`
                );
            }

            // Medição natural dos 4 Cards do Bento Grid para o Desdobramento Horizontal/Descendente
            const skillCards = Array.from(body.querySelectorAll<HTMLElement>('[data-skill-card]'));
            const rotations = [-2.6, 0, 2.6, -1.2];

            cardGeometries = skillCards.map((card, idx) => {
                const left = offsetLeftRelativeTo(card, body);
                const cardCenterX = left + card.offsetWidth * 0.5;
                return {
                    node: card,
                    body: card.querySelector<HTMLElement>('.portfolio-hud-body'),
                    // Converge horizontalmente em direção ao eixo central e apenas para BAIXO (+dy),
                    // garantindo matematicamente ZERO sobreposição com o cabeçalho ou botões!
                    dx: (halfX - cardCenterX) * 0.38,
                    dy: 26 + idx * 6,
                    rot: rotations[idx] ?? 0,
                    scaleStart: idx === 3 ? 0.94 : 0.9,
                    topAnchorX: cardCenterX,
                };
            });

            // 3 ramos Bezier na câmara óptica conectando o centro abaixo dos botões às 3 colunas do Bento Grid
            const targetXs =
                cardGeometries.length >= 3
                    ? [
                          cardGeometries[0].topAnchorX,
                          cardGeometries[1].topAnchorX,
                          cardGeometries[2].topAnchorX,
                      ]
                    : [frameWidth * 0.2, halfX, frameWidth * 0.8];

            const forkEndY = introHeight - 2;
            const midY = forkOriginPoint.y + (forkEndY - forkOriginPoint.y) * 0.54;

            branchCurves = targetXs.map((tx) => {
                const curve: [Point, Point, Point, Point] = [
                    forkOriginPoint,
                    { x: forkOriginPoint.x, y: midY },
                    { x: tx, y: midY },
                    { x: tx, y: forkEndY },
                ];
                return curve;
            });

            branchCurves.forEach((curve, idx) => {
                const d = `M ${c(curve[0])} C ${c(curve[1])}, ${c(curve[2])}, ${c(curve[3])}`;
                branchBasePaths[idx]?.setAttribute('d', d);
                branchActivePaths[idx]?.setAttribute('d', d);
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
