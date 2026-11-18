import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CopilotChatPage from "../features/copilot/components/CopilotChatPage";
import { AppLayout } from "../shared/layouts/AppLayout";
import * as copilotService from "../features/copilot/services/copilotService";
import { saveStoredSessions, getStoredSessions } from "../features/copilot/services/copilotStorage";

// Mock auth context
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    logout: vi.fn(),
    user: { id: "1", nombre: "Admin SaaS", email: "admin@saas.com" },
  }),
}));

// Mock auth service
vi.mock("../services/auth", () => ({
  getCurrentUser: vi.fn().mockResolvedValue({
    id: "1",
    nombre: "Admin SaaS",
    email: "admin@saas.com",
  }),
  getAvatarUrl: vi.fn((url) => url),
}));

// Mock copilotService
vi.mock("../features/copilot/services/copilotService", () => ({
  sendCopilotMessage: vi.fn(),
  getCopilotSessions: vi.fn().mockResolvedValue([]),
  createCopilotSession: vi.fn().mockImplementation(({ title, campana_id }) =>
    Promise.resolve({
      id: `session-mock-${Date.now()}`,
      title: title || "Nueva conversación",
      campana_id: campana_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      message_count: 0,
    })
  ),
  getCopilotSessionMessages: vi.fn().mockResolvedValue([]),
  deleteCopilotSession: vi.fn().mockResolvedValue({ success: true }),
}));

describe("Consola Central Copiloto IA (MCP & RAG) — Unit & UI Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders full ChatGPT-style console with session sidebar and starter prompts", () => {
    render(
      <MemoryRouter>
        <CopilotChatPage role="suscriptor" />
      </MemoryRouter>
    );

    // Sidebar elements
    expect(screen.getAllByText(/Copiloto IA/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("MCP & RAG Unificado")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Nueva conversación/i })).toBeInTheDocument();

    // Central chat headers
    expect(screen.getByText("MCP AI + RAG")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Preguntale al Copiloto sobre campañas, métricas/i)).toBeInTheDocument();

    // Initial greeting and suggested actions
    expect(screen.getByText(/Resumen de mi empresa/i)).toBeInTheDocument();
    expect(screen.getByText(/Ver campañas activas/i)).toBeInTheDocument();
    expect(screen.getByText(/Análisis semántico RAG/i)).toBeInTheDocument();
  });

  it("creates a new conversation session when clicking '+ Nueva conversación'", async () => {
    render(
      <MemoryRouter>
        <CopilotChatPage role="suscriptor" />
      </MemoryRouter>
    );

    const newChatBtn = screen.getByRole("button", { name: /Nueva conversación/i });
    await act(async () => {
      fireEvent.click(newChatBtn);
    });

    await waitFor(() => {
      const stored = getStoredSessions();
      expect(stored.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("sends message, renders Markdown, executes MCP tools, and displays RAG citations", async () => {
    (copilotService.sendCopilotMessage as any).mockResolvedValueOnce({
      answer: "Aquí tienes el análisis semántico con citas:\n\n• **Alta satisfacción** con el modo offline.\n• Sugerencias de pasarela QR.",
      tools_used: [
        {
          tool: "consultar_alertas_fraude",
          arguments: { campana_id: "all" },
          result_summary: "0 alertas registradas",
        },
      ],
      suggested_actions: ["Ver métricas de hoy", "Listar operadores"],
      fuentes_citadas: [
        {
          id: "src-1",
          tipo: "respuesta",
          canal: "voz",
          campana: "Encuesta Santa Cruz",
          fragmento: "La app funcionó excelente en el campo sin señal.",
          similitud_score: 0.95,
        },
      ],
    });

    render(
      <MemoryRouter>
        <CopilotChatPage role="suscriptor" />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Preguntale al Copiloto sobre campañas, métricas/i);
    fireEvent.change(input, { target: { value: "¿Qué opinan del modo offline?" } });

    const sendBtn = screen.getByTitle("Enviar mensaje (Enter)");
    await act(async () => {
      fireEvent.click(sendBtn);
    });

    expect(copilotService.sendCopilotMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "¿Qué opinan del modo offline?",
      })
    );

    // Markdown rendered
    expect(screen.getByText(/Alta satisfacción/i)).toBeInTheDocument();

    // MCP tools badge
    expect(screen.getByText(/⚡ Herramientas MCP ejecutadas \(1\)/i)).toBeInTheDocument();

    // RAG sources badge
    expect(screen.getByText(/📚 Fuentes Citadas Verificadas \(RAG\) \(1\)/i)).toBeInTheDocument();

    // Click to open RAG sources
    fireEvent.click(screen.getByText(/📚 Fuentes Citadas Verificadas \(RAG\) \(1\)/i));
    expect(screen.getByText(/La app funcionó excelente en el campo sin señal/i)).toBeInTheDocument();
  });

  it("persists sessions across reloads in localStorage", () => {
    localStorage.setItem("user", JSON.stringify({ id: "1", nombre: "Admin SaaS" }));
    saveStoredSessions([
      {
        id: "sess-persist-1",
        title: "Chat de prueba guardado",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        campanaId: null,
        messages: [
          {
            id: "msg-1",
            sender: "user",
            text: "Pregunta previa",
            timestamp: "10:00",
          },
          {
            id: "msg-2",
            sender: "assistant",
            text: "Respuesta previa persistida",
            timestamp: "10:01",
          },
        ],
      },
    ]);

    render(
      <MemoryRouter>
        <CopilotChatPage role="suscriptor" />
      </MemoryRouter>
    );

    expect(screen.getAllByText("Chat de prueba guardado").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Respuesta previa persistida")).toBeInTheDocument();
  });

  it("does not render Copiloto IA in the SuperAdmin (role='admin') sidebar navigation", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard/metricas"]}>
        <AppLayout role="admin">
          <div>Admin Content</div>
        </AppLayout>
      </MemoryRouter>
    );

    expect(screen.getByText("Panel Administrativo")).toBeInTheDocument();
    expect(screen.queryByText("Copiloto IA")).not.toBeInTheDocument();
    expect(screen.queryByText("Inteligencia Artificial")).not.toBeInTheDocument();
  });
});
