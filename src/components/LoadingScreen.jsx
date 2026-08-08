import React from "react"
import { BarChart3, Loader2, ShieldCheck } from "lucide-react"

export default function LoadingScreen({ message = "Cargando aplicación..." }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/60 to-indigo-50 backdrop-blur-sm">
      {/* Container Card with Glassmorphism */}
      <div className="relative flex flex-col items-center p-8 sm:p-10 bg-white/80 backdrop-blur-md border border-white/60 shadow-2xl shadow-blue-500/10 rounded-3xl max-w-sm w-full mx-4 text-center animate-fade-in">
        
        {/* Pulsating Glowing Logo Container */}
        <div className="relative flex items-center justify-center mb-6">
          {/* Animated Background Ring */}
          <div className="absolute inset-0 rounded-2xl bg-blue-600/20 animate-ping opacity-75"></div>
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-600 opacity-20 blur-md animate-pulse"></div>
          
          {/* Brand Logo Box */}
          <div className="relative w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 text-white">
            <BarChart3 className="w-9 h-9" />
          </div>
        </div>

        {/* Brand Name */}
        <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent tracking-tight">
          SurveySaaS
        </h2>

        {/* Animated Spinner with Custom Ring */}
        <div className="mt-6 mb-3 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          <span className="text-sm font-semibold text-slate-700">{message}</span>
        </div>

        {/* Subtitle / Micro status */}
        <p className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5 mt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
          Conexión segura y verificada
        </p>

        {/* Progress Bar Line */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-[pulse_1.5s_infinite] w-3/4"></div>
        </div>
      </div>
    </div>
  )
}
