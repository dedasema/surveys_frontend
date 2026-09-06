import React from 'react';
import { AppLayout } from '../../../shared/layouts/AppLayout';
import { RagChatWidget } from '../RagChatWidget';

export const RagAssistantContainer: React.FC<{ role?: 'suscriptor' | 'admin' }> = ({ role = 'suscriptor' }) => {
  return (
    <AppLayout role={role}>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asistente RAG para Análisis de Encuestas</h1>
          <p className="text-sm text-gray-500 mt-1">
            Realizá preguntas analíticas en lenguaje natural sobre las respuestas recolectadas con citas verificadas
          </p>
        </div>

        <RagChatWidget isEmbedded={false} />
      </div>
    </AppLayout>
  );
};

export default RagAssistantContainer;
