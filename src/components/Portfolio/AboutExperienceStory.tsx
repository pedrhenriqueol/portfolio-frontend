import { useRef } from 'react';
import AboutMe from './AboutMe';
import Experience from './Experience';
import ScrollChapter from './Common/ScrollChapter';
import TechCompanionCritter from './TechCompanionCritter';
import { useJourneyHandoff } from '../../hooks/useJourneyHandoff';

/** A local corridor carries the original guide from the Bento to its header.
 * The rail is outside section transforms and ends before the career metrics.
 */
export default function AboutExperienceStory({ experiences }: { experiences: any[] }) {
    const ref = useRef<HTMLDivElement>(null);
    useJourneyHandoff(ref);
    return (
        <div ref={ref} className="journey-story">
            <AboutMe showIntro={false} />
            <div className="journey-guide-rail">
                <div className="journey-guide-sticky">
                    <TechCompanionCritter
                        variant="sentinel-timeline"
                        captionPosition="top"
                        portraitClassName="journey-guide-portrait"
                    />
                </div>
            </div>
            <ScrollChapter><Experience experiences={experiences} guidedIntro /></ScrollChapter>
        </div>
    );
}
