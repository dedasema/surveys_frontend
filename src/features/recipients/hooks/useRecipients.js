import { useState, useEffect, useCallback, useMemo } from "react"
import { toast } from "sonner"
import { recipientsApi } from "../services/recipientsApi"

export function useRecipients() {
  const [recipients, setRecipients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const loadRecipients = useCallback(async () => {
    try {
      setLoading(true)
      const data = await recipientsApi.getAll()
      setRecipients(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error loading recipients:", error)
      toast.error(error.message || "Error al cargar destinatarios")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRecipients()
  }, [loadRecipients])

  const createRecipient = async (formData) => {
    try {
      await recipientsApi.create(formData)
      toast.success("Destinatario creado exitosamente")
      await loadRecipients()
      return true
    } catch (error) {
      console.error("Error creating recipient:", error)
      toast.error(error.message || "Error al crear destinatario")
      throw error
    }
  }

  const updateRecipient = async (id, formData) => {
    try {
      await recipientsApi.update(id, formData)
      toast.success("Destinatario actualizado exitosamente")
      await loadRecipients()
      return true
    } catch (error) {
      console.error("Error updating recipient:", error)
      toast.error(error.message || "Error al actualizar destinatario")
      throw error
    }
  }

  const deleteRecipient = async (id) => {
    try {
      await recipientsApi.delete(id)
      toast.success("Destinatario eliminado")
      await loadRecipients()
      return true
    } catch (error) {
      console.error("Error deleting recipient:", error)
      toast.error(error.message || "Error al eliminar destinatario")
      throw error
    }
  }

  const uploadExcel = async (file) => {
    try {
      const stats = await recipientsApi.uploadExcel(file)
      toast.success("Archivo Excel procesado correctamente")
      await loadRecipients()
      return stats
    } catch (error) {
      console.error("Error uploading excel:", error)
      toast.error(`Error al subir el archivo: ${error.message}`)
      throw error
    }
  }

  const filteredRecipients = useMemo(() => {
    if (!searchTerm.trim()) return recipients
    const term = searchTerm.toLowerCase()
    return recipients.filter(
      (r) =>
        r.nombre?.toLowerCase().includes(term) ||
        r.email?.toLowerCase().includes(term) ||
        r.telefono?.toLowerCase().includes(term)
    )
  }, [recipients, searchTerm])

  return {
    recipients,
    filteredRecipients,
    loading,
    searchTerm,
    setSearchTerm,
    loadRecipients,
    createRecipient,
    updateRecipient,
    deleteRecipient,
    uploadExcel,
  }
}
