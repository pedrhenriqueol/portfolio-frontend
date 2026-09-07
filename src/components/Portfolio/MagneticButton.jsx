import React, { useRef, useCallback, memo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { playMechanicalClick } from '../../lib/sound';

/**
 * MagneticButton — Rauno Freiberg-inspired Magnetic Attraction with Mass Physics
 *
 * - Element dynamically tracks cursor offset within a configurable proximity field.
 * - Spring interpolation: stiffness 220, damping 18, mass 0.6 (heavier, tactile feel).
 * - Elastic snapback with micro-rebound on mouse exit.
 * - Plays synthetic mechanical click haptics on interaction.
 * - Zero React re-renders: all position updates flow through MotionValues.
 * - Rect is cached on mouseEnter to eliminate layout thrashing on mousemove.
 */
const MagneticButton = memo(function MagneticButton({
    children,
    className = '',
    strength = 0.35,
    distance = 40,
    onClick,
    href,
    target,
    rel,
    as,
    playSound = true,
    ...props
}) {
    const ref = useRef(null);
    const rectRef = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Rauno-calibrated spring: heavier mass gives tactile weight
    const springConfig = { stiffness: 220, damping: 18, mass: 0.6 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseEnter = useCallback(() => {
        if (ref.current) {
            rectRef.current = ref.current.getBoundingClientRect();
        }
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (!rectRef.current) return;
        const rect = rectRef.current;
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
        rectRef.current = null;
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
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileTap={{ scale: 0.97 }}
            style={{ x: springX, y: springY }}
            className={`inline-flex items-center justify-center cursor-pointer will-change-transform ${className}`}
            {...props}
        >
            {children}
        </MotionComponent>
    );
});

export default MagneticButton;
