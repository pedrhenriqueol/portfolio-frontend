import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const COMMANDS = [
    {
        cmd: 'help',
        desc: 'Mostra todos os comandos disponíveis',
        output: (t) => [
            { text: 'Comandos disponíveis:', color: 'text-secondary' },
            { text: '  pedro --skills         Lista todas as tecnologias', color: 'text-primary' },
            { text: '  pedro --experience     Trajetória profissional', color: 'text-primary' },
            { text: '  pedro --contact        Links e e-mail de contato', color: 'text-primary' },
            { text: '  pedro --status         Status de disponibilidade', color: 'text-primary' },
            { text: '  pedro --theme [name]   Troca o tema do site', color: 'text-primary' },
            { text: '  clear                  Limpa o terminal', color: 'text-primary' },
        ],
    },
    {
        cmd: 'skills',
        desc: 'Tecnologias',
        output: () => [
            { text: '// Stack tecnológica ⚡', color: 'text-accent' },
            { text: 'backend:   [ Delphi + UniGui, PHP/Laravel, Node.js ]', color: 'text-secondary' },
            { text: 'frontend:  [ React, TypeScript, Tailwind CSS ]', color: 'text-secondary' },
            { text: 'database:  [ MySQL, SQL Server, PostgreSQL ]', color: 'text-secondary' },
            { text: 'devops:    [ Git, Docker, Railway, Linux ]', color: 'text-secondary' },
            { text: 'qa:        [ Postman, Scrum, Kanban, Testes funcionais ]', color: 'text-secondary' },
        ],
    },
    {
        cmd: 'experience',
        desc: 'Trajetória',
        output: () => [
            { text: '// Trajetória profissional 📋', color: 'text-accent' },
            { text: 'SETE Tecnologia  →  Analista de QA  (Dez 2024 - Presente)', color: 'text-secondary' },
            { text: '  - Testes funcionais em sistemas de logística portuária (ZPEs)', color: 'text-primary' },
            { text: '  - Postman · SQL Server · Scrum/Kanban', color: 'text-primary' },
            { text: '', color: '' },
            { text: 'Qualisoft Sistemas  →  Dev Fullstack  (Ago 2025 - Abr 2026)', color: 'text-secondary' },
            { text: '  - ERP monolítico Delphi 6 → Delphi 11 + UniGui', color: 'text-primary' },
            { text: '  - Plataforma Multi-tenant Laravel + React + TypeScript', color: 'text-primary' },
            { text: '  - 100+ usuários diários em produção', color: 'text-primary' },
        ],
    },
    {
        cmd: 'contact',
        desc: 'Contato',
        output: () => [
            { text: '// Canais de contato 📬', color: 'text-accent' },
            { text: 'email:    pedrohc.forza@gmail.com', color: 'text-secondary' },
            { text: 'github:   github.com/pedrhenriqueol', color: 'text-secondary' },
            { text: 'linkedin: linkedin.com/in/pedro-henrique-b0a015391', color: 'text-secondary' },
            { text: 'instagram: @pedrherg', color: 'text-secondary' },
            { text: '', color: '' },
            { text: '→ Respondo em menos de 24h. ✓', color: 'text-accent' },
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
                { text: `localização: Fortaleza, CE — Brasil (UTC-3)`, color: 'text-secondary' },
                { text: `horário:     ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`, color: 'text-secondary' },
                { text: `disponível:  ${available ? 'Sim ✓ — respondo hoje!' : 'Fora do horário — respondo amanhã'}`, color: available ? 'text-accent' : 'text-primary' },
                { text: `emprego:     Aberto a novas oportunidades ✓`, color: 'text-secondary' },
            ];
        },
    },
];

const INIT_LINES = [
    { text: 'Pedro Henrique — Terminal Interativo v1.0', color: 'text-secondary' },
    { text: 'Digite  pedro --help  para ver os comandos.', color: 'text-primary/70' },
];

export default function InteractiveTerminal() {
    const { t } = useLanguage();
    const [lines, setLines] = useState(INIT_LINES);
    const [input, setInput] = useState('');
    const [focused, setFocused] = useState(false);
    const [history, setHistory] = useState([]);
    const [histIdx, setHistIdx] = useState(-1);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [lines]);

    const runCommand = useCallback((raw) => {
        const trimmed = raw.trim();
        if (!trimmed) return;

        setHistory(h => [trimmed, ...h]);
        setHistIdx(-1);

        const newLines = [
            ...lines,
            { text: `> ${trimmed}`, color: 'text-accent/80' },
        ];

        if (trimmed === 'clear') {
            setLines(INIT_LINES);
            setInput('');
            return;
        }

        const cmdKey = trimmed.replace('pedro --', '').replace('pedro-', '').toLowerCase();
        const found = COMMANDS.find(c => c.cmd === cmdKey || trimmed === `pedro --${c.cmd}`);

        if (found) {
            const out = found.output(t);
            setLines([...newLines, ...out, { text: '', color: '' }]);
        } else {
            setLines([
                ...newLines,
                { text: `Comando desconhecido: "${trimmed}". Digite pedro --help.`, color: 'text-red-400/70' },
                { text: '', color: '' },
            ]);
        }
        setInput('');
    }, [lines, t]);

    const onKey = (e) => {
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
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-dark/60">
                <span className="w-3 h-3 rounded-full bg-red-500/60 hover:bg-red-500 transition-colors cursor-pointer" title="Fechar" onClick={(e) => { e.stopPropagation(); setLines(INIT_LINES); }} />
                <span className="w-3 h-3 rounded-full bg-yellow-500/40 hover:bg-yellow-500/70 transition-colors cursor-pointer" title="Minimizar" />
                <span className="w-3 h-3 rounded-full bg-green-500/40 hover:bg-green-500/70 transition-colors cursor-pointer" title="Maximizar" />
                <span className="ml-2 text-xs text-gray-500 font-mono">pedro@portfolio: ~</span>
                <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-accent inline-block"
                />
                <span className="text-accent/50 text-xs font-mono ml-1">live</span>
            </div>

            {/* Output */}
            <div className="p-4 font-mono text-[12px] leading-relaxed space-y-0.5 min-h-[220px] max-h-[280px] overflow-y-auto">
                {lines.map((line, i) => (
                    <div key={i} className={`${line.color || 'text-primary/60'} block whitespace-pre-wrap break-all`}>
                        {line.text || '\u00A0'}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {/* Input line */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-white/5 bg-dark/30">
                <span className="text-accent/60 font-mono text-[12px] shrink-0">{'>'}</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={onKey}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="pedro --help"
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
            <div className="flex items-center gap-3 px-4 py-2 border-t border-white/5 bg-dark/40 text-[10px] font-mono text-gray-600">
                <span className="text-accent/50">⬡ Interactive Shell</span>
                <span className="ml-auto">Fortaleza, BR</span>
                <span>UTC-3</span>
            </div>
        </div>
    );
}
