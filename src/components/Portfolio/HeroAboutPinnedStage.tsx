import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Hero from './Hero';
import AboutMe from './AboutMe';

/**
 * HeroAboutPinnedStage — Palco Fixo de Scrollytelling (Pinned Container)
 *
 * Arquitetura de Linha do Tempo (220vh):
 * ┌────────────────────────────────────────────────────────────────────────┐
 * │  Pista de Rolagem (Scroll Track): relative h-[220vh] bg-[#05070a]       │
 * │  ┌──────────────────────────────────────────────────────────────────┐  │
 * │  │  Palco Fixo (Sticky Viewport): sticky top-0 h-screen w-full      │  │
 * │  │  ┌────────────────────────────────────────────────────────────┐  │  │
 * │  │  │  Fase 1 (0.00-0.35): Hero Texto estável, desliza e fade    │  │  │
 * │  │  │  Fase 2 (0.15-0.65): Terminal pivô central (scale 1->0.92)│  │  │
 * │  │  │  Fase 3 (0.40-0.90): Sobre Mim entra da direita (x: 60->0) │  │  │
 * │  │  │  Fase 4 (0.90-1.00): Liberação natural do sticky           │  │  │
 * │  │  └────────────────────────────────────────────────────────────┘  │  │
 * │  └──────────────────────────────────────────────────────────────────┘  │
 * └────────────────────────────────────────────────────────────────────────┘
 *
 * Performance Low-End:
 * - Aceleração exclusiva por GPU (transform: x, scale; e opacity)
 * - Zero propriedades de geometria (width, height, top, left, margin)
 * - will-change: transform, opacity em nós animados
 * - Prevenção de conflito de overflow (overflow-x: clip na raiz, nunca overflow-y: hidden)
 */
export default function HeroAboutPinnedStage() {
    const trackRef = useRef<HTMLDivElement>(null);

    // Reset de scroll no topo ao recarregar a página para evitar desfasamento
    useEffect(() => {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
    }, []);

    // Progresso de scroll normalizado (0 -> 1) dentro do track estendido de 220vh
    const { scrollYProgress } = useScroll({
        target: trackRef,
        offset: ['start start', 'end end'],
    });

    // ── Fase 1: Hero Text (0.0 a 0.35 estável; fade out e translação X negativa entre 0.25 e 0.40) ──
    const heroTextOpacity = useTransform(scrollYProgress, [0, 0.25, 0.40], [1, 1, 0]);
    const heroTextX       = useTransform(scrollYProgress, [0, 0.25, 0.40], [0, 0, -60]);

    // ── Fase 2: Terminal Interativo Pivô Central (0.15 a 0.65) ──
    // Translada para a esquerda e reduz suavemente a escala (1 -> 0.92) para abrir espaço visual
    const terminalScale   = useTransform(scrollYProgress, [0, 0.15, 0.65], [1, 1, 0.92]);
    const terminalX       = useTransform(scrollYProgress, [0, 0.15, 0.65], [0, 0, -40]);
    // Fade out suave do terminal após o pivô para focar integralmente no Sobre Mim
    const terminalOpacity = useTransform(scrollYProgress, [0, 0.62, 0.80], [1, 1, 0]);

    // Pointer events da camada Hero: desabilita interação após transição do texto
    const heroPointerEvents = useTransform(scrollYProgress, (v: number) =>
        v > 0.45 ? 'none' : 'auto'
    );

    // ── Fase 3: Sobre Mim vindo da direita (0.40 a 0.90) ──
    // Entrada com opacidade 0 -> 1 e translação suave x: 60px -> 0
    const aboutOpacity = useTransform(scrollYProgress, [0.40, 0.70, 0.90], [0, 0.75, 1]);
    const aboutX       = useTransform(scrollYProgress, [0.40, 0.80], [60, 0]);

    // Pointer events da camada Sobre Mim: habilita interação quando estiver visível
    const aboutPointerEvents = useTransform(scrollYProgress, (v: number) =>
        v < 0.45 ? 'none' : 'auto'
    );

    return (
        <div
            id="pinned-stage"
            ref={trackRef}
            className="relative h-[220vh] bg-[#05070a] w-full"
        >
            {/* ── Palco Fixo (Sticky Viewport) ── */}
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

                {/* ── Camada 1: Hero (Texto + Terminal Pivô) ── */}
                <motion.div
                    className="absolute inset-0 w-full h-full z-10 flex items-center justify-center"
                    style={{
                        pointerEvents: heroPointerEvents,
                        transform: 'translateZ(0)',
                    }}
                >
                    <div className="w-full h-full flex items-center justify-center">
                        <Hero
                            heroTextOpacity={heroTextOpacity}
                            heroTextX={heroTextX}
                            terminalScale={terminalScale}
                            terminalX={terminalX}
                            terminalOpacity={terminalOpacity}
                        />
                    </div>
                </motion.div>

                {/* ── Camada 2: Sobre Mim (Entrada da direita no Scrollytelling) ── */}
                <motion.div
                    className="absolute inset-0 w-full h-full z-20 flex items-center justify-center"
                    style={{
                        opacity: aboutOpacity,
                        x: aboutX,
                        pointerEvents: aboutPointerEvents,
                        willChange: 'transform, opacity',
                        transform: 'translateZ(0)',
                    }}
                >
                    <div className="w-full h-full overflow-y-auto">
                        <AboutMe />
                    </div>
                </motion.div>

                {/* ── Gradiente de Transição na Base ── */}
                <div
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#05070a] pointer-events-none z-30"
                />
            </div>
        </div>
    );
}
