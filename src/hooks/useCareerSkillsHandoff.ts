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
    topAnchorY: number;
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
 * - Recuo em profundidade do último marco da carreira (2024)
 * - Feixe óptico Bezier + Orb luminoso viajante conectando o trilho de carreira ao palco
 * - Elevação e escala monumental do título "Especialização técnica."
 * - Bifurcação de condutores SVG e desdobramento espacial dos 4 cards do centro para o Bento Grid
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

        const frameEl = root.querySelector<HTMLElement>('.career-skills-frame');
        const content = root.querySelector<HTMLElement>('.career-skills-content');
        const heading = root.querySelector<HTMLElement>('.career-skills-heading');
        const title = heading?.querySelector<HTMLElement>('h2') || null;
        const body = root.querySelector<HTMLElement>('.career-skills-body');
        const anchor = root.querySelector<HTMLElement>('#habilidades');
        const svg = root.querySelector<SVGSVGElement>('.career-skills-thread');
        const sourceThread = root.querySelector<SVGPathElement>('[data-skills-source-thread]');
        const sourceActive = root.querySelector<SVGPathElement>('[data-skills-source-active]');
        const headingBridge = root.querySelector<SVGPathElement>('[data-skills-heading-bridge]');
        const guideBase = root.querySelector<SVGPathElement>('[data-skills-guide-base]');
        const guideActive = root.querySelector<SVGPathElement>('[data-skills-guide-active]');
        const marker = root.querySelector<SVGCircleElement>('[data-skills-source-marker]');
        const halo = root.querySelector<SVGCircleElement>('[data-skills-source-halo]');

        if (!frameEl || !content || !heading || !body) return;

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

        let zoom = 1;
        let start = 0;
        let run = 1;
        let finish = 0;
        let frameWidth = 1120;
        let frameHeight = 680;
        let contentTop = 16;
        let overflowY = 0;
        let headingStartY = 110;
        let nexusPoint: Point = { x: 560, y: 210 };
        let incomingCurve: [Point, Point, Point, Point] = [
            { x: 560, y: -140 },
            { x: 560, y: -40 },
            { x: 560, y: 80 },
            { x: 560, y: 210 },
        ];
        let primaryCardCurve: [Point, Point, Point, Point] = [
            { x: 560, y: 210 },
            { x: 560, y: 250 },
            { x: 560, y: 270 },
            { x: 560, y: 300 },
        ];
        let cardGeometries: CardGeometry[] = [];

        let scrollPosition = lenis ? lenis.scroll : window.scrollY;
        let lastStateKey = NaN;

        const clearInteraction = () => {
            setSceneInert(heading, false);
            setSceneInert(body, false);
            setProjectFocus(false, 'skills');
        };

        const paintOutgoing = () => {
            if (!enabled || !outgoing) return;
            const exit = phase(scrollPosition, start - window.innerHeight * 0.38, start + window.innerHeight * 0.04);
            const focused = outgoing.contains(document.activeElement);
            motion.set(outgoing, 'opacity', (focused ? 1 : 1 - exit * 0.82).toFixed(4));
            motion.set(
                outgoing,
                'transform',
                `translate3d(0, ${px(focused ? 0 : -exit * 44)}, 0) scale(${(focused ? 1 : 1 - exit * 0.035).toFixed(4)})`
            );
        };

        const paint = () => {
            paintFrame = 0;
            if (disposed || !enabled) return;

            const vh = window.innerHeight;
            const actual = clamp((scrollPosition - start) / Math.max(1, run));
            const approach = phase(scrollPosition, start - vh * 0.34, start + vh * 0.02);
            const interacting =
                heading.contains(document.activeElement) || body.contains(document.activeElement);
            const progress = interacting ? Math.max(0.88, actual) : actual;
            const entry = interacting ? 1 : approach;

            setProjectFocus(
                scrollPosition >= start - vh * 0.36 && actual < 0.86 && !interacting,
                'skills'
            );

            const stateKey = progress + entry * 10;
            if (stateKey === lastStateKey) return;
            lastStateKey = stateKey;

            root.dataset.skillsReveal = progress.toFixed(4);

            // ── Fases coreográficas (Padrão ContactStory) ──
            const lift = phase(progress, 0.08, 0.48);
            const unfold = phase(progress, 0.18, 0.74);
            const reveal = phase(progress, 0.34, 0.82);
            const settleScroll = overflowY > 0 ? phase(progress, 0.52, 0.95) : 0;
            const travel = phase(progress, 0.0, 0.72);
            const branchDraw = phase(progress, 0.22, 0.72);
            const ink = (1 - phase(progress, 0.74, 0.92) * 0.72) * entry;

            // Deslocamento vertical suave caso o Bento Grid exceda a altura da viewport em telas menores
            const currentScrollOffset = -overflowY * settleScroll;
            motion.set(content, 'transform', `translate3d(0, ${px(currentScrollOffset)}, 0)`);

            // 1. Elevação e Escala Monumental do Cabeçalho "Especialização técnica."
            const currentHeadingY = headingStartY * (1 - lift) + (1 - entry) * 28;
            motion.set(heading, 'opacity', entry.toFixed(4));
            motion.set(heading, 'transform', `translate3d(0, ${px(currentHeadingY)}, 0)`);
            if (title) {
                const titleScale = 1.24 - lift * 0.24;
                motion.set(title, 'transform', `scale(${titleScale.toFixed(4)})`);
            }

            // 2. Desdobramento Espacial dos 4 Cards de Especialidade (ou Visualizador 3D)
            if (cardGeometries.length > 0) {
                cardGeometries.forEach((geom, idx) => {
                    const stagger = idx * 0.035;
                    const cardUnfold = phase(progress, 0.16 + stagger, 0.72 + stagger);
                    const cardEntry = phase(progress, 0.08 + stagger, 0.44 + stagger) * entry;
                    const tx = geom.dx * (1 - cardUnfold);
                    const ty = geom.dy * (1 - cardUnfold) + (1 - entry) * 24;
                    const rot = geom.rot * (1 - cardUnfold);
                    const sc = geom.scaleStart + cardUnfold * (1 - geom.scaleStart);

                    motion.set(geom.node, 'opacity', (0.14 + cardEntry * 0.86).toFixed(4));
                    motion.set(
                        geom.node,
                        'transform',
                        `translate3d(${px(tx)}, ${px(ty)}, 0) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(4)})`
                    );

                    if (geom.body) {
                        const bodyReveal = phase(progress, 0.34 + stagger, 0.78 + stagger);
                        motion.set(geom.body, 'opacity', (0.25 + bodyReveal * 0.75).toFixed(4));
                        motion.set(
                            geom.body,
                            'transform',
                            `translate3d(0, ${px((1 - bodyReveal) * 14)}, 0)`
                        );
                    }
                });
            } else {
                const bodyGrow = phase(progress, 0.18, 0.72);
                motion.set(body, 'opacity', (0.15 + entry * 0.85).toFixed(4));
                motion.set(
                    body,
                    'transform',
                    `translate3d(0, ${px((1 - bodyGrow) * 52)}, 0) scale(${(0.86 + bodyGrow * 0.14).toFixed(4)})`
                );
            }

            // 3. Atualização Dinâmica da Origem do Feixe Conectado ao Fim do Trilho 2024
            if (careerRail && frameEl) {
                const railRect = careerRail.getBoundingClientRect();
                const frameRect = frameEl.getBoundingClientRect();
                const sourceX = (railRect.left + railRect.width * 0.5 - frameRect.left) / zoom;
                const rawSourceY = (railRect.bottom - frameRect.top) / zoom;
                const sourceY = Math.max(-220, Math.min(nexusPoint.y - 40, rawSourceY));

                incomingCurve[0] = { x: sourceX, y: sourceY };
                incomingCurve[1] = {
                    x: sourceX,
                    y: sourceY + (nexusPoint.y - sourceY) * 0.45,
                };
                incomingCurve[2] = {
                    x: nexusPoint.x,
                    y: sourceY + (nexusPoint.y - sourceY) * 0.78,
                };
                incomingCurve[3] = nexusPoint;

                const c = (p: Point) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
                const dIn = `M ${c(incomingCurve[0])} C ${c(incomingCurve[1])}, ${c(incomingCurve[2])}, ${c(incomingCurve[3])}`;
                sourceThread?.setAttribute('d', dIn);
                sourceActive?.setAttribute('d', dIn);
            }

            // 4. Animação do Feixe Principal, Bifurcação para os Cards e Orb Luminoso Viajante
            const inDraw = phase(travel, 0.0, 0.52);
            if (sourceActive) {
                motion.set(sourceActive, 'stroke-dashoffset', (1 - inDraw).toFixed(4));
                motion.set(sourceActive, 'opacity', (ink * 0.95).toFixed(4));
            }
            if (sourceThread) {
                motion.set(sourceThread, 'opacity', (ink * 0.45).toFixed(4));
            }
            if (headingBridge) {
                motion.set(headingBridge, 'opacity', (ink * 0.4).toFixed(4));
            }
            if (guideBase) {
                motion.set(guideBase, 'opacity', (branchDraw * ink * 0.5).toFixed(4));
            }
            if (guideActive) {
                motion.set(guideActive, 'stroke-dashoffset', (1 - branchDraw).toFixed(4));
                motion.set(guideActive, 'opacity', (branchDraw * ink * 0.92).toFixed(4));
            }

            const dot =
                travel < 0.52
                    ? pointOnCurve(incomingCurve, travel / 0.52)
                    : pointOnCurve(primaryCardCurve, (travel - 0.52) / 0.48);

            const orbOpacity = clamp(entry * (1 - phase(progress, 0.72, 0.88)));
            if (marker) {
                marker.setAttribute('cx', dot.x.toFixed(1));
                marker.setAttribute('cy', (dot.y + currentScrollOffset).toFixed(1));
                motion.set(marker, 'opacity', orbOpacity.toFixed(4));
            }
            if (halo) {
                halo.setAttribute('cx', dot.x.toFixed(1));
                halo.setAttribute('cy', (dot.y + currentScrollOffset).toFixed(1));
                motion.set(halo, 'opacity', (orbOpacity * 0.55).toFixed(4));
            }

            setSceneInert(heading, lift < 0.85 && !interacting);
            setSceneInert(body, reveal < 0.88 && !interacting);
        };

        const schedulePaint = () => {
            if (!disposed && !paintFrame) {
                paintFrame = requestAnimationFrame(() => {
                    paintOutgoing();
                    paint();
                });
            }
        };

        const onFocusIn = (event: FocusEvent) => {
            if (!enabled) return;
            const target = event.target as Node;
            if ((heading.contains(target) || body.contains(target)) && scrollPosition < finish) {
                if (lenis) lenis.scrollTo(finish, { immediate: true, force: true });
                else window.scrollTo({ top: finish, behavior: 'instant' });
                scrollPosition = finish;
            }
            schedulePaint();
        };

        const measure = () => {
            measureFrame = 0;
            if (disposed) return;
            cancelAnimationFrame(paintFrame);
            paintFrame = 0;

            zoom = root.getBoundingClientRect().width / root.offsetWidth || 1;
            const vh = window.innerHeight;
            const viewport = vh / zoom;
            const inset = Math.max(88, viewport * 0.085);
            const available = Math.max(420, viewport - inset - 24);

            // Reset temporário de transformações para medir geometria natural exata
            motion.clear();

            const next = media.matches;
            if (next !== enabled) {
                enabled = next;
                clearInteraction();
            }

            root.dataset.connected = String(enabled);
            scrollPosition = lenis ? lenis.scroll : window.scrollY;

            const main = root.closest('main');
            const row2024 = main?.querySelector<HTMLElement>('[data-career-row="2024"]') || null;
            outgoing = row2024?.parentElement || row2024;
            careerRail = main?.querySelector<HTMLElement>('.career-master-rail') || null;

            if (!enabled) {
                layout.clear();
                delete root.dataset.skillsReveal;
                if (anchor) delete anchor.dataset.navAt;
                return;
            }

            const contentHeight = content.offsetHeight;
            overflowY = Math.max(0, contentHeight - available + 20);
            contentTop = overflowY > 0 ? 8 : Math.max(8, (available - contentHeight) * 0.35);
            frameHeight = available;
            frameWidth = frameEl.clientWidth || content.clientWidth || 1120;
            run = vh * 1.32 + overflowY * zoom;

            layout.set(root, '--skills-inset', px(inset));
            layout.set(root, '--skills-frame-height', px(frameHeight));
            layout.set(root, '--skills-run', px(run / zoom));
            layout.set(root, '--skills-content-top', px(contentTop));

            if (anchor) {
                layout.set(anchor, 'top', px((run * 0.82) / zoom));
            }

            start = root.getBoundingClientRect().top + window.scrollY - inset * zoom;
            finish = start + run * 0.86;
            if (anchor) {
                anchor.dataset.navAt = String(start + run * 0.45);
            }

            if (svg) {
                svg.setAttribute('viewBox', `0 0 ${frameWidth} ${frameHeight}`);
            }

            const halfX = frameWidth * 0.5;
            const headingH = heading.offsetHeight;
            headingStartY = Math.max(56, Math.min(140, frameHeight * 0.2 - contentTop));

            // Nexus central logo abaixo do seletor de modos do cabeçalho
            nexusPoint = {
                x: halfX,
                y: contentTop + headingH + 10,
            };

            incomingCurve = [
                { x: halfX, y: -140 },
                { x: halfX, y: -40 },
                { x: halfX, y: nexusPoint.y * 0.55 },
                nexusPoint,
            ];

            const c = (p: Point) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
            const dIn = `M ${c(incomingCurve[0])} C ${c(incomingCurve[1])}, ${c(incomingCurve[2])}, ${c(incomingCurve[3])}`;
            sourceThread?.setAttribute('d', dIn);
            sourceActive?.setAttribute('d', dIn);

            // Medição dos 4 Cards do Bento Grid para o Desdobramento Espacial
            const skillCards = Array.from(body.querySelectorAll<HTMLElement>('[data-skill-card]'));
            const deckCenter: Point = {
                x: halfX,
                y: contentTop + headingH + 155,
            };

            const rotations = [-4.2, 0, 4.2, -1.8];
            cardGeometries = skillCards.map((card, idx) => {
                const pos = offsetRelativeTo(card, content);
                const cardCenterX = pos.x + card.offsetWidth * 0.5;
                const cardCenterY = contentTop + pos.y + card.offsetHeight * 0.5;
                const topAnchorX = pos.x + card.offsetWidth * 0.5;
                const topAnchorY = contentTop + pos.y + 4;

                return {
                    node: card,
                    body: card.querySelector<HTMLElement>('.portfolio-hud-body'),
                    dx: (deckCenter.x - cardCenterX) * 0.68,
                    dy: (deckCenter.y - cardCenterY) * 0.56 + 32,
                    rot: rotations[idx] ?? 0,
                    scaleStart: idx === 3 ? 0.88 : 0.82,
                    topAnchorX,
                    topAnchorY,
                };
            });

            // Construção dos feixes distribuidores (do Nexus Central até o topo dos Cards)
            if (cardGeometries.length > 0) {
                const topRowCards = cardGeometries.slice(0, 3);
                const segments: string[] = [];

                topRowCards.forEach((geom) => {
                    const midY = nexusPoint.y + (geom.topAnchorY - nexusPoint.y) * 0.52;
                    segments.push(
                        `M ${c(nexusPoint)} C ${nexusPoint.x.toFixed(1)} ${midY.toFixed(1)}, ${geom.topAnchorX.toFixed(1)} ${midY.toFixed(1)}, ${geom.topAnchorX.toFixed(1)} ${geom.topAnchorY.toFixed(1)}`
                    );
                });

                if (cardGeometries[3]) {
                    const bottomCard = cardGeometries[3];
                    const midCard = cardGeometries[1] || cardGeometries[0];
                    const startBottomY = midCard.topAnchorY + midCard.node.offsetHeight - 4;
                    segments.push(
                        `M ${halfX.toFixed(1)} ${startBottomY.toFixed(1)} L ${bottomCard.topAnchorX.toFixed(1)} ${bottomCard.topAnchorY.toFixed(1)}`
                    );
                }

                const guidePathString = segments.join(' ');
                guideBase?.setAttribute('d', guidePathString);
                guideActive?.setAttribute('d', guidePathString);

                const targetCard = cardGeometries[1] || cardGeometries[0];
                const targetPoint = { x: targetCard.topAnchorX, y: targetCard.topAnchorY };
                const midY = nexusPoint.y + (targetPoint.y - nexusPoint.y) * 0.5;
                primaryCardCurve = [
                    nexusPoint,
                    { x: nexusPoint.x, y: midY },
                    { x: targetPoint.x, y: midY },
                    targetPoint,
                ];
            } else {
                const bodyTopY = contentTop + headingH + 36;
                const dSingle = `M ${c(nexusPoint)} L ${halfX.toFixed(1)} ${bodyTopY.toFixed(1)}`;
                guideBase?.setAttribute('d', dSingle);
                guideActive?.setAttribute('d', dSingle);
                primaryCardCurve = [
                    nexusPoint,
                    { x: halfX, y: nexusPoint.y + 12 },
                    { x: halfX, y: bodyTopY - 12 },
                    { x: halfX, y: bodyTopY },
                ];
            }

            // Linha sutil horizontal de ancoragem no cabeçalho
            if (headingBridge) {
                const bridgeW = Math.min(220, frameWidth * 0.22);
                const bridgeY = nexusPoint.y;
                headingBridge.setAttribute(
                    'd',
                    `M ${(halfX - bridgeW * 0.5).toFixed(1)} ${bridgeY.toFixed(1)} L ${(halfX + bridgeW * 0.5).toFixed(1)} ${bridgeY.toFixed(1)}`
                );
            }

            lastStateKey = NaN;
            paintOutgoing();
            paint();
        };

        const scheduleMeasure = () => {
            if (!disposed && !measureFrame) measureFrame = requestAnimationFrame(measure);
        };
        const onNativeScroll = () => {
            scrollPosition = window.scrollY;
            schedulePaint();
        };
        const onLenisScroll = (instance: { scroll: number }) => {
            scrollPosition = instance.scroll;
            schedulePaint();
        };

        const observer = new ResizeObserver(scheduleMeasure);
        [root, frameEl, content, heading, body].forEach((node) => observer.observe(node));
        const main = root.closest('main');
        if (main) observer.observe(main);

        if (lenis) lenis.on('scroll', onLenisScroll);
        else window.addEventListener('scroll', onNativeScroll, { passive: true });
        window.addEventListener('resize', scheduleMeasure);
        root.addEventListener('focusin', onFocusIn);
        root.addEventListener('focusout', schedulePaint);
        media.addEventListener('change', scheduleMeasure);
        document.fonts.ready.then(scheduleMeasure);
        measure();

        return () => {
            disposed = true;
            cancelAnimationFrame(paintFrame);
            cancelAnimationFrame(measureFrame);
            observer.disconnect();
            if (lenis) lenis.off('scroll', onLenisScroll);
            else window.removeEventListener('scroll', onNativeScroll);
            window.removeEventListener('resize', scheduleMeasure);
            root.removeEventListener('focusin', onFocusIn);
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
