import { ChapterHeading } from './Common/ScrollChapter';
import CareerEntranceStage from './Common/CareerEntranceStage';
import SectionDivider from './Common/SectionDivider';
import { useCareerMasterScene } from '../../hooks/useCareerEntrance';
import React, { useRef, useState, useMemo, memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import JourneyPhotoModal, { JourneyMilestoneArchive } from './JourneyPhotoModal';
import JourneyMigrationDiagram from './JourneyMigrationDiagram';
import TechCompanionCritter from './TechCompanionCritter';
import './career-entrance.css';

/** Faz highlight de métricas numéricas e termos técnicos-chave no texto */
function HighlightedText({ text }: { text: string }) {
    const pattern = /(\d+[\+\-]?\s*(?:ms|s|%|usuários|bugs|travamentos|Endpoints)?(?:\s*diários)?|<\d+ms|N\+1|100\+|8\+|Multi-tenant|RBAC|ZPEs?|ePita)/g;
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

export interface TimelineResponsibilityGroup {
    title: string;
    icon?: string;
    items: string[];
}

export interface JourneyExperienceItem {
    id?: number;
    company: string;
    role: string;
    period: string;
    techBadges?: string[];
    groups?: TimelineResponsibilityGroup[];
}

function TimelineResponsibilities({ groups }: { groups?: TimelineResponsibilityGroup[] }) {
    if (!groups?.length) return null;
    return (
        <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.01]">
            {groups.map((group, gIdx) => (
                <div key={gIdx} className="space-y-2.5">
                    <div className="flex items-center gap-2 text-secondary font-semibold text-xs tracking-wider uppercase font-sans">
                        <i aria-hidden="true" className={`${group.icon || 'fas fa-check-circle'} text-[11px]`} />
                        <span>{group.title}</span>
                    </div>
                    <ul className="space-y-2">
                        {group.items &&
                            group.items.map((item, iIdx) => (
                                <li
                                    key={iIdx}
                                    className="text-neutral-300 text-[13px] sm:text-sm leading-relaxed flex items-start gap-2"
                                >
                                    <span className="text-accent mt-1.5 text-[8px] shrink-0">•</span>
                                    <span>
                                        <HighlightedText text={item} />
                                    </span>
                                </li>
                            ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

/** Card de Experiência com Micro-tilt 3D Suave e Cantoneiras de Foco Ativo */
const TimelineExperienceCard = memo(function TimelineExperienceCard({
    company,
    role,
    period,
    isCurrent,
    techBadges,
    groups,
    lang,
}: {
    company: string;
    role: string;
    period: string;
    isCurrent?: boolean;
    techBadges?: string[];
    groups?: TimelineResponsibilityGroup[];
    lang: string;
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const rectRef = useRef<DOMRect | null>(null);
    const xPct = useMotionValue(0);
    const yPct = useMotionValue(0);

    const springConfig = { damping: 24, stiffness: 200, mass: 0.4 };
    const xSpring = useSpring(xPct, springConfig);
    const ySpring = useSpring(yPct, springConfig);

    const rotateX = useTransform(ySpring, [-0.5, 0.5], ['3deg', '-3deg']);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], ['-3deg', '3deg']);

    const handleMouseEnter = () => {
        if (cardRef.current) {
            rectRef.current = cardRef.current.getBoundingClientRect();
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        if (!rectRef.current) {
            rectRef.current = cardRef.current.getBoundingClientRect();
        }
        const rect = rectRef.current;
        xPct.set((e.clientX - rect.left) / rect.width - 0.5);
        yPct.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
        rectRef.current = null;
        xPct.set(0);
        yPct.set(0);
    };

    return (
        <div style={{ perspective: 1000 }} className="w-full">
            <motion.div
                ref={cardRef}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                    transform: 'translateZ(0)',
                }}
                data-cursor-card="true"
                className="portfolio-surface portfolio-card-hover career-experience-surface overflow-hidden group"
            >
                {/* Cantoneiras Técnicas HUD que acendem quando o marco está em foco */}
                <div className="portfolio-hud-corners career-focus-corners" aria-hidden="true">
                    <span className="portfolio-hud-corner-bl" />
                    <span className="portfolio-hud-corner-br" />
                </div>

                {/* Cabeçalho do Card */}
                <div data-career-card-header className="p-5 md:p-6 border-b border-white/[0.06] bg-white/[0.015]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl sm:text-2xl font-bold font-serif text-white group-hover:text-secondary transition-colors">
                                {company}
                            </h3>
                            {isCurrent && (
                                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-300 font-mono text-[11px]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    {lang === 'en'
                                        ? 'Current Role'
                                        : lang === 'es'
                                        ? 'Puesto Actual'
                                        : 'Cargo Atual'}
                                </span>
                            )}
                        </div>
                        <span className="portfolio-chip self-start sm:self-auto">{period}</span>
                    </div>

                    <p className="text-secondary font-medium text-sm sm:text-base font-sans mb-4">{role}</p>

                    {/* Tech Badges */}
                    {techBadges && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {techBadges.map((badge, bIdx) => (
                                <span key={bIdx} className="portfolio-chip-dashed select-none">
                                    {badge}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <TimelineResponsibilities groups={groups} />
            </motion.div>
        </div>
    );
});

interface ProfessionalJourneyTimelineProps {
    experiences?: JourneyExperienceItem[];
    guidedIntro?: boolean;
    entrancePillars?: React.ReactNode;
}

export const ProfessionalJourneyTimeline: React.FC<ProfessionalJourneyTimelineProps> = ({
    experiences = [],
    guidedIntro = false,
    entrancePillars,
}) => {
    const { t, lang } = useLanguage();
    const sceneRef = useRef<HTMLDivElement>(null);
    const [selectedArchive, setSelectedArchive] = useState<JourneyMilestoneArchive | null>(null);

    useCareerMasterScene(sceneRef);

    // Métricas executivas da trajetória
    const summaryStats = [
        {
            value: '10+ ' + (lang === 'en' ? 'Months' : 'Meses'),
            label:
                lang === 'en'
                    ? 'Production experience'
                    : lang === 'es'
                    ? 'Experiencia en producción'
                    : 'Experiência em produção',
            icon: 'fas fa-calendar-check',
        },
        {
            value: '100+ ' + (lang === 'en' ? 'Users' : lang === 'es' ? 'Usuarios' : 'Usuários'),
            label:
                lang === 'en'
                    ? 'Daily on ERP systems'
                    : lang === 'es'
                    ? 'Diarios en sistemas ERP'
                    : 'Diários em sistemas ERP',
            icon: 'fas fa-users',
        },
        {
            value: lang === 'en' ? '25% Fewer Bugs' : '25% Menos Bugs',
            label:
                lang === 'en'
                    ? 'Via proactive QA'
                    : lang === 'es'
                    ? 'Vía QA preventivo'
                    : 'Via QA preventivo',
            icon: 'fas fa-shield-alt',
        },
        {
            value: lang === 'en' ? '4× Faster' : lang === 'es' ? '4× Más Rápido' : '4× Mais Rápido',
            label:
                lang === 'en'
                    ? 'Optimized queries (<500ms)'
                    : lang === 'es'
                    ? 'Consultas optimizadas (<500ms)'
                    : 'Queries otimizadas (<500ms)',
            icon: 'fas fa-bolt',
        },
    ];

    const ARCHIVES: Record<string, JourneyMilestoneArchive> = useMemo(
        () => ({
            '2026': {
                id: 'archive-2026',
                year: '2026',
                company: 'SETE Tecnologia',
                role:
                    lang === 'en'
                        ? 'Quality assurance & software testing'
                        : lang === 'es'
                        ? 'Calidad y pruebas de software'
                        : 'Qualidade de software & testes',
                archiveTitle:
                    lang === 'en'
                        ? 'View the ePita quality assurance record'
                        : lang === 'es'
                        ? 'Ver el registro de calidad ePita'
                        : 'Ver registro de qualidade do ePita',
                image: '/projects/epta_qa_split_2026.png',
                mediaCaption:
                    lang === 'en'
                        ? 'ePita — login, registration approval and access monitoring screens.'
                        : lang === 'es'
                        ? 'ePita — pantallas de acceso, aprobación de registros y seguimiento de accesos.'
                        : 'ePita — telas de acesso, aprovação de cadastros e acompanhamento de acessos.',
                date: lang === 'en' ? 'Jun 2026 — Present' : 'Jun 2026 — Presente',
                location:
                    lang === 'en'
                        ? 'Fortaleza, CE · Remote / hybrid'
                        : 'Fortaleza, CE · Remoto / híbrido',
                description:
                    lang === 'en'
                        ? 'Quality assurance for ePita customs and port logistics systems, with a focus on operational rules, integrations and data consistency.'
                        : lang === 'es'
                        ? 'Aseguramiento de calidad en sistemas aduaneros y logísticos portuarios ePita, con foco en reglas operacionales, integraciones y consistencia de datos.'
                        : 'Garantia de qualidade em sistemas alfandegários e logísticos portuários ePita, com foco em regras operacionais, integrações e consistência de dados.',
                contributions:
                    lang === 'en'
                        ? [
                              'Map business rules and requirements with operational teams.',
                              'Execute functional, regression and API integration tests with Postman.',
                              'Validate transactions and investigate data consistency in SQL Server.',
                          ]
                        : lang === 'es'
                        ? [
                              'Mapear reglas de negocio y requisitos con los equipos operacionales.',
                              'Ejecutar pruebas funcionales, de regresión e integración de APIs con Postman.',
                              'Validar transacciones e investigar la consistencia de datos en SQL Server.',
                          ]
                        : [
                              'Mapear regras de negócio e requisitos com as equipes operacionais.',
                              'Executar testes funcionais, regressivos e de integração de APIs com Postman.',
                              'Validar transações e investigar a consistência de dados em SQL Server.',
                          ],
                results: [
                    {
                        label:
                            lang === 'en'
                                ? 'Fewer regressions'
                                : lang === 'es'
                                ? 'Menos regresiones'
                                : 'Menos regressões',
                        value: '25%',
                    },
                    {
                        label:
                            lang === 'en'
                                ? 'Audited endpoints'
                                : lang === 'es'
                                ? 'Endpoints auditados'
                                : 'Endpoints auditados',
                        value: '100+',
                    },
                ],
                technologies: ['Postman', 'SQL Server', 'APIs REST', 'Scrum / Kanban'],
            },
            '2025': {
                id: 'archive-2025',
                year: '2025',
                company: 'Qualisoft Sistemas',
                role:
                    lang === 'en'
                        ? 'Full stack development & legacy modernization'
                        : lang === 'es'
                        ? 'Desarrollo full stack & modernización de legados'
                        : 'Desenvolvimento full stack & modernização de legados',
                archiveTitle:
                    lang === 'en'
                        ? 'View the Qualisoft development record'
                        : lang === 'es'
                        ? 'Ver el registro de desarrollo Qualisoft'
                        : 'Ver registro de desenvolvimento na Qualisoft',
                media: 'process',
                mediaCaption:
                    lang === 'en'
                        ? 'Technical summary of my work. The diagram represents the workstreams; it is not a product screenshot.'
                        : lang === 'es'
                        ? 'Síntesis técnica de mi trabajo. El diagrama representa los frentes de desarrollo; no es una captura del producto.'
                        : 'Síntese técnica da minha atuação. O diagrama representa as frentes de trabalho, sem reproduzir uma tela do produto.',
                date: lang === 'en' ? 'Aug 2025 — Jun 2026' : 'Ago 2025 — Jun 2026',
                location: 'Fortaleza, CE',
                description:
                    lang === 'en'
                        ? 'Development of ERP management interfaces and APIs, alongside the modernization of a Delphi desktop application for the web.'
                        : lang === 'es'
                        ? 'Desarrollo de interfaces de gestión y APIs para ERP, junto con la modernización de una aplicación Delphi de escritorio para la web.'
                        : 'Desenvolvimento de interfaces de gestão e APIs para ERP, junto à modernização de uma aplicação Delphi desktop para a web.',
                contributions:
                    lang === 'en'
                        ? [
                              'Build management interfaces with React and TypeScript, integrated with Laravel REST APIs.',
                              'Contribute to the modernization of Delphi/VCL systems with Delphi 11 and UniGui.',
                              'Refactor SQL Server/MySQL queries and indexes to improve report response times.',
                          ]
                        : lang === 'es'
                        ? [
                              'Desarrollar interfaces de gestión con React y TypeScript, integradas con APIs REST Laravel.',
                              'Participar en la modernización de sistemas Delphi/VCL con Delphi 11 y UniGui.',
                              'Refactorizar consultas e índices SQL Server/MySQL para mejorar el tiempo de los informes.',
                          ]
                        : [
                              'Desenvolver interfaces de retaguarda com React e TypeScript, integradas a APIs REST Laravel.',
                              'Participar da modernização de sistemas Delphi/VCL com Delphi 11 e UniGui.',
                              'Refatorar consultas e índices SQL Server/MySQL para melhorar a resposta dos relatórios.',
                          ],
                results: [
                    {
                        label:
                            lang === 'en'
                                ? 'Queries, previously 2s'
                                : lang === 'es'
                                ? 'Consultas, antes 2s'
                                : 'Consultas, antes 2s',
                        value: '<500ms',
                    },
                    {
                        label:
                            lang === 'en'
                                ? 'Daily ERP users'
                                : lang === 'es'
                                ? 'Usuarios diarios del ERP'
                                : 'Usuários diários no ERP',
                        value: '100+',
                    },
                ],
                technologies: ['React', 'TypeScript', 'PHP / Laravel', 'Delphi 11', 'UniGui', 'SQL Server', 'MySQL'],
            },
            '2024': {
                id: 'archive-2024',
                year: '2024',
                company: 'EEEP Luiza de Teodoro Vieira',
                role:
                    lang === 'en'
                        ? 'High school & technical education in IT'
                        : lang === 'es'
                        ? 'Bachillerato & formación técnica en informática'
                        : 'Ensino médio & formação técnica em informática',
                archiveTitle:
                    lang === 'en'
                        ? 'View the EEEP technical class record'
                        : lang === 'es'
                        ? 'Ver el registro de la clase técnica EEEP'
                        : 'Ver registro da turma técnica EEEP',
                image: '/projects/eeep_turma_2024.jpg',
                mediaCaption:
                    lang === 'en'
                        ? 'Technical IT class at EEEP Luiza de Teodoro Vieira, photographed in 2024.'
                        : lang === 'es'
                        ? 'Clase técnica de informática de EEEP Luiza de Teodoro Vieira, fotografiada en 2024.'
                        : 'Turma técnica em informática da EEEP Luiza de Teodoro Vieira, fotografada em 2024.',
                date: lang === 'en' ? 'Jan 2023 — Dec 2025' : lang === 'es' ? 'Ene 2023 — Dic 2025' : 'Jan 2023 — Dez 2025',
                location: 'Pacatuba, CE',
                description:
                    lang === 'en'
                        ? 'Integrated high school and technical IT education, completed in 2025. The programme combined programming fundamentals with practical web, design and robotics projects.'
                        : lang === 'es'
                        ? 'Bachillerato integrado con formación técnica en informática, concluido en 2025. La formación combinó fundamentos de programación con proyectos prácticos de web, diseño y robótica.'
                        : 'Ensino médio integrado à formação técnica em informática, concluído em 2025. A formação combinou fundamentos de programação com projetos práticos de web, design e robótica.',
                contributions:
                    lang === 'en'
                        ? [
                              'Practice algorithms, data structures and object-oriented programming with Python and Java.',
                              'Build web interfaces with HTML, CSS and JavaScript.',
                              'Explore UI/UX design and robotics through integrated projects.',
                          ]
                        : lang === 'es'
                        ? [
                              'Practicar algoritmos, estructuras de datos y programación orientada a objetos con Python y Java.',
                              'Construir interfaces web con HTML, CSS y JavaScript.',
                              'Explorar diseño UI/UX y robótica en proyectos integradores.',
                          ]
                        : [
                              'Praticar algoritmos, estruturas de dados e orientação a objetos com Python e Java.',
                              'Construir interfaces web com HTML, CSS e JavaScript.',
                              'Explorar UI/UX Design e robótica em projetos integradores.',
                          ],
                results: [],
                technologies: [
                    'Python',
                    'Java',
                    'HTML',
                    'CSS',
                    'JavaScript',
                    'UI/UX',
                    lang === 'en' ? 'Robotics' : 'Robótica',
                ],
            },
        }),
        [lang]
    );

    // Dados dinâmicos para cada um dos 3 marcos (2026, 2025, 2024)
    const seteExp = experiences.find((e) => e.id === 2) || {
        company: 'SETE Tecnologia',
        role: 'Analista de Qualidade de Software (QA) e Testes — Estágio',
        period: 'Junho de 2026 - Presente',
        techBadges: [
            'QA',
            'Testes de Regressão',
            'Postman',
            'APIs RESTful',
            'SQL Server',
            'Scrum / Kanban',
            'Engenharia de Requisitos',
        ],
        groups: [
            {
                title: 'Garantia de Qualidade & Requisitos',
                icon: 'fas fa-shield-alt',
                items: [
                    'Atuação em sistemas de missão crítica no setor logístico e portuário (ZPEs).',
                    'Mapeamento de 100% dos requisitos operacionais e regras de negócio com múltiplos setores.',
                    'Execução de testes funcionais e de regressão ágeis blindando entregas de software.',
                ],
            },
            {
                title: 'Validação de APIs & SQL',
                icon: 'fas fa-database',
                items: [
                    'Consumo e testes de integração de serviços RESTful com collections estruturadas no Postman.',
                    'Execução de queries diagnósticas e validação de transações no core ePita com SQL Server.',
                ],
            },
        ],
    };

    const qualiExp = experiences.find((e) => e.id === 1) || {
        company: 'Qualisoft Sistemas',
        role: 'Desenvolvedor Full Stack (React / TypeScript / PHP / Delphi / SQL) — Estágio',
        period: 'Agosto de 2025 - Junho de 2026',
        techBadges: [
            'React',
            'TypeScript',
            'PHP / Laravel',
            'Delphi 11',
            'UniGui',
            'MySQL',
            'SQL Server',
            'ACBr',
            'RESTful APIs',
            'FortesReport',
        ],
        groups: [
            {
                title: 'Desenvolvimento Full Stack & Módulos Web',
                icon: 'fas fa-laptop-code',
                items: [
                    'Aprendizado prático e implementação em produção de React + TypeScript para interfaces reativas e módulos de retaguarda.',
                    'Desenvolvimento de APIs RESTful estruturadas em PHP com Laravel aplicando arquitetura em camadas e autenticação Sanctum.',
                ],
            },
            {
                title: 'Otimização de Banco & Performance',
                icon: 'fas fa-tachometer-alt',
                items: [
                    'Refatoração de consultas SQL Server/MySQL reduzindo tempo de relatórios de 2s para <500ms via índices compostos.',
                    'Criação de procedures e views analíticas para ERP com centenas de operações diárias.',
                ],
            },
            {
                title: 'Modernização de Legados & Delphi',
                icon: 'fas fa-sync-alt',
                items: [
                    'Engenharia de migração de monolito Delphi VCL para arquitetura Web moderna com Delphi 11 + UniGui.',
                    'Integração de bibliotecas fiscais ACBr para emissão de NF-e/NFC-e e manutenção de relatórios.',
                ],
            },
        ],
    };

    const tecnicoExp = {
        company: 'EEEP Luiza de Teodoro Vieira',
        role:
            lang === 'en'
                ? 'Integrated High School & Technical IT Diploma'
                : lang === 'es'
                ? 'Bachillerato Integrado con Técnico en Informática'
                : 'Ensino Médio Integrado ao Técnico em Informática',
        period:
            lang === 'en'
                ? 'January 2023 - December 2025'
                : lang === 'es'
                ? 'Enero de 2023 - Diciembre de 2025'
                : 'Janeiro de 2023 - Dezembro de 2025',
        techBadges: [
            'Python',
            'Java',
            'HTML5',
            'CSS3',
            'JavaScript',
            'Robótica',
            'UI/UX Design',
            'Algoritmos',
            'Lógica de Programação',
        ],
        groups: [
            {
                title:
                    lang === 'en'
                        ? 'Programming & Web Development'
                        : lang === 'es'
                        ? 'Programación y Desarrollo Web'
                        : 'Programação & Desenvolvimento Web',
                icon: 'fas fa-code',
                items: [
                    lang === 'en'
                        ? 'Hands-on training in algorithmic logic, data structures, and object-oriented programming with Python and Java.'
                        : lang === 'es'
                        ? 'Formación práctica en lógica algorítmica, estructuras de datos y programación orientada a objetos con Python y Java.'
                        : 'Formação prática e contínua em lógica algorítmica, estruturas de dados e programação orientada a objetos com Python e Java.',
                    lang === 'en'
                        ? 'Building web applications and interfaces applying semantic HTML5, modern CSS3 styling, and JavaScript interactivity.'
                        : lang === 'es'
                        ? 'Construcción de aplicaciones e interfaces web aplicando estándares semánticos de HTML5, CSS3 moderno y dinamismo con JavaScript.'
                        : 'Construção de aplicações e interfaces web aplicando padrões semânticos de HTML5, estilização moderna com CSS3 e dinamismo com JavaScript.',
                ],
            },
            {
                title:
                    lang === 'en'
                        ? 'Design, Robotics & Applied Projects'
                        : lang === 'es'
                        ? 'Diseño, Robótica y Proyectos Prácticos'
                        : 'Design, Robótica & Projetos Práticos',
                icon: 'fas fa-robot',
                items: [
                    lang === 'en'
                        ? 'Hands-on assembly of robotics projects integrating automation and programmable microcontrollers.'
                        : lang === 'es'
                        ? 'Desarrollo y montaje de proyectos prácticos de robótica integrando automatización y hardware programable.'
                        : 'Desenvolvimento e montagem de projetos práticos de robótica e circuitos integrando automação e hardware programável.',
                    lang === 'en'
                        ? 'Core UI/UX Design concepts, visual prototyping, and clean code principles.'
                        : lang === 'es'
                        ? 'Conceptos fundamentales de UI/UX Design, prototipado visual y principios de código limpio.'
                        : 'Conceitos fundamentais de UI/UX Design, prototipagem visual e princípios de organização e código limpo.',
                ],
            },
        ],
    };

    return (
        <div ref={sceneRef} className="career-scene-wrapper">
            <CareerEntranceStage pillars={entrancePillars}>
                {entrancePillars && <SectionDivider className="my-4 md:my-6" marker="+" />}

                <section
                    id="career-details"
                    aria-labelledby="experience-heading"
                    className="py-16 md:py-24 bg-transparent relative overflow-visible"
                >
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        {/* ── 1. Cabeçalho da Trajetória Profissional ── */}
                        <div className="career-heading-block">
                            <ChapterHeading className="career-heading relative text-center mb-12">
                                <div className="journey-intro">
                                    <div id="experiencia" className="journey-heading-anchor">
                                        <div
                                            data-journey-guide-slot
                                            className="journey-guide-slot flex justify-center mb-4"
                                        >
                                            {(!guidedIntro || entrancePillars !== undefined) && (
                                                <TechCompanionCritter
                                                    variant="sentinel-timeline"
                                                    captionPosition="top"
                                                    className="transition-transform duration-300 hover:scale-105"
                                                />
                                            )}
                                        </div>

                                        <div className="journey-heading-motion">
                                            <span className="portfolio-eyebrow mb-2 block">
                                                {lang === 'en'
                                                    ? 'CAREER & OPERATIONAL ENGINEERING'
                                                    : lang === 'es'
                                                    ? 'TRAYECTORIA E INGENIERÍA OPERACIONAL'
                                                    : 'TRAJETÓRIA & ENGENHARIA OPERACIONAL'}
                                            </span>
                                            <h2 id="experience-heading" className="portfolio-title mb-4">
                                                {t('experience.title') || 'Trajetória Profissional'}
                                            </h2>
                                            <p className="portfolio-lede max-w-2xl mx-auto">
                                                {t('experience.subtitle') ||
                                                    'Evolução técnica contínua: do domínio de engenharia e modernização de legados à garantia de qualidade em ambientes de missão crítica.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </ChapterHeading>
                        </div>

                        {/* ── 2. Strip de 4 Métricas Executivas com Entrada Sequencial em Cascata ── */}
                        <div className="career-summary grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
                            {summaryStats.map((stat, idx) => (
                                <div
                                    key={idx}
                                    data-career-metric={idx}
                                    data-cursor-card="true"
                                    className="portfolio-surface portfolio-card-hover flex items-center gap-3.5 p-4"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-neutral-300 shrink-0">
                                        <i aria-hidden="true" className={`${stat.icon} text-sm`} />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-mono text-base md:text-lg font-bold text-white tracking-tight">
                                            {stat.value}
                                        </span>
                                        <span
                                            className="text-[11px] text-neutral-400 font-sans truncate"
                                            title={stat.label}
                                        >
                                            {stat.label}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ══════════════════════════════════════════════════════════════════
                            3. ESPINHA DORSAL CENTRAL UNIFICADA & TIMELINE ALTERNADA (ZIG-ZAG)
                            Um único trilho de precisão milimétrica do centro de 2026 ao centro de 2024
                            ══════════════════════════════════════════════════════════════════ */}
                        <div className="career-timeline-master relative w-full max-w-5xl mx-auto py-4">
                            {/* Trilho Mestre Contínuo (Desktop Central / Mobile Lateral) */}
                            <div className="career-master-rail" aria-hidden="true">
                                {/* Escala milimétrica técnica */}
                                <div className="career-rail-ticks" />
                                {/* Filamento guia base */}
                                <div className="career-rail-base" />
                                {/* Feixe energético contínuo (mesma coloração do início ao fim) */}
                                <div data-career-beam-fill className="career-rail-beam" />
                                {/* Núcleo óptico viajante único */}
                                <div data-career-traveller className="career-rail-traveller">
                                    <div className="career-rail-traveller-halo" />
                                    <div className="career-rail-traveller-ring" />
                                    <div className="career-rail-traveller-core" />
                                    <span data-career-traveller-year className="career-rail-traveller-badge">
                                        2026
                                    </span>
                                </div>
                            </div>

                            {/* Grid de Marcos: 2026 -> 2025 -> 2024 */}
                            <div className="space-y-24 md:space-y-36 pl-8 sm:pl-12 md:pl-0">
                                {/* ══════════════════════════════════════════════════════════
                                    MARCO 2026: SETE TECNOLOGIA (Analista de QA & Testes)
                                    Desktop: Esquerda = Ano 2026 + Pasta | Direita = Card QA
                                    ══════════════════════════════════════════════════════════ */}
                                <div
                                    data-career-row="2026"
                                    data-career-active="true"
                                    className="career-milestone-row relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center"
                                >
                                    {/* Feixe conector horizontal e Nó de Estação 2026 */}
                                    <div data-career-branch="2026" className="career-station-branch" aria-hidden="true" />
                                    <div data-career-node="2026" className="career-station-node" aria-hidden="true">
                                        <div className="career-station-reticle" />
                                        <div className="career-station-ring">
                                            <div className="career-station-dot" />
                                        </div>
                                    </div>

                                    {/* Lado Esquerdo: Ano Escultural Monumental + Pasta Técnica */}
                                    <div
                                        data-career-year-col="2026"
                                        className="flex flex-col items-center md:items-end text-center md:text-right space-y-3"
                                    >
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-green-500/10 text-green-400 border border-green-500/30">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                            <span>
                                                {lang === 'en'
                                                    ? 'CURRENTLY IN PRODUCTION'
                                                    : lang === 'es'
                                                    ? 'ACTUALMENTE EN PRODUCCIÓN'
                                                    : 'ATUALMENTE EM PRODUÇÃO'}
                                            </span>
                                        </div>

                                        <span className="career-monumental-year text-6xl sm:text-7xl md:text-8xl origin-center md:origin-right">
                                            2026
                                        </span>

                                        <p className="text-xs font-mono text-gray-400 max-w-xs">
                                            {lang === 'en'
                                                ? 'Quality assurance, operational rules mapping in FTZs, and transaction validation in the ePita core.'
                                                : lang === 'es'
                                                ? 'Aseguramiento de calidad, mapeo de reglas operacionales en ZPEs y validación de transacciones en el core ePita.'
                                                : 'Garantia de qualidade, mapeamento de regras operacionais em ZPEs e validação de transações no core ePita.'}
                                        </p>

                                        <button
                                            type="button"
                                            aria-label={ARCHIVES['2026'].archiveTitle}
                                            onClick={() => setSelectedArchive(ARCHIVES['2026'])}
                                            data-cursor-morph="true"
                                            className="journey-record-thumbnail"
                                        >
                                            <img src={ARCHIVES['2026'].image} alt="" loading="lazy" />
                                            <span className="journey-record-thumbnail-caption">
                                                <span>
                                                    {lang === 'en'
                                                        ? 'Quality assurance record'
                                                        : lang === 'es'
                                                        ? 'Registro de calidad'
                                                        : 'Registro de qualidade'}
                                                </span>
                                                <span aria-hidden="true">↗</span>
                                            </span>
                                        </button>
                                    </div>

                                    {/* Lado Direito: Card Detalhado de QA */}
                                    <div data-career-card-col="2026">
                                        <TimelineExperienceCard
                                            company={seteExp.company}
                                            role={seteExp.role}
                                            period={seteExp.period}
                                            isCurrent={true}
                                            techBadges={seteExp.techBadges}
                                            groups={seteExp.groups}
                                            lang={lang}
                                        />
                                    </div>
                                </div>

                                {/* ══════════════════════════════════════════════════════════
                                    MARCO 2025: QUALISOFT SISTEMAS (Back-End / Fullstack)
                                    Desktop: Esquerda = Card Qualisoft | Direita = Ano 2025 + Pasta
                                    ══════════════════════════════════════════════════════════ */}
                                <div
                                    data-career-row="2025"
                                    className="career-milestone-row relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center"
                                >
                                    {/* Feixe conector horizontal e Nó de Estação 2025 */}
                                    <div data-career-branch="2025" className="career-station-branch" aria-hidden="true" />
                                    <div data-career-node="2025" className="career-station-node" aria-hidden="true">
                                        <div className="career-station-reticle" />
                                        <div className="career-station-ring">
                                            <div className="career-station-dot" />
                                        </div>
                                    </div>

                                    {/* Lado Esquerdo (Desktop): Card Detalhado Qualisoft */}
                                    <div data-career-card-col="2025" className="order-2 md:order-1">
                                        <TimelineExperienceCard
                                            company={qualiExp.company}
                                            role={qualiExp.role}
                                            period={qualiExp.period}
                                            isCurrent={false}
                                            techBadges={qualiExp.techBadges}
                                            groups={qualiExp.groups}
                                            lang={lang}
                                        />
                                    </div>

                                    {/* Lado Direito (Desktop): Ano 2025 Monumental + Pasta Técnica */}
                                    <div
                                        data-career-year-col="2025"
                                        className="order-1 md:order-2 flex flex-col items-center md:items-start text-center md:text-left space-y-3"
                                    >
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-accent/10 text-secondary border border-accent/30">
                                            <i aria-hidden="true" className="fas fa-check text-[10px]" />
                                            <span>
                                                {lang === 'en'
                                                    ? 'SUCCESSFULLY COMPLETED'
                                                    : lang === 'es'
                                                    ? 'CONCLUIDO CON ÉXITO'
                                                    : 'CONCLUÍDO COM SUCESSO'}
                                            </span>
                                        </div>

                                        <span className="career-monumental-year text-6xl sm:text-7xl md:text-8xl origin-center md:origin-left">
                                            2025
                                        </span>

                                        <p className="text-xs font-mono text-gray-400 max-w-xs">
                                            {lang === 'en'
                                                ? 'Legacy Desktop VCL monolith modernization to Web via UniGui, Laravel APIs, and query tuning from 2s to <500ms.'
                                                : lang === 'es'
                                                ? 'Modernización de monolito Desktop VCL a Web vía UniGui, APIs Laravel y optimización de consultas de 2s a <500ms.'
                                                : 'Modernização monolito Desktop VCL para Web via UniGui, APIs Laravel e tuning de queries de 2s para <500ms.'}
                                        </p>

                                        <button
                                            type="button"
                                            aria-label={ARCHIVES['2025'].archiveTitle}
                                            onClick={() => setSelectedArchive(ARCHIVES['2025'])}
                                            data-cursor-morph="true"
                                            className="journey-record-thumbnail"
                                        >
                                            <JourneyMigrationDiagram language={lang} compact />
                                            <span className="journey-record-thumbnail-caption">
                                                <span>
                                                    {lang === 'en'
                                                        ? 'Development record'
                                                        : lang === 'es'
                                                        ? 'Registro de desarrollo'
                                                        : 'Registro de desenvolvimento'}
                                                </span>
                                                <span aria-hidden="true">↗</span>
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {/* ══════════════════════════════════════════════════════════
                                    MARCO 2024: EEEP LUIZA DE TEODORO VIEIRA (Formação Técnica)
                                    Desktop: Esquerda = Ano 2024 + Pasta | Direita = Card Acadêmico
                                    ══════════════════════════════════════════════════════════ */}
                                <div className="chapter-tail">
                                    <div
                                        data-career-row="2024"
                                        className="career-milestone-row relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center"
                                    >
                                        {/* Feixe conector horizontal e Nó de Estação 2024 */}
                                        <div
                                            data-career-branch="2024"
                                            className="career-station-branch"
                                            aria-hidden="true"
                                        />
                                        <div data-career-node="2024" className="career-station-node" aria-hidden="true">
                                            <div className="career-station-reticle" />
                                            <div className="career-station-ring">
                                                <div className="career-station-dot" />
                                            </div>
                                        </div>

                                        {/* Lado Esquerdo: Ano 2024 Monumental + Pasta Técnica */}
                                        <div
                                            data-career-year-col="2024"
                                            className="flex flex-col items-center md:items-end text-center md:text-right space-y-3"
                                        >
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-white/5 text-primary border border-white/10">
                                                <i aria-hidden="true" className="fas fa-graduation-cap text-[10px]" />
                                                <span>
                                                    {lang === 'en'
                                                        ? 'HIGH SCHOOL & TECHNICAL DIPLOMA · 2023 – 2025'
                                                        : lang === 'es'
                                                        ? 'BACHILLERATO Y TÉCNICO · 2023 – 2025'
                                                        : 'ENSINO MÉDIO & TÉCNICO · 2023 – 2025'}
                                                </span>
                                            </div>

                                            <span className="career-monumental-year text-6xl sm:text-7xl md:text-8xl origin-center md:origin-right">
                                                2024
                                            </span>

                                            <p className="text-xs font-mono text-gray-400 max-w-xs">
                                                {lang === 'en'
                                                    ? 'High School and Technical Diploma in IT at EEEP Luiza de Teodoro Vieira: Python, Java, web with HTML/CSS/JS, robotics, and design.'
                                                    : lang === 'es'
                                                    ? 'Bachillerato y Técnico en Informática en EEEP Luiza de Teodoro Vieira: programación con Python y Java, web con HTML/CSS/JS, robótica y diseño.'
                                                    : 'Ensino Médio e Técnico em Informática na EEEP Luiza de Teodoro Vieira: programação com Python e Java, web com HTML/CSS/JS, robótica e design.'}
                                            </p>

                                            <button
                                                type="button"
                                                aria-label={ARCHIVES['2024'].archiveTitle}
                                                onClick={() => setSelectedArchive(ARCHIVES['2024'])}
                                                data-cursor-morph="true"
                                                className="journey-record-thumbnail"
                                            >
                                                <img src={ARCHIVES['2024'].image} alt="" loading="lazy" />
                                                <span className="journey-record-thumbnail-caption">
                                                    <span>
                                                        {lang === 'en'
                                                            ? 'Technical IT class'
                                                            : lang === 'es'
                                                            ? 'Clase técnica en informática'
                                                            : 'Turma técnica em informática'}
                                                    </span>
                                                    <span aria-hidden="true">↗</span>
                                                </span>
                                            </button>
                                        </div>

                                        {/* Lado Direito: Card do Técnico em Informática EEEP */}
                                        <div data-career-card-col="2024">
                                            <TimelineExperienceCard
                                                company={tecnicoExp.company}
                                                role={tecnicoExp.role}
                                                period={tecnicoExp.period}
                                                isCurrent={false}
                                                techBadges={tecnicoExp.techBadges}
                                                groups={tecnicoExp.groups}
                                                lang={lang}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal / Lightbox de Registro Operacional */}
                    <JourneyPhotoModal
                        isOpen={Boolean(selectedArchive)}
                        onClose={() => setSelectedArchive(null)}
                        milestone={selectedArchive}
                    />
                </section>
            </CareerEntranceStage>
        </div>
    );
};

export default memo(ProfessionalJourneyTimeline);
