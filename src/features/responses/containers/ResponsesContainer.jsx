import React, { useState } from "react"
import { Download, Search, FileText } from "lucide-react"
import { AppLayout } from "../../../shared/layouts/AppLayout"
import { Button, Modal } from "../../../shared/components/ui"
import { useResponses } from "../hooks/useResponses"
import { ResponseTable } from "../components/ResponseTable"

export const ResponsesContainer = ({ role = "suscriptor" }) => {
  const {
    campaigns,
    selectedCampaignId,
    setSelectedCampaignId,
    selectedCampaign,
    filteredResponses,
    loading,
    responsesLoading,
    searchTerm,
    setSearchTerm,
    exportCsv,
  } = useResponses()

  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedResponse, setSelectedResponse] = useState(null)

  const handleViewDetails = (response) => {
    setSelectedResponse(response)
    setDetailModalOpen(true)
  }

  return (
    <AppLayout role={role}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Resultados y Respuestas</h1>
            <p className="text-sm text-gray-500 mt-1">
              Consultá las respuestas capturadas por campaña y exportá informes en CSV
            </p>
          </div>

          <Button variant="outline" onClick={exportCsv} className="gap-2">
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
        </div>

        {/* Campaign Selector & Search */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-1/3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Campaña
            </label>
            <select
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por participante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Response Table */}
        <ResponseTable
          responses={filteredResponses}
          loading={responsesLoading || loading}
          onViewDetails={handleViewDetails}
        />

        {/* Details Modal */}
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title="Detalle de Respuesta"
          maxWidth="max-w-xl"
        >
          {selectedResponse && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl space-y-1 border border-gray-100 text-xs text-gray-600">
                <p>
                  <strong>Participante:</strong>{" "}
                  {selectedResponse.destinatario?.nombre || "Anónimo"}
                </p>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {new Date(
                    selectedResponse.creado_en || selectedResponse.fecha || Date.now()
                  ).toLocaleString()}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-sm text-gray-900">Respuestas del Cuestionario:</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedResponse.detalles && Array.isArray(selectedResponse.detalles) ? (
                    selectedResponse.detalles.map((d, i) => (
                      <div key={i} className="p-3 bg-white border border-gray-200 rounded-lg text-sm">
                        <p className="font-semibold text-gray-800">{d.pregunta || `Pregunta ${i + 1}`}</p>
                        <p className="text-blue-700 font-medium mt-1">{d.valor || d.respuesta || "Sin respuesta"}</p>
                      </div>
                    ))
                  ) : (
                    <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto">
                      {JSON.stringify(selectedResponse.detalles || selectedResponse, null, 2)}
                    </pre>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button variant="outline" onClick={() => setDetailModalOpen(false)}>
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AppLayout>
  )
}
