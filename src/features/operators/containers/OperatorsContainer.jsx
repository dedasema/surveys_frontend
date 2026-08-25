import React, { useState } from "react"
import { Plus, Search, UserCog, Mail } from "lucide-react"
import { AppLayout } from "../../../shared/layouts/AppLayout"
import { Button, Modal, Input, Badge } from "../../../shared/components/ui"
import { useOperators } from "../hooks/useOperators"

export const OperatorsContainer = ({ role = "suscriptor" }) => {
  const { filteredOperators, loading, searchTerm, setSearchTerm, registerOperator } =
    useOperators()
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({ nombre_completo: "", email: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.nombre_completo.trim()) return
    setIsSubmitting(true)
    try {
      await registerOperator(formData)
      setFormData({ nombre_completo: "", email: "" })
      setModalOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppLayout role={role}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Operadores</h1>
            <p className="text-sm text-gray-500 mt-1">
              Gestioná tu equipo de operadores para la captura y transcripción de encuestas
            </p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Operador
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-48 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm">Cargando operadores...</span>
            </div>
          </div>
        ) : filteredOperators.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 p-6">
            <UserCog className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-base font-semibold text-gray-900">No hay operadores registrados</h3>
            <p className="text-sm text-gray-500 mt-1">
              Registrá a los miembros de tu equipo para habilitarles acceso al panel de operador.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOperators.map((op) => (
              <div
                key={op.id}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                      {op.nombre_completo?.charAt(0)?.toUpperCase() || "O"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">{op.nombre_completo}</h3>
                      <Badge variant="default" className="text-[10px]">
                        Operador
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-600">
                    {op.email && (
                      <p className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        {op.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-gray-100 text-xs text-gray-400">
                  <span>Acceso habilitado</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Registrar Nuevo Operador">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre Completo"
              placeholder="Ej: Laura Gómez"
              value={formData.nombre_completo}
              onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
              required
            />
            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="operador@empresa.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              helperText="Se generará una contraseña temporal por defecto (Temporal123!)"
            />
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Crear Operador
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  )
}
