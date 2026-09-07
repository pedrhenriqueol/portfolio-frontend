import { useEffect, useState, useRef } from 'react';

interface UseSectionInViewOptions {
    threshold?: number | number[];
    rootMargin?: string;
    initialInView?: boolean;
}

/**
 * useSectionInView - Hook de controle de visibilidade com IntersectionObserver
 * 
 * - Desliga loops de renderização contínua (rAF), springs e listeners quando fora da tela.
 * - Reduz o consumo de CPU/GPU em repouso para 0%.
 * - Suporta margem de antecipação (rootMargin) para pré-aquecer antes do usuário chegar.
 */
export function useSectionInView(options: UseSectionInViewOptions = {}) {
    const { threshold = 0.05, rootMargin = '150px 0px', initialInView = false } = options;
    const [isInView, setIsInView] = useState(initialInView);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const node = containerRef.current;
        if (!node) return;

        if (typeof IntersectionObserver === 'undefined') {
            setIsInView(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { threshold, rootMargin }
        );

        observer.observe(node);

        return () => {
            observer.disconnect();
        };
    }, [threshold, rootMargin]);

    return { containerRef, isInView };
}

export default useSectionInView;
