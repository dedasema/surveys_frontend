import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Crown,
  CheckCircle,
  Clock,
  Layers,
  Send,
  Users,
  CreditCard,
  Mic,
  FileText,
  Brain,
  Download,
  ArrowRight,
  Receipt,
  ExternalLink,
  ShieldCheck,
  Check,
} from "lucide-react";
import DashboardSuscriptorLayout from "./layout";
import LoadingScreen from "../LoadingScreen";
import {
  getMiSuscripcion,
  getMe,
  getPlantillas,
  getCampanas,
  getDashboardData,
  obtenerOperadores,
  obtenerPortalCliente,
} from "../../services/api";

export default function MiSuscripcion() {
  const [loading, setLoading] = useState(true);
  const [suscripcion, setSuscripcion] = useState(null);
  const [user, setUser] = useState(null);
  const [usage, setUsage] = useState({
    plantillas: 0,
    campanas: 0,
    entregasMes: 0,
    operadores: 0,
  });
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [meData, subData, plantillasData, campanasData, opsData, dashData] =
          await Promise.allSettled([
            getMe(),
            getMiSuscripcion(),
            getPlantillas().catch(() => []),
            getCampanas().catch(() => []),
            obtenerOperadores().catch(() => []),
            getDashboardData().catch(() => null),
          ]);

        if (meData.status === "fulfilled") {
          setUser(meData.value);
        }

        let currentSub = null;
        if (subData.status === "fulfilled" && subData.value) {
          currentSub = subData.value;
          setSuscripcion(currentSub);
        }

        // Calcular uso real
        const plantillasCount =
          currentSub?.uso_actual?.plantillas_usadas ??
          (plantillasData.status === "fulfilled" && Array.isArray(plantillasData.value)
            ? plantillasData.value.length
            : 0);

        const campanasCount =
          currentSub?.uso_actual?.campanas_activas ??
          (campanasData.status === "fulfilled" && Array.isArray(campanasData.value)
            ? campanasData.value.length
            : 0);

        const operadoresCount =
          currentSub?.uso_actual?.operadores_activos ??
          (opsData.status === "fulfilled" && Array.isArray(opsData.value)
            ? opsData.value.length
            : 0);

        const entregasMes =
          currentSub?.uso_actual?.entregas_mes_actual ??
          (dashData.status === "fulfilled" && dashData.value?.entregas?.total !== undefined
            ? dashData.value.entregas.total
            : 0);

        setUsage({
          plantillas: plantillasCount,
          campanas: campanasCount,
          operadores: operadoresCount,
          entregasMes: entregasMes,
        });
      } catch (err) {
        console.error("Error al cargar datos de suscripción:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleOpenStripePortal = async () => {
    try {
      setPortalLoading(true);
      const res = await obtenerPortalCliente();
      if (res?.url) {
        window.location.href = res.url;
      } else {
        toast.info("Para gestionar facturación, puedes acceder a tu cuenta o contactar a soporte.");
      }
    } catch (err) {
      toast.info("La gestión de facturación Stripe se sincroniza automáticamente.");
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Cargando detalles de tu membresía..." />;
  }

  const plan = suscripcion?.plan || suscripcion?.plan_actual || {
    nombre: "Plan Básico / Gratuito",
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
    descripcion: "Plan inicial para creación y gestión básica de encuestas.",
  };

  const calculatePercent = (used, max) => {
    if (max === -1 || max === "-1" || max === 0 || max === "0" || !max) return 0;
    const pct = Math.min(Math.round((used / max) * 100), 100);
    return isNaN(pct) ? 0 : pct;
  };

  const getProgressColor = (pct) => {
    if (pct >= 90) return "bg-red-500";
    if (pct >= 75) return "bg-yellow-500";
    return "bg-gradient-to-r from-blue-600 to-indigo-600";
  };

  const formatLimit = (val) => {
    if (val === -1 || val === "-1" || val === 0 || val === "0" || val === null || val === undefined) {
      return "Ilimitado";
    }
    return val.toLocaleString ? val.toLocaleString() : val;
  };

  return (
    <DashboardSuscriptorLayout activeSection="mi-suscripcion">
      <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/40 min-h-screen">
        {/* Header de la Sección */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Mi Suscripción
              </h1>
            </div>
            <p className="text-slate-600 text-sm sm:text-base">
              Consulta tu membresía activa, cuotas consumidas en tiempo real y funciones incluidas
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard-suscriptor/historial-pagos"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium rounded-xl text-sm shadow-xs transition-colors"
            >
              <Receipt className="w-4 h-4 text-slate-500" />
              <span>Historial de Pagos</span>
            </Link>
            <Link
              to="/dashboard-suscriptor/planes"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl text-sm shadow-lg shadow-blue-500/25 transition-all"
            >
              <span>Mejorar Plan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Tarjeta Principal del Plan Activo */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl shadow-slate-200/30 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-indigo-500/10 rounded-full blur-3xl -z-0"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30 flex-shrink-0">
                <Crown className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{plan.nombre}</h2>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Suscripción Activa
                  </span>
                </div>
                <p className="text-slate-500 text-sm max-w-2xl">{plan.descripcion}</p>
                {user?.empresa && (
                  <p className="text-xs text-slate-400 mt-1 font-medium">Empresa: {user.empresa}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 bg-slate-50 lg:bg-transparent p-4 lg:p-0 rounded-2xl">
              <div>
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                  {parseFloat(plan.precio_mensual) === 0 ? "Gratis" : `$${plan.precio_mensual}`}
                </span>
                {parseFloat(plan.precio_mensual) > 0 && (
                  <span className="text-sm font-medium text-slate-500"> /mes</span>
                )}
              </div>

              {suscripcion?.fecha_fin ? (
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>
                    Renovación: {new Date(suscripcion.fecha_fin).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Sin fecha de vencimiento fija</span>
                </div>
              )}
            </div>
          </div>

          {/* Botones de gestión rápida de cuenta */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Tus datos y transacciones están cifrados y procesados con estándar bancario.
            </p>

            <button
              onClick={handleOpenStripePortal}
              disabled={portalLoading}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{portalLoading ? "Cargando..." : "Portal de Facturación Stripe"}</span>
            </button>
          </div>
        </div>

        {/* Medidores de Cuotas y Consumo en Tiempo Real */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Consumo de Cuotas del Mes</h3>
            <span className="text-xs text-slate-500">Actualizado automáticamente en tiempo real</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Plantillas */}
            {(() => {
              const max = plan.max_plantillas;
              const isInf = max === -1 || max === "-1" || max === 0 || !max;
              const pct = isInf ? 0 : calculatePercent(usage.plantillas, max);
              return (
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Plantillas</span>
                  </div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-2xl font-bold text-slate-900">{usage.plantillas}</span>
                    <span className="text-xs text-slate-500 font-medium">de {formatLimit(max)}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isInf ? "w-full bg-emerald-500" : `${getProgressColor(pct)}`
                      }`}
                      style={{ width: isInf ? "100%" : `${pct}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    {isInf ? "Plantillas ilimitadas" : `${pct}% de tu cuota utilizada`}
                  </p>
                </div>
              );
            })()}

            {/* 2. Entregas / Respuestas */}
            {(() => {
              const max = plan.max_entregas;
              const isInf = max === -1 || max === "-1" || max === 0 || !max;
              const pct = isInf ? 0 : calculatePercent(usage.entregasMes, max);
              return (
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                      <Send className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Respuestas / Mes</span>
                  </div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-2xl font-bold text-slate-900">{usage.entregasMes}</span>
                    <span className="text-xs text-slate-500 font-medium">de {formatLimit(max)}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isInf ? "w-full bg-emerald-500" : `${getProgressColor(pct)}`
                      }`}
                      style={{ width: isInf ? "100%" : `${pct}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    {isInf ? "Envíos ilimitados" : `${pct}% de tu cuota mensual`}
                  </p>
                </div>
              );
            })()}

            {/* 3. Operadores */}
            {(() => {
              const max = plan.max_operadores;
              const isInf = max === -1 || max === "-1" || max === 0 || !max;
              const pct = isInf ? 0 : calculatePercent(usage.operadores, max);
              return (
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Operadores</span>
                  </div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-2xl font-bold text-slate-900">{usage.operadores}</span>
                    <span className="text-xs text-slate-500 font-medium">de {formatLimit(max)}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isInf ? "w-full bg-emerald-500" : `${getProgressColor(pct)}`
                      }`}
                      style={{ width: isInf ? "100%" : `${pct}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    {isInf ? "Operadores ilimitados" : `${pct}% de usuarios asignados`}
                  </p>
                </div>
              );
            })()}

            {/* 4. Campañas Activas */}
            {(() => {
              const max = plan.max_campanas;
              const isInf = max === -1 || max === "-1" || max === 0 || !max;
              const pct = isInf ? 0 : calculatePercent(usage.campanas, max);
              return (
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Campañas</span>
                  </div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-2xl font-bold text-slate-900">{usage.campanas}</span>
                    <span className="text-xs text-slate-500 font-medium">de {formatLimit(max)}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isInf ? "w-full bg-emerald-500" : `${getProgressColor(pct)}`
                      }`}
                      style={{ width: isInf ? "100%" : `${pct}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    {isInf ? "Campañas simultáneas ilimitadas" : `${pct}% de campañas en curso`}
                  </p>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Canales y Capacidades Incluidas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              Canales de Distribución Habilitados
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Email y Enlaces Web</p>
                    <p className="text-xs text-slate-500">Distribución masiva por correo y URL pública</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Incluido
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Encuestas Asistidas por Voz (IA)</p>
                    <p className="text-xs text-slate-500">Lectura TTS, dictado STT y deducción de voz</p>
                  </div>
                </div>
                {plan.permite_audio_voz ? (
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Incluido
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-400 text-xs font-semibold rounded-lg">
                    No Disponible
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Canal Papel y Digitalización OCR</p>
                    <p className="text-xs text-slate-500">Impresión de cuadernillos con QR y captura</p>
                  </div>
                </div>
                {plan.permite_papel ? (
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Incluido
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-400 text-xs font-semibold rounded-lg">
                    No Disponible
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" />
              Inteligencia Artificial y Exportación
            </h3>
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Análisis con Gemini AI</p>
                    <p className="text-xs text-slate-500">Deducción semántica y chatbot analítico</p>
                  </div>
                </div>
                {plan.permite_ia_analisis ? (
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Incluido
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-400 text-xs font-semibold rounded-lg">
                    No Disponible
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Exportación de Reportes</p>
                    <p className="text-xs text-slate-500">Descarga de datos en CSV y reportes en PDF</p>
                  </div>
                </div>
                {plan.permite_exportacion !== false ? (
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Incluido
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-400 text-xs font-semibold rounded-lg">
                    No Disponible
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-blue-900">¿Necesitas mayores límites o más canales?</p>
                <p className="text-[11px] text-blue-700">Puedes actualizar o cambiar de plan en cualquier momento.</p>
              </div>
              <Link
                to="/dashboard-suscriptor/planes"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs"
              >
                Ver Planes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardSuscriptorLayout>
  );
}
