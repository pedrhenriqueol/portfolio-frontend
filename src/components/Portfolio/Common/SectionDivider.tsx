import React, { memo } from 'react';

interface SectionDividerProps {
    className?: string;
    marker?: string;
}

/**
 * SectionDivider — Filamento Óptico Esvaecido Contido (Padrão Linear & Rauno Freiberg)
 * 
 * - Largura contida em max-w-5xl mx-auto (nunca corta a tela de ponta a ponta)
 * - Gradiente suave de 1px: from-transparent via-white/[0.08] to-transparent
 * - Marcador tipográfico discreto no centro sobre substrato #090b10
 */
export const SectionDivider: React.FC<SectionDividerProps> = memo(function SectionDivider({
    className = "my-16 md:my-24",
    marker = "+"
}) {
    return (
        <div
            aria-hidden="true"
            className={`w-full max-w-5xl mx-auto flex items-center justify-center pointer-events-none relative px-4 ${className}`}
        >
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
            {marker && (
                <span className="absolute font-mono text-[9px] text-white/20 px-3 bg-[#090b10] select-none tracking-widest">
                    {marker}
                </span>
            )}
        </div>
    );
});

export default SectionDivider;
