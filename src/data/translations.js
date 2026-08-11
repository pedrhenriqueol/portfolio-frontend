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
            developer: 'Desenvolvedor',
            role: 'Fullstack',
            description: 'Especialista na modernização de sistemas legados e desenvolvimento de soluções escaláveis utilizando',
            verProjetos: 'Ver Projetos',
            terminal: {
                role: 'Fullstack Dev',
                available: 'available: true, ✓'
            }
        },
        about: {
            title: 'Sobre Mim',
            resumoTitle: 'Resumo Profissional',
            resumo1: 'Desenvolvedor Fullstack em estágio com',
            resumo1_highlight1: '10+ meses',
            resumo1_rest: 'de experiência prática em sistemas PDV/ERP de alta carga, atuando diretamente em produção com mais de',
            resumo1_highlight2: '100 usuários diários.',
            resumo2: 'Especializado em',
            resumo2_rest: 'Tenho experiência com otimizações críticas de banco de dados, reduzindo tempo de resposta de consultas de',
            resumo2_highlight: '2 s → < 500 ms',
            resumo2_final: 'via índices e refatoração de queries N+1.',
            resumo3: 'Já integrei componentes fiscais (ACBR) e de relatórios (FortesReport) em ambiente de produção, garantindo conformidade legal em',
            resumo3_highlight: '100%',
            resumo3_final: 'das transações processadas.',
            resumo4: 'Atualmente, atuando também como',
            resumo4_highlight1: 'Analista de QA',
            resumo4_rest: 'na SETE Tecnologia, aplicando engenharia de requisitos e testes funcionais em sistemas de missão crítica (logística portuária / ZPEs), utilizando',
            resumo4_highlight2: 'Postman, SQL Server e Scrum/Kanban.',
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
                                'Testes de consumo e integração de serviços via APIs RESTful utilizando Postman, assegurando a confiabilidade do tráfego de dados.',
                                'Execução de queries de diagnóstico, validação de transações e testes estruturados diretamente em bancos de dados Microsoft SQL Server no sistema core ePita.',
                                'Redução de 25% em bugs críticos em ambiente de produção através de validação antecipada antes do deploy.',
                            ],
                        },
                    ],
                },
                {
                    id: 1,
                    company: 'Qualisoft Sistemas',
                    role: 'Desenvolvedor Fullstack (Estágio)',
                    period: 'Ago 2025 - Presente',
                    techBadges: ['Delphi 11', 'UniGui', 'Laravel', 'React', 'TypeScript', 'Tailwind CSS', 'SQL Server', 'MySQL'],
                    groups: [
                        {
                            title: 'Modernização & Arquitetura Legada',
                            icon: 'fas fa-layer-group',
                            items: [
                                'Engenharia reversa e manutenção de ERP monolítico em Delphi 6 (base de 100+ usuários diários), liderando a preparação arquitetural para migração web com Delphi 11 e UniGui.',
                                'Otimização crítica de performance em banco de dados (SQL Server/MySQL em nuvem), reduzindo o tempo de resposta da unit de pesquisa de produtos de 2s para <500ms via indexação e refatoração de queries N+1.',
                                'Estabilização de ambiente legado, resolvendo gargalos críticos de memória e bugs em componentes TDBGrid, TClientDataSet e BDE (Paradox), eliminando 8+ travamentos em rotinas de produção.',
                            ],
                        },
                        {
                            title: 'Desenvolvimento Web Full-Stack',
                            icon: 'fas fa-globe',
                            items: [
                                'Desenvolvimento e escala de plataformas Multi-tenant do zero (Retaguarda ERP e Portal de Conglomerados) construídas com PHP (Laravel), React e TypeScript.',
                                'Modernização de interfaces UI/UX com Tailwind CSS, substituindo painéis obsoletos e resultando em redução de 40% em bugs visuais reportados ao suporte técnico.',
                                'Integração de módulos de automação comercial complexos (Projeto ACBr e FortesReport), garantindo 100% de conformidade fiscal e consistência na emissão de notas em todas as transações.',
                            ],
                        },
                    ],
                }
            ]
        },
        skills: {
            title: 'Habilidades & Tecnologias',
            subtitle: 'Ferramentas e linguagens que domino e utilizo no dia a dia.',
            levels: {
                5: 'Especialista',
                4: 'Avançado',
                3: 'Intermediário',
                2: 'Básico'
            },
            list: [
                { id: 1,  name: 'PHP',                icon_class: 'fab fa-php',       category: 'Back-end',  level: 4 },
                { id: 2,  name: 'Laravel',            icon_class: 'fab fa-laravel',   category: 'Back-end',  level: 4 },
                { id: 3,  name: 'Delphi / UniGui',    icon_class: 'fas fa-desktop',   category: 'Back-end',  level: 5 },
                { id: 13, name: 'Node.js',            icon_class: 'fab fa-node-js',   category: 'Back-end',  level: 3 },
                { id: 5,  name: 'React',              icon_class: 'fab fa-react',     category: 'Front-end', level: 4 },
                { id: 4,  name: 'TypeScript',         icon_class: 'fab fa-js',        category: 'Front-end', level: 4 },
                { id: 8,  name: 'Tailwind CSS',       icon_class: 'fab fa-css3-alt',  category: 'Front-end', level: 4 },
                { id: 11, name: 'HTML / CSS',         icon_class: 'fab fa-html5',     category: 'Front-end', level: 5 },
                { id: 7,  name: 'MySQL',              icon_class: 'fas fa-database',  category: 'Database',  level: 4 },
                { id: 14, name: 'SQL Server',         icon_class: 'fas fa-server',    category: 'Database',  level: 4 },
                { id: 15, name: 'PostgreSQL',         icon_class: 'fas fa-database',  category: 'Database',  level: 3 },
                { id: 9,  name: 'Git / GitHub',       icon_class: 'fab fa-git-alt',   category: 'DevOps',    level: 4 },
                { id: 12, name: 'Docker',             icon_class: 'fab fa-docker',    category: 'DevOps',    level: 3 },
                { id: 6,  name: 'Java',              icon_class: 'fab fa-java',       category: 'Outros',    level: 3 },
                { id: 10, name: 'Python',            icon_class: 'fab fa-python',     category: 'Outros',    level: 3 },
            ]
        },
        projects: {
            title: 'Projetos em Destaque',
            subtitle: 'Soluções desenvolvidas para resolver problemas reais e aplicar novos conhecimentos.',
            btnRepo: 'Ver Repositório',
            btnDemo: 'Acessar Demo',
            btnDetails: 'Detalhes',
            modalVoltar: 'Voltar',
            modalPrincipais: 'Principais Funcionalidades',
            list: [
                {
                    id: 1,
                    title: 'Retaguarda ERP',
                    description: 'Desenvolvimento full-stack de um módulo administrativo robusto para gestão de ERP/PDV. Arquitetura dividida entre uma API RESTful em Laravel e uma SPA client-side em React + TypeScript.',
                    image_url: 'https://placehold.co/600x400/1F2833/66FCF1?text=Retaguarda+ERP',
                    repo_link: null,
                    demo_link: null,
                    tags: ['Laravel', 'React', 'TypeScript', 'Tailwind CSS', 'REST API'],
                    details: {
                        subtitle: 'Módulo Administrativo Full-Stack — ERP/PDV',
                        fullDescription: 'Desenvolvimento full-stack de um módulo administrativo robusto para gestão de ERP/PDV. A arquitetura foi dividida entre uma API RESTful desenvolvida em Laravel e uma aplicação client-side construída com React e TypeScript. O foco principal foi criar uma interface moderna, limpa e altamente responsiva utilizando Tailwind CSS, garantindo a melhor experiência (UX) para o usuário final.',
                        highlights: [
                            'Arquitetura desacoplada: API RESTful (Laravel) + SPA (React + TypeScript)',
                            'Interface 100% responsiva e acessível construída com Tailwind CSS',
                            'Gestão de inventário em tempo real com feedback imediato via componentes React reativos',
                            'Controle de contas a receber com filtros avançados e geração de relatórios',
                            'Integração com componentes fiscais (ACBR) para emissão de notas e conformidade legal',
                            'Autenticação e autorização via Laravel Sanctum com controle de sessão seguro',
                        ],
                    },
                },
                {
                    id: 2,
                    title: 'Portal Conglomerados',
                    description: 'Plataforma Multi-tenant para gestão centralizada de múltiplas unidades de negócio. Implementação de RBAC (Role-Based Access Control) e dashboards interativos em React.',
                    image_url: 'https://placehold.co/600x400/1F2833/45A29E?text=Conglomerados',
                    repo_link: null,
                    demo_link: null,
                    tags: ['Laravel', 'React', 'Multi-tenant', 'RBAC', 'Dashboard'],
                    details: {
                        subtitle: 'Plataforma Multi-tenant de Gestão Empresarial',
                        fullDescription: 'Projeção e implementação de uma plataforma de gestão com arquitetura Multi-tenant, permitindo a operação centralizada de múltiplas unidades de negócio e filiais em um único ecossistema. O painel (dashboard) consolida dados dispersos, oferecendo métricas e supervisão em tempo real de forma escalável e segura.',
                        highlights: [
                            'Arquitetura Multi-tenant: separação lógica de dados por empresa/filial no banco de dados',
                            'RBAC (Role-Based Access Control): usuários de diferentes hierarquias acessam apenas módulos autorizados de suas filiais',
                            'Dashboards interativos em React para visualização e agregação de grandes volumes de dados operacionais e financeiros',
                            'API RESTful em Laravel com endpoints protegidos por políticas e gates por tenant',
                            'Consultas otimizadas para cruzamento de dados multi-filial com baixa latência',
                            'Design escalável: adição de novas filiais sem alteração na estrutura de código',
                        ],
                    },
                },
                {
                    id: 3,
                    title: 'Migração Delphi → UniGui Web',
                    description: 'Engenharia de modernização de sistema monolítico legado (Delphi 6 Desktop/VCL) para arquitetura Web nativa com Delphi 11 + UniGui, mantendo conformidade fiscal total.',
                    image_url: 'https://placehold.co/600x400/1F2833/C5C6C7?text=Migração+Legado',
                    repo_link: null,
                    demo_link: null,
                    tags: ['Delphi 11', 'UniGui', 'ACBr', 'FortesReport', 'JVCL'],
                    details: {
                        subtitle: 'Modernização de Sistema Monolítico Legado',
                        fullDescription: 'Engenharia de modernização e refatoração de um sistema comercial monolítico legado (Desktop/VCL em Delphi 6) para uma arquitetura Web nativa utilizando RAD Studio Delphi 11 e o framework UniGui. O projeto exigiu uma conversão profunda das interfaces gráficas e do gerenciamento de estado, transformando uma aplicação local em um serviço de servidor acessível via navegador.',
                        highlights: [
                            'Conversão completa de VCL (Desktop) para UniGui Web mantendo a lógica de negócio intacta',
                            'Upgrade de componentes fiscais críticos (Projeto ACBr) para emissão de NF-e/NFC-e no novo ambiente web',
                            'Migração e adaptação de geradores de relatório (FortesReport) para execução server-side',
                            'Adaptação do controle de concorrência e sessão de usuários (migração para ServerModule e MainModule do UniGui)',
                            'Resolução de conflitos de bibliotecas legadas (JEDI — JCL/JVCL) e reestruturação do Library Path da IDE',
                            'Resultado: compilação limpa, estabilidade em produção e redução de 40% em bugs visuais legados',
                        ],
                    },
                },
                {
                    id: 4,
                    title: 'Controle de Estoque — Java + MySQL',
                    description: 'Sistema desktop com interface Swing para controle de estoque completo com cadastro de usuários e integração MySQL.',
                    image_url: 'https://placehold.co/600x400/0B0C10/66FCF1?text=Estoque+Java',
                    repo_link: 'https://github.com/pedrhenriqueol/Projetos-Java',
                    demo_link: null,
                    tags: ['Java', 'MySQL', 'Swing'],
                },
                {
                    id: 5,
                    title: 'API de Tarefas — Python + Flask',
                    description: 'API RESTful com rotas GET, POST, PUT e DELETE feita com Python e Flask. Possui frontend integrado com HTML, CSS e JavaScript.',
                    image_url: 'https://placehold.co/600x400/0B0C10/45A29E?text=API+Flask',
                    repo_link: 'https://github.com/pedrhenriqueol/API-Python',
                    demo_link: null,
                    tags: ['Python', 'Flask', 'REST API'],
                },
                {
                    id: 6,
                    title: 'Gerador de Senhas — Python',
                    description: 'Aplicativo desktop em Python com interface Tkinter. Utiliza bibliotecas random, string e pyperclip para geração e cópia prática das senhas.',
                    image_url: 'https://placehold.co/600x400/0B0C10/C5C6C7?text=Gerador+Senhas',
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
            developer: 'Developer',
            role: 'Fullstack',
            description: 'Specialist in legacy system modernization and scalable solutions development using',
            verProjetos: 'View Projects',
            terminal: {
                role: 'Fullstack Dev',
                available: 'available: true, ✓'
            }
        },
        about: {
            title: 'About Me',
            resumoTitle: 'Professional Summary',
            resumo1: 'Fullstack Developer intern with',
            resumo1_highlight1: '10+ months',
            resumo1_rest: 'of practical experience in high-load POS/ERP systems, acting directly in production with over',
            resumo1_highlight2: '100 daily users.',
            resumo2: 'Specialized in',
            resumo2_rest: 'I have experience with critical database optimizations, reducing query response times from',
            resumo2_highlight: '2 s → < 500 ms',
            resumo2_final: 'via indexing and N+1 query refactoring.',
            resumo3: 'Integrated complex fiscal (ACBR) and reporting (FortesReport) components in production environments, ensuring legal compliance in',
            resumo3_highlight: '100%',
            resumo3_final: 'of processed transactions.',
            resumo4: 'Currently also working as a',
            resumo4_highlight1: 'QA Analyst',
            resumo4_rest: 'at SETE Tecnologia, applying requirements engineering and functional testing on mission-critical systems (port logistics / ZPEs), using',
            resumo4_highlight2: 'Postman, SQL Server and Scrum/Kanban.',
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
            title: 'Professional Experience',
            subtitle: 'My journey in software development and the market.',
            empty: 'No experience registered yet.',
            list: [
                {
                    id: 2,
                    company: 'SETE Tecnologia',
                    role: 'Software Quality Assurance (QA) Analyst — Intern',
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
                                'Achieved a 25% reduction in critical bugs in the production environment through early validation before deployment.',
                            ],
                        },
                    ],
                },
                {
                    id: 1,
                    company: 'Qualisoft Sistemas',
                    role: 'Fullstack Developer (Intern)',
                    period: 'Aug 2025 - Present',
                    techBadges: ['Delphi 11', 'UniGui', 'Laravel', 'React', 'TypeScript', 'Tailwind CSS', 'SQL Server', 'MySQL'],
                    groups: [
                        {
                            title: 'Legacy Modernization & Architecture',
                            icon: 'fas fa-layer-group',
                            items: [
                                'Reverse engineering and maintenance of a monolithic ERP in Delphi 6 (100+ daily users), leading architectural preparation for web migration with Delphi 11 and UniGui.',
                                'Critical database performance optimization (Cloud SQL Server/MySQL), reducing product search routine response time from 2s to <500ms via indexing and N+1 query refactoring.',
                                'Stabilized legacy environment, resolving memory bottlenecks and bugs in TDBGrid, TClientDataSet, and BDE (Paradox) components, eliminating 8+ crashes in production routines.',
                            ],
                        },
                        {
                            title: 'Full-Stack Web Development',
                            icon: 'fas fa-globe',
                            items: [
                                'Developed and scaled Multi-tenant platforms from scratch (ERP Backoffice and Conglomerates Portal) built with PHP (Laravel), React, and TypeScript.',
                                'Modernized UI/UX interfaces with Tailwind CSS, replacing obsolete panels and resulting in a 40% reduction in visual bugs reported to technical support.',
                                'Integrated complex commercial automation modules (ACBr Project and FortesReport), ensuring 100% tax compliance and consistency in invoice issuance across all transactions.',
                            ],
                        },
                    ],
                }
            ]
        },
        skills: {
            title: 'Skills & Technologies',
            subtitle: 'Tools and languages I master and use daily.',
            levels: {
                5: 'Expert',
                4: 'Advanced',
                3: 'Intermediate',
                2: 'Basic'
            },
            list: [
                { id: 1,  name: 'PHP',                icon_class: 'fab fa-php',       category: 'Back-end',  level: 4 },
                { id: 2,  name: 'Laravel',            icon_class: 'fab fa-laravel',   category: 'Back-end',  level: 4 },
                { id: 3,  name: 'Delphi / UniGui',    icon_class: 'fas fa-desktop',   category: 'Back-end',  level: 5 },
                { id: 13, name: 'Node.js',            icon_class: 'fab fa-node-js',   category: 'Back-end',  level: 3 },
                { id: 5,  name: 'React',              icon_class: 'fab fa-react',     category: 'Front-end', level: 4 },
                { id: 4,  name: 'TypeScript',         icon_class: 'fab fa-js',        category: 'Front-end', level: 4 },
                { id: 8,  name: 'Tailwind CSS',       icon_class: 'fab fa-css3-alt',  category: 'Front-end', level: 4 },
                { id: 11, name: 'HTML / CSS',         icon_class: 'fab fa-html5',     category: 'Front-end', level: 5 },
                { id: 7,  name: 'MySQL',              icon_class: 'fas fa-database',  category: 'Database',  level: 4 },
                { id: 14, name: 'SQL Server',         icon_class: 'fas fa-server',    category: 'Database',  level: 4 },
                { id: 15, name: 'PostgreSQL',         icon_class: 'fas fa-database',  category: 'Database',  level: 3 },
                { id: 9,  name: 'Git / GitHub',       icon_class: 'fab fa-git-alt',   category: 'DevOps',    level: 4 },
                { id: 12, name: 'Docker',             icon_class: 'fab fa-docker',    category: 'DevOps',    level: 3 },
                { id: 6,  name: 'Java',              icon_class: 'fab fa-java',       category: 'Others',    level: 3 },
                { id: 10, name: 'Python',            icon_class: 'fab fa-python',     category: 'Others',    level: 3 },
            ]
        },
        projects: {
            title: 'Featured Projects',
            subtitle: 'Solutions developed to solve real problems and apply new knowledge.',
            btnRepo: 'Repository',
            btnDemo: 'Live Demo',
            btnDetails: 'Details',
            modalVoltar: 'Back',
            modalPrincipais: 'Main Features',
            list: [
                {
                    id: 1,
                    title: 'ERP Backoffice',
                    description: 'Full-stack development of a robust administrative module for ERP/POS management. Architecture divided between a RESTful API in Laravel and a client-side SPA in React + TypeScript.',
                    image_url: 'https://placehold.co/600x400/1F2833/66FCF1?text=ERP+Backoffice',
                    repo_link: null,
                    demo_link: null,
                    tags: ['Laravel', 'React', 'TypeScript', 'Tailwind CSS', 'REST API'],
                    details: {
                        subtitle: 'Full-Stack Administrative Module — ERP/POS',
                        fullDescription: 'Full-stack development of a robust administrative module for ERP/POS management. The architecture was divided between a RESTful API developed in Laravel and a client-side application built with React and TypeScript. The main focus was to create a modern, clean, and highly responsive interface using Tailwind CSS, ensuring the best user experience (UX) for the end-user.',
                        highlights: [
                            'Decoupled architecture: RESTful API (Laravel) + SPA (React + TypeScript)',
                            '100% responsive and accessible interface built with Tailwind CSS',
                            'Real-time inventory management with immediate feedback via reactive React components',
                            'Accounts receivable control with advanced filters and report generation',
                            'Integration with tax components (ACBR) for invoice issuance and legal compliance',
                            'Authentication and authorization via Laravel Sanctum with secure session control',
                        ],
                    },
                },
                {
                    id: 2,
                    title: 'Conglomerates Portal',
                    description: 'Multi-tenant platform for centralized management of multiple business units. Implementation of RBAC (Role-Based Access Control) and interactive dashboards in React.',
                    image_url: 'https://placehold.co/600x400/1F2833/45A29E?text=Conglomerates',
                    repo_link: null,
                    demo_link: null,
                    tags: ['Laravel', 'React', 'Multi-tenant', 'RBAC', 'Dashboard'],
                    details: {
                        subtitle: 'Multi-tenant Business Management Platform',
                        fullDescription: 'Design and implementation of a management platform with Multi-tenant architecture, allowing centralized operation of multiple business units and branches in a single ecosystem. The dashboard consolidates dispersed data, offering real-time metrics and supervision in a scalable and secure manner.',
                        highlights: [
                            'Multi-tenant architecture: logical separation of data by company/branch in the database',
                            'RBAC (Role-Based Access Control): users of different hierarchies only access authorized modules of their branches',
                            'Interactive React dashboards for visualization and aggregation of large volumes of operational and financial data',
                            'RESTful API in Laravel with endpoints protected by policies and gates per tenant',
                            'Optimized queries for multi-branch data cross-referencing with low latency',
                            'Scalable design: addition of new branches without changing code structure',
                        ],
                    },
                },
                {
                    id: 3,
                    title: 'Delphi → UniGui Web Migration',
                    description: 'Modernization engineering of a legacy monolithic system (Delphi 6 Desktop/VCL) to native Web architecture with Delphi 11 + UniGui, maintaining full tax compliance.',
                    image_url: 'https://placehold.co/600x400/1F2833/C5C6C7?text=Legacy+Migration',
                    repo_link: null,
                    demo_link: null,
                    tags: ['Delphi 11', 'UniGui', 'ACBr', 'FortesReport', 'JVCL'],
                    details: {
                        subtitle: 'Legacy Monolithic System Modernization',
                        fullDescription: 'Modernization engineering and refactoring of a legacy monolithic commercial system (Desktop/VCL in Delphi 6) to a native Web architecture using RAD Studio Delphi 11 and the UniGui framework. The project required a deep conversion of graphical interfaces and state management, transforming a local application into a server service accessible via browser.',
                        highlights: [
                            'Complete conversion from VCL (Desktop) to UniGui Web keeping business logic intact',
                            'Upgrade of critical tax components (ACBr Project) for NF-e/NFC-e issuance in the new web environment',
                            'Migration and adaptation of report generators (FortesReport) for server-side execution',
                            'Adaptation of concurrency control and user sessions (migration to UniGui ServerModule and MainModule)',
                            'Resolution of legacy library conflicts (JEDI — JCL/JVCL) and restructuring of IDE Library Path',
                            'Result: clean compilation, stability in production, and 40% reduction in legacy visual bugs',
                        ],
                    },
                },
                {
                    id: 4,
                    title: 'Inventory Control — Java + MySQL',
                    description: 'Desktop system with Swing interface for complete inventory control with user registration and MySQL integration.',
                    image_url: 'https://placehold.co/600x400/0B0C10/66FCF1?text=Java+Inventory',
                    repo_link: 'https://github.com/pedrhenriqueol/Projetos-Java',
                    demo_link: null,
                    tags: ['Java', 'MySQL', 'Swing'],
                },
                {
                    id: 5,
                    title: 'Task API — Python + Flask',
                    description: 'RESTful API with GET, POST, PUT, and DELETE routes made with Python and Flask. Features an integrated frontend with HTML, CSS, and JavaScript.',
                    image_url: 'https://placehold.co/600x400/0B0C10/45A29E?text=Flask+API',
                    repo_link: 'https://github.com/pedrhenriqueol/API-Python',
                    demo_link: null,
                    tags: ['Python', 'Flask', 'REST API'],
                },
                {
                    id: 6,
                    title: 'Password Generator — Python',
                    description: 'Python desktop application with Tkinter interface. Uses random, string, and pyperclip libraries for practical password generation and copying.',
                    image_url: 'https://placehold.co/600x400/0B0C10/C5C6C7?text=Password+Gen',
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
            developer: 'Desarrollador',
            role: 'Fullstack',
            description: 'Especialista en modernización de sistemas heredados y desarrollo de soluciones escalables usando',
            verProjetos: 'Ver Proyectos',
            terminal: {
                role: 'Fullstack Dev',
                available: 'available: true, ✓'
            }
        },
        about: {
            title: 'Sobre Mí',
            resumoTitle: 'Resumen Profesional',
            resumo1: 'Desarrollador Fullstack en pasantía con',
            resumo1_highlight1: '10+ meses',
            resumo1_rest: 'de experiencia práctica en sistemas POS/ERP de alta carga, actuando directamente en producción con más de',
            resumo1_highlight2: '100 usuarios diarios.',
            resumo2: 'Especializado en',
            resumo2_rest: 'Tengo experiencia en optimizaciones críticas de bases de datos, reduciendo el tiempo de respuesta de consultas de',
            resumo2_highlight: '2 s → < 500 ms',
            resumo2_final: 'vía indexación y refactorización de consultas N+1.',
            resumo3: 'He integrado componentes fiscales (ACBR) y de reportes (FortesReport) en ambientes de producción, asegurando cumplimiento legal en',
            resumo3_highlight: '100%',
            resumo3_final: 'de las transacciones procesadas.',
            resumo4: 'Actualmente también me desempeño como',
            resumo4_highlight1: 'Analista de QA',
            resumo4_rest: 'en SETE Tecnología, aplicando ingeniería de requisitos y pruebas funcionales en sistemas de misión crítica (logística portuaria / ZPEs), usando',
            resumo4_highlight2: 'Postman, SQL Server y Scrum/Kanban.',
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
            title: 'Experiencia Profesional',
            subtitle: 'Mi trayectoria en el desarrollo de software y el mercado.',
            empty: 'Aún no hay experiencia registrada.',
            list: [
                {
                    id: 2,
                    company: 'SETE Tecnologia',
                    role: 'Analista de Aseguramiento de Calidad (QA) — Pasantía',
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
                                'Reducción del 25% en bugs críticos en producción mediante validación anticipada antes del deploy.',
                            ],
                        },
                    ],
                },
                {
                    id: 1,
                    company: 'Qualisoft Sistemas',
                    role: 'Desarrollador Fullstack (Pasantía)',
                    period: 'Ago 2025 - Presente',
                    techBadges: ['Delphi 11', 'UniGui', 'Laravel', 'React', 'TypeScript', 'Tailwind CSS', 'SQL Server', 'MySQL'],
                    groups: [
                        {
                            title: 'Modernización & Arquitectura Heredada',
                            icon: 'fas fa-layer-group',
                            items: [
                                'Ingeniería inversa y mantenimiento de ERP monolítico en Delphi 6 (100+ usuarios diarios), liderando preparación arquitectónica para migración web con Delphi 11 y UniGui.',
                                'Optimización crítica de rendimiento en bases de datos (SQL Server/MySQL en la nube), reduciendo tiempo de respuesta de búsquedas de 2s a <500ms vía indexación.',
                                'Estabilización de entorno heredado, resolviendo cuellos de botella de memoria y bugs en componentes TDBGrid, TClientDataSet y BDE (Paradox), eliminando fallos de producción.',
                            ],
                        },
                        {
                            title: 'Desarrollo Web Full-Stack',
                            icon: 'fas fa-globe',
                            items: [
                                'Desarrollo y escalado de plataformas Multi-tenant desde cero (Backoffice ERP y Portal de Conglomerados) construidas con PHP (Laravel), React y TypeScript.',
                                'Modernización de interfaces UI/UX con Tailwind CSS, reemplazando paneles obsoletos con una reducción del 40% en bugs visuales reportados al soporte.',
                                'Integración de módulos complejos de automatización comercial (Proyecto ACBr y FortesReport), garantizando cumplimiento fiscal en todas las transacciones.',
                            ],
                        },
                    ],
                }
            ]
        },
        skills: {
            title: 'Habilidades y Tecnologías',
            subtitle: 'Herramientas y lenguajes que domino y uso diariamente.',
            levels: {
                5: 'Experto',
                4: 'Avanzado',
                3: 'Intermedio',
                2: 'Básico'
            },
            list: [
                { id: 1,  name: 'PHP',                icon_class: 'fab fa-php',       category: 'Back-end',  level: 4 },
                { id: 2,  name: 'Laravel',            icon_class: 'fab fa-laravel',   category: 'Back-end',  level: 4 },
                { id: 3,  name: 'Delphi / UniGui',    icon_class: 'fas fa-desktop',   category: 'Back-end',  level: 5 },
                { id: 13, name: 'Node.js',            icon_class: 'fab fa-node-js',   category: 'Back-end',  level: 3 },
                { id: 5,  name: 'React',              icon_class: 'fab fa-react',     category: 'Front-end', level: 4 },
                { id: 4,  name: 'TypeScript',         icon_class: 'fab fa-js',        category: 'Front-end', level: 4 },
                { id: 8,  name: 'Tailwind CSS',       icon_class: 'fab fa-css3-alt',  category: 'Front-end', level: 4 },
                { id: 11, name: 'HTML / CSS',         icon_class: 'fab fa-html5',     category: 'Front-end', level: 5 },
                { id: 7,  name: 'MySQL',              icon_class: 'fas fa-database',  category: 'Database',  level: 4 },
                { id: 14, name: 'SQL Server',         icon_class: 'fas fa-server',    category: 'Database',  level: 4 },
                { id: 15, name: 'PostgreSQL',         icon_class: 'fas fa-database',  category: 'Database',  level: 3 },
                { id: 9,  name: 'Git / GitHub',       icon_class: 'fab fa-git-alt',   category: 'DevOps',    level: 4 },
                { id: 12, name: 'Docker',             icon_class: 'fab fa-docker',    category: 'DevOps',    level: 3 },
                { id: 6,  name: 'Java',              icon_class: 'fab fa-java',       category: 'Otros',     level: 3 },
                { id: 10, name: 'Python',            icon_class: 'fab fa-python',     category: 'Otros',     level: 3 },
            ]
        },
        projects: {
            title: 'Proyectos Destacados',
            subtitle: 'Soluciones desarrolladas para resolver problemas reales y aplicar nuevos conocimientos.',
            btnRepo: 'Ver Repositorio',
            btnDemo: 'Ver Demo',
            btnDetails: 'Detalles',
            modalVoltar: 'Volver',
            modalPrincipais: 'Características Principales',
            list: [
                {
                    id: 1,
                    title: 'Backoffice ERP',
                    description: 'Desarrollo full-stack de un módulo administrativo robusto para la gestión de ERP/POS. Arquitectura dividida entre una API RESTful en Laravel y una SPA cliente en React + TypeScript.',
                    image_url: 'https://placehold.co/600x400/1F2833/66FCF1?text=Backoffice+ERP',
                    repo_link: null,
                    demo_link: null,
                    tags: ['Laravel', 'React', 'TypeScript', 'Tailwind CSS', 'API REST'],
                    details: {
                        subtitle: 'Módulo Administrativo Full-Stack — ERP/POS',
                        fullDescription: 'Desarrollo full-stack de un módulo administrativo robusto para gestión ERP/POS. La arquitectura se dividió entre una API RESTful en Laravel y una aplicación cliente en React y TypeScript. El enfoque fue crear una interfaz moderna y altamente responsiva con Tailwind CSS.',
                        highlights: [
                            'Arquitectura desacoplada: API RESTful (Laravel) + SPA (React + TypeScript)',
                            'Interfaz 100% responsiva y accesible construida con Tailwind CSS',
                            'Gestión de inventario en tiempo real con retroalimentación inmediata',
                            'Control de cuentas por cobrar con filtros avanzados y reportes',
                            'Integración con componentes fiscales (ACBR) para emisión de facturas',
                            'Autenticación y autorización vía Laravel Sanctum con control de sesión',
                        ],
                    },
                },
                {
                    id: 2,
                    title: 'Portal Conglomerados',
                    description: 'Plataforma Multi-tenant para gestión centralizada de múltiples unidades de negocio. Implementación de RBAC (Control de Acceso Basado en Roles) y dashboards interactivos en React.',
                    image_url: 'https://placehold.co/600x400/1F2833/45A29E?text=Conglomerados',
                    repo_link: null,
                    demo_link: null,
                    tags: ['Laravel', 'React', 'Multi-tenant', 'RBAC', 'Dashboard'],
                    details: {
                        subtitle: 'Plataforma Multi-tenant de Gestión Empresarial',
                        fullDescription: 'Diseño e implementación de una plataforma de gestión con arquitectura Multi-tenant, permitiendo operar múltiples unidades de negocio en un solo ecosistema. El dashboard consolida datos dispersos, ofreciendo métricas en tiempo real.',
                        highlights: [
                            'Arquitectura Multi-tenant: separación lógica de datos por empresa en BD',
                            'RBAC (Control de Acceso Basado en Roles) estricto',
                            'Dashboards interactivos en React para visualización de grandes volúmenes de datos',
                            'API RESTful en Laravel con endpoints protegidos por políticas y gates',
                            'Consultas optimizadas para cruce de datos multi-sucursal con baja latencia',
                            'Diseño escalable: adición de nuevas sucursales sin cambiar estructura de código',
                        ],
                    },
                },
                {
                    id: 3,
                    title: 'Migración Delphi → UniGui Web',
                    description: 'Ingeniería de modernización de sistema monolítico heredado (Delphi 6 Desktop/VCL) a arquitectura Web nativa con Delphi 11 + UniGui, manteniendo cumplimiento fiscal total.',
                    image_url: 'https://placehold.co/600x400/1F2833/C5C6C7?text=Migración+Heredado',
                    repo_link: null,
                    demo_link: null,
                    tags: ['Delphi 11', 'UniGui', 'ACBr', 'FortesReport', 'JVCL'],
                    details: {
                        subtitle: 'Modernización de Sistema Monolítico Heredado',
                        fullDescription: 'Ingeniería de modernización de un sistema comercial monolítico heredado (Desktop/VCL en Delphi 6) a arquitectura Web nativa usando RAD Studio Delphi 11 y UniGui. El proyecto requirió una conversión profunda de interfaces y manejo de estado.',
                        highlights: [
                            'Conversión completa de VCL a UniGui Web manteniendo lógica de negocio',
                            'Actualización de componentes fiscales críticos (ACBr) para emisión web',
                            'Migración y adaptación de generadores de reportes (FortesReport) en servidor',
                            'Adaptación de control de concurrencia y sesiones de usuarios',
                            'Resolución de conflictos de bibliotecas heredadas (JEDI — JCL/JVCL)',
                            'Resultado: compilación limpia, estabilidad y 40% menos bugs visuales',
                        ],
                    },
                },
                {
                    id: 4,
                    title: 'Control de Inventario — Java + MySQL',
                    description: 'Sistema de escritorio con interfaz Swing para control de inventario con registro de usuarios e integración con MySQL.',
                    image_url: 'https://placehold.co/600x400/0B0C10/66FCF1?text=Java+Inventario',
                    repo_link: 'https://github.com/pedrhenriqueol/Projetos-Java',
                    demo_link: null,
                    tags: ['Java', 'MySQL', 'Swing'],
                },
                {
                    id: 5,
                    title: 'API de Tareas — Python + Flask',
                    description: 'API RESTful con rutas GET, POST, PUT y DELETE hecha con Python y Flask. Posee frontend integrado con HTML, CSS y JS.',
                    image_url: 'https://placehold.co/600x400/0B0C10/45A29E?text=API+Flask',
                    repo_link: 'https://github.com/pedrhenriqueol/API-Python',
                    demo_link: null,
                    tags: ['Python', 'Flask', 'API REST'],
                },
                {
                    id: 6,
                    title: 'Generador de Contraseñas — Python',
                    description: 'Aplicación de escritorio en Python con interfaz Tkinter. Utiliza bibliotecas random, string y pyperclip para generar contraseñas seguras.',
                    image_url: 'https://placehold.co/600x400/0B0C10/C5C6C7?text=Generador+Claves',
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
        }
    }
};
