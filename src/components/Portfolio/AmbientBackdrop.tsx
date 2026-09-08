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
    // Coordenadas do cursor em espaço de página (calibradas para zoom CSS)
    const cursorPageX = useMotionValue(-1000);
    const cursorPageY = useMotionValue(-1000);

    // Suavização com física de mola calibrada
    const springX = useSpring(cursorPageX, { stiffness: 180, damping: 24, mass: 0.3 });
    const springY = useSpring(cursorPageY, { stiffness: 180, damping: 24, mass: 0.3 });

    // Armazena a última posição do mouse na viewport
    const lastClientX = useRef(-1000);
    const lastClientY = useRef(-1000);

    const getZoom = useCallback(() => {
        if (typeof window === 'undefined') return 0.8;
        const styleZoom = parseFloat(getComputedStyle(document.documentElement).zoom);
        if (!isNaN(styleZoom) && styleZoom > 0) return styleZoom;
        return 0.8;
    }, []);

    const updatePagePosition = useCallback(() => {
        if (lastClientX.current < 0) return;
        const zoom = getZoom();
        // Converte coordenadas da viewport e scroll para o espaço interno com zoom
        const pageX = lastClientX.current / zoom;
        const pageY = (lastClientY.current + window.scrollY) / zoom;
        cursorPageX.set(pageX);
        cursorPageY.set(pageY);
    }, [cursorPageX, cursorPageY, getZoom]);

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
                CAMADA 1: Cones de Luz Especular Contínuos (Full-Width, Sem Borda Oval)
                ══════════════════════════════════════════════════════════ */}

            {/* Cone 1 — Topo / Hero: Gradiente elíptico contínuo de 100% da largura */}
            <div
                className="absolute top-0 inset-x-0 h-[950px] pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 90% 70% at 50% 0%, rgba(56, 189, 248, 0.14) 0%, rgba(217, 119, 87, 0.06) 35%, transparent 75%)',
                }}
            />

            {/* Cone 2 — Centro / Portfólio: Iluminação suave difusa */}
            <div
                className="absolute top-[38%] inset-x-0 h-[850px] -translate-y-1/2 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255, 255, 255, 0.06) 0%, rgba(56, 189, 248, 0.02) 40%, transparent 70%)',
                }}
            />

            {/* Cone 3 — Rodapé / Terminal & Contato: Aura esmeralda/ciano sutil */}
            <div
                className="absolute bottom-0 inset-x-0 h-[750px] pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 85% 70% at 50% 100%, rgba(16, 185, 129, 0.08) 0%, rgba(56, 189, 248, 0.03) 40%, transparent 70%)',
                }}
            />

            {/* ══════════════════════════════════════════════════════════
                CAMADA 2: Spotlight Reativo ao Cursor (1:1 com Calibração de Zoom)
                ══════════════════════════════════════════════════════════ */}
            <motion.div
                className="absolute w-[520px] h-[520px] rounded-full pointer-events-none"
                style={{
                    left: springX,
                    top: springY,
                    x: '-50%',
                    y: '-50%',
                    background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.10) 0%, rgba(217, 119, 87, 0.04) 30%, transparent 70%)',
                    opacity: 0.5,
                }}
            />
        </div>
    );
}
