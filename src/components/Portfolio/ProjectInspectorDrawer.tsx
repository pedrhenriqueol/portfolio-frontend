import React, { useState, useEffect, useMemo, useCallback, useRef, useId } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { playTabSwitch, playMechanicalClick } from '../../lib/sound';
import { Project, ApiContractData, TestOpsData } from '../../types/project';
import './project-inspector.css';

interface ProjectInspectorDrawerProps {
    project: Project;
    onClose: () => void;
}

interface ProjectEnrichedSpecs {
    version: string;
    ecosystemIcon: string;
    domain: string;
    architectureType: string;
    volume: string;
    database: string;
    codeSnippet?: string;
    layers?: Array<{ layer: string; tech: string; role: string }>;
    concurrencyTable?: Array<{
        lockMechanism: string;
        exceptionHandling: string;
        acidGuarantee: string;
    }>;
    challenges?: Array<{
        problem: string;
        impactChip: string;
        solution: string;
    }>;
    apiContracts?: ApiContractData;
    engineeringTests?: TestOpsData;
}

/* ─────────────────────────────────────────────────────────────────
   ── ESPECIFICAÇÕES DE ENGENHARIA DE ALTA DENSIDADE (FLAGSHIPS) ──
   ───────────────────────────────────────────────────────────────── */
