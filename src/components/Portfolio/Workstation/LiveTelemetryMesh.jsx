import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playMechanicalClick, playPingPulse } from '../../../lib/sound';

const SERVICES = [
    {
        id: 'paystream',
        name: 'PayStream Gateway',
        icon: 'fas fa-coins',
        url: 'https://paystream-gateaway.vercel.app',
        hint: 'Fintech Core & Split',
    },
    {
        id: 'portlog',
        name: 'PortLog OS',
        icon: 'fas fa-ship',
        url: 'https://portlog-os.vercel.app',
        hint: 'Terminal Ops & IoT',
    },
    {
        id: 'spectr',
        name: 'SPECTR TestOps',
        icon: 'fas fa-vial',
        url: 'https://spectr-testops.vercel.app',
        hint: 'Observability & SLA',
    },
];

function StatusDot({ status }) {
    const colorMap = {
        healthy: 'bg-green-400 shadow-green-400/50',
        degraded: 'bg-yellow-400 shadow-yellow-400/50',
        down: 'bg-red-400 shadow-red-400/50',
        checking: 'bg-blue-400 shadow-blue-400/50 animate-pulse',
    };
    return (
        <span className={`inline-block w-2 h-2 rounded-full shadow-xs ${colorMap[status] || colorMap.checking}`} />
    );
}

function formatLatency(ms) {
    if (ms === null || ms === undefined) return '—';
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
}

function relativeTime(ts) {
    if (!ts) return '';
    const diff = Math.round((Date.now() - ts) / 1000);
    if (diff < 5) return 'agora';
    if (diff < 60) return `há ${diff}s`;
    return `há ${Math.round(diff / 60)}min`;
}

async function checkHealth(service) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const start = performance.now();

    try {
        await fetch(service.url, {
            method: 'HEAD',
            mode: 'no-cors',
            signal: controller.signal,
        });
        clearTimeout(timeout);
        const latency = performance.now() - start;
        return { status: 'healthy', latency, timestamp: Date.now() };
    } catch (err) {
        clearTimeout(timeout);
        if (err.name === 'AbortError') {
            return { status: 'degraded', latency: 8000, timestamp: Date.now() };
        }
        return { status: 'down', latency: null, timestamp: Date.now() };
    }
}

