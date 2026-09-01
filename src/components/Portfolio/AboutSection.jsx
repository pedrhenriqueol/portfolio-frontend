import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

/* ── Relógio ao vivo de Fortaleza (UTC-3) com pausa inteligente em segundo plano ── */
function LiveClock({ lang }) {
    const [time, setTime] = useState('');

    useEffect(() => {
        const locale = lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : 'pt-BR';
        let timer = null;

        const update = () => {
            if (document.hidden) return;
            setTime(
                new Date().toLocaleTimeString(locale, {
                    timeZone: 'America/Fortaleza',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                })
            );
        };

        const startTimer = () => {
            if (!timer) {
                update();
                timer = setInterval(update, 1000);
            }
        };

        const stopTimer = () => {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        };

        startTimer();

        const onVisChange = () => {
            if (document.hidden) {
                stopTimer();
            } else {
                startTimer();
            }
        };

        document.addEventListener('visibilitychange', onVisChange, { passive: true });

        return () => {
            stopTimer();
            document.removeEventListener('visibilitychange', onVisChange);
        };
    }, [lang]);

    return <span className="tabular-nums font-mono font-bold text-white text-xl sm:text-2xl">{time || '10:00:00'}</span>;
}

export default function AboutSection() {
    const { t, lang } = useLanguage();

    const metrics = [
        { value: '10+', label: t('about.highlights')?.[0] || (lang === 'en' ? '10+ months experience' : '10+ meses de experiência'), icon: 'fas fa-briefcase' },
        { value: '100+', label: t('about.highlights')?.[1] || (lang === 'en' ? '100+ daily active users' : '100+ usuários diários'), icon: 'fas fa-users' },
        { value: '4×', label: t('about.highlights')?.[3] || (lang === 'en' ? 'Faster query execution' : 'Queries mais rápidas'), icon: 'fas fa-tachometer-alt' },
        { value: '100%', label: lang === 'en' ? 'Fiscal compliance (ACBr)' : lang === 'es' ? 'Cumplimiento fiscal (ACBr)' : 'Conformidade fiscal (ACBr)', icon: 'fas fa-check-double' },
    ];

    const pillars = [
        {
            icon: 'fas fa-laptop-code',
            title: lang === 'en' ? 'Fullstack & Modernization' : lang === 'es' ? 'Fullstack y Modernización' : 'Fullstack & Modernização',
            desc: lang === 'en'
                ? 'Expert in transitioning legacy monoliths into modern SPAs and decoupled RESTful APIs.'
                : lang === 'es'
                ? 'Especialista en migración de monolitos heredados a SPAs modernas y APIs REST desacopladas.'
                : 'Especialista em transição de monolitos legados para SPAs modernas e APIs REST desacopladas.',
            tags: ['Delphi 11', 'UniGui', 'Laravel', 'React', 'TypeScript', 'Tailwind'],
        },
        {
            icon: 'fas fa-database',
            title: lang === 'en' ? 'Databases & Performance' : lang === 'es' ? 'Bases de Datos y Rendimiento' : 'Bancos de Dados & Performance',
            desc: lang === 'en'
                ? 'Critical query refactoring (N+1 resolution), smart indexing and transactional integrity.'
                : lang === 'es'
                ? 'Refactorización crítica de consultas N+1, indexación inteligente e integridad transaccional.'
                : 'Refatoração de queries críticas N+1, indexação inteligente e garantia de integridade transacional.',
            tags: ['SQL Server', 'MySQL', 'PostgreSQL', 'Indexação', 'Tuning'],
        },
        {
            icon: 'fas fa-shield-alt',
            title: lang === 'en' ? 'QA & Mission-Critical Systems' : lang === 'es' ? 'QA y Sistemas Críticos' : 'QA & Sistemas Críticos',
            desc: lang === 'en'
                ? 'Requirements engineering, automated/manual tests via Postman and regression protection.'
                : lang === 'es'
                ? 'Ingeniería de requisitos, pruebas automatizadas/manuales con Postman y blindaje contra regresiones.'
                : 'Engenharia de requisitos, testes automatizados/manuais via Postman e blindagem contra regressões.',
            tags: ['Postman', 'Testes Funcionais', 'Scrum / Kanban', 'ZPEs / Portos'],
        },
    ];

    return (
        <section id="sobre" className="grid-bg py-20 md:py-24 bg-darker relative border-t border-primary/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Section Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.7 }}
                    className="text-center md:text-left mb-14"
                >
                    <span className="text-accent text-[11px] font-semibold tracking-[0.25em] uppercase mb-2 block font-sans">
                        {t('about.tag')}
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-3">
                        {t('about.title')}
                    </h2>
                    <p className="text-gray-400 max-w-2xl font-sans text-sm sm:text-base">
                        {t('about.subtitle') || 'Engenharia de software focada em modernização, alta disponibilidade e impacto real em produção.'}
                    </p>
                </motion.div>

                {/* ── Bento Grid Estruturado ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

                    {/* 1. Card Principal de Bio & Métricas (7 Colunas) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        data-cursor-card="true"
                        className="lg:col-span-7 bg-dark border border-primary/30 rounded-2xl p-7 sm:p-9 relative flex flex-col justify-between hover:border-accent/40 transition-all duration-300 shadow-xl cursor-default"
                    >
                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider font-sans">
                                    <i className="fas fa-terminal text-[11px]" />
                                    {t('about.resumoTitle')}
                                </span>
                                <span className="inline-flex items-center gap-2 bg-secondary/5 border border-secondary/20 px-3 py-1 rounded-full text-xs font-medium text-secondary">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    {lang === 'en' ? 'Available' : lang === 'es' ? 'Disponible' : 'Disponível'}
                                </span>
                            </div>

                            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                                {t('about.resumo1')}{' '}
                                <span className="text-secondary font-semibold">{t('about.resumo1_highlight1')}</span>{' '}
                                {t('about.resumo1_rest')}{' '}
                                <span className="text-secondary font-semibold">{t('about.resumo1_highlight2')}</span>
                            </p>

                            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                                {t('about.resumo2')}{' '}
                                <span className="text-white font-semibold">Delphi (Desktop &amp; UniGui)</span>,{' '}
                                <span className="text-white font-semibold">PHP/Laravel</span>,{' '}
                                <span className="text-white font-semibold">React + TypeScript</span> e{' '}
                                <span className="text-white font-semibold">Tailwind CSS</span>. {t('about.resumo2_rest')}{' '}
                                <span className="text-secondary font-semibold">{t('about.resumo2_highlight')}</span>{' '}
                                {t('about.resumo2_final')}
                            </p>

                            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                                {t('about.resumo3')}{' '}
                                <span className="text-secondary font-semibold">{t('about.resumo3_highlight')}</span>{' '}
                                {t('about.resumo3_final')} {t('about.resumo4')}{' '}
                                <span className="text-secondary font-semibold">{t('about.resumo4_highlight1')}</span>{' '}
                                {t('about.resumo4_rest')}{' '}
                                <span className="text-secondary font-semibold">{t('about.resumo4_highlight2')}</span>
                            </p>
                        </div>

                        {/* Strip de Mini-métricas */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/5">
                            {metrics.map((m, i) => (
                                <div key={i} className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-1">
                                        <i className={`${m.icon} text-accent text-xs`} />
                                        <span className="font-mono font-bold text-white text-base sm:text-lg">{m.value}</span>
                                    </div>
                                    <span className="text-[11px] text-gray-400 font-sans leading-tight">{m.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* 2. Coluna Lateral Direita (5 Colunas) */}
                    <div className="lg:col-span-5 flex flex-col gap-6">

                        {/* Card Educação */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            data-cursor-card="true"
                            className="bg-dark border border-primary/30 rounded-2xl p-7 hover:border-accent/40 transition-all duration-300 shadow-xl flex flex-col justify-between cursor-default"
                        >
                            <span className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider font-sans mb-4">
                                <i className="fas fa-graduation-cap text-[11px]" />
                                {t('about.educacaoTitle')}
                            </span>

                            <div className="space-y-4">
                                <div className="border-l-2 border-accent/60 pl-4 space-y-0.5">
                                    <h4 className="text-sm sm:text-base font-bold text-white font-serif">{t('about.edu1Title')}</h4>
                                    <p className="text-xs text-primary/80 font-mono">{t('about.edu1Desc')}</p>
                                </div>
                                <div className="border-l-2 border-primary/30 pl-4 space-y-0.5">
                                    <h4 className="text-sm sm:text-base font-bold text-white font-serif">{t('about.edu2Title')}</h4>
                                    <p className="text-xs text-primary/80 font-mono">{t('about.edu2Desc')}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Card Localização & Fuso Horário ao Vivo */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            data-cursor-card="true"
                            className="bg-dark border border-primary/30 rounded-2xl p-7 hover:border-accent/40 transition-all duration-300 shadow-xl flex items-center justify-between cursor-default"
                        >
                            <div>
                                <span className="text-[10px] font-mono uppercase tracking-widest text-primary/60 block mb-1">
                                    {lang === 'en' ? 'LOCAL TIME (UTC-3)' : lang === 'es' ? 'HORA LOCAL (UTC-3)' : 'HORA LOCAL (UTC-3)'}
                                </span>
                                <LiveClock lang={lang} />
                                <span className="text-xs text-primary/80 font-mono block mt-1">Fortaleza, CE — Brasil</span>
                            </div>

                            <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                                <i className="fas fa-clock text-accent text-lg" />
                            </div>
                        </motion.div>

                    </div>
                </div>

                {/* ── 3 Pilares de Atuação Técnica ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {pillars.map((p, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            data-cursor-card="true"
                            className="bg-dark/80 border border-primary/20 rounded-2xl p-6 hover:border-accent/50 transition-all duration-300 shadow-lg flex flex-col justify-between group cursor-default"
                        >
                            <div>
                                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200">
                                    <i className={`${p.icon} text-accent text-sm`} />
                                </div>
                                <h4 className="text-lg font-bold text-white font-serif mb-2 group-hover:text-secondary transition-colors">
                                    {p.title}
                                </h4>
                                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">
                                    {p.desc}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                                {p.tags.map((tag, tIdx) => (
                                    <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-primary/70 border border-white/5">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
