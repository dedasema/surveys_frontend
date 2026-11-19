import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UserManualPage from "../pages/UserManualPage";
import LandingPage from "../pages/LandingPage";

// Mock AuthContext
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
    logout: vi.fn(),
  }),
}));

// Mock api
vi.mock("../services/api", () => ({
  obtenerPlanesPublicos: vi.fn().mockResolvedValue([]),
  enviarContacto: vi.fn().mockResolvedValue({ success: true }),
  solicitarDemo: vi.fn().mockResolvedValue({ success: true }),
}));

describe("User Manual Page & Landing Section — Unit & Integrity Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders User Manual page with default Empresa (Suscriptor) view and all chapters", () => {
    render(
      <MemoryRouter>
        <UserManualPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 1, name: /Manual de Usuario/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Rol: Empresa \(Suscriptor\)/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Rol: Operador de Campo \(App Móvil\)/i })).toBeInTheDocument();

    // Verify Empresa chapters
    expect(screen.getByText(/Panel de Control y Métricas Ejecutivas \(Dashboard\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Diseño de Plantillas y Constructor de Preguntas/i)).toBeInTheDocument();
    expect(screen.getByText(/Planificación, Canales y Creación de Campañas/i)).toBeInTheDocument();
    expect(screen.getByText(/Directorio de Destinatarios e Importación Masiva/i)).toBeInTheDocument();
    expect(screen.getByText(/Inteligencia Artificial: Clusters Semánticos/i)).toBeInTheDocument();
  });

  it("switches to Operador de Campo view when toggling the role selector", () => {
    render(
      <MemoryRouter>
        <UserManualPage />
      </MemoryRouter>
    );

    const operadorBtn = screen.getByRole("button", { name: /Rol: Operador de Campo \(App Móvil\)/i });
    fireEvent.click(operadorBtn);

    // Verify Operador chapters
    expect(screen.getByText(/Descarga e Instalación del APK Móvil Oficial/i)).toBeInTheDocument();
    expect(screen.getByText(/Modo 100% Offline y Cola de Sincronización/i)).toBeInTheDocument();
    expect(screen.getByText(/Digitalización Fotográfica y OCR de Formularios en Papel/i)).toBeInTheDocument();
    expect(screen.getByText(/Grabación y Transcripción de Respuestas por Voz/i)).toBeInTheDocument();
  });

  it("strictly enforces zero mentions of Superadministrador or Superadmin in the user manual", () => {
    const { container } = render(
      <MemoryRouter>
        <UserManualPage />
      </MemoryRouter>
    );

    // Switch both views and inspect container text
    expect(container.textContent).not.toMatch(/superadministrador/i);
    expect(container.textContent).not.toMatch(/superadmin/i);

    const operadorBtn = screen.getByRole("button", { name: /Rol: Operador de Campo \(App Móvil\)/i });
    fireEvent.click(operadorBtn);

    expect(container.textContent).not.toMatch(/superadministrador/i);
    expect(container.textContent).not.toMatch(/superadmin/i);
  });

  it("triggers window.print when clicking Imprimir / Guardar PDF", () => {
    const printSpy = vi.spyOn(window, "print").mockImplementation(() => {});
    render(
      <MemoryRouter>
        <UserManualPage />
      </MemoryRouter>
    );

    const printBtn = screen.getByRole("button", { name: /Imprimir \/ Guardar PDF/i });
    fireEvent.click(printBtn);

    expect(printSpy).toHaveBeenCalledTimes(1);
    printSpy.mockRestore();
  });

  it("renders Manual de Usuario section in LandingPage with direct links to /manual", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Manual de Usuario del Sistema/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Ver Manual de la Empresa/i })).toHaveAttribute("href", "/manual");
    expect(screen.getByRole("link", { name: /Ver Manual del Operador/i })).toHaveAttribute("href", "/manual");
    expect(screen.getByRole("link", { name: /Explorar Manual Completo/i })).toHaveAttribute("href", "/manual-usuario");
  });
});
