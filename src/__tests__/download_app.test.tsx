import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DownloadAppPage from "../pages/DownloadAppPage";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import LandingPage from "../pages/LandingPage";

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

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
  obtenerTipoCambioOficial: vi.fn().mockResolvedValue({ valor: 11.97, es_fallback: false }),
}));

describe("SurveySaaS Mobile APK Download — Unit & UI Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  it("renders DownloadAppPage with title, download CTA button, and installation steps", () => {
    render(
      <MemoryRouter initialEntries={["/descargar-app"]}>
        <DownloadAppPage />
      </MemoryRouter>
    );

    // Headline & Badges
    expect(
      screen.getByText(/SurveySaaS Mobile • Android APK v1.0.0 Oficial/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Encuestas en Terreno con Modo Offline e Inteligencia Artificial/i })
    ).toBeInTheDocument();

    // Download CTA with size and direct APK link
    const downloadLink = screen.getByRole("link", { name: /Descargar APK Android/i });
    expect(downloadLink).toBeInTheDocument();
    expect(downloadLink).toHaveAttribute("href", "/downloads/surveysaas.apk");
    expect(downloadLink).toHaveAttribute("download", "surveysaas.apk");
    expect(screen.getByText("52.3 MB")).toBeInTheDocument();

    // Key capabilities
    expect(screen.getByText("Modo Offline First")).toBeInTheDocument();
    expect(screen.getAllByText("Digitalización OCR Papel").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Respuestas por Audio")).toBeInTheDocument();
    expect(screen.getByText("Seguridad & RBAC")).toBeInTheDocument();

    // Step-by-step installation instructions
    expect(screen.getByText("Descargar archivo APK")).toBeInTheDocument();
    expect(screen.getByText("Permitir Fuentes Desconocidas")).toBeInTheDocument();
    expect(screen.getByText("Instalar y Comenzar a Encuestar")).toBeInTheDocument();

    // Technical specifications & SHA-256 integrity
    expect(screen.getByText("1.0.0 (Release)")).toBeInTheDocument();
    expect(screen.getByText("52.3 MB (.apk)")).toBeInTheDocument();
    expect(screen.getByText("Android 7.0+")).toBeInTheDocument();
    expect(screen.getByText("Fecha de Publicación")).toBeInTheDocument();
    expect(screen.getByText("Integridad Criptográfica (SHA-256)")).toBeInTheDocument();
    expect(
      screen.getByText(/3c801817e73277894c4863d81d4d0744fb2e353e6e707723e7514e01010966a8/i)
    ).toBeInTheDocument();

    // Novedades / Changelog from version manifest
    expect(screen.getByText(/Novedades de la versión 1.0.0/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Soporte completo para Encuestas Adaptativas y Multimodales/i)
    ).toBeInTheDocument();
  });

  it("copies direct APK download link to clipboard on button click", async () => {
    render(
      <MemoryRouter initialEntries={["/descargar-app"]}>
        <DownloadAppPage />
      </MemoryRouter>
    );

    const copyBtn = screen.getByRole("button", { name: /Copiar Enlace Directo/i });
    expect(copyBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(copyBtn);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining("/downloads/surveysaas.apk")
    );
  });

  it("copies SHA-256 hash to clipboard on button click", async () => {
    render(
      <MemoryRouter initialEntries={["/descargar-app"]}>
        <DownloadAppPage />
      </MemoryRouter>
    );

    const copyHashBtn = screen.getByRole("button", { name: /Copiar Hash/i });
    expect(copyHashBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(copyHashBtn);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "3c801817e73277894c4863d81d4d0744fb2e353e6e707723e7514e01010966a8"
    );
  });

  it("renders mobile app link in PublicNavbar", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <PublicNavbar />
      </MemoryRouter>
    );

    const navbarLinks = screen.getAllByRole("link", { name: /App Móvil/i });
    expect(navbarLinks.length).toBeGreaterThanOrEqual(1);
    expect(navbarLinks[0]).toHaveAttribute("href", "/descargar-app");
  });

  it("renders mobile app link in PublicFooter", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <PublicFooter />
      </MemoryRouter>
    );

    const footerLink = screen.getByRole("link", { name: /App Móvil \(APK Android\)/i });
    expect(footerLink).toBeInTheDocument();
    expect(footerLink).toHaveAttribute("href", "/descargar-app");
  });

  it("renders App Móvil section with download CTA in LandingPage", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <LandingPage />
      </MemoryRouter>
    );

    // Offline app section
    expect(
      screen.getByRole("heading", { name: /Lleva tus encuestas a terreno con el Modo 100% Offline/i })
    ).toBeInTheDocument();

    // Download APK button on landing
    const landingDownload = screen.getByRole("link", { name: /Descargar APK \(Android\)/i });
    expect(landingDownload).toBeInTheDocument();
    expect(landingDownload).toHaveAttribute("href", "/downloads/surveysaas.apk");
    expect(landingDownload).toHaveAttribute("download", "SurveySaaS-App-v1.0.apk");

    // QR & Installation guide link
    const guideLink = screen.getByRole("link", { name: /Guía de instalación y QR/i });
    expect(guideLink).toBeInTheDocument();
    expect(guideLink).toHaveAttribute("href", "/descargar-app");
  });
});