export default function LiveTelemetryMesh({ isOpen, onClose, onLatencyUpdate }) {
    const [results, setResults] = useState(() =>
        Object.fromEntries(SERVICES.map(s => [s.id, { status: 'checking', latency: null, timestamp: null }]))
    );
    const [isChecking, setIsChecking] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const windowRef = useRef(null);

    const runHealthCheck = async () => {
        if (isChecking) return;
        setIsChecking(true);
        playPingPulse();

        // Marca todos como checando
        setResults(prev =>
            Object.fromEntries(SERVICES.map(s => [s.id, { ...prev[s.id], status: 'checking' }]))
        );

        const checks = await Promise.all(
            SERVICES.map(async (s) => {
                const result = await checkHealth(s);
                return [s.id, result];
            })
        );

        const newResults = Object.fromEntries(checks);
        setResults(newResults);
        setIsChecking(false);

        // Notifica a StatusBar com a média calculada
        const latencies = Object.values(newResults).filter(r => r.latency !== null).map(r => r.latency);
        if (latencies.length > 0 && onLatencyUpdate) {
            const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
            onLatencyUpdate(Math.round(avg));
        }
    };

    // Health check inicial no mount
    useEffect(() => {
        runHealthCheck();
    }, []);

    // Auto-check a cada 30 segundos
    useEffect(() => {
        if (!isOpen) return;
        const interval = setInterval(runHealthCheck, 30000);
        return () => clearInterval(interval);
    }, [isOpen]);

    // Escuta triggers externos da Command Palette
    useEffect(() => {
        const handler = () => runHealthCheck();
        window.addEventListener('trigger-health-check', handler);
        return () => window.removeEventListener('trigger-health-check', handler);
    }, []);

    const summary = useMemo(() => {
        const vals = Object.values(results);
        const healthy = vals.filter(v => v.status === 'healthy').length;
        const total = vals.length;
        return { healthy, total, allHealthy: healthy === total };
    }, [results]);

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    key="telemetry-window"
                    ref={windowRef}
                    drag
                    dragMomentum={false}
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed bottom-24 left-6 z-[9970] w-84 max-w-[calc(100vw-2rem)] select-none shadow-[0_25px_70px_rgba(0,0,0,0.85)]"
                >
                    <div className="bg-[#0D1017]/95 border border-white/15 rounded-2xl backdrop-blur-2xl overflow-hidden">
                        {/* ── Barra de Título Estilo OS com Drag Handle & Controles ── */}
                        <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#141824] border-b border-white/10 cursor-grab active:cursor-grabbing">
                            {/* Window Controls (Red/Yellow/Green) */}
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => { playMechanicalClick(); onClose(); }}
                                    className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center group"
                                    title="Fechar"
                                >
                                    <span className="opacity-0 group-hover:opacity-100 text-[8px] text-black font-bold">×</span>
                                </button>
                                <button
                                    onClick={() => { playMechanicalClick(); setMinimized(v => !v); }}
                                    className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center group"
                                    title={minimized ? 'Restaurar' : 'Minimizar'}
                                >
                                    <span className="opacity-0 group-hover:opacity-100 text-[8px] text-black font-bold">−</span>
                                </button>
                                <button
                                    onClick={() => { playMechanicalClick(); runHealthCheck(); }}
                                    className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center group"
                                    title="Executar Ping Imediato"
                                >
                                    <span className="opacity-0 group-hover:opacity-100 text-[6px] text-black font-bold">↻</span>
                                </button>
                            </div>

                            {/* Window Title */}
                            <div className="flex items-center gap-2">
                                <i className="fas fa-terminal text-[10px] text-accent" />
                                <span className="text-[11px] font-mono font-semibold text-white/90">
                                    telemetry.mesh
                                </span>
                            </div>

                            {/* Badge de Status */}
                            <span className="text-[9px] font-mono text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full">
                                {summary.healthy}/{summary.total} UP
                            </span>
                        </div>

                        {/* ── Corpo da Janela de Telemetria ── */}
                        <AnimatePresence mode="wait">
                            {!minimized ? (
                                <motion.div
                                    key="telemetry-expanded-body"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-3 space-y-2">
                                        {SERVICES.map((s) => {
                                            const r = results[s.id];
                                            return (
                                                <div
                                                    key={s.id}
                                                    className="flex items-center gap-3 px-3 py-2 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-colors"
                                                >
                                                    <StatusDot status={r.status} />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <i className={`${s.icon} text-accent/80 text-[10px]`} />
                                                            <span className="text-xs font-semibold text-white truncate">{s.name}</span>
                                                        </div>
                                                        <span className="text-[10px] font-mono text-primary/50">{s.hint}</span>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <div className={`text-xs font-mono font-semibold ${
                                                            r.status === 'healthy' ? 'text-green-400'
                                                            : r.status === 'degraded' ? 'text-yellow-400'
                                                            : r.status === 'down' ? 'text-red-400'
                                                            : 'text-blue-400'
                                                        }`}>
                                                            {r.status === 'checking' ? '...' : formatLatency(r.latency)}
                                                        </div>
                                                        <div className="text-[9px] font-mono text-primary/40">
                                                            {relativeTime(r.timestamp)}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Botão de Varredura / Re-check */}
                                    <div className="px-3 pb-3">
                                        <button
                                            onClick={() => { playMechanicalClick(); runHealthCheck(); }}
                                            disabled={isChecking}
                                            data-cursor-morph="true"
                                            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-accent/15 border border-accent/30 text-accent text-xs font-semibold rounded-xl hover:bg-accent hover:text-darker transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            <motion.i
                                                className="fas fa-sync-alt text-[10px]"
                                                animate={isChecking ? { rotate: 360 } : { rotate: 0 }}
                                                transition={isChecking ? { repeat: Infinity, duration: 1, ease: 'linear' } : {}}
                                            />
                                            <span>{isChecking ? 'Verificando Endpoints...' : 'Varredura de Produção'}</span>
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="telemetry-minimized-body"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="px-4 py-2 flex items-center justify-between text-xs font-mono text-primary/70"
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                        Monitor ativo em background
                                    </span>
                                    <button
                                        onClick={() => { playMechanicalClick(); setMinimized(false); }}
                                        className="text-accent text-[11px] hover:underline cursor-pointer"
                                    >
                                        Restaurar
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
