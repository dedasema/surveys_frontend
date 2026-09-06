import { useState, useEffect, useRef, useCallback } from 'react';

export type WebSocketStatus = 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'error';

export interface WebSocketMessage<T = any> {
  type: 'nueva_respuesta' | 'actualizacion_metricas' | 'alerta_fraude' | 'decision_agente' | 'pong' | string;
  payload: T;
  timestamp?: string;
}

export interface UseCampaignWebSocketOptions {
  campanaId?: string | number | null;
  onNewResponse?: (data: any) => void;
  onMetricsUpdate?: (data: any) => void;
  onFraudAlert?: (data: any) => void;
  onAgentDecision?: (data: any) => void;
  autoReconnect?: boolean;
  maxRetries?: number;
}

export function useCampaignWebSocket(options: UseCampaignWebSocketOptions = {}) {
  const {
    campanaId,
    onNewResponse,
    onMetricsUpdate,
    onFraudAlert,
    onAgentDecision,
    autoReconnect = true,
    maxRetries = 5,
  } = options;

  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUnmountedRef = useRef(false);

  const getWebSocketUrl = useCallback(() => {
    const rawApiUrl = process.env.REACT_APP_API_URL || 'https://surveys-backend-83d9.onrender.com';
    let wsBase = rawApiUrl.replace(/^http:\/\//i, 'ws://').replace(/^https:\/\//i, 'wss://');
    
    // Si no tiene slash final
    if (!wsBase.endsWith('/')) {
      wsBase += '/';
    }

    if (campanaId) {
      return `${wsBase}ws/campanas/${campanaId}`;
    }
    return `${wsBase}ws/general`;
  }, [campanaId]);

  const connect = useCallback(() => {
    if (isUnmountedRef.current) return;

    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      setStatus(retryCount > 0 ? 'reconnecting' : 'connecting');
      const url = getWebSocketUrl();
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (isUnmountedRef.current) return;
        setStatus('connected');
        setRetryCount(0);
        // Suscribirse si es necesario
        if (campanaId) {
          ws.send(JSON.stringify({ action: 'subscribe', campana_id: campanaId }));
        }
      };

      ws.onmessage = (event) => {
        if (isUnmountedRef.current) return;
        try {
          const msg: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(msg);

          switch (msg.type) {
            case 'nueva_respuesta':
              onNewResponse?.(msg.payload);
              break;
            case 'actualizacion_metricas':
              onMetricsUpdate?.(msg.payload);
              break;
            case 'alerta_fraude':
              onFraudAlert?.(msg.payload);
              break;
            case 'decision_agente':
              onAgentDecision?.(msg.payload);
              break;
            default:
              break;
          }
        } catch {
          // Si el mensaje no es JSON, guardarlo como payload simple
          setLastMessage({ type: 'text', payload: event.data });
        }
      };

      ws.onerror = () => {
        if (isUnmountedRef.current) return;
        setStatus('error');
      };

      ws.onclose = (event) => {
        if (isUnmountedRef.current) return;
        wsRef.current = null;
        setStatus('disconnected');

        // Intentar reconectar con backoff exponencial si no fue cierre intencional
        if (autoReconnect && event.code !== 1000 && retryCount < maxRetries) {
          const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 15000);
          setStatus('reconnecting');
          setRetryCount((prev) => prev + 1);

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, backoffDelay);
        }
      };
    } catch {
      setStatus('error');
    }
  }, [campanaId, autoReconnect, retryCount, maxRetries, getWebSocketUrl, onNewResponse, onMetricsUpdate, onFraudAlert, onAgentDecision]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnect');
      wsRef.current = null;
    }
    setStatus('disconnected');
    setRetryCount(0);
  }, []);

  const manualReconnect = useCallback(() => {
    disconnect();
    setRetryCount(0);
    connect();
  }, [disconnect, connect]);

  useEffect(() => {
    isUnmountedRef.current = false;
    connect();

    return () => {
      isUnmountedRef.current = true;
      disconnect();
    };
  }, [campanaId]);

  return {
    status,
    isConnected: status === 'connected',
    lastMessage,
    retryCount,
    reconnect: manualReconnect,
    disconnect,
  };
}
