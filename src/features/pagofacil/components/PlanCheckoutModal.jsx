import React, { useState, useEffect, useRef } from "react";
import {
  CreditCard,
  QrCode,
  X,
  ArrowLeft,
  CheckCircle2,
  Download,
  ExternalLink,
  Loader2,
  ShieldCheck,
  Building2,
  Smartphone,
  Info,
  Copy,
  Check,
  AlertTriangle,
  RefreshCw,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { generarPagoFacilQR, consultarPagoFacilEstado, iniciarStripeCheckout } from "../../../services/api";

export const PlanCheckoutModal = ({
  isOpen = false,
  onClose = () => {},
  plan = null,
  suscriptorId = "",
  userProfile = null,
  tipoCambio = null,
  onSuccess = null,
}) => {
  const [selectedMethod, setSelectedMethod] = useState("pagofacil"); // 'stripe' | 'pagofacil'
  const [step, setStep] = useState("select"); // 'select' | 'qr' | 'success'
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [pollingActive, setPollingActive] = useState(false);
  const [pollingStatus, setPollingStatus] = useState("pendiente"); // 'pendiente' | 'completado' | 'expirado' | 'fallido'
  const [copied, setCopied] = useState(false);

  // Optional billing / transaction data
  const [billingInfo, setBillingInfo] = useState({
    client_name: "",
    document_id: "",
    phone_number: "",
  });

  const pollingTimerRef = useRef(null);
  const pollingStartTimeRef = useRef(null);

  // Initialize prefilled billing information when opened
  useEffect(() => {
    if (isOpen) {
      setStep("select");
      setQrData(null);
      setLoading(false);
      setPollingActive(false);
      setPollingStatus("pendiente");
      setCopied(false);
      setSelectedMethod("pagofacil");

      if (userProfile) {
        setBillingInfo({
          client_name: userProfile.nombre || userProfile.name || "",
          document_id: userProfile.nit || userProfile.ci || "",
          phone_number: userProfile.telefono || userProfile.phone || "",
        });
      }
    } else {
      stopPolling();
    }
    return () => {
      stopPolling();
    };
  }, [isOpen, userProfile]);

  const stopPolling = () => {
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
      pollingTimerRef.current = null;
    }
    setPollingActive(false);
  };

  const handleStartStripe = async () => {
    if (!suscriptorId) {
      toast.warning("No se ha identificado al suscriptor. Por favor recarga la página.");
      return;
    }

    try {
      setLoading(true);
      const res = await iniciarStripeCheckout(suscriptorId, plan.id);
      if (res?.checkout_url) {
        window.location.href = res.checkout_url;
      } else {
        toast.error("No se pudo obtener el enlace de pago de Stripe.");
      }
    } catch (err) {
      console.error("Error iniciando Stripe checkout:", err);
      toast.error(err.message || "Error al conectar con Stripe.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerarQR = async () => {
    try {
      setLoading(true);
      setPollingStatus("pendiente");
      const payload = {
        plan_id: plan.id,
        document_id: billingInfo.document_id.trim() || undefined,
        document_type: 1, // CI / NIT
        phone_number: billingInfo.phone_number.trim() || undefined,
        client_name: billingInfo.client_name.trim() || undefined,
      };

      const data = await generarPagoFacilQR(payload);

      if (data && (data.success || data.qr_base64 || data.payment_number)) {
        setQrData(data);
        setStep("qr");
        startPolling(data.payment_number);
      } else {
        toast.error("No se pudo generar el código QR. Intenta nuevamente.");
      }
    } catch (err) {
      console.error("Error generando QR PagoFácil:", err);
      toast.error(err.message || "Error al generar el código QR.");
    } finally {
      setLoading(false);
    }
  };

  const POLLING_INTERVAL_MS = 3000;
  const POLLING_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes timeout

  const startPolling = (paymentNumber) => {
    stopPolling();
    setPollingActive(true);
    setPollingStatus("pendiente");
    pollingStartTimeRef.current = Date.now();

    pollingTimerRef.current = setInterval(async () => {
      // Check 10 min timeout
      if (Date.now() - pollingStartTimeRef.current > POLLING_TIMEOUT_MS) {
        stopPolling();
        setPollingStatus("expirado");
        toast.warning("El código QR ha expirado (tiempo límite de 10 minutos superado).");
        return;
      }

      try {
        const res = await consultarPagoFacilEstado(paymentNumber);
        if (res) {
          const isPaid =
            res.pagado === true ||
            res.status === "completado" ||
            res.estado === "completado";
          const isExpired = res.status === "expirado" || res.estado === "expirado";
          const isFailed = res.status === "fallido" || res.estado === "fallido";

          if (isPaid) {
            stopPolling();
            setPollingStatus("completado");
            setStep("success");
            toast.success("¡Pago confirmado! Tu suscripción ha sido activada con éxito.");

            setTimeout(() => {
              if (onSuccess) {
                onSuccess(res);
              } else {
                window.location.href = `/dashboard-suscriptor/planes/success?payment_number=${paymentNumber}&method=pagofacil`;
              }
            }, 2500);
          } else if (isExpired || isFailed) {
            stopPolling();
            setPollingStatus(isExpired ? "expirado" : "fallido");
            toast.error(
              res.mensaje ||
                (isExpired
                  ? "El código QR ha expirado."
                  : "La transacción bancaria ha fallado.")
            );
          }
        }
      } catch (err) {
        // Polling background silence to avoid interrupting user scanning
        console.debug("Consultando estado PagoFácil...", err.message);
      }
    }, POLLING_INTERVAL_MS);
  };

  const handleCopyPaymentNumber = async () => {
    if (!qrData?.payment_number) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(qrData.payment_number);
      }
      setCopied(true);
      toast.success("Número de pedido copiado al portapapeles");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error copiando código:", err);
      toast.error("No se pudo copiar el número de pedido.");
    }
  };

  const handleDownloadQR = () => {
    if (!qrData?.qr_base64) return;
    try {
      const link = document.createElement("a");
      const base64Prefix = qrData.qr_base64.startsWith("data:")
        ? qrData.qr_base64
        : `data:image/png;base64,${qrData.qr_base64}`;
      link.href = base64Prefix;
      link.download = `QR_PagoFacil_${qrData.payment_number || "orden"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Código QR descargado");
    } catch (err) {
      console.error("Error descargando QR:", err);
      toast.error("No se pudo descargar la imagen del QR.");
    }
  };

  const handleOpenBankingApp = () => {
    const deepLinkUrl =
      qrData?.deep_link ||
      qrData?.deepLink ||
      qrData?.universal_url ||
      qrData?.checkout_url;
    if (deepLinkUrl) {
      window.open(deepLinkUrl, "_blank");
    } else {
      toast.info("Escanea el código QR directamente desde la app de tu banco.");
    }
  };

  if (!isOpen || !plan) return null;

  const precioUSD = parseFloat(plan.precio_mensual) || 0;
  const tcValor = Number(tipoCambio?.valor) || 7.0;
  const montoRealCalculadoBOB = Number((precioUSD * tcValor).toFixed(2));
  const montoQREstimado = Number((montoRealCalculadoBOB / 1000).toFixed(2));

  // Step 2 amounts
  const montoQR = Number(
    qrData?.monto_qr ?? (qrData?.monto ? qrData.monto / 1000 : montoQREstimado)
  ).toFixed(2);
  const montoRealBOB = Number(
    qrData?.monto_real_bob ?? qrData?.monto ?? montoRealCalculadoBOB
  ).toFixed(2);
  const tcFinal = Number(qrData?.tipo_cambio ?? tcValor).toFixed(2);
  const esFallbackTC = qrData?.es_fallback_tc ?? tipoCambio?.es_fallback ?? false;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-lg overflow-hidden flex flex-col relative transition-all">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step === "qr" && (
              <button
                onClick={() => {
                  stopPolling();
                  setStep("select");
                }}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Volver a métodos de pago"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              {step === "qr" ? (
                <QrCode className="w-5 h-5 text-blue-300" />
              ) : step === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-blue-300" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {step === "qr"
                  ? "Pagar con QR PagoFácil"
                  : step === "success"
                  ? "¡Pago Confirmado!"
                  : "Finalizar Suscripción"}
              </h3>
              <p className="text-xs text-blue-200">
                Plan {plan.nombre} • ${precioUSD} USD / mes
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopPolling();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* STEP 1: PAYMENT METHOD SELECTOR */}
          {step === "select" && (
            <div className="space-y-5">
              {/* Plan Summary Card */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Plan Seleccionado
                  </span>
                  <h4 className="text-base font-bold text-slate-900">{plan.nombre}</h4>
                  <p className="text-xs text-slate-500">
                    USD ${precioUSD} / mes ≈ Bs. {montoRealCalculadoBOB.toFixed(2)} BOB{" "}
                    <span className="text-slate-400 text-[10px]">(TC: {tcValor.toFixed(2)})</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-blue-600">${precioUSD}</span>
                  <span className="text-xs font-semibold text-slate-500"> USD</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
                  Elige tu método de pago
                </label>
                <div className="space-y-3">
                  {/* Option: PagoFácil QR */}
                  <div
                    onClick={() => setSelectedMethod("pagofacil")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedMethod === "pagofacil"
                        ? "border-blue-600 bg-blue-50/50 shadow-md shadow-blue-500/5 ring-1 ring-blue-600/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="pagofacil"
                        checked={selectedMethod === "pagofacil"}
                        onChange={() => setSelectedMethod("pagofacil")}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <QrCode className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm font-bold text-slate-900">
                              QR PagoFácil (Bolivia - Bs.)
                            </span>
                          </div>
                          <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            BOB (Bs.)
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Pago instantáneo con QR desde cualquier banca móvil boliviana (BCP, BNB, Banco Unión, Mercantil, Bisa, etc.).
                        </p>
                      </div>
                    </div>

                    {/* Notice / Badge: Modo Sandbox / Pruebas */}
                    {selectedMethod === "pagofacil" && (
                      <div className="mt-3 p-3 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block text-[11px] uppercase tracking-wider text-amber-800">
                            Modo Sandbox / Pruebas
                          </span>
                          <p className="mt-0.5 text-slate-700 leading-relaxed text-[11px]">
                            Por política de testing, el código QR se generará por un valor simbólico de{" "}
                            <strong className="text-amber-900 font-bold">
                              Bs. {montoQREstimado.toFixed(2)}
                            </strong>{" "}
                            para evitar transacciones reales de alto valor.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Option: Stripe */}
                  <label
                    onClick={() => setSelectedMethod("stripe")}
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedMethod === "stripe"
                        ? "border-blue-600 bg-blue-50/50 shadow-md shadow-blue-500/5 ring-1 ring-blue-600/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="stripe"
                      checked={selectedMethod === "stripe"}
                      onChange={() => setSelectedMethod("stripe")}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm font-bold text-slate-900">
                            Tarjeta de Crédito / Débito (Stripe)
                          </span>
                        </div>
                        <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                          USD
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Procesamiento seguro internacional vía Visa, Mastercard o American Express.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Optional billing data for PagoFácil */}
              {selectedMethod === "pagofacil" && (
                <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <Info className="w-3.5 h-3.5 text-blue-600" />
                    <span>Datos de facturación / transacción (Opcional)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Nombre o Razón Social
                      </label>
                      <input
                        type="text"
                        value={billingInfo.client_name}
                        onChange={(e) =>
                          setBillingInfo({ ...billingInfo, client_name: e.target.value })
                        }
                        placeholder="Ej. Mi Empresa SRL"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        CI o NIT
                      </label>
                      <input
                        type="text"
                        value={billingInfo.document_id}
                        onChange={(e) =>
                          setBillingInfo({ ...billingInfo, document_id: e.target.value })
                        }
                        placeholder="Ej. 1234567"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2">
                {selectedMethod === "pagofacil" ? (
                  <button
                    onClick={handleGenerarQR}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generando Código QR...</span>
                      </>
                    ) : (
                      <>
                        <QrCode className="w-4 h-4" />
                        <span>Pagar con QR Simple</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleStartStripe}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Iniciando Checkout...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Continuar con Stripe Checkout</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: QR DISPLAY & POLLING */}
          {step === "qr" && qrData && (
            <div className="text-center space-y-4">
              {/* Order Info & Amounts */}
              <div>
                {/* Code with Copy Button */}
                <div className="inline-flex items-center justify-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200/80 rounded-xl py-1.5 px-3 mx-auto mb-2">
                  <span>Código de Pago:</span>
                  <span className="font-mono font-bold text-slate-900">{qrData.payment_number}</span>
                  <button
                    type="button"
                    onClick={handleCopyPaymentNumber}
                    className="p-1 text-slate-500 hover:text-blue-600 hover:bg-white rounded transition-colors cursor-pointer"
                    title="Copiar al portapapeles"
                    aria-label="Copiar al portapapeles"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Highlighted Test Amount to Scan */}
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[11px] font-bold mb-1">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    <span>Monto de prueba a escanear</span>
                  </div>
                  <div className="flex items-baseline justify-center gap-1.5">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">
                      Bs. {montoQR}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 uppercase">BOB</span>
                  </div>
                </div>

                {/* Real Subscription Amount & Applied Exchange Rate */}
                <p className="text-xs text-slate-500 mt-1">
                  Monto real de suscripción:{" "}
                  <span className="font-semibold text-slate-700">Bs. {montoRealBOB} BOB</span> (${precioUSD} USD)
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Tipo de cambio aplicado: 1 USD = {tcFinal} BOB {esFallbackTC ? "(Fallback)" : "(BCB)"}
                </p>
              </div>

              {/* QR Image Container */}
              <div className="relative inline-block mx-auto bg-white p-3 rounded-2xl border-2 border-emerald-500/40 shadow-xl shadow-emerald-500/10">
                {qrData.qr_base64 ? (
                  <img
                    src={
                      qrData.qr_base64.startsWith("data:")
                        ? qrData.qr_base64
                        : `data:image/png;base64,${qrData.qr_base64}`
                    }
                    alt="Código QR PagoFácil"
                    className="w-56 h-56 sm:w-64 sm:h-64 mx-auto rounded-lg object-contain"
                  />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center bg-slate-100 rounded-lg text-slate-400 text-xs">
                    QR no disponible
                  </div>
                )}
              </div>

              {/* Polling Status / Timeout / Error Indicator */}
              {pollingStatus === "expirado" || pollingStatus === "fallido" ? (
                <div className="bg-red-50 border border-red-200/90 rounded-2xl p-4 text-center space-y-2.5">
                  <div className="flex items-center justify-center gap-2 text-red-800 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>
                      {pollingStatus === "fallido"
                        ? "La transacción bancaria ha fallado"
                        : "El código QR ha expirado"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    El tiempo límite ha expirado o la pasarela canceló la orden. Puedes generar un nuevo código QR para continuar.
                  </p>
                  <button
                    type="button"
                    onClick={handleGenerarQR}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow transition-colors cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5" />
                    )}
                    <span>Reintentar / Generar nuevo QR</span>
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 flex items-center justify-center gap-2 text-xs text-emerald-900 font-medium">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span>Esperando confirmación bancaria automática...</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadQR}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Descargar QR</span>
                </button>

                {(qrData.deep_link || qrData.deepLink || qrData.checkout_url) && (
                  <button
                    type="button"
                    onClick={handleOpenBankingApp}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <span>Abrir en Banca Móvil</span>
                  </button>
                )}
              </div>

              {(qrData.expiration_date || qrData.fecha_vencimiento) && (
                <p className="text-[11px] text-slate-400">
                  Válido hasta: {qrData.expiration_date || qrData.fecha_vencimiento}
                </p>
              )}
            </div>
          )}

          {/* STEP 3: SUCCESS CELEBRATION */}
          {step === "success" && (
            <div className="text-center py-6 space-y-4 animate-scale-up">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">¡Pago Confirmado!</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Tu suscripción al plan <strong>{plan.nombre}</strong> ha sido activada con éxito.
                </p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 text-xs text-slate-500">
                Redirigiendo a tu panel de suscripción...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

