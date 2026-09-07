import React, { type ReactNode } from 'react';
import { motion, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';

/**
 * KineticVelocityRig — Jesper Landberg Kinetic Scroll Deformation
 *
 * Monitors viewport scroll velocity and applies a proportional skewY deformation
 * to child content blocks, creating the signature "inertia lean" effect.
 *
 * Physics:
 *   - Velocity source: useScroll → useVelocity (px/s)
 *   - Mapping: [-3000, 0, 3000] px/s → [2.5, 0, -2.5] deg skewY
 *   - Return spring: stiffness 280, damping 24, mass 0.5 (critically damped organic)
 *   - Zero setState on scroll — pure MotionValue pipeline, zero React re-renders.
 *   - will-change: transform on container for GPU layer promotion.
 */

interface KineticVelocityRigProps {
    children: ReactNode;
    className?: string;
    /** Maximum skew angle in degrees (default: 2.5) */
    maxSkew?: number;
    /** Velocity threshold in px/s for full skew (default: 3000) */
    velocityRange?: number;
}

export default function KineticVelocityRig({
    children,
    className = '',
    maxSkew = 2.5,
    velocityRange = 3000,
}: KineticVelocityRigProps) {
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);

    // Map velocity to skew angle: scrolling DOWN → negative skew, UP → positive
    const rawSkew = useTransform(
        scrollVelocity,
        [-velocityRange, 0, velocityRange],
        [maxSkew, 0, -maxSkew]
    );

    // Spring return: organic deceleration, no fixed duration
    const smoothSkew = useSpring(rawSkew, {
        stiffness: 280,
        damping: 24,
        mass: 0.5,
    });

    return (
        <motion.div
            style={{
                skewY: smoothSkew,
                willChange: 'transform',
                transformOrigin: 'center center',
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
