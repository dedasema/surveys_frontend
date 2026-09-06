import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../../shared/layouts/AppLayout';
import { ClusterDashboard } from '../ClusterDashboard';
import { Target } from 'lucide-react';

export const ClustersContainer: React.FC<{ role?: 'suscriptor' | 'admin' }> = ({ role = 'suscriptor' }) => {
  const [campaigns, setCampaigns] = useState<Array<{ id: string | number; nombre: string }>>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | number>('1');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://surveys-backend-83d9.onrender.com';
        const res = await fetch(`${API_BASE_URL}/campanas`);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.campanas || [];
          setCampaigns(list);
          if (list.length > 0) {
            setSelectedCampaignId(list[0].id);
          }
        }
      } catch {
        // Fallback default campaign
        setCampaigns([
          { id: '1', nombre: 'Encuesta de Satisfacción Q3' },
          { id: '2', nombre: 'Feedback Post-Venta Automotriz' },
        ]);
      }
    };
    fetchCampaigns();
  }, []);

  return (
    <AppLayout role={role}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header con selector de campaña */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clusters Semánticos de Respuestas</h1>
            <p className="text-sm text-gray-500 mt-1">
              Agrupamiento automático de respuestas abiertas utilizando embeddings y Gemini
            </p>
          </div>

          {campaigns.length > 0 && (
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-xs">
              <Target className="w-4 h-4 text-indigo-600" />
              <select
                value={selectedCampaignId}
                onChange={(e) => setSelectedCampaignId(e.target.value)}
                className="text-sm font-medium text-gray-700 bg-transparent focus:outline-none cursor-pointer"
              >
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <ClusterDashboard campanaId={selectedCampaignId} />
      </div>
    </AppLayout>
  );
};

export default ClustersContainer;
