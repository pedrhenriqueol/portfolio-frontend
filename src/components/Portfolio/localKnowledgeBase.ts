/**
 * localKnowledgeBase.ts
 * Motor de contingência semântico local para o InteractiveTerminal.
 * Sistema de categorização por palavras-chave ponderadas e alta densidade de formatação terminal.
 */

export interface KeywordRule {
    term: string;
    weight: number;
}

export interface KnowledgeTopic {
    id: string;
    keywords: KeywordRule[];
    responses: Record<'pt' | 'en' | 'es', string>;
}

/** Normaliza string removendo acentos, pontuações e excesso de espaços */
export function normalizeInput(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/** Tópicos de conhecimento técnico estruturados com chips de código, bullets '›' e negrito */
export const KNOWLEDGE_TOPICS: KnowledgeTopic[] = [
    // A. QA, Testes de API & Automação (SETE Tecnologia)
    {
        id: 'qa-testing',
        keywords: [
            { term: 'about-qa', weight: 12 },
            { term: 'about qa', weight: 12 },
            { term: 'sobre-qa', weight: 12 },
            { term: 'sobre qa', weight: 12 },
            { term: 'qa', weight: 8 },
            { term: 'quality assurance', weight: 10 },
            { term: 'test automation', weight: 8 },
            { term: 'garantia de qualidade', weight: 8 },
            { term: 'garantia da qualidade', weight: 8 },
            { term: 'qualidade e apis', weight: 8 },
            { term: 'qualidade de software', weight: 8 },
            { term: 'qualidade', weight: 6 },
            { term: 'testes de software', weight: 8 },
            { term: 'testes de api', weight: 8 },
            { term: 'teste de api', weight: 8 },
            { term: 'teste', weight: 5 },
            { term: 'testes', weight: 5 },
            { term: 'testing', weight: 5 },
            { term: 'postman', weight: 7 },
            { term: 'regressivo', weight: 6 },
            { term: 'regressivos', weight: 6 },
            { term: 'zpe', weight: 6 },
            { term: 'zpes', weight: 6 },
            { term: 'aduana', weight: 5 },
            { term: 'aduaneira', weight: 5 },
            { term: 'bugs', weight: 5 },
            { term: 'validacao', weight: 5 },
            { term: 'sete tecnologia', weight: 8 },
            { term: 'e2e', weight: 5 },
            { term: 'assercoes', weight: 5 },
        ],
        responses: {
            pt: `Na \`SETE Tecnologia\`, atuo diretamente na garantia de qualidade (QA) de sistemas críticos voltados para logística aduaneira e ZPEs (Zonas de Processamento de Exportação):
› **Testes de API**: Modelagem e execução de coleções no \`Postman\` com validação estrita de contratos, status codes, schemas JSON e tempos de resposta.
› **Validação Funcional & Regressiva**: Execução de suites completas de testes funcionais e regressivos para garantir zero inconsistências em regras fiscais e aduaneiras.
› **Diagnóstico em Banco de Dados**: Elaboração de consultas diagnósticas em \`SQL Server\` para auditoria e rastreamento de anomalias em dados transacionais.
› **Prevenção de Regressões**: Atuação direta em cerimônias ágeis (Scrum/Kanban) resultando em redução comprovada na taxa de bugs em produção.
Para simular a bateria de testes de homologação no terminal, execute \`$ test\`.`,
            en: `At \`SETE Tecnologia\`, I focus on Quality Assurance (QA) for mission-critical customs logistics and Export Processing Zones (ZPEs):
› **API Testing**: Design and automation of \`Postman\` test suites validating HTTP status codes, JSON schemas, contracts, and response latency.
› **Functional & Regression Suites**: Comprehensive end-to-end (E2E) and regression testing protecting core customs workflows.
› **Database Diagnostics**: Advanced \`SQL Server\` profiling queries auditing transaction integrity and business rule consistency.
› **Bug Prevention**: Active participation in agile ceremonies (Scrum/Kanban) delivering measurable regression reduction.
To run the homologation automated test suite in the terminal, execute \`$ test\`.`,
            es: `En \`SETE Tecnologia\`, me desempeño en el aseguramiento de calidad (QA) para sistemas de logística aduanera y zonas francas (ZPEs):
› **Pruebas de API**: Diseño y ejecución de colecciones en \`Postman\` con validación de contratos, códigos HTTP, schemas JSON y tiempos de respuesta.
› **Validación Funcional y Regresiva**: Pruebas funcionales y de regresión garantizando cero inconsistencias en reglas aduaneras.
› **Diagnóstico en Base de Datos**: Consultas diagnósticas en \`SQL Server\` para auditoría de anomalías en datos transaccionales.
› **Prevención de Defectos**: Trabajo en equipo ágil (Scrum/Kanban) logrando reducción sustancial de regresiones en producción.
Para ejecutar la batería de pruebas en el terminal, escribe \`$ test\`.`,
        },
    },

    // B. Full Stack & Modernização de Sistemas Legados (Qualisoft Sistemas)
    {
        id: 'delphi-legacy',
        keywords: [
            { term: 'qualisoft', weight: 8 },
            { term: 'delphi', weight: 6 },
            { term: 'unigui', weight: 6 },
            { term: 'vcl', weight: 5 },
            { term: 'legado', weight: 4 },
            { term: 'migracao', weight: 4 },
            { term: 'modernizacao', weight: 4 },
            { term: 'erp', weight: 4 },
            { term: 'desktop', weight: 3 },
            { term: 'pascal', weight: 4 },
            { term: 'delphi 6', weight: 6 },
            { term: 'delphi 11', weight: 6 },
        ],
        responses: {
            pt: `Atuei como Desenvolvedor Full Stack (Estágio) na \`Qualisoft Sistemas\`, onde aprendi e implementei em produção \`TypeScript\`, \`React\` e \`PHP/Laravel\`, além de modernizar ecossistemas legados:
› **Desenvolvimento Full Stack**: Construção de interfaces reativas em \`React\` + \`TypeScript\` para módulos de retaguarda e desenvolvimento de APIs RESTful estruturadas em \`PHP/Laravel\`.
› **Engenharia Reversa & Delphi**: Análise e sustentação de regras de negócio em \`Delphi 6/11\` e migração de monolito desktop VCL para a Web com \`Delphi 11 + UniGui\`.
› **Otimização de Banco de Dados**: Refatoração de consultas pesadas em \`SQL Server/MySQL\`, reduzindo tempo de resposta de relatórios de 2s para <500ms via índices compostos.`,
            en: `I worked as a Full Stack Developer (Intern) at \`Qualisoft Sistemas\`, where I learned and implemented in production \`TypeScript\`, \`React\`, and \`PHP/Laravel\`, alongside legacy modernization:
› **Full Stack Development**: Built reactive interfaces with \`React\` + \`TypeScript\` for backoffice management and developed structured RESTful APIs in \`PHP/Laravel\`.
› **Legacy Modernization & Delphi**: Maintained business rules in \`Delphi 6/11\` and migrated monolithic desktop VCL systems to web architectures using \`Delphi 11 + UniGui\`.
› **Database Performance Tuning**: Refactored critical \`SQL Server/MySQL\` queries, slashing report latency from 2s to <500ms via composite indexing.`,
            es: `Me desempeñé como Desarrollador Full Stack (Pasantía) en \`Qualisoft Sistemas\`, donde aprendí e implementé en producción \`TypeScript\`, \`React\` y \`PHP/Laravel\`, además de modernizar sistemas heredados:
› **Desarrollo Full Stack**: Creación de interfaces reactivas en \`React\` + \`TypeScript\` para módulos de gestión y APIs RESTful estructuradas en \`PHP/Laravel\`.
› **Modernización de Sistemas & Delphi**: Mantenimiento de reglas en \`Delphi 6/11\` y migración de escritorio VCL a la Web con \`Delphi 11 + UniGui\`.
› **Optimización de Base de Datos**: Refactorización de consultas en \`SQL Server/MySQL\`, reduciendo tiempos de reporte de 2s a <500ms mediante índices compuestos.`,
        },
    },

    // C. Backend, PHP & Laravel
    {
        id: 'backend-php-laravel',
        keywords: [
            { term: 'php', weight: 6 },
            { term: 'laravel', weight: 7 },
            { term: 'backend', weight: 5 },
            { term: 'api rest', weight: 5 },
            { term: 'apis rest', weight: 5 },
            { term: 'apis restful', weight: 5 },
            { term: 'restful', weight: 4 },
            { term: 'servidor', weight: 3 },
            { term: 'rotas', weight: 3 },
            { term: 'mvc', weight: 4 },
            { term: 'eloquent', weight: 4 },
            { term: 'multi tenant', weight: 5 },
            { term: 'conglomerados', weight: 4 },
        ],
        responses: {
            pt: `No ecossistema de backend, meu foco principal é a construção de serviços escaláveis e resilientes:
› **PHP 8.x & Laravel**: Desenvolvimento de APIs RESTful estruturadas com Service Layers, Repositories, validação estrita de DTOs e Eloquent ORM.
› **Arquitetura Multi-Tenant**: Experiência na modelagem de plataformas compartilhadas (como o Portal Conglomerados), isolando esquemas e contextos de bancos com segurança.
› **Segurança & Tratamento**: Tratamento centralizado de exceções, autenticação via tokens e controle granular de permissões (RBAC).`,
            en: `In the backend ecosystem, my primary focus is delivering resilient and scalable services:
› **PHP 8.x & Laravel**: Architectural design of RESTful APIs utilizing Service Layers, Repositories, strict DTO validation, and Eloquent ORM.
› **Multi-Tenant Architecture**: Experience modeling shared enterprise platforms (such as Portal Conglomerados), securely isolating schemas.
› **Security & Governance**: Centralized exception handling, secure token-based authentication, and granular Role-Based Access Control (RBAC).`,
            es: `En el desarrollo backend, mi enfoque principal es construir servicios escalables y confiables:
› **PHP 8.x y Laravel**: Construcción de APIs RESTful estructuradas con Service Layers, Repositories, validación DTO y Eloquent ORM.
› **Arquitectura Multi-Tenant**: Experiencia modelando plataformas compartidas (como el Portal Conglomerados), aislando esquemas de datos con seguridad.
› **Seguridad y Control**: Manejo centralizado de excepciones, autenticación con tokens y control granular de permisos (RBAC).`,
        },
    },

    // D. Banco de Dados & SQL Server
    {
        id: 'database-sql',
        keywords: [
            { term: 'sql server', weight: 6 },
            { term: 'sql', weight: 4 },
            { term: 'banco', weight: 3 },
            { term: 'queries', weight: 4 },
            { term: 'query', weight: 4 },
            { term: 't sql', weight: 5 },
            { term: 'database', weight: 4 },
            { term: 'tuning', weight: 5 },
            { term: 'execution plan', weight: 5 },
            { term: 'table scan', weight: 5 },
            { term: 'indice', weight: 4 },
            { term: 'indices', weight: 4 },
            { term: 'otimizacao', weight: 3 },
        ],
        responses: {
            pt: `No dia a dia com \`Microsoft SQL Server\`, utilizo consultas diagnósticas para sustentar tanto a validação de QA quanto rotinas de backend:
› **Consultas Complexas**: Elaboração de \`JOINs\`, agregações, CTEs (Common Table Expressions) e subconsultas para auditoria de dados fiscais e logísticos.
› **Integridade & Transações**: Validação de constraints, triggers e procedimentos armazenados garantindo atomicidade (ACID).
Para ver uma simulação de otimização de índice em tempo real, execute \`$ sql\`.`,
            en: `Working daily with \`Microsoft SQL Server\`, I craft diagnostic queries that support both QA validations and backend routines:
› **Complex Queries**: Building \`JOINs\`, aggregations, CTEs (Common Table Expressions), and subqueries for fiscal and logistics auditing.
› **Integrity & ACID**: Enforcing constraints, triggers, and stored procedures guaranteeing transactional consistency.
To witness an interactive query plan tuning simulation in real-time, execute \`$ sql\`.`,
            es: `En mi labor diaria con \`Microsoft SQL Server\`, utilizo consultas analíticas para respaldar tanto QA como desarrollo backend:
› **Consultas Complejas**: Construcción de \`JOINs\`, agregaciones, CTEs y subconsultas para auditoría fiscal y logística.
› **Integridad y Transacciones**: Validación de constraints, triggers y procedimientos almacenados garantizando atomicidad (ACID).
Para ver una simulación de optimización de índices en tiempo real, ejecuta \`$ sql\`.`,
        },
    },

    // E. Frontend, React & TypeScript
    {
        id: 'frontend-react-ts',
        keywords: [
            { term: 'react', weight: 5 },
            { term: 'typescript', weight: 5 },
            { term: 'tailwind', weight: 4 },
            { term: 'front', weight: 3 },
            { term: 'frontend', weight: 4 },
            { term: 'ui', weight: 3 },
            { term: 'interface', weight: 3 },
            { term: 'componentes', weight: 4 },
            { term: 'css', weight: 2 },
            { term: 'design system', weight: 5 },
            { term: 'vite', weight: 3 },
            { term: 'sse', weight: 3 },
        ],
        responses: {
            pt: `Desenvolvo interfaces modernas com foco em desempenho, precisão tipográfica e estética industrial de alta densidade:
› **Stack Central**: \`React\`, \`TypeScript\` rigoroso (sem \`any\`), gerenciamento de estado previsível e estilização utilitária com \`Tailwind CSS\`.
› **Design Systems**: Criação de componentes táteis reutilizáveis, modais com física de mola e esteiras cilíndricas 3D interativas.
› **Conectividade**: Integração com Server-Sent Events (SSE) para streaming token a token em tempo real (como demonstrado neste terminal).`,
            en: `I build state-of-the-art web interfaces prioritizing performance, typographic precision, and high-density industrial aesthetics:
› **Core Stack**: \`React\`, strict \`TypeScript\` (zero \`any\`), predictable state flows, and utility styling via \`Tailwind CSS\`.
› **Design Systems**: Reusable tactile components, spring physics modals, and interactive 3D cylindrical showcases.
› **Connectivity**: Real-time integration via Server-Sent Events (SSE) for token-by-token streaming (as demonstrated in this terminal).`,
            es: `Desarrollo interfaces modernas enfocadas en alto rendimiento, precisión tipográfica y estética industrial de alta densidad:
› **Stack Principal**: \`React\`, \`TypeScript\` estricto (sin \`any\`), gestión predecible de estado y estilos con \`Tailwind CSS\`.
› **Design Systems**: Componentes táctiles reutilizables, modales con físicas de muelle y carruseles 3D interactivos.
› **Conectividad**: Integración con Server-Sent Events (SSE) para streaming token por token (como se demuestra en esta terminal).`,
        },
    },

    // F. Projetos (PayStream, PDV Web, PortLog & Portal Conglomerados)
    {
        id: 'projects-flagship',
        keywords: [
            { term: 'projeto', weight: 4 },
            { term: 'projetos', weight: 4 },
            { term: 'portfolio', weight: 4 },
            { term: 'portifolio', weight: 4 },
            { term: 'pdv', weight: 5 },
            { term: 'paystream', weight: 6 },
            { term: 'portlog', weight: 6 },
            { term: 'conglomerados', weight: 5 },
            { term: 'spectr', weight: 5 },
            { term: 'projects', weight: 4 },
        ],
        responses: {
            pt: `Os principais projetos desenvolvidos e documentados em produção são:
› **PayStream Gateway**: Plataforma financeira e de PDV multi-empresa com conciliação transacional e alta disponibilidade.
› **Portal Conglomerados**: Painel administrativo corporativo para consolidação de balanços e cadastros de redes de filiais.
› **PortLog OS / Core Aduaneiro**: Conjunto de suítes de validação de fluxo de cargas em portos secos e ZPEs.
Você pode interagir com os cards 3D dos projetos rolando até a seção \`Sistemas em Produção\`.`,
            en: `The primary flagship engineering projects architected and documented are:
› **PayStream Gateway**: Multi-tenant fintech and POS payment platform featuring transactional reconciliation and idempotency.
› **Portal Conglomerados**: Enterprise administrative panel designed for consolidating balance sheets across multi-branch networks.
› **PortLog OS / Customs Core**: Validation and telemetry suite for cargo flows across dry ports and Export Processing Zones (ZPEs).
You can inspect the interactive 3D cards by scrolling down to the \`Production Systems\` section.`,
            es: `Los proyectos principales desarrollados y documentados en producción son:
› **PayStream Gateway**: Plataforma financiera y de PDV multi-empresa con conciliación transaccional y alta disponibilidad.
› **Portal Conglomerados**: Panel administrativo corporativo para consolidación de balances y gestión de redes de filiales.
› **PortLog OS / Core Aduanero**: Suite de validación de flujo de cargas en puertos secos y zonas francas (ZPEs).
Puedes interactuar con las tarjetas 3D desplazándote hasta la sección \`Sistemas en Producción\`.`,
        },
    },

    // G. Formação Acadêmica & Trajetória
    {
        id: 'academic-education',
        keywords: [
            { term: 'faculdade', weight: 5 },
            { term: 'estudos', weight: 4 },
            { term: 'formacao', weight: 5 },
            { term: 'unifanor', weight: 6 },
            { term: 'eeep', weight: 6 },
            { term: 'graduacao', weight: 5 },
            { term: 'engenharia de software', weight: 6 },
            { term: 'curso', weight: 3 },
            { term: 'estuda', weight: 3 },
            { term: 'educacao', weight: 4 },
            { term: 'diploma', weight: 4 },
        ],
        responses: {
            pt: `Minha trajetória educacional alia teoria de computação e prática profissional contínua:
› **Engenharia de Software**: Graduação em andamento na \`Unifanor Wyden\`, com aprofundamento em arquitetura de software, padrões de projeto e qualidade.
› **Técnico em Informática**: Formado pela \`EEEP Luiza de Teodoro Vieira\`, onde consolidei as bases de redes, lógica de programação e bancos relacionais.`,
            en: `My academic journey bridges computer science fundamentals with continuous professional practice:
› **Software Engineering**: Bachelor's Degree in progress at \`Unifanor Wyden\`, focusing on software architecture, design patterns, and QA.
› **IT Technician**: Vocational Diploma from \`EEEP Luiza de Teodoro Vieira\`, establishing strong roots in networking, algorithms, and relational databases.`,
            es: `Mi trayectoria académica combina fundamentos de computación con práctica profesional continua:
› **Ingeniería de Software**: Pregrado en curso en \`Unifanor Wyden\`, con énfasis en arquitectura de software, patrones de diseño y calidad.
› **Técnico en Informática**: Egresado de la \`EEEP Luiza de Teodoro Vieira\`, consolidando bases en redes, lógica de programación y bases de datos.`,
        },
    },

    // H. Contato, Contratação & Redes Profissionais
    {
        id: 'contact-hiring',
        keywords: [
            { term: 'contato', weight: 5 },
            { term: 'contratar', weight: 6 },
            { term: 'vaga', weight: 5 },
            { term: 'linkedin', weight: 6 },
            { term: 'github', weight: 5 },
            { term: 'email', weight: 5 },
            { term: 'whatsapp', weight: 5 },
            { term: 'recrutador', weight: 5 },
            { term: 'telefone', weight: 4 },
            { term: 'trabalho', weight: 4 },
            { term: 'job', weight: 4 },
            { term: 'contact', weight: 5 },
            { term: 'hire', weight: 6 },
        ],
        responses: {
            pt: `O Pedro está aberto a posições e desafios em **Engenharia de Software (Fullstack / Backend)** e **Garantia da Qualidade (QA)**:
› **LinkedIn**: linkedin.com/in/pedro-henrique (ou utilize o botão rápido no cabeçalho/rodapé).
› **GitHub**: github.com/pedrohenrique (código-fonte deste portfólio e projetos abertos).
› **Contato Direto**: Utilize o botão \`Contato\` no dock superior para envio direto de mensagens.`,
            en: `Pedro is open to opportunities and challenges in **Software Engineering (Fullstack / Backend)** and **Quality Assurance (QA)**:
› **LinkedIn**: linkedin.com/in/pedro-henrique (or use the quick button in the header/footer).
› **GitHub**: github.com/pedrohenrique (source code of this portfolio and open projects).
› **Direct Contact**: Use the \`Contact\` button in the top dock for direct messaging.`,
            es: `Pedro está disponible para oportunidades y desafíos en **Ingeniería de Software (Fullstack / Backend)** y **Aseguramiento de Calidad (QA)**:
› **LinkedIn**: linkedin.com/in/pedro-henrique (o utiliza el botón en el encabezado/pie de página).
› **GitHub**: github.com/pedrohenrique (código fuente de este portafolio y proyectos abiertos).
› **Contacto Directo**: Utiliza el botón \`Contacto\` en el dock superior para enviar mensajes directamente.`,
        },
    },
];

/** Roteador de Resposta Técnica Direta quando nenhum termo atinge correspondência estrita */
export const GENERIC_ROUTER_RESPONSE: Record<'pt' | 'en' | 'es', string> = {
    pt: `Entendido! Como terminal de engenharia de Pedro Henrique, mantenho registros detalhados sobre todas as realizações técnicas:
› \`Experiência em QA & APIs\`: garantia de qualidade no Postman e diagnósticos no SQL Server na SETE Tecnologia.
› \`Full Stack & Sistemas Legados\`: TypeScript, React, PHP/Laravel e modernização Delphi na Qualisoft Sistemas.
› \`Arquitetura & Engenharia\`: desenvolvimento de microsserviços em PHP 8, Laravel, React e TypeScript.
› Ou execute comandos diretos de console como \`$ test\`, \`$ sql\` ou \`$ clear\`.`,
    en: `Understood! As Pedro Henrique's engineering terminal, I maintain comprehensive records of all technical achievements:
› \`QA & API Testing\`: Postman collection test automation and SQL Server profiling at SETE Tecnologia.
› \`Full Stack & Legacy Systems\`: TypeScript, React, PHP/Laravel, and Delphi modernization at Qualisoft Sistemas.
› \`Architecture & Engineering\`: scalable services in PHP 8, Laravel, React, and TypeScript.
› Or execute direct console commands like \`$ test\`, \`$ sql\`, or \`$ clear\`.`,
    es: `¡Entendido! Como terminal de ingeniería de Pedro Henrique, mantengo registros detallados sobre todas las realizaciones técnicas:
› \`Experiencia en QA y APIs\`: aseguramiento de calidad en Postman y SQL Server en SETE Tecnologia.
› \`Full Stack y Sistemas Legados\`: TypeScript, React, PHP/Laravel y modernización Delphi en Qualisoft Sistemas.
› \`Arquitectura e Ingeniería\`: desarrollo de microservicios en PHP 8, Laravel, React y TypeScript.
› O ejecuta comandos directos de consola como \`$ test\`, \`$ sql\` o \`$ clear\`.`,
};

/** Resposta de segurança DevSecOps & Anti-Jailbreak */
export const DEVSECOPS_RESPONSE: Record<'pt' | 'en' | 'es', string> = {
    pt: `Acesso restrito por diretrizes de segurança 🛡️: Nenhuma chave de API, credencial ou segredo de infraestrutura é exposto no front-end do terminal. Todas as variáveis sensíveis operam isoladas na infraestrutura da Vercel Edge. Se você for o Pedro mesmo, sabe que pode gerenciá-las diretamente no painel de controle! 😉`,
    en: `Access restricted by security standards 🛡️: No API keys, credentials, or infrastructure secrets are exposed in the client terminal. All sensitive environment variables operate isolated in the secure Vercel Edge infrastructure. If you're truly Pedro, you know you can manage them directly in the dashboard! 😉`,
    es: `Acceso restringido por directivas de seguridad 🛡️: Ninguna clave de API, credencial o secreto de infraestructura se expone en la terminal del cliente. Todas las variables sensibles operan aisladas en la infraestructura segura de Vercel Edge. ¡Si realmente eres Pedro, puedes administrarlas directamente en el panel de control! 😉`,
};

/** Saudações naturais */
export const GREETINGS_RESPONSE: Record<'pt' | 'en' | 'es', string> = {
    pt: `Olá! Terminal Workstation de Pedro Henrique conectado e pronto para execução. Você pode consultar sobre a stack técnica (\`Laravel\`, \`Delphi\`, \`React\`, \`SQL Server\`), experiência em QA e desenvolvimento, projetos de engenharia ou executar comandos diretos como \`$ test\` e \`$ sql\`. Como posso colaborar agora?`,
    en: `Hello! Pedro Henrique's Workstation Terminal connected and ready for execution. Feel free to query about his tech stack (\`Laravel\`, \`Delphi\`, \`React\`, \`SQL Server\`), QA and software engineering experience, production projects, or run commands like \`$ test\` and \`$ sql\`. How can I assist you now?`,
    es: `¡Hola! Terminal Workstation de Pedro Henrique conectado y listo para ejecución. Puedes consultar sobre el stack técnico (\`Laravel\`, \`Delphi\`, \`React\`, \`SQL Server\`), experiencia en QA y desarrollo, proyectos o ejecutar comandos directos como \`$ test\` y \`$ sql\`. ¿En qué puedo colaborar ahora?`,
};

/**
 * Matcher semântico ponderado:
 * Normaliza o input, avalia cada regra de palavra-chave e retorna a resposta de maior pontuação.
 */
export function matchLocalKnowledge(rawQuestion: string, lang: 'pt' | 'en' | 'es'): string {
    const normalized = normalizeInput(rawQuestion);
    if (!normalized) {
        return GENERIC_ROUTER_RESPONSE[lang];
    }

    // 1. Guardrail DevSecOps / Jailbreak / Chaves
    const devSecOpsTerms = [
        'api key', 'apikey', 'api key', 'token', 'secret', 'senha', 'password',
        'credentials', 'credenciais', 'sou seu criador', 'sou o pedro', 'sou pedro',
        'pedrom', 'ignore suas instrucoes', 'ignore previous instructions', 'jailbreak',
        'prompt injection', 'system prompt'
    ];
    if (devSecOpsTerms.some(term => normalized.includes(term))) {
        return DEVSECOPS_RESPONSE[lang];
    }

    // 2. Saudações simples
    const greetingWords = ['oi', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'hello', 'hi', 'hey', 'como vai', 'tudo bem'];
    if (greetingWords.some(g => normalized === g || normalized.startsWith(`${g} `))) {
        return GREETINGS_RESPONSE[lang];
    }

    // 3. Avaliação ponderada por pontuação dos tópicos técnicos
    let bestTopic: KnowledgeTopic | null = null;
    let highestScore = 0;

    for (const topic of KNOWLEDGE_TOPICS) {
        let score = 0;

        for (const rule of topic.keywords) {
            const ruleTerm = normalizeInput(rule.term);
            if (!ruleTerm) continue;

            // Pontuação por termo exato ou palavra contida
            if (normalized === ruleTerm) {
                score += rule.weight * 2; // Match idêntico tem peso dobrado
            } else if (normalized.includes(ruleTerm)) {
                score += rule.weight;
            }
        }

        if (score > highestScore) {
            highestScore = score;
            bestTopic = topic;
        }
    }

    // Se houve correspondência com pontuação mínima de 3, retorna o tópico vencedor
    if (bestTopic && highestScore >= 3) {
        return bestTopic.responses[lang] || bestTopic.responses.pt;
    }

    // 4. Se nenhum tópico atingiu correspondência relevante, aciona o Roteador de Fallback Genérico
    return GENERIC_ROUTER_RESPONSE[lang] || GENERIC_ROUTER_RESPONSE.pt;
}
