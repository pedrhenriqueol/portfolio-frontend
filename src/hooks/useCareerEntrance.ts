import { useLayoutEffect, type RefObject } from 'react';
import { useLenis } from '../components/providers/SmoothScrollProvider';
import { setProjectFocus } from '../context/ProjectFocusContext';
import { createSceneStyles, setSceneInert } from '../utils/sceneStyles';

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (n: number) => n * n * (3 - 2 * n);
const phase = (value: number, from: number, to: number) => smooth(clamp((value - from) / Math.max(0.0001, to - from)));

export interface CareerRailTelemetry {
    /** Progresso contínuo do feixe (0 no centro do nó 2026 -> 1 no centro do nó 2024) */
    beamProgress: number;
    /** Índice do marco atualmente em foco (0 = 2026, 1 = 2025, 2 = 2024) */
    activeStationIndex: number;
    /** Estado de ignição de cada estação [2026, 2025, 2024] (0 -> 1) */
    stationIgnitions: [number, number, number];
    /** Peso de foco óptico de cada estação [2026, 2025, 2024] (0 -> 1) */
    stationFocus: [number, number, number];
}

/**
 * Motor de Coreografia Sequencial em Foco & Trilho Unificado de Alta Precisão (`useCareerMasterScene`).
 * - Opera 100% no compositor (`translate3d`, `scale`, `opacity`) via `requestAnimationFrame`.
 * - Anima a saída em profundidade dos 3 cards de Pilares ("Sobre Mim") sem buraco vazio.
 * - Orquestra a entrada em cascata do Cabeçalho e das 4 Métricas Executivas.
 * - Trava geometricamente o Trilho Central do centro exato da estação `2026` ao centro exato da estação `2024`,
 *   garantindo que o feixe luminoso e o núcleo viajante toquem cada nó no exato pixel de leitura.
 * - Coloca cada marco (`2026` -> `2025` -> `2024`) em foco espacial sequencial ("um vindo após o outro").
 */
