import AboutMe from './AboutMe';
import Hero from './Hero';
import CareerEntranceScene from './CareerEntranceScene';

/** About owns its interactive state once; the layout gives that content
 * a place in the opening composition and in the career handoff. */
export default function AboutExperienceStory({ experiences, isLoaded = true }: { experiences: any[]; isLoaded?: boolean }) {
    return (
        <AboutMe showIntro={false} renderLayout={({ profile, credentials, metrics, pillars }) => (
            <>
                <Hero profile={profile} credentials={credentials} metrics={metrics} isLoaded={isLoaded} />
                <CareerEntranceScene pillars={pillars} experiences={experiences} />
            </>
        )} />
    );
}
