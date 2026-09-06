import React from 'react';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { WebSocketStatus } from './useCampaignWebSocket';

export interface LiveUpdateIndicatorProps {
  status: WebSocketStatus;
  onReconnect?: () => void;
  lastUpdateText?: string;
  className?: string;
}

export const LiveUpdateIndicator: React.FC<LiveUpdateIndicatorProps> = ({
  status,
  onReconnect,
  lastUpdateText,
  className = '',
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'connected':
        return (
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>En vivo</span>
            {lastUpdateText && (
              <span className="text-emerald-600/70 border-l border-emerald-300 pl-1.5 ml-0.5">
                {lastUpdateText}
              </span>
            )}
          </div>
        );
      case 'reconnecting':
        return (
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium">
            <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
            <span>Reconectando...</span>
          </div>
        );
      case 'connecting':
        return (
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium">
            <RefreshCw className="w-3 h-3 animate-spin text-blue-600" />
            <span>Conectando...</span>
          </div>
        );
      case 'error':
      case 'disconnected':
      default:
        return (
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200 text-xs font-medium">
            <WifiOff className="w-3 h-3 text-gray-400" />
            <span>Sin sincronización en vivo</span>
            {onReconnect && (
              <button
                type="button"
                onClick={onReconnect}
                className="ml-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline cursor-pointer"
                title="Reconectar WebSocket"
              >
                Reconectar
              </button>
            )}
          </div>
        );
    }
  };

  return <div className={`flex items-center ${className}`}>{getStatusBadge()}</div>;
};

export default LiveUpdateIndicator;
