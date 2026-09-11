import React, { memo } from 'react';

/**
 * FixedBackdrop - Camada de Ambiente Fixo Monolítico (Padrão Rauno Freiberg & Linear)
 * 
 * - Substrato contínuo e absoluto em #05070a
 * - Iluminação especular ambiente suave no topo da viewport:
 *   radial-gradient(circle at 50% -10%, rgba(255, 255, 255, 0.035) 0%, transparent 60%)
 * - Permanece estático e imóvel durante o scroll com -z-10
 */
export const FixedBackdrop: React.FC = memo(function FixedBackdrop() {
    return (
        <div
            aria-hidden="true"
            className="fixed inset-0 pointer-events-none -z-10 bg-[#05070a] overflow-hidden"
        >
            {/* Iluminação Especular Ambiente Suave no Topo */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(circle at 50% -10%, rgba(255, 255, 255, 0.04) 0%, transparent 60%)',
                }}
            />
        </div>
    );
});

export default FixedBackdrop;
