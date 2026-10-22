import type { ReactNode } from 'react';
import '../career-entrance.css';

export default function CareerEntranceStage({ pillars, children }: {
    pillars?: ReactNode;
    children: ReactNode;
    onProgress?: (progress: number) => void;
}) {
    return (
        <>
            {pillars && (
                <div className="career-pillars-bridge">
                    {pillars}
                </div>
            )}
            {children}
        </>
    );
}
