import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

/* ── Bento Card base ── */
function BentoCard({ className = '', children, delay = 0, glowOnHover = true }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay, ease: [0.25, 0.1, 0.25, 1] }}
            className={`relative bg-dark border border-primary/30 rounded-2xl overflow-hidden transition-all duration-300 group
                ${glowOnHover ? 'hover:border-accent/40 hover:shadow-[0_0_30px_rgba(var(--color-accent-rgb),0.08)]' : ''}
                ${className}`}
        >
            {children}
        </motion.div>
    );
}

/* ── Live clock Fortaleza ── */
function LiveClock() {
    const [time, setTime] = useState('');
    useEffect(() => {
        const tick = () => {
            setTime(new Date().toLocaleTimeString('pt-BR', {
                timeZone: 'America/Fortaleza',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            }));
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);
    return <span className="tabular-nums">{time}</span>;
}

export default function AboutSection() {
    const { t } = useLanguage();

    const stats = [
        { value: '10+',   label: t('about.highlights')[0] || '10+ meses de experiência', icon: 'fas fa-briefcase' },
        { value: '100+',  label: t('about.highlights')[1] || '100+ usuários em produção', icon: 'fas fa-users' },
        { value: 'QA',    label: t('about.highlights')[2] || 'QA em missão crítica',     icon: 'fas fa-bug' },
        { value: '4×',    label: t('about.highlights')[3] || 'Queries 4× mais rápidas',  icon: 'fas fa-tachometer-alt' },
    ];

    const techStack = [
        { name: 'Delphi + UniGui', color: '#E74C3C' },
        { name: 'PHP / Laravel',   color: '#FF2D20' },
        { name: 'React',           color: '#61DAFB' },
        { name: 'TypeScript',      color: '#3178C6' },
        { name: 'MySQL',           color: '#4479A1' },
        { name: 'SQL Server',      color: '#CC2927' },
        { name: 'Docker',          color: '#2496ED' },
        { name: 'Tailwind CSS',    color: '#38BDF8' },
        { name: 'Git / GitHub',    color: '#F1502F' },
        { name: 'Node.js',         color: '#339933' },
    ];

    return (
        <section id="sobre" className="grid-bg py-24 bg-darker relative border-t border-primary/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section heading */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mb-14"
                >
                    <span className="text-accent text-[11px] font-semibold tracking-[0.25em] uppercase mb-2 block font-sans">
                        {t('about.tag')}
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white">
                        {t('about.title')}
                    </h2>
                </motion.div>

                {/* ── Bento Grid ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] gap-4">

                    {/* 1. Bio — 2×2 */}
                    <BentoCard className="col-span-2 row-span-2 p-7 flex flex-col justify-between" delay={0}>
                        <div>
                            <i className="fas fa-quote-left text-3xl text-secondary/20 mb-4 block" />
                            <h3 className="text-lg font-bold text-white mb-3">{t('about.resumoTitle')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed line-clamp-6">
                                {t('about.resumo1')}{' '}
                                <span className="text-secondary font-semibold">{t('about.resumo1_highlight1')}</span>{' '}
                                {t('about.resumo1_rest')}{' '}
                                <span className="text-secondary font-semibold">{t('about.resumo1_highlight2')}</span>
                                {' '}{t('about.resumo2')}{' '}
                                <span className="text-white font-semibold">Delphi, Laravel e React</span>.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
                            <span className="text-xs text-green-400 font-medium">Disponível para oportunidades</span>
                        </div>
                    </BentoCard>

                    {/* 2. Live Clock & Location — 1×1 */}
                    <BentoCard className="col-span-1 row-span-1 p-5 flex flex-col justify-between" delay={0.05}>
                        <div className="flex items-center gap-2 text-primary/60 text-xs">
                            <i className="fas fa-map-marker-alt text-accent text-[10px]" />
                            <span>Fortaleza, CE — BR</span>
                        </div>
                        <div>
                            <div className="text-2xl font-mono font-bold text-white tabular-nums">
                                <LiveClock />
                            </div>
                            <span className="text-[10px] text-primary/50 font-mono">UTC-3</span>
                        </div>
                    </BentoCard>

                    {/* 3. QA card — 1×1 */}
                    <BentoCard className="col-span-1 row-span-1 p-5 flex flex-col justify-center items-start gap-2" delay={0.1}>
                        <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                            <i className="fas fa-shield-alt text-accent text-sm" />
                        </div>
                        <p className="text-sm font-bold text-white">QA &amp; Testes</p>
                        <p className="text-xs text-primary/60 leading-relaxed">Postman · SQL Server · Scrum</p>
                    </BentoCard>

                    {/* 4. Stats — 2×1 */}
                    <BentoCard className="col-span-2 md:col-span-2 row-span-1 p-5 flex items-center gap-4" delay={0.12} glowOnHover={false}>
                        <div className="grid grid-cols-2 gap-3 w-full">
                            {stats.slice(0, 4).map(({ value, label, icon }) => (
                                <div key={label} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center shrink-0">
                                        <i className={`${icon} text-secondary text-xs`} />
                                    </div>
                                    <div>
                                        <div className="text-base font-bold text-white font-mono">{value}</div>
                                        <div className="text-[10px] text-primary/60 leading-tight">{label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </BentoCard>

                    {/* 5. Tech stack marquee — 2×1 */}
                    <BentoCard className="col-span-2 row-span-1 p-5 overflow-hidden" delay={0.18}>
                        <p className="text-[10px] uppercase tracking-widest text-primary/40 font-semibold mb-3">Stack</p>
                        <div className="flex gap-2 flex-wrap">
                            {techStack.map(({ name, color }) => (
                                <span
                                    key={name}
                                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full border text-white/80 hover:text-white transition-colors cursor-default"
                                    style={{ borderColor: `${color}40`, backgroundColor: `${color}12` }}
                                >
                                    {name}
                                </span>
                            ))}
                        </div>
                    </BentoCard>

                    {/* 6. Educação — 1×1 */}
                    <BentoCard className="col-span-2 md:col-span-1 row-span-1 p-5 flex flex-col justify-center gap-2" delay={0.2}>
                        <div className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/15 flex items-center justify-center mb-1">
                            <i className="fas fa-graduation-cap text-secondary text-sm" />
                        </div>
                        <p className="text-sm font-bold text-white leading-tight">{t('about.edu1Title')}</p>
                        <p className="text-[11px] text-primary/60">{t('about.edu1Desc')}</p>
                    </BentoCard>

                    {/* 7. Specialty cards — 1×1 */}
                    <BentoCard className="col-span-2 md:col-span-1 row-span-1 p-5 flex flex-col justify-center gap-2" delay={0.24}>
                        <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/15 flex items-center justify-center mb-1">
                            <i className="fas fa-layer-group text-accent text-sm" />
                        </div>
                        <p className="text-sm font-bold text-white">Modernização</p>
                        <p className="text-[11px] text-primary/60">Legado → Web • Delphi 6 → UniGui</p>
                    </BentoCard>

                </div>

                {/* Specialty cards expandidos — below grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {t('about.cards').map(({ icon, title, items }, idx) => (
                        <BentoCard key={title} className="p-6" delay={0.28 + idx * 0.06}>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-secondary/10 border border-secondary/20 group-hover:bg-secondary/20 transition-colors">
                                    <i className={`${icon} text-secondary`} />
                                </span>
                                <h3 className="text-sm font-bold text-white group-hover:text-secondary transition-colors">{title}</h3>
                            </div>
                            <ul className="space-y-1.5">
                                {items.map(item => (
                                    <li key={item} className="flex items-center gap-2 text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                                        <i className="fas fa-chevron-right text-accent/50 text-[9px]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </BentoCard>
                    ))}
                </div>

            </div>
        </section>
    );
}
