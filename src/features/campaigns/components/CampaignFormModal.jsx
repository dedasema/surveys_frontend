import React, { useState, useEffect } from "react"
import { Modal, Input, Button } from "../../../shared/components/ui"
import { CAMPAIGN_CHANNELS } from "../hooks/useCampaigns"

export const CampaignFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  plantillas = [],
  initialData = null,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    plantilla_id: "",
    canal_id: "",
    programada_en: "",
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || "",
        plantilla_id: initialData.plantilla_id || "",
        canal_id: initialData.canal_id || "",
        programada_en: initialData.programada_en
          ? new Date(initialData.programada_en).toISOString().slice(0, 16)
          : "",
      })
    } else {
      setFormData({
        nombre: "",
        plantilla_id: plantillas[0]?.id || "",
        canal_id: CAMPAIGN_CHANNELS[0]?.id || "",
        programada_en: "",
      })
    }
    setErrors({})
  }, [initialData, plantillas, isOpen])

  const validate = () => {
    const errs = {}
    if (!formData.nombre.trim()) errs.nombre = "El nombre de la campaña es obligatorio"
    if (!formData.plantilla_id) errs.plantilla_id = "Seleccioná una plantilla"
    if (!formData.canal_id) errs.canal_id = "Seleccioná un canal"
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    const payload = {
      nombre: formData.nombre.trim(),
      plantilla_id: formData.plantilla_id,
      canal_id: Number(formData.canal_id),
      ...(formData.programada_en && {
        programada_en: new Date(formData.programada_en).toISOString(),
      }),
    }
    await onSubmit(payload)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Editar Campaña" : "Crear Nueva Campaña"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre de la Campaña"
          placeholder="Ej: Encuesta de Satisfacción Q3"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          error={errors.nombre}
          required
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Plantilla de Encuesta</label>
          <select
            value={formData.plantilla_id}
            onChange={(e) => setFormData({ ...formData, plantilla_id: e.target.value })}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">-- Seleccionar Plantilla --</option>
            {plantillas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
          {errors.plantilla_id && (
            <p className="text-xs text-red-600 font-medium">{errors.plantilla_id}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Canal de Envío</label>
          <select
            value={formData.canal_id}
            onChange={(e) => setFormData({ ...formData, canal_id: e.target.value })}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">-- Seleccionar Canal --</option>
            {CAMPAIGN_CHANNELS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
          {errors.canal_id && (
            <p className="text-xs text-red-600 font-medium">{errors.canal_id}</p>
          )}
        </div>

        <Input
          label="Programar Envío (Opcional)"
          type="datetime-local"
          value={formData.programada_en}
          onChange={(e) => setFormData({ ...formData, programada_en: e.target.value })}
          helperText="Dejá en blanco para guardar como borrador o enviar manualmente"
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {initialData ? "Guardar Cambios" : "Crear Campaña"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
