import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SERVICES = [
    {
        id: 'paystream',
        name: 'PayStream',
        icon: 'fas fa-coins',
        url: 'https://paystream-gateway.vercel.app',
        hint: 'Fintech Gateway',
    },
    {
        id: 'portlog',
        name: 'PortLog OS',
        icon: 'fas fa-ship',
        url: 'https://portlog-os.vercel.app',
        hint: 'Terminal Operations',
    },
    {
        id: 'spectr',
        name: 'SPECTR',
        icon: 'fas fa-vial',
        url: 'https://spectr-testops.vercel.app',
        hint: 'TestOps Platform',
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
        <span className={`inline-block w-2 h-2 rounded-full shadow-sm ${colorMap[status] || colorMap.checking}`} />
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
        const res = await fetch(service.url, {
            method: 'HEAD',
            mode: 'no-cors',
            signal: controller.signal,
        });
        clearTimeout(timeout);
        const latency = performance.now() - start;
        // no-cors always returns opaque response (status 0), so if it doesn't throw, it's reachable
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

    const runHealthCheck = async () => {
        if (isChecking) return;
        setIsChecking(true);

        // Mark all as checking
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

        // Broadcast average latency to StatusBar
        const latencies = Object.values(newResults).filter(r => r.latency !== null).map(r => r.latency);
        if (latencies.length > 0 && onLatencyUpdate) {
            const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
            onLatencyUpdate(Math.round(avg));
        }
    };

    // Initial background health check on mount to populate StatusBar
    useEffect(() => {
        runHealthCheck();
    }, []);

    // Auto-check on open and every 30s
    useEffect(() => {
        if (!isOpen) return;
        runHealthCheck();
        const interval = setInterval(runHealthCheck, 30000);
        return () => clearInterval(interval);
    }, [isOpen]);

    // Listen for manual health-check triggers (from Command Palette)
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
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, x: -20 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: 20, x: -20 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed bottom-20 left-4 z-[9970] w-80 max-w-[calc(100vw-2rem)]"
                >
                    <div className="bg-darker/95 border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-xl overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
                            <div className="flex items-center gap-2.5">
                                <div className="relative">
                                    <i className="fas fa-satellite-dish text-accent text-xs" />
                                    {summary.allHealthy && (
                                        <motion.span
                                            className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-400 rounded-full"
                                            animate={{ scale: [1, 1.3, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                        />
                                    )}
                                </div>
                                <span className="text-[11px] font-mono font-semibold text-primary uppercase tracking-wider">
                                    Live Telemetry
                                </span>
                                <span className="text-[9px] font-mono text-accent/70 bg-accent/10 px-1.5 py-0.5 rounded">
                                    {summary.healthy}/{summary.total}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setMinimized(v => !v)}
                                    className="w-6 h-6 flex items-center justify-center text-primary/50 hover:text-primary rounded transition-colors cursor-pointer"
                                    title={minimized ? 'Expandir' : 'Minimizar'}
                                >
                                    <i className={`fas ${minimized ? 'fa-chevron-up' : 'fa-chevron-down'} text-[9px]`} />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-6 h-6 flex items-center justify-center text-primary/50 hover:text-white rounded transition-colors cursor-pointer"
                                    title="Fechar"
                                >
                                    <i className="fas fa-times text-[9px]" />
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <AnimatePresence>
                            {!minimized && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-3 space-y-2">
                                        {SERVICES.map((s) => {
                                            const r = results[s.id];
                                            return (
                                                <motion.div
                                                    key={s.id}
                                                    layout
                                                    className="flex items-center gap-3 px-3 py-2.5 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-colors"
                                                >
                                                    <StatusDot status={r.status} />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <i className={`${s.icon} text-accent/70 text-[10px]`} />
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
                                                </motion.div>
                                            );
                                        })}
                                    </div>

                                    {/* Footer: Re-check button */}
                                    <div className="px-3 pb-3">
                                        <button
                                            onClick={runHealthCheck}
                                            disabled={isChecking}
                                            data-cursor-morph="true"
                                            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-accent/10 border border-accent/20 text-accent text-[11px] font-semibold rounded-xl hover:bg-accent/20 hover:border-accent/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            <motion.i
                                                className="fas fa-sync-alt text-[10px]"
                                                animate={isChecking ? { rotate: 360 } : { rotate: 0 }}
                                                transition={isChecking ? { repeat: Infinity, duration: 1, ease: 'linear' } : {}}
                                            />
                                            <span>{isChecking ? 'Verificando...' : 'Re-check Agora'}</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
