import AboutMe from './AboutMe';
import Hero from './Hero';
import CareerEntranceScene from './CareerEntranceScene';

/** About owns its interactive state once; the layout gives that content
 * a place in the opening composition and in the career handoff. */
export default function AboutExperienceStory({ experiences }: { experiences: any[] }) {
    return (
        <AboutMe showIntro={false} renderLayout={({ profile, credentials, metrics, pillars }) => (
            <>
                <Hero profile={profile} credentials={credentials} metrics={metrics} />
                <CareerEntranceScene pillars={pillars} experiences={experiences} />
            </>
        )} />
    );
}
