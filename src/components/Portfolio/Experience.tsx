import React from 'react';
import { ProfessionalJourneyTimeline } from './ProfessionalJourneyTimeline';

export interface ExperienceProps {
    experiences?: any[];
    guidedIntro?: boolean;
    entrancePillars?: React.ReactNode;
}

export const Experience: React.FC<ExperienceProps> = ({ experiences = [], guidedIntro = false, entrancePillars }) => {
    return <ProfessionalJourneyTimeline experiences={experiences} guidedIntro={guidedIntro} entrancePillars={entrancePillars} />;
};

export default Experience;
