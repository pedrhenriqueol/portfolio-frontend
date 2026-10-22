import { useLayoutEffect, type RefObject } from 'react';
import { useLenis } from '../components/providers/SmoothScrollProvider';
import { setProjectFocus } from '../context/ProjectFocusContext';
import { createSceneStyles, setSceneInert } from '../utils/sceneStyles';

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (n: number) => n * n * (3 - 2 * n);
const phase = (value: number, from: number, to: number) =>
    smooth(clamp((value - from) / Math.max(0.0001, to - from)));

export interface CareerRailTelemetry {
    beamProgress: number;
    activeStationIndex: number;
    stationIgnitions: [number, number, number];
    stationFocus: [number, number, number];
}

/**
 * Orquestrador Unificado de Entrada Cinemática ("Piscas" do Sobre Mim -> Experiência)
 * + Trilho Mestre de Alta Precisão (2026 -> 2025 -> 2024).
 *
 * Arquitetura blindada contra loops de ResizeObserver e dessincronização de scroll:
 * - Mede apenas os contêineres internos de movimento (height: auto), nunca o track/frame sticky.
 * - Calcula todo o progresso em tempo real via getBoundingClientRect() relativo à viewport.
 * - O feixe vertical inferior nasce abaixo das 4 métricas executivas, sem cruzar títulos ou textos.
 */
