import React from "react"
import { Users, Mail, Phone, Edit2, Trash2 } from "lucide-react"
import { Badge, Button } from "../../../shared/components/ui"

export const RecipientTable = ({
  recipients = [],
  loading = false,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 bg-white rounded-xl border border-gray-200">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-sm">Cargando destinatarios...</span>
        </div>
      </div>
    )
  }

  if (recipients.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200 p-6">
        <Users className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-base font-semibold text-gray-900">No hay destinatarios</h3>
        <p className="text-sm text-gray-500 mt-1">
          Comenzá agregando un destinatario manual o importando un archivo Excel.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-xs">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider">
          <tr>
            <th className="px-6 py-3.5 text-left">Nombre</th>
            <th className="px-6 py-3.5 text-left">Email</th>
            <th className="px-6 py-3.5 text-left">Teléfono</th>
            <th className="px-6 py-3.5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {recipients.map((recipient) => (
            <tr key={recipient.id} className="hover:bg-gray-50/75 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    {recipient.nombre?.charAt(0)?.toUpperCase() || "D"}
                  </div>
                  <span>{recipient.nombre}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {recipient.email ? (
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {recipient.email}
                  </span>
                ) : (
                  <span className="text-gray-400 italic">Sin correo</span>
                )}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {recipient.telefono ? (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {recipient.telefono}
                  </span>
                ) : (
                  <span className="text-gray-400 italic">Sin teléfono</span>
                )}
              </td>
              <td className="px-6 py-4 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(recipient)}
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(recipient.id)}
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
