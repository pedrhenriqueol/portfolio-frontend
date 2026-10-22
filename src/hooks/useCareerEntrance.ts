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
        let entranceTravel = 0;
        let entranceStart = 0;
        let entranceDistance = 1;
        let nexusY = 180;
        let metricOffsetsX: number[] = [0, 0, 0, 0];

        let sectionFocusStart = 0;
        let sectionFocusEnd = 0;
        let nodeDocY: [number, number, number] = [0, 500, 1000];
        let nodeRatios: [number, number, number] = [0, 0.5, 1];
        let scrollPosition = lenis ? lenis.scroll : window.scrollY;
        let frame = 0;
        let measureFrame = 0;
        let disposed = false;
        let lastScroll = NaN;
        let lastActiveYear = '';

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
            if (scrollPosition === lastScroll) return;
            lastScroll = scrollPosition;

            const vh = window.innerHeight;
            const readingLine = scrollPosition + vh * 0.54;

            const isSectionFocused =
                timelineEnabled && scrollPosition >= sectionFocusStart && scrollPosition <= sectionFocusEnd;
            setProjectFocus(isSectionFocused, 'career');

            if (!timelineEnabled) {
                motion.clear();
                if (pillarsLayout) setSceneInert(pillarsLayout, false);
                if (openingLayout) setSceneInert(openingLayout, false);
                return;
            }

            // ══════════════════════════════════════════════════════════════════
            // PARTE A: TRANSIÇÃO CINEMÁTICA DOS 3 CARDS "PISCAS" -> EXPERIÊNCIA
            // ══════════════════════════════════════════════════════════════════
            let entranceProgress = 1;
            if (entranceEnabled && entranceTrack && pillarsLayout && openingLayout) {
                const rawP = clamp((scrollPosition - entranceStart) / entranceDistance);
                const openingHasFocus = openingLayout.contains(document.activeElement);
                const pillarsHasFocus = pillarsLayout.contains(document.activeElement);
                entranceProgress = openingHasFocus ? Math.max(0.88, rawP) : pillarsHasFocus ? 0 : rawP;

                // 1. Saída em profundidade e abertura lateral dos 3 Cards "Piscas"
                //    Card do meio sobe e recua primeiro; laterais abrem e inclinam sutilmente
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

                // 2. Elevação e Escala do Título "Trajetória Profissional" (Padrão Contato)
                const headerEnter = phase(entranceProgress, 0.14, 0.56);
                const headerLift = phase(entranceProgress, 0.18, 0.64);
                if (heading) {
                    const hY = (1 - headerLift) * 52;
                    motion.set(heading, 'opacity', headerEnter.toFixed(4));
                    motion.set(heading, 'transform', `translate3d(0, ${hY.toFixed(2)}px, 0)`);
                }
                if (headingTitle) {
                    const tScale = 1.2 - headerLift * 0.2;
                    motion.set(headingTitle, 'transform', `scale(${tScale.toFixed(4)})`);
                }

                // 3. Desdobramento Espacial das 4 Métricas Executivas a partir do Centro
                const metricsEnter = phase(entranceProgress, 0.3, 0.68);
                const metricsUnfold = phase(entranceProgress, 0.34, 0.84);
                metricCards.forEach((card, idx) => {
                    const dx = (metricOffsetsX[idx] || 0) * (1 - metricsUnfold) * 0.55;
                    const dy = (1 - metricsUnfold) * 34 + Math.abs(idx - 1.5) * (1 - metricsUnfold) * 10;
                    const rot = (idx - 1.5) * -2.2 * (1 - metricsUnfold);
                    const sc = 0.84 + metricsUnfold * 0.16;
                    motion.set(card, 'opacity', metricsEnter.toFixed(4));
                    motion.set(
                        card,
                        'transform',
                        `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(4)})`
                    );
                });
                setSceneInert(openingLayout, headerEnter < 0.85 && !openingHasFocus);

                // 4. Feixes Curvos de Energia dos 3 Cards + Feixe Conector Central + Orb Viajante
                const convergeDraw = phase(entranceProgress, 0.02, 0.46);
                const convergeFade = 1 - phase(entranceProgress, 0.48, 0.78);
                pillarActivePaths.forEach((path) => {
                    if (!path) return;
                    motion.set(path, 'stroke-dashoffset', (1 - convergeDraw).toFixed(4));
                    motion.set(path, 'opacity', (convergeDraw * convergeFade).toFixed(4));
                });
                pillarBasePaths.forEach((path) => {
                    if (!path) return;
                    motion.set(path, 'opacity', (convergeFade * 0.65).toFixed(4));
                });

                const spineDraw = phase(entranceProgress, 0.28, 0.92);
                const continuationY = frameHeight + (1 - entranceProgress) * entranceTravel + 24;
                const half = frameWidth / 2;
                const spineD = `M ${half.toFixed(1)} ${nexusY.toFixed(1)} L ${half.toFixed(1)} ${continuationY.toFixed(1)}`;
                if (spineBasePath) spineBasePath.setAttribute('d', spineD);
                if (spineActivePath) {
                    spineActivePath.setAttribute('d', spineD);
                    motion.set(spineActivePath, 'stroke-dashoffset', (1 - spineDraw).toFixed(4));
                    motion.set(spineActivePath, 'opacity', spineDraw.toFixed(4));
                }

                // Posição contínua do Orb Viajante durante a transição de entrada
                const orbY = nexusY + (continuationY - nexusY) * spineDraw;
                const orbOpacity =
                    phase(entranceProgress, 0.04, 0.2) * (1 - phase(entranceProgress, 0.88, 0.99));
                if (entranceTraveller) {
                    entranceTraveller.setAttribute('cx', half.toFixed(1));
                    entranceTraveller.setAttribute('cy', orbY.toFixed(1));
                    motion.set(entranceTraveller, 'opacity', orbOpacity.toFixed(4));
                }
                if (entranceTravellerHalo) {
                    entranceTravellerHalo.setAttribute('cx', half.toFixed(1));
                    entranceTravellerHalo.setAttribute('cy', orbY.toFixed(1));
                    motion.set(entranceTravellerHalo, 'opacity', (orbOpacity * 0.55).toFixed(4));
                }
            }

            // ══════════════════════════════════════════════════════════════════
            // PARTE B: TRILHO MESTRE UNIFICADO & COREOGRAFIA SEQUENCIAL (2026 -> 2025 -> 2024)
            // ══════════════════════════════════════════════════════════════════
            const y0 = nodeDocY[0];
            const y1 = nodeDocY[1];
            const y2 = nodeDocY[2];
            const r1 = nodeRatios[1];

            let beamProgress = 0;
            if (readingLine <= y0) {
                beamProgress = 0;
            } else if (readingLine <= y1) {
                const t01 = clamp((readingLine - y0) / Math.max(1, y1 - y0));
                beamProgress = t01 * r1;
            } else if (readingLine <= y2) {
                const t12 = clamp((readingLine - y1) / Math.max(1, y2 - y1));
                beamProgress = r1 + t12 * (1 - r1);
            } else {
                beamProgress = 1;
            }

            if (beamFill) {
                motion.set(beamFill, 'transform', `scaleY(${beamProgress.toFixed(5)})`);
            }
            if (traveller) {
                motion.set(traveller, 'top', `${(beamProgress * 100).toFixed(3)}%`);
                const travellerEnter = phase(readingLine, y0 - vh * 0.22, y0 - vh * 0.02);
                motion.set(traveller, 'opacity', travellerEnter.toFixed(4));
                motion.set(
                    traveller,
                    'transform',
                    `translate3d(-50%, -50%, 0) scale(${(0.75 + travellerEnter * 0.25).toFixed(4)})`
                );
            }

            const ignitions: [number, number, number] = [0, 0, 0];
            const focuses: [number, number, number] = [0, 0, 0];

            rows.forEach((row, idx) => {
                const stationY = nodeDocY[idx];
                const stationRatio = nodeRatios[idx];

                const ignition =
                    idx === 0
                        ? phase(readingLine, y0 - vh * 0.18, y0 + vh * 0.02)
                        : phase(beamProgress, stationRatio - 0.035, stationRatio + 0.01);
                ignitions[idx] = ignition;

                const yearReveal = phase(readingLine, stationY - vh * 0.44, stationY - vh * 0.06);
                const cardReveal = phase(readingLine, stationY - vh * 0.36, stationY + vh * 0.02);

                const distFromReading = readingLine - stationY;
                const enterFocus = phase(readingLine, stationY - vh * 0.28, stationY - vh * 0.02);
                const nextStationY = idx < 2 ? nodeDocY[idx + 1] : stationY + vh * 0.65;
                const exitFocus =
                    idx < 2
                        ? 1 - phase(readingLine, nextStationY - vh * 0.24, nextStationY + vh * 0.04) * 0.56
                        : 1 - phase(readingLine, stationY + vh * 0.45, stationY + vh * 0.78) * 0.42;

                const isHoveredOrFocused = row.matches(':hover') || row.contains(document.activeElement);
                const focusWeight = isHoveredOrFocused ? 1 : clamp(enterFocus * exitFocus);
                focuses[idx] = focusWeight;

                row.dataset.careerActive = focusWeight > 0.65 ? 'true' : 'false';
                motion.set(row, '--station-ignition', ignition.toFixed(4));
                motion.set(row, '--station-focus', focusWeight.toFixed(4));

                const branch = branches[idx];
                if (branch) {
                    const branchScale = clamp(ignition * (0.35 + focusWeight * 0.65));
                    motion.set(branch, 'transform', `translateY(-50%) scaleX(${branchScale.toFixed(4)})`);
                    motion.set(branch, 'opacity', (ignition * (0.4 + focusWeight * 0.6)).toFixed(4));
                }

                const node = nodes[idx];
                if (node) {
                    const nodeScale = 0.88 + ignition * 0.12 + (focusWeight > 0.6 ? 0.08 : 0);
                    motion.set(node, 'transform', `translate3d(-50%, -50%, 0) scale(${nodeScale.toFixed(4)})`);
                }

                const yearDir = idx === 1 ? 1 : -1;
                const cardDir = idx === 1 ? -1 : 1;
                const passedRecede = distFromReading > vh * 0.22 && !isHoveredOrFocused ? 1 - exitFocus : 0;

                const yearCol = yearCols[idx];
                if (yearCol) {
                    const yTx = (1 - yearReveal) * (yearDir * 42);
                    const yTy = (1 - yearReveal) * 32 - passedRecede * 14;
                    const yScale = (0.9 + yearReveal * 0.1) * (1 - passedRecede * 0.045);
                    const yOpacity = clamp(yearReveal * (1 - passedRecede * 0.42));
                    motion.set(
                        yearCol,
                        'transform',
                        `translate3d(${yTx.toFixed(2)}px, ${yTy.toFixed(2)}px, 0) scale(${yScale.toFixed(4)})`
                    );
                    motion.set(yearCol, 'opacity', yOpacity.toFixed(4));
                }

                const cardCol = cardCols[idx];
                if (cardCol) {
                    const cTx = (1 - cardReveal) * (cardDir * 48);
                    const cTy = (1 - cardReveal) * 38 - passedRecede * 16;
                    const cScale = (0.92 + cardReveal * 0.08) * (1 - passedRecede * 0.04);
                    const cOpacity = clamp(cardReveal * (1 - passedRecede * 0.4));
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
            zoom = rootRect.width / root.offsetWidth || 1;
            const vh = window.innerHeight;
            const viewport = vh / zoom;
            scrollPosition = lenis ? lenis.scroll : window.scrollY;

            timelineEnabled = timelineMedia.matches;
            entranceEnabled = Boolean(
                desktopMedia.matches && entranceTrack && entranceFrame && pillarsLayout && openingLayout
            );

            root.dataset.careerScene = timelineEnabled ? 'active' : 'native';
            if (entranceTrack) {
                entranceTrack.dataset.scene = entranceEnabled ? 'connected' : 'flow';
            }

            if (entranceEnabled && entranceTrack && entranceFrame && pillarsLayout && openingLayout) {
                const inset = Math.max(96, viewport * 0.09);
                const pillarsH = pillarsLayout.offsetHeight;
                const openingH = openingLayout.offsetHeight;
                frameHeight = Math.max(pillarsH, openingH) + 24;
                frameWidth = entranceFrame.offsetWidth || 1120;
                entranceTravel = viewport * 0.66;

                layout.set(entranceTrack, '--career-frame-height', `${frameHeight.toFixed(1)}px`);
                layout.set(entranceTrack, '--career-travel', `${entranceTravel.toFixed(1)}px`);
                layout.set(entranceTrack, '--career-inset', `${inset.toFixed(1)}px`);

                if (entranceAnchor) {
                    layout.set(entranceAnchor, 'top', `${entranceTravel.toFixed(1)}px`);
                    layout.set(entranceAnchor, 'scroll-margin-top', `${inset.toFixed(1)}px`);
                }

                const trackRect = entranceTrack.getBoundingClientRect();
                const trackTopDoc = trackRect.top + window.scrollY;
                entranceStart = trackTopDoc - inset * zoom;
                entranceDistance = Math.max(1, entranceTravel * zoom);

                if (entranceAnchor) {
                    entranceAnchor.dataset.navAt = String(entranceStart + entranceDistance * 0.35);
                }

                // Geometria SVG dos 3 feixes curvos saindo dos 3 Cards de Pilares até o Nexus Central
                const half = frameWidth / 2;
                nexusY = Math.min(frameHeight * 0.56, pillarsH * 0.72);
                if (entranceSvg) {
                    entranceSvg.setAttribute('viewBox', `0 0 ${frameWidth} ${frameHeight}`);
                }

                pillarCards.forEach((card, idx) => {
                    const cardCenterX =
                        offsetLeftRelativeTo(card, entranceFrame) + card.offsetWidth * 0.5;
                    const cardBottomY = Math.min(
                        pillarsH,
                        offsetTopRelativeTo(card, entranceFrame) + card.offsetHeight * 0.85
                    );
                    const cpY1 = cardBottomY + (nexusY - cardBottomY) * 0.55;
                    const cpY2 = cardBottomY + (nexusY - cardBottomY) * 0.85;
                    const d = `M ${cardCenterX.toFixed(1)} ${cardBottomY.toFixed(1)} C ${cardCenterX.toFixed(1)} ${cpY1.toFixed(1)}, ${half.toFixed(1)} ${cpY2.toFixed(1)}, ${half.toFixed(1)} ${nexusY.toFixed(1)}`;
                    pillarBasePaths[idx]?.setAttribute('d', d);
                    pillarActivePaths[idx]?.setAttribute('d', d);
                });

                // Deslocamentos horizontais das 4 métricas em relação ao centro para o desdobramento
                metricOffsetsX = metricCards.map((card) => {
                    const cardCenter =
                        offsetLeftRelativeTo(card, openingLayout) + card.offsetWidth * 0.5;
                    return half - cardCenter;
                });
            }

            if (masterTimeline && rows.length === 3 && nodes.length === 3) {
                const masterRect = masterTimeline.getBoundingClientRect();
                const masterTopDoc = masterRect.top + window.scrollY;

                const localY = nodes.map((_, idx) => {
                    const row = rows[idx];
                    const rowTop = offsetTopRelativeTo(row, masterTimeline);
                    return rowTop + row.offsetHeight * 0.5;
                }) as [number, number, number];

                const railTop = localY[0];
                const railSpan = Math.max(1, localY[2] - localY[0]);
                const ratio2025 = clamp((localY[1] - localY[0]) / railSpan);

                nodeRatios = [0, ratio2025, 1];
                nodeDocY = [
                    masterTopDoc + localY[0] * zoom,
                    masterTopDoc + localY[1] * zoom,
                    masterTopDoc + localY[2] * zoom,
                ];

                layout.set(masterTimeline, '--career-rail-top', `${railTop.toFixed(1)}px`);
                layout.set(masterTimeline, '--career-rail-height', `${railSpan.toFixed(1)}px`);
                layout.set(masterTimeline, '--career-node-2025-pct', `${(ratio2025 * 100).toFixed(3)}%`);

                sectionFocusStart = entranceEnabled ? entranceStart : masterTopDoc - vh * 0.35;
                sectionFocusEnd = nodeDocY[2] + vh * 0.35;
            }

            lastScroll = NaN;
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
        const onInteractionRefresh = () => {
            lastScroll = NaN;
            schedulePaint();
        };

        const observer = new ResizeObserver(scheduleMeasure);
        observer.observe(root);
        if (entranceTrack) observer.observe(entranceTrack);
        if (pillarsLayout) observer.observe(pillarsLayout);
        if (openingLayout) observer.observe(openingLayout);
        if (masterTimeline) observer.observe(masterTimeline);
        rows.forEach((r) => observer.observe(r));
        const main = root.closest('main');
        if (main) observer.observe(main);

        if (lenis) lenis.on('scroll', onLenisScroll);
        else window.addEventListener('scroll', onNativeScroll, { passive: true });

        window.addEventListener('resize', scheduleMeasure);
        root.addEventListener('focusin', onInteractionRefresh);
        root.addEventListener('focusout', onInteractionRefresh);
        rows.forEach((r) => {
            r.addEventListener('pointerenter', onInteractionRefresh, { passive: true });
            r.addEventListener('pointerleave', onInteractionRefresh, { passive: true });
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
            if (lenis) lenis.off('scroll', onLenisScroll);
            else window.removeEventListener('scroll', onNativeScroll);
            window.removeEventListener('resize', scheduleMeasure);
            root.removeEventListener('focusin', onInteractionRefresh);
            root.removeEventListener('focusout', onInteractionRefresh);
            rows.forEach((r) => {
                r.removeEventListener('pointerenter', onInteractionRefresh);
                r.removeEventListener('pointerleave', onInteractionRefresh);
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
