import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Receipt,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Download,
  Search,
  Filter,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  Crown,
} from "lucide-react";
import DashboardSuscriptorLayout from "./layout";
import LoadingScreen from "../LoadingScreen";
import { getHistorialPagos, getMiSuscripcion } from "../../services/api";

export default function HistorialPagos() {
  const [loading, setLoading] = useState(true);
  const [pagos, setPagos] = useState([]);
  const [suscripcion, setSuscripcion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [pagosData, subData] = await Promise.allSettled([
          getHistorialPagos().catch(() => []),
          getMiSuscripcion().catch(() => null),
        ]);

        if (pagosData.status === "fulfilled" && Array.isArray(pagosData.value)) {
          setPagos(pagosData.value);
        }

        if (subData.status === "fulfilled" && subData.value) {
          setSuscripcion(subData.value);
        }
      } catch (err) {
        console.error("Error al cargar historial de pagos:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <LoadingScreen message="Cargando tu historial de facturación..." />;
  }

  // Filtrado
  const filteredPagos = pagos.filter((pago) => {
    const matchSearch =
      (pago.referencia_stripe || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pago.plan_nombre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pago.id || "").toString().toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      statusFilter === "todos" ||
      (pago.estado || "").toLowerCase() === statusFilter.toLowerCase();

    return matchSearch && matchStatus;
  });

  const totalInvertido = pagos
    .filter((p) => (p.estado || "").toLowerCase() === "completado" || (p.estado || "").toLowerCase() === "succeeded" || (p.estado || "").toLowerCase() === "paid")
    .reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);

  const getStatusBadge = (estado = "") => {
    const st = estado.toLowerCase();
    if (st === "completado" || st === "succeeded" || st === "paid" || st === "exitoso") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5" /> Pagado
        </span>
      );
    }
    if (st === "pendiente" || st === "pending") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold rounded-full">
          <Clock className="w-3.5 h-3.5" /> Pendiente
        </span>
      );
    }
    if (st === "fallido" || st === "failed") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-full">
          <AlertCircle className="w-3.5 h-3.5" /> Fallido
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold rounded-full">
        {estado || "Procesado"}
      </span>
    );
  };

  return (
    <DashboardSuscriptorLayout activeSection="historial-pagos">
      <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/40 min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Receipt className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Historial de Pagos
              </h1>
            </div>
            <p className="text-slate-600 text-sm sm:text-base">
              Consulta tus facturas, transacciones y recibos emitidos
            </p>
          </div>

          <Link
            to="/dashboard-suscriptor/mi-suscripcion"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium rounded-xl text-sm shadow-xs transition-colors self-start sm:self-auto"
          >
            <Crown className="w-4 h-4 text-blue-600" />
            <span>Mi Suscripción</span>
          </Link>
        </div>

        {/* Tarjetas de Resumen Financiero */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Total Invertido</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900">${totalInvertido.toFixed(2)}</p>
            <p className="text-xs text-slate-400 mt-1">Facturado en suscripciones y cuotas</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Transacciones Totales</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Receipt className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{pagos.length}</p>
            <p className="text-xs text-slate-400 mt-1">Recibos y cobros procesados</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Plan en Curso</span>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Crown className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xl font-bold text-slate-900 truncate">
              {suscripcion?.plan?.nombre || "Plan Básico"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {suscripcion?.fecha_fin
                ? `Próx. renovación: ${new Date(suscripcion.fecha_fin).toLocaleDateString()}`
                : "Suscripción activa"}
            </p>
          </div>
        </div>

        {/* Filtros y Buscador */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por referencia o plan..."
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
              <option value="completado">Pagados</option>
              <option value="pendiente">Pendientes</option>
              <option value="fallido">Fallidos</option>
            </select>
          </div>
        </div>

        {/* Tabla de Pagos */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/20 overflow-hidden">
          {filteredPagos.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Receipt className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No hay pagos registrados</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                Cuando realices la contratación de un plan o cargos periódicos, aparecerán aquí tus comprobantes y facturas.
              </p>
              <Link
                to="/dashboard-suscriptor/planes"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all"
              >
                <span>Ver Planes Disponibles</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3.5 px-6">Referencia</th>
                    <th className="py-3.5 px-6">Concepto / Plan</th>
                    <th className="py-3.5 px-6">Fecha</th>
                    <th className="py-3.5 px-6">Monto</th>
                    <th className="py-3.5 px-6">Método</th>
                    <th className="py-3.5 px-6">Estado</th>
                    <th className="py-3.5 px-6 text-right">Recibo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPagos.map((pago, idx) => {
                    const monto = parseFloat(pago.monto) || 0;
                    const fechaStr = pago.fecha
                      ? new Date(pago.fecha).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Reciente";

                    return (
                      <tr key={pago.id || idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6 font-mono text-xs text-slate-800 font-semibold">
                          {pago.referencia_stripe || pago.id || `TXN-${idx + 1001}`}
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-900">
                          {pago.plan_nombre || "Suscripción SurveySaaS"}
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-500">{fechaStr}</td>
                        <td className="py-4 px-6 font-bold text-slate-900">
                          ${monto.toFixed(2)} {pago.moneda ? pago.moneda.toUpperCase() : "USD"}
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-600">
                          <span className="flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                            {pago.metodo_pago || "Tarjeta de Crédito"}
                          </span>
                        </td>
                        <td className="py-4 px-6">{getStatusBadge(pago.estado)}</td>
                        <td className="py-4 px-6 text-right">
                          {pago.recibo_url ? (
                            <a
                              href={pago.recibo_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <span>Ver</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400">Procesado</span>
                          )}
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
    </DashboardSuscriptorLayout>
  );
}
