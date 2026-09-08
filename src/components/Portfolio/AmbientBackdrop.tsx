import { useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * AmbientBackdrop — Sistema de Iluminação Volumétrica em Dupla Camada
 *
 * CAMADA 1 (Estática): Cones de luz especular fixos posicionados atrás de pontos focais
 *   - Hero (topo): azul-ciano difuso
 *   - Centro / Esteira 3D: sustentação óptica branca
 *   - Rodapé / Terminal: aura esmeralda sutil
 *
 * CAMADA 2 (Reativa): Spotlight do cursor que responde a AMBOS mousemove E scroll,
 *   eliminando o congelamento quando o usuário rola sem mover o mouse.
 *   Posição convertida de coordenadas de viewport para coordenadas de página.
 */
export default function AmbientBackdrop() {
    // Coordenadas do cursor em espaço de página (não viewport)
    const cursorPageX = useMotionValue(-500);
    const cursorPageY = useMotionValue(-500);

    // Suavização com física de mola — sem saltos abruptos
    const springX = useSpring(cursorPageX, { stiffness: 120, damping: 22, mass: 0.4 });
    const springY = useSpring(cursorPageY, { stiffness: 120, damping: 22, mass: 0.4 });

    // Armazena a última posição do mouse na viewport para recalcular ao scrollar
    const lastClientX = useRef(-500);
    const lastClientY = useRef(-500);

    const updatePagePosition = useCallback(() => {
        if (lastClientX.current < 0) return;
        const pageX = lastClientX.current;
        const pageY = lastClientY.current + window.scrollY;
        cursorPageX.set(pageX);
        cursorPageY.set(pageY);
    }, [cursorPageX, cursorPageY]);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            lastClientX.current = e.clientX;
            lastClientY.current = e.clientY;
            updatePagePosition();
        };

        const onScroll = () => {
            updatePagePosition();
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('scroll', onScroll);
        };
    }, [updatePagePosition]);

    return (
        <div
            aria-hidden="true"
            className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none"
            style={{ zIndex: 0 }}
        >
            {/* ══════════════════════════════════════════════════════════
                CAMADA 1: Cones de Luz Especular Fixos (Independentes do Mouse)
                ══════════════════════════════════════════════════════════ */}

            {/* Cone 1 — Hero / Topo: Azul-ciano difuso */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 0%, rgba(140, 106, 74, 0.07) 0%, rgba(255, 255, 255, 0.025) 35%, transparent 70%)',
                    filter: 'blur(40px)',
                }}
            />

            {/* Cone 2 — Centro / Esteira 3D: Sustentação óptica branca */}
            <div
                className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.015) 40%, transparent 70%)',
                    filter: 'blur(60px)',
                }}
            />

            {/* Cone 3 — Rodapé / Terminal: Aura esmeralda/âmbar suave */}
            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 100%, rgba(140, 106, 74, 0.035) 0%, rgba(16, 185, 129, 0.02) 40%, transparent 70%)',
                    filter: 'blur(50px)',
                }}
            />

            {/* ══════════════════════════════════════════════════════════
                CAMADA 2: Spotlight Reativo ao Cursor (Scroll-Aware)
                Atualiza em mousemove E scroll para nunca congelar.
                ══════════════════════════════════════════════════════════ */}
            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{
                    left: springX,
                    top: springY,
                    x: '-50%',
                    y: '-50%',
                    background: 'radial-gradient(circle, rgba(140, 106, 74, 0.06) 0%, rgba(140, 106, 74, 0.025) 35%, transparent 65%)',
                    filter: 'blur(30px)',
                    opacity: 0.5,
                }}
            />
        </div>
    );
}
