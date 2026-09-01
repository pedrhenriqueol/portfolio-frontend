import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

/** Faz highlight de métricas numéricas e termos técnicos-chave no texto */
function HighlightedText({ text }) {
    const pattern = /(\d+[\+\-]?\s*(?:ms|s|%|usuários|bugs|travamentos)?(?:\s*diários)?|<\d+ms|N\+1|100\+|8\+|Multi-tenant|RBAC)/g;
    const parts = text.split(pattern);
    return (
        <>
            {parts.map((part, i) =>
                pattern.test(part) ? (
                    <span key={i} className="text-secondary font-semibold font-mono">
                        {part}
                    </span>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </>
    );
}

export default function ExperienceSection({ experiences }) {
    const { t, lang } = useLanguage();

    const summaryStats = [
        {
            value: '10+ ' + (lang === 'en' ? 'Months' : 'Meses'),
            label: lang === 'en' ? 'Production experience' : lang === 'es' ? 'Experiencia en producción' : 'Experiência em produção',
            icon: 'fas fa-calendar-check'
        },
        {
            value: '100+ ' + (lang === 'en' ? 'Users' : lang === 'es' ? 'Usuarios' : 'Usuários'),
            label: lang === 'en' ? 'Daily on ERP systems' : lang === 'es' ? 'Diarios en sistemas ERP' : 'Diários em sistemas ERP',
            icon: 'fas fa-users'
        },
        {
            value: lang === 'en' ? '25% Fewer Bugs' : '25% Menos Bugs',
            label: lang === 'en' ? 'Via proactive QA' : lang === 'es' ? 'Vía QA preventivo' : 'Via QA preventivo',
            icon: 'fas fa-shield-alt'
        },
        {
            value: lang === 'en' ? '4× Faster' : lang === 'es' ? '4× Más Rápido' : '4× Mais Rápido',
            label: lang === 'en' ? 'Optimized queries (<500ms)' : lang === 'es' ? 'Consultas optimizadas (<500ms)' : 'Queries otimizadas (<500ms)',
            icon: 'fas fa-bolt'
        },
    ];

    return (
        <section id="experiencia" className="grid-bg py-20 md:py-24 bg-dark relative border-t border-primary/30">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Section Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-12"
                >
                    <span className="text-accent text-[11px] font-semibold tracking-[0.25em] uppercase mb-2 block font-sans">
                        {t('experience.tag')}
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-4">
                        {t('experience.title')}
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto font-sans text-sm sm:text-base">
                        {t('experience.subtitle')}
                    </p>
                </motion.div>

                {/* ── Career Summary Stats Strip ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14"
                >
                    {summaryStats.map((stat, idx) => (
                        <div
                            key={idx}
                            data-cursor-card="true"
                            className="bg-darker/90 border border-primary/25 rounded-xl p-4 flex items-center gap-3.5 hover:border-accent/40 transition-all duration-200 shadow-lg"
                        >
                            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                                <i className={`${stat.icon} text-accent text-sm`} />
                            </div>
                            <div>
                                <div className="text-sm sm:text-base font-bold text-white font-mono">{stat.value}</div>
                                <div className="text-[11px] text-gray-400 leading-tight font-sans">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* ── Timeline de Experiências ── */}
                <div className="space-y-8 relative">
                    {/* Linha vertical conectora */}
                    <div className="hidden md:block absolute left-8 top-6 bottom-6 w-[2px] bg-gradient-to-b from-accent via-secondary/40 to-primary/20 pointer-events-none" />

                    {experiences && experiences.length > 0 ? (
                        experiences.map((exp, expIdx) => {
                            const isCurrent = exp.id === 2 || (exp.period && (exp.period.toLowerCase().includes('presente') || exp.period.toLowerCase().includes('present')));

                            return (
                                <motion.div
                                    key={exp.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-50px' }}
                                    transition={{ duration: 0.6, delay: expIdx * 0.15 }}
                                    className="relative md:pl-20"
                                >
                                    {/* Marcador na linha do tempo (Desktop) */}
                                    <div className="hidden md:flex absolute left-6 top-8 -translate-x-1/2 w-8 h-8 rounded-full bg-darker border-2 border-accent items-center justify-center shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.5)] z-10">
                                        <div className={`w-2.5 h-2.5 rounded-full ${isCurrent ? 'bg-green-400 animate-ping' : 'bg-accent'}`} />
                                    </div>

                                    {/* Card de Experiência */}
                                    <div
                                        data-cursor-card="true"
                                        className="bg-darker rounded-2xl border border-primary/30 hover:border-accent/50 transition-all duration-300 shadow-2xl overflow-hidden group"
                                    >
                                        {/* Card Header */}
                                        <div className="p-6 sm:p-8 border-b border-primary/20 bg-white/[0.01]">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-xl sm:text-2xl font-bold font-serif text-white group-hover:text-secondary transition-colors">
                                                        {exp.company}
                                                    </h3>
                                                    {isCurrent && (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-green-500/10 text-green-400 border border-green-500/30">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                                            {lang === 'en' ? 'Current Role' : lang === 'es' ? 'Puesto Actual' : 'Cargo Atual'}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs font-mono text-primary/70 bg-dark px-3 py-1 rounded-md border border-primary/20 self-start sm:self-auto">
                                                    {exp.period}
                                                </span>
                                            </div>

                                            <p className="text-secondary font-medium text-sm sm:text-base font-sans mb-4">
                                                {exp.role}
                                            </p>

                                            {/* Tech Badges */}
                                            {exp.techBadges && (
                                                <div className="flex flex-wrap gap-1.5 pt-1">
                                                    {exp.techBadges.map((badge, bIdx) => (
                                                        <span
                                                            key={bIdx}
                                                            className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-white/5 text-primary/80 border border-white/10 group-hover:border-accent/30 transition-colors"
                                                        >
                                                            {badge}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Card Groups (Responsabilidades / Conquistas) */}
                                        {exp.groups && exp.groups.length > 0 && (
                                            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-dark/40">
                                                {exp.groups.map((group, gIdx) => (
                                                    <div key={gIdx} className="space-y-3">
                                                        <div className="flex items-center gap-2 text-accent font-semibold text-xs tracking-wider uppercase font-sans">
                                                            <i className={`${group.icon || 'fas fa-check-circle'} text-[11px]`} />
                                                            <span>{group.title}</span>
                                                        </div>
                                                        <ul className="space-y-2">
                                                            {group.items && group.items.map((item, iIdx) => (
                                                                <li key={iIdx} className="text-gray-300 text-xs sm:text-sm leading-relaxed flex items-start gap-2">
                                                                    <span className="text-accent mt-1.5 text-[8px]">•</span>
                                                                    <span><HighlightedText text={item} /></span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <p className="text-gray-400 text-center py-12 font-sans">{t('experience.empty')}</p>
                    )}
                </div>

            </div>
        </section>
    );
}
