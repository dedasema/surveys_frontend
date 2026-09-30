import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { usageApi } from '../features/system-usage/services/usageApi';
import { UsageKpiCards } from '../features/system-usage/components/UsageKpiCards';
import { TopUsersRanking } from '../features/system-usage/components/TopUsersRanking';
import { SystemUsageMetricsResponse } from '../features/system-usage/types';
import { apiClient } from '../features/auth/apiClient';

describe('Métricas de Uso del Sistema — Unit Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(apiClient, 'get').mockRejectedValue(new Error('Network error'));
  });
  describe('usageApi service', () => {
    it('retrieves system usage metrics with all required fields', async () => {
      const data = await usageApi.getSystemUsage(30);

      expect(data).toHaveProperty('ultima_sesion');
      expect(data).toHaveProperty('espacio_usado');
      expect(data.espacio_usado).toHaveProperty('mb');
      expect(data.espacio_usado).toHaveProperty('limite_mb');
      expect(data.espacio_usado).toHaveProperty('porcentaje_usado');

      expect(data).toHaveProperty('pago_total_acumulado');
      expect(data).toHaveProperty('plan_nombre');
      expect(data).toHaveProperty('estado_suscripcion');
      expect(data).toHaveProperty('proximo_pago');

      expect(Array.isArray(data.grafica_dias_mayor_uso)).toBe(true);
      expect(data.grafica_dias_mayor_uso.length).toBeGreaterThan(0);
      expect(data).toHaveProperty('dia_pico');

      expect(Array.isArray(data.top_5_usuarios)).toBe(true);
      expect(data.top_5_usuarios.length).toBeLessThanOrEqual(5);

      expect(data).toHaveProperty('tipos_operaciones_cud');
      expect(data.tipos_operaciones_cud).toHaveProperty('crear');
      expect(data.tipos_operaciones_cud).toHaveProperty('modificar');
      expect(data.tipos_operaciones_cud).toHaveProperty('eliminar');
      expect(data.tipos_operaciones_cud).toHaveProperty('otros');
      expect(data.tipos_operaciones_cud).toHaveProperty('total');
      expect(data.tipos_operaciones_cud).toHaveProperty('porcentajes');
    });
  });

  describe('UI Components', () => {
    const mockData: SystemUsageMetricsResponse = {
      ultima_sesion: '2026-09-30T08:00:00Z',
      espacio_usado: {
        bytes: 15204352,
        mb: 14.5,
        limite_mb: 1000.0,
        porcentaje_usado: 1.45,
        unidad: 'MB',
        formateado: '14.5 MB de 1000.0 MB',
      },
      pago_total_acumulado: 59.98,
      moneda: 'usd',
      frecuencia_pago: 'Mensual',
      plan_nombre: 'Profesional',
      estado_suscripcion: 'activo',
      proximo_pago: '2026-10-30T00:00:00Z',
      grafica_dias_mayor_uso: [
        { fecha: '2026-09-28', cantidad: 12 },
        { fecha: '2026-09-29', cantidad: 45 },
      ],
      dia_pico: { fecha: '2026-09-29', cantidad: 45 },
      top_5_usuarios: [
        {
          usuario_id: 'u-1',
          email: 'juan@empresa.com',
          nombre: 'Juan Pérez',
          rol: 'operador',
          total_operaciones: 58,
        },
        {
          usuario_id: 'u-2',
          email: 'ana@empresa.com',
          nombre: 'Ana López',
          rol: 'suscriptor',
          total_operaciones: 34,
        },
      ],
      tipos_operaciones_cud: {
        crear: 35,
        modificar: 20,
        eliminar: 4,
        otros: 18,
        total: 77,
        porcentajes: {
          crear: 45.45,
          modificar: 25.97,
          eliminar: 5.19,
          otros: 23.38,
        },
      },
    };

    it('renders UsageKpiCards with accurate data', () => {
      render(<UsageKpiCards data={mockData} />);

      expect(screen.getByText('14.5 MB de 1000.0 MB')).toBeTruthy();
      expect(screen.getByText('1.45%')).toBeTruthy();
      expect(screen.getByText(/59\.98/)).toBeTruthy();
      expect(screen.getByText('Profesional')).toBeTruthy();
      expect(screen.getByText('activo')).toBeTruthy();
    });

    it('renders TopUsersRanking with rank positions, roles and counts', () => {
      render(<TopUsersRanking usuarios={mockData.top_5_usuarios} />);

      expect(screen.getByText('Juan Pérez')).toBeTruthy();
      expect(screen.getByText('juan@empresa.com')).toBeTruthy();
      expect(screen.getByText('58')).toBeTruthy();

      expect(screen.getByText('Ana López')).toBeTruthy();
      expect(screen.getByText('ana@empresa.com')).toBeTruthy();
      expect(screen.getByText('34')).toBeTruthy();
    });
  });
});
