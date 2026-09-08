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
    const springX = useSpring(cursorPageX, { stiffness: 150, damping: 20, mass: 0.4 });
    const springY = useSpring(cursorPageY, { stiffness: 150, damping: 20, mass: 0.4 });

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

            {/* Cone 1 — Hero / Topo: Azul-ciano difuso com calor âmbar */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[1300px] h-[850px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.18) 0%, rgba(217, 119, 87, 0.08) 35%, transparent 70%)',
                }}
            />

            {/* Cone 2 — Centro / Meio do Portfólio: Sustentação óptica branca e ciano */}
            <div
                className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[750px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.10) 0%, rgba(56, 189, 248, 0.05) 40%, transparent 70%)',
                }}
            />

            {/* Cone 3 — Rodapé / Terminal & Contato: Aura esmeralda/ciano suave */}
            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 100%, rgba(16, 185, 129, 0.12) 0%, rgba(56, 189, 248, 0.06) 40%, transparent 70%)',
                }}
            />

            {/* ══════════════════════════════════════════════════════════
                CAMADA 2: Spotlight Reativo ao Cursor (Scroll-Aware)
                Atualiza em mousemove E scroll para nunca congelar.
                ══════════════════════════════════════════════════════════ */}
            <motion.div
                className="absolute w-[650px] h-[650px] rounded-full pointer-events-none"
                style={{
                    left: springX,
                    top: springY,
                    x: '-50%',
                    y: '-50%',
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.16) 0%, rgba(217, 119, 87, 0.08) 30%, transparent 65%)',
                    opacity: 0.9,
                }}
            />
        </div>
    );
}
