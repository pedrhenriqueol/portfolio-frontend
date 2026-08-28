import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

/* ── Relógio ao vivo de Fortaleza (UTC-3) otimizado ── */
function LiveClock({ lang }) {
    const [time, setTime] = useState('');
    useEffect(() => {
        const locale = lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : 'pt-BR';
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
        update();
        const timer = setInterval(update, 1000);
        const onVisChange = () => { if (!document.hidden) update(); };
        document.addEventListener('visibilitychange', onVisChange, { passive: true });

        return () => {
            clearInterval(timer);
            document.removeEventListener('visibilitychange', onVisChange);
        };
    }, [lang]);

    return <span className="tabular-nums font-mono font-bold text-white text-xl sm:text-2xl">{time || '10:00:00'}</span>;
}

export default function AboutSection() {
    const { t, lang } = useLanguage();

    const metrics = [
        { value: '10+', label: t('about.highlights')[0] || '10+ meses de experiência', icon: 'fas fa-briefcase' },
        { value: '100+', label: t('about.highlights')[1] || '100+ usuários diários', icon: 'fas fa-users' },
        { value: '4×', label: t('about.highlights')[3] || 'Queries mais rápidas', icon: 'fas fa-tachometer-alt' },
        { value: '100%', label: 'Conformidade fiscal (ACBr)', icon: 'fas fa-check-double' },
    ];

    const pillars = [
        {
            icon: 'fas fa-laptop-code',
            title: 'Fullstack & Modernização',
            desc: 'Especialista em transição de monolitos legados para SPAs modernas e APIs REST desacopladas.',
            tags: ['Delphi 11', 'UniGui', 'Laravel', 'React', 'TypeScript', 'Tailwind'],
        },
        {
            icon: 'fas fa-database',
            title: 'Bancos de Dados & Performance',
            desc: 'Refatoração de queries críticas N+1, indexação inteligente e garantia de integridade transacional.',
            tags: ['SQL Server', 'MySQL', 'PostgreSQL', 'Indexação', 'Tuning'],
        },
        {
            icon: 'fas fa-shield-alt',
            title: 'QA & Sistemas Críticos',
            desc: 'Engenharia de requisitos, testes automatizados/manuais via Postman e blindagem contra regressões.',
            tags: ['Postman', 'Testes Funcionais', 'Scrum / Kanban', 'ZPEs / Portos'],
        },
    ];

    return (
        <section id="sobre" className="grid-bg py-24 bg-darker relative border-t border-primary/30">
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
                        className="lg:col-span-7 bg-dark border border-primary/30 rounded-2xl p-7 sm:p-9 relative flex flex-col justify-between hover:border-accent/40 transition-all duration-300 shadow-xl"
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

                            <p className="text-gray-400 text-sm leading-relaxed">
                                {t('about.resumo4')}{' '}
                                <span className="text-secondary font-semibold">{t('about.resumo4_highlight1')}</span>{' '}
                                {t('about.resumo4_rest')}{' '}
                                <span className="text-white font-semibold">{t('about.resumo4_highlight2')}</span>
                            </p>
                        </div>

                        {/* Strip de Métricas de Impacto */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-primary/20">
                            {metrics.map(({ value, label, icon }) => (
                                <div key={label} className="bg-darker/60 border border-primary/20 rounded-xl p-3 text-center">
                                    <i className={`${icon} text-accent text-xs mb-1.5 block opacity-80`} />
                                    <div className="text-lg font-bold text-white font-mono">{value}</div>
                                    <div className="text-[10px] text-gray-400 leading-tight mt-0.5">{label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* 2. Coluna Lateral (Localização & Educação) (5 Colunas) */}
                    <div className="lg:col-span-5 flex flex-col gap-6">

                        {/* Card: Localização & Horário ao Vivo */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="bg-dark border border-primary/30 rounded-2xl p-6 hover:border-accent/40 transition-all duration-300 shadow-xl flex items-center justify-between"
                        >
                            <div>
                                <div className="flex items-center gap-2 text-primary/70 text-xs font-semibold uppercase tracking-wider mb-1">
                                    <i className="fas fa-map-marker-alt text-accent text-xs" />
                                    Fortaleza, CE — Brasil
                                </div>
                                <div className="text-xs text-gray-400">{lang === 'en' ? 'Local Timezone (UTC-3)' : lang === 'es' ? 'Zona Horaria Local (UTC-3)' : 'Fuso Horário Local (UTC-3)'}</div>
                            </div>
                            <div className="text-right bg-darker/80 border border-primary/20 px-4 py-2 rounded-xl">
                                <LiveClock lang={lang} />
                                <span className="text-[10px] text-accent block font-mono">{lang === 'en' ? 'Official Time' : lang === 'es' ? 'Hora Oficial' : 'Horário Oficial'}</span>
                            </div>
                        </motion.div>

                        {/* Card: Educação & Formação Técnica */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-dark border border-primary/30 rounded-2xl p-6 hover:border-accent/40 transition-all duration-300 shadow-xl flex-1 flex flex-col justify-center space-y-4"
                        >
                            <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider font-sans">
                                <i className="fas fa-graduation-cap text-xs" />
                                {t('about.educacaoTitle') || 'Formação Acadêmica'}
                            </div>

                            <div className="space-y-3">
                                <div className="bg-darker/60 p-3.5 rounded-xl border border-primary/20 hover:border-secondary/30 transition-colors">
                                    <h4 className="font-bold text-white text-xs sm:text-sm">{t('about.edu1Title')}</h4>
                                    <p className="text-secondary text-[11px] mt-1 font-medium">{t('about.edu1Desc')}</p>
                                </div>
                                <div className="bg-darker/60 p-3.5 rounded-xl border border-primary/20 hover:border-secondary/30 transition-colors">
                                    <h4 className="font-bold text-white text-xs sm:text-sm">{t('about.edu2Title')}</h4>
                                    <p className="text-secondary text-[11px] mt-1 font-medium">{t('about.edu2Desc')}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* ── 3 Pilares de Especialidade (3 Colunas Perfeitamente Alinhadas) ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {pillars.map((pillar, idx) => (
                        <motion.div
                            key={pillar.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.15 * idx }}
                            className="bg-dark border border-primary/30 rounded-2xl p-6 hover:border-accent/40 transition-all duration-300 shadow-xl flex flex-col justify-between group"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 group-hover:bg-accent/20 transition-colors">
                                        <i className={`${pillar.icon} text-accent text-base`} />
                                    </span>
                                    <h3 className="text-base font-bold text-white group-hover:text-secondary transition-colors">
                                        {pillar.title}
                                    </h3>
                                </div>
                                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-5">
                                    {pillar.desc}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-1.5 pt-4 border-t border-primary/15">
                                {pillar.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-[11px] font-medium text-gray-300 bg-darker border border-primary/25 px-2.5 py-1 rounded-md"
                                    >
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
