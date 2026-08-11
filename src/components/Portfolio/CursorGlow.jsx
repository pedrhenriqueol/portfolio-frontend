import { useEffect, useRef } from 'react';

const isTouchDevice = () =>
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

const SIZE = 20; // Diâmetro padrão da bolinha (px)

const BEZIER = 'cubic-bezier(0.16, 1, 0.3, 1)';
const T_MORPH = `transform 0.35s ${BEZIER}, width 0.35s ${BEZIER}, height 0.35s ${BEZIER}, border-radius 0.35s ${BEZIER}, opacity 0.2s ease`;
const T_FREE  = `width 0.3s ${BEZIER}, height 0.3s ${BEZIER}, border-radius 0.3s ${BEZIER}, opacity 0.2s ease`;

function getZoomLevel() {
    if (typeof window === 'undefined') return 1;
    return parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
}

/** Busca automaticamente qualquer elemento que se comporte como um card */
function findCardContainer(el, zoom) {
    if (!el || el === document.body || el === document.documentElement) return null;

    let curr = el;
    while (curr && curr !== document.body && curr !== document.documentElement) {
        if (['SECTION', 'MAIN', 'NAV', 'HEADER', 'FOOTER', 'BODY', 'HTML'].includes(curr.tagName)) break;

        // Se marcado explicitamente
        if (curr.hasAttribute('data-cursor-morph') || curr.classList.contains('cursor-morph')) {
            return curr;
        }

        const className = typeof curr.className === 'string' ? curr.className : '';
        const isCardCandidate =
            className.includes('rounded-') ||
            className.includes('card') ||
            className.includes('group');

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
                // Garante dimensão de um card (não o site inteiro e nem uma tag minúscula)
                if (w >= 70 && h >= 40 && w <= (window.innerWidth / zoom) * 0.95) {
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

        /* Atualiza a posição da bolinha/card (compensando o zoom: 0.8 do CSS) */
        const updatePosition = () => {
            const zoom = getZoomLevel();

            if (activeCard) {
                const rect = activeCard.getBoundingClientRect();
                const style = getComputedStyle(activeCard);
                const radius = style.borderRadius || '12px';

                const left = rect.left / zoom;
                const top  = rect.top / zoom;
                const w    = rect.width / zoom;
                const h    = rect.height / zoom;

                el.style.transition   = T_MORPH;
                el.style.width        = `${w}px`;
                el.style.height       = `${h}px`;
                el.style.borderRadius = radius;
                el.style.transform    = `translate(${left}px, ${top}px)`;
            } else {
                // Modo bolinha: compensa o zoom para alinhar 100% com a ponta do cursor
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
                    updatePosition();
                } else {
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
                    }, 350);
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
                updatePosition();
            }
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('scroll', onScroll);
            if (returnTimeout) clearTimeout(returnTimeout);
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
                border:        '1.5px solid rgba(102, 252, 241, 0.75)',
                background:    'rgba(102, 252, 241, 0.04)',
                boxShadow:     '0 0 16px rgba(102, 252, 241, 0.18)',
                pointerEvents: 'none',
                zIndex:        99998,
                transition:    T_FREE,
                willChange:    'transform, width, height, border-radius',
                transform:     'translate(-200px, -200px)',
            }}
        />
    );
}
