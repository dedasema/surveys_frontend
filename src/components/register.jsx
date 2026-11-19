import { useState, useEffect } from "react"
import { Eye, EyeOff, Mail, Lock, User, Building, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { requestRegistration } from "../services/auth"
import { useNavigate, useLocation, Link } from "react-router-dom"
import BrandLogo from "./BrandLogo"
import PublicNavbar from "./PublicNavbar"
import PublicFooter from "./PublicFooter"

const Register = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Leer email prellenado desde query params (?email=...) o react-router state
  const queryEmail = new URLSearchParams(location.search).get("email") || location.state?.email || ""

  const [formData, setFormData] = useState({
    nombre: "",
    email: queryEmail,
    telefono: "",
    password: "",
  })
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (queryEmail && !formData.email) {
      setFormData((prev) => ({ ...prev, email: queryEmail }))
    }
  }, [queryEmail])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre de la empresa es requerido"
    }

    if (!formData.email) {
      newErrors.email = "El email es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido"
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    if (!acceptedTerms) {
      newErrors.terms = "Debes aceptar los Términos y Condiciones"
    }

    if (!acceptedPrivacy) {
      newErrors.privacy = "Debes aceptar la Política de Privacidad"
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
      toast.loading("Creando tu cuenta empresarial...", { id: "register-toast" })
      // Registrar suscriptor con los campos correctos
      await requestRegistration({
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        password: formData.password,
      })

      toast.success("¡Registro exitoso! Revisa tu correo de confirmación.", { id: "register-toast" })
      // Redirigir a la página de confirmación de email
      navigate("/email-sent")
    } catch (error) {
      console.error("Registration error:", error)
      const msg = error.message || "Error al registrar la empresa"
      toast.error(msg, { id: "register-toast" })
      setErrors({ general: msg })
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen flex flex-col justify-between">
      <PublicNavbar />

      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <BrandLogo size="xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Crea tu cuenta</h2>
            <p className="text-gray-600">Únete a más de 500 empresas que confían en nuestra plataforma</p>
          </div>

          {/* Registration Form */}
          <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Name Field */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Empresa
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.nombre ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Toyota Motors"
                  />
                </div>
                {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="contacto@toyota.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.telefono ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="59175372221"
                  />
                </div>
                {errors.telefono && <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.password ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              {/* Checkboxes: Términos y Condiciones / Política de Privacidad */}
              <div className="space-y-3 pt-1 border-t border-gray-100">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => {
                        setAcceptedTerms(e.target.checked);
                        if (errors.terms) setErrors((prev) => ({ ...prev, terms: "" }));
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer mt-0.5"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-medium text-gray-700 cursor-pointer">
                      Acepto los{" "}
                      <Link
                        to="/terminos"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-500 underline font-semibold"
                      >
                        Términos y Condiciones
                      </Link>
                    </label>
                  </div>
                </div>
                {errors.terms && <p className="text-xs text-red-600 ml-7">{errors.terms}</p>}

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="privacy"
                      name="privacy"
                      type="checkbox"
                      checked={acceptedPrivacy}
                      onChange={(e) => {
                        setAcceptedPrivacy(e.target.checked);
                        if (errors.privacy) setErrors((prev) => ({ ...prev, privacy: "" }));
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer mt-0.5"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="privacy" className="font-medium text-gray-700 cursor-pointer">
                      Acepto la{" "}
                      <Link
                        to="/privacidad"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-500 underline font-semibold"
                      >
                        Política de Privacidad
                      </Link>
                    </label>
                  </div>
                </div>
                {errors.privacy && <p className="text-xs text-red-600 ml-7">{errors.privacy}</p>}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading || !acceptedTerms || !acceptedPrivacy}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                  title={!acceptedTerms || !acceptedPrivacy ? "Debes marcar ambas casillas para habilitar el registro" : "Crear cuenta"}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creando cuenta y enviando correos...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Crear cuenta
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </button>
                {(!acceptedTerms || !acceptedPrivacy) && (
                  <p className="text-xs text-center text-gray-400 mt-2">
                    * Debes aceptar los Términos y Condiciones y la Política de Privacidad para registrarte
                  </p>
                )}
              </div>
            </form>            {errors.general && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}
          </div>

          {/* Sign in link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
      <PublicFooter />
    </div>
  )
}

export default Register
