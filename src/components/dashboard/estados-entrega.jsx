// src/components/dashboard/estados-entrega.jsx
import { useEffect, useState } from "react"
import {
  Send,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Truck,
  MessageSquare,
  Loader2,
} from "lucide-react"
import DashboardLayout from "../dashboard-layout"
import { listarEstadosEntrega } from "../../services/api-admin"

const ICONOS = {
  pendiente: Clock,
  enviada: Send,
  respondida: CheckCircle,
  failed: XCircle,
  rebotada: AlertTriangle,
}
const COLORES = {
  pendiente: "#6b7280",
  enviada: "#3b82f6",
  respondida: "#10b981",
  failed: "#ef4444",
  rebotada: "#f97316",
}

const getIcon = (n) => ICONOS[n?.toLowerCase()] || Truck
const getColor = (n) => COLORES[n?.toLowerCase()] || "#3b82f6"

const EstadosEntregaPage = () => {
  const [estados, setEstados] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function refresh() {
      try {
        setLoading(true)
        const data = await listarEstadosEntrega()
        setEstados(data)
      } catch (err) {
        console.error("Error al obtener estados de entrega:", err)
      } finally {
        setLoading(false)
      }
    }
    refresh()
  }, [])

  return (
    <DashboardLayout activeSection="estados-entrega">
      <div className="min-h-full p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
            Estados de Entrega
          </h1>
          <p className="text-slate-600 text-lg">Consulta los estados del proceso de entrega</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Estados</p>
                <p className="text-2xl font-bold text-gray-900">{estados.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-slate-300/25 transition-all duration-300 hover:-translate-y-1">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Lista de Estados</h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Solo lectura</span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="animate-spin h-6 w-6 text-slate-500" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {estados.map((e) => {
                    const Icon = getIcon(e.nombre)
                    const color = getColor(e.nombre)
                    return (
                      <tr key={e.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 flex items-center gap-3 font-medium text-gray-900">
                          <span
                            style={{ backgroundColor: color }}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0"
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          {e.nombre}
                        </td>
                      </tr>
                    )
                  })}
                  {estados.length === 0 && (
                    <tr>
                      <td className="px-6 py-8 text-center text-sm text-gray-500">
                        No se encontraron estados de entrega registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EstadosEntregaPage
