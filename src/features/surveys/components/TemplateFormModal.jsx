import React, { useState, useEffect } from "react"
import { Modal, Input, Button } from "../../../shared/components/ui"

export const TemplateFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    activo: true,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || "",
        descripcion: initialData.descripcion || "",
        activo: initialData.activo ?? true,
      })
    } else {
      setFormData({ nombre: "", descripcion: "", activo: true })
    }
    setErrors({})
  }, [initialData, isOpen])

  const validate = () => {
    const errs = {}
    if (!formData.nombre.trim()) errs.nombre = "El nombre de la plantilla es obligatorio"
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    await onSubmit(formData)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Editar Plantilla" : "Nueva Plantilla de Encuesta"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre de la Plantilla"
          placeholder="Ej: Encuesta de Clima Laboral"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          error={errors.nombre}
          required
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            rows="3"
            placeholder="Breve descripción del propósito de la encuesta..."
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-none"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="template-active-checkbox"
            checked={formData.activo}
            onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
          />
          <label htmlFor="template-active-checkbox" className="text-sm font-medium text-gray-700">
            Plantilla Activa (Disponible para crear campañas)
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {initialData ? "Guardar Cambios" : "Crear Plantilla"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
