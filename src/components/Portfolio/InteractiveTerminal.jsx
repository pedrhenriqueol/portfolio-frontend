import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { GAMES_INFO, TRIVIA_QUESTIONS } from './TerminalGames';

const COMMANDS = [
    {
        cmd: 'help',
        desc: 'Mostra todos os comandos disponíveis',
        output: () => [
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
        ],
    },
    {
        cmd: 'games',
        desc: 'Lista os minijogos',
        output: () => [
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
        ],
    },
    {
        cmd: 'skills',
        desc: 'Tecnologias',
        output: () => [
            { text: '// Stack tecnológica ⚡', color: 'text-accent' },
            { text: 'backend:   [ Delphi + UniGui, PHP/Laravel, Java, APIs RESTful, RBAC ]', color: 'text-secondary' },
            { text: 'frontend:  [ React, TypeScript, Tailwind CSS, JavaScript ]', color: 'text-secondary' },
            { text: 'database:  [ SQL Server, MySQL, Modelagem Relacional, Otimização N+1 ]', color: 'text-secondary' },
            { text: 'devops:    [ Docker, AWS, Git, GitHub, Railway, Linux ]', color: 'text-secondary' },
            { text: 'qa/testes: [ Postman, Testes de Regressão, Scrum, Validação de Requisitos ]', color: 'text-secondary' },
            { text: 'ai:        [ LLMs Generativos, Prompt Engineering, Workflows Antigravity ]', color: 'text-secondary' },
        ],
    },
    {
        cmd: 'experience',
        desc: 'Trajetória',
        output: () => [
            { text: '// Trajetória profissional 📋', color: 'text-accent' },
            { text: 'SETE Tecnologia  →  Analista de QA / Testes  (Junho 2026 - Presente)', color: 'text-secondary font-bold' },
            { text: '  - Garantia de qualidade em sistemas críticos de logística portuária (ePita)', color: 'text-primary' },
            { text: '  - Validação de APIs REST via Postman e consultas SQL Server (-25% bugs)', color: 'text-primary' },
            { text: '', color: '' },
            { text: 'Qualisoft Sistemas  →  Desenvolvedor Back-End (Ago 2025 - Junho 2026)', color: 'text-secondary font-bold' },
            { text: '  - Otimização crítica de queries SQL Server/MySQL (2s → <500ms)', color: 'text-primary' },
            { text: '  - Manutenção de ERP monolítico Delphi + Plataforma Laravel/React', color: 'text-primary' },
            { text: '  - Automações internas com plataformas low-code e IA Generativa', color: 'text-primary' },
        ],
    },
    {
        cmd: 'contact',
        desc: 'Contato',
        output: () => [
            { text: '// Canais de contato direto 📬', color: 'text-accent' },
            { text: 'email:    pedrohc.forza@gmail.com', color: 'text-secondary' },
            { text: 'github:   github.com/pedrhenriqueol', color: 'text-secondary' },
            { text: 'linkedin: linkedin.com/in/pedro-henrique-b0a015391', color: 'text-secondary' },
            { text: 'celular:  (85) 98868-7214', color: 'text-secondary' },
            { text: '', color: '' },
            { text: '→ Respondo rapidamente para oportunidades e parcerias. ✓', color: 'text-accent' },
        ],
    },
    {
        cmd: 'status',
        desc: 'Disponibilidade',
        output: () => {
            const now = new Date();
            const hour = now.getHours();
            const available = hour >= 8 && hour < 23;
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

const INIT_LINES = [
    { text: 'Pedro Henrique — Terminal Interativo v2.0 [Arcade Edition 🕹️]', color: 'text-secondary font-bold' },
    { text: 'Digite "pedro --help" para ver comandos ou "pedro --games" para jogar!', color: 'text-primary/70' },
];

export default function InteractiveTerminal() {
    const { t } = useLanguage();
    const [lines, setLines] = useState(INIT_LINES);
    const [input, setInput] = useState('');
    const [focused, setFocused] = useState(false);
    const [history, setHistory] = useState([]);
    const [histIdx, setHistIdx] = useState(-1);
    const [activeGame, setActiveGame] = useState(null); // 'snake' | 'bug-hunter' | 'trivia' | 'aim-test' | 'matrix' | null
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    // ── Snake Game State ──
    const [snake, setSnake] = useState([[5, 5], [5, 4], [5, 3]]);
    const [food, setFood] = useState([8, 12]);
    const [foodLabel, setFoodLabel] = useState('React');
    const [snakeDir, setSnakeDir] = useState('RIGHT');
    const [snakeScore, setSnakeScore] = useState(0);
    const [snakeGameOver, setSnakeGameOver] = useState(false);
    const snakeDirRef = useRef('RIGHT');
    snakeDirRef.current = snakeDir;

    // ── Bug Hunter State (Minesweeper QA) ──
    const [bugGrid, setBugGrid] = useState([]);
    const [bugFlags, setBugFlags] = useState(0);
    const [bugState, setBugState] = useState('PLAYING'); // 'PLAYING' | 'WON' | 'LOST'

    // ── Trivia Quiz State ──
    const [triviaIdx, setTriviaIdx] = useState(0);
    const [triviaScore, setTriviaScore] = useState(0);

    // ── Aim Test State ──
    const [aimTarget, setAimTarget] = useState({ x: 5, y: 3, label: '01' });
    const [aimStartTime, setAimStartTime] = useState(0);
    const [aimScores, setAimScores] = useState([]);
    const [aimHits, setAimHits] = useState(0);

    // ── Matrix Effect State ──
    const matrixCanvasRef = useRef(null);

    useEffect(() => {
        if (!activeGame) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
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
        // Count neighbors
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (grid[r][c].isBug) continue;
                let cnt = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr;
                        const nc = c + dc;
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc].isBug) {
                            cnt++;
                        }
                    }
                }
                grid[r][c].count = cnt;
            }
        }
        setBugGrid(grid);
        setBugFlags(0);
        setBugState('PLAYING');
    }, []);

    // ── Iniciar Snake ──
    const initSnake = useCallback(() => {
        setSnake([[5, 5], [5, 4], [5, 3]]);
        setFood([Math.floor(Math.random() * 8) + 1, Math.floor(Math.random() * 16) + 1]);
        const stacks = ['React', 'Laravel', 'Delphi', 'SQL', 'Postman', 'Docker', 'TypeScript'];
        setFoodLabel(stacks[Math.floor(Math.random() * stacks.length)]);
        setSnakeDir('RIGHT');
        snakeDirRef.current = 'RIGHT';
        setSnakeScore(0);
        setSnakeGameOver(false);
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

                // Wall bounds: 10 rows x 20 cols
                if (newHead[0] < 0 || newHead[0] >= 10 || newHead[1] < 0 || newHead[1] >= 20) {
                    setSnakeGameOver(true);
                    return prevSnake;
                }
                // Self collision
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

        // Se estiver em jogo e digitar exit ou quit
        if (trimmed.toLowerCase() === 'exit' || trimmed.toLowerCase() === 'quit') {
            setActiveGame(null);
            setLines(prev => [
                ...prev,
                { text: `> ${trimmed}`, color: 'text-accent/80' },
                { text: 'Saindo do jogo... Retornando ao shell principal.', color: 'text-primary/70' },
                { text: '', color: '' },
            ]);
            setInput('');
            return;
        }

        // Comandos de Jogos
        if (trimmed.toLowerCase() === 'pedro --games' || trimmed.toLowerCase() === 'pedro-games' || trimmed.toLowerCase() === 'games') {
            const out = COMMANDS.find(c => c.cmd === 'games').output();
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
            setLines(INIT_LINES);
            setInput('');
            return;
        }

        const newLines = [
            ...lines,
            { text: `> ${trimmed}`, color: 'text-accent/80' },
        ];

        const cmdKey = trimmed.replace('pedro --', '').replace('pedro-', '').toLowerCase();
        const found = COMMANDS.find(c => c.cmd === cmdKey || trimmed === `pedro --${c.cmd}`);

        if (found) {
            const out = found.output(t);
            setLines([...newLines, ...out, { text: '', color: '' }]);
        } else {
            setLines([
                ...newLines,
                { text: `Comando desconhecido: "${trimmed}". Digite "pedro --help" ou "pedro --games".`, color: 'text-red-400/70' },
                { text: '', color: '' },
            ]);
        }
        setInput('');
    }, [lines, t, initSnake, initBugHunter, initAimTest]);

    // ── Resposta de Trivia ──
    const handleTriviaAnswer = (choice) => {
        const current = TRIVIA_QUESTIONS[triviaIdx];
        const isCorrect = choice === current.answer;
        const nextScore = isCorrect ? triviaScore + 1 : triviaScore;
        setTriviaScore(nextScore);

        setLines(prev => [
            ...prev,
            { text: `Quiz: ${current.q}`, color: 'text-secondary font-bold' },
            { text: `Sua resposta: [${choice}] -> ${isCorrect ? '✅ CORRETO! +100 XP' : `❌ INCORRETO (Resposta certa: ${current.answer})`}`, color: isCorrect ? 'text-green-400 font-bold' : 'text-red-400' },
            { text: `💡 Explicação: ${current.explanation}`, color: 'text-primary/70' },
            { text: '', color: '' }
        ]);

        if (triviaIdx + 1 < TRIVIA_QUESTIONS.length) {
            setTriviaIdx(i => i + 1);
        } else {
            setLines(prev => [
                ...prev,
                { text: `🏆 FIM DO QUIZ TÉCNICO! Pontuação final: ${nextScore} / ${TRIVIA_QUESTIONS.length} (${Math.round((nextScore / TRIVIA_QUESTIONS.length) * 100)}%)`, color: 'text-accent font-bold text-sm' },
                { text: nextScore === 4 ? '⭐⭐⭐ Nível Sênior em Arquitetura & QA atingido!' : 'Bom jogo! Continue praticando os conceitos.', color: 'text-secondary' },
                { text: 'Digite "pedro --games" para jogar outros minijogos.', color: 'text-primary/60' },
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
            // Estourou Erro 500
            newGrid.forEach(row => row.forEach(c => { if (c.isBug) c.revealed = true; }));
            setBugGrid(newGrid);
            setBugState('LOST');
            return;
        }

        newGrid[r][c].revealed = true;
        setBugGrid(newGrid);

        // Check Win
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
            setLines(prev => [
                ...prev,
                { text: `🎯 TESTE DE REFLEXOS CONCLUÍDO! (5 Alvos)`, color: 'text-accent font-bold' },
                { text: `⚡ Tempo médio de resposta: ${avg}ms`, color: 'text-green-400 font-bold' },
                { text: avg < 300 ? '🚀 Reflexos de Cyberpunk / QA em tempo real!' : '👍 Ótimo tempo de reação!', color: 'text-secondary' },
                { text: 'Digite "pedro --games" para outros jogos.', color: 'text-primary/60' },
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

        if (e.key === 'Enter') { runCommand(input); }
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
                <span className="w-3 h-3 rounded-full bg-red-500/60 hover:bg-red-500 transition-colors cursor-pointer" title="Fechar/Reset" onClick={(e) => { e.stopPropagation(); setActiveGame(null); setLines(INIT_LINES); }} />
                <span className="w-3 h-3 rounded-full bg-yellow-500/40 hover:bg-yellow-500/70 transition-colors cursor-pointer" title="Minimizar" />
                <span className="w-3 h-3 rounded-full bg-green-500/40 hover:bg-green-500/70 transition-colors cursor-pointer" title="Maximizar" />
                <span className="ml-2 text-xs text-gray-400 font-mono">pedro@portfolio: ~ {activeGame ? `[GAME: ${activeGame.toUpperCase()}]` : ''}</span>
                <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-accent inline-block"
                />
                <span className="text-accent/70 text-xs font-mono ml-1">{activeGame ? 'playing' : 'live'}</span>
            </div>

            {/* Content Area */}
            <div className="p-4 font-mono text-[12px] leading-relaxed min-h-[240px] max-h-[300px] overflow-y-auto relative">
                
                {/* ── JOGO 1: SNAKE GAME ── */}
                {activeGame === 'snake' && (
                    <div className="flex flex-col items-center justify-center space-y-2 py-1">
                        <div className="w-full flex items-center justify-between text-xs border-b border-white/10 pb-1.5 text-gray-300">
                            <span className="text-accent font-bold">🐍 SNAKE ASCII</span>
                            <span>Score: <strong className="text-white">{snakeScore}</strong></span>
                            <span>Item: <strong className="text-accent">{foodLabel}</strong></span>
                            <button onClick={() => setActiveGame(null)} className="text-red-400 hover:underline text-[10px]">ESC / Sair</button>
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
                                <div className="text-red-400 font-bold text-xs">💥 GAME OVER! Colisão detectada.</div>
                                <div className="flex gap-2 justify-center">
                                    <button onClick={initSnake} className="px-3 py-1 bg-accent text-darker font-bold text-[10px] rounded hover:bg-accent-hover">Jogar de Novo</button>
                                    <button onClick={() => setActiveGame(null)} className="px-3 py-1 border border-white/20 text-gray-300 text-[10px] rounded hover:bg-white/10">Voltar ao Terminal</button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-[10px] text-gray-400 text-center">
                                Use as teclas <strong className="text-white">WASD</strong> ou as <strong className="text-white">Setas</strong> para controlar.
                            </div>
                        )}
                    </div>
                )}

                {/* ── JOGO 2: BUG HUNTER (QA MINESWEEPER) ── */}
                {activeGame === 'bug-hunter' && (
                    <div className="flex flex-col items-center justify-center space-y-2 py-1">
                        <div className="w-full flex items-center justify-between text-xs border-b border-white/10 pb-1.5 text-gray-300">
                            <span className="text-accent font-bold">🐛 QA BUG HUNTER</span>
                            <span>Status: {bugState === 'PLAYING' ? '🔍 Testando...' : bugState === 'WON' ? '🏆 100% Passou!' : '💥 Erro 500!'}</span>
                            <button onClick={() => setActiveGame(null)} className="text-red-400 hover:underline text-[10px]">Sair</button>
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
                                    {bugState === 'WON' ? '🎉 PARABÉNS! Todos os fluxos validados sem bugs!' : '💥 CRASH! Você encontrou um Bug crítico em produção!'}
                                </div>
                                <div className="flex gap-2 justify-center">
                                    <button onClick={initBugHunter} className="px-3 py-1 bg-accent text-darker font-bold text-[10px] rounded hover:bg-accent-hover">Testar Novamente</button>
                                    <button onClick={() => setActiveGame(null)} className="px-3 py-1 border border-white/20 text-gray-300 text-[10px] rounded hover:bg-white/10">Voltar</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── JOGO 3: TRIVIA QUIZ ── */}
                {activeGame === 'trivia' && (
                    <div className="space-y-3 py-1">
                        <div className="flex items-center justify-between text-xs border-b border-white/10 pb-1.5">
                            <span className="text-accent font-bold">🧠 TECH QUIZ ({triviaIdx + 1}/4)</span>
                            <span className="text-gray-300">XP: <strong className="text-accent">{triviaScore * 100}</strong></span>
                            <button onClick={() => setActiveGame(null)} className="text-red-400 hover:underline text-[10px]">Sair</button>
                        </div>
                        <div className="text-secondary font-bold text-xs">
                            {TRIVIA_QUESTIONS[triviaIdx].q}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {TRIVIA_QUESTIONS[triviaIdx].options.map((opt, i) => {
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
                            <span>Acertos: <strong className="text-white">{aimHits}/5</strong></span>
                            <button onClick={() => setActiveGame(null)} className="text-red-400 hover:underline text-[10px]">Sair</button>
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
                            Clique no alvo o mais rápido possível assim que ele aparecer!
                        </div>
                    </div>
                )}

                {/* ── EASTER EGG: MATRIX RAIN ── */}
                {activeGame === 'matrix' && (
                    <div className="relative w-full h-[200px] overflow-hidden rounded">
                        <canvas ref={matrixCanvasRef} className="w-full h-full block" />
                        <div className="absolute top-2 right-2 flex gap-2">
                            <button onClick={() => setActiveGame(null)} className="px-2.5 py-1 bg-black/80 border border-green-500/50 text-green-400 text-[10px] rounded hover:bg-green-500 hover:text-black transition-colors font-bold">
                                ESC / Fechar Matrix
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
                        <div ref={bottomRef} />
                    </div>
                )}
            </div>

            {/* Input line */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-white/5 bg-dark/30">
                <span className="text-accent/70 font-mono text-[12px] shrink-0">{'>'}</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={onKey}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={activeGame ? 'Digite "exit" para voltar ao shell...' : 'pedro --games'}
                    className="flex-1 bg-transparent text-white font-mono text-[12px] outline-none placeholder-primary/25"
                    spellCheck={false}
                    autoComplete="off"
                    aria-label="Terminal interativo"
                />
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
                <span className="hidden sm:inline text-gray-400">Atalhos: pedro --games</span>
                <span className="ml-auto">Fortaleza, BR</span>
                <span>UTC-3</span>
            </div>
        </div>
    );
}
