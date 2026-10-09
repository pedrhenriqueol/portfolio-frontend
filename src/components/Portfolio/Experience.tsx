import React from 'react';
import { ProfessionalJourneyTimeline } from './ProfessionalJourneyTimeline';

export interface ExperienceProps {
    experiences?: any[];
    guidedIntro?: boolean;
}

export const Experience: React.FC<ExperienceProps> = ({ experiences = [], guidedIntro = false }) => {
    return <ProfessionalJourneyTimeline experiences={experiences} guidedIntro={guidedIntro} />;
};

export default Experience;
