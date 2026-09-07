import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export interface SystemPreloaderProps {
    onComplete: () => void;
}

/**
 * SystemPreloader — Preloader Minimalista e Equilibrado (Inspirado em Jesper Landberg)
 *
 * Arquitetura Sóbria & Cadência Calma:
 * 1. Ponto Focal Central Único: Elimina 100% de poluição visual periférica nos 4 cantos.
 * 2. 3 Barras Segmentadas: Cápsulas de 28px x 2px com gap de 6px (— — —) e preenchimento progressivo em branco com glow suave.
 * 3. Tipografia Mono Serena: Indicador numérico discreto (00% a 100%) avançando de forma contínua e sem saltos bruscos.
 * 4. Legenda Minimalista: "CARREGANDO WORKSTATION" em micro-caixa alta espaçada.
 * 5. Cadência Temporal: 2.4 segundos contínuos a 60 FPS via requestAnimationFrame + pausa intencional de 200ms em 100%.
 * 6. Dissolve & Profundidade: Transição de saída com fade-out e leve recuo em escala (opacity: 0, scale: 1.02).
 * 7. Bloqueio Seguro: Trava do body overflow durante toda a execução com liberação na desmontagem.
 */
export default function SystemPreloader({ onComplete }: SystemPreloaderProps) {
    const [progress, setProgress] = useState<number>(0);
    const lastProgressRef = useRef<number>(0);

    // ── 1. Bloqueio Seguro de Rolagem no document.body ──
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0);
        }
        const prevOverflow = document.body.style.overflow;
        const prevOverscroll = document.body.style.overscrollBehavior;
        document.body.style.overflow = 'hidden';
        document.body.style.overscrollBehavior = 'none';

        return () => {
            document.body.style.overflow = prevOverflow;
            document.body.style.overscrollBehavior = prevOverscroll;
        };
    }, []);

    // ── 2. Cadência Temporal Suave (~2.4s) via requestAnimationFrame ──
    useEffect(() => {
        const TOTAL_DURATION = 2400; // 2.4 segundos de progressão calma e contínua
        const HOLD_AT_100 = 200; // 200ms de pausa de estabilização visual em 100%

        let animId: number;
        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        let startTime: number | null = null;

        const tick = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const ratio = Math.min(elapsed / TOTAL_DURATION, 1);

            // Progressão linear contínua e serena a 60 FPS
            const currentVal = Math.min(Math.max(Math.round(ratio * 100), 0), 100);

            if (currentVal !== lastProgressRef.current) {
                lastProgressRef.current = currentVal;
                setProgress(currentVal);
            }

            if (ratio < 1) {
                animId = requestAnimationFrame(tick);
            } else {
                setProgress(100);
                timeoutId = setTimeout(() => {
                    onComplete();
                }, HOLD_AT_100);
            }
        };

        animId = requestAnimationFrame(tick);

        return () => {
            if (animId) cancelAnimationFrame(animId);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [onComplete]);

    // Cálculo do preenchimento percentual individual de cada uma das 3 barras segmentadas
    const getSegmentFill = (index: number): number => {
        const segmentSpan = 100 / 3; // ~33.333% por segmento
        const start = index * segmentSpan;
        const end = (index + 1) * segmentSpan;
        if (progress <= start) return 0;
        if (progress >= end) return 100;
        return ((progress - start) / segmentSpan) * 100;
    };

    return (
        <motion.aside
            initial={{ opacity: 1, scale: 1 }}
            exit={{
                opacity: 0,
                scale: 1.02,
                transition: {
                    duration: 0.7,
                    ease: [0.65, 0, 0.35, 1],
                },
            }}
            className="fixed inset-0 z-[9999] bg-[#090b10] flex flex-col items-center justify-center select-none antialiased subpixel-antialiased pointer-events-auto"
            style={{
                willChange: 'opacity, transform',
            }}
            aria-live="polite"
            aria-label="Carregando Workstation"
        >
            <div className="flex flex-col items-center justify-center">
                {/* ── Elemento 1: 3 Barras Segmentadas Minimalistas (28px x 2px, gap 6px) ── */}
                <div className="flex items-center gap-[6px]" aria-hidden="true">
                    {[0, 1, 2].map((idx) => {
                        const fill = getSegmentFill(idx);
                        return (
                            <div
                                key={idx}
                                className="w-[28px] h-[2px] rounded-full bg-white/20 overflow-hidden relative"
                            >
                                <div
                                    className="h-full bg-white rounded-full transition-all duration-75 ease-out shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                                    style={{ width: `${fill}%` }}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* ── Elemento 2: Tipografia Mono Sóbria e Legível (00% ➔ 100%) ── */}
                <span className="text-xs font-mono tracking-widest text-neutral-400 tabular-nums mt-4">
                    {progress < 100 ? String(progress).padStart(2, '0') : '100'}%
                </span>

                {/* ── Elemento 3: Legenda Minimalista em Micro-Caixa Alta Espaçada ── */}
                <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-500 uppercase mt-2">
                    CARREGANDO WORKSTATION
                </span>
            </div>
        </motion.aside>
    );
}
