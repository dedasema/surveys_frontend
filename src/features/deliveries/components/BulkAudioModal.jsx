import React, { useState } from "react"
import { Mic } from "lucide-react"
import { Modal, Input, Button } from "../../../shared/components/ui"

export const BulkAudioModal = ({
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
    <Modal isOpen={isOpen} onClose={onClose} title="Generar Sesiones de Encuesta por Voz (Audio)">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-600">
          Indicá la cantidad de sesiones de encuesta guiadas por voz asistida que deseás habilitar para los operadores.
        </p>

        <Input
          label="Cantidad de Sesiones de Voz"
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
            <Mic className="w-4 h-4" />
            Generar Sesiones
          </Button>
        </div>
      </form>
    </Modal>
  )
}
