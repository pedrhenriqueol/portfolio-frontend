import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import TechSphere3D from './TechSphere3D';

// ── Sistema de Cores Harmonioso e Padronizado por Categoria ──
const CATEGORY_STYLES = {
    'Front-end': {
        color: '#60A5FA', // Azul Sereno
        border: 'rgba(96, 165, 250, 0.25)',
        badgeBg: 'rgba(96, 165, 250, 0.12)',
        iconBg: 'rgba(96, 165, 250, 0.15)',
        order: 1,
    },
    'Back-end': {
        color: '#F87171', // Coral / Vermelho Suave
        border: 'rgba(248, 113, 113, 0.25)',
        badgeBg: 'rgba(248, 113, 113, 0.12)',
        iconBg: 'rgba(248, 113, 113, 0.15)',
        order: 2,
    },
    'Database': {
        color: '#34D399', // Verde Esmeralda
        border: 'rgba(52, 211, 153, 0.25)',
        badgeBg: 'rgba(52, 211, 153, 0.12)',
        iconBg: 'rgba(52, 211, 153, 0.15)',
        order: 3,
    },
    'DevOps & QA': {
        color: '#FBBF24', // Dourado Âmbar
        border: 'rgba(251, 191, 36, 0.25)',
        badgeBg: 'rgba(251, 191, 36, 0.12)',
        iconBg: 'rgba(251, 191, 36, 0.15)',
        order: 4,
    },
};

function SkillCard({ skill, index }) {
    const style = CATEGORY_STYLES[skill.category] || {
        color: 'var(--color-accent, #8C6A4A)',
        border: 'rgba(140, 106, 74, 0.25)',
        badgeBg: 'rgba(140, 106, 74, 0.12)',
        iconBg: 'rgba(140, 106, 74, 0.15)',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.03 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="cursor-morph relative flex flex-col p-5 rounded-2xl cursor-default group bg-darker/90 hover:border-opacity-60 transition-all duration-300 shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform-gpu overflow-hidden"
            style={{
                border: `1px solid ${style.border}`,
            }}
        >
            {/* Top row: Icon + Category Badge */}
            <div className="flex items-center justify-between gap-2 mb-3">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shrink-0"
                    style={{ backgroundColor: style.iconBg }}
                >
                    <i
                        className={`${skill.icon_class} text-lg sm:text-xl transition-colors duration-200`}
                        style={{ color: style.color }}
                    />
                </div>

                <span
                    className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-medium"
                    style={{
                        backgroundColor: style.badgeBg,
                        color: style.color,
                        border: `1px solid ${style.border}`,
                    }}
                >
                    {skill.category}
                </span>
            </div>

            {/* Name */}
            <h4 className="text-sm sm:text-base font-bold text-white font-sans group-hover:text-white transition-colors duration-200 mb-1">
                {skill.name}
            </h4>

            {/* Description context */}
            {skill.desc && (
                <p className="text-[11px] text-gray-400 font-sans leading-relaxed line-clamp-2">
                    {skill.desc}
                </p>
            )}

            {/* Bottom highlight bar */}
            <div
                className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    background: `linear-gradient(90deg, transparent, ${style.color}, transparent)`,
                }}
            />
        </motion.div>
    );
}

export default function SkillsSection({ skills }) {
    const { t, lang } = useLanguage();
    const [viewMode, setViewMode] = useState('sphere'); // 'sphere' | 'grid'
    const [selectedCategory, setSelectedCategory] = useState('all');

    const CATEGORIES = [
        { id: 'all',          labelPt: 'Todos',          labelEn: 'All',           labelEs: 'Todos' },
        { id: 'Front-end',    labelPt: 'Frontend',       labelEn: 'Frontend',      labelEs: 'Frontend' },
        { id: 'Back-end',     labelPt: 'Backend & ERP',  labelEn: 'Backend & ERP', labelEs: 'Backend & ERP' },
        { id: 'Database',     labelPt: 'Banco de Dados', labelEn: 'Database',      labelEs: 'Base de Datos' },
        { id: 'DevOps & QA',  labelPt: 'DevOps & QA',    labelEn: 'DevOps & QA',   labelEs: 'DevOps & QA' },
    ];

    // Ordenação por cor/categoria agrupada na visualização 'Todos'
    const processedSkills = useMemo(() => {
        const list = [...skills];
        if (selectedCategory === 'all') {
            return list.sort((a, b) => {
                const orderA = CATEGORY_STYLES[a.category]?.order || 99;
                const orderB = CATEGORY_STYLES[b.category]?.order || 99;
                if (orderA !== orderB) return orderA - orderB;
                return a.id - b.id;
            });
        }
        return list.filter((skill) => skill.category === selectedCategory);
    }, [skills, selectedCategory]);

    return (
        <section id="conhecimentos" className="grid-bg py-24 bg-darker relative border-t border-primary/30">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-10"
                >
                    <span className="text-accent text-[11px] font-semibold tracking-[0.25em] uppercase mb-2 block font-sans">
                        {t('skills.tag')}
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-4">{t('skills.title')}</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto font-sans text-sm sm:text-base mb-8">
                        {t('skills.subtitle')}
                    </p>

                    {/* Visualizer Mode Toggle */}
                    <div className="inline-flex items-center p-1 rounded-full bg-darker border border-primary/25 shadow-lg">
                        <button
                            onClick={() => setViewMode('sphere')}
                            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                                viewMode === 'sphere'
                                    ? 'bg-accent text-darker shadow-md'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <i className="fas fa-globe text-xs" />
                            {lang === 'en' ? '3D Interactive Globe' : lang === 'es' ? 'Globo 3D Interactivo' : 'Globo 3D Interativo'}
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                                viewMode === 'grid'
                                    ? 'bg-accent text-darker shadow-md'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <i className="fas fa-th-large text-xs" />
                            {lang === 'en' ? 'Detailed Grid' : lang === 'es' ? 'Grade Detallada' : 'Grade Detalhada'}
                        </button>
                    </div>
                </motion.div>

                {/* Content View: 3D Sphere or Grid */}
                <AnimatePresence mode="wait">
                    {viewMode === 'sphere' ? (
                        <motion.div
                            key="sphere-view"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className="w-full flex flex-col items-center"
                        >
                            <TechSphere3D skills={skills} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid-view"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4 }}
                            className="w-full flex flex-col items-center"
                        >
                            {/* Filter Bar for Grid Mode */}
                            <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2 mb-8 flex-wrap px-2">
                                {CATEGORIES.map((cat) => {
                                    const isSelected = selectedCategory === cat.id;
                                    const label = lang === 'en' ? cat.labelEn : lang === 'es' ? cat.labelEs : cat.labelPt;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                                                isSelected
                                                    ? 'bg-accent text-darker shadow-[0_0_15px_rgba(var(--color-accent-rgb,140,106,74),0.4)] scale-105'
                                                    : 'bg-darker/80 border border-primary/20 text-gray-400 hover:text-white hover:border-primary/40'
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Cards Grid ordenado por cor / categoria */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 w-full">
                                {processedSkills.map((skill, index) => (
                                    <SkillCard key={skill.id} skill={skill} index={index} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
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
                                const style = CATEGORY_STYLES[skill.category] || { color: 'var(--color-accent)' };
                                return (
                                    <span key={`${set}-${skill.id}`} className="text-gray-500 text-sm flex items-center gap-2">
                                        <i className={skill.icon_class} style={{ color: style.color, opacity: 0.8 }} />
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
