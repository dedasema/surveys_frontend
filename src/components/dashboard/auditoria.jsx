// src/components/dashboard/auditoria.jsx
import React, { useState, useEffect, useCallback } from "react"
import {
  ShieldAlert,
  Search,
  RefreshCw,
  Activity,
  Layers,
  Clock,
  Code2,
  X,
  ChevronLeft,
  ChevronRight,
  Database,
} from "lucide-react"
import DashboardLayout from "../dashboard-layout"
import { AppLayout } from "../../shared/layouts/AppLayout"
import { useLocation } from "react-router-dom"
import { listarAuditoria, obtenerFiltrosAuditoria } from "../../services/api-admin"

const SUPERADMIN_AUDIT_MODULES = [
  "PLANES",
  "SUSCRIPTORES",
  "ANUNCIOS",
  "EMPRESAS",
  "SUBSCRIPTION_PLANS",
  "CATALOGOS",
  "CANALES",
  "ESTADOS_PAGO",
  "ESTADOS_ENTREGA",
  "ESTADOS_DOCUMENTO",
  "METODOS_PAGO",
]

export default function Auditoria({ role = "admin" }) {
  const location = useLocation()
  const isSuscriptor =
    role === "suscriptor" || (location.pathname && location.pathname.includes("/dashboard-suscriptor"))
  const [logs, setLogs] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Filtros
  const [moduloFiltro, setModuloFiltro] = useState("")
  const [accionFiltro, setAccionFiltro] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [opcionesFiltros, setOpcionesFiltros] = useState({ modulos: [], acciones: [] })

  // Paginación
  const [page, setPage] = useState(1)
  const limit = 20

  // Modal de detalle
  const [selectedLog, setSelectedLog] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true)
      setError("")
      const offset = (page - 1) * limit
      const data = await listarAuditoria({
        modulo: moduloFiltro || undefined,
        accion: accionFiltro || undefined,
        limit,
        offset,
      })
      setLogs(data.items || [])
      setTotal(data.total || 0)
    } catch (err) {
      setError("Error al cargar los registros de auditoría: " + err.message)
    } finally {
      setLoading(false)
    }
  }, [page, moduloFiltro, accionFiltro])

  const cargarFiltros = async () => {
    try {
      const data = await obtenerFiltrosAuditoria()
      setOpcionesFiltros(data)
    } catch (err) {
      console.error("Error al cargar filtros:", err)
    }
  }

  useEffect(() => {
    cargarFiltros()
  }, [])

  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  const filteredLogs = logs.filter((log) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      (log.usuario_email && log.usuario_email.toLowerCase().includes(term)) ||
      (log.modulo && log.modulo.toLowerCase().includes(term)) ||
      (log.accion && log.accion.toLowerCase().includes(term)) ||
      (log.entidad_id && log.entidad_id.toLowerCase().includes(term))
    )
  })

  const getAccionBadge = (accion) => {
    const acc = (accion || "").toUpperCase()
    if (acc.includes("CREAR")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    }
    if (acc.includes("MODIFICAR") || acc.includes("ACTUALIZAR")) {
      return "bg-amber-50 text-amber-700 border-amber-200"
    }
    if (acc.includes("ELIMINAR") || acc.includes("BORRAR")) {
      return "bg-rose-50 text-rose-700 border-rose-200"
    }
    if (acc.includes("PERMISO") || acc.includes("ASIGNAR")) {
      return "bg-purple-50 text-purple-700 border-purple-200"
    }
    if (acc.includes("EXPORTAR")) {
      return "bg-blue-50 text-blue-700 border-blue-200"
    }
    return "bg-slate-100 text-slate-700 border-slate-200"
  }

  const getModuloBadge = (modulo) => {
    const mod = (modulo || "").toUpperCase()
    if (mod === "ROLES") return "bg-indigo-50 text-indigo-700 border-indigo-200"
    if (mod === "PLANTILLAS") return "bg-sky-50 text-sky-700 border-sky-200"
    if (mod === "CAMPANAS") return "bg-teal-50 text-teal-700 border-teal-200"
    if (mod === "AUTH" || mod === "USUARIOS") return "bg-violet-50 text-violet-700 border-violet-200"
    return "bg-slate-50 text-slate-600 border-slate-200"
  }

  const totalPages = Math.ceil(total / limit) || 1

  const modulosDisponibles = isSuscriptor
    ? opcionesFiltros.modulos.filter(
        (m) => !SUPERADMIN_AUDIT_MODULES.includes((m || "").toUpperCase())
      )
    : opcionesFiltros.modulos

  const Layout = isSuscriptor ? AppLayout : DashboardLayout
  const layoutProps = isSuscriptor ? { role: "suscriptor" } : { activeSection: "auditoria" }

  return (
    <Layout {...layoutProps}>
      <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-slate-100/50 to-blue-50/30 min-h-screen">
        {/* Encabezado */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/20">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {isSuscriptor ? "Registro de Auditoría de la Empresa" : "Registro de Auditoría"}
                </h1>
              </div>
              <p className="text-slate-600 text-sm sm:text-base">
                {isSuscriptor
                  ? "Trazabilidad y registro de acciones realizadas por los operadores y usuarios de tu empresa"
                  : "Trazabilidad global y registro inmutable de acciones administrativas en el sistema"}
              </p>
            </div>

            <button
              onClick={cargarDatos}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-sm font-medium shadow-sm transition-all hover:shadow"
            >
              <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? "animate-spin" : ""}`} />
              <span>Actualizar</span>
            </button>
          </div>
        </div>

        {/* Tarjetas de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Total Eventos</p>
                <p className="text-3xl font-bold text-slate-900">{total}</p>
                <p className="text-xs text-slate-500 mt-1">Registros persistidos</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <Database className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Módulos Auditados</p>
                <p className="text-3xl font-bold text-indigo-600">{modulosDisponibles.length}</p>
                <p className="text-xs text-slate-500 mt-1">Sistemas monitoreados</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                <Layers className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Página Actual</p>
                <p className="text-3xl font-bold text-slate-900">{page} <span className="text-lg font-normal text-slate-400">/ {totalPages}</span></p>
                <p className="text-xs text-slate-500 mt-1">Mostrando de a {limit} por página</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                <Activity className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            {/* Buscador */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por usuario, acción, ID..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            {/* Selector de Módulo */}
            <div>
              <select
                value={moduloFiltro}
                onChange={(e) => {
                  setModuloFiltro(e.target.value)
                  setPage(1)
                }}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              >
                <option value="">Todos los módulos</option>
                {modulosDisponibles.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Selector de Acción */}
            <div>
              <select
                value={accionFiltro}
                onChange={(e) => {
                  setAccionFiltro(e.target.value)
                  setPage(1)
                }}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              >
                <option value="">Todas las acciones</option>
                {opcionesFiltros.acciones.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl text-rose-800 text-sm">
            {error}
          </div>
        )}

        {/* Tabla de Logs */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Fecha y Hora</th>
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4">Módulo</th>
                  <th className="px-6 py-4">Acción</th>
                  <th className="px-6 py-4">IP Address</th>
                  <th className="px-6 py-4 text-center">Detalles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      <div className="inline-flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                        <span>Cargando registros de auditoría...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      No se encontraron registros de auditoría con los filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-slate-900 font-medium">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>
                            {new Date(log.creado_en).toLocaleDateString()}{" "}
                            <span className="text-slate-500 text-xs">
                              {new Date(log.creado_en).toLocaleTimeString()}
                            </span>
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-slate-900">{log.usuario_email || "Sistema / Anónimo"}</p>
                          {log.rol && (
                            <span className="inline-block mt-0.5 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                              {log.rol}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getModuloBadge(log.modulo)}`}>
                          {log.modulo}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getAccionBadge(log.accion)}`}>
                          {log.accion}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-500">
                        {log.ip_address || "127.0.0.1"}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => {
                            setSelectedLog(log)
                            setShowModal(true)
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                        >
                          <Code2 className="w-3.5 h-3.5" />
                          <span>Ver Payload</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              Mostrando página <span className="font-semibold text-slate-800">{page}</span> de <span className="font-semibold text-slate-800">{totalPages}</span> ({total} registros totales)
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1 || loading}
                className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-white disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-medium px-2">{page}</span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page >= totalPages || loading}
                className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-white disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal de Detalle JSON */}
        {showModal && selectedLog && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Detalle del Evento de Auditoría
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">
                    ID: {selectedLog.id}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Módulo:</span>
                    <span className="font-semibold text-slate-800">{selectedLog.modulo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Acción:</span>
                    <span className="font-semibold text-slate-800">{selectedLog.accion}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Usuario:</span>
                    <span className="font-semibold text-slate-800">{selectedLog.usuario_email || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">IP de Origen:</span>
                    <span className="font-semibold text-slate-800">{selectedLog.ip_address || "127.0.0.1"}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Payload de Datos (JSON)
                  </label>
                  <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-64">
                    {JSON.stringify(selectedLog.detalles, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
