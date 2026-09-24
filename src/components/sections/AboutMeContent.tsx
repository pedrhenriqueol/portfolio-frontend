import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';

/* ══════════════════════════════════════════════════════════════════
 * AboutMeContent — Conteúdo compacto do Sobre Mim para Scrollytelling
 * ══════════════════════════════════════════════════════════════════
 *
 * Versão focada para exibição dentro do palco sticky do HeroAboutScrolly.
 * Exibe: header, bio resumida, métricas e pilares de especialidade.
 *
 * O conteúdo completo (Bento Grid, projetos-chave, SQL Benchmark Modal,
 * Easter Eggs) permanece acessível na seção standalone <AboutSection />
 * renderizada após o container de 260vh no fluxo normal.
 *
 * Performance:
 * - Contadores animados só disparam quando visível (IntersectionObserver).
 * - Sem backdrop-blur-xl em elementos móveis.
 * - transform: translateZ(0) para composição em camada GPU.
 * ══════════════════════════════════════════════════════════════════ */

/* ── Contador com aceleração suave ── */
function AnimatedCounter({
    targetValue,
    suffix = '',
    isVisible,
}: {
    targetValue: number;
    suffix?: string;
    isVisible: boolean;
}) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isVisible) return;
        const startTime = performance.now();
        const duration = 1200;

        let frameId: number;
        const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCount(Math.round(ease * targetValue));

            if (progress < 1) {
                frameId = requestAnimationFrame(step);
            }
        };

        frameId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frameId);
    }, [isVisible, targetValue]);

    return (
        <span className="tabular-nums font-mono font-bold text-white text-xl tracking-tight">
            {count}{suffix}
        </span>
    );
}

function AboutMeContent() {
    const { t, lang } = useLanguage();
    const [isSectionVisible, setIsSectionVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsSectionVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const aboutMetrics = [
        {
            icon: 'fas fa-calendar-check',
            value: 10,
            suffix: '+',
            label: t('about.highlights')?.[0] || (lang === 'en' ? '10+ months experience' : '10+ meses de experiência'),
        },
        {
            icon: 'fas fa-users',
            value: 100,
            suffix: '+',
            label: t('about.highlights')?.[1] || (lang === 'en' ? '100+ daily active users' : '100+ usuários diários'),
        },
        {
            icon: 'fas fa-bolt',
            value: 4,
            suffix: '×',
            label: t('about.highlights')?.[3] || (lang === 'en' ? 'Faster query execution' : 'Queries 4× mais rápidas'),
        },
        {
            icon: 'fas fa-shield-alt',
            value: 100,
            suffix: '%',
            label: lang === 'en' ? 'Fiscal compliance (ACBr)' : lang === 'es' ? 'Cumplimiento fiscal (ACBr)' : 'Conformidade fiscal (ACBr)',
        },
    ];

    const pillars = [
        {
            icon: 'fas fa-sync-alt',
            title: lang === 'en' ? 'Legacy Modernization' : lang === 'es' ? 'Modernización Legacy' : 'Modernização de Legados',
            desc: lang === 'en'
                ? 'Migrating legacy monoliths to modern SPAs and decoupled REST APIs.'
                : lang === 'es'
                ? 'Migración de monolitos heredados a SPAs modernas y APIs REST desacopladas.'
                : 'Transição de monolitos legados para SPAs modernas e APIs REST desacopladas.',
        },
        {
            icon: 'fas fa-database',
            title: lang === 'en' ? 'Databases & Performance' : lang === 'es' ? 'Bases de Datos y Rendimiento' : 'Bancos de Dados & Performance',
            desc: lang === 'en'
                ? 'Critical N+1 query refactoring, smart indexing and transactional integrity.'
                : lang === 'es'
                ? 'Refactorización N+1, indexación inteligente e integridad transaccional.'
                : 'Refatoração de queries N+1, indexação inteligente e integridade transacional.',
        },
        {
            icon: 'fas fa-shield-alt',
            title: lang === 'en' ? 'QA & Mission-Critical' : lang === 'es' ? 'QA y Sistemas Críticos' : 'QA & Sistemas Críticos',
            desc: lang === 'en'
                ? 'Automated/manual testing via Postman and regression protection.'
                : lang === 'es'
                ? 'Pruebas automatizadas/manuales con Postman y blindaje contra regresiones.'
                : 'Testes automatizados/manuais via Postman e blindagem contra regressões.',
        },
    ];

    return (
        <div ref={sectionRef} className="space-y-6">
            {/* ── Section Header ── */}
            <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.07] mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                    <span className="font-mono text-[11px] tracking-[0.25em] text-neutral-400 uppercase">
                        {lang === 'en'
                            ? '// 01. BIOGRAPHY & TECHNICAL GUIDELINES'
                            : lang === 'es'
                            ? '// 01. BIOGRAFÍA Y DIRECTRICES TÉCNICAS'
                            : '// 01. BIOGRAFIA & DIRETRIZES TÉCNICAS'}
                    </span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-2">
                    {t('about.title')}
                </h2>
                <p className="text-neutral-400 max-w-2xl font-sans text-sm sm:text-base leading-relaxed">
                    {t('about.subtitle') || 'Engenharia de software focada em modernização, alta disponibilidade e impacto real em produção.'}
                </p>
            </div>

            {/* ── Métricas em grade horizontal ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {aboutMetrics.map((metric, idx) => (
                    <div
                        key={idx}
                        style={{ transform: 'translateZ(0)' }}
                        className="bg-[#0c0e14]/90 backdrop-blur-sm border border-white/[0.07] rounded-xl p-3 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
                    >
                        <i className={`${metric.icon} text-base text-neutral-500 mb-1.5 block`} />
                        <AnimatedCounter
                            targetValue={metric.value}
                            suffix={metric.suffix}
                            isVisible={isSectionVisible}
                        />
                        <span className="text-neutral-400 text-[11px] mt-1 block leading-tight">
                            {metric.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* ── Pilares de especialidade ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {pillars.map((pillar, idx) => (
                    <div
                        key={idx}
                        style={{ transform: 'translateZ(0)' }}
                        className="bg-[#0c0e14]/90 backdrop-blur-sm border border-white/[0.07] rounded-xl p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <i className={`${pillar.icon} text-sm text-neutral-400`} />
                            <h4 className="text-white font-semibold text-sm">{pillar.title}</h4>
                        </div>
                        <p className="text-neutral-400 text-xs leading-relaxed">{pillar.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default memo(AboutMeContent);
