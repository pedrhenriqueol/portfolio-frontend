import { useRef } from 'react';

/**
 * TiltCard — perspectiva 3D otimizada (sem getBoundingClientRect no mousemove).
 */
export function TiltCard({ children, className = '', intensity = 8, onClick }) {
    const cardRef = useRef(null);
    const rectRef = useRef(null);

    const onMouseEnter = (e) => {
        const card = cardRef.current;
        if (!card) return;
        rectRef.current = card.getBoundingClientRect();
    };

    const onMove = (e) => {
        const card = cardRef.current;
        if (!card || !rectRef.current) return;
        const rect = rectRef.current;
        const dx   = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
        const dy   = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
        const rotY =  dx * intensity;
        const rotX = -dy * intensity;
        card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;
    };

    const onLeave = () => {
        rectRef.current = null;
        const card = cardRef.current;
        if (!card) return;
        card.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    };

    return (
        <div
            ref={cardRef}
            className={className}
            onMouseEnter={onMouseEnter}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            onClick={onClick}
            style={{ transition: 'transform 0.15s ease', transformStyle: 'preserve-3d', willChange: 'transform' }}
        >
            {children}
        </div>
    );
}

/**
 * MagneticButton — atração magnética otimizada (rect cacheado no enter, sem reflow no move).
 */
export function MagneticButton({ children, className = '', strength = 0.35, ...props }) {
    const ref     = useRef(null);
    const posRef  = useRef({ x: 0, y: 0 });
    const rectRef = useRef(null);
    const rafRef  = useRef(null);

    const onMouseEnter = () => {
        const el = ref.current;
        if (!el) return;
        rectRef.current = el.getBoundingClientRect();
    };

    const onMove = (e) => {
        const el = ref.current;
        if (!el || !rectRef.current) return;
        const rect = rectRef.current;
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
        el.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
    };

    const onLeave = () => {
        rectRef.current = null;
        posRef.current = { x: 0, y: 0 };
        const el = ref.current;
        if (el) el.style.transform = 'translate3d(0px, 0px, 0)';
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
    };

    return (
        <div
            ref={ref}
            onMouseEnter={onMouseEnter}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className={className}
            style={{ transition: 'transform 0.2s ease', display: 'inline-block', willChange: 'transform' }}
            {...props}
        >
            {children}
        </div>
    );
}
