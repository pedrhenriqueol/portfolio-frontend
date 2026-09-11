import React from 'react';
import { ProfessionalJourneyTimeline } from './ProfessionalJourneyTimeline';

export interface ExperienceProps {
    experiences?: any[];
}

export const Experience: React.FC<ExperienceProps> = ({ experiences = [] }) => {
    return <ProfessionalJourneyTimeline experiences={experiences} />;
};

export default Experience;
