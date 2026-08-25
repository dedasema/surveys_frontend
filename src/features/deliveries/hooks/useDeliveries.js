import { useState, useEffect, useCallback, useMemo } from "react"
import { toast } from "sonner"
import { deliveriesApi } from "../services/deliveriesApi"

export function useDeliveries() {
  const [campaigns, setCampaigns] = useState([])
  const [selectedCampaignId, setSelectedCampaignId] = useState("")
  const [deliveries, setDeliveries] = useState([])
  const [recipients, setRecipients] = useState([])
  const [loading, setLoading] = useState(true)
  const [deliveriesLoading, setDeliveriesLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true)
      const [camps, recs] = await Promise.all([
        deliveriesApi.getCampanas(),
        deliveriesApi.getDestinatarios(),
      ])
      const campList = Array.isArray(camps) ? camps : []
      setCampaigns(campList)
      setRecipients(Array.isArray(recs) ? recs : [])
      if (campList.length > 0 && !selectedCampaignId) {
        setSelectedCampaignId(campList[0].id)
      }
    } catch (err) {
      console.error("Error loading deliveries initial data:", err)
      toast.error(err.message || "Error al cargar campañas")
    } finally {
      setLoading(false)
    }
  }, [selectedCampaignId])

  const loadDeliveries = useCallback(async (campaignId) => {
    if (!campaignId) {
      setDeliveries([])
      return
    }
    try {
      setDeliveriesLoading(true)
      const data = await deliveriesApi.getEntregasByCampana(campaignId)
      setDeliveries(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Error loading deliveries:", err)
      toast.error(err.message || "Error al cargar entregas")
    } finally {
      setDeliveriesLoading(false)
    }
  }, [])

  useEffect(() => {
    loadInitialData()
  }, [loadInitialData])

  useEffect(() => {
    if (selectedCampaignId) {
      loadDeliveries(selectedCampaignId)
    }
  }, [selectedCampaignId, loadDeliveries])

  const createBulkPaper = async (quantity) => {
    if (!selectedCampaignId) return
    try {
      await deliveriesApi.createBulkPaper(selectedCampaignId, quantity)
      toast.success(`Se generaron ${quantity} formularios de papel exitosamente`)
      await loadDeliveries(selectedCampaignId)
    } catch (err) {
      toast.error(err.message || "Error al generar formularios de papel")
      throw err
    }
  }

  const createBulkAudio = async (quantity) => {
    if (!selectedCampaignId) return
    try {
      await deliveriesApi.createBulkAudio(selectedCampaignId, quantity)
      toast.success(`Se generaron ${quantity} entregas por voz exitosamente`)
      await loadDeliveries(selectedCampaignId)
    } catch (err) {
      toast.error(err.message || "Error al generar entregas por voz")
      throw err
    }
  }

  const createIndividualDelivery = async (destinatarioId) => {
    if (!selectedCampaignId) return
    try {
      await deliveriesApi.createEntrega(selectedCampaignId, {
        destinatario_id: destinatarioId,
      })
      toast.success("Entrega creada exitosamente")
      await loadDeliveries(selectedCampaignId)
    } catch (err) {
      toast.error(err.message || "Error al crear entrega")
      throw err
    }
  }

  const downloadPdf = async () => {
    if (!selectedCampaignId) return
    try {
      const blob = await deliveriesApi.downloadPdf(selectedCampaignId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `formularios_campana_${selectedCampaignId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("PDF descargado correctamente")
    } catch (err) {
      toast.error(err.message || "Error al descargar PDF")
    }
  }

  const selectedCampaign = useMemo(() => {
    return campaigns.find((c) => c.id === selectedCampaignId) || null
  }, [campaigns, selectedCampaignId])

  const filteredDeliveries = useMemo(() => {
    let result = deliveries
    if (statusFilter !== "all") {
      result = result.filter((d) => d.estado_id?.toString() === statusFilter)
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (d) =>
          d.destinatario?.nombre?.toLowerCase().includes(term) ||
          d.destinatario?.email?.toLowerCase().includes(term) ||
          d.token?.toLowerCase().includes(term)
      )
    }
    return result
  }, [deliveries, statusFilter, searchTerm])

  return {
    campaigns,
    selectedCampaignId,
    setSelectedCampaignId,
    selectedCampaign,
    deliveries,
    filteredDeliveries,
    recipients,
    loading,
    deliveriesLoading,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    loadDeliveries,
    createBulkPaper,
    createBulkAudio,
    createIndividualDelivery,
    downloadPdf,
  }
}
