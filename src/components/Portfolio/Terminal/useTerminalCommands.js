import { useMemo, useCallback } from 'react';
import { GAMES_INFO } from './TerminalGames';

export const ALL_CMD_STRINGS = [
    'pedro --help', 'pedro --projects', 'pedro --skills', 'pedro --experience', 'pedro --contact',
    'pedro --status', 'pedro --games', 'pedro --play snake', 'pedro --play bug-hunter',
    'pedro --play trivia', 'pedro --play aim-test', 'pedro --sudo matrix',
    'pedro --sudo rm -rf /', 'pedro --version', 'clear', 'exit',
];

export const getWelcomeLines = (lang) => {
    if (lang === 'en') {
        return [
            { text: 'Pedro Henrique — Interactive Terminal v2.1 [Arcade Edition 🕹️]', color: 'text-secondary font-bold' },
            { text: 'Type "pedro --help" to view commands or "pedro --games" to play!', color: 'text-primary/70' },
        ];
    }
    if (lang === 'es') {
        return [
            { text: 'Pedro Henrique — Terminal Interactivo v2.1 [Arcade Edition 🕹️]', color: 'text-secondary font-bold' },
            { text: '¡Escribe "pedro --help" para ver comandos o "pedro --games" para jugar!', color: 'text-primary/70' },
        ];
    }
    return [
        { text: 'Pedro Henrique — Terminal Interativo v2.1 [Arcade Edition 🕹️]', color: 'text-secondary font-bold' },
        { text: 'Digite "pedro --help" para ver comandos ou "pedro --games" para jogar!', color: 'text-primary/70' },
    ];
};

