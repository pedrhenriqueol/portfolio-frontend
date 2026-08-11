import { useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * TiltCard — perspectiva 3D sem useState (manipula DOM direto).
 */
export function TiltCard({ children, className = '', intensity = 10, onClick }) {
    const cardRef = useRef(null);

    const onMove = (e) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const dx   = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
        const dy   = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
        const rotY =  dx * intensity;
        const rotX = -dy * intensity;
        card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03,1.03,1.03)`;
    };

    const onLeave = () => {
        const card = cardRef.current;
        if (!card) return;
        card.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    };

    return (
        <div
            ref={cardRef}
            className={className}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            onClick={onClick}
            style={{ transition: 'transform 0.18s ease', transformStyle: 'preserve-3d' }}
        >
            {children}
        </div>
    );
}

/**
 * MagneticButton — atração magnética sem useState (RAF + DOM direto).
 */
export function MagneticButton({ children, className = '', strength = 0.35, ...props }) {
    const ref    = useRef(null);
    const posRef = useRef({ x: 0, y: 0 });
    const rafRef = useRef(null);

    const onMove = (e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        posRef.current = {
            x: (e.clientX - (rect.left + rect.width  / 2)) * strength,
            y: (e.clientY - (rect.top  + rect.height / 2)) * strength,
        };
        if (!rafRef.current) {
            rafRef.current = requestAnimationFrame(applyPos);
        }
    };

    const applyPos = () => {
        rafRef.current = null;
        const el = ref.current;
        if (!el) return;
        el.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
    };

    const onLeave = () => {
        posRef.current = { x: 0, y: 0 };
        const el = ref.current;
        if (el) el.style.transform = 'translate(0px, 0px)';
        if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    };

    return (
        <div
            ref={ref}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className={className}
            style={{ transition: 'transform 0.25s ease', display: 'inline-block' }}
            {...props}
        >
            {children}
        </div>
    );
}
