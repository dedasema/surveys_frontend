import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { PlanCheckoutModal } from "../features/pagofacil/components/PlanCheckoutModal";
import * as api from "../services/api";

// Mock API functions
vi.mock("../services/api", async () => {
  const actual = await vi.importActual("../services/api");
  return {
    ...actual,
    generarPagoFacilQR: vi.fn(),
    consultarPagoFacilEstado: vi.fn(),
    iniciarStripeCheckout: vi.fn(),
  };
});

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

const mockPlan = {
  id: 2,
  nombre: "Profesional",
  precio_mensual: "29.99",
  descripcion: "Plan profesional con funciones avanzadas e IA",
  max_plantillas: 50,
  max_campanas: 50,
  max_entregas: 5000,
  max_operadores: 5,
};

const mockUserProfile = {
  id: "sub-123",
  nombre: "Mi Empresa SRL",
  nit: "1234567019",
  telefono: "77123456",
};

describe("PagoFácil QR Checkout — Unit & Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders payment method selector with PagoFácil QR and Stripe options", () => {
    render(
      <PlanCheckoutModal
        isOpen={true}
        onClose={vi.fn()}
        plan={mockPlan}
        suscriptorId="sub-123"
        userProfile={mockUserProfile}
      />
    );

    expect(screen.getByText("Finalizar Suscripción")).toBeInTheDocument();
    expect(screen.getByText(/Plan Profesional • \$29.99 USD \/ mes/i)).toBeInTheDocument();
    expect(screen.getByText("QR PagoFácil (Bolivia - Bs.)")).toBeInTheDocument();
    expect(screen.getByText("Tarjeta de Crédito / Débito (Stripe)")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Pagar con QR \(Bolivia en Bs\.\)/i })
    ).toBeInTheDocument();
  });

  it("switches to Stripe button when selecting credit card method and triggers checkout", async () => {
    vi.mocked(api.iniciarStripeCheckout).mockResolvedValue({
      checkout_url: "https://checkout.stripe.com/test_session",
    });

    render(
      <PlanCheckoutModal
        isOpen={true}
        onClose={vi.fn()}
        plan={mockPlan}
        suscriptorId="sub-123"
        userProfile={mockUserProfile}
      />
    );

    // Click Stripe option
    const stripeRadio = screen.getByDisplayValue("stripe");
    fireEvent.click(stripeRadio);

    const stripeButton = screen.getByRole("button", { name: /Continuar con Stripe Checkout/i });
    expect(stripeButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(stripeButton);
    });

    expect(api.iniciarStripeCheckout).toHaveBeenCalledWith("sub-123", 2);
  });

  it("generates QR code, renders base64 image and starts polling status", async () => {
    vi.mocked(api.generarPagoFacilQR).mockResolvedValue({
      success: true,
      payment_number: "PF-20261117-TEST01",
      transaction_id: "pf_tx_9988",
      status: "pendiente",
      qr_base64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
      deep_link: "pagofacil://qr/test",
      monto: 208.73,
      moneda: "BOB",
      plan_nombre: "Profesional",
    });

    vi.mocked(api.consultarPagoFacilEstado).mockResolvedValue({
      success: true,
      payment_number: "PF-20261117-TEST01",
      estado: "pendiente",
      pagado: false,
      monto: 208.73,
      moneda: "BOB",
      mensaje: "Transacción pendiente",
    });

    render(
      <PlanCheckoutModal
        isOpen={true}
        onClose={vi.fn()}
        plan={mockPlan}
        suscriptorId="sub-123"
        userProfile={mockUserProfile}
      />
    );

    const generateQRBtn = screen.getByRole("button", { name: /Pagar con QR \(Bolivia en Bs\.\)/i });

    await act(async () => {
      fireEvent.click(generateQRBtn);
    });

    // Check payload passed to API
    expect(api.generarPagoFacilQR).toHaveBeenCalledWith(
      expect.objectContaining({
        plan_id: 2,
        client_name: "Mi Empresa SRL",
        document_id: "1234567019",
      })
    );

    // Verify QR step elements
    expect(screen.getByText("Pagar con QR PagoFácil")).toBeInTheDocument();
    expect(screen.getByText(/208.73/)).toBeInTheDocument();
    expect(screen.getByText("PF-20261117-TEST01")).toBeInTheDocument();

    const qrImage = screen.getByAltText("Código QR PagoFácil");
    expect(qrImage).toBeInTheDocument();
    expect(qrImage).toHaveAttribute(
      "src",
      expect.stringContaining("data:image/png;base64,iVBORw0KGgoAAAANSUhEUg")
    );

    expect(screen.getByText("Descargar QR")).toBeInTheDocument();
    expect(screen.getByText("Abrir en Banca Móvil")).toBeInTheDocument();
    expect(screen.getByText(/Esperando confirmación bancaria automática/i)).toBeInTheDocument();

    // Advance timers to trigger polling
    await act(async () => {
      vi.advanceTimersByTime(3500);
    });

    expect(api.consultarPagoFacilEstado).toHaveBeenCalledWith("PF-20261117-TEST01");
  });

  it("detects successful payment via polling and transitions to success state", async () => {
    vi.mocked(api.generarPagoFacilQR).mockResolvedValue({
      success: true,
      payment_number: "PF-SUCCESS-123",
      status: "pendiente",
      qr_base64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
      monto: 208.73,
      moneda: "BOB",
      plan_nombre: "Profesional",
    });

    // Initially pending, then confirmed
    vi.mocked(api.consultarPagoFacilEstado)
      .mockResolvedValueOnce({
        success: true,
        payment_number: "PF-SUCCESS-123",
        estado: "pendiente",
        pagado: false,
        monto: 208.73,
        moneda: "BOB",
        mensaje: "Pendiente",
      })
      .mockResolvedValueOnce({
        success: true,
        payment_number: "PF-SUCCESS-123",
        estado: "completado",
        pagado: true,
        monto: 208.73,
        moneda: "BOB",
        mensaje: "Pago completado exitosamente",
      });

    const mockSuccessCallback = vi.fn();

    render(
      <PlanCheckoutModal
        isOpen={true}
        onClose={vi.fn()}
        plan={mockPlan}
        suscriptorId="sub-123"
        onSuccess={mockSuccessCallback}
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Pagar con QR \(Bolivia en Bs\.\)/i }));
    });

    // First poll (pending)
    await act(async () => {
      vi.advanceTimersByTime(3500);
    });

    expect(screen.getByText("PF-SUCCESS-123")).toBeInTheDocument();

    // Second poll (paid!)
    await act(async () => {
      vi.advanceTimersByTime(3500);
    });

    expect(screen.getAllByText("¡Pago Confirmado!").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/ha sido activada con éxito/i)).toBeInTheDocument();

    // Advance redirection timer
    await act(async () => {
      vi.advanceTimersByTime(2500);
    });

    expect(mockSuccessCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        pagado: true,
        payment_number: "PF-SUCCESS-123",
      })
    );
  });

  it("stops polling when closing the modal", async () => {
    vi.mocked(api.generarPagoFacilQR).mockResolvedValue({
      success: true,
      payment_number: "PF-CANCEL-123",
      status: "pendiente",
      qr_base64: "dummy_base64",
      monto: 208.73,
      moneda: "BOB",
      plan_nombre: "Profesional",
    });

    const onClose = vi.fn();

    const { rerender } = render(
      <PlanCheckoutModal
        isOpen={true}
        onClose={onClose}
        plan={mockPlan}
        suscriptorId="sub-123"
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Pagar con QR/i }));
    });

    // Close modal
    const closeBtn = screen.getByTitle("Cerrar modal");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();

    rerender(
      <PlanCheckoutModal
        isOpen={false}
        onClose={onClose}
        plan={mockPlan}
        suscriptorId="sub-123"
      />
    );

    // Advance timers; no new calls should happen
    vi.mocked(api.consultarPagoFacilEstado).mockClear();
    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    expect(api.consultarPagoFacilEstado).not.toHaveBeenCalled();
  });
});
