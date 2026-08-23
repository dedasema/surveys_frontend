import React, { useEffect, useState } from "react";
import { Info, AlertTriangle, AlertCircle, CheckCircle2, X } from "lucide-react";
import { obtenerAnunciosActivos } from "../services/api";

const TYPE_STYLES = {
  info: {
    bg: "bg-blue-600 text-white border-blue-700",
    icon: <Info className="w-5 h-5 flex-shrink-0 text-blue-200" />,
    badge: "bg-blue-500/40 text-blue-100",
  },
  warning: {
    bg: "bg-amber-500 text-slate-950 border-amber-600",
    icon: <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-900" />,
    badge: "bg-amber-600/30 text-amber-950",
  },
  error: {
    bg: "bg-red-600 text-white border-red-700",
    icon: <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-200" />,
    badge: "bg-red-500/40 text-red-100",
  },
  success: {
    bg: "bg-emerald-600 text-white border-emerald-700",
    icon: <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-200" />,
    badge: "bg-emerald-500/40 text-emerald-100",
  },
};

export default function GlobalAnnouncementBanner() {
  const [anuncios, setAnuncios] = useState([]);
  const [dismissed, setDismissed] = useState(() => {
    try {
      const stored = sessionStorage.getItem("dismissed_announcements");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const loadAnuncios = async () => {
    try {
      const data = await obtenerAnunciosActivos();
      if (Array.isArray(data)) {
        setAnuncios(data.filter((a) => a.activo !== false));
      }
    } catch (err) {
      console.error("Error al cargar anuncios globales:", err);
    }
  };

  useEffect(() => {
    loadAnuncios();
  }, []);

  const handleDismiss = (id) => {
    const next = [...dismissed, id];
    setDismissed(next);
    try {
      sessionStorage.setItem("dismissed_announcements", JSON.stringify(next));
    } catch (e) {
      console.error("Error saving dismissed announcements:", e);
    }
  };

  const visibleAnuncios = anuncios.filter((a) => !dismissed.includes(a.id));

  if (visibleAnuncios.length === 0) return null;

  return (
    <div className="space-y-1">
      {visibleAnuncios.map((anuncio) => {
        const style = TYPE_STYLES[anuncio.tipo] || TYPE_STYLES.info;

        return (
          <div
            key={anuncio.id}
            className={`${style.bg} px-4 py-3 border-b shadow-md flex items-center justify-between gap-4 animate-fade-in transition-all`}
          >
            <div className="flex items-center gap-3 text-xs sm:text-sm font-medium overflow-hidden">
              {style.icon}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="font-extrabold uppercase tracking-wider text-[11px] px-2 py-0.5 rounded-md bg-black/15 inline-block">
                  {anuncio.titulo}
                </span>
                <span className="truncate">{anuncio.mensaje}</span>
              </div>
            </div>

            <button
              onClick={() => handleDismiss(anuncio.id)}
              className="p-1 hover:bg-black/20 rounded-lg transition-colors flex-shrink-0 cursor-pointer text-current"
              title="Cerrar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
