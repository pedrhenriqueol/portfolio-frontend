/** Flagship case studies shown in the featured projects stage (PT/EN/ES). */
export interface ProjectHudMetric {
    value: string;
    label: string;
}

export interface FlagshipProject {
    id: number;
    title: string;
    tagline: string;
    stepLabel: string;
    badge: string;
    stat: string;
    metrics: [ProjectHudMetric, ProjectHudMetric];
    description: string;
    image: string;
    techs: string[];
    url: string;
    repo: string;
}

export const FLAGSHIP_CONFIGS: FlagshipProject[] = [
    {
        id: 101,
        title: 'PayStream Gateway',
        tagline: 'Motor Transacional de Pagamentos & Split de Liquidação',
        stepLabel: 'Motor Transacional',
        badge: 'Fintech de Alta Concorrência',
        stat: 'Idempotência Atômica',
        metrics: [
            { value: 'P2002 ACID', label: 'Idempotência Atômica' },
            { value: '100% Inteiro', label: 'Split em Centavos' },
        ],
        description: 'Gateway corporativo de pagamentos fintech com liquidação de split multipartes em centavos inteiros, idempotência atômica via unicidade no PostgreSQL (Prisma P2002) e webhooks assinados com HMAC-SHA256 com proteção contra timing attacks.',
        image: '/projects/paystream-dash.png',
        techs: ['Fastify', 'TypeScript', 'Prisma', 'PostgreSQL', 'HMAC-SHA256'],
        url: 'https://paystream-gateaway.vercel.app',
        repo: 'https://github.com/pedrhenriqueol/paystream-gateway',
    },
    {
        id: 102,
        title: 'PortLog OS',
        tagline: 'Operações Portuárias & Telemetria Industrial',
        stepLabel: 'Operações Portuárias',
        badge: 'Logística Portuária & ZPEs',
        stat: '100% FSM Válida',
        metrics: [
            { value: '100% FSM', label: 'Transições Válidas' },
            { value: 'Multi-Tenant', label: 'Isolamento por Terminal' },
        ],
        description: 'Sistema operacional portuário com governança multi-tenant estrita por terminal, máquina de estados finita (FSM) no Kanban de manutenção de guindastes pesados (STS/RTG) e telemetria preditiva IoT em tempo real.',
        image: '/projects/portlog-dash.png',
        techs: ['React', 'TypeScript', 'Fastify', 'Prisma', 'Multi-tenant', 'FSM'],
        url: 'https://portlog-os.vercel.app',
        repo: 'https://github.com/pedrhenriqueol/portlog-os',
    },
    {
        id: 103,
        title: 'SPECTR TestOps',
        tagline: 'Engenharia de Qualidade & Resiliência de APIs',
        stepLabel: 'Engenharia de Qualidade',
        badge: 'Observabilidade & TestOps',
        stat: 'Percentis NIST · Posto Mais Próximo',
        metrics: [
            { value: 'p50–p99 NIST', label: 'Telemetria de Cauda' },
            { value: 'Chaos Lab', label: 'Injeção de Falhas' },
        ],
        description: 'Plataforma corporativa de engenharia de testes com runner isolado, validação recursiva de esquemas OpenAPI/JSON Schema, testes de estresse no Chaos Lab e percentis de cauda p50/p90/p95/p99 padronizados pelo NIST.',
        image: '/projects/spectr-workbench.png',
        techs: ['React 18', 'TypeScript', 'OpenAPI', 'Chaos Lab', 'p95 SLA Math'],
        url: 'https://spectr-testops.vercel.app',
        repo: 'https://github.com/pedrhenriqueol/spectr-testops',
    },
];

