import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Building2,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Eye,
  Crown,
  TrendingUp,
  DollarSign,
  UserCheck,
  Building,
  Unlock,
  Send,
  PieChart as PieIcon,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import DashboardLayout from "../dashboard-layout";
import {
  listarSuscriptoresAdmin,
  impersonarSuscriptorAdmin,
  obtenerMetricasFinancierasAdmin,
} from "../../services/api-admin";

const PLAN_COLORS = {
  Enterprise: "#7c3aed", // Purple
  Profesional: "#2563eb", // Blue
  Pro: "#2563eb",
  Básico: "#059669", // Emerald
  Starter: "#059669",
  Gratuito: "#64748b", // Slate
  Free: "#64748b",
};

const DEFAULT_COLORS = ["#7c3aed", "#2563eb", "#059669", "#f59e0b", "#ec4899", "#06b6d4"];

export default function SuscriptoresPage() {
  const [suscriptores, setSuscriptores] = useState([]);
  const [metricas, setMetricas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subsRes, metricsRes] = await Promise.allSettled([
        listarSuscriptoresAdmin(),
        obtenerMetricasFinancierasAdmin().catch(() => null),
      ]);

      if (subsRes.status === "fulfilled" && Array.isArray(subsRes.value)) {
        setSuscriptores(subsRes.value);
      }

      if (metricsRes.status === "fulfilled" && metricsRes.value) {
        setMetricas(metricsRes.value);
      }
    } catch (err) {
      console.error("Error cargando datos del dashboard:", err);
      toast.error("Error al cargar la información del dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredSuscriptores = suscriptores.filter((s) => {
    const term = searchTerm.toLowerCase();
    const nombre = (s.nombre_empresa || s.empresa || s.nombre || "").toLowerCase();
    const email = (s.email_contacto || s.email || "").toLowerCase();
    const plan = (s.plan?.nombre || s.plan_nombre || "").toLowerCase();

    const matchSearch = nombre.includes(term) || email.includes(term) || plan.includes(term);
    const matchStatus =
      statusFilter === "todos" ||
      (s.estado || "activo").toLowerCase() === statusFilter.toLowerCase();

    return matchSearch && matchStatus;
  });

  const handleImpersonate = async (s) => {
    const empresaNombre = s.nombre_empresa || s.empresa || s.nombre || `Suscriptor #${s.id}`;
    const email = s.email_contacto || s.email || "Cliente";

    if (
      !window.confirm(
        `¿Deseas iniciar sesión en vivo como la empresa "${empresaNombre}" (${email}) para darle soporte técnico?`
      )
    ) {
      return;
    }

    try {
      toast.loading("Generando token de soporte en vivo...", { id: "impersonate-action" });
      const res = await impersonarSuscriptorAdmin(s.id);

      if (res?.access_token) {
        const currentToken = localStorage.getItem("token");
        if (currentToken) {
          localStorage.setItem("superadmin_token_backup", currentToken);
        }
        localStorage.setItem("impersonated_email", res.impersonated_email || email);
        localStorage.setItem("token", res.access_token);

        toast.success("Modo soporte activado. Redirigiendo...", { id: "impersonate-action" });
        setTimeout(() => {
          window.location.href = "/dashboard-suscriptor/dashboard";
        }, 400);
      } else {
        toast.error(res?.message || "No se pudo generar el token de soporte.", {
          id: "impersonate-action",
        });
      }
    } catch (err) {
      toast.error("Error al iniciar modo soporte: " + err.message, { id: "impersonate-action" });
    }
  };

  // Métricas financieras calculadas (con fallback de la lista)
  const totalEmpresas = metricas?.total_empresas_registradas ?? suscriptores.length;
  const activas =
    metricas?.total_empresas_activas ??
    suscriptores.filter((s) => (s.estado || "activo").toLowerCase() === "activo").length;
  const suspendidas =
    metricas?.total_empresas_suspendidas ??
    suscriptores.filter((s) => (s.estado || "activo").toLowerCase() === "suspendido").length;

  const fallbackMRR = suscriptores.reduce((acc, s) => {
    const precio = parseFloat(s.plan?.precio_mensual || s.precio_mensual || 0);
    return acc + (isNaN(precio) ? 0 : precio);
  }, 0);

  const mrr = metricas?.mrr_usd !== undefined ? parseFloat(metricas.mrr_usd) : fallbackMRR;
  const arr = metricas?.arr_usd !== undefined ? parseFloat(metricas.arr_usd) : mrr * 12;
  const arpu =
    metricas?.arpu_usd !== undefined
      ? parseFloat(metricas.arpu_usd)
      : totalEmpresas > 0
      ? mrr / totalEmpresas
      : 0;

  const entregasMes =
    metricas?.entregas_totales_mes_plataforma ??
    suscriptores.reduce((acc, s) => acc + (s.resumen_uso?.entregas_mes ?? s.entregas_mes ?? 0), 0);

  // Transformar distribución por plan para Recharts
  const distribucionRaw = metricas?.distribucion_suscriptores_por_plan || {};
  let chartData = Object.entries(distribucionRaw).map(([name, value]) => ({
    name,
    value: Number(value),
  }));

  // Fallback para el gráfico si aún no viene del backend
  if (chartData.length === 0 && suscriptores.length > 0) {
    const counts = {};
    suscriptores.forEach((s) => {
      const p = s.plan?.nombre || s.plan_nombre || "Básico";
      counts[p] = (counts[p] || 0) + 1;
    });
    chartData = Object.entries(counts).map(([name, value]) => ({ name, value }));
  }

  const getStatusBadge = (estado = "activo") => {
    const st = (estado || "activo").toLowerCase();
    if (st === "activo" || st === "active") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-full">
          <CheckCircle className="w-3.5 h-3.5" /> Activo
        </span>
      );
    }
    if (st === "suspendido" || st === "suspended" || st === "bloqueado") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-full">
          <AlertCircle className="w-3.5 h-3.5" /> Suspendido
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold rounded-full">
        {estado}
      </span>
    );
  };

  return (
    <DashboardLayout activeSection="suscriptores">
      <div className="min-h-full p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/40">
        {/* Header Principal */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl shadow-md shadow-blue-600/20">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  Cockpit de Suscriptores & Métricas SaaS
                </h1>
                <p className="text-slate-600 text-xs sm:text-sm">
                  Monitoreo de ingresos recurrentes, distribución de clientes y soporte técnico en vivo
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 👑 COCKPIT FINANCIERO Y SALUD DEL SAAS (Fase 2) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xl shadow-slate-200/25 mb-8">
          <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Salud Financiera & Monetización</h2>
                <p className="text-xs text-slate-500">Métricas clave calculadas en tiempo real</p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              En Vivo
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna Izquierda: 4 Cards de Métricas */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. MRR */}
              <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/40 p-5 rounded-2xl border border-blue-100 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                    MRR (Monthly Recurring)
                  </span>
                  <div className="p-2 bg-blue-600 text-white rounded-xl shadow-xs">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-black text-slate-900 font-mono">${mrr.toFixed(2)}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Ingreso mensual recurrente</p>
              </div>

              {/* 2. ARR */}
              <div className="bg-gradient-to-br from-purple-50/70 to-indigo-50/40 p-5 rounded-2xl border border-purple-100 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                    ARR (Annual Projection)
                  </span>
                  <div className="p-2 bg-purple-600 text-white rounded-xl shadow-xs">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-black text-slate-900 font-mono">${arr.toFixed(2)}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Proyección anualizada de ingresos</p>
              </div>

              {/* 3. ARPU */}
              <div className="bg-gradient-to-br from-emerald-50/70 to-teal-50/40 p-5 rounded-2xl border border-emerald-100 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    ARPU (Avg Revenue)
                  </span>
                  <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
                    <UserCheck className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-black text-slate-900 font-mono">${arpu.toFixed(2)}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Ingreso promedio por empresa</p>
              </div>

              {/* 4. Entregas Totales */}
              <div className="bg-gradient-to-br from-amber-50/70 to-orange-50/40 p-5 rounded-2xl border border-amber-100 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    Capacidad Plataforma
                  </span>
                  <div className="p-2 bg-amber-600 text-white rounded-xl shadow-xs">
                    <Send className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-black text-slate-900 font-mono">
                  {entregasMes.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Respuestas totales registradas en el mes
                </p>
              </div>

              {/* Barra de estado de cuentas */}
              <div className="sm:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-500" />
                  <span className="font-semibold text-slate-700">
                    Directorio de Clientes: {totalEmpresas} empresas registradas
                  </span>
                </div>
                <div className="flex items-center gap-3 font-semibold">
                  <span className="text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                    {activas} Activas
                  </span>
                  <span className="text-red-700 bg-red-100/80 px-2.5 py-1 rounded-lg">
                    {suspendidas} Suspendidas
                  </span>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Gráfico Donut de Distribución por Plan */}
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <PieIcon className="w-4 h-4 text-blue-600" /> Distribución por Plan
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{chartData.length} tiers</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">Segmentación de clientes por nivel de suscripción</p>
              </div>

              {chartData.length === 0 ? (
                <div className="h-44 flex items-center justify-center text-xs text-slate-400">
                  Sin datos de planes activos
                </div>
              ) : (
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={42}
                        outerRadius={68}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PLAN_COLORS[entry.name] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val, name) => [`${val} empresa(s)`, `Plan ${name}`]}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Leyenda del gráfico */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/60">
                {chartData.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          PLAN_COLORS[entry.name] || DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
                      }}
                    ></span>
                    <span className="font-medium text-slate-700">{entry.name}:</span>
                    <span className="font-bold text-slate-900">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Buscador y Filtros */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por empresa, correo o plan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="todos">Todos los Estados</option>
              <option value="activo">Solo Activos</option>
              <option value="suspendido">Solo Suspendidos</option>
            </select>
          </div>
        </div>

        {/* Tabla de Suscriptores */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/20 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredSuscriptores.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-1">No se encontraron suscriptores</h3>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                {searchTerm
                  ? "No hay empresas que coincidan con los criterios de búsqueda."
                  : "Aún no hay empresas registradas en la base de datos."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3.5 px-6">Empresa / Suscriptor</th>
                    <th className="py-3.5 px-6">Contacto</th>
                    <th className="py-3.5 px-6">Plan Actual</th>
                    <th className="py-3.5 px-6">Consumo Mensual</th>
                    <th className="py-3.5 px-6">Estado</th>
                    <th className="py-3.5 px-6">Registro</th>
                    <th className="py-3.5 px-6 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSuscriptores.map((s) => {
                    const empresaNombre = s.nombre_empresa || s.empresa || s.nombre || "Empresa Sin Nombre";
                    const email = s.email_contacto || s.email || "Sin correo";
                    const planNombre = s.plan?.nombre || s.plan_nombre || "Básico";
                    const planPrecio = parseFloat(s.plan?.precio_mensual || s.precio_mensual || 0);
                    const entregasUsadas = s.resumen_uso?.entregas_mes ?? s.entregas_mes ?? 0;
                    const maxEntregas = s.resumen_uso?.max_entregas ?? s.plan?.max_entregas ?? 500;
                    const isInf = maxEntregas === -1 || maxEntregas === 0 || maxEntregas === "0";
                    const pct = isInf ? 0 : Math.min(Math.round((entregasUsadas / maxEntregas) * 100), 100);

                    const fechaStr = s.creado_en
                      ? new Date(s.creado_en).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-";

                    return (
                      <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Empresa */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-xs">
                              {empresaNombre.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{empresaNombre}</p>
                              <p className="text-xs text-slate-400 font-mono">ID: #{s.id}</p>
                            </div>
                          </div>
                        </td>

                        {/* Contacto */}
                        <td className="py-4 px-6 text-xs">
                          <p className="font-medium text-slate-800">{email}</p>
                          {s.telefono && <p className="text-slate-400 mt-0.5">{s.telefono}</p>}
                        </td>

                        {/* Plan */}
                        <td className="py-4 px-6">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 font-semibold text-xs rounded-xl border border-blue-200/60">
                            <Crown className="w-3.5 h-3.5 text-blue-600" />
                            <span>{planNombre}</span>
                            <span className="text-slate-400 font-normal">
                              ({planPrecio === 0 ? "Gratis" : `$${planPrecio}/m`})
                            </span>
                          </div>
                        </td>

                        {/* Consumo */}
                        <td className="py-4 px-6">
                          <div className="w-36">
                            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                              <span>{entregasUsadas}</span>
                              <span className="text-slate-400 font-normal">
                                / {isInf ? "Ilim." : maxEntregas}
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  pct >= 90 ? "bg-red-500" : pct >= 75 ? "bg-yellow-500" : "bg-blue-600"
                                }`}
                                style={{ width: isInf ? "100%" : `${pct}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>

                        {/* Estado */}
                        <td className="py-4 px-6">{getStatusBadge(s.estado)}</td>

                        {/* Registro */}
                        <td className="py-4 px-6 text-xs text-slate-500">{fechaStr}</td>

                        {/* Acciones */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleImpersonate(s)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-600 hover:text-white border border-amber-200/80 rounded-xl text-xs font-semibold transition-all duration-150 shadow-xs cursor-pointer"
                              title="Iniciar sesión como esta empresa para soporte técnico en vivo"
                            >
                              <Unlock className="w-3.5 h-3.5" />
                              <span>Soporte en Vivo</span>
                            </button>
                            <Link
                              to={`/dashboard/suscriptores/${s.id}`}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-semibold transition-all duration-150 shadow-xs"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Detalle 360°</span>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
