import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const CATEGORY_CONFIG = {
    'Back-end':  { color: '#C9A84C' },
    'Fullstack': { color: '#C9A84C' },
    'Front-end': { color: '#818CF8' },
    'Database':  { color: '#F59E0B' },
    'DevOps':    { color: '#34D399' },
    'Outros':    { color: '#94A3B8' },
};

function SkillCard({ skill, config, index }) {
    const cardRef = useRef(null);

    const onMouseMove = (e) => {
        const el = cardRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const zoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
        const x = (e.clientX - rect.left) / zoom;
        const y = (e.clientY - rect.top)  / zoom;
        el.style.setProperty('--sx', `${x}px`);
        el.style.setProperty('--sy', `${y}px`);
        el.style.background    = `radial-gradient(140px circle at var(--sx) var(--sy), ${config.color}18, transparent 70%), rgba(11,12,16,0.7)`;
        el.style.borderColor   = config.color;
        el.style.boxShadow     = `0 0 28px ${config.color}30`;
    };

    const onMouseLeave = (e) => {
        const el = e.currentTarget;
        el.style.background  = 'rgba(11,12,16,0.7)';
        el.style.borderColor = 'rgba(197,198,199,0.10)';
        el.style.boxShadow   = 'none';
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05, type: 'spring', stiffness: 260, damping: 20 }}
            whileHover={{ y: -6, scale: 1.05 }}
            className="relative flex flex-col items-center justify-center p-5 rounded-2xl cursor-default group"
            style={{
                background: 'rgba(11,12,16,0.7)',
                border: '1.5px solid rgba(197,198,199,0.10)',
                transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
            }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
        >
            {/* Category accent dot */}
            <span
                className="absolute top-3 right-3 w-2 h-2 rounded-full"
                style={{ backgroundColor: config.color, boxShadow: `0 0 6px ${config.color}` }}
            />

            {/* Icon */}
            <i
                className={`${skill.icon_class} text-4xl mb-3 transition-colors duration-300 text-gray-400 group-hover:text-white`}
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
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-14"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('skills.title')}</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
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

            {/* Marquee */}
            <div className="mt-20 overflow-hidden w-full bg-dark/50 py-4 border-y border-primary/20">
                <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap">
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
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
            `}</style>
        </section>
    );
}