export const FLAGSHIP_CONFIGS_I18N: Record<string, FlagshipProject[]> = {
    pt: FLAGSHIP_CONFIGS,
    en: [
        {
            id: 101,
            title: 'PayStream Gateway',
            tagline: 'Transactional Payment Engine & Settlement Split',
            stepLabel: 'Transaction Engine',
            badge: 'High-Concurrency Fintech',
            stat: 'Atomic Idempotency',
            metrics: [
                { value: 'P2002 ACID', label: 'Atomic Idempotency' },
                { value: '100% Integer', label: 'Full-Cent Split' },
            ],
            description: 'Enterprise fintech payment gateway featuring full-cent multipart split settlement, atomic idempotency via PostgreSQL uniqueness (Prisma P2002), and HMAC-SHA256 signed webhooks protected against timing attacks.',
            image: '/projects/paystream-dash.png',
            techs: ['Fastify', 'TypeScript', 'Prisma', 'PostgreSQL', 'HMAC-SHA256'],
            url: 'https://paystream-gateaway.vercel.app',
            repo: 'https://github.com/pedrhenriqueol/paystream-gateway',
        },
        {
            id: 102,
            title: 'PortLog OS',
            tagline: 'Port Operations & Industrial Telemetry',
            stepLabel: 'Port Operations',
            badge: 'Port Logistics & FTZ',
            stat: '100% Valid FSM',
            metrics: [
                { value: '100% FSM', label: 'Valid State Transitions' },
                { value: 'Multi-Tenant', label: 'Per-Terminal Isolation' },
            ],
            description: 'Port operating system with strict per-terminal multi-tenant governance, finite state machine (FSM) for heavy crane maintenance Kanban (STS/RTG), and real-time IoT predictive telemetry.',
            image: '/projects/portlog-dash.png',
            techs: ['React', 'TypeScript', 'Fastify', 'Prisma', 'Multi-tenant', 'FSM'],
            url: 'https://portlog-os.vercel.app',
            repo: 'https://github.com/pedrhenriqueol/portlog-os',
        },
        {
            id: 103,
            title: 'SPECTR TestOps',
            tagline: 'API Quality Engineering & Resilience Platform',
            stepLabel: 'Quality Engineering',
            badge: 'Observability & TestOps',
            stat: 'NIST Nearest Rank Math',
            metrics: [
                { value: 'p50–p99 NIST', label: 'Tail Latency Math' },
                { value: 'Chaos Lab', label: 'Fault Injection' },
            ],
            description: 'Enterprise test engineering platform featuring isolated test runner, recursive OpenAPI/JSON Schema validation, Chaos Lab resilience testing, and NIST-standardized tail latency percentiles (p50/p90/p95/p99).',
            image: '/projects/spectr-workbench.png',
            techs: ['React 18', 'TypeScript', 'OpenAPI', 'Chaos Lab', 'p95 SLA Math'],
            url: 'https://spectr-testops.vercel.app',
            repo: 'https://github.com/pedrhenriqueol/spectr-testops',
        },
    ],
    es: [
        {
            id: 101,
            title: 'PayStream Gateway',
            tagline: 'Motor Transaccional de Pagos y Split de Liquidación',
            stepLabel: 'Motor Transaccional',
            badge: 'Fintech de Alta Concurrencia',
            stat: 'Idempotencia Atómica',
            metrics: [
                { value: 'P2002 ACID', label: 'Idempotencia Atómica' },
                { value: '100% Entero', label: 'Split en Centavos' },
            ],
            description: 'Pasarela corporativa de pagos fintech con liquidación de split multipartes en centavos enteros, idempotencia atómica vía unicidad en PostgreSQL (Prisma P2002) y webhooks firmados con HMAC-SHA256 contra timing attacks.',
            image: '/projects/paystream-dash.png',
            techs: ['Fastify', 'TypeScript', 'Prisma', 'PostgreSQL', 'HMAC-SHA256'],
            url: 'https://paystream-gateaway.vercel.app',
            repo: 'https://github.com/pedrhenriqueol/paystream-gateway',
        },
        {
            id: 102,
            title: 'PortLog OS',
            tagline: 'Operaciones Portuarias y Telemetría Industrial',
            stepLabel: 'Operaciones Portuarias',
            badge: 'Logística Portuaria y ZPEs',
            stat: '100% FSM Válida',
            metrics: [
                { value: '100% FSM', label: 'Transiciones Válidas' },
                { value: 'Multi-Tenant', label: 'Aislamiento por Terminal' },
            ],
            description: 'Sistema operativo portuario con gobernanza multi-tenant estricta por terminal, máquina de estados finitos (FSM) en Kanban de mantenimiento de grúas pesadas (STS/RTG) y telemetría predictiva IoT en tiempo real.',
            image: '/projects/portlog-dash.png',
            techs: ['React', 'TypeScript', 'Fastify', 'Prisma', 'Multi-tenant', 'FSM'],
            url: 'https://portlog-os.vercel.app',
            repo: 'https://github.com/pedrhenriqueol/portlog-os',
        },
        {
            id: 103,
            title: 'SPECTR TestOps',
            tagline: 'Ingeniería de Calidad y Resiliencia de APIs',
            stepLabel: 'Ingeniería de Calidad',
            badge: 'Observabilidad y TestOps',
            stat: 'Percentiles NIST · Rango Más Próximo',
            metrics: [
                { value: 'p50–p99 NIST', label: 'Telemetría de Cola' },
                { value: 'Chaos Lab', label: 'Inyección de Fallos' },
            ],
            description: 'Plataforma corporativa de ingeniería de pruebas con ejecutor aislado, validación recursiva de esquemas OpenAPI/JSON Schema, pruebas de estrés en Chaos Lab y percentiles NIST p50/p90/p95/p99.',
            image: '/projects/spectr-workbench.png',
            techs: ['React 18', 'TypeScript', 'OpenAPI', 'Chaos Lab', 'p95 SLA Math'],
            url: 'https://spectr-testops.vercel.app',
            repo: 'https://github.com/pedrhenriqueol/spectr-testops',
        },
    ],
};
