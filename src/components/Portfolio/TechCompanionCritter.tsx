import React, { useRef, useState, useEffect, useCallback, memo } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { playMechanicalClick } from '../../lib/sound';

interface TechCompanionCritterProps {
    variant?: 'sentinel-timeline' | 'sentinel-contact' | 'inline';
    className?: string;
    captionPosition?: 'top' | 'bottom' | 'left' | 'right';
}

const MESSAGES = [
    'Zero regressões no build atual! 🚀',
    'Postman: 200 OK em todos os endpoints.',
    'Atenção: 0 vazamentos de memória na GPU.',
    'SQL Server: Query executada em 18ms.',
    'ZPE ePita: Integridade transacional 100% verificada.',
    'Delphi 11 + UniGui: modernização de legados ativa.',
    'Git status: working tree clean. Nada a temer! 👾',
    'Framer Motion: 60 FPS garantidos com molas suaves.',
];

/**
 * TechCompanionCritter — Mascote Minimalista Vetorial ("Tech Companion")
 * 
 * - SVG monocromático retro-cyber estilo droid com cavidade ocular e pupilas dinâmicas.
 * - Rastreamento Ocular:
 *   angle = Math.atan2(dy, dx)
 *   dist = Math.min(Math.hypot(dx, dy), maxRadius)
 *   pupilX = Math.cos(angle) * (dist / maxRadius) * maxTravel
 *   pupilY = Math.sin(angle) * (dist / maxRadius) * maxTravel
 * - Desempenho: throttled via requestAnimationFrame + desconexão quando fora de viewport (IntersectionObserver).
 * - Microinteração ao clique: salto elástico + balão de diálogo técnico pixel-art temporário.
 */
