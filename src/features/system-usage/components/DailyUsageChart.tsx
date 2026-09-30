import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Flame, Calendar, Activity } from 'lucide-react';
import { GraficaDiaUso, DiaPicoInfo } from '../types';

export interface DailyUsageChartProps {
  data: GraficaDiaUso[];
  diaPico: DiaPicoInfo;
  selectedDays: number;
  onDaysChange: (days: number) => void;
  loading?: boolean;
}

export const DailyUsageChart: React.FC<DailyUsageChartProps> = ({
  data,
  diaPico,
  selectedDays,
  onDaysChange,
  loading = false,
}) => {
  const formattedPeakDate = diaPico?.fecha
    ? new Date(diaPico.fecha).toLocaleDateString([], {
        day: '2-digit',
        month: 'short',
      })
    : '—';

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
      {/* Header with Title, Peak Badge and Range Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <Activity className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-gray-900">
              Días de Mayor Actividad en el Sistema
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Volumen acumulado de operaciones diarias realizadas por los operadores y el sistema
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Badge de Día Pico */}
          {diaPico && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold shadow-2xs">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>Día pico:</span>
              <span className="underline">{formattedPeakDate}</span>
              <span className="bg-amber-200/60 px-1.5 py-0.2 rounded-md font-bold">
                {diaPico.cantidad} ops
              </span>
            </div>
          )}

          {/* Selector de Rango 7, 30, 90 días */}
          <div className="inline-flex rounded-xl bg-gray-100 p-1 border border-gray-200">
            {[7, 30, 90].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => onDaysChange(days)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  selectedDays === days
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {days} días
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-72 w-full">
        {loading ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-xs">
            Actualizando gráfico...
          </div>
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-xs">
            No hay datos de actividad para el rango seleccionado.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="fecha"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tickFormatter={(val) => {
                  try {
                    const parts = val.split('-');
                    return `${parts[2]}/${parts[1]}`;
                  } catch {
                    return val;
                  }
                }}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '0.75rem',
                  border: 'none',
                  color: '#ffffff',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#94a3b8', fontWeight: 'bold', marginBottom: '2px' }}
                formatter={(value: any) => [`${value} operaciones`, 'Actividad']}
              />
              <Area
                type="monotone"
                dataKey="cantidad"
                stroke="#2563eb"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#usageGradient)"
                activeDot={{ r: 5, fill: '#1d4ed8' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default DailyUsageChart;
