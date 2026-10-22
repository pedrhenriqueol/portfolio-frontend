import type { ReactNode } from 'react';
import '../career-entrance.css';

export default function CareerEntranceStage({
    pillars,
    opening,
    children,
}: {
    pillars?: ReactNode;
    opening: ReactNode;
    children: ReactNode;
}) {
    if (!pillars) {
        return (
            <>
                {opening}
                {children}
            </>
        );
    }

    return (
        <>
            <div className="career-entrance-track">
                <div id="experiencia" className="career-scene-anchor" aria-hidden="true" />
                <div className="career-entrance-frame">
                    <svg
                        className="career-entrance-thread"
                        aria-hidden="true"
                        focusable="false"
                        preserveAspectRatio="none"
                    >
                        <path data-pillar-base="0" className="career-entrance-path-base" fill="none" />
                        <path data-pillar-base="1" className="career-entrance-path-base" fill="none" />
                        <path data-pillar-base="2" className="career-entrance-path-base" fill="none" />
                        <path data-pillar-active="0" className="career-entrance-path-active" pathLength="1" fill="none" />
                        <path data-pillar-active="1" className="career-entrance-path-active" pathLength="1" fill="none" />
                        <path data-pillar-active="2" className="career-entrance-path-active" pathLength="1" fill="none" />
                        <path data-entrance-spine-base className="career-entrance-path-base" fill="none" />
                        <path data-entrance-spine-active className="career-entrance-path-active" pathLength="1" fill="none" />
                        <circle data-entrance-traveller-halo className="career-entrance-orb-halo" r="9" />
                        <circle data-entrance-traveller className="career-entrance-orb-core" r="3.5" />
                    </svg>

                    <div className="career-pillars-layout">
                        <div className="career-pillars-motion">{pillars}</div>
                    </div>

                    <div className="career-opening-layout">
                        <div className="career-opening-motion">{opening}</div>
                    </div>
                </div>
            </div>
            {children}
        </>
    );
}
