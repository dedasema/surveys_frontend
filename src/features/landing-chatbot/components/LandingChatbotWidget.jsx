import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  RotateCcw,
  Sparkles,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';
import { sendLandingMessage } from '../services/landingChatService';

const QUICK_ACTIONS = [
  {
    id: 'planes',
    label: '💳 Ver planes y precios',
    query: '¿Cuáles son los planes y precios disponibles?',
  },
  {
    id: 'voz',
    label: '🎙️ Encuestas por voz',
    query: '¿Cómo funcionan las encuestas por voz con IA?',
  },
  {
    id: 'ocr',
    label: '📄 Escaneo OCR de papel',
    query: '¿Cómo funciona el escaneo OCR para encuestas en papel?',
  },
  {
    id: 'registro',
    label: '🚀 Crear cuenta gratis',
    query: '¿Cómo creo una cuenta gratis para empezar?',
  },
];

const INITIAL_GREETING = {
  id: 'greeting-initial',
  sender: 'bot',
  text: '¡Hola! 👋 Soy el asesor virtual de **SurveySaaS**.\n\n¿En qué puedo ayudarte hoy? Puedo contarte sobre nuestros **planes y precios**, la captura por **voz con IA**, el escaneo **OCR de papel**, o cómo empezar gratis.',
  timestamp: new Date(),
  actions: [
    { label: 'Ver Planes', href: '#precios' },
    { label: 'Crear Cuenta Gratis', href: '/register' },
  ],
};

/**
 * Lightweight safe markdown renderer for bold, links and bullet lists.
 */
function MarkdownText({ content, onLinkClick }) {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className="space-y-1 text-sm leading-relaxed">
      {lines.map((line, lIdx) => {
        if (!line.trim()) {
          return <div key={lIdx} className="h-2" />;
        }

        const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
        const cleanLine = isBullet
          ? line.trim().replace(/^[•-]\s*/, '')
          : line;

        // Parse bold and links
        const parts = [];
        const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(cleanLine)) !== null) {
          if (match.index > lastIndex) {
            parts.push(cleanLine.substring(lastIndex, match.index));
          }

          const token = match[0];
          if (token.startsWith('**') && token.endsWith('**')) {
            parts.push(
              <strong key={match.index} className="font-semibold text-slate-900">
                {token.slice(2, -2)}
              </strong>
            );
          } else if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
            const label = token.slice(1, token.indexOf(']('));
            const href = token.slice(token.indexOf('](') + 2, -1);
            parts.push(
              <a
                key={match.index}
                href={href}
                onClick={(e) => {
                  if (onLinkClick) {
                    onLinkClick(e, href);
                  }
                }}
                className="font-medium text-blue-600 underline hover:text-blue-800 transition-colors inline-flex items-center gap-0.5"
              >
                {label}
              </a>
            );
          }
          lastIndex = regex.lastIndex;
        }

        if (lastIndex < cleanLine.length) {
          parts.push(cleanLine.substring(lastIndex));
        }

        if (isBullet) {
          return (
            <div key={lIdx} className="flex items-start gap-2 pl-1">
              <span className="text-blue-500 font-bold leading-none mt-1.5">•</span>
              <div className="flex-1">{parts}</div>
            </div>
          );
        }

        return <p key={lIdx}>{parts}</p>;
      })}
    </div>
  );
}

