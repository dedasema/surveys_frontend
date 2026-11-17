import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  Sparkles,
  X,
  Send,
  Loader2,
  ChevronDown,
  ChevronUp,
  Minimize2,
  Maximize2,
  RotateCcw,
  Zap,
  Target,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { sendCopilotMessage } from "../services/copilotService";
import { CopilotMarkdown } from "./CopilotMarkdown";

const QUICK_STARTER_PROMPTS = [
  "✨ Crear una plantilla de satisfacción al cliente",
  "📊 Resumen de mi empresa y suscripción",
  "🚀 Ver campañas activas y métricas",
  "🛡️ ¿Tengo alertas de fraude sospechosas?",
  "💡 Sugerir 3 preguntas de evaluación de producto",
];

const INITIAL_WELCOME_MESSAGE = {
  id: "welcome-mcp-copilot",
  sender: "bot",
  text: `¡Hola! 👋 Soy tu **Copiloto Inteligente con arquitectura MCP** para SurveySaaS.

Tengo acceso seguro a las herramientas analíticas de tu empresa para ayudarte a:
• Consultar el **resumen general** de tu suscripción, cuotas y operadores
• Listar y auditar **campañas activas** con sus tasas de respuesta
• Analizar **métricas detalladas de satisfacción y completitud**
• Detectar y revisar **alertas de fraude con IA**
• **Recomendar preguntas estructuradas** (NPS, escalas Likert, opción múltiple)

¿Qué te gustaría analizar o consultar hoy?`,
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  suggested_actions: [
    "📊 Resumen de mi empresa",
    "🚀 Listar campañas activas",
    "🛡️ Consultar alertas de fraude",
    "💡 Recomendar preguntas NPS",
  ],
};

/**
 * Extrae el campana_id del contexto actual de la aplicación (URL, query params o storage).
 */
export const extractCampanaIdFromContext = (explicitId = null) => {
  if (explicitId) return explicitId;

  if (typeof window !== "undefined") {
    // 1. Desde query params ?campana_id=... o ?campana=...
    try {
      const params = new URLSearchParams(window.location.search);
      const qId = params.get("campana_id") || params.get("campana");
      if (qId) return qId;
    } catch (e) {
      // Ignorar error de parsing
    }

    // 2. Desde ruta URL /campanas/:id
    const match = window.location.pathname.match(/\/campanas\/([a-zA-Z0-9_-]{8,})/i);
    if (match && match[1]) return match[1];

    // 3. Desde sessionStorage si el usuario seleccionó una campaña recientemente
    const saved = sessionStorage.getItem("selected_campana_id");
    if (saved) return saved;
  }

  return undefined;
};

