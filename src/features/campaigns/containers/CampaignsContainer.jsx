import React, { useState } from "react"
import { Plus, Search, Filter, Megaphone } from "lucide-react"
import { AppLayout } from "../../../shared/layouts/AppLayout"
import { Button } from "../../../shared/components/ui"
import { useCampaigns, CAMPAIGN_STATUSES } from "../hooks/useCampaigns"
import { CampaignCard } from "../components/CampaignCard"
import { CampaignFormModal } from "../components/CampaignFormModal"

export const CampaignsContainer = ({ role = "suscriptor" }) => {
  const {
    filteredCampaigns,
    plantillas,
    loading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    createCampaign,
    updateCampaign,
    deleteCampaign,
  } = useCampaigns()

  const [formModalOpen, setFormModalOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOpenCreate = () => {
    setEditingCampaign(null)
    setFormModalOpen(true)
  }

  const handleOpenEdit = (campaign) => {
    setEditingCampaign(campaign)
    setFormModalOpen(true)
  }

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true)
    try {
      if (editingCampaign) {
        await updateCampaign(editingCampaign.id, formData)
      } else {
        await createCampaign(formData)
      }
      setFormModalOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que querés eliminar esta campaña?")) {
      await deleteCampaign(id)
    }
  }

  return (
    <AppLayout role={role}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campañas</h1>
            <p className="text-sm text-gray-500 mt-1">
              Planificá, gestioná y programá los envíos de encuestas
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Nueva Campaña
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar campañas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs w-full sm:w-auto"
            >
              <option value="all">Todos los estados</option>
              {CAMPAIGN_STATUSES.map((s) => (
                <option key={s.id} value={s.id.toString()}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Campaign Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-48 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm">Cargando campañas...</span>
            </div>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 p-6">
            <Megaphone className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-base font-semibold text-gray-900">No se encontraron campañas</h3>
            <p className="text-sm text-gray-500 mt-1">
              Comenzá creando tu primera campaña para distribuir encuestas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((camp) => (
              <CampaignCard
                key={camp.id}
                campaign={camp}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Modal */}
        <CampaignFormModal
          isOpen={formModalOpen}
          onClose={() => setFormModalOpen(false)}
          onSubmit={handleFormSubmit}
          plantillas={plantillas}
          initialData={editingCampaign}
          isSubmitting={isSubmitting}
        />
      </div>
    </AppLayout>
  )
}
