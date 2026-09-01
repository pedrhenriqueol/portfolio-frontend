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
    const brandColor = skill?.color || '#8C6A4A';
    const catStyle = CATEGORY_STYLES[skill?.category] || {
        color: '#9CA3AF',
        border: 'rgba(255, 255, 255, 0.1)',
        badgeBg: 'rgba(255, 255, 255, 0.05)',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.03 }}
            whileHover={{ y: -4, scale: 1.01 }}
            data-no-card-morph="true"
            className="relative flex flex-col p-5 rounded-2xl cursor-default group bg-darker/90 hover:bg-darker transition-all duration-300 shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform-gpu overflow-hidden border border-white/10 hover:border-white/25"
        >
            {/* Top row: Icon (Neutro no repouso -> Revela Brand Color no Hover) + Category Badge */}
            <div className="flex items-center justify-between gap-2 mb-3">
                <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shrink-0 border border-white/10 bg-white/5 group-hover:border-transparent"
                    style={{
                        backgroundColor: undefined,
                    }}
                >
                    <i
                        className={`${skill?.icon_class} text-xl text-gray-300 group-hover:!text-[var(--brand-color)] transition-all duration-300`}
                        style={{
                            '--brand-color': brandColor,
                        }}
                    />
                </div>

                <span
                    className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-medium transition-colors duration-300"
                    style={{
                        backgroundColor: catStyle.badgeBg,
                        color: catStyle.color,
                        border: `1px solid ${catStyle.border}`,
                    }}
                >
                    {skill?.category}
                </span>
            </div>

            {/* Name */}
            <h4 className="text-sm sm:text-base font-bold text-white font-sans group-hover:text-white transition-colors duration-200 mb-1">
                {skill?.name}
            </h4>

            {/* Description context */}
            {skill?.desc && (
                <p className="text-[11px] text-gray-400 font-sans leading-relaxed line-clamp-2">
                    {skill.desc}
                </p>
            )}
        </motion.div>
    );
}

export default function SkillsSection({ skills = [] }) {
    const { t, lang } = useLanguage();
    const [viewMode, setViewMode] = useState('sphere'); // 'sphere' | 'grid'
    const [selectedCategory, setSelectedCategory] = useState('all');

    const CATEGORIES = [
        { id: 'all',          labelPt: 'Todas',          labelEn: 'All',           labelEs: 'Todas' },
        { id: 'Front-end',    labelPt: 'Frontend',       labelEn: 'Frontend',      labelEs: 'Frontend' },
        { id: 'Back-end',     labelPt: 'Backend & ERP',  labelEn: 'Backend & ERP', labelEs: 'Backend & ERP' },
        { id: 'Database',     labelPt: 'Banco de Dados', labelEn: 'Database',      labelEs: 'Base de Datos' },
        { id: 'DevOps & QA',  labelPt: 'DevOps & QA',    labelEn: 'DevOps & QA',   labelEs: 'DevOps & QA' },
    ];

    // Ordenação por cor/categoria agrupada na visualização 'Todos'
    const processedSkills = useMemo(() => {
        const list = Array.isArray(skills) ? [...skills] : [];
        if (selectedCategory === 'all') {
            return list.sort((a, b) => {
                const orderA = CATEGORY_STYLES[a?.category]?.order || 99;
                const orderB = CATEGORY_STYLES[b?.category]?.order || 99;
                if (orderA !== orderB) return orderA - orderB;
                return (a?.id || 0) - (b?.id || 0);
            });
        }
        return list.filter((skill) => skill?.category === selectedCategory);
    }, [skills, selectedCategory]);

    return (
        <section id="conhecimentos" className="grid-bg py-20 md:py-24 bg-darker relative border-t border-primary/30">
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
                            data-cursor-morph="true"
                            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                                viewMode === 'sphere'
                                    ? 'bg-accent text-darker shadow-md'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <i className="fas fa-globe text-xs" />
                            <span>{lang === 'en' ? 'Orbital 3D Sphere' : lang === 'es' ? 'Esfera 3D Orbital' : 'Esfera 3D Orbital'}</span>
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            data-cursor-morph="true"
                            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                                viewMode === 'grid'
                                    ? 'bg-accent text-darker shadow-md'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <i className="fas fa-th-large text-xs" />
                            <span>{lang === 'en' ? 'Detailed Grid' : lang === 'es' ? 'Grade Detallada' : 'Grade Detalhada'}</span>
                        </button>
                    </div>
                </motion.div>

                {/* Alternância Fluida de Visualização */}
                <div className="min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {viewMode === 'sphere' ? (
                            <motion.div
                                key="sphere-view"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
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
                                transition={{ duration: 0.3 }}
                                className="w-full flex flex-col items-center"
                            >
                                {/* Categorias Filtro do Grid */}
                                <div className="flex flex-wrap justify-center gap-2 mb-8">
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            data-cursor-morph="true"
                                            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                                                selectedCategory === cat.id
                                                    ? 'bg-accent text-darker shadow-sm'
                                                    : 'bg-darker/60 text-primary border border-primary/25 hover:border-accent/40 hover:text-accent'
                                            }`}
                                        >
                                            {lang === 'en' ? cat.labelEn : lang === 'es' ? cat.labelEs : cat.labelPt}
                                        </button>
                                    ))}
                                </div>

                                {/* Cards em Grid Harmonioso */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                                    {processedSkills.map((skill, index) => (
                                        <SkillCard key={skill.id || index} skill={skill} index={index} />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </section>
    );
}
