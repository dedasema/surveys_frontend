import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CopilotWidget from "../features/copilot/components/CopilotWidget";
import * as copilotService from "../features/copilot/services/copilotService";

// Mock copilotService
vi.mock("../features/copilot/services/copilotService", () => ({
  sendCopilotMessage: vi.fn(),
}));

describe("Copiloto Inteligente MCP — Unit & UI Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders floating trigger button and opens Copilot window on click", () => {
    render(
      <MemoryRouter>
        <CopilotWidget activeSection="dashboard" />
      </MemoryRouter>
    );

    // Check trigger button
    const triggerBtn = screen.getByRole("button", { name: /Abrir Copiloto Inteligente/i });
    expect(triggerBtn).toBeInTheDocument();
    expect(screen.getByText("Copiloto IA")).toBeInTheDocument();
    expect(screen.getByText("MCP")).toBeInTheDocument();

    // Click to open
    fireEvent.click(triggerBtn);

    // Header checks
    expect(screen.getByText("SurveySaaS Copilot")).toBeInTheDocument();
    expect(screen.getByText("MCP AI")).toBeInTheDocument();

    // Initial message checks
    expect(screen.getByText(/Copiloto Inteligente con arquitectura MCP/i)).toBeInTheDocument();
    expect(screen.getByText(/Resumen general/i)).toBeInTheDocument();
    expect(screen.getByText(/Alertas de fraude con IA/i)).toBeInTheDocument();
  });

  it("auto-detects campana_id from props or context and displays active context badge", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard-suscriptor/campanas?campana_id=camp-uuid-12345678"]}>
        <CopilotWidget campanaId="camp-uuid-12345678" />
      </MemoryRouter>
    );

    // Open chat
    const triggerBtn = screen.getByRole("button", { name: /Abrir Copiloto Inteligente/i });
    fireEvent.click(triggerBtn);

    // Check active campaign context banner
    expect(screen.getByText(/Contexto activo: Campaña/i)).toBeInTheDocument();
    expect(screen.getByText(/camp-uui\.\.\./i)).toBeInTheDocument();
    expect(screen.getByText(/Filtro automático/i)).toBeInTheDocument();
  });

  it("sends message to backend, renders Markdown answer, and displays MCP tools badge", async () => {
    vi.mocked(copilotService.sendCopilotMessage).mockResolvedValue({
      answer: "## Resumen de Empresa\nTu empresa tiene **5 campañas activas** y un total de `1,420` respuestas.\n\n• Campaña 1: 95% completitud\n• Campaña 2: 88% completitud\n\n[Ver Detalles](/dashboard-suscriptor/campanas)",
      tools_used: [
        {
          tool: "obtener_resumen_empresa",
          arguments: {},
          result_summary: "Empresa con plan Profesional, 5 campañas y 1420 respuestas.",
        },
      ],
      suggested_actions: ["Ver campañas activas", "Auditar fraudes"],
    });

    render(
      <MemoryRouter>
        <CopilotWidget activeSection="dashboard" />
      </MemoryRouter>
    );

    // Open chat
    fireEvent.click(screen.getByRole("button", { name: /Abrir Copiloto Inteligente/i }));

    const input = screen.getByPlaceholderText(/Pregúntale a Gemini o al Copiloto MCP/i);
    fireEvent.change(input, { target: { value: "¿Cómo está mi empresa hoy?" } });

    const submitBtn = screen.getByTitle("Enviar mensaje");

    await act(async () => {
      fireEvent.click(submitBtn);
    });

    // Check payload passed to service
    expect(copilotService.sendCopilotMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "¿Cómo está mi empresa hoy?",
      })
    );

    // Check rendered markdown answer
    expect(screen.getByText("Resumen de Empresa")).toBeInTheDocument();
    expect(screen.getByText("5 campañas activas")).toBeInTheDocument();
    expect(screen.getByText("1,420")).toBeInTheDocument();
    expect(screen.getByText("Ver Detalles")).toBeInTheDocument();

    // Check tools_used badge
    expect(screen.getByText(/⚡ Herramientas MCP:/i)).toBeInTheDocument();
    expect(screen.getByText("obtener_resumen_empresa")).toBeInTheDocument();

    // Toggle tools details
    const toolsBtn = screen.getByTitle("Ver herramientas MCP ejecutadas");
    await act(async () => {
      fireEvent.click(toolsBtn);
    });
    expect(screen.getByText(/Empresa con plan Profesional, 5 campañas/i)).toBeInTheDocument();

    // Check suggested action pills
    expect(screen.getByText("Ver campañas activas")).toBeInTheDocument();
    expect(screen.getByText("Auditar fraudes")).toBeInTheDocument();
  });

  it("submits suggested action as a new message when clicked", async () => {
    vi.mocked(copilotService.sendCopilotMessage)
      .mockResolvedValueOnce({
        answer: "Aquí tienes tus opciones iniciales.",
        tools_used: [],
        suggested_actions: ["Auditar fraudes de hoy"],
      })
      .mockResolvedValueOnce({
        answer: "Se detectaron 0 alertas de fraude el día de hoy.",
        tools_used: [
          {
            tool: "consultar_alertas_fraude",
            arguments: {},
            result_summary: "0 alertas registradas en las últimas 24h.",
          },
        ],
        suggested_actions: [],
      });

    render(
      <MemoryRouter>
        <CopilotWidget activeSection="dashboard" />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Abrir Copiloto Inteligente/i }));

    const input = screen.getByPlaceholderText(/Pregúntale a Gemini o al Copiloto MCP/i);
    fireEvent.change(input, { target: { value: "Hola" } });

    await act(async () => {
      fireEvent.click(screen.getByTitle("Enviar mensaje"));
    });

    // Suggested action pill appears
    const actionBtn = screen.getByRole("button", { name: /Auditar fraudes de hoy/i });
    expect(actionBtn).toBeInTheDocument();

    // Click suggested action
    await act(async () => {
      fireEvent.click(actionBtn);
    });

    expect(copilotService.sendCopilotMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Auditar fraudes de hoy",
      })
    );

    expect(screen.getByText(/0 alertas de fraude el día de hoy/i)).toBeInTheDocument();
  });

  it("resets conversation to initial welcome state when clicking reset button", async () => {
    render(
      <MemoryRouter>
        <CopilotWidget activeSection="dashboard" />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Abrir Copiloto Inteligente/i }));

    const input = screen.getByPlaceholderText(/Pregúntale a Gemini o al Copiloto MCP/i);
    fireEvent.change(input, { target: { value: "Mensaje temporal" } });

    // Click reset button
    const resetBtn = screen.getByTitle("Reiniciar conversación");
    fireEvent.click(resetBtn);

    expect(screen.getByText(/Copiloto Inteligente con arquitectura MCP/i)).toBeInTheDocument();
  });
});
