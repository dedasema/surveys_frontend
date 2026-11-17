

import { useState, useEffect } from "react"
import {
  FileText,
  Brain,
  MessageSquare,
  Zap,
  Shield,
  Users,
  TrendingUp,
  CheckCircle,
  Star,
  ArrowRight,
  Sparkles,
  Mail,
  Smartphone,
  Download,
  WifiOff,
  QrCode,
} from "lucide-react"
import { useAuth } from "../context/AuthContext";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import { obtenerPlanesPublicos } from "../services/api";
import { isTokenExpired, redirectBasedOnRole } from "../services/auth";
import { LandingChatbotWidget } from "../features/landing-chatbot";

const DEFAULT_PLANES = [
  {
    id: 1,
    nombre: "Gratuito",
    precio_mensual: "0.00",
    descripcion: "Plan básico gratuito de prueba para comenzar",
    max_plantillas: 3,
    max_campanas: 2,
    max_entregas: 100,
    max_operadores: 1,
    permite_email: true,
    permite_audio_voz: true,
    permite_papel: true,
    permite_ia_analisis: false,
    caracteristicas: "3 Plantillas de Encuestas;100 Respuestas / mes;1 Operador de Equipo;Canal Email y Enlaces Web;Prueba de OCR e IA",
  },
  {
    id: 2,
    nombre: "Profesional",
    precio_mensual: "29.99",
    descripcion: "Plan profesional con funciones avanzadas e IA",
    max_plantillas: 50,
    max_campanas: 50,
    max_entregas: 5000,
    max_operadores: 5,
    permite_email: true,
    permite_audio_voz: true,
    permite_papel: true,
    permite_ia_analisis: true,
    caracteristicas: "50 Plantillas de Encuestas;5.000 Respuestas / mes;5 Operadores de Equipo;OCR Papel con IA;Audio / Voz con IA;Análisis Avanzado con IA",
  },
  {
    id: 3,
    nombre: "Enterprise",
    precio_mensual: "99.99",
    descripcion: "Plan empresarial ilimitado para organizaciones",
    max_plantillas: -1,
    max_campanas: -1,
    max_entregas: -1,
    max_operadores: -1,
    permite_email: true,
    permite_audio_voz: true,
    permite_papel: true,
    permite_ia_analisis: true,
    caracteristicas: "Plantillas Ilimitadas;Respuestas Ilimitadas;Operadores Ilimitados;OCR Papel y Asistente de Voz;API y Exportación Completa;Soporte Prioritario y SLA",
  },
]

