import React, { useState, useEffect, useCallback } from 'react';
import {
  FolderOpen,
  Search,
  Filter,
  HardDrive,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { filesApi } from './services/filesApi';
import { CompanyFileItem, CompanyFilesResponse } from './types';
import FilesTable from './components/FilesTable';
import FilePreviewModal from './components/FilePreviewModal';

export interface CompanyFilesDashboardProps {
  empresaId?: string | number;
}

export const CompanyFilesDashboard: React.FC<CompanyFilesDashboardProps> = ({ empresaId }) => {
  const [data, setData] = useState<CompanyFilesResponse>({
    total: 0,
    limit: 10,
    offset: 0,
    espacio_total_usado_mb: 0,
    archivos: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [previewFile, setPreviewFile] = useState<CompanyFileItem | null>(null);

  const limit = 10;
  const [offset, setOffset] = useState(0);

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await filesApi.getFiles({
        limit,
        offset,
        categoria: selectedCategory,
        busqueda: searchTerm,
        empresaId,
      });
      setData(res);
    } catch {
      toast.error('Error al cargar archivos de la empresa');
    } finally {
      setLoading(false);
    }
  }, [offset, selectedCategory, searchTerm, empresaId]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Manejo de búsqueda reactiva reseteando a primera página
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setOffset(0);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setOffset(0);
  };

  const handleDownload = (file: CompanyFileItem) => {
    const link = document.createElement('a');
    link.href = file.url_descarga || file.opcion_ver_descargar?.url;
    link.download = file.archivo;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Descargando "${file.archivo}"`);
  };

  const totalPages = Math.ceil(data.total / limit) || 1;
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <div className="space-y-6">
      {/* Top Banner & Total Space Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-xs">
            <FolderOpen className="w-7 h-7" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Gestión de Archivos de la Empresa</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Auditoría de audios de respuestas, documentos de encuestas y avatares corporativos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Badge de Espacio Total Usado */}
          <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
            <HardDrive className="w-4 h-4 text-indigo-600" />
            <div>
              <span className="text-2xs text-gray-400 uppercase font-semibold block">Espacio Consumido</span>
              <span className="text-sm font-bold text-gray-900">
                {data.espacio_total_usado_mb} MB
              </span>
            </div>
          </div>

          {/* Badge Auditoría Solo Lectura */}
          <div className="flex items-center gap-2 px-3.5 py-2 bg-indigo-50/70 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Auditoría (Solo Lectura)</span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda Reactiva */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Buscador */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, extensión o contexto..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Categoría Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="text-sm py-2 px-3 rounded-lg border border-gray-200 bg-white font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer w-full sm:w-auto"
          >
            <option value="todos">Todas las Categorías</option>
            <option value="audio_respuesta">Audios de Respuestas</option>
            <option value="avatar">Avatares / Logos</option>
            <option value="documento">Documentos</option>
          </select>

          <button
            onClick={() => fetchFiles()}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg border border-gray-200 transition cursor-pointer disabled:opacity-50"
            title="Recargar archivos"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabla de Archivos */}
      <FilesTable
        files={data.archivos}
        loading={loading}
        onView={(file) => setPreviewFile(file)}
        onDownload={handleDownload}
      />

      {/* Paginación Estándar */}
      {!loading && data.total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 text-xs text-gray-500">
          <div>
            Mostrando{' '}
            <span className="font-semibold text-gray-800">{offset + 1}</span> a{' '}
            <span className="font-semibold text-gray-800">
              {Math.min(offset + limit, data.total)}
            </span>{' '}
            de <span className="font-semibold text-gray-800">{data.total}</span> archivos
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOffset((prev) => Math.max(0, prev - limit))}
              disabled={offset === 0}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>

            <span className="px-3 py-1.5 bg-gray-100 text-gray-800 font-semibold rounded-lg">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setOffset((prev) => prev + limit)}
              disabled={offset + limit >= data.total}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium cursor-pointer"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal de Vista Previa (Audio, Imagen, PDF) */}
      <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
    </div>
  );
};

export default CompanyFilesDashboard;
