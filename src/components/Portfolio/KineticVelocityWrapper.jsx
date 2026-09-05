import React from 'react';
import { motion, useScroll, useVelocity, useSpring, useTransform } from 'framer-motion';

/**
 * KineticVelocityWrapper - Jesper Landberg-inspired Velocity-sensitive Kinetics
 * 
 * - Monitors natural viewport vertical scroll velocity.
 * - Applies subtle inertial skew and scale compression during high-speed scrolling.
 * - Restores to 1.0 with damped spring physics as soon as scrolling halts.
 * - Zero scroll hijacking: native scroll remains 100% untouched.
 */
export default function KineticVelocityWrapper({ children, className = '' }) {
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);

    // Mola altamente amortecida para suavizar ruído de rolagem rápida
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 45,
        stiffness: 350,
        mass: 0.5,
    });

    // Compressão de escala sutil (mínimo 0.98 em scroll rápido)
    const scale = useTransform(smoothVelocity, [-3000, 0, 3000], [0.98, 1, 0.98]);

    // Deformação angular sutil (skew) que responde à direção do scroll (máximo ±1.2°)
    const skewY = useTransform(smoothVelocity, [-3000, 0, 3000], [-1.2, 0, 1.2]);

    return (
        <motion.div
            style={{ scale, skewY }}
            className={`will-change-transform ${className}`}
        >
            {children}
        </motion.div>
    );
}