export const TechCompanionCritter: React.FC<TechCompanionCritterProps> = memo(({
    variant = 'inline',
    className = '',
    captionPosition = 'top',
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [currentMessage, setCurrentMessage] = useState<string | null>(null);
    const [isBlinking, setIsBlinking] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const blinkTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const rafRef = useRef<number | null>(null);

    // Motion values para deslocamento das pupilas
    const pupilXRaw = useMotionValue(0);
    const pupilYRaw = useMotionValue(0);

    const springConfig = { damping: 20, stiffness: 280, mass: 0.2 };
    const pupilX = useSpring(pupilXRaw, springConfig);
    const pupilY = useSpring(pupilYRaw, springConfig);

    // Ciclo de piscar periódico
    useEffect(() => {
        const scheduleBlink = () => {
            const nextBlinkIn = 3000 + Math.random() * 4000;
            blinkTimeoutRef.current = setTimeout(() => {
                setIsBlinking(true);
                setTimeout(() => {
                    setIsBlinking(false);
                    scheduleBlink();
                }, 140);
            }, nextBlinkIn);
        };

        scheduleBlink();
        return () => {
            if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
        };
    }, []);

    // IntersectionObserver para desativar listeners quando fora de tela
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Rastreamento trigonométrico do cursor
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isVisible || !containerRef.current) return;

        if (!rafRef.current) {
            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = null;
                if (!containerRef.current) return;

                const rect = containerRef.current.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const dx = e.clientX - centerX;
                const dy = e.clientY - centerY;
                const angle = Math.atan2(dy, dx);
                
                const maxRadius = 320;
                const maxTravel = 2.8; // Deslocamento máximo em pixels no interior do olho
                const distance = Math.min(Math.hypot(dx, dy), maxRadius);
                const travel = (distance / maxRadius) * maxTravel;

                pupilXRaw.set(Math.cos(angle) * travel);
                pupilYRaw.set(Math.sin(angle) * travel);
            });
        }
    }, [isVisible, pupilXRaw, pupilYRaw]);

    useEffect(() => {
        if (!isVisible) return;

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [isVisible, handleMouseMove]);

    // Clique e microinteração com fala temporária
    const handleClick = () => {
        playMechanicalClick();

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        // Seleciona mensagem aleatória diferente da atual
        const available = MESSAGES.filter(m => m !== currentMessage);
        const randomMsg = available[Math.floor(Math.random() * available.length)];
        setCurrentMessage(randomMsg);

        timeoutRef.current = setTimeout(() => {
            setCurrentMessage(null);
        }, 2800);
    };

    return (
        <div
            ref={containerRef}
            className={`relative inline-flex items-center justify-center select-none ${className}`}
        >
            {/* Balão de diálogo estilo Pixel-Art / Retro Telemetria */}
            <AnimatePresence>
                {currentMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: captionPosition === 'bottom' ? -8 : 8, scale: 0.85 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: captionPosition === 'bottom' ? -6 : 6, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                        className={`absolute z-50 pointer-events-none whitespace-nowrap px-3 py-1.5 rounded-lg bg-darker/95 border border-accent/40 shadow-xl shadow-black/60 backdrop-blur-md text-[11px] font-mono text-secondary tracking-wide flex items-center gap-1.5 ${
                            captionPosition === 'bottom'
                                ? 'top-full mt-2.5'
                                : captionPosition === 'left'
                                ? 'right-full mr-3'
                                : captionPosition === 'right'
                                ? 'left-full ml-3'
                                : 'bottom-full mb-2.5'
                        }`}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                        <span>{currentMessage}</span>
                        {/* Triângulo indicador do balão */}
                        <div
                            className={`absolute w-2 h-2 bg-darker border-accent/40 rotate-45 ${
                                captionPosition === 'bottom'
                                    ? '-top-1 left-1/2 -translate-x-1/2 border-t border-l'
                                    : captionPosition === 'left'
                                    ? '-right-1 top-1/2 -translate-y-1/2 border-t border-r'
                                    : captionPosition === 'right'
                                    ? '-left-1 top-1/2 -translate-y-1/2 border-b border-l'
                                    : '-bottom-1 left-1/2 -translate-x-1/2 border-b border-r'
                            }`}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Droid Mascote Interativo */}
            <motion.button
                onClick={handleClick}
                whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
                whileTap={{ scale: 0.82, y: 2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                data-cursor-morph="true"
                title="Tech Companion: clique para telemetria interativa"
                aria-label="Tech Companion Easter Egg"
                className="group relative flex items-center justify-center p-1.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-accent/40 hover:bg-white/[0.06] transition-colors duration-200 cursor-pointer focus:outline-hidden focus-visible:ring-1 focus-visible:ring-accent"
            >
                <svg
                    width="34"
                    height="34"
                    viewBox="0 0 34 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="overflow-visible"
                >
                    {/* Antena com LED luminoso */}
                    <path
                        d="M17 3V7"
                        stroke="#8C6A4A"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                    <circle
                        cx="17"
                        cy="2.5"
                        r="1.5"
                        fill="#F5EBE1"
                        className="group-hover:fill-accent transition-colors"
                    />
                    <circle
                        cx="17"
                        cy="2.5"
                        r="3"
                        fill="#8C6A4A"
                        fillOpacity="0.25"
                        className="animate-pulse"
                    />

                    {/* Chassis / Corpo do Cyber Droid */}
                    <rect
                        x="3.5"
                        y="7.5"
                        width="27"
                        height="23"
                        rx="7"
                        fill="#161311"
                        stroke="rgba(255, 255, 255, 0.15)"
                        strokeWidth="1.2"
                        className="group-hover:stroke-accent/60 transition-colors"
                    />

                    {/* Visor Recuado Escuro */}
                    <rect
                        x="6"
                        y="10.5"
                        width="22"
                        height="13"
                        rx="4.5"
                        fill="#0A0908"
                        stroke="rgba(140, 106, 74, 0.3)"
                        strokeWidth="0.8"
                    />

                    {/* Cavidade Ocular Esquerda */}
                    <rect
                        x="9"
                        y="13"
                        width="6"
                        height="8"
                        rx="3"
                        fill="#13100E"
                    />

                    {/* Pupila Esquerda com Mola e Rastreamento */}
                    {!isBlinking ? (
                        <motion.ellipse
                            cx="12"
                            cy="17"
                            rx="1.8"
                            ry="2.4"
                            style={{ x: pupilX, y: pupilY }}
                            fill="#66FCF1"
                            className="drop-shadow-[0_0_4px_rgba(102,252,241,0.8)]"
                        />
                    ) : (
                        <line
                            x1="9.5"
                            y1="17"
                            x2="14.5"
                            y2="17"
                            stroke="#66FCF1"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                        />
                    )}

                    {/* Cavidade Ocular Direita */}
                    <rect
                        x="19"
                        y="13"
                        width="6"
                        height="8"
                        rx="3"
                        fill="#13100E"
                    />

                    {/* Pupila Direita com Mola e Rastreamento */}
                    {!isBlinking ? (
                        <motion.ellipse
                            cx="22"
                            cy="17"
                            rx="1.8"
                            ry="2.4"
                            style={{ x: pupilX, y: pupilY }}
                            fill="#66FCF1"
                            className="drop-shadow-[0_0_4px_rgba(102,252,241,0.8)]"
                        />
                    ) : (
                        <line
                            x1="19.5"
                            y1="17"
                            x2="24.5"
                            y2="17"
                            stroke="#66FCF1"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                        />
                    )}

                    {/* Grade de Ventilação / Microfone no Queixo */}
                    <line x1="12" y1="27" x2="15" y2="27" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" />
                    <line x1="17" y1="27" x2="17" y2="27" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" />
                    <line x1="19" y1="27" x2="22" y2="27" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" />
                </svg>
            </motion.button>
        </div>
    );
});

export default TechCompanionCritter;