export const LandingChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [hasUnread, setHasUnread] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([INITIAL_GREETING]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      setShowTooltip(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, messages]);

  const handleLinkClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleActionClick = (action) => {
    if (action.href) {
      if (action.href.startsWith('#')) {
        const targetId = action.href.replace('#', '');
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.location.href = action.href;
      }
    } else if (action.action) {
      if (action.action === 'query_voz') {
        handleSendMessage('¿Cómo funcionan las encuestas por voz con IA?');
      } else if (action.action === 'query_ocr') {
        handleSendMessage('¿Cómo funciona el escaneo OCR para encuestas en papel?');
      }
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendLandingMessage(text, messages);
      const botMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.answer,
        timestamp: new Date(),
        actions: response.actions,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const errorMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: 'Disculpá, hubo un problema al procesar tu consulta. Por favor probá de nuevo o contactanos directamente.',
        timestamp: new Date(),
        actions: [{ label: 'Ir al contacto', href: '#contacto' }],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleResetChat = () => {
    setMessages([
      {
        ...INITIAL_GREETING,
        id: `greeting-${Date.now()}`,
        timestamp: new Date(),
      },
    ]);
    setInputMessage('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const formatTime = (date) => {
    if (!date) return '';
    try {
      return new Date(date).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end print:hidden">
      {/* Intro Tooltip Pill */}
      {!isOpen && showTooltip && (
        <div
          role="status"
          className="mb-3 mr-1 bg-white text-slate-800 text-xs sm:text-sm font-medium px-4 py-2.5 rounded-2xl shadow-xl border border-slate-200/80 flex items-center gap-2.5 animate-bounce transition-all duration-300"
        >
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="text-left hover:text-blue-600 transition-colors"
          >
            ¿Tenés dudas? Hablá con nuestro asesor
          </button>
          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
            aria-label="Cerrar sugerencia"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Chat Window Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Ventana de chat de asesor SurveySaaS"
          className="w-96 max-w-[calc(100vw-2rem)] h-[540px] max-h-[85vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white p-3.5 px-4 flex items-center justify-between shadow-sm select-none">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 text-white shadow-inner">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span
                  className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-indigo-700 rounded-full"
                  title="En línea"
                />
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-tight text-white flex items-center gap-1.5">
                  Asesor SurveySaaS
                  <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded-full font-medium tracking-wide">
                    IA
                  </span>
                </h3>
                <p className="text-[11px] text-blue-100 flex items-center gap-1">
                  En línea • Asistente IA de Producto
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Reiniciar chat"
                aria-label="Reiniciar chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Cerrar chat"
                aria-label="Cerrar chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Action Chips Bar */}
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => handleSendMessage(action.query)}
                disabled={isLoading}
                className="text-[11px] whitespace-nowrap bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-slate-700 font-medium px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs transition-all disabled:opacity-50"
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3 shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                  }`}
                >
                  <MarkdownText
                    content={msg.text}
                    onLinkClick={handleLinkClick}
                  />

                  {/* Bot Action Buttons */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {msg.actions.map((act, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleActionClick(act)}
                          className="text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                        >
                          {act.label}
                          {act.href && act.href.startsWith('http') && (
                            <ExternalLink className="w-3 h-3 opacity-70" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2">
                <div className="bg-white border border-slate-200/80 rounded-2xl rounded-bl-xs px-3.5 py-2.5 shadow-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                </div>
                <span className="text-[11px] text-slate-400 italic">
                  SurveySaaS está escribiendo...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t border-slate-200/80 shrink-0"
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Preguntá sobre precios, canales o funciones..."
                disabled={isLoading}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 p-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center shrink-0 cursor-pointer disabled:cursor-not-allowed"
                aria-label="Enviar mensaje"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-1.5 text-center">
              <span className="text-[10px] text-slate-400 font-medium">
                SurveySaaS AI • Asesoría de producto y pre-venta
              </span>
            </div>
          </form>
        </div>
      )}

      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white w-14 h-14 rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-hidden focus:ring-4 focus:ring-blue-300"
          aria-label="Abrir asesor SurveySaaS"
        >
          <MessageSquare className="w-7 h-7" />

          {/* Sparkles icon decoration */}
          <span className="absolute -top-1 -right-1 bg-amber-400 text-white rounded-full p-1 shadow-sm">
            <Sparkles className="w-3 h-3 text-white fill-white" />
          </span>

          {/* Unread dot */}
          {hasUnread && (
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
          )}
        </button>
      )}
    </div>
  );
};

export default LandingChatbotWidget;
