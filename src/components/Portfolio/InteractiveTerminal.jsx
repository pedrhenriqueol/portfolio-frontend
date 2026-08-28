import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { GAMES_INFO, TRIVIA_QUESTIONS } from './TerminalGames';

// ── Lista de comandos para autocomplete ──
const ALL_CMD_STRINGS = [
    'pedro --help', 'pedro --skills', 'pedro --experience', 'pedro --contact',
    'pedro --status', 'pedro --games', 'pedro --play snake', 'pedro --play bug-hunter',
    'pedro --play trivia', 'pedro --play aim-test', 'pedro --sudo matrix',
    'pedro --sudo rm -rf /', 'pedro --version', 'clear', 'exit',
];

const getWelcomeLines = (lang) => {
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

const getCommands = (lang) => [
    {
        cmd: 'help',
        desc: lang === 'en' ? 'Show all available commands' : lang === 'es' ? 'Muestra todos los comandos' : 'Mostra todos os comandos disponíveis',
        output: () => {
            if (lang === 'en') {
                return [
                    { text: '── Portfolio Commands ──', color: 'text-secondary font-bold' },
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
            const list = GAMES_INFO[lang] || GAMES_INFO.pt;
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
                    { text: `location:    Fortaleza / Maracanaú, CE — Brazil (UTC-3)`, color: 'text-secondary' },
                    { text: `local time:  ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`, color: 'text-secondary' },
                    { text: `available:   ${available ? 'Yes ✓ — open for interviews & projects!' : 'Outside active business hours'}`, color: available ? 'text-accent' : 'text-primary' },
                    { text: `education:   B.S. in Software Engineering (Unifanor)`, color: 'text-secondary' },
                    { text: `role:        Fullstack Software Engineer // QA Specialist`, color: 'text-secondary' },
                ];
            }
            if (lang === 'es') {
                return [
                    { text: '// Estado Actual 🟢', color: 'text-accent' },
                    { text: `ubicación:   Fortaleza / Maracanaú, CE — Brasil (UTC-3)`, color: 'text-secondary' },
                    { text: `hora local:  ${now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`, color: 'text-secondary' },
                    { text: `disponible:  ${available ? '¡Sí ✓ — disponible para proyectos!' : 'Fuera del horario comercial'}`, color: available ? 'text-accent' : 'text-primary' },
                    { text: `educación:   Licenciatura en Ingeniería de Software (Unifanor)`, color: 'text-secondary' },
                    { text: `rol:         Ingeniero de Software Fullstack // Especialista en QA`, color: 'text-secondary' },
                ];
            }
            return [
                { text: '// Status atual 🟢', color: 'text-accent' },
                { text: `localização: Fortaleza / Maracanaú, CE — Brasil (UTC-3)`, color: 'text-secondary' },
                { text: `horário:     ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`, color: 'text-secondary' },
                { text: `disponível:  ${available ? 'Sim ✓ — respondo hoje!' : 'Fora do horário comercial'}`, color: available ? 'text-accent' : 'text-primary' },
                { text: `formação:    Bacharelado em Engenharia de Software (Unifanor)`, color: 'text-secondary' },
                { text: `status:      Disponível para projetos e contratação`, color: 'text-secondary' },
            ];
        },
    },
];

export default function InteractiveTerminal() {
    const { lang } = useLanguage();
    const [lines, setLines] = useState(() => getWelcomeLines(lang));
    const [input, setInput] = useState('');
    const [focused, setFocused] = useState(false);
    const [history, setHistory] = useState([]);
    const [histIdx, setHistIdx] = useState(-1);
    const [activeGame, setActiveGame] = useState(null);
    const [visitorCity, setVisitorCity] = useState('');
    const contentRef = useRef(null);
    const inputRef = useRef(null);

    // Atualiza boas-vindas ao trocar de idioma se não houver histórico customizado
    useEffect(() => {
        setLines(getWelcomeLines(lang));
    }, [lang]);

    // ── Snake Game State ──
    const [snake, setSnake] = useState([[5, 5], [5, 4], [5, 3]]);
    const [food, setFood] = useState([8, 12]);
    const [foodLabel, setFoodLabel] = useState('React');
    const [snakeDir, setSnakeDir] = useState('RIGHT');
    const [snakeScore, setSnakeScore] = useState(0);
    const [snakeGameOver, setSnakeGameOver] = useState(false);
    const [snakeHighscore, setSnakeHighscore] = useState(() => {
        return parseInt(localStorage.getItem('terminal_snake_highscore') || '0', 10);
    });
    const snakeDirRef = useRef('RIGHT');
    snakeDirRef.current = snakeDir;

    // ── Bug Hunter State (Minesweeper QA) ──
    const [bugGrid, setBugGrid] = useState([]);
    const [bugState, setBugState] = useState('PLAYING');

    // ── Trivia Quiz State ──
    const [triviaIdx, setTriviaIdx] = useState(0);
    const [triviaScore, setTriviaScore] = useState(0);

    // ── Aim Test State ──
    const [aimTarget, setAimTarget] = useState({ x: 5, y: 3, label: '01' });
    const [aimStartTime, setAimStartTime] = useState(0);
    const [aimScores, setAimScores] = useState([]);
    const [aimHits, setAimHits] = useState(0);
    const [aimBestAvg, setAimBestAvg] = useState(() => {
        return parseInt(localStorage.getItem('terminal_aim_best_avg') || '0', 10);
    });

    // ── Matrix Effect State ──
    const matrixCanvasRef = useRef(null);

    // ── Detectar localização do visitante via IP-API ──
    useEffect(() => {
        fetch('https://ipapi.co/json/')
            .then(r => r.json())
            .then(data => {
                if (data.city) {
                    const cityStr = `${data.city}, ${data.country_code || data.country_name}`;
                    setVisitorCity(cityStr);
                    const hour = new Date().getHours();
                    let greeting = '';
                    if (lang === 'en') {
                        greeting = hour >= 0 && hour < 5 ? '🌙 Coding in the late hours? True dedication!' : hour < 12 ? '☀️ Good morning!' : hour < 18 ? '🌤️ Good afternoon!' : '🌙 Good evening!';
                    } else if (lang === 'es') {
                        greeting = hour >= 0 && hour < 5 ? '🌙 ¿Programando de madrugada? ¡Qué dedicación!' : hour < 12 ? '☀️ ¡Buenos días!' : hour < 18 ? '🌤️ ¡Buenas tardes!' : '🌙 ¡Buenas noches!';
                    } else {
                        greeting = hour >= 0 && hour < 5 ? '🌙 Acessando de madrugada? Isso sim é dedicação!' : hour < 12 ? '☀️ Bom dia!' : hour < 18 ? '🌤️ Boa tarde!' : '🌙 Boa noite!';
                    }
                    const connText = lang === 'en' ? 'Connected via' : lang === 'es' ? 'Conectado vía' : 'Conectado via';
                    setLines(prev => [
                        ...prev,
                        { text: `${greeting} ${connText} ${cityStr}`, color: 'text-accent/80' },
                    ]);
                }
            })
            .catch(() => {});
    }, [lang]);

    // ── Auto-scroll interno do terminal ──
    useEffect(() => {
        if (!activeGame && contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
    }, [lines, activeGame]);

    // ── Iniciar Bug Hunter ──
    const initBugHunter = useCallback(() => {
        const rows = 4;
        const cols = 6;
        const totalBugs = 3;
        const grid = [];
        for (let r = 0; r < rows; r++) {
            const row = [];
            for (let c = 0; c < cols; c++) {
                row.push({ r, c, isBug: false, revealed: false, count: 0 });
            }
            grid.push(row);
        }

        let placed = 0;
        while (placed < totalBugs) {
            const rr = Math.floor(Math.random() * rows);
            const cc = Math.floor(Math.random() * cols);
            if (!grid[rr][cc].isBug) {
                grid[rr][cc].isBug = true;
                placed++;
            }
        }

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (grid[r][c].isBug) continue;
                let b = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr, nc = c + dc;
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc].isBug) {
                            b++;
                        }
                    }
                }
                grid[r][c].count = b;
            }
        }

        setBugGrid(grid);
        setBugState('PLAYING');
    }, []);

    // ── Iniciar Snake ──
    const initSnake = useCallback(() => {
        setSnake([[5, 5], [5, 4], [5, 3]]);
        setSnakeDir('RIGHT');
        setSnakeScore(0);
        setSnakeGameOver(false);
        setFood([Math.floor(Math.random() * 8) + 1, Math.floor(Math.random() * 18) + 1]);
        setFoodLabel('React');
    }, []);

    // ── Iniciar Aim Test ──
    const initAimTest = useCallback(() => {
        setAimHits(0);
        setAimScores([]);
        const nx = Math.floor(Math.random() * 8) + 1;
        const ny = Math.floor(Math.random() * 4) + 1;
        const targetCode = Math.floor(Math.random() * 89 + 10).toString();
        setAimTarget({ x: nx, y: ny, label: targetCode });
        setAimStartTime(Date.now());
    }, []);

    // ── Loop do Snake Game ──
    useEffect(() => {
        if (activeGame !== 'snake' || snakeGameOver) return;
        const timer = setInterval(() => {
            setSnake(prevSnake => {
                const head = prevSnake[0];
                let newHead = [...head];
                const dir = snakeDirRef.current;
                if (dir === 'UP') newHead[0] -= 1;
                if (dir === 'DOWN') newHead[0] += 1;
                if (dir === 'LEFT') newHead[1] -= 1;
                if (dir === 'RIGHT') newHead[1] += 1;

                if (newHead[0] < 0 || newHead[0] >= 10 || newHead[1] < 0 || newHead[1] >= 20) {
                    setSnakeGameOver(true);
                    return prevSnake;
                }
                if (prevSnake.some(seg => seg[0] === newHead[0] && seg[1] === newHead[1])) {
                    setSnakeGameOver(true);
                    return prevSnake;
                }

                const eating = newHead[0] === food[0] && newHead[1] === food[1];
                if (eating) {
                    setSnakeScore(s => s + 10);
                    const nf = [Math.floor(Math.random() * 9) + 0, Math.floor(Math.random() * 19) + 0];
                    const stacks = ['React', 'Laravel', 'Delphi', 'SQL', 'Postman', 'Docker', 'TypeScript'];
                    setFood(nf);
                    setFoodLabel(stacks[Math.floor(Math.random() * stacks.length)]);
                    return [newHead, ...prevSnake];
                }
                return [newHead, ...prevSnake.slice(0, -1)];
            });
        }, 130);
        return () => clearInterval(timer);
    }, [activeGame, snakeGameOver, food]);

    // ── Loop Matrix Effect ──
    useEffect(() => {
        if (activeGame !== 'matrix') return;
        const canvas = matrixCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
        let height = (canvas.height = 240);

        const chars = '01PEDROHENRIQUESETEKANBANQAAPIRESTSQLSERVERDELPHI';
        const fontSize = 12;
        const columns = Math.floor(width / fontSize);
        const drops = Array(columns).fill(1);

        let animationFrameId;
        const render = () => {
            ctx.fillStyle = 'rgba(13, 15, 20, 0.12)';
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = '#00FF66';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            animationFrameId = requestAnimationFrame(render);
        };
        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [activeGame]);

    // ── Executar comandos ──
    const runCommand = useCallback((raw) => {
        const trimmed = raw.trim();
        if (!trimmed) return;

        setHistory(h => [trimmed, ...h]);
        setHistIdx(-1);

        const exitMsg = lang === 'en' ? 'Exiting game... Returning to main shell.' : lang === 'es' ? 'Saliendo del juego... Regresando al shell principal.' : 'Saindo do jogo... Retornando ao shell principal.';

        if (trimmed.toLowerCase() === 'exit' || trimmed.toLowerCase() === 'quit') {
            setActiveGame(null);
            setLines(prev => [
                ...prev,
                { text: `> ${trimmed}`, color: 'text-accent/80' },
                { text: exitMsg, color: 'text-primary/70' },
                { text: '', color: '' },
            ]);
            setInput('');
            return;
        }

        // ── Easter Eggs ──
        if (trimmed.toLowerCase() === 'pedro --sudo rm -rf /' || trimmed.toLowerCase() === 'sudo rm -rf /') {
            const rm1 = lang === 'en' ? '💥 rm: Permission denied. This portfolio is indestructible.' : lang === 'es' ? '💥 rm: Permiso denegado. Este portafolio es indestructible.' : '💥 rm: Permissão negada. Esse portfólio é indestrutível.';
            const rm2 = lang === 'en' ? '🛡️ Auto-deploy protection enabled. Nice try!' : lang === 'es' ? '🛡️ Protección de despliegue automático activada. ¡Buen intento!' : '🛡️ Proteção deploy automático ativada. Nice try!';
            setLines(prev => [
                ...prev,
                { text: `> ${trimmed}`, color: 'text-accent/80' },
                { text: rm1, color: 'text-red-400 font-bold' },
                { text: rm2, color: 'text-secondary' },
                { text: '', color: '' },
            ]);
            setInput('');
            return;
        }

        if (trimmed.toLowerCase() === 'pedro --version' || trimmed.toLowerCase() === 'version') {
            const title = lang === 'en' ? '// Interactive Terminal v2.1 — Arcade Edition 🕹️' : lang === 'es' ? '// Terminal Interactivo v2.1 — Edición Arcade 🕹️' : '// Terminal Interativo v2.1 — Arcade Edition 🕹️';
            const gText = lang === 'en' ? '5 interactive minigames' : lang === 'es' ? '5 minijuegos interactivos' : '5 minijogos interativos';
            setLines(prev => [
                ...prev,
                { text: `> ${trimmed}`, color: 'text-accent/80' },
                { text: title, color: 'text-accent' },
                { text: `engine:   React 19 + Vite 8 + Tailwind CSS v4`, color: 'text-secondary' },
                { text: `build:    ${new Date().toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : 'pt-BR')}`, color: 'text-secondary' },
                { text: `author:   Pedro Henrique (@pedrhenriqueol)`, color: 'text-secondary' },
                { text: `games:    ${gText}`, color: 'text-secondary' },
                { text: '', color: '' },
            ]);
            setInput('');
            return;
        }

        // Comandos de Jogos
        const commandsList = getCommands(lang);
        if (trimmed.toLowerCase() === 'pedro --games' || trimmed.toLowerCase() === 'pedro-games' || trimmed.toLowerCase() === 'games') {
            const out = commandsList.find(c => c.cmd === 'games').output();
            setLines(prev => [...prev, { text: `> ${trimmed}`, color: 'text-accent/80' }, ...out, { text: '', color: '' }]);
            setInput('');
            return;
        }

        if (trimmed.toLowerCase() === 'pedro --play snake' || trimmed.toLowerCase() === 'snake') {
            setActiveGame('snake');
            initSnake();
            setInput('');
            return;
        }

        if (trimmed.toLowerCase() === 'pedro --play bug-hunter' || trimmed.toLowerCase() === 'bughunter' || trimmed.toLowerCase() === 'bug-hunter') {
            setActiveGame('bug-hunter');
            initBugHunter();
            setInput('');
            return;
        }

        if (trimmed.toLowerCase() === 'pedro --play trivia' || trimmed.toLowerCase() === 'trivia' || trimmed.toLowerCase() === 'quiz') {
            setActiveGame('trivia');
            setTriviaIdx(0);
            setTriviaScore(0);
            setInput('');
            return;
        }

        if (trimmed.toLowerCase() === 'pedro --play aim-test' || trimmed.toLowerCase() === 'aim-test' || trimmed.toLowerCase() === 'aim') {
            setActiveGame('aim-test');
            initAimTest();
            setInput('');
            return;
        }

        if (trimmed.toLowerCase() === 'pedro --sudo matrix' || trimmed.toLowerCase() === 'matrix') {
            setActiveGame('matrix');
            setInput('');
            return;
        }

        if (trimmed === 'clear') {
            setLines(getWelcomeLines(lang));
            setInput('');
            return;
        }

        const newLines = [
            ...lines,
            { text: `> ${trimmed}`, color: 'text-accent/80' },
        ];

        const cmdKey = trimmed.replace('pedro --', '').replace('pedro-', '').toLowerCase();
        const found = commandsList.find(c => c.cmd === cmdKey || trimmed === `pedro --${c.cmd}`);

        if (found) {
            const out = found.output();
            setLines([...newLines, ...out, { text: '', color: '' }]);
        } else {
            const unknown = lang === 'en'
                ? `Unknown command: "${trimmed}". Type "pedro --help" or "pedro --games".`
                : lang === 'es'
                ? `Comando no reconocido: "${trimmed}". Escribe "pedro --help" o "pedro --games".`
                : `Comando desconhecido: "${trimmed}". Digite "pedro --help" ou "pedro --games".`;
            setLines([
                ...newLines,
                { text: unknown, color: 'text-red-400/70' },
                { text: '', color: '' },
            ]);
        }
        setInput('');
    }, [lines, lang, initSnake, initBugHunter, initAimTest]);

    // ── Listener para evento customizado de focar o terminal via CommandPalette ──
    useEffect(() => {
        const handler = (e) => {
            setActiveGame(null);
            if (e.detail?.command) {
                runCommand(e.detail.command);
            }
            inputRef.current?.focus();
        };
        window.addEventListener('focus-terminal', handler);
        return () => window.removeEventListener('focus-terminal', handler);
    }, [runCommand]);

    // ── Resposta de Trivia ──
    const handleTriviaAnswer = (choice) => {
        const currentQuestions = TRIVIA_QUESTIONS[lang] || TRIVIA_QUESTIONS.pt;
        const current = currentQuestions[triviaIdx];
        const isCorrect = choice === current.answer;
        const nextScore = isCorrect ? triviaScore + 1 : triviaScore;
        setTriviaScore(nextScore);

        const ansText = isCorrect
            ? (lang === 'en' ? '✅ CORRECT! +100 XP' : lang === 'es' ? '✅ ¡CORRECTO! +100 XP' : '✅ CORRETO! +100 XP')
            : (lang === 'en' ? `❌ INCORRECT (Correct: ${current.answer})` : lang === 'es' ? `❌ INCORRECTO (Correcta: ${current.answer})` : `❌ INCORRETO (Resposta certa: ${current.answer})`);

        setLines(prev => [
            ...prev,
            { text: `Quiz: ${current.q}`, color: 'text-secondary font-bold' },
            { text: `${lang === 'en' ? 'Your answer' : lang === 'es' ? 'Tu respuesta' : 'Sua resposta'}: [${choice}] -> ${ansText}`, color: isCorrect ? 'text-green-400 font-bold' : 'text-red-400' },
            { text: `💡 ${lang === 'en' ? 'Explanation' : lang === 'es' ? 'Explicación' : 'Explicação'}: ${current.explanation}`, color: 'text-primary/70' },
            { text: '', color: '' }
        ]);

        if (triviaIdx + 1 < currentQuestions.length) {
            setTriviaIdx(i => i + 1);
        } else {
            const endHeader = lang === 'en'
                ? `🏆 TECH QUIZ FINISHED! Final Score: ${nextScore} / ${currentQuestions.length} (${Math.round((nextScore / currentQuestions.length) * 100)}%)`
                : lang === 'es'
                ? `🏆 ¡FIN DEL QUIZ TÉCNICO! Puntuación final: ${nextScore} / ${currentQuestions.length} (${Math.round((nextScore / currentQuestions.length) * 100)}%)`
                : `🏆 FIM DO QUIZ TÉCNICO! Pontuação final: ${nextScore} / ${currentQuestions.length} (${Math.round((nextScore / currentQuestions.length) * 100)}%)`;

            const endMsg = nextScore === 4
                ? (lang === 'en' ? '⭐⭐⭐ Senior Architecture & QA Level reached!' : lang === 'es' ? '⭐⭐⭐ ¡Nivel Senior en Arquitectura y QA alcanzado!' : '⭐⭐⭐ Nível Sênior em Arquitetura & QA atingido!')
                : (lang === 'en' ? 'Great game! Keep mastering the concepts.' : lang === 'es' ? '¡Buen juego! Sigue practicando los conceptos.' : 'Bom jogo! Continue praticando os conceitos.');

            const endPrompt = lang === 'en' ? 'Type "pedro --games" to play more games.' : lang === 'es' ? 'Escribe "pedro --games" para jugar otros minijuegos.' : 'Digite "pedro --games" para jogar outros minijogos.';

            setLines(prev => [
                ...prev,
                { text: endHeader, color: 'text-accent font-bold text-sm' },
                { text: endMsg, color: 'text-secondary' },
                { text: endPrompt, color: 'text-primary/60' },
                { text: '', color: '' }
            ]);
            setActiveGame(null);
        }
    };

    // ── Clique no Bug Hunter ──
    const handleBugClick = (r, c) => {
        if (bugState !== 'PLAYING') return;
        const cell = bugGrid[r][c];
        if (cell.revealed) return;

        const newGrid = bugGrid.map(row => row.map(cell => ({ ...cell })));
        if (cell.isBug) {
            newGrid.forEach(row => row.forEach(c => { if (c.isBug) c.revealed = true; }));
            setBugGrid(newGrid);
            setBugState('LOST');
            return;
        }

        newGrid[r][c].revealed = true;
        setBugGrid(newGrid);

        let unrevealedClean = 0;
        newGrid.forEach(row => row.forEach(c => {
            if (!c.isBug && !c.revealed) unrevealedClean++;
        }));
        if (unrevealedClean === 0) {
            setBugState('WON');
        }
    };

    // ── Resposta de Aim Test ──
    const handleAimClick = () => {
        const elapsed = Date.now() - aimStartTime;
        const nextHits = aimHits + 1;
        const newScores = [...aimScores, elapsed];
        setAimScores(newScores);
        setAimHits(nextHits);

        if (nextHits >= 5) {
            const avg = Math.round(newScores.reduce((a, b) => a + b, 0) / newScores.length);
            if (aimBestAvg === 0 || avg < aimBestAvg) {
                setAimBestAvg(avg);
                localStorage.setItem('terminal_aim_best_avg', avg.toString());
            }
            const bestDisplay = (aimBestAvg === 0 || avg < aimBestAvg) ? avg : aimBestAvg;

            const h1 = lang === 'en' ? '🎯 REFLEX SPEED TEST COMPLETED! (5 Targets)' : lang === 'es' ? '🎯 ¡TEST DE REFLEJOS COMPLETADO! (5 Objetivos)' : '🎯 TESTE DE REFLEXOS CONCLUÍDO! (5 Alvos)';
            const h2 = lang === 'en' ? `⚡ Average response time: ${avg}ms` : lang === 'es' ? `⚡ Tiempo promedio de respuesta: ${avg}ms` : `⚡ Tempo médio de resposta: ${avg}ms`;
            const h3 = lang === 'en' ? `🏆 Best registered average: ${bestDisplay}ms` : lang === 'es' ? `🏆 Mejor promedio registrado: ${bestDisplay}ms` : `🏆 Melhor média registrada: ${bestDisplay}ms`;
            const h4 = avg < 300
                ? (lang === 'en' ? '🚀 Cyberpunk / real-time QA reflexes!' : lang === 'es' ? '🚀 ¡Reflejos Cyberpunk / QA en tiempo real!' : '🚀 Reflexos de Cyberpunk / QA em tempo real!')
                : (lang === 'en' ? '👍 Great reaction speed!' : lang === 'es' ? '👍 ¡Gran tiempo de reacción!' : '👍 Ótimo tempo de reação!');
            const h5 = lang === 'en' ? 'Type "pedro --games" for more minigames.' : lang === 'es' ? 'Escribe "pedro --games" para más minijuegos.' : 'Digite "pedro --games" para outros jogos.';

            setLines(prev => [
                ...prev,
                { text: h1, color: 'text-accent font-bold' },
                { text: h2, color: 'text-green-400 font-bold' },
                { text: h3, color: 'text-secondary' },
                { text: h4, color: 'text-secondary' },
                { text: h5, color: 'text-primary/60' },
                { text: '', color: '' }
            ]);
            setActiveGame(null);
        } else {
            const nx = Math.floor(Math.random() * 8) + 1;
            const ny = Math.floor(Math.random() * 4) + 1;
            const targetCode = Math.floor(Math.random() * 89 + 10).toString();
            setAimTarget({ x: nx, y: ny, label: targetCode });
            setAimStartTime(Date.now());
        }
    };

    // ── Persistir recorde Snake quando Game Over ──
    useEffect(() => {
        if (snakeGameOver && snakeScore > snakeHighscore) {
            localStorage.setItem('terminal_snake_highscore', snakeScore.toString());
            setSnakeHighscore(snakeScore);
        }
    }, [snakeGameOver, snakeScore, snakeHighscore]);

    // ── Teclas no Terminal / Snake ──
    const onKey = (e) => {
        if (activeGame === 'snake' && !snakeGameOver) {
            if (['ArrowUp', 'KeyW'].includes(e.code) && snakeDir !== 'DOWN') { e.preventDefault(); setSnakeDir('UP'); }
            if (['ArrowDown', 'KeyS'].includes(e.code) && snakeDir !== 'UP') { e.preventDefault(); setSnakeDir('DOWN'); }
            if (['ArrowLeft', 'KeyA'].includes(e.code) && snakeDir !== 'RIGHT') { e.preventDefault(); setSnakeDir('LEFT'); }
            if (['ArrowRight', 'KeyD'].includes(e.code) && snakeDir !== 'LEFT') { e.preventDefault(); setSnakeDir('RIGHT'); }
            if (e.key === 'Escape') { setActiveGame(null); }
            return;
        }

        // ── Tab Autocomplete com Sombra de Sugestão ──
        if (e.key === 'Tab') {
            e.preventDefault();
            const current = input.toLowerCase();
            if (!current.trim()) return;
            const match = ALL_CMD_STRINGS.find(c => c.startsWith(current) && c !== current);
            if (match) {
                setInput(match);
            }
            return;
        }

        if (e.key === 'Enter') { e.preventDefault(); runCommand(input); }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const idx = Math.min(histIdx + 1, history.length - 1);
            setHistIdx(idx);
            if (history[idx] !== undefined) setInput(history[idx]);
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const idx = Math.max(histIdx - 1, -1);
            setHistIdx(idx);
            setInput(idx === -1 ? '' : history[idx]);
        }
    };

    const currentQuestions = TRIVIA_QUESTIONS[lang] || TRIVIA_QUESTIONS.pt;

    return (
        <div
            data-no-morph="true"
            className={`relative bg-[#0d0f14]/98 border rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.7)] transition-all duration-300 ${
                focused ? 'border-accent/50 shadow-[0_24px_60px_rgba(0,0,0,0.7),0_0_30px_rgba(var(--color-accent-rgb),0.08)]' : 'border-white/8'
            }`}
            onClick={() => inputRef.current?.focus()}
        >
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-dark/60 select-none">
                <span className="w-3 h-3 rounded-full bg-red-500/60 hover:bg-red-500 transition-colors cursor-pointer" title="Reset" onClick={(e) => { e.stopPropagation(); setActiveGame(null); setLines(getWelcomeLines(lang)); }} />
                <span className="w-3 h-3 rounded-full bg-yellow-500/40 hover:bg-yellow-500/70 transition-colors cursor-pointer" title="Minimize" />
                <span className="w-3 h-3 rounded-full bg-green-500/40 hover:bg-green-500/70 transition-colors cursor-pointer" title="Maximize" />
                <span className="ml-2 text-xs text-gray-400 font-mono">pedro@portfolio: ~ {activeGame ? `[GAME: ${activeGame.toUpperCase()}]` : ''}</span>
                <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-accent inline-block"
                />
                <span className="text-accent/70 text-xs font-mono ml-1">{activeGame ? 'playing' : 'live'}</span>
            </div>

            {/* Content Area */}
            <div
                ref={contentRef}
                className="p-4 font-mono text-[12px] leading-relaxed min-h-[240px] max-h-[300px] overflow-y-auto relative"
            >
                
                {/* ── JOGO 1: SNAKE GAME ── */}
                {activeGame === 'snake' && (
                    <div className="flex flex-col items-center justify-center space-y-2 py-1">
                        <div className="w-full flex items-center justify-between text-xs border-b border-white/10 pb-1.5 text-gray-300">
                            <span className="text-accent font-bold">🐍 SNAKE ASCII</span>
                            <span>Score: <strong className="text-white">{snakeScore}</strong></span>
                            <span>🏆 Record: <strong className="text-yellow-400">{snakeHighscore}</strong></span>
                            <span>Item: <strong className="text-accent">{foodLabel}</strong></span>
                            <button onClick={() => setActiveGame(null)} className="text-red-400 hover:underline text-[10px]">
                                {lang === 'en' ? 'ESC / Exit' : lang === 'es' ? 'ESC / Salir' : 'ESC / Sair'}
                            </button>
                        </div>

                        {/* ASCII Snake Grid (10x20) */}
                        <div className="bg-black/60 p-2 rounded-xs border border-white/10 font-mono text-[10px] leading-none tracking-widest select-none">
                            {Array.from({ length: 10 }).map((_, r) => (
                                <div key={r} className="flex">
                                    {Array.from({ length: 20 }).map((_, c) => {
                                        const isHead = snake[0][0] === r && snake[0][1] === c;
                                        const isBody = snake.slice(1).some(seg => seg[0] === r && seg[1] === c);
                                        const isFood = food[0] === r && food[1] === c;
                                        return (
                                            <span
                                                key={c}
                                                className={`w-3.5 h-3 flex items-center justify-center ${
                                                    isHead ? 'text-accent font-bold' : isBody ? 'text-green-400' : isFood ? 'text-yellow-400 animate-pulse font-bold' : 'text-gray-800'
                                                }`}
                                            >
                                                {isHead ? '■' : isBody ? '□' : isFood ? '★' : '·'}
                                            </span>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        {snakeGameOver ? (
                            <div className="text-center space-y-1">
                                <div className="text-red-400 font-bold text-xs">
                                    {lang === 'en' ? `💥 GAME OVER! Collision detected. Score: ${snakeScore}` : lang === 'es' ? `💥 ¡GAME OVER! Colisión detectada. Score: ${snakeScore}` : `💥 GAME OVER! Colisão detectada. Score: ${snakeScore}`}
                                </div>
                                {snakeScore > snakeHighscore && snakeScore > 0 && (
                                    <div className="text-yellow-400 font-bold text-xs animate-pulse">
                                        {lang === 'en' ? `🏆 NEW HIGH SCORE! ${snakeScore} points!` : lang === 'es' ? `🏆 ¡NUEVO RÉCORD! ¡${snakeScore} puntos!` : `🏆 NOVO RECORDE! ${snakeScore} pontos!`}
                                    </div>
                                )}
                                <div className="flex gap-2 justify-center">
                                    <button onClick={initSnake} className="px-3 py-1 bg-accent text-darker font-bold text-[10px] rounded hover:bg-accent-hover">
                                        {lang === 'en' ? 'Play Again' : lang === 'es' ? 'Jugar de Nuevo' : 'Jogar de Novo'}
                                    </button>
                                    <button onClick={() => setActiveGame(null)} className="px-3 py-1 border border-white/20 text-gray-300 text-[10px] rounded hover:bg-white/10">
                                        {lang === 'en' ? 'Return to Terminal' : lang === 'es' ? 'Volver al Terminal' : 'Voltar ao Terminal'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-[10px] text-gray-400 text-center">
                                {lang === 'en' ? <>Use <strong className="text-white">WASD</strong> or <strong className="text-white">Arrow Keys</strong> to steer.</> : lang === 'es' ? <>Usa las teclas <strong className="text-white">WASD</strong> o las <strong className="text-white">Flechas</strong> para controlar.</> : <>Use as teclas <strong className="text-white">WASD</strong> ou as <strong className="text-white">Setas</strong> para controlar.</>}
                            </div>
                        )}
                    </div>
                )}

                {/* ── JOGO 2: BUG HUNTER (QA MINESWEEPER) ── */}
                {activeGame === 'bug-hunter' && (
                    <div className="flex flex-col items-center justify-center space-y-2 py-1">
                        <div className="w-full flex items-center justify-between text-xs border-b border-white/10 pb-1.5 text-gray-300">
                            <span className="text-accent font-bold">🐛 QA BUG HUNTER</span>
                            <span>
                                Status: {bugState === 'PLAYING' ? (lang === 'en' ? '🔍 Testing...' : lang === 'es' ? '🔍 Probando...' : '🔍 Testando...') : bugState === 'WON' ? (lang === 'en' ? '🏆 100% Passed!' : lang === 'es' ? '🏆 ¡100% Pasó!' : '🏆 100% Passou!') : (lang === 'en' ? '💥 Error 500!' : lang === 'es' ? '💥 ¡Error 500!' : '💥 Erro 500!')}
                            </span>
                            <button onClick={() => setActiveGame(null)} className="text-red-400 hover:underline text-[10px]">
                                {lang === 'en' ? 'Exit' : lang === 'es' ? 'Salir' : 'Sair'}
                            </button>
                        </div>

                        <div className="grid grid-cols-6 gap-1.5 bg-black/50 p-2.5 rounded border border-white/10">
                            {bugGrid.map((row, r) =>
                                row.map((cell, c) => {
                                    return (
                                        <button
                                            key={`${r}-${c}`}
                                            onClick={() => handleBugClick(r, c)}
                                            className={`w-9 h-9 rounded text-xs font-bold transition-all flex items-center justify-center border ${
                                                cell.revealed
                                                    ? cell.isBug
                                                        ? 'bg-red-900/80 border-red-500 text-red-200 animate-bounce'
                                                        : 'bg-green-950/40 border-green-700/40 text-green-300'
                                                    : 'bg-white/5 border-white/15 hover:border-accent hover:bg-accent/10 text-gray-400'
                                            }`}
                                        >
                                            {cell.revealed ? (cell.isBug ? '🐛' : cell.count > 0 ? cell.count : '✓') : '?'}
                                        </button>
                                    );
                                })
                            )}
                        </div>

                        {bugState !== 'PLAYING' && (
                            <div className="text-center space-y-1">
                                <div className={bugState === 'WON' ? 'text-green-400 font-bold text-xs' : 'text-red-400 font-bold text-xs'}>
                                    {bugState === 'WON' 
                                        ? (lang === 'en' ? '🎉 CONGRATS! All test flows passed without bugs!' : lang === 'es' ? '🎉 ¡FELICIDADES! ¡Todos los flujos pasaron sin bugs!' : '🎉 PARABÉNS! Todos os fluxos validados sem bugs!')
                                        : (lang === 'en' ? '💥 CRASH! You triggered a critical production bug!' : lang === 'es' ? '💥 ¡CRASH! ¡Encontraste un Bug crítico en producción!' : '💥 CRASH! Você encontrou um Bug crítico em produção!')}
                                </div>
                                <div className="flex gap-2 justify-center">
                                    <button onClick={initBugHunter} className="px-3 py-1 bg-accent text-darker font-bold text-[10px] rounded hover:bg-accent-hover">
                                        {lang === 'en' ? 'Test Again' : lang === 'es' ? 'Probar de Nuevo' : 'Testar Novamente'}
                                    </button>
                                    <button onClick={() => setActiveGame(null)} className="px-3 py-1 border border-white/20 text-gray-300 text-[10px] rounded hover:bg-white/10">
                                        {lang === 'en' ? 'Return' : lang === 'es' ? 'Volver' : 'Voltar'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── JOGO 3: TRIVIA QUIZ ── */}
                {activeGame === 'trivia' && currentQuestions[triviaIdx] && (
                    <div className="space-y-3 py-1">
                        <div className="flex items-center justify-between text-xs border-b border-white/10 pb-1.5">
                            <span className="text-accent font-bold">🧠 TECH QUIZ ({triviaIdx + 1}/{currentQuestions.length})</span>
                            <span className="text-gray-300">XP: <strong className="text-accent">{triviaScore * 100}</strong></span>
                            <button onClick={() => setActiveGame(null)} className="text-red-400 hover:underline text-[10px]">
                                {lang === 'en' ? 'Exit' : lang === 'es' ? 'Salir' : 'Sair'}
                            </button>
                        </div>
                        <div className="text-secondary font-bold text-xs">
                            {currentQuestions[triviaIdx].q}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {currentQuestions[triviaIdx].options.map((opt, i) => {
                                const letter = opt[0];
                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleTriviaAnswer(letter)}
                                        className="p-2 text-left bg-black/40 border border-white/10 rounded hover:border-accent hover:bg-accent/10 transition-all text-[11px] text-gray-300 hover:text-white"
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ── JOGO 4: AIM TEST (REFLEXOS) ── */}
                {activeGame === 'aim-test' && (
                    <div className="flex flex-col items-center justify-center space-y-2 py-1 select-none">
                        <div className="w-full flex items-center justify-between text-xs border-b border-white/10 pb-1.5 text-gray-300">
                            <span className="text-accent font-bold">🎯 AIM & REFLEX TEST</span>
                            <span>{lang === 'en' ? 'Hits' : lang === 'es' ? 'Aciertos' : 'Acertos'}: <strong className="text-white">{aimHits}/5</strong></span>
                            {aimBestAvg > 0 && <span>🏆 Best: <strong className="text-yellow-400">{aimBestAvg}ms</strong></span>}
                            <button onClick={() => setActiveGame(null)} className="text-red-400 hover:underline text-[10px]">
                                {lang === 'en' ? 'Exit' : lang === 'es' ? 'Salir' : 'Sair'}
                            </button>
                        </div>
                        <div className="relative w-full h-[150px] bg-black/50 border border-white/10 rounded overflow-hidden">
                            <button
                                onClick={handleAimClick}
                                style={{
                                    top: `${aimTarget.y * 22}px`,
                                    left: `${aimTarget.x * 10}%`,
                                }}
                                className="absolute px-3 py-1.5 bg-accent text-darker font-bold rounded shadow-lg border border-white/30 transform -translate-x-1/2 hover:scale-110 active:scale-95 transition-transform text-xs"
                            >
                                🎯 [ {aimTarget.label} ]
                            </button>
                        </div>
                        <div className="text-[10px] text-gray-400">
                            {lang === 'en' ? 'Click the target as quickly as possible as soon as it appears!' : lang === 'es' ? '¡Haz clic en el objetivo lo más rápido posible en cuanto aparezca!' : 'Clique no alvo o mais rápido possível assim que ele aparecer!'}
                        </div>
                    </div>
                )}

                {/* ── EASTER EGG: MATRIX RAIN ── */}
                {activeGame === 'matrix' && (
                    <div className="relative w-full h-[200px] overflow-hidden rounded">
                        <canvas ref={matrixCanvasRef} className="w-full h-full block" />
                        <div className="absolute top-2 right-2 flex gap-2">
                            <button onClick={() => setActiveGame(null)} className="px-2.5 py-1 bg-black/80 border border-green-500/50 text-green-400 text-[10px] rounded hover:bg-green-500 hover:text-black transition-colors font-bold">
                                {lang === 'en' ? 'ESC / Close Matrix' : lang === 'es' ? 'ESC / Cerrar Matrix' : 'ESC / Fechar Matrix'}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── MODO NORMAL: LINHAS DO TERMINAL ── */}
                {!activeGame && (
                    <div className="space-y-0.5">
                        {lines.map((line, i) => (
                            <div key={i} className={`${line.color || 'text-primary/60'} block whitespace-pre-wrap break-all`}>
                                {line.text || '\u00A0'}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Input line com Shadow / Ghost Text Autocomplete */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-white/5 bg-dark/30 relative">
                <span className="text-accent/70 font-mono text-[12px] shrink-0">{'>'}</span>
                
                <div className="relative flex-1 flex items-center">
                    {/* Shadow / Ghost Text */}
                    {!activeGame && input && (() => {
                        const match = ALL_CMD_STRINGS.find(c => c.startsWith(input.toLowerCase()) && c !== input.toLowerCase());
                        if (match) {
                            return (
                                <div className="absolute inset-0 pointer-events-none font-mono text-[12px] flex items-center select-none overflow-hidden">
                                    <span className="opacity-0 whitespace-pre">{input}</span>
                                    <span className="text-accent/40 whitespace-pre">{match.slice(input.length)}</span>
                                    <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-accent/10 text-accent/60 border border-accent/20 tracking-wider">Tab ⇥</span>
                                </div>
                            );
                        }
                        return null;
                    })()}

                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={onKey}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder={activeGame ? (lang === 'en' ? 'Type "exit" to return to shell...' : lang === 'es' ? 'Escribe "exit" para volver al shell...' : 'Digite "exit" para voltar ao shell...') : 'pedro --games'}
                        className="w-full bg-transparent text-white font-mono text-[12px] outline-none placeholder-primary/25 relative z-10"
                        spellCheck={false}
                        autoComplete="off"
                        aria-label="Terminal interativo"
                    />
                </div>

                <motion.span
                    animate={{ opacity: focused ? [1, 0, 1] : 1 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="inline-block w-[6px] h-[14px] bg-accent/70 rounded-[2px] shrink-0"
                />
            </div>

            {/* Status bar */}
            <div className="flex items-center gap-3 px-4 py-2 border-t border-white/5 bg-dark/40 text-[10px] font-mono text-gray-500 select-none">
                <span className="text-accent/60">⬡ Interactive Shell Arcade</span>
                <span className="hidden sm:inline text-gray-600">|</span>
                <span className="hidden sm:inline text-gray-400">
                    {lang === 'en' ? 'Press Tab to autocomplete' : lang === 'es' ? 'Presiona Tab para autocompletar' : 'Pressione Tab para autocompletar'}
                </span>
                <span className="ml-auto">{visitorCity ? `${visitorCity} → ` : ''}Fortaleza, BR</span>
                <span>UTC-3</span>
            </div>
        </div>
    );
}
