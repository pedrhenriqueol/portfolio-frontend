import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    // Tenta recuperar o idioma salvo, senão usa português por padrão
    const [lang, setLang] = useState(() => {
        const saved = localStorage.getItem('portfolio_lang');
        return saved ? saved : 'pt';
    });

    // Cache de chaves de tradução para evitar split('.') repetido
    const cacheRef = useRef({});

    // Salva no localStorage sempre que mudar
    useEffect(() => {
        localStorage.setItem('portfolio_lang', lang);
        document.documentElement.lang = lang;
    }, [lang]);

    // Função utilitária memoizada com cache O(1)
    const t = useCallback((keyPath) => {
        const cacheKey = `${lang}:${keyPath}`;
        if (cacheRef.current[cacheKey] !== undefined) {
            return cacheRef.current[cacheKey];
        }

        const keys = keyPath.split('.');
        let current = translations[lang];
        for (const key of keys) {
            if (current === undefined || current[key] === undefined) {
                console.warn(`Translation key not found: ${keyPath}`);
                return keyPath;
            }
            current = current[key];
        }

        cacheRef.current[cacheKey] = current;
        return current;
    }, [lang]);

    const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}

