import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  listPlanes,
  iniciarStripeCheckout,
  getMe,
  getMiSuscripcion,
} from "../../services/api";
import {
  CheckCircle,
  Check,
  Layers,
  Send,
  Users,
  Mic,
  FileText,
  Brain,
  Download,
  Sparkles,
} from "lucide-react";
import DashboardSuscriptorLayout from "./layout";
import LoadingScreen from "../LoadingScreen";

const Planes = () => {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [suscriptorId, setSuscriptorId] = useState("");
  const [suscripcionActual, setSuscripcionActual] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const dataPlanes = await listPlanes();
        // Mostrar solo planes activos (o si no tiene el campo activo, todos)
        const planesActivos = Array.isArray(dataPlanes)
          ? dataPlanes.filter((p) => p.activo !== false)
          : [];
        setPlanes(planesActivos);
      } catch (err) {
        console.error(err);
        setError("Error cargando planes.");
      } finally {
        setLoading(false);
      }
    })();

    (async () => {
      try {
        const user = await getMe();
        setSuscriptorId(user.id);
        const subData = await getMiSuscripcion().catch(() => null);
        if (subData) {
          setSuscripcionActual(subData);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleSuscripcion = async (planId) => {
    if (!suscriptorId) {
      toast.warning("No se ha identificado al suscriptor. Inicia sesión nuevamente.");
      return;
    }
    try {
      const { checkout_url } = await iniciarStripeCheckout(suscriptorId, planId);
      if (checkout_url) window.location.href = checkout_url;
      else toast.error("No se pudo iniciar el checkout.");
    } catch (err) {
      console.error(err);
      toast.error("Error iniciando el checkout.");
    }
  };

  const formatLimit = (val) => {
    if (val === -1 || val === "-1" || val === 0 || val === "0" || val === null || val === undefined) {
      return "Ilimitado";
    }
    return val.toLocaleString ? val.toLocaleString() : val;
  };

  if (loading) return <LoadingScreen message="Cargando planes de suscripción..." />;
  if (error) return <div className="p-4 text-red-600 font-medium">{error}</div>;

  return (
    <DashboardSuscriptorLayout activeSection="planes">
      <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/40 min-h-screen">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-1">
              Planes y Suscripción
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Escala tu volumen de encuestas, cuotas mensuales y canales con IA
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planes.map((plan) => {
            const isCurrent =
              suscripcionActual?.plan_id === plan.id || suscripcionActual?.plan?.id === plan.id;
            const precio = parseFloat(plan.precio_mensual) || 0;

            return (
              <div
                key={plan.id}
                className={`bg-white/90 backdrop-blur-sm rounded-3xl border ${
                  isCurrent
                    ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-emerald-500/10"
                    : "border-slate-200/80 shadow-slate-200/40"
                } p-6 sm:p-7 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col relative`}
              >
                {/* Badge de Plan Actual */}
                {isCurrent && (
                  <span className="absolute top-5 right-5 bg-emerald-100 text-emerald-800 text-xs px-3.5 py-1 rounded-full font-bold flex items-center gap-1 border border-emerald-300 shadow-xs">
                    <Check className="h-3.5 w-3.5" /> Plan Actual
                  </span>
                )}

                {/* Nombre y Precio */}
                <h2 className="text-2xl font-bold text-slate-900 mb-1 pr-24">{plan.nombre}</h2>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    {precio === 0 ? "Gratis" : `$${precio}`}
                  </span>
                  {precio > 0 && <span className="text-sm font-medium text-slate-500">/mes</span>}
                </div>

                <p className="text-slate-600 text-xs sm:text-sm mb-5 leading-relaxed">
                  {plan.descripcion}
                </p>

                {/* Cuotas Destacadas */}
                <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-100 mb-5 space-y-2.5">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Cuotas Incluidas
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <Layers className="w-3.5 h-3.5 text-blue-600" /> Plantillas de Encuestas
                      </span>
                      <span className="font-bold text-slate-900">{formatLimit(plan.max_plantillas)}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <Send className="w-3.5 h-3.5 text-blue-600" /> Respuestas / mes
                      </span>
                      <span className="font-bold text-slate-900">{formatLimit(plan.max_entregas)}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <Users className="w-3.5 h-3.5 text-blue-600" /> Operadores de Equipo
                      </span>
                      <span className="font-bold text-slate-900">{formatLimit(plan.max_operadores)}</span>
                    </div>
                  </div>
                </div>

                {/* Canales y Módulos */}
                <div className="space-y-2 mb-6">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Canales y Funcionalidades
                  </p>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>Canal Email y Enlaces Web</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {plan.permite_audio_voz ? (
                        <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] text-slate-400">✕</span>
                        </div>
                      )}
                      <span className={plan.permite_audio_voz ? "font-medium text-purple-900" : "text-slate-400 line-through"}>
                        Encuestas Asistidas por Voz (IA)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {plan.permite_papel ? (
                        <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] text-slate-400">✕</span>
                        </div>
                      )}
                      <span className={plan.permite_papel ? "font-medium text-orange-900" : "text-slate-400 line-through"}>
                        Papel con QR y Digitalización OCR
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {plan.permite_ia_analisis ? (
                        <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] text-slate-400">✕</span>
                        </div>
                      )}
                      <span className={plan.permite_ia_analisis ? "font-medium text-indigo-900" : "text-slate-400 line-through"}>
                        Análisis Inteligente Gemini AI
                      </span>
                    </div>
                  </div>
                </div>

                {/* Características comerciales extras */}
                {plan.caracteristicas && (
                  <div className="border-t border-slate-100 pt-4 mb-6">
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {plan.caracteristicas.split(";").map((c, idx) => {
                        const trimmed = c.trim();
                        if (!trimmed) return null;
                        return (
                          <li key={idx} className="flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                            <span>{trimmed}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Botón de Acción */}
                <div className="mt-auto pt-4 border-t border-slate-100">
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full inline-flex items-center justify-center px-6 py-3.5 border border-emerald-300 text-sm font-semibold rounded-2xl text-emerald-800 bg-emerald-50 cursor-default shadow-xs"
                    >
                      Plan Actual Activo
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSuscripcion(plan.id)}
                      className="w-full inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-sm font-semibold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg shadow-blue-500/25 active:scale-[0.98]"
                    >
                      {precio === 0 ? "Comenzar Gratis" : "Actualizar a este Plan"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardSuscriptorLayout>
  );
};

export default Planes;
