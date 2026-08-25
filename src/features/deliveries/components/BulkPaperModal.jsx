import React, { useState } from "react"
import { Printer } from "lucide-react"
import { Modal, Input, Button } from "../../../shared/components/ui"

export const BulkPaperModal = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [cantidad, setCantidad] = useState(10)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (cantidad < 1) return
    setIsSubmitting(true)
    try {
      await onSubmit(Number(cantidad))
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generar Formularios para Impresión (Papel)">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-600">
          Indicá la cantidad de formularios impresos únicos que deseás generar para esta campaña. Cada uno tendrá un código QR y token independiente.
        </p>

        <Input
          label="Cantidad de Formularios"
          type="number"
          min="1"
          max="500"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          required
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSubmitting} className="gap-2">
            <Printer className="w-4 h-4" />
            Generar Formularios
          </Button>
        </div>
      </form>
    </Modal>
  )
}
