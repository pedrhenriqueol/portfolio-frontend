import React, { type ReactNode } from 'react';
import { motion, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';

/**
 * KineticVelocityRig — Jesper Landberg Kinetic Scroll Deformation Refatorado
 *
 * Arquitetura Cinemática de Duplo Estágio:
 * 1. Captura da velocidade bruta via useVelocity(scrollY).
 * 2. Filtro Passa-Baixa (Pre-Smoothing): useSpring inicial (stiffness: 140, damping: 18, mass: 0.2)
 *    absorvendo picos instantâneos gerados pelo mouse wheel (0 a 4.000 px/s em um único tick).
 * 3. Mapeamento cinemático suave: [-2400, 0, 2400] px/s -> [+1.8deg, 0deg, -1.8deg].
 * 4. Mola Final de Retorno Crítico: useSpring (stiffness: 260, damping: 30, mass: 0.4)
 *    para pouso firme e imediato sem overshoot nem micro-vibrações residuais.
 * 5. Compressão Dinâmica no Eixo Z: escala sutil (1.0 -> 0.992) proporcional à velocidade
 *    para acentuar sensação de inércia e profundidade tridimensional física.
 * 6. Contenção Espacial & Blindagem Tipográfica: casca externa fixa com overflow-x-clip
 *    e propriedades subpixel-antialiased + preserve-3d para nitidez cristalina.
 */

interface KineticVelocityRigProps {
    children: ReactNode;
    className?: string;
    /** Ângulo máximo de inclinação em graus (padrão: 1.8) */
    maxSkew?: number;
    /** Faixa de velocidade em px/s para saturação da inclinação (padrão: 2400) */
    velocityRange?: number;
}

export default function KineticVelocityRig({
    children,
    className = '',
    maxSkew = 1.8,
    velocityRange = 2400,
}: KineticVelocityRigProps) {
    const { scrollY } = useScroll();
    const rawVelocity = useVelocity(scrollY);

    // 1. Filtragem de Ruído de Velocidade (Filtro Passa-Baixa / Pre-Smoothing)
    // Absorve acelerações instantâneas de pulsos do mouse wheel antes da inclinação
    const smoothVelocity = useSpring(rawVelocity, {
        stiffness: 140,
        damping: 18,
        mass: 0.2,
    });

    // 2. Mapeamento cinemático de velocidade suavizada para ângulo de inclinação
    // Rolagem para baixo (velocidade > 0) -> inclinação negativa (-1.8deg)
    // Rolagem para cima (velocidade < 0) -> inclinação positiva (+1.8deg)
    const targetSkew = useTransform(
        smoothVelocity,
        [-velocityRange, 0, velocityRange],
        [maxSkew, 0, -maxSkew]
    );

    // 3. Mola Final de Retorno (Equilíbrio Crítico sem Overshoot)
    const skewY = useSpring(targetSkew, {
        stiffness: 260,
        damping: 30,
        mass: 0.4,
    });

    // 4. Compressão Dinâmica Sutil no Eixo Z (Scale)
    // Conforme a velocidade sobe, comprime suavemente a escala da viewport (1.0 -> 0.992)
    const targetScale = useTransform(
        smoothVelocity,
        [-velocityRange, 0, velocityRange],
        [0.992, 1, 0.992]
    );
    const scale = useSpring(targetScale, {
        stiffness: 260,
        damping: 30,
        mass: 0.4,
    });

    return (
        <div
            className={`w-full relative overflow-x-clip ${className}`}
            style={{ overflowX: 'clip' }}
        >
            <motion.div
                style={{
                    skewY,
                    scale,
                    transformOrigin: '50% 50%',
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                    WebkitFontSmoothing: 'subpixel-antialiased',
                    willChange: 'transform',
                }}
                className="w-full relative px-0.5 sm:px-1.5"
            >
                {children}
            </motion.div>
        </div>
    );
}
