import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Smartphone,
  Download,
  QrCode,
  WifiOff,
  Camera,
  Mic,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  ArrowRight,
  Info,
  HelpCircle,
  FileCheck2,
  Sparkles,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";

export default function DownloadAppPage() {
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const apkUrl = "/downloads/surveysaas.apk";
  const fullApkUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${apkUrl}`
      : "https://surveysaas.com/downloads/surveysaas.apk";

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    fullApkUrl
  )}&format=png&margin=10`;

  const handleCopyLink = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullApkUrl);
      }
      setCopied(true);
      toast.success("Enlace de descarga copiado al portapapeles");
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error("Error al copiar enlace:", err);
      toast.error("No se pudo copiar el enlace");
    }
  };

  const steps = [
    {
      step: "01",
      title: "Descargar archivo APK",
      desc: "Haz clic en 'Descargar APK' o escanea el código QR desde tu smartphone Android. La descarga del archivo surveysaas.apk comenzará automáticamente.",
      tip: "El archivo pesa ~51.6 MB y contiene todas las librerías offline y modelos locales.",
    },
    {
      step: "02",
      title: "Permitir Fuentes Desconocidas",
      desc: "Al abrir el archivo, Android podría mostrar un aviso de seguridad. Toca 'Configuración' y activa la opción 'Permitir desde esta fuente' (o 'Instalar apps desconocidas') para tu navegador.",
      tip: "Esta es la distribución oficial directa de Desesoft para empresas y operadores autorizados.",
    },
    {
      step: "03",
      title: "Instalar y Comenzar a Encuestar",
      desc: "Pulsa 'Instalar'. Una vez completada la instalación, abre SurveySaaS Mobile e inicia sesión con tus credenciales de operador o suscriptor. ¡Ya puedes trabajar sin internet!",
      tip: "Tus datos se sincronizarán automáticamente cada vez que el dispositivo detecte WiFi o señal móvil.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <PublicNavbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headlines & Download CTA */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>SurveySaaS Mobile • Android APK v1.0.0 Oficial</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                  Encuestas en Terreno con{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400">
                    Modo Offline
                  </span>{" "}
                  e Inteligencia Artificial
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                  Lleva la recolección de datos a cualquier lugar. Registra respuestas sin
                  conexión, digitaliza formularios en papel con OCR instantáneo y graba
                  notas de voz con transcripción automática para tu equipo de campo.
                </p>

                {/* Main Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <a
                    href={apkUrl}
                    download="SurveySaaS-App-v1.0.apk"
                    className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-base shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-[0.98] transition-all cursor-pointer group"
                  >
                    <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                    <span>Descargar APK Android</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/20">
                      51.6 MB
                    </span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-sm backdrop-blur-md transition-all active:scale-[0.98] cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>¡Enlace copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-300" />
                        <span>Copiar Enlace Directo</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Compatibility Badges */}
                <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Compatible con Android 7.0 (API 24+)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    <span>APK verificado y firmado</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <WifiOff className="w-4 h-4 text-teal-400" />
                    <span>100% Funcional sin Internet</span>
                  </div>
                </div>
              </div>

              {/* Right Column: QR Code Box & Visual Device Frame */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-sm bg-white/95 rounded-3xl p-6 shadow-2xl border border-slate-100 text-slate-900 relative">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold">Escanea y Descarga</h2>
                        <p className="text-[11px] text-slate-500">Abre la cámara de tu Android</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      APK Directo
                    </span>
                  </div>

                  {/* QR Image Display */}
                  <div className="my-5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center">
                    <img
                      src={qrImageUrl}
                      alt="Código QR de Descarga APK SurveySaaS"
                      className="w-48 h-48 rounded-xl object-contain shadow-xs"
                      onError={(e) => {
                        // Graceful fallback to simple placeholder if external QR API is unreachable
                        e.currentTarget.style.display = "none";
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const fallback = document.createElement("div");
                          fallback.className = "w-48 h-48 flex flex-col items-center justify-center text-center p-2 text-slate-400";
                          fallback.innerHTML = `<span class="text-xs font-semibold text-slate-600">Escanea la URL</span><span class="text-[10px] font-mono break-all text-slate-500 mt-1">${apkUrl}</span>`;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  </div>

                  <p className="text-center text-xs text-slate-600 leading-relaxed px-2">
                    Apunta con la cámara de tu teléfono para descargar el archivo de instalación sin necesidad de cables.
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                    <a
                      href={apkUrl}
                      download="SurveySaaS-App-v1.0.apk"
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>¿Prefieres descarga directa? Pulsa aquí</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              Capacidades Móviles
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mt-3">
              Diseñada específicamente para trabajo de campo
            </h2>
            <p className="text-base text-slate-600 mt-2">
              Todo lo que tus encuestadores necesitan para levantar datos confiables, incluso en las condiciones más exigentes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Offline First */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center">
                <WifiOff className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Modo Offline First</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Almacena encuestas y respuestas en base de datos local SQLite. Cuando el dispositivo vuelve a tener señal, se sincronizan con la nube de forma transparente.
              </p>
            </div>

            {/* Card 2: OCR Papel */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Digitalización OCR Papel</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Toma fotos de formularios impresos y digitaliza opciones marcadas y texto manuscrito directamente al formato digital con inteligencia artificial.
              </p>
            </div>

            {/* Card 3: Encuestas por Voz */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Respuestas por Audio</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Graba entrevistas orales con compresión optimizada en formato WAV/AAC. Los audios se transcriben y analizan con modelos de lenguaje.
              </p>
            </div>

            {/* Card 4: Seguridad y Sincronización */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Seguridad & RBAC</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Acceso restringido para operadores y empresas mediante tokens JWT cifrados. Solo se visualizan las campañas y plantillas asignadas.
              </p>
            </div>
          </div>
        </section>

        {/* STEP BY STEP INSTALLATION GUIDE */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-100/70 border-y border-slate-200">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                Instalación Sencilla
              </span>
              <h2 className="text-3xl font-bold text-slate-900 mt-3">
                ¿Cómo instalar la APK en tu dispositivo Android?
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Sigue estos 3 sencillos pasos para tener la aplicación lista en menos de 2 minutos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((item, idx) => (
                <div
                  key={item.step}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-blue-600">{item.step}</span>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Paso {idx + 1}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
                    <Info className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>{item.tip}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Security note */}
            <div className="mt-8 p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-900 text-xs flex items-start gap-3">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Aviso sobre "Fuentes Desconocidas":</strong>
                <span className="ml-1 text-slate-700">
                  Android cataloga como "fuente desconocida" cualquier aplicación instalada fuera de Google Play Store. SurveySaaS Mobile es distribuida directamente por Desesoft para garantizar la versión más actualizada y segura para nuestros suscriptores corporativos.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* TECHNICAL DETAILS & SPECS */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>Ficha Técnica de la Aplicación</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Versión Actual
                </span>
                <p className="text-base font-bold text-slate-900 mt-1">1.0.0 (Release)</p>
                <span className="text-[10px] text-emerald-600 font-medium">Build Estable</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Tamaño de Descarga
                </span>
                <p className="text-base font-bold text-slate-900 mt-1">51.6 MB (.apk)</p>
                <span className="text-[10px] text-slate-500 font-medium">Incluye motor offline</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Compatibilidad OS
                </span>
                <p className="text-base font-bold text-slate-900 mt-1">Android 7.0+</p>
                <span className="text-[10px] text-slate-500 font-medium">API Level 24 a 34</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Tecnología
                </span>
                <p className="text-base font-bold text-slate-900 mt-1">Flutter 3 & SQLite</p>
                <span className="text-[10px] text-slate-500 font-medium">Desesoft Bolivia</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>¿Necesitas asistencia técnica o soporte para tu equipo?</span>
              </div>
              <Link
                to="/soporte"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 transition-colors"
              >
                <span>Ir al Centro de Ayuda</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
