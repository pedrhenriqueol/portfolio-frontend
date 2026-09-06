/**
 * Portfolio Pedro Henrique - Tipagem Canônica de Projetos & Engenharia
 * 
 * Regras estritas:
 * - apiContracts e engineeringTests são opcionais para garantir 100% de verdade técnica.
 * - Projetos corporativos/legados sem endpoints públicos ou suíte de testes omitem essas propriedades.
 */

export interface ApiEndpointHeader {
    name: string;
    value: string;
    desc?: string;
}

export interface ApiEndpoint {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    route: string;
    description: string;
    headers?: ApiEndpointHeader[];
    requestBody?: string;
    responseBody?: string;
    status: string;
    latency?: string;
}

export interface ApiContractData {
    endpoints: ApiEndpoint[];
    baseUrl?: string;
    swaggerUrl?: string;
}

export interface AssertionItem {
    name: string;
    status: 'PASSED' | 'FAILED' | 'SKIPPED' | 'EXECUTING';
    latency: string;
    details: string;
}

export interface ChaosScenario {
    scenario: string;
    outcome: string;
}

export interface LatencyPercentiles {
    p50: number;
    p90?: number;
    p95: number;
    p99: number;
}

export interface TestOpsData {
    assertions: AssertionItem[];
    percentiles: LatencyPercentiles;
    coverage?: number;
    uptime?: string;
    chaosLab: ChaosScenario[];
}

export interface ArchitectureLayer {
    layer: string;
    tech: string;
    role: string;
}

export interface ConcurrencyGuarantee {
    lockMechanism: string;
    exceptionHandling: string;
    acidGuarantee: string;
}

export interface ChallengeSolution {
    problem: string;
    impactChip: string;
    solution: string;
}

export interface ArchitectureDetailsData {
    architectureType: string;
    domain?: string;
    volume?: string;
    database?: string;
    ecosystemIcon?: string;
    codeSnippet?: string;
    layers?: ArchitectureLayer[];
    concurrencyTable?: ConcurrencyGuarantee[];
    challenges?: ChallengeSolution[];
    systemRole?: string;
}

export interface ProjectMetric {
    label?: string;
    value: string;
    icon?: string;
}

export interface ProjectDetails {
    subtitle?: string;
    fullDescription?: string;
    challenge?: string;
    solution?: string;
    highlights?: string[];
    metrics?: Array<ProjectMetric | string>;
    architecture?: ArchitectureLayer[];
}

export interface Project {
    id: string | number;
    title: string;
    description?: string;
    image_url?: string;
    repo_link?: string | null;
    demo_link?: string | null;
    tags?: string[];
    details?: ProjectDetails;
    category?: 'fullstack' | 'desktop' | 'backend' | 'outros';

    // Propriedades estritamente opcionais para higiene e verdade técnica
    apiContracts?: ApiContractData;
    engineeringTests?: TestOpsData;
    architectureDetails?: ArchitectureDetailsData;

    [key: string]: any;
}

export type ProjectFilterType = 'all' | 'fullstack' | 'desktop' | 'backend' | 'outros';
export type ProjectViewMode = 'grid' | 'table' | 'list';
