import { useState, useEffect, useRef, useCallback } from 'react';

const STACKS = ['React', 'Laravel', 'Delphi', 'SQL', 'Postman', 'Docker', 'TypeScript'];

export default function SnakeGame({ lang, onExit }) {
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

    const initSnake = useCallback(() => {
        setSnake([[5, 5], [5, 4], [5, 3]]);
        setSnakeDir('RIGHT');
        snakeDirRef.current = 'RIGHT';
        setSnakeScore(0);
        setSnakeGameOver(false);
        setFood([Math.floor(Math.random() * 8) + 1, Math.floor(Math.random() * 18) + 1]);
        setFoodLabel(STACKS[Math.floor(Math.random() * STACKS.length)]);
    }, []);

    // Game loop com timer isolado
    useEffect(() => {
        if (snakeGameOver) return;

        const timer = setInterval(() => {
            setSnake(prevSnake => {
                const head = prevSnake[0];
                let newHead = [...head];
                const dir = snakeDirRef.current;
                if (dir === 'UP') newHead[0] -= 1;
                if (dir === 'DOWN') newHead[0] += 1;
                if (dir === 'LEFT') newHead[1] -= 1;
                if (dir === 'RIGHT') newHead[1] += 1;

                // Colisão com borda
                if (newHead[0] < 0 || newHead[0] >= 10 || newHead[1] < 0 || newHead[1] >= 20) {
                    setSnakeGameOver(true);
                    return prevSnake;
                }
                // Colisão com próprio corpo
                if (prevSnake.some(seg => seg[0] === newHead[0] && seg[1] === newHead[1])) {
                    setSnakeGameOver(true);
                    return prevSnake;
                }

                // Comeu comida
                const eating = newHead[0] === food[0] && newHead[1] === food[1];
                if (eating) {
                    setSnakeScore(s => s + 10);
                    const nf = [Math.floor(Math.random() * 9), Math.floor(Math.random() * 19)];
                    setFood(nf);
                    setFoodLabel(STACKS[Math.floor(Math.random() * STACKS.length)]);
                    return [newHead, ...prevSnake];
                }
                return [newHead, ...prevSnake.slice(0, -1)];
            });
        }, 130);

        return () => clearInterval(timer);
    }, [snakeGameOver, food]);

    // Persiste recorde
    useEffect(() => {
        if (snakeGameOver && snakeScore > snakeHighscore) {
            localStorage.setItem('terminal_snake_highscore', snakeScore.toString());
            setSnakeHighscore(snakeScore);
        }
    }, [snakeGameOver, snakeScore, snakeHighscore]);

    // Controles de teclado
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (['ArrowUp', 'KeyW'].includes(e.code) && snakeDirRef.current !== 'DOWN') {
                e.preventDefault();
                setSnakeDir('UP');
            } else if (['ArrowDown', 'KeyS'].includes(e.code) && snakeDirRef.current !== 'UP') {
                e.preventDefault();
                setSnakeDir('DOWN');
            } else if (['ArrowLeft', 'KeyA'].includes(e.code) && snakeDirRef.current !== 'RIGHT') {
                e.preventDefault();
                setSnakeDir('LEFT');
            } else if (['ArrowRight', 'KeyD'].includes(e.code) && snakeDirRef.current !== 'LEFT') {
                e.preventDefault();
                setSnakeDir('RIGHT');
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onExit();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onExit]);

    return (
        <div className="flex flex-col items-center justify-center space-y-2 py-1">
            <div className="w-full flex items-center justify-between text-xs border-b border-white/10 pb-1.5 text-gray-300">
                <span className="text-accent font-bold">🐍 SNAKE ASCII</span>
                <span>Score: <strong className="text-white">{snakeScore}</strong></span>
                <span>🏆 Record: <strong className="text-yellow-400">{snakeHighscore}</strong></span>
                <span>Item: <strong className="text-accent">{foodLabel}</strong></span>
                <button onClick={onExit} className="text-red-400 hover:underline text-[10px] cursor-pointer">
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
                        <button onClick={initSnake} className="px-3 py-1 bg-accent text-darker font-bold text-[10px] rounded hover:bg-accent-hover cursor-pointer">
                            {lang === 'en' ? 'Play Again' : lang === 'es' ? 'Jugar de Nuevo' : 'Jogar de Novo'}
                        </button>
                        <button onClick={onExit} className="px-3 py-1 border border-white/20 text-gray-300 text-[10px] rounded hover:bg-white/10 cursor-pointer">
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
    );
}