const LandingPage = () => {
  const [email, setEmail] = useState("")
  const [planes, setPlanes] = useState(DEFAULT_PLANES)
  const { isAuthenticated, user } = useAuth();

  const isUserLoggedIn =
    isAuthenticated ||
    Boolean(
      localStorage.getItem("token") &&
        !isTokenExpired(localStorage.getItem("token"))
    );

  const getTargetDashboard = () => {
    if (user) return redirectBasedOnRole(user);
    const cached = localStorage.getItem("user");
    if (cached) {
      try {
        return redirectBasedOnRole(JSON.parse(cached));
      } catch (e) {
        console.warn(e);
      }
    }
    return "/dashboard-suscriptor/plantillas";
  };
  const targetDashboard = getTargetDashboard();

  useEffect(() => {
    let isMounted = true
    const fetchPlanes = async () => {
      try {
        const data = await obtenerPlanesPublicos()
        if (isMounted && data && data.length > 0) {
          const sorted = [...data].sort(
            (a, b) => Number(a.precio_mensual || 0) - Number(b.precio_mensual || 0)
          )
          setPlanes(sorted)
        }
      } catch (err) {
        console.warn("Error cargando planes en landing:", err)
      }
    }
    fetchPlanes()
    return () => {
      isMounted = false
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log("Email submitted:", email)
    setEmail("")
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col justify-between">
      <PublicNavbar />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-6">
                <Zap className="h-4 w-4 mr-1" />
                Automatización Inteligente
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Transforma tus
                <span className="text-blue-600"> datos </span>
                en decisiones
                <span className="text-purple-600"> inteligentes</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Unifica la recolección multicanal de datos y el procesamiento de documentos con IA y OCR, optimizando
                decisiones estratégicas para tu organización.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={isUserLoggedIn ? targetDashboard : "/register"}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center"
                >
                  {isUserLoggedIn ? "Ir a mi dashboard" : "Comenzar gratis ahora"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
                <a
                  href="#funcionalidades"
                  className="border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all flex items-center justify-center"
                >
                  Ver funcionalidades
                </a>
              </div>
              <div className="mt-8 flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Sin configuración compleja
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Soporte 24/7
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Dashboard en Tiempo Real</h3>
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-blue-100 h-4 rounded w-full"></div>
                    <div className="bg-purple-100 h-4 rounded w-3/4"></div>
                    <div className="bg-green-100 h-4 rounded w-1/2"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-blue-600 mb-2" />
                      <div className="text-2xl font-bold text-gray-900">+127%</div>
                      <div className="text-sm text-gray-600">Eficiencia</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <Users className="h-8 w-8 text-purple-600 mb-2" />
                      <div className="text-2xl font-bold text-gray-900">50K+</div>
                      <div className="text-sm text-gray-600">Respuestas</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FUNCIONALIDADES */}
      <section id="funcionalidades" className="py-20 px-4 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Funcionalidades Poderosas</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Todo lo que necesitas para automatizar la recolección y procesamiento de datos en una sola plataforma
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Encuestas Multicanal</h3>
              <p className="text-gray-600 mb-4">
                Distribuye encuestas por correo, voz, papel o web. Datos centralizados en tiempo real.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Asistente Inteligente por Voz e IA
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Campañas de email automatizadas
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Apps móviles nativas
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Procesamiento de Documentos</h3>
              <p className="text-gray-600 mb-4">
                Digitaliza, extrae y organiza información desde imágenes o PDF escaneados usando OCR avanzado.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  OCR con 99.5% precisión
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Procesamiento por lotes
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Múltiples formatos
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Modelos de IA</h3>
              <p className="text-gray-600 mb-4">
                Clasificación automática, análisis semántico y generación de reportes usando aprendizaje automático.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Análisis de sentimientos
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Clasificación automática
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Reportes inteligentes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section id="beneficios" className="py-20 px-4 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Acelera tus decisiones con datos precisos</h2>
              <p className="text-xl text-gray-600 mb-8">
                Reduce el tiempo de procesamiento de datos de semanas a minutos con nuestra plataforma de automatización
                inteligente.
              </p>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-1">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Automatización Completa</h3>
                    <p className="text-gray-600">
                      Elimina tareas manuales repetitivas y enfócate en el análisis estratégico.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-purple-600 w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-1">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Seguridad Empresarial</h3>
                    <p className="text-gray-600">
                      Cumplimiento GDPR y encriptación de extremo a extremo para proteger tus datos.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-600 w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-1">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Escalabilidad Ilimitada</h3>
                    <p className="text-gray-600">Crece sin límites, desde startups hasta empresas Fortune 500.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="Dashboard Analytics"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Procesando en tiempo real</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN APP MÓVIL (APK ANDROID & MODO OFFLINE) */}
      <section id="app-movil" className="py-20 px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white scroll-mt-20 relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Texto y CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Aplicación Android Oficial • APK v1.0.0</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Lleva tus encuestas a terreno con el{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400">
                  Modo 100% Offline
                </span>
              </h2>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Diseñada para operadores de campo y censistas. Recolecta respuestas sin conexión a internet, digitaliza formularios físicos con OCR de cámara y graba respuestas de voz en alta fidelidad.
              </p>

              {/* Pills de características */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300">
                    <WifiOff className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Base SQLite Offline</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Sincronización automática al detectar red WiFi o datos móviles.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">OCR de Formularios</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Escanea papel desde la cámara y digitaliza campos en segundos.</p>
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="pt-3 flex flex-wrap items-center gap-4">
                <a
                  href="/downloads/surveysaas.apk"
                  download="SurveySaaS-App-v1.0.apk"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                  <span>Descargar APK (Android)</span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/20">51.6 MB</span>
                </a>

                <a
                  href="/descargar-app"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-sm transition-all"
                >
                  <span>Guía de instalación y QR</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </a>
              </div>
            </div>

            {/* Tarjeta Visual de Descarga con QR */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm bg-slate-900/90 rounded-3xl p-6 border border-slate-700/80 shadow-2xl backdrop-blur-md text-white text-center space-y-4">
                <div className="inline-flex p-3 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-300 mx-auto">
                  <QrCode className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Escanea desde tu Celular</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Descarga directa a tu teléfono sin pasar por una computadora
                  </p>
                </div>

                <div className="p-3 bg-white rounded-2xl inline-block mx-auto shadow-md">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https%3A%2F%2Fsurveysaas.com%2Fdownloads%2Fsurveysaas.apk&format=png&margin=10"
                    alt="QR Descarga APK"
                    className="w-40 h-40 rounded-lg object-contain"
                  />
                </div>

                <div className="pt-2 text-xs text-slate-400">
                  <span>Compatible con Android 7.0 o superior</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section id="testimonios" className="py-20 px-4 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Lo que dicen nuestros clientes</h2>
            <p className="text-xl text-gray-600">Más de 500 empresas confían en nuestra plataforma</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "SurveySaaS transformó completamente nuestra forma de recolectar encuestas en campo. La digitalización OCR nos ahorró incontables horas de transcripción manual."
              </p>
              <div>
                <h4 className="font-semibold text-gray-900">María González</h4>
                <p className="text-sm text-gray-500">Directora de Investigación, DataCorp</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "La integración multicanal es fantástica. Podemos llegar a nuestros clientes por correo, enlaces web y llamadas de voz automatizadas con IA desde un único panel."
              </p>
              <div>
                <h4 className="font-semibold text-gray-900">Carlos Rodríguez</h4>
                <p className="text-sm text-gray-500">Gerente de Operaciones, GlobalRetail</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "El soporte técnico y la facilidad para crear encuestas personalizadas nos permitieron desplegar campañas complejas en cuestión de minutos."
              </p>
              <div>
                <h4 className="font-semibold text-gray-900">Ana Martínez</h4>
                <p className="text-sm text-gray-500">Líder de Experiencia de Cliente, InnovaTech</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRECIOS */}
      <section id="precios" className="py-20 px-4 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-3.5 py-1 rounded-full text-sm font-medium mb-3">
              <Sparkles className="h-4 w-4 mr-1.5 text-blue-600" />
              Precios Transparentes
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">Planes que se adaptan a tu negocio</h2>
            <p className="text-xl text-gray-600">Comienza gratis y escala según tus necesidades de recolección y análisis</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {planes.map((plan, index) => {
              const precioNum = Number(plan.precio_mensual || 0)
              const isPopular =
                plan.nombre?.toLowerCase().includes("profesional") ||
                plan.nombre?.toLowerCase().includes("pro") ||
                (planes.length === 3 && index === 1)
              const featuresList = plan.caracteristicas
                ? plan.caracteristicas.split(";").map((f) => f.trim()).filter(Boolean)
                : []

              return (
                <div
                  key={plan.id || index}
                  className={`relative flex flex-col rounded-3xl transition-all duration-300 p-8 ${
                    isPopular
                      ? "bg-blue-600 text-white shadow-xl lg:-translate-y-2 border-2 border-blue-500"
                      : "bg-white text-gray-900 shadow-sm hover:shadow-md border border-gray-200"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-950 px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Más Popular
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className={`text-2xl font-bold mb-2 ${isPopular ? "text-white" : "text-gray-900"}`}>
                      {plan.nombre}
                    </h3>
                    <p className={`text-sm min-h-[40px] leading-relaxed ${isPopular ? "text-blue-100" : "text-gray-500"}`}>
                      {plan.descripcion || "Plan para optimizar la gestión de tus encuestas"}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1.5 mb-8 pb-6 border-b border-dashed border-gray-200/40">
                    <span className="text-4xl lg:text-5xl font-black tracking-tight">
                      {precioNum === 0 ? "Gratis" : `$${precioNum.toFixed(2).replace(/\.00$/, "")}`}
                    </span>
                    {precioNum > 0 && (
                      <span className={`text-sm font-medium ${isPopular ? "text-blue-100" : "text-gray-500"}`}>
                        /mes USD
                      </span>
                    )}
                  </div>

                  {/* Cuotas y límites */}
                  <div className="space-y-3 mb-8 flex-1">
                    <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${isPopular ? "text-blue-200" : "text-gray-400"}`}>
                      Incluye:
                    </p>

                    {featuresList.length > 0 ? (
                      featuresList.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start text-sm">
                          <CheckCircle
                            className={`h-5 w-5 mr-3 flex-shrink-0 mt-0.5 ${
                              isPopular ? "text-yellow-300" : "text-emerald-500"
                            }`}
                          />
                          <span className={isPopular ? "text-blue-50" : "text-gray-700"}>{feat}</span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-center text-sm">
                          <CheckCircle
                            className={`h-5 w-5 mr-3 flex-shrink-0 ${
                              isPopular ? "text-yellow-300" : "text-emerald-500"
                            }`}
                          />
                          <span className={isPopular ? "text-blue-50" : "text-gray-700"}>
                            {plan.max_plantillas === -1 ? "Plantillas Ilimitadas" : `Hasta ${plan.max_plantillas} plantillas`}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CheckCircle
                            className={`h-5 w-5 mr-3 flex-shrink-0 ${
                              isPopular ? "text-yellow-300" : "text-emerald-500"
                            }`}
                          />
                          <span className={isPopular ? "text-blue-50" : "text-gray-700"}>
                            {plan.max_entregas === -1
                              ? "Respuestas Ilimitadas"
                              : `Hasta ${Number(plan.max_entregas).toLocaleString()} respuestas/mes`}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CheckCircle
                            className={`h-5 w-5 mr-3 flex-shrink-0 ${
                              isPopular ? "text-yellow-300" : "text-emerald-500"
                            }`}
                          />
                          <span className={isPopular ? "text-blue-50" : "text-gray-700"}>
                            {plan.max_operadores === -1
                              ? "Operadores Ilimitados"
                              : `${plan.max_operadores} Operador(es) de equipo`}
                          </span>
                        </div>
                        {plan.permite_audio_voz && (
                          <div className="flex items-center text-sm">
                            <CheckCircle
                              className={`h-5 w-5 mr-3 flex-shrink-0 ${
                                isPopular ? "text-yellow-300" : "text-emerald-500"
                              }`}
                            />
                            <span className={isPopular ? "text-blue-50" : "text-gray-700"}>Encuestas por Voz e IA</span>
                          </div>
                        )}
                        {plan.permite_papel && (
                          <div className="flex items-center text-sm">
                            <CheckCircle
                              className={`h-5 w-5 mr-3 flex-shrink-0 ${
                                isPopular ? "text-yellow-300" : "text-emerald-500"
                              }`}
                            />
                            <span className={isPopular ? "text-blue-50" : "text-gray-700"}>
                              OCR y Digitalización de Papel
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <a
                    href={
                      isAuthenticated
                        ? user?.tipo === "admin"
                          ? "/dashboard/planes"
                          : "/dashboard-suscriptor/planes"
                        : "/register"
                    }
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-center transition-all block shadow-xs ${
                      isPopular
                        ? "bg-white hover:bg-gray-50 text-blue-700 hover:shadow-md"
                        : precioNum === 0
                        ? "bg-gray-100 hover:bg-gray-200 text-gray-900"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {isAuthenticated
                      ? "Ver Planes en Dashboard"
                      : precioNum === 0
                      ? "Comenzar gratis"
                      : "Comenzar prueba"}
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            ¿Listo para transformar tus decisiones con datos reales?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a más de 500 empresas que ya están automatizando sus procesos de datos. Comienza tu prueba gratuita
            hoy mismo.
          </p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
            <div className="flex gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@empresa.com"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
                required
              />
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Comenzar
              </button>
            </div>
          </form>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={isUserLoggedIn ? targetDashboard : "/register"}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center shadow-md"
            >
              {isUserLoggedIn ? "Ir a mi dashboard" : "Comenzar prueba gratuita"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href="#contacto"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
            >
              Solicitar demo personalizada
            </a>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="py-20 px-4 bg-white scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Hablemos de tu proyecto</h2>
            <p className="text-xl text-gray-600">
              Nuestro equipo de expertos está listo para ayudarte a implementar la solución perfecta
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-6">Información de contacto</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-blue-600 mr-3" />
                  <span>contacto@surveysaas.com</span>
                </div>
                <div className="flex items-center">
                  <Smartphone className="h-5 w-5 text-blue-600 mr-3" />
                  <span>+34 900 123 456</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-blue-600 mr-3" />
                  <span>Soporte 24/7 en línea</span>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-semibold mb-4">Horarios de atención</h4>
                <div className="text-gray-600 space-y-1">
                  <div>Lunes - Viernes: 9:00 - 18:00</div>
                  <div>Sábados: 10:00 - 14:00</div>
                  <div>Soporte técnico 24/7</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email empresarial</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tu@empresa.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Empresa</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nombre de tu empresa"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Cuéntanos sobre tu proyecto..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Enviar mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <PublicFooter />

      {/* LANDING CHATBOT WIDGET */}
      <LandingChatbotWidget />
    </div>
  )
}

export default LandingPage