export function CopilotWidget({
  activeSection = "dashboard",
  currentSection = null,
  campanaId = null,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Vista amplia / slide-over
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedToolsMsgId, setExpandedToolsMsgId] = useState(null);

  const [messages, setMessages] = useState([INITIAL_WELCOME_MESSAGE]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const section = currentSection || activeSection || "dashboard";
  const detectedCampanaId = extractCampanaIdFromContext(campanaId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, loading]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async (textToSend = null) => {
    const rawMessage = (textToSend || input).trim();
    if (!rawMessage || loading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: rawMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      // Tomar los últimos 6 mensajes como historial de contexto
      const recentHistory = messages
        .filter((m) => m.id !== "welcome-mcp-copilot")
        .slice(-6);

      const response = await sendCopilotMessage({
        message: rawMessage,
        history: recentHistory,
        campana_id: detectedCampanaId,
      });

      const botMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: response.answer,
        tools_used: response.tools_used || [],
        suggested_actions: response.suggested_actions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Error al consultar el Copiloto:", err);
      const errorMessage = {
        id: `err-${Date.now()}`,
        sender: "bot",
        text: `⚠️ Hubo un inconveniente al consultar con el Copiloto MCP: ${err.message}`,
        error: true,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggested_actions: ["Reintentar última consulta", "📊 Resumen de mi empresa"],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        ...INITIAL_WELCOME_MESSAGE,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const toggleToolsDetails = (msgId) => {
    setExpandedToolsMsgId((prev) => (prev === msgId ? null : msgId));
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* BOTÓN FLOTANTE TRIGGER */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="group relative flex items-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 text-white rounded-full shadow-2xl hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-blue-500/20 cursor-pointer"
          title="Abrir Copiloto IA (Arquitectura MCP)"
          aria-label="Abrir Copiloto Inteligente"
        >
          <div className="relative">
            <Bot className="w-6 h-6 transition-transform group-hover:rotate-12" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
            </span>
          </div>

          <span className="font-bold text-sm tracking-tight hidden sm:inline-block">
            Copiloto IA
          </span>
          <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-md bg-white/20 text-white border border-white/20 hidden md:inline-block">
            MCP
          </span>
        </button>
      )}

      {/* VENTANA / PANEL SLIDE-OVER DEL CHAT */}
      {isOpen && (
        <div
          className={`bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized
              ? "h-16 w-80 sm:w-96"
              : isExpanded
              ? "fixed inset-y-0 right-0 w-full sm:w-[480px] lg:w-[540px] rounded-none sm:rounded-l-3xl shadow-2xl h-screen z-50"
              : "w-[92vw] sm:w-[420px] md:w-[450px] h-[580px] max-h-[85vh]"
          }`}
        >
          {/* HEADER DEL COPILOTO */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white px-4 py-3.5 flex items-center justify-between border-b border-indigo-900/40 shadow-sm flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm tracking-tight text-white">
                    SurveySaaS Copilot
                  </h4>
                  <span className="text-[10px] uppercase font-black px-1.5 py-0.2 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                    MCP AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Asistente inteligente para empresas
                </p>
              </div>
            </div>

            {/* Header Action Controls */}
            <div className="flex items-center gap-1 text-slate-300">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                title="Reiniciar conversación"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-xl transition-colors hidden sm:block cursor-pointer"
                title={isExpanded ? "Vista compacta" : "Expandir panel"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                title={isMinimized ? "Maximizar ventana" : "Minimizar ventana"}
              >
                {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsExpanded(false);
                }}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                title="Cerrar Copiloto"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ACTIVE CAMPAIGN CONTEXT INDICATOR */}
          {!isMinimized && detectedCampanaId && (
            <div className="bg-indigo-50/90 border-b border-indigo-100 px-4 py-1.5 flex items-center justify-between text-[11px] text-indigo-900">
              <div className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                <span className="font-semibold truncate">
                  Contexto activo: Campaña{" "}
                  <code className="font-mono bg-white px-1.5 py-0.2 rounded border border-indigo-200">
                    {detectedCampanaId.slice(0, 8)}...
                  </code>
                </span>
              </div>
              <span className="text-[10px] text-indigo-600 font-bold uppercase">
                Filtro automático
              </span>
            </div>
          )}

          {/* CUERPO DEL CHAT */}
          {!isMinimized && (
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
              {/* LISTA DE MENSAJES */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => {
                  const isLatestBot =
                    msg.sender === "bot" &&
                    index === messages.length - 1 &&
                    !loading;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.sender === "user" ? "items-end" : "items-start"
                      } space-y-1.5`}
                    >
                      {/* Burbuja de mensaje */}
                      <div
                        className={`max-w-[88%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm transition-all ${
                          msg.sender === "user"
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none"
                            : msg.error
                            ? "bg-red-50 text-red-900 border border-red-200 rounded-bl-none"
                            : "bg-white text-slate-800 border border-slate-200/90 rounded-bl-none"
                        }`}
                      >
                        {msg.sender === "user" ? (
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        ) : (
                          <CopilotMarkdown content={msg.text} sender={msg.sender} />
                        )}

                        {/* BADGE DE HERRAMIENTAS MCP USADAS */}
                        {msg.tools_used && msg.tools_used.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => toggleToolsDetails(msg.id)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-[11px] font-semibold transition-colors cursor-pointer"
                              title="Ver herramientas MCP ejecutadas"
                            >
                              <Zap className="w-3.5 h-3.5 text-indigo-600" />
                              <span>
                                ⚡ Herramientas MCP:{" "}
                                <span className="font-mono text-[10px] underline">
                                  {msg.tools_used.map((t) => t.tool).join(", ")}
                                </span>
                              </span>
                            </button>

                            {/* Detalle expandible de ejecución de herramientas */}
                            {expandedToolsMsgId === msg.id && (
                              <div className="mt-2 space-y-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 animate-fade-in">
                                {msg.tools_used.map((toolRec, tIdx) => (
                                  <div
                                    key={tIdx}
                                    className="p-1.5 rounded-lg bg-white border border-slate-200/60"
                                  >
                                    <div className="flex items-center justify-between font-mono font-bold text-indigo-800 text-[10px]">
                                      <span>⚙️ {toolRec.tool}</span>
                                    </div>
                                    {toolRec.result_summary && (
                                      <p className="mt-0.5 text-slate-600 text-[10px] leading-tight">
                                        {toolRec.result_summary}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <span className="text-[10px] text-slate-400 px-1">
                        {msg.timestamp}
                      </span>

                      {/* PILLS DE ACCIONES SUGERIDAS (Debajo del último mensaje del bot) */}
                      {isLatestBot &&
                        msg.suggested_actions &&
                        msg.suggested_actions.length > 0 && (
                          <div className="pt-1.5 flex flex-wrap gap-1.5 max-w-[95%]">
                            {msg.suggested_actions.map((action, aIdx) => (
                              <button
                                key={aIdx}
                                type="button"
                                onClick={() => handleSendMessage(action)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 font-medium text-xs shadow-2xs transition-all active:scale-95 cursor-pointer"
                              >
                                <span>{action}</span>
                                <ArrowRight className="w-3 h-3 text-blue-500 opacity-60" />
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  );
                })}

                {/* INDICADOR DE CARGA / THINKING CON HERRAMIENTAS MCP */}
                {loading && (
                  <div className="flex flex-col items-start space-y-1 animate-pulse">
                    <div className="flex items-center gap-2.5 p-3 rounded-2xl rounded-bl-none bg-white border border-indigo-200 shadow-sm">
                      <div className="w-5 h-5 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-slate-800">
                          Consultando herramientas y analizando datos...
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Ejecutando protocolo MCP en tiempo real
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* QUICK PROMPT CHIPS (Cuando hay pocos mensajes en la conversación) */}
              {messages.length <= 2 && (
                <div className="px-3.5 py-2.5 bg-slate-100/80 border-t border-slate-200/70 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {QUICK_STARTER_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(prompt)}
                      disabled={loading}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white hover:bg-indigo-50 border border-slate-200 text-slate-700 hover:text-indigo-700 transition-colors cursor-pointer shadow-2xs"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* BARRA DE ENTRADA / INPUT */}
              <div className="p-3.5 bg-white border-t border-slate-200/90 flex-shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Pregúntale a Gemini o al Copiloto MCP..."
                    disabled={loading}
                    className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-slate-900 placeholder-slate-400"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="p-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 text-white shadow-md shadow-blue-600/20 active:scale-95 transition-all cursor-pointer flex-shrink-0"
                    title="Enviar mensaje"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CopilotWidget;
