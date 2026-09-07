import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export interface SystemPreloaderProps {
    onComplete: () => void;
}

/**
 * SystemPreloader — Preloader Minimalista em 3 Fases Coreografadas (Jesper Landberg)
 *
 * Coreografia Temporal sem Ghosting (~2.3s total):
 * - Contagem Contínua: 00% a 100% em 1900ms a 60 FPS via requestAnimationFrame.
 * - Fase 1 (Hold): Estabilização estática absoluta de 180ms em 100%.
 * - Fase 2 (Saída do Miolo): Barras e textos somem primeiro (opacity: 0, scale: 0.95 em 220ms).
 * - Fase 3 (Dissolução da Cortina): Backdrop uniforme dissolve suavemente (opacity: 0 em 650ms).
 * - Fase 4 (Entrada do Hero): Hero emerge no App com profundidade (opacity: 1, scale: 1, y: 0).
 */
export default function SystemPreloader({ onComplete }: SystemPreloaderProps) {
    const [progress, setProgress] = useState<number>(0);
    const [isExiting, setIsExiting] = useState<boolean>(false);
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

    // ── 2. Cadência Temporal Suave & Coreografia em Fases ──
    useEffect(() => {
        const TOTAL_DURATION = 1900; // 1.9s para progressão suave e contínua
        const HOLD_AT_100 = 180; // Fase 1: 180ms de repouso absoluto em 100%
        const CONTENT_EXIT_DURATION = 220; // Fase 2: 220ms para o miolo central desaparecer completamente

        let animId: number;
        let timeoutHold: ReturnType<typeof setTimeout> | null = null;
        let timeoutExit: ReturnType<typeof setTimeout> | null = null;
        let startTime: number | null = null;

        const tick = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const ratio = Math.min(elapsed / TOTAL_DURATION, 1);

            // Progressão serena e linear a 60 FPS
            const currentVal = Math.min(Math.max(Math.round(ratio * 100), 0), 100);

            if (currentVal !== lastProgressRef.current) {
                lastProgressRef.current = currentVal;
                setProgress(currentVal);
            }

            if (ratio < 1) {
                animId = requestAnimationFrame(tick);
            } else {
                setProgress(100);
                // Fase 1: Estabilização estática absoluta no 100%
                timeoutHold = setTimeout(() => {
                    setIsExiting(true); // Dispara Fase 2: desaparecimento do miolo central
                    
                    // Fase 3: Dissolução do backdrop e liberação do Hero após limpeza visual
                    timeoutExit = setTimeout(() => {
                        onComplete();
                    }, CONTENT_EXIT_DURATION);
                }, HOLD_AT_100);
            }
        };

        animId = requestAnimationFrame(tick);

        return () => {
            if (animId) cancelAnimationFrame(animId);
            if (timeoutHold) clearTimeout(timeoutHold);
            if (timeoutExit) clearTimeout(timeoutExit);
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
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                transition: {
                    duration: 0.65,
                    ease: [0.16, 1, 0.3, 1],
                },
            }}
            className={`fixed inset-0 z-[9999] bg-[#090b10] flex flex-col items-center justify-center select-none antialiased subpixel-antialiased ${
                isExiting ? 'pointer-events-none' : 'pointer-events-auto'
            }`}
            style={{
                willChange: 'opacity',
            }}
            aria-live="polite"
            aria-label="Carregando Workstation"
        >
            {/* ── Miolo Central: Desaparece na Fase 2 antes da dissolução do fundo ── */}
            <motion.div
                animate={isExiting ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.22,
                    ease: [0.4, 0, 1, 1],
                }}
                className="flex flex-col items-center justify-center"
            >
                {/* ── Elemento 1: 3 Barras Segmentadas (34px x 2.5px, gap 8px) ── */}
                <div className="flex items-center gap-2" aria-hidden="true">
                    {[0, 1, 2].map((idx) => {
                        const fill = getSegmentFill(idx);
                        return (
                            <div
                                key={idx}
                                className="w-[34px] h-[2.5px] rounded-full bg-white/20 overflow-hidden relative"
                            >
                                <div
                                    className="h-full bg-white rounded-full transition-all duration-75 ease-out shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                                    style={{ width: `${fill}%` }}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* ── Elemento 2: Indicador Numérico com Escala Aumentada (text-sm md:text-base) ── */}
                <span className="text-sm md:text-base font-mono font-medium tracking-widest text-neutral-300 tabular-nums mt-5">
                    {progress < 100 ? String(progress).padStart(2, '0') : '100'}%
                </span>

                {/* ── Elemento 3: Legenda Técnica Nítida (text-xs tracking-[0.28em]) ── */}
                <span className="text-xs font-mono tracking-[0.28em] text-neutral-400 uppercase mt-2">
                    CARREGANDO WORKSTATION
                </span>
            </motion.div>
        </motion.aside>
    );
}
