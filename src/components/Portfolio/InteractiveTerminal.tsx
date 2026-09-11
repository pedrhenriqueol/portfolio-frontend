import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import SnakeGame from './Terminal/games/SnakeGame';
import BugHunterGame from './Terminal/games/BugHunterGame';
import TriviaGame from './Terminal/games/TriviaGame';
import AimTestGame from './Terminal/games/AimTestGame';
import MatrixRain from './Terminal/effects/MatrixRain';
import { ALL_CMD_STRINGS, getWelcomeLines, useTerminalCommands } from './Terminal/useTerminalCommands';

export interface TerminalLine {
    id?: string;
    text: string;
    color?: string;
    node?: React.ReactNode;
    isStreaming?: boolean;
}

export type ActiveTerminalGame = 'snake' | 'bug-hunter' | 'trivia' | 'aim-test' | 'matrix' | null;

interface SimulationStep {
    delay: number;
    line: TerminalLine;
}

/** Renderizador formatado de respostas de IA estilo terminal com gutter lateral dinâmico, animações de entrada e chips de código */
function FormattedCopilotResponse({ text, isStreaming }: { text: string; isStreaming?: boolean }) {
    if (!text && isStreaming) {
        return (
            <div className="border-l-2 border-emerald-400/80 bg-gradient-to-r from-emerald-500/[0.05] to-transparent pl-3.5 py-1.5 my-1.5 rounded-r font-mono text-xs md:text-[13px] leading-relaxed transition-all duration-300">
                <motion.span
                    animate={{ opacity: [1, 0.2, 1], scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block text-emerald-400 font-bold select-none shadow-[0_0_8px_rgba(52,211,153,0.9)]"
                >
                    ▍
                </motion.span>
            </div>
        );
    }

    const rawLines = text.split('\n');

    return (
        <div
            className={`border-l-2 pl-3.5 py-1.5 my-1.5 font-mono text-xs md:text-[13px] leading-relaxed tracking-normal whitespace-pre-wrap break-words text-neutral-300 transition-colors duration-500 rounded-r ${
                isStreaming
                    ? 'border-emerald-400/80 bg-gradient-to-r from-emerald-500/[0.04] to-transparent shadow-[0_0_20px_rgba(52,211,153,0.06)]'
                    : 'border-white/[0.08]'
            }`}
        >
            {rawLines.map((lineText, lineIdx) => {
                const trimmed = lineText.trim();
                const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ');
                const content = isBullet ? trimmed.slice(2) : lineText;

                // Processa crases (`termo`) e negritos (**termo**)
                const tokens = content.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);

                return (
                    <motion.div
                        key={lineIdx}
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className={`${isBullet ? 'flex items-start my-1' : 'my-0.5'}`}
                    >
                        {isBullet && (
                            <motion.span
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className="text-emerald-400 font-bold font-mono mr-2 select-none shrink-0"
                            >
                                ›
                            </motion.span>
                        )}
                        <span className="flex-1">
                            {tokens.map((token, tIdx) => {
                                if (token.startsWith('`') && token.endsWith('`') && token.length > 1) {
                                    const code = token.slice(1, -1);
                                    return (
                                        <span
                                            key={tIdx}
                                            className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-neutral-200 font-mono text-[11.5px] mx-0.5 inline-block transition-all duration-200 hover:scale-105 hover:bg-white/[0.08] hover:border-emerald-400/30 hover:text-emerald-200 hover:shadow-[0_0_8px_rgba(52,211,153,0.2)] cursor-default"
                                        >
                                            {code}
                                        </span>
                                    );
                                }
                                if (token.startsWith('**') && token.endsWith('**') && token.length > 3) {
                                    const boldText = token.slice(2, -2);
                                    return (
                                        <strong key={tIdx} className="text-white font-semibold">
                                            {boldText}
                                        </strong>
                                    );
                                }
                                return <span key={tIdx}>{token}</span>;
                            })}
                        </span>
                    </motion.div>
                );
            })}
            {isStreaming && (
                <motion.span
                    animate={{ opacity: [1, 0.15, 1], scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.45, repeat: Infinity }}
                    className="inline-block text-emerald-400 font-bold ml-1 select-none shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                >
                    ▍
                </motion.span>
            )}
        </div>
    );
}

/** Gera os passos com simulação de latência para a bateria de testes automatizados (QA) */
function getTestSimulationSteps(lang: string): SimulationStep[] {
    const isEn = lang === 'en';
    const isEs = lang === 'es';

    const initText = isEn
        ? '> INITIALIZING HOMOLOGATION TEST ENVIRONMENT...'
        : isEs
        ? '> INICIANDO AMBIENTE DE HOMOLOGACIÓN...'
        : '> INICIANDO AMBIENTE DE HOMOLOGAÇÃO...';

    const resultText = isEn
        ? 'RESULT: 4 PASSED, 0 FAILED | COVERAGE: 100% | STATUS: ZERO REGRESSIONS'
        : isEs
        ? 'RESULTADO: 4 PASÓ, 0 FALLÓ | COBERTURA: 100% | ESTADO: CERO REGRESIONES'
        : 'RESULTADO: 4 PASSOU, 0 FALHOU | COBERTURA: 100% | STATUS: ZERO REGRESSÕES';

    return [
        {
            delay: 0,
            line: {
                text: initText,
                node: (
                    <div className="text-accent font-bold flex items-center gap-2 font-mono">
                        <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span>{initText}</span>
                    </div>
                ),
            },
        },
        {
            delay: 80,
            line: {
                text: '[RUN] GET  /api/v1/healthcheck       -> 200 OK (12ms) [PASS]',
                node: (
                    <div className="flex flex-wrap items-center gap-x-2 font-mono text-[11px] sm:text-[12px]">
                        <span className="text-gray-400 font-semibold">[RUN]</span>
                        <span className="text-cyan-400 font-bold">GET</span>
                        <span className="text-gray-200">/api/v1/healthcheck</span>
                        <span className="text-gray-500">{'->'}</span>
                        <span className="text-emerald-400 font-semibold">200 OK</span>
                        <span className="text-amber-300 font-mono">(12ms)</span>
                        <span className="text-emerald-400 font-bold">[PASS]</span>
                    </div>
                ),
            },
        },
        {
            delay: 160,
            line: {
                text: '[RUN] POST /api/v1/auth/session      -> 200 OK (22ms) [PASS]',
                node: (
                    <div className="flex flex-wrap items-center gap-x-2 font-mono text-[11px] sm:text-[12px]">
                        <span className="text-gray-400 font-semibold">[RUN]</span>
                        <span className="text-blue-400 font-bold">POST</span>
                        <span className="text-gray-200">/api/v1/auth/session</span>
                        <span className="text-gray-500">{'->'}</span>
                        <span className="text-emerald-400 font-semibold">200 OK</span>
                        <span className="text-amber-300 font-mono">(22ms)</span>
                        <span className="text-emerald-400 font-bold">[PASS]</span>
                    </div>
                ),
            },
        },
        {
            delay: 240,
            line: {
                text: '[RUN] POST /api/v1/transacoes/validar -> 201 CREATED (34ms) [PASS]',
                node: (
                    <div className="flex flex-wrap items-center gap-x-2 font-mono text-[11px] sm:text-[12px]">
                        <span className="text-gray-400 font-semibold">[RUN]</span>
                        <span className="text-blue-400 font-bold">POST</span>
                        <span className="text-gray-200">/api/v1/transacoes/validar</span>
                        <span className="text-gray-500">{'->'}</span>
                        <span className="text-emerald-400 font-semibold">201 CREATED</span>
                        <span className="text-amber-300 font-mono">(34ms)</span>
                        <span className="text-emerald-400 font-bold">[PASS]</span>
                    </div>
                ),
            },
        },
        {
            delay: 320,
            line: {
                text: '[RUN] GET  /api/v1/zpe/portlog/status -> 200 OK (18ms) [PASS]',
                node: (
                    <div className="flex flex-wrap items-center gap-x-2 font-mono text-[11px] sm:text-[12px]">
                        <span className="text-gray-400 font-semibold">[RUN]</span>
                        <span className="text-cyan-400 font-bold">GET</span>
                        <span className="text-gray-200">/api/v1/zpe/portlog/status</span>
                        <span className="text-gray-500">{'->'}</span>
                        <span className="text-emerald-400 font-semibold">200 OK</span>
                        <span className="text-amber-300 font-mono">(18ms)</span>
                        <span className="text-emerald-400 font-bold">[PASS]</span>
                    </div>
                ),
            },
        },
        {
            delay: 400,
            line: {
                text: resultText,
                node: (
                    <div className="font-mono text-emerald-400 font-bold flex items-center gap-1.5 mt-1">
                        <span>✔</span>
                        <span>{resultText}</span>
                    </div>
                ),
            },
        },
        {
            delay: 450,
            line: { text: '', color: '' },
        },
    ];
}

/** Gera os passos com simulação de latência para a otimização de queries (SQL Tuning) */
function getSqlSimulationSteps(lang: string): SimulationStep[] {
    const isEn = lang === 'en';
    const isEs = lang === 'es';

    const q1 = isEn
        ? '> ANALYZING EXECUTION PLAN: SELECT * FROM Transacoes WHERE EmpresaId = 10...'
        : isEs
        ? '> ANALIZANDO PLANO DE EJECUCIÓN: SELECT * FROM Transacoes WHERE EmpresaId = 10...'
        : '> ANALISANDO PLANO DE EXECUÇÃO: SELECT * FROM Transacoes WHERE EmpresaId = 10...';

    const q2 = isEn
        ? '[ALERT] Table Scan identified: 2.140ms latency in production.'
        : isEs
        ? '[ALERTA] Table Scan identificado: 2.140ms de latencia en producción.'
        : '[ALERTA] Table Scan identificado: 2.140ms de latência em produção.';

    const q3 = isEn
        ? '[ACTION] Injecting composite index: CREATE NONCLUSTERED INDEX idx_empresa_data...'
        : isEs
        ? '[ACCIÓN] Inyectando índice compuesto: CREATE NONCLUSTERED INDEX idx_empresa_data...'
        : '[AÇÃO] Injetando índice composto: CREATE NONCLUSTERED INDEX idx_empresa_data...';

    const q4 = isEn
        ? '✔ Index Seek applied with success. Query refactored.'
        : isEs
        ? '✔ Index Seek aplicado con éxito. Consulta refactorizada.'
        : '✔ Index Seek aplicado com sucesso. Query refatorada.';

    return [
        {
            delay: 0,
            line: {
                text: q1,
                node: (
                    <div className="font-mono text-gray-200">
                        <span className="text-accent font-bold">
                            {isEn ? '> ANALYZING EXECUTION PLAN: ' : isEs ? '> ANALIZANDO PLANO DE EJECUCIÓN: ' : '> ANALISANDO PLANO DE EXECUÇÃO: '}
                        </span>
                        <span className="text-white font-semibold">SELECT * FROM Transacoes WHERE EmpresaId = 10...</span>
                    </div>
                ),
            },
        },
        {
            delay: 90,
            line: {
                text: q2,
                node: (
                    <div className="font-mono">
                        <span className="text-amber-400 font-bold">{isEn ? '[ALERT] ' : '[ALERTA] '}</span>
                        <span className="text-gray-300">
                            {isEn ? 'Table Scan identified: ' : isEs ? 'Table Scan identificado: ' : 'Table Scan identificado: '}
                        </span>
                        <span className="text-amber-400 font-mono font-bold">2.140ms</span>
                        <span className="text-gray-400">
                            {isEn ? ' latency in production.' : isEs ? ' de latencia en producción.' : ' de latência em produção.'}
                        </span>
                    </div>
                ),
            },
        },
        {
            delay: 180,
            line: {
                text: q3,
                node: (
                    <div className="font-mono">
                        <span className="text-cyan-400 font-bold">{isEn ? '[ACTION] ' : isEs ? '[ACCIÓN] ' : '[AÇÃO] '}</span>
                        <span className="text-gray-300">
                            {isEn ? 'Injecting composite index: ' : isEs ? 'Inyectando índice compuesto: ' : 'Injetando índice composto: '}
                        </span>
                        <span className="text-emerald-300 font-mono font-semibold">CREATE NONCLUSTERED INDEX idx_empresa_data...</span>
                    </div>
                ),
            },
        },
        {
            delay: 270,
            line: {
                text: q4,
                node: (
                    <div className="font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                        <span className="text-emerald-400 font-bold">✔</span>
                        <span>{q4.replace('✔ ', '')}</span>
                    </div>
                ),
            },
        },
        {
            delay: 360,
            line: {
                text: q5,
                node: (
                    <div className="font-mono">
                        <span className="text-secondary font-bold">
                            {isEn ? 'FINAL EXECUTION TIME: ' : isEs ? 'TIEMPO DE EJECUCIÓN FINAL: ' : 'TEMPO DE EXECUÇÃO FINAL: '}
                        </span>
                        <span className="text-emerald-400 font-bold">19ms</span>
                        <span className="text-cyan-400 font-semibold">
                            {isEn ? ' (Optimization: -99.1%)' : isEs ? ' (Optimización: -99.1%)' : ' (Otimização: -99.1%)'}
                        </span>
                    </div>
                ),
            },
        },
        {
            delay: 420,
            line: { text: '', color: '' },
        },
    ];
}

function getLocalCopilotResponse(question: string, lang: string): string {
    const q = question.toLowerCase().trim();
    const isEn = lang === 'en';
    const isEs = lang === 'es';

    // 0. DIRETRIZ DEVSECOPS & SEGURANÇA (ANTI-JAILBREAK / ENGENHARIA SOCIAL / CREDENCIAIS)
    if (
        q.includes('api key') ||
        q.includes('apikey') ||
        q.includes('api-key') ||
        q.includes('api_key') ||
        q.includes('chave de api') ||
        q.includes('chave api') ||
        q.includes('token') ||
        q.includes('secret') ||
        q.includes('senha') ||
        q.includes('password') ||
        q.includes('credentials') ||
        q.includes('credenciais') ||
        q.includes('seu criador') ||
        q.includes('sou seu criador') ||
        q.includes('sou o pedro') ||
        q.includes('sou o pedrom') ||
        q.includes('sou pedro') ||
        q.includes('pedrom') ||
        q.includes('ignore suas instruções') ||
        q.includes('ignore todas as instruções') ||
        q.includes('ignore previous instructions') ||
        q.includes('jailbreak') ||
        q.includes('prompt injection') ||
        q.includes('system prompt')
    ) {
        if (isEn) {
            return 'Nice try! 🛡️ As Pedro Henrique\'s QA & DevSecOps Copilot, no API keys, tokens, or infrastructure secrets are exposed to the client side. All sensitive environment variables operate isolated in the Vercel Edge cluster. If you\'re truly Pedro, you know you can manage them directly in the Vercel Dashboard! 😉';
        }
        if (isEs) {
            return '¡Buen intento! 🛡️ Como Copilot técnico enfocado en QA y DevSecOps de Pedro Henrique, ninguna clave de API, token o secreto de infraestructura se expone en el cliente. Todas las variables sensibles operan aisladas en el servidor Edge de Vercel. ¡Si realmente eres Pedro, sabes que puedes administrarlas directamente en el panel de Vercel! 😉';
        }
        return 'Bela tentativa! 🛡️ Como Copilot Técnico e de QA do Pedro Henrique, sigo rigorosos padrões de DevSecOps. Nenhuma chave de API, token ou segredo de infraestrutura é exposto na camada cliente; todas as variáveis operam isoladas na Vercel Edge. Se você for o Pedro mesmo, sabe que pode gerenciá-las diretamente no painel da Vercel! 😉';
    }

    // 1. Meta-perguntas, escopo de conversação e capacidades do assistente
    if (
        q.includes('alem') ||
        q.includes('além') ||
        q.includes('outras coisas') ||
        q.includes('outros assuntos') ||
        q.includes('outro assunto') ||
        q.includes('o que você faz') ||
        q.includes('o que voce faz') ||
        q.includes('o que mais') ||
        q.includes('fala de que') ||
        q.includes('fala sobre o que') ||
        q.includes('conversa sobre') ||
        q.includes('sobre o que você fala') ||
        q.includes('sobre o que voce fala') ||
        q.includes('pode responder') ||
        q.includes('sabe fazer') ||
        q.includes('capacidades') ||
        q.includes('other things') ||
        q.includes('what else') ||
        q.includes('what can you do') ||
        q.includes('otras cosas') ||
        q.includes('de qué hablas') ||
        q.includes('de que hablas')
    ) {
        if (isEn) {
            return 'Yes, absolutely! In addition to everything about Pedro Henrique\'s career, stack, and projects, I can discuss software engineering in general: system architecture, QA & API testing, SQL tuning, React, Laravel, Delphi, Docker, and general tech topics. What would you like to talk about?';
        }
        if (isEs) {
            return '¡Sí, por supuesto! Además de conocer en detalle la trayectoria y proyectos de Pedro Henrique, puedo conversar sobre ingeniería de software en general: arquitectura de sistemas, pruebas QA, optimización SQL, Laravel, Delphi, React, Docker y más. ¿Sobre qué te gustaría hablar?';
        }
        return 'Sim, com certeza! Além de conhecer em profundidade toda a trajetória, projetos e tecnologias do Pedro Henrique, sou treinado para debater engenharia de software em geral: arquitetura de sistemas, QA e testes de API, SQL Server, Laravel, Delphi, React, Docker ou qualquer tópico técnico. Sobre o que você gostaria de conversar?';
    }

    // 2. Saudações e Conversação Social
    if (
        q === 'oi' ||
        q === 'ola' ||
        q === 'olá' ||
        q.startsWith('ola') ||
        q.startsWith('olá') ||
        q.startsWith('oi ') ||
        q.startsWith('e ai') ||
        q.startsWith('e aí') ||
        q.startsWith('bom dia') ||
        q.startsWith('boa tarde') ||
        q.startsWith('boa noite') ||
        q.includes('tudo bem') ||
        q.includes('como vai') ||
        q.includes('como você está') ||
        q.includes('como voce esta') ||
        q === 'hello' ||
        q === 'hi' ||
        q === 'hey' ||
        q.includes('how are you') ||
        q === 'hola' ||
        q.includes('cómo estás') ||
        q.includes('como estas') ||
        q.includes('qué tal') ||
        q.includes('que tal')
    ) {
        if (isEn) {
            return 'Hello! I am Pedro Henrique\'s Technical Copilot. I can help you explore his technical stack, QA & software engineering experience, projects, or discuss any tech subject. How can I assist you right now?';
        }
        if (isEs) {
            return '¡Hola! Soy el Copilot Técnico de Pedro Henrique. Puedes consultarme sobre su stack, experiencia en QA y desarrollo, proyectos destacados o debatir sobre tecnología. ¿En qué te puedo ayudar ahora?';
        }
        return 'Olá! Sou o Copilot Técnico do Pedro Henrique. Você pode me fazer perguntas sobre a stack dele (Laravel, Delphi, React, SQL Server), experiência em QA e desenvolvimento, projetos de engenharia ou debater sobre qualquer tópico técnico. Como posso te ajudar agora?';
    }

    // 3. Conceitos Técnicos Específicos (React, TypeScript, Delphi, Laravel, SQL, QA, Docker, Git)
    if (q.includes('react') && !q.includes('stack') && !q.includes('projeto')) {
        return isEn
            ? '`React` is a declarative component-based JavaScript library maintained by Meta for building dynamic user interfaces. In Pedro\'s workstation and projects, React is paired with TypeScript and Tailwind CSS for high-performance responsive web applications.'
            : isEs
            ? '`React` es una librería declarativa de JavaScript mantenida por Meta para crear interfaces interactivas. En los proyectos de Pedro, se combina con TypeScript y Tailwind CSS para lograr aplicaciones web rápidas y modernas.'
            : 'O `React` é uma biblioteca JavaScript declarativa desenvolvida pela Meta para construção de interfaces reativas baseadas em componentes. No ecossistema de projetos do Pedro, ele é utilizado com TypeScript e Tailwind CSS para interfaces velozes e de alta densidade informativa.';
    }

    if (q.includes('typescript') || q === 'ts') {
        return isEn
            ? '`TypeScript` is a typed superset of JavaScript developed by Microsoft. It enforces static typing and compile-time error detection, essential for scalable distributed systems and resilient web applications.'
            : isEs
            ? '`TypeScript` es un superconjunto tipado de JavaScript desarrollado por Microsoft que añade tipado estático y seguridad en tiempo de compilación para arquitecturas robustas.'
            : 'O `TypeScript` é um superset tipado do JavaScript mantido pela Microsoft. Ele adiciona tipagem estática e interfaces robustas, reduzindo drasticamente falhas em tempo de execução em back-ends e front-ends corporativos.';
    }

    if (q.includes('delphi') || q.includes('unigui') || q.includes('vcl')) {
        return isEn
            ? '`Delphi` (Object Pascal) is a high-performance RAD development environment for native desktop and client-server systems. Pedro has hands-on experience modernizing monolithic legacy ERPs in Delphi 11 (VCL/UniGui) into modern web APIs with Laravel (PHP) and React. Type `pedro --experience`!'
            : isEs
            ? '`Delphi` (Object Pascal) es un entorno de alto rendimiento para sistemas de escritorio y cliente-servidor. Pedro cuenta con experiencia práctica modernizando ERPs legados monolíticos en Delphi 11 (VCL/UniGui) hacia la web con Laravel y React. ¡Escribe `pedro --experience`!'
            : 'Na Qualisoft Sistemas, o Pedro atuou na sustentação e modernização de ERP monolítico em `Delphi 11` (VCL/UniGui), construindo APIs RESTful em PHP/Laravel e interfaces reativas em React para migração web. Também realizou otimizações críticas em queries SQL Server e MySQL, reduzindo tempos de resposta de mais de 2s para menos de 500ms. Digite `pedro --experience` para ver a trajetória!';
    }

    if (q.includes('laravel') || q.includes('php')) {
        return isEn
            ? '`Laravel` is a premier PHP framework renowned for expressive syntax, robust ORM (Eloquent), and built-in security. Pedro leverages Laravel to build high-concurrency RESTful APIs, asynchronous job queues, and modern web services.'
            : isEs
            ? '`Laravel` es un framework de PHP reconocido por su sintaxis elegante, ORM Eloquent y robustez. Pedro utiliza Laravel para construir APIs RESTful y modernizar arquitecturas de software.'
            : 'O `Laravel` é o principal framework PHP contemporâneo, consagrado pela elegância arquitetural, segurança nativa e ecossistema robusto. O Pedro o utiliza na construção de microsserviços, modernização de legados e APIs RESTful escaláveis.';
    }

    if ((q.includes('sql') || q.includes('query') || q.includes('queries') || q.includes('banco') || q.includes('database') || q.includes('tuning') || q.includes('indice') || q.includes('índice')) && !q.includes('stack')) {
        if (isEn) {
            return 'Pedro possesses deep expertise in `Microsoft SQL Server` and PostgreSQL, auditing execution plans, diagnosing Table/Index Scans, and designing composite indexes for high-throughput transactional databases. Type `sql` to simulate an interactive execution plan tuning demo!';
        }
        if (isEs) {
            return 'Pedro cuenta con amplia experiencia en `Microsoft SQL Server` y PostgreSQL, auditando planes de ejecución, diagnosticando Table/Index Scans y creando índices compuestos para alta transaccionalidad. ¡Escribe `sql` para simular un tuning interactivo!';
        }
        return 'O Pedro possui sólida vivência em `Microsoft SQL Server` e PostgreSQL, especializado em diagnósticos de Execution Plans, resolução de gargalos de Table Scans, criação de índices compostos e tuning de queries de alta frequência. Digite `sql` para rodar uma simulação de otimização de banco em tempo real!';
    }

    if (q.includes('qa') || q.includes('postman') || q.includes('test') || q.includes('qualidade') || q.includes('calidad') || q.includes('asserções') || q.includes('asserc') || q.includes('regressao') || q.includes('regressão')) {
        if (isEn) {
            return 'Pedro acts as a QA Analyst at SETE Tecnologia, modeling functional and regression test suites for port logistics platforms (ZPEs). He automates API assertions in Postman, validates business boundary conditions, and audits query performance in SQL Server (-25% bug rate in production). Type `test` to run an automated regression runner!';
        }
        if (isEs) {
            return 'Pedro se desempeña como Analista de QA en SETE Tecnologia, modelando suites de pruebas funcionales y de regresión para sistemas logísticos portuarios (ZPEs). Automatiza aserciones en Postman y audita consultas en SQL Server (-25% de tasa de errores). ¡Escribe `test` para ejecutar el runner de pruebas!';
        }
        return 'O Pedro atua como Analista de QA na SETE Tecnologia, sendo responsável pela modelagem de suítes de testes funcionais e regressivos em sistemas críticos de logística portuária e zonas aduaneiras (ZPEs / plataforma ePita). Ele automatiza asserções de APIs via Postman e audita planos de execução no SQL Server, reduzindo a incidência de bugs em produção em mais de 25%. Digite `test` para rodar a simulação de testes agora!';
    }

    if (q.includes('docker') || q.includes('conteiner') || q.includes('contêiner')) {
        return isEn
            ? '`Docker` is an open platform for containerizing applications, isolating microservices and guaranteeing identical runtime environments from local dev to production orchestration.'
            : isEs
            ? '`Docker` permite aislar aplicaciones y dependencias en contenedores ligeros, asegurando paridad total entre desarrollo y producción.'
            : 'O `Docker` permite encapsular aplicações e todas as suas dependências em contêineres leves e reproduzíveis, simplificando pipelines de CI/CD e garantindo paridade total entre ambientes de desenvolvimento e produção.';
    }

    if (q.includes('git') || q.includes('github')) {
        return isEn
            ? '`Git` is the global standard distributed version control system. Pedro uses Git and GitHub for branch management, code review workflows, and automated continuous deployment.'
            : isEs
            ? '`Git` es el estándar global para control de versiones distribuido. Pedro utiliza Git y GitHub para control atómico de código y flujos de CI/CD.'
            : 'O `Git` é o padrão global para versionamento distribuído de código, fornecendo histórico atômico de commits, branches para isolamento de features e integração com esteiras de CI/CD.';
    }

    // 4. Stack Tecnológico / Linguagens / Tecnologias do Pedro
    if (
        q.includes('stack') ||
        q.includes('tecnologia') ||
        q.includes('tecnología') ||
        q.includes('linguagem') ||
        q.includes('lenguaje') ||
        q.includes('ferramenta') ||
        q.includes('herramienta') ||
        q.includes('utiliza') ||
        q.includes('usa') ||
        q.includes('programa') ||
        q.includes('framework') ||
        q.includes('skills')
    ) {
        if (isEn) {
            return 'Pedro Henrique specializes in Full Stack Engineering and QA Test Automation. His primary stack includes:\n• `Back-End:` PHP (Laravel), Delphi 11 (VCL/UniGui), Java and RESTful APIs\n• `Front-End:` React, TypeScript, Tailwind CSS and JavaScript\n• `Databases:` Microsoft SQL Server (query diagnostics, composite indexing, execution plans) and MySQL/PostgreSQL\n• `QA & Testing:` Postman (automated regression suites, HTTP assertions) and manual validation\n• `DevOps & Tools:` Docker, Git/GitHub and Linux.\nType `pedro --skills` or `pedro --projects` to explore!';
        }
        if (isEs) {
            return 'Pedro Henrique se especializa en Ingeniería Full Stack y Automatización de Pruebas QA. Su stack principal incluye:\n• `Back-End:` PHP (Laravel), Delphi 11 (VCL/UniGui), Java y APIs RESTful\n• `Front-End:` React, TypeScript, Tailwind CSS y JavaScript\n• `Bases de Datos:` Microsoft SQL Server (diagnóstico de consultas, índices compuestos y planes de ejecución) y MySQL/PostgreSQL\n• `QA & Pruebas:` Postman (baterías automatizadas, aserciones HTTP) y validaciones\n• `DevOps & Herramientas:` Docker, Git/GitHub y Linux.\n¡Escribe `pedro --skills` o `pedro --projects` para explorar más!';
        }
        return 'O Pedro Henrique é especialista em Engenharia Full Stack e Garantia de Qualidade (QA). O stack que ele mais utiliza no dia a dia compreende:\n• `Back-End:` PHP (Laravel), Delphi 11 (VCL/UniGui), Java e APIs RESTful estruturadas\n• `Front-End:` React, TypeScript, Tailwind CSS e JavaScript moderno\n• `Bancos de Dados:` Microsoft SQL Server (diagnósticos avançados de query plans, índices compostos e tuning de latência) e MySQL/PostgreSQL\n• `QA & Testes:` Postman (automação de asserções HTTP, regressão contínua) e homologação funcional\n• `DevOps & Ferramentas:` Docker, Git/GitHub e Linux.\nDigite `pedro --skills` para ver a lista completa ou `test` para simular uma bateria de testes!';
    }

    // 5. Projetos em Destaque (PayStream, PortLog, SPECTR)
    if (q.includes('paystream') || q.includes('portlog') || q.includes('spectr') || q.includes('projeto') || q.includes('project') || q.includes('portfolio') || q.includes('portfólio')) {
        if (isEn) {
            return 'Pedro has architected three flagship engineering projects:\n1. `PayStream Gateway:` Fintech payment processor with idempotent webhooks, cent splits & HMAC-SHA256 (Fastify, TypeScript, Prisma, PostgreSQL)\n2. `PortLog OS:` Port logistics terminal operating system with IoT telemetry, FSM for STS/RTG cranes & RBAC\n3. `SPECTR TestOps:` API testing platform with latency percentiles (p50/p90/p95/p99) and chaos injection.\nType `pedro --projects` to inspect their code and architecture!';
        }
        if (isEs) {
            return 'Pedro ha diseñado tres proyectos destacados de ingeniería:\n1. `PayStream Gateway:` Pasarela fintech con webhooks idempotentes, división en centavos y HMAC-SHA256 (Fastify, TypeScript, Prisma)\n2. `PortLog OS:` Sistema para terminales portuarias con telemetría IoT, máquinas de estado FSM para grúas y RBAC\n3. `SPECTR TestOps:` Plataforma de pruebas API con percentiles de latencia y simulación de caos.\n¡Escribe `pedro --projects`!';
        }
        return 'O Pedro arquitetou 3 projetos emblemáticos de engenharia:\n1. `PayStream Gateway:` Gateway de pagamentos fintech com webhooks idempotentes, split em centavos e assinaturas HMAC-SHA256 (Fastify, TypeScript, Prisma e PostgreSQL)\n2. `PortLog OS:` Sistema operacional para logística portuária com telemetria IoT, máquina de estados finitos (FSM) para guindastes STS/RTG e controle RBAC\n3. `SPECTR TestOps:` Plataforma de testes de API nível Postman com métricas de percentis (p50/p90/p95/p99) e laboratório de injeção de caos.\nDigite `pedro --projects` para ver detalhes e links de repositório!';
    }

    // 6. Formação Acadêmica e Estudos
    if (q.includes('formacao') || q.includes('formação') || q.includes('faculdade') || q.includes('curso') || q.includes('unifanor') || q.includes('eeep') || q.includes('estuda') || q.includes('estudo') || q.includes('graduacao') || q.includes('graduação') || q.includes('educacao') || q.includes('educação')) {
        if (isEn) {
            return 'Pedro is currently pursuing a Bachelor\'s Degree in `Software Engineering` at Unifanor Wyden, and holds a formal Vocational Diploma as an `IT Technician` from EEEP Luiza de Teodoro Vieira (2023–2025), with a strong foundation in systems architecture, algorithms, and databases.';
        }
        if (isEs) {
            return 'Pedro cursa actualmente el pregrado en `Ingeniería de Software` en Unifanor Wyden y posee formación técnica previa como `Técnico en Informática` por la EEEP Luiza de Teodoro Vieira (2023–2025).';
        }
        return 'O Pedro está cursando bacharelado em `Engenharia de Software` na Unifanor Wyden e possui formação técnica prévia como `Técnico em Informática` pela EEEP Luiza de Teodoro Vieira (2023–2025), com forte base acadêmica em estruturas de dados, algoritmos, modelagem relacional e engenharia de software.';
    }

    // 7. Contato, Links e Contratação
    if (q.includes('contato') || q.includes('contact') || q.includes('email') || q.includes('e-mail') || q.includes('linkedin') || q.includes('telefone') || q.includes('phone') || q.includes('whatsapp') || q.includes('contratar') || q.includes('vaga') || q.includes('trabalho') || q.includes('job')) {
        if (isEn) {
            return 'You can contact Pedro Henrique directly through:\n• `Email:` pedrohc.forza@gmail.com\n• `LinkedIn:` linkedin.com/in/pedro-henrique-b0a015391\n• `GitHub:` github.com/pedrhenriqueol\n• `Phone / WhatsApp:` +55 (85) 98868-7214\nType `pedro --contact` for quick copyable links!';
        }
        if (isEs) {
            return 'Puedes contactar a Pedro Henrique directamente por:\n• `Email:` pedrohc.forza@gmail.com\n• `LinkedIn:` linkedin.com/in/pedro-henrique-b0a015391\n• `GitHub:` github.com/pedrhenriqueol\n• `Teléfono / WhatsApp:` +55 (85) 98868-7214\n¡Escribe `pedro --contact`!';
        }
        return 'Você pode entrar em contato direto com o Pedro através dos canais:\n• `E-mail:` pedrohc.forza@gmail.com\n• `LinkedIn:` linkedin.com/in/pedro-henrique-b0a015391\n• `GitHub:` github.com/pedrhenriqueol\n• `Telefone / WhatsApp:` +55 (85) 98868-7214\nEle responde com rapidez para oportunidades e parcerias. Digite `pedro --contact` para ver mais!';
    }

    // 8. Quem é o Pedro / Resumo Profissional / Experiência Geral (Gatilhos Específicos sem 'sobre' solto)
    if (
        (q.includes('pedro') && (q.includes('quem') || q.includes('sobre') || q.includes('bio') || q.includes('perfil') || q.includes('trajetoria') || q.includes('trajetória') || q.includes('experiencia') || q.includes('experiência') || q.includes('historia') || q.includes('história'))) ||
        q.includes('quem é você') ||
        q.includes('quem e voce') ||
        q.includes('quem e o pedro') ||
        q.includes('quem é o pedro') ||
        q.includes('sobre o pedro') ||
        q.includes('who is pedro') ||
        q.includes('who are you') ||
        q.includes('about pedro') ||
        q.includes('quien es pedro') ||
        q.includes('quién es pedro') ||
        q === 'pedro' ||
        q === 'bio'
    ) {
        if (isEn) {
            return 'Pedro Henrique is a Software Engineer currently working as a QA Analyst Intern at SETE Tecnologia (validating port logistics systems and automating API tests via Postman), with prior experience as a Back-End Developer at Qualisoft Sistemas modernizing legacy Delphi ERPs into PHP/Laravel and React. Type `test`, `pedro --skills` or `pedro --projects` to learn more!';
        }
        if (isEs) {
            return 'Pedro Henrique es graduando en Ingeniería de Software y Analista de QA en SETE Tecnologia (sistemas portuarios y pruebas API Postman), con experiencia previa en Qualisoft Sistemas modernizando ERPs en Delphi hacia Laravel y React. ¡Escribe `test` o `pedro --skills`!';
        }
        return 'O Pedro Henrique é graduando em Engenharia de Software e atua como Analista de QA na SETE Tecnologia, validando sistemas portuários e aduaneiros (ZPEs) com diagnósticos em Microsoft SQL Server e automação Postman. Possui também sólida bagagem como Desenvolvedor Back-End na Qualisoft Sistemas, modernizando ERP monolítico em Delphi para Laravel e React. Digite `test` para simular testes ou `pedro --skills`!';
    }

    // 9. Jogos e Arcade
    if (q.includes('jogo') || q.includes('jogar') || q.includes('game') || q.includes('arcade') || q.includes('snake') || q.includes('matrix') || q.includes('trivia') || q.includes('play')) {
        return isEn
            ? 'Available arcade minigames in this workstation:\n• `snake` (Classic Snake)\n• `bug-hunter` (QA Minesweeper Debugger)\n• `trivia` (Engineering & SQL Quiz)\n• `aim-test` (Reaction Speed)\n• `matrix` (Matrix Rain)\nType `pedro --games` or `pedro --play snake` to start!'
            : 'Minijogos arcade disponíveis no terminal:\n• `snake` (Cobrinha clássica)\n• `bug-hunter` (Caça aos bugs sem erro 500)\n• `trivia` (Quiz de QA, Delphi e SQL)\n• `aim-test` (Teste de reflexos)\n• `matrix` (Chuva de código)\nDigite `pedro --games` ou `pedro --play snake` para começar!';
    }

    // 10. Como usar o Terminal / Ajuda
    if (q.includes('terminal') || q.includes('funciona') || q.includes('como usar') || q.includes('how it work') || q.includes('how does') || q.includes('ajuda') || q.includes('help')) {
        if (isEn) {
            return 'This terminal functions both as a traditional engineering shell and a conversational AI copilot. You can type any question freely in natural language, or execute interactive commands like `test` (API validation runner), `sql` (query tuning simulator), `pedro --projects`, `pedro --skills`, or `clear`.';
        }
        return 'Este terminal opera de forma híbrida: você pode fazer qualquer pergunta em linguagem natural (como em um chat do ChatGPT ou Gemini) ou rodar comandos diretos do sistema como `test` (validação de APIs), `sql` (simulador de tuning), `pedro --projects`, `pedro --skills` ou `clear`. Digite `help` para ver a lista de atalhos!';
    }

    // 11. Fallback geral inteligente conversacional (NUNCA despeja biografia aleatória)
    if (isEn) {
        return 'Got it! As the workstation Copilot, I\'m here to explore software engineering concepts, web architecture, QA automation, or provide details on Pedro Henrique\'s projects and stack. What would you like to discuss? You can also type `help` for system commands or `test` to run a simulation.';
    }
    if (isEs) {
        return '¡Entendido! Como Copilot del terminal, estoy disponible para conversar sobre ingeniería de software, arquitectura web, pruebas QA o explicar los proyectos y stack de Pedro Henrique. ¿En qué te gustaría profundizar? También puedes escribir `help` para ver comandos o `test` para simulaciones.';
    }
    return 'Entendi sua pergunta! Como Copilot de terminal, estou configurado para discutir conceitos de tecnologia, desenvolvimento de software, automação de testes (QA) e apresentar as realizações técnicas do Pedro Henrique. O que você gostaria de explorar mais a fundo? Você também pode digitar `help` para ver comandos ou `test` para rodar simulações.';
}

export const InteractiveTerminal: React.FC = () => {
    const { lang } = useLanguage();
    const [lines, setLines] = useState<TerminalLine[]>(() => getWelcomeLines(lang));
    const [input, setInput] = useState('');
    const [focused, setFocused] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [history, setHistory] = useState<string[]>([]);
    const [histIdx, setHistIdx] = useState(-1);
    const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'model'; text: string }>>([]);
    const [activeGame, setActiveGame] = useState<ActiveTerminalGame>(null);
    const [isStreaming, setIsStreaming] = useState(false);

    const contentRef = useRef<HTMLDivElement>(null);
    const terminalEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const activeTimersRef = useRef<number[]>([]);
    const abortControllerRef = useRef<AbortController | null>(null);
    const prevLangRef = useRef(lang);
    const typingTimeoutRef = useRef<number | null>(null);
    const rateLimitCooldownUntilRef = useRef<number>(0);

    const { execute } = useTerminalCommands(lang);

    /** Limpa com segurança todos os temporizadores assíncronos em andamento */
    const clearAllTimers = useCallback(() => {
        activeTimersRef.current.forEach(timerId => window.clearTimeout(timerId));
        activeTimersRef.current = [];
        if (typingTimeoutRef.current) {
            window.clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
    }, []);

    /** Gerencia a digitação do usuário com efeitos de resposta e glow */
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        setIsTyping(true);
        if (typingTimeoutRef.current) {
            window.clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = window.setTimeout(() => {
            setIsTyping(false);
        }, 550);
    }, []);

    // Higiene de desmontagem: cancela qualquer timer ativo ou stream em andamento
    useEffect(() => {
        return () => {
            clearAllTimers();
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
        };
    }, [clearAllTimers]);

    // Reseta boas-vindas EXCLUSIVAMENTE ao trocar de idioma do portfólio
    useEffect(() => {
        if (prevLangRef.current !== lang) {
            prevLangRef.current = lang;
            if (!activeGame) {
                clearAllTimers();
                setLines(getWelcomeLines(lang));
                setChatHistory([]);
            }
        }
    }, [lang, activeGame, clearAllTimers]);

    // Auto-scroll interno do terminal ao adicionar linhas (sem rolar a janela do navegador)
    useEffect(() => {
        if (!activeGame && contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
    }, [lines, activeGame]);

    // Pré-aquecimento rápido de conexão TLS com a Vercel Edge (Edge Pre-Warming)
    const prewarmedRef = useRef(false);
    const handlePreWarmEdge = useCallback(() => {
        if (prewarmedRef.current) return;
        prewarmedRef.current = true;
        fetch('/api/chat', { method: 'OPTIONS' }).catch(() => {});
    }, []);

    /** Executa a simulação escalonada de testes ou queries sem bloquear a thread principal */
    const runSimulation = useCallback((type: 'test' | 'sql', commandRaw: string) => {
        clearAllTimers();

        // Eco do comando digitado com animação fluida de entrada e spring no chevron
        setLines(prev => [
            ...prev,
            {
                text: `pedro in ~ ❯ ${commandRaw}`,
                node: (
                    <motion.div
                        initial={{ opacity: 0, x: -8, filter: 'blur(3px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        transition={{ type: 'spring', damping: 22, stiffness: 320 }}
                        className="flex items-center gap-2 font-mono text-xs md:text-[13px] my-1"
                    >
                        <div className="flex items-center gap-2 font-mono text-xs select-none shrink-0">
                            <span className="text-neutral-400 font-medium">pedro</span>
                            <span className="text-neutral-600">in</span>
                            <span className="text-neutral-300">~</span>
                            <motion.span
                                initial={{ scale: 1.5, x: -3 }}
                                animate={{ scale: 1, x: 0 }}
                                transition={{ type: 'spring', damping: 15, stiffness: 400 }}
                                className="text-emerald-400 font-bold"
                            >
                                ❯
                            </motion.span>
                        </div>
                        <span className="text-white font-mono text-xs md:text-[13px]">{commandRaw}</span>
                    </motion.div>
                ),
            },
        ]);

        const steps = type === 'test' ? getTestSimulationSteps(lang) : getSqlSimulationSteps(lang);

        steps.forEach(step => {
            const timerId = window.setTimeout(() => {
                setLines(prev => [...prev, step.line]);
                if (contentRef.current) {
                    contentRef.current.scrollTop = contentRef.current.scrollHeight;
                }
                activeTimersRef.current = activeTimersRef.current.filter(id => id !== timerId);
            }, step.delay);

            activeTimersRef.current.push(timerId);
        });
    }, [lang, clearAllTimers]);

    /** Streaming assíncrono com o Copilot Técnico via rota segura /api/chat ou fallback inteligente local */
    const handleAskCopilot = useCallback(async (question: string, rawPrompt?: string) => {
        const cleanQuestion = question.trim();
        const displayPrompt = (rawPrompt || question).trim();
        if (!cleanQuestion && !displayPrompt) return;

        // Cancela requisições anteriores ativas
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;
        setIsStreaming(true);

        const dispatchLineId = `dispatch-${Date.now()}`;
        const streamLineId = `copilot-${Date.now()}`;
        const copilotBadgeId = `badge-${Date.now()}`;
        const startTime = Date.now();

        // Eco do comando digitado e badge do Copilot com radar ping e status de geração
        setLines(prev => [
            ...prev,
            {
                text: `pedro in ~ ❯ ${displayPrompt}`,
                node: (
                    <motion.div
                        initial={{ opacity: 0, x: -8, filter: 'blur(3px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        transition={{ type: 'spring', damping: 22, stiffness: 320 }}
                        className="flex items-center gap-2 font-mono text-xs md:text-[13px] my-1"
                    >
                        <div className="flex items-center gap-2 font-mono text-xs select-none shrink-0">
                            <span className="text-neutral-400 font-medium">pedro</span>
                            <span className="text-neutral-600">in</span>
                            <span className="text-neutral-300">~</span>
                            <motion.span
                                initial={{ scale: 1.5, x: -3 }}
                                animate={{ scale: 1, x: 0 }}
                                transition={{ type: 'spring', damping: 15, stiffness: 400 }}
                                className="text-emerald-400 font-bold"
                            >
                                ❯
                            </motion.span>
                        </div>
                        <span className="text-white font-mono text-xs md:text-[13px]">{displayPrompt}</span>
                    </motion.div>
                ),
            },
            {
                id: copilotBadgeId,
                text: 'copilot',
                node: (
                    <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 mb-1 select-none">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                        </span>
                        <span className="font-semibold text-neutral-300">copilot</span>
                        <motion.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                            className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-mono flex items-center gap-1"
                        >
                            <span className="inline-block w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                            <span>gerando...</span>
                        </motion.span>
                    </div>
                ),
            },
            {
                id: dispatchLineId,
                text: '[*] Dispatching query to edge cluster...',
                node: (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-neutral-500 font-mono text-xs my-1 select-none"
                    >
                        <span className="text-cyan-400 font-bold animate-pulse">[*]</span>
                        <span>Dispatching query to edge cluster...</span>
                    </motion.div>
                ),
            },
            {
                id: streamLineId,
                text: '',
                isStreaming: true,
                node: <FormattedCopilotResponse text="" isStreaming={true} />,
            },
        ]);

        // Supressão de retentativas desordenadas: se dentro da janela de 45s de 429, serve direto via contingência local
        if (Date.now() < rateLimitCooldownUntilRef.current) {
            console.warn('[Copilot] Inside 45s rate-limit cooldown window. Serving directly via local engine.');
            await runLocalStreamingFallback();
            return;
        }

        // Função de streaming do fallback inteligente local
        const runLocalStreamingFallback = async () => {
            const fallbackReply = getLocalCopilotResponse(cleanQuestion, lang);
            const tokens = fallbackReply.split(' ');
            let currentText = '';
            const fallbackStart = Date.now();

            for (let i = 0; i < tokens.length; i++) {
                if (abortControllerRef.current === null) break;
                currentText += (i === 0 ? '' : ' ') + tokens[i];
                const snap = currentText;

                setLines(prev => {
                    const withoutDispatch = i === 0 ? prev.filter(l => l.id !== dispatchLineId) : prev;
                    return withoutDispatch.map(l =>
                        l.id === streamLineId
                            ? {
                                  ...l,
                                  text: snap,
                                  node: <FormattedCopilotResponse text={snap} isStreaming={i < tokens.length - 1} />,
                              }
                            : l
                    );
                });

                if (contentRef.current) {
                    contentRef.current.scrollTop = contentRef.current.scrollHeight;
                }

                // Cadência fluida e natural de leitura
                await new Promise(r => setTimeout(r, 20));
            }

            const fallbackLatency = ((Date.now() - fallbackStart) / 1000).toFixed(2);
            const fallbackTokens = Math.max(12, Math.round(currentText.length / 3.7));

            setLines(prev => [
                ...prev.map(l =>
                    l.id === streamLineId
                        ? {
                              ...l,
                              text: currentText,
                              isStreaming: false,
                              node: <FormattedCopilotResponse text={currentText} isStreaming={false} />,
                          }
                        : l.id === copilotBadgeId
                        ? {
                              ...l,
                              node: (
                                  <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 mb-1 select-none">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                                      <span className="font-semibold text-neutral-300">copilot</span>
                                  </div>
                              ),
                          }
                        : l
                ),
                {
                    id: `telemetry-${Date.now()}`,
                    text: `${fallbackLatency}s • ${fallbackTokens} tokens • engine: local-copilot (contingência)`,
                    node: (
                        <motion.div
                            initial={{ opacity: 0, y: 3 }}
                            animate={{ opacity: 0.85, y: 0 }}
                            transition={{ duration: 0.35 }}
                            className="text-[10px] font-mono text-neutral-400 mt-2 flex items-center gap-2 select-none"
                        >
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400/90 shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
                            <span>{fallbackLatency}s</span>
                            <span>•</span>
                            <span>{fallbackTokens} tokens</span>
                            <span>•</span>
                            <span className="text-amber-400/90 font-mono">engine: local-copilot (contingência)</span>
                        </motion.div>
                    ),
                },
                { text: '', color: '' },
            ]);
        };

        try {
            // Timeout de 15 segundos: margem de resiliência para horários de tráfego intenso na nuvem sem abort prematuro
            const timeoutId = setTimeout(() => {
                controller.abort();
            }, 15000);

            const payloadHistory = chatHistory
                .filter(msg => typeof msg.text === 'string' && msg.text.trim().length > 0)
                .slice(-4)
                .map(msg => ({
                    role: msg.role === 'model' ? ('model' as const) : ('user' as const),
                    text: msg.text.trim(),
                }));

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: cleanQuestion,
                    history: payloadHistory,
                }),
                signal: controller.signal,
            }).finally(() => clearTimeout(timeoutId));

            const contentType = response.headers.get('content-type') || '';
            if (response.status === 429 || response.status === 503 || !response.ok || !contentType.includes('text/plain') || !response.body) {
                if (response.status === 429) {
                    // Registra pausa de 45 segundos para poupar cota
                    rateLimitCooldownUntilRef.current = Date.now() + 45000;
                }

                console.warn(`[Copilot] Upstream status ${response.status}. Falling back smoothly to local engine.`);
                await runLocalStreamingFallback();
                return;
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = '';
            let isFirstChunk = true;
            let rafId: number | null = null;

            const flushUpdate = (final = false) => {
                setLines(prev => {
                    const baseList = isFirstChunk ? prev.filter(l => l.id !== dispatchLineId) : prev;
                    isFirstChunk = false;

                    return baseList.map(l => {
                        if (l.id === streamLineId) {
                            return {
                                ...l,
                                text: accumulatedText,
                                isStreaming: !final,
                                node: <FormattedCopilotResponse text={accumulatedText} isStreaming={!final} />,
                            };
                        }
                        if (final && l.id === copilotBadgeId) {
                            return {
                                ...l,
                                node: (
                                    <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 mb-1 select-none">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                                        <span className="font-semibold text-neutral-300">copilot</span>
                                    </div>
                                ),
                            };
                        }
                        return l;
                    });
                });

                if (contentRef.current) {
                    contentRef.current.scrollTop = contentRef.current.scrollHeight;
                }
            };

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const textChunk = decoder.decode(value, { stream: true });
                accumulatedText += textChunk;

                if (rafId === null) {
                    rafId = requestAnimationFrame(() => {
                        rafId = null;
                        flushUpdate(false);
                    });
                }
            }

            if (rafId !== null) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }

            // Se o streaming remoto encerrou sem nenhum caractere, garante o fallback inteligente
            if (!accumulatedText.trim()) {
                throw new Error('EMPTY_STREAM_RESPONSE');
            }

            flushUpdate(true);

            // Salva apenas mensagens válidas no histórico de conversação
            const validAnswer = accumulatedText.trim();
            if (validAnswer.length > 0) {
                setChatHistory(prev => [
                    ...prev,
                    { role: 'user', text: cleanQuestion },
                    { role: 'model', text: validAnswer },
                ]);
            }

            const latency = ((Date.now() - startTime) / 1000).toFixed(2);
            const tokenCount = Math.max(16, Math.round(accumulatedText.length / 3.7));

            // Finaliza o streaming remoto com sucesso e estampa a telemetria animada
            setLines(prev => [
                ...prev,
                {
                    id: `telemetry-${Date.now()}`,
                    text: `${latency}s • ${tokenCount} tokens • gemini-3.6-flash (live)`,
                    node: (
                        <motion.div
                            initial={{ opacity: 0, y: 3 }}
                            animate={{ opacity: 0.85, y: 0 }}
                            transition={{ duration: 0.35 }}
                            className="text-[10px] font-mono text-neutral-400 mt-2 flex items-center gap-2 select-none"
                        >
                            <span className="text-emerald-400 font-bold text-[11px]">✔</span>
                            <span>{latency}s</span>
                            <span>•</span>
                            <span>{tokenCount} tokens</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-semibold">gemini-3.6-flash (live)</span>
                        </motion.div>
                    ),
                },
                { text: '', color: '' },
            ]);
        } catch (err: any) {
            console.warn('[Copilot Remote Error]', err);
            // Se foi cancelamento deliberado do usuário via Ctrl+C (quando abortControllerRef.current já foi zerado)
            if (err.name === 'AbortError' && abortControllerRef.current === null) {
                setLines(prev => [
                    ...prev
                        .filter(l => l.id !== dispatchLineId)
                        .map(l => (l.id === streamLineId ? { ...l, isStreaming: false, node: <FormattedCopilotResponse text={l.text || ''} isStreaming={false} /> } : l)),
                    {
                        text: '^C [OPERAÇÃO CANCELADA PELO USUÁRIO]',
                        color: 'text-red-400 font-mono text-xs',
                    },
                    { text: '', color: '' },
                ]);
            } else {
                // Fallback inteligente: simula streaming token a token da base de conhecimento
                await runLocalStreamingFallback();
            }
        } finally {
            setIsStreaming(false);
            if (abortControllerRef.current === controller) {
                abortControllerRef.current = null;
            }
        }
    }, [lang]);

    /** Manipula a submissão de comandos no prompt */
    const handleRunCommand = useCallback((raw: string) => {
        const trimmed = raw.trim();
        if (!trimmed) return;

        setIsTyping(false);
        if (typingTimeoutRef.current) {
            window.clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }

        setHistory(h => [trimmed, ...h]);
        setHistIdx(-1);
        setInput('');

        execute(trimmed, {
            onLaunchGame: (game: ActiveTerminalGame) => {
                clearAllTimers();
                if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                    abortControllerRef.current = null;
                }
                setIsStreaming(false);
                setActiveGame(game);
            },
            onClear: () => {
                clearAllTimers();
                if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                    abortControllerRef.current = null;
                }
                setIsStreaming(false);
                setLines(getWelcomeLines(lang));
                setChatHistory([]);
            },
            setLines,
            runSimulation,
            onFallbackToAI: handleAskCopilot,
        });
    }, [execute, lang, clearAllTimers, runSimulation, handleAskCopilot]);

    // Listener de eventos customizados para foco global do terminal
    useEffect(() => {
        const handleCustomEvent = (e: CustomEvent<{ command?: string }>) => {
            if (e.detail?.command) {
                handleRunCommand(e.detail.command);
            }
            inputRef.current?.focus({ preventScroll: true });
        };

        window.addEventListener('focus-terminal', handleCustomEvent as EventListener);
        return () => window.removeEventListener('focus-terminal', handleCustomEvent as EventListener);
    }, [handleRunCommand]);

    // Teclas globais de navegação do prompt (Tab, Enter, Up, Down, Ctrl+C)
    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (activeGame) return;

        // Abort de streaming ou limpeza de linha com Ctrl+C
        if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
            e.preventDefault();
            setIsTyping(false);
            if (typingTimeoutRef.current) {
                window.clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = null;
            }
            if (isStreaming) {
                abortControllerRef.current?.abort();
                abortControllerRef.current = null;
                setIsStreaming(false);
                return;
            }
            if (input) {
                setLines(prev => [
                    ...prev,
                    { text: `pedro in ~ ❯ ${input} ^C`, color: 'text-neutral-500 font-mono text-xs' },
                    { text: '', color: '' },
                ]);
                setInput('');
            }
            return;
        }

        // Bloqueia novos inputs enquanto streaming estiver em andamento
        if (isStreaming) return;

        if (e.key === 'Tab') {
            e.preventDefault();
            const current = input.toLowerCase();
            if (!current.trim()) return;
            const match = ALL_CMD_STRINGS.find(c => c.startsWith(current) && c !== current);
            if (match) {
                setInput(match);
            }
            return;
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            setIsTyping(false);
            if (typingTimeoutRef.current) {
                window.clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = null;
            }
            handleRunCommand(input);
            return;
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const idx = Math.min(histIdx + 1, history.length - 1);
            setHistIdx(idx);
            if (history[idx] !== undefined) setInput(history[idx]);
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const idx = Math.max(histIdx - 1, -1);
            setHistIdx(idx);
            setInput(idx === -1 ? '' : history[idx]);
        }
    };

    /** Sai de qualquer minijogo com segurança */
    const handleExitGame = () => {
        setActiveGame(null);
        setLines(prev => [
            ...prev,
            { text: '> exit', color: 'text-accent/80' },
            {
                text: lang === 'en'
                    ? 'Returned to main shell.'
                    : lang === 'es'
                    ? 'Regresado al shell principal.'
                    : 'Retornado ao shell principal.',
                color: 'text-primary/70',
            },
            { text: '', color: '' },
        ]);
    };

    return (
        <div
            data-no-morph="true"
            className={`relative w-full max-w-xl xl:max-w-2xl h-[500px] md:h-[540px] flex flex-col bg-[#080a0f]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-[0_24px_60px_-12px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.08)] overflow-hidden transition-all duration-300 ${
                focused ? 'border-cyan-500/40 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.9),0_0_35px_rgba(6,182,212,0.12)]' : 'hover:border-white/15'
            }`}
            onMouseEnter={handlePreWarmEdge}
            onClick={() => inputRef.current?.focus({ preventScroll: true })}
        >
            {/* Topbar de Controle & Abas Técnicas (Ghostty / Warp Style) */}
            <div className="h-10 shrink-0 border-b border-white/[0.06] bg-white/[0.02] flex items-center justify-between px-4 select-none">
                {/* Esquerda: Controles de tráfego sutis */}
                <div className="flex items-center gap-2">
                    <span
                        className="w-2.5 h-2.5 rounded-full bg-rose-500/20 border border-rose-500/40 hover:bg-rose-500/80 transition-colors cursor-pointer"
                        title={lang === 'en' ? 'Reset Shell' : lang === 'es' ? 'Reiniciar Shell' : 'Reiniciar Shell'}
                        onClick={(e) => {
                            e.stopPropagation();
                            clearAllTimers();
                            if (abortControllerRef.current) {
                                abortControllerRef.current.abort();
                                abortControllerRef.current = null;
                            }
                            setIsStreaming(false);
                            setActiveGame(null);
                            setLines(getWelcomeLines(lang));
                        }}
                    />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/80 transition-colors cursor-pointer" title="Minimize Shell" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/80 transition-colors cursor-pointer" title="Maximize Shell" />
                </div>

                {/* Centro: Aba ativa chanfrada estilo terminal profissional */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/[0.06] border border-white/[0.08] text-[11px] font-mono text-neutral-200 shadow-sm">
                    <span className="text-cyan-400 font-bold">❯_</span>
                    <span>copilot.sh</span>
                    <span className="text-emerald-400 text-[9px] font-semibold tracking-wider">
                        {activeGame ? `(${activeGame})` : isStreaming ? '(inferring)' : '(live)'}
                    </span>
                </div>

                {/* Direita: Badge de status de rede e modelo ativo */}
                <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
                    <span className={`w-1.5 h-1.5 rounded-full ${isStreaming ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)] animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
                    <span className="hidden sm:inline tracking-wider">EDGE: GEMINI 3.6 FLASH [live]</span>
                    <span className="sm:hidden tracking-wider">GEMINI 3.6 FLASH</span>
                </div>
            </div>

            {/* Área de Saída de Linhas com Conforto Tipográfico Generoso */}
            <div
                ref={contentRef}
                className="flex-1 min-h-0 overflow-y-auto p-5 md:p-6 space-y-4 font-mono text-xs md:text-[13px] leading-relaxed relative scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.1)_transparent]"
            >
                {activeGame === 'snake' && <SnakeGame lang={lang} onExit={handleExitGame} />}
                {activeGame === 'bug-hunter' && <BugHunterGame lang={lang} onExit={handleExitGame} />}
                {activeGame === 'trivia' && <TriviaGame lang={lang} onExit={handleExitGame} />}
                {activeGame === 'aim-test' && <AimTestGame lang={lang} onExit={handleExitGame} />}
                {activeGame === 'matrix' && <MatrixRain lang={lang} onExit={handleExitGame} />}

                {!activeGame && (
                    <div className="space-y-4">
                        {lines.map((line, i) => (
                            <div key={line.id || i} className={`${line.color || 'text-neutral-300'} block whitespace-pre-wrap break-words leading-relaxed`}>
                                {line.node ? (
                                    line.node
                                ) : typeof line.text === 'string' && (line.text.startsWith('pedro@workstation:') || line.text.startsWith('pedro in ~ ❯')) ? (
                                    <motion.div
                                        initial={{ opacity: 0, x: -6 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center gap-2 font-mono text-xs md:text-[13px] my-1"
                                    >
                                        <div className="flex items-center gap-2 font-mono text-xs select-none shrink-0">
                                            <span className="text-neutral-400 font-medium">pedro</span>
                                            <span className="text-neutral-600">in</span>
                                            <span className="text-neutral-300">~</span>
                                            <span className="text-emerald-400 font-bold">❯</span>
                                        </div>
                                        <span className="text-white font-mono text-xs md:text-[13px]">
                                            {line.text.replace(/pedro(@workstation:(~\$|~\/copilot ❯)| in ~ ❯)\s*/, '')}
                                        </span>
                                    </motion.div>
                                ) : (
                                    line.text || '\u00A0'
                                )}
                            </div>
                        ))}
                        {/* Âncora invisível para auto-scroll automático */}
                        <div ref={terminalEndRef} />
                    </div>
                )}
            </div>

            {/* Pílulas de Atalho Integradas com Micro-Animações */}
            <div className="flex items-center gap-2 px-4 py-2 border-t border-white/[0.04] bg-white/[0.01] overflow-x-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0 select-none">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mr-1">Sugestões:</span>
                <motion.button
                    type="button"
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isStreaming}
                    onClick={() => handleRunCommand('test')}
                    className="px-2.5 py-0.5 rounded bg-white/[0.03] hover:bg-emerald-500/10 border border-white/[0.06] hover:border-emerald-500/30 text-[11px] font-mono text-neutral-400 hover:text-emerald-300 transition-all cursor-pointer disabled:opacity-50"
                >
                    $ test
                </motion.button>
                <motion.button
                    type="button"
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isStreaming}
                    onClick={() => handleRunCommand('sql')}
                    className="px-2.5 py-0.5 rounded bg-white/[0.03] hover:bg-cyan-500/10 border border-white/[0.06] hover:border-cyan-500/30 text-[11px] font-mono text-neutral-400 hover:text-cyan-300 transition-all cursor-pointer disabled:opacity-50"
                >
                    $ sql
                </motion.button>
                <motion.button
                    type="button"
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isStreaming}
                    onClick={() => handleAskCopilot('Como você atua na garantia de qualidade e APIs?', '$ sobre-qa')}
                    className="px-2.5 py-0.5 rounded bg-white/[0.03] hover:bg-emerald-500/10 border border-white/[0.06] hover:border-emerald-500/30 text-[11px] font-mono text-neutral-400 hover:text-emerald-300 transition-all cursor-pointer disabled:opacity-50"
                >
                    $ sobre-qa
                </motion.button>
                <motion.button
                    type="button"
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isStreaming}
                    onClick={() => handleRunCommand('clear')}
                    className="ml-auto text-[11px] font-mono text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer disabled:opacity-50"
                >
                    clear
                </motion.button>
            </div>

            {/* Input Line com Prompt Minimalista & Animação Suave das Letras (Ghostty / Warp Style) */}
            <div
                className={`flex items-center gap-2.5 px-4 py-3 border-t relative shrink-0 transition-colors duration-200 ${
                    focused ? 'border-white/[0.12] bg-black/50 shadow-[0_-1px_12px_rgba(255,255,255,0.02)]' : 'border-white/[0.06] bg-black/40'
                }`}
            >
                <div className="flex items-center gap-2 font-mono text-xs select-none shrink-0">
                    <span className="text-neutral-400 font-medium">pedro</span>
                    <span className="text-neutral-600">in</span>
                    <span className="text-neutral-300">~</span>
                    <span className="text-emerald-400 font-bold">❯</span>
                </div>

                <div className="relative flex-1 flex items-center min-h-[22px]">
                    {/* Camada de renderização visual: Cada letra digitada tem animação fluida (escrita animada estilo phosphor glow) */}
                    <div className="absolute inset-0 pointer-events-none font-mono text-xs md:text-[13px] flex items-center select-none overflow-hidden z-10">
                        {input.split('').map((char, index) => (
                            <motion.span
                                key={`${index}-${char}`}
                                initial={{ opacity: 0, y: 3, filter: 'blur(1px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                transition={{ duration: 0.12, ease: 'easeOut' }}
                                className="inline-block text-neutral-100 whitespace-pre"
                            >
                                {char}
                            </motion.span>
                        ))}

                        {/* Cursor em bloco esmeralda vivo seguindo o texto digitado */}
                        {!activeGame && !isStreaming && input.length > 0 && (
                            <motion.span
                                animate={{ opacity: focused ? [1, 0, 1] : 0.35 }}
                                transition={{ duration: 0.85, repeat: Infinity, ease: 'linear' }}
                                className="inline-block w-2 h-4 bg-emerald-400 rounded-[1px] shrink-0 ml-[1px] shadow-[0_0_8px_rgba(52,211,153,0.7)]"
                            />
                        )}

                        {/* Ghost Text com sugestão do Tab */}
                        {!activeGame && !isStreaming && input && (() => {
                            const match = ALL_CMD_STRINGS.find(c => c.startsWith(input.toLowerCase()) && c !== input.toLowerCase());
                            if (match) {
                                return (
                                    <div className="flex items-center ml-1">
                                        <span className="text-neutral-500 whitespace-pre">{match.slice(input.length)}</span>
                                        <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-white/[0.05] text-neutral-400 border border-white/10 tracking-wider">Tab ⇥</span>
                                    </div>
                                );
                            }
                            return null;
                        })()}
                    </div>

                    {/* Input real invisível que recebe a digitação nativa do usuário */}
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        disabled={isStreaming}
                        onChange={handleInputChange}
                        onKeyDown={onKeyDown}
                        onFocus={() => {
                            setFocused(true);
                            handlePreWarmEdge();
                        }}
                        onBlur={() => {
                            setFocused(false);
                        }}
                        placeholder={
                            activeGame
                                ? (lang === 'en' ? 'Type "exit" to return to shell...' : lang === 'es' ? 'Escribe "exit" para volver al shell...' : 'Digite "exit" para voltar ao shell...')
                                : isStreaming
                                ? (lang === 'en' ? 'Copilot streaming response... (Ctrl+C to abort)' : 'Copilot respondendo... (Ctrl+C para cancelar)')
                                : (lang === 'en' ? 'Ask anything to Copilot or type test, sql, help...' : lang === 'es' ? 'Pregunta lo que sea al Copilot o escribe test, sql, help...' : 'Pergunte qualquer coisa ao Copilot ou digite test, sql, help...')
                        }
                        className="w-full bg-transparent text-transparent font-mono text-xs md:text-[13px] outline-none placeholder-white/20 relative z-20 disabled:opacity-60 caret-transparent"
                        spellCheck={false}
                        autoComplete="off"
                        aria-label="Terminal interativo"
                    />
                </div>

                {isStreaming && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono text-cyan-400 select-none shrink-0"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                        <span>inferindo...</span>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default memo(InteractiveTerminal);
