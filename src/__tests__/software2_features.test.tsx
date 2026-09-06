import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AsyncStatusBadge } from '../shared/components/AsyncStatusBadge';
import { LiveUpdateIndicator } from '../features/realtime/LiveUpdateIndicator';

describe('Software 2 — Frontend Features Unit Tests', () => {
  describe('RF19: AsyncStatusBadge', () => {
    it('renders "Procesando con IA..." status correctly', () => {
      render(<AsyncStatusBadge status="processing" />);
      expect(screen.getByText(/Procesando con IA.../i)).toBeTruthy();
    });

    it('renders custom label when provided', () => {
      render(<AsyncStatusBadge status="processing" label="En Proceso" />);
      expect(screen.getByText(/En Proceso/i)).toBeTruthy();
    });

    it('renders "Completado" status correctly', () => {
      render(<AsyncStatusBadge status="completed" />);
      expect(screen.getByText(/Completado/i)).toBeTruthy();
    });

    it('renders "Error" with retry button and calls onRetry when clicked', () => {
      const handleRetry = vi.fn();
      render(
        <AsyncStatusBadge
          status="error"
          errorMessage="Error de conexión"
          onRetry={handleRetry}
        />
      );

      expect(screen.getByText('Error')).toBeTruthy();
      expect(screen.getByText('Error de conexión')).toBeTruthy();

      const retryBtn = screen.getByRole('button', { name: /reintentar/i });
      fireEvent.click(retryBtn);
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('RF24: LiveUpdateIndicator', () => {
    it('renders "En vivo" indicator when connected', () => {
      render(<LiveUpdateIndicator status="connected" lastUpdateText="hace 1 min" />);
      expect(screen.getByText(/En vivo/i)).toBeTruthy();
      expect(screen.getByText(/hace 1 min/i)).toBeTruthy();
    });

    it('renders "Reconectando..." indicator when reconnecting', () => {
      render(<LiveUpdateIndicator status="reconnecting" />);
      expect(screen.getByText(/Reconectando.../i)).toBeTruthy();
    });

    it('renders "Sin sincronización en vivo" with reconnect trigger when disconnected', () => {
      const handleReconnect = vi.fn();
      render(<LiveUpdateIndicator status="disconnected" onReconnect={handleReconnect} />);
      expect(screen.getByText(/Sin sincronización en vivo/i)).toBeTruthy();

      const reconnectBtn = screen.getByRole('button', { name: /reconectar/i });
      fireEvent.click(reconnectBtn);
      expect(handleReconnect).toHaveBeenCalledTimes(1);
    });
  });
});
