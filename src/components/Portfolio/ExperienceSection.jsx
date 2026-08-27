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
                    <span key={i} className="text-secondary font-semibold">
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
    const { t } = useLanguage();

    const summaryStats = [
        { value: '10+ Meses', label: 'Experiência em produção', icon: 'fas fa-calendar-check' },
        { value: '100+ Usuários', label: 'Diários em sistemas ERP', icon: 'fas fa-users' },
        { value: '25% Menos Bugs', label: 'Via QA preventivo', icon: 'fas fa-shield-alt' },
        { value: '4× Mais Rápido', label: 'Queries otimizadas (<500ms)', icon: 'fas fa-bolt' },
    ];

    return (
        <section id="experiencia" className="grid-bg py-24 bg-dark relative border-t border-primary/30">
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
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
                >
                    {summaryStats.map((stat, idx) => (
                        <div
                            key={idx}
                            className="bg-darker/90 border border-primary/25 rounded-xl p-4 flex items-center gap-3.5 hover:border-accent/40 transition-all duration-200 shadow-lg"
                        >
                            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                                <i className={`${stat.icon} text-accent text-sm`} />
                            </div>
                            <div>
                                <div className="text-sm sm:text-base font-bold text-white font-mono">{stat.value}</div>
                                <div className="text-[11px] text-gray-400 leading-tight">{stat.label}</div>
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
                            const isCurrent = exp.id === 2 || exp.period.toLowerCase().includes('presente') || exp.period.toLowerCase().includes('present');

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
                                    <div className="bg-darker rounded-2xl border border-primary/30 hover:border-accent/50 transition-all duration-300 shadow-2xl overflow-hidden group">
                                        
                                        {/* Barra superior de destaque */}
                                        <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-primary/20 bg-dark/40">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                                        <span className="text-xl sm:text-2xl font-bold text-white group-hover:text-secondary transition-colors">
                                                            {exp.company}
                                                        </span>
                                                        {isCurrent ? (
                                                            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 rounded-full">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                                                Atuação Atual
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary/70 bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                                                                <i className="fas fa-check text-[9px]" />
                                                                Concluído
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-sm sm:text-base font-medium text-accent">
                                                        {exp.role}
                                                    </h3>
                                                </div>

                                                <span className="self-start sm:self-auto text-xs font-semibold text-gray-300 bg-dark border border-primary/30 px-3.5 py-1.5 rounded-xl whitespace-nowrap font-mono shadow-sm">
                                                    <i className="far fa-calendar-alt mr-2 text-accent" />
                                                    {exp.period}
                                                </span>
                                            </div>

                                            {/* Badges de Tecnologias */}
                                            {exp.techBadges && (
                                                <div className="flex flex-wrap gap-1.5 mt-4">
                                                    {exp.techBadges.map((badge) => (
                                                        <span
                                                            key={badge}
                                                            className="text-[10px] sm:text-[11px] font-medium text-gray-300 bg-dark/80 border border-primary/20 px-2.5 py-0.5 rounded-md"
                                                        >
                                                            {badge}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Grupos de Atividades & Impacto */}
                                        <div className="px-6 sm:px-8 py-6 space-y-6">
                                            {exp.groups && exp.groups.map((group, gIdx) => (
                                                <div key={gIdx} className="space-y-3">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-300 uppercase tracking-wider">
                                                        <span className="w-5 h-5 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center">
                                                            <i className={`${group.icon} text-accent text-[10px]`} />
                                                        </span>
                                                        {group.title}
                                                    </div>
                                                    <ul className="space-y-2.5 pl-1">
                                                        {group.items.map((item, iIdx) => (
                                                            <li
                                                                key={iIdx}
                                                                className="flex items-start gap-3 text-gray-400 text-xs sm:text-sm leading-relaxed"
                                                            >
                                                                <span className="shrink-0 mt-[6px] w-[5px] h-[5px] rounded-full bg-accent/70" />
                                                                <span>
                                                                    <HighlightedText text={item} />
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Rodapé de Destaque de Impacto */}
                                        <div className="px-6 sm:px-8 py-3.5 bg-dark/60 border-t border-primary/15 flex items-center gap-2 text-xs text-secondary/80">
                                            <i className="fas fa-trophy text-accent text-xs shrink-0" />
                                            <span className="font-medium">
                                                {exp.id === 2 
                                                    ? 'Impacto: Blindagem de regressões e 25% menos bugs críticos pré-deploy em ambiente portuário.' 
                                                    : 'Impacto: Queries de 2s para <500ms, estabilização de rotinas para 100+ usuários e 100% conformidade fiscal.'}
                                            </span>
                                        </div>

                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <p className="text-gray-500 text-center py-8">{t('experience.empty')}</p>
                    )}
                </div>

            </div>
        </section>
    );
}
