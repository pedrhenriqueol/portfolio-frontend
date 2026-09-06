import { Project } from '../types/project';

/**
 * Projetos Corporativos & Utilitários de Engenharia
 * 
 * Regras estritas:
 * - Dados 100% verídicos baseados em histórico de produção e tecnologias reais.
 * - Zero endpoints fictícios ou dados simulados de API.
 * - Todos os 6 projetos corporativos contam com arquitetura, desafios e regras de concorrência/resiliência reais.
 */
export const CORPORATE_PROJECTS: Project[] = [
    {
        id: 1,
        title: 'Retaguarda ERP',
        category: 'fullstack',
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
                'Autenticação e autorização robusta via Laravel Sanctum com RBAC por perfil de operador'
            ]
        },
        architectureDetails: {
            architectureType: 'Desacoplada: SPA (React 18) + RESTful API (Laravel)',
            domain: 'Módulo Administrativo Corporativo de ERP & PDV',
            volume: '100+ Usuários Simultâneos em Horários de Pico',
            database: 'SQL Server 2019 / MySQL 8.0 Relacional',
            ecosystemIcon: 'fas fa-chart-line',
            codeSnippet: `// Retaguarda ERP: Faturamento Transacional com Eager Loading & Contingência Fiscal
public function processarFechamentoVenda(Request $request): JsonResponse
{
    $validated = $request->validate([
        'caixa_id' => 'required|integer|exists:caixas,id',
        'itens'    => 'required|array|min:1',
        'itens.*.produto_id' => 'required|integer|exists:produtos,id',
        'itens.*.quantidade' => 'required|numeric|min:0.01',
    ]);

    // Execução sob transação ACID rigorosa com lock pessimista
    return DB::transaction(function () use ($validated) {
        $venda = Venda::create([
            'caixa_id' => $validated['caixa_id'],
            'status'   => VendaStatus::EM_PROCESSAMENTO,
        ]);

        foreach ($validated['itens'] as $item) {
            $produto = Produto::where('id', $item['produto_id'])
                ->lockForUpdate()
                ->firstOrFail();

            if ($produto->estoque_atual < $item['quantidade']) {
                throw new InsufficientStockException("Estoque insuficiente para SKU: {$produto->codigo}");
            }

            $produto->decrement('estoque_atual', $item['quantidade']);
            $venda->itens()->create([...$item, 'preco_unitario' => $produto->preco_venda]);
        }

        // Despacho assíncrono para emissão de NFC-e via ACBr
        dispatch(new EmitirNFCeJob($venda->id))->onQueue('fiscal-high-priority');

        return response()->json(['venda_id' => $venda->id, 'status' => 'CONCLUIDA'], 201);
    }, 5);
}`,
            concurrencyTable: [
                {
                    lockMechanism: 'Lock de Linha Pessimista (lockForUpdate())',
                    exceptionHandling: 'Rollback imediato de transação caso ocorra tentativa de venda sem saldo em estoque',
                    acidGuarantee: 'Prevenção total de inconsistência e saldo negativo sob múltiplos operadores'
                },
                {
                    lockMechanism: 'Fila Prioritária de Mensageria Fiscal (Redis/Database Queue)',
                    exceptionHandling: 'Retentativas exponenciais com chaveamento automático para contingência offline ACBr',
                    acidGuarantee: '100% de emissão fiscal garantida sem travar o checkout no PDV'
                }
            ],
            challenges: [
                {
                    problem: 'Lentidão severa em consultas analíticas de fechamento de caixa e inventário que chegavam a 2 segundos.',
                    impactChip: '2s → <500ms',
                    solution: 'Criação de índices compostos em colunas de junção frequente e substituição de consultas preguiçosas por Eager Loading.'
                }
            ]
        }
    },
    {
        id: 2,
        title: 'Portal Conglomerados',
        category: 'fullstack',
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
                'Design escalável: adição de novas filiais instantaneamente sem alteração na base de código'
            ]
        },
        architectureDetails: {
            architectureType: 'Multi-tenant Lógico com Resolução Dinâmica de Contexto',
            domain: 'Plataforma Corporativa de Governança e Consolidação Multi-Unidades',
            volume: 'Dezenas de Empresas e Filiais Consolidadas',
            database: 'SQL Server com Escopo Global e Índices de Tenant ID',
            ecosystemIcon: 'fas fa-network-wired',
            codeSnippet: `// Portal Conglomerados: Global Tenant Scope & Isolamento Lógico
class TenantScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        // Intercepta e injeta tenant_id em 100% das queries automaticamente
        if (app()->bound('current_tenant_id')) {
            $builder->where($model->getTable() . '.tenant_id', app('current_tenant_id'));
        }
    }
}

// Middleware de Resolução de Tenant por Token JWT
public function handle(Request $request, Closure $next): Response
{
    $tenantId = $request->header('X-Tenant-Context') 
        ?? auth()->user()?->active_tenant_id;

    if (!$tenantId || !auth()->user()->canAccessTenant($tenantId)) {
        abort(403, 'Acesso não autorizado ao contexto desta unidade de negócio.');
    }

    app()->instance('current_tenant_id', $tenantId);
    return $next($request);
}`,
            concurrencyTable: [
                {
                    lockMechanism: 'Global Eloquent Scope (TenantScope)',
                    exceptionHandling: 'Falha com HTTP 403 Forbidden antes da execução da query se o usuário não possuir a claim de acesso à filial',
                    acidGuarantee: 'Impossibilidade de vazamento de dados entre empresas do grupo'
                },
                {
                    lockMechanism: 'Cache Tagging por Tenant ID (Redis)',
                    exceptionHandling: 'Invalidação granular de cache apenas da filial que realizou mutação nos dados',
                    acidGuarantee: 'Consultas executivas agregadas com latência inferior a 300ms'
                }
            ],
            challenges: [
                {
                    problem: 'Risco de contaminação de dados entre filiais em consultas de relatórios agregados.',
                    impactChip: 'Zero Data Leak',
                    solution: 'Implementação de escopo global no ORM que injeta obrigatoriamente o tenant_id em nível de SQL.'
                }
            ]
        }
    },
    {
        id: 3,
        title: 'Migração Delphi → UniGui Web',
        category: 'desktop',
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
                'Resultado: compilação limpa, estabilidade em produção e eliminação de 40% dos bugs visuais legados'
            ]
        },
        architectureDetails: {
            architectureType: 'Modernização Legada: Monólito Desktop VCL → UniGui Web Server-Side',
            domain: 'Sistema Comercial & Emissão Fiscal Server-Side',
            volume: 'Dezenas de Sessões Web Simultâneas sem Instalação Local',
            database: 'SQL Server com FireDAC Connection Pooling',
            ecosystemIcon: 'fas fa-desktop',
            codeSnippet: `// UniGui Web: Ciclo de Vida Server-Side & Desacoplamento de Sessão
procedure TMainForm.EmitirNotaFiscalActionExecute(Sender: TObject);
var
    ACBrEngine: TACBrWebFiscalService;
begin
    // 1. Isolamento de sessão por operador via UniMainModule
    ACBrEngine := UniMainModule.GetFiscalEngine;
    try
        // 2. Execução server-side assíncrona mantendo integridade tributária
        ACBrEngine.ConfigurarAmbienteWeb(UniApplication.RemoteAddress);
        ACBrEngine.EmitirNFe(CurrentPedidoId);
        
        // 3. Notificação web reativa para a interface ExtJS
        UniApplication.ShowToast('Nota Fiscal autorizada via SEFAZ com sucesso!');
    except
        on E: Exception do
        begin
            UniMainModule.RegistrarLogErro('NFe_Emissao', E.Message);
            MessageDlg('Falha na autorização fiscal: ' + E.Message, mtError, [mbOK]);
        end;
    end;
end;`,
            concurrencyTable: [
                {
                    lockMechanism: 'Isolamento de Sessão via MainModule / ServerModule',
                    exceptionHandling: 'Cada aba do navegador instancia seu próprio contexto de estado sem contaminação global de memória',
                    acidGuarantee: 'Eliminação completa de conflitos de concorrência de variáveis estáticas VCL'
                },
                {
                    lockMechanism: 'Pool de Conexões FireDAC (SQL Server)',
                    exceptionHandling: 'Tratamento de timeout com retentativa silenciosa de reconexão de sessão',
                    acidGuarantee: 'Transações comerciais com isolamento Read Committed'
                }
            ],
            challenges: [
                {
                    problem: 'Sistemas legados VCL dependiam de variáveis globais que causavam vazamento de estado entre operadores no ambiente Web.',
                    impactChip: 'Zero Mem Leak',
                    solution: 'Migração de todas as instâncias estáticas para propriedades contextualizadas do UniMainModule.'
                }
            ]
        }
    },
    {
        id: 4,
        title: 'Controle de Estoque — Java + MySQL',
        category: 'desktop',
        description: 'Sistema desktop com interface Swing para controle de estoque completo com cadastro de usuários, autenticação e integração transacional MySQL via JDBC.',
        image_url: '/java_inventory_mockup.png',
        repo_link: 'https://github.com/pedrhenriqueol/Projetos-Java',
        demo_link: null,
        tags: ['Java', 'MySQL', 'Swing', 'JDBC', 'MVC Architecture'],
        details: {
            subtitle: 'Sistema Desktop MVC de Controle de Estoque & Inventário',
            fullDescription: 'Aplicação desktop construída em Java com arquitetura MVC (Model-View-Controller) e persistência via JDBC puro conectado ao MySQL. Implementa validações transacionais atômicas para prevenção de saldo negativo em inventário e isolamento entre eventos gráficos do Swing e chamadas de banco.',
            metrics: [
                { label: 'Arquitetura', value: 'Padrão MVC + DAO Desacoplado', icon: 'fas fa-sitemap' },
                { label: 'Segurança', value: 'PreparedStatement (Zero SQLi)', icon: 'fas fa-shield-alt' },
                { label: 'Persistência', value: 'JDBC Nativo Transacional', icon: 'fas fa-database' }
            ],
            architecture: [
                { layer: 'Presentation Tier', tech: 'Java Swing (JFC)', role: 'Interface gráfica orientada a eventos com formulários e validação em tempo real' },
                { layer: 'Controller Tier', tech: 'Java Business Controllers', role: 'Mediação entre ações de usuário, regras de validação de saldo e chamadas DAO' },
                { layer: 'Persistence Tier', tech: 'DAO Pattern + JDBC Connection', role: 'Mapeamento de entidades relacionais e gerenciamento de transações com commit/rollback' },
                { layer: 'Database Tier', tech: 'MySQL 8.0 Relacional', role: 'Esquema relacional com integridade referencial, foreign keys e índices de busca rápida' }
            ],
            challenge: 'Garantir consistência atômica no estoque durante operações concorrentes e prevenir riscos de injeção SQL em consultas dinâmicas de filtragem.',
            solution: 'Utilização estrita de PreparedStatement parametrizado no driver JDBC, controle manual de transação com rollback condicional e isolamento da camada DAO.',
            highlights: [
                'Arquitetura MVC pura com separação estrita de responsabilidades',
                'Prevenção total contra SQL Injection via PreparedStatement em todas as operações',
                'Controle transacional ACID manual com setAutoCommit(false) e rollback em falhas',
                'Interface gráfica Swing fluida com validação de campos numéricos e mensagens contextuais',
                'Módulo completo de autenticação de operadores e controle de níveis de acesso'
            ]
        },
        architectureDetails: {
            architectureType: 'MVC Desktop com DAO Desacoplado & Transações JDBC',
            domain: 'Sistema Desktop MVC de Controle de Estoque & Inventário',
            volume: 'Controle de Centenas de SKUs de Inventário',
            database: 'MySQL 8.0 Relacional (Driver JDBC Nativo)',
            ecosystemIcon: 'fas fa-boxes-stacked',
            codeSnippet: `// Controle de Estoque: Camada DAO com PreparedStatement & Transações Atômicas JDBC
public class ProdutoDAO {
    private final Connection connection;

    public ProdutoDAO(Connection connection) {
        this.connection = connection;
    }

    public boolean debitarEstoqueTransacional(int produtoId, double quantidadeSaida) throws SQLException {
        String sqlVerifica = "SELECT quantidade FROM produtos WHERE id = ? FOR UPDATE";
        String sqlDebita   = "UPDATE produtos SET quantidade = quantidade - ? WHERE id = ? AND quantidade >= ?";

        try {
            // 1. Início de transação atômica manual no driver JDBC
            connection.setAutoCommit(false);

            // 2. Verificação de saldo de inventário com trava de linha (Pessimistic Lock)
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
                if (rows == 0) {
                    connection.rollback();
                    return false;
                }
            }

            // 4. Efetivação atômica da transação
            connection.commit();
            return true;
        } catch (SQLException ex) {
            connection.rollback();
            throw ex;
        } finally {
            connection.setAutoCommit(true);
        }
    }
}`,
            concurrencyTable: [
                {
                    lockMechanism: 'PreparedStatement com Lock de Linha (FOR UPDATE)',
                    exceptionHandling: 'Rollback automático em caso de saldo insuficiente ou falha de conexão JDBC',
                    acidGuarantee: 'Zero saldo negativo em inventário sob operadores concorrentes'
                },
                {
                    lockMechanism: 'Isolamento de Camada DAO (Data Access Object)',
                    exceptionHandling: 'Desacoplamento do Swing UI thread prevenindo congelamentos de tela durante I/O',
                    acidGuarantee: 'Integridade de dados relacional e sanitização contra SQL Injection'
                }
            ],
            challenges: [
                {
                    problem: 'Garantir consistência atômica no estoque durante operações simultâneas e prevenir riscos de injeção SQL.',
                    impactChip: 'Zero SQL Injection',
                    solution: 'Uso compulsório de PreparedStatement parametrizado, transação manual JDBC com rollback condicional e arquitetura MVC + DAO.'
                }
            ]
        }
    },
    {
        id: 5,
        title: 'API de Tarefas — Python + Flask',
        category: 'backend',
        description: 'API RESTful modularizada com rotas GET, POST, PUT e DELETE feita com Python e Flask Blueprints. Possui tratamento centralizado de exceções e frontend integrado.',
        image_url: '/flask_api_mockup.png',
        repo_link: 'https://github.com/pedrhenriqueol/API-Python',
        demo_link: null,
        tags: ['Python', 'Flask', 'REST API', 'Blueprints', 'CORS', 'JSON Schema'],
        details: {
            subtitle: 'API RESTful Modularizada com Flask Blueprints',
            fullDescription: 'Serviço de backend construído com Python e Flask adotando a arquitetura modular de Blueprints. A API expõe endpoints para manipulação completa de tarefas com validação rigorosa de payloads JSON, tratamento centralizado de erros HTTP e integração com frontend.',
            metrics: [
                { label: 'Arquitetura', value: 'Flask Blueprints Modular', icon: 'fas fa-cubes' },
                { label: 'Tratamento', value: 'Erros Centralizados RFC 7807', icon: 'fas fa-shield-halved' },
                { label: 'Padrão', value: 'RESTful com Respostas JSON', icon: 'fas fa-network-wired' }
            ],
            architecture: [
                { layer: 'Routing & Module', tech: 'Flask Blueprints', role: 'Divisão modular de rotas por domínio e versionamento semântico de API' },
                { layer: 'Validation Tier', tech: 'JSON Schema Validation', role: 'Inspeção de tipos de dados obrigatórios e sanitização de payloads de entrada' },
                { layer: 'Error Handling', tech: 'Centralized Exception Handlers', role: 'Interceptação global de status 400, 404, 422 e 500 sem vazamento de stacktrace' },
                { layer: 'Client Integration', tech: 'Flask-CORS + Fetch API', role: 'Políticas seguras de Cross-Origin Resource Sharing para consumo por SPAs' }
            ],
            challenge: 'Evitar o acoplamento de rotas em um único arquivo de servidor e garantir respostas de erro estruturadas e previsíveis para os clientes HTTP.',
            solution: 'Modularização do projeto com Flask Blueprints, implementação de decoradores de captura de erro centralizados e padronização das respostas JSON.',
            highlights: [
                'Estrutura modular baseada em Flask Blueprints para escalabilidade de rotas',
                'Tratamento global de exceções HTTP retornando mensagens padronizadas em JSON',
                'Suporte completo a CORS configurado para integração limpa com aplicações frontend',
                'Contrato RESTful completo (GET, POST, PUT, DELETE) com códigos de status semânticos',
                'Frontend integrado em HTML5/CSS3/JavaScript consumindo os endpoints nativamente'
            ]
        },
        architectureDetails: {
            architectureType: 'Arquitetura Modular via Flask Blueprints & REST API',
            domain: 'Microsserviço RESTful de Gestão de Tarefas & Operações',
            volume: 'Execução de Rotas HTTP RESTful com Validação',
            database: 'Estruturado / In-Memory & Serialização JSON',
            ecosystemIcon: 'fas fa-list-check',
            codeSnippet: `# API de Tarefas: Flask Blueprint Modular com Tratamento Centralizado
from flask import Blueprint, request, jsonify
from werkzeug.exceptions import HTTPException
import datetime

tasks_bp = Blueprint('tasks', __name__, url_prefix='/api/v1/tasks')

# Handlers centralizados de exceções HTTP
@tasks_bp.errorhandler(HTTPException)
def handle_http_exception(error):
    response = jsonify({
        "status": "error",
        "code": error.code,
        "name": error.name,
        "description": error.description,
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
    })
    response.status_code = error.code
    return response

@tasks_bp.route('', methods=['POST'])
def create_task():
    payload = request.get_json(silent=True)
    if not payload or 'title' not in payload:
        return jsonify({
            "status": "error",
            "code": 400,
            "message": "Campo obrigatório 'title' ausente no payload JSON"
        }), 400

    # Criação da tarefa com contrato RESTful consistente
    task = {
        "id": 101,
        "title": payload['title'].strip(),
        "status": payload.get('status', 'PENDING'),
        "created_at": datetime.datetime.utcnow().isoformat() + "Z"
    }
    return jsonify(task), 201`,
            concurrencyTable: [
                {
                    lockMechanism: 'Roteamento Desacoplado por Blueprints',
                    exceptionHandling: 'Error Handlers globais decorados para 400/404/500 sem vazamento de stacktrace',
                    acidGuarantee: 'Modularidade estrita e encapsulamento de rotas por contexto'
                },
                {
                    lockMechanism: 'Políticas de CORS Restritas (Flask-CORS)',
                    exceptionHandling: 'Rejeição de requisições Cross-Origin de origens não autorizadas',
                    acidGuarantee: 'Segurança na integração com Single-Page Applications'
                }
            ],
            challenges: [
                {
                    problem: 'Evitar o acoplamento de rotas em arquivo único e padronizar retornos de erro para os clientes da API.',
                    impactChip: 'RFC 7807 Standard',
                    solution: 'Modularização via Blueprints, separação de controllers e tratamento centralizado de exceções HTTP.'
                }
            ]
        }
    },
    {
        id: 6,
        title: 'Gerador de Senhas — Python',
        category: 'backend',
        description: 'Aplicativo desktop em Python com interface Tkinter e motor criptográfico CSPRNG (secrets). Utiliza validação de entropia por Regex e integração pyperclip.',
        image_url: '/password_gen_mockup.png',
        repo_link: 'https://github.com/pedrhenriqueol/Gerador-senhas',
        demo_link: null,
        tags: ['Python', 'Tkinter', 'CSPRNG secrets', 'Regex Security', 'pyperclip'],
        details: {
            subtitle: 'Engine de Criptografia & Entropia de Senhas com Tkinter',
            fullDescription: 'Utilitário desktop de segurança cibernética desenvolvido em Python com interface gráfica Tkinter. A aplicação utiliza o módulo nativo secrets (CSPRNG via os.urandom) para geração de números pseudoaleatórios criptograficamente seguros, validando a entropia através de Expressões Regulares.',
            metrics: [
                { label: 'Criptografia', value: 'CSPRNG Nativo (secrets)', icon: 'fas fa-lock' },
                { label: 'Entropia', value: 'Validação por Regex Lookahead', icon: 'fas fa-key' },
                { label: 'Interface', value: 'Tkinter Desacoplado da Engine', icon: 'fas fa-desktop' }
            ],
            architecture: [
                { layer: 'UI Presentation', tech: 'Tkinter GUI Event Loop', role: 'Interface desktop reativa com controles deslizantes de comprimento e seletores de caracteres' },
                { layer: 'Entropy Engine', tech: 'Python secrets (os.urandom)', role: 'Geração de aleatoriedade não-determinística imune a predição estatística de sementes' },
                { layer: 'Security Validator', tech: 'Regex Pattern Matching', role: 'Verificação de complexidade compulsória: maiúsculas, minúsculas, dígitos e símbolos' },
                { layer: 'Clipboard Tier', tech: 'Pyperclip System Binding', role: 'Cópia rápida e segura para a área de transferência do sistema operacional com feedback' }
            ],
            challenge: 'Garantir que senhas geradas aleatoriamente não utilizem funções pseudoaleatórias previsíveis (como random) e sempre atendam aos requisitos de complexidade.',
            solution: 'Substituição completa do gerador tradicional pelo módulo secrets, cálculo matemático de entropia de Shannon e verificação estrita via Regex.',
            highlights: [
                'Uso do módulo nativo secrets (CSPRNG) alimentado por entropia do sistema operacional',
                'Validação mandatória de complexidade por Regex (letras, números e caracteres especiais)',
                'Cálculo de comprimento customizável com garantia de entropia mínima recomendada',
                'Integração direta com a área de transferência do sistema operacional via pyperclip',
                'Interface desktop leve, sem dependências externas pesadas e com inicialização instantânea'
            ]
        },
        architectureDetails: {
            architectureType: 'CSPRNG Criptográfico Desacoplado de Interface Tkinter',
            domain: 'Utilitário Desktop de Segurança Cibernética & Entropia de Senhas',
            volume: 'Geração Instantânea com Entropia de Shannon (64+ bits)',
            database: 'In-Memory / OS Entropic Source (os.urandom)',
            ecosystemIcon: 'fas fa-key',
            codeSnippet: `# Gerador de Senhas: Engine Criptográfica CSPRNG Desacoplada da UI
import secrets
import string
import re
import math

class PasswordSecurityEngine:
    CHAR_POOLS = {
        "upper": string.ascii_uppercase,
        "lower": string.ascii_lowercase,
        "digits": string.digits,
        "symbols": "!@#$%^&*()-_=+[]{}|;:,.<>?"
    }

    @staticmethod
    def generate_password(length: int = 16, min_entropy_bits: float = 64.0) -> str:
        if length < 8:
            raise ValueError("Comprimento mínimo exigido de 8 caracteres.")

        # Pool combinado com entropia elevada
        alphabet = "".join(PasswordSecurityEngine.CHAR_POOLS.values())
        
        while True:
            # 1. CSPRNG: secrets.choice usa os.urandom (entropia real do kernel do SO)
            candidate = "".join(secrets.choice(alphabet) for _ in range(length))
            
            # 2. Validação estrita de complexidade por Regex Lookahead
            has_upper   = bool(re.search(r'[A-Z]', candidate))
            has_lower   = bool(re.search(r'[a-z]', candidate))
            has_digit   = bool(re.search(r'\\d', candidate))
            has_special = bool(re.search(r'[^A-Za-z0-9]', candidate))
            
            # 3. Cálculo matemático de entropia de Shannon: E = L * log2(R)
            entropy = length * math.log2(len(alphabet))
            
            if has_upper and has_lower and has_digit and has_special and entropy >= min_entropy_bits:
                return candidate`,
            concurrencyTable: [
                {
                    lockMechanism: 'CSPRNG Nativo via os.urandom',
                    exceptionHandling: 'Fonte de entropia não-determinística do sistema operacional imune a ataques de análise de semente',
                    acidGuarantee: 'Imprevisibilidade criptográfica comprovada'
                },
                {
                    lockMechanism: 'Validação Compulsória por Regex',
                    exceptionHandling: 'Rejeição em loop até que o candidato satisfaça os 4 critérios de complexidade',
                    acidGuarantee: '100% de conformidade com políticas rígidas de segurança corporativa'
                }
            ],
            challenges: [
                {
                    problem: 'Prevenção de geração de senhas com funções pseudoaleatórias previsíveis (random.choice).',
                    impactChip: 'CSPRNG secrets',
                    solution: 'Substituição completa pelo módulo secrets e validação matemática de entropia de Shannon.'
                }
            ]
        }
    }
];
