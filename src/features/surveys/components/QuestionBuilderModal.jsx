import React, { useState, useEffect } from "react"
import { Plus, Trash2, Edit2, ListOrdered, CheckCircle2 } from "lucide-react"
import { Modal, Input, Button, Badge } from "../../../shared/components/ui"
import { surveysApi } from "../services/surveysApi"
import { QUESTION_TYPES } from "../hooks/useSurveys"
import { toast } from "sonner"

export const QuestionBuilderModal = ({
  isOpen,
  onClose,
  template,
}) => {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [options, setOptions] = useState([])
  const [newOptionText, setNewOptionText] = useState("")

  const [formData, setFormData] = useState({
    texto: "",
    tipo_pregunta_id: "1",
    obligatoria: true,
    orden: 1,
  })

  const loadQuestions = async () => {
    if (!template?.id) return
    try {
      setLoading(true)
      const data = await surveysApi.getQuestions(template.id)
      const list = Array.isArray(data) ? data : []
      // Cargar opciones para las de selección
      const withOptions = await Promise.all(
        list.map(async (q) => {
          if (q.tipo_pregunta_id === 3 || q.tipo_pregunta_id === 4) {
            try {
              const opts = await surveysApi.getOptions(template.id, q.id)
              return { ...q, opciones: Array.isArray(opts) ? opts : [] }
            } catch {
              return { ...q, opciones: [] }
            }
          }
          return q
        })
      )
      setQuestions(withOptions)
    } catch (err) {
      toast.error(err.message || "Error al cargar preguntas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && template) {
      loadQuestions()
      setShowQuestionForm(false)
      setEditingQuestion(null)
    }
  }, [isOpen, template])

  const handleOpenAddQuestion = () => {
    setEditingQuestion(null)
    setFormData({
      texto: "",
      tipo_pregunta_id: "1",
      obligatoria: true,
      orden: questions.length + 1,
    })
    setOptions([])
    setShowQuestionForm(true)
  }

  const handleAddOption = () => {
    if (!newOptionText.trim()) return
    setOptions([...options, { texto: newOptionText.trim() }])
    setNewOptionText("")
  }

  const handleRemoveOption = (index) => {
    setOptions(options.filter((_, i) => i !== index))
  }

  const handleSaveQuestion = async (e) => {
    e.preventDefault()
    if (!formData.texto.trim()) return

    const tipoId = Number(formData.tipo_pregunta_id)
    const isChoice = tipoId === 3 || tipoId === 4

    if (isChoice && options.length === 0) {
      toast.error("Las preguntas de selección requieren al menos una opción")
      return
    }

    try {
      const payload = {
        texto: formData.texto.trim(),
        tipo_pregunta_id: tipoId,
        obligatoria: formData.obligatoria,
        orden: Number(formData.orden),
      }

      if (editingQuestion) {
        await surveysApi.updateQuestion(template.id, editingQuestion.id, payload)
        toast.success("Pregunta actualizada")
      } else {
        const created = await surveysApi.createQuestion(template.id, payload)
        // Crear opciones si corresponde
        if (isChoice && created?.id) {
          for (let i = 0; i < options.length; i++) {
            await surveysApi.createOption(template.id, created.id, {
              texto: options[i].texto,
              orden: i + 1,
            })
          }
        }
        toast.success("Pregunta agregada")
      }
      setShowQuestionForm(false)
      await loadQuestions()
    } catch (err) {
      toast.error(err.message || "Error al guardar pregunta")
    }
  }

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm("¿Eliminar esta pregunta?")) {
      try {
        await surveysApi.deleteQuestion(template.id, questionId)
        toast.success("Pregunta eliminada")
        await loadQuestions()
      } catch (err) {
        toast.error(err.message || "Error al eliminar pregunta")
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Constructor de Preguntas: ${template?.nombre || ""}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {!showQuestionForm ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">
                {questions.length} {questions.length === 1 ? "pregunta configurada" : "preguntas configuradas"}
              </span>
              <Button onClick={handleOpenAddQuestion} size="sm" className="gap-1.5">
                <Plus className="w-4 h-4" />
                Agregar Pregunta
              </Button>
            </div>

            {loading ? (
              <div className="py-8 text-center text-sm text-gray-500">Cargando preguntas...</div>
            ) : questions.length === 0 ? (
              <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-xl p-4">
                <ListOrdered className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Esta plantilla aún no tiene preguntas</p>
                <p className="text-xs text-gray-400 mt-1">Hacé clic en 'Agregar Pregunta' para comenzar.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-400">#{idx + 1}</span>
                        <Badge variant="default" className="text-[10px]">
                          {QUESTION_TYPES.find((t) => t.id === q.tipo_pregunta_id)?.nombre || "Pregunta"}
                        </Badge>
                        {q.obligatoria && (
                          <span className="text-xs text-red-500 font-bold">* Obligatoria</span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900">{q.texto}</p>
                      {q.opciones && q.opciones.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {q.opciones.map((opt) => (
                            <span
                              key={opt.id || opt.texto}
                              className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-600"
                            >
                              • {opt.texto}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteQuestion(q.id)}
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <form onSubmit={handleSaveQuestion} className="space-y-4">
            <h4 className="font-bold text-sm text-gray-900 border-b pb-2">Nueva Pregunta</h4>

            <Input
              label="Texto de la Pregunta"
              placeholder="Ej: ¿Qué tan satisfecho estás con nuestro servicio?"
              value={formData.texto}
              onChange={(e) => setFormData({ ...formData, texto: e.target.value })}
              required
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Tipo de Respuesta</label>
              <select
                value={formData.tipo_pregunta_id}
                onChange={(e) => setFormData({ ...formData, tipo_pregunta_id: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
              >
                {QUESTION_TYPES.map((t) => (
                  <option key={t.id} value={t.id.toString()}>
                    {t.nombre}
                  </option>
                ))}
              </select>
            </div>

            {(formData.tipo_pregunta_id === "3" || formData.tipo_pregunta_id === "4") && (
              <div className="space-y-2 bg-blue-50/50 border border-blue-100 p-3.5 rounded-xl">
                <label className="block text-xs font-bold text-blue-900 uppercase">
                  Opciones de Respuesta
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Escribí una opción y presioná Agregar..."
                    value={newOptionText}
                    onChange={(e) => setNewOptionText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddOption()
                      }
                    }}
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white"
                  />
                  <Button type="button" size="sm" onClick={handleAddOption}>
                    Agregar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {options.map((opt, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-xs bg-white border border-blue-200 px-2.5 py-1 rounded-full text-blue-800 font-medium"
                    >
                      {opt.texto}
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(i)}
                        className="text-red-500 hover:text-red-700 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="q-obligatoria"
                checked={formData.obligatoria}
                onChange={(e) => setFormData({ ...formData, obligatoria: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <label htmlFor="q-obligatoria" className="text-sm text-gray-700">
                Respuesta Obligatoria
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setShowQuestionForm(false)}>
                Atrás
              </Button>
              <Button type="submit">Guardar Pregunta</Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  )
}
