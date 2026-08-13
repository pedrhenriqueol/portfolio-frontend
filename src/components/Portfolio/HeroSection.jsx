import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { MagneticButton } from './InteractiveEffects';
import { useLanguage } from '../../context/LanguageContext';

export default function HeroSection() {
    const { t } = useLanguage();
    const textRef   = useRef(null);
    const termRef   = useRef(null);
    const rafRef    = useRef(null);
    const targetRef = useRef({ x: 0, y: 0 });
    const currRef   = useRef({ x: 0, y: 0 });

    // Parallax totalmente fora do React state — zero re-renders
    useEffect(() => {
        const onMove = (e) => {
            const { innerWidth: W, innerHeight: H } = window;
            targetRef.current = {
                x: ((e.clientX / W) - 0.5) * 24,
                y: ((e.clientY / H) - 0.5) * 16,
            };
        };

        const lerp = (a, b, t) => a + (b - a) * t;

        const tick = () => {
            const tx = targetRef.current.x;
            const ty = targetRef.current.y;
            currRef.current.x = lerp(currRef.current.x, tx, 0.06);
            currRef.current.y = lerp(currRef.current.y, ty, 0.06);
            const cx = currRef.current.x;
            const cy = currRef.current.y;

            if (textRef.current) {
                textRef.current.style.transform = `translate(${cx * 0.08}px, ${cy * 0.08}px)`;
            }
            if (termRef.current) {
                termRef.current.style.transform = `translate(${cx * -0.14}px, ${cy * -0.10}px)`;
            }
            rafRef.current = requestAnimationFrame(tick);
        };

        window.addEventListener('mousemove', onMove, { passive: true });
        rafRef.current = requestAnimationFrame(tick);
        return () => {
            window.removeEventListener('mousemove', onMove);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <section
            id="home"
            className="grid-bg pt-32 pb-20 md:pt-48 md:pb-32 bg-dark flex items-center justify-center min-h-[125vh] relative overflow-hidden"
        >
            {/* Background blobs — estáticos, sem parallax em React state */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-secondary/8 blur-[160px] rounded-full" />
                <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-accent/8 blur-[160px] rounded-full" />
            </div>

            {/* Floating particles — apenas 3, mais leves */}
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-secondary/15 pointer-events-none"
                    style={{
                        width:  8 + i * 5,
                        height: 8 + i * 5,
                        left:   `${12 + i * 18}%`,
                        top:    `${22 + (i % 3) * 22}%`,
                    }}
                    animate={{
                        y:       [0, -16, 0],
                        opacity: [0.25, 0.55, 0.25],
                    }}
                    transition={{
                        duration: 3.5 + i * 0.6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.8,
                    }}
                />
            ))}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="flex flex-col md:flex-row items-center gap-12">

                    {/* Text — parallax via DOM direto */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="flex-1 text-center md:text-left space-y-6"
                        ref={textRef}
                    >
                        <h2 className="text-accent font-semibold tracking-wider uppercase text-sm md:text-base">
                            {t('hero.ola')}
                        </h2>

                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight min-h-[100px] sm:min-h-[120px] md:min-h-[140px]">
                            <TypeAnimation
                                sequence={['PEDRO\nHENRIQUE', 7000, '', 500]}
                                wrapper="span"
                                cursor={true}
                                repeat={Infinity}
                                style={{ whiteSpace: 'pre-line' }}
                                className="text-transparent bg-clip-text bg-gradient-to-r from-white to-accent inline-block"
                            />
                        </h1>

                        <h3 className="text-xl md:text-3xl text-gray-300 font-light">
                            {t('hero.developer')} <span className="text-accent font-semibold">{t('hero.role')}</span>
                        </h3>

                        <p className="text-gray-400 max-w-lg mx-auto md:mx-0 text-lg leading-relaxed">
                            {t('hero.description')}{' '}
                            <strong className="text-white font-semibold">Delphi (Desktop/UniGui)</strong>,{' '}
                            <strong className="text-white font-semibold">PHP/Laravel</strong> e{' '}
                            <strong className="text-white font-semibold">React</strong>.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start items-center">
                            <MagneticButton strength={0.4}>
                                <a
                                    href="#projetos"
                                    className="inline-block bg-accent text-darker font-semibold px-8 py-3 rounded-lg hover:bg-accent-hover transition-all duration-300"
                                >
                                    {t('hero.verProjetos')}
                                </a>
                            </MagneticButton>

                            <div className="flex justify-center gap-3">
                                {[
                                    {
                                        href: 'https://github.com/pedrhenriqueol',
                                        label: 'GitHub',
                                        icon: (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                                <path d="M9 18c-4.51 2-5-2-7-2" />
                                            </svg>
                                        ),
                                    },
                                    {
                                        href: 'https://www.linkedin.com/in/pedro-henrique-b0a015391/',
                                        label: 'LinkedIn',
                                        icon: (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                                <rect x="2" y="9" width="4" height="12" />
                                                <circle cx="4" cy="4" r="2" />
                                            </svg>
                                        ),
                                    },
                                    {
                                        href: 'https://www.instagram.com/pedrherg',
                                        label: 'Instagram',
                                        icon: <i className="fab fa-instagram text-xl" />,
                                    },
                                ].map(({ href, label, icon }) => (
                                    <MagneticButton key={label} strength={0.5}>
                                        <a
                                            href={href}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={label}
                                            className="flex items-center justify-center w-12 h-12 bg-darker border border-white/10 text-gray-300 rounded-lg hover:border-accent/60 hover:text-accent transition-all duration-300 shadow-lg"
                                        >
                                            {icon}
                                        </a>
                                    </MagneticButton>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Terminal — parallax via DOM direto */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                        className="flex-1 flex justify-center md:justify-end"
                        ref={termRef}
                    >
                        <div className="relative w-full max-w-[360px]">
                            {/* Ambient glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-secondary/6 blur-[80px] rounded-full pointer-events-none" />

                            {/* Terminal window */}
                            <div data-no-morph="true" className="relative bg-[#0d0f14]/95 border border-white/8 rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
                                {/* Title bar */}
                                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-dark/60">
                                    <span className="w-3 h-3 rounded-full bg-red-400/70" />
                                    <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
                                    <span className="w-3 h-3 rounded-full bg-green-400/70" />
                                    <span className="ml-2 text-xs text-gray-600 font-mono">portfolio.js</span>
                                    <span className="ml-auto flex items-center gap-1.5 text-xs font-mono">
                                        <motion.span
                                            animate={{ opacity: [1, 0.3, 1] }}
                                            transition={{ duration: 2.5, repeat: Infinity }}
                                            className="w-1.5 h-1.5 rounded-full bg-accent inline-block"
                                        />
                                        <span className="text-accent/50">live</span>
                                    </span>
                                </div>

                                {/* Code lines */}
                                <div className="p-6 font-mono text-[13px] leading-relaxed space-y-0.5">
                                    {[
                                        { text: 'const developer = {',           color: 'text-gray-300',      delay: 0.4 },
                                        { text: '  name: "Pedro Henrique",',     color: 'text-emerald-400/80',delay: 0.65 },
                                        { text: `  role: "${t('hero.terminal.role')}",`, color: 'text-blue-400/80',   delay: 0.9 },
                                        { text: '  stack: [',                    color: 'text-gray-400',      delay: 1.1 },
                                        { text: '    "Delphi + UniGui",',        color: 'text-yellow-300/80', delay: 1.3 },
                                        { text: '    "PHP / Laravel",',          color: 'text-red-400/80',    delay: 1.5 },
                                        { text: '    "React + TypeScript",',     color: 'text-cyan-400/80',   delay: 1.7 },
                                        { text: '  ],',                          color: 'text-gray-400',      delay: 1.9 },
                                        { text: `  ${t('hero.terminal.available')}`,     color: 'text-secondary',     delay: 2.1 },
                                        { text: '}',                             color: 'text-gray-300',      delay: 2.3 },
                                    ].map(({ text, color, delay }) => (
                                        <motion.div
                                            key={text}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1,  x: 0   }}
                                            transition={{ delay, duration: 0.3 }}
                                            className={`${color} block`}
                                        >
                                            {text}
                                        </motion.div>
                                    ))}

                                    {/* Blinking cursor line */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 2.5 }}
                                        className="flex items-center gap-1.5 pt-2 text-accent/50 text-xs"
                                    >
                                        <span className="text-accent/40">{'>'}</span>
                                        <motion.span
                                            animate={{ opacity: [1, 0, 1] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                            className="inline-block w-[7px] h-[15px] bg-accent/70 rounded-[2px] align-middle"
                                        />
                                    </motion.div>
                                </div>

                                {/* Bottom status bar */}
                                <div className="flex items-center gap-3 px-4 py-2 border-t border-white/5 bg-dark/40 text-[10px] font-mono text-gray-600">
                                    <span className="text-accent/50">⬡ JavaScript</span>
                                    <span className="ml-auto">UTF-8</span>
                                    <span>Ln 10</span>
                                </div>
                            </div>

                            {/* Floating tech badges */}
                            {[
                                { label: 'Delphi',      pos: '-top-4 left-4',     delay: 2.4, color: '#C9A84C' },
                                { label: 'Laravel',     pos: '-top-4 right-6',    delay: 2.6, color: '#FF4444' },
                                { label: 'React',       pos: '-bottom-4 left-6',  delay: 2.8, color: '#61DAFB' },
                                { label: 'TypeScript',  pos: '-bottom-4 right-4', delay: 3.0, color: '#A78BFA' },
                            ].map(({ label, pos, delay, color }) => (
                                <motion.span
                                    key={label}
                                    initial={{ opacity: 0, scale: 0.5, y: 8 }}
                                    animate={{ opacity: 1, scale: 1,   y: 0 }}
                                    transition={{ delay, type: 'spring', stiffness: 260, damping: 24 }}
                                    className={`absolute ${pos} text-[11px] font-bold px-3 py-1 rounded-full border backdrop-blur-md`}
                                    style={{
                                        color,
                                        borderColor: `${color}40`,
                                        background:  `${color}12`,
                                        boxShadow:   'none',
                                    }}
                                >
                                    {label}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