export function useCareerMasterScene(
    ref: RefObject<HTMLElement | null>,
    onTelemetry?: (telemetry: CareerRailTelemetry) => void,
) {
    const lenis = useLenis();

    useLayoutEffect(() => {
        const root = ref.current;
        if (!root) return;

        const pillarsTail = root.querySelector<HTMLElement>('.career-pillars-bridge .chapter-tail');
        const pillarCards = pillarsTail
            ? Array.from(pillarsTail.children).filter((el): el is HTMLElement => el instanceof HTMLElement)
            : [];

        const heading = root.querySelector<HTMLElement>('.career-heading-block');
        const metricCards = Array.from(root.querySelectorAll<HTMLElement>('[data-career-metric]'));
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

        const media = matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
        const layout = createSceneStyles();
        const motion = createSceneStyles();

        let enabled = media.matches;
        let zoom = 1;
        let pillarsStart = 0;
        let pillarsDistance = 1;
        let headingDocY = 0;
        let metricsDocY = 0;
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

        const paint = () => {
            frame = 0;
            if (disposed) return;
            if (scrollPosition === lastScroll) return;
            lastScroll = scrollPosition;

            const vh = window.innerHeight;
            const readingLine = scrollPosition + vh * 0.54;

            // 1. Foco global da seção Experiência Profissional (sincroniza Navbar & ambiente)
            const isSectionFocused = enabled && scrollPosition >= sectionFocusStart && scrollPosition <= sectionFocusEnd;
            setProjectFocus(isSectionFocused, 'career');

            if (!enabled) {
                motion.clear();
                if (pillarsTail) setSceneInert(pillarsTail, false);
                return;
            }

            // 2. Transição de Saída dos 3 Cards de Pilares ("Sobre Mim" -> "Experiência")
            if (pillarsTail) {
                const pOut = phase(scrollPosition, pillarsStart, pillarsStart + pillarsDistance);
                const pillarsFocused = pillarsTail.contains(document.activeElement);
                if (pillarsFocused || pOut <= 0.001) {
                    motion.set(pillarsTail, 'opacity', '1');
                    motion.set(pillarsTail, 'transform', 'translate3d(0, 0, 0) scale(1)');
                    pillarCards.forEach((card) => {
                        motion.set(card, 'transform', 'translate3d(0, 0, 0) scale(1)');
                        motion.set(card, 'opacity', '1');
                    });
                    setSceneInert(pillarsTail, false);
                } else {
                    motion.set(pillarsTail, 'opacity', (1 - pOut * 0.92).toFixed(4));
                    motion.set(
                        pillarsTail,
                        'transform',
                        `translate3d(0, ${(-pOut * 28).toFixed(2)}px, 0) scale(${(1 - pOut * 0.04).toFixed(4)})`
                    );
                    pillarCards.forEach((card, idx) => {
                        // Card central recua primeiro em profundidade; laterais abrem sutilmente
                        const cardPhase = phase(pOut, idx === 1 ? 0 : 0.08, idx === 1 ? 0.88 : 1);
                        const dirX = idx === 0 ? -1 : idx === 2 ? 1 : 0;
                        const tx = dirX * cardPhase * 26;
                        const ty = idx === 1 ? -cardPhase * 24 : -cardPhase * 12;
                        const sc = idx === 1 ? 1 - cardPhase * 0.055 : 1 - cardPhase * 0.035;
                        motion.set(
                            card,
                            'transform',
                            `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${sc.toFixed(4)})`
                        );
                        motion.set(card, 'opacity', (1 - cardPhase * 0.9).toFixed(4));
                    });
                    setSceneInert(pillarsTail, pOut >= 0.95);
                }
            }

            // 3. Revelação Cinemática do Cabeçalho da Experiência Profissional
            if (heading) {
                const hEnter = phase(scrollPosition + vh * 0.82, headingDocY - vh * 0.12, headingDocY + vh * 0.22);
                motion.set(heading, 'opacity', (0.15 + hEnter * 0.85).toFixed(4));
                motion.set(
                    heading,
                    'transform',
                    `translate3d(0, ${((1 - hEnter) * 34).toFixed(2)}px, 0) scale(${(0.95 + hEnter * 0.05).toFixed(4)})`
                );
            }

            // 4. Entrada em Cascata das 4 Métricas Executivas (uma após a outra)
            metricCards.forEach((card, idx) => {
                const staggerOffset = idx * (vh * 0.055);
                const mEnter = phase(
                    scrollPosition + vh * 0.84,
                    metricsDocY - vh * 0.08 + staggerOffset,
                    metricsDocY + vh * 0.24 + staggerOffset
                );
                motion.set(card, 'opacity', (0.1 + mEnter * 0.9).toFixed(4));
                motion.set(
                    card,
                    'transform',
                    `translate3d(0, ${((1 - mEnter) * 28).toFixed(2)}px, 0) scale(${(0.94 + mEnter * 0.06).toFixed(4)})`
                );
            });

            // 5. Geometria Exata do Trilho Unificado (2026 -> 2025 -> 2024)
            // O feixe é estritamente parametrizado por segmentos para que na leitura de 2025
            // o progresso seja exatamente nodeRatios[1], e em 2024 seja exatamente 1.
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
                // O núcleo viajante acende assim que o primeiro marco entra em leitura
                const travellerEnter = phase(readingLine, y0 - vh * 0.18, y0 - vh * 0.02);
                motion.set(traveller, 'opacity', travellerEnter.toFixed(4));
                motion.set(
                    traveller,
                    'transform',
                    `translate3d(-50%, -50%, 0) scale(${(0.75 + travellerEnter * 0.25).toFixed(4)})`
                );
            }

            // 6. Coreografia Sequencial dos 3 Marcos (2026 -> 2025 -> 2024):
            //    - Ignição exata do nó quando o feixe atinge a estação
            //    - Disparo do feixe horizontal conector (branch beam)
            //    - Entrada lateral + Foco Espacial ("um vindo após o outro")
            const ignitions: [number, number, number] = [0, 0, 0];
            const focuses: [number, number, number] = [0, 0, 0];

            rows.forEach((row, idx) => {
                const stationY = nodeDocY[idx];
                const stationRatio = nodeRatios[idx];

                // Ignição da estação: 2026 acende quando a linha de leitura chega em y0;
                // 2025 e 2024 acendem no exato instante em que o feixe atinge sua coordenada!
                const ignition =
                    idx === 0
                        ? phase(readingLine, y0 - vh * 0.16, y0 + vh * 0.02)
                        : phase(beamProgress, stationRatio - 0.035, stationRatio + 0.01);
                ignitions[idx] = ignition;

                // Revelação sequencial: primeiro o Ano Monumental + Nó, seguido imediatamente pelo Card Detalhado
                const yearReveal = phase(readingLine, stationY - vh * 0.42, stationY - vh * 0.06);
                const cardReveal = phase(readingLine, stationY - vh * 0.34, stationY + vh * 0.02);

                // Janela de Foco Ativo: quando este marco é o protagonista na linha de leitura
                const distFromReading = readingLine - stationY;
                const enterFocus = phase(readingLine, stationY - vh * 0.28, stationY - vh * 0.02);
                // Quando o próximo marco assume o foco, o anterior recua suavemente em profundidade (mas o último mantém foco até o fim da seção)
                const nextStationY = idx < 2 ? nodeDocY[idx + 1] : stationY + vh * 0.65;
                const exitFocus =
                    idx < 2
                        ? 1 - phase(readingLine, nextStationY - vh * 0.24, nextStationY + vh * 0.04) * 0.58
                        : 1 - phase(readingLine, stationY + vh * 0.45, stationY + vh * 0.78) * 0.45;

                const isHoveredOrFocused = row.matches(':hover') || row.contains(document.activeElement);
                const focusWeight = isHoveredOrFocused ? 1 : clamp(enterFocus * exitFocus);
                focuses[idx] = focusWeight;

                row.dataset.careerActive = focusWeight > 0.65 ? 'true' : 'false';
                motion.set(row, '--station-ignition', ignition.toFixed(4));
                motion.set(row, '--station-focus', focusWeight.toFixed(4));

                // Conector horizontal de energia (Branch Beam) saindo do nó central para o Card e o Ano
                const branch = branches[idx];
                if (branch) {
                    const branchScale = clamp(ignition * (0.35 + focusWeight * 0.65));
                    motion.set(branch, 'transform', `translateY(-50%) scaleX(${branchScale.toFixed(4)})`);
                    motion.set(branch, 'opacity', (ignition * (0.4 + focusWeight * 0.6)).toFixed(4));
                }

                // Nó da estação
                const node = nodes[idx];
                if (node) {
                    const nodeScale = 0.88 + ignition * 0.12 + (focusWeight > 0.6 ? 0.08 : 0);
                    motion.set(node, 'transform', `translate3d(-50%, -50%, 0) scale(${nodeScale.toFixed(4)})`);
                }

                // Direção lateral alternada (2026: Ano na Esq / Card na Dir | 2025: Card na Esq / Ano na Dir | 2024: Ano na Esq / Card na Dir)
                const yearDir = idx === 1 ? 1 : -1;
                const cardDir = idx === 1 ? -1 : 1;

                // Recuo pós-leitura suave quando o foco já passou para a estação seguinte
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

            // 7. Atualiza o ano exibido na cápsula do viajante óptico
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

            enabled = media.matches;
            root.dataset.careerScene = enabled ? 'active' : 'native';

            const rootRect = root.getBoundingClientRect();
            zoom = rootRect.width / root.offsetWidth || 1;
            const vh = window.innerHeight;
            scrollPosition = lenis ? lenis.scroll : window.scrollY;

            if (pillarsTail) {
                const pRect = pillarsTail.getBoundingClientRect();
                pillarsStart = pRect.top + window.scrollY - vh * 0.18;
                pillarsDistance = Math.max(1, pRect.height + vh * 0.36);
            }

            if (heading) {
                headingDocY = heading.getBoundingClientRect().top + window.scrollY;
            }
            if (metricCards[0]) {
                metricsDocY = metricCards[0].getBoundingClientRect().top + window.scrollY;
            }

            if (masterTimeline && rows.length === 3 && nodes.length === 3) {
                const masterRect = masterTimeline.getBoundingClientRect();
                const masterTopDoc = masterRect.top + window.scrollY;

                // Mede o centro exato de cada nó (2026, 2025, 2024) em coordenadas CSS locais de `masterTimeline`
                const localY = nodes.map((node, idx) => {
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

                sectionFocusStart = (heading ? headingDocY : masterTopDoc) - vh * 0.35;
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

        const observer = new ResizeObserver(scheduleMeasure);
        observer.observe(root);
        if (masterTimeline) observer.observe(masterTimeline);
        rows.forEach((r) => observer.observe(r));
        if (pillarsTail) observer.observe(pillarsTail);
        const main = root.closest('main');
        if (main) observer.observe(main);

        if (lenis) lenis.on('scroll', onLenisScroll);
        else window.addEventListener('scroll', onNativeScroll, { passive: true });

        const onInteractionRefresh = () => {
            lastScroll = NaN;
            schedulePaint();
        };

        window.addEventListener('resize', scheduleMeasure);
        root.addEventListener('focusin', onInteractionRefresh);
        root.addEventListener('focusout', onInteractionRefresh);
        rows.forEach((r) => {
            r.addEventListener('pointerenter', onInteractionRefresh, { passive: true });
            r.addEventListener('pointerleave', onInteractionRefresh, { passive: true });
        });
        media.addEventListener('change', scheduleMeasure);
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
            media.removeEventListener('change', scheduleMeasure);
            if (pillarsTail) setSceneInert(pillarsTail, false);
            delete root.dataset.careerScene;
            layout.clear();
            motion.clear();
            setProjectFocus(false, 'career');
        };
    }, [ref, onTelemetry, lenis]);
}
