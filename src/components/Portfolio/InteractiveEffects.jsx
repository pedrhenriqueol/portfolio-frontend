import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * TiltCard — wrapper que aplica perspectiva 3D baseada na posição do mouse.
 */
export function TiltCard({ children, className = '', intensity = 12 }) {
    const cardRef = useRef(null);
    const [transform, setTransform] = useState('');

    const onMove = (e) => {
        const card = cardRef.current;
        if (!card) return;
        const rect   = card.getBoundingClientRect();
        const cx     = rect.left + rect.width  / 2;
        const cy     = rect.top  + rect.height / 2;
        const dx     = (e.clientX - cx) / (rect.width  / 2);
        const dy     = (e.clientY - cy) / (rect.height / 2);
        const rotY   =  dx * intensity;
        const rotX   = -dy * intensity;
        setTransform(`perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.04,1.04,1.04)`);
    };

    const onLeave = () => setTransform('perspective(700px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)');

    return (
        <div
            ref={cardRef}
            className={className}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{ transform, transition: 'transform 0.15s ease', transformStyle: 'preserve-3d' }}
        >
            {children}
        </div>
    );
}

/**
 * MagneticButton — o elemento é atraído sutilmente pelo cursor.
 */
export function MagneticButton({ children, className = '', strength = 0.35, ...props }) {
    const ref     = useRef(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const onMove = (e) => {
        const el   = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dx   = e.clientX - (rect.left + rect.width  / 2);
        const dy   = e.clientY - (rect.top  + rect.height / 2);
        setPos({ x: dx * strength, y: dy * strength });
    };

    const onLeave = () => setPos({ x: 0, y: 0 });

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            animate={{ x: pos.x, y: pos.y }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}
