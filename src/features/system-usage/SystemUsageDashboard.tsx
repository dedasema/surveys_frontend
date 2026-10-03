import React, { useState, useEffect, useCallback } from 'react';
import { Activity, RefreshCw, BarChart2 } from 'lucide-react';
import { toast } from 'sonner';
import { usageApi } from './services/usageApi';
import { SystemUsageMetricsResponse } from './types';
import UsageKpiCards from './components/UsageKpiCards';
import DailyUsageChart from './components/DailyUsageChart';
import CudOperationsDonut from './components/CudOperationsDonut';
import TopUsersRanking from './components/TopUsersRanking';

export interface SystemUsageDashboardProps {
  empresaId?: string | number;
}

export const SystemUsageDashboard: React.FC<SystemUsageDashboardProps> = ({ empresaId }) => {
  const [data, setData] = useState<SystemUsageMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number>(30);

  const fetchUsage = useCallback(
    async (isInitial = false) => {
      try {
        if (isInitial) setLoading(true);
        else setChartLoading(true);

        const res = await usageApi.getSystemUsage(selectedDays, empresaId);
        setData(res);
      } catch {
        toast.error('Error al cargar métricas de uso del sistema');
      } finally {
        setLoading(false);
        setChartLoading(false);
      }
    },
    [selectedDays, empresaId]
  );

  useEffect(() => {
    fetchUsage(true);
  }, [fetchUsage]);

  const handleDaysChange = (days: number) => {
    setSelectedDays(days);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-xs">
            <BarChart2 className="w-7 h-7" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Métricas de Uso del Sistema</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Consumo de almacenamiento, facturación acumulada, transacciones y operadores más activos
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchUsage(false)}
          disabled={loading || chartLoading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading || chartLoading ? 'animate-spin' : ''}`} />
          Actualizar Métricas
        </button>
      </div>

      {loading || !data ? (
        <div className="p-16 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium">Cargando métricas analíticas del sistema...</p>
        </div>
      ) : (
        <>
          {/* 1. KPIs Superiores */}
          <UsageKpiCards data={data} />

          {/* 2. Gráficos de Actividad Diaria y Distribución CUD */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DailyUsageChart
                data={data.grafica_dias_mayor_uso}
                diaPico={data.dia_pico}
                selectedDays={selectedDays}
                onDaysChange={handleDaysChange}
                loading={chartLoading}
              />
            </div>
            <div className="lg:col-span-1">
              <CudOperationsDonut cudData={data.tipos_operaciones_cud} />
            </div>
          </div>

          {/* 3. Ranking Top 5 Usuarios */}
          <TopUsersRanking usuarios={data.top_5_usuarios} />
        </>
      )}
    </div>
  );
};

export default SystemUsageDashboard;
