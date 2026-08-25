import React from "react"
import { MessageSquare, Eye, User, Calendar } from "lucide-react"
import { Button } from "../../../shared/components/ui"

export const ResponseTable = ({
  responses = [],
  loading = false,
  onViewDetails,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 bg-white rounded-xl border border-gray-200">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-sm">Cargando respuestas...</span>
        </div>
      </div>
    )
  }

  if (responses.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200 p-6">
        <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-base font-semibold text-gray-900">Aún no hay respuestas registradas</h3>
        <p className="text-sm text-gray-500 mt-1">
          Las respuestas completadas por tus destinatarios aparecerán aquí en tiempo real.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-xs">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider">
          <tr>
            <th className="px-6 py-3.5 text-left">Participante</th>
            <th className="px-6 py-3.5 text-left">Contacto</th>
            <th className="px-6 py-3.5 text-left">Fecha de Respuesta</th>
            <th className="px-6 py-3.5 text-right">Detalle</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {responses.map((resp) => (
            <tr key={resp.id} className="hover:bg-gray-50/75 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <span>{resp.destinatario?.nombre || "Participante Anónimo"}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {resp.destinatario?.email || resp.destinatario?.telefono || "Vía formulario web / público"}
              </td>
              <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {new Date(resp.creado_en || resp.fecha || Date.now()).toLocaleString()}
                </div>
              </td>
              <td className="px-6 py-4 text-right whitespace-nowrap">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(resp)}
                  className="gap-1.5 text-xs text-blue-600 font-medium"
                >
                  <Eye className="w-4 h-4" />
                  Ver Respuestas
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
