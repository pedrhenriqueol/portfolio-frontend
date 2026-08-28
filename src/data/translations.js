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
                { id: 1,  name: 'PHP / Laravel',       icon_class: 'fab fa-php',        category: 'Back-end',  level: 4 },
                { id: 2,  name: 'React + TypeScript',  icon_class: 'fab fa-react',      category: 'Front-end', level: 4 },
                { id: 3,  name: 'Delphi (VCL/UniGui)', icon_class: 'fas fa-desktop',    category: 'Back-end',  level: 4 },
                { id: 4,  name: 'SQL Server',          icon_class: 'fas fa-database',   category: 'Database',  level: 4 },
                { id: 5,  name: 'MySQL',               icon_class: 'fas fa-database',   category: 'Database',  level: 4 },
                { id: 6,  name: 'APIs RESTful',        icon_class: 'fas fa-network-wired', category: 'Back-end', level: 4 },
                { id: 7,  name: 'Tailwind CSS',        icon_class: 'fab fa-css3-alt',   category: 'Front-end', level: 4 },
                { id: 8,  name: 'QA & Postman',        icon_class: 'fas fa-vial',       category: 'QA / Testes', level: 4 },
                { id: 9,  name: 'Git / GitHub',        icon_class: 'fab fa-git-alt',    category: 'DevOps',    level: 4 },
                { id: 10, name: 'Docker',              icon_class: 'fab fa-docker',     category: 'DevOps',    level: 3 },
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
            filterAll: 'Todos',
            filterFullstack: 'Web / Fullstack',
            filterDesktop: 'Desktop / Delphi',
            filterBackend: 'Backend & APIs',
            filterOthers: 'Outros',
            list: [
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
                            '⚡ 2s ➔ <500ms (Otimização de Queries)',
                            '👥 100+ Usuários Simultâneos',
                            '🛡️ 100% Conformidade Fiscal ACBr'
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
                            '🏢 Multi-Tenant com Isolamento Lógico',
                            '🔐 RBAC Granular por Cargo e Filial',
                            '📊 Dashboards Consolidados em Tempo Real'
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
                            '🌐 Desktop ➔ 100% Web Nativo',
                            '🛡️ Zero Perda de Regras Fiscais ACBr',
                            '🚀 Execução Server-Side Otimizada'
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
            successMsg: 'Mensagem enviada! Entrarei em contato em breve.',
            errorMsg: 'Erro ao enviar. Tente pelo LinkedIn ou e-mail diretamente.',
            errorConn: 'Erro de conexão. Verifique sua internet e tente novamente.',
            btnSending: 'Enviando...',
            btnSend: 'Enviar Mensagem',
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
                { id: 1,  name: 'PHP / Laravel',       icon_class: 'fab fa-php',        category: 'Back-end',  level: 4 },
                { id: 2,  name: 'React + TypeScript',  icon_class: 'fab fa-react',      category: 'Front-end', level: 4 },
                { id: 3,  name: 'Delphi (VCL/UniGui)', icon_class: 'fas fa-desktop',    category: 'Back-end',  level: 4 },
                { id: 4,  name: 'SQL Server',          icon_class: 'fas fa-database',   category: 'Database',  level: 4 },
                { id: 5,  name: 'MySQL',               icon_class: 'fas fa-database',   category: 'Database',  level: 4 },
                { id: 6,  name: 'APIs RESTful',        icon_class: 'fas fa-network-wired', category: 'Back-end', level: 4 },
                { id: 7,  name: 'Tailwind CSS',        icon_class: 'fab fa-css3-alt',   category: 'Front-end', level: 4 },
                { id: 8,  name: 'QA & Postman',        icon_class: 'fas fa-vial',       category: 'QA / Testes', level: 4 },
                { id: 9,  name: 'Git / GitHub',        icon_class: 'fab fa-git-alt',    category: 'DevOps',    level: 4 },
                { id: 10, name: 'Docker',              icon_class: 'fab fa-docker',     category: 'DevOps',    level: 3 },
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
            filterAll: 'All',
            filterFullstack: 'Web / Fullstack',
            filterDesktop: 'Desktop / Delphi',
            filterBackend: 'Backend & APIs',
            filterOthers: 'Others',
            list: [
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
                            '⚡ 2s ➔ <500ms (Query Optimization)',
                            '👥 100+ Concurrent Production Users',
                            '🛡️ 100% Tax & Fiscal Compliance'
                        ],
                        architecture: [
                            { layer: 'Client / Presentation', tech: 'React 18 + TypeScript + Tailwind', role: 'Decoupled SPA with reactive hooks, local cache, and optimistic UI updates' },
                            { layer: 'API Gateway & Auth', tech: 'Laravel Sanctum + Middleware', role: 'Stateless token authentication, session control, and strict payload validation' },
                            { layer: 'Business & Fiscal', tech: 'PHP 8 Services + ACBr Core', role: 'Billing rules processing, electronic invoice issuance, and real-time inventory' },
                            { layer: 'Data Tier', tech: 'SQL Server / MySQL Pool', role: 'Optimized relational schema with covering indexes and zero N+1 queries' }
                        ],
                        challenge: 'Concurrency bottlenecks during peak fiscal closing hours and slow report generation across thousands of inventory SKUs in relational databases.',
                        solution: 'Complete architectural refactoring to decoupled Laravel API + React SPA, applying Eager Loading with composite indexes and asynchronous fiscal processing via ACBr.',
                        highlights: [
                            'Decoupled architecture: RESTful API (Laravel) + SPA (React + TypeScript)',
                            '100% responsive and accessible interface calibrated with Tailwind CSS dark theme',
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
                            '🏢 Logical Multi-Tenant Isolation',
                            '🔐 Granular Hierarchical RBAC',
                            '📊 Real-Time Consolidated Analytics'
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
                    description: 'Modernization engineering of a legacy monolithic system (Delphi Desktop/VCL) to native Web architecture with Delphi 11 + UniGui, maintaining 100% tax compliance.',
                    image_url: '/unigui_migration_mockup.jpg',
                    repo_link: null,
                    demo_link: null,
                    tags: ['Delphi 11', 'UniGui', 'ACBr', 'FireDAC', 'FortesReport', 'SQL Server'],
                    details: {
                        subtitle: 'Legacy Monolithic System Modernization to Web',
                        fullDescription: 'Modernization engineering and refactoring of a legacy monolithic commercial system (Desktop/VCL in Delphi 6) to a native Web architecture using RAD Studio Delphi 11 and the UniGui framework. The project involved deep restructuring of state management and concurrency for server-side browser execution.',
                        metrics: [
                            '🌐 Desktop ➔ 100% Native Web',
                            '🛡️ Zero Loss of ACBr Business Rules',
                            '🚀 Optimized Server-Side Execution'
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
            successMsg: 'Message sent! I will contact you shortly.',
            errorMsg: 'Error sending. Try via LinkedIn or email directly.',
            errorConn: 'Connection error. Check your internet and try again.',
            btnSending: 'Sending...',
            btnSend: 'Send Message',
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
                { id: 1,  name: 'PHP / Laravel',       icon_class: 'fab fa-php',        category: 'Back-end',  level: 4 },
                { id: 2,  name: 'React + TypeScript',  icon_class: 'fab fa-react',      category: 'Front-end', level: 4 },
                { id: 3,  name: 'Delphi (VCL/UniGui)', icon_class: 'fas fa-desktop',    category: 'Back-end',  level: 4 },
                { id: 4,  name: 'SQL Server',          icon_class: 'fas fa-database',   category: 'Database',  level: 4 },
                { id: 5,  name: 'MySQL',               icon_class: 'fas fa-database',   category: 'Database',  level: 4 },
                { id: 6,  name: 'APIs RESTful',        icon_class: 'fas fa-network-wired', category: 'Back-end', level: 4 },
                { id: 7,  name: 'Tailwind CSS',        icon_class: 'fab fa-css3-alt',   category: 'Front-end', level: 4 },
                { id: 8,  name: 'QA & Postman',        icon_class: 'fas fa-vial',       category: 'QA / Testes', level: 4 },
                { id: 9,  name: 'Git / GitHub',        icon_class: 'fab fa-git-alt',    category: 'DevOps',    level: 4 },
                { id: 10, name: 'Docker',              icon_class: 'fab fa-docker',     category: 'DevOps',    level: 3 },
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
            filterAll: 'Todos',
            filterFullstack: 'Web / Fullstack',
            filterDesktop: 'Desktop / Delphi',
            filterBackend: 'Backend & APIs',
            filterOthers: 'Otros',
            list: [
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
                            '⚡ 2s ➔ <500ms (Optimización de Consultas)',
                            '👥 100+ Usuarios Concurrentes',
                            '🛡️ 100% Cumplimiento Fiscal ACBr'
                        ],
                        architecture: [
                            { layer: 'Client / Presentation', tech: 'React 18 + TypeScript + Tailwind', role: 'SPA desacoplada con componentes reactivos, caché local y feedback optimista' },
                            { layer: 'API Gateway & Auth', tech: 'Laravel Sanctum + Middleware', role: 'Autenticación stateless, control de sesión seguro y validación estricta de payloads' },
                            { layer: 'Business & Fiscal', tech: 'PHP 8 Services + ACBr Core', role: 'Procesamiento de facturación, emisión fiscal e inventario en tiempo real' },
                            { layer: 'Data Tier', tech: 'SQL Server / MySQL Pool', role: 'Modelado relacional optimizado con índices y cero consultas N+1' }
                        ],
                        challenge: 'Cuellos de botella de concurrencia en horarios pico durante la emisión fiscal y lentitud en reportes de inventario con miles de SKUs.',
                        solution: 'Refactorización completa hacia arquitectura desacoplada (Laravel REST API + React SPA), aplicación de Eager Loading con índices compuestos y procesamiento asíncrono vía ACBr.',
                        highlights: [
                            'Arquitectura desacoplada: API RESTful (Laravel) + SPA (React + TypeScript)',
                            'Interfaz 100% responsiva y accesible con tema oscuro calibrado en Tailwind CSS',
                            'Gestión de inventario en tiempo real con retroalimentación inmediata vía hooks reactivos',
                            'Control de cuentas por cobrar con filtros avanzados y exportación de reportes analíticos',
                            'Integración profunda con componentes fiscales (ACBr) para emisión de facturas electrónicas',
                            'Autenticación y autorización robusta vía Laravel Sanctum con RBAC por rol de operador',
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
                            '🏢 Multi-Tenant con Aislamiento Lógico',
                            '🔐 RBAC Granular por Rol y Sucursal',
                            '📊 Dashboards Consolidados en Tiempo Real'
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
                        fullDescription: 'Ingeniería de modernización y refactorización de un sistema comercial monolítico heredado (Desktop/VCL en Delphi 6) a arquitectura Web nativa usando RAD Studio Delphi 11 y el framework UniGui. El proyecto involucró la reestructuración profunda del manejo de estado y concurrencia para ejecución en servidor vía navegador.',
                        metrics: [
                            '🌐 Desktop ➔ 100% Web Nativo',
                            '🛡️ Cero Pérdida de Reglas Fiscales ACBr',
                            '🚀 Ejecución en Servidor Optimizada'
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
            successMsg: '¡Mensaje enviado! Me pondré en contacto en breve.',
            errorMsg: 'Error al enviar. Intenta por LinkedIn o correo directamente.',
            errorConn: 'Error de conexión. Revisa tu internet e intenta de nuevo.',
            btnSending: 'Enviando...',
            btnSend: 'Enviar Mensaje',
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
