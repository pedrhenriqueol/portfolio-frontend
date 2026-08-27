import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export const FONT_PRESETS = {
    luxe: {
        id: 'luxe',
        name: 'Editorial Luxe',
        tag: 'Alta Alfaiataria',
        serif: "'Cormorant Garamond', Georgia, serif",
        sans: "'Plus Jakarta Sans', sans-serif",
        desc: 'Cormorant Garamond + Plus Jakarta Sans — Refinamento de revista de luxo com clareza moderna',
        previewSerif: 'Cormorant Garamond',
        previewSans: 'Plus Jakarta Sans',
    },
    heritage: {
        id: 'heritage',
        name: 'Modern Heritage',
        tag: 'Autoridade Técnica',
        serif: "'Newsreader', 'Times New Roman', serif",
        sans: "'Outfit', sans-serif",
        desc: 'Newsreader + Outfit — Equilíbrio entre jornalismo técnico de autoridade e UI contemporânea',
        previewSerif: 'Newsreader',
        previewSans: 'Outfit',
    },
    brutalist: {
        id: 'brutalist',
        name: 'Avant-Garde Tech',
        tag: 'Disruptivo & Forte',
        serif: "'Syne', sans-serif",
        sans: "'Space Grotesk', monospace, sans-serif",
        desc: 'Syne + Space Grotesk — Tipografia de estúdio de engenharia e design europeu vanguardista',
        previewSerif: 'Syne',
        previewSans: 'Space Grotesk',
    },
    nordic: {
        id: 'nordic',
        name: 'Nordic Precision',
        tag: 'Minimalismo de Estúdio',
        serif: "'Instrument Serif', Georgia, serif",
        sans: "'Inter Tight', -apple-system, sans-serif",
        desc: 'Instrument Serif + Inter Tight — Precisão condensada da Califórnia com densidade de produto',
        previewSerif: 'Instrument Serif',
        previewSans: 'Inter Tight',
    },
    warm: {
        id: 'warm',
        name: 'Warm Editorial',
        tag: 'Artesanal & Orgânica',
        serif: "'Fraunces', Georgia, serif",
        sans: "'DM Sans', sans-serif",
        desc: 'Fraunces + DM Sans — Tipografia expressiva com curvas táteis, calor e alta memorabilidade',
        previewSerif: 'Fraunces',
        previewSans: 'DM Sans',
    },
    classic: {
        id: 'classic',
        name: 'Classic Standard',
        tag: 'Padrão Anterior',
        serif: "'Playfair Display', Georgia, serif",
        sans: "'Poppins', sans-serif",
        desc: 'Playfair Display + Poppins — Combinação clássica do portfólio',
        previewSerif: 'Playfair Display',
        previewSans: 'Poppins',
    },
};

const FontContext = createContext();

export function FontProvider({ children }) {
    const [currentFont, setCurrentFont] = useState(() => {
        const saved = localStorage.getItem('portfolio_font');
        return saved && FONT_PRESETS[saved] ? saved : 'luxe';
    });

    const applyFont = useCallback((fontId) => {
        const preset = FONT_PRESETS[fontId] || FONT_PRESETS.luxe;
        const root = document.documentElement;

        root.style.setProperty('--font-serif', preset.serif);
        root.style.setProperty('--font-sans', preset.sans);
        localStorage.setItem('portfolio_font', fontId);
    }, []);

    useEffect(() => {
        applyFont(currentFont);
    }, [currentFont, applyFont]);

    const setFont = useCallback((id) => {
        if (FONT_PRESETS[id]) {
            setCurrentFont(id);
        }
    }, []);

    const activeFontData = useMemo(() => FONT_PRESETS[currentFont] || FONT_PRESETS.luxe, [currentFont]);

    const value = useMemo(() => ({
        font: currentFont,
        fontData: activeFontData,
        fonts: FONT_PRESETS,
        setFont,
    }), [currentFont, activeFontData, setFont]);

    return (
        <FontContext.Provider value={value}>
            {children}
        </FontContext.Provider>
    );
}

export function useFont() {
    return useContext(FontContext);
}
