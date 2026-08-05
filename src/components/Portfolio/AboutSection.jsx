import { motion } from 'framer-motion';
import { TiltCard } from './InteractiveEffects';

const CARDS = [
    {
        icon: 'fas fa-code',
        title: 'Front-end',
        items: ['React + TypeScript', 'Tailwind CSS', 'Framer Motion', 'HTML5 / CSS3'],
    },
    {
        icon: 'fas fa-server',
        title: 'Back-end',
        items: ['PHP / Laravel', 'Node.js', 'Delphi (Desktop + UniGui)', 'REST APIs'],
    },
    {
        icon: 'fas fa-database',
        title: 'Database',
        items: ['MySQL', 'SQL Server (cloud)', 'PostgreSQL', 'Otimização de queries'],
    },
    {
        icon: 'fas fa-tools',
        title: 'DevOps & Ferramentas',
        items: ['Git / GitHub', 'Docker', 'Railway / Render', 'Linux CLI'],
    },
];

export default function AboutSection() {
    return (
        <section id="sobre" className="grid-bg py-24 bg-darker relative border-t border-primary/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row gap-12 items-start"
                >
                    {/* ─── Bio ─────────────────────────────────────────────── */}
                    <div className="flex-1 w-full relative">
                        <div className="absolute inset-0 bg-secondary blur-[100px] opacity-5 pointer-events-none" />
                        <div className="relative bg-dark border border-primary/40 p-8 md:p-10 rounded-2xl shadow-xl">
                            <i className="fas fa-quote-left text-4xl text-secondary/20 absolute top-6 left-6" />

                            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-4">
                                <span className="w-10 h-[2px] bg-secondary inline-block shrink-0" />
                                Sobre Mim
                            </h2>

                            <div className="space-y-4 text-gray-400 leading-relaxed">
                                <h3 className="text-xl font-bold text-white">Resumo Profissional</h3>
                                <p>
                                    Desenvolvedor FullStack em estágio com{' '}
                                    <span className="text-secondary font-semibold">10+ meses</span> de experiência
                                    prática em sistemas PDV/ERP de alta carga, atuando diretamente em produção
                                    com mais de <span className="text-secondary font-semibold">100 usuários diários</span>.
                                </p>
                                <p>
                                    Especializado em{' '}
                                    <span className="text-white font-semibold">Delphi (Desktop & UniGui)</span>,{' '}
                                    <span className="text-white font-semibold">PHP/Laravel</span>,{' '}
                                    <span className="text-white font-semibold">React + TypeScript</span> e{' '}
                                    <span className="text-white font-semibold">Tailwind CSS</span>. Tenho experiência
                                    com <span className="text-white font-semibold">Node.js</span> e com
                                    otimizações críticas de banco de dados, reduzindo tempo de resposta de consultas
                                    de <span className="text-secondary font-semibold">2 s → &lt; 500 ms</span> via
                                    índices e refatoração de queries N+1.
                                </p>
                                <p>
                                    Já integrei componentes fiscais (ACBR) e de relatórios (FortesReport) em
                                    ambiente de produção, garantindo conformidade legal em{' '}
                                    <span className="text-secondary font-semibold">100%</span> das transações
                                    processadas.
                                </p>

                                {/* Destaques rápidos */}
                                <div className="grid grid-cols-2 gap-3 pt-4">
                                    {[
                                        { icon: 'fas fa-briefcase', label: '10+ meses de experiência' },
                                        { icon: 'fas fa-users',     label: '100+ usuários em produção' },
                                        { icon: 'fas fa-bug',       label: '8+ bugs críticos resolvidos' },
                                        { icon: 'fas fa-tachometer-alt', label: 'Queries 4× mais rápidas' },
                                    ].map(({ icon, label }) => (
                                        <div key={label} className="flex items-center gap-2 text-sm text-gray-300 bg-darker/60 rounded-lg px-3 py-2 border border-primary/20">
                                            <i className={`${icon} text-secondary text-xs shrink-0`} />
                                            {label}
                                        </div>
                                    ))}
                                </div>

                                {/* Educação */}
                                <div className="pt-6 mt-2 border-t border-primary/20">
                                    <h3 className="text-xl font-bold text-white mb-4">Educação</h3>
                                    <div className="space-y-3">
                                        <div className="bg-darker/60 p-4 rounded-xl border border-primary/20 hover:border-secondary/30 transition-colors">
                                            <h4 className="font-bold text-white text-sm">Bacharelado em Engenharia de Software</h4>
                                            <p className="text-secondary text-xs mt-1">UNIFANOR WYDEN • Abr 2026 → Dez 2030</p>
                                        </div>
                                        <div className="bg-darker/60 p-4 rounded-xl border border-primary/20 hover:border-secondary/30 transition-colors">
                                            <h4 className="font-bold text-white text-sm">Técnico em Informática</h4>
                                            <p className="text-secondary text-xs mt-1">EEEP LUIZA DE TEODORO VIEIRA • Jan 2023 → Dez 2025</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ─── Cards de especialidade ───────────────────────────── */}
                    <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {CARDS.map(({ icon, title, items }, idx) => (
                            <motion.div
                                key={title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                            >
                                <TiltCard
                                    intensity={10}
                                    className="group h-full bg-dark border border-primary/30 p-6 rounded-xl hover:border-secondary/50 hover:shadow-[0_0_24px_rgba(102,252,241,0.12)] transition-all duration-300 cursor-default"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/10 border border-secondary/20 group-hover:bg-secondary/20 transition-colors">
                                            <i className={`${icon} text-secondary text-lg`} />
                                        </span>
                                        <h3 className="text-base font-bold text-white group-hover:text-secondary transition-colors">
                                            {title}
                                        </h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {items.map((item) => (
                                            <li key={item} className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                                                <i className="fas fa-chevron-right text-secondary/60 text-xs" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </TiltCard>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
