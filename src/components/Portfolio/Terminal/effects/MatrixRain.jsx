import { useEffect, useRef } from 'react';

export default function MatrixRain({ lang, onExit }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = (canvas.width = canvas.parentElement?.clientWidth || 500);
        const height = (canvas.height = 240);

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
    }, []);

    return (
        <div className="relative w-full h-[200px] overflow-hidden rounded">
            <canvas ref={canvasRef} className="w-full h-full block" />
            <div className="absolute top-2 right-2 flex gap-2">
                <button
                    onClick={onExit}
                    className="px-2.5 py-1 bg-black/80 border border-green-500/50 text-green-400 text-[10px] rounded hover:bg-green-500 hover:text-black transition-colors font-bold cursor-pointer"
                >
                    {lang === 'en' ? 'ESC / Close Matrix' : lang === 'es' ? 'ESC / Cerrar Matrix' : 'ESC / Fechar Matrix'}
                </button>
            </div>
        </div>
    );
}
