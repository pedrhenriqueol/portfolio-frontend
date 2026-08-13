import { useEffect, useRef } from 'react';

const isTouchDevice = () =>
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

const SIZE = 20; // Diâmetro padrão da bolinha (px)

const BEZIER = 'cubic-bezier(0.16, 1, 0.3, 1)';
const T_MORPH = `transform 0.38s ${BEZIER}, width 0.38s ${BEZIER}, height 0.38s ${BEZIER}, border-radius 0.38s ${BEZIER}, opacity 0.2s ease`;
const T_SCROLL = `width 0.38s ${BEZIER}, height 0.38s ${BEZIER}, border-radius 0.38s ${BEZIER}, opacity 0.2s ease`;
const T_FREE  = `width 0.3s ${BEZIER}, height 0.3s ${BEZIER}, border-radius 0.3s ${BEZIER}, opacity 0.2s ease`;

function getZoomLevel() {
    if (typeof window === 'undefined') return 1;
    return parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
}

/** Busca automaticamente qualquer elemento que se comporte como um card (respeitando data-no-morph) */
function findCardContainer(el, zoom) {
    if (!el || el === document.body || el === document.documentElement) return null;

    // Se estiver dentro de um elemento explicitamente ignorado
    if (el.closest('[data-no-morph="true"], .no-morph')) {
        return null;
    }

    let curr = el;
    while (curr && curr !== document.body && curr !== document.documentElement) {
        if (['SECTION', 'MAIN', 'NAV', 'HEADER', 'FOOTER', 'BODY', 'HTML'].includes(curr.tagName)) break;

        if (curr.hasAttribute('data-no-morph') || curr.classList.contains('no-morph')) {
            return null;
        }

        // Se marcado explicitamente para morphing
        if (curr.hasAttribute('data-cursor-morph') || curr.classList.contains('cursor-morph')) {
            return curr;
        }

        const className = typeof curr.className === 'string' ? curr.className : '';
        const isCardCandidate =
            (className.includes('rounded-xl') || className.includes('rounded-2xl') || className.includes('rounded-3xl')) &&
            (className.includes('bg-') || className.includes('border') || className.includes('card'));

        if (isCardCandidate) {
            const style = getComputedStyle(curr);
            const hasBgOrBorder =
                style.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
                style.borderWidth !== '0px' ||
                className.includes('bg-') ||
                className.includes('border');

            if (hasBgOrBorder) {
                const rect = curr.getBoundingClientRect();
                const w = rect.width / zoom;
                const h = rect.height / zoom;
                // Garante dimensão ideal de card (permite cards grandes como Experiência e Bio, mas evita a página inteira)
                if (w >= 60 && h >= 40 && w <= (window.innerWidth / zoom) * 0.98 && h <= 1600) {
                    return curr;
                }
            }
        }
        curr = curr.parentElement;
    }
    return null;
}

export default function CursorMorph() {
    const elRef = useRef(null);

    useEffect(() => {
        if (isTouchDevice()) return;

        const el = elRef.current;
        if (!el) return;

        let mouseX = -200;
        let mouseY = -200;
        let activeCard = null;
        let returnTimeout = null;
        let scrollRaf = null;

        /* Atualiza a posição da bolinha/card (isScroll = true faz o transform ser instantâneo sem lag) */
        const updatePosition = (isScroll = false) => {
            const zoom = getZoomLevel();

            if (activeCard) {
                const rect = activeCard.getBoundingClientRect();
                const style = getComputedStyle(activeCard);
                const radius = style.borderRadius || '16px';

                const left = rect.left / zoom;
                const top  = rect.top / zoom;
                const w    = rect.width / zoom;
                const h    = rect.height / zoom;

                // No scroll, remove a transição do transform para colar 100% no card sem lag
                el.style.transition   = isScroll ? T_SCROLL : T_MORPH;
                el.style.width        = `${w}px`;
                el.style.height       = `${h}px`;
                el.style.borderRadius = radius;
                el.style.transform    = `translate(${left}px, ${top}px)`;
            } else {
                // Modo bolinha: segue o cursor diretamente 1:1 sem delay na posição
                const curX = mouseX / zoom - SIZE / 2;
                const curY = mouseY / zoom - SIZE / 2;
                el.style.transform = `translate(${curX}px, ${curY}px)`;
            }
        };

        const onMouseMove = (e) => {
            const zoom = getZoomLevel();
            mouseX = e.clientX;
            mouseY = e.clientY;

            const card = findCardContainer(e.target, zoom);

            if (card !== activeCard) {
                activeCard = card;
                if (returnTimeout) clearTimeout(returnTimeout);

                if (activeCard) {
                    // Ao entrar em um card válido, ativa transição completa para derreter no formato
                    updatePosition(false);
                } else {
                    // Ao sair do card, anima transição de volta para a bolinha no cursor atual
                    const curX = mouseX / zoom - SIZE / 2;
                    const curY = mouseY / zoom - SIZE / 2;

                    el.style.transition   = T_MORPH;
                    el.style.width        = `${SIZE}px`;
                    el.style.height       = `${SIZE}px`;
                    el.style.borderRadius = '50%';
                    el.style.transform    = `translate(${curX}px, ${curY}px)`;

                    returnTimeout = setTimeout(() => {
                        if (!activeCard) {
                            el.style.transition = T_FREE;
                        }
                    }, 380);
                }
            } else if (!activeCard) {
                // Movimento livre fora de cards: posição 1:1 sem lag
                const curX = mouseX / zoom - SIZE / 2;
                const curY = mouseY / zoom - SIZE / 2;
                el.style.transform = `translate(${curX}px, ${curY}px)`;
            }
        };

        const onScroll = () => {
            if (activeCard) {
                if (!scrollRaf) {
                    scrollRaf = requestAnimationFrame(() => {
                        scrollRaf = null;
                        updatePosition(true); // Instant transform update on scroll!
                    });
                }
            }
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('scroll', onScroll);
            if (returnTimeout) clearTimeout(returnTimeout);
            if (scrollRaf) cancelAnimationFrame(scrollRaf);
        };
    }, []);

    if (isTouchDevice()) return null;

    return (
        <div
            ref={elRef}
            style={{
                position:      'fixed',
                top:           0,
                left:          0,
                width:         `${SIZE}px`,
                height:        `${SIZE}px`,
                borderRadius:  '50%',
                border:        '1.5px solid rgba(201, 168, 76, 0.5)',
                background:    'rgba(201, 168, 76, 0.04)',
                boxShadow:     'none',
                pointerEvents: 'none',
                zIndex:        99998,
                transition:    T_FREE,
                willChange:    'transform, width, height, border-radius',
                transform:     'translate(-200px, -200px)',
            }}
        />
    );
}
