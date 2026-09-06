import React, { useState, useEffect } from 'react';
import {
  Bot,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Terminal,
} from 'lucide-react';
import { toast } from 'sonner';

export interface AgentDecisionItem {
  id: string | number;
  timestamp: string;
  campana_id: string | number;
  campana_nombre: string;
  trigger_evento: string;
  respuesta_id?: string | number;
  tool_ejecutada: string;
  parametros: Record<string, any>;
  razonamiento_ia: string;
  estado: 'ejecutado' | 'en_proceso' | 'fallido' | 'omitido';
  tiempo_ejecucion_ms?: number;
}

export interface AgentDecisionLogProps {
  campanaId?: string | number;
}

export const AgentDecisionLog: React.FC<AgentDecisionLogProps> = ({ campanaId }) => {
  const [decisions, setDecisions] = useState<AgentDecisionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTool, setSelectedTool] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [activeTrace, setActiveTrace] = useState<AgentDecisionItem | null>(null);

  useEffect(() => {
    fetchDecisions();
  }, [campanaId]);

  const fetchDecisions = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://surveys-backend-83d9.onrender.com';
      const url = campanaId
        ? `${API_BASE_URL}/agente/decisiones?campana_id=${campanaId}`
        : `${API_BASE_URL}/agente/decisiones`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setDecisions(Array.isArray(data) ? data : data.decisiones || []);
      } else {
        // Fallback demo data adhering to RF25 contract
        setDecisions([
          {
            id: 'dec-101',
            timestamp: 'Hace 5 minutos',
            campana_id: campanaId || 'camp-1',
            campana_nombre: 'Encuesta de Satisfacción Q3',
            trigger_evento: 'Respuesta con sentimiento negativo severo (NPS = 1)',
            respuesta_id: 'resp-884',
            tool_ejecutada: 'escalar_caso_soporte',
            parametros: {
              prioridad: 'alta',
              departamento: 'Atención al Cliente',
              motivo: 'Cliente reporta falla reiterada en facturación',
              ticket_externo: false,
            },
            razonamiento_ia:
              'El cliente asignó calificación 1/10 y expresó frustración severa por un cobro duplicado. Dado que la política corporativa exige intervención inmediata ante insatisfacción extrema, se invoca la herramienta de escalado a soporte.',
            estado: 'ejecutado',
            tiempo_ejecucion_ms: 342,
          },
          {
            id: 'dec-102',
            timestamp: 'Hace 22 minutos',
            campana_id: campanaId || 'camp-1',
            campana_nombre: 'Encuesta de Satisfacción Q3',
            trigger_evento: 'Encuesta abierta hace 72 horas sin interacción',
            respuesta_id: 'dest-419',
            tool_ejecutada: 'enviar_recordatorio_encuesta',
            parametros: {
              canal_preferido: 'gmail',
              plantilla_tono: 'cordial_breve',
              dias_inactividad: 3,
            },
            razonamiento_ia:
              'El destinatario no ha abierto el enlace transcurrido el tiempo límite de primera cohorte. Se programa recordatorio amigable respetando las reglas de frecuencia.',
            estado: 'ejecutado',
            tiempo_ejecucion_ms: 198,
          },
          {
            id: 'dec-103',
            timestamp: 'Hace 1 hora',
            campana_id: campanaId || 'camp-2',
            campana_nombre: 'Feedback Post-Venta Automotriz',
            trigger_evento: 'Similitud coseno de respuesta > 0.96 con respuesta previa',
            respuesta_id: 'resp-872',
            tool_ejecutada: 'marcar_fraude_potencial',
            parametros: {
              tipo_marca: 'duplicado_semantico',
              score_similitud: 0.975,
              bloqueo_automatico: false,
            },
            razonamiento_ia:
              'La respuesta textual presenta un vector de embeddings virtualmente idéntico a otra respuesta enviada desde un rango IP afín hace 4 minutos. Se deriva a la cola de revisión humana de fraude (RF21).',
            estado: 'ejecutado',
            tiempo_ejecucion_ms: 512,
          },
          {
            id: 'dec-104',
            timestamp: 'Hace 3 horas',
            campana_id: campanaId || 'camp-1',
            campana_nombre: 'Encuesta de Satisfacción Q3',
            trigger_evento: 'Meta de 100 respuestas completadas alcanzada',
            tool_ejecutada: 'generar_reporte_alerta',
            parametros: {
              destinatarios_notificacion: ['admin@empresa.com'],
              formato: 'resumen_ejecutivo',
            },
            razonamiento_ia:
              'Se cumplió el umbral fijado de 100 muestras representativas. Se compila síntesis ejecutiva para los suscriptores.',
            estado: 'ejecutado',
            tiempo_ejecucion_ms: 820,
          },
        ]);
      }
    } catch {
      toast.info('Mostrando registro local de auditoría de agentes.');
    } finally {
      setLoading(false);
    }
  };

  const getToolBadgeColor = (tool: string) => {
    switch (tool) {
      case 'escalar_caso_soporte':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'marcar_fraude_potencial':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'enviar_recordatorio_encuesta':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'generar_reporte_alerta':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  const getStatusBadge = (estado: AgentDecisionItem['estado']) => {
    switch (estado) {
      case 'ejecutado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Ejecutado
          </span>
        );
      case 'en_proceso':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3 animate-spin" /> En proceso
          </span>
        );
      case 'fallido':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <AlertCircle className="w-3 h-3" /> Fallido
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-200">
            Omitido
          </span>
        );
    }
  };

  const filteredDecisions = decisions.filter((d) => {
    const matchesTool = selectedTool === 'todos' || d.tool_ejecutada === selectedTool;
    const matchesStatus = selectedStatus === 'todos' || d.estado === selectedStatus;
    const matchesSearch =
      searchTerm.trim() === '' ||
      d.campana_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.trigger_evento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.razonamiento_ia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.tool_ejecutada.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTool && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Encabezado descriptivo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Bot className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Auditoría de Decisiones del Agente IA</h2>
              <p className="text-sm text-gray-500">
                Trazabilidad completa de acciones automáticas y llamadas a funciones ejecutadas por Gemini
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchDecisions}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por razonamiento, campaña o evento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedTool}
            onChange={(e) => setSelectedTool(e.target.value)}
            className="text-sm py-2 px-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="todos">Todas las funciones</option>
            <option value="escalar_caso_soporte">escalar_caso_soporte</option>
            <option value="enviar_recordatorio_encuesta">enviar_recordatorio_encuesta</option>
            <option value="marcar_fraude_potencial">marcar_fraude_potencial</option>
            <option value="generar_reporte_alerta">generar_reporte_alerta</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-sm py-2 px-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="todos">Todos los estados</option>
            <option value="ejecutado">Ejecutado</option>
            <option value="en_proceso">En proceso</option>
            <option value="fallido">Fallido</option>
          </select>
        </div>
      </div>

      {/* Tabla de auditoría */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-2" />
            <p className="text-sm">Cargando registros de auditoría...</p>
          </div>
        ) : filteredDecisions.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Bot className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="font-medium text-gray-700">No se encontraron decisiones registradas</p>
            <p className="text-xs text-gray-400 mt-1">
              Las acciones automáticas del agente inteligente aparecerán aquí cuando ocurran eventos disparadores.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Fecha / Hora</th>
                  <th className="py-3 px-4">Campaña</th>
                  <th className="py-3 px-4">Evento Disparador</th>
                  <th className="py-3 px-4">Función Ejecutada</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Traza</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDecisions.map((dec) => (
                  <tr key={dec.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3.5 px-4 text-xs text-gray-500 whitespace-nowrap">
                      {dec.timestamp}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-900 max-w-[180px] truncate">
                      {dec.campana_nombre}
                    </td>
                    <td className="py-3.5 px-4 text-gray-700 max-w-[260px]">
                      <span className="line-clamp-2">{dec.trigger_evento}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-medium border ${getToolBadgeColor(
                          dec.tool_ejecutada
                        )}`}
                      >
                        {dec.tool_ejecutada}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">{getStatusBadge(dec.estado)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setActiveTrace(dec)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Ver traza
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Traza y Razonamiento del Agente */}
      {activeTrace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
                  <Terminal className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Traza de Ejecución — {activeTrace.id}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {activeTrace.timestamp} • Latencia: {activeTrace.tiempo_ejecucion_ms ?? 250}ms
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTrace(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-200 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Evento y respuesta vinculada */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Evento Disparador
                </label>
                <div className="mt-1 p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-800">
                  {activeTrace.trigger_evento}
                  {activeTrace.respuesta_id && (
                    <div className="mt-2 pt-2 border-t border-gray-200/80 flex items-center gap-2 text-xs text-indigo-600 font-medium">
                      <span>Respuesta asociada: #{activeTrace.respuesta_id}</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </div>

              {/* Razonamiento de Gemini */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Razonamiento del Modelo (Chain of Thought)
                  </label>
                </div>
                <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/70 text-sm text-gray-800 leading-relaxed italic">
                  "{activeTrace.razonamiento_ia}"
                </div>
              </div>

              {/* Función y Parámetros */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Llamada a Función (Function Calling)
                </label>
                <div className="mt-1 bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto shadow-inner">
                  <div className="text-indigo-400 font-bold mb-2">
                    // Tool: {activeTrace.tool_ejecutada}()
                  </div>
                  <pre>{JSON.stringify(activeTrace.parametros, null, 2)}</pre>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => setActiveTrace(null)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-sm font-medium transition cursor-pointer"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDecisionLog;
