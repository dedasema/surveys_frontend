import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { filesApi } from '../features/company-files/services/filesApi';
import { FilesTable } from '../features/company-files/components/FilesTable';
import { CompanyFileItem } from '../features/company-files/types';
import { apiClient } from '../features/auth/apiClient';

describe('Gestión de Archivos de la Empresa — Unit Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Simular que el endpoint externo no está disponible para probar la resiliencia en memoria
    vi.spyOn(apiClient, 'get').mockRejectedValue(new Error('Network error'));
    vi.spyOn(apiClient, 'post').mockRejectedValue(new Error('Network error'));
    vi.spyOn(apiClient, 'delete').mockRejectedValue(new Error('Network error'));
  });

  describe('filesApi service', () => {
    it('retrieves files with pagination and calculates total used space', async () => {
      const result = await filesApi.getFiles({ limit: 10, offset: 0 });
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('espacio_total_usado_mb');
      expect(Array.isArray(result.archivos)).toBe(true);
      expect(result.archivos.length).toBeGreaterThan(0);
      expect(result.espacio_total_usado_mb).toBeGreaterThan(0);
    });

    it('filters files by categoria correctly', async () => {
      const audioFiles = await filesApi.getFiles({ categoria: 'audio_respuesta' });
      expect(audioFiles.archivos.every((f) => f.categoria === 'audio_respuesta')).toBe(true);

      const avatarFiles = await filesApi.getFiles({ categoria: 'avatar' });
      expect(avatarFiles.archivos.every((f) => f.categoria === 'avatar')).toBe(true);
    });

    it('filters files by search query', async () => {
      const result = await filesApi.getFiles({ busqueda: 'audio_respuesta_01' });
      expect(result.archivos.some((f) => f.archivo.includes('audio_respuesta_01'))).toBe(true);
    });

    it('passes empresa_id in query when empresaId parameter is provided', async () => {
      const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total: 0, limit: 10, offset: 0, espacio_total_usado_mb: 0, archivos: [] }),
      } as any);

      await filesApi.getFiles({ empresaId: 42 });
      expect(getSpy).toHaveBeenCalledWith(expect.stringContaining('empresa_id=42'));
    });

    it('uploads a new file and returns created item', async () => {
      const dummyBlob = new Blob(['sample content'], { type: 'text/plain' });
      const dummyFile = new File([dummyBlob], 'test_manual.txt', { type: 'text/plain' });

      const uploaded = await filesApi.uploadFile({
        file: dummyFile,
        categoria: 'documento',
        contexto: 'Auditoría Q3',
      });

      expect(uploaded.archivo).toBe('test_manual.txt');
      expect(uploaded.categoria).toBe('documento');
      expect(uploaded.contexto).toBe('Auditoría Q3');

      // Verify it exists in subsequent getFiles
      const list = await filesApi.getFiles({ busqueda: 'test_manual.txt' });
      expect(list.archivos.some((f) => f.archivo === 'test_manual.txt')).toBe(true);
    });

    it('deletes an existing file by id', async () => {
      const dummyBlob = new Blob(['delete me'], { type: 'text/plain' });
      const dummyFile = new File([dummyBlob], 'to_delete.txt', { type: 'text/plain' });

      const created = await filesApi.uploadFile({
        file: dummyFile,
        categoria: 'documento',
      });

      const deleteRes = await filesApi.deleteFile(created.id);
      expect(deleteRes.success).toBe(true);

      const listAfter = await filesApi.getFiles({ busqueda: 'to_delete.txt' });
      expect(listAfter.archivos.some((f) => f.id === created.id)).toBe(false);
    });
  });

  describe('FilesTable component', () => {
    const mockFiles: CompanyFileItem[] = [
      {
        id: 'f-1',
        archivo: 'encuesta_audio.mp3',
        extension: '.mp3',
        peso: 3.5,
        unidad: 'MB',
        peso_bytes: 3670016,
        url_descarga: '/uploads/audio.mp3',
        opcion_ver_descargar: { ver: true, descargar: true, url: '/uploads/audio.mp3' },
        mime_type: 'audio/mpeg',
        categoria: 'audio_respuesta',
        contexto: 'Campaña: Satisfacción',
        fecha_subida: '2026-09-30T10:00:00Z',
        creado_por: 'Encuestador',
      },
    ];

    it('renders file row information and triggers actions', () => {
      const handleView = vi.fn();
      const handleDownload = vi.fn();
      const handleDelete = vi.fn();

      render(
        <FilesTable
          files={mockFiles}
          loading={false}
          onView={handleView}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      );

      expect(screen.getByText('encuesta_audio.mp3')).toBeTruthy();
      expect(screen.getByText('.mp3')).toBeTruthy();
      expect(screen.getByText('3.5')).toBeTruthy();
      expect(screen.getByText('Audio Respuesta')).toBeTruthy();

      const viewBtn = screen.getByRole('button', { name: /ver archivo/i });
      fireEvent.click(viewBtn);
      expect(handleView).toHaveBeenCalledWith(mockFiles[0]);

      const downloadBtn = screen.getByRole('button', { name: /descargar archivo/i });
      fireEvent.click(downloadBtn);
      expect(handleDownload).toHaveBeenCalledWith(mockFiles[0]);

      const deleteBtn = screen.getByRole('button', { name: /eliminar archivo/i });
      fireEvent.click(deleteBtn);
      expect(handleDelete).toHaveBeenCalledWith(mockFiles[0]);
    });
  });
});
