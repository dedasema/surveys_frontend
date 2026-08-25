import React, { useState } from "react"
import { Plus, Search, FileSpreadsheet } from "lucide-react"
import { AppLayout } from "../../../shared/layouts/AppLayout"
import { Button } from "../../../shared/components/ui"
import { useSurveys } from "../hooks/useSurveys"
import { TemplateCard } from "../components/TemplateCard"
import { TemplateFormModal } from "../components/TemplateFormModal"
import { QuestionBuilderModal } from "../components/QuestionBuilderModal"

export const SurveysContainer = ({ role = "suscriptor" }) => {
  const {
    filteredTemplates,
    loading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  } = useSurveys()

  const [formModalOpen, setFormModalOpen] = useState(false)
  const [questionsModalOpen, setQuestionsModalOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [selectedTemplateForQuestions, setSelectedTemplateForQuestions] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOpenCreate = () => {
    setEditingTemplate(null)
    setFormModalOpen(true)
  }

  const handleOpenEdit = (template) => {
    setEditingTemplate(template)
    setFormModalOpen(true)
  }

  const handleOpenQuestions = (template) => {
    setSelectedTemplateForQuestions(template)
    setQuestionsModalOpen(true)
  }

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true)
    try {
      if (editingTemplate) {
        await updateTemplate(editingTemplate.id, formData)
      } else {
        await createTemplate(formData)
      }
      setFormModalOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que querés eliminar esta plantilla?")) {
      await deleteTemplate(id)
    }
  }

  return (
    <AppLayout role={role}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Plantillas de Encuesta</h1>
            <p className="text-sm text-gray-500 mt-1">
              Diseñá la estructura, preguntas y opciones para tus encuestas
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Nueva Plantilla
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs w-full sm:w-auto"
            >
              <option value="all">Todas las plantillas</option>
              <option value="active">Solo activas</option>
              <option value="inactive">Solo inactivas</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-48 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm">Cargando plantillas...</span>
            </div>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 p-6">
            <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-base font-semibold text-gray-900">No se encontraron plantillas</h3>
            <p className="text-sm text-gray-500 mt-1">
              Comenzá creando una plantilla con sus preguntas para iniciar campañas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onEdit={handleOpenEdit}
                onManageQuestions={handleOpenQuestions}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        <TemplateFormModal
          isOpen={formModalOpen}
          onClose={() => setFormModalOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={editingTemplate}
          isSubmitting={isSubmitting}
        />

        <QuestionBuilderModal
          isOpen={questionsModalOpen}
          onClose={() => setQuestionsModalOpen(false)}
          template={selectedTemplateForQuestions}
        />
      </div>
    </AppLayout>
  )
}
