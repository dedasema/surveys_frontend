import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Building2,
  Crown,
  CheckCircle,
  Layers,
  Send,
  Users,
  CreditCard,
  Mic,
  FileText,
  Brain,
  Download,
  Receipt,
  UserCheck,
  UserX,
  ExternalLink,
  Unlock,
  Sparkles,
  HardDrive,
  Cpu,
  Image,
} from "lucide-react";
import DashboardLayout from "../dashboard-layout";
import LoadingScreen from "../LoadingScreen";
import {
  obtenerSuscriptorDetalleAdmin,
  obtenerPagosSuscriptorAdmin,
  obtenerOperadoresSuscriptorAdmin,
  actualizarEstadoSuscriptorAdmin,
  asignarPlanSuscriptorAdmin,
  listarPlanes,
  impersonarSuscriptorAdmin,
  obtenerConsumoIASuscriptorAdmin,
} from "../../services/api-admin";

export default function SuscriptorDetallePage() {
  const { id } = useParams();
  const [suscriptor, setSuscriptor] = useState(null);
  const [pagos, setPagos] = useState([]);
  const [operadores, setOperadores] = useState([]);
  const [consumoIA, setConsumoIA] = useState(null);
  const [planesDisponibles, setPlanesDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("consumo"); // 'consumo' | 'ia' | 'pagos' | 'operadores'
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [detailRes, pagosRes, opsRes, planesRes, iaRes] = await Promise.allSettled([
        obtenerSuscriptorDetalleAdmin(id),
        obtenerPagosSuscriptorAdmin(id),
        obtenerOperadoresSuscriptorAdmin(id),
        listarPlanes().catch(() => []),
        obtenerConsumoIASuscriptorAdmin(id).catch(() => null),
      ]);

      if (detailRes.status === "fulfilled" && detailRes.value) {
        setSuscriptor(detailRes.value);
        setSelectedPlanId(detailRes.value.plan?.id || detailRes.value.plan_id || "");
      }

      if (pagosRes.status === "fulfilled" && Array.isArray(pagosRes.value)) {
        setPagos(pagosRes.value);
      }

      if (opsRes.status === "fulfilled" && Array.isArray(opsRes.value)) {
        setOperadores(opsRes.value);
      }

      if (planesRes.status === "fulfilled" && Array.isArray(planesRes.value)) {
        setPlanesDisponibles(planesRes.value);
      }

      if (iaRes.status === "fulfilled" && iaRes.value) {
        setConsumoIA(iaRes.value);
      }
    } catch (err) {
      console.error("Error al cargar detalle del suscriptor:", err);
      toast.error("Error al cargar la información del suscriptor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleToggleEstado = async () => {
    const estadoActual = (suscriptor?.estado || "activo").toLowerCase();
    const nuevoEstado = estadoActual === "activo" ? "suspendido" : "activo";
    const confirmMsg =
      nuevoEstado === "suspendido"
        ? "¿Seguro que deseas suspender esta empresa? Sus usuarios no podrán ingresar."
        : "¿Deseas reactivar el acceso de esta empresa?";

    if (!window.confirm(confirmMsg)) return;

    try {
      setActionLoading(true);
      await actualizarEstadoSuscriptorAdmin(id, nuevoEstado);
      setSuscriptor((prev) => ({ ...prev, estado: nuevoEstado }));
      toast.success(`Empresa ${nuevoEstado === "activo" ? "activada" : "suspendida"} correctamente`);
    } catch (err) {
      toast.error("Error al actualizar el estado: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleImpersonate = async () => {
    const empresaNombre =
      suscriptor?.nombre_empresa || suscriptor?.empresa || suscriptor?.nombre || `Suscriptor #${id}`;
    const email = suscriptor?.email_contacto || suscriptor?.email || "Cliente";

    if (
      !window.confirm(
        `¿Deseas iniciar sesión en vivo como la empresa "${empresaNombre}" (${email}) para soporte técnico directo?`
      )
    ) {
      return;
    }

    try {
      toast.loading("Generando token de soporte en vivo...", { id: "impersonate-detail" });
      const res = await impersonarSuscriptorAdmin(id);

      if (res?.access_token) {
        const currentToken = localStorage.getItem("token");
        if (currentToken) {
          localStorage.setItem("superadmin_token_backup", currentToken);
        }
        localStorage.setItem("impersonated_email", res.impersonated_email || email);
        localStorage.setItem("token", res.access_token);

        toast.success("Modo soporte activado. Redirigiendo...", { id: "impersonate-detail" });
        setTimeout(() => {
          window.location.href = "/dashboard-suscriptor/dashboard";
        }, 400);
      } else {
        toast.error(res?.message || "No se pudo generar el token de soporte.", {
          id: "impersonate-detail",
        });
      }
    } catch (err) {
      toast.error("Error al iniciar modo soporte: " + err.message, { id: "impersonate-detail" });
    }
  };

  const handleAsignarPlan = async (e) => {
    e.preventDefault();
    if (!selectedPlanId) return;

    try {
      setActionLoading(true);
      await asignarPlanSuscriptorAdmin(id, selectedPlanId);
      const planElegido = planesDisponibles.find((p) => p.id.toString() === selectedPlanId.toString());
      setSuscriptor((prev) => ({
        ...prev,
        plan: planElegido || prev.plan,
        plan_id: selectedPlanId,
      }));
      toast.success("Plan asignado correctamente a la empresa");
      setShowPlanModal(false);
    } catch (err) {
      toast.error("Error al asignar el plan: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Cargando visión 360° del suscriptor..." />;
  }

  if (!suscriptor) {
    return (
      <DashboardLayout activeSection="suscriptores">
        <div className="p-8 text-center">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Suscriptor no encontrado</h2>
          <Link
            to="/dashboard/suscriptores"
            className="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Directorio
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const empresaNombre = suscriptor.nombre_empresa || suscriptor.empresa || suscriptor.nombre || `Suscriptor #${id}`;
  const email = suscriptor.email_contacto || suscriptor.email || "Sin correo asignado";
  const plan = suscriptor.plan || suscriptor.plan_actual || {
    nombre: "Básico",
    precio_mensual: 0,
    max_plantillas: 5,
    max_campanas: 5,
    max_entregas: 500,
    max_operadores: 1,
    permite_email: true,
    permite_audio_voz: false,
    permite_papel: false,
    permite_ia_analisis: false,
    permite_exportacion: true,
  };

  const uso = suscriptor.resumen_uso || suscriptor.uso_actual || {
    plantillas_usadas: suscriptor.plantillas_usadas ?? 0,
    entregas_mes: suscriptor.entregas_mes ?? 0,
    operadores_activos: operadores.length,
    campanas_activas: suscriptor.campanas_activas ?? 0,
  };

  const calculatePct = (used, max) => {
    if (max === -1 || max === "-1" || max === 0 || max === "0" || !max) return 0;
    const pct = Math.min(Math.round((used / max) * 100), 100);
    return isNaN(pct) ? 0 : pct;
  };

  const formatLimit = (val) => {
    if (val === -1 || val === "-1" || val === 0 || val === "0" || val === null || val === undefined) {
      return "Ilimitado";
    }
    return val.toLocaleString ? val.toLocaleString() : val;
  };

  const isActivo = (suscriptor.estado || "activo").toLowerCase() === "activo";

  return (
    <DashboardLayout activeSection="suscriptores">
      <div className="min-h-full p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/40">
        {/* Navegación y Acciones del Header */}
        <div className="mb-6">
          <Link
            to="/dashboard/suscriptores"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la lista de Suscriptores</span>
          </Link>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xl shadow-slate-200/20 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-600/30 flex-shrink-0">
                {empresaNombre.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{empresaNombre}</h1>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      isActivo
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {isActivo ? "● Activo" : "● Suspendido"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {email} {suscriptor.telefono && `• ${suscriptor.telefono}`}
                </p>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  ID Suscriptor: #{suscriptor.id} • Registrado el{" "}
                  {suscriptor.creado_en
                    ? new Date(suscriptor.creado_en).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "Fecha no disponible"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Botón Soporte en Vivo */}
              <button
                onClick={handleImpersonate}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-amber-500/25 cursor-pointer active:scale-95"
                title="Iniciar sesión directamente como esta empresa para darle soporte en vivo"
              >
                <Unlock className="w-4 h-4" />
                <span>Soporte en Vivo</span>
              </button>

              {/* Botón Asignar Plan */}
              <button
                onClick={() => setShowPlanModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold rounded-xl text-xs sm:text-sm transition-colors border border-blue-200/60 shadow-xs cursor-pointer"
              >
                <Crown className="w-4 h-4 text-blue-600" />
                <span>Asignar Plan Manual</span>
              </button>

              {/* Botón Activar / Suspender */}
              <button
                onClick={handleToggleEstado}
                disabled={actionLoading}
                className={`inline-flex items-center gap-2 px-4 py-2.5 font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-xs cursor-pointer ${
                  isActivo
                    ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                    : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20"
                }`}
              >
                {isActivo ? (
                  <>
                    <UserX className="w-4 h-4" />
                    <span>Suspender Empresa</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Reactivar Empresa</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Pestañas de Navegación */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-6 text-sm font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab("consumo")}
            className={`pb-3 px-4 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === "consumo"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Membresía & Consumo de Cuotas</span>
          </button>
          <button
            onClick={() => setActiveTab("ia")}
            className={`pb-3 px-4 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === "ia"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Consumo de IA & Recursos (Gemini)</span>
          </button>
          <button
            onClick={() => setActiveTab("pagos")}
            className={`pb-3 px-4 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === "pagos"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Historial de Pagos ({pagos.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("operadores")}
            className={`pb-3 px-4 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === "operadores"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Operadores ({operadores.length})</span>
          </button>
        </div>

        {/* Contenido Pestaña 1: Membresía & Consumo */}
        {activeTab === "consumo" && (
          <div className="space-y-6">
            {/* Card del Plan Asignado */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl">
                    <Crown className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Plan Actual: {plan.nombre}</h3>
                    <p className="text-xs text-slate-500">{plan.descripcion}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900">
                    {parseFloat(plan.precio_mensual) === 0 ? "Gratis" : `$${plan.precio_mensual}`}
                  </span>
                  {parseFloat(plan.precio_mensual) > 0 && (
                    <span className="text-xs text-slate-500 font-medium"> /mes</span>
                  )}
                </div>
              </div>

              {/* Medidores de Cuotas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {/* 1. Plantillas */}
                {(() => {
                  const max = plan.max_plantillas;
                  const isInf = max === -1 || max === "-1" || max === 0 || !max;
                  const used = uso.plantillas_usadas ?? 0;
                  const pct = isInf ? 0 : calculatePct(used, max);
                  return (
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="flex items-center gap-1 font-semibold">
                          <Layers className="w-3.5 h-3.5 text-blue-600" /> Plantillas
                        </span>
                        <span className="font-bold text-slate-800">
                          {used} / {formatLimit(max)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden my-2">
                        <div
                          className={`h-full rounded-full ${pct >= 90 ? "bg-red-500" : "bg-blue-600"}`}
                          style={{ width: isInf ? "100%" : `${pct}%` }}
                        ></div>
                      </div>
                      <p className="text-[11px] text-slate-400">{isInf ? "Ilimitadas" : `${pct}% de cuota`}</p>
                    </div>
                  );
                })()}

                {/* 2. Entregas / Respuestas */}
                {(() => {
                  const max = plan.max_entregas;
                  const isInf = max === -1 || max === "-1" || max === 0 || !max;
                  const used = uso.entregas_mes ?? 0;
                  const pct = isInf ? 0 : calculatePct(used, max);
                  return (
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="flex items-center gap-1 font-semibold">
                          <Send className="w-3.5 h-3.5 text-emerald-600" /> Respuestas / mes
                        </span>
                        <span className="font-bold text-slate-800">
                          {used} / {formatLimit(max)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden my-2">
                        <div
                          className={`h-full rounded-full ${pct >= 90 ? "bg-red-500" : "bg-emerald-600"}`}
                          style={{ width: isInf ? "100%" : `${pct}%` }}
                        ></div>
                      </div>
                      <p className="text-[11px] text-slate-400">{isInf ? "Ilimitadas" : `${pct}% mensual`}</p>
                    </div>
                  );
                })()}

                {/* 3. Operadores */}
                {(() => {
                  const max = plan.max_operadores;
                  const isInf = max === -1 || max === "-1" || max === 0 || !max;
                  const used = uso.operadores_activos ?? operadores.length;
                  const pct = isInf ? 0 : calculatePct(used, max);
                  return (
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="flex items-center gap-1 font-semibold">
                          <Users className="w-3.5 h-3.5 text-purple-600" /> Operadores
                        </span>
                        <span className="font-bold text-slate-800">
                          {used} / {formatLimit(max)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden my-2">
                        <div
                          className={`h-full rounded-full ${pct >= 90 ? "bg-red-500" : "bg-purple-600"}`}
                          style={{ width: isInf ? "100%" : `${pct}%` }}
                        ></div>
                      </div>
                      <p className="text-[11px] text-slate-400">{isInf ? "Ilimitados" : `${pct}% de equipo`}</p>
                    </div>
                  );
                })()}

                {/* 4. Campañas */}
                {(() => {
                  const max = plan.max_campanas;
                  const isInf = max === -1 || max === "-1" || max === 0 || !max;
                  const used = uso.campanas_activas ?? 0;
                  const pct = isInf ? 0 : calculatePct(used, max);
                  return (
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="flex items-center gap-1 font-semibold">
                          <CreditCard className="w-3.5 h-3.5 text-indigo-600" /> Campañas
                        </span>
                        <span className="font-bold text-slate-800">
                          {used} / {formatLimit(max)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden my-2">
                        <div
                          className={`h-full rounded-full ${pct >= 90 ? "bg-red-500" : "bg-indigo-600"}`}
                          style={{ width: isInf ? "100%" : `${pct}%` }}
                        ></div>
                      </div>
                      <p className="text-[11px] text-slate-400">{isInf ? "Ilimitadas" : `${pct}% simultáneas`}</p>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Matriz de Canales y Permisos Habilitados */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                Canales y Funcionalidades Habilitadas en este Plan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div
                  className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    plan.permite_email !== false ? "bg-blue-50/70 border-blue-200 text-blue-800" : "bg-slate-50 border-slate-200 text-slate-400"
                  }`}
                >
                  <span className="font-semibold flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" /> Email / Web
                  </span>
                  <span className="font-bold">{plan.permite_email !== false ? "Habilitado" : "Deshabilitado"}</span>
                </div>

                <div
                  className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    plan.permite_audio_voz ? "bg-purple-50/70 border-purple-200 text-purple-800" : "bg-slate-50 border-slate-200 text-slate-400"
                  }`}
                >
                  <span className="font-semibold flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5" /> Voz con IA
                  </span>
                  <span className="font-bold">{plan.permite_audio_voz ? "Habilitado" : "Deshabilitado"}</span>
                </div>

                <div
                  className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    plan.permite_papel ? "bg-orange-50/70 border-orange-200 text-orange-800" : "bg-slate-50 border-slate-200 text-slate-400"
                  }`}
                >
                  <span className="font-semibold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Papel & OCR
                  </span>
                  <span className="font-bold">{plan.permite_papel ? "Habilitado" : "Deshabilitado"}</span>
                </div>

                <div
                  className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    plan.permite_ia_analisis ? "bg-indigo-50/70 border-indigo-200 text-indigo-800" : "bg-slate-50 border-slate-200 text-slate-400"
                  }`}
                >
                  <span className="font-semibold flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5" /> Análisis Gemini
                  </span>
                  <span className="font-bold">{plan.permite_ia_analisis ? "Habilitado" : "Deshabilitado"}</span>
                </div>

                <div
                  className={`p-3.5 rounded-xl border flex items-center justify-between sm:col-span-2 ${
                    plan.permite_exportacion !== false ? "bg-emerald-50/70 border-emerald-200 text-emerald-800" : "bg-slate-50 border-slate-200 text-slate-400"
                  }`}
                >
                  <span className="font-semibold flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" /> Exportación PDF & CSV
                  </span>
                  <span className="font-bold">{plan.permite_exportacion !== false ? "Habilitado" : "Deshabilitado"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenido Pestaña 2: Consumo de IA & Recursos (Gemini) */}
        {activeTab === "ia" && (
          <div className="space-y-6 animate-fade-in">
            {/* Header del Monitor de IA */}
            <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-purple-300 shadow-inner flex-shrink-0">
                  <Brain className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                    <span>Monitor de Consumo de IA (Google Gemini)</span>
                    <span className="px-2.5 py-0.5 bg-purple-500/30 text-purple-200 text-xs font-semibold rounded-full border border-purple-400/30">
                      En Vivo
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm text-purple-200/80 mt-1 max-w-xl">
                    Registro de inferencias multimodales (OCR en papel y transcripción/deducción de voz) y costos generados.
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right bg-white/5 p-4 rounded-2xl border border-white/10 flex-shrink-0">
                <span className="text-xs text-purple-300 font-semibold uppercase tracking-wider block">
                  Costo Estimado Acumulado
                </span>
                <span className="text-3xl font-extrabold text-white">
                  ${parseFloat(consumoIA?.costo_estimado_usd ?? 0).toFixed(4)}
                </span>
                <span className="text-xs text-purple-200/70 font-mono block">USD</span>
              </div>
            </div>

            {/* Tarjetas de Métricas de IA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* 1. OCR Papel */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                    <Image className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    OCR Papel (Gemini)
                  </span>
                </div>
                <p className="text-3xl font-black text-slate-900 mb-1">
                  {consumoIA?.total_peticiones_ocr ?? 0}
                </p>
                <p className="text-xs text-slate-500">
                  Formularios físicos escaneados y digitalizados por visión
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>Tokens generados:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {(consumoIA?.tokens_ocr ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* 2. Audio y Voz */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                    <Mic className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Audio / Voz (Gemini)
                  </span>
                </div>
                <p className="text-3xl font-black text-slate-900 mb-1">
                  {consumoIA?.total_peticiones_audio ?? 0}
                </p>
                <p className="text-xs text-slate-500">
                  Llamadas e interpretaciones de audio por asistente virtual
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>Tokens generados:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {(consumoIA?.tokens_audio ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* 3. Tokens Totales */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Tokens Totales
                  </span>
                </div>
                <p className="text-3xl font-black text-slate-900 mb-1 font-mono">
                  {(consumoIA?.estimacion_tokens_totales ?? 0).toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">
                  Volumen combinado de inferencia y procesamiento
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>Costo tokens:</span>
                  <span className="font-bold text-emerald-700 font-mono">
                    ${parseFloat(consumoIA?.costo_estimado_usd ?? 0).toFixed(4)} USD
                  </span>
                </div>
              </div>

              {/* 4. Almacenamiento Utilizado */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <HardDrive className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Almacenamiento
                  </span>
                </div>
                <p className="text-3xl font-black text-slate-900 mb-1">
                  {parseFloat(consumoIA?.almacenamiento_estimado_mb ?? 0).toFixed(1)}{" "}
                  <span className="text-base font-semibold text-slate-500">MB</span>
                </p>
                <p className="text-xs text-slate-500">
                  Espacio ocupado por grabaciones de audio y escaneos de papel
                </p>
              </div>

              {/* 5. Estado de Canales de IA */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm sm:col-span-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Disponibilidad en Plan Actual
                    </span>
                    <span className="text-xs font-semibold text-blue-600 font-mono">
                      Plan: {plan.nombre}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 mb-4">
                    Permisos de Inferencia Multimodal
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className={`p-3 rounded-2xl border flex items-center justify-between ${plan.permite_audio_voz ? "bg-purple-50 border-purple-200 text-purple-900" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                    <span className="font-semibold flex items-center gap-1.5">
                      <Mic className="w-4 h-4" /> Voz con IA
                    </span>
                    <span className="font-bold">{plan.permite_audio_voz ? "Habilitado" : "Bloqueado"}</span>
                  </div>

                  <div className={`p-3 rounded-2xl border flex items-center justify-between ${plan.permite_papel ? "bg-orange-50 border-orange-200 text-orange-900" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                    <span className="font-semibold flex items-center gap-1.5">
                      <FileText className="w-4 h-4" /> Papel & OCR
                    </span>
                    <span className="font-bold">{plan.permite_papel ? "Habilitado" : "Bloqueado"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenido Pestaña 3: Historial de Pagos */}
        {activeTab === "pagos" && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            {pagos.length === 0 ? (
              <div className="p-12 text-center">
                <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1">Sin historial de pagos</h3>
                <p className="text-slate-500 text-xs">Esta empresa aún no tiene transacciones registradas.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="py-3.5 px-6">Referencia</th>
                      <th className="py-3.5 px-6">Concepto</th>
                      <th className="py-3.5 px-6">Fecha</th>
                      <th className="py-3.5 px-6">Monto</th>
                      <th className="py-3.5 px-6">Estado</th>
                      <th className="py-3.5 px-6 text-right">Recibo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pagos.map((p, idx) => (
                      <tr key={p.id || idx} className="hover:bg-slate-50/60">
                        <td className="py-4 px-6 font-mono text-xs text-slate-800 font-semibold">
                          {p.referencia_stripe || p.id || `TXN-${idx + 1}`}
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-900">{p.plan_nombre || plan.nombre}</td>
                        <td className="py-4 px-6 text-xs text-slate-500">
                          {p.fecha ? new Date(p.fecha).toLocaleDateString() : "-"}
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-900">
                          ${parseFloat(p.monto || 0).toFixed(2)}
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
                            {p.estado || "Completado"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          {p.recibo_url ? (
                            <a
                              href={p.recibo_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-xs font-semibold inline-flex items-center gap-1"
                            >
                              <span>Ver</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400">Procesado</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Contenido Pestaña 4: Operadores */}
        {activeTab === "operadores" && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            {operadores.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1">Sin operadores registrados</h3>
                <p className="text-slate-500 text-xs">Esta empresa no ha dado de alta operadores de equipo todavía.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="py-3.5 px-6">Operador</th>
                      <th className="py-3.5 px-6">Correo</th>
                      <th className="py-3.5 px-6">Rol</th>
                      <th className="py-3.5 px-6">Fecha Registro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {operadores.map((op, idx) => (
                      <tr key={op.id || idx} className="hover:bg-slate-50/60">
                        <td className="py-4 px-6 font-bold text-slate-900">
                          {op.nombre} {op.apellido || ""}
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-600">{op.email}</td>
                        <td className="py-4 px-6 text-xs">
                          <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full font-semibold border border-purple-200">
                            Operador
                          </span>
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-500">
                          {op.creado_en ? new Date(op.creado_en).toLocaleDateString() : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Modal de Asignación Manual de Plan */}
        {showPlanModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <Crown className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-bold text-slate-900">Asignar Plan Manualmente</h3>
                </div>
                <button
                  onClick={() => setShowPlanModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-500 mb-4">
                Selecciona el plan que deseas asignar a <strong>{empresaNombre}</strong>. Esta acción sobreescribirá
                sus límites cuantitativos actuales.
              </p>

              <form onSubmit={handleAsignarPlan} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Plan de Suscripción
                  </label>
                  <select
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecciona un plan...</option>
                    {planesDisponibles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} (${p.precio_mensual}/mes) - {p.max_entregas} entregas
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowPlanModal(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading || !selectedPlanId}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
                  >
                    {actionLoading ? "Asignando..." : "Confirmar Asignación"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
