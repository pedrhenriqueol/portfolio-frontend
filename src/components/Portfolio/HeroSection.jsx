import { useEffect, useRef, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { MagneticButton } from './InteractiveEffects';
import { useLanguage } from '../../context/LanguageContext';

const InteractiveTerminal = lazy(() => import('./InteractiveTerminal'));

export default function HeroSection() {
    const { t } = useLanguage();
    const sectionRef = useRef(null);
    const textRef   = useRef(null);
    const termRef   = useRef(null);
    const rafRef    = useRef(null);
    const isVisibleRef = useRef(true);
    const isRunningRef = useRef(false);
    const targetRef = useRef({ x: 0, y: 0 });
    const currRef   = useRef({ x: 0, y: 0 });

    // Parallax sob demanda — pausa quando ocioso ou fora da tela
    useEffect(() => {
        const lerp = (a, b, t) => a + (b - a) * t;

        const tick = () => {
            if (!isVisibleRef.current) {
                isRunningRef.current = false;
                return;
            }

            const tx = targetRef.current.x;
            const ty = targetRef.current.y;
            currRef.current.x = lerp(currRef.current.x, tx, 0.06);
            currRef.current.y = lerp(currRef.current.y, ty, 0.06);
            const cx = currRef.current.x;
            const cy = currRef.current.y;

            if (textRef.current) {
                textRef.current.style.transform = `translate3d(${cx * 0.08}px, ${cy * 0.08}px, 0)`;
            }
            if (termRef.current) {
                termRef.current.style.transform = `translate3d(${cx * -0.14}px, ${cy * -0.10}px, 0)`;
            }

            const dist = Math.abs(tx - cx) + Math.abs(ty - cy);
            if (dist > 0.01) {
                rafRef.current = requestAnimationFrame(tick);
            } else {
                isRunningRef.current = false;
            }
        };

        const startLoop = () => {
            if (!isRunningRef.current && isVisibleRef.current) {
                isRunningRef.current = true;
                rafRef.current = requestAnimationFrame(tick);
            }
        };

        const onMove = (e) => {
            const W = window.innerWidth;
            const H = window.innerHeight;
            targetRef.current = {
                x: ((e.clientX / W) - 0.5) * 24,
                y: ((e.clientY / H) - 0.5) * 16,
            };
            startLoop();
        };

        // Pausa animações se o Hero sair da viewport
        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisibleRef.current = entry.isIntersecting;
                if (entry.isIntersecting) {
                    startLoop();
                } else if (rafRef.current) {
                    cancelAnimationFrame(rafRef.current);
                    isRunningRef.current = false;
                }
            },
            { threshold: 0.05 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        window.addEventListener('mousemove', onMove, { passive: true });
        startLoop();

        return () => {
            window.removeEventListener('mousemove', onMove);
            observer.disconnect();
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <section
            id="home"
            ref={sectionRef}
            className="grid-bg pt-28 pb-16 md:pt-40 md:pb-24 bg-dark flex items-center justify-center min-h-[105vh] relative overflow-hidden contain-paint"
        >
            {/* Background blobs — otimizados para GPU */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-secondary/8 blur-[100px] rounded-full transform-gpu" />
                <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-accent/8 blur-[100px] rounded-full transform-gpu" />
            </div>

            {/* Floating particles — 100% aceleradas por GPU via CSS */}
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className="absolute rounded-full bg-secondary/15 pointer-events-none transform-gpu"
                    style={{
                        width: 8 + i * 5,
                        height: 8 + i * 5,
                        left: `${12 + i * 18}%`,
                        top: `${22 + (i % 3) * 22}%`,
                        animation: `float-particle ${3.5 + i * 0.6}s ease-in-out infinite`,
                        animationDelay: `${i * 0.8}s`,
                        willChange: 'transform, opacity',
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
                        <span className="text-accent text-[11px] font-semibold tracking-[0.25em] uppercase block font-sans">
                            {t('hero.ola')}
                        </span>

                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif text-white tracking-tight leading-tight min-h-[100px] sm:min-h-[120px] md:min-h-[140px]">
                            <TypeAnimation
                                sequence={['PEDRO\nHENRIQUE', 7000, '', 500]}
                                wrapper="span"
                                cursor={true}
                                repeat={Infinity}
                                style={{ whiteSpace: 'pre-line' }}
                                className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-accent inline-block font-serif"
                            />
                        </h1>

                        <h3 className="text-xl md:text-2xl text-gray-300 font-serif font-light">
                            {t('hero.developer')} <span className="text-accent italic font-serif">{t('hero.role')}</span>
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

                            {/* Download CV */}
                            <MagneticButton strength={0.3}>
                                <a
                                    href="/curriculo_pedro_henrique.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download="curriculo_pedro_henrique.pdf"
                                    className="inline-flex items-center gap-2 border border-primary/30 text-primary hover:text-accent hover:border-accent/50 font-semibold px-6 py-3 rounded-lg transition-all duration-300 text-sm cursor-pointer"
                                >
                                    <i className="fas fa-file-pdf text-accent" />
                                    {t('hero.downloadCV') || 'Download CV'}
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

                    {/* Terminal interativo com Lazy Loading & Suspense */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                        className="flex-1 flex justify-center md:justify-end"
                        ref={termRef}
                    >
                        <div className="relative w-full max-w-[400px]">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-secondary/6 blur-[80px] rounded-full pointer-events-none" />
                            <Suspense fallback={
                                <div className="w-full h-[420px] rounded-xl bg-darker/90 border border-white/10 p-4 flex flex-col justify-between animate-pulse">
                                    <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                                        <div className="w-3 h-3 rounded-full bg-white/20" />
                                        <div className="w-3 h-3 rounded-full bg-white/20" />
                                        <div className="w-3 h-3 rounded-full bg-white/20" />
                                        <div className="w-24 h-3 rounded bg-white/10 ml-auto" />
                                    </div>
                                    <div className="space-y-3 py-4 flex-grow">
                                        <div className="w-3/4 h-3 rounded bg-white/10" />
                                        <div className="w-1/2 h-3 rounded bg-white/10" />
                                        <div className="w-5/6 h-3 rounded bg-white/10" />
                                    </div>
                                    <div className="w-full h-8 rounded bg-white/10" />
                                </div>
                            }>
                                <InteractiveTerminal />
                            </Suspense>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
