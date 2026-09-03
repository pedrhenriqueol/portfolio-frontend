export const translations = {
    pt: {
        nav: {
            home: 'Home',
            sobre: 'Sobre',
            experiencia: 'Experiência',
            conhecimentos: 'Skills',
            projetos: 'Projetos',
            contato: 'Contato'
        },
        hero: {
            ola: 'Olá, eu sou o',
            developer: 'Engenheiro de Software',
            role: 'Fullstack',
            description: 'Especialista na modernização de sistemas legados, arquiteturas escaláveis e engenharia orientada a qualidade utilizando',
            verProjetos: 'Ver Projetos',
            downloadCV: 'Baixar CV',
            terminal: {
                role: 'Fullstack Software Engineer',
                available: 'available: true, ✓'
            }
        },
        about: {
            tag: 'BIOGRAFIA',
            title: 'Sobre Mim',
            subtitle: 'Engenharia de software focada em modernização de sistemas, alta disponibilidade, código testável e impacto real.',
            resumoTitle: 'Resumo Profissional',
            resumo1: 'Engenheiro de Software Fullstack com sólida base prática e',
            resumo1_highlight1: '10+ meses',
            resumo1_rest: 'de experiência direta em sistemas PDV/ERP e plataformas corporativas de alta carga, operando em produção com mais de',
            resumo1_highlight2: '100 usuários diários.',
            resumo2: 'Especializado em',
            resumo2_rest: 'Tenho vivência prática com otimizações críticas de banco de dados, reduzindo o tempo de resposta de consultas de',
            resumo2_highlight: '2 s → < 500 ms',
            resumo2_final: 'via indexação eficiente e eliminação de queries N+1.',
            resumo3: 'Integrei componentes fiscais (ACBr) e geradores de relatórios (FortesReport) em ambientes de alta criticidade, assegurando conformidade legal em',
            resumo3_highlight: '100%',
            resumo3_final: 'das transações processadas.',
            resumo4: 'Atualmente, atuo também com',
            resumo4_highlight1: 'Garantia de Qualidade (QA) & Testes',
            resumo4_rest: 'na SETE Tecnologia em sistemas de missão crítica (logística portuária / ZPEs), garantindo blindagem contra regressões com',
            resumo4_highlight2: 'Postman, SQL Server e metodologias ágeis.',
            highlights: [
                '10+ meses de experiência',
                '100+ usuários em produção',
                'QA em sistemas de missão crítica',
                'Queries 4× mais rápidas'
            ],
            educacaoTitle: 'Educação',
            edu1Title: 'Bacharelado em Engenharia de Software',
            edu1Desc: 'UNIFANOR WYDEN • Abr 2026 → Dez 2030',
            edu2Title: 'Técnico em Informática',
            edu2Desc: 'EEEP LUIZA DE TEODORO VIEIRA • Jan 2023 → Dez 2025',
            cards: [
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
                {
                    icon: 'fas fa-shield-alt',
                    title: 'QA & Testes',
                    items: ['Postman (APIs REST)', 'SQL Server (queries)', 'Testes de regressão', 'Scrum / Kanban'],
                }
            ]
        },
        experience: {
            tag: 'TRAJETÓRIA',
            title: 'Experiência Profissional',
            subtitle: 'Minha trajetória no desenvolvimento de software e atuação no mercado.',
            empty: 'Nenhuma experiência cadastrada ainda.',
            list: [
                {
                    id: 2,
                    company: 'SETE Tecnologia',
                    role: 'Analista de Qualidade de Software (QA) e Testes — Estágio',
                    period: 'Junho de 2026 - Presente',
                    techBadges: ['QA', 'Testes de Regressão', 'Postman', 'APIs RESTful', 'SQL Server', 'Scrum / Kanban', 'Engenharia de Requisitos', 'Sistemas de Missão Crítica'],
                    groups: [
                        {
                            title: 'Garantia de Qualidade & Engenharia de Requisitos',
                            icon: 'fas fa-shield-alt',
                            items: [
                                'Atuação na garantia de qualidade e engenharia de requisitos para sistemas de missão crítica no setor logístico e portuário (ZPEs).',
                                'Condução de alinhamentos diretos com múltiplos setores da empresa para mapear 100% dos requisitos de software e regras de negócio operacionais.',
                                'Planejamento, modelagem de cenários e execução de testes funcionais sob metodologias ágeis (Scrum / Kanban), blindando entregas contra regressões sistêmicas.',
                            ],
                        },
                        {
                            title: 'Validação de APIs & Banco de Dados',
                            icon: 'fas fa-database',
                            items: [
                                'Consumo e testes de integração de APIs via serviços RESTful com Postman, estruturando collections de teste para assegurar a confiabilidade do tráfego de dados.',
                                'Execução de queries diagnósticas, validação de transações e testes estruturados diretamente em bancos Microsoft SQL Server no core do sistema ePita.',
                            ],
                        },
                    ],
                },
                {
                    id: 1,
                    company: 'Qualisoft Sistemas',
                    role: 'Desenvolvedor Back-End (PHP / Delphi / SQL) — Estágio',
                    period: 'Agosto de 2025 - Junho de 2026',
                    techBadges: ['PHP / Laravel', 'Delphi 11', 'UniGui', 'MySQL', 'SQL Server', 'ACBr', 'RESTful APIs', 'FortesReport'],
                    groups: [
                        {
                            title: 'Otimização de Banco de Dados & Performance',
                            icon: 'fas fa-tachometer-alt',
                            items: [
                                'Refatoração profunda de consultas SQL Server/MySQL em produção, reduzindo tempo de resposta de relatórios de 2s para <500ms via índices compostos e eliminação de queries N+1.',
                                'Construção de procedures e views analíticas para consolidação de dados em ERP corporativo com centenas de operações diárias.',
                            ],
                        },
                        {
                            title: 'Desenvolvimento Back-End & Módulos Web',
                            icon: 'fas fa-server',
                            items: [
                                'Desenvolvimento de APIs RESTful robustas em PHP/Laravel com autenticação Sanctum, paginação otimizada e arquitetura em camadas de serviço.',
                                'Criação de interfaces reativas em React + TypeScript para módulo administrativo de retaguarda e controle de contas.',
                            ],
                        },
                        {
                            title: 'Modernização de Legados & Componentes Fiscais',
                            icon: 'fas fa-sync-alt',
                            items: [
                                'Participação na engenharia de migração de sistema comercial monolítico (Delphi Desktop/VCL) para arquitetura Web moderna com Delphi 11 + UniGui.',
                                'Integração de bibliotecas fiscais (ACBr) para emissão de NF-e/NFC-e e manutenção de geradores de relatórios com FortesReport.',
                            ],
                        },
                    ],
                },
            ]
        },
        skills: {
            tag: 'CONHECIMENTOS',
            title: 'Stack & Habilidades',
            subtitle: 'Tecnologias, ferramentas e metodologias que domino e utilizo em produção.',
            levels: {
                5: 'Especialista',
                4: 'Avançado',
                3: 'Intermediário',
                2: 'Básico'
            },
            list: [
                { id: 1,  name: 'Delphi 11',      icon_class: 'fas fa-desktop',             category: 'Back-end',     color: '#EE1F35', desc: 'VCL / UniGui, Sistemas ERP & PDV' },
                { id: 2,  name: 'UniGui Web',     icon_class: 'fas fa-globe',               category: 'Back-end',     color: '#0084FF', desc: 'Aplicações Web em tempo real com Delphi' },
                { id: 3,  name: 'React 19',       icon_class: 'fab fa-react',               category: 'Front-end',    color: '#61DAFB', desc: 'SPAs, Componentes reativos & Hooks' },
                { id: 4,  name: 'TypeScript',     icon_class: 'fab fa-js-square',           category: 'Front-end',    color: '#3178C6', desc: 'Tipagem estrita & Código escalável' },
                { id: 5,  name: 'PHP / Laravel',  icon_class: 'fab fa-laravel',             category: 'Back-end',     color: '#FF2D20', desc: 'APIs RESTful, Eloquent & Arquitetura MVC' },
                { id: 6,  name: 'SQL Server',     icon_class: 'fas fa-database',            category: 'Database',     color: '#CC292B', desc: 'Tuning de queries, Índices & Stored Procedures' },
                { id: 7,  name: 'MySQL',          icon_class: 'fas fa-server',              category: 'Database',     color: '#4479A1', desc: 'Modelagem relacional & Otimização' },
                { id: 8,  name: 'QA & Postman',   icon_class: 'fas fa-paper-plane',         category: 'DevOps & QA',  color: '#FF6C37', desc: 'Testes de integração & Validação de endpoints' },
                { id: 9,  name: 'Docker',         icon_class: 'fab fa-docker',              category: 'DevOps & QA',  color: '#2496ED', desc: 'Containers & Ambientes padronizados' },
                { id: 10, name: 'Java / Swing',   icon_class: 'fab fa-java',                category: 'Back-end',     color: '#007396', desc: 'Estruturas de dados & POO' },
                { id: 11, name: 'Python / Flask', icon_class: 'fab fa-python',              category: 'Back-end',     color: '#3776AB', desc: 'Automações, Scripts & Micro-APIs' },
                { id: 12, name: 'Tailwind CSS',   icon_class: 'fab fa-css3-alt',            category: 'Front-end',    color: '#06B6D4', desc: 'Design systems, Layouts fluidos & Responsividade' },
                { id: 13, name: 'ACBr Fiscal',    icon_class: 'fas fa-file-invoice-dollar', category: 'Back-end',     color: '#10B981', desc: 'Emissão NF-e, NFC-e & Legislação Fiscal' },
                { id: 14, name: 'Git & GitHub',   icon_class: 'fab fa-github',              category: 'DevOps & QA',  color: '#F05032', desc: 'CI/CD, Versionamento & Workflows' },
                { id: 15, name: 'Linux Server',   icon_class: 'fab fa-linux',               category: 'DevOps & QA',  color: '#FCC624', desc: 'Deploy, Configuração Nginx & Shell Script' },
                { id: 16, name: 'APIs RESTful',   icon_class: 'fas fa-network-wired',       category: 'Back-end',     color: '#A855F7', desc: 'Contratos de dados, JSON & Autenticação Sanctum' },
                { id: 17, name: 'Scrum / Kanban', icon_class: 'fas fa-tasks',               category: 'DevOps & QA',  color: '#F59E0B', desc: 'Metodologias ágeis & Entregas contínuas' },
                { id: 18, name: 'Regressão QA',   icon_class: 'fas fa-bug',                 category: 'DevOps & QA',  color: '#EC4899', desc: 'Prevenção de bugs & Testes de carga' },
            ]
        },
        projects: {
            tag: 'PORTFÓLIO',
            title: 'Projetos em Destaque',
            subtitle: 'Soluções de engenharia desenvolvidas para resolver problemas reais com foco em arquitetura e impacto.',
            btnRepo: 'Ver Repositório',
            btnDemo: 'Acessar Demo',
            btnDetails: 'Detalhes Técnicos',
            privado: 'Projeto Corporativo Privado',
            empty: 'Nenhum projeto encontrado.',
            modalVoltar: 'Voltar',
            modalFechar: 'Fechar',
            modalSobre: 'Sobre o Projeto',
            modalDestaques: 'Destaques de Engenharia',
            modalArquitetura: 'Fluxo & Diagrama de Arquitetura',
            modalCaseStudy: 'Estudo de Caso — Desafio vs. Solução',
            modalChallengeTitle: 'Desafio Técnico',
            modalSolutionTitle: 'Solução de Engenharia',
            modalDesafio: 'Desafio Técnico',
            modalSolucao: 'Solução de Engenharia',
            filterAll: 'Todos',
            filterFullstack: 'Web / Fullstack',
            filterDesktop: 'Desktop / Delphi',
            filterBackend: 'Backend & APIs',
            filterOthers: 'Outros',
            list: [
                {
                    id: 101,
                    title: 'PayStream Gateway',
                    description: 'Gateway corporativo de pagamentos fintech com liquidação de split multipartes em centavos inteiros, idempotência atômica P2002 no PostgreSQL, webhooks com assinatura HMAC-SHA256 e proteção estrita contra timing attacks.',
                    image_url: '/paystream_mockup.jpg',
                    repo_link: 'https://github.com/pedrhenriqueol/paystream-gateway',
                    demo_link: 'https://paystream-gateway.onrender.com',
                    tags: ['Fastify', 'TypeScript', 'Prisma', 'PostgreSQL', 'HMAC-SHA256', 'Fintech', 'React', 'Tailwind CSS'],
                    details: {
                        subtitle: 'Core Banking & Gateway de Pagamentos Resiliente com Split e Idempotência Atômica',
                        fullDescription: 'Arquitetura corporativa de processamento financeiro desenvolvida em Node.js com Fastify e Prisma ORM sobre PostgreSQL. O gateway implementa processamento atômico de transações PIX e Cartão de Crédito com split de pagamentos rigorosamente calculado em inteiros (centavos), garantindo a conservação contábil absoluta da equação taxa + soma(sellers) == valor_bruto. Conta com chave de idempotência composta única, webhooks assinados criptograficamente com timestamp binding e verificação de assinatura em tempo constante com crypto.timingSafeEqual.',
                        metrics: [
                            { label: 'Idempotência', value: 'Zero Double-Spending (P2002)', icon: 'fas fa-fingerprint' },
                            { label: 'Precisão Contábil', value: '100% Split em Centavos', icon: 'fas fa-coins' },
                            { label: 'Criptografia', value: 'HMAC-SHA256 + Timing-Safe', icon: 'fas fa-shield-alt' }
                        ],
                        architecture: [
                            { layer: 'Client / Checkout SPA', tech: 'React 18 + Tailwind CSS + Framer Motion', role: 'Interface interativa de checkout com geração instantânea de PIX QR Code e validação de cartão' },
                            { layer: 'Gateway API & Auth', tech: 'Fastify + JWT Stateless + Rate Limiting', role: 'Validação Zod de payloads, controle de requisições por IP/chave e sanitização estrita de dados PCI' },
                            { layer: 'Transaction Engine', tech: 'Prisma ORM + PostgreSQL ACID', role: 'Garantia de idempotência com @@unique([merchantId, externalId]) e locking otimista em concorrência' },
                            { layer: 'Webhook Dispatcher', tech: 'HMAC-SHA256 + Exponential Backoff', role: 'Disparo assíncrono resiliente de notificações para merchants com 3 tentativas e jitter aleatório' }
                        ],
                        challenge: 'Eliminar condições de corrida em transações financeiras simultâneas que provocavam risco de double-spending, além de proteger a infraestrutura de webhooks contra timing attacks e falhas de arredondamento de ponto flutuante em splits de marketplace.',
                        solution: 'Implementação de chave de idempotência com captura de erro P2002 no PostgreSQL com replay idempotente (HTTP 200), cálculos financeiros estritamente em centavos inteiros (Math.round), assinatura HMAC vinculada a timestamp e comparação constante com crypto.timingSafeEqual.',
                        highlights: [
                            'Idempotência atômica comprovada: concorrência resolvida via restrição de unicidade no PostgreSQL com retorno X-Idempotent-Replay: true',
                            'Split contábil matematicamente exato: validação estrita que rejeita divergências com status 422 Unprocessable Entity',
                            'Blindagem criptográfica: assinaturas de webhook blindadas contra timing attacks e replay attacks via timestamp binding',
                            'Webhook dispatcher assíncrono com retentativas automáticas, timeout de 5 segundos e backoff exponencial com jitter',
                            'Sanitização estrita PCI-DSS: número de cartão e CVV nunca persistidos em banco nem expostos em logs de erro'
                        ]
                    }
                },
                {
                    id: 102,
                    title: 'PortLog OS',
                    description: 'Sistema operacional de logística portuária e manutenção de guindastes pesados (STS/RTG) com governança RBAC multi-tenant estrita, máquina de estados finita (FSM) no Kanban, telemetria preditiva IoT e MTTR auditado em UTC.',
                    image_url: '/portlog_mockup.jpg',
                    repo_link: 'https://github.com/pedrhenriqueol/portlog-os',
                    demo_link: 'https://portlog-os.vercel.app',
                    tags: ['React', 'TypeScript', 'Fastify', 'Prisma', 'PostgreSQL', 'Multi-tenant', 'RBAC', 'IoT Telemetry', 'FSM'],
                    details: {
                        subtitle: 'Logística Portuária, FSM de Ordens de Serviço & Telemetria Preditiva Industrial',
                        fullDescription: 'Plataforma de missão crítica para gestão de operações em terminais de contêineres e zonas de processamento de exportação (ZPE). Desenvolvida em React 18, Fastify e PostgreSQL com Prisma ORM, a aplicação orquestra a manutenção preventiva e corretiva de guindastes Ship-to-Shore (STS), guindastes de pórtico sobre pneus (RTG) e Reach Stackers. A governança baseia-se em isolamento multi-tenant intransponível por terminalId e controle de acesso baseado em papéis (RBAC) com máquina de estados finita determinística, impedindo transições ilegais no Kanban e assegurando telemetria de sensores de vibração e temperatura com tolerância a falhas.',
                        metrics: [
                            { label: 'Isolamento', value: 'Zero Data Leakage (Multi-tenant)', icon: 'fas fa-building' },
                            { label: 'Confiabilidade FSM', value: '100% Transições Válidas', icon: 'fas fa-project-diagram' },
                            { label: 'Telemetria IoT', value: '< 200ms Atualização Contínua', icon: 'fas fa-satellite-dish' }
                        ],
                        architecture: [
                            { layer: 'Frontend UI / Kanban', tech: 'React 18 + Framer Motion + Tailwind', role: 'Quadro Kanban interativo com drag-and-drop, rollback otimista automático e visualização de telemetria' },
                            { layer: 'Tenant Isolation & RBAC', tech: 'Fastify Hook + JWT + Tenant Guard', role: 'Injeção compulsória de terminalId em 100% das rotas e validação de claims de perfil administrativo' },
                            { layer: 'FSM Workflow Engine', tech: 'Domain State Machine Validator', role: 'Matriz estrita de transições de status (TRIAGEM -> APROVADA -> EM_EXECUCAO -> CONCLUIDA) com validação de checklist' },
                            { layer: 'IoT Ingestion & Metrics', tech: 'Zod Sensor Limits + UTC MTTR Math', role: 'Filtro contra anomalias físicas em sensores e cálculo de MTTR (Mean Time to Repair) preciso em milissegundos UTC' }
                        ],
                        challenge: 'Impedir vazamento de dados confidenciais entre operadores portuários concorrentes que compartilham a mesma infraestrutura de banco de dados e evitar estados inconsistentes nas ordens de serviço de guindastes pesados.',
                        solution: 'Injeção obrigatória do terminalId em nível de middleware e query, validação de transições permitidas por uma máquina de estados finita e bloqueio de conclusão caso checklists obrigatórios não estejam cumpridos.',
                        highlights: [
                            'Isolamento multi-tenant absoluto: 100% das operações protegidas por escopo de terminal, impedindo acesso cruzado não autorizado',
                            'Máquina de estados finita robusta: transições ilegais no ciclo de vida de manutenção são barradas com HTTP 422',
                            'Governança RBAC granular: aprovação e cancelamento restritos a supervisores e administradores master',
                            'Trilha de auditoria append-only: histórico imutável com registro de usuário, IP e timestamp de cada transição',
                            'Telemetria IoT blindada com sanitização Zod de limites físicos para temperatura, vibração e pressão hidráulica'
                        ]
                    }
                },
                {
                    id: 103,
                    title: 'SPECTR TestOps',
                    description: 'Plataforma corporativa de TestOps inspirada na ergonomia do Postman com runner de coleções e requisições isoladas, validação recursiva de contratos OpenAPI/JSON Schema, Chaos Engineering e percentis estatísticos p50/p90/p95/p99.',
                    image_url: '/spectr_mockup.jpg',
                    repo_link: 'https://github.com/pedrhenriqueol/spectr-testops',
                    demo_link: 'https://spectr-testops.vercel.app',
                    tags: ['React', 'TypeScript', 'Fastify', 'Tailwind CSS', 'Framer Motion', 'OpenAPI', 'Chaos Engineering', 'p95 SLA'],
                    details: {
                        subtitle: 'Plataforma Corporativa de TestOps, Validação de Contratos & Engenharia do Caos',
                        fullDescription: 'Solução corporativa de engenharia de qualidade e observabilidade de APIs inspirada no Postman, Datadog e K6. Desenvolvida em React 18 com Framer Motion e backend Fastify com TypeScript, a plataforma permite a criação de suítes de testes de regressão, execução de requests individuais com visualizador JSON com syntax highlighting em tempo real, validação recursiva profunda de esquemas OpenAPI/JSON Schema e testes de estresse no Chaos Lab (latência artificial, falhas 503 e conexões intermitentes). A análise de desempenho utiliza o método Nearest Rank padronizado pelo NIST para cálculo de percentis p50, p90, p95 e p99 sem distorções.',
                        metrics: [
                            { label: 'Conformidade OpenAPI', value: '100% Validação Recursiva', icon: 'fas fa-file-contract' },
                            { label: 'Métricas de Latência', value: 'p50 / p90 / p95 / p99', icon: 'fas fa-chart-line' },
                            { label: 'Resiliência', value: 'Chaos Lab + Zero Memory Leaks', icon: 'fas fa-biohazard' }
                        ],
                        architecture: [
                            { layer: 'Workstation UI', tech: 'React 18 + Postman Design Tokens + Framer Motion', role: 'Interface moderna com Dark/Light mode calibrado, dropdown de idiomas com zero layout shift e syntax highlighter' },
                            { layer: 'Execution Engine', tech: 'Fastify + AbortController + Fetch Engine', role: 'Motor de execução sequencial e concorrente com cancelamento assíncrono imediato de in-flight requests' },
                            { layer: 'Assertion & Contract Validator', tech: 'Recursive Schema Validator', role: 'Validação estrita de contratos OpenAPI com suporte a tipos primitivos, objetos aninhados e arrays tipados' },
                            { layer: 'Chaos & Telemetry Lab', tech: 'Socket Lifecycle Timers + Statistical Math', role: 'Injeção de estresse com liberação imediata de timers em socket close e cálculo de percentis Nearest Rank' }
                        ],
                        challenge: 'Garantir que validações de esquemas complexos em JSON Schema não gerem falsos-positivos em dados aninhados e evitar memory leaks no Node.js causados por timers pendentes em testes de caos sob alta concorrência.',
                        solution: 'Desenvolvimento de um motor de validação recursivo com checagem de tipos estritos, cálculo de percentis de latência pelo método Nearest Rank e liberação de timers de simulação no fechamento de conexão.',
                        highlights: [
                            'Ergonomia corporativa estilo Postman: branding vetorial dinâmico, paleta escura (#1C1C1C) e clara com contraste WCAG AA',
                            'Validador recursivo de contratos OpenAPI: checagem profunda de propriedades aninhadas, tipos primitivos e arrays',
                            'Análise matemática de latência: percentis de cauda p50, p90, p95 e p99 calculados com precisão estatística',
                            'Chaos Engineering integrado: injeção de latência com descarte de timers, erros 503 e falhas intermitentes',
                            'Exportação real de relatórios de SLA e auditoria em formatos JSON e CSV estruturados'
                        ]
                    }
                },

                {
                    id: 1,
                    title: 'Retaguarda ERP',
                    description: 'Desenvolvimento full-stack de módulo administrativo de alta carga para gestão de ERP/PDV. Arquitetura desacoplada com API RESTful em Laravel e SPA cliente em React + TypeScript.',
                    image_url: '/erp_retaguarda_mockup.jpg',
                    repo_link: null,
                    demo_link: null,
                    tags: ['Laravel', 'React', 'TypeScript', 'Tailwind CSS', 'SQL Server', 'REST API'],
                    details: {
                        subtitle: 'Módulo Administrativo Full-Stack — Gestão ERP/PDV',
                        fullDescription: 'Desenvolvimento full-stack de módulo administrativo corporativo para gestão de ERP/PDV. A arquitetura foi concebida de forma totalmente desacoplada, utilizando uma API RESTful em Laravel e uma aplicação client-side construída com React e TypeScript. O foco central esteve na performance sob alta concorrência de operadores e integridade fiscal absoluta.',
                        metrics: [
                            { label: 'Latência', value: '2s → <500ms', icon: 'fas fa-bolt' },
                            { label: 'Concorrência', value: '100+ Usuários Simultâneos', icon: 'fas fa-users' },
                            { label: 'Conformidade', value: '100% Fiscal ACBr', icon: 'fas fa-shield-alt' }
                        ],
                        architecture: [
                            { layer: 'Client / Presentation', tech: 'React 18 + TypeScript + Tailwind', role: 'SPA desacoplada com componentes reativos, cache local e feedback otimista' },
                            { layer: 'API Gateway & Auth', tech: 'Laravel Sanctum + Middleware', role: 'Autenticação stateless, controle de sessão seguro e validação estrita de payloads' },
                            { layer: 'Business & Fiscal', tech: 'PHP 8 Services + ACBr Core', role: 'Processamento de regras de faturamento, emissão fiscal e inventário em tempo real' },
                            { layer: 'Data Tier', tech: 'SQL Server / MySQL Pool', role: 'Modelagem relacional otimizada com índices cobridores e zero queries N+1' }
                        ],
                        challenge: 'Gargalos de concorrência em horários de pico durante a emissão de notas fiscais e lentidão em relatórios de inventário com milhares de SKUs em banco de dados relacional.',
                        solution: 'Refatoração completa para arquitetura desacoplada (Laravel REST API + React SPA), aplicação de Eager Loading com índices compostos no banco e processamento assíncrono para emissão fiscal via ACBr.',
                        highlights: [
                            'Arquitetura desacoplada: API RESTful (Laravel) + SPA (React + TypeScript)',
                            'Interface 100% responsiva e acessível com tema escuro calibrado em Tailwind CSS',
                            'Gestão de inventário em tempo real com feedback imediato via hooks e componentes reativos',
                            'Controle de contas a receber com filtros avançados e exportação de relatórios analíticos',
                            'Integração profunda com componentes fiscais (ACBr) para emissão de NF-e/NFC-e com contingência',
                            'Autenticação e autorização robusta via Laravel Sanctum com RBAC por perfil de operador',
                        ],
                    },
                },
                {
                    id: 2,
                    title: 'Portal Conglomerados',
                    description: 'Plataforma Multi-tenant para gestão centralizada de múltiplas unidades de negócio. Implementação de RBAC hierárquico por filial e dashboards analíticos em tempo real.',
                    image_url: '/portal_conglomerados_mockup.jpg',
                    repo_link: null,
                    demo_link: null,
                    tags: ['Laravel', 'React', 'Multi-tenant', 'RBAC', 'SQL Server', 'Analytics'],
                    details: {
                        subtitle: 'Plataforma Multi-tenant de Gestão Empresarial',
                        fullDescription: 'Projeção e implementação de uma plataforma de governança corporativa com arquitetura Multi-tenant, permitindo a operação centralizada de múltiplas unidades de negócio e filiais em um único ecossistema. O painel executivo consolida dados financeiros e operacionais dispersos com supervisão em tempo real.',
                        metrics: [
                            { label: 'Arquitetura', value: 'Multi-Tenant com Isolamento Lógico', icon: 'fas fa-sitemap' },
                            { label: 'Segurança', value: 'RBAC Granular por Cargo e Filial', icon: 'fas fa-user-shield' },
                            { label: 'Analytics', value: 'Dashboards Consolidados em Tempo Real', icon: 'fas fa-chart-line' }
                        ],
                        architecture: [
                            { layer: 'Client Portal', tech: 'React + TypeScript + Chart.js', role: 'Painéis executivos dinâmicos com gráficos interativos e agregação visual' },
                            { layer: 'Tenant Resolver', tech: 'Laravel Tenant Middleware', role: 'Identificação e isolamento automático do contexto da filial por subdomínio/token' },
                            { layer: 'Security & RBAC', tech: 'Role-Based Access Control', role: 'Permissões granulares de visualização e edição por hierarquia organizacional' },
                            { layer: 'Consolidated DB', tech: 'Multi-Tenant Database Engine', role: 'Consultas agregadas multi-filial com índices especializados e baixa latência' }
                        ],
                        challenge: 'Garantir isolamento rigoroso de dados entre dezenas de empresas do mesmo grupo sem duplicar infraestrutura e sem perda de performance em consultas financeiras consolidadas.',
                        solution: 'Implementação de arquitetura Multi-Tenant com resolução dinâmica de contexto por tenant, segurança via RBAC e queries agregadas com cache inteligente de métricas executivas.',
                        highlights: [
                            'Arquitetura Multi-tenant com separação lógica estrita de dados por empresa e filial',
                            'RBAC (Role-Based Access Control) avançado: usuários acessam apenas módulos autorizados de suas unidades',
                            'Dashboards executivos em React para agregação e visualização de grandes volumes de dados',
                            'API RESTful em Laravel com endpoints protegidos por policies e gates por tenant',
                            'Consultas otimizadas para cruzamento de dados multi-filial com latência inferior a 300ms',
                            'Design escalável: adição de novas filiais instantaneamente sem alteração na base de código',
                        ],
                    },
                },
                {
                    id: 3,
                    title: 'Migração Delphi → UniGui Web',
                    description: 'Engenharia de modernização de sistema monolítico legado (Delphi Desktop/VCL) para arquitetura Web nativa com Delphi 11 + UniGui, mantendo 100% de integridade fiscal.',
                    image_url: '/unigui_migration_mockup.jpg',
                    repo_link: null,
                    demo_link: null,
                    tags: ['Delphi 11', 'UniGui', 'ACBr', 'FireDAC', 'FortesReport', 'SQL Server'],
                    details: {
                        subtitle: 'Modernização de Sistema Monolítico Legado para Web',
                        fullDescription: 'Engenharia de modernização e refatoração de um sistema comercial monolítico legado (Desktop/VCL em Delphi 6) para uma arquitetura Web nativa utilizando RAD Studio Delphi 11 e o framework UniGui. O projeto envolveu a reestruturação profunda do gerenciamento de estado e concorrência para execução server-side via navegador.',
                        metrics: [
                            { label: 'Modernização', value: 'Desktop ➔ 100% Web Nativo', icon: 'fas fa-cloud' },
                            { label: 'Integridade', value: 'Zero Perda de Regras Fiscais ACBr', icon: 'fas fa-check-circle' },
                            { label: 'Performance', value: 'Execução Server-Side Otimizada', icon: 'fas fa-tachometer-alt' }
                        ],
                        architecture: [
                            { layer: 'Web Client', tech: 'UniGui Web / ExtJS Engine', role: 'Interface rica e responsiva no navegador sem necessidade de instalação local' },
                            { layer: 'Server Engine', tech: 'Delphi 11 RAD ServerModule', role: 'Gerenciamento de instâncias, threads de conexão e ciclo de vida de sessão' },
                            { layer: 'Fiscal & Reports', tech: 'ACBr Web + FortesReport Server', role: 'Geração de relatórios PDF server-side e emissão fiscal ininterrupta' },
                            { layer: 'Data Engine', tech: 'FireDAC + SQL Server', role: 'Pool de conexões FireDAC resiliente com transações ACID estritas' }
                        ],
                        challenge: 'Migrar um sistema monolítico Desktop VCL de 15+ anos com bibliotecas legadas (JEDI/JVCL) para Web sem quebrar regras de negócio fiscais e sem perda de estabilidade.',
                        solution: 'Reestruturação do ciclo de vida das telas para UniGui MainModule/ServerModule, upgrade do framework ACBr para execução server-side e criação de pool de conexões FireDAC para suportar múltiplos operadores simultâneos via browser.',
                        highlights: [
                            'Conversão completa de VCL (Desktop) para UniGui Web mantendo a lógica de negócio intacta',
                            'Upgrade de componentes fiscais críticos (Projeto ACBr) para emissão de NF-e/NFC-e no novo ambiente web',
                            'Migração e adaptação de geradores de relatório (FortesReport) para execução server-side assíncrona',
                            'Controle de concorrência e sessão de usuários isolado via ServerModule e MainModule',
                            'Resolução de conflitos de bibliotecas legadas (JEDI — JCL/JVCL) e reestruturação do Library Path',
                            'Resultado: compilação limpa, estabilidade em produção e eliminação de 40% dos bugs visuais legados',
                        ],
                    },
                },
                {
                    title: 'Controle de Estoque — Java + MySQL',
                    description: 'Sistema desktop com interface Swing para controle de estoque completo com cadastro de usuários e integração MySQL.',
                    image_url: '/java_inventory_mockup.png',
                    repo_link: 'https://github.com/pedrhenriqueol/Projetos-Java',
                    demo_link: null,
                    tags: ['Java', 'MySQL', 'Swing'],
                },
                {
                    id: 5,
                    title: 'API de Tarefas — Python + Flask',
                    description: 'API RESTful com rotas GET, POST, PUT e DELETE feita com Python e Flask. Possui frontend integrado com HTML, CSS e JavaScript.',
                    image_url: '/flask_api_mockup.png',
                    repo_link: 'https://github.com/pedrhenriqueol/API-Python',
                    demo_link: null,
                    tags: ['Python', 'Flask', 'REST API'],
                },
                {
                    id: 6,
                    title: 'Gerador de Senhas — Python',
                    description: 'Aplicativo desktop em Python com interface Tkinter. Utiliza bibliotecas random, string e pyperclip para geração e cópia prática das senhas.',
                    image_url: '/password_gen_mockup.png',
                    repo_link: 'https://github.com/pedrhenriqueol/Gerador-senhas',
                    demo_link: null,
                    tags: ['Python', 'Tkinter'],
                },
            ]
        },
        contact: {
            tag: 'Entre em contato',
            title1: 'Vamos ',
            title2: 'Conversar?',
            subtitle: 'Estou aberto a novas oportunidades, colaborações ou apenas uma boa conversa sobre tecnologia.',
            directMessage: 'Prefere ir direto ao ponto? Me encontre por qualquer um dos canais abaixo. Costumo responder em menos de 24h.',
            formName: 'Nome',
            formEmail: 'E-mail',
            formSubject: 'Assunto',
            formSubjectPlaceholder: 'Oportunidade, colaboração, freelance...',
            formMessage: 'Mensagem',
            formMessagePlaceholder: 'Escreva sua mensagem aqui...',
            labelName: 'Nome',
            labelEmail: 'E-mail',
            labelSubject: 'Assunto',
            labelMessage: 'Mensagem',
            successMsg: 'Mensagem enviada! Entrarei em contato em breve.',
            errorMsg: 'Erro ao enviar. Tente pelo LinkedIn ou e-mail diretamente.',
            errorConn: 'Erro de conexão. Verifique sua internet e tente novamente.',
            btnSending: 'Enviando...',
            btnSend: 'Enviar Mensagem',
            sending: 'Enviando...',
            submitBtn: 'Enviar Mensagem',
            rights: 'Pedro Henrique. Todos os direitos reservados.'
        },
        palette: {
            title: 'Paleta de Cores',
            mocha: 'Café / Mocha',
            claude: 'Claude Editorial',
            greige: 'Greige Minimal',
            forest: 'Verde Musgo',
            slate: 'Midnight Slate',
            emerald: 'Obsidian Emerald'
        }
    },
    en: {
        nav: {
            home: 'Home',
            sobre: 'About',
            experiencia: 'Experience',
            conhecimentos: 'Skills',
            projetos: 'Projects',
            contato: 'Contact'
        },
        hero: {
            ola: 'Hi, I am',
            developer: 'Fullstack Software',
            role: 'Engineer',
            description: 'Specialist in legacy modernization, scalable high-availability architecture, and quality-driven engineering using',
            verProjetos: 'View Projects',
            downloadCV: 'Download CV',
            terminal: {
                role: 'Fullstack Software Engineer',
                available: 'available: true, ✓'
            }
        },
        about: {
            tag: 'BIOGRAPHY',
            title: 'About Me',
            subtitle: 'Software engineering focused on system modernization, high availability, testable code, and real-world impact.',
            resumoTitle: 'Professional Summary',
            resumo1: 'Fullstack Software Engineer with a solid practical foundation and',
            resumo1_highlight1: '10+ months',
            resumo1_rest: 'of direct experience in high-load POS/ERP systems and corporate web platforms, acting directly in production with over',
            resumo1_highlight2: '100 daily users.',
            resumo2: 'Specialized in',
            resumo2_rest: 'I have hands-on experience with critical database optimizations, reducing query response times from',
            resumo2_highlight: '2 s → < 500 ms',
            resumo2_final: 'via strategic indexing and eliminating N+1 bottlenecks.',
            resumo3: 'Integrated complex fiscal (ACBr) and reporting (FortesReport) engines in mission-critical environments, ensuring legal compliance across',
            resumo3_highlight: '100%',
            resumo3_final: 'of processed transactions.',
            resumo4: 'Currently also working in',
            resumo4_highlight1: 'Quality Assurance (QA) & Testing',
            resumo4_rest: 'at SETE Tecnologia on mission-critical port logistics and customs systems (ZPEs), shielding deployments with',
            resumo4_highlight2: 'Postman, SQL Server, and agile methodologies.',
            highlights: [
                '10+ months experience',
                '100+ production users',
                'QA on mission-critical systems',
                '4× faster queries'
            ],
            educacaoTitle: 'Education',
            edu1Title: 'Bachelor of Software Engineering',
            edu1Desc: 'UNIFANOR WYDEN • Apr 2026 → Dec 2030',
            edu2Title: 'IT Technician',
            edu2Desc: 'EEEP LUIZA DE TEODORO VIEIRA • Jan 2023 → Dec 2025',
            cards: [
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
                    items: ['MySQL', 'SQL Server (cloud)', 'PostgreSQL', 'Query optimization'],
                },
                {
                    icon: 'fas fa-tools',
                    title: 'DevOps & Tools',
                    items: ['Git / GitHub', 'Docker', 'Railway / Render', 'Linux CLI'],
                },
                {
                    icon: 'fas fa-shield-alt',
                    title: 'QA & Testing',
                    items: ['Postman (REST APIs)', 'SQL Server (queries)', 'Regression testing', 'Scrum / Kanban'],
                }
            ]
        },
        experience: {
            tag: 'TRAJECTORY',
            title: 'Professional Experience',
            subtitle: 'My journey in software development and the tech industry.',
            empty: 'No experience registered yet.',
            list: [
                {
                    id: 2,
                    company: 'SETE Tecnologia',
                    role: 'Software Quality Assurance (QA) & Test Analyst — Intern',
                    period: 'June 2026 - Present',
                    techBadges: ['QA', 'Regression Testing', 'Postman', 'RESTful APIs', 'SQL Server', 'Scrum / Kanban', 'Requirements Eng.', 'Mission Critical Systems'],
                    groups: [
                        {
                            title: 'Quality Assurance & Requirements Eng.',
                            icon: 'fas fa-shield-alt',
                            items: [
                                'QA and requirements engineering for mission-critical systems in the logistics and port sector (ZPEs).',
                                'Conducted direct alignments with multiple company sectors to map 100% of software requirements and operational business rules.',
                                'Planned, modeled scenarios and executed functional testing under agile methodologies (Scrum / Kanban), shielding deliveries against systemic regressions.',
                            ],
                        },
                        {
                            title: 'API & Database Validation',
                            icon: 'fas fa-database',
                            items: [
                                'API consumption and integration testing via RESTful services using Postman, structuring test collections to ensure data traffic reliability.',
                                'Executed diagnostic queries, transaction validation, and structured testing directly in Microsoft SQL Server databases within the ePita core system.',
                            ],
                        },
                    ],
                },
                {
                    id: 1,
                    company: 'Qualisoft Sistemas',
                    role: 'Back-End Developer (PHP / Delphi / SQL) — Intern',
                    period: 'August 2025 - June 2026',
                    techBadges: ['PHP / Laravel', 'Delphi 11', 'UniGui', 'MySQL', 'SQL Server', 'ACBr', 'RESTful APIs', 'FortesReport'],
                    groups: [
                        {
                            title: 'Database Optimization & Performance',
                            icon: 'fas fa-tachometer-alt',
                            items: [
                                'Deep refactoring of SQL Server/MySQL queries in production, reducing report response time from 2s to <500ms via composite indexing and N+1 query elimination.',
                                'Constructed analytical stored procedures and views for data consolidation in an enterprise ERP handling hundreds of daily operations.',
                            ],
                        },
                        {
                            title: 'Back-End Development & Web Modules',
                            icon: 'fas fa-server',
                            items: [
                                'Built robust RESTful APIs in PHP/Laravel with Sanctum authentication, optimized pagination, and layered service architecture.',
                                'Created reactive interfaces in React + TypeScript for backoffice administration and accounts receivable management.',
                            ],
                        },
                        {
                            title: 'Legacy Modernization & Fiscal Engines',
                            icon: 'fas fa-sync-alt',
                            items: [
                                'Contributed to the engineering migration of a monolithic desktop system (Delphi Desktop/VCL) to a modern Web architecture using Delphi 11 + UniGui.',
                                'Integrated fiscal libraries (ACBr) for electronic invoice issuance (NF-e/NFC-e) and maintained server-side report generation with FortesReport.',
                            ],
                        },
                    ],
                }
            ]
        },
        skills: {
            tag: 'SKILLS & TECH',
            title: 'Stack & Capabilities',
            subtitle: 'Technologies, tools, and methodologies I master and use in production.',
            levels: {
                5: 'Expert',
                4: 'Advanced',
                3: 'Intermediate',
                2: 'Basic'
            },
            list: [
                { id: 1,  name: 'Delphi 11',      icon_class: 'fas fa-desktop',             category: 'Back-end',     color: '#EE1F35', desc: 'VCL / UniGui, ERP & POS Systems' },
                { id: 2,  name: 'UniGui Web',     icon_class: 'fas fa-globe',               category: 'Back-end',     color: '#0084FF', desc: 'Real-time Web Applications with Delphi' },
                { id: 3,  name: 'React 19',       icon_class: 'fab fa-react',               category: 'Front-end',    color: '#61DAFB', desc: 'SPAs, Reactive Components & Hooks' },
                { id: 4,  name: 'TypeScript',     icon_class: 'fab fa-js-square',           category: 'Front-end',    color: '#3178C6', desc: 'Strict Typing & Scalable Code' },
                { id: 5,  name: 'PHP / Laravel',  icon_class: 'fab fa-laravel',             category: 'Back-end',     color: '#FF2D20', desc: 'RESTful APIs, Eloquent & MVC Architecture' },
                { id: 6,  name: 'SQL Server',     icon_class: 'fas fa-database',            category: 'Database',     color: '#CC292B', desc: 'Query Tuning, Indexes & Stored Procedures' },
                { id: 7,  name: 'MySQL',          icon_class: 'fas fa-server',              category: 'Database',     color: '#4479A1', desc: 'Relational Modeling & Optimization' },
                { id: 8,  name: 'QA & Postman',   icon_class: 'fas fa-paper-plane',         category: 'DevOps & QA',  color: '#FF6C37', desc: 'Integration Testing & Endpoint Validation' },
                { id: 9,  name: 'Docker',         icon_class: 'fab fa-docker',              category: 'DevOps & QA',  color: '#2496ED', desc: 'Containers & Standardized Environments' },
                { id: 10, name: 'Java / Swing',   icon_class: 'fab fa-java',                category: 'Back-end',     color: '#007396', desc: 'Data Structures & OOP' },
                { id: 11, name: 'Python / Flask', icon_class: 'fab fa-python',              category: 'Back-end',     color: '#3776AB', desc: 'Automations, Scripts & Micro-APIs' },
                { id: 12, name: 'Tailwind CSS',   icon_class: 'fab fa-css3-alt',            category: 'Front-end',    color: '#06B6D4', desc: 'Design Systems, Fluid Layouts & Responsive' },
                { id: 13, name: 'ACBr Fiscal',    icon_class: 'fas fa-file-invoice-dollar', category: 'Back-end',     color: '#10B981', desc: 'NF-e/NFC-e Issuance & Tax Compliance' },
                { id: 14, name: 'Git & GitHub',   icon_class: 'fab fa-github',              category: 'DevOps & QA',  color: '#F05032', desc: 'CI/CD, Versioning & Workflows' },
                { id: 15, name: 'Linux Server',   icon_class: 'fab fa-linux',               category: 'DevOps & QA',  color: '#FCC624', desc: 'Deployment, Nginx Setup & Shell Scripting' },
                { id: 16, name: 'APIs RESTful',   icon_class: 'fas fa-network-wired',       category: 'Back-end',     color: '#A855F7', desc: 'Data Contracts, JSON & Sanctum Auth' },
                { id: 17, name: 'Scrum / Kanban', icon_class: 'fas fa-tasks',               category: 'DevOps & QA',  color: '#F59E0B', desc: 'Agile Methodologies & Continuous Delivery' },
                { id: 18, name: 'Regressão QA',   icon_class: 'fas fa-bug',                 category: 'DevOps & QA',  color: '#EC4899', desc: 'Bug Prevention & Load Testing' },
            ]
        },
        projects: {
            tag: 'PORTFOLIO',
            title: 'Featured Projects',
            subtitle: 'Engineering solutions built to solve real business problems with architectural rigor and quantified impact.',
            btnRepo: 'Repository',
            btnDemo: 'Live Demo',
            btnDetails: 'Technical Details',
            privado: 'Private Enterprise Project',
            empty: 'No projects found.',
            modalVoltar: 'Back',
            modalFechar: 'Close',
            modalSobre: 'About the Project',
            modalDestaques: 'Engineering Highlights',
            modalArquitetura: 'Architecture & Data Flow Diagram',
            modalCaseStudy: 'Case Study — Challenge vs. Solution',
            modalChallengeTitle: 'Technical Challenge',
            modalSolutionTitle: 'Engineering Solution',
            modalDesafio: 'Technical Challenge',
            modalSolucao: 'Engineering Solution',
            filterAll: 'All',
            filterFullstack: 'Web / Fullstack',
            filterDesktop: 'Desktop / Delphi',
            filterBackend: 'Backend & APIs',
            filterOthers: 'Others',
            list: [
                {
                    id: 101,
                    title: 'PayStream Gateway',
                    description: 'High-performance fintech payment gateway with integer-cents split settlement, atomic P2002 idempotency in PostgreSQL, HMAC-SHA256 signed webhooks, and timing attack resistance.',
                    image_url: '/paystream_mockup.jpg',
                    repo_link: 'https://github.com/pedrhenriqueol/paystream-gateway',
                    demo_link: 'https://paystream-gateway.onrender.com',
                    tags: ['Fastify', 'TypeScript', 'Prisma', 'PostgreSQL', 'HMAC-SHA256', 'Fintech', 'React', 'Tailwind CSS'],
                    details: {
                        subtitle: 'Core Banking & Resilient Payment Gateway with Split Settlement and Atomic Idempotency',
                        fullDescription: 'Enterprise financial processing architecture engineered with Node.js, Fastify, and Prisma ORM over PostgreSQL. The gateway delivers atomic transaction processing for PIX and Credit Card with split settlement strictly computed in integer cents, guaranteeing zero accounting drift fee + sum(sellers) == gross_amount. Features composite unique key idempotency, cryptographically signed webhooks with timestamp binding, and constant-time signature verification via crypto.timingSafeEqual.',
                        metrics: [
                            { label: 'Idempotency', value: 'Zero Double-Spending (P2002)', icon: 'fas fa-fingerprint' },
                            { label: 'Accounting Precision', value: '100% Integer-Cent Split', icon: 'fas fa-coins' },
                            { label: 'Cryptography', value: 'HMAC-SHA256 + Timing-Safe', icon: 'fas fa-shield-alt' }
                        ],
                        architecture: [
                            { layer: 'Client / Checkout SPA', tech: 'React 18 + Tailwind CSS + Framer Motion', role: 'Interactive checkout interface with instant PIX QR Code rendering and card validation' },
                            { layer: 'Gateway API & Auth', tech: 'Fastify + Stateless JWT + Rate Limiting', role: 'Zod payload validation, IP/key throttling and strict PCI memory redaction' },
                            { layer: 'Transaction Engine', tech: 'Prisma ORM + PostgreSQL ACID', role: 'Idempotency guarantee via @@unique([merchantId, externalId]) and optimistic concurrency locking' },
                            { layer: 'Webhook Dispatcher', tech: 'HMAC-SHA256 + Exponential Backoff', role: 'Resilient asynchronous merchant notification dispatch with 3 retries and random jitter' }
                        ],
                        challenge: 'Eliminating race conditions in concurrent transactions that caused double-spending vulnerabilities, shielding webhook delivery against timing attacks, and eliminating floating-point rounding errors in marketplace splits.',
                        solution: 'Implementation of composite unique idempotency keys handling PostgreSQL P2002 conflicts with idempotent replay (HTTP 200), pure integer-cent financial math (Math.round), timestamp-bound HMAC signatures, and constant-time crypto.timingSafeEqual comparisons.',
                        highlights: [
                            'Proven atomic idempotency: race conditions eliminated via PostgreSQL uniqueness constraints with X-Idempotent-Replay: true',
                            'Mathematically exact accounting split: strict validation rejecting fractional discrepancies with HTTP 422 Unprocessable Entity',
                            'Cryptographic shielding: webhook signatures protected against timing attacks and replay attacks via timestamp binding',
                            'Asynchronous webhook dispatcher with automatic retries, 5-second timeout, and exponential backoff with jitter',
                            'Strict PCI-DSS hygiene: PAN and CVV never stored in database and redacted from memory and application logs'
                        ]
                    }
                },
                {
                    id: 102,
                    title: 'PortLog OS',
                    description: 'Port logistics and heavy crane (STS/RTG) maintenance OS with strict multi-tenant RBAC governance, finite state machine (FSM) Kanban, IoT predictive telemetry, and UTC-audited MTTR.',
                    image_url: '/portlog_mockup.jpg',
                    repo_link: 'https://github.com/pedrhenriqueol/portlog-os',
                    demo_link: 'https://portlog-os.vercel.app',
                    tags: ['React', 'TypeScript', 'Fastify', 'Prisma', 'PostgreSQL', 'Multi-tenant', 'RBAC', 'IoT Telemetry', 'FSM'],
                    details: {
                        subtitle: 'Port Logistics, Work Order Finite State Machine & Industrial Predictive Telemetry',
                        fullDescription: 'Mission-critical operations platform for container terminals and export processing zones (EPZ). Engineered with React 18, Fastify, and PostgreSQL with Prisma ORM, the application orchestrates preventive and corrective maintenance for Ship-to-Shore (STS) Cranes, Rubber-Tired Gantry (RTG) Cranes, and Reach Stackers. Governance is built upon uncompromised multi-tenant isolation by terminalId and role-based access control (RBAC) with a deterministic finite state machine, preventing illegal Kanban transitions and delivering fault-tolerant vibration and thermal IoT telemetry.',
                        metrics: [
                            { label: 'Isolation', value: 'Zero Data Leakage (Multi-tenant)', icon: 'fas fa-building' },
                            { label: 'FSM Reliability', value: '100% Validated Transitions', icon: 'fas fa-project-diagram' },
                            { label: 'IoT Telemetry', value: '< 200ms Continuous Stream', icon: 'fas fa-satellite-dish' }
                        ],
                        architecture: [
                            { layer: 'Frontend UI / Kanban', tech: 'React 18 + Framer Motion + Tailwind', role: 'Interactive drag-and-drop Kanban board with automatic optimistic rollback and live telemetry' },
                            { layer: 'Tenant Isolation & RBAC', tech: 'Fastify Hook + JWT + Tenant Guard', role: 'Compulsory terminalId injection in 100% of routes and role-based permissions validation' },
                            { layer: 'FSM Workflow Engine', tech: 'Domain State Machine Validator', role: 'Strict status transition matrix (TRIAGEM -> APROVADA -> EM_EXECUCAO -> CONCLUIDA) with checklist guard' },
                            { layer: 'IoT Ingestion & Metrics', tech: 'Zod Sensor Limits + UTC MTTR Math', role: 'Sanitization of physical sensor telemetry anomalies and precise UTC MTTR calculation in milliseconds' }
                        ],
                        challenge: 'Preventing confidential data leaks between competing port terminal operators sharing the same database infrastructure, and preventing corrupted states in heavy machinery maintenance work orders.',
                        solution: 'Enforcing terminalId injection at the middleware and query level, validating permissible status progressions via a finite state machine, and gating completion behind completed checklist items.',
                        highlights: [
                            'Absolute multi-tenant isolation: 100% of queries scoped by terminalId, completely eliminating cross-tenant leakage',
                            'Robust finite state machine: illegal work order status progressions blocked with HTTP 422 Unprocessable Entity',
                            'Granular RBAC governance: critical actions restricted to authorized operational supervisors and administrators',
                            'Append-only audit trail: immutable log recording user, client IP, and UTC timestamp for every status change',
                            'Sanitized IoT telemetry with physical threshold bounds in Zod for temperature, vibration, and hydraulic pressure'
                        ]
                    }
                },
                {
                    id: 103,
                    title: 'SPECTR TestOps',
                    description: 'Enterprise TestOps platform inspired by Postman ergonomics with suite and single request runners, recursive OpenAPI/JSON Schema contract validation, Chaos Engineering, and p50/p90/p95/p99 latency percentiles.',
                    image_url: '/spectr_mockup.jpg',
                    repo_link: 'https://github.com/pedrhenriqueol/spectr-testops',
                    demo_link: 'https://spectr-testops.vercel.app',
                    tags: ['React', 'TypeScript', 'Fastify', 'Tailwind CSS', 'Framer Motion', 'OpenAPI', 'Chaos Engineering', 'p95 SLA'],
                    details: {
                        subtitle: 'Enterprise TestOps Platform, Contract Validation & Chaos Engineering',
                        fullDescription: 'Enterprise quality engineering and API observability workstation inspired by Postman, Datadog, and K6 ergonomics. Engineered with React 18, Framer Motion, and a high-throughput Fastify backend in TypeScript, the platform supports regression test suite authoring, single request dispatch with real-time JSON syntax highlighting, deep recursive OpenAPI/JSON Schema contract validation, and Chaos Lab stress testing (artificial latency, 503 outages, flaky connections). Performance analytics employ the standardized NIST Nearest Rank method for unbiased p50, p90, p95, and p99 percentile calculation.',
                        metrics: [
                            { label: 'OpenAPI Compliance', value: '100% Recursive Validation', icon: 'fas fa-file-contract' },
                            { label: 'Latency Analytics', value: 'p50 / p90 / p95 / p99 Percentiles', icon: 'fas fa-chart-line' },
                            { label: 'Resilience', value: 'Chaos Lab + Zero Memory Leaks', icon: 'fas fa-biohazard' }
                        ],
                        architecture: [
                            { layer: 'Workstation UI', tech: 'React 18 + Postman Design Tokens + Framer Motion', role: 'Modern UI with calibrated Dark/Light theme, zero layout shift language dropdown, and syntax highlighter' },
                            { layer: 'Execution Engine', tech: 'Fastify + AbortController + Fetch Engine', role: 'Sequential and concurrent test runner with instant cancellation of in-flight requests' },
                            { layer: 'Assertion & Contract Validator', tech: 'Recursive Schema Validator', role: 'Strict OpenAPI contract validation supporting primitive types, nested objects, and typed arrays' },
                            { layer: 'Chaos & Telemetry Lab', tech: 'Socket Lifecycle Timers + Statistical Math', role: 'Stress injection with immediate timer release on socket close and Nearest Rank percentile calculation' }
                        ],
                        challenge: 'Ensuring complex JSON Schema validations eliminate false-positives in deeply nested payloads, and preventing Node.js event loop memory leaks caused by lingering timers during high-concurrency chaos simulations.',
                        solution: 'Engineering a deep recursive schema validation engine with strict typing, Nearest Rank percentile statistics, and socket close cleanup for simulation timers.',
                        highlights: [
                            'Postman-grade enterprise ergonomics: dynamic vector branding, calibrated #1C1C1C dark and light palettes with WCAG AA',
                            'Recursive OpenAPI contract validator: deep validation for nested objects, primitive types, and typed array items',
                            'Mathematical latency analytics: p50, p90, p95, and p99 tail percentiles calculated with statistical rigor',
                            'Integrated Chaos Engineering: delay injection with connection-close cleanup, 503 errors, and intermittent failures',
                            'Real structured SLA and compliance report exports in JSON and CSV formats'
                        ]
                    }
                },

                {
                    id: 1,
                    title: 'ERP Backoffice',
                    description: 'Full-stack development of a high-load administrative module for ERP/POS management. Decoupled architecture with Laravel RESTful API and React + TypeScript client SPA.',
                    image_url: '/erp_retaguarda_mockup.jpg',
                    repo_link: null,
                    demo_link: null,
                    tags: ['Laravel', 'React', 'TypeScript', 'Tailwind CSS', 'SQL Server', 'REST API'],
                    details: {
                        subtitle: 'Full-Stack Administrative Module — Enterprise ERP/POS',
                        fullDescription: 'Full-stack development of a corporate administrative module for ERP/POS management. The architecture was engineered completely decoupled, leveraging a robust Laravel RESTful API and a modern client-side application built with React and TypeScript. Primary focus was placed on zero latency under concurrent operator workloads and strict tax invoice compliance.',
                        metrics: [
                            { label: 'Latency', value: '2s → <500ms (Query Optimization)', icon: 'fas fa-bolt' },
                            { label: 'Concurrency', value: '100+ Concurrent Users', icon: 'fas fa-users' },
                            { label: 'Compliance', value: '100% ACBr Fiscal Compliance', icon: 'fas fa-shield-alt' }
                        ],
                        architecture: [
                            { layer: 'Client / Presentation', tech: 'React 18 + TypeScript + Tailwind', role: 'Decoupled SPA with reactive components, local caching, and optimistic UI updates' },
                            { layer: 'API Gateway & Auth', tech: 'Laravel Sanctum + Middleware', role: 'Stateless auth, session security, and payload validation gates' },
                            { layer: 'Business & Fiscal', tech: 'PHP 8 Services + ACBr Core', role: 'Billing business logic, fiscal generation, and real-time inventory management' },
                            { layer: 'Data Tier', tech: 'SQL Server / MySQL Pool', role: 'Optimized relational schema with covering indexes and zero N+1 queries' }
                        ],
                        challenge: 'Concurrency bottlenecks during peak fiscal emission hours and slow reporting across thousands of inventory SKUs in a legacy relational database.',
                        solution: 'Refactored to a decoupled architecture (Laravel REST API + React SPA), introduced compound indexing with eager loading, and async queue workers for fiscal compliance.',
                        highlights: [
                            'Decoupled architecture: RESTful API (Laravel) + SPA (React + TypeScript)',
                            'Responsive and accessible dark-themed interface built with Tailwind CSS',
                            'Real-time inventory management with instant feedback via reactive components',
                            'Accounts receivable control with advanced multi-parameter filtering and report exports',
                            'Deep integration with tax engines (ACBr) for electronic invoice issuance with offline contingency',
                            'Robust authentication and authorization via Laravel Sanctum with granular operator RBAC',
                        ],
                    },
                },
                {
                    id: 2,
                    title: 'Conglomerates Portal',
                    description: 'Multi-tenant platform for centralized governance of multiple business units. Implementation of hierarchical branch RBAC and real-time analytical dashboards.',
                    image_url: '/portal_conglomerados_mockup.jpg',
                    repo_link: null,
                    demo_link: null,
                    tags: ['Laravel', 'React', 'Multi-tenant', 'RBAC', 'SQL Server', 'Analytics'],
                    details: {
                        subtitle: 'Multi-tenant Enterprise Governance Platform',
                        fullDescription: 'Design and implementation of an enterprise governance platform with Multi-tenant architecture, allowing centralized operation of multiple business units and subsidiaries in a unified ecosystem. The executive dashboard consolidates dispersed financial and operational metrics with real-time supervision.',
                        metrics: [
                            { label: 'Architecture', value: 'Logical Multi-Tenant Isolation', icon: 'fas fa-sitemap' },
                            { label: 'Security', value: 'Granular Hierarchical RBAC', icon: 'fas fa-user-shield' },
                            { label: 'Analytics', value: 'Real-Time Consolidated Analytics', icon: 'fas fa-chart-line' }
                        ],
                        architecture: [
                            { layer: 'Client Portal', tech: 'React + TypeScript + Chart.js', role: 'Dynamic executive panels with interactive charts and real-time aggregation' },
                            { layer: 'Tenant Resolver', tech: 'Laravel Tenant Middleware', role: 'Automatic subsidiary context identification and isolation by subdomain/token' },
                            { layer: 'Security & RBAC', tech: 'Role-Based Access Control', role: 'Granular view and edit permission matrices across organizational hierarchies' },
                            { layer: 'Consolidated DB', tech: 'Multi-Tenant Database Engine', role: 'High-performance multi-branch aggregate queries with specialized indexing' }
                        ],
                        challenge: 'Guaranteeing strict data isolation across dozens of companies within the same group without duplicating infrastructure or degrading consolidated reporting performance.',
                        solution: 'Implementation of Multi-Tenant architecture with dynamic tenant context resolution, RBAC security gates, and cached aggregated queries for executive analytics.',
                        highlights: [
                            'Multi-tenant architecture with strict logical separation of data per company and subsidiary',
                            'Advanced RBAC (Role-Based Access Control): users only access authorized modules of their assigned units',
                            'Executive React dashboards for aggregating and visualizing high-volume operational data',
                            'RESTful API in Laravel with endpoints shielded by tenant-aware policies and gates',
                            'Optimized multi-branch cross-referencing queries operating below 300ms latency',
                            'Scalable architecture: instant onboarding of new corporate branches without code alterations',
                        ],
                    },
                },
                {
                    id: 3,
                    title: 'Delphi → UniGui Web Migration',
                    description: 'Legacy monolithic system modernization (Delphi Desktop/VCL) to native Web architecture using Delphi 11 + UniGui, maintaining 100% fiscal compliance.',
                    image_url: '/unigui_migration_mockup.jpg',
                    repo_link: null,
                    demo_link: null,
                    tags: ['Delphi 11', 'UniGui', 'ACBr', 'FireDAC', 'FortesReport', 'SQL Server'],
                    details: {
                        subtitle: 'Legacy Monolithic Desktop-to-Web Modernization',
                        fullDescription: 'Deep architectural refactoring and migration of a legacy commercial system (Delphi 6 Desktop/VCL) to a modern Web architecture powered by RAD Studio Delphi 11 and the UniGui framework. Re-engineered state management and concurrency models for seamless browser execution.',
                        metrics: [
                            { label: 'Modernization', value: 'Desktop ➔ 100% Native Web', icon: 'fas fa-cloud' },
                            { label: 'Integrity', value: 'Zero Fiscal Logic Regression (ACBr)', icon: 'fas fa-check-circle' },
                            { label: 'Performance', value: 'Optimized Server-Side Concurrency', icon: 'fas fa-tachometer-alt' }
                        ],
                        architecture: [
                            { layer: 'Web Client', tech: 'UniGui Web / ExtJS Engine', role: 'Rich responsive browser interface without requiring local client installations' },
                            { layer: 'Server Engine', tech: 'Delphi 11 RAD ServerModule', role: 'Instance lifecycle management, thread pooling, and isolated user sessions' },
                            { layer: 'Fiscal & Reports', tech: 'ACBr Web + FortesReport Server', role: 'Server-side asynchronous PDF generation and continuous invoice issuance' },
                            { layer: 'Data Engine', tech: 'FireDAC + SQL Server', role: 'Resilient FireDAC connection pooling with strict ACID transaction guarantees' }
                        ],
                        challenge: 'Migrating a 15+ year old monolithic Desktop VCL system with legacy third-party libraries (JEDI/JVCL) to Web without breaking fiscal business rules.',
                        solution: 'Restructuring screen lifecycles for UniGui MainModule/ServerModule, upgrading ACBr for server-side execution, and architecting FireDAC connection pooling for concurrent browser operators.',
                        highlights: [
                            'Complete conversion from VCL (Desktop) to UniGui Web keeping business logic intact',
                            'Upgrade of critical tax components (ACBr Project) for NF-e/NFC-e issuance in the new web environment',
                            'Migration and adaptation of report generators (FortesReport) for server-side execution',
                            'Concurrency and session isolation managed via ServerModule and MainModule',
                            'Resolution of legacy library conflicts (JEDI — JCL/JVCL) and restructuring of Library Path',
                            'Result: clean compilation, production stability, and elimination of 40% of legacy visual bugs',
                        ],
                    },
                },
                {
                    id: 4,
                    title: 'Inventory Control — Java + MySQL',
                    description: 'Desktop system with Swing interface for complete inventory control with user registration and MySQL integration.',
                    image_url: '/java_inventory_mockup.png',
                    repo_link: 'https://github.com/pedrhenriqueol/Projetos-Java',
                    demo_link: null,
                    tags: ['Java', 'MySQL', 'Swing'],
                },
                {
                    id: 5,
                    title: 'Task API — Python + Flask',
                    description: 'RESTful API with GET, POST, PUT, and DELETE routes made with Python and Flask. Features an integrated frontend with HTML, CSS, and JavaScript.',
                    image_url: '/flask_api_mockup.png',
                    repo_link: 'https://github.com/pedrhenriqueol/API-Python',
                    demo_link: null,
                    tags: ['Python', 'Flask', 'REST API'],
                },
                {
                    id: 6,
                    title: 'Password Generator — Python',
                    description: 'Python desktop application with Tkinter interface. Uses random, string, and pyperclip libraries for practical password generation and copying.',
                    image_url: '/password_gen_mockup.png',
                    repo_link: 'https://github.com/pedrhenriqueol/Gerador-senhas',
                    demo_link: null,
                    tags: ['Python', 'Tkinter'],
                },
            ]
        },
        contact: {
            tag: 'Get in touch',
            title1: 'Let\'s ',
            title2: 'Talk?',
            subtitle: 'I am open to new opportunities, collaborations, or just a good chat about technology.',
            directMessage: 'Prefer to get straight to the point? Find me through any of the channels below. I usually reply in less than 24h.',
            formName: 'Name',
            formEmail: 'E-mail',
            formSubject: 'Subject',
            formSubjectPlaceholder: 'Opportunity, collaboration, freelance...',
            formMessage: 'Message',
            formMessagePlaceholder: 'Write your message here...',
            labelName: 'Name',
            labelEmail: 'E-mail',
            labelSubject: 'Subject',
            labelMessage: 'Message',
            successMsg: 'Message sent! I will contact you shortly.',
            errorMsg: 'Error sending. Try via LinkedIn or email directly.',
            errorConn: 'Connection error. Check your internet and try again.',
            btnSending: 'Sending...',
            btnSend: 'Send Message',
            sending: 'Sending...',
            submitBtn: 'Send Message',
            rights: 'Pedro Henrique. All rights reserved.'
        },
        palette: {
            title: 'Color Palette',
            mocha: 'Coffee / Mocha',
            claude: 'Claude Editorial',
            greige: 'Greige Minimal',
            forest: 'Moss Green',
            slate: 'Midnight Slate',
            emerald: 'Obsidian Emerald'
        }
    },
    es: {
        nav: {
            home: 'Inicio',
            sobre: 'Sobre Mí',
            experiencia: 'Experiencia',
            conhecimentos: 'Habilidades',
            projetos: 'Proyectos',
            contato: 'Contacto'
        },
        hero: {
            ola: 'Hola, soy',
            developer: 'Ingeniero de Software',
            role: 'Fullstack',
            description: 'Especialista en modernización de sistemas heredados, arquitectura de alta disponibilidad e ingeniería orientada a calidad usando',
            verProjetos: 'Ver Proyectos',
            downloadCV: 'Descargar CV',
            terminal: {
                role: 'Fullstack Software Engineer',
                available: 'available: true, ✓'
            }
        },
        about: {
            tag: 'BIOGRAFÍA',
            title: 'Sobre Mí',
            subtitle: 'Ingeniería de software enfocada en modernización de sistemas, alta disponibilidad, código testeable e impacto real.',
            resumoTitle: 'Resumen Profesional',
            resumo1: 'Ingeniero de Software Fullstack con sólida base práctica y',
            resumo1_highlight1: '10+ meses',
            resumo1_rest: 'de experiencia directa en sistemas POS/ERP y plataformas corporativas de alta carga, operando en producción con más de',
            resumo1_highlight2: '100 usuarios diarios.',
            resumo2: 'Especializado en',
            resumo2_rest: 'Tengo experiencia práctica con optimizaciones críticas de bases de datos, reduciendo el tiempo de respuesta de consultas de',
            resumo2_highlight: '2 s → < 500 ms',
            resumo2_final: 'vía indexación eficiente y eliminación de cuellos de botella N+1.',
            resumo3: 'He integrado componentes fiscales (ACBr) y generadores de reportes (FortesReport) en ambientes de alta criticidad, asegurando cumplimiento legal en el',
            resumo3_highlight: '100%',
            resumo3_final: 'de las transacciones procesadas.',
            resumo4: 'Actualmente también me desempeño en',
            resumo4_highlight1: 'Aseguramiento de Calidad (QA) & Pruebas',
            resumo4_rest: 'en SETE Tecnología en sistemas de misión crítica (logística portuaria / ZPEs), blindando despliegues con',
            resumo4_highlight2: 'Postman, SQL Server y metodologías ágiles.',
            highlights: [
                '10+ meses experiencia',
                '100+ usuarios diarios',
                'QA en sistemas de misión crítica',
                'Consultas 4× más rápidas'
            ],
            educacaoTitle: 'Educación',
            edu1Title: 'Licenciatura en Ingeniería de Software',
            edu1Desc: 'UNIFANOR WYDEN • Abr 2026 → Dic 2030',
            edu2Title: 'Técnico en Informática',
            edu2Desc: 'EEEP LUIZA DE TEODORO VIEIRA • Ene 2023 → Dic 2025',
            cards: [
                {
                    icon: 'fas fa-code',
                    title: 'Front-end',
                    items: ['React + TypeScript', 'Tailwind CSS', 'Framer Motion', 'HTML5 / CSS3'],
                },
                {
                    icon: 'fas fa-server',
                    title: 'Back-end',
                    items: ['PHP / Laravel', 'Node.js', 'Delphi (Desktop + UniGui)', 'APIs REST'],
                },
                {
                    icon: 'fas fa-database',
                    title: 'Base de Datos',
                    items: ['MySQL', 'SQL Server (cloud)', 'PostgreSQL', 'Optimización de consultas'],
                },
                {
                    icon: 'fas fa-tools',
                    title: 'DevOps & Herramientas',
                    items: ['Git / GitHub', 'Docker', 'Railway / Render', 'Linux CLI'],
                },
                {
                    icon: 'fas fa-shield-alt',
                    title: 'QA & Pruebas',
                    items: ['Postman (APIs REST)', 'SQL Server (consultas)', 'Pruebas de regresión', 'Scrum / Kanban'],
                }
            ]
        },
        experience: {
            tag: 'TRAYECTORIA',
            title: 'Experiencia Profesional',
            subtitle: 'Mi trayectoria en el desarrollo de software y el mercado tecnológico.',
            empty: 'Aún no hay experiencia registrada.',
            list: [
                {
                    id: 2,
                    company: 'SETE Tecnologia',
                    role: 'Analista de Aseguramiento de Calidad (QA) y Pruebas — Pasantía',
                    period: 'Junio 2026 - Presente',
                    techBadges: ['QA', 'Pruebas de Regresión', 'Postman', 'APIs RESTful', 'SQL Server', 'Scrum / Kanban', 'Ing. Requisitos', 'Sistemas de Misión Crítica'],
                    groups: [
                        {
                            title: 'Aseguramiento de Calidad & Ing. Requisitos',
                            icon: 'fas fa-shield-alt',
                            items: [
                                'QA e ingeniería de requisitos para sistemas de misión crítica en el sector logístico y portuario (ZPEs).',
                                'Conducción de alineaciones directas con múltiples sectores de la empresa para mapear el 100% de requisitos de software y reglas de negocio operacionales.',
                                'Planeación, modelado de escenarios y ejecución de pruebas funcionales bajo metodologías ágiles (Scrum / Kanban), blindando entregas contra regresiones.',
                            ],
                        },
                        {
                            title: 'Validación de APIs & Bases de Datos',
                            icon: 'fas fa-database',
                            items: [
                                'Pruebas de consumo e integración de servicios vía APIs RESTful usando Postman, estructurando colecciones para asegurar la confiabilidad del tráfico de datos.',
                                'Ejecución de consultas de diagnóstico, validación de transacciones y pruebas estructuradas directamente en bases de datos Microsoft SQL Server en el sistema ePita.',
                            ],
                        },
                    ],
                },
                {
                    id: 1,
                    company: 'Qualisoft Sistemas',
                    role: 'Desarrollador Back-End (PHP / Delphi / SQL) — Pasantía',
                    period: 'Agosto 2025 - Junio 2026',
                    techBadges: ['PHP / Laravel', 'Delphi 11', 'UniGui', 'MySQL', 'SQL Server', 'ACBr', 'RESTful APIs', 'FortesReport'],
                    groups: [
                        {
                            title: 'Optimización de Bases de Datos & Rendimiento',
                            icon: 'fas fa-tachometer-alt',
                            items: [
                                'Refactorización profunda de consultas SQL Server/MySQL en producción, reduciendo tiempo de respuesta de 2s a <500ms mediante índices compuestos y eliminación de consultas N+1.',
                                'Construcción de procedimientos almacenados y vistas analíticas para consolidación de datos en ERP corporativo con cientos de operaciones diarias.',
                            ],
                        },
                        {
                            title: 'Desarrollo Back-End & Módulos Web',
                            icon: 'fas fa-server',
                            items: [
                                'Desarrollo de APIs RESTful robustas en PHP/Laravel con autenticación Sanctum, paginación optimizada y arquitectura de servicios.',
                                'Creación de interfaces reactivas en React + TypeScript para módulo administrativo de gestión y control de cuentas.',
                            ],
                        },
                        {
                            title: 'Modernización de Heredados & Motores Fiscales',
                            icon: 'fas fa-sync-alt',
                            items: [
                                'Participación en la ingeniería de migración de sistema comercial monolítico (Delphi Desktop/VCL) a arquitectura Web moderna con Delphi 11 + UniGui.',
                                'Integración de bibliotecas fiscales (ACBr) para facturación electrónica (NF-e/NFC-e) y mantenimiento de generadores de reportes con FortesReport.',
                            ],
                        },
                    ],
                }
            ]
        },
        skills: {
            tag: 'HABILIDADES Y TECNOLOGÍAS',
            title: 'Stack & Habilidades',
            subtitle: 'Tecnologías, herramientas y metodologías que domino y utilizo en producción.',
            levels: {
                5: 'Experto',
                4: 'Avanzado',
                3: 'Intermedio',
                2: 'Básico'
            },
            list: [
                { id: 1,  name: 'Delphi 11',      icon_class: 'fas fa-desktop',             category: 'Back-end',     color: '#EE1F35', desc: 'VCL / UniGui, Sistemas ERP & POS' },
                { id: 2,  name: 'UniGui Web',     icon_class: 'fas fa-globe',               category: 'Back-end',     color: '#0084FF', desc: 'Aplicaciones Web en tiempo real con Delphi' },
                { id: 3,  name: 'React 19',       icon_class: 'fab fa-react',               category: 'Front-end',    color: '#61DAFB', desc: 'SPAs, Componentes reactivos & Hooks' },
                { id: 4,  name: 'TypeScript',     icon_class: 'fab fa-js-square',           category: 'Front-end',    color: '#3178C6', desc: 'Tipado estricto & Código escalable' },
                { id: 5,  name: 'PHP / Laravel',  icon_class: 'fab fa-laravel',             category: 'Back-end',     color: '#FF2D20', desc: 'APIs RESTful, Eloquent & Arquitectura MVC' },
                { id: 6,  name: 'SQL Server',     icon_class: 'fas fa-database',            category: 'Database',     color: '#CC292B', desc: 'Tuning de consultas, Índices & Stored Procedures' },
                { id: 7,  name: 'MySQL',          icon_class: 'fas fa-server',              category: 'Database',     color: '#4479A1', desc: 'Modelado relacional & Optimización' },
                { id: 8,  name: 'QA & Postman',   icon_class: 'fas fa-paper-plane',         category: 'DevOps & QA',  color: '#FF6C37', desc: 'Pruebas de integración & Validación de endpoints' },
                { id: 9,  name: 'Docker',         icon_class: 'fab fa-docker',              category: 'DevOps & QA',  color: '#2496ED', desc: 'Contenedores & Entornos estandarizados' },
                { id: 10, name: 'Java / Swing',   icon_class: 'fab fa-java',                category: 'Back-end',     color: '#007396', desc: 'Estructuras de datos & POO' },
                { id: 11, name: 'Python / Flask', icon_class: 'fab fa-python',              category: 'Back-end',     color: '#3776AB', desc: 'Automatizaciones, Scripts & Micro-APIs' },
                { id: 12, name: 'Tailwind CSS',   icon_class: 'fab fa-css3-alt',            category: 'Front-end',    color: '#06B6D4', desc: 'Design systems, Layouts fluidos & Responsividad' },
                { id: 13, name: 'ACBr Fiscal',    icon_class: 'fas fa-file-invoice-dollar', category: 'Back-end',     color: '#10B981', desc: 'Emisión NF-e, NFC-e & Legislación Fiscal' },
                { id: 14, name: 'Git & GitHub',   icon_class: 'fab fa-github',              category: 'DevOps & QA',  color: '#F05032', desc: 'CI/CD, Versionamiento & Workflows' },
                { id: 15, name: 'Linux Server',   icon_class: 'fab fa-linux',               category: 'DevOps & QA',  color: '#FCC624', desc: 'Despliegue, Configuración Nginx & Shell Script' },
                { id: 16, name: 'APIs RESTful',   icon_class: 'fas fa-network-wired',       category: 'Back-end',     color: '#A855F7', desc: 'Contratos de datos, JSON & Autenticación Sanctum' },
                { id: 17, name: 'Scrum / Kanban', icon_class: 'fas fa-tasks',               category: 'DevOps & QA',  color: '#F59E0B', desc: 'Metodologías ágiles & Entregas continuas' },
                { id: 18, name: 'Regressão QA',   icon_class: 'fas fa-bug',                 category: 'DevOps & QA',  color: '#EC4899', desc: 'Prevención de errores & Pruebas de carga' },
            ]
        },
        projects: {
            tag: 'PORTAFOLIO',
            title: 'Proyectos Destacados',
            subtitle: 'Soluciones de ingeniería desarrolladas para resolver problemas reales con rigor arquitectónico e impacto medible.',
            btnRepo: 'Ver Repositorio',
            btnDemo: 'Ver Demo',
            btnDetails: 'Detalles Técnicos',
            privado: 'Proyecto Corporativo Privado',
            empty: 'No se encontraron proyectos.',
            modalVoltar: 'Volver',
            modalFechar: 'Cerrar',
            modalSobre: 'Sobre el Proyecto',
            modalDestaques: 'Aspectos de Ingeniería',
            modalArquitetura: 'Flujo & Diagrama de Arquitectura',
            modalCaseStudy: 'Estudio de Caso — Desafío vs. Solución',
            modalChallengeTitle: 'Desafío Técnico',
            modalSolutionTitle: 'Solución de Ingeniería',
            modalDesafio: 'Desafío Técnico',
            modalSolucao: 'Solución de Ingeniería',
            filterAll: 'Todos',
            filterFullstack: 'Web / Fullstack',
            filterDesktop: 'Desktop / Delphi',
            filterBackend: 'Backend & APIs',
            filterOthers: 'Otros',
            list: [
                {
                    id: 101,
                    title: 'PayStream Gateway',
                    description: 'Pasarela de pagos fintech de alto rendimiento con liquidación de split en centavos enteros, idempotencia atómica P2002 en PostgreSQL, webhooks firmados con HMAC-SHA256 y protección contra timing attacks.',
                    image_url: '/paystream_mockup.jpg',
                    repo_link: 'https://github.com/pedrhenriqueol/paystream-gateway',
                    demo_link: 'https://paystream-gateway.onrender.com',
                    tags: ['Fastify', 'TypeScript', 'Prisma', 'PostgreSQL', 'HMAC-SHA256', 'Fintech', 'React', 'Tailwind CSS'],
                    details: {
                        subtitle: 'Core Banking y Pasarela de Pagos Resiliente con Liquidación Split e Idempotencia Atómica',
                        fullDescription: 'Arquitectura corporativa de procesamiento financiero desarrollada con Node.js, Fastify y Prisma ORM sobre PostgreSQL. La pasarela implementa procesamiento atómico de transacciones PIX y Tarjeta de Crédito con liquidación split calculada estrictamente en centavos enteros, garantizando la conservación contable absoluta tasa + suma(sellers) == valor_bruto. Cuenta con idempotencia por clave compuesta única, webhooks firmados criptográficamente con timestamp binding y verificación en tiempo constante con crypto.timingSafeEqual.',
                        metrics: [
                            { label: 'Idempotencia', value: 'Cero Double-Spending (P2002)', icon: 'fas fa-fingerprint' },
                            { label: 'Precisión Contable', value: '100% Split en Centavos', icon: 'fas fa-coins' },
                            { label: 'Criptografía', value: 'HMAC-SHA256 + Timing-Safe', icon: 'fas fa-shield-alt' }
                        ],
                        architecture: [
                            { layer: 'Client / Checkout SPA', tech: 'React 18 + Tailwind CSS + Framer Motion', role: 'Interfaz interactiva de checkout con generación instantánea de PIX QR Code y validación de tarjeta' },
                            { layer: 'Gateway API & Auth', tech: 'Fastify + JWT Stateless + Rate Limiting', role: 'Validación Zod de payloads, control de solicitudes por IP/clave y sanitización estricta de datos PCI' },
                            { layer: 'Transaction Engine', tech: 'Prisma ORM + PostgreSQL ACID', role: 'Garantía de idempotencia vía @@unique([merchantId, externalId]) y bloqueo optimista en concurrencia' },
                            { layer: 'Webhook Dispatcher', tech: 'HMAC-SHA256 + Exponential Backoff', role: 'Envío asíncrono resiliente de notificaciones para comercios con 3 reintentos y jitter aleatorio' }
                        ],
                        challenge: 'Eliminar condiciones de carrera en transacciones simultáneas que provocaban vulnerabilidades de double-spending, proteger los webhooks contra timing attacks y erradicar errores de redondeo de punto flotante en splits de marketplace.',
                        solution: 'Implementación de clave compuesta única de idempotencia manejando conflictos P2002 con respuesta idempotente (HTTP 200), aritmética financiera en centavos enteros (Math.round), firmas HMAC vinculadas a timestamp y crypto.timingSafeEqual en tiempo constante.',
                        highlights: [
                            'Idempotencia atómica comprobada: condiciones de carrera resueltas vía restricción de unicidad en PostgreSQL con X-Idempotent-Replay: true',
                            'Split contable matemáticamente exacto: validación estricta que rechaza divergencias con HTTP 422 Unprocessable Entity',
                            'Blindaje criptográfico: firmas de webhook protegidas contra timing attacks y replay attacks vía timestamp binding',
                            'Dispatcher de webhooks asíncrono con reintentos automáticos, timeout de 5 segundos y backoff exponencial con jitter',
                            'Higiene estricta PCI-DSS: número de tarjeta y CVV nunca almacenados en base de datos y redactados en memoria y logs'
                        ]
                    }
                },
                {
                    id: 102,
                    title: 'PortLog OS',
                    description: 'Sistema operativo de logística portuaria y mantenimiento de grúas pesadas (STS/RTG) con gobernanza RBAC multi-tenant estricta, máquina de estados finita (FSM) en Kanban, telemetría predictiva IoT y MTTR en UTC.',
                    image_url: '/portlog_mockup.jpg',
                    repo_link: 'https://github.com/pedrhenriqueol/portlog-os',
                    demo_link: 'https://portlog-os.vercel.app',
                    tags: ['React', 'TypeScript', 'Fastify', 'Prisma', 'PostgreSQL', 'Multi-tenant', 'RBAC', 'IoT Telemetry', 'FSM'],
                    details: {
                        subtitle: 'Logística Portuaria, FSM de Órdenes de Trabajo y Telemetría Predictiva Industrial',
                        fullDescription: 'Plataforma de misión crítica para la gestión operativa en terminales de contenedores y zonas francas (ZPE). Desarrollada con React 18, Fastify y PostgreSQL con Prisma ORM, la aplicación orquesta el mantenimiento preventivo y correctivo de grúas pórtico para buques (STS), grúas pórtico sobre neumáticos (RTG) y Reach Stackers. La gobernanza se fundamenta en un aislamiento multi-tenant estricto por terminalId y control de acceso basado en roles (RBAC) con máquina de estados finita determinista.',
                        metrics: [
                            { label: 'Aislamiento', value: 'Cero Fugas de Datos (Multi-tenant)', icon: 'fas fa-building' },
                            { label: 'Fiabilidad FSM', value: '100% Transiciones Validadas', icon: 'fas fa-project-diagram' },
                            { label: 'Telemetría IoT', value: '< 200ms Streaming Continuo', icon: 'fas fa-satellite-dish' }
                        ],
                        architecture: [
                            { layer: 'Frontend UI / Kanban', tech: 'React 18 + Framer Motion + Tailwind', role: 'Tablero Kanban interactivo con drag-and-drop, rollback optimista automático y telemetría en vivo' },
                            { layer: 'Tenant Isolation & RBAC', tech: 'Fastify Hook + JWT + Tenant Guard', role: 'Inyección obligatoria de terminalId en 100% de rutas y validación de permisos por rol' },
                            { layer: 'FSM Workflow Engine', tech: 'Domain State Machine Validator', role: 'Matriz estricta de transiciones (TRIAGEM -> APROVADA -> EM_EXECUCAO -> CONCLUIDA) con validación de checklist' },
                            { layer: 'IoT Ingestion & Metrics', tech: 'Zod Sensor Limits + UTC MTTR Math', role: 'Sanitización contra anomalías físicas en sensores y cálculo determinista de MTTR en milisegundos UTC' }
                        ],
                        challenge: 'Prevenir fugas de información confidencial entre operadores portuarios competidores que comparten la misma base de datos, y evitar estados corruptos en órdenes de trabajo de maquinaria pesada.',
                        solution: 'Inyección forzada del terminalId a nivel de middleware y consulta, validación estricta de progresiones de estado mediante una máquina de estados finita y bloqueo de cierre ante checklists incompletos.',
                        highlights: [
                            'Aislamiento multi-tenant absoluto: 100% de consultas acotadas por terminalId, eliminando fugas entre operadores',
                            'Máquina de estados finita robusta: transiciones ilegales en el ciclo de mantenimiento bloqueadas con HTTP 422',
                            'Gobernanza RBAC granular: acciones críticas restringidas a supervisores y administradores maestros autorizados',
                            'Registro de auditoría append-only: historial inmutable con usuario, IP y timestamp UTC para cada cambio de estado',
                            'Telemetría IoT sanitizada con umbrales físicos Zod para temperatura, vibración y presión hidráulica'
                        ]
                    }
                },
                {
                    id: 103,
                    title: 'SPECTR TestOps',
                    description: 'Plataforma corporativa de TestOps inspirada en la ergonomía de Postman con runner de colecciones e requisições isoladas, validação recursiva de contratos OpenAPI/JSON Schema, Chaos Engineering e percentis estatísticos p50/p90/p95/p99.',
                    image_url: '/spectr_mockup.jpg',
                    repo_link: 'https://github.com/pedrhenriqueol/spectr-testops',
                    demo_link: 'https://spectr-testops.vercel.app',
                    tags: ['React', 'TypeScript', 'Fastify', 'Tailwind CSS', 'Framer Motion', 'OpenAPI', 'Chaos Engineering', 'p95 SLA'],
                    details: {
                        subtitle: 'Plataforma Corporativa de TestOps, Validación de Contratos y Chaos Engineering',
                        fullDescription: 'Estación de ingeniería de calidad y observabilidad de APIs inspirada en la ergonomía de Postman, Datadog y K6. Desarrollada con React 18, Framer Motion y Fastify en TypeScript, la plataforma permite crear suites de pruebas de regresión, disparar peticiones individuales con visor JSON y syntax highlighting, validar contratos OpenAPI/JSON Schema recursivos y ejecutar pruebas de resiliencia en Chaos Lab. Los percentiles p50, p90, p95 y p99 se calculan mediante el método estandarizado Nearest Rank del NIST.',
                        metrics: [
                            { label: 'Conformidad OpenAPI', value: '100% Validación Recursiva', icon: 'fas fa-file-contract' },
                            { label: 'Métricas de Latencia', value: 'Percentiles p50 / p90 / p95 / p99', icon: 'fas fa-chart-line' },
                            { label: 'Resiliencia', value: 'Chaos Lab + Cero Memory Leaks', icon: 'fas fa-biohazard' }
                        ],
                        architecture: [
                            { layer: 'Workstation UI', tech: 'React 18 + Postman Design Tokens + Framer Motion', role: 'Interfaz moderna con tema Claro/Oscuro calibrado, dropdown de idioma sin layout shift y visor JSON' },
                            { layer: 'Execution Engine', tech: 'Fastify + AbortController + Fetch Engine', role: 'Motor de ejecución secuencial y concurrente con cancelación asíncrona inmediata de peticiones en vuelo' },
                            { layer: 'Assertion & Contract Validator', tech: 'Recursive Schema Validator', role: 'Validación estricta de contratos OpenAPI con soporte a tipos primitivos, objetos anidados y arrays' },
                            { layer: 'Chaos & Telemetry Lab', tech: 'Socket Lifecycle Timers + Statistical Math', role: 'Inyección de estrés con liberación de temporizadores en cierre de socket y cálculo estadístico Nearest Rank' }
                        ],
                        challenge: 'Garantizar que las validaciones de esquemas JSON no produzcan falsos positivos en estructuras anidadas, y prevenir fugas de memoria en Node.js por temporizadores pendientes en simulaciones de caos.',
                        solution: 'Desarrollo de un motor de validación recursivo con tipado estricto, cálculo de percentiles por Nearest Rank y liberación de temporizadores al cierre de conexión.',
                        highlights: [
                            'Ergonomía empresarial estilo Postman: logotipo vectorial dinámico, paleta oscura (#1C1C1C) y clara con WCAG AA',
                            'Validador recursivo de contratos OpenAPI: inspección profunda de objetos anidados, tipos primitivos y arrays',
                            'Analítica matemática de latencia: percentiles de cola p50, p90, p95 y p99 calculados con rigor estadístico',
                            'Chaos Engineering integrado: inyección de retardo con descarte de temporizadores, errores 503 y fallos intermitentes',
                            'Exportación real de informes de SLA y auditoría en formatos estructurados JSON y CSV'
                        ]
                    }
                },

                {
                    id: 1,
                    title: 'Backoffice ERP',
                    description: 'Desarrollo full-stack de módulo administrativo de alta carga para gestión de ERP/POS. Arquitectura desacoplada con API RESTful en Laravel y SPA cliente en React + TypeScript.',
                    image_url: '/erp_retaguarda_mockup.jpg',
                    repo_link: null,
                    demo_link: null,
                    tags: ['Laravel', 'React', 'TypeScript', 'Tailwind CSS', 'SQL Server', 'API REST'],
                    details: {
                        subtitle: 'Módulo Administrativo Full-Stack — Gestión ERP/POS',
                        fullDescription: 'Desarrollo full-stack de módulo administrativo corporativo para gestión de ERP/POS. La arquitectura fue concebida totalmente desacoplada, utilizando una API RESTful en Laravel y una aplicación cliente construida con React y TypeScript. El enfoque central estuvo en el rendimiento bajo alta concurrencia de operadores y estricto cumplimiento fiscal.',
                        metrics: [
                            { label: 'Latencia', value: '2s → <500ms (Optimización de Consultas)', icon: 'fas fa-bolt' },
                            { label: 'Concurrencia', value: '100+ Usuarios Simultáneos', icon: 'fas fa-users' },
                            { label: 'Cumplimiento', value: '100% Fiscal ACBr', icon: 'fas fa-shield-alt' }
                        ],
                        architecture: [
                            { layer: 'Client / Presentation', tech: 'React 18 + TypeScript + Tailwind', role: 'SPA desacoplada con componentes reactivos, caché local y feedback optimista' },
                            { layer: 'API Gateway & Auth', tech: 'Laravel Sanctum + Middleware', role: 'Autenticación stateless, control de sesión seguro y validación estricta de payloads' },
                            { layer: 'Business & Fiscal', tech: 'PHP 8 Services + ACBr Core', role: 'Procesamiento de reglas de facturación, emisión fiscal e inventario en tiempo real' },
                            { layer: 'Data Tier', tech: 'SQL Server / MySQL Pool', role: 'Modelado relacional optimizado con índices de cobertura y cero consultas N+1' }
                        ],
                        challenge: 'Cuellos de botella por concurrencia en horarios pico durante emisión fiscal y lentitud en reportes con miles de SKUs en base de datos relacional.',
                        solution: 'Refactorización a arquitectura desacoplada (Laravel REST API + React SPA), aplicación de Eager Loading con índices compuestos y procesamiento asíncrono via ACBr.',
                        highlights: [
                            'Arquitectura desacoplada: API RESTful (Laravel) + SPA (React + TypeScript)',
                            'Interfaz 100% responsiva y accesible con tema oscuro calibrado en Tailwind CSS',
                            'Gestión de inventario en tiempo real con retroalimentación inmediata vía hooks reactivos',
                            'Control de cuentas por cobrar con filtros avanzados y exportación de reportes analíticos',
                            'Integración profunda con componentes fiscales (ACBr) para emisión de facturas electrónicas',
                            'Autenticação y autorización robusta vía Laravel Sanctum con RBAC por rol de operador',
                        ],
                    },
                },
                {
                    id: 2,
                    title: 'Portal Conglomerados',
                    description: 'Plataforma Multi-tenant para gestión centralizada de múltiples unidades de negocio. Implementación de RBAC jerárquico por sucursal y dashboards analíticos en tiempo real.',
                    image_url: '/portal_conglomerados_mockup.jpg',
                    repo_link: null,
                    demo_link: null,
                    tags: ['Laravel', 'React', 'Multi-tenant', 'RBAC', 'SQL Server', 'Analytics'],
                    details: {
                        subtitle: 'Plataforma Multi-tenant de Gestión Empresarial',
                        fullDescription: 'Diseño e implementación de una plataforma de gobernanza empresarial con arquitectura Multi-tenant, permitiendo operar múltiples unidades de negocio y filiales en un solo ecosistema. El panel ejecutivo consolida datos financieros y operativos dispersos con supervisión en tiempo real.',
                        metrics: [
                            { label: 'Arquitectura', value: 'Multi-Tenant con Aislamiento Lógico', icon: 'fas fa-sitemap' },
                            { label: 'Seguridad', value: 'RBAC Granular por Rol y Sucursal', icon: 'fas fa-user-shield' },
                            { label: 'Analytics', value: 'Dashboards Consolidados en Tiempo Real', icon: 'fas fa-chart-line' }
                        ],
                        architecture: [
                            { layer: 'Client Portal', tech: 'React + TypeScript + Chart.js', role: 'Paneles ejecutivos dinámicos con gráficos interactivos y agregación visual' },
                            { layer: 'Tenant Resolver', tech: 'Laravel Tenant Middleware', role: 'Identificación y aislamiento automático del contexto de la filial por subdominio/token' },
                            { layer: 'Security & RBAC', tech: 'Role-Based Access Control', role: 'Permisos granulares de visualización y edición por jerarquía organizacional' },
                            { layer: 'Consolidated DB', tech: 'Multi-Tenant Database Engine', role: 'Consultas agregadas multi-sucursal con índices especializados y baja latencia' }
                        ],
                        challenge: 'Garantizar aislamiento estricto de datos entre decenas de empresas del mismo grupo sin duplicar infraestructura y sin degradar el rendimiento en reportes consolidados.',
                        solution: 'Implementación de arquitectura Multi-Tenant con resolución dinámica de contexto por tenant, seguridad vía RBAC y consultas agregadas con caché inteligente de métricas ejecutivas.',
                        highlights: [
                            'Arquitectura Multi-tenant: separación lógica estricta de datos por empresa y sucursal',
                            'RBAC (Control de Acceso Basado en Roles) avanzado para acceso restringido a módulos autorizados',
                            'Dashboards ejecutivos en React para visualización y agregación de grandes volúmenes de datos',
                            'API RESTful en Laravel con endpoints protegidos por políticas y compuertas por tenant',
                            'Consultas optimizadas para cruce de datos multi-sucursal con latencia inferior a 300ms',
                            'Diseño escalable: incorporación instantánea de nuevas sucursales sin cambios en el código base',
                        ],
                    },
                },
                {
                    id: 3,
                    title: 'Migración Delphi → UniGui Web',
                    description: 'Ingeniería de modernización de sistema monolítico heredado (Delphi Desktop/VCL) a arquitectura Web nativa con Delphi 11 + UniGui, manteniendo 100% de cumplimiento fiscal.',
                    image_url: '/unigui_migration_mockup.jpg',
                    repo_link: null,
                    demo_link: null,
                    tags: ['Delphi 11', 'UniGui', 'ACBr', 'FireDAC', 'FortesReport', 'SQL Server'],
                    details: {
                        subtitle: 'Modernización de Sistema Monolítico Heredado a Web',
                        fullDescription: 'Ingeniería de modernización y refactorización de un sistema comercial monolítico heredado (Desktop/VCL en Delphi 6) a una arquitectura Web nativa utilizando RAD Studio Delphi 11 y el framework UniGui. El proyecto involucró la reestructuración profunda de la gestión de estado y concurrencia para ejecución server-side via navegador.',
                        metrics: [
                            { label: 'Modernización', value: 'Desktop ➔ 100% Web Nativo', icon: 'fas fa-cloud' },
                            { label: 'Integridad', value: 'Cero Regresión en Reglas Fiscales ACBr', icon: 'fas fa-check-circle' },
                            { label: 'Rendimiento', value: 'Ejecución Server-Side Optimizada', icon: 'fas fa-tachometer-alt' }
                        ],
                        architecture: [
                            { layer: 'Web Client', tech: 'UniGui Web / ExtJS Engine', role: 'Interfaz rica y responsiva en el navegador sin requerir instalación local' },
                            { layer: 'Server Engine', tech: 'Delphi 11 RAD ServerModule', role: 'Gestión de ciclo de vida de instancias, hilos de conexión y sesiones aisladas' },
                            { layer: 'Fiscal & Reports', tech: 'ACBr Web + FortesReport Server', role: 'Generación asíncrona de reportes PDF en servidor y emisión fiscal continua' },
                            { layer: 'Data Engine', tech: 'FireDAC + SQL Server', role: 'Pool de conexiones FireDAC resiliente con garantías estrictas de transacciones ACID' }
                        ],
                        challenge: 'Migrar un sistema monolítico Desktop VCL de 15+ años con bibliotecas heredadas (JEDI/JVCL) a Web sin romper reglas de negocio fiscales ni comprometer estabilidad.',
                        solution: 'Reestructuración del ciclo de vida de ventanas para UniGui MainModule/ServerModule, actualización del framework ACBr para ejecución en servidor y creación de pool de conexiones FireDAC.',
                        highlights: [
                            'Conversión completa de VCL (Desktop) a UniGui Web manteniendo la lógica de negocio intacta',
                            'Actualización de componentes fiscales críticos (Proyecto ACBr) para facturación electrónica web',
                            'Migración y adaptación de generadores de reportes (FortesReport) para ejecución en servidor',
                            'Control de concurrencia y sesiones de usuarios aislado vía ServerModule y MainModule',
                            'Resolución de conflictos de bibliotecas heredadas (JEDI — JCL/JVCL) y reestructuración del Library Path',
                            'Resultado: compilación limpia, estabilidad en producción y eliminación del 40% de bugs visuales',
                        ],
                    },
                },
                {
                    id: 4,
                    title: 'Control de Inventario — Java + MySQL',
                    description: 'Sistema de escritorio con interfaz Swing para control de inventario con registro de usuarios e integración con MySQL.',
                    image_url: '/java_inventory_mockup.png',
                    repo_link: 'https://github.com/pedrhenriqueol/Projetos-Java',
                    demo_link: null,
                    tags: ['Java', 'MySQL', 'Swing'],
                },
                {
                    id: 5,
                    title: 'API de Tareas — Python + Flask',
                    description: 'API RESTful con rutas GET, POST, PUT y DELETE hecha con Python y Flask. Posee frontend integrado con HTML, CSS y JS.',
                    image_url: '/flask_api_mockup.png',
                    repo_link: 'https://github.com/pedrhenriqueol/API-Python',
                    demo_link: null,
                    tags: ['Python', 'Flask', 'API REST'],
                },
                {
                    id: 6,
                    title: 'Generador de Contraseñas — Python',
                    description: 'Aplicación de escritorio en Python con interfaz Tkinter. Utiliza bibliotecas random, string y pyperclip para generar contraseñas seguras.',
                    image_url: '/password_gen_mockup.png',
                    repo_link: 'https://github.com/pedrhenriqueol/Gerador-senhas',
                    demo_link: null,
                    tags: ['Python', 'Tkinter'],
                },
            ]
        },
        contact: {
            tag: 'Ponerse en contacto',
            title1: '¿Vamos a ',
            title2: 'Hablar?',
            subtitle: 'Estoy abierto a nuevas oportunidades, colaboraciones o simplemente una buena charla sobre tecnología.',
            directMessage: '¿Prefieres ir directo al grano? Encuéntrame por cualquiera de los canales abajo. Suelo responder en menos de 24h.',
            formName: 'Nombre',
            formEmail: 'Correo',
            formSubject: 'Asunto',
            formSubjectPlaceholder: 'Oportunidad, colaboración, freelance...',
            formMessage: 'Mensaje',
            formMessagePlaceholder: 'Escribe tu mensaje aquí...',
            labelName: 'Nombre',
            labelEmail: 'Correo',
            labelSubject: 'Asunto',
            labelMessage: 'Mensaje',
            successMsg: '¡Mensaje enviado! Me pondré en contacto en breve.',
            errorMsg: 'Error al enviar. Intenta por LinkedIn o correo directamente.',
            errorConn: 'Error de conexión. Revisa tu internet e intenta de nuevo.',
            btnSending: 'Enviando...',
            btnSend: 'Enviar Mensaje',
            sending: 'Enviando...',
            submitBtn: 'Enviar Mensaje',
            rights: 'Pedro Henrique. Todos los derechos reservados.'
        },
        palette: {
            title: 'Paleta de Colores',
            mocha: 'Café / Mocha',
            claude: 'Claude Editorial',
            greige: 'Greige Minimal',
            forest: 'Verde Musgo',
            slate: 'Midnight Slate',
            emerald: 'Obsidian Emerald'
        }
    }
};
