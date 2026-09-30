import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon, PlusCircle, Edit3, Trash2, MoreHorizontal } from 'lucide-react';
import { TiposOperacionesCud } from '../types';

export interface CudOperationsDonutProps {
  cudData: TiposOperacionesCud;
}

const COLORS = {
  crear: '#10b981', // Emerald
  modificar: '#3b82f6', // Blue
  eliminar: '#ef4444', // Red
  otros: '#8b5cf6', // Violet
};

export const CudOperationsDonut: React.FC<CudOperationsDonutProps> = ({ cudData }) => {
  const { crear, modificar, eliminar, otros, total, porcentajes } = cudData;

  const chartData = [
    { name: 'Crear', value: crear, percentage: porcentajes?.crear || 0, color: COLORS.crear },
    { name: 'Modificar', value: modificar, percentage: porcentajes?.modificar || 0, color: COLORS.modificar },
    { name: 'Eliminar', value: eliminar, percentage: porcentajes?.eliminar || 0, color: COLORS.eliminar },
    { name: 'Otros', value: otros, percentage: porcentajes?.otros || 0, color: COLORS.otros },
  ].filter((item) => item.value > 0);

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <PieIcon className="w-4 h-4" />
          </span>
          <h3 className="text-base font-bold text-gray-900">
            Distribución de Operaciones (CUD)
          </h3>
        </div>
        <p className="text-xs text-gray-500">
          Proporción de transacciones realizadas en la base de datos
        </p>
      </div>

      {/* Donut Chart with Centered Total */}
      <div className="relative h-56 w-full my-2 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg text-xs">
                      <p className="font-bold flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block"
                          style={{ backgroundColor: data.color }}
                        />
                        {data.name}
                      </p>
                      <p className="text-slate-300 mt-1">
                        {data.value} operaciones ({data.percentage}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-gray-900">{total}</span>
          <span className="text-2xs text-gray-400 font-semibold uppercase tracking-wider">
            Total Ops
          </span>
        </div>
      </div>

      {/* Legend with Badges and Percentages */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-800 font-medium truncate">
            <PlusCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>Crear</span>
          </div>
          <div className="text-right">
            <span className="font-bold text-emerald-950">{crear}</span>
            <span className="text-3xs text-emerald-700 block font-semibold">{porcentajes?.crear}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-2 rounded-xl bg-blue-50/60 border border-blue-100 text-xs">
          <div className="flex items-center gap-1.5 text-blue-800 font-medium truncate">
            <Edit3 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
            <span>Modificar</span>
          </div>
          <div className="text-right">
            <span className="font-bold text-blue-950">{modificar}</span>
            <span className="text-3xs text-blue-700 block font-semibold">{porcentajes?.modificar}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-2 rounded-xl bg-rose-50/60 border border-rose-100 text-xs">
          <div className="flex items-center gap-1.5 text-rose-800 font-medium truncate">
            <Trash2 className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
            <span>Eliminar</span>
          </div>
          <div className="text-right">
            <span className="font-bold text-rose-950">{eliminar}</span>
            <span className="text-3xs text-rose-700 block font-semibold">{porcentajes?.eliminar}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-2 rounded-xl bg-purple-50/60 border border-purple-100 text-xs">
          <div className="flex items-center gap-1.5 text-purple-800 font-medium truncate">
            <MoreHorizontal className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
            <span>Otros</span>
          </div>
          <div className="text-right">
            <span className="font-bold text-purple-950">{otros}</span>
            <span className="text-3xs text-purple-700 block font-semibold">{porcentajes?.otros}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CudOperationsDonut;