const FLAGSHIP_SPECS: Record<number, ProjectEnrichedSpecs> = {
    // 101: PayStream Gateway
    101: {
        version: 'v1.4.2 • Produção',
        ecosystemIcon: 'fas fa-coins',
        domain: 'Fintech Core & Split Settlement',
        architectureType: 'Event-Driven & Microservices',
        volume: '500 req/s Concorrentes',
        database: 'PostgreSQL 16 (Neon / Prisma)',
        codeSnippet: `// PayStream Core: Idempotent Ledger Transaction
export async function executeAtomicTransfer(
    ctx: TransactionContext,
    payload: TransferPayload
): Promise<TransactionResult> {
    const { merchantId, externalId, amountInCents, splits } = payload;

    // 1. Chave composta para garantia estrita de unicidade
    return await prisma.$transaction(async (tx) => {
        const existing = await tx.transaction.findUnique({
            where: { merchant_external_unique: { merchantId, externalId } }
        });

        if (existing) {
            return { ...existing, idempotentReplay: true, httpStatus: 200 };
        }

        // 2. Conservação contábil rigorosa em centavos inteiros
        const splitSum = splits.reduce((acc, s) => acc + s.amountInCents, 0);
        if (splitSum !== amountInCents) {
            throw new AccountingInconsistencyError('Split total mismatch');
        }

        // 3. Débito com lock condicional
        const updated = await tx.merchant.update({
            where: { id: merchantId, balance: { gte: amountInCents } },
            data: { balance: { decrement: amountInCents } }
        });

        return tx.transaction.create({
            data: { merchantId, externalId, amountInCents, status: 'APPROVED' }
        });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}`,
        concurrencyTable: [
            {
                lockMechanism: 'Chave Composta @@unique([merchantId, externalId])',
                exceptionHandling: 'Captura determinística de erro P2002 no Prisma com retorno HTTP 200 e X-Idempotent-Replay: true',
                acidGuarantee: 'Zero double-spending e isolamento serializável em 500 req/s concorrentes'
            },
            {
                lockMechanism: 'Lock Condicional Atômico (balance >= amount)',
                exceptionHandling: 'Rollback imediato com HTTP 409 Conflict se o saldo for insuficiente',
                acidGuarantee: 'Impossibilidade de saldo negativo sem travamento excessivo de threads'
            },
            {
                lockMechanism: 'HMAC-SHA256 Timestamp Binding (300s window)',
                exceptionHandling: 'crypto.timingSafeEqual previne timing attacks e rejeita assinaturas divergentes com HTTP 401',
                acidGuarantee: 'Imutabilidade do payload e idempotência do dispatcher de webhooks'
            }
        ],
        challenges: [
            {
                problem: 'Risco de double-spending financeiro e débitos duplicados em instâncias concorrentes sob oscilação de rede móvel do pagador.',
                impactChip: 'P2002 Unique Constraint',
                solution: 'Restrição de unicidade composta no PostgreSQL interceptada determinísticamente pelo Fastify com replay de cache HTTP 200.'
            },
            {
                problem: 'Erros de ponto flutuante em splits de marketplace com centavos quebrados desestabilizando o balancete de fechamento diário.',
                impactChip: 'Centavos Inteiros (Zero Float)',
                solution: 'Todos os cálculos normalizados estritamente em centavos inteiros com validação de conservação da soma antes da gravação.'
            },
            {
                problem: 'Ataques de força bruta e timing attacks em endpoints de webhook expondo segredos de merchant.',
                impactChip: 'crypto.timingSafeEqual',
                solution: 'Assinaturas HMAC-SHA256 com timestamp e comparação em tempo de clock constante para blindagem criptográfica.'
            }
        ],
        apiContracts: {
            endpoints: [
                {
                    method: 'POST',
                    route: '/api/v1/transactions',
                    description: 'Processar transação PIX ou Cartão com split de liquidação',
                    headers: [
                        { name: 'Authorization', value: 'Bearer eyJhbGciOiJIUzI1Ni...', desc: 'JWT assinado' },
                        { name: 'X-Idempotency-Key', value: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', desc: 'UUID v4' },
                        { name: 'Content-Type', value: 'application/json', desc: 'JSON estrito' }
                    ],
                    requestBody: JSON.stringify({
                        merchantId: "mch_live_9f81a7b4",
                        externalId: "tx_2026_0905_001",
                        paymentMethod: "PIX",
                        amountInCents: 15000,
                        splits: [
                            { recipientId: "rec_platform", amountInCents: 1500 },
                            { recipientId: "rec_seller_1", amountInCents: 13500 }
                        ]
                    }, null, 2),
                    responseBody: JSON.stringify({
                        transactionId: "tx_live_8841a29f",
                        status: "APPROVED",
                        amountInCents: 15000,
                        feeInCents: 1500,
                        netAmountInCents: 13500,
                        pixQrCode: "00020126580014br.gov.bcb.pix...",
                        idempotentReplay: false
                    }, null, 2),
                    status: '201 Created',
                    latency: '18ms'
                },
                {
                    method: 'GET',
                    route: '/api/v1/merchants/:id/balance',
                    description: 'Consultar saldo consolidado e reservas financeiras do merchant',
                    headers: [
                        { name: 'Authorization', value: 'Bearer eyJhbGciOiJIUzI1Ni...', desc: 'JWT com scope read:balance' }
                    ],
                    requestBody: '{}',
                    responseBody: JSON.stringify({
                        merchantId: "mch_live_9f81a7b4",
                        availableBalanceInCents: 489200,
                        pendingBalanceInCents: 32000,
                        currency: "BRL"
                    }, null, 2),
                    status: '200 OK',
                    latency: '6ms'
                }
            ]
        },
        engineeringTests: {
            assertions: [
                { name: 'Atomic Idempotency (P2002 Replay)', status: 'PASSED', latency: '12ms', details: 'Zero duplicações de transação em 500 chamadas concorrentes' },
                { name: 'Split Balance Math (Centavos Inteiros)', status: 'PASSED', latency: '2ms', details: 'Conservação exata: taxa + sum(vendedores) === bruto' },
                { name: 'HMAC-SHA256 Timing-Safe Comparison', status: 'PASSED', latency: '4ms', details: 'crypto.timingSafeEqual imune a side-channel timing attacks' },
                { name: 'PCI-DSS Zero PAN/CVV Persistence', status: 'PASSED', latency: '1ms', details: 'Sanitização Zod antes de persistência ou logs' }
            ],
            percentiles: { p50: 22, p95: 44, p99: 72 },
            coverage: 98.6,
            uptime: '99.98%',
            chaosLab: [
                { scenario: 'Latência Injetada na Adquirente (2500ms)', outcome: 'Timeout adaptativo aos 3000ms com fallback assíncrono' },
                { scenario: 'Erro 504 no Webhook do Merchant', outcome: '3 retentativas com backoff exponencial (1s, 2s, 4s) e jitter' },
                { scenario: 'Injeção de 500 Threads Concorrentes', outcome: '1 débito atômico efetuado e 499 respostas idempotentes' }
            ]
        }
    },

    // 102: PortLog OS
    102: {
        version: 'v2.1.0 • Produção',
        ecosystemIcon: 'fas fa-ship',
        domain: 'Logística Portuária & ZPEs',
        architectureType: 'Modular Monolith com FSM Estrita',
        volume: '100+ Ativos Operacionais Diários',
        database: 'PostgreSQL + Prisma ORM',
        codeSnippet: `// PortLog FSM Engine: Deterministic State Transitions
export const WorkOrderMachine: FSMConfig<WorkOrderState, WorkOrderEvent> = {
    initial: 'TRIAGEM',
    states: {
        TRIAGEM: {
            on: { APROVAR: { target: 'APROVADA', guard: isSupervisorOrAbove } }
        },
        APROVADA: {
            on: { INICIAR: { target: 'EM_EXECUCAO', guard: hasAssignedTechnician } }
        },
        EM_EXECUCAO: {
            on: {
                CONCLUIR: { target: 'CONCLUIDA', guard: isChecklistComplete },
                INTERROMPER: { target: 'BLOQUEADA' }
            }
        },
        CONCLUIDA: { type: 'final' }
    }
};

export async function transitionWorkOrder(orderId: string, event: WorkOrderEvent, ctx: TenantContext) {
    return await prisma.$transaction(async (tx) => {
        // Bloqueio pessimista para evitar concorrência em tempo real no guindaste
        const order = await tx.$queryRaw\`SELECT * FROM "WorkOrder" WHERE id = \${orderId} AND "tenantId" = \${ctx.tenantId} FOR UPDATE\`;
        validateStateTransition(order.state, event);
        return await tx.workOrder.update({ where: { id: orderId }, data: { state: nextState } });
    });
}`,
        concurrencyTable: [
            {
                lockMechanism: 'Pessimistic Locking (SELECT ... FOR UPDATE)',
                exceptionHandling: 'Fila determinística de transição com timeout de espera de 2000ms',
                acidGuarantee: 'Impossibilidade de dois operadores iniciarem a mesma ordem em milissegundos coincidentes'
            },
            {
                lockMechanism: 'Isolamento Multi-Tenant via Middleware Fastify',
                exceptionHandling: 'Rejeição sumária com HTTP 403 Forbidden se houver divergência de tenantId no JWT',
                acidGuarantee: 'Isolamento estrito entre terminais portuários no mesmo cluster de banco'
            },
            {
                lockMechanism: 'Máquina de Estados Finita (FSM) Declarativa',
                exceptionHandling: 'Transições ilegais ou checklist pendente barrados compulsoriamente com HTTP 422',
                acidGuarantee: 'Preservação do histórico de manutenção e MTTR auditado em UTC'
            }
        ],
        challenges: [
            {
                problem: 'Colisão de ordens de serviço no Kanban quando dois mecânicos clicavam para assumir a mesma manutenção de guindaste.',
                impactChip: 'SELECT ... FOR UPDATE',
                solution: 'Bloqueio pessimista de linha com transações ACID no PostgreSQL, enfileirando as tentativas de forma determinística.'
            },
            {
                problem: 'Vazamento de dados ou visibilidade cruzada entre operadores de diferentes terminais portuários na mesma infraestrutura.',
                impactChip: 'Zero Data Leakage',
                solution: 'Injeção compulsória do tenantId nos middlewares de autenticação, impedindo qualquer consulta sem filtro de terminal.'
            }
        ],
        apiContracts: {
            endpoints: [
                {
                    method: 'PATCH',
                    route: '/api/v1/work-orders/:id/transition',
                    description: 'Executar transição determinística de estado na ordem de serviço',
                    headers: [
                        { name: 'Authorization', value: 'Bearer eyJhbGciOiJIUzI1Ni...', desc: 'JWT com role OPERADOR' },
                        { name: 'X-Tenant-Id', value: 'terminal_santos_01', desc: 'Isolamento do terminal' },
                        { name: 'Content-Type', value: 'application/json', desc: 'JSON UTF-8' }
                    ],
                    requestBody: JSON.stringify({
                        event: "CONCLUIR",
                        checklistCompleted: true,
                        technicianNotes: "Substituição preventiva do cabo de aço do guindaste STS-04 concluída.",
                        timestamp: new Date().toISOString()
                    }, null, 2),
                    responseBody: JSON.stringify({
                        id: "wo_8841a29f",
                        currentState: "CONCLUIDA",
                        craneId: "crane_sts_04",
                        durationMinutes: 145,
                        auditLogged: true
                    }, null, 2),
                    status: '200 OK',
                    latency: '24ms'
                },
                {
                    method: 'GET',
                    route: '/api/v1/cranes/:id/telemetry',
                    description: 'Telemetria IoT de vibração e temperatura dos rolamentos do guindaste',
                    headers: [
                        { name: 'Authorization', value: 'Bearer eyJhbGciOiJIUzI1Ni...', desc: 'JWT de Supervisor' },
                        { name: 'X-Tenant-Id', value: 'terminal_santos_01', desc: 'Identificador do terminal' }
                    ],
                    requestBody: '{}',
                    responseBody: JSON.stringify({
                        craneId: "crane_sts_04",
                        bearingVibrationMmS: 2.14,
                        motorTemperatureC: 68.5,
                        status: "OPTIMAL",
                        lastInspection: "2026-09-05T18:00:00Z"
                    }, null, 2),
                    status: '200 OK',
                    latency: '11ms'
                }
            ]
        },
        engineeringTests: {
            assertions: [
                { name: 'FSM Transition Guard Validation', status: 'PASSED', latency: '4ms', details: 'Transições sem checklist rejeitadas com status 422' },
                { name: 'Multi-Tenant Data Isolation', status: 'PASSED', latency: '5ms', details: '100% das queries escopadas compulsoriamente por tenantId' },
                { name: 'Pessimistic Row Lock Contention', status: 'PASSED', latency: '18ms', details: 'Resolução sequencial ordenada sem deadlocks' },
                { name: 'MTTR Audit Calculation Accuracy', status: 'PASSED', latency: '2ms', details: 'Cálculo de tempo médio até reparo com timezone UTC' }
            ],
            percentiles: { p50: 19, p95: 38, p99: 64 },
            coverage: 99.1,
            uptime: '99.99%',
            chaosLab: [
                { scenario: 'Colisão de Operadores em Tempo Real', outcome: 'Lock pessimista bloqueia a 2ª chamada e retorna estado já atualizado' },
                { scenario: 'Tentativa de Injeção de tenantId Alheio', outcome: 'Middleware Fastify intercepta e anula payload com HTTP 403' },
                { scenario: 'Desconexão do Sensor IoT em Campo', outcome: 'Timeout adaptativo marca o sensor como DEGRADED sem travar a FSM' }
            ]
        }
    },

    // 103: Spectr TestOps
    103: {
        version: 'v1.1.4 • Produção',
        ecosystemIcon: 'fas fa-vial',
        domain: 'Observabilidade & Qualidade de APIs',
        architectureType: 'Edge Runtime & TestOps Runner',
        volume: '10k+ Asserções / min',
        database: 'IndexedDB + Vercel Blob Storage',
        codeSnippet: `// SPECTR TestOps: Nearest-Rank NIST Percentiles Math
export function calculateLatencyPercentiles(samples: number[]): PercentileReport {
    if (!samples.length) return { p50: 0, p90: 0, p95: 0, p99: 0 };
    
    // 1. Ordenação ascendente dos tempos de resposta em ms
    const sorted = [...samples].sort((a, b) => a - b);
    const n = sorted.length;

    // 2. Método NIST Nearest Rank (sem distorção de interpolação)
    const getRank = (p: number) => {
        const rank = Math.ceil((p / 100) * n);
        return sorted[Math.max(0, rank - 1)];
    };

    return {
        p50: getRank(50),
        p90: getRank(90),
        p95: getRank(95),
        p99: getRank(99),
        sampleSize: n,
        slaStatus: getRank(95) < 150 ? 'HEALTHY' : 'BREACH'
    };
}`,
        concurrencyTable: [
            {
                lockMechanism: 'AbortController Instant Cancellation',
                exceptionHandling: 'Interrupção imediata de streams HTTP sem vazamento de sockets ou timers em background',
                acidGuarantee: 'Zero overhead de memória e liberação imediata do event loop sob carga'
            },
            {
                lockMechanism: 'Chaos Lab Jitter & Fault Injection Guard',
                exceptionHandling: 'Captura isolada de timeouts e erros 5xx simulados sem derrubar a suíte de testes',
                acidGuarantee: 'Validação fidedigna de resiliência e medição exata do error rate da aplicação'
            },
            {
                lockMechanism: 'Validação Recursiva OpenAPI / JSON Schema',
                exceptionHandling: 'Parsing seguro com sanitização Zod, apontando a linha e coluna exata da corrupção',
                acidGuarantee: 'Prevenção contra payloads maliciosos ou contratos incompatíveis'
            }
        ],
        challenges: [
            {
                problem: 'Distorções no cálculo de percentis de latência causadas por interpolações lineares errôneas em amostras pequenas.',
                impactChip: 'NIST Nearest-Rank Math',
                solution: 'Algoritmo estrito baseado no padrão NIST Nearest Rank, fornecendo medições idênticas às ferramentas de observabilidade líderes.'
            },
            {
                problem: 'Testes de carga contínuos consumindo sockets no browser e causando vazamento de memória.',
                impactChip: 'AbortController Lifecycle',
                solution: 'Gerenciamento determinístico de sinal com cancelamento atômico e limpeza de buffers a cada ciclo.'
            }
        ],
        apiContracts: {
            endpoints: [
                {
                    method: 'POST',
                    route: '/api/v1/collections/run',
                    description: 'Disparar bateria automatizada de testes com validação OpenAPI',
                    headers: [
                        { name: 'X-Runner-Token', value: 'spec_live_77218af', desc: 'Token de execução do runner' },
                        { name: 'Content-Type', value: 'application/json', desc: 'Configuração da bateria' }
                    ],
                    requestBody: JSON.stringify({
                        targetUrl: "https://api.empresa.com/v1/checkout",
                        concurrency: 25,
                        iterations: 100,
                        assertions: [
                            { type: "status_code", expected: 201 },
                            { type: "response_time", maxMs: 120 }
                        ]
                    }, null, 2),
                    responseBody: JSON.stringify({
                        runId: "run_8812af",
                        status: "COMPLETED",
                        totalRequests: 2500,
                        passedAssertions: 5000,
                        failedAssertions: 0,
                        p95LatencyMs: 42.6,
                        slaBreach: false
                    }, null, 2),
                    status: '200 OK',
                    latency: '42ms'
                },
                {
                    method: 'GET',
                    route: '/api/v1/telemetry/report/:id',
                    description: 'Obter relatório analítico consolidado com percentis NIST',
                    headers: [
                        { name: 'Authorization', value: 'Bearer eyJhbGciOiJIUzI1Ni...', desc: 'Token de leitura' }
                    ],
                    requestBody: '{}',
                    responseBody: JSON.stringify({
                        runId: "run_8812af",
                        percentiles: { p50: 18, p90: 32, p95: 42, p99: 68 },
                        errorRate: "0.00%",
                        uptime: "100.0%"
                    }, null, 2),
                    status: '200 OK',
                    latency: '8ms'
                }
            ]
        },
        engineeringTests: {
            assertions: [
                { name: 'Recursive OpenAPI Contract Validator', status: 'PASSED', latency: '6ms', details: 'Validação de esquemas JSON Schema profundamente aninhados' },
                { name: 'Nearest Rank NIST Percentiles Math', status: 'PASSED', latency: '1ms', details: 'Cálculo estatístico padronizado sem distorção em amostras' },
                { name: 'AbortController Socket Termination', status: 'PASSED', latency: '1ms', details: 'Descarte limpo de streams e sockets sem memory leaks' },
                { name: 'Chaos Lab Jitter Generation', status: 'PASSED', latency: '2ms', details: 'Injeção de atraso gaussiano com distribuição estocástica' }
            ],
            percentiles: { p50: 16, p95: 35, p99: 52 },
            coverage: 100,
            uptime: '99.99%',
            chaosLab: [
                { scenario: 'Injeção de Jitter Gaussiano (±150ms)', outcome: 'Tolerância calibrada do timeout adaptativo sem falsos positivos' },
                { scenario: 'Queda Intermitente de Servidor (503 Service Unavailable)', outcome: 'Medição exata da taxa de erro e ativação de circuit breaker' },
                { scenario: 'Payload JSON Truncado na Rede', outcome: 'Captura graciosa no validador com diagnóstico sem crash do runner' }
            ]
        }
    }
};

/* ─────────────────────────────────────────────────────────────────
   ── ESPECIFICAÇÕES CORPORATIVAS REAIS (POPULADAS E VERÍDICAS) ────
   ───────────────────────────────────────────────────────────────── */
function getCorporateRealSpecs(project: Project): ProjectEnrichedSpecs {
    const idNum = Number(project.id);

    // 1: Retaguarda ERP (Laravel + React + SQL Server + ACBr)
    if (idNum === 1 || project.title.includes('Retaguarda ERP')) {
        return {
            version: 'v2.4.0 • Produção Corporativa',
            ecosystemIcon: 'fas fa-cash-register',
            domain: 'Módulo Administrativo Full-Stack — Gestão ERP/PDV',
            architectureType: 'API RESTful Desacoplada (Laravel) + SPA (React + TypeScript)',
            volume: '100+ Operadores Simultâneos',
            database: 'SQL Server / MySQL Pool (Índices Cobridores)',
            codeSnippet: `// Retaguarda ERP: Faturamento Transacional com Contingência Fiscal ACBr
public function processarVenda(Request $request, FaturamentoService $service): JsonResponse 
{
    $validated = $request->validate([
        'operador_id' => 'required|integer',
        'itens'       => 'required|array|min:1',
        'itens.*.sku' => 'required|string',
        'itens.*.qtd' => 'required|numeric|min:0.01',
    ]);

    // 1. Transação ACID com Eager Loading (eliminação de queries N+1)
    return DB::transaction(function () use ($validated, $service) {
        $venda = Venda::create([...$validated, 'status' => 'PROCESSANDO']);
        
        // 2. Reserva atômica de inventário e cálculo de alíquota fiscal
        $service->abaterEstoqueComposto($venda);
        
        // 3. Emissão fiscal via componente ACBr com fila de contingência
        $resultadoFiscal = $service->emitirNFCeAssincrona($venda);
        
        return response()->json([
            'venda_id' => $venda->id,
            'status'   => 'CONCLUIDA',
            'chave_acbr' => $resultadoFiscal->chaveAcesso
        ], 200);
    });
}`,
            concurrencyTable: [
                {
                    lockMechanism: 'Eager Loading com Índices Compostos no SQL Server',
                    exceptionHandling: 'Eliminação comprovada de queries N+1, reduzindo a latência média de 2s para < 500ms',
                    acidGuarantee: 'Consistência transacional absoluta em fechamento de caixa e faturamento concorrente'
                },
                {
                    lockMechanism: 'Laravel Sanctum RBAC por Perfil de Operador',
                    exceptionHandling: 'Rejeição de requisições de operadores sem privilégio de estorno com HTTP 403',
                    acidGuarantee: 'Blindagem de integridade contábil e rastreamento de auditoria fiscal'
                },
                {
                    lockMechanism: 'Fila de Contingência Fiscal ACBr',
                    exceptionHandling: 'Se a SEFAZ estiver offline, o sistema emite NFC-e em contingência sem interromper a frente de caixa',
                    acidGuarantee: 'Continuidade de negócio no PDV com transmissão automática ao reestabelecer conexão'
                }
            ],
            challenges: [
                {
                    problem: 'Gargalos de concorrência em horários de pico durante a emissão de notas fiscais e lentidão em relatórios de inventário com milhares de SKUs em banco de dados relacional.',
                    impactChip: 'Latência 2s → <500ms',
                    solution: 'Refatoração completa para arquitetura desacoplada (Laravel REST API + React SPA), aplicação de Eager Loading com índices compostos no banco e processamento assíncrono para emissão fiscal via ACBr.'
                },
                {
                    problem: 'Inconsistência contábil em emissões fiscais simultâneas em PDVs descentralizados.',
                    impactChip: '100% Fiscal ACBr',
                    solution: 'Implementação de pool de conexões com transações atômicas e fila de contingência assíncrona.'
                }
            ]
        };
    }

    // 2: Portal Conglomerados (Multi-tenant Lógico + RBAC)
    if (idNum === 2 || project.title.includes('Conglomerados')) {
        return {
            version: 'v3.0.1 • Produção Corporativa',
            ecosystemIcon: 'fas fa-building',
            domain: 'Plataforma Multi-tenant de Gestão Empresarial',
            architectureType: 'Multi-tenant Lógico com Resolução de Contexto por Filial',
            volume: 'Dezenas de Filiais em Único Ecossistema',
            database: 'SQL Server (Multi-Tenant Engine com Isolamento por TenantId)',
            codeSnippet: `// Portal Conglomerados: Dynamic Tenant Scope & RBAC Resolution
class ResolveTenantMiddleware 
{
    public function handle(Request $request, Closure $next): Response 
    {
        $tenantId = $request->header('X-Tenant-Filial') ?? auth()->user()->filial_padrao_id;
        
        // 1. Validação se o usuário autenticado possui vínculo ativo com a filial
        abort_unless(auth()->user()->temAcessoFilial($tenantId), 403, 'Acesso proibido à unidade');
        
        // 2. Injeção compulsória do TenantScope em todos os modelos Eloquent
        FilialContext::set($tenantId);
        
        // 3. Aplicação do isolamento em nível de banco de dados
        return $next($request);
    }
}`,
            concurrencyTable: [
                {
                    lockMechanism: 'Tenant Resolution Middleware no Laravel',
                    exceptionHandling: 'Rejeição sumária com HTTP 403 se houver tentativa de consulta a filial não autorizada',
                    acidGuarantee: 'Isolamento lógico estrito de dados entre empresas do mesmo conglomerado'
                },
                {
                    lockMechanism: 'RBAC Granular por Cargo e Filial',
                    exceptionHandling: 'Políticas de autorização (Gates/Policies) impedem visualização de saldos consolidados por perfis operacionais',
                    acidGuarantee: 'Privacidade e governança financeira estrita'
                },
                {
                    lockMechanism: 'Consultas Agregadas Multi-Filial com Cache de Métricas',
                    exceptionHandling: 'Tuning de consultas de conciliação mantendo o tempo de resposta inferior a 300ms',
                    acidGuarantee: 'Disponibilidade de dashboards analíticos executivos sem travar o banco produtivo'
                }
            ],
            challenges: [
                {
                    problem: 'Garantir isolamento rigoroso de dados entre dezenas de empresas do mesmo grupo sem duplicar infraestrutura e sem perda de performance em consultas financeiras consolidadas.',
                    impactChip: 'Latência < 300ms',
                    solution: 'Implementação de arquitetura Multi-Tenant com resolução dinâmica de contexto por tenant, segurança via RBAC e queries agregadas com cache inteligente de métricas executivas.'
                }
            ]
        };
    }

    // 3: Migração Delphi → UniGui Web
    if (idNum === 3 || project.title.includes('UniGui') || project.title.includes('Delphi')) {
        return {
            version: 'v11.2 • Modernização Estável',
            ecosystemIcon: 'fas fa-desktop',
            domain: 'Modernização de Sistema Monolítico Legado para Web',
            architectureType: 'RAD Studio Delphi 11 + UniGui Web (ExtJS Server-Side Engine)',
            volume: 'Modernização de Monólito de 15+ Anos',
            database: 'SQL Server via FireDAC Connection Pool',
            codeSnippet: `// Migração Delphi UniGui: ServerModule Session Isolation & FireDAC Pooling
procedure TUniServerModule.UniGUIServerModuleCreate(Sender: TObject);
begin
    // 1. Configuração do pool de conexões FireDAC para múltiplos operadores web
    FDManager.ConnectionDefFile := ExtractFilePath(ParamStr(0)) + 'fddrivers.ini';
    FDManager.Active := True;
end;

procedure TMainForm.UniButtonEmitirFiscalClick(Sender: TObject);
begin
    // 2. Execução assíncrona com ciclo de vida server-side mantendo conformidade ACBr
    ACBrEngine.ConfigurarAmbienteWeb(UniApplication.RemoteAddress);
    ACBrEngine.EmitirNFe(CurrentPedidoId);
    UniApplication.ShowToast('Nota Fiscal emitida com sucesso via UniGui Server!');
end;`,
            concurrencyTable: [
                {
                    lockMechanism: 'Isolamento de Sessão por ServerModule / MainModule',
                    exceptionHandling: 'Cada conexão web do navegador instancia seu próprio contexto de formulário sem vazar estado para outros operadores',
                    acidGuarantee: 'Eliminação completa de conflitos de memória e 40% de redução de falhas visuais legadas'
                },
                {
                    lockMechanism: 'FireDAC Connection Pooling com Transações ACID',
                    exceptionHandling: 'Reconexão resiliente ao SQL Server em oscilações de rede sem derrubar o serviço UniGui',
                    acidGuarantee: 'Integridade contábil e fiscal em operações simultâneas de PDV'
                },
                {
                    lockMechanism: 'Componentes ACBr Server-Side e FortesReport Web',
                    exceptionHandling: 'Geração assíncrona de DANFE em PDF server-side para download no navegador sem travar a interface',
                    acidGuarantee: '100% de conformidade fiscal preservada na transição de Desktop para Web'
                }
            ],
            challenges: [
                {
                    problem: 'Migrar um sistema monolítico Desktop VCL de 15+ anos com bibliotecas legadas (JEDI/JVCL) para Web sem quebrar regras de negócio fiscais e sem perda de estabilidade.',
                    impactChip: 'Zero Perda Fiscal',
                    solution: 'Reestruturação do ciclo de vida das telas para UniGui MainModule/ServerModule, upgrade do framework ACBr para execução server-side e criação de pool de conexões FireDAC para suportar múltiplos operadores simultâneos via browser.'
                }
            ]
        };
    }

    // 4: Controle de Estoque (Java / MySQL DAO)
    if (idNum === 4 || project.title.includes('Controle de Estoque') || (project.tags || []).includes('Swing')) {
        return {
            version: 'v1.8.0 • Arquitetura MVC',
            ecosystemIcon: 'fas fa-boxes-stacked',
            domain: 'Sistema Desktop MVC de Controle de Estoque & Inventário',
            architectureType: 'MVC Desktop com DAO Desacoplado & Transações JDBC',
            volume: 'Controle de Centenas de SKUs de Inventário',
            database: 'MySQL 8.0 Relacional (Driver JDBC Nativo)',
            codeSnippet: `// Controle de Estoque: Camada DAO com PreparedStatement & Transações Atômicas JDBC
public class ProdutoDAO {
    private final Connection connection;

    public ProdutoDAO(Connection connection) {
        this.connection = connection;
    }

    public boolean atualizarEstoqueTransacional(int produtoId, double quantidadeSaida) throws SQLException {
        String sqlVerifica = "SELECT quantidade FROM produtos WHERE id = ? FOR UPDATE";
        String sqlDebita   = "UPDATE produtos SET quantidade = quantidade - ? WHERE id = ? AND quantidade >= ?";

        try {
            // 1. Início de transação atômica manual no driver JDBC
            connection.setAutoCommit(false);

            // 2. Verificação de saldo de inventário com trava de linha
            try (PreparedStatement stmtVerifica = connection.prepareStatement(sqlVerifica)) {
                stmtVerifica.setInt(1, produtoId);
                ResultSet rs = stmtVerifica.executeQuery();
                if (!rs.next() || rs.getDouble("quantidade") < quantidadeSaida) {
                    connection.rollback();
                    return false; // Saldo de inventário insuficiente
                }
            }

            // 3. Débito atômico garantido sem concorrência destrutiva
            try (PreparedStatement stmtDebita = connection.prepareStatement(sqlDebita)) {
                stmtDebita.setDouble(1, quantidadeSaida);
                stmtDebita.setInt(2, produtoId);
                stmtDebita.setDouble(3, quantidadeSaida);
                int rows = stmtDebita.executeUpdate();

                if (rows > 0) {
                    connection.commit();
                    return true;
                } else {
                    connection.rollback();
                    return false;
                }
            }
        } catch (SQLException e) {
            connection.rollback();
            throw new PersistenceException("Falha na transação de estoque: " + e.getMessage(), e);
        } finally {
            connection.setAutoCommit(true);
        }
    }
}`,
            concurrencyTable: [
                {
                    lockMechanism: 'PreparedStatement Parameterized Queries',
                    exceptionHandling: 'Tratamento estrito de tipos primitivos no driver JDBC, prevenindo 100% de ataques SQL Injection',
                    acidGuarantee: 'Plano de execução pré-compilado e sanitização automática de parâmetros de consulta'
                },
                {
                    lockMechanism: 'Transações Atômicas JDBC (setAutoCommit(false))',
                    exceptionHandling: 'Rollback compulsório em caso de queda de socket, estouro de buffer ou SQLException',
                    acidGuarantee: 'Consistência de saldo de inventário sem discrepâncias ou registros órfãos'
                },
                {
                    lockMechanism: 'Padrão MVC com DAO Desacoplado',
                    exceptionHandling: 'Exceções de persistência encapsuladas antes do repasse à interface gráfica Swing',
                    acidGuarantee: 'Isolamento estrito entre o Event Dispatch Thread (EDT) e a camada de banco'
                }
            ],
            challenges: [
                {
                    problem: 'Garantir consistência atômica no estoque durante operações concorrentes e prevenir riscos de injeção SQL em consultas dinâmicas de filtragem.',
                    impactChip: 'PreparedStatement Zero SQLi',
                    solution: 'Utilização estrita de PreparedStatement parametrizado no driver JDBC, controle manual de transação com rollback condicional e isolamento da camada DAO.'
                }
            ]
        };
    }

    // 5: API de Tarefas (Python / Flask Blueprints)
    if (idNum === 5 || project.title.includes('API de Tarefas') || (project.tags || []).includes('Flask')) {
        return {
            version: 'v2.1.0 • RESTful API',
            ecosystemIcon: 'fas fa-list-check',
            domain: 'API RESTful Modularizada com Flask Blueprints',
            architectureType: 'Flask Blueprints Modular com Tratamento Centralizado de Erros',
            volume: 'Centenas de Requisições CRUD / dia',
            database: 'SQLite / PostgreSQL com Camada de Serialização JSON',
            codeSnippet: `# API de Tarefas: Flask Blueprint Modular com Tratamento Centralizado de Exceções
from flask import Blueprint, request, jsonify, abort
from datetime import datetime
import uuid

tasks_bp = Blueprint('tasks', __name__, url_prefix='/api/v1/tasks')

@tasks_bp.errorhandler(400)
def bad_request(error):
    return jsonify({"error": "Bad Request", "details": str(error)}), 400

@tasks_bp.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource Not Found", "status": 404}), 404

@tasks_bp.route('/', methods=['POST'])
def create_task():
    payload = request.get_json()
    if not payload or 'title' not in payload or not payload['title'].strip():
        return jsonify({"error": "Validation Error", "field": "title", "message": "Título é obrigatório"}), 422

    # Sanitização e persistência atômica da tarefa
    new_task = {
        "id": str(uuid.uuid4()),
        "title": payload['title'].strip(),
        "completed": bool(payload.get('completed', False)),
        "created_at": datetime.utcnow().isoformat()
    }
    
    # Persistência desacoplada da camada de apresentação
    db_session.add(new_task)
    db_session.commit()
    
    return jsonify({"status": "success", "data": new_task}), 201`,
            concurrencyTable: [
                {
                    lockMechanism: 'Flask Blueprints Modular Isolation',
                    exceptionHandling: 'Separação declarativa de rotas por domínio de negócio com carregamento dinâmico',
                    acidGuarantee: 'Encapsulamento estrito e baixo acoplamento entre endpoints'
                },
                {
                    lockMechanism: 'Centralized HTTP Exception Handler',
                    exceptionHandling: 'Interceptação global de status 400, 404, 422 e 500 retornando JSON RFC 7807 normalizado',
                    acidGuarantee: 'Zero vazamento de tracebacks ou dados sensíveis em produção'
                },
                {
                    lockMechanism: 'CORS & Input Validation Pipeline',
                    exceptionHandling: 'Rejeição de requisições malformadas ou com cabeçalhos de origem não autorizados',
                    acidGuarantee: 'Contratos de resposta uniformes para consumo por aplicações frontend'
                }
            ],
            challenges: [
                {
                    problem: 'Evitar o acoplamento de rotas em um único arquivo de servidor e garantir respostas de erro estruturadas e previsíveis para os clientes HTTP.',
                    impactChip: 'Flask Blueprints',
                    solution: 'Modularização do projeto com Flask Blueprints, implementação de decoradores de captura de erro centralizados e padronização das respostas JSON.'
                }
            ]
        };
    }

    // 6: Gerador de Senhas (Python / Tkinter + CSPRNG secrets)
    if (idNum === 6 || project.title.includes('Gerador de Senhas') || (project.tags || []).includes('Tkinter')) {
        return {
            version: 'v1.4.0 • CSPRNG Seguro',
            ecosystemIcon: 'fas fa-key',
            domain: 'Engine de Criptografia & Entropia de Senhas com Tkinter',
            architectureType: 'Interface Gui Orientada a Eventos Desacoplada de CSPRNG',
            volume: 'Entropia Criptográfica Instantânea',
            database: 'Criptografia em Memória (os.urandom) + Pyperclip Binding',
            codeSnippet: `# Gerador de Senhas: Engine de Entropia com CSPRNG (secrets) e Validação Regex
import secrets
import string
import re
import math

class PasswordEngine:
    CHAR_POOLS = {
        'upper': string.ascii_uppercase,
        'lower': string.ascii_lowercase,
        'digits': string.digits,
        'special': '!@#$%^&*()-_=+[]{}|;:,.<>?'
    }

    @staticmethod
    def generate_secure_password(length: int = 16, min_entropy: float = 64.0) -> str:
        if length < 8:
            raise ValueError("O comprimento mínimo exigido é de 8 caracteres.")

        # 1. Conjunto combinado de caracteres de alta entropia
        alphabet = "".join(PasswordEngine.CHAR_POOLS.values())
        
        while True:
            # 2. CSPRNG: secrets.choice usa os.urandom (imune a predições de semente)
            candidate = "".join(secrets.choice(alphabet) for _ in range(length))
            
            # 3. Validação estrita por Expressão Regular (Regex Lookahead)
            has_upper = re.search(r'[A-Z]', candidate)
            has_lower = re.search(r'[a-z]', candidate)
            has_digit = re.search(r'\\d', candidate)
            has_special = re.search(r'[^A-Za-z0-9]', candidate)
            
            # 4. Cálculo de bits de entropia de Shannon: E = L * log2(R)
            entropy = length * math.log2(len(alphabet))
            
            if has_upper and has_lower and has_digit and has_special and entropy >= min_entropy:
                return candidate`,
            concurrencyTable: [
                {
                    lockMechanism: 'CSPRNG via Módulo Nativo secrets (os.urandom)',
                    exceptionHandling: 'Uso de gerador de entropia do kernel do SO imune a ataques de análise de semente pseudo-aleatória',
                    acidGuarantee: 'Aleatoriedade estatística comprovada e não-determinística'
                },
                {
                    lockMechanism: 'Validação de Complexidade via Regex Lookahead',
                    exceptionHandling: 'Rejeição mandatória em loop de qualquer candidato que não contenha maiúsculas, minúsculas, dígitos e símbolos',
                    acidGuarantee: 'Conformidade compulsória com políticas corporativas de segurança'
                },
                {
                    lockMechanism: 'Desacoplamento do Event Loop Tkinter',
                    exceptionHandling: 'Geração instantânea em microsegundos sem bloquear o despacho de eventos da interface gráfica',
                    acidGuarantee: 'Interface responsiva e integração segura com o clipboard do sistema via pyperclip'
                }
            ],
            challenges: [
                {
                    problem: 'Garantir que senhas geradas aleatoriamente não utilizem funções pseudoaleatórias previsíveis (como random) e sempre atendam aos requisitos de complexidade.',
                    impactChip: 'CSPRNG secrets',
                    solution: 'Substituição completa do gerador tradicional pelo módulo secrets, cálculo matemático de entropia de Shannon e verificação estrita via Regex.'
                }
            ]
        };
    }

    // Fallback Defensivo Genérico
    const isDesktop = (project.tags || []).some(t => /desktop|swing|tkinter/i.test(t));
    return {
        version: 'v1.0.0 • Estável',
        ecosystemIcon: isDesktop ? 'fas fa-laptop-code' : 'fas fa-layer-group',
        domain: project.details?.subtitle || project.description || 'Soluções Corporativas & Engenharia de Software',
        architectureType: isDesktop ? 'Arquitetura Desktop / Componentes de Interface' : 'Arquitetura em Camadas (Service-Repository)',
        volume: 'Uso Empresarial / Ferramenta de Engenharia',
        database: (project.tags || []).includes('MySQL') ? 'MySQL Relacional' : 'Banco Relacional / Local Storage',
        challenges: [
            {
                problem: project.details?.challenge || 'Garantir consistência estrutural, baixo acoplamento e ergonomia de uso.',
                impactChip: 'Engenharia Limpa',
                solution: project.details?.solution || 'Modelagem orientada a objetos com separação clara de responsabilidades.'
            }
        ]
    };
}

function ProjectInspectorDrawer({ project, onClose }: ProjectInspectorDrawerProps) {
    const { lang } = useLanguage();
    const reducedMotion = useReducedMotion();
    const overlayRef = useRef<HTMLDivElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const runnerTimer = useRef<ReturnType<typeof setInterval> | null>(null);
    const dialogId = useId();
    const tr = (pt: string, en: string, es = pt) => lang === 'en' ? en : lang === 'es' ? es : pt;
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [selectedEndpointIndex, setSelectedEndpointIndex] = useState(0);

    // Carregar dados de engenharia enriquecidos (Flagships ou Corporativos Reais)
    const specs: ProjectEnrichedSpecs = useMemo(() => {
        const idNum = Number(project.id);
        if (FLAGSHIP_SPECS[idNum]) {
            return FLAGSHIP_SPECS[idNum];
        }
        const corporateSpecs = getCorporateRealSpecs(project);
        if (project.architectureDetails) {
            return {
                ...corporateSpecs,
                architectureType: project.architectureDetails.architectureType || corporateSpecs.architectureType,
                domain: project.architectureDetails.domain || corporateSpecs.domain,
                database: project.architectureDetails.database || corporateSpecs.database,
                volume: project.architectureDetails.volume || corporateSpecs.volume,
                ecosystemIcon: project.architectureDetails.ecosystemIcon || corporateSpecs.ecosystemIcon,
                codeSnippet: project.architectureDetails.codeSnippet || corporateSpecs.codeSnippet,
                layers: project.architectureDetails.layers || corporateSpecs.layers,
                concurrencyTable: project.architectureDetails.concurrencyTable || corporateSpecs.concurrencyTable,
                challenges: project.architectureDetails.challenges || corporateSpecs.challenges,
            };
        }
        return corporateSpecs;
    }, [project]);

    // ── Auditoria de Conteúdo: Abas Condicionais e Estritamente Defensivas ──
    const hasContracts = Boolean(specs.apiContracts?.endpoints && specs.apiContracts.endpoints.length > 0);
    const hasEngineeringTests = Boolean(specs.engineeringTests?.assertions && specs.engineeringTests.assertions.length > 0);
    const hasArchitectureData = Boolean(
        specs.codeSnippet || 
        (specs.concurrencyTable && specs.concurrencyTable.length > 0) ||
        (specs.layers && specs.layers.length > 0) ||
        (project.details?.architecture && project.details.architecture.length > 0) ||
        (project.architectureDetails && (
            project.architectureDetails.codeSnippet ||
            (project.architectureDetails.concurrencyTable && project.architectureDetails.concurrencyTable.length > 0) ||
            (project.architectureDetails.layers && project.architectureDetails.layers.length > 0)
        ))
    );

    // Construção estritamente dinâmica das abas (elimina 100% de abas vazias no DOM)
    const availableTabs = useMemo(() => {
        const tabs: Array<{ id: 'overview' | 'architecture' | 'contracts' | 'engineering'; label: string; icon: string }> = [
            { id: 'overview', label: lang === 'en' ? 'Overview' : lang === 'es' ? 'Resumen' : 'Resumo', icon: 'fas fa-layer-group' },
        ];

        // Aba de Arquitetura só é exibida se houver dados reais a apresentar
        if (hasArchitectureData) {
            tabs.push({ id: 'architecture', label: lang === 'en' ? 'Architecture' : lang === 'es' ? 'Arquitectura' : 'Arquitetura', icon: 'fas fa-shield-alt' });
        }

        if (hasContracts) {
            tabs.push({ id: 'contracts', label: 'API', icon: 'fas fa-file-contract' });
        }

        if (hasEngineeringTests) {
            tabs.push({ id: 'engineering', label: lang === 'en' ? 'Tests' : lang === 'es' ? 'Pruebas' : 'Testes', icon: 'fas fa-vial' });
        }

        return tabs;
    }, [lang, hasArchitectureData, hasContracts, hasEngineeringTests]);

    const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'contracts' | 'engineering'>('overview');

    // Fallback de segurança caso a aba ativa não pertença às abas disponíveis do projeto
    useEffect(() => {
        if (!availableTabs.some(t => t.id === activeTab)) {
            setActiveTab(availableTabs[0]?.id || 'overview');
        }
    }, [availableTabs, activeTab]);

    // ── FSM State Machine para Runner de Asserções (apenas se hasEngineeringTests) ──
    const [runnerState, setRunnerState] = useState<'IDLE' | 'RUNNING' | 'COMPLETED'>('IDLE');
    const [activeAssertionIndex, setActiveAssertionIndex] = useState<number | null>(null);
    const [chaosActive, setChaosActive] = useState(false);

    // Percentis dinâmicos recalculados ao vivo conforme injeção de caos
    const currentPercentiles = useMemo(() => {
        if (!specs.engineeringTests?.percentiles) {
            return { p50: 0, p95: 0, p99: 0 };
        }
        if (!chaosActive) return specs.engineeringTests.percentiles;
        return {
            p50: specs.engineeringTests.percentiles.p50 + 94,
            p95: specs.engineeringTests.percentiles.p95 + 162,
            p99: specs.engineeringTests.percentiles.p99 + 280,
        };
    }, [chaosActive, specs.engineeringTests]);

    const activeEndpoint = hasContracts && specs.apiContracts?.endpoints
        ? specs.apiContracts.endpoints[selectedEndpointIndex] || specs.apiContracts.endpoints[0]
        : null;

    // Feedback sonoro e toast ao copiar
    const showToast = useCallback((msg: string) => {
        playMechanicalClick();
        setToastMessage(msg);
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToastMessage(null), 2500);
    }, []);

    const copyToClipboard = useCallback((text: string, label: string) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => showToast(lang === 'en' ? `${label} copied.` : lang === 'es' ? `${label} copiado.` : `${label} copiado.`))
                .catch(() => showToast(lang === 'en' ? 'Clipboard is unavailable.' : lang === 'es' ? 'No se pudo copiar.' : 'Não foi possível copiar.'));
        }
    }, [showToast, lang]);

    // Copiar cURL da rota ativa
    const copyCurlCommand = useCallback(() => {
        if (!activeEndpoint) return;
        const headersStr = (activeEndpoint.headers || [])
            .map(h => `-H "${h.name}: ${h.value}"`)
            .join(' ');
        const bodyStr = activeEndpoint.method !== 'GET' && activeEndpoint.requestBody && activeEndpoint.requestBody !== '{}'
            ? `-d '${activeEndpoint.requestBody.replace(/\n/g, '')}'`
            : '';
        const baseUrl = specs.apiContracts?.baseUrl?.replace(/\/$/, '') || '${BASE_URL}';
        const curl = `curl -X ${activeEndpoint.method} "${baseUrl}${activeEndpoint.route}" ${headersStr} ${bodyStr}`.trim();
        copyToClipboard(curl, 'Comando cURL');
    }, [activeEndpoint, copyToClipboard, specs.apiContracts?.baseUrl]);

    // Disparar execução da bateria de testes com FSM determinística
    const runAssertionsSimulation = useCallback(() => {
        if (!specs.engineeringTests?.assertions?.length || runnerState === 'RUNNING') return;
        playMechanicalClick();
        setRunnerState('RUNNING');
        setActiveAssertionIndex(0);

        let step = 0;
        const total = specs.engineeringTests.assertions.length;
        runnerTimer.current = setInterval(() => {
            step++;
            if (step < total) {
                setActiveAssertionIndex(step);
            } else {
                if (runnerTimer.current) clearInterval(runnerTimer.current);
                runnerTimer.current = null;
                setActiveAssertionIndex(null);
                setRunnerState('COMPLETED');
                showToast(lang === 'en' ? 'Local demonstration completed.' : lang === 'es' ? 'Demostración local finalizada.' : 'Demonstração local concluída.');
            }
        }, 420);
    }, [runnerState, specs.engineeringTests, showToast, lang]);

    // Keep focus inside the dialog. Arrow navigation belongs to the tab list;
    // code selection and other controls retain their usual keyboard behavior.
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                onClose();
                return;
            }
            if (e.key === 'Tab') {
                const controls = [...(dialogRef.current?.querySelectorAll<HTMLElement>(
                    'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
                ) || [])].filter(node => node.tabIndex >= 0 && !node.closest('[inert]') && node.getClientRects().length > 0);
                const first = controls[0];
                const last = controls[controls.length - 1];
                const active = document.activeElement;
                if (!first || !last) { e.preventDefault(); return; }
                if (!dialogRef.current?.contains(active) || (e.shiftKey ? active === first : active === last)) {
                    e.preventDefault();
                    (e.shiftKey ? last : first).focus();
                }
                return;
            }
            if (!(document.activeElement instanceof HTMLElement) || !document.activeElement.closest('[role="tablist"]')) return;
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                playTabSwitch();
                setActiveTab(curr => {
                    const idx = availableTabs.findIndex(t => t.id === curr);
                    const nextIdx = (idx + 1) % availableTabs.length;
                    dialogRef.current?.querySelector<HTMLButtonElement>(`[data-inspector-tab="${availableTabs[nextIdx].id}"]`)?.focus();
                    return availableTabs[nextIdx].id;
                });
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                playTabSwitch();
                setActiveTab(curr => {
                    const idx = availableTabs.findIndex(t => t.id === curr);
                    const prevIdx = (idx - 1 + availableTabs.length) % availableTabs.length;
                    dialogRef.current?.querySelector<HTMLButtonElement>(`[data-inspector-tab="${availableTabs[prevIdx].id}"]`)?.focus();
                    return availableTabs[prevIdx].id;
                });
            }
        };

        document.addEventListener('keydown', handleKeyDown, true);
        return () => document.removeEventListener('keydown', handleKeyDown, true);
    }, [onClose, availableTabs]);

    // Bloqueio de scroll no body durante a exibição da gaveta
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        const originalPadding = document.body.style.paddingRight;
        const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const scrollbar = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
        const zoom = Number.parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
        const inertSiblings = Array.from(document.body.children)
            .filter((node): node is HTMLElement => node instanceof HTMLElement && node !== overlayRef.current)
            .map(node => ({ node, inert: node.inert }));
        inertSiblings.forEach(({ node }) => { node.inert = true; });
        if (scrollbar) document.body.style.paddingRight = `${Number.parseFloat(getComputedStyle(document.body).paddingRight) + scrollbar / zoom}px`;
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus({ preventScroll: true });
        const handleFocus = (event: FocusEvent) => {
            if (event.target instanceof Node && !dialogRef.current?.contains(event.target)) closeRef.current?.focus({ preventScroll: true });
        };
        document.addEventListener('focusin', handleFocus);
        return () => {
            document.removeEventListener('focusin', handleFocus);
            inertSiblings.forEach(({ node, inert }) => { node.inert = inert; });
            document.body.style.overflow = originalOverflow;
            document.body.style.paddingRight = originalPadding;
            if (toastTimer.current) clearTimeout(toastTimer.current);
            if (runnerTimer.current) clearInterval(runnerTimer.current);
            if (previousFocus?.isConnected && !previousFocus.closest('[inert]')) previousFocus.focus({ preventScroll: true });
        };
    }, []);

    useEffect(() => { if (contentRef.current) contentRef.current.scrollTop = 0; }, [activeTab]);

    const description = project.details?.fullDescription || project.description;
    const layers = specs.layers?.length ? specs.layers : project.details?.architecture || [];
    const panelMotion = { initial: { opacity: 0, y: reducedMotion ? 0 : 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 }, transition: { duration: reducedMotion ? 0 : .18 } };

    return createPortal(
        <motion.div key={`inspector-backdrop-${project.id}`} ref={overlayRef} data-lenis-prevent
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : .2 }} onClick={event => { if (event.target === event.currentTarget) onClose(); }} className="project-inspector-overlay">
            <motion.div key={`inspector-drawer-${project.id}`} ref={dialogRef}
                role="dialog" aria-modal="true" aria-labelledby={`${dialogId}-title`}
                initial={{ x: reducedMotion ? 0 : 64, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                exit={{ x: reducedMotion ? 0 : 48, opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .3, ease: [.22, 1, .36, 1] }}
                onClick={e => e.stopPropagation()} className="project-inspector">
                <header className="inspector-header">
                    <div>
                        <span className="inspector-eyebrow">{tr('Estudo de projeto', 'Project case study', 'Estudio de proyecto')}</span>
                        <h2 id={`${dialogId}-title`}>{project.title}</h2>
                    </div>
                    <button ref={closeRef} type="button" onClick={onClose} className="inspector-close"
                        aria-label={tr('Fechar detalhes', 'Close details', 'Cerrar detalles')} data-cursor-morph="true">
                        <i className="fas fa-times" aria-hidden="true" /><kbd>Esc</kbd>
                    </button>
                </header>

                <nav className="inspector-tabs" role="tablist" aria-label={tr('Detalhes do projeto', 'Project details', 'Detalles del proyecto')}>
                    {availableTabs.map(tab => <button key={tab.id} type="button" role="tab"
                        id={`${dialogId}-tab-${tab.id}`} aria-controls={`${dialogId}-panel-${tab.id}`}
                        aria-selected={activeTab === tab.id} tabIndex={activeTab === tab.id ? 0 : -1}
                        data-inspector-tab={tab.id} data-cursor-morph="true"
                        onClick={() => { playTabSwitch(); setActiveTab(tab.id); }}>{tab.label}</button>)}
                </nav>

                <div ref={contentRef} className="inspector-scroll" data-lenis-prevent role="region"
                    aria-label={tr('Conteúdo do projeto', 'Project content', 'Contenido del proyecto')} tabIndex={0}>
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && <motion.div key="overview" {...panelMotion} role="tabpanel"
                            id={`${dialogId}-panel-overview`} aria-labelledby={`${dialogId}-tab-overview`} className="inspector-panel">
                            {description && <section className="inspector-context">
                                <h3>{tr('O projeto', 'The project', 'El proyecto')}</h3>
                                <p>{description}</p>
                            </section>}

                            {Boolean(project.details?.metrics?.length) && <section>
                                <h3>{tr('Resultados e características', 'Outcomes & characteristics', 'Resultados y características')}</h3>
                                <dl className="inspector-outcomes">
                                    {project.details!.metrics!.map((metric, index) => <div key={index}>
                                        {typeof metric !== 'string' && metric.label && <dt>{metric.label}</dt>}
                                        <dd>{typeof metric === 'string' ? metric : metric.value}</dd>
                                    </div>)}
                                </dl>
                            </section>}

                            {Boolean(project.details?.highlights?.length) && <section>
                                <h3>{tr('O que foi desenvolvido', 'What was built', 'Qué se desarrolló')}</h3>
                                <ul className="inspector-highlights">{project.details!.highlights!.map((item, index) => <li key={index}>{item}</li>)}</ul>
                            </section>}

                            {(project.details?.challenge || project.details?.solution) && <details className="inspector-disclosure">
                                <summary>{tr('Desafio e abordagem', 'Challenge & approach', 'Desafío y enfoque')}</summary>
                                <div className="inspector-disclosure-content">
                                    {project.details.challenge && <div><h4>{tr('Desafio', 'Challenge', 'Desafío')}</h4><p>{project.details.challenge}</p></div>}
                                    {project.details.solution && <div><h4>{tr('Abordagem', 'Approach', 'Enfoque')}</h4><p>{project.details.solution}</p></div>}
                                </div>
                            </details>}

                            {Boolean(specs.challenges?.length) && <section>
                                <h3>{tr('Decisões técnicas', 'Technical decisions', 'Decisiones técnicas')}</h3>
                                <div className="inspector-decisions">{specs.challenges!.map((challenge, index) => <details key={index} className="inspector-disclosure">
                                    <summary>{challenge.impactChip}</summary>
                                    <div className="inspector-disclosure-content">
                                        <div><h4>{tr('Problema', 'Problem', 'Problema')}</h4><p>{challenge.problem}</p></div>
                                        <div><h4>{tr('Solução', 'Solution', 'Solución')}</h4><p>{challenge.solution}</p></div>
                                    </div>
                                </details>)}</div>
                            </section>}

                            {Boolean(project.tags?.length) && <section className="inspector-stack">
                                <h4>{tr('Tecnologias utilizadas', 'Technologies used', 'Tecnologías utilizadas')}</h4>
                                <p>{project.tags!.join(' · ')}</p>
                            </section>}
                        </motion.div>}

                        {activeTab === 'architecture' && hasArchitectureData && <motion.div key="architecture" {...panelMotion} role="tabpanel"
                            id={`${dialogId}-panel-architecture`} aria-labelledby={`${dialogId}-tab-architecture`} className="inspector-panel">
                            <section>
                                <h3>{tr('Como o sistema foi estruturado', 'How the system is structured', 'Cómo se estructuró el sistema')}</h3>
                                <dl className="inspector-facts">
                                    <div><dt>{tr('Arquitetura', 'Architecture', 'Arquitectura')}</dt><dd>{specs.architectureType}</dd></div>
                                    <div><dt>{tr('Persistência', 'Persistence', 'Persistencia')}</dt><dd>{specs.database}</dd></div>
                                    <div><dt>{tr('Escala', 'Scale', 'Escala')}</dt><dd>{specs.volume}</dd></div>
                                    <div><dt>{tr('Domínio', 'Domain', 'Dominio')}</dt><dd>{specs.domain}</dd></div>
                                </dl>
                            </section>
                            {layers.length > 0 && <section>
                                <h3>{tr('Camadas e responsabilidades', 'Layers & responsibilities', 'Capas y responsabilidades')}</h3>
                                <ol className="inspector-layers">{layers.map((layer, index) => <li key={index}>
                                    <span className="inspector-layer-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                                    <div><h4>{layer.layer}</h4><span className="inspector-technology">{layer.tech}</span><p>{layer.role}</p></div>
                                </li>)}</ol>
                            </section>}
                            {Boolean(specs.concurrencyTable?.length) && <section>
                                <h3>{tr('Concorrência e resiliência', 'Concurrency & resilience', 'Concurrencia y resiliencia')}</h3>
                                <div className="inspector-decisions">{specs.concurrencyTable!.map((row, index) => <details key={index} className="inspector-disclosure">
                                    <summary>{row.lockMechanism}</summary>
                                    <div className="inspector-disclosure-content">
                                        <div><h4>{tr('Tratamento de exceções', 'Exception handling', 'Gestión de excepciones')}</h4><p>{row.exceptionHandling}</p></div>
                                        <div><h4>{tr('Garantia', 'Guarantee', 'Garantía')}</h4><p>{row.acidGuarantee}</p></div>
                                    </div>
                                </details>)}</div>
                            </section>}
                            {specs.codeSnippet && <details className="inspector-disclosure inspector-code-disclosure">
                                <summary>{tr('Ver implementação central', 'View core implementation', 'Ver implementación central')}</summary>
                                <div className="inspector-disclosure-content">
                                    <button type="button" className="inspector-button" data-cursor-morph="true"
                                        onClick={() => copyToClipboard(specs.codeSnippet || '', tr('Código', 'Code', 'Código'))}>
                                        <i className="fas fa-copy" aria-hidden="true" />{tr('Copiar código', 'Copy code', 'Copiar código')}
                                    </button>
                                    <pre className="inspector-code"><code>{specs.codeSnippet}</code></pre>
                                </div>
                            </details>}
                            <p className="inspector-footnote">{specs.version.replace('Produção', tr('Produção', 'Production', 'Producción'))}</p>
                        </motion.div>}

                        {activeTab === 'contracts' && hasContracts && activeEndpoint && <motion.div key="contracts" {...panelMotion} role="tabpanel"
                            id={`${dialogId}-panel-contracts`} aria-labelledby={`${dialogId}-tab-contracts`} className="inspector-panel">
                            <section>
                                <h3>{tr('Contrato de integração', 'Integration contract', 'Contrato de integración')}</h3>
                                <p className="inspector-intro">{tr('Selecione uma rota para consultar o formato da requisição e da resposta.', 'Select a route to inspect its request and response formats.', 'Selecciona una ruta para consultar los formatos de solicitud y respuesta.')}</p>
                                <div className="inspector-endpoints" aria-label={tr('Rotas disponíveis', 'Available routes', 'Rutas disponibles')}>
                                    {specs.apiContracts!.endpoints.map((endpoint, index) => <button key={index} type="button"
                                        aria-pressed={selectedEndpointIndex === index} data-cursor-morph="true"
                                        onClick={() => { playTabSwitch(); setSelectedEndpointIndex(index); }}>
                                        <span>{endpoint.method}</span><code>{endpoint.route}</code>
                                    </button>)}
                                </div>
                                <p className="inspector-route-description">{activeEndpoint.description}</p>
                                <div className="inspector-route-meta"><span>{activeEndpoint.status}</span>{activeEndpoint.latency && <span>{activeEndpoint.latency}</span>}</div>
                                <div className="inspector-api-action">
                                    <button type="button" onClick={copyCurlCommand} className="inspector-button" data-cursor-morph="true">
                                        <i className="fas fa-copy" aria-hidden="true" />{tr('Copiar cURL', 'Copy cURL', 'Copiar cURL')}
                                    </button>
                                    <p className="inspector-footnote">{specs.apiContracts?.baseUrl
                                        ? tr('Exemplo de requisição para o endereço configurado.', 'Request example for the configured address.', 'Ejemplo de solicitud para la dirección configurada.')
                                        : tr('Defina BASE_URL com o endereço da sua API antes de usar o exemplo.', 'Set BASE_URL to your API address before using the example.', 'Define BASE_URL con la dirección de tu API antes de usar el ejemplo.')}</p>
                                </div>
                            </section>
                            {Boolean(activeEndpoint.headers?.length) && <section>
                                <h4>{tr('Cabeçalhos', 'Headers', 'Cabeceras')}</h4>
                                <dl className="inspector-api-headers">{activeEndpoint.headers!.map((header, index) => <div key={index}>
                                    <dt><code>{header.name}</code>{header.desc && <span>{header.desc}</span>}</dt><dd><code>{header.value}</code></dd>
                                </div>)}</dl>
                            </section>}
                            {activeEndpoint.requestBody && activeEndpoint.requestBody !== '{}' && <section>
                                <div className="inspector-section-action"><h4>{tr('Corpo da requisição', 'Request body', 'Cuerpo de solicitud')}</h4>
                                    <button type="button" className="inspector-text-button" data-cursor-morph="true"
                                        onClick={() => copyToClipboard(activeEndpoint.requestBody || '', 'JSON')}>{tr('Copiar JSON', 'Copy JSON', 'Copiar JSON')}</button>
                                </div>
                                <pre className="inspector-code"><code>{activeEndpoint.requestBody}</code></pre>
                            </section>}
                            {activeEndpoint.responseBody && <section>
                                <h4>{tr('Corpo da resposta', 'Response body', 'Cuerpo de respuesta')}</h4>
                                <pre className="inspector-code"><code>{activeEndpoint.responseBody}</code></pre>
                            </section>}
                        </motion.div>}

                        {activeTab === 'engineering' && hasEngineeringTests && specs.engineeringTests && <motion.div key="engineering" {...panelMotion} role="tabpanel"
                            id={`${dialogId}-panel-engineering`} aria-labelledby={`${dialogId}-tab-engineering`} className="inspector-panel">
                            <section>
                                <h3>{tr('Qualidade e desempenho', 'Quality & performance', 'Calidad y rendimiento')}</h3>
                                <p className="inspector-intro">{tr('Os controles abaixo reproduzem cenários localmente para explicar o comportamento do sistema. Não executam uma auditoria nem enviam requisições ao projeto.', 'The controls below replay local scenarios to explain system behavior. They do not run an audit or send requests to the project.', 'Los controles reproducen escenarios locales para explicar el sistema. No realizan una auditoría ni envían solicitudes al proyecto.')}</p>
                                <div className="inspector-section-action"><h4>{tr('Percentis de latência · NIST', 'Latency percentiles · NIST', 'Percentiles de latencia · NIST')}</h4>
                                    {specs.engineeringTests.uptime && <span className="inspector-footnote">{specs.engineeringTests.uptime} uptime</span>}
                                </div>
                                <dl className="inspector-percentiles">{(['p50', 'p95', 'p99'] as const).map((percentile, index) => <div key={percentile}>
                                    <dt>{percentile}</dt><dd>{currentPercentiles[percentile]}<span>ms</span></dd>
                                    <span className="inspector-percentile-note">{[tr('Mediana', 'Median', 'Mediana'), tr('95% das requisições', '95% of requests', '95% de solicitudes'), tr('Cauda de latência', 'Latency tail', 'Cola de latencia')][index]}</span>
                                </div>)}</dl>
                                {specs.engineeringTests.coverage !== undefined && <p className="inspector-footnote">{tr('Cobertura informada', 'Reported coverage', 'Cobertura informada')}: {specs.engineeringTests.coverage}%</p>}
                            </section>
                            <section>
                                <div className="inspector-section-action"><h3>{tr('Cenários de teste', 'Test scenarios', 'Escenarios de prueba')}</h3>
                                    <button type="button" onClick={runAssertionsSimulation} disabled={runnerState === 'RUNNING'} className="inspector-button" data-cursor-morph="true">
                                        <i className={`fas ${runnerState === 'RUNNING' ? 'fa-circle-notch fa-spin' : 'fa-play'}`} aria-hidden="true" />
                                        {runnerState === 'RUNNING' ? tr('Demonstrando…', 'Replaying…', 'Reproduciendo…') : runnerState === 'COMPLETED' ? tr('Repetir demonstração', 'Replay demonstration', 'Repetir demostración') : tr('Executar demonstração', 'Run demonstration', 'Ejecutar demostración')}
                                    </button>
                                </div>
                                <ul className="inspector-tests" aria-live="polite">{specs.engineeringTests.assertions.map((assertion, index) => <li key={index} data-running={activeAssertionIndex === index}>
                                    <div><h4>{assertion.name}</h4><p>{assertion.details}</p></div>
                                    <div className="inspector-test-status"><span>{activeAssertionIndex === index ? tr('Em demonstração', 'Replaying', 'Reproduciendo') : assertion.status}</span><span>{assertion.latency}</span></div>
                                </li>)}</ul>
                            </section>
                            {Boolean(specs.engineeringTests.chaosLab?.length) && <section>
                                <div className="inspector-section-action"><h3>{tr('Comportamento sob falhas', 'Behavior under failure', 'Comportamiento ante fallos')}</h3>
                                    <button type="button" aria-pressed={chaosActive} className="inspector-button" data-cursor-morph="true"
                                        onClick={() => { playMechanicalClick(); setChaosActive(current => !current); }}>
                                        <i className="fas fa-bolt" aria-hidden="true" />{chaosActive ? tr('Encerrar simulação', 'End simulation', 'Finalizar simulación') : tr('Simular injeção de caos', 'Simulate chaos injection', 'Simular inyección de caos')}
                                    </button>
                                </div>
                                <p className="inspector-footnote" aria-live="polite">{chaosActive ? tr('Simulação ativa: os percentis acima refletem a latência adicional do cenário.', 'Simulation active: the percentiles above reflect additional scenario latency.', 'Simulación activa: los percentiles reflejan la latencia adicional del escenario.') : tr('Ative para comparar o efeito de latência nos percentis.', 'Enable to compare the effect of latency on percentiles.', 'Activa para comparar el efecto de latencia en los percentiles.')}</p>
                                <ul className="inspector-failures">{specs.engineeringTests.chaosLab.map((scenario, index) => <li key={index}>
                                    <h4>{scenario.scenario}</h4><p>{scenario.outcome}</p>
                                </li>)}</ul>
                            </section>}
                        </motion.div>}
                    </AnimatePresence>
                </div>
                <AnimatePresence>{toastMessage && <motion.div key="toast" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ duration: reducedMotion ? 0 : .15 }} role="status" className="inspector-toast"><i className="fas fa-check" aria-hidden="true" />{toastMessage}</motion.div>}</AnimatePresence>
            </motion.div>
        </motion.div>,
        document.body,
    );
}

export default React.memo(ProjectInspectorDrawer);
