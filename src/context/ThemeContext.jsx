import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

export const PALETTES = {
    mocha: {
        id: 'mocha',
        nameKey: 'palette.mocha',
        defaultName: 'Café / Mocha',
        colors: {
            '--color-dark': '#231B16',
            '--color-darker': '#1A1310',
            '--color-primary': '#D1C7BD',
            '--color-secondary': '#F5EBE1',
            '--color-accent': '#8C6A4A',
            '--color-accent-hover': '#A37E5A',
            '--color-light': '#FFFFFF',
            '--color-border': 'rgba(140, 106, 74, 0.25)',
        },
        preview: ['#231B16', '#8C6A4A', '#F5EBE1'],
        sparks: ['#8C6A4A', '#A37E5A', '#4B342A', '#D1C7BD', '#231B16'],
    },
    claude: {
        id: 'claude',
        nameKey: 'palette.claude',
        defaultName: 'Claude Editorial',
        colors: {
            '--color-dark': '#24221F',
            '--color-darker': '#1E1D1A',
            '--color-primary': '#A6A298',
            '--color-secondary': '#EAE8E3',
            '--color-accent': '#D97757',
            '--color-accent-hover': '#C66545',
            '--color-light': '#FAF9F7',
            '--color-border': 'rgba(234, 232, 227, 0.08)',
        },
        preview: ['#24221F', '#D97757', '#EAE8E3'],
        sparks: ['#D97757', '#C66545', '#EAE8E3', '#A6A298', '#24221F'],
    },
    greige: {
        id: 'greige',
        nameKey: 'palette.greige',
        defaultName: 'Greige Minimal',
        colors: {
            '--color-dark': '#1B1B1B',
            '--color-darker': '#141414',
            '--color-primary': '#8A8A8A',
            '--color-secondary': '#F4F2EC',
            '--color-accent': '#D6D2C4',
            '--color-accent-hover': '#E5E2D8',
            '--color-light': '#FFFFFF',
            '--color-border': 'rgba(214, 210, 196, 0.15)',
        },
        preview: ['#1B1B1B', '#8A8A8A', '#D6D2C4'],
        sparks: ['#D6D2C4', '#E5E2D8', '#8A8A8A', '#4A4A4A', '#1B1B1B'],
    },
    forest: {
        id: 'forest',
        nameKey: 'palette.forest',
        defaultName: 'Verde Musgo',
        colors: {
            '--color-dark': '#161C12',
            '--color-darker': '#0D110B',
            '--color-primary': '#A3AD94',
            '--color-secondary': '#F0F2EB',
            '--color-accent': '#7C8A5B',
            '--color-accent-hover': '#8F9E6C',
            '--color-light': '#FFFFFF',
            '--color-border': 'rgba(124, 138, 91, 0.2)',
        },
        preview: ['#161C12', '#7C8A5B', '#F0F2EB'],
        sparks: ['#7C8A5B', '#8F9E6C', '#3B4A2A', '#A3AD94', '#161C12'],
    },
    slate: {
        id: 'slate',
        nameKey: 'palette.slate',
        defaultName: 'Midnight Slate',
        colors: {
            '--color-dark': '#0F141C',
            '--color-darker': '#090D13',
            '--color-primary': '#8FA9C4',
            '--color-secondary': '#E8F1F5',
            '--color-accent': '#4F86C6',
            '--color-accent-hover': '#6BA0DC',
            '--color-light': '#FFFFFF',
            '--color-border': 'rgba(79, 134, 198, 0.2)',
        },
        preview: ['#0F141C', '#4F86C6', '#E8F1F5'],
        sparks: ['#4F86C6', '#6BA0DC', '#1C293D', '#8FA9C4', '#0F141C'],
    },
    emerald: {
        id: 'emerald',
        nameKey: 'palette.emerald',
        defaultName: 'Obsidian Emerald',
        colors: {
            '--color-dark': '#101413',
            '--color-darker': '#0A0E0D',
            '--color-primary': '#8FAEA4',
            '--color-secondary': '#E6F4F0',
            '--color-accent': '#38B285',
            '--color-accent-hover': '#4CCBA0',
            '--color-light': '#FFFFFF',
            '--color-border': 'rgba(56, 178, 133, 0.2)',
        },
        preview: ['#101413', '#38B285', '#E6F4F0'],
        sparks: ['#38B285', '#4CCBA0', '#1C2B26', '#8FAEA4', '#101413'],
    },
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [currentPalette, setCurrentPalette] = useState(() => {
        const saved = localStorage.getItem('portfolio_theme');
        return (saved && PALETTES[saved]) ? saved : 'mocha';
    });

    const applyTheme = useCallback((paletteId) => {
        const palette = PALETTES[paletteId] || PALETTES.mocha;
        const root = document.documentElement;

        Object.entries(palette.colors).forEach(([prop, val]) => {
            root.style.setProperty(prop, val);
        });

        localStorage.setItem('portfolio_theme', paletteId);
    }, []);

    useEffect(() => {
        applyTheme(currentPalette);
    }, [currentPalette, applyTheme]);

    const setPalette = useCallback((id) => {
        if (PALETTES[id]) {
            setCurrentPalette(id);
        }
    }, []);

    const activePaletteData = useMemo(() => PALETTES[currentPalette] || PALETTES.mocha, [currentPalette]);

    const value = useMemo(() => ({
        palette: currentPalette,
        paletteData: activePaletteData,
        palettes: PALETTES,
        setPalette,
    }), [currentPalette, activePaletteData, setPalette]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
