import { useState, useEffect, useCallback, useMemo } from "react"
import { toast } from "sonner"
import { responsesApi } from "../services/responsesApi"

export function useResponses() {
  const [campaigns, setCampaigns] = useState([])
  const [selectedCampaignId, setSelectedCampaignId] = useState("")
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [responsesLoading, setResponsesLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const loadCampaigns = useCallback(async () => {
    try {
      setLoading(true)
      const data = await responsesApi.getCampaigns()
      const list = Array.isArray(data) ? data : []
      setCampaigns(list)
      if (list.length > 0 && !selectedCampaignId) {
        setSelectedCampaignId(list[0].id)
      }
    } catch (err) {
      console.error("Error loading campaigns for responses:", err)
      toast.error(err.message || "Error al cargar campañas")
    } finally {
      setLoading(false)
    }
  }, [selectedCampaignId])

  const loadResponses = useCallback(async (campaignId) => {
    if (!campaignId) {
      setResponses([])
      return
    }
    try {
      setResponsesLoading(true)
      const data = await responsesApi.getResponses(campaignId)
      setResponses(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Error loading responses:", err)
      toast.error(err.message || "Error al cargar respuestas")
    } finally {
      setResponsesLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCampaigns()
  }, [loadCampaigns])

  useEffect(() => {
    if (selectedCampaignId) {
      loadResponses(selectedCampaignId)
    }
  }, [selectedCampaignId, loadResponses])

  const selectedCampaign = useMemo(() => {
    return campaigns.find((c) => c.id === selectedCampaignId) || null
  }, [campaigns, selectedCampaignId])

  const filteredResponses = useMemo(() => {
    if (!searchTerm.trim()) return responses
    const term = searchTerm.toLowerCase()
    return responses.filter(
      (r) =>
        r.destinatario?.nombre?.toLowerCase().includes(term) ||
        r.destinatario?.email?.toLowerCase().includes(term) ||
        r.id?.toLowerCase().includes(term)
    )
  }, [responses, searchTerm])

  const exportCsv = () => {
    if (filteredResponses.length === 0) {
      toast.warning("No hay respuestas para exportar")
      return
    }

    const headers = ["ID Respuesta", "Destinatario", "Email", "Fecha", "Respuestas"]
    const rows = filteredResponses.map((r) => [
      r.id,
      r.destinatario?.nombre || "Anónimo",
      r.destinatario?.email || "N/A",
      new Date(r.creado_en || r.fecha || Date.now()).toLocaleString(),
      JSON.stringify(r.detalles || r.respuestas || {}).replace(/"/g, '""'),
    ])

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute(
      "download",
      `respuestas_campana_${selectedCampaign?.nombre || selectedCampaignId}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("CSV exportado exitosamente")
  }

  return {
    campaigns,
    selectedCampaignId,
    setSelectedCampaignId,
    selectedCampaign,
    responses,
    filteredResponses,
    loading,
    responsesLoading,
    searchTerm,
    setSearchTerm,
    loadResponses,
    exportCsv,
  }
}
