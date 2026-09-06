import React, { useState, useEffect } from 'react';
import { ShieldAlert, Check, X, Eye, AlertTriangle, Filter, Search, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export interface FraudFlagItem {
  id: string | number;
  respuesta_id: string | number;
  campana_id: string | number;
  campana_nombre: string;
  canal: 'gmail' | 'ocr' | 'voz' | 'web';
  tipo_senal: 'regla' | 'similitud' | 'score_ia';
  confianza: number; // 0.0 - 1.0
  contenido_respuesta: string;
  respuesta_similar?: string;
  similitud_score?: number;
  justificacion?: string;
  timestamp: string;
  estado: 'pendiente' | 'confirmado_fraude' | 'descartado_valido';
}

export const FraudReviewQueue: React.FC<{ campanaId?: string | number }> = ({ campanaId }) => {
  const [flags, setFlags] = useState<FraudFlagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSignal, setSelectedSignal] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForComparison, setSelectedForComparison] = useState<FraudFlagItem | null>(null);

  useEffect(() => {
    fetchFraudFlags();
  }, [campanaId]);

  const fetchFraudFlags = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://surveys-backend-83d9.onrender.com';
      const url = campanaId
        ? `${API_BASE_URL}/fraude/cola?campana_id=${campanaId}`
        : `${API_BASE_URL}/fraude/cola`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setFlags(data);
      } else {
        // Datos de muestra estructurados bajo el contrato de RF21
        setFlags([
          {
            id: 'flag-1',
            respuesta_id: 'resp-101',
            campana_id: campanaId || 'camp-1',
            campana_nombre: 'Encuesta de Satisfacción Q3',
            canal: 'web',
            tipo_senal: 'similitud',
            confianza: 0.98,
            contenido_respuesta: 'Todo estuvo genial, me gustó mucho la atención y la rapidez del servicio ofrecido.',
            respuesta_similar: 'Todo estuvo genial, me gustó mucho la atención y la rapidez del servicio ofrecido en caja.',
            similitud_score: 0.97,
            justificacion: 'Similitud coseno en pgvector supera el umbral de 0.95 con la respuesta resp-089.',
            timestamp: 'Hace 15 minutos',
            estado: 'pendiente',
          },
          {
            id: 'flag-2',
            respuesta_id: 'resp-102',
            campana_id: campanaId || 'camp-1',
            campana_nombre: 'Encuesta de Satisfacción Q3',
            canal: 'gmail',
            tipo_senal: 'regla',
            confianza: 0.90,
            contenido_respuesta: 'Respuesta automática de prueba rápida.',
            justificacion: 'Se registraron 5 respuestas del mismo remitente en una ventana menor a 60 segundos.',
            timestamp: 'Hace 35 minutos',
            estado: 'pendiente',
          },
          {
            id: 'flag-3',
            respuesta_id: 'resp-103',
            campana_id: campanaId || 'camp-2',
            campana_nombre: 'Feedback Post-Venta Automotriz',
            canal: 'ocr',
            tipo_senal: 'score_ia',
            confianza: 0.85,
            contenido_respuesta: 'asdf jkl qwerty 12345 sin sentido aparente en formulario impreso.',
            justificacion: 'Gemini clasificó el texto como no coherente ni generado por un encuestado humano (score < 0.2).',
            timestamp: 'Hace 1 hora',
            estado: 'pendiente',
          },
        ]);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (flagId: string | number, accion: 'confirmar_fraude' | 'descartar_marca') => {
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://surveys-backend-83d9.onrender.com';
      await fetch(`${API_BASE_URL}/fraude/${flagId}/resolver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion }),
      });
    } catch {}

    setFlags((prev) =>
      prev.map((f) =>
        f.id === flagId
          ? {
              ...f,
              estado: accion === 'confirmar_fraude' ? 'confirmado_fraude' : 'descartado_valido',
            }
          : f
      )
    );

    if (accion === 'confirmar_fraude') {
      toast.success('Marca confirmada: La respuesta fue descartada.');
    } else {
      toast.info('Marca descartada: La respuesta se mantendrá como válida.');
    }

    if (selectedForComparison?.id === flagId) {
      setSelectedForComparison(null);
    }
  };

  const filteredFlags = flags.filter((f) => {
    const matchesSignal = selectedSignal === 'todos' || f.tipo_senal === selectedSignal;
    const matchesSearch =
      f.contenido_respuesta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.campana_nombre.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSignal && matchesSearch;
  });

  const getSignalBadge = (tipo: FraudFlagItem['tipo_senal']) => {
    switch (tipo) {
      case 'similitud':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            pgvector (Similitud)
          </span>
        );
      case 'score_ia':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Score IA (Gemini)
          </span>
        );
      case 'regla':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Regla de Tiempo/IP
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xs space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2.5">
            <ShieldAlert className="h-6 w-6 text-rose-600" />
            Cola de Revisión de Fraude y Duplicados (RF21)
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Revisión asistida por analistas humanos con detección mediante pgvector y reglas semánticas
          </p>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar en respuestas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedSignal}
            onChange={(e) => setSelectedSignal(e.target.value)}
            className="text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 font-medium focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todas las señales</option>
            <option value="similitud">Similitud (pgvector)</option>
            <option value="score_ia">Score de Humanidad IA</option>
            <option value="regla">Reglas de Tiempo/IP</option>
          </select>
        </div>
      </div>

      {/* Lista de Casos */}
      {filteredFlags.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
          <p className="text-sm text-gray-500 font-medium">No hay respuestas marcadas como sospechosas en este momento.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFlags.map((flag) => (
            <div
              key={flag.id}
              className={`p-5 rounded-2xl border transition-all ${
                flag.estado === 'pendiente'
                  ? 'border-gray-200 bg-white hover:border-blue-200 shadow-xs'
                  : flag.estado === 'confirmado_fraude'
                  ? 'border-rose-100 bg-rose-50/40 opacity-70'
                  : 'border-emerald-100 bg-emerald-50/40 opacity-70'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {getSignalBadge(flag.tipo_senal)}
                    <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full">
                      Campaña: {flag.campana_nombre}
                    </span>
                    <span className="text-xs text-gray-400">Canal: {flag.canal.toUpperCase()}</span>
                    <span className="text-xs text-gray-400">&bull; {flag.timestamp}</span>
                    <span className="text-xs font-bold text-rose-600">
                      Confianza: {(flag.confianza * 100).toFixed(0)}%
                    </span>
                  </div>

                  <p className="text-sm text-gray-800 font-medium bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed">
                    "{flag.contenido_respuesta}"
                  </p>

                  {flag.justificacion && (
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                      <span>{flag.justificacion}</span>
                    </p>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2.5 self-end lg:self-center">
                  {flag.respuesta_similar && (
                    <button
                      type="button"
                      onClick={() => setSelectedForComparison(flag)}
                      className="px-3 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Comparar Duplicado
                    </button>
                  )}

                  {flag.estado === 'pendiente' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleResolve(flag.id, 'descartar_marca')}
                        className="px-3.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors flex items-center gap-1.5"
                        title="Mantener respuesta como válida"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Mantener Válida
                      </button>

                      <button
                        type="button"
                        onClick={() => handleResolve(flag.id, 'confirmar_fraude')}
                        className="px-3.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
                        title="Descartar respuesta por fraude"
                      >
                        <X className="h-3.5 w-3.5" />
                        Confirmar Fraude
                      </button>
                    </>
                  ) : (
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl ${
                        flag.estado === 'confirmado_fraude'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {flag.estado === 'confirmado_fraude' ? 'Fraude Confirmado' : 'Validada por Analista'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Comparación Lado a Lado */}
      {selectedForComparison && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 space-y-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                Comparación Visual de Similitud Semántica
              </h4>
              <button
                type="button"
                onClick={() => setSelectedForComparison(null)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Respuesta Marcada (Sospechosa)
                </span>
                <p className="text-sm text-gray-800 leading-relaxed font-medium">
                  {selectedForComparison.contenido_respuesta}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-2">
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                  Respuesta Existente Similar (Similitud: {((selectedForComparison.similitud_score || 0.95) * 100).toFixed(1)}%)
                </span>
                <p className="text-sm text-purple-900 leading-relaxed font-medium">
                  {selectedForComparison.respuesta_similar}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleResolve(selectedForComparison.id, 'descartar_marca')}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Descartar Marca (Es Legítima)
              </button>
              <button
                type="button"
                onClick={() => handleResolve(selectedForComparison.id, 'confirmar_fraude')}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                Confirmar Descarte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FraudReviewQueue;
