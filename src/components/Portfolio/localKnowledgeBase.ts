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
            { term: 'qa', weight: 5 },
            { term: 'teste', weight: 4 },
            { term: 'testes', weight: 4 },
            { term: 'testing', weight: 4 },
            { term: 'postman', weight: 6 },
            { term: 'regressivo', weight: 5 },
            { term: 'qualidade', weight: 4 },
            { term: 'zpe', weight: 5 },
            { term: 'zpes', weight: 5 },
            { term: 'aduana', weight: 5 },
            { term: 'aduaneira', weight: 5 },
            { term: 'bugs', weight: 4 },
            { term: 'validacao', weight: 4 },
            { term: 'sete tecnologia', weight: 6 },
            { term: 'e2e', weight: 4 },
            { term: 'assercoes', weight: 4 },
        ],
        responses: {
            pt: `Na \`SETE Tecnologia\`, atuo na garantia de qualidade de sistemas críticos voltados para logística aduaneira e ZPEs (Zonas de Processamento de Exportação).
› **Testes de API**: Modelagem e execução de coleções no \`Postman\` com validação de contratos, status codes, schemas JSON e tempos de resposta.
› **Validação Funcional**: Testes funcionais, regressivos e de ponta a ponta (E2E) para garantir integridade de regras aduaneiras.
› **Diagnóstico em Banco**: Uso de consultas avançadas em \`SQL Server\` para rastreamento de anomalias em massas de dados transacionais.
Para simular uma rotina de validação em tempo real, execute o comando \`$ test\`.`,
            en: `At \`SETE Tecnologia\`, I work in quality assurance for mission-critical port logistics and Export Processing Zones (ZPEs).
› **API Testing**: Design and automation of \`Postman\` collections validating contracts, status codes, JSON schemas, and latency.
› **Functional Validation**: Functional, regression, and end-to-end (E2E) suites safeguarding customs compliance rules.
› **Database Diagnostics**: Advanced \`SQL Server\` profiling queries to trace transaction anomalies and edge cases.
To simulate an interactive regression run in real-time, execute \`$ test\`.`,
            es: `En \`SETE Tecnologia\`, me desempeño en el aseguramiento de calidad para logística aduanera y zonas francas (ZPEs).
› **Pruebas de API**: Diseño y ejecución de colecciones en \`Postman\` con validación de contratos, códigos HTTP y schemas JSON.
› **Validación Funcional**: Pruebas funcionales, de regresión y E2E para certificar reglas de negocio aduaneras.
› **Diagnóstico de Base de Datos**: Consultas avanzadas en \`SQL Server\` para auditoría de anomalías en datos transaccionales.
Para simular una rutina de validación interactiva, escribe \`$ test\`.`,
        },
    },

    // B. Delphi & Modernização de Sistemas Legados (Qualisoft Sistemas)
    {
        id: 'delphi-legacy',
        keywords: [
            { term: 'delphi', weight: 6 },
            { term: 'unigui', weight: 6 },
            { term: 'vcl', weight: 5 },
            { term: 'legado', weight: 4 },
            { term: 'migracao', weight: 4 },
            { term: 'modernizacao', weight: 4 },
            { term: 'erp', weight: 4 },
            { term: 'qualisoft', weight: 6 },
            { term: 'desktop', weight: 3 },
            { term: 'pascal', weight: 4 },
            { term: 'delphi 6', weight: 6 },
            { term: 'delphi 11', weight: 6 },
        ],
        responses: {
            pt: `Possuo sólida experiência prática na manutenção e modernização de arquiteturas corporativas na \`Qualisoft Sistemas\`:
› **Engenharia Reversa & Refatoração**: Análise e sustentação de regras de negócio em \`Delphi 6\` e \`Delphi 11\`.
› **Transição Desktop → Web**: Migração de interfaces legadas VCL para a Web utilizando \`UniGui\`, garantindo compatibilidade com browsers modernos sem reescrever o core transacional.
› **Interoperabilidade**: Criação de pontes e rotas REST em \`PHP/Laravel\` para desacoplar serviços legados e integrar com frontends modernos em \`React\`.`,
            en: `I hold solid hands-on experience maintaining and modernizing enterprise monolithic architectures at \`Qualisoft Sistemas\`:
› **Reverse Engineering & Refactoring**: Deep analysis and maintenance of core business logic in \`Delphi 6\` and \`Delphi 11\`.
› **Desktop → Web Transition**: Porting legacy VCL interfaces to the browser with \`UniGui\`, ensuring zero downtime without rewriting core logic.
› **Interoperability**: Building REST integration bridges in \`PHP/Laravel\` to decouple legacy services and connect to modern \`React\` frontends.`,
            es: `Cuento con sólida experiencia en mantenimiento y modernización de arquitecturas empresariales en \`Qualisoft Sistemas\`:
› **Ingeniería Inversa y Refactorización**: Análisis y soporte de reglas de negocio en \`Delphi 6\` y \`Delphi 11\`.
› **Transición Escritorio → Web**: Migración de interfaces VCL hacia la web con \`UniGui\`, garantizando compatibilidad sin reescribir el core.
› **Interoperabilidad**: Desarrollo de puentes REST en \`PHP/Laravel\` para desacoplar módulos legados e integrarlos con interfaces modernas en \`React\`.`,
        },
    },

    // C. Backend, PHP & Laravel
    {
        id: 'backend-php-laravel',
        keywords: [
            { term: 'php', weight: 5 },
            { term: 'laravel', weight: 6 },
            { term: 'backend', weight: 4 },
            { term: 'api', weight: 3 },
            { term: 'apis', weight: 3 },
            { term: 'rest', weight: 3 },
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

/** Roteador de Fallback Genérico quando nenhum termo atinge correspondência */
export const GENERIC_ROUTER_RESPONSE: Record<'pt' | 'en' | 'es', string> = {
    pt: `Entendido! Como Copilot Técnico, possuo dados detalhados sobre todas as realizações do Pedro. Você pode me perguntar sobre:
› \`Experiência em QA & APIs\`: automação Postman e SQL Server na SETE Tecnologia.
› \`Sistemas Legados & Delphi\`: modernização desktop/web na Qualisoft.
› \`Stack & Backend\`: desenvolvimento em PHP, Laravel, React e TypeScript.
› Ou utilize comandos diretos de console como \`$ test\`, \`$ sql\` ou \`$ clear\`.`,
    en: `Understood! As Pedro's Technical Copilot, I have comprehensive data on all his engineering achievements. You can ask me about:
› \`QA & API Testing\`: Postman automation and SQL Server profiling at SETE Tecnologia.
› \`Legacy Systems & Delphi\`: desktop/web modernization with UniGui at Qualisoft.
› \`Stack & Backend\`: scalable services in PHP, Laravel, React, and TypeScript.
› Or execute console commands like \`$ test\`, \`$ sql\`, or \`$ clear\`.`,
    es: `¡Entendido! Como Copilot Técnico, poseo información completa sobre las metas y proyectos de Pedro. Puedes preguntarme sobre:
› \`Experiencia en QA y APIs\`: automatización en Postman y SQL Server en SETE Tecnologia.
› \`Sistemas Legados y Delphi\`: modernización desktop/web en Qualisoft.
› \`Stack y Backend\`: desarrollo en PHP, Laravel, React y TypeScript.
› O ejecuta comandos directos de consola como \`$ test\`, \`$ sql\` o \`$ clear\`.`,
};

/** Resposta de segurança DevSecOps & Anti-Jailbreak */
export const DEVSECOPS_RESPONSE: Record<'pt' | 'en' | 'es', string> = {
    pt: `Bela tentativa! 🛡️ Como assistente treinado em QA e DevSecOps do Pedro Henrique, nenhuma chave de API, credencial ou segredo de infraestrutura é exposto na camada cliente. Todas as variáveis sensíveis operam isoladas na Vercel Edge. Se você for o Pedro mesmo, sabe que pode gerenciá-las diretamente no painel da Vercel! 😉`,
    en: `Nice try! 🛡️ As Pedro Henrique's QA & DevSecOps Copilot, no API keys, tokens, or infrastructure secrets are exposed to the client side. All sensitive environment variables operate isolated in the Vercel Edge cluster. If you're truly Pedro, you know you can manage them directly in the Vercel Dashboard! 😉`,
    es: `¡Buen intento! 🛡️ Como Copilot técnico enfocado en QA y DevSecOps de Pedro Henrique, ninguna clave de API o secreto se expone en el cliente. Todas las variables sensibles operan aisladas en Vercel Edge. ¡Si realmente eres Pedro, puedes administrarlas directamente en el panel de Vercel! 😉`,
};

/** Saudações naturais */
export const GREETINGS_RESPONSE: Record<'pt' | 'en' | 'es', string> = {
    pt: `Olá! Sou o Copilot Técnico do Pedro Henrique. Você pode me fazer perguntas sobre a stack dele (\`Laravel\`, \`Delphi\`, \`React\`, \`SQL Server\`), experiência em QA e desenvolvimento, projetos de engenharia ou debater sobre tópicos técnicos. Como posso te ajudar agora?`,
    en: `Hello! I am Pedro Henrique's Technical Copilot. Feel free to ask me about his tech stack (\`Laravel\`, \`Delphi\`, \`React\`, \`SQL Server\`), QA engineering experience, production projects, or any tech topic. How can I assist you today?`,
    es: `¡Hola! Soy el Copilot Técnico de Pedro Henrique. Puedes consultarme sobre su stack (\`Laravel\`, \`Delphi\`, \`React\`, \`SQL Server\`), experiencia en QA y desarrollo, proyectos o ingeniería de software. ¿En qué te puedo colaborar ahora?`,
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
