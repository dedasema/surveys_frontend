import React from 'react';
import { Clock, Loader2, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';

export type AsyncStatus = 'pending' | 'processing' | 'transcribing' | 'completed' | 'error';

export interface AsyncStatusBadgeProps {
  status: AsyncStatus;
  label?: string;
  errorMessage?: string;
  onRetry?: () => void;
  className?: string;
}

export const AsyncStatusBadge: React.FC<AsyncStatusBadgeProps> = ({
  status,
  label,
  errorMessage,
  onRetry,
  className = '',
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          colorClass: 'bg-amber-50 text-amber-700 border-amber-200',
          defaultLabel: 'Pendiente',
          animate: false,
        };
      case 'processing':
        return {
          icon: Loader2,
          colorClass: 'bg-blue-50 text-blue-700 border-blue-200',
          defaultLabel: 'Procesando con IA...',
          animate: true,
        };
      case 'transcribing':
        return {
          icon: Loader2,
          colorClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          defaultLabel: 'Transcribiendo audio...',
          animate: true,
        };
      case 'completed':
        return {
          icon: CheckCircle2,
          colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          defaultLabel: 'Completado',
          animate: false,
        };
      case 'error':
      default:
        return {
          icon: AlertCircle,
          colorClass: 'bg-rose-50 text-rose-700 border-rose-200',
          defaultLabel: 'Error',
          animate: false,
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`inline-flex flex-col gap-1.5 ${className}`}>
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold tracking-wide ${config.colorClass}`}
      >
        <Icon className={`h-3.5 w-3.5 ${config.animate ? 'animate-spin' : ''}`} />
        <span>{label || config.defaultLabel}</span>

        {status === 'error' && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="ml-1.5 p-0.5 hover:bg-rose-100 rounded-full transition-colors flex items-center gap-1 text-rose-800 font-bold"
            title="Reintentar"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="text-[10px]">Reintentar</span>
          </button>
        )}
      </div>

      {status === 'error' && errorMessage && (
        <p className="text-xs text-rose-600 pl-1 font-medium">{errorMessage}</p>
      )}
    </div>
  );
};

export default AsyncStatusBadge;
