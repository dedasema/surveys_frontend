import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingChatbotWidget from '../features/landing-chatbot/components/LandingChatbotWidget';
import {
  getLocalKnowledgeResponse,
  sendLandingMessage,
} from '../features/landing-chatbot/services/landingChatService';
import LandingPage from '../pages/LandingPage';

// Mock AuthContext and public API for LandingPage integration
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ isAuthenticated: false, user: null }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../services/api', () => ({
  obtenerPlanesPublicos: vi.fn().mockResolvedValue([]),
}));

describe('Landing Page Chatbot — Unit & Integration Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(
      new Error('Backend endpoint pending deployment')
    );
  });

  describe('landingChatService & Knowledge Base', () => {
    it('returns accurate pricing information with links for pricing queries', () => {
      const response = getLocalKnowledgeResponse('¿Cuáles son los precios y planes?');
      expect(response.answer).toContain('Gratuito ($0 / mes)');
      expect(response.answer).toContain('Profesional ($29.99 / mes)');
      expect(response.answer).toContain('Enterprise ($99.99 / mes)');
      expect(response.actions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ href: '#precios' }),
          expect.objectContaining({ href: '/register' }),
        ])
      );
    });

    it('returns AI voice surveys information for voice queries', () => {
      const response = getLocalKnowledgeResponse('Quiero saber sobre encuestas por voz y audio');
      expect(response.answer).toContain('Encuestas por Voz con IA');
      expect(response.answer).toContain('Transcripción automática instantánea');
      expect(response.answer).toContain('Análisis de sentimiento y tono');
      expect(response.actions).toBeDefined();
    });

    it('returns paper OCR scanning info for paper queries', () => {
      const response = getLocalKnowledgeResponse('¿Cómo funciona el escaneo OCR de papel?');
      expect(response.answer).toContain('Papel & Escaneo OCR inteligente');
      expect(response.answer).toContain('PDFs listos para imprimir');
      expect(response.answer).toContain('Reconocimiento con IA (OCR)');
    });

    it('returns encryption and multi-tenant security info for security queries', () => {
      const response = getLocalKnowledgeResponse('¿Qué nivel de seguridad y encriptación tienen?');
      expect(response.answer).toContain('TLS 1.3');
      expect(response.answer).toContain('AES-256');
      expect(response.answer).toContain('Multi-Tenant');
    });

    it('returns registration and onboarding info for signup queries', () => {
      const response = getLocalKnowledgeResponse('¿Cómo crear cuenta o empezar gratis?');
      expect(response.answer).toContain('Crear cuenta gratis');
      expect(response.actions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ href: '/register' }),
        ])
      );
    });

    it('falls back seamlessly to local knowledge base when backend network fails', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Backend offline'));

      const response = await sendLandingMessage('¿Cuáles son los planes?');
      expect(response.answer).toContain('Gratuito ($0 / mes)');
      expect(response.actions?.length).toBeGreaterThan(0);
    });

    it('returns server answer when backend returns 200 OK', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          answer: 'Respuesta desde el backend de producción',
          actions: [{ label: 'Ir al panel', href: '/login' }],
        }),
      } as Response);

      const response = await sendLandingMessage('Consulta de prueba');
      expect(response.answer).toBe('Respuesta desde el backend de producción');
      expect(response.actions).toEqual([{ label: 'Ir al panel', href: '/login' }]);
    });
  });

  describe('LandingChatbotWidget Component', () => {
    it('renders the floating trigger button and tooltip initially', () => {
      render(
        <MemoryRouter>
          <LandingChatbotWidget />
        </MemoryRouter>
      );

      const triggerButton = screen.getByRole('button', {
        name: /abrir asesor surveysaas/i,
      });
      expect(triggerButton).toBeInTheDocument();

      const tooltip = screen.getByText(/¿Tenés dudas\? Hablá con nuestro asesor/i);
      expect(tooltip).toBeInTheDocument();
    });

    it('dismisses intro tooltip when the tooltip close button is clicked', () => {
      render(
        <MemoryRouter>
          <LandingChatbotWidget />
        </MemoryRouter>
      );

      const closeTooltipBtn = screen.getByRole('button', {
        name: /cerrar sugerencia/i,
      });
      fireEvent.click(closeTooltipBtn);

      expect(
        screen.queryByText(/¿Tenés dudas\? Hablá con nuestro asesor/i)
      ).not.toBeInTheDocument();
    });

    it('opens chat dialog window when floating launcher button is clicked', () => {
      render(
        <MemoryRouter>
          <LandingChatbotWidget />
        </MemoryRouter>
      );

      const triggerButton = screen.getByRole('button', {
        name: /abrir asesor surveysaas/i,
      });
      fireEvent.click(triggerButton);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(/Asesor SurveySaaS/i)).toBeInTheDocument();
      expect(screen.getByText(/En línea • Asistente IA de Producto/i)).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/Preguntá sobre precios, canales o funciones.../i)
      ).toBeInTheDocument();
    });

    it('displays quick action chips in the chat window', () => {
      render(
        <MemoryRouter>
          <LandingChatbotWidget />
        </MemoryRouter>
      );

      fireEvent.click(
        screen.getByRole('button', { name: /abrir asesor surveysaas/i })
      );

      expect(screen.getByText('💳 Ver planes y precios')).toBeInTheDocument();
      expect(screen.getByText('🎙️ Encuestas por voz')).toBeInTheDocument();
      expect(screen.getByText('📄 Escaneo OCR de papel')).toBeInTheDocument();
      expect(screen.getByText('🚀 Crear cuenta gratis')).toBeInTheDocument();
    });

    it('triggers a query when clicking a quick action chip', async () => {
      render(
        <MemoryRouter>
          <LandingChatbotWidget />
        </MemoryRouter>
      );

      fireEvent.click(
        screen.getByRole('button', { name: /abrir asesor surveysaas/i })
      );

      const pricingChip = screen.getByText('💳 Ver planes y precios');
      fireEvent.click(pricingChip);

      await waitFor(() => {
        expect(screen.getByText(/Profesional \(\$29\.99 \/ mes\)/i)).toBeInTheDocument();
      });
    });

    it('allows typing and sending a user message, then renders bot answer', async () => {
      render(
        <MemoryRouter>
          <LandingChatbotWidget />
        </MemoryRouter>
      );

      fireEvent.click(
        screen.getByRole('button', { name: /abrir asesor surveysaas/i })
      );

      const input = screen.getByPlaceholderText(
        /Preguntá sobre precios, canales o funciones.../i
      );
      fireEvent.change(input, {
        target: { value: '¿Cómo funciona la seguridad?' },
      });

      const sendBtn = screen.getByRole('button', { name: /enviar mensaje/i });
      fireEvent.click(sendBtn);

      expect(screen.getByText('¿Cómo funciona la seguridad?')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText(/Cifrado de grado bancario/i)).toBeInTheDocument();
      });
    });

    it('resets conversation when clicking the reset chat button', async () => {
      render(
        <MemoryRouter>
          <LandingChatbotWidget />
        </MemoryRouter>
      );

      fireEvent.click(
        screen.getByRole('button', { name: /abrir asesor surveysaas/i })
      );

      const input = screen.getByPlaceholderText(
        /Preguntá sobre precios, canales o funciones.../i
      );
      fireEvent.change(input, { target: { value: 'Hola bot' } });
      fireEvent.click(screen.getByRole('button', { name: /enviar mensaje/i }));

      expect(screen.getByText('Hola bot')).toBeInTheDocument();

      const resetBtn = screen.getByRole('button', { name: /reiniciar chat/i });
      fireEvent.click(resetBtn);

      expect(screen.queryByText('Hola bot')).not.toBeInTheDocument();
      expect(screen.getByText(/Soy el asesor virtual de/i)).toBeInTheDocument();
    });

    it('closes the chat dialog when clicking the close button', () => {
      render(
        <MemoryRouter>
          <LandingChatbotWidget />
        </MemoryRouter>
      );

      fireEvent.click(
        screen.getByRole('button', { name: /abrir asesor surveysaas/i })
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      const closeBtn = screen.getByRole('button', { name: /cerrar chat/i });
      fireEvent.click(closeBtn);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /abrir asesor surveysaas/i })
      ).toBeInTheDocument();
    });
  });

  describe('Integration with LandingPage', () => {
    it('mounts the LandingChatbotWidget on LandingPage', () => {
      render(
        <MemoryRouter>
          <LandingPage />
        </MemoryRouter>
      );

      const launcher = screen.getByRole('button', {
        name: /abrir asesor surveysaas/i,
      });
      expect(launcher).toBeInTheDocument();
    });
  });
});
