import React from 'react';
import { X, Download, FileText, Music, Image as ImageIcon, ExternalLink, Calendar, HardDrive, Tag } from 'lucide-react';
import { CompanyFileItem } from '../types';

export interface FilePreviewModalProps {
  file: CompanyFileItem | null;
  onClose: () => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ file, onClose }) => {
  if (!file) return null;

  const isAudio =
    file.mime_type?.startsWith('audio') ||
    ['.mp3', '.wav', '.ogg', '.m4a'].includes(file.extension?.toLowerCase());

  const isImage =
    file.mime_type?.startsWith('image') ||
    ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'].includes(file.extension?.toLowerCase());

  const isPdf =
    file.mime_type?.includes('pdf') || file.extension?.toLowerCase() === '.pdf';

  const previewUrl = file.opcion_ver_descargar?.url || file.url_descarga;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file.url_descarga || previewUrl;
    link.download = file.archivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/80">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              {isAudio ? (
                <Music className="w-5 h-5" />
              ) : isImage ? (
                <ImageIcon className="w-5 h-5" />
              ) : (
                <FileText className="w-5 h-5" />
              )}
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-900 truncate max-w-md">
                {file.archivo}
              </h3>
              <p className="text-xs text-gray-500">
                {file.peso} {file.unidad} • {file.mime_type}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-xl border border-gray-200 transition cursor-pointer"
              title="Descargar archivo"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-200 transition cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Preview Area */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-slate-50 min-h-[260px]">
          {isAudio ? (
            <div className="w-full max-w-md p-6 bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shadow-inner">
                <Music className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{file.archivo}</p>
                <p className="text-xs text-gray-500 mt-0.5">{file.contexto || 'Audio de respuesta'}</p>
              </div>
              <audio controls className="w-full mt-2" src={previewUrl}>
                Tu navegador no soporta el reproductor de audio.
              </audio>
            </div>
          ) : isImage ? (
            <div className="relative max-h-[400px] flex items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-xs">
              <img
                src={previewUrl}
                alt={file.archivo}
                className="max-h-[380px] max-w-full object-contain rounded-lg"
              />
            </div>
          ) : isPdf ? (
            <div className="w-full h-80 rounded-xl overflow-hidden border border-gray-200 bg-white">
              <iframe
                src={`${previewUrl}#toolbar=0`}
                title={file.archivo}
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="text-center p-8 bg-white rounded-2xl border border-gray-200 shadow-xs max-w-md">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-3" />
              <p className="font-semibold text-gray-800 text-sm">Vista previa no disponible</p>
              <p className="text-xs text-gray-500 mt-1 mb-4">
                El formato ({file.extension}) no cuenta con visor interactivo directo.
              </p>
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Abrir en nueva pestaña
              </a>
            </div>
          )}
        </div>

        {/* File Metadata Details */}
        <div className="p-4 bg-white border-t border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-gray-400" />
            <div>
              <span className="text-2xs text-gray-400 uppercase font-semibold block">Categoría</span>
              <span className="font-medium text-gray-800 capitalize">{file.categoria.replace('_', ' ')}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-gray-400" />
            <div>
              <span className="text-2xs text-gray-400 uppercase font-semibold block">Tamaño</span>
              <span className="font-medium text-gray-800">{file.peso} {file.unidad}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <span className="text-2xs text-gray-400 uppercase font-semibold block">Fecha</span>
              <span className="font-medium text-gray-800">
                {new Date(file.fecha_subida).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-2xs">
              U
            </div>
            <div>
              <span className="text-2xs text-gray-400 uppercase font-semibold block">Creado por</span>
              <span className="font-medium text-gray-800 truncate block max-w-[120px]">
                {file.creado_por || 'Sistema'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
