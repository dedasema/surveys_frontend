import React, { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Bot, Send } from "lucide-react"
import { RenderChatMessage } from "./RenderChatMessage"

const getToken = () => localStorage.getItem("token")

const askBot = async (message, section) => {
  const API_BASE_URL = process.env.REACT_APP_API_URL || "https://surveys-backend-83d9.onrender.com"
  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
    },
    body: JSON.stringify({
      message,
      context: {
        route: window.location.pathname,
        section,
        origin: window.location.origin,
      },
    }),
  })

  if (!res.ok) {
    const { detail } = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(detail || "Error inesperado en el chatbot")
  }
  return res.json()
}

export const ChatbotWidget = ({ currentSection = "dashboard" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date(),
    },
  ])
  const bottomRef = useRef(null)

  const sendMessage = async () => {
    const text = input.trim()
    if (!text) return

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text, timestamp: new Date() },
    ])
    setInput("")
    setIsTyping(true)

    try {
      const { answer } = await askBot(text, currentSection)
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "bot", text: answer, timestamp: new Date() },
      ])
    } catch (err) {
      console.error(err)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: "❌ Hubo un problema al conectar con el asistente.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl w-80 h-96 flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="font-semibold">Asistente Virtual</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(({ id, sender, text }) => (
              <div
                key={id}
                className={`flex ${sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm leading-snug ${
                    sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <RenderChatMessage text={text} sender={sender} />
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 max-w-xs px-3 py-2 rounded-bl-none rounded-lg">
                  <div className="flex gap-1">
                    <span className="animate-bounce">•</span>
                    <span className="animate-bounce [animation-delay:.1s]">•</span>
                    <span className="animate-bounce [animation-delay:.2s]">•</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-3 py-2 rounded-lg transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
