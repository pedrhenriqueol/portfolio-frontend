import React from 'react';
import ProfessionalJourneyTimeline from './ProfessionalJourneyTimeline';

export default function ExperienceSection({ experiences = [] }) {
    return <ProfessionalJourneyTimeline experiences={experiences} />;
}
