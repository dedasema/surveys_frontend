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

const mockTipoCambio = {
  valor: 11.97,
  fuente: "Banco Central de Bolivia (bcb.gob.bo)",
  moneda: "USD/BOB",
  fecha: "2026-10-06",
  es_fallback: false,
};

describe("PagoFácil QR Checkout — Unit & Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders payment method selector with PagoFácil QR, dynamic exchange rate, sandbox notice, and Pagar con QR Simple button", () => {
    render(
      <PlanCheckoutModal
        isOpen={true}
        onClose={vi.fn()}
        plan={mockPlan}
        suscriptorId="sub-123"
        userProfile={mockUserProfile}
        tipoCambio={mockTipoCambio}
      />
    );

    expect(screen.getByText("Finalizar Suscripción")).toBeInTheDocument();
    expect(screen.getByText(/Plan Profesional • \$29.99 USD \/ mes/i)).toBeInTheDocument();
    expect(screen.getByText("QR PagoFácil (Bolivia - Bs.)")).toBeInTheDocument();
    expect(screen.getByText("Tarjeta de Crédito / Débito (Stripe)")).toBeInTheDocument();

    // Exchange rate calculation display (29.99 * 11.97 = 358.98)
    expect(screen.getByText(/358.98 BOB/)).toBeInTheDocument();
    expect(screen.getByText(/TC: 11.97/)).toBeInTheDocument();

    // Sandbox test mode notice badge
    expect(screen.getByText("Modo Sandbox / Pruebas")).toBeInTheDocument();
    expect(screen.getByText(/valor simbólico de/i)).toBeInTheDocument();
    expect(screen.getByText(/Bs\. 0\.36/i)).toBeInTheDocument();

    // Action button
    expect(
      screen.getByRole("button", { name: /Pagar con QR Simple/i })
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
        tipoCambio={mockTipoCambio}
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

  it("generates QR code, renders base64 image, shows test vs real amounts, and copies order code to clipboard", async () => {
    vi.mocked(api.generarPagoFacilQR).mockResolvedValue({
      success: true,
      payment_number: "PF-20261117-TEST01",
      transaction_id: "pf_tx_9988",
      status: "pendiente",
      qr_base64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
      deep_link: "pagofacil://qr/test",
      monto: 358.98,
      monto_real_bob: 358.98,
      monto_qr: 0.36,
      tipo_cambio: 11.97,
      es_fallback_tc: false,
      moneda: "BOB",
      plan_nombre: "Profesional",
    });

    vi.mocked(api.consultarPagoFacilEstado).mockResolvedValue({
      success: true,
      payment_number: "PF-20261117-TEST01",
      status: "pendiente",
      pagado: false,
      monto: 358.98,
      monto_qr: 0.36,
      tipo_cambio: 11.97,
      mensaje: "Transacción pendiente",
    });

    render(
      <PlanCheckoutModal
        isOpen={true}
        onClose={vi.fn()}
        plan={mockPlan}
        suscriptorId="sub-123"
        userProfile={mockUserProfile}
        tipoCambio={mockTipoCambio}
      />
    );

    const generateQRBtn = screen.getByRole("button", { name: /Pagar con QR Simple/i });

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
    expect(screen.getByText("PF-20261117-TEST01")).toBeInTheDocument();

    // Monto de prueba destacado
    expect(screen.getByText("Monto de prueba a escanear")).toBeInTheDocument();
    expect(screen.getByText(/0\.36/)).toBeInTheDocument();

    // Monto real de suscripción
    expect(screen.getByText(/358.98 BOB/)).toBeInTheDocument();
    expect(screen.getAllByText(/\$29\.99 USD/).length).toBeGreaterThanOrEqual(1);

    // Tipo de cambio aplicado
    expect(screen.getByText(/Tipo de cambio aplicado: 1 USD = 11.97 BOB \(BCB\)/i)).toBeInTheDocument();

    // Test clipboard copy
    const copyBtn = screen.getByRole("button", { name: /Copiar al portapapeles/i });
    await act(async () => {
      fireEvent.click(copyBtn);
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("PF-20261117-TEST01");

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
      vi.advanceTimersByTime(3000);
    });

    expect(api.consultarPagoFacilEstado).toHaveBeenCalledWith("PF-20261117-TEST01");
  });

  it("detects successful payment via polling and transitions to success state", async () => {
    vi.mocked(api.generarPagoFacilQR).mockResolvedValue({
      success: true,
      payment_number: "PF-SUCCESS-123",
      status: "pendiente",
      qr_base64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
      monto: 358.98,
      monto_qr: 0.36,
      moneda: "BOB",
      plan_nombre: "Profesional",
    });

    // Initially pending, then confirmed
    vi.mocked(api.consultarPagoFacilEstado)
      .mockResolvedValueOnce({
        success: true,
        payment_number: "PF-SUCCESS-123",
        status: "pendiente",
        pagado: false,
        monto: 358.98,
        monto_qr: 0.36,
        tipo_cambio: 11.97,
        mensaje: "Pendiente",
      })
      .mockResolvedValueOnce({
        success: true,
        payment_number: "PF-SUCCESS-123",
        status: "completado",
        pagado: true,
        monto: 358.98,
        monto_qr: 0.36,
        tipo_cambio: 11.97,
        mensaje: "Pago completado exitosamente",
      });

    const mockSuccessCallback = vi.fn();

    render(
      <PlanCheckoutModal
        isOpen={true}
        onClose={vi.fn()}
        plan={mockPlan}
        suscriptorId="sub-123"
        tipoCambio={mockTipoCambio}
        onSuccess={mockSuccessCallback}
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Pagar con QR Simple/i }));
    });

    // First poll (pending)
    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText("PF-SUCCESS-123")).toBeInTheDocument();

    // Second poll (paid!)
    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getAllByText("¡Pago Confirmado!").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/ha sido activada con éxito/i)).toBeInTheDocument();

    // Advance redirection timer
    await act(async () => {
      vi.advanceTimersByTime(2500);
    });

    expect(mockSuccessCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "completado",
        pagado: true,
        payment_number: "PF-SUCCESS-123",
      })
    );
  });

  it("handles expired status from polling and allows re-generating QR", async () => {
    vi.mocked(api.generarPagoFacilQR).mockResolvedValue({
      success: true,
      payment_number: "PF-EXPIRED-99",
      status: "pendiente",
      qr_base64: "dummy_base64",
      monto: 358.98,
      monto_qr: 0.36,
      moneda: "BOB",
      plan_nombre: "Profesional",
    });

    vi.mocked(api.consultarPagoFacilEstado).mockResolvedValueOnce({
      payment_number: "PF-EXPIRED-99",
      status: "expirado",
      pagado: false,
      monto: 358.98,
      monto_qr: 0.36,
      tipo_cambio: 11.97,
      mensaje: "El código QR ha expirado",
    });

    render(
      <PlanCheckoutModal
        isOpen={true}
        onClose={vi.fn()}
        plan={mockPlan}
        suscriptorId="sub-123"
        tipoCambio={mockTipoCambio}
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Pagar con QR Simple/i }));
    });

    // Trigger polling to receive status: "expirado"
    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText("El código QR ha expirado")).toBeInTheDocument();
    const retryBtn = screen.getByRole("button", { name: /Reintentar \/ Generar nuevo QR/i });
    expect(retryBtn).toBeInTheDocument();

    // Clicking retry calls generarPagoFacilQR again
    await act(async () => {
      fireEvent.click(retryBtn);
    });

    expect(api.generarPagoFacilQR).toHaveBeenCalledTimes(2);
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

  it("handles scheduled downgrade without showing QR when backend returns status 'programado'", async () => {
    vi.mocked(api.generarPagoFacilQR).mockResolvedValue({
      status: "programado",
      monto_real_bob: 0.0,
      qr_base64: null,
      mensaje:
        "Tu plan actual 'Profesional' se mantendrá activo hasta el 30/11/2026. El cambio a 'Básico' entrará en vigencia al finalizar tu ciclo sin costos adicionales hoy.",
    });

    render(
      <PlanCheckoutModal
        isOpen={true}
        onClose={vi.fn()}
        plan={{ id: 1, nombre: "Básico", precio_mensual: "9.99" }}
        suscriptorId="sub-123"
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Pagar con QR/i }));
    });

    expect(screen.getByText("¡Cambio de Plan Registrado!")).toBeInTheDocument();
    expect(
      screen.getByText(/Tu plan actual 'Profesional' se mantendrá activo hasta el 30\/11\/2026/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Bs. 0.00 BOB")).toBeInTheDocument();
    expect(screen.getByText("Entendido / Volver a Planes")).toBeInTheDocument();
  });

  it("displays alert error message when downgrade is rejected due to resource limits (400 Bad Request)", async () => {
    vi.mocked(api.generarPagoFacilQR).mockRejectedValue(
      new Error("No puedes bajar de plan porque tienes 4 operadores activos y el plan básico permite máximo 1.")
    );

    render(
      <PlanCheckoutModal
        isOpen={true}
        onClose={vi.fn()}
        plan={{ id: 1, nombre: "Básico", precio_mensual: "9.99" }}
        suscriptorId="sub-123"
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Pagar con QR/i }));
    });

    expect(screen.getByText("No es posible cambiar a este plan")).toBeInTheDocument();
    expect(
      screen.getByText(/No puedes bajar de plan porque tienes 4 operadores activos/i)
    ).toBeInTheDocument();
  });
});

