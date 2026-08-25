import React from "react"
import { PhoneCall, FileText, Send, CheckCircle2, Clock, ExternalLink } from "lucide-react"
import { Badge, Button } from "../../../shared/components/ui"

export const DeliveryTable = ({
  deliveries = [],
  loading = false,
  canalId,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 bg-white rounded-xl border border-gray-200">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-sm">Cargando entregas...</span>
        </div>
      </div>
    )
  }

  if (deliveries.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200 p-6">
        <Send className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-base font-semibold text-gray-900">No hay entregas para esta campaña</h3>
        <p className="text-sm text-gray-500 mt-1">
          Generá formularios masivos o creá entregas para tus destinatarios.
        </p>
      </div>
    )
  }

  const getStatusBadge = (estadoId) => {
    switch (estadoId) {
      case 1:
        return <Badge variant="neutral">Pendiente</Badge>
      case 2:
        return <Badge variant="default">Enviado</Badge>
      case 3:
        return <Badge variant="success">Respondido</Badge>
      default:
        return <Badge variant="neutral">Desconocido</Badge>
    }
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-xs">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider">
          <tr>
            <th className="px-6 py-3.5 text-left">Destinatario / Identificador</th>
            <th className="px-6 py-3.5 text-left">Token / Enlace</th>
            <th className="px-6 py-3.5 text-left">Estado</th>
            <th className="px-6 py-3.5 text-left">Fecha</th>
            <th className="px-6 py-3.5 text-right">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {deliveries.map((delivery) => {
            const surveyUrl = `${window.location.origin}/encuestas/${delivery.token}`
            return (
              <tr key={delivery.id} className="hover:bg-gray-50/75 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {delivery.destinatario ? (
                    <div>
                      <p className="font-semibold text-gray-900">{delivery.destinatario.nombre}</p>
                      <p className="text-xs text-gray-500">{delivery.destinatario.email || delivery.destinatario.telefono}</p>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-gray-600 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      <FileText className="w-3.5 h-3.5" />
                      Formulario #{delivery.id?.slice(0, 8) || "Papel"}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 font-mono text-xs text-gray-600 whitespace-nowrap">
                  <span className="bg-slate-100 px-2 py-1 rounded text-slate-700">
                    {delivery.token?.slice(0, 12)}...
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(delivery.estado_id)}
                </td>
                <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                  {new Date(delivery.creada_en || Date.now()).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <a
                    href={surveyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Abrir Encuesta
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
