import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LandingPage from "../pages/LandingPage";
import Register from "../components/register";
import PublicFooter from "../components/PublicFooter";
import * as authService from "../services/auth";

// Mock AuthContext
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
    logout: vi.fn(),
  }),
}));

// Mock auth service
vi.mock("../services/auth", () => ({
  requestRegistration: vi.fn().mockResolvedValue({ message: "OK" }),
  isTokenExpired: vi.fn().mockReturnValue(true),
  redirectBasedOnRole: vi.fn(),
  getCurrentUser: vi.fn().mockResolvedValue(null),
}));

// Mock api
vi.mock("../services/api", () => ({
  obtenerPlanesPublicos: vi.fn().mockResolvedValue([]),
  enviarContacto: vi.fn().mockResolvedValue({ success: true, message: "OK" }),
  solicitarDemo: vi.fn().mockResolvedValue({ success: true, message: "Demo solicitada" }),
}));

describe("Landing Page & Registration Updates — Unit & UI Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders updated contact email, phone, and standard email input in Landing Page", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    // Section title & address check
    expect(screen.getByText("Información de contacto")).toBeInTheDocument();
    expect(screen.getAllByText(/Manzana 40 - Plaza Empresarial/i).length).toBeGreaterThanOrEqual(1);

    // Email & Phone checks
    expect(screen.getAllByText("dedasema734012@gmail.com").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("+591 62795140").length).toBeGreaterThanOrEqual(1);

    // Contact form checks
    expect(screen.getByText("Correo electrónico")).toBeInTheDocument();
    expect(screen.queryByText("Email empresarial")).not.toBeInTheDocument();
    expect(screen.getAllByPlaceholderText("tu@gmail.com").length).toBeGreaterThanOrEqual(1);
  });

  it("renders contact section with support and corporate links without map iframe in Landing Page", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    // Section title & support contact check
    expect(screen.getByText("Información de contacto")).toBeInTheDocument();
    expect(screen.getByText(/soporte@desesoft.com/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Ir a la página de Soporte/i })).toHaveAttribute("href", "/soporte");

    // Corporate link
    const corporateLinks = screen.getAllByRole("link", { name: /Conoce a Desesoft/i });
    expect(corporateLinks.length).toBeGreaterThanOrEqual(1);

    // Map iframe should NOT be inside landing page main content
    expect(screen.queryByTitle(/Ubicación Manzana 40 - Plaza Empresarial/i)).not.toBeInTheDocument();
  });

  it("enforces both Terms and Privacy checkboxes before enabling Register button", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole("button", { name: /Crear cuenta/i });
    const termsCheck = screen.getByLabelText(/Acepto los Términos y Condiciones/i);
    const privacyCheck = screen.getByLabelText(/Acepto la Política de Privacidad/i);

    expect(termsCheck).toBeInTheDocument();
    expect(privacyCheck).toBeInTheDocument();

    // Initially disabled
    expect(submitBtn).toBeDisabled();

    // Check only Terms -> still disabled
    fireEvent.click(termsCheck);
    expect(termsCheck).toBeChecked();
    expect(privacyCheck).not.toBeChecked();
    expect(submitBtn).toBeDisabled();

    // Uncheck Terms, check only Privacy -> still disabled
    fireEvent.click(termsCheck);
    fireEvent.click(privacyCheck);
    expect(termsCheck).not.toBeChecked();
    expect(privacyCheck).toBeChecked();
    expect(submitBtn).toBeDisabled();

    // Check BOTH -> button becomes enabled
    fireEvent.click(termsCheck);
    expect(termsCheck).toBeChecked();
    expect(privacyCheck).toBeChecked();
    expect(submitBtn).not.toBeDisabled();
  });

  it("renders address and embedded Google Maps iframe directly in PublicFooter", () => {
    render(
      <MemoryRouter>
        <PublicFooter />
      </MemoryRouter>
    );

    expect(screen.getByText("Dirección:")).toBeInTheDocument();
    expect(screen.getByText(/Manzana 40 - Plaza Empresarial/i)).toBeInTheDocument();
    const footerIframe = screen.getByTitle("Mapa Manzana 40 - Footer");
    expect(footerIframe).toBeInTheDocument();
    expect(footerIframe).toHaveAttribute("src", expect.stringContaining("Manzana%2040"));
  });

  it("submits contact form with nombre, email, empresa, and mensaje to enviarContacto", async () => {
    const { enviarContacto } = await import("../services/api");
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const nameInput = screen.getByPlaceholderText("Tu nombre");
    const emailInputs = screen.getAllByPlaceholderText("tu@gmail.com");
    const contactEmailInput = emailInputs[emailInputs.length - 1];
    const empresaInput = screen.getByPlaceholderText("Nombre de tu empresa (opcional)");
    const mensajeInput = screen.getByPlaceholderText("Cuéntanos sobre tu proyecto...");
    const submitBtn = screen.getByRole("button", { name: /Enviar mensaje/i });

    fireEvent.change(nameInput, { target: { name: "nombre", value: "Carlos Ramos" } });
    fireEvent.change(contactEmailInput, { target: { name: "email", value: "carlos@gmail.com" } });
    fireEvent.change(empresaInput, { target: { name: "empresa", value: "Tech Corp" } });
    fireEvent.change(mensajeInput, { target: { name: "mensaje", value: "Hola, queremos una demo corporativa" } });

    const form = submitBtn.closest("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(enviarContacto).toHaveBeenCalledWith(
        expect.objectContaining({
          nombre: "Carlos Ramos",
          email: "carlos@gmail.com",
          empresa: "Tech Corp",
          mensaje: "Hola, queremos una demo corporativa",
        })
      );
    });
  });

  it("pre-fills email in Register component when accessed with ?email= query param", () => {
    render(
      <MemoryRouter initialEntries={["/register?email=prospecto@gmail.com"]}>
        <Register />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    expect(emailInput).toHaveValue("prospecto@gmail.com");
  });

  it("calls solicitarDemo when clicking Solicitar demo personalizada with entered email", async () => {
    const { solicitarDemo } = await import("../services/api");
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const ctaEmailInput = screen.getAllByPlaceholderText("tu@gmail.com")[0];
    const demoBtn = screen.getByRole("button", { name: /Solicitar demo personalizada/i });

    fireEvent.change(ctaEmailInput, { target: { value: "demo@empresa.com" } });
    fireEvent.click(demoBtn);

    await waitFor(() => {
      expect(solicitarDemo).toHaveBeenCalledWith("demo@empresa.com");
    });
  });
});
