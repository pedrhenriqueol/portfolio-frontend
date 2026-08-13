import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

/** Faz highlight de métricas numéricas e termos técnicos-chave no texto */
function HighlightedText({ text }) {
    // Padrão: números com unidades, percentuais, operadores técnicos
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
    return (
        <section id="experiencia" className="grid-bg py-24 bg-dark relative border-t border-primary/30">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="text-accent text-[11px] font-semibold tracking-[0.25em] uppercase mb-2 block font-sans">
                        TRAJETÓRIA
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-4">
                        {t('experience.title')}
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto font-sans text-sm sm:text-base">
                        {t('experience.subtitle')}
                    </p>
                </motion.div>

                {/* Cards */}
                <div className="space-y-10">
                    {experiences && experiences.length > 0 ? (
                        experiences.map((exp, expIdx) => (
                            <motion.div
                                key={exp.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: expIdx * 0.15 }}
                                className="relative bg-darker rounded-2xl border border-primary/30 hover:border-secondary/30 transition-colors duration-500 shadow-2xl overflow-hidden group"
                            >
                                {/* Glow accent bar no topo */}
                                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-secondary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* ── Header do card ── */}
                                <div className="px-8 pt-8 pb-6 border-b border-primary/20">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white group-hover:text-secondary transition-colors duration-300">
                                                {exp.role}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <i className="fas fa-building text-accent text-xs" />
                                                <span className="text-lg text-gray-300 font-medium">{exp.company}</span>
                                            </div>
                                        </div>
                                        <span className="self-start sm:self-auto text-sm font-semibold text-accent bg-accent/10 border border-accent/25 px-4 py-1.5 rounded-full whitespace-nowrap">
                                            <i className="far fa-calendar-alt mr-2 text-xs" />
                                            {exp.period}
                                        </span>
                                    </div>

                                    {/* Tech badges */}
                                    {exp.techBadges && (
                                        <div className="flex flex-wrap gap-1.5 mt-4">
                                            {exp.techBadges.map((badge) => (
                                                <span
                                                    key={badge}
                                                    className="text-[10px] sm:text-[11px] font-semibold text-secondary/80 bg-secondary/5 border border-secondary/15 px-2 py-0.5 rounded-full hover:border-secondary/40 hover:text-secondary transition-colors duration-200"
                                                >
                                                    {badge}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* ── Grupos de bullet points ── */}
                                <div className="px-8 py-7 space-y-8">
                                    {exp.groups ? (
                                        exp.groups.map((group, gIdx) => (
                                            <motion.div
                                                key={group.title}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.5, delay: 0.1 + gIdx * 0.12 }}
                                            >
                                                {/* Subtítulo do grupo */}
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="flex items-center justify-center w-6 h-6 rounded-md bg-secondary/10 border border-secondary/20">
                                                        <i className={`${group.icon} text-secondary text-[10px]`} />
                                                    </span>
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                        {group.title}
                                                    </h4>
                                                </div>

                                                {/* Bullets */}
                                                <ul className="space-y-3 pl-1">
                                                    {group.items.map((item, iIdx) => (
                                                        <motion.li
                                                            key={iIdx}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            whileInView={{ opacity: 1, x: 0 }}
                                                            viewport={{ once: true }}
                                                            transition={{ duration: 0.4, delay: 0.15 + iIdx * 0.08 }}
                                                            className="flex items-start gap-3 text-gray-400 leading-relaxed text-[15px]"
                                                        >
                                                            <span className="shrink-0 mt-[6px] w-[6px] h-[6px] rounded-full bg-secondary/70" />
                                                            <span>
                                                                <HighlightedText text={item} />
                                                            </span>
                                                        </motion.li>
                                                    ))}
                                                </ul>
                                            </motion.div>
                                        ))
                                    ) : (
                                        /* Fallback para formato antigo (array de strings) */
                                        <ul className="space-y-3">
                                            {(Array.isArray(exp.description)
                                                ? exp.description
                                                : exp.description.split('\n')
                                            ).map((line, i) => {
                                                const text = line.replace(/^•\s*/, '').trim();
                                                if (!text) return null;
                                                return (
                                                    <li key={i} className="flex items-start gap-3 text-gray-400 leading-relaxed">
                                                        <span className="shrink-0 mt-[6px] w-[6px] h-[6px] rounded-full bg-secondary/70" />
                                                        <span><HighlightedText text={text} /></span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">{t('experience.empty')}</p>
                    )}
                </div>
            </div>
        </section>
    );
}
