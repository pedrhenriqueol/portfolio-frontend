import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { playTabSwitch, playMechanicalClick } from '../../lib/sound';
import { Project, ApiContractData, TestOpsData } from '../../types/project';

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

/* ─────────────────────────────────────────────────────────────────
   ── COMPONENTE PRINCIPAL: PROJECT INSPECTOR DRAWER ───────────────
   ───────────────────────────────────────────────────────────────── */
export default function ProjectInspectorDrawer({ project, onClose }: ProjectInspectorDrawerProps) {
    const { lang } = useLanguage();
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
            { id: 'overview', label: lang === 'en' ? 'Overview & Scope' : 'Visão Geral & Escopo', icon: 'fas fa-layer-group' },
        ];

        // Aba de Arquitetura só é exibida se houver dados reais a apresentar
        if (hasArchitectureData) {
            tabs.push({ id: 'architecture', label: lang === 'en' ? 'Architecture & Engineering' : 'Arquitetura & Engenharia', icon: 'fas fa-shield-alt' });
        }

        if (hasContracts) {
            tabs.push({ id: 'contracts', label: lang === 'en' ? 'API Contracts' : 'Contratos de API', icon: 'fas fa-file-contract' });
        }

        if (hasEngineeringTests) {
            tabs.push({ id: 'engineering', label: lang === 'en' ? 'Engineering & Tests' : 'Engenharia & Testes', icon: 'fas fa-vial' });
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
        setTimeout(() => setToastMessage(null), 2500);
    }, []);

    const copyToClipboard = useCallback((text: string, label: string) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            showToast(`${label} copiado com sucesso!`);
        }
    }, [showToast]);

    // Copiar cURL da rota ativa
    const copyCurlCommand = useCallback(() => {
        if (!activeEndpoint) return;
        const headersStr = (activeEndpoint.headers || [])
            .map((h: any) => `-H "${h.name}: ${h.value}"`)
            .join(' ');
        const bodyStr = activeEndpoint.method !== 'GET' && activeEndpoint.requestBody && activeEndpoint.requestBody !== '{}'
            ? `-d '${activeEndpoint.requestBody.replace(/\n/g, '')}'`
            : '';
        const curl = `curl -X ${activeEndpoint.method} "https://api.pedrohenrique.dev${activeEndpoint.route}" ${headersStr} ${bodyStr}`.trim();
        copyToClipboard(curl, 'Comando cURL');
    }, [activeEndpoint, copyToClipboard]);

    // Disparar execução da bateria de testes com FSM determinística
    const runAssertionsSimulation = useCallback(() => {
        if (!specs.engineeringTests?.assertions?.length || runnerState === 'RUNNING') return;
        playMechanicalClick();
        setRunnerState('RUNNING');
        setActiveAssertionIndex(0);

        let step = 0;
        const total = specs.engineeringTests.assertions.length;
        const interval = setInterval(() => {
            step++;
            if (step < total) {
                setActiveAssertionIndex(step);
            } else {
                clearInterval(interval);
                setActiveAssertionIndex(null);
                setRunnerState('COMPLETED');
                showToast('Bateria de asserções executada com 100% de sucesso!');
            }
        }, 420);
    }, [runnerState, specs.engineeringTests, showToast]);

    // Navegação por teclado: ESC para fechar, setas para alternar estritamente entre as abas disponíveis
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                playTabSwitch();
                setActiveTab(curr => {
                    const idx = availableTabs.findIndex(t => t.id === curr);
                    const nextIdx = (idx + 1) % availableTabs.length;
                    return availableTabs[nextIdx].id;
                });
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                playTabSwitch();
                setActiveTab(curr => {
                    const idx = availableTabs.findIndex(t => t.id === curr);
                    const prevIdx = (idx - 1 + availableTabs.length) % availableTabs.length;
                    return availableTabs[prevIdx].id;
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, availableTabs]);

    // Bloqueio de scroll no body durante a exibição da gaveta
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    return (
        <motion.div
            key={`inspector-backdrop-${project.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[99998] bg-black/60 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
        >
            {/* Toast de Feedback Flutuante */}
            <AnimatePresence mode="wait">
                {toastMessage && (
                    <motion.div
                        key="inspector-toast"
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fixed top-6 right-6 z-[100000] bg-darker/95 border border-accent/40 text-secondary text-xs font-mono px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-xl flex items-center gap-2"
                    >
                        <i className="fas fa-check-circle text-emerald-400 text-sm" />
                        <span>{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Console Lateral DevTools (Linear & Stripe Inspired) */}
            <motion.div
                key={`inspector-drawer-${project.id}`}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                onClick={(e) => e.stopPropagation()}
                className="fixed top-0 right-0 bottom-0 z-[99999] w-full max-w-2xl bg-[#0C0E14] border-l border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden"
            >
                {/* ── A. Cabeçalho Fixo do Console de Engenharia ── */}
                <header className="shrink-0 border-b border-white/10 bg-darker/90 backdrop-blur-xl px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                            <i className={`${specs.ecosystemIcon} text-accent text-sm`} />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-base font-bold text-white tracking-tight truncate">
                                    {project.title}
                                </h2>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span>{specs.version}</span>
                                </span>
                            </div>
                            <p className="text-xs text-primary/60 truncate font-mono">
                                {specs.domain}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {/* Botão Copiar cURL condicional à presença real de contratos de API */}
                        {hasContracts && activeEndpoint ? (
                            <button
                                onClick={copyCurlCommand}
                                data-cursor-morph="true"
                                title="Copiar comando cURL de teste"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-primary/80 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                            >
                                <i className="fas fa-terminal text-[10px] text-accent" />
                                <span className="hidden sm:inline">Copiar cURL</span>
                            </button>
                        ) : (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-primary/70 text-[10px] font-mono select-none">
                                <i className="fas fa-shield-alt text-accent text-[9px]" />
                                <span>Sistema Corporativo</span>
                            </div>
                        )}

                        {/* Botão Fechar com Atalho ESC Visível */}
                        <button
                            onClick={onClose}
                            data-cursor-morph="true"
                            aria-label="Fechar Gaveta de Detalhes"
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                        >
                            <i className="fas fa-times text-xs" />
                            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-primary/60">
                                ESC
                            </kbd>
                        </button>
                    </div>
                </header>

                {/* ── B. Navegação de Abas Dinâmica com layoutId ── */}
                <nav className="shrink-0 border-b border-white/10 bg-darker/60 px-6 py-2 flex items-center gap-1 overflow-x-auto scrollbar-none">
                    {availableTabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    playTabSwitch();
                                    setActiveTab(tab.id);
                                }}
                                data-cursor-morph="true"
                                className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer shrink-0 ${
                                    isActive
                                        ? 'text-white font-bold'
                                        : 'text-primary/70 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeDrawerTab"
                                        className="absolute inset-0 bg-accent/20 border border-accent/40 rounded-xl"
                                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                                    />
                                )}
                                <i className={`${tab.icon} relative z-10 text-xs ${isActive ? 'text-accent' : 'text-primary/50'}`} />
                                <span className="relative z-10">{tab.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* ── C. Conteúdo Técnico Estruturado da Aba Ativa ── */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div
                                key="tab-overview"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.18 }}
                                className="space-y-6"
                            >
                                {/* Cartão de Contexto de Engenharia (Grid 2x2) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
                                        <div className="text-[10px] font-mono text-primary/60 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                            <i className="fas fa-network-wired text-accent" />
                                            <span>Domínio</span>
                                        </div>
                                        <div className="text-xs sm:text-sm font-semibold text-white">
                                            {specs.domain}
                                        </div>
                                    </div>

                                    <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
                                        <div className="text-[10px] font-mono text-primary/60 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                            <i className="fas fa-sitemap text-accent" />
                                            <span>Padrão Arquitetural</span>
                                        </div>
                                        <div className="text-xs sm:text-sm font-semibold text-white truncate">
                                            {specs.architectureType}
                                        </div>
                                    </div>

                                    <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
                                        <div className="text-[10px] font-mono text-primary/60 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                            <i className="fas fa-database text-accent" />
                                            <span>Persistência / Banco</span>
                                        </div>
                                        <div className="text-xs sm:text-sm font-semibold text-white truncate">
                                            {specs.database}
                                        </div>
                                    </div>

                                    <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
                                        <div className="text-[10px] font-mono text-primary/60 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                            <i className="fas fa-chart-line text-accent" />
                                            <span>Escala & Volume</span>
                                        </div>
                                        <div className="text-xs sm:text-sm font-semibold text-white">
                                            {specs.volume}
                                        </div>
                                    </div>
                                </div>

                                {/* Desafios Técnicos & Decisões de Engenharia */}
                                {specs.challenges && specs.challenges.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-mono uppercase tracking-wider text-accent flex items-center gap-2">
                                            <i className="fas fa-tools text-xs" />
                                            <span>Desafios Críticos & Soluções Aplicadas</span>
                                        </h3>
                                        <div className="space-y-3">
                                            {specs.challenges.map((ch, idx) => (
                                                <div key={idx} className="bg-darker border border-white/10 rounded-xl p-4 space-y-2">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <p className="text-xs text-gray-300 font-sans leading-relaxed">
                                                            <strong className="text-white">Problema:</strong> {ch.problem}
                                                        </p>
                                                        <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-accent/15 text-accent border border-accent/30">
                                                            {ch.impactChip}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-emerald-300/90 font-mono leading-relaxed pl-3 border-l-2 border-emerald-500/40">
                                                        ↳ <strong className="text-emerald-400">Solução:</strong> {ch.solution}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Stack Técnica Consolidada */}
                                {project.tags && project.tags.length > 0 && (
                                    <div className="space-y-2.5">
                                        <h3 className="text-xs font-mono uppercase tracking-wider text-accent flex items-center gap-2">
                                            <i className="fas fa-layer-group text-xs" />
                                            <span>Tecnologias & Ferramentas Validadas</span>
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {project.tags.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-200"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'architecture' && hasArchitectureData && (
                            <motion.div
                                key="tab-architecture"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.18 }}
                                className="space-y-6"
                            >
                                {/* Camadas de Arquitetura do Projeto (se declaradas) */}
                                {((specs.layers && specs.layers.length > 0) || (project.details?.architecture && project.details.architecture.length > 0)) && (
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-mono uppercase tracking-wider text-accent flex items-center gap-2">
                                            <i className="fas fa-sitemap text-xs" />
                                            <span>Camadas da Arquitetura de Software</span>
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {(specs.layers || project.details?.architecture || []).map((layer, lIdx) => (
                                                <div key={lIdx} className="bg-darker border border-white/10 rounded-xl p-3.5 space-y-1.5">
                                                    <div className="flex items-center justify-between text-xs font-mono">
                                                        <span className="text-accent font-bold">{layer.layer}</span>
                                                        <span className="text-primary/60 text-[10px] truncate max-w-[150px]">{layer.tech}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-300 font-sans leading-relaxed">
                                                        {layer.role}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Trecho de Código Central (Code Snippet) */}
                                {specs.codeSnippet && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xs font-mono uppercase tracking-wider text-accent flex items-center gap-2">
                                                <i className="fas fa-code text-xs" />
                                                <span>Padrão de Implementação no Core</span>
                                            </h3>
                                            <button
                                                onClick={() => copyToClipboard(specs.codeSnippet || '', 'Código-fonte')}
                                                data-cursor-morph="true"
                                                className="text-[10px] font-mono text-primary/70 hover:text-white flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 cursor-pointer"
                                            >
                                                <i className="fas fa-copy text-[9px]" />
                                                <span>Copiar Código</span>
                                            </button>
                                        </div>
                                        <div className="rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-xs overflow-x-auto text-gray-300 leading-relaxed shadow-inner">
                                            <pre><code>{specs.codeSnippet}</code></pre>
                                        </div>
                                    </div>
                                )}

                                {/* Matriz de Resiliência & Concorrência ACID */}
                                {specs.concurrencyTable && specs.concurrencyTable.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-mono uppercase tracking-wider text-accent flex items-center gap-2">
                                            <i className="fas fa-shield-halved text-xs" />
                                            <span>Mecanismos de Resiliência & Concorrência</span>
                                        </h3>
                                        <div className="rounded-xl border border-white/10 overflow-hidden">
                                            <table className="w-full text-left text-xs font-mono border-collapse">
                                                <thead>
                                                    <tr className="border-b border-white/10 bg-white/[0.03] text-[10px] uppercase tracking-wider text-primary/60">
                                                        <th className="py-2.5 px-3.5">Mecanismo / Trava</th>
                                                        <th className="py-2.5 px-3.5">Tratamento de Exceção</th>
                                                        <th className="py-2.5 px-3.5">Garantia ACID</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {specs.concurrencyTable.map((row, idx) => (
                                                        <tr key={idx} className="hover:bg-white/[0.01]">
                                                            <td className="py-3 px-3.5 font-bold text-accent">{row.lockMechanism}</td>
                                                            <td className="py-3 px-3.5 text-gray-300">{row.exceptionHandling}</td>
                                                            <td className="py-3 px-3.5 text-emerald-400">{row.acidGuarantee}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'contracts' && hasContracts && activeEndpoint && (
                            <motion.div
                                key="tab-contracts"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.18 }}
                                className="space-y-6"
                            >
                                {/* Seletor de Endpoints da API */}
                                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
                                    {(specs.apiContracts?.endpoints || []).map((ep, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                playMechanicalClick();
                                                setSelectedEndpointIndex(idx);
                                            }}
                                            data-cursor-morph="true"
                                            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 border transition-all cursor-pointer shrink-0 ${
                                                selectedEndpointIndex === idx
                                                    ? 'bg-accent/20 border-accent/60 text-white font-bold'
                                                    : 'bg-white/5 border-white/10 text-primary/70 hover:text-white'
                                            }`}
                                        >
                                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                                ep.method === 'POST' ? 'bg-amber-500/20 text-amber-300' :
                                                ep.method === 'PATCH' ? 'bg-sky-500/20 text-sky-300' :
                                                'bg-emerald-500/20 text-emerald-300'
                                            }`}>
                                                {ep.method}
                                            </span>
                                            <span>{ep.route}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Detalhes do Endpoint Selecionado */}
                                <div className="bg-darker border border-white/10 rounded-xl p-4 space-y-4">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <div className="flex items-center gap-2 font-mono text-xs">
                                            <span className="font-bold text-accent">{activeEndpoint.method}</span>
                                            <span className="text-white font-bold">{activeEndpoint.route}</span>
                                        </div>
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            Latência: {activeEndpoint.latency || '12ms'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-300 font-sans">{activeEndpoint.description}</p>

                                    {/* Headers Obrigatórios */}
                                    {activeEndpoint.headers && activeEndpoint.headers.length > 0 && (
                                        <div className="space-y-1.5">
                                            <div className="text-[10px] font-mono uppercase tracking-wider text-primary/60">
                                                Headers Auditados:
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                                                {activeEndpoint.headers.map((h, hIdx) => (
                                                    <div key={hIdx} className="p-2 rounded bg-black/40 border border-white/5">
                                                        <div className="text-accent font-bold">{h.name}</div>
                                                        <div className="text-primary/70 text-[11px] truncate">{h.value}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Payload JSON de Requisição */}
                                    {activeEndpoint.requestBody && activeEndpoint.requestBody !== '{}' && (
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-mono uppercase tracking-wider text-primary/60">
                                                    Request Body (JSON Schema):
                                                </span>
                                                <button
                                                    onClick={() => copyToClipboard(activeEndpoint.requestBody || '', 'Payload JSON')}
                                                    className="text-[10px] font-mono text-primary/70 hover:text-white flex items-center gap-1 cursor-pointer"
                                                >
                                                    <i className="fas fa-copy text-[9px]" />
                                                    <span>Copiar Payload</span>
                                                </button>
                                            </div>
                                            <div className="rounded-xl border border-white/10 bg-black/60 p-3 font-mono text-xs overflow-x-auto text-emerald-300">
                                                <pre><code>{activeEndpoint.requestBody}</code></pre>
                                            </div>
                                        </div>
                                    )}

                                    {/* Payload JSON de Resposta */}
                                    {activeEndpoint.responseBody && (
                                        <div className="space-y-1.5">
                                            <div className="text-[10px] font-mono uppercase tracking-wider text-primary/60">
                                                Response Body ({activeEndpoint.status}):
                                            </div>
                                            <div className="rounded-xl border border-white/10 bg-black/60 p-3 font-mono text-xs overflow-x-auto text-sky-300">
                                                <pre><code>{activeEndpoint.responseBody}</code></pre>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'engineering' && hasEngineeringTests && specs.engineeringTests && (
                            <motion.div
                                key="tab-engineering"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.18 }}
                                className="space-y-6"
                            >
                                {/* Painel de Telemetria com Barras de Progresso & Percentis NIST */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-mono uppercase tracking-wider text-accent flex items-center gap-2">
                                            <i className="fas fa-tachometer-alt text-xs" />
                                            <span>SLA Auditado & Percentis de Latência (NIST)</span>
                                        </h3>
                                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                                            {specs.engineeringTests.uptime || '99.9%'} Uptime
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-3.5 space-y-1.5 transition-all">
                                            <div className="flex items-center justify-between text-xs font-mono">
                                                <span className="text-emerald-400 font-bold">p50</span>
                                                <span className="text-white font-bold">{currentPercentiles.p50}ms</span>
                                            </div>
                                            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                                                <div
                                                    className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                                                    style={{ width: `${Math.min(100, currentPercentiles.p50 * 2)}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-mono text-primary/50">Mediana de latência</span>
                                        </div>

                                        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-3.5 space-y-1.5 transition-all">
                                            <div className="flex items-center justify-between text-xs font-mono">
                                                <span className="text-sky-400 font-bold">p95</span>
                                                <span className="text-white font-bold">{currentPercentiles.p95}ms</span>
                                            </div>
                                            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                                                <div
                                                    className="h-full bg-sky-400 rounded-full transition-all duration-300"
                                                    style={{ width: `${Math.min(100, currentPercentiles.p95 * 1.5)}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-mono text-primary/50">95% das requisições</span>
                                        </div>

                                        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-3.5 space-y-1.5 transition-all">
                                            <div className="flex items-center justify-between text-xs font-mono">
                                                <span className="text-amber-400 font-bold">p99</span>
                                                <span className="text-white font-bold">{currentPercentiles.p99}ms</span>
                                            </div>
                                            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                                                <div
                                                    className="h-full bg-amber-400 rounded-full transition-all duration-300"
                                                    style={{ width: `${Math.min(100, currentPercentiles.p99 * 0.8)}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-mono text-primary/50">Cauda crítica de latência</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bateria de Asserções Executadas com Runner FSM Interativo */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-mono uppercase tracking-wider text-accent flex items-center gap-2">
                                            <i className="fas fa-check-double text-xs" />
                                            <span>Bateria de Asserções Automatizadas</span>
                                        </h3>
                                        <button
                                            onClick={runAssertionsSimulation}
                                            disabled={runnerState === 'RUNNING'}
                                            data-cursor-morph="true"
                                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                                                runnerState === 'RUNNING'
                                                    ? 'bg-accent/20 border-accent text-accent animate-pulse'
                                                    : runnerState === 'COMPLETED'
                                                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                                                    : 'bg-white/5 border-white/15 text-white hover:bg-accent/15 hover:border-accent/40'
                                            }`}
                                        >
                                            <i className={`fas ${
                                                runnerState === 'RUNNING'
                                                    ? 'fa-circle-notch fa-spin text-accent'
                                                    : runnerState === 'COMPLETED'
                                                    ? 'fa-check text-emerald-400'
                                                    : 'fa-play text-accent'
                                            } text-[10px]`} />
                                            <span>
                                                {runnerState === 'RUNNING'
                                                    ? 'Testando...'
                                                    : runnerState === 'COMPLETED'
                                                    ? 'Re-executar Testes'
                                                    : 'Executar Bateria'}
                                            </span>
                                        </button>
                                    </div>

                                    <div className="rounded-xl border border-white/10 overflow-hidden font-mono text-xs">
                                        {specs.engineeringTests.assertions.map((as, idx) => {
                                            const isRunningThis = activeAssertionIndex === idx;
                                            const isDone = runnerState === 'COMPLETED' || (activeAssertionIndex !== null && activeAssertionIndex > idx);

                                            return (
                                                <div
                                                    key={idx}
                                                    className={`p-3 border-b border-white/5 last:border-0 flex items-center justify-between gap-3 transition-colors ${
                                                        isRunningThis
                                                            ? 'bg-accent/10 border-accent/30'
                                                            : 'bg-white/[0.01]'
                                                    }`}
                                                >
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                                                                isRunningThis
                                                                    ? 'bg-accent/20 text-accent border-accent/40 animate-pulse'
                                                                    : isDone
                                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                                                                    : 'bg-white/5 text-gray-400 border-white/10'
                                                            }`}>
                                                                {isRunningThis ? 'EXECUTING' : as.status}
                                                            </span>
                                                            <span className="text-white font-semibold truncate">{as.name}</span>
                                                        </div>
                                                        <p className="text-[11px] text-gray-400 mt-0.5">{as.details}</p>
                                                    </div>
                                                    <span className="text-primary/60 text-[11px] shrink-0">{as.latency}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Laboratório de Caos (Chaos Engineering) com Toggle de Injeção ao Vivo */}
                                {specs.engineeringTests.chaosLab && specs.engineeringTests.chaosLab.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xs font-mono uppercase tracking-wider text-accent flex items-center gap-2">
                                                <i className="fas fa-biohazard text-xs" />
                                                <span>Resultados do Chaos Engineering Lab</span>
                                            </h3>
                                            <button
                                                onClick={() => {
                                                    playMechanicalClick();
                                                    setChaosActive(curr => !curr);
                                                    showToast(!chaosActive ? 'Injeção de estresse ativada (+150ms jitter)' : 'Injeção de caos desativada');
                                                }}
                                                data-cursor-morph="true"
                                                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                                                    chaosActive
                                                        ? 'bg-red-500/20 border-red-500/50 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.25)]'
                                                        : 'bg-white/5 border-white/15 text-primary/80 hover:text-white hover:bg-white/10'
                                                }`}
                                            >
                                                <i className={`fas fa-bolt text-[10px] ${chaosActive ? 'text-red-400 animate-bounce' : 'text-amber-400'}`} />
                                                <span>{chaosActive ? 'Injeção de Caos Ativa' : 'Simular Injeção de Caos'}</span>
                                            </button>
                                        </div>

                                        <div className="space-y-2.5">
                                            {specs.engineeringTests.chaosLab.map((ch, idx) => (
                                                <div key={idx} className="bg-darker border border-white/10 rounded-xl p-3.5 font-sans space-y-1">
                                                    <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
                                                        <i className="fas fa-bolt text-[10px]" />
                                                        <span>{ch.scenario}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-300 font-mono pl-4 leading-relaxed">
                                                        ↳ {ch.outcome}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ── D. Rodapé do Console com Atalhos e Informações de Build ── */}
                <footer className="shrink-0 border-t border-white/10 bg-darker/90 px-6 py-3 flex items-center justify-between text-[11px] font-mono text-primary/60">
                    <div className="flex items-center gap-4">
                        <span>← → alternar abas</span>
                        <span>ESC fechar</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-accent/80">DevTools v2.4.0</span>
                        <span>•</span>
                        <span>TypeScript Strict</span>
                    </div>
                </footer>
            </motion.div>
        </motion.div>
    );
}
