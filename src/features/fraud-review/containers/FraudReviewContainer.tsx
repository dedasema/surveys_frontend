import React from 'react';
import { AppLayout } from '../../../shared/layouts/AppLayout';
import { FraudReviewQueue } from '../FraudReviewQueue';

export const FraudReviewContainer: React.FC<{ role?: 'suscriptor' | 'admin' }> = ({ role = 'suscriptor' }) => {
  return (
    <AppLayout role={role}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Revisión de Fraude</h1>
            <p className="text-sm text-gray-500 mt-1">
              Validación y moderación humana para respuestas marcadas por reglas, similitud semántica o score IA
            </p>
          </div>
        </div>

        <FraudReviewQueue />
      </div>
    </AppLayout>
  );
};

export default FraudReviewContainer;
