import { useState, useEffect, useCallback, useMemo } from "react"
import { toast } from "sonner"
import { surveysApi } from "../services/surveysApi"

export const QUESTION_TYPES = [
  { id: 1, nombre: "Texto", codigo: "texto", color: "blue" },
  { id: 2, nombre: "Número", codigo: "number", color: "emerald" },
  { id: 3, nombre: "Selección Única", codigo: "select", color: "purple" },
  { id: 4, nombre: "Selección Múltiple", codigo: "multiselect", color: "orange" },
]

export function useSurveys() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const loadTemplates = useCallback(async () => {
    try {
      setLoading(true)
      const data = await surveysApi.getTemplates()
      setTemplates(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Error loading templates:", err)
      toast.error(err.message || "Error al cargar plantillas")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTemplates()
  }, [loadTemplates])

  const createTemplate = async (data) => {
    try {
      await surveysApi.createTemplate(data)
      toast.success("Plantilla creada exitosamente")
      await loadTemplates()
      return true
    } catch (err) {
      toast.error(err.message || "Error al crear plantilla")
      throw err
    }
  }

  const updateTemplate = async (id, data) => {
    try {
      await surveysApi.updateTemplate(id, data)
      toast.success("Plantilla actualizada exitosamente")
      await loadTemplates()
      return true
    } catch (err) {
      toast.error(err.message || "Error al actualizar plantilla")
      throw err
    }
  }

  const deleteTemplate = async (id) => {
    try {
      await surveysApi.deleteTemplate(id)
      toast.success("Plantilla eliminada")
      await loadTemplates()
      return true
    } catch (err) {
      toast.error(err.message || "Error al eliminar plantilla")
      throw err
    }
  }

  const filteredTemplates = useMemo(() => {
    let result = templates
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (t) =>
          t.nombre?.toLowerCase().includes(term) ||
          t.descripcion?.toLowerCase().includes(term)
      )
    }
    if (filterStatus !== "all") {
      result = result.filter((t) => (filterStatus === "active" ? t.activo : !t.activo))
    }
    return result
  }, [templates, searchTerm, filterStatus])

  return {
    templates,
    filteredTemplates,
    loading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    loadTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  }
}