export function useCareerMasterScene(
    ref: RefObject<HTMLElement | null>,
    onTelemetry?: (telemetry: CareerRailTelemetry) => void,
) {
    const lenis = useLenis();

    useLayoutEffect(() => {
        const root = ref.current;
        if (!root) return;

        // ── Camada 1: Palco Sticky de Entrada (3 Cards "Piscas" -> Abertura da Experiência) ──
        const entranceTrack = root.querySelector<HTMLElement>('.career-entrance-track');
        const entranceFrame = root.querySelector<HTMLElement>('.career-entrance-frame');
        const entranceAnchor = root.querySelector<HTMLElement>('.career-scene-anchor');
        const entranceSvg = root.querySelector<SVGSVGElement>('.career-entrance-thread');
        const pillarsLayout = root.querySelector<HTMLElement>('.career-pillars-layout');
        const openingLayout = root.querySelector<HTMLElement>('.career-opening-layout');
        const pillarsMotion = root.querySelector<HTMLElement>('.career-pillars-motion') || pillarsLayout;
        const openingMotion = root.querySelector<HTMLElement>('.career-opening-motion') || openingLayout;
        const pillarsTail = pillarsLayout?.querySelector<HTMLElement>('.chapter-tail') || null;
        const pillarCards = pillarsTail
            ? Array.from(pillarsTail.children).filter((el): el is HTMLElement => el instanceof HTMLElement)
            : [];

        const pillarBasePaths = [0, 1, 2]
            .map((i) => entranceSvg?.querySelector<SVGPathElement>(`[data-pillar-base="${i}"]`) || null);
        const pillarActivePaths = [0, 1, 2]
            .map((i) => entranceSvg?.querySelector<SVGPathElement>(`[data-pillar-active="${i}"]`) || null);
        const spineBasePath = entranceSvg?.querySelector<SVGPathElement>('[data-entrance-spine-base]') || null;
        const spineActivePath = entranceSvg?.querySelector<SVGPathElement>('[data-entrance-spine-active]') || null;
        const entranceTraveller = entranceSvg?.querySelector<SVGCircleElement>('[data-entrance-traveller]') || null;
        const entranceTravellerHalo = entranceSvg?.querySelector<SVGCircleElement>('[data-entrance-traveller-halo]') || null;

        const heading = root.querySelector<HTMLElement>('.career-heading-block');
        const headingTitle = heading?.querySelector<HTMLElement>('h2') || null;
        const metricCards = Array.from(root.querySelectorAll<HTMLElement>('[data-career-metric]'));

        // ── Camada 2: Espinha Dorsal Unificada (2026 -> 2025 -> 2024) ──
        const masterTimeline = root.querySelector<HTMLElement>('.career-timeline-master');
        const beamFill = root.querySelector<HTMLElement>('[data-career-beam-fill]');
        const traveller = root.querySelector<HTMLElement>('[data-career-traveller]');
        const travellerYear = root.querySelector<HTMLElement>('[data-career-traveller-year]');

        const years = ['2026', '2025', '2024'] as const;
        const rows = years
            .map((y) => root.querySelector<HTMLElement>(`[data-career-row="${y}"]`))
            .filter((el): el is HTMLElement => el !== null);
        const nodes = years
            .map((y) => root.querySelector<HTMLElement>(`[data-career-node="${y}"]`))
            .filter((el): el is HTMLElement => el !== null);
        const yearCols = years
            .map((y) => root.querySelector<HTMLElement>(`[data-career-year-col="${y}"]`))
            .filter((el): el is HTMLElement => el !== null);
        const cardCols = years
            .map((y) => root.querySelector<HTMLElement>(`[data-career-card-col="${y}"]`))
            .filter((el): el is HTMLElement => el !== null);
        const branches = years
            .map((y) => root.querySelector<HTMLElement>(`[data-career-branch="${y}"]`))
            .filter((el): el is HTMLElement => el !== null);

        const desktopMedia = matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)');
        const timelineMedia = matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
        const layout = createSceneStyles();
        const motion = createSceneStyles();

        let entranceEnabled = false;
        let timelineEnabled = false;
        let zoom = 1;
        let frameWidth = 1200;
        let frameHeight = 420;
        let entranceInset = 96;
        let entranceTravel = 360;
        let nexusY = 200;
        let spineStartY = 380;
        let metricOffsetsX: number[] = [0, 0, 0, 0];

        let localNodeY: [number, number, number] = [0, 500, 1000];
        let nodeRatios: [number, number, number] = [0, 0.5, 1];
        let frame = 0;
        let measureFrame = 0;
        let disposed = false;
        let lastActiveYear = '';
        let lastMeasureSignature = '';

        const offsetTopRelativeTo = (el: HTMLElement, ancestor: HTMLElement): number => {
            let top = 0;
            let curr: HTMLElement | null = el;
            while (curr && curr !== ancestor) {
                top += curr.offsetTop;
                curr = curr.offsetParent as HTMLElement | null;
            }
            return top;
        };

        const offsetLeftRelativeTo = (el: HTMLElement, ancestor: HTMLElement): number => {
            let left = 0;
            let curr: HTMLElement | null = el;
            while (curr && curr !== ancestor) {
                left += curr.offsetLeft;
                curr = curr.offsetParent as HTMLElement | null;
            }
            return left;
        };

        const paint = () => {
            frame = 0;
            if (disposed) return;

            const vh = window.innerHeight;
            const readingViewportY = vh * 0.56;

            if (!timelineEnabled) {
                motion.clear();
                if (pillarsLayout) setSceneInert(pillarsLayout, false);
                if (openingLayout) setSceneInert(openingLayout, false);
                setProjectFocus(false, 'career');
                return;
            }

            // ══════════════════════════════════════════════════════════════════
            // PARTE A: TRANSIÇÃO CINEMÁTICA DOS 3 CARDS "PISCAS" -> EXPERIÊNCIA
            // ══════════════════════════════════════════════════════════════════
            let entranceProgress = 1;
            if (entranceEnabled && entranceTrack && pillarsLayout && openingLayout) {
                const trackRect = entranceTrack.getBoundingClientRect();
                const insetPx = entranceInset * zoom;
                const travelPx = Math.max(1, entranceTravel * zoom);
                const rawP = clamp((insetPx - trackRect.top) / travelPx);

                const openingHasFocus = openingLayout.contains(document.activeElement);
                const pillarsHasFocus = pillarsLayout.contains(document.activeElement);
                entranceProgress = openingHasFocus ? Math.max(0.88, rawP) : pillarsHasFocus ? 0 : rawP;

                // 1. Saída em profundidade e abertura lateral dos 3 Cards "Piscas"
                const middleExit = phase(entranceProgress, 0.0, 0.36);
                const lateralExit = phase(entranceProgress, 0.04, 0.44);

                pillarCards.forEach((card, idx) => {
                    if (idx === 1) {
                        const ty = -middleExit * 48;
                        const sc = 1 - middleExit * 0.14;
                        motion.set(
                            card,
                            'transform',
                            `translate3d(0, ${ty.toFixed(2)}px, 0) scale(${sc.toFixed(4)})`
                        );
                        motion.set(card, 'opacity', (1 - middleExit).toFixed(4));
                    } else {
                        const dir = idx === 0 ? -1 : 1;
                        const tx = dir * lateralExit * (frameWidth * 0.14);
                        const ty = -lateralExit * 22;
                        const rot = dir * lateralExit * 2.4;
                        const sc = 1 - lateralExit * 0.08;
                        motion.set(
                            card,
                            'transform',
                            `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(4)})`
                        );
                        motion.set(card, 'opacity', (1 - lateralExit).toFixed(4));
                    }
                });
                setSceneInert(pillarsLayout, lateralExit >= 0.92);

                // 2. Elevação e Escala do Título "Experiência Profissional" (Padrão Contato)
                const headerEnter = phase(entranceProgress, 0.16, 0.56);
                const headerLift = phase(entranceProgress, 0.2, 0.66);
                if (heading) {
                    const hY = (1 - headerLift) * 44;
                    motion.set(heading, 'opacity', headerEnter.toFixed(4));
                    motion.set(heading, 'transform', `translate3d(0, ${hY.toFixed(2)}px, 0)`);
                }
                if (headingTitle) {
                    const tScale = 1.18 - headerLift * 0.18;
                    motion.set(headingTitle, 'transform', `scale(${tScale.toFixed(4)})`);
                }

                // 3. Desdobramento Espacial das 4 Métricas Executivas a partir do Centro
                const metricsEnter = phase(entranceProgress, 0.3, 0.68);
                const metricsUnfold = phase(entranceProgress, 0.34, 0.84);
                metricCards.forEach((card, idx) => {
                    const dx = (metricOffsetsX[idx] || 0) * (1 - metricsUnfold) * 0.52;
                    const dy = (1 - metricsUnfold) * 30 + Math.abs(idx - 1.5) * (1 - metricsUnfold) * 8;
                    const rot = (idx - 1.5) * -2.0 * (1 - metricsUnfold);
                    const sc = 0.86 + metricsUnfold * 0.14;
                    motion.set(card, 'opacity', metricsEnter.toFixed(4));
                    motion.set(
                        card,
                        'transform',
                        `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(4)})`
                    );
                });
                setSceneInert(openingLayout, headerEnter < 0.85 && !openingHasFocus);

                // 4. Feixes Curvos Superiores (convergência dos 3 Pilares) + Conector Inferior Limpo (abaixo das métricas)
                const convergeDraw = phase(entranceProgress, 0.02, 0.36);
                const convergeFade = 1 - phase(entranceProgress, 0.28, 0.52);
                pillarActivePaths.forEach((path) => {
                    if (!path) return;
                    motion.set(path, 'stroke-dashoffset', (1 - convergeDraw).toFixed(4));
                    motion.set(path, 'opacity', (convergeDraw * convergeFade).toFixed(4));
                });
                pillarBasePaths.forEach((path) => {
                    if (!path) return;
                    motion.set(path, 'opacity', (convergeFade * 0.55).toFixed(4));
                });

                // O conector vertical inferior começa estritamente ABAIXO das 4 métricas (spineStartY),
                // nunca cruzando o título "Experiência Profissional" nem o subtítulo.
                const spineDraw = phase(entranceProgress, 0.46, 0.96);
                const continuationY = spineStartY + 84;
                const half = frameWidth / 2;
                const spineD = `M ${half.toFixed(1)} ${spineStartY.toFixed(1)} L ${half.toFixed(1)} ${continuationY.toFixed(1)}`;
                if (spineBasePath) {
                    spineBasePath.setAttribute('d', spineD);
                    motion.set(spineBasePath, 'opacity', (spineDraw * 0.55).toFixed(4));
                }
                if (spineActivePath) {
                    spineActivePath.setAttribute('d', spineD);
                    motion.set(spineActivePath, 'stroke-dashoffset', (1 - spineDraw).toFixed(4));
                    motion.set(spineActivePath, 'opacity', spineDraw.toFixed(4));
                }

                const orbY = spineStartY + (continuationY - spineStartY) * spineDraw;
                const orbOpacity =
                    phase(entranceProgress, 0.46, 0.62) * (1 - phase(entranceProgress, 0.88, 0.99));
                if (entranceTraveller) {
                    entranceTraveller.setAttribute('cx', half.toFixed(1));
                    entranceTraveller.setAttribute('cy', orbY.toFixed(1));
                    motion.set(entranceTraveller, 'opacity', orbOpacity.toFixed(4));
                }
                if (entranceTravellerHalo) {
                    entranceTravellerHalo.setAttribute('cx', half.toFixed(1));
                    entranceTravellerHalo.setAttribute('cy', orbY.toFixed(1));
                    motion.set(entranceTravellerHalo, 'opacity', (orbOpacity * 0.5).toFixed(4));
                }
            }

            // ══════════════════════════════════════════════════════════════════
            // PARTE B: TRILHO MESTRE UNIFICADO & COREOGRAFIA SEQUENCIAL (2026 -> 2025 -> 2024)
            // ══════════════════════════════════════════════════════════════════
            if (!masterTimeline) return;
            const masterRect = masterTimeline.getBoundingClientRect();
            const stationViewportY: [number, number, number] = [
                masterRect.top + localNodeY[0] * zoom,
                masterRect.top + localNodeY[1] * zoom,
                masterRect.top + localNodeY[2] * zoom,
            ];

            const y0 = stationViewportY[0];
            const y1 = stationViewportY[1];
            const y2 = stationViewportY[2];
            const r1 = nodeRatios[1];

            const isSectionFocused = y0 <= vh * 0.85 && y2 >= vh * 0.15;
            setProjectFocus(isSectionFocused, 'career');

            let beamProgress = 0;
            if (readingViewportY <= y0) {
                beamProgress = 0;
            } else if (readingViewportY <= y1) {
                const t01 = clamp((readingViewportY - y0) / Math.max(1, y1 - y0));
                beamProgress = t01 * r1;
            } else if (readingViewportY <= y2) {
                const t12 = clamp((readingViewportY - y1) / Math.max(1, y2 - y1));
                beamProgress = r1 + t12 * (1 - r1);
            } else {
                beamProgress = 1;
            }

            if (beamFill) {
                motion.set(beamFill, 'transform', `scaleY(${beamProgress.toFixed(5)})`);
            }
            if (traveller) {
                motion.set(traveller, 'top', `${(beamProgress * 100).toFixed(3)}%`);
                const travellerEnter = phase(readingViewportY - y0, -vh * 0.24, -vh * 0.02);
                motion.set(traveller, 'opacity', travellerEnter.toFixed(4));
                motion.set(
                    traveller,
                    'transform',
                    `translate3d(-50%, -50%, 0) scale(${(0.78 + travellerEnter * 0.22).toFixed(4)})`
                );
            }

            const ignitions: [number, number, number] = [0, 0, 0];
            const focuses: [number, number, number] = [0, 0, 0];

            rows.forEach((row, idx) => {
                const stationY = stationViewportY[idx];
                const stationRatio = nodeRatios[idx];
                const delta = readingViewportY - stationY;

                const ignition =
                    idx === 0
                        ? phase(delta, -vh * 0.22, vh * 0.02)
                        : phase(beamProgress, stationRatio - 0.04, stationRatio + 0.01);
                ignitions[idx] = ignition;

                const yearReveal = phase(delta, -vh * 0.46, -vh * 0.06);
                const cardReveal = phase(delta, -vh * 0.4, vh * 0.02);

                const enterFocus = phase(delta, -vh * 0.3, -vh * 0.02);
                const nextDelta = idx < 2 ? readingViewportY - stationViewportY[idx + 1] : delta - vh * 0.65;
                const exitFocus =
                    idx < 2
                        ? 1 - phase(nextDelta, -vh * 0.24, vh * 0.04) * 0.52
                        : 1 - phase(delta, vh * 0.45, vh * 0.78) * 0.38;

                const isHoveredOrFocused = row.matches(':hover') || row.contains(document.activeElement);
                const focusWeight = isHoveredOrFocused ? 1 : clamp(enterFocus * exitFocus);
                focuses[idx] = focusWeight;

                row.dataset.careerActive = focusWeight > 0.62 ? 'true' : 'false';
                motion.set(row, '--station-ignition', ignition.toFixed(4));
                motion.set(row, '--station-focus', focusWeight.toFixed(4));

                const branch = branches[idx];
                if (branch) {
                    const branchScale = clamp(ignition * (0.38 + focusWeight * 0.62));
                    motion.set(branch, 'transform', `translateY(-50%) scaleX(${branchScale.toFixed(4)})`);
                    motion.set(branch, 'opacity', (ignition * (0.42 + focusWeight * 0.58)).toFixed(4));
                }

                const node = nodes[idx];
                if (node) {
                    const nodeScale = 0.88 + ignition * 0.12 + (focusWeight > 0.6 ? 0.08 : 0);
                    motion.set(node, 'transform', `translate3d(-50%, -50%, 0) scale(${nodeScale.toFixed(4)})`);
                }

                const yearDir = idx === 1 ? 1 : -1;
                const cardDir = idx === 1 ? -1 : 1;
                const passedRecede = delta > vh * 0.22 && !isHoveredOrFocused ? 1 - exitFocus : 0;

                const yearCol = yearCols[idx];
                if (yearCol) {
                    const yTx = (1 - yearReveal) * (yearDir * 38);
                    const yTy = (1 - yearReveal) * 28 - passedRecede * 12;
                    const yScale = (0.91 + yearReveal * 0.09) * (1 - passedRecede * 0.04);
                    const yOpacity = clamp((0.16 + yearReveal * 0.84) * (1 - passedRecede * 0.38));
                    motion.set(
                        yearCol,
                        'transform',
                        `translate3d(${yTx.toFixed(2)}px, ${yTy.toFixed(2)}px, 0) scale(${yScale.toFixed(4)})`
                    );
                    motion.set(yearCol, 'opacity', yOpacity.toFixed(4));
                }

                const cardCol = cardCols[idx];
                if (cardCol) {
                    const cTx = (1 - cardReveal) * (cardDir * 44);
                    const cTy = (1 - cardReveal) * 34 - passedRecede * 14;
                    const cScale = (0.92 + cardReveal * 0.08) * (1 - passedRecede * 0.035);
                    const cOpacity = clamp((0.16 + cardReveal * 0.84) * (1 - passedRecede * 0.36));
                    motion.set(
                        cardCol,
                        'transform',
                        `translate3d(${cTx.toFixed(2)}px, ${cTy.toFixed(2)}px, 0) scale(${cScale.toFixed(4)})`
                    );
                    motion.set(cardCol, 'opacity', cOpacity.toFixed(4));
                }
            });

            const activeIdx =
                beamProgress >= nodeRatios[2] - 0.08
                    ? 2
                    : beamProgress >= nodeRatios[1] - 0.06
                    ? 1
                    : 0;
            const currentYearStr = years[activeIdx];
            if (travellerYear && currentYearStr !== lastActiveYear) {
                lastActiveYear = currentYearStr;
                travellerYear.textContent = currentYearStr;
            }

            onTelemetry?.({
                beamProgress,
                activeStationIndex: activeIdx,
                stationIgnitions: ignitions,
                stationFocus: focuses,
            });
        };

        const schedulePaint = () => {
            if (!disposed && !frame) frame = requestAnimationFrame(paint);
        };

        const measure = () => {
            measureFrame = 0;
            if (disposed) return;

            const rootRect = root.getBoundingClientRect();
            zoom = rootRect.width / (root.offsetWidth || 1) || 1;
            const vh = window.innerHeight;
            const viewport = vh / zoom;

            timelineEnabled = timelineMedia.matches;
            entranceEnabled = Boolean(
                desktopMedia.matches && entranceTrack && entranceFrame && pillarsLayout && openingLayout
            );

            const pillarsH = pillarsMotion ? pillarsMotion.offsetHeight : 0;
            const openingH = openingMotion ? openingMotion.offsetHeight : 0;
            const rowHeights = rows.map((r) => r.offsetHeight).join(',');
            const sig = `${Math.round(vh)}:${Math.round(root.offsetWidth)}:${timelineEnabled}:${entranceEnabled}:${Math.round(pillarsH)}:${Math.round(openingH)}:${rowHeights}`;

            root.dataset.careerScene = timelineEnabled ? 'active' : 'native';
            if (entranceTrack) {
                entranceTrack.dataset.scene = entranceEnabled ? 'connected' : 'flow';
            }

            if (sig === lastMeasureSignature) {
                paint();
                return;
            }
            lastMeasureSignature = sig;

            if (entranceEnabled && entranceTrack && entranceFrame && pillarsLayout && openingLayout) {
                entranceInset = Math.max(92, viewport * 0.085);
                frameHeight = Math.max(pillarsH, openingH) + 20;
                frameWidth = entranceFrame.offsetWidth || 1120;
                entranceTravel = Math.min(440, Math.max(300, viewport * 0.52));

                layout.set(entranceTrack, '--career-frame-height', `${frameHeight.toFixed(1)}px`);
                layout.set(entranceTrack, '--career-travel', `${entranceTravel.toFixed(1)}px`);
                layout.set(entranceTrack, '--career-inset', `${entranceInset.toFixed(1)}px`);

                if (entranceAnchor) {
                    layout.set(entranceAnchor, 'top', `${entranceTravel.toFixed(1)}px`);
                    layout.set(entranceAnchor, 'scroll-margin-top', `${entranceInset.toFixed(1)}px`);
                    const trackDocTop = entranceTrack.getBoundingClientRect().top + window.scrollY;
                    entranceAnchor.dataset.navAt = String(
                        trackDocTop - entranceInset * zoom + entranceTravel * zoom * 0.42
                    );
                }

                const half = frameWidth / 2;
                nexusY = Math.max(120, pillarsH - 12);
                spineStartY = openingH + 10;

                if (entranceSvg) {
                    entranceSvg.setAttribute('viewBox', `0 0 ${frameWidth} ${frameHeight}`);
                }

                pillarCards.forEach((card, idx) => {
                    const cardCenterX =
                        offsetLeftRelativeTo(card, entranceFrame) + card.offsetWidth * 0.5;
                    const cardBottomY = Math.min(
                        pillarsH,
                        offsetTopRelativeTo(card, entranceFrame) + card.offsetHeight * 0.88
                    );
                    const cpY1 = cardBottomY + (nexusY - cardBottomY) * 0.55;
                    const cpY2 = cardBottomY + (nexusY - cardBottomY) * 0.85;
                    const d = `M ${cardCenterX.toFixed(1)} ${cardBottomY.toFixed(1)} C ${cardCenterX.toFixed(1)} ${cpY1.toFixed(1)}, ${half.toFixed(1)} ${cpY2.toFixed(1)}, ${half.toFixed(1)} ${nexusY.toFixed(1)}`;
                    pillarBasePaths[idx]?.setAttribute('d', d);
                    pillarActivePaths[idx]?.setAttribute('d', d);
                });

                metricOffsetsX = metricCards.map((card) => {
                    const cardCenter =
                        offsetLeftRelativeTo(card, openingLayout) + card.offsetWidth * 0.5;
                    return half - cardCenter;
                });
            }

            if (masterTimeline && rows.length === 3 && nodes.length === 3) {
                localNodeY = nodes.map((_, idx) => {
                    const row = rows[idx];
                    const rowTop = offsetTopRelativeTo(row, masterTimeline);
                    return rowTop + row.offsetHeight * 0.5;
                }) as [number, number, number];

                const railTop = localNodeY[0];
                const railSpan = Math.max(1, localNodeY[2] - localNodeY[0]);
                const ratio2025 = clamp((localNodeY[1] - localNodeY[0]) / railSpan);

                nodeRatios = [0, ratio2025, 1];

                layout.set(masterTimeline, '--career-rail-top', `${railTop.toFixed(1)}px`);
                layout.set(masterTimeline, '--career-rail-height', `${railSpan.toFixed(1)}px`);
                layout.set(masterTimeline, '--career-node-2025-pct', `${(ratio2025 * 100).toFixed(3)}%`);
            }

            paint();
        };

        const scheduleMeasure = () => {
            if (!disposed && !measureFrame) measureFrame = requestAnimationFrame(measure);
        };

        // Observa apenas os contêineres de conteúdo intrínseco (nunca o track/frame sticky)
        const observer = new ResizeObserver(scheduleMeasure);
        if (pillarsMotion) observer.observe(pillarsMotion);
        if (openingMotion) observer.observe(openingMotion);
        rows.forEach((r) => observer.observe(r));

        if (lenis) lenis.on('scroll', schedulePaint);
        window.addEventListener('scroll', schedulePaint, { passive: true });
        window.addEventListener('resize', scheduleMeasure);
        root.addEventListener('focusin', schedulePaint);
        root.addEventListener('focusout', schedulePaint);
        rows.forEach((r) => {
            r.addEventListener('pointerenter', schedulePaint, { passive: true });
            r.addEventListener('pointerleave', schedulePaint, { passive: true });
        });
        desktopMedia.addEventListener('change', scheduleMeasure);
        timelineMedia.addEventListener('change', scheduleMeasure);
        document.fonts.ready.then(scheduleMeasure);
        measure();

        return () => {
            disposed = true;
            cancelAnimationFrame(frame);
            cancelAnimationFrame(measureFrame);
            observer.disconnect();
            if (lenis) lenis.off('scroll', schedulePaint);
            window.removeEventListener('scroll', schedulePaint);
            window.removeEventListener('resize', scheduleMeasure);
            root.removeEventListener('focusin', schedulePaint);
            root.removeEventListener('focusout', schedulePaint);
            rows.forEach((r) => {
                r.removeEventListener('pointerenter', schedulePaint);
                r.removeEventListener('pointerleave', schedulePaint);
            });
            desktopMedia.removeEventListener('change', scheduleMeasure);
            timelineMedia.removeEventListener('change', scheduleMeasure);
            if (pillarsLayout) setSceneInert(pillarsLayout, false);
            if (openingLayout) setSceneInert(openingLayout, false);
            if (entranceTrack) delete entranceTrack.dataset.scene;
            if (entranceAnchor) delete entranceAnchor.dataset.navAt;
            delete root.dataset.careerScene;
            layout.clear();
            motion.clear();
            setProjectFocus(false, 'career');
        };
    }, [ref, onTelemetry, lenis]);
}
