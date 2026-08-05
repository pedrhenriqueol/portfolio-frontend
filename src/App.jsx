import CursorGlow from './components/Portfolio/CursorGlow';
import ClickSparks from './components/Portfolio/ClickSparks';
import NavBar from './components/Portfolio/NavBar';
import HeroSection from './components/Portfolio/HeroSection';
import AboutSection from './components/Portfolio/AboutSection';
import ExperienceSection from './components/Portfolio/ExperienceSection';
import SkillsSection from './components/Portfolio/SkillsSection';
import ProjectsSection from './components/Portfolio/ProjectsSection';
import ContactSection from './components/Portfolio/ContactSection';

// ─── Dados do portfólio (hardcoded — sem dependência de API) ───────────────────
// level: 5=Especialista 4=Avançado 3=Intermediário 2=Básico
const SKILLS = [
    // Back-end
    { id: 1,  name: 'PHP',                icon_class: 'fab fa-php',       category: 'Back-end',  level: 4 },
    { id: 2,  name: 'Laravel',            icon_class: 'fab fa-laravel',   category: 'Back-end',  level: 4 },
    { id: 3,  name: 'Delphi / UniGui',    icon_class: 'fas fa-desktop',   category: 'Back-end',  level: 5 },
    { id: 13, name: 'Node.js',            icon_class: 'fab fa-node-js',   category: 'Back-end',  level: 3 },
    // Front-end
    { id: 5,  name: 'React',              icon_class: 'fab fa-react',     category: 'Front-end', level: 4 },
    { id: 4,  name: 'TypeScript',         icon_class: 'fab fa-js',        category: 'Front-end', level: 4 },
    { id: 8,  name: 'Tailwind CSS',       icon_class: 'fab fa-css3-alt',  category: 'Front-end', level: 4 },
    { id: 11, name: 'HTML / CSS',         icon_class: 'fab fa-html5',     category: 'Front-end', level: 5 },
    // Database
    { id: 7,  name: 'MySQL',              icon_class: 'fas fa-database',  category: 'Database',  level: 4 },
    { id: 14, name: 'SQL Server',         icon_class: 'fas fa-server',    category: 'Database',  level: 4 },
    { id: 15, name: 'PostgreSQL',         icon_class: 'fas fa-database',  category: 'Database',  level: 3 },
    // DevOps & Tools
    { id: 9,  name: 'Git / GitHub',       icon_class: 'fab fa-git-alt',   category: 'DevOps',    level: 4 },
    { id: 12, name: 'Docker',             icon_class: 'fab fa-docker',    category: 'DevOps',    level: 3 },
    // Outros
    { id: 6,  name: 'Java',              icon_class: 'fab fa-java',       category: 'Outros',    level: 3 },
    { id: 10, name: 'Python',            icon_class: 'fab fa-python',     category: 'Outros',    level: 3 },
];

const EXPERIENCES = [
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
        role: 'Desenvolvedor Back-End (Estágio)',
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
    },
];

const PROJECTS = [
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
];
// ──────────────────────────────────────────────────────────────────────────────

export default function App() {
    return (
        <div className="min-h-screen bg-darker text-white font-sans selection:bg-accent selection:text-darker">
            <CursorGlow />
            <ClickSparks />

            <NavBar />

            <main>
                <HeroSection />
                <AboutSection />
                <ExperienceSection experiences={EXPERIENCES} />
                <SkillsSection skills={SKILLS} />
                <ProjectsSection projects={PROJECTS} />
                <ContactSection />
            </main>

            <footer className="bg-dark border-t border-primary/20 py-6 text-center text-gray-500 text-sm">
                <p>© {new Date().getFullYear()} Pedro Henrique. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}
