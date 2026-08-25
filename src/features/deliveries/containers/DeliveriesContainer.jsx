import React, { useState } from "react"
import { Send, Printer, Mic, Plus, Download, Search, Filter } from "lucide-react"
import { AppLayout } from "../../../shared/layouts/AppLayout"
import { Button } from "../../../shared/components/ui"
import { useDeliveries } from "../hooks/useDeliveries"
import { DeliveryTable } from "../components/DeliveryTable"
import { BulkPaperModal } from "../components/BulkPaperModal"
import { BulkAudioModal } from "../components/BulkAudioModal"
import { IndividualDeliveryModal } from "../components/IndividualDeliveryModal"

export const DeliveriesContainer = ({ role = "suscriptor" }) => {
  const {
    campaigns,
    selectedCampaignId,
    setSelectedCampaignId,
    selectedCampaign,
    filteredDeliveries,
    recipients,
    loading,
    deliveriesLoading,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    createBulkPaper,
    createBulkAudio,
    createIndividualDelivery,
    downloadPdf,
  } = useDeliveries()

  const [bulkPaperOpen, setBulkPaperOpen] = useState(false)
  const [bulkAudioOpen, setBulkAudioOpen] = useState(false)
  const [individualOpen, setIndividualOpen] = useState(false)

  const isPaperCampaign = selectedCampaign?.canal_id === 4
  const isAudioCampaign = selectedCampaign?.canal_id === 5

  return (
    <AppLayout role={role}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Entregas y Despachos</h1>
            <p className="text-sm text-gray-500 mt-1">
              Monitoreá el estado de los envíos, generá formularios de papel y gestioná sesiones de voz
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {isPaperCampaign && (
              <>
                <Button variant="outline" onClick={downloadPdf} className="gap-2">
                  <Download className="w-4 h-4" />
                  Descargar PDF Lote
                </Button>
                <Button onClick={() => setBulkPaperOpen(true)} className="gap-2">
                  <Printer className="w-4 h-4" />
                  Generar Formularios
                </Button>
              </>
            )}

            {isAudioCampaign && (
              <Button onClick={() => setBulkAudioOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                <Mic className="w-4 h-4" />
                Generar Sesiones de Voz
              </Button>
            )}

            {!isPaperCampaign && !isAudioCampaign && (
              <Button onClick={() => setIndividualOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Nueva Entrega
              </Button>
            )}
          </div>
        </div>

        {/* Campaign Selector Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-1/3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Campaña Activa
            </label>
            <select
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} ({c.canal?.nombre || "Canal"})
                </option>
              ))}
            </select>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-2/3 justify-end items-center">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por destinatario o token..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
              >
                <option value="all">Todos los estados</option>
                <option value="1">Pendientes</option>
                <option value="2">Enviados</option>
                <option value="3">Respondidos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Deliveries Table */}
        <DeliveryTable
          deliveries={filteredDeliveries}
          loading={deliveriesLoading || loading}
          canalId={selectedCampaign?.canal_id}
        />

        {/* Modals */}
        <BulkPaperModal
          isOpen={bulkPaperOpen}
          onClose={() => setBulkPaperOpen(false)}
          onSubmit={createBulkPaper}
        />

        <BulkAudioModal
          isOpen={bulkAudioOpen}
          onClose={() => setBulkAudioOpen(false)}
          onSubmit={createBulkAudio}
        />

        <IndividualDeliveryModal
          isOpen={individualOpen}
          onClose={() => setIndividualOpen(false)}
          onSubmit={createIndividualDelivery}
          recipients={recipients}
        />
      </div>
    </AppLayout>
  )
}
