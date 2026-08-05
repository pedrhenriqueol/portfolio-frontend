import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    // Tenta recuperar o idioma salvo, senão usa português por padrão
    const [lang, setLang] = useState(() => {
        const saved = localStorage.getItem('portfolio_lang');
        return saved ? saved : 'pt';
    });

    // Salva no localStorage sempre que mudar
    useEffect(() => {
        localStorage.setItem('portfolio_lang', lang);
        document.documentElement.lang = lang; // Acessibilidade
    }, [lang]);

    // Função utilitária para pegar os textos
    const t = (keyPath) => {
        const keys = keyPath.split('.');
        let current = translations[lang];
        for (const key of keys) {
            if (current[key] === undefined) {
                console.warn(`Translation key not found: ${keyPath}`);
                return keyPath;
            }
            current = current[key];
        }
        return current;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
