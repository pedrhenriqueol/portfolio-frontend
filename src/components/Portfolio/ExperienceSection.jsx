import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

/** Faz highlight de métricas numéricas e termos técnicos-chave no texto */
function HighlightedText({ text }) {
    const pattern = /(\d+[\+\-]?\s*(?:ms|s|%|usuários|bugs|travamentos)?(?:\s*diários)?|<\d+ms|N\+1|100\+|8\+|Multi-tenant|RBAC)/g;
    const parts = text.split(pattern);
    return (
        <>
            {parts.map((part, i) =>
                pattern.test(part) ? (
                    <span key={i} className="text-secondary font-semibold">{part}</span>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </>
    );
}

/* ── Timeline dot animado que pulsa quando visível ── */
function TimelineDot({ isLeft }) {
    return (
        <div className={`absolute top-8 ${isLeft ? '-right-[9px]' : '-left-[9px]'} z-10`}>
            <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative w-[18px] h-[18px] flex items-center justify-center"
            >
                <span className="absolute inset-0 rounded-full bg-accent/25 animate-ping" />
                <span className="w-[10px] h-[10px] rounded-full bg-accent border-2 border-darker shadow-[0_0_12px_rgba(var(--color-accent-rgb),0.6)] relative z-10" />
            </motion.div>
        </div>
    );
}

/* ── Linha vertical animada via scroll ── */
function TimelineTrack({ containerRef }) {
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start 80%', 'end 20%'],
    });
    const height = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    return (
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[2px] bg-primary/10 overflow-hidden">
            <motion.div
                className="w-full bg-gradient-to-b from-accent/80 via-secondary/50 to-accent/30 origin-top"
                style={{ height }}
            />
        </div>
    );
}

export default function ExperienceSection({ experiences }) {
    const { t } = useLanguage();
    const containerRef = useRef(null);

    return (
        <section id="experiencia" className="grid-bg py-24 bg-dark relative border-t border-primary/30">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
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

                {/* Timeline Container */}
                <div ref={containerRef} className="relative">
                    {/* Vertical track */}
                    <TimelineTrack containerRef={containerRef} />

                    {/* Experience cards */}
                    <div className="space-y-12">
                        {experiences && experiences.length > 0 ? (
                            experiences.map((exp, expIdx) => {
                                const isLeft = expIdx % 2 === 0;
                                return (
                                    <div key={exp.id} className="relative md:grid md:grid-cols-2 md:gap-12">

                                        {/* Left spacer on odd items */}
                                        {!isLeft && <div className="hidden md:block" />}

                                        {/* Card */}
                                        <motion.div
                                            initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true, margin: '-60px' }}
                                            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                                            className="relative"
                                        >
                                            {/* Timeline dot — only on md+ */}
                                            <div className="hidden md:block">
                                                <TimelineDot isLeft={isLeft} />
                                            </div>

                                            {/* Mobile: left accent line */}
                                            <div className="md:hidden absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-accent/60 to-transparent" />

                                            <div className="relative bg-darker rounded-2xl border border-primary/30 hover:border-secondary/30 transition-colors duration-500 shadow-2xl overflow-hidden group md:ml-0 ml-6">
                                                {/* Glow accent bar */}
                                                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                                {/* Card Header */}
                                                <div className="px-6 pt-6 pb-5 border-b border-primary/20">
                                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                                        <div>
                                                            <h3 className="text-xl font-bold text-white group-hover:text-secondary transition-colors duration-300 leading-tight">
                                                                {exp.role}
                                                            </h3>
                                                            <div className="flex items-center gap-2 mt-1.5">
                                                                <i className="fas fa-building text-accent text-xs" />
                                                                <span className="text-base text-gray-300 font-medium">{exp.company}</span>
                                                            </div>
                                                        </div>
                                                        <span className="self-start text-xs font-semibold text-accent bg-accent/10 border border-accent/25 px-3 py-1.5 rounded-full whitespace-nowrap shrink-0">
                                                            <i className="far fa-calendar-alt mr-1.5 text-[10px]" />
                                                            {exp.period}
                                                        </span>
                                                    </div>

                                                    {/* Tech badges */}
                                                    {exp.techBadges && (
                                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                                            {exp.techBadges.map(badge => (
                                                                <span key={badge}
                                                                    className="text-[10px] font-semibold text-secondary/80 bg-secondary/5 border border-secondary/15 px-2 py-0.5 rounded-full hover:border-secondary/40 hover:text-secondary transition-colors duration-200">
                                                                    {badge}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Groups */}
                                                <div className="px-6 py-5 space-y-6">
                                                    {exp.groups ? (
                                                        exp.groups.map((group, gIdx) => (
                                                            <motion.div
                                                                key={group.title}
                                                                initial={{ opacity: 0, x: -16 }}
                                                                whileInView={{ opacity: 1, x: 0 }}
                                                                viewport={{ once: true }}
                                                                transition={{ duration: 0.5, delay: 0.1 + gIdx * 0.1 }}
                                                            >
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <span className="flex items-center justify-center w-6 h-6 rounded-md bg-accent/10 border border-accent/20">
                                                                        <i className={`${group.icon} text-accent text-[10px]`} />
                                                                    </span>
                                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{group.title}</h4>
                                                                </div>
                                                                <ul className="space-y-2.5 pl-1">
                                                                    {group.items.map((item, iIdx) => (
                                                                        <motion.li
                                                                            key={iIdx}
                                                                            initial={{ opacity: 0, x: -8 }}
                                                                            whileInView={{ opacity: 1, x: 0 }}
                                                                            viewport={{ once: true }}
                                                                            transition={{ duration: 0.4, delay: 0.15 + iIdx * 0.07 }}
                                                                            className="flex items-start gap-3 text-gray-400 leading-relaxed text-[14px]"
                                                                        >
                                                                            <span className="shrink-0 mt-[6px] w-[5px] h-[5px] rounded-full bg-accent/60" />
                                                                            <span><HighlightedText text={item} /></span>
                                                                        </motion.li>
                                                                    ))}
                                                                </ul>
                                                            </motion.div>
                                                        ))
                                                    ) : (
                                                        <ul className="space-y-3">
                                                            {(Array.isArray(exp.description) ? exp.description : exp.description.split('\n')).map((line, i) => {
                                                                const text = line.replace(/^•\s*/, '').trim();
                                                                if (!text) return null;
                                                                return (
                                                                    <li key={i} className="flex items-start gap-3 text-gray-400 leading-relaxed">
                                                                        <span className="shrink-0 mt-[6px] w-[5px] h-[5px] rounded-full bg-accent/60" />
                                                                        <span><HighlightedText text={text} /></span>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Right spacer on even items */}
                                        {isLeft && <div className="hidden md:block" />}
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-500 text-center">{t('experience.empty')}</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
