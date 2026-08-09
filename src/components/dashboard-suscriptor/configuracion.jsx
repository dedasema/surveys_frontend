"use client"

import { useState, useEffect } from "react"
import DashboardSuscriptorLayout from "./layout"
import { getMe, getMiSuscripcion } from "../../services/api"
import { getCurrentUser } from "../../services/auth"
import {
  Building,
  Mail,
  Phone,
  Lock,
  Bell,
  CreditCard,
  CheckCircle2,
  Shield,
  Save,
  Key,
  Globe,
  Zap,
  Sliders
} from "lucide-react"

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState("perfil")
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [suscriptor, setSuscriptor] = useState(null)
  const [suscripcionActual, setSuscripcionActual] = useState(null)

  // Profile state
  const [profileData, setProfileData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    sitioWeb: "https://miempresa.com",
    direccion: "Av. Principal 123",
  })

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState("")

  // Notification state
  const [notifications, setNotifications] = useState({
    emailOnResponse: true,
    emailOnDeliveryFailure: true,
    weeklyReport: false,
    marketingUpdates: true,
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const meData = await getMe().catch(() => null)
        if (meData) {
          setSuscriptor(meData)
        }
        const subData = await getMiSuscripcion().catch(() => null)
        if (subData) {
          setSuscripcionActual(subData)
        }
        const user = await getCurrentUser().catch(() => null)
        if (user || meData) {
          const current = user || meData
          setProfileData((prev) => ({
            ...prev,
            nombre: current.nombre || "",
            email: current.email || "",
            telefono: current.telefono || "",
          }))
        }
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [])

  const handleProfileSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage("")

    setTimeout(() => {
      setLoading(false)
      setSuccessMessage("Perfil de la empresa actualizado correctamente.")
    }, 600)
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    setPasswordError("")
    setSuccessMessage("")

    if (passwordData.newPassword.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres.")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Las contraseñas no coinciden.")
      return
    }

    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setSuccessMessage("Contraseña modificada exitosamente.")
    }, 600)
  }

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
    setSuccessMessage("Preferencias de notificaciones guardadas.")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const tabs = [
    { id: "perfil", label: "Perfil de Empresa", icon: Building },
    { id: "seguridad", label: "Seguridad y Clave", icon: Lock },
    { id: "notificaciones", label: "Notificaciones", icon: Bell },
    { id: "suscripcion", label: "Plan y Facturación", icon: CreditCard },
  ]

  return (
    <DashboardSuscriptorLayout activeSection="configuracion">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Sliders className="h-7 w-7 text-blue-600" />
              Configuración de la Cuenta
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Administra la información de tu empresa, preferencias de seguridad y suscripción
            </p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <Shield className="h-4 w-4" />
            Estado: {suscriptor?.estado || "Activo"}
          </div>
        </div>

        {/* Global Success Banner */}
        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 animate-fade-in shadow-sm">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <span className="text-sm font-medium">{successMessage}</span>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200 flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setSuccessMessage("")
                  }}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? "border-blue-600 text-blue-600 bg-blue-50/50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div className="p-6 md:p-8">
            {/* TAB 1: PERFIL */}
            {activeTab === "perfil" && (
              <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Información General</h3>
                  <p className="text-sm text-gray-500">Actualiza los datos principales de tu organización</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Empresa</label>
                    <div className="relative">
                      <Building className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={profileData.nombre}
                        onChange={(e) => setProfileData({ ...profileData, nombre: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Nombre de la empresa"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                    <div className="relative">
                      <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="contacto@empresa.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono de Contacto</label>
                    <div className="relative">
                      <Phone className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        value={profileData.telefono}
                        onChange={(e) => setProfileData({ ...profileData, telefono: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="+591 70000000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sitio Web</label>
                    <div className="relative">
                      <Globe className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={profileData.sitioWeb}
                        onChange={(e) => setProfileData({ ...profileData, sitioWeb: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="https://empresa.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {loading ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: SEGURIDAD */}
            {activeTab === "seguridad" && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-xl">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Cambiar Contraseña</h3>
                  <p className="text-sm text-gray-500">Asegúrate de usar una contraseña fuerte y segura</p>
                </div>

                {passwordError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                    {passwordError}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña Actual</label>
                    <div className="relative">
                      <Key className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
                    <div className="relative">
                      <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nueva Contraseña</label>
                    <div className="relative">
                      <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
                  >
                    <Lock className="h-4 w-4" />
                    {loading ? "Actualizando..." : "Actualizar Contraseña"}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: NOTIFICACIONES */}
            {activeTab === "notificaciones" && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Preferencias de Alertas y Correos</h3>
                  <p className="text-sm text-gray-500">Configura cuándo y cómo querés recibir notificaciones del sistema</p>
                </div>

                <div className="divide-y divide-gray-100">
                  <div className="py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Notificación al recibir respuestas</p>
                      <p className="text-xs text-gray-500">Recibí un email instantáneo cada vez que un encuestado complete una encuesta</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailOnResponse}
                      onChange={() => handleNotificationToggle("emailOnResponse")}
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer"
                    />
                  </div>

                  <div className="py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Alertas de entregas fallidas</p>
                      <p className="text-xs text-gray-500">Notificar si un envío de correo o SMS rebotó o tuvo error</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailOnDeliveryFailure}
                      onChange={() => handleNotificationToggle("emailOnDeliveryFailure")}
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer"
                    />
                  </div>

                  <div className="py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Reporte semanal consolidado</p>
                      <p className="text-xs text-gray-500">Recibir un resumen semanal por email con estadísticas de tus campañas</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.weeklyReport}
                      onChange={() => handleNotificationToggle("weeklyReport")}
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer"
                    />
                  </div>

                  <div className="py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Novedades y actualizaciones de producto</p>
                      <p className="text-xs text-gray-500">Mantenerte al tanto de nuevas funcionalidades en SurveySaaS</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.marketingUpdates}
                      onChange={() => handleNotificationToggle("marketingUpdates")}
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PLAN Y SUSCRIPCIÓN */}
            {activeTab === "suscripcion" && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Detalles de tu Suscripción</h3>
                  <p className="text-sm text-gray-500">Gestiona tu plan actual y capacidad de envíos</p>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-6 shadow-md">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
                        Plan Actual
                      </span>
                      <h4 className="text-2xl font-bold mt-2">
                        {suscripcionActual?.plan?.nombre ? `Plan ${suscripcionActual.plan.nombre}` : "Plan Gratuito"}
                      </h4>
                      <p className="text-blue-100 text-sm mt-1">
                        {suscripcionActual?.plan?.precio_mensual === 0 || !suscripcionActual?.plan
                          ? "Gratis ($0.00 USD / mes)"
                          : `$${suscripcionActual.plan.precio_mensual} USD / mes`}
                        {" • Status: "}{suscripcionActual?.estado || "activo"}
                      </p>
                    </div>
                    <button 
                      onClick={() => (window.location.href = "/dashboard-suscriptor/planes")}
                      className="bg-white text-blue-700 hover:bg-blue-50 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm self-start md:self-auto flex items-center gap-2"
                    >
                      <Zap className="h-4 w-4 text-amber-500" />
                      Mejorar Plan
                    </button>
                  </div>
                </div>

                {/* Meter Limits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <p className="text-xs text-gray-500 font-medium">Plantillas Creadas</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">12 / 50</p>
                    <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
                      <div className="bg-blue-600 h-full w-[24%]"></div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <p className="text-xs text-gray-500 font-medium">Envíos de Encuestas</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">3,420 / 10,000</p>
                    <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
                      <div className="bg-indigo-600 h-full w-[34%]"></div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <p className="text-xs text-gray-500 font-medium">Contactos Almacenados</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">1,150 / 5,000</p>
                    <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-600 h-full w-[23%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardSuscriptorLayout>
  )
}
