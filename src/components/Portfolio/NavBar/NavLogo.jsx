export default function NavLogo({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="group flex items-center gap-3 shrink-0 select-none cursor-pointer"
            aria-label="Ir para o inicio"
        >
            {/* Terminal Vector Icon Badge */}
            <div className="relative flex items-center justify-center shrink-0">
                <svg
                    className="w-[38px] h-[36px] transition-all duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] group-hover:drop-shadow-[0_0_14px_rgba(255,255,255,0.2)]"
                    viewBox="0 0 42 38"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    shapeRendering="geometricPrecision"
                    textRendering="geometricPrecision"
                >
                    {/* Terminal Window Background */}
                    <rect
                        x="1"
                        y="1"
                        width="40"
                        height="36"
                        rx="6"
                        fill="#0C0D12"
                        stroke="rgba(255,255,255,0.22)"
                        strokeWidth="1.2"
                        className="group-hover:stroke-white/70 transition-colors"
                    />

                    {/* Header Line */}
                    <line x1="1" y1="11" x2="41" y2="11" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

                    {/* 3 Window Control Dots */}
                    <circle cx="6.5" cy="6" r="1.6" fill="#FF5F56" className="opacity-75 group-hover:opacity-100 transition-opacity" />
                    <circle cx="11.5" cy="6" r="1.6" fill="#FFBD2E" className="opacity-75 group-hover:opacity-100 transition-opacity" />
                    <circle cx="16.5" cy="6" r="1.6" fill="#27C93F" className="opacity-75 group-hover:opacity-100 transition-opacity" />

                    {/* Command Prompt > */}
                    <path
                        d="M 6.5 19.5 L 11.5 24.5 L 6.5 29.5"
                        stroke="#FFFFFF"
                        strokeOpacity="0.75"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* PH Monogram */}
                    <text
                        x="15"
                        y="28"
                        fill="#FFFFFF"
                        fontFamily="'JetBrains Mono', monospace, ui-monospace, monospace"
                        fontSize="12.5"
                        fontWeight="800"
                        letterSpacing="-0.5"
                    >
                        PH
                    </text>

                    {/* Live Blinking Cursor */}
                    <rect
                        x="33.5"
                        y="19"
                        width="2.5"
                        height="10"
                        rx="0.5"
                        fill="#27C93F"
                        className="animate-pulse group-hover:fill-white transition-colors"
                    />
                </svg>
            </div>

            {/* Name Branding */}
            <div className="flex flex-col text-left">
                <div className="flex items-center gap-0.5">
                    <span className="font-bold text-[13.5px] sm:text-[14.5px] tracking-[0.1em] text-secondary group-hover:text-white transition-colors duration-300 uppercase leading-snug">
                        Pedro Henrique
                    </span>
                    <span className="text-white font-bold text-base leading-none">.</span>
                </div>
                <span className="text-[9px] font-mono tracking-[0.16em] text-primary/70 group-hover:text-white/80 uppercase -mt-0.5 transition-colors">
                    dev // qa
                </span>
            </div>
        </button>
    );
}
