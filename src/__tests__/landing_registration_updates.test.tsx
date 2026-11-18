import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LandingPage from "../pages/LandingPage";
import Register from "../components/register";
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

    // Email & Phone checks
    expect(screen.getAllByText("dedasema734012@gmail.com").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("+591 62795140").length).toBeGreaterThanOrEqual(1);

    // Contact form checks
    expect(screen.getByText("Correo electrónico")).toBeInTheDocument();
    expect(screen.queryByText("Email empresarial")).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText("tu@gmail.com")).toBeInTheDocument();
  });

  it("renders Manzana 40 Plaza Empresarial location and Google Maps iframe in Landing Page", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    // Location heading & address
    expect(screen.getAllByText(/Manzana 40 - Plaza Empresarial/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Av\. San Martin, Santa Cruz de la Sierra/i).length).toBeGreaterThanOrEqual(1);

    // Map iframe check
    const iframe = screen.getByTitle(/Ubicación Manzana 40/i);
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", expect.stringContaining("Manzana%2040"));
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
});
