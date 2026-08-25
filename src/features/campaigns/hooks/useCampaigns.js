import { useState, useEffect, useCallback, useMemo } from "react"
import { toast } from "sonner"
import { campaignsApi } from "../services/campaignsApi"

export const CAMPAIGN_CHANNELS = [
  { id: 1, nombre: "Email", color: "blue", icon: "mail" },
  { id: 5, nombre: "Audio / Voz", color: "emerald", icon: "phone" },
  { id: 4, nombre: "Papel", color: "purple", icon: "globe" },
]

export const CAMPAIGN_STATUSES = [
  { id: 1, nombre: "Borrador", color: "gray" },
  { id: 2, nombre: "Programada", color: "yellow" },
  { id: 3, nombre: "Enviada", color: "blue" },
  { id: 4, nombre: "Cerrada", color: "green" },
]

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState([])
  const [plantillas, setPlantillas] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [campanasData, plantillasData] = await Promise.all([
        campaignsApi.getAll(),
        campaignsApi.getPlantillas(),
      ])
      setCampaigns(Array.isArray(campanasData) ? campanasData : [])
      setPlantillas(
        Array.isArray(plantillasData) ? plantillasData.filter((p) => p.activo) : []
      )
    } catch (err) {
      console.error("Error loading campaigns:", err)
      toast.error(err.message || "Error al cargar campañas")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const createCampaign = async (data) => {
    try {
      await campaignsApi.create(data)
      toast.success("Campaña creada exitosamente")
      await loadData()
      return true
    } catch (err) {
      console.error("Error creating campaign:", err)
      toast.error(err.message || "Error al crear campaña")
      throw err
    }
  }

  const updateCampaign = async (id, data) => {
    try {
      await campaignsApi.update(id, data)
      toast.success("Campaña actualizada exitosamente")
      await loadData()
      return true
    } catch (err) {
      console.error("Error updating campaign:", err)
      toast.error(err.message || "Error al actualizar campaña")
      throw err
    }
  }

  const deleteCampaign = async (id) => {
    try {
      await campaignsApi.delete(id)
      toast.success("Campaña eliminada")
      await loadData()
      return true
    } catch (err) {
      console.error("Error deleting campaign:", err)
      toast.error(err.message || "Error al eliminar campaña")
      throw err
    }
  }

  const filteredCampaigns = useMemo(() => {
    let result = campaigns
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      result = result.filter((c) => c.nombre?.toLowerCase().includes(term))
    }
    if (filterStatus !== "all") {
      result = result.filter((c) => c.estado_id?.toString() === filterStatus)
    }
    return result
  }, [campaigns, searchTerm, filterStatus])

  return {
    campaigns,
    filteredCampaigns,
    plantillas,
    loading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    loadData,
    createCampaign,
    updateCampaign,
    deleteCampaign,
  }
}
