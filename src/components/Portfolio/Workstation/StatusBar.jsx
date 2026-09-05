import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

function formatUTCOffset() {
    const offset = -(new Date().getTimezoneOffset());
    const sign = offset >= 0 ? '+' : '-';
    const hours = Math.abs(Math.floor(offset / 60));
    return `UTC${sign}${hours}`;
}

function formatTime() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export default function StatusBar({ avgLatency }) {
    const [time, setTime] = useState(formatTime());

    useEffect(() => {
        const interval = setInterval(() => setTime(formatTime()), 10000);
        return () => clearInterval(interval);
    }, []);

    const utcLabel = useMemo(() => formatUTCOffset(), []);

    const latencyColor = useMemo(() => {
        if (avgLatency === null || avgLatency === undefined) return 'text-primary/50';
        if (avgLatency < 200) return 'text-green-400';
        if (avgLatency < 500) return 'text-yellow-400';
        return 'text-red-400';
    }, [avgLatency]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.4 }}
            className="hidden lg:flex fixed bottom-0 left-0 right-0 z-[9975] h-6 items-center justify-between px-4 bg-darker/90 border-t border-white/8 backdrop-blur-md text-[10px] font-mono"
        >
            {/* Left side */}
            <div className="flex items-center gap-3">
                <span className="text-accent/80 font-semibold flex items-center gap-1.5">
                    <i className="fas fa-code-branch text-[8px]" />
                    v2.4.0-exp
                </span>
                <span className="text-primary/30">│</span>
                <span className="text-primary/60 flex items-center gap-1">
                    <i className="fas fa-flask text-[8px] text-accent/50" />
                    workstation
                </span>
            </div>

            {/* Center */}
            <div className="flex items-center gap-2">
                <span className="text-primary/50">
                    {utcLabel} • {time}
                </span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
                {avgLatency !== null && avgLatency !== undefined ? (
                    <span className={`flex items-center gap-1 ${latencyColor}`}>
                        <i className="fas fa-signal text-[8px]" />
                        {Math.round(avgLatency)}ms avg
                    </span>
                ) : (
                    <span className="text-primary/40 flex items-center gap-1">
                        <i className="fas fa-signal text-[8px]" />
                        —
                    </span>
                )}
                <span className="text-primary/30">│</span>
                <span className="text-primary/50 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                    online
                </span>
            </div>
        </motion.div>
    );
}
