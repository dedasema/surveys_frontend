import React, { useEffect, useState } from "react";
import { LogOut, ShieldAlert } from "lucide-react";

export default function ImpersonationBanner() {
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedEmail, setImpersonatedEmail] = useState("");

  const checkImpersonation = () => {
    const backup = localStorage.getItem("superadmin_token_backup");
    const email = localStorage.getItem("impersonated_email");
    if (backup) {
      setIsImpersonating(true);
      setImpersonatedEmail(email || "Empresa / Cliente");
    } else {
      setIsImpersonating(false);
      setImpersonatedEmail("");
    }
  };

  useEffect(() => {
    checkImpersonation();
    const interval = setInterval(checkImpersonation, 1000);
    window.addEventListener("storage", checkImpersonation);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", checkImpersonation);
    };
  }, []);

  const handleExitImpersonation = () => {
    const backup = localStorage.getItem("superadmin_token_backup");
    if (backup) {
      localStorage.setItem("token", backup);
    }
    localStorage.removeItem("superadmin_token_backup");
    localStorage.removeItem("impersonated_email");
    setIsImpersonating(false);
    window.location.href = "/dashboard/suscriptores";
  };

  if (!isImpersonating) return null;

  return (
    <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white px-4 py-2.5 shadow-lg sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-orange-700 animate-fade-in">
      <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold max-w-4xl truncate">
        <ShieldAlert className="w-5 h-5 flex-shrink-0 animate-bounce" />
        <span className="truncate">
          ⚠️ <strong>Modo Soporte Activo:</strong> Estás navegando con acceso directo a la cuenta de{" "}
          <span className="underline font-bold">{impersonatedEmail}</span>.
        </span>
      </div>

      <button
        onClick={handleExitImpersonation}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-red-700 hover:bg-red-50 text-xs font-bold rounded-lg shadow-sm transition-all hover:scale-105 active:scale-95 flex-shrink-0 cursor-pointer"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Salir del Modo Soporte</span>
      </button>
    </div>
  );
}
