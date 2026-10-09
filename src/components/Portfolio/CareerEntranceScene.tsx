import type { ReactNode } from 'react';
import Experience from './Experience';

/** The existing pillars and the first career milestone share one local frame. */
export default function CareerEntranceScene({ pillars, experiences }: { pillars: ReactNode; experiences: any[] }) {
    return <Experience experiences={experiences} entrancePillars={pillars} />;
}
