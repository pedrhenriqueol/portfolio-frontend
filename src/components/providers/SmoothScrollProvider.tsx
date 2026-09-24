import { useEffect, useRef, createContext, useContext, type ReactNode } from 'react';
import Lenis from 'lenis';

/* ── Provedor de Inércia de Rolagem (Lenis Smooth Scroll) ──
 * 
 * Responsável por:
 * 1. Instanciar o Lenis com curva de easing exponencial de baixo custo de CPU.
 * 2. Manter o loop `requestAnimationFrame` sob controle rígido de ciclo de vida:
 *    - Pausa automática ao minimizar a aba via `visibilitychange`.
 *    - Cancelamento absoluto no teardown do `useEffect`.
 * 3. Expor a instância do Lenis via Context para que o `HeroAboutScrolly`
 *    e outros componentes possam acionar `lenis.scrollTo()` programaticamente.
 */

interface SmoothScrollContextValue {
    lenis: Lenis | null;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({ lenis: null });

export function useLenis(): Lenis | null {
    return useContext(SmoothScrollContext).lenis;
}

interface SmoothScrollProviderProps {
    children: ReactNode;
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
    const lenisRef = useRef<Lenis | null>(null);
    const rafIdRef = useRef<number | null>(null);
    const isPausedRef = useRef(false);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 1.2,
        });

        lenisRef.current = lenis;

        /* ── RAF Loop com guarda de visibilidade ── */
        const tick = (time: number) => {
            if (isPausedRef.current) return;
            lenis.raf(time);
            rafIdRef.current = requestAnimationFrame(tick);
        };

        const startLoop = () => {
            if (rafIdRef.current !== null) return;
            isPausedRef.current = false;
            rafIdRef.current = requestAnimationFrame(tick);
        };

        const stopLoop = () => {
            isPausedRef.current = true;
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
            }
        };

        /* ── Visibilidade da aba: pausa o RAF quando a aba está em segundo plano ── */
        const handleVisibilityChange = () => {
            if (document.hidden) {
                stopLoop();
            } else {
                startLoop();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });
        startLoop();

        return () => {
            stopLoop();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    return (
        <SmoothScrollContext.Provider value={{ lenis: lenisRef.current }}>
            {children}
        </SmoothScrollContext.Provider>
    );
}
