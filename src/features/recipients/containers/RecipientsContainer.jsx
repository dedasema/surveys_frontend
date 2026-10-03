import React, { useState } from "react"
import { toast } from "sonner"
import { Plus, Upload, Search } from "lucide-react"
import { AppLayout } from "../../../shared/layouts/AppLayout"
import { Button } from "../../../shared/components/ui"
import { useRecipients } from "../hooks/useRecipients"
import { RecipientTable } from "../components/RecipientTable"
import { RecipientFormModal } from "../components/RecipientFormModal"
import { ExcelUploadModal } from "../components/ExcelUploadModal"

export const RecipientsContainer = ({ role = "suscriptor" }) => {
  const {
    filteredRecipients,
    loading,
    searchTerm,
    setSearchTerm,
    createRecipient,
    updateRecipient,
    deleteRecipient,
    uploadExcel,
  } = useRecipients()

  const [formModalOpen, setFormModalOpen] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [editingRecipient, setEditingRecipient] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOpenCreate = () => {
    setEditingRecipient(null)
    setFormModalOpen(true)
  }

  const handleOpenEdit = (recipient) => {
    setEditingRecipient(recipient)
    setFormModalOpen(true)
  }

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true)
    try {
      if (editingRecipient) {
        await updateRecipient(editingRecipient.id, formData)
      } else {
        await createRecipient(formData)
      }
      setFormModalOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = (id) => {
    toast("¿Estás seguro de que querés eliminar este destinatario?", {
      action: {
        label: "Confirmar",
        onClick: async () => {
          await deleteRecipient(id)
        },
      },
      cancel: {
        label: "Cancelar",
      },
    })
  }

  return (
    <AppLayout role={role}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Destinatarios</h1>
            <p className="text-sm text-gray-500 mt-1">
              Gestioná tu base de contactos para el envío de encuestas
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              onClick={() => setUploadModalOpen(true)}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              Importar Excel
            </Button>
            <Button onClick={handleOpenCreate} className="gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Destinatario
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-2xs"
          />
        </div>

        {/* Table */}
        <RecipientTable
          recipients={filteredRecipients}
          loading={loading}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />

        {/* Modals */}
        <RecipientFormModal
          isOpen={formModalOpen}
          onClose={() => setFormModalOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={editingRecipient}
          isSubmitting={isSubmitting}
        />

        <ExcelUploadModal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onUpload={uploadExcel}
        />
      </div>
    </AppLayout>
  )
}