export const getCommands = (lang) => [
    {
        cmd: 'help',
        desc: lang === 'en' ? 'Show all available commands' : lang === 'es' ? 'Muestra todos los comandos' : 'Mostra todos os comandos disponíveis',
        output: () => {
            if (lang === 'en') {
                return [
                    { text: '── Portfolio Commands ──', color: 'text-secondary font-bold' },
                    { text: '  pedro --projects       Flagship engineering projects & architecture', color: 'text-accent' },
                    { text: '  pedro --skills         List all technologies and stack', color: 'text-primary' },
                    { text: '  pedro --experience     Detailed professional career path', color: 'text-primary' },
                    { text: '  pedro --contact        Direct contact links and channels', color: 'text-primary' },
                    { text: '  pedro --status         Availability status and timezone', color: 'text-primary' },
                    { text: '', color: '' },
                    { text: '── Minigames & Easter Eggs 🕹️ ──', color: 'text-accent font-bold' },
                    { text: '  pedro --games          Complete menu of all minigames', color: 'text-accent' },
                    { text: '  pedro --play snake     🐍 Classic ASCII Snake Game (Arrow Keys / WASD)', color: 'text-secondary' },
                    { text: '  pedro --play bug-hunter 🐛 QA Bug Hunting without Error 500', color: 'text-secondary' },
                    { text: '  pedro --play trivia    🧠 Tech Quiz on QA, Delphi, SQL & Web', color: 'text-secondary' },
                    { text: '  pedro --play aim-test  🎯 Millisecond Reflex & Speed Test', color: 'text-secondary' },
                    { text: '  pedro --sudo matrix    🕶️ Matrix Code Rain Visual Effect', color: 'text-secondary' },
                    { text: '  clear                  Clear terminal screen', color: 'text-primary/70' },
                ];
            }
            if (lang === 'es') {
                return [
                    { text: '── Comandos de Portafolio ──', color: 'text-secondary font-bold' },
                    { text: '  pedro --projects       Proyectos de ingeniería destacados y arquitectura', color: 'text-accent' },
                    { text: '  pedro --skills         Lista todas las tecnologías y stack', color: 'text-primary' },
                    { text: '  pedro --experience     Trayectoria profesional detallada', color: 'text-primary' },
                    { text: '  pedro --contact        Enlaces y canales de contacto directo', color: 'text-primary' },
                    { text: '  pedro --status         Estado de disponibilidad y zona horaria', color: 'text-primary' },
                    { text: '', color: '' },
                    { text: '── Minijuegos & Easter Eggs 🕹️ ──', color: 'text-accent font-bold' },
                    { text: '  pedro --games          Menú completo de todos los minijuegos', color: 'text-accent' },
                    { text: '  pedro --play snake     🐍 Juego de la Serpiente ASCII (Flechas / WASD)', color: 'text-secondary' },
                    { text: '  pedro --play bug-hunter 🐛 Caza de Bugs de QA sin provocar Error 500', color: 'text-secondary' },
                    { text: '  pedro --play trivia    🧠 Quiz Técnico de QA, Delphi, SQL y Web', color: 'text-secondary' },
                    { text: '  pedro --play aim-test  🎯 Test de Reflejos en Milisegundos', color: 'text-secondary' },
                    { text: '  pedro --sudo matrix    🕶️ Lluvia de Código Matrix en la Terminal', color: 'text-secondary' },
                    { text: '  clear                  Limpia la pantalla de la terminal', color: 'text-primary/70' },
                ];
            }
            return [
                { text: '── Comandos de Portfólio ──', color: 'text-secondary font-bold' },
                { text: '  pedro --projects       Projetos de engenharia em destaque e arquitetura', color: 'text-accent' },
                { text: '  pedro --skills         Lista todas as tecnologias e stacks', color: 'text-primary' },
                { text: '  pedro --experience     Trajetória profissional detalhada', color: 'text-primary' },
                { text: '  pedro --contact        Links e canais de contato direto', color: 'text-primary' },
                { text: '  pedro --status         Status de disponibilidade e fuso', color: 'text-primary' },
                { text: '', color: '' },
                { text: '── Minijogos & Easter Eggs 🕹️ ──', color: 'text-accent font-bold' },
                { text: '  pedro --games          Menu completo de todos os minijogos', color: 'text-accent' },
                { text: '  pedro --play snake     🐍 Jogo da Cobrinha em ASCII (Setas / WASD)', color: 'text-secondary' },
                { text: '  pedro --play bug-hunter 🐛 Caça aos Bugs sem estourar Erro 500', color: 'text-secondary' },
                { text: '  pedro --play trivia    🧠 Quiz Técnico de QA, Delphi, SQL & Web', color: 'text-secondary' },
                { text: '  pedro --play aim-test  🎯 Teste de Reflexos em Milissegundos', color: 'text-secondary' },
                { text: '  pedro --sudo matrix    🕶️ Chuva de Código Matrix no Terminal', color: 'text-secondary' },
                { text: '  clear                  Limpa a tela do terminal', color: 'text-primary/70' },
            ];
        },
    },
    {
        cmd: 'games',
        desc: lang === 'en' ? 'List minigames' : lang === 'es' ? 'Lista minijuegos' : 'Lista os minijogos',
        output: () => {
            if (lang === 'en') {
                return [
                    { text: '╔══════════════════════════════════════════════════════════════╗', color: 'text-accent' },
                    { text: '║               🎮 TERMINAL ARCADE - PEDRO HENRIQUE             ║', color: 'text-secondary font-bold' },
                    { text: '╚══════════════════════════════════════════════════════════════╝', color: 'text-accent' },
                    { text: '1. pedro --play snake        🐍 Classic ASCII snake with dev stacks', color: 'text-primary' },
                    { text: '2. pedro --play bug-hunter   🐛 QA Minesweeper / Debug without 500 Crash', color: 'text-primary' },
                    { text: '3. pedro --play trivia       🧠 Architecture & SQL Interactive Quiz', color: 'text-primary' },
                    { text: '4. pedro --play aim-test     🎯 Target reaction speed reflex test', color: 'text-primary' },
                    { text: '5. pedro --sudo matrix       🕶️ Classic Matrix rain visual effect', color: 'text-accent' },
                    { text: '', color: '' },
                    { text: '💡 Type any command above or "exit" to return to the shell.', color: 'text-primary/60' },
                ];
            }
            if (lang === 'es') {
                return [
                    { text: '╔══════════════════════════════════════════════════════════════╗', color: 'text-accent' },
                    { text: '║               🎮 TERMINAL ARCADE - PEDRO HENRIQUE             ║', color: 'text-secondary font-bold' },
                    { text: '╚══════════════════════════════════════════════════════════════╝', color: 'text-accent' },
                    { text: '1. pedro --play snake        🐍 Serpiente clásica en ASCII con stacks', color: 'text-primary' },
                    { text: '2. pedro --play bug-hunter   🐛 Buscaminas de QA / Debug sin Crash 500', color: 'text-primary' },
                    { text: '3. pedro --play trivia       🧠 Quiz interactivo de Arquitectura y SQL', color: 'text-primary' },
                    { text: '4. pedro --play aim-test     🎯 Test de velocidad de respuesta refleja', color: 'text-primary' },
                    { text: '5. pedro --sudo matrix       🕶️ Efecto visual clásico Lluvia Matrix', color: 'text-accent' },
                    { text: '', color: '' },
                    { text: '💡 Escribe el comando arriba o "exit" para volver en cualquier momento.', color: 'text-primary/60' },
                ];
            }
            return [
                { text: '╔══════════════════════════════════════════════════════════════╗', color: 'text-accent' },
                { text: '║               🎮 TERMINAL ARCADE - PEDRO HENRIQUE             ║', color: 'text-secondary font-bold' },
                { text: '╚══════════════════════════════════════════════════════════════╝', color: 'text-accent' },
                { text: '1. pedro --play snake        🐍 Cobrinha clássica em ASCII com stacks', color: 'text-primary' },
                { text: '2. pedro --play bug-hunter   🐛 Minesweeper de QA / Debug sem Crash 500', color: 'text-primary' },
                { text: '3. pedro --play trivia       🧠 Quiz interativo de Arquitetura & SQL', color: 'text-primary' },
                { text: '4. pedro --play aim-test     🎯 Teste de velocidade de resposta reflexa', color: 'text-primary' },
                { text: '5. pedro --sudo matrix       🕶️ Efeito visual clássico Chuva Matrix', color: 'text-accent' },
                { text: '', color: '' },
                { text: '💡 Digite o comando acima ou "exit" para voltar a qualquer momento.', color: 'text-primary/60' },
            ];
        },
    },
    {
        cmd: 'projects',
        desc: lang === 'en' ? 'Flagship projects' : lang === 'es' ? 'Proyectos destacados' : 'Projetos em destaque',
        output: () => {
            const title = lang === 'en' ? '// Flagship Software Engineering Projects 🚀' : lang === 'es' ? '// Proyectos de Ingeniería de Software Destacados 🚀' : '// Projetos de Engenharia de Software em Destaque 🚀';
            return [
                { text: title, color: 'text-accent font-bold' },
                { text: '1. PayStream Gateway  →  Fintech Core Banking & Idempotent Webhooks', color: 'text-secondary font-bold' },
                { text: '   Fastify + TypeScript + Prisma + PostgreSQL | Split em Centavos & HMAC-SHA256', color: 'text-primary' },
                { text: '   GitHub: https://github.com/pedrhenriqueol/paystream-gateway', color: 'text-primary/70' },
                { text: '', color: '' },
                { text: '2. PortLog OS  →  Terminal Logistics, Kanban FSM & IoT Telemetry', color: 'text-secondary font-bold' },
                { text: '   React + Fastify + Multi-tenant RBAC | STS/RTG Cranes & MTTR in UTC', color: 'text-primary' },
                { text: '   GitHub: https://github.com/pedrhenriqueol/portlog-os', color: 'text-primary/70' },
                { text: '', color: '' },
                { text: '3. SPECTR TestOps  →  Postman-Grade API Testing & Chaos Engineering', color: 'text-secondary font-bold' },
                { text: '   React + Fastify + OpenAPI Schema | Percentis p50/p90/p95/p99 & Chaos Lab', color: 'text-primary' },
                { text: '   GitHub: https://github.com/pedrhenriqueol/spectr-testops', color: 'text-primary/70' },
            ];
        },
    },
    {
        cmd: 'skills',
        desc: lang === 'en' ? 'Technologies' : lang === 'es' ? 'Tecnologías' : 'Tecnologias',
        output: () => {
            const title = lang === 'en' ? '// Technical Stack ⚡' : lang === 'es' ? '// Stack Tecnológico ⚡' : '// Stack tecnológica ⚡';
            return [
                { text: title, color: 'text-accent' },
                { text: 'backend:   [ Delphi + UniGui, PHP/Laravel, Java, RESTful APIs, RBAC ]', color: 'text-secondary' },
                { text: 'frontend:  [ React, TypeScript, Tailwind CSS, JavaScript ]', color: 'text-secondary' },
                { text: 'database:  [ SQL Server, MySQL, Relational Modeling, N+1 Optimization ]', color: 'text-secondary' },
                { text: 'devops:    [ Docker, AWS, Git, GitHub, Railway, Linux ]', color: 'text-secondary' },
                { text: 'qa/testing:[ Postman, Regression Testing, Scrum, Requirements Validation ]', color: 'text-secondary' },
                { text: 'ai:        [ Generative LLMs, Prompt Engineering, Agentic Workflows ]', color: 'text-secondary' },
            ];
        },
    },
    {
        cmd: 'experience',
        desc: lang === 'en' ? 'Trajectory' : lang === 'es' ? 'Trayectoria' : 'Trajetória',
        output: () => {
            if (lang === 'en') {
                return [
                    { text: '// Professional Trajectory 📋', color: 'text-accent' },
                    { text: 'SETE Tecnologia  →  QA & Testing Analyst  (June 2026 - Present)', color: 'text-secondary font-bold' },
                    { text: '  - Quality assurance for critical port logistics systems (ePita platform)', color: 'text-primary' },
                    { text: '  - REST API validation via Postman and SQL Server audits (-25% bug rate)', color: 'text-primary' },
                    { text: '', color: '' },
                    { text: 'Qualisoft Sistemas  →  Backend Software Developer (Aug 2025 - June 2026)', color: 'text-secondary font-bold' },
                    { text: '  - Critical query optimization on SQL Server / MySQL (2s → <500ms)', color: 'text-primary' },
                    { text: '  - Legacy Delphi ERP maintenance + Laravel / React web migration', color: 'text-primary' },
                    { text: '  - Internal automation with low-code tools & Generative AI workflows', color: 'text-primary' },
                ];
            }
            if (lang === 'es') {
                return [
                    { text: '// Trayectoria Profesional 📋', color: 'text-accent' },
                    { text: 'SETE Tecnologia  →  Analista de QA / Pruebas  (Junio 2026 - Presente)', color: 'text-secondary font-bold' },
                    { text: '  - Aseguramiento de calidad en sistemas logísticos portuarios críticos (ePita)', color: 'text-primary' },
                    { text: '  - Validación de APIs REST con Postman y consultas SQL Server (-25% bugs)', color: 'text-primary' },
                    { text: '', color: '' },
                    { text: 'Qualisoft Sistemas  →  Desarrollador Back-End (Ago 2025 - Junio 2026)', color: 'text-secondary font-bold' },
                    { text: '  - Optimización crítica de consultas SQL Server/MySQL (2s → <500ms)', color: 'text-primary' },
                    { text: '  - Mantenimiento de ERP monolítico Delphi + Plataforma Laravel/React', color: 'text-primary' },
                    { text: '  - Automatizaciones internas con plataformas low-code e IA Generativa', color: 'text-primary' },
                ];
            }
            return [
                { text: '// Trajetória profissional 📋', color: 'text-accent' },
                { text: 'SETE Tecnologia  →  Analista de QA / Testes  (Junho 2026 - Presente)', color: 'text-secondary font-bold' },
                { text: '  - Garantia de qualidade em sistemas críticos de logística portuária (ePita)', color: 'text-primary' },
                { text: '  - Validação de APIs REST via Postman e consultas SQL Server (-25% bugs)', color: 'text-primary' },
                { text: '', color: '' },
                { text: 'Qualisoft Sistemas  →  Desenvolvedor Back-End (Ago 2025 - Junho 2026)', color: 'text-secondary font-bold' },
                { text: '  - Otimização crítica de queries SQL Server/MySQL (2s → <500ms)', color: 'text-primary' },
                { text: '  - Manutenção de ERP monolítico Delphi + Plataforma Laravel/React', color: 'text-primary' },
                { text: '  - Automações internas com plataformas low-code e IA Generativa', color: 'text-primary' },
            ];
        },
    },
    {
        cmd: 'contact',
        desc: lang === 'en' ? 'Contact' : lang === 'es' ? 'Contacto' : 'Contato',
        output: () => {
            const title = lang === 'en' ? '// Direct Contact Channels 📬' : lang === 'es' ? '// Canales de Contacto Directo 📬' : '// Canais de contato direto 📬';
            const footer = lang === 'en' ? '→ Fast responses for opportunities and collaborations. ✓' : lang === 'es' ? '→ Respuestas rápidas para oportunidades y alianzas. ✓' : '→ Respondo rapidamente para oportunidades e parcerias. ✓';
            return [
                { text: title, color: 'text-accent' },
                { text: 'email:    pedrohc.forza@gmail.com', color: 'text-secondary' },
                { text: 'github:   github.com/pedrhenriqueol', color: 'text-secondary' },
                { text: 'linkedin: linkedin.com/in/pedro-henrique-b0a015391', color: 'text-secondary' },
                { text: 'phone:    +55 (85) 98868-7214', color: 'text-secondary' },
                { text: '', color: '' },
                { text: footer, color: 'text-accent' },
            ];
        },
    },
    {
        cmd: 'status',
        desc: lang === 'en' ? 'Availability' : lang === 'es' ? 'Disponibilidad' : 'Disponibilidade',
        output: () => {
            const now = new Date();
            const hour = now.getHours();
            const available = hour >= 8 && hour < 23;
            if (lang === 'en') {
                return [
                    { text: '// Current Status 🟢', color: 'text-accent' },
                    { text: 'location:    Fortaleza / Maracanaú, CE — Brazil (UTC-3)', color: 'text-secondary' },
                    { text: `local time:  ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`, color: 'text-secondary' },
                    { text: `available:   ${available ? 'Yes ✓ — open for interviews & projects!' : 'Outside active business hours'}`, color: available ? 'text-accent' : 'text-primary' },
                    { text: 'education:   B.S. in Software Engineering (Unifanor)', color: 'text-secondary' },
                    { text: 'role:        Fullstack Software Engineer // QA Specialist', color: 'text-secondary' },
                ];
            }
            if (lang === 'es') {
                return [
                    { text: '// Estado Actual 🟢', color: 'text-accent' },
                    { text: 'ubicación:   Fortaleza / Maracanaú, CE — Brasil (UTC-3)', color: 'text-secondary' },
                    { text: `hora local:  ${now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`, color: 'text-secondary' },
                    { text: `disponible:  ${available ? '¡Sí ✓ — disponible para proyectos!' : 'Fuera del horario comercial'}`, color: available ? 'text-accent' : 'text-primary' },
                    { text: 'educación:   Licenciatura en Ingeniería de Software (Unifanor)', color: 'text-secondary' },
                    { text: 'rol:         Ingeniero de Software Fullstack // Especialista en QA', color: 'text-secondary' },
                ];
            }
            return [
                { text: '// Status atual 🟢', color: 'text-accent' },
                { text: 'localização: Fortaleza / Maracanaú, CE — Brasil (UTC-3)', color: 'text-secondary' },
                { text: `horário:     ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`, color: 'text-secondary' },
                { text: `disponível:  ${available ? 'Sim ✓ — respondo hoje!' : 'Fora do horário comercial'}`, color: available ? 'text-accent' : 'text-primary' },
                { text: 'formação:    Bacharelado em Engenharia de Software (Unifanor)', color: 'text-secondary' },
                { text: 'status:      Disponível para projetos e contratação', color: 'text-secondary' },
            ];
        },
    },
];

