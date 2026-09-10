import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import SnakeGame from './Terminal/games/SnakeGame';
import BugHunterGame from './Terminal/games/BugHunterGame';
import TriviaGame from './Terminal/games/TriviaGame';
import AimTestGame from './Terminal/games/AimTestGame';
import MatrixRain from './Terminal/effects/MatrixRain';
import { ALL_CMD_STRINGS, getWelcomeLines, useTerminalCommands } from './Terminal/useTerminalCommands';

export interface TerminalLine {
    id?: string;
    text: string;
    color?: string;
    node?: React.ReactNode;
    isStreaming?: boolean;
}

export type ActiveTerminalGame = 'snake' | 'bug-hunter' | 'trivia' | 'aim-test' | 'matrix' | null;

interface SimulationStep {
    delay: number;
    line: TerminalLine;
}

/** Renderizador formatado de respostas de IA estilo terminal com destaque para tokens entre crases */
function FormattedCopilotResponse({ text, isStreaming }: { text: string; isStreaming?: boolean }) {
    const parts = text.split(/(`[^`]+`)/g);
    return (
        <div className="text-neutral-300 font-mono text-[11px] sm:text-[12px] leading-relaxed whitespace-pre-wrap break-words">
            {parts.map((part, idx) => {
                if (part.startsWith('`') && part.endsWith('`') && part.length > 1) {
                    const code = part.slice(1, -1);
                    return (
                        <span key={idx} className="text-white font-semibold bg-white/10 px-1 py-0.5 rounded border border-white/15 mx-0.5 font-mono">
                            {code}
                        </span>
                    );
                }
                return <span key={idx}>{part}</span>;
            })}
            {isStreaming && (
                <span className="inline-block text-cyan-400 font-bold ml-1 animate-pulse">▍</span>
            )}
        </div>
    );
}

/** Gera os passos com simulação de latência para a bateria de testes automatizados (QA) */
function getTestSimulationSteps(lang: string): SimulationStep[] {
    const isEn = lang === 'en';
    const isEs = lang === 'es';

    const initText = isEn
        ? '> INITIALIZING HOMOLOGATION TEST ENVIRONMENT...'
        : isEs
        ? '> INICIANDO AMBIENTE DE HOMOLOGACIÓN...'
        : '> INICIANDO AMBIENTE DE HOMOLOGAÇÃO...';

    const resultText = isEn
        ? 'RESULT: 4 PASSED, 0 FAILED | COVERAGE: 100% | STATUS: ZERO REGRESSIONS'
        : isEs
        ? 'RESULTADO: 4 PASÓ, 0 FALLÓ | COBERTURA: 100% | ESTADO: CERO REGRESIONES'
        : 'RESULTADO: 4 PASSOU, 0 FALHOU | COBERTURA: 100% | STATUS: ZERO REGRESSÕES';

    return [
        {
            delay: 0,
            line: {
                text: initText,
                node: (
                    <div className="text-accent font-bold flex items-center gap-2 font-mono">
                        <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span>{initText}</span>
                    </div>
                ),
            },
        },
        {
            delay: 80,
            line: {
                text: '[RUN] GET  /api/v1/healthcheck       -> 200 OK (12ms) [PASS]',
                node: (
                    <div className="flex flex-wrap items-center gap-x-2 font-mono text-[11px] sm:text-[12px]">
                        <span className="text-gray-400 font-semibold">[RUN]</span>
                        <span className="text-cyan-400 font-bold">GET</span>
                        <span className="text-gray-200">/api/v1/healthcheck</span>
                        <span className="text-gray-500">{'->'}</span>
                        <span className="text-emerald-400 font-semibold">200 OK</span>
                        <span className="text-amber-300 font-mono">(12ms)</span>
                        <span className="text-emerald-400 font-bold">[PASS]</span>
                    </div>
                ),
            },
        },
        {
            delay: 160,
            line: {
                text: '[RUN] POST /api/v1/auth/session      -> 200 OK (22ms) [PASS]',
                node: (
                    <div className="flex flex-wrap items-center gap-x-2 font-mono text-[11px] sm:text-[12px]">
                        <span className="text-gray-400 font-semibold">[RUN]</span>
                        <span className="text-blue-400 font-bold">POST</span>
                        <span className="text-gray-200">/api/v1/auth/session</span>
                        <span className="text-gray-500">{'->'}</span>
                        <span className="text-emerald-400 font-semibold">200 OK</span>
                        <span className="text-amber-300 font-mono">(22ms)</span>
                        <span className="text-emerald-400 font-bold">[PASS]</span>
                    </div>
                ),
            },
        },
        {
            delay: 240,
            line: {
                text: '[RUN] POST /api/v1/transacoes/validar -> 201 CREATED (34ms) [PASS]',
                node: (
                    <div className="flex flex-wrap items-center gap-x-2 font-mono text-[11px] sm:text-[12px]">
                        <span className="text-gray-400 font-semibold">[RUN]</span>
                        <span className="text-blue-400 font-bold">POST</span>
                        <span className="text-gray-200">/api/v1/transacoes/validar</span>
                        <span className="text-gray-500">{'->'}</span>
                        <span className="text-emerald-400 font-semibold">201 CREATED</span>
                        <span className="text-amber-300 font-mono">(34ms)</span>
                        <span className="text-emerald-400 font-bold">[PASS]</span>
                    </div>
                ),
            },
        },
        {
            delay: 320,
            line: {
                text: '[RUN] GET  /api/v1/zpe/portlog/status -> 200 OK (18ms) [PASS]',
                node: (
                    <div className="flex flex-wrap items-center gap-x-2 font-mono text-[11px] sm:text-[12px]">
                        <span className="text-gray-400 font-semibold">[RUN]</span>
                        <span className="text-cyan-400 font-bold">GET</span>
                        <span className="text-gray-200">/api/v1/zpe/portlog/status</span>
                        <span className="text-gray-500">{'->'}</span>
                        <span className="text-emerald-400 font-semibold">200 OK</span>
                        <span className="text-amber-300 font-mono">(18ms)</span>
                        <span className="text-emerald-400 font-bold">[PASS]</span>
                    </div>
                ),
            },
        },
        {
            delay: 400,
            line: {
                text: resultText,
                node: (
                    <div className="font-mono text-emerald-400 font-bold flex items-center gap-1.5 mt-1">
                        <span>✔</span>
                        <span>{resultText}</span>
                    </div>
                ),
            },
        },
        {
            delay: 450,
            line: { text: '', color: '' },
        },
    ];
}

/** Gera os passos com simulação de latência para a otimização de queries (SQL Tuning) */
function getSqlSimulationSteps(lang: string): SimulationStep[] {
    const isEn = lang === 'en';
    const isEs = lang === 'es';

    const q1 = isEn
        ? '> ANALYZING EXECUTION PLAN: SELECT * FROM Transacoes WHERE EmpresaId = 10...'
        : isEs
        ? '> ANALIZANDO PLANO DE EJECUCIÓN: SELECT * FROM Transacoes WHERE EmpresaId = 10...'
        : '> ANALISANDO PLANO DE EXECUÇÃO: SELECT * FROM Transacoes WHERE EmpresaId = 10...';

    const q2 = isEn
        ? '[ALERT] Table Scan identified: 2.140ms latency in production.'
        : isEs
        ? '[ALERTA] Table Scan identificado: 2.140ms de latencia en producción.'
        : '[ALERTA] Table Scan identificado: 2.140ms de latência em produção.';

    const q3 = isEn
        ? '[ACTION] Injecting composite index: CREATE NONCLUSTERED INDEX idx_empresa_data...'
        : isEs
        ? '[ACCIÓN] Inyectando índice compuesto: CREATE NONCLUSTERED INDEX idx_empresa_data...'
        : '[AÇÃO] Injetando índice composto: CREATE NONCLUSTERED INDEX idx_empresa_data...';

    const q4 = isEn
        ? '✔ Index Seek applied with success. Query refactored.'
        : isEs
        ? '✔ Index Seek aplicado con éxito. Consulta refactorizada.'
        : '✔ Index Seek aplicado com sucesso. Query refatorada.';

    return [
        {
            delay: 0,
            line: {
                text: q1,
                node: (
                    <div className="font-mono text-gray-200">
                        <span className="text-accent font-bold">
                            {isEn ? '> ANALYZING EXECUTION PLAN: ' : isEs ? '> ANALIZANDO PLANO DE EJECUCIÓN: ' : '> ANALISANDO PLANO DE EXECUÇÃO: '}
                        </span>
                        <span className="text-white font-semibold">SELECT * FROM Transacoes WHERE EmpresaId = 10...</span>
                    </div>
                ),
            },
        },
        {
            delay: 90,
            line: {
                text: q2,
                node: (
                    <div className="font-mono">
                        <span className="text-amber-400 font-bold">{isEn ? '[ALERT] ' : '[ALERTA] '}</span>
                        <span className="text-gray-300">
                            {isEn ? 'Table Scan identified: ' : isEs ? 'Table Scan identificado: ' : 'Table Scan identificado: '}
                        </span>
                        <span className="text-amber-400 font-mono font-bold">2.140ms</span>
                        <span className="text-gray-400">
                            {isEn ? ' latency in production.' : isEs ? ' de latencia en producción.' : ' de latência em produção.'}
                        </span>
                    </div>
                ),
            },
        },
        {
            delay: 180,
            line: {
                text: q3,
                node: (
                    <div className="font-mono">
                        <span className="text-cyan-400 font-bold">{isEn ? '[ACTION] ' : isEs ? '[ACCIÓN] ' : '[AÇÃO] '}</span>
                        <span className="text-gray-300">
                            {isEn ? 'Injecting composite index: ' : isEs ? 'Inyectando índice compuesto: ' : 'Injetando índice composto: '}
                        </span>
                        <span className="text-emerald-300 font-mono font-semibold">CREATE NONCLUSTERED INDEX idx_empresa_data...</span>
                    </div>
                ),
            },
        },
        {
            delay: 270,
            line: {
                text: q4,
                node: (
                    <div className="font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                        <span className="text-emerald-400 font-bold">✔</span>
                        <span>{q4.replace('✔ ', '')}</span>
                    </div>
                ),
            },
        },
        {
            delay: 360,
            line: {
                text: q5,
                node: (
                    <div className="font-mono">
                        <span className="text-secondary font-bold">
                            {isEn ? 'FINAL EXECUTION TIME: ' : isEs ? 'TIEMPO DE EJECUCIÓN FINAL: ' : 'TEMPO DE EXECUÇÃO FINAL: '}
                        </span>
                        <span className="text-emerald-400 font-bold">19ms</span>
                        <span className="text-cyan-400 font-semibold">
                            {isEn ? ' (Optimization: -99.1%)' : isEs ? ' (Optimización: -99.1%)' : ' (Otimização: -99.1%)'}
                        </span>
                    </div>
                ),
            },
        },
        {
            delay: 420,
            line: { text: '', color: '' },
        },
    ];
}

const q5 = 'FINAL EXECUTION TIME: 19ms (Optimization: -99.1%)';

export const InteractiveTerminal: React.FC = () => {
    const { lang } = useLanguage();
    const [lines, setLines] = useState<TerminalLine[]>(() => getWelcomeLines(lang));
    const [input, setInput] = useState('');
    const [focused, setFocused] = useState(false);
    const [history, setHistory] = useState<string[]>([]);
    const [histIdx, setHistIdx] = useState(-1);
    const [activeGame, setActiveGame] = useState<ActiveTerminalGame>(null);
    const [visitorCity, setVisitorCity] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);

    const contentRef = useRef<HTMLDivElement>(null);
    const terminalEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const hasFetchedCity = useRef(false);
    const activeTimersRef = useRef<number[]>([]);
    const abortControllerRef = useRef<AbortController | null>(null);

    const { execute } = useTerminalCommands(lang);

    /** Limpa com segurança todos os temporizadores assíncronos em andamento */
    const clearAllTimers = useCallback(() => {
        activeTimersRef.current.forEach(timerId => window.clearTimeout(timerId));
        activeTimersRef.current = [];
    }, []);

    // Higiene de desmontagem: cancela qualquer timer ativo ou stream em andamento
    useEffect(() => {
        return () => {
            clearAllTimers();
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
        };
    }, [clearAllTimers]);

    // Reseta boas-vindas ao trocar de idioma caso não haja jogo ou stream ativo
    useEffect(() => {
        if (!activeGame && !isStreaming) {
            clearAllTimers();
            setLines(getWelcomeLines(lang));
        }
    }, [lang, activeGame, isStreaming, clearAllTimers]);

    // Localização do visitante via IP-API executado com cache de sessão
    useEffect(() => {
        if (hasFetchedCity.current) return;
        hasFetchedCity.current = true;

        const cached = sessionStorage.getItem('portfolio_visitor_city');
        if (cached) {
            setVisitorCity(cached);
            return;
        }

        fetch('https://ipapi.co/json/')
            .then(r => r.json())
            .then(data => {
                if (data.city) {
                    const cityStr = `${data.city}, ${data.country_code || data.country_name}`;
                    setVisitorCity(cityStr);
                    sessionStorage.setItem('portfolio_visitor_city', cityStr);
                }
            })
            .catch(() => {});
    }, []);

    // Auto-scroll suave para o final do terminal ao adicionar linhas
    useEffect(() => {
        if (!activeGame) {
            terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            if (contentRef.current) {
                contentRef.current.scrollTop = contentRef.current.scrollHeight;
            }
        }
    }, [lines, activeGame]);

    /** Executa a simulação escalonada de testes ou queries sem bloquear a thread principal */
    const runSimulation = useCallback((type: 'test' | 'sql', commandRaw: string) => {
        clearAllTimers();

        // Eco do comando digitado
        setLines(prev => [
            ...prev,
            { text: `pedro@workstation:~$ ${commandRaw}`, color: 'text-cyan-400/90 font-semibold' },
        ]);

        const steps = type === 'test' ? getTestSimulationSteps(lang) : getSqlSimulationSteps(lang);

        steps.forEach(step => {
            const timerId = window.setTimeout(() => {
                setLines(prev => [...prev, step.line]);
                terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                if (contentRef.current) {
                    contentRef.current.scrollTop = contentRef.current.scrollHeight;
                }
                activeTimersRef.current = activeTimersRef.current.filter(id => id !== timerId);
            }, step.delay);

            activeTimersRef.current.push(timerId);
        });
    }, [lang, clearAllTimers]);

    /** Streaming assíncrono com o Copilot Técnico via rota segura /api/chat */
    const handleAskCopilot = useCallback(async (question: string) => {
        const cleanQuestion = question.trim();
        if (!cleanQuestion) return;

        // Cancela requisições anteriores ativas
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;
        setIsStreaming(true);

        const streamLineId = `copilot-${Date.now()}`;

        // Eco do comando digitado e badge do Copilot
        setLines(prev => [
            ...prev,
            {
                text: `pedro@workstation:~$ ${cleanQuestion}`,
                color: 'text-cyan-400/90 font-semibold',
                node: (
                    <div className="font-mono text-xs sm:text-sm font-semibold flex items-center gap-1.5">
                        <span className="text-cyan-400">pedro@workstation:~$</span>
                        <span className="text-white">{cleanQuestion}</span>
                    </div>
                ),
            },
            {
                text: '[COPILOT // AGENTE TÉCNICO]',
                node: (
                    <div className="text-cyan-400 font-mono text-xs font-semibold flex items-center gap-2 mt-1 mb-0.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse inline-block" />
                        <span>[COPILOT // AGENTE TÉCNICO]</span>
                    </div>
                ),
            },
            {
                id: streamLineId,
                text: '',
                isStreaming: true,
                node: <FormattedCopilotResponse text="" isStreaming={true} />,
            },
        ]);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: cleanQuestion }),
                signal: controller.signal,
            });

            if (!response.ok || !response.body) {
                throw new Error(`API_ERROR_${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const textChunk = decoder.decode(value, { stream: true });
                accumulatedText += textChunk;

                setLines(prev =>
                    prev.map(l =>
                        l.id === streamLineId
                            ? {
                                  ...l,
                                  text: accumulatedText,
                                  node: <FormattedCopilotResponse text={accumulatedText} isStreaming={true} />,
                              }
                            : l
                    )
                );

                terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                if (contentRef.current) {
                    contentRef.current.scrollTop = contentRef.current.scrollHeight;
                }
            }

            // Finaliza o streaming removendo o cursor pulsante
            setLines(prev => [
                ...prev.map(l =>
                    l.id === streamLineId
                        ? {
                              ...l,
                              text: accumulatedText,
                              isStreaming: false,
                              node: <FormattedCopilotResponse text={accumulatedText} isStreaming={false} />,
                          }
                        : l
                ),
                { text: '', color: '' },
            ]);
        } catch (err: any) {
            if (err.name === 'AbortError') {
                setLines(prev => [
                    ...prev.map(l => (l.id === streamLineId ? { ...l, isStreaming: false, node: <FormattedCopilotResponse text={l.text} isStreaming={false} /> } : l)),
                    {
                        text: '^C [OPERAÇÃO CANCELADA PELO USUÁRIO]',
                        color: 'text-red-400 font-mono text-xs',
                    },
                    { text: '', color: '' },
                ]);
            } else {
                // Tratamento de falhas ou ausência de chave (Modo Offline gracioso)
                setLines(prev => [
                    ...prev.filter(l => l.id !== streamLineId),
                    {
                        text: "[INFO] Modo offline. Digite 'help' para listar os comandos integrados do sistema.",
                        color: 'text-amber-400/90 font-mono text-xs',
                    },
                    { text: '', color: '' },
                ]);
            }
        } finally {
            setIsStreaming(false);
            if (abortControllerRef.current === controller) {
                abortControllerRef.current = null;
            }
        }
    }, []);

    /** Manipula a submissão de comandos no prompt */
    const handleRunCommand = useCallback((raw: string) => {
        const trimmed = raw.trim();
        if (!trimmed) return;

        setHistory(h => [trimmed, ...h]);
        setHistIdx(-1);
        setInput('');

        execute(trimmed, {
            onLaunchGame: (game: ActiveTerminalGame) => {
                clearAllTimers();
                if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                    abortControllerRef.current = null;
                }
                setIsStreaming(false);
                setActiveGame(game);
            },
            onClear: () => {
                clearAllTimers();
                if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                    abortControllerRef.current = null;
                }
                setIsStreaming(false);
                setLines(getWelcomeLines(lang));
            },
            setLines,
            runSimulation,
            onFallbackToAI: handleAskCopilot,
        });
    }, [execute, lang, clearAllTimers, runSimulation, handleAskCopilot]);

    // Listener de eventos customizados para foco global do terminal
    useEffect(() => {
        const handleCustomEvent = (e: CustomEvent<{ command?: string }>) => {
            if (e.detail?.command) {
                handleRunCommand(e.detail.command);
            }
            inputRef.current?.focus();
        };

        window.addEventListener('focus-terminal', handleCustomEvent as EventListener);
        return () => window.removeEventListener('focus-terminal', handleCustomEvent as EventListener);
    }, [handleRunCommand]);

    // Teclas globais de navegação do prompt (Tab, Enter, Up, Down, Ctrl+C)
    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (activeGame) return;

        // Abort de streaming ou limpeza de linha com Ctrl+C
        if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
            e.preventDefault();
            if (isStreaming) {
                abortControllerRef.current?.abort();
                abortControllerRef.current = null;
                setIsStreaming(false);
                return;
            }
            if (input) {
                setLines(prev => [
                    ...prev,
                    { text: `pedro@workstation:~$ ${input} ^C`, color: 'text-gray-500 font-mono text-xs' },
                    { text: '', color: '' },
                ]);
                setInput('');
            }
            return;
        }

        // Bloqueia novos inputs enquanto streaming estiver em andamento
        if (isStreaming) return;

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

        if (e.key === 'Enter') {
            e.preventDefault();
            handleRunCommand(input);
            return;
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const idx = Math.min(histIdx + 1, history.length - 1);
            setHistIdx(idx);
            if (history[idx] !== undefined) setInput(history[idx]);
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const idx = Math.max(histIdx - 1, -1);
            setHistIdx(idx);
            setInput(idx === -1 ? '' : history[idx]);
        }
    };

    /** Sai de qualquer minijogo com segurança */
    const handleExitGame = () => {
        setActiveGame(null);
        setLines(prev => [
            ...prev,
            { text: '> exit', color: 'text-accent/80' },
            {
                text: lang === 'en'
                    ? 'Returned to main shell.'
                    : lang === 'es'
                    ? 'Regresado al shell principal.'
                    : 'Retornado ao shell principal.',
                color: 'text-primary/70',
            },
            { text: '', color: '' },
        ]);
    };

    return (
        <div
            data-no-morph="true"
            className={`relative bg-gradient-to-b from-white/[0.05] via-[#0d0f14]/98 to-[#0d0f14]/98 border border-white/[0.08] border-t-white/20 rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.7)] transition-all duration-300 ${
                focused ? 'border-accent/50 border-t-accent/70 shadow-[0_24px_60px_rgba(0,0,0,0.7),0_0_30px_rgba(var(--color-accent-rgb),0.08)]' : 'hover:border-white/20'
            }`}
            onClick={() => inputRef.current?.focus()}
        >
            {/* Title bar com Controles de Janela */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08] bg-dark/60 select-none">
                <span
                    className="w-3 h-3 rounded-full bg-red-500/60 hover:bg-red-500 transition-colors cursor-pointer"
                    title={lang === 'en' ? 'Reset Shell' : lang === 'es' ? 'Reiniciar Shell' : 'Reiniciar Shell'}
                    onClick={(e) => {
                        e.stopPropagation();
                        clearAllTimers();
                        if (abortControllerRef.current) {
                            abortControllerRef.current.abort();
                            abortControllerRef.current = null;
                        }
                        setIsStreaming(false);
                        setActiveGame(null);
                        setLines(getWelcomeLines(lang));
                    }}
                />
                <span className="w-3 h-3 rounded-full bg-yellow-500/40 hover:bg-yellow-500/70 transition-colors cursor-pointer" title="Minimize" />
                <span className="w-3 h-3 rounded-full bg-green-500/40 hover:bg-green-500/70 transition-colors cursor-pointer" title="Maximize" />
                <span className="ml-2 text-xs text-gray-400 font-mono">
                    pedro@portfolio: ~ {activeGame ? `[GAME: ${activeGame.toUpperCase()}]` : isStreaming ? '[COPILOT STREAMING...]' : '[QA & COPILOT SHELL]'}
                </span>
                <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: isStreaming ? 0.6 : 2.5, repeat: Infinity }}
                    className={`ml-auto w-1.5 h-1.5 rounded-full ${isStreaming ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-accent'} inline-block`}
                />
                <span className={`text-xs font-mono ml-1 ${isStreaming ? 'text-cyan-400 font-semibold' : 'text-accent/70'}`}>
                    {activeGame ? 'playing' : isStreaming ? 'copilot active' : 'live'}
                </span>
            </div>

            {/* Área de Saída de Linhas */}
            <div
                ref={contentRef}
                className="p-4 font-mono text-[12px] leading-relaxed min-h-[250px] max-h-[320px] overflow-y-auto relative"
            >
                {activeGame === 'snake' && <SnakeGame lang={lang} onExit={handleExitGame} />}
                {activeGame === 'bug-hunter' && <BugHunterGame lang={lang} onExit={handleExitGame} />}
                {activeGame === 'trivia' && <TriviaGame lang={lang} onExit={handleExitGame} />}
                {activeGame === 'aim-test' && <AimTestGame lang={lang} onExit={handleExitGame} />}
                {activeGame === 'matrix' && <MatrixRain lang={lang} onExit={handleExitGame} />}

                {!activeGame && (
                    <div className="space-y-1">
                        {lines.map((line, i) => (
                            <div key={i} className={`${line.color || 'text-primary/60'} block whitespace-pre-wrap break-all leading-relaxed`}>
                                {line.node ? line.node : (line.text || '\u00A0')}
                            </div>
                        ))}
                        {/* Âncora invisível para auto-scroll automático */}
                        <div ref={terminalEndRef} />
                    </div>
                )}
            </div>

            {/* Input Line com Prompt pedro@workstation:~$ */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-white/5 bg-dark/30 relative">
                <span className="text-cyan-400 font-mono text-[11px] sm:text-[12px] font-semibold shrink-0 select-none">
                    pedro@workstation:~$
                </span>

                <div className="relative flex-1 flex items-center">
                    {/* Ghost Text com sugestão do Tab */}
                    {!activeGame && !isStreaming && input && (() => {
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
                        disabled={isStreaming}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={onKeyDown}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder={
                            activeGame
                                ? (lang === 'en' ? 'Type "exit" to return to shell...' : lang === 'es' ? 'Escribe "exit" para volver al shell...' : 'Digite "exit" para voltar ao shell...')
                                : isStreaming
                                ? (lang === 'en' ? 'Copilot streaming response... (Ctrl+C to abort)' : 'Copilot respondendo... (Ctrl+C para cancelar)')
                                : 'test, sql, ai "sua pergunta", help...'
                        }
                        className="w-full bg-transparent text-white font-mono text-[12px] outline-none placeholder-primary/25 relative z-10 disabled:opacity-60"
                        spellCheck={false}
                        autoComplete="off"
                        aria-label="Terminal interativo"
                    />
                </div>

                <motion.span
                    animate={{ opacity: focused ? [1, 0, 1] : 1 }}
                    transition={{ duration: isStreaming ? 0.4 : 1, repeat: Infinity }}
                    className={`inline-block w-[6px] h-[14px] ${isStreaming ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-accent/70'} rounded-[2px] shrink-0`}
                />
            </div>

            {/* Status bar */}
            <div className="flex items-center gap-3 px-4 py-2 border-t border-white/[0.08] bg-dark/40 text-[10px] font-mono text-neutral-400 select-none">
                <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                    <span className="text-xs">🤖</span>
                    <span>Terminal Copilot (Gemini 1.5 Flash)</span>
                </span>
                <span className="hidden sm:inline text-neutral-600">|</span>
                <span className="hidden sm:inline text-neutral-300">
                    {lang === 'en' ? 'Type "test", "sql" or ask any question to AI' : lang === 'es' ? 'Escribe "test", "sql" o pregunta lo que sea a la IA' : 'Digite "test", "sql" ou faça perguntas em linguagem natural'}
                </span>
                <span className="ml-auto">{visitorCity ? `${visitorCity} → ` : ''}Fortaleza, BR</span>
                <span>UTC-3</span>
            </div>
        </div>
    );
};

export default memo(InteractiveTerminal);
