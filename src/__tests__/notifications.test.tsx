import React from 'react';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  NotificationBellPopover,
  NotificationsPage,
  notificationsService,
} from '../features/notifications';
import * as apiModule from '../services/api';

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    logout: vi.fn(),
    user: { id: 'test_user_42', nombre: 'Test User', email: 'test@example.com' },
  }),
}));

// Mock auth service
vi.mock('../services/auth', () => ({
  getCurrentUser: vi.fn().mockResolvedValue({
    id: 'test_user_42',
    nombre: 'Test User',
    email: 'test@example.com',
  }),
  getAvatarUrl: vi.fn((url) => url),
}));

// Mock chatbot
vi.mock('../features/chatbot', () => ({
  ChatbotWidget: () => null,
}));

// Mock SystemAnnouncementsBanner
vi.mock('../components/SystemAnnouncementsBanner', () => ({
  default: () => null,
}));

describe('Notifications Module — Unit & Integration Tests', () => {
  const sampleAnuncios = [
    {
      id: 'notif-1',
      titulo: 'Mantenimiento Programado',
      mensaje: 'La plataforma tendrá un mantenimiento el próximo domingo a las 02:00.',
      tipo: 'warning',
      activo: true,
      creado_en: '2026-10-01T12:00:00.000Z',
    },
    {
      id: 'notif-2',
      titulo: 'Actualización del Agente IA',
      mensaje: 'El asistente RAG ahora indexa automáticamente las nuevas preguntas.',
      tipo: 'info',
      activo: true,
      creado_en: '2026-10-02T12:00:00.000Z',
    },
    {
      id: 'notif-3',
      titulo: 'Alerta de Límite de Entregas',
      mensaje: 'Has alcanzado el 90% de envíos SMS permitidos en tu suscripción.',
      tipo: 'error',
      activo: true,
      creado_en: '2026-10-03T12:00:00.000Z',
    },
  ];

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.spyOn(apiModule, 'obtenerAnunciosActivos').mockResolvedValue(sampleAnuncios);
  });

  describe('notificationsService', () => {
    it('fetches notifications and sets initial isRead false', async () => {
      const result = await notificationsService.fetchNotifications('test_user_42');
      expect(result).toHaveLength(3);
      expect(result[0].titulo).toBe('Mantenimiento Programado');
      expect(result[0].isRead).toBe(false);
    });

    it('marks a notification as read and reflects in isRead', async () => {
      notificationsService.markNotificationAsRead('notif-1', 'test_user_42');
      const readIds = notificationsService.getReadIds('test_user_42');
      expect(readIds).toContain('notif-1');

      const result = await notificationsService.fetchNotifications('test_user_42');
      const item1 = result.find((n) => n.id === 'notif-1');
      const item2 = result.find((n) => n.id === 'notif-2');
      expect(item1?.isRead).toBe(true);
      expect(item2?.isRead).toBe(false);
    });

    it('marks all notifications as read', async () => {
      const initial = await notificationsService.fetchNotifications('test_user_42');
      notificationsService.markAllNotificationsAsRead(initial, 'test_user_42');

      const updated = await notificationsService.fetchNotifications('test_user_42');
      expect(updated.every((n) => n.isRead)).toBe(true);
    });

    it('dismisses a notification item so it is excluded from future fetch results', async () => {
      notificationsService.dismissNotificationItem('notif-2', 'test_user_42');
      const dismissed = notificationsService.getDismissedIds('test_user_42');
      expect(dismissed).toContain('notif-2');

      const result = await notificationsService.fetchNotifications('test_user_42');
      expect(result.some((n) => n.id === 'notif-2')).toBe(false);
      expect(result).toHaveLength(2);
    });

    it('uses fallback notifications when api returns empty array', async () => {
      vi.spyOn(apiModule, 'obtenerAnunciosActivos').mockResolvedValueOnce([]);
      const result = await notificationsService.fetchNotifications('test_user_42');
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].id).toBe('system_welcome');
    });
  });

  describe('NotificationBellPopover Component', () => {
    it('renders bell button with unread counter badge', async () => {
      render(
        <MemoryRouter>
          <NotificationBellPopover />
        </MemoryRouter>
      );

      const bellBtn = screen.getByRole('button', { name: /notificaciones/i });
      expect(bellBtn).toBeInTheDocument();

      // Initially 3 unread items
      await waitFor(() => {
        expect(screen.getByText('3')).toBeInTheDocument();
      });
    });

    it('opens popover when bell button is clicked and shows list and footer link', async () => {
      render(
        <MemoryRouter initialEntries={['/dashboard-suscriptor/dashboard']}>
          <NotificationBellPopover />
        </MemoryRouter>
      );

      const bellBtn = screen.getByRole('button', { name: /notificaciones/i });
      fireEvent.click(bellBtn);

      await waitFor(() => {
        expect(screen.getByText('Mantenimiento Programado')).toBeInTheDocument();
        expect(screen.getByText('Actualización del Agente IA')).toBeInTheDocument();
        expect(screen.getByText('Ver todas las notificaciones')).toBeInTheDocument();
      });
    });

    it('marks all notifications as read when Marcar leídas button is clicked in popover', async () => {
      render(
        <MemoryRouter>
          <NotificationBellPopover />
        </MemoryRouter>
      );

      const bellBtn = screen.getByRole('button', { name: /notificaciones/i });
      fireEvent.click(bellBtn);

      await waitFor(() => {
        expect(screen.getByText(/Marcar leídas/i)).toBeInTheDocument();
      });

      const markAllBtn = screen.getByText(/Marcar leídas/i);
      fireEvent.click(markAllBtn);

      await waitFor(() => {
        // Unread badge should disappear
        expect(screen.queryByText('3 no leídas')).not.toBeInTheDocument();
      });
    });
  });

  describe('NotificationsPage Component', () => {
    it('renders header, KPI metrics, filter tabs, and notification cards', async () => {
      render(
        <MemoryRouter initialEntries={['/dashboard-suscriptor/notificaciones']}>
          <NotificationsPage role="suscriptor" />
        </MemoryRouter>
      );

      // Header
      expect(screen.getByText('Centro de Avisos & Alertas')).toBeInTheDocument();
      expect(screen.getByText('Notificaciones del Sistema')).toBeInTheDocument();

      // KPI cards
      await waitFor(() => {
        expect(screen.getByText('Total Notificaciones')).toBeInTheDocument();
        expect(screen.getByText('No Leídas')).toBeInTheDocument();
        expect(screen.getByText('Alertas Críticas / Advertencias')).toBeInTheDocument();
      });

      // Filter tabs
      expect(screen.getByRole('button', { name: /^Todas/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^No Leídas/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^Informativas/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^Alertas y Errores/i })).toBeInTheDocument();

      // Cards
      expect(screen.getByText('Mantenimiento Programado')).toBeInTheDocument();
      expect(screen.getByText('Actualización del Agente IA')).toBeInTheDocument();
      expect(screen.getByText('Alerta de Límite de Entregas')).toBeInTheDocument();
    });

    it('filters cards by tab selection', async () => {
      render(
        <MemoryRouter initialEntries={['/dashboard-suscriptor/notificaciones']}>
          <NotificationsPage role="suscriptor" />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Mantenimiento Programado')).toBeInTheDocument();
      });

      // Click "Informativas" tab
      const infoTab = screen.getByRole('button', { name: /Informativas/i });
      fireEvent.click(infoTab);

      // Only informative item should remain
      expect(screen.getByText('Actualización del Agente IA')).toBeInTheDocument();
      expect(screen.queryByText('Mantenimiento Programado')).not.toBeInTheDocument();
      expect(screen.queryByText('Alerta de Límite de Entregas')).not.toBeInTheDocument();

      // Click "Alertas y Errores" tab
      const alertsTab = screen.getByRole('button', { name: /Alertas y Errores/i });
      fireEvent.click(alertsTab);

      expect(screen.getByText('Mantenimiento Programado')).toBeInTheDocument();
      expect(screen.getByText('Alerta de Límite de Entregas')).toBeInTheDocument();
      expect(screen.queryByText('Actualización del Agente IA')).not.toBeInTheDocument();
    });

    it('filters cards by search query', async () => {
      render(
        <MemoryRouter initialEntries={['/dashboard-suscriptor/notificaciones']}>
          <NotificationsPage role="suscriptor" />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Mantenimiento Programado')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Buscar notificaciones/i);
      fireEvent.change(searchInput, { target: { value: 'SMS' } });

      expect(screen.getByText('Alerta de Límite de Entregas')).toBeInTheDocument();
      expect(screen.queryByText('Mantenimiento Programado')).not.toBeInTheDocument();
      expect(screen.queryByText('Actualización del Agente IA')).not.toBeInTheDocument();
    });

    it('toggles read/unread and dismisses a notification card', async () => {
      render(
        <MemoryRouter initialEntries={['/dashboard-suscriptor/notificaciones']}>
          <NotificationsPage role="suscriptor" />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Mantenimiento Programado')).toBeInTheDocument();
      });

      // Find all "Marcar leída" buttons
      const markReadButtons = screen.getAllByRole('button', { name: /Marcar leída/i });
      fireEvent.click(markReadButtons[0]);

      // Should now display "Marcar no leída" for that card
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Marcar no leída/i })).toBeInTheDocument();
      });

      // Dismiss the item
      const dismissButtons = screen.getAllByRole('button', { name: /Descartar/i });
      fireEvent.click(dismissButtons[0]);

      await waitFor(() => {
        expect(screen.queryByText('Mantenimiento Programado')).not.toBeInTheDocument();
      });
    });
  });
});