export function useTerminalCommands(lang) {
    const commandsList = useMemo(() => getCommands(lang), [lang]);

    const execute = useCallback((raw, { onLaunchGame, onClear, setLines }) => {
        const trimmed = raw.trim();
        if (!trimmed) return;

        const lower = trimmed.toLowerCase();

        if (lower === 'exit' || lower === 'quit') {
            onLaunchGame(null);
            const exitMsg = lang === 'en' ? 'Exiting game... Returning to main shell.' : lang === 'es' ? 'Saliendo del juego... Regresando al shell principal.' : 'Saindo do jogo... Retornando ao shell principal.';
            setLines(prev => [
                ...prev,
                { text: `> ${trimmed}`, color: 'text-accent/80' },
                { text: exitMsg, color: 'text-primary/70' },
                { text: '', color: '' },
            ]);
            return;
        }

        if (lower === 'clear') {
            onClear();
            return;
        }

        // Easter eggs
        if (lower === 'pedro --sudo rm -rf /' || lower === 'sudo rm -rf /') {
            const rm1 = lang === 'en' ? '💥 rm: Permission denied. This portfolio is indestructible.' : lang === 'es' ? '💥 rm: Permiso denegado. Este portafolio es indestructible.' : '💥 rm: Permissão negada. Esse portfólio é indestrutível.';
            const rm2 = lang === 'en' ? '🛡️ Auto-deploy protection enabled. Nice try!' : lang === 'es' ? '🛡️ Protección de despliegue automático activada. ¡Buen intento!' : '🛡️ Proteção deploy automático ativada. Nice try!';
            setLines(prev => [
                ...prev,
                { text: `> ${trimmed}`, color: 'text-accent/80' },
                { text: rm1, color: 'text-red-400 font-bold' },
                { text: rm2, color: 'text-secondary' },
                { text: '', color: '' },
            ]);
            return;
        }

        if (lower === 'pedro --version' || lower === 'version') {
            const title = lang === 'en' ? '// Interactive Terminal v2.1 — Arcade Edition 🕹️' : lang === 'es' ? '// Terminal Interactivo v2.1 — Edición Arcade 🕹️' : '// Terminal Interativo v2.1 — Arcade Edition 🕹️';
            const gText = lang === 'en' ? '5 interactive minigames' : lang === 'es' ? '5 minijuegos interactivos' : '5 minijogos interativos';
            setLines(prev => [
                ...prev,
                { text: `> ${trimmed}`, color: 'text-accent/80' },
                { text: title, color: 'text-accent' },
                { text: 'engine:   React 19 + Vite 8 + Tailwind CSS v4', color: 'text-secondary' },
                { text: `build:    ${new Date().toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : 'pt-BR')}`, color: 'text-secondary' },
                { text: 'author:   Pedro Henrique (@pedrhenriqueol)', color: 'text-secondary' },
                { text: `games:    ${gText}`, color: 'text-secondary' },
                { text: '', color: '' },
            ]);
            return;
        }

        // Comandos de Jogos
        if (lower === 'pedro --play snake' || lower === 'snake') {
            onLaunchGame('snake');
            return;
        }
        if (lower === 'pedro --play bug-hunter' || lower === 'bughunter' || lower === 'bug-hunter') {
            onLaunchGame('bug-hunter');
            return;
        }
        if (lower === 'pedro --play trivia' || lower === 'trivia' || lower === 'quiz') {
            onLaunchGame('trivia');
            return;
        }
        if (lower === 'pedro --play aim-test' || lower === 'aim-test' || lower === 'aim') {
            onLaunchGame('aim-test');
            return;
        }
        if (lower === 'pedro --sudo matrix' || lower === 'matrix') {
            onLaunchGame('matrix');
            return;
        }

        // Standard commands
        const cmdKey = lower.replace('pedro --', '').replace('pedro-', '');
        const found = commandsList.find(c => c.cmd === cmdKey || trimmed === `pedro --${c.cmd}`);

        if (found) {
            const out = found.output();
            setLines(prev => [
                ...prev,
                { text: `> ${trimmed}`, color: 'text-accent/80' },
                ...out,
                { text: '', color: '' }
            ]);
        } else {
            const unknown = lang === 'en'
                ? `Unknown command: "${trimmed}". Type "pedro --help" or "pedro --games".`
                : lang === 'es'
                ? `Comando no reconocido: "${trimmed}". Escribe "pedro --help" o "pedro --games".`
                : `Comando desconhecido: "${trimmed}". Digite "pedro --help" ou "pedro --games".`;
            setLines(prev => [
                ...prev,
                { text: `> ${trimmed}`, color: 'text-accent/80' },
                { text: unknown, color: 'text-red-400' },
                { text: '', color: '' }
            ]);
        }
    }, [lang, commandsList]);

    return { execute };
}
