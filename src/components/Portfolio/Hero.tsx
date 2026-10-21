import React, { useEffect, useRef, lazy, Suspense } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import MagneticButton from './MagneticButton';
import { useLanguage } from '../../context/LanguageContext';
import { AboutIntro, type AboutSceneContent } from './AboutMe';
import { useHeroHandoff } from '../../hooks/useHeroHandoff';
import './scroll-transitions.css';

const InteractiveTerminal = lazy(() => import('./InteractiveTerminal'));

export type HeroProps = Pick<AboutSceneContent, 'profile' | 'credentials' | 'metrics'> & { isLoaded?: boolean };

export const Hero: React.FC<HeroProps> = ({ profile, credentials, metrics, isLoaded = true }) => {
    const { t, lang } = useLanguage();
    const reduceMotion = useReducedMotion();
    const sectionRef = useRef<HTMLElement | null>(null);
    useHeroHandoff(sectionRef);
    const textRef = useRef<HTMLDivElement | null>(null);
    const termRef = useRef<HTMLDivElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const isVisibleRef = useRef(true);
    const isRunningRef = useRef(false);
    const targetRef = useRef({ x: 0, y: 0 });
    const currRef = useRef({ x: 0, y: 0 });

    // Parallax sob demanda — otimizado por requestAnimationFrame
    useEffect(() => {
        if (reduceMotion || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
        const lerp = (a: number, b: number, factor: number) => a + (b - a) * factor;

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

        const onMove = (e: MouseEvent) => {
            const W = window.innerWidth;
            const H = window.innerHeight;
            targetRef.current = {
                x: ((e.clientX - W / 2) / (W / 2)) * 20,
                y: ((e.clientY - H / 2) / (H / 2)) * 20,
            };
            startLoop();
        };

        const onVisibilityChange = () => {
            if (document.hidden) {
                if (rafRef.current) {
                    cancelAnimationFrame(rafRef.current);
                    rafRef.current = null;
                }
                isRunningRef.current = false;
            } else if (isVisibleRef.current) {
                startLoop();
            }
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisibleRef.current = entry.isIntersecting;
                if (entry.isIntersecting && !document.hidden) {
                    startLoop();
                } else if (rafRef.current) {
                    cancelAnimationFrame(rafRef.current);
                    rafRef.current = null;
                    isRunningRef.current = false;
                }
            },
            { threshold: 0 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        window.addEventListener('mousemove', onMove, { passive: true });
        document.addEventListener('visibilitychange', onVisibilityChange);
        startLoop();

        return () => {
            window.removeEventListener('mousemove', onMove);
            document.removeEventListener('visibilitychange', onVisibilityChange);
            observer.disconnect();
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
            isRunningRef.current = false;
            textRef.current?.style.removeProperty('transform');
            termRef.current?.style.removeProperty('transform');
        };
    }, [reduceMotion]);

    return (
        <section
            id="home"
            ref={sectionRef}
            className="hero-story relative bg-transparent"
        >
            <div aria-hidden="true" className="hero-ambient absolute inset-0 z-0 pointer-events-none" />

            {/* Conteúdo Principal */}
            <div className="hero-stage relative z-10 w-full">
                {/* Grid Hero Calibrado: 5 colunas para Conteúdo Textual / 7 colunas para o Terminal Interativo */}
                <div className="hero-story-layout">

                    <div className="hero-copy-cell">
                    <div className="hero-copy-motion">
                    {/* Text Container com entrada cinemática limpa (5 colunas) */}
                    <motion.div
                        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                        animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: reduceMotion ? 0 : 20 }}
                        transition={{ duration: reduceMotion ? 0 : .75, ease: [.22, 1, .36, 1] }}
                        className="lg:col-span-5 text-center lg:text-left space-y-6 min-h-[420px] sm:min-h-[460px] flex flex-col justify-center"
                    >
                        <div ref={textRef} className="w-full space-y-6">
                            <span className="portfolio-eyebrow">
                                {lang === 'en'
                                    ? 'SOFTWARE ENGINEERING & QA'
                                    : lang === 'es'
                                    ? 'INGENIERÍA DE SOFTWARE & QA'
                                    : 'ENGENHARIA DE SOFTWARE & QA'}
                            </span>

                            {/* Stable identity; each line enters once, without a blinking loop. */}
                            <div className="min-h-[96px] sm:min-h-[130px] md:min-h-[160px] flex items-center">
                                <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif text-white tracking-tight leading-none">
                                    {['PEDRO', 'HENRIQUE'].map((line, index) => (
                                        <span key={line} className="hero-name-line block overflow-hidden">
                                            <motion.span
                                                className="block"
                                                initial={reduceMotion ? false : { y: '100%' }}
                                                animate={{ y: isLoaded || reduceMotion ? 0 : '100%' }}
                                                transition={{ duration: reduceMotion ? 0 : .9, delay: reduceMotion ? 0 : .1 + index * .12, ease: [.22, 1, .36, 1] }}
                                            >{line}</motion.span>
                                        </span>
                                    ))}
                                </h1>
                            </div>

                            <h3 className="text-xl md:text-2xl text-neutral-300 font-serif font-light">
                                {t('hero.developer')} <span className="text-white italic font-serif">{t('hero.role')}</span>
                            </h3>

                            <p className="portfolio-lede max-w-lg mx-auto lg:mx-0 min-h-[72px]">
                                {t('hero.description')}{' '}
                                <strong className="text-white font-medium">Delphi (Desktop/UniGui)</strong>,{' '}
                                <strong className="text-white font-medium">PHP/Laravel</strong>
                                {lang === 'en' ? ' and ' : lang === 'es' ? ' y ' : ' e '}
                                <strong className="text-white font-medium">React</strong>.
                            </p>

                            {/* Botões CTA com feedback tátil e padronização nobre de alta densidade */}
                            <div className="flex flex-col sm:flex-row gap-3.5 pt-4 justify-center lg:justify-start items-center">
                                <MagneticButton strength={0.35}>
                                    <a
                                        href="#projetos"
                                        data-cursor-morph="true"
                                        className="portfolio-button portfolio-button-primary font-mono font-semibold inline-flex items-center justify-center cursor-pointer"
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
                                        data-cursor-morph="true"
                                        className="portfolio-button font-mono font-medium inline-flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <i aria-hidden="true" className="fas fa-file-pdf text-neutral-400" />
                                        {t('hero.downloadCV') || 'Download CV'}
                                    </a>
                                </MagneticButton>

                                {/* Redes Sociais com mesmo chassi vítreo */}
                                <div className="flex justify-center gap-2.5">
                                    {[
                                        {
                                            href: 'https://github.com/pedrhenriqueol',
                                            label: 'GitHub',
                                            icon: (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                                    <path d="M9 18c-4.51 2-5-2-7-2" />
                                                </svg>
                                            ),
                                        },
                                        {
                                            href: 'https://www.linkedin.com/in/pedro-henrique-b0a015391/',
                                            label: 'LinkedIn',
                                            icon: (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                                    <rect x="2" y="9" width="4" height="12" />
                                                    <circle cx="4" cy="4" r="2" />
                                                </svg>
                                            ),
                                        },
                                    ].map((s, idx) => (
                                        <MagneticButton key={idx} strength={0.3}>
                                            <a
                                                href={s.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                data-cursor-morph="true"
                                                className="portfolio-control w-11 h-11 inline-flex items-center justify-center cursor-pointer"
                                                aria-label={s.label}
                                            >
                                                {s.icon}
                                            </a>
                                        </MagneticButton>
                                    ))}
                                </div>
                            </div>
                            <a href="#sobre" className="hero-scroll-cue mx-auto lg:mx-0 w-fit">
                                {lang === 'en' ? 'Scroll to explore' : lang === 'es' ? 'Desplázate para explorar' : 'Role para explorar'}
                                <span aria-hidden="true">↓</span>
                            </a>
                        </div>
                    </motion.div>

                    </div>
                    </div>

                    <div className="hero-terminal-rail">
                    <div className="hero-terminal-sticky">
                    <div className="hero-terminal-motion">
                    {/* Terminal interativo com Lazy Loading & Suspense (7 colunas) */}
                    <motion.div
                        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                        animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: reduceMotion ? 0 : 20 }}
                        transition={{ duration: reduceMotion ? 0 : .75, ease: [.22, 1, .36, 1], delay: reduceMotion ? 0 : .2 }}
                        className="lg:col-span-7 flex justify-center lg:justify-end w-full"
                    >
                        <div ref={termRef} className="w-full flex justify-center lg:justify-end">
                            <div id="terminal" className="relative w-full max-w-xl xl:max-w-2xl">
                                <Suspense fallback={
                                    <div className="w-full h-[500px] md:h-[540px] rounded-2xl bg-[#080a0f]/90 border border-white/10 p-6 flex flex-col justify-between animate-pulse">
                                        <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                                            <div className="w-24 h-3 rounded bg-white/10 ml-auto" />
                                        </div>
                                        <div className="space-y-4 py-6 flex-grow">
                                            <div className="w-3/4 h-3 rounded bg-white/10" />
                                            <div className="w-1/2 h-3 rounded bg-white/10" />
                                            <div className="w-5/6 h-3 rounded bg-white/10" />
                                        </div>
                                        <div className="w-full h-10 rounded bg-white/10" />
                                    </div>
                                }>
                                    <InteractiveTerminal />
                                </Suspense>
                            </div>
                        </div>
                    </motion.div>
                    </div>
                    </div>
                    </div>

                    <section id="about-details" aria-labelledby="about-heading" className="hero-intro-cell">
                        <div className="hero-intro-motion">
                            <AboutIntro anchorId={null} />
                            <div className="hero-profile-body">{profile}</div>
                        </div>
                    </section>
                    <div className="hero-credentials">{credentials}</div>
                    <div className="hero-metrics">{metrics}</div>
                </div>
            </div>
            <span id="sobre" className="hero-about-anchor" aria-hidden="true" />
        </section>
    );
};

export default React.memo(Hero);
