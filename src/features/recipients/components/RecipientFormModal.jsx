import React, { useState, useEffect } from "react"
import { Modal, Input, Button } from "../../../shared/components/ui"

export const RecipientFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || "",
        email: initialData.email || "",
        telefono: initialData.telefono || "",
      })
    } else {
      setFormData({ nombre: "", email: "", telefono: "" })
    }
    setErrors({})
  }, [initialData, isOpen])

  const validate = () => {
    const errs = {}
    if (!formData.nombre.trim()) errs.nombre = "El nombre es obligatorio"
    if (!formData.email.trim() && !formData.telefono.trim()) {
      errs.email = "Debe especificar al menos un email o un teléfono"
      errs.telefono = "Debe especificar al menos un email o un teléfono"
    }
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    await onSubmit(formData)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Editar Destinatario" : "Nuevo Destinatario"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre Completo"
          placeholder="Ej: Juan Pérez"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          error={errors.nombre}
          required
        />
        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="ejemplo@correo.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />
        <Input
          label="Teléfono / Celular"
          placeholder="Ej: +5491112345678"
          value={formData.telefono}
          onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
          error={errors.telefono}
          helperText="Formato internacional recomendado"
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {initialData ? "Guardar Cambios" : "Crear Destinatario"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
