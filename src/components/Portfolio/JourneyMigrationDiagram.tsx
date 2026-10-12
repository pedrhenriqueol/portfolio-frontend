import React from 'react';
import './journey-record.css';

const COPY = {
    pt: { label: 'Síntese técnica: modernização Delphi/VCL para Delphi 11 com UniGui; desenvolvimento React e TypeScript com APIs Laravel; otimização SQL Server e MySQL.', legacy: 'Modernização do legado', web: 'Desenvolvimento web', desktop: 'Aplicação desktop', browser: 'Interface no navegador', ui: 'Interface de gestão', api: 'API REST', data: 'Otimização de consultas', queries: 'SQL Server · MySQL', compact: 'Do legado para a web' },
    en: { label: 'Technical summary: modernization from Delphi/VCL to Delphi 11 with UniGui; React and TypeScript development with Laravel APIs; SQL Server and MySQL optimization.', legacy: 'Legacy modernization', web: 'Web development', desktop: 'Desktop application', browser: 'Browser interface', ui: 'Management interface', api: 'REST API', data: 'Query optimization', queries: 'SQL Server · MySQL', compact: 'From legacy to the web' },
    es: { label: 'Síntesis técnica: modernización Delphi/VCL a Delphi 11 con UniGui; desarrollo React y TypeScript con APIs Laravel; optimización SQL Server y MySQL.', legacy: 'Modernización del legado', web: 'Desarrollo web', desktop: 'Aplicación de escritorio', browser: 'Interfaz en el navegador', ui: 'Interfaz de gestión', api: 'API REST', data: 'Optimización de consultas', queries: 'SQL Server · MySQL', compact: 'Del legado a la web' },
};

/** An authored map of the actual work, deliberately separate from a product screenshot. */
export default function JourneyMigrationDiagram({ language = 'pt', compact = false }: { language?: string; compact?: boolean }) {
    const copy = COPY[language as keyof typeof COPY] || COPY.pt;
    if (compact) return (
        <span className="journey-migration-compact" aria-hidden="true">
            <span>{copy.compact}</span>
            <span className="journey-migration-compact-flow"><strong>Delphi / VCL</strong><span>→</span><strong>UniGui · Web</strong></span>
            <small>React · TypeScript · Laravel</small>
        </span>
    );
    return (
        <div className="journey-migration" role="img" aria-label={copy.label}>
            <div className="journey-migration-track">
                <span className="journey-migration-track-label">01 <span>{copy.legacy}</span></span>
                <div className="journey-migration-flow">
                    <div><small>{copy.desktop}</small><strong>Delphi / VCL</strong></div>
                    <span className="journey-migration-arrow" aria-hidden="true">→</span>
                    <div><small>{copy.browser}</small><strong>Delphi 11 + UniGui</strong></div>
                </div>
            </div>
            <div className="journey-migration-track">
                <span className="journey-migration-track-label">02 <span>{copy.web}</span></span>
                <div className="journey-migration-flow">
                    <div><small>{copy.ui}</small><strong>React + TypeScript</strong></div>
                    <span className="journey-migration-arrow" aria-hidden="true">↔</span>
                    <div><small>{copy.api}</small><strong>PHP + Laravel</strong></div>
                </div>
            </div>
            <div className="journey-migration-data"><span>{copy.data}</span><strong>{copy.queries}</strong></div>
        </div>
    );
}
