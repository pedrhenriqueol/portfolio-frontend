import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const CATEGORY_CONFIG = {
    'Back-end':  { color: 'var(--color-accent)' },
    'Fullstack': { color: 'var(--color-accent)' },
    'Front-end': { color: 'var(--color-primary)' },
    'Database':  { color: 'var(--color-primary)' },
    'DevOps':    { color: 'var(--color-primary)' },
    'Outros':    { color: 'var(--color-primary)' },
};

function SkillCard({ skill, config, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.04 }}
            whileHover={{ y: -4, scale: 1.03 }}
            className="relative flex flex-col items-center justify-center p-5 rounded-2xl cursor-default group border border-primary/25 bg-darker hover:border-accent/50 transition-all duration-200 shadow-md hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] transform-gpu"
        >
            {/* Category accent dot */}
            <span
                className="absolute top-3 right-3 w-2 h-2 rounded-full"
                style={{ backgroundColor: config.color }}
            />

            {/* Icon */}
            <i
                className={`${skill.icon_class} text-3xl sm:text-4xl mb-3 transition-colors duration-200 text-gray-400 group-hover:text-white`}
            />

            {/* Name */}
            <span className="text-xs font-semibold text-center leading-tight text-gray-400 group-hover:text-white transition-colors duration-200">
                {skill.name}
            </span>
        </motion.div>
    );
}

export default function SkillsSection({ skills }) {
    const { t } = useLanguage();
    return (
        <section id="conhecimentos" className="grid-bg py-24 bg-darker relative border-t border-primary/30">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-14"
                >
                    <span className="text-accent text-[11px] font-semibold tracking-[0.25em] uppercase mb-2 block font-sans">
                        {t('skills.tag')}
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-4">{t('skills.title')}</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto font-sans text-sm sm:text-base">
                        {t('skills.subtitle')}
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {skills.map((skill, index) => {
                        const cfg = CATEGORY_CONFIG[skill.category] || CATEGORY_CONFIG['Outros'];
                        return <SkillCard key={skill.id} skill={skill} config={cfg} index={index} />;
                    })}
                </div>
            </div>

            {/* Marquee acelerado por GPU */}
            <div className="mt-20 overflow-hidden w-full bg-dark/50 py-4 border-y border-primary/20 contain-paint">
                <div
                    className="flex whitespace-nowrap will-change-transform"
                    style={{ animation: 'marquee 30s linear infinite' }}
                >
                    {[1, 2, 3].map((set) => (
                        <div key={set} className="flex gap-10 shrink-0 px-5">
                            {skills.map((skill) => {
                                const cfg = CATEGORY_CONFIG[skill.category] || CATEGORY_CONFIG['Outros'];
                                return (
                                    <span key={`${set}-${skill.id}`} className="text-gray-500 text-sm flex items-center gap-2">
                                        <i className={skill.icon_class} style={{ color: cfg.color, opacity: 0.7 }} />
                                        {skill.name}
                                    </span>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes marquee {
                    0%   { transform: translate3d(0, 0, 0); }
                    100% { transform: translate3d(-33.333%, 0, 0); }
                }
            `}</style>
        </section>
    );
}
