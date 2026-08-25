import React, { useState } from "react"
import { Send } from "lucide-react"
import { Modal, Button } from "../../../shared/components/ui"

export const IndividualDeliveryModal = ({
  isOpen,
  onClose,
  onSubmit,
  recipients = [],
}) => {
  const [selectedRecipientId, setSelectedRecipientId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedRecipientId) return
    setIsSubmitting(true)
    try {
      await onSubmit(selectedRecipientId)
      setSelectedRecipientId("")
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Entrega Individual">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Seleccionar Destinatario</label>
          <select
            value={selectedRecipientId}
            onChange={(e) => setSelectedRecipientId(e.target.value)}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 bg-white"
            required
          >
            <option value="">-- Seleccionar --</option>
            {recipients.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre} ({r.email || r.telefono || "Sin contacto"})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSubmitting} disabled={!selectedRecipientId} className="gap-2">
            <Send className="w-4 h-4" />
            Crear Entrega
          </Button>
        </div>
      </form>
    </Modal>
  )
}
