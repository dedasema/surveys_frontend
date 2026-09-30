import { apiClient } from '../../auth/apiClient';
import { CompanyFilesResponse, GetFilesParams, UploadFilePayload, CompanyFileItem } from '../types';

const MOCK_FILES: CompanyFileItem[] = [
  {
    id: 'f-101',
    archivo: 'audio_respuesta_01.mp3',
    extension: '.mp3',
    peso: 2.4,
    unidad: 'MB',
    peso_bytes: 2516582,
    url_descarga: '/uploads/audio/audio_respuesta_01.mp3',
    opcion_ver_descargar: {
      ver: true,
      descargar: true,
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
    mime_type: 'audio/mpeg',
    categoria: 'audio_respuesta',
    contexto: 'Campaña: Satisfacción Q3',
    fecha_subida: '2026-09-30T10:15:00Z',
    creado_por: 'Respondente de Encuesta',
  },
  {
    id: 'f-102',
    archivo: 'logo_corporativo.png',
    extension: '.png',
    peso: 0.85,
    unidad: 'MB',
    peso_bytes: 891289,
    url_descarga: '/uploads/avatar/logo_corporativo.png',
    opcion_ver_descargar: {
      ver: true,
      descargar: true,
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop',
    },
    mime_type: 'image/png',
    categoria: 'avatar',
    contexto: 'Perfil de Empresa',
    fecha_subida: '2026-09-29T14:20:00Z',
    creado_por: 'Administrador Suscriptor',
  },
  {
    id: 'f-103',
    archivo: 'contrato_servicio_2026.pdf',
    extension: '.pdf',
    peso: 4.1,
    unidad: 'MB',
    peso_bytes: 4299161,
    url_descarga: '/uploads/documentos/contrato_servicio_2026.pdf',
    opcion_ver_descargar: {
      ver: true,
      descargar: true,
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    mime_type: 'application/pdf',
    categoria: 'documento',
    contexto: 'Legal / Membresía',
    fecha_subida: '2026-09-28T09:05:00Z',
    creado_por: 'Membresías',
  },
  {
    id: 'f-104',
    archivo: 'audio_encuesta_soporte.wav',
    extension: '.wav',
    peso: 7.15,
    unidad: 'MB',
    peso_bytes: 7497318,
    url_descarga: '/uploads/audio/audio_encuesta_soporte.wav',
    opcion_ver_descargar: {
      ver: true,
      descargar: true,
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    },
    mime_type: 'audio/wav',
    categoria: 'audio_respuesta',
    contexto: 'Campaña: Feedback Post-Venta',
    fecha_subida: '2026-09-27T18:40:00Z',
    creado_por: 'Operador de Voz',
  },
];

let inMemoryFiles: CompanyFileItem[] = [...MOCK_FILES];

export const filesApi = {
  async getFiles(params: GetFilesParams = {}): Promise<CompanyFilesResponse> {
    const { limit = 20, offset = 0, categoria, busqueda } = params;
    const query = new URLSearchParams();
    query.set('limit', String(limit));
    query.set('offset', String(offset));
    if (categoria && categoria !== 'todos') query.set('categoria', categoria);
    if (busqueda && busqueda.trim()) query.set('busqueda', busqueda.trim());

    try {
      let res = await apiClient.get(`/archivos?${query.toString()}`);
      if (!res.ok && res.status === 404) {
        res = await apiClient.get(`/empresa/archivos?${query.toString()}`);
      }

      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback local memory
    }

    // Filtros locales para fallback resiliente
    let filtered = [...inMemoryFiles];
    if (categoria && categoria !== 'todos') {
      filtered = filtered.filter((f) => f.categoria === categoria);
    }
    if (busqueda && busqueda.trim()) {
      const q = busqueda.trim().toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.archivo.toLowerCase().includes(q) ||
          f.extension.toLowerCase().includes(q) ||
          (f.contexto && f.contexto.toLowerCase().includes(q))
      );
    }

    const paginated = filtered.slice(offset, offset + limit);
    const totalBytes = inMemoryFiles.reduce((acc, f) => acc + f.peso_bytes, 0);
    const totalMb = parseFloat((totalBytes / (1024 * 1024)).toFixed(2));

    return {
      total: filtered.length,
      limit,
      offset,
      espacio_total_usado_mb: totalMb,
      archivos: paginated,
    };
  },

  async uploadFile(payload: UploadFilePayload): Promise<CompanyFileItem> {
    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('categoria', payload.categoria);
    if (payload.contexto) {
      formData.append('contexto', payload.contexto);
    }

    try {
      let res = await apiClient.post('/archivos/upload', formData);
      if (!res.ok && res.status === 404) {
        res = await apiClient.post('/empresa/archivos/upload', formData);
      }

      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    // Crear archivo simulado en memoria
    const sizeMb = parseFloat((payload.file.size / (1024 * 1024)).toFixed(2));
    const ext = `.${payload.file.name.split('.').pop() || 'bin'}`;
    const newFile: CompanyFileItem = {
      id: `local-${Date.now()}`,
      archivo: payload.file.name,
      extension: ext,
      peso: sizeMb > 0 ? sizeMb : 0.05,
      unidad: 'MB',
      peso_bytes: payload.file.size,
      url_descarga: URL.createObjectURL(payload.file),
      opcion_ver_descargar: {
        ver: true,
        descargar: true,
        url: URL.createObjectURL(payload.file),
      },
      mime_type: payload.file.type || 'application/octet-stream',
      categoria: payload.categoria,
      contexto: payload.contexto || 'Archivo subido por usuario',
      fecha_subida: new Date().toISOString(),
      creado_por: 'Usuario Actual',
    };

    inMemoryFiles = [newFile, ...inMemoryFiles];
    return newFile;
  },

  async deleteFile(id: string | number): Promise<{ success: boolean }> {
    try {
      let res = await apiClient.delete(`/archivos/${id}`);
      if (!res.ok && res.status === 404) {
        res = await apiClient.delete(`/empresa/archivos/${id}`);
      }

      if (res.ok) {
        inMemoryFiles = inMemoryFiles.filter((f) => String(f.id) !== String(id));
        return { success: true };
      }
    } catch {
      // Fallback
    }

    inMemoryFiles = inMemoryFiles.filter((f) => String(f.id) !== String(id));
    return { success: true };
  },
};
