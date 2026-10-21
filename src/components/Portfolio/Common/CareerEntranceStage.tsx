import { useRef, type ReactNode } from 'react';
import { useCareerEntrance } from '../../../hooks/useCareerEntrance';
import '../career-entrance.css';

export default function CareerEntranceStage({ pillars, children, onProgress }: {
    pillars: ReactNode;
    children: ReactNode;
    onProgress: (progress: number) => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    useCareerEntrance(ref, onProgress);
    return (
        <div ref={ref} className="career-entrance-track">
            <div id="experiencia" className="career-scene-anchor" aria-hidden="true" />
            <div className="career-entrance-frame">
                <svg className="career-scene-thread" aria-hidden="true" focusable="false" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="career-laser-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.35" />
                            <stop offset="55%" stopColor="var(--color-accent)" stopOpacity="0.95" />
                            <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity="1" />
                        </linearGradient>
                    </defs>
                    <path data-career-thread-base fill="none" />
                    <path data-career-thread-active fill="none" pathLength="1" />
                    <circle data-career-thread-halo r="9" />
                    <circle data-career-thread-orb r="3.8" />
                </svg>
                <div className="career-pillars-layout">
                    <div className="career-pillars-motion">{pillars}</div>
                </div>
                <div className="career-incoming-layout">
                    <div className="career-incoming-motion">{children}</div>
                </div>
            </div>
        </div>
    );
}
