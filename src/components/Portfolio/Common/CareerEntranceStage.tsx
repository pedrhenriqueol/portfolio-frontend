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
                    <path data-career-thread-base fill="none" vectorEffect="non-scaling-stroke" />
                    <path data-career-thread-active fill="none" vectorEffect="non-scaling-stroke" pathLength="1" />
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
