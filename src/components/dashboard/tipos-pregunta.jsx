// src/components/dashboard/tipos-pregunta.jsx
import { useState, useEffect } from "react"
import { MessageSquare, HelpCircle, Loader2 } from "lucide-react"
import DashboardLayout from "../dashboard-layout"
import { listarTiposPregunta } from "../../services/api-admin"

const TiposPreguntaPage = () => {
  const [tiposPreguntas, setTiposPreguntas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function refreshTipos() {
      try {
        setLoading(true)
        const data = await listarTiposPregunta()
        setTiposPreguntas(data)
      } catch (err) {
        console.error("Error al obtener tipos de pregunta:", err)
      } finally {
        setLoading(false)
      }
    }
    refreshTipos()
  }, [])

  return (
    <DashboardLayout activeSection="tipos-pregunta">
      <div className="min-h-full p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
            Tipos de Pregunta
          </h1>
          <p className="text-slate-600 text-lg">Consulta los tipos de pregunta disponibles en el sistema</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tipos</p>
              <p className="text-2xl font-bold text-gray-900">{tiposPreguntas.length}</p>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-slate-300/25 transition-all duration-300 hover:-translate-y-1">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Lista de Tipos de Pregunta</h3>
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
                      Tipo
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {tiposPreguntas.map((tipo) => (
                    <tr key={tipo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 flex items-center gap-3 font-medium text-gray-900">
                        <HelpCircle className="h-5 w-5 text-blue-600" />
                        {tipo.nombre}
                      </td>
                    </tr>
                  ))}
                  {tiposPreguntas.length === 0 && (
                    <tr>
                      <td className="px-6 py-8 text-center text-sm text-gray-500">
                        No se encontraron tipos de pregunta registrados.
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

export default TiposPreguntaPage
