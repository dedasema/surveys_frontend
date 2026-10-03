import React from 'react';
import { Eye, Download, Music, Image as ImageIcon, FileText, File, Calendar, HardDrive } from 'lucide-react';
import { CompanyFileItem } from '../types';

export interface FilesTableProps {
  files: CompanyFileItem[];
  loading: boolean;
  onView: (file: CompanyFileItem) => void;
  onDownload: (file: CompanyFileItem) => void;
}

export const FilesTable: React.FC<FilesTableProps> = ({
  files,
  loading,
  onView,
  onDownload,
}) => {
  const getFileIcon = (file: CompanyFileItem) => {
    const ext = file.extension?.toLowerCase() || '';
    const mime = file.mime_type?.toLowerCase() || '';

    if (mime.startsWith('audio') || ['.mp3', '.wav', '.ogg', '.m4a'].includes(ext)) {
      return (
        <span className="p-2 bg-purple-50 text-purple-600 rounded-xl inline-flex">
          <Music className="w-4 h-4" />
        </span>
      );
    }
    if (mime.startsWith('image') || ['.png', '.jpg', '.jpeg', '.svg', '.webp'].includes(ext)) {
      return (
        <span className="p-2 bg-blue-50 text-blue-600 rounded-xl inline-flex">
          <ImageIcon className="w-4 h-4" />
        </span>
      );
    }
    if (mime.includes('pdf') || ext === '.pdf') {
      return (
        <span className="p-2 bg-red-50 text-red-600 rounded-xl inline-flex">
          <FileText className="w-4 h-4" />
        </span>
      );
    }
    return (
      <span className="p-2 bg-gray-50 text-gray-600 rounded-xl inline-flex">
        <File className="w-4 h-4" />
      </span>
    );
  };

  const getCategoryBadge = (categoria: string) => {
    switch (categoria) {
      case 'audio_respuesta':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            Audio Respuesta
          </span>
        );
      case 'avatar':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Avatar / Logo
          </span>
        );
      case 'documento':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Documento
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-medium">Cargando archivos de la empresa...</p>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
        <HardDrive className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h4 className="text-base font-bold text-gray-800">No se encontraron archivos</h4>
        <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
          No hay elementos que coincidan con la búsqueda o la categoría seleccionada.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4">Archivo</th>
              <th className="py-3 px-3">Extensión</th>
              <th className="py-3 px-3">Peso</th>
              <th className="py-3 px-3">Categoría</th>
              <th className="py-3 px-4">Contexto</th>
              <th className="py-3 px-4">Fecha Subida</th>
              <th className="py-3 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {files.map((file) => (
              <tr key={file.id} className="hover:bg-gray-50/60 transition">
                {/* Archivo */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file)}
                    <div className="min-w-0">
                      <span className="font-semibold text-gray-900 block truncate max-w-[220px]">
                        {file.archivo}
                      </span>
                      {file.creado_por && (
                        <span className="text-2xs text-gray-400 block truncate">
                          Por: {file.creado_por}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Extensión */}
                <td className="py-3.5 px-3">
                  <span className="font-mono text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md font-semibold">
                    {file.extension}
                  </span>
                </td>

                {/* Peso / Unidad */}
                <td className="py-3.5 px-3 text-xs text-gray-700 whitespace-nowrap">
                  <span className="font-medium text-gray-900">{file.peso}</span> {file.unidad}
                </td>

                {/* Categoría */}
                <td className="py-3.5 px-3 whitespace-nowrap">
                  {getCategoryBadge(file.categoria)}
                </td>

                {/* Contexto */}
                <td className="py-3.5 px-4 text-xs text-gray-600 max-w-[200px]">
                  <span className="line-clamp-2">{file.contexto || '—'}</span>
                </td>

                {/* Fecha de subida */}
                <td className="py-3.5 px-4 text-xs text-gray-500 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{new Date(file.fecha_subida).toLocaleDateString()}</span>
                  </div>
                </td>

                {/* Acciones */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      onClick={() => onView(file)}
                      className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                      title="Ver / Reproducir archivo"
                      aria-label="Ver archivo"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDownload(file)}
                      className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                      title="Descargar archivo"
                      aria-label="Descargar archivo"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FilesTable;
