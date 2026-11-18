import { BarChart3, ArrowLeft, Mail, FileText, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import BrandLogo from "../components/BrandLogo"

const EmailSentPage = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate("/")
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen flex flex-col justify-between">
      {/* NAVIGATION */}
      <nav className="bg-white/80 backdrop-blur-md shadow-xs border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <BrandLogo size="md" />
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner border border-blue-100">
            <Mail className="h-8 w-8 animate-bounce" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              ¡Revisa tu bandeja de entrada!
            </h2>
            <p className="text-gray-600 text-sm mt-2 leading-relaxed">
              Para garantizar la validez y existencia de tu correo, hemos emitido <strong>3 mensajes de confirmación y bienvenida</strong> a tu casilla:
            </p>
          </div>

          {/* 3 Emails list */}
          <div className="text-left space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
            <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-xs">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                1
              </span>
              <div>
                <strong className="text-gray-900 block font-semibold">Términos y Condiciones</strong>
                <span className="text-gray-500">Confirmación de aceptación legal con enlace directo a los términos.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-xs">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                2
              </span>
              <div>
                <strong className="text-gray-900 block font-semibold">Política de Privacidad</strong>
                <span className="text-gray-500">Confirmación de tratamiento ético de datos y enlace a la política.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-xs">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                3
              </span>
              <div>
                <strong className="text-gray-900 block font-semibold">Bienvenida y Enlace al Software</strong>
                <span className="text-gray-500">Credenciales de acceso para activar tu cuenta e ingresar al SaaS.</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 italic">
            ¿No ves los correos? Revisa tu carpeta de spam o correo no deseado.
          </p>

          <button
            onClick={handleGoHome}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver a la página principal</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmailSentPage
