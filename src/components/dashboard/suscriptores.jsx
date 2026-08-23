import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Building2,
  Users,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Layers,
  Send,
  Eye,
  Crown,
  TrendingUp,
  DollarSign,
  UserCheck,
  Building,
} from "lucide-react";
import DashboardLayout from "../dashboard-layout";
import { listarSuscriptoresAdmin } from "../../services/api-admin";

export default function SuscriptoresPage() {
  const [suscriptores, setSuscriptores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const fetchSuscriptores = async () => {
    try {
      setLoading(true);
      const data = await listarSuscriptoresAdmin();
      setSuscriptores(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando suscriptores:", err);
      toast.error("Error al cargar la lista de suscriptores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuscriptores();
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

  // Métricas Globales
  const totalEmpresas = suscriptores.length;
  const activas = suscriptores.filter((s) => (s.estado || "activo").toLowerCase() === "activo").length;
  const mrrEstimado = suscriptores.reduce((acc, s) => {
    const precio = parseFloat(s.plan?.precio_mensual || s.precio_mensual || 0);
    return acc + (isNaN(precio) ? 0 : precio);
  }, 0);

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
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-600/20">
                <Building2 className="w-7 h-7" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Gestión de Suscriptores
              </h1>
            </div>
            <p className="text-slate-600 text-sm sm:text-base">
              Directorio de empresas, salud de membresías y consumo en tiempo real
            </p>
          </div>
        </div>

        {/* Métricas Globales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Empresas
              </span>
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <Building className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{totalEmpresas}</p>
            <p className="text-xs text-slate-400 mt-1">Registradas en la plataforma</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Cuentas Activas
              </span>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-emerald-700">{activas}</p>
            <p className="text-xs text-slate-400 mt-1">Empresas operando sin restricciones</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                MRR Estimado
              </span>
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900">${mrrEstimado.toFixed(2)}</p>
            <p className="text-xs text-slate-400 mt-1">Ingresos mensuales recurrentes</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Tasa de Retención
              </span>
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-purple-700">
              {totalEmpresas > 0 ? `${Math.round((activas / totalEmpresas) * 100)}%` : "100%"}
            </p>
            <p className="text-xs text-slate-400 mt-1">Salud operativa de clientes</p>
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
                          <Link
                            to={`/dashboard/suscriptores/${s.id}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-semibold transition-all duration-150 shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Detalle 360°</span>
                          </Link>
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
