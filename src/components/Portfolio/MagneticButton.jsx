import React, { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { playMechanicalClick } from '../../lib/sound';

/**
 * MagneticButton - Rauno Freiberg-inspired Interface Craft & Magnetic Attraction
 * 
 * - Element dynamically tracks cursor offset within proximity.
 * - Smooth physical interpolation via Framer Motion spring physics (stiffness: 200, damping: 20).
 * - Instant snapback with subtle micro-rebound on mouse exit.
 * - Plays synthetic mechanical click haptics on user interaction.
 */
export default function MagneticButton({
    children,
    className = '',
    strength = 0.35,
    distance = 45,
    onClick,
    href,
    target,
    rel,
    as,
    playSound = true,
    ...props
}) {
    const ref = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 20, stiffness: 200, mass: 0.2 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = useCallback((e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const dist = Math.hypot(deltaX, deltaY);

        const activeRadius = Math.max(rect.width, rect.height) / 2 + distance;

        if (dist < activeRadius) {
            x.set(deltaX * strength);
            y.set(deltaY * strength);
        } else {
            x.set(0);
            y.set(0);
        }
    }, [distance, strength, x, y]);

    const handleMouseLeave = useCallback(() => {
        x.set(0);
        y.set(0);
    }, [x, y]);

    const handleClick = useCallback((e) => {
        if (playSound) {
            playMechanicalClick();
        }
        if (onClick) {
            onClick(e);
        }
    }, [onClick, playSound]);

    const resolvedTag = as || (href ? 'a' : (onClick ? 'button' : 'div'));
    const MotionComponent = resolvedTag === 'a' ? motion.a : (resolvedTag === 'button' ? motion.button : motion.div);

    return (
        <MotionComponent
            ref={ref}
            href={href}
            target={target}
            rel={rel}
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: springX, y: springY }}
            className={`inline-flex items-center justify-center cursor-pointer will-change-transform ${className}`}
            {...props}
        >
            {children}
        </MotionComponent>
    );
}
