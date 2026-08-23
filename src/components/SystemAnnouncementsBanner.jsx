import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { obtenerAnunciosActivos } from "../services/api";

const TYPE_CONFIG = {
  info: {
    bg: "bg-blue-50 border-blue-200 text-blue-900",
    icon: "📢",
    badge: "bg-blue-100 text-blue-800 border-blue-300",
    msgColor: "text-blue-800",
  },
  warning: {
    bg: "bg-amber-50 border-amber-200 text-amber-950",
    icon: "⚠️",
    badge: "bg-amber-100 text-amber-900 border-amber-300",
    msgColor: "text-amber-900",
  },
  error: {
    bg: "bg-red-50 border-red-200 text-red-950",
    icon: "🚨",
    badge: "bg-red-100 text-red-900 border-red-300",
    msgColor: "text-red-900",
  },
  success: {
    bg: "bg-emerald-50 border-emerald-200 text-emerald-950",
    icon: "✅",
    badge: "bg-emerald-100 text-emerald-900 border-emerald-300",
    msgColor: "text-emerald-900",
  },
};

export default function SystemAnnouncementsBanner() {
  const [anuncios, setAnuncios] = useState([]);
  const [dismissed, setDismissed] = useState(() => {
    try {
      const stored = sessionStorage.getItem("dismissed_announcements");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const fetchAnuncios = async () => {
    try {
      const data = await obtenerAnunciosActivos();
      if (Array.isArray(data)) {
        setAnuncios(data.filter((a) => a.activo !== false));
      }
    } catch (err) {
      console.error("Error al obtener anuncios del sistema:", err);
    }
  };

  useEffect(() => {
    fetchAnuncios();
  }, []);

  const handleDismiss = (id) => {
    const next = [...dismissed, id];
    setDismissed(next);
    try {
      sessionStorage.setItem("dismissed_announcements", JSON.stringify(next));
    } catch (e) {
      console.error("Error al guardar aviso cerrado:", e);
    }
  };

  const visibleAnuncios = anuncios.filter((a) => !dismissed.includes(a.id));

  if (visibleAnuncios.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-2 p-3 sm:px-6 bg-slate-100/60 border-b border-slate-200/80 animate-fade-in">
      {visibleAnuncios.map((anuncio) => {
        const config = TYPE_CONFIG[anuncio.tipo] || TYPE_CONFIG.info;

        return (
          <div
            key={anuncio.id}
            className={`rounded-2xl border px-4 py-3 shadow-xs flex items-start justify-between gap-3 transition-all ${config.bg}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl leading-none flex-shrink-0 mt-0.5" role="img" aria-label={anuncio.tipo}>
                {config.icon}
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-sm tracking-tight">{anuncio.titulo}</span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${config.badge}`}
                  >
                    {anuncio.tipo}
                  </span>
                </div>
                <p className={`text-xs sm:text-sm font-medium mt-0.5 leading-relaxed ${config.msgColor}`}>
                  {anuncio.mensaje}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleDismiss(anuncio.id)}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-black/5 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
              title="Cerrar notificación durante esta sesión"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
