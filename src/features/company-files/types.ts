export interface FileOptionVerDescargar {
  ver: boolean;
  descargar: boolean;
  url: string;
}

export interface CompanyFileItem {
  id: string | number;
  archivo: string;
  extension: string;
  peso: number;
  unidad: string;
  peso_bytes: number;
  url_descarga: string;
  opcion_ver_descargar: FileOptionVerDescargar;
  mime_type: string;
  categoria: 'audio_respuesta' | 'avatar' | 'documento' | string;
  contexto?: string;
  fecha_subida: string;
  creado_por?: string;
}

export interface CompanyFilesResponse {
  total: number;
  limit: number;
  offset: number;
  espacio_total_usado_mb: number;
  archivos: CompanyFileItem[];
}

export interface GetFilesParams {
  limit?: number;
  offset?: number;
  categoria?: string;
  busqueda?: string;
}

export interface UploadFilePayload {
  file: File;
  categoria: string;
  contexto?: string;
}
