import { useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';

/* ── Sound Engine: sons sutis de UI ──
 * Usa Web Audio API — sem dependências externas.
 * O som começa mudo e precisa do usuário interagir primeiro (política do navegador).
 */

const SOUNDS = {
    click: (ctx, accent) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.setValueAtTime(600, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
        g.gain.setValueAtTime(0.04, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
        o.type = 'sine';
        o.start(ctx.currentTime);
        o.stop(ctx.currentTime + 0.1);
    },
    hover: (ctx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.setValueAtTime(800, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.04);
        g.gain.setValueAtTime(0.015, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        o.type = 'sine';
        o.start(ctx.currentTime);
        o.stop(ctx.currentTime + 0.06);
    },
    themeSwitch: (ctx) => {
        [0, 0.06, 0.12].forEach((delay, i) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            const freq = 500 + i * 150;
            o.frequency.setValueAtTime(freq, ctx.currentTime + delay);
            g.gain.setValueAtTime(0.04, ctx.currentTime + delay);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.08);
            o.type = 'triangle';
            o.start(ctx.currentTime + delay);
            o.stop(ctx.currentTime + delay + 0.1);
        });
    },
    open: (ctx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.setValueAtTime(400, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.12);
        g.gain.setValueAtTime(0.04, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        o.type = 'triangle';
        o.start(ctx.currentTime);
        o.stop(ctx.currentTime + 0.18);
    },
};

let _ctx = null;
let _muted = false;

function getCtx() {
    if (!_ctx) {
        try { _ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    }
    return _ctx;
}

/** Public API para tocar sons de UI */
export function playSound(type) {
    if (_muted) return;
    const ctx = getCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const fn = SOUNDS[type];
    if (fn) fn(ctx);
}

export default function SoundEngine() {
    const { palette } = useTheme();
    const prevPaletteRef = useRef(palette);
    const initializedRef = useRef(false);

    /* Toca som ao trocar de tema */
    useEffect(() => {
        if (!initializedRef.current) { initializedRef.current = true; return; }
        if (prevPaletteRef.current !== palette) {
            prevPaletteRef.current = palette;
            playSound('themeSwitch');
        }
    }, [palette]);

    /* Intercepta clicks globais para som */
    useEffect(() => {
        const onClick = (e) => {
            const el = e.target.closest('button, a, [role="button"]');
            if (el) playSound('click');
        };
        window.addEventListener('click', onClick, { passive: true });
        return () => window.removeEventListener('click', onClick);
    }, []);

    return null; // sem UI
}

/** Hook utilitário para tocar som de hover */
export function useSoundHover() {
    return useCallback(() => playSound('hover'), []);
}
