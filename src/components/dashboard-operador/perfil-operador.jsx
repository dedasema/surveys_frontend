// src/components/dashboard-operador/perfil-operador.jsx
import { useEffect, useState } from "react"
import {
  User,
  Mail,
  ShieldCheck,
  CalendarCheck,
  Loader2,
  Edit,
  Save,
  X,
  UserCheck,
  CheckCircle2
} from "lucide-react"
import DashboardOperadorLayout from "./layout"
import { getCurrentUser } from "../../services/auth"
import { updateOperator } from "../../services/api"

const PerfilOperador = () => {
  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ nombre_completo: "", email: "" })
  const [errors, setErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [notification, setNotification] = useState({ type: "", message: "" })

  const cargarUsuario = async () => {
    try {
      setLoading(true)
      const data = await getCurrentUser()
      setUsuario(data)
      setFormData({
        nombre_completo: data.nombre_completo || data.nombre || "",
        email: data.email || "",
      })
    } catch (error) {
      console.error("Error al obtener usuario:", error)
      setNotification({ type: "error", message: "Error al cargar el perfil." })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarUsuario()
  }, [])

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData({
        nombre_completo: usuario.nombre_completo || usuario.nombre || "",
        email: usuario.email || "",
      })
      setErrors({})
    }
    setIsEditing(!isEditing)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null })
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.nombre_completo.trim()) {
      newErrors.nombre_completo = "El nombre completo es requerido"
    }
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido"
    }
    return newErrors
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSaving(true)
    setNotification({ type: "", message: "" })

    try {
      await updateOperator({
        nombre_completo: formData.nombre_completo,
        email: formData.email,
      })
      setNotification({
        type: "success",
        message: "¡Perfil de Operador actualizado exitosamente!",
      })
      setIsEditing(false)
      cargarUsuario()
    } catch (error) {
      console.error("Error al actualizar perfil del operador:", error)
      setNotification({
        type: "error",
        message: error.message || "Error al actualizar el perfil del operador.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardOperadorLayout activeSection="perfil">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </DashboardOperadorLayout>
    )
  }

  return (
    <DashboardOperadorLayout activeSection="perfil">
      <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 min-h-screen">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <UserCheck className="h-7 w-7 text-blue-600" />
                Mi Perfil de Operador
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Consulta y actualiza tus datos personales en el sistema
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <button
                  onClick={handleEditToggle}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
                >
                  <Edit className="h-4 w-4" />
                  Editar Perfil
                </button>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </button>
              )}
            </div>
          </div>

          {/* Notificaciones */}
          {notification.message && (
            <div
              className={`p-4 rounded-xl flex items-center gap-3 border shadow-sm ${
                notification.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
          )}

          {/* Tarjeta Principal */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Banner superior */}
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative"></div>

            {/* Contenido con avatar volado */}
            <div className="px-6 pb-6 relative">
              <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 mb-6 gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-24 h-24 rounded-2xl bg-white p-1.5 shadow-md">
                    <div className="w-full h-full rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                      <User className="w-12 h-12" />
                    </div>
                  </div>
                  <div className="text-center sm:text-left mt-2 sm:mt-0">
                    <h2 className="text-xl font-bold text-gray-900">
                      {usuario?.nombre_completo || usuario?.nombre || "Operador del Sistema"}
                    </h2>
                    <p className="text-sm text-gray-500">{usuario?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                    {usuario?.rol || "Operador"}
                  </span>
                </div>
              </div>

              {/* Formulario / Vista */}
              {!isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                  <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-1">
                      <User className="h-5 w-5 text-blue-600" />
                      <span className="text-xs font-semibold uppercase text-gray-400">
                        Nombre Completo
                      </span>
                    </div>
                    <p className="text-base font-semibold text-gray-900 pl-8">
                      {usuario?.nombre_completo || usuario?.nombre || "No especificado"}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-1">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <span className="text-xs font-semibold uppercase text-gray-400">
                        Correo Electrónico
                      </span>
                    </div>
                    <p className="text-base font-semibold text-gray-900 pl-8">
                      {usuario?.email || "No especificado"}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-1">
                      <ShieldCheck className="h-5 w-5 text-blue-600" />
                      <span className="text-xs font-semibold uppercase text-gray-400">
                        Estado de Cuenta
                      </span>
                    </div>
                    <p className="text-base font-semibold text-gray-900 pl-8 capitalize">
                      {usuario?.estado || "Activo"}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-1">
                      <CalendarCheck className="h-5 w-5 text-blue-600" />
                      <span className="text-xs font-semibold uppercase text-gray-400">
                        Rol Asignado
                      </span>
                    </div>
                    <p className="text-base font-semibold text-gray-900 pl-8 capitalize">
                      Operador
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-6 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre Completo
                      </label>
                      <div className="relative">
                        <User className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          name="nombre_completo"
                          value={formData.nombre_completo}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.nombre_completo ? "border-red-500 bg-red-50" : "border-gray-300"
                          }`}
                          placeholder="Tu nombre completo"
                        />
                      </div>
                      {errors.nombre_completo && (
                        <p className="mt-1 text-xs text-red-600">{errors.nombre_completo}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Correo Electrónico
                      </label>
                      <div className="relative">
                        <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
                          }`}
                          placeholder="tu_correo@ejemplo.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleEditToggle}
                      className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Guardar Cambios
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardOperadorLayout>
  )
}

export default PerfilOperador
