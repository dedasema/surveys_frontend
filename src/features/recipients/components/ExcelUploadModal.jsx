import React, { useState } from "react"
import { UploadCloud, FileSpreadsheet, Download, CheckCircle2, AlertCircle } from "lucide-react"
import { Modal, Button } from "../../../shared/components/ui"

export const ExcelUploadModal = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadStats, setUploadStats] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadStats(null)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      setSelectedFile(file)
      setUploadStats(null)
    }
  }

  const handleUploadSubmit = async () => {
    if (!selectedFile) return
    setIsUploading(true)
    try {
      const stats = await onUpload(selectedFile)
      setUploadStats(stats)
    } catch (err) {
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setUploadStats(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Importar Destinatarios desde Excel">
      <div className="space-y-5">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-50/50"
              : "border-gray-300 hover:border-gray-400 bg-gray-50/50"
          }`}
        >
          <input
            type="file"
            id="excel-file-input"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="excel-file-input" className="cursor-pointer flex flex-col items-center">
            <UploadCloud className="w-12 h-12 text-blue-500 mb-3 animate-bounce" />
            <p className="text-sm font-semibold text-gray-800">
              {selectedFile ? selectedFile.name : "Hacé clic o arrastrá tu archivo Excel aquí"}
            </p>
            <p className="text-xs text-gray-500 mt-1">Formatos compatibles: .xlsx, .xls</p>
          </label>
        </div>

        {uploadStats && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-green-800 font-semibold text-sm">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>Importación completada</span>
            </div>
            <div className="text-xs text-green-700 space-y-1">
              <p>• Total procesados: {uploadStats.total || uploadStats.creados || 0}</p>
              {uploadStats.duplicados !== undefined && (
                <p>• Duplicados ignorados: {uploadStats.duplicados}</p>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <a
            href="/plantilla_destinatarios_ejemplo.xlsx"
            download
            className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            <Download className="w-4 h-4" />
            Descargar plantilla de ejemplo
          </a>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              {uploadStats ? "Cerrar" : "Cancelar"}
            </Button>
            {!uploadStats && (
              <Button
                onClick={handleUploadSubmit}
                disabled={!selectedFile}
                isLoading={isUploading}
              >
                Procesar Archivo
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}
