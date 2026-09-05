import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';

function DockTooltip({ label, shortcut, visible }) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.9 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-darker/95 border border-white/15 text-[10px] font-mono text-primary px-2.5 py-1 rounded-lg shadow-xl backdrop-blur-md pointer-events-none z-50"
                >
                    <span>{label}</span>
                    {shortcut && <span className="ml-1.5 text-accent/80">{shortcut}</span>}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function DockButton({ item, onClick, isActive }) {
    const [hovered, setHovered] = useState(false);

    if (item.id === 'divider') {
        return <div className="w-px h-6 bg-white/10 mx-1" />;
    }

    const isLink = Boolean(item.href);
    const Tag = isLink ? 'a' : 'button';
    const linkProps = isLink ? { href: item.href, target: '_blank', rel: 'noreferrer' } : {};

    return (
        <div className="relative flex items-center justify-center">
            <DockTooltip label={item.labelKey} shortcut={item.shortcut} visible={hovered} />
            <Tag
                {...linkProps}
                onClick={!isLink ? onClick : undefined}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                data-cursor-morph="true"
                className={`relative w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer group ${
                    isActive
                        ? 'bg-accent/20 text-accent border border-accent/30'
                        : 'text-primary/70 hover:text-white hover:bg-white/10 border border-transparent'
                }`}
            >
                <motion.i
                    className={`${item.icon} text-sm`}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                />
                {isActive && (
                    <motion.div
                        layoutId="dock-indicator"
                        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                )}
            </Tag>
        </div>
    );
}

export default function Dock({ 
    onToggleTelemetry, 
    isTelemetryOpen, 
    viewMode, 
    onToggleViewMode 
}) {
    const { palette, setPalette, palettes } = useTheme();
    const { lang } = useLanguage();
    const [mobileExpanded, setMobileExpanded] = useState(false);

    // Cycle through palette keys
    const paletteKeys = useMemo(() => Object.keys(palettes), [palettes]);
    const cycleTheme = useCallback(() => {
        const currentIdx = paletteKeys.indexOf(palette);
        const nextIdx = (currentIdx + 1) % paletteKeys.length;
        setPalette(paletteKeys[nextIdx]);
    }, [palette, paletteKeys, setPalette]);

    // Open Command Palette via global shortcut event
    const openCommandPalette = useCallback(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'k',
            ctrlKey: true,
            bubbles: true,
        }));
    }, []);

    const dockItems = useMemo(() => [
        { 
            id: 'cmd', 
            icon: 'fas fa-terminal', 
            labelKey: lang === 'en' ? 'Command Palette' : lang === 'es' ? 'Paleta de Comandos' : 'Paleta de Comandos', 
            shortcut: '⌘K' 
        },
        { 
            id: 'telemetry', 
            icon: 'fas fa-satellite-dish', 
            labelKey: lang === 'en' ? 'Live Telemetry' : lang === 'es' ? 'Telemetría en Vivo' : 'Telemetria ao Vivo' 
        },
        { 
            id: 'theme', 
            icon: 'fas fa-palette', 
            labelKey: lang === 'en' ? 'Cycle Theme' : lang === 'es' ? 'Cambiar Tema' : 'Alternar Tema' 
        },
        { 
            id: 'density', 
            icon: viewMode === 'grid' ? 'fas fa-list' : 'fas fa-th-large', 
            labelKey: viewMode === 'grid' 
                ? (lang === 'en' ? 'Switch to List' : lang === 'es' ? 'Ver en Lista' : 'Alternar para Lista') 
                : (lang === 'en' ? 'Switch to Grid' : lang === 'es' ? 'Ver en Grade' : 'Alternar para Grade') 
        },
        { id: 'divider' },
        { 
            id: 'github', 
            icon: 'fab fa-github', 
            labelKey: 'GitHub', 
            href: 'https://github.com/pedrhenriqueol' 
        },
        { 
            id: 'linkedin', 
            icon: 'fab fa-linkedin', 
            labelKey: 'LinkedIn', 
            href: 'https://www.linkedin.com/in/pedro-henrique-b0a015391/' 
        },
        { 
            id: 'email', 
            icon: 'fas fa-envelope', 
            labelKey: lang === 'en' ? 'Email' : 'E-mail', 
            href: 'mailto:pedrohc.forza@gmail.com' 
        },
    ], [lang, viewMode]);

    const handleClick = useCallback((id) => {
        switch (id) {
            case 'cmd':
                openCommandPalette();
                break;
            case 'telemetry':
                onToggleTelemetry?.();
                break;
            case 'theme':
                cycleTheme();
                break;
            case 'density':
                onToggleViewMode?.();
                break;
            default:
                break;
        }
    }, [openCommandPalette, onToggleTelemetry, cycleTheme, onToggleViewMode]);

    const getActiveState = useCallback((id) => {
        if (id === 'telemetry') return isTelemetryOpen;
        if (id === 'density') return viewMode === 'list';
        return false;
    }, [isTelemetryOpen, viewMode]);

    return (
        <>
            {/* ── Desktop Dock (Fixed bottom-center) ── */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="hidden lg:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-[9980] items-center gap-1.5 px-4 py-2 bg-black/65 border border-white/10 rounded-full backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
            >
                {dockItems.map((item, idx) => (
                    <DockButton
                        key={item.id || `divider-${idx}`}
                        item={item}
                        onClick={() => handleClick(item.id)}
                        isActive={getActiveState(item.id)}
                    />
                ))}
            </motion.div>

            {/* ── Mobile Floating Action Button ── */}
            <div className="lg:hidden fixed bottom-5 right-5 z-[9980]">
                <AnimatePresence>
                    {mobileExpanded && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="absolute bottom-14 right-0 flex flex-col gap-2 items-end"
                        >
                            {dockItems.filter(i => i.id !== 'divider').map((item) => {
                                const isLink = Boolean(item.href);
                                const Tag = isLink ? 'a' : 'button';
                                const linkProps = isLink ? { href: item.href, target: '_blank', rel: 'noreferrer' } : {};
                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <Tag
                                            {...linkProps}
                                            onClick={!isLink ? () => { handleClick(item.id); setMobileExpanded(false); } : undefined}
                                            className="flex items-center gap-2 px-3.5 py-2 bg-darker/95 border border-white/15 rounded-xl backdrop-blur-xl text-primary text-xs shadow-lg"
                                        >
                                            <i className={`${item.icon} text-accent w-4`} />
                                            <span>{item.labelKey}</span>
                                        </Tag>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMobileExpanded(v => !v)}
                    className="w-12 h-12 rounded-full bg-accent text-darker flex items-center justify-center shadow-xl cursor-pointer"
                    aria-label="Abrir Menu da Workstation"
                >
                    <motion.i
                        className={`fas ${mobileExpanded ? 'fa-times' : 'fa-rocket'} text-base`}
                        animate={{ rotate: mobileExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                    />
                </motion.button>
            </div>
        </>
    );
}
