import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Hero from './Hero';
import AboutMe from './AboutMe';

/**
 * HeroAboutPinnedStage — Palco Fixo de Scrollytelling (Pinned Container)
 *
 * Arquitetura:
 * ┌─────────────────────────────────────────────┐
 * │  Track Exterior: height 220vh (scroll rail)  │
 * │  ┌─────────────────────────────────────────┐ │
 * │  │  Viewport Fixada: sticky top-0 h-screen │ │
 * │  │  ┌────────────────────────────────────┐  │ │
 * │  │  │  Camada Hero (sai com fade/blur)   │  │ │
 * │  │  ├────────────────────────────────────┤  │ │
 * │  │  │  Camada AboutMe (entra com fade)   │  │ │
 * │  │  └────────────────────────────────────┘  │ │
 * │  └─────────────────────────────────────────┘ │
 * └─────────────────────────────────────────────┘
 *
 * Fases de Scroll (0 → 1 dentro do track):
 *   0.00 – 0.30  →  Hero 100% visível, estável
 *   0.30 – 0.55  →  Hero faz fade out + blur + translação Y negativa
 *   0.40 – 0.70  →  AboutMe faz fade in + deblur + translação Y positiva → 0
 *   0.65 – 1.00  →  AboutMe 100% visível, estável
 *
 * Regras de Performance:
 * - Estritamente compositor-only: anima APENAS opacity, transform e filter (blur)
 * - Zero geometry changes (width, height, margin, padding)
 * - will-change: transform, opacity em ambas as camadas
 * - transform: translateZ(0) para promoção de camada de composição
 * - Compatível com low-end (iGPU Intel / throttling térmico)
 *
 * Regras Estruturais:
 * - O container pai NÃO pode ter overflow: hidden no eixo Y (quebraria sticky)
 * - Usa overflow-x: clip no body (já configurado no App.tsx)
 * - Reset de scroll no topo ao recarregar (scrollRestoration: manual)
 */
export default function HeroAboutPinnedStage() {
    const trackRef = useRef<HTMLDivElement>(null);

    // ── Reset de scroll no topo ao recarregar a página ──
    useEffect(() => {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
    }, []);

    // ── Progresso de scroll normalizado (0 → 1) dentro do track de 220vh ──
    const { scrollYProgress } = useScroll({
        target: trackRef,
        offset: ['start start', 'end end'],
    });

    // ── Hero: Interpolação de Saída ──
    // Fase estável (0 – 0.30), depois fade+blur+translate para cima
    const heroOpacity = useTransform(scrollYProgress, [0, 0.30, 0.55], [1, 1, 0]);
    const heroY = useTransform(scrollYProgress, [0, 0.30, 0.55], [0, 0, -60]);
    const heroBlur = useTransform(scrollYProgress, [0, 0.30, 0.50], [0, 0, 12]);
    const heroScale = useTransform(scrollYProgress, [0, 0.30, 0.55], [1, 1, 0.97]);
    // Pointer events: desabilita interação com Hero quando ele já desapareceu
    const heroPointerEvents = useTransform(scrollYProgress, (v: number) =>
        v > 0.50 ? 'none' : 'auto'
    );
    // Filter blur derivado (deve ser declarado no corpo do componente, não inline)
    const heroFilter = useTransform(heroBlur, (v: number) => `blur(${v}px)`);

    // ── AboutMe: Interpolação de Entrada ──
    // Começa invisível, sobe de baixo com deblur
    const aboutOpacity = useTransform(scrollYProgress, [0.35, 0.55, 0.70], [0, 0.6, 1]);
    const aboutY = useTransform(scrollYProgress, [0.35, 0.55, 0.70], [50, 20, 0]);
    const aboutBlur = useTransform(scrollYProgress, [0.35, 0.55, 0.65], [10, 4, 0]);
    const aboutScale = useTransform(scrollYProgress, [0.35, 0.55, 0.70], [0.97, 0.99, 1]);
    // Pointer events: desabilita interação com AboutMe quando ele ainda não apareceu
    const aboutPointerEvents = useTransform(scrollYProgress, (v: number) =>
        v < 0.45 ? 'none' : 'auto'
    );
    // Filter blur derivado
    const aboutFilter = useTransform(aboutBlur, (v: number) => `blur(${v}px)`);

    return (
        <div
            ref={trackRef}
            className="relative w-full"
            style={{ height: '220vh' }}
        >
            {/* ── Viewport Fixada (Sticky Stage) ── */}
            <div
                className="sticky top-0 w-full overflow-hidden"
                style={{
                    height: '100vh',
                    /* Não usar overflow: hidden no eixo Y no pai,
                       mas podemos usar no viewport fixada pois ela é um nó folha */
                }}
            >
                {/* ── Camada Hero (z-20, sai primeiro) ── */}
                <motion.div
                    className="absolute inset-0 w-full h-full z-20"
                    style={{
                        opacity: heroOpacity,
                        y: heroY,
                        scale: heroScale,
                        filter: heroFilter,
                        pointerEvents: heroPointerEvents,
                        willChange: 'transform, opacity, filter',
                        transform: 'translateZ(0)',
                    }}
                >
                    <div className="w-full h-full overflow-y-auto">
                        <Hero />
                    </div>
                </motion.div>

                {/* ── Camada AboutMe (z-10, entra por baixo) ── */}
                <motion.div
                    className="absolute inset-0 w-full h-full z-10"
                    style={{
                        opacity: aboutOpacity,
                        y: aboutY,
                        scale: aboutScale,
                        filter: aboutFilter,
                        pointerEvents: aboutPointerEvents,
                        willChange: 'transform, opacity, filter',
                        transform: 'translateZ(0)',
                    }}
                >
                    <div className="w-full h-full overflow-y-auto">
                        <AboutMe />
                    </div>
                </motion.div>

                {/* ── Gradiente de Transição na Base (suaviza corte visual com a próxima seção) ── */}
                <div
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#05070a] pointer-events-none z-30"
                />
            </div>
        </div>
    );
}
