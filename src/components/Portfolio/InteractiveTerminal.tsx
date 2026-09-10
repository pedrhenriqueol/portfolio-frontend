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

/** Renderizador formatado de respostas de IA estilo terminal com destaque para tokens entre crases */
function FormattedCopilotResponse({ text, isStreaming }: { text: string; isStreaming?: boolean }) {
    const parts = text.split(/(`[^`]+`)/g);
    return (
        <div className="text-neutral-300 font-mono text-[11px] sm:text-[12px] leading-relaxed whitespace-pre-wrap break-words">
            {parts.map((part, idx) => {
                if (part.startsWith('`') && part.endsWith('`') && part.length > 1) {
                    const code = part.slice(1, -1);
                    return (
                        <span key={idx} className="text-white font-semibold bg-white/10 px-1 py-0.5 rounded border border-white/15 mx-0.5 font-mono">
                            {code}
                        </span>
                    );
                }
                return <span key={idx}>{part}</span>;
            })}
            {isStreaming && (
                <span className="inline-block text-cyan-400 font-bold ml-1 animate-pulse">▍</span>
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
    const [history, setHistory] = useState<string[]>([]);
    const [histIdx, setHistIdx] = useState(-1);
    const [activeGame, setActiveGame] = useState<ActiveTerminalGame>(null);
    const [visitorCity, setVisitorCity] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);

    const contentRef = useRef<HTMLDivElement>(null);
    const terminalEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const hasFetchedCity = useRef(false);
    const activeTimersRef = useRef<number[]>([]);
    const abortControllerRef = useRef<AbortController | null>(null);
    const prevLangRef = useRef(lang);

    const { execute } = useTerminalCommands(lang);

    /** Limpa com segurança todos os temporizadores assíncronos em andamento */
    const clearAllTimers = useCallback(() => {
        activeTimersRef.current.forEach(timerId => window.clearTimeout(timerId));
        activeTimersRef.current = [];
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
            }
        }
    }, [lang, activeGame, clearAllTimers]);

    // Localização do visitante via IP-API executado com cache de sessão
    useEffect(() => {
        if (hasFetchedCity.current) return;
        hasFetchedCity.current = true;

        const cached = sessionStorage.getItem('portfolio_visitor_city');
        if (cached) {
            setVisitorCity(cached);
            return;
        }

        fetch('https://ipapi.co/json/')
            .then(r => r.json())
            .then(data => {
                if (data.city) {
                    const cityStr = `${data.city}, ${data.country_code || data.country_name}`;
                    setVisitorCity(cityStr);
                    sessionStorage.setItem('portfolio_visitor_city', cityStr);
                }
            })
            .catch(() => {});
    }, []);

    // Auto-scroll interno do terminal ao adicionar linhas (sem rolar a janela do navegador)
    useEffect(() => {
        if (!activeGame && contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
    }, [lines, activeGame]);

    /** Executa a simulação escalonada de testes ou queries sem bloquear a thread principal */
    const runSimulation = useCallback((type: 'test' | 'sql', commandRaw: string) => {
        clearAllTimers();

        // Eco do comando digitado
        setLines(prev => [
            ...prev,
            { text: `pedro@workstation:~$ ${commandRaw}`, color: 'text-cyan-400/90 font-semibold' },
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

        const streamLineId = `copilot-${Date.now()}`;

        // Eco do comando digitado e badge do Copilot
        setLines(prev => [
            ...prev,
            {
                text: `pedro@workstation:~$ ${displayPrompt}`,
                color: 'text-cyan-400/90 font-semibold',
                node: (
                    <div className="font-mono text-xs sm:text-sm font-semibold flex items-center gap-1.5">
                        <span className="text-cyan-400">pedro@workstation:~$</span>
                        <span className="text-white">{displayPrompt}</span>
                    </div>
                ),
            },
            {
                text: '[COPILOT // AGENTE TÉCNICO]',
                node: (
                    <div className="text-cyan-400 font-mono text-xs font-semibold flex items-center gap-2 mt-1 mb-0.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse inline-block" />
                        <span>[COPILOT // AGENTE TÉCNICO]</span>
                    </div>
                ),
            },
            {
                id: streamLineId,
                text: '',
                isStreaming: true,
                node: <FormattedCopilotResponse text="" isStreaming={true} />,
            },
        ]);

        // Função de streaming do fallback inteligente local
        const runLocalStreamingFallback = async () => {
            const fallbackReply = getLocalCopilotResponse(cleanQuestion, lang);
            const tokens = fallbackReply.split(' ');
            let currentText = '';

            for (let i = 0; i < tokens.length; i++) {
                if (abortControllerRef.current === null) break;
                currentText += (i === 0 ? '' : ' ') + tokens[i];
                const snap = currentText;

                setLines(prev =>
                    prev.map(l =>
                        l.id === streamLineId
                            ? {
                                  ...l,
                                  text: snap,
                                  node: <FormattedCopilotResponse text={snap} isStreaming={i < tokens.length - 1} />,
                              }
                            : l
                    )
                );

                if (contentRef.current) {
                    contentRef.current.scrollTop = contentRef.current.scrollHeight;
                }

                // Cadência fluida e natural de leitura
                await new Promise(r => setTimeout(r, 20));
            }

            setLines(prev => [
                ...prev.map(l =>
                    l.id === streamLineId
                        ? {
                              ...l,
                              text: currentText,
                              isStreaming: false,
                              node: <FormattedCopilotResponse text={currentText} isStreaming={false} />,
                          }
                        : l
                ),
                { text: '', color: '' },
            ]);
        };

        try {
            // Timeout de 25 segundos: dá margem suficiente para qualquer geração da IA sem abortar precocemente
            const timeoutId = setTimeout(() => {
                controller.abort();
            }, 25000);

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: cleanQuestion }),
                signal: controller.signal,
            }).finally(() => clearTimeout(timeoutId));

            const contentType = response.headers.get('content-type') || '';
            if (!response.ok || !contentType.includes('text/plain') || !response.body) {
                console.warn('[Copilot API Remote Fallback Triggered]', response.status);
                throw new Error(`API_ERROR_${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const textChunk = decoder.decode(value, { stream: true });
                accumulatedText += textChunk;

                setLines(prev =>
                    prev.map(l =>
                        l.id === streamLineId
                            ? {
                                  ...l,
                                  text: accumulatedText,
                                  node: <FormattedCopilotResponse text={accumulatedText} isStreaming={true} />,
                              }
                            : l
                    )
                );

                if (contentRef.current) {
                    contentRef.current.scrollTop = contentRef.current.scrollHeight;
                }
            }

            // Se o streaming remoto encerrou sem nenhum caractere, garante o fallback inteligente
            if (!accumulatedText.trim()) {
                throw new Error('EMPTY_STREAM_RESPONSE');
            }

            // Finaliza o streaming remoto com sucesso
            setLines(prev => [
                ...prev.map(l =>
                    l.id === streamLineId
                        ? {
                              ...l,
                              text: accumulatedText,
                              isStreaming: false,
                              node: <FormattedCopilotResponse text={accumulatedText} isStreaming={false} />,
                          }
                        : l
                ),
                { text: '', color: '' },
            ]);
        } catch (err: any) {
            console.warn('[Copilot Remote Error]', err);
            // Se foi cancelamento deliberado do usuário via Ctrl+C (quando abortControllerRef.current já foi zerado)
            if (err.name === 'AbortError' && abortControllerRef.current === null) {
                setLines(prev => [
                    ...prev.map(l => (l.id === streamLineId ? { ...l, isStreaming: false, node: <FormattedCopilotResponse text={l.text || ''} isStreaming={false} /> } : l)),
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
            if (isStreaming) {
                abortControllerRef.current?.abort();
                abortControllerRef.current = null;
                setIsStreaming(false);
                return;
            }
            if (input) {
                setLines(prev => [
                    ...prev,
                    { text: `pedro@workstation:~$ ${input} ^C`, color: 'text-gray-500 font-mono text-xs' },
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
            className={`relative bg-gradient-to-b from-white/[0.05] via-[#0d0f14]/98 to-[#0d0f14]/98 border border-white/[0.08] border-t-white/20 rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.7)] transition-all duration-300 ${
                focused ? 'border-accent/50 border-t-accent/70 shadow-[0_24px_60px_rgba(0,0,0,0.7),0_0_30px_rgba(var(--color-accent-rgb),0.08)]' : 'hover:border-white/20'
            }`}
            onClick={() => inputRef.current?.focus({ preventScroll: true })}
        >
            {/* Title bar com Controles de Janela */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08] bg-dark/60 select-none">
                <span
                    className="w-3 h-3 rounded-full bg-red-500/60 hover:bg-red-500 transition-colors cursor-pointer"
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
                <span className="w-3 h-3 rounded-full bg-yellow-500/40 hover:bg-yellow-500/70 transition-colors cursor-pointer" title="Minimize" />
                <span className="w-3 h-3 rounded-full bg-green-500/40 hover:bg-green-500/70 transition-colors cursor-pointer" title="Maximize" />
                <span className="ml-2 text-xs text-gray-400 font-mono">
                    pedro@portfolio: ~ {activeGame ? `[GAME: ${activeGame.toUpperCase()}]` : isStreaming ? '[COPILOT STREAMING...]' : '[QA & COPILOT SHELL]'}
                </span>
                <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: isStreaming ? 0.6 : 2.5, repeat: Infinity }}
                    className={`ml-auto w-1.5 h-1.5 rounded-full ${isStreaming ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-accent'} inline-block`}
                />
                <span className={`text-xs font-mono ml-1 ${isStreaming ? 'text-cyan-400 font-semibold' : 'text-accent/70'}`}>
                    {activeGame ? 'playing' : isStreaming ? 'copilot active' : 'live'}
                </span>
            </div>

            {/* Área de Saída de Linhas */}
            <div
                ref={contentRef}
                className="p-4 font-mono text-[12px] leading-relaxed min-h-[250px] max-h-[320px] overflow-y-auto relative"
            >
                {activeGame === 'snake' && <SnakeGame lang={lang} onExit={handleExitGame} />}
                {activeGame === 'bug-hunter' && <BugHunterGame lang={lang} onExit={handleExitGame} />}
                {activeGame === 'trivia' && <TriviaGame lang={lang} onExit={handleExitGame} />}
                {activeGame === 'aim-test' && <AimTestGame lang={lang} onExit={handleExitGame} />}
                {activeGame === 'matrix' && <MatrixRain lang={lang} onExit={handleExitGame} />}

                {!activeGame && (
                    <div className="space-y-1">
                        {lines.map((line, i) => (
                            <div key={i} className={`${line.color || 'text-primary/60'} block whitespace-pre-wrap break-all leading-relaxed`}>
                                {line.node ? line.node : (line.text || '\u00A0')}
                            </div>
                        ))}
                        {/* Âncora invisível para auto-scroll automático */}
                        <div ref={terminalEndRef} />
                    </div>
                )}
            </div>

            {/* Input Line com Prompt pedro@workstation:~$ */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-white/5 bg-dark/30 relative">
                <span className="text-cyan-400 font-mono text-[11px] sm:text-[12px] font-semibold shrink-0 select-none">
                    pedro@workstation:~$
                </span>

                <div className="relative flex-1 flex items-center">
                    {/* Ghost Text com sugestão do Tab */}
                    {!activeGame && !isStreaming && input && (() => {
                        const match = ALL_CMD_STRINGS.find(c => c.startsWith(input.toLowerCase()) && c !== input.toLowerCase());
                        if (match) {
                            return (
                                <div className="absolute inset-0 pointer-events-none font-mono text-[12px] flex items-center select-none overflow-hidden">
                                    <span className="opacity-0 whitespace-pre">{input}</span>
                                    <span className="text-accent/40 whitespace-pre">{match.slice(input.length)}</span>
                                    <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-accent/10 text-accent/60 border border-accent/20 tracking-wider">Tab ⇥</span>
                                </div>
                            );
                        }
                        return null;
                    })()}

                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        disabled={isStreaming}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={onKeyDown}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder={
                            activeGame
                                ? (lang === 'en' ? 'Type "exit" to return to shell...' : lang === 'es' ? 'Escribe "exit" para volver al shell...' : 'Digite "exit" para voltar ao shell...')
                                : isStreaming
                                ? (lang === 'en' ? 'Copilot streaming response... (Ctrl+C to abort)' : 'Copilot respondendo... (Ctrl+C para cancelar)')
                                : (lang === 'en' ? 'Ask anything to Copilot or type test, sql, help...' : lang === 'es' ? 'Pregunta lo que sea al Copilot o escribe test, sql, help...' : 'Pergunte qualquer coisa ao Copilot ou digite test, sql, help...')
                        }
                        className="w-full bg-transparent text-white font-mono text-[12px] outline-none placeholder-primary/25 relative z-10 disabled:opacity-60"
                        spellCheck={false}
                        autoComplete="off"
                        aria-label="Terminal interativo"
                    />
                </div>

                <motion.span
                    animate={{ opacity: focused ? [1, 0, 1] : 1 }}
                    transition={{ duration: isStreaming ? 0.4 : 1, repeat: Infinity }}
                    className={`inline-block w-[6px] h-[14px] ${isStreaming ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-accent/70'} rounded-[2px] shrink-0`}
                />
            </div>

            {/* Status bar */}
            <div className="flex items-center gap-3 px-4 py-2 border-t border-white/[0.08] bg-dark/40 text-[10px] font-mono text-neutral-400 select-none">
                <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                    <span className="text-xs">🤖</span>
                    <span>Terminal Copilot (Gemini 1.5 Flash)</span>
                </span>
                <span className="hidden sm:inline text-neutral-600">|</span>
                <span className="hidden sm:inline text-neutral-300">
                    {lang === 'en' ? 'Type "test", "sql" or ask any question to AI' : lang === 'es' ? 'Escribe "test", "sql" o pregunta lo que sea a la IA' : 'Digite "test", "sql" ou faça perguntas em linguagem natural'}
                </span>
                <span className="ml-auto">{visitorCity ? `${visitorCity} → ` : ''}Fortaleza, BR</span>
                <span>UTC-3</span>
            </div>
        </div>
    );
};

export default memo(InteractiveTerminal);
