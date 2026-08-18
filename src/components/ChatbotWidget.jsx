// src/components/ChatbotWidget.jsx
import React, { useState, useEffect, useRef } from "react"
import { X, Send, Bot, Sparkles, Loader2, ChevronDown, Minimize2 } from "lucide-react"

const getToken = () => localStorage.getItem("token")
const API_BASE_URL = process.env.REACT_APP_API_URL || "https://surveys-backend-83d9.onrender.com"

const QUICK_PROMPTS = [
  "✨ Crear una plantilla de satisfacción al cliente",
  "📊 ¿Cómo van las respuestas de mis campañas?",
  "💡 Sugerir 3 preguntas de evaluación de producto",
  "🚀 ¿Cómo exportar los datos a Excel?"
]

export default function ChatbotWidget({ activeSection = "dashboard" }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "bot",
      text: "¡Hola! Soy tu asistente de SurveySaaS potenciado por **Google Gemini**. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom()
    }
  }, [messages, isOpen, isMinimized])

  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || input
    if (!textToSend.trim() || loading) return

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages((prev) => [...prev, userMsg])
    if (!customText) setInput("")
    setLoading(true)

    try {
      const token = getToken()
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          message: textToSend,
          context: {
            route: window.location.pathname,
            section: activeSection,
            origin: window.location.origin,
          },
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.detail || `Error del servidor (${res.status})`)
      }

      const data = await res.json()
      
      let answerText = data.answer || "No obtuve una respuesta clara, por favor intenta de nuevo."
      if (data.action_log && data.action_log.length > 0) {
        answerText += "\n\n*Acciones ejecutadas:*\n" + data.action_log.map(a => `• ${a}`).join("\n")
      }

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: answerText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages((prev) => [...prev, botMsg])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "bot",
          text: `⚠️ Hubo un inconveniente al consultar con Gemini: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const formatMessageText = (text) => {
    if (!text) return null
    // Simple markdown-style rendering for bold and linebreaks
    const parts = text.split("\n").map((line, lineIdx) => {
      // Bold rendering
      const boldParts = line.split(/(\*\*.*?\*\*)/g)
      return (
        <p key={lineIdx} className={lineIdx > 0 ? "mt-1.5" : ""}>
          {boldParts.map((part, pIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return <strong key={pIdx} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>
            }
            if (part.startsWith("*") && part.endsWith("*")) {
              return <em key={pIdx} className="italic text-slate-600">{part.slice(1, -1)}</em>
            }
            return part
          })}
        </p>
      )
    })
    return parts
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Botón flotante cuando está cerrado */}
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); setIsMinimized(false); }}
          className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white rounded-full shadow-2xl hover:scale-105 transition-all duration-300 ring-4 ring-blue-500/20"
          title="Abrir Asistente Virtual Gemini"
        >
          <Bot className="w-7 h-7 transition-transform group-hover:rotate-12" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
          </span>
        </button>
      )}

      {/* Ventana de Chat */}
      {isOpen && (
        <div className={`bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-[92vw] sm:w-96 flex flex-col overflow-hidden transition-all duration-300 ${isMinimized ? "h-14" : "h-[540px] max-h-[82vh]"}`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 text-white p-3.5 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm tracking-tight">SurveySaaS Copilot</h4>
                  <span className="text-[10px] bg-white/20 text-white font-medium px-1.5 py-0.2 rounded-full">Gemini</span>
                </div>
                <p className="text-[11px] text-blue-100/90 leading-none">Asistente inteligente en tiempo real</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title={isMinimized ? "Maximizar" : "Minimizar"}
              >
                {isMinimized ? <ChevronDown className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Cerrar chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cuerpo del chat si no está minimizado */}
          {!isMinimized && (
            <>
              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none"
                          : "bg-white text-slate-700 border border-slate-200/80 rounded-bl-none"
                      }`}
                    >
                      {formatMessageText(msg.text)}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl rounded-bl-none w-28">
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    <span className="text-xs text-slate-500 font-medium">Pensando...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips */}
              {messages.length <= 2 && (
                <div className="px-3 py-2 bg-slate-100/80 border-t border-slate-200/60 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt)}
                      disabled={loading}
                      className="text-[11px] bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-full px-2.5 py-1 transition-colors text-left"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Footer */}
              <div className="p-3 bg-white border-t border-slate-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Pregúntale a Gemini..."
                    disabled={loading}
                    className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 text-white rounded-xl shadow-md transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
