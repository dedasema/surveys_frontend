import React from 'react';
import { Clock, HardDrive, DollarSign, Crown, CheckCircle2, Calendar } from 'lucide-react';
import { SystemUsageMetricsResponse } from '../types';

export interface UsageKpiCardsProps {
  data: SystemUsageMetricsResponse;
}

export const UsageKpiCards: React.FC<UsageKpiCardsProps> = ({ data }) => {
  const {
    ultima_sesion,
    espacio_usado,
    pago_total_acumulado,
    moneda,
    frecuencia_pago,
    plan_nombre,
    estado_suscripcion,
    proximo_pago,
  } = data;

  const formattedDate = ultima_sesion
    ? new Date(ultima_sesion).toLocaleString([], {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'No registrada';

  const nextPaymentDate = proximo_pago
    ? new Date(proximo_pago).toLocaleDateString([], {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'No programado';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Última Sesión */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold text-gray-400 uppercase tracking-wider">
              Última Sesión
            </span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 mt-2">{formattedDate}</p>
        </div>
        <p className="text-2xs text-gray-400 mt-3 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Actividad reciente en plataforma
        </p>
      </div>

      {/* 2. Espacio Usado con Barra de Progreso */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold text-gray-400 uppercase tracking-wider">
              Espacio Usado
            </span>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <HardDrive className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-lg font-bold text-gray-900">
              {espacio_usado.mb} {espacio_usado.unidad}
            </p>
            <span className="text-xs font-semibold text-indigo-600">
              {espacio_usado.porcentaje_usado}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(espacio_usado.porcentaje_usado, 100)}%` }}
            />
          </div>
          <p className="text-2xs text-gray-400 mt-1.5 truncate">
            {espacio_usado.formateado}
          </p>
        </div>
      </div>

      {/* 3. Pago Total Acumulado */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold text-gray-400 uppercase tracking-wider">
              Pago Total Acumulado
            </span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <p className="text-2xl font-bold text-gray-900">
              $ {pago_total_acumulado.toFixed(2)}
            </p>
            <span className="text-xs font-bold text-gray-400 uppercase">{moneda}</span>
          </div>
        </div>
        <p className="text-2xs text-gray-400 mt-3">
          Facturación en frecuencia <strong className="text-gray-700 capitalize">{frecuencia_pago}</strong>
        </p>
      </div>

      {/* 4. Plan y Frecuencia */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold text-gray-400 uppercase tracking-wider">
              Plan y Suscripción
            </span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Crown className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-lg font-bold text-gray-900">{plan_nombre}</p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
              <CheckCircle2 className="w-3 h-3" />
              {estado_suscripcion}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-2xs text-gray-500">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>Próx. vencimiento: <strong>{nextPaymentDate}</strong></span>
        </div>
      </div>
    </div>
  );
};

export default UsageKpiCards;
