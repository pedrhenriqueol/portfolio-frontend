import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export interface SystemPreloaderProps {
    onComplete: () => void;
}

/**
 * SystemPreloader — Boot Sequence & Telemetria Cinemática (Lusion / Jesper Landberg)
 *
 * Arquitetura de Inicialização:
 * 1. Bloqueio estrito de rolagem no document.body durante toda a execução.
 * 2. Contador não-linear via requestAnimationFrame (000 -> 100%):
 *    - 0% a 65%: avanço rápido simulando montagem de bundles.
 *    - 65% a 92%: cadência moderada.
 *    - 92% a 100%: desaceleração com ease-out e parada calculada de 180ms em 100%.
 * 3. Transição de Cortina (Curtain Reveal): subida vertical y: "-100%" com curva [0.76, 0, 0.24, 1] em 0.85s.
 * 4. Desbloqueio seguro do scroll na desmontagem do componente no AnimatePresence.
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

    // ── 2. Interpolação Matemática Não-Linear do Contador (000 ➔ 100%) ──
    useEffect(() => {
        const TOTAL_DURATION = 1320; // ms de contagem contínua
        const HOLD_AT_100 = 180; // ms de parada no número 100 antes de disparar a cortina

        let animId: number;
        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        let startTime: number | null = null;

        const tick = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const ratio = Math.min(elapsed / TOTAL_DURATION, 1);

            let currentVal = 0;
            if (ratio < 0.38) {
                // Fase 1: 0% a 65% (Avanço veloz e rítmico)
                const t = ratio / 0.38;
                currentVal = Math.round(t * 65);
            } else if (ratio < 0.76) {
                // Fase 2: 65% a 92% (Cadência moderada)
                const t = (ratio - 0.38) / 0.38;
                currentVal = Math.round(65 + t * (92 - 65));
            } else {
                // Fase 3: 92% a 100% (Desaceleração exponencial / Ease-out cúbico)
                const t = (ratio - 0.76) / 0.24;
                const easeOut = 1 - Math.pow(1 - t, 3);
                currentVal = Math.round(92 + easeOut * 8);
            }

            currentVal = Math.min(Math.max(currentVal, 0), 100);

            // Atualiza o estado apenas se houver mudança de número inteiro, evitando re-renders desnecessários
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

    // ── 3. Telemetria Técnica de Inicialização Conforme Percentual ──
    const getStatusText = (val: number): string => {
        if (val <= 35) return 'INICIALIZANDO NÚCLEO REACT & TOKENS...';
        if (val <= 75) return 'CARREGANDO MATRIZ TRIDIMENSIONAL & SHADERS...';
        if (val <= 99) return 'SINCRONIZANDO TELEMETRIA DE SISTEMAS...';
        return 'ACESSO CONCEDIDO';
    };

    return (
        <motion.aside
            initial={{ y: 0 }}
            exit={{
                y: '-100%',
                transition: {
                    duration: 0.85,
                    ease: [0.76, 0, 0.24, 1],
                },
            }}
            className="fixed inset-0 z-[9999] bg-[#090b10] flex flex-col justify-between p-8 md:p-14 select-none antialiased subpixel-antialiased pointer-events-auto"
            style={{
                willChange: 'transform',
            }}
            aria-live="polite"
            aria-label="Inicialização do Sistema"
        >
            {/* ── Cabeçalho Superior Editorial ── */}
            <div className="flex items-center justify-between text-xs font-mono tracking-wider border-b border-white/5 pb-4">
                <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(217,119,87,0.8)]" />
                    <span className="text-gray-300 font-medium">
                        • SISTEMA DE DESENVOLVIMENTO // WORKSTATION
                    </span>
                </div>
                <div className="text-gray-500 font-mono hidden sm:block">
                    CE ── BRASIL // 2026
                </div>
            </div>

            {/* ── Núcleo Monumental: Contador (000 ➔ 100%) ── */}
            <div className="my-auto flex flex-col items-start max-w-5xl">
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-accent font-semibold">
                        BOOT // SEQ.01
                    </span>
                    <span className="h-px w-8 bg-accent/40" />
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest hidden sm:inline">
                        PEDRO HENRIQUE OLIVEIRA
                    </span>
                </div>

                <div className="flex items-baseline gap-2 sm:gap-4">
                    <span className="text-6xl sm:text-8xl md:text-9xl font-mono font-bold tracking-tighter text-white tabular-nums leading-none">
                        {String(progress).padStart(3, '0')}
                    </span>
                    <span className="text-3xl sm:text-4xl md:text-6xl font-mono font-bold text-accent">
                        %
                    </span>
                </div>

                <p className="mt-4 text-xs sm:text-sm font-mono text-gray-400 max-w-md leading-relaxed">
                    Carregando ecossistema de engenharia de software de alta densidade, telemetria em tempo real e aceleração gráfica por hardware.
                </p>
            </div>

            {/* ── Rodapé Inferior: Telemetria e Barra Ultra-Fina de 1px ── */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                    <div className="flex items-center gap-2 text-accent">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                        <span className="font-semibold tracking-wider">
                            {getStatusText(progress)}
                        </span>
                    </div>
                    <div className="text-gray-500 text-[11px] font-mono">
                        {progress === 100 ? 'PRONTO PARA ENTRADA' : 'CARREGANDO MÓDULOS DE INTERFACE...'}
                    </div>
                </div>

                {/* Linha de progresso ultra-fina de 1px preenchendo 0% a 100% */}
                <div className="w-full h-[1px] bg-white/10 relative overflow-hidden rounded-full">
                    <div
                        className="h-full bg-gradient-to-r from-accent/40 via-accent to-accent shadow-[0_0_10px_rgba(217,119,87,0.7)] transition-all duration-75 ease-linear"
                        style={{
                            width: `${progress}%`,
                        }}
                    />
                </div>
            </div>
        </motion.aside>
    );
}
