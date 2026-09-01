import { useState, useCallback, useEffect } from 'react';

export default function AimTestGame({ lang, onExit }) {
    const [aimTarget, setAimTarget] = useState({ x: 5, y: 3, label: '01' });
    const [aimStartTime, setAimStartTime] = useState(0);
    const [aimScores, setAimScores] = useState([]);
    const [aimHits, setAimHits] = useState(0);
    const [aimBestAvg, setAimBestAvg] = useState(() => {
        return parseInt(localStorage.getItem('terminal_aim_best_avg') || '0', 10);
    });
    const [isFinished, setIsFinished] = useState(false);
    const [lastAvg, setLastAvg] = useState(0);

    const initAimTest = useCallback(() => {
        setAimHits(0);
        setAimScores([]);
        setIsFinished(false);
        const nx = Math.floor(Math.random() * 8) + 1;
        const ny = Math.floor(Math.random() * 4) + 1;
        const targetCode = Math.floor(Math.random() * 89 + 10).toString();
        setAimTarget({ x: nx, y: ny, label: targetCode });
        setAimStartTime(Date.now());
    }, []);

    useEffect(() => {
        initAimTest();
    }, [initAimTest]);

    const handleAimClick = () => {
        const elapsed = Date.now() - aimStartTime;
        const nextHits = aimHits + 1;
        const newScores = [...aimScores, elapsed];
        setAimScores(newScores);
        setAimHits(nextHits);

        if (nextHits >= 5) {
            const avg = Math.round(newScores.reduce((a, b) => a + b, 0) / newScores.length);
            setLastAvg(avg);
            if (aimBestAvg === 0 || avg < aimBestAvg) {
                setAimBestAvg(avg);
                localStorage.setItem('terminal_aim_best_avg', avg.toString());
            }
            setIsFinished(true);
        } else {
            const nx = Math.floor(Math.random() * 8) + 1;
            const ny = Math.floor(Math.random() * 4) + 1;
            const targetCode = Math.floor(Math.random() * 89 + 10).toString();
            setAimTarget({ x: nx, y: ny, label: targetCode });
            setAimStartTime(Date.now());
        }
    };

    if (isFinished) {
        const bestDisplay = (aimBestAvg === 0 || lastAvg < aimBestAvg) ? lastAvg : aimBestAvg;
        const feedback = lastAvg < 300
            ? (lang === 'en' ? '🚀 Cyberpunk / real-time QA reflexes!' : lang === 'es' ? '🚀 ¡Reflejos Cyberpunk / QA en tiempo real!' : '🚀 Reflexos de Cyberpunk / QA em tempo real!')
            : (lang === 'en' ? '👍 Great reaction speed!' : lang === 'es' ? '👍 ¡Gran tiempo de reacción!' : '👍 Ótimo tempo de reação!');

        return (
            <div className="flex flex-col items-center justify-center space-y-2 py-3 text-center">
                <div className="text-accent font-bold text-xs">
                    {lang === 'en' ? '🎯 REFLEX SPEED TEST COMPLETED! (5 Targets)' : lang === 'es' ? '🎯 ¡TEST DE REFLEJOS COMPLETADO! (5 Objetivos)' : '🎯 TESTE DE REFLEXOS CONCLUÍDO! (5 Alvos)'}
                </div>
                <div className="text-green-400 font-bold text-sm">
                    {lang === 'en' ? `⚡ Average time: ${lastAvg}ms` : lang === 'es' ? `⚡ Tiempo promedio: ${lastAvg}ms` : `⚡ Tempo médio: ${lastAvg}ms`}
                </div>
                <div className="text-yellow-400 text-xs">
                    {lang === 'en' ? `🏆 Best registered average: ${bestDisplay}ms` : lang === 'es' ? `🏆 Mejor promedio: ${bestDisplay}ms` : `🏆 Melhor média: ${bestDisplay}ms`}
                </div>
                <div className="text-secondary text-xs">{feedback}</div>
                <div className="flex gap-2 pt-1">
                    <button onClick={initAimTest} className="px-3 py-1 bg-accent text-darker font-bold text-[10px] rounded hover:bg-accent-hover cursor-pointer">
                        {lang === 'en' ? 'Test Again' : lang === 'es' ? 'Probar de Nuevo' : 'Testar Novamente'}
                    </button>
                    <button onClick={onExit} className="px-3 py-1 border border-white/20 text-gray-300 text-[10px] rounded hover:bg-white/10 cursor-pointer">
                        {lang === 'en' ? 'Return to Shell' : lang === 'es' ? 'Volver al Shell' : 'Voltar ao Shell'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center space-y-2 py-1 select-none">
            <div className="w-full flex items-center justify-between text-xs border-b border-white/10 pb-1.5 text-gray-300">
                <span className="text-accent font-bold">🎯 AIM & REFLEX TEST</span>
                <span>{lang === 'en' ? 'Hits' : lang === 'es' ? 'Aciertos' : 'Acertos'}: <strong className="text-white">{aimHits}/5</strong></span>
                {aimBestAvg > 0 && <span>🏆 Best: <strong className="text-yellow-400">{aimBestAvg}ms</strong></span>}
                <button onClick={onExit} className="text-red-400 hover:underline text-[10px] cursor-pointer">
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
                    className="absolute px-3 py-1.5 bg-accent text-darker font-bold rounded shadow-lg border border-white/30 transform -translate-x-1/2 hover:scale-110 active:scale-95 transition-transform text-xs cursor-pointer"
                >
                    🎯 [ {aimTarget.label} ]
                </button>
            </div>
            <div className="text-[10px] text-gray-400">
                {lang === 'en' ? 'Click the target as quickly as possible as soon as it appears!' : lang === 'es' ? '¡Haz clic en el objetivo lo más rápido posible en cuanto aparezca!' : 'Clique no alvo o mais rápido possível assim que ele aparecer!'}
            </div>
        </div>
    );
}
