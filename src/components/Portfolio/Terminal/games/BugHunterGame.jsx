import { useState, useCallback, useEffect } from 'react';

export default function BugHunterGame({ lang, onExit }) {
    const [bugGrid, setBugGrid] = useState([]);
    const [bugState, setBugState] = useState('PLAYING');

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

    useEffect(() => {
        initBugHunter();
    }, [initBugHunter]);

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

    return (
        <div className="flex flex-col items-center justify-center space-y-2 py-1">
            <div className="w-full flex items-center justify-between text-xs border-b border-white/10 pb-1.5 text-gray-300">
                <span className="text-accent font-bold">🐛 QA BUG HUNTER</span>
                <span>
                    Status: {bugState === 'PLAYING' 
                        ? (lang === 'en' ? '🔍 Testing...' : lang === 'es' ? '🔍 Probando...' : '🔍 Testando...') 
                        : bugState === 'WON' 
                        ? (lang === 'en' ? '🏆 100% Passed!' : lang === 'es' ? '🏆 ¡100% Pasó!' : '🏆 100% Passou!') 
                        : (lang === 'en' ? '💥 Error 500!' : lang === 'es' ? '💥 ¡Error 500!' : '💥 Erro 500!')}
                </span>
                <button onClick={onExit} className="text-red-400 hover:underline text-[10px] cursor-pointer">
                    {lang === 'en' ? 'Exit' : lang === 'es' ? 'Salir' : 'Sair'}
                </button>
            </div>

            <div className="grid grid-cols-6 gap-1.5 bg-black/50 p-2.5 rounded border border-white/10">
                {bugGrid.map((row, r) =>
                    row.map((cell, c) => (
                        <button
                            key={`${r}-${c}`}
                            onClick={() => handleBugClick(r, c)}
                            className={`w-9 h-9 rounded text-xs font-bold transition-all flex items-center justify-center border cursor-pointer ${
                                cell.revealed
                                    ? cell.isBug
                                        ? 'bg-red-900/80 border-red-500 text-red-200 animate-bounce'
                                        : 'bg-green-950/40 border-green-700/40 text-green-300'
                                    : 'bg-white/5 border-white/15 hover:border-accent hover:bg-accent/10 text-gray-400'
                            }`}
                        >
                            {cell.revealed ? (cell.isBug ? '🐛' : cell.count > 0 ? cell.count : '✓') : '?'}
                        </button>
                    ))
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
                        <button onClick={initBugHunter} className="px-3 py-1 bg-accent text-darker font-bold text-[10px] rounded hover:bg-accent-hover cursor-pointer">
                            {lang === 'en' ? 'Test Again' : lang === 'es' ? 'Probar de Nuevo' : 'Testar Novamente'}
                        </button>
                        <button onClick={onExit} className="px-3 py-1 border border-white/20 text-gray-300 text-[10px] rounded hover:bg-white/10 cursor-pointer">
                            {lang === 'en' ? 'Return' : lang === 'es' ? 'Volver' : 'Voltar'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
