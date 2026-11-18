import React, { useState, useEffect, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  Sparkles,
  Send,
  Plus,
  Trash2,
  MessageSquare,
  MessageSquareText,
  Search,
  Bot,
  Zap,
  Target,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Mail,
  FileText,
  Mic,
  ChevronDown,
  ChevronUp,
  PanelLeftClose,
  PanelLeftOpen,
  HelpCircle,
  Clock,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "../../../shared/layouts/AppLayout";
import {
  sendCopilotMessage,
  getCopilotSessions,
  createCopilotSession,
  getCopilotSessionMessages,
  deleteCopilotSession,
} from "../services/copilotService";
import {
  getStoredSessions,
  saveStoredSessions,
  getActiveSessionId,
  setActiveSessionId,
  createNewSession,
  updateSession,
  deleteStoredSession,
  resolveUserKey,
} from "../services/copilotStorage";
import { CopilotMarkdown } from "./CopilotMarkdown";

const QUICK_STARTER_PROMPTS = [
  {
    icon: "📊",
    title: "Resumen de la Empresa",
    prompt: "Genera un resumen general de mi empresa: estado de mi plan, cuotas, campañas y operadores.",
    category: "MCP Negocio",
  },
  {
    icon: "🚀",
    title: "Auditoría de Campañas",
    prompt: "Listar todas las campañas activas y mostrar cuántas respuestas hemos recolectado en cada una.",
    category: "MCP Operativo",
  },
  {
    icon: "🛡️",
    title: "Revisión de Fraude con IA",
    prompt: "Consultar alertas de fraude y respuestas sospechosas detectadas recientemente.",
    category: "MCP Antifraude",
  },
  {
    icon: "🔍",
    title: "Análisis Semántico RAG",
    prompt: "¿Cuáles son los motivos de queja o insatisfacción más recurrentes en las encuestas recibidas?",
    category: "RAG pgvector",
  },
  {
    icon: "💡",
    title: "Recomendar Preguntas",
    prompt: "Recomendar 3 preguntas estructuradas tipo Likert y NPS para medir satisfacción del cliente.",
    category: "Diseño Encuestas",
  },
];

const INITIAL_BOT_GREETING = {
  id: "greeting-init",
  sender: "assistant",
  text: `¡Hola! 👋 Soy tu **Copiloto Inteligente con arquitectura unificada MCP & RAG** para SurveySaaS.

Puedo ayudarte con:
• **Herramientas de Negocio MCP:** Consultar estado de suscripción, cuotas, operadores y límites
• **Gestión Operativa:** Listar campañas, verificar despachos y tasas de respuesta
• **Detección Antifraude:** Auditar anomalías y respuestas marcadas por IA
• **Búsqueda Semántica RAG:** Analizar citas textuales en respuestas de voz, texto y papel OCR
• **Recomendador Inteligente:** Sugerir preguntas óptimas (NPS, escalas Likert, opción múltiple)

Elegí una consulta rápida o escribí lo que necesitás analizar hoy.`,
  timestamp: "Ahora",
  suggested_actions: [
    "📊 Resumen de mi empresa",
    "🚀 Ver campañas activas",
    "🛡️ Consultar alertas de fraude",
    "🔍 Análisis semántico RAG",
  ],
};

export default function CopilotChatPage({ role = "suscriptor" }) {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Campaña ID del contexto (props, query param o URL)
  const explicitCampanaId =
    searchParams.get("campana_id") ||
    (location.pathname.includes("/campanas/") ? location.pathname.split("/campanas/")[1]?.split("/")[0] : null);

  const [sessions, setSessions] = useState(() => {
    let stored = getStoredSessions();
    if (stored.length === 0) {
      const initial = createNewSession("Bienvenida al Copiloto", explicitCampanaId);
      initial.messages = [INITIAL_BOT_GREETING];
      saveStoredSessions([initial]);
      stored = [initial];
    }
    return stored;
  });

  const [activeSession, setActiveSession] = useState(() => {
    const stored = getStoredSessions();
    const activeId = getActiveSessionId();
    return stored.find((s) => s.id === activeId) || stored[0] || null;
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [openToolsDrawer, setOpenToolsDrawer] = useState({});
  const [openSourcesDrawer, setOpenSourcesDrawer] = useState({});

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Inicializar sesiones desde el backend con fallback a almacenamiento local
  const loadSessionMessages = async (sessionId, sessionRef = null) => {
    try {
      const messagesData = await getCopilotSessionMessages(sessionId);
      if (Array.isArray(messagesData) && messagesData.length > 0) {
        const formatted = messagesData.map((m) => ({
          id: m.id || `msg-${Date.now()}-${Math.random()}`,
          sender: m.sender === "user" ? "user" : "assistant",
          text: m.text,
          timestamp: m.created_at
            ? new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "Ahora",
          tools_used: m.tools_used || [],
          fuentes_citadas: m.fuentes_citadas || [],
          suggested_actions: m.suggested_actions || [],
        }));

        setActiveSession((prev) => {
          if (prev && prev.id === sessionId) {
            return { ...prev, messages: formatted };
          }
          return prev;
        });

        setSessions((prevSessions) =>
          prevSessions.map((s) => (s.id === sessionId ? { ...s, messages: formatted } : s))
        );
        return;
      }
    } catch (err) {
      console.warn(`[Copilot] Usando mensajes locales para sesión ${sessionId}:`, err);
    }

    // Si no tiene mensajes o falló la carga remota, asegurar mensaje inicial si está vacía
    setActiveSession((prev) => {
      if (prev && prev.id === sessionId && (!prev.messages || prev.messages.length === 0)) {
        return { ...prev, messages: [INITIAL_BOT_GREETING] };
      }
      return prev;
    });
  };

  useEffect(() => {
    let isMounted = true;

    async function loadSessions() {
      try {
        const backendSessions = await getCopilotSessions();
        if (isMounted && Array.isArray(backendSessions) && backendSessions.length > 0) {
          const mapped = backendSessions.map((bs) => ({
            id: bs.id,
            title: bs.title || "Conversación",
            createdAt: bs.created_at,
            updatedAt: bs.updated_at,
            campanaId: bs.campana_id,
            message_count: bs.message_count || 0,
            messages: [],
          }));
          setSessions(mapped);
          saveStoredSessions(mapped);

          const lastActiveId = getActiveSessionId();
          const target = mapped.find((s) => s.id === lastActiveId) || mapped[0];
          setActiveSession(target);
          setActiveSessionId(target.id);
          loadSessionMessages(target.id, target);
          return;
        }
      } catch (err) {
        console.warn("[Copilot] Error al cargar sesiones del backend, fallback local:", err);
      }

      if (isMounted) {
        let stored = getStoredSessions();
        if (stored.length === 0) {
          const initial = createNewSession("Bienvenida al Copiloto", explicitCampanaId);
          initial.messages = [INITIAL_BOT_GREETING];
          saveStoredSessions([initial]);
          stored = [initial];
        }

        setSessions(stored);
        const activeId = getActiveSessionId();
        const found = stored.find((s) => s.id === activeId) || stored[0];
        setActiveSession(found);
        setActiveSessionId(found?.id || null);
      }
    }

    loadSessions();
    return () => {
      isMounted = false;
    };
  }, [explicitCampanaId]);

  // Scroll automático al fondo cuando cambian mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, loading]);

  // Auto-ajustar altura del textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [inputText]);

  const handleSelectSession = (session) => {
    setActiveSession(session);
    setActiveSessionId(session.id);
    if (!session.messages || session.messages.length === 0) {
      loadSessionMessages(session.id, session);
    }
  };

  const handleNewSession = async () => {
    let newSession = null;
    try {
      const created = await createCopilotSession({
        title: "Nueva conversación",
        campana_id: explicitCampanaId || null,
      });
      if (created && created.id) {
        newSession = {
          id: created.id,
          title: created.title || "Nueva conversación",
          createdAt: created.created_at || new Date().toISOString(),
          updatedAt: created.updated_at || new Date().toISOString(),
          campanaId: created.campana_id || explicitCampanaId || null,
          messages: [
            {
              ...INITIAL_BOT_GREETING,
              id: `greeting-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ],
          message_count: 0,
        };
      }
    } catch (err) {
      console.warn("[Copilot] Error creando sesión en backend, creando localmente:", err);
    }

    if (!newSession) {
      newSession = createNewSession("Nueva consulta", explicitCampanaId);
      newSession.messages = [
        {
          ...INITIAL_BOT_GREETING,
          id: `greeting-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ];
    }

    const updated = [newSession, ...sessions.filter((s) => s.id !== newSession.id)];
    setSessions(updated);
    setActiveSession(newSession);
    setActiveSessionId(newSession.id);
    saveStoredSessions(updated);
    toast.success("Nueva conversación iniciada");
  };

  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation();
    try {
      await deleteCopilotSession(sessionId);
    } catch (err) {
      console.warn("[Copilot] Error eliminando sesión remota:", err);
    }

    const remaining = deleteStoredSession(sessionId);
    setSessions(remaining);
    if (activeSession?.id === sessionId) {
      if (remaining.length > 0) {
        setActiveSession(remaining[0]);
        setActiveSessionId(remaining[0].id);
        if (!remaining[0].messages || remaining[0].messages.length === 0) {
          loadSessionMessages(remaining[0].id, remaining[0]);
        }
      } else {
        handleNewSession();
      }
    }
    toast.info("Conversación eliminada");
  };

  const toggleToolsDrawer = (msgId) => {
    setOpenToolsDrawer((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const toggleSourcesDrawer = (msgId) => {
    setOpenSourcesDrawer((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const handleSendMessage = async (customPrompt = null) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || loading || !activeSession) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const currentMessages = activeSession.messages || [];
    const nextMessages = [...currentMessages, userMessage];

    // Actualizar título de la sesión si es la primera pregunta del usuario
    let nextTitle = activeSession.title;
    if (activeSession.title === "Nueva conversación" || activeSession.title === "Nueva consulta") {
      nextTitle = textToSend.trim().slice(0, 32) + (textToSend.length > 32 ? "..." : "");
    }

    const updatedSession = {
      ...activeSession,
      title: nextTitle,
      messages: nextMessages,
      updatedAt: new Date().toISOString(),
    };

    setActiveSession(updatedSession);
    const updatedSessions = sessions.map((s) => (s.id === activeSession.id ? updatedSession : s));
    setSessions(updatedSessions);
    saveStoredSessions(updatedSessions);

    if (!customPrompt) setInputText("");
    setLoading(true);

    try {
      const response = await sendCopilotMessage({
        message: textToSend.trim(),
        history: nextMessages.slice(-6).map((m) => ({
          sender: m.sender === "user" ? "user" : "assistant",
          text: m.text,
        })),
        campana_id: activeSession.campanaId || explicitCampanaId || null,
        session_id: activeSession.id && !activeSession.id.startsWith("session-") ? activeSession.id : undefined,
      });

      const actualSessionId = response.session_id || activeSession.id;

      const botMessage = {
        id: `bot-${Date.now()}`,
        sender: "assistant",
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        tools_used: response.tools_used || [],
        suggested_actions: response.suggested_actions || [],
        fuentes_citadas: response.fuentes_citadas || [],
      };

      const finalSession = {
        ...updatedSession,
        id: actualSessionId,
        messages: [...nextMessages, botMessage],
        updatedAt: new Date().toISOString(),
      };

      setActiveSession(finalSession);
      setActiveSessionId(actualSessionId);
      const finalSessions = sessions.map((s) => (s.id === activeSession.id ? finalSession : s));
      setSessions(finalSessions);
      saveStoredSessions(finalSessions);
    } catch (err) {
      const errorMessage = {
        id: `err-${Date.now()}`,
        sender: "assistant",
        text: `⚠️ Hubo un inconveniente al consultar con el Copiloto: ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        error: true,
      };

      const finalSession = {
        ...updatedSession,
        messages: [...nextMessages, errorMessage],
        updatedAt: new Date().toISOString(),
      };

      setActiveSession(finalSession);
      const finalSessions = sessions.map((s) => (s.id === activeSession.id ? finalSession : s));
      setSessions(finalSessions);
      saveStoredSessions(finalSessions);
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const getChannelBadge = (canal) => {
    switch (canal) {
      case "gmail":
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200"><Mail className="w-3 h-3" /> Gmail</span>;
      case "ocr":
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200"><FileText className="w-3 h-3" /> OCR Papel</span>;
      case "voz":
      case "audio":
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200"><Mic className="w-3 h-3" /> Audio IA</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200"><BookOpen className="w-3 h-3" /> Encuesta Web</span>;
    }
  };

  return (
    <AppLayout role={role}>
      <div className="flex h-[calc(100vh-4rem)] bg-slate-100 overflow-hidden font-sans">
        {/* ───────── SIDEBAR IZQUIERDO (HISTORIAL DE CHATS TIPO CHATGPT) ───────── */}
        <aside
          className={`${
            sidebarOpen ? "w-72 sm:w-80" : "w-0 -translate-x-full"
          } transition-all duration-300 ease-in-out bg-slate-900 text-slate-200 flex flex-col border-r border-slate-800 flex-shrink-0 relative z-20`}
        >
          {/* Header del Sidebar */}
          <div className="p-4 border-b border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Copiloto IA</h3>
                  <p className="text-[10px] text-slate-400">MCP & RAG Unificado</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                title="Ocultar barra de chats"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>

            {/* Botón "+ Nueva Conversación" */}
            <button
              type="button"
              onClick={handleNewSession}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva conversación</span>
            </button>

            {/* Buscador de sesiones */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar en el historial..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Lista de Sesiones */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 px-3 py-1 block tracking-wider">
              Historial de Chats
            </span>

            {filteredSessions.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No hay conversaciones coincidentes.
              </div>
            ) : (
              filteredSessions.map((s) => {
                const isActive = activeSession?.id === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => handleSelectSession(s)}
                    className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs transition-all ${
                      isActive
                        ? "bg-indigo-600/20 text-white border border-indigo-500/40 font-semibold"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MessageSquare className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                      <span className="truncate max-w-[170px]">{s.title}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteSession(s.id, e)}
                      title="Eliminar conversación"
                      className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-1 rounded-md transition-all flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer del Sidebar */}
          <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Agente MCP Online</span>
            </span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
              v2.0
            </span>
          </div>
        </aside>

        {/* ───────── ÁREA CENTRAL DEL CHAT (TIPO CLAUDE / CHATGPT) ───────── */}
        <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden relative">
          {/* Header Superior del Chat */}
          <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between flex-shrink-0 z-10 shadow-xs">
            <div className="flex items-center gap-3">
              {!sidebarOpen && (
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="text-slate-600 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition-colors"
                  title="Mostrar historial de chats"
                >
                  <PanelLeftOpen className="w-5 h-5" />
                </button>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    {activeSession?.title || "Copiloto IA"}
                  </h1>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    MCP AI + RAG
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Respuestas fundamentadas con herramientas seguras del dominio y base vectorial
                </p>
              </div>
            </div>

            {/* Badge de contexto de campaña y acciones rápidas */}
            <div className="flex items-center gap-2">
              {explicitCampanaId && (
                <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs px-2.5 py-1 rounded-lg font-medium">
                  <Target className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">Campaña:</span>
                  <span className="font-mono">{explicitCampanaId.slice(0, 8)}...</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleNewSession}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all"
                title="Limpiar y crear nuevo chat"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Nuevo Chat</span>
              </button>
            </div>
          </header>

          {/* Feed de Mensajes */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6">
            {activeSession?.messages?.length === 0 ? (
              <div className="max-w-3xl mx-auto py-12 text-center space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 to-blue-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/20">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    ¿En qué puedo ayudarte hoy?
                  </h2>
                  <p className="text-sm text-slate-500 max-w-lg mx-auto">
                    Tu copiloto con arquitectura MCP tiene acceso directo y seguro a los datos de tu empresa para auditar, analizar métricas y sugerir preguntas.
                  </p>
                </div>

                {/* Tarjetas de Prompts de Inicio */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-left max-w-2xl mx-auto">
                  {QUICK_STARTER_PROMPTS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(item.prompt)}
                      className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-md transition-all text-left space-y-1.5 group cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {item.prompt}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-6">
                {activeSession?.messages?.map((msg) => {
                  const isUser = msg.sender === "user";
                  const hasTools = msg.tools_used && msg.tools_used.length > 0;
                  const hasSources = msg.fuentes_citadas && msg.fuentes_citadas.length > 0;
                  const hasSuggestions = msg.suggested_actions && msg.suggested_actions.length > 0;

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 sm:gap-4 ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      {/* Avatar del Asistente */}
                      {!isUser && (
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-950 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-900/20 mt-1">
                          <Bot className="w-5 h-5 text-indigo-400" />
                        </div>
                      )}

                      {/* Contenido de la burbuja */}
                      <div
                        className={`max-w-[85%] sm:max-w-2xl rounded-2xl px-5 py-4 space-y-3.5 shadow-xs ${
                          isUser
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-xs"
                            : msg.error
                            ? "bg-red-50 text-red-900 border border-red-200 rounded-bl-xs"
                            : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs"
                        }`}
                      >
                        {/* Texto con Markdown */}
                        {isUser ? (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        ) : (
                          <div className="text-sm leading-relaxed">
                            <CopilotMarkdown content={msg.text} />
                          </div>
                        )}

                        {/* Badge e Inspección de Herramientas MCP */}
                        {hasTools && (
                          <div className="pt-2 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => toggleToolsDrawer(msg.id)}
                              className="w-full flex items-center justify-between text-left px-3 py-2 rounded-xl bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-800 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <span className="flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5 text-indigo-600" />
                                <span>
                                  ⚡ Herramientas MCP ejecutadas ({msg.tools_used.length})
                                </span>
                              </span>
                              {openToolsDrawer[msg.id] ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {openToolsDrawer[msg.id] && (
                              <div className="mt-2 space-y-2 p-3 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono">
                                {msg.tools_used.map((toolRec, tIdx) => (
                                  <div key={tIdx} className="space-y-1 pb-2 border-b border-slate-800 last:border-b-0 last:pb-0">
                                    <div className="flex items-center justify-between text-indigo-400 font-bold">
                                      <span>tool: {toolRec.tool}</span>
                                      <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">OK</span>
                                    </div>
                                    <div className="text-[11px] text-slate-400">
                                      args: {JSON.stringify(toolRec.arguments)}
                                    </div>
                                    <div className="text-[11px] text-slate-300">
                                      data: {toolRec.result_summary}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Citas y Fuentes RAG (si aplica) */}
                        {hasSources && (
                          <div className="pt-2 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => toggleSourcesDrawer(msg.id)}
                              className="w-full flex items-center justify-between text-left px-3 py-2 rounded-xl bg-emerald-50/80 hover:bg-emerald-100/80 text-emerald-900 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <span className="flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                                <span>📚 Fuentes Citadas Verificadas (RAG) ({msg.fuentes_citadas.length})</span>
                              </span>
                              {openSourcesDrawer[msg.id] ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {openSourcesDrawer[msg.id] && (
                              <div className="mt-2 space-y-2">
                                {msg.fuentes_citadas.map((src, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        {getChannelBadge(src.canal)}
                                        <span className="text-[11px] font-semibold text-slate-700">
                                          {src.campana}
                                        </span>
                                      </div>
                                      {src.similitud_score && (
                                        <span className="text-[10px] text-slate-500 font-mono">
                                          Similitud: {(src.similitud_score * 100).toFixed(0)}%
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-slate-700 italic border-l-2 border-indigo-400 pl-2">
                                      "{src.fragmento}"
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Pills de Acciones Sugeridas */}
                        {hasSuggestions && (
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {msg.suggested_actions.map((act, aIdx) => (
                              <button
                                key={aIdx}
                                type="button"
                                onClick={() => handleSendMessage(act)}
                                className="px-3 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-medium transition-all cursor-pointer active:scale-95"
                              >
                                {act}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Timestamp */}
                        <div
                          className={`text-[10px] text-right ${
                            isUser ? "text-indigo-200" : "text-slate-400"
                          }`}
                        >
                          {msg.timestamp}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Indicador de pensamiento animado */}
                {loading && (
                  <div className="flex gap-3 items-center">
                    <div className="w-9 h-9 rounded-2xl bg-indigo-900 text-white flex items-center justify-center animate-pulse">
                      <Sparkles className="w-4 h-4 text-indigo-300" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-xs flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:.15s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:.3s]" />
                      </span>
                      <span>Consultando herramientas MCP y sintetizando respuesta...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* ───────── BARRA DE INPUT INFERIOR (TIPO CHATGPT) ───────── */}
          <footer className="p-4 sm:p-6 bg-white border-t border-slate-200/90 flex-shrink-0 z-10 shadow-lg">
            <div className="max-w-4xl mx-auto space-y-2">
              <div className="relative flex items-center bg-slate-50 border border-slate-300 rounded-2xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all p-1.5 shadow-inner">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Preguntale al Copiloto sobre campañas, métricas, alertas de fraude o RAG..."
                  className="flex-1 bg-transparent border-0 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-none max-h-44"
                />

                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || loading}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-40 text-white font-bold transition-all flex-shrink-0 cursor-pointer shadow-md shadow-indigo-600/20 active:scale-95"
                  title="Enviar mensaje (Enter)"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between px-2 text-[11px] text-slate-400">
                <span>Presioná <strong>Enter</strong> para enviar, <strong>Shift + Enter</strong> para salto de línea.</span>
                <span className="hidden sm:inline">Arquitectura MCP Segura • Multi-Tenant</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </AppLayout>
  );
}
