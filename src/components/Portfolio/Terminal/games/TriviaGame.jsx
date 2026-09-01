import { useState } from 'react';
import { TRIVIA_QUESTIONS } from '../TerminalGames';

export default function TriviaGame({ lang, onExit }) {
    const [triviaIdx, setTriviaIdx] = useState(0);
    const [triviaScore, setTriviaScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const questions = TRIVIA_QUESTIONS[lang] || TRIVIA_QUESTIONS.pt;
    const currentQ = questions[triviaIdx];

    const handleAnswer = (letter) => {
        const correct = currentQ.answer === letter;
        const nextScore = correct ? triviaScore + 1 : triviaScore;
        if (correct) {
            setTriviaScore(nextScore);
        }

        if (triviaIdx + 1 < questions.length) {
            setTriviaIdx(idx => idx + 1);
        } else {
            setIsFinished(true);
        }
    };

    const restartQuiz = () => {
        setTriviaIdx(0);
        setTriviaScore(0);
        setIsFinished(false);
    };

    if (isFinished) {
        const endMsg = triviaScore === 4
            ? (lang === 'en' ? '⭐⭐⭐ Senior Architecture & QA Level reached!' : lang === 'es' ? '⭐⭐⭐ ¡Nivel Senior en Arquitectura y QA alcanzado!' : '⭐⭐⭐ Nível Sênior em Arquitetura & QA atingido!')
            : (lang === 'en' ? 'Great game! Keep mastering the concepts.' : lang === 'es' ? '¡Buen juego! Sigue practicando los conceptos.' : 'Bom jogo! Continue praticando os conceitos.');

        return (
            <div className="flex flex-col items-center justify-center space-y-3 py-4 text-center">
                <div className="text-accent font-bold text-sm">
                    {lang === 'en' ? `🎉 QUIZ COMPLETED! Score: ${triviaScore}/4` : lang === 'es' ? `🎉 ¡QUIZ COMPLETADO! Puntuación: ${triviaScore}/4` : `🎉 QUIZ CONCLUÍDO! Pontuação: ${triviaScore}/4`}
                </div>
                <div className="text-secondary text-xs">{endMsg}</div>
                <div className="flex gap-2">
                    <button onClick={restartQuiz} className="px-3 py-1.5 bg-accent text-darker font-bold text-[11px] rounded hover:bg-accent-hover cursor-pointer">
                        {lang === 'en' ? 'Try Again' : lang === 'es' ? 'Intentar de Nuevo' : 'Tentar Novamente'}
                    </button>
                    <button onClick={onExit} className="px-3 py-1.5 border border-white/20 text-gray-300 text-[11px] rounded hover:bg-white/10 cursor-pointer">
                        {lang === 'en' ? 'Return to Shell' : lang === 'es' ? 'Volver al Shell' : 'Voltar ao Shell'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3 py-1">
            <div className="flex items-center justify-between text-xs border-b border-white/10 pb-1.5">
                <span className="text-accent font-bold">🧠 TECH QUIZ ({triviaIdx + 1}/{questions.length})</span>
                <span className="text-gray-300">XP: <strong className="text-accent">{triviaScore * 100}</strong></span>
                <button onClick={onExit} className="text-red-400 hover:underline text-[10px] cursor-pointer">
                    {lang === 'en' ? 'Exit' : lang === 'es' ? 'Salir' : 'Sair'}
                </button>
            </div>
            <div className="text-secondary font-bold text-xs">
                {currentQ.q}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {currentQ.options.map((opt, i) => {
                    const letter = opt[0];
                    return (
                        <button
                            key={i}
                            onClick={() => handleAnswer(letter)}
                            className="p-2 text-left bg-black/40 border border-white/10 rounded hover:border-accent hover:bg-accent/10 transition-all text-[11px] text-gray-300 hover:text-white cursor-pointer"
                        >
                            {opt}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
