/**
 * Web Audio Haptics & Sound Design Utility
 * Sintetizador sonoro nativo via Web Audio API (Zero dependências externas, 0kB assets).
 * Padrão: Desativado por padrão (muted: true) para cortesia de UX.
 */

let audioCtx = null;

function getAudioContext() {
    if (typeof window === 'undefined') return null;
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
    }
    return audioCtx;
}

// ── Gerenciamento de Estado Global de Áudio ──
const MUTE_STORAGE_KEY = 'portfolio_audio_muted';

export function isMuted() {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem(MUTE_STORAGE_KEY);
    // Padrão: mutado (true) a menos que o usuário tenha explicitamente ativado ('false')
    return stored === null ? true : stored === 'true';
}

export function setMuted(muted) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(MUTE_STORAGE_KEY, String(muted));
    window.dispatchEvent(new CustomEvent('audio-mute-change', { detail: { muted } }));
}

export function toggleMute() {
    const current = isMuted();
    const next = !current;
    setMuted(next);
    if (!next) {
        // Toca um feedback sonoro imediato ao ativar
        playSuccessTone();
    }
    return next;
}

// ── Sintetizadores de Áudio Tátil ──

/**
 * Clique mecânico de alta frequência com queda exponencial (15ms).
 * Ideal para: botões de dock, switches e cliques secos de interface.
 */
export function playMechanicalClick() {
    if (isMuted()) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.015);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.015);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.018);
    } catch {
        // Ignora silenciosamente restrições de autoplay
    }
}

/**
 * Resposta háptica suave de alternância de aba (480Hz -> 540Hz, 35ms).
 * Ideal para: navegação entre abas e filtros de categorias.
 */
export function playTabSwitch() {
    if (isMuted()) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(480, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(540, ctx.currentTime + 0.035);

        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.045);
    } catch {}
}

/**
 * Micro-tick mecânico de altíssima frequência (1800Hz, 8ms).
 * Ideal para: arraste do cursor da cortina Legacy-to-Modern e sliders de simulação.
 */
export function playSliderTick(variation = 0) {
    if (isMuted()) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const baseFreq = 1600 + Math.min(Math.max(variation * 400, -300), 500);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);

        gain.gain.setValueAtTime(0.035, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.008);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.01);
    } catch {}
}

/**
 * Pulso de sonar/telemetria para varredura de ping de microsserviço (680Hz).
 */
export function playPingPulse() {
    if (isMuted()) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(680, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.07, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch {}
}

/**
 * Acorde harmônico sutil de sucesso / confirmação (duas notas em quinta justa).
 */
export function playSuccessTone() {
    if (isMuted()) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const notes = [523.25, 659.25]; // C5, E5
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.03);

            gain.gain.setValueAtTime(0.05, ctx.currentTime + i * 0.03);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12 + i * 0.03);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime + i * 0.03);
            osc.stop(ctx.currentTime + 0.14 + i * 0.03);
        });
    } catch {}
}
