import { createContext, useContext, type ReactNode } from 'react';

/* ── Provedor de Rolagem Nativa Estável ──
 * 
 * O scroll-jacking via Lenis foi desativado em favor da rolagem nativa
 * da janela (scroll-behavior: smooth), eliminando qualquer concorrência
 * de eventos de roda/toque e garantindo 60 FPS contínuos e sem saltos.
 * O contexto é mantido para preservar compatibilidade de hooks.
 */

interface SmoothScrollContextValue {
    lenis: null;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({ lenis: null });

export function useLenis() {
    return null;
}

interface SmoothScrollProviderProps {
    children: ReactNode;
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
    return (
        <SmoothScrollContext.Provider value={{ lenis: null }}>
            {children}
        </SmoothScrollContext.Provider>
    );
}
