import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import SnakeGame from './Terminal/games/SnakeGame';
import BugHunterGame from './Terminal/games/BugHunterGame';
import TriviaGame from './Terminal/games/TriviaGame';
import AimTestGame from './Terminal/games/AimTestGame';
import MatrixRain from './Terminal/effects/MatrixRain';
import { ALL_CMD_STRINGS, getWelcomeLines, useTerminalCommands } from './Terminal/useTerminalCommands';

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
    const hasFetchedCity = useRef(false);

    const { execute } = useTerminalCommands(lang);

    // Reseta boas-vindas ao trocar idioma se não estiver jogando
    useEffect(() => {
        if (!activeGame) {
            setLines(getWelcomeLines(lang));
        }
    }, [lang, activeGame]);

    // Localização do visitante via IP-API executado rigorosamente UMA ÚNICA VEZ
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

    // Auto-scroll para a base do terminal ao receber novas linhas
    useEffect(() => {
        if (!activeGame && contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
    }, [lines, activeGame]);

    // Execução de comando
    const handleRunCommand = useCallback((raw) => {
        const trimmed = raw.trim();
        if (!trimmed) return;

        setHistory(h => [trimmed, ...h]);
        setHistIdx(-1);
        setInput('');

        execute(trimmed, {
            onLaunchGame: (game) => setActiveGame(game),
            onClear: () => setLines(getWelcomeLines(lang)),
            setLines,
        });
    }, [execute, lang]);

    // Listener de eventos de atalho de terminal
    useEffect(() => {
        const handleCustomEvent = (e) => {
            if (e.detail?.command) {
                handleRunCommand(e.detail.command);
            }
            inputRef.current?.focus();
        };

        window.addEventListener('focus-terminal', handleCustomEvent);
        return () => window.removeEventListener('focus-terminal', handleCustomEvent);
    }, [handleRunCommand]);

    // Teclas globais de navegação do prompt
    const onKeyDown = (e) => {
        if (activeGame) return;

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

    const handleExitGame = () => {
        setActiveGame(null);
        setLines(prev => [
            ...prev,
            { text: '> exit', color: 'text-accent/80' },
            { text: lang === 'en' ? 'Returned to main shell.' : lang === 'es' ? 'Regresado al shell principal.' : 'Retornado ao shell principal.', color: 'text-primary/70' },
            { text: '', color: '' },
        ]);
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
                <span
                    className="w-3 h-3 rounded-full bg-red-500/60 hover:bg-red-500 transition-colors cursor-pointer"
                    title="Reset"
                    onClick={(e) => {
                        e.stopPropagation();
                        setActiveGame(null);
                        setLines(getWelcomeLines(lang));
                    }}
                />
                <span className="w-3 h-3 rounded-full bg-yellow-500/40 hover:bg-yellow-500/70 transition-colors cursor-pointer" title="Minimize" />
                <span className="w-3 h-3 rounded-full bg-green-500/40 hover:bg-green-500/70 transition-colors cursor-pointer" title="Maximize" />
                <span className="ml-2 text-xs text-gray-400 font-mono">
                    pedro@portfolio: ~ {activeGame ? `[GAME: ${activeGame.toUpperCase()}]` : ''}
                </span>
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
                {activeGame === 'snake' && <SnakeGame lang={lang} onExit={handleExitGame} />}
                {activeGame === 'bug-hunter' && <BugHunterGame lang={lang} onExit={handleExitGame} />}
                {activeGame === 'trivia' && <TriviaGame lang={lang} onExit={handleExitGame} />}
                {activeGame === 'aim-test' && <AimTestGame lang={lang} onExit={handleExitGame} />}
                {activeGame === 'matrix' && <MatrixRain lang={lang} onExit={handleExitGame} />}

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
                        onKeyDown={onKeyDown}
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
