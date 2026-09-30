import React, { useState, useRef } from 'react';
import { X, UploadCloud, File, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { filesApi } from '../services/filesApi';
import { CompanyFileItem } from '../types';

export interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploaded: (file: CompanyFileItem) => void;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({ isOpen, onClose, onUploaded }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [categoria, setCategoria] = useState<string>('documento');
  const [contexto, setContexto] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Por favor, selecciona un archivo');
      return;
    }

    try {
      setUploading(true);
      const newFile = await filesApi.uploadFile({
        file: selectedFile,
        categoria,
        contexto: contexto.trim() || undefined,
      });

      toast.success(`Archivo "${selectedFile.name}" subido exitosamente`);
      onUploaded(newFile);
      onClose();
      // Reset form
      setSelectedFile(null);
      setContexto('');
    } catch (err: any) {
      toast.error(err.message || 'Error al subir el archivo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/80">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <UploadCloud className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-900">Subir Archivo de Empresa</h3>
              <p className="text-xs text-gray-500">
                Almacena documentos, audios de encuestas o avatares de identidad
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={uploading}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* File input / Drag zone */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Seleccionar Archivo <span className="text-red-500">*</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                selectedFile
                  ? 'border-indigo-400 bg-indigo-50/40'
                  : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              {selectedFile ? (
                <>
                  <div className="p-3 bg-indigo-100 text-indigo-700 rounded-full">
                    <File className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'Tipo desconocido'}
                    </p>
                  </div>
                  <span className="text-2xs text-indigo-600 underline font-medium mt-1">
                    Cambiar archivo
                  </span>
                </>
              ) : (
                <>
                  <div className="p-3 bg-gray-100 text-gray-500 rounded-full">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Haz clic para buscar o arrastra tu archivo aquí
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Soporta MP3, WAV, PDF, PNG, JPG hasta 50MB
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="documento">Documento (PDF, DOCX, Hojas de cálculo)</option>
              <option value="audio_respuesta">Audio de Respuesta (Voz / Grabaciones)</option>
              <option value="avatar">Avatar o Logo (Imágenes corporativas)</option>
            </select>
          </div>

          {/* Contexto */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
              Contexto o Campaña (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej: Campaña: Satisfacción Q3, Soporte Técnico, etc."
              value={contexto}
              onChange={(e) => setContexto(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition cursor-pointer disabled:opacity-50 shadow-xs"
            >
              {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
              {uploading ? 'Subiendo...' : 'Subir Archivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileUploadModal;
