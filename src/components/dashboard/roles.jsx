import React, { useEffect, useState, useMemo } from "react"
import {
  Shield,
  Check,
  AlertCircle,
  Loader2,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Layers,
  Search,
  CheckSquare,
  Square,
  RotateCcw,
  Sparkles,
  Lock,
  Info,
  ShieldCheck,
  FileText,
  Send,
  Users,
  Package,
  BarChart3,
  KeyRound,
  ShieldAlert,
} from "lucide-react"
import { toast } from "sonner"
import DashboardLayout from "../dashboard-layout"
import {
  listarRolesDetalle,
  listarPermisos,
  asignarPermisosARol,
  crearRol,
  actualizarRol,
  eliminarRol,
} from "../../services/api-admin"

const PROTECTED_ROLES = ["admin", "empresa", "operator"]

export default function RolesPage() {
  const [roles, setRoles] = useState([])
  const [permisos, setPermisos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRol, setSelectedRol] = useState(null)
  const [selectedPermisos, setSelectedPermisos] = useState([])
  const [originalPermisos, setOriginalPermisos] = useState([])
  const [savingPermisos, setSavingPermisos] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Modales
  const [showModal, setShowModal] = useState(false)
  const [editingRol, setEditingRol] = useState(null)
  const [rolFormData, setRolFormData] = useState({ nombre: "", descripcion: "", permisos_ids: [] })
  const [savingRolForm, setSavingRolForm] = useState(false)

  // Modal Eliminar Rol
  const [rolToDelete, setRolToDelete] = useState(null)
  const [deletingRol, setDeletingRol] = useState(false)

  async function cargarDatos(keepSelectedId = null) {
    try {
      setLoading(true)
      const [rolesData, permisosData] = await Promise.all([
        listarRolesDetalle(),
        listarPermisos(),
      ])
      setRoles(rolesData || [])
      setPermisos(permisosData || [])

      if (rolesData && rolesData.length > 0) {
        const targetId = keepSelectedId || selectedRol?.id
        const targetRol = targetId
          ? rolesData.find((r) => r.id === targetId) || rolesData[0]
          : rolesData[0]

        setSelectedRol(targetRol)
        const initialPerms = targetRol.permisos ? targetRol.permisos.map((p) => p.id) : []
        setSelectedPermisos(initialPerms)
        setOriginalPermisos(initialPerms)
      }
    } catch (err) {
      console.error("Error al cargar roles y permisos:", err)
      toast.error(err.message || "Error al cargar los roles y permisos del servidor")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarDatos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSelectRol = (rol) => {
    // Si hay cambios sin guardar, avisar
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        `Tienes cambios sin guardar en '${selectedRol.nombre}'. ¿Deseas descartarlos y cambiar de rol?`
      )
      if (!confirmLeave) return
    }

    setSelectedRol(rol)
    const perms = rol.permisos ? rol.permisos.map((p) => p.id) : []
    setSelectedPermisos(perms)
    setOriginalPermisos(perms)
  }

  // Comprobar si hay cambios sin guardar en los permisos
  const hasUnsavedChanges = useMemo(() => {
    if (!selectedRol || selectedRol.nombre === "admin") return false
    if (selectedPermisos.length !== originalPermisos.length) return true
    const setA = new Set(selectedPermisos)
    return originalPermisos.some((id) => !setA.has(id))
  }, [selectedPermisos, originalPermisos, selectedRol])

  const handleTogglePermiso = (permisoId) => {
    if (selectedRol?.nombre === "admin") return
    setSelectedPermisos((prev) =>
      prev.includes(permisoId) ? prev.filter((id) => id !== permisoId) : [...prev, permisoId]
    )
  }

  const handleToggleModulo = (moduloPermisos) => {
    if (selectedRol?.nombre === "admin") return
    const idsModulo = moduloPermisos.map((p) => p.id)
    const todosSeleccionados = idsModulo.every((id) => selectedPermisos.includes(id))

    if (todosSeleccionados) {
      setSelectedPermisos((prev) => prev.filter((id) => !idsModulo.includes(id)))
    } else {
      setSelectedPermisos((prev) => Array.from(new Set([...prev, ...idsModulo])))
    }
  }

  const handleSelectAll = () => {
    if (selectedRol?.nombre === "admin") return
    setSelectedPermisos(permisos.map((p) => p.id))
  }

  const handleDeselectAll = () => {
    if (selectedRol?.nombre === "admin") return
    setSelectedPermisos([])
  }

  const handleRevertChanges = () => {
    setSelectedPermisos([...originalPermisos])
    toast.info("Cambios revertidos al estado guardado")
  }

  const handleGuardarPermisos = async () => {
    if (!selectedRol) return
    try {
      setSavingPermisos(true)
      toast.loading(`Guardando matriz de permisos para '${selectedRol.nombre}'...`, { id: "save-perms" })
      
      const updatedRol = await asignarPermisosARol(selectedRol.id, selectedPermisos)
      toast.success(`Matriz de permisos de '${selectedRol.nombre}' actualizada exitosamente`, {
        id: "save-perms",
      })

      // Actualizar estado local
      setRoles((prev) =>
        prev.map((r) => (r.id === selectedRol.id ? { ...r, permisos: updatedRol.permisos || [] } : r))
      )
      setOriginalPermisos([...selectedPermisos])
    } catch (err) {
      console.error("Error al guardar permisos:", err)
      toast.error(err.message || "Error al guardar permisos", { id: "save-perms" })
    } finally {
      setSavingPermisos(false)
    }
  }

  // Crear / Editar Rol
  const handleOpenCreateModal = () => {
    setEditingRol(null)
    setRolFormData({ nombre: "", descripcion: "", permisos_ids: [] })
    setShowModal(true)
  }

  const handleOpenEditModal = (rol, e) => {
    e.stopPropagation()
    setEditingRol(rol)
    setRolFormData({
      nombre: rol.nombre,
      descripcion: rol.descripcion || "",
      permisos_ids: rol.permisos ? rol.permisos.map((p) => p.id) : [],
    })
    setShowModal(true)
  }

  const handleSaveRolForm = async (e) => {
    e.preventDefault()
    if (!rolFormData.nombre.trim()) {
      toast.error("El nombre del rol es requerido")
      return
    }

    try {
      setSavingRolForm(true)
      if (editingRol) {
        toast.loading("Actualizando rol...", { id: "save-rol" })
        await actualizarRol(editingRol.id, {
          nombre: rolFormData.nombre.trim().toLowerCase(),
          descripcion: rolFormData.descripcion.trim(),
        })
        toast.success("Rol actualizado exitosamente", { id: "save-rol" })
        setShowModal(false)
        await cargarDatos(editingRol.id)
      } else {
        toast.loading("Creando rol personalizado...", { id: "save-rol" })
        const nuevo = await crearRol({
          nombre: rolFormData.nombre.trim().toLowerCase(),
          descripcion: rolFormData.descripcion.trim(),
          permisos_ids: rolFormData.permisos_ids || [],
        })
        toast.success("Rol creado exitosamente", { id: "save-rol" })
        setShowModal(false)
        await cargarDatos(nuevo.id)
      }
    } catch (err) {
      console.error("Error al guardar rol:", err)
      toast.error(err.message || "Error al guardar el rol", { id: "save-rol" })
    } finally {
      setSavingRolForm(false)
    }
  }

  // Eliminar Rol
  const handleConfirmDeleteRol = async () => {
    if (!rolToDelete) return
    try {
      setDeletingRol(true)
      toast.loading(`Eliminando rol '${rolToDelete.nombre}'...`, { id: "del-rol" })
      await eliminarRol(rolToDelete.id)
      toast.success(`Rol '${rolToDelete.nombre}' eliminado correctamente`, { id: "del-rol" })
      setRolToDelete(null)
      await cargarDatos()
    } catch (err) {
      console.error("Error al eliminar rol:", err)
      toast.error(err.message || "No se pudo eliminar el rol", { id: "del-rol" })
    } finally {
      setDeletingRol(false)
    }
  }

  // Agrupar permisos por módulo
  const modulosAgrupados = useMemo(() => {
    const filter = searchTerm.trim().toLowerCase()
    return permisos.reduce((acc, p) => {
      const match =
        !filter ||
        p.nombre.toLowerCase().includes(filter) ||
        p.codigo.toLowerCase().includes(filter) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(filter)) ||
        p.modulo.toLowerCase().includes(filter)

      if (match) {
        if (!acc[p.modulo]) acc[p.modulo] = []
        acc[p.modulo].push(p)
      }
      return acc
    }, {})
  }, [permisos, searchTerm])

  const getModuleIcon = (modulo) => {
    const m = modulo.toLowerCase()
    if (m.includes("plantilla") || m.includes("template")) return <FileText className="h-4 w-4 text-blue-600" />
    if (m.includes("campana") || m.includes("campaign")) return <Send className="h-4 w-4 text-indigo-600" />
    if (m.includes("destinatario") || m.includes("user")) return <Users className="h-4 w-4 text-emerald-600" />
    if (m.includes("entrega") || m.includes("delivery") || m.includes("ocr")) return <Package className="h-4 w-4 text-amber-600" />
    if (m.includes("analitica") || m.includes("reporte")) return <BarChart3 className="h-4 w-4 text-purple-600" />
    if (m.includes("auth") || m.includes("perfil") || m.includes("seguridad")) return <KeyRound className="h-4 w-4 text-rose-600" />
    return <Layers className="h-4 w-4 text-blue-600" />
  }

  return (
    <DashboardLayout activeSection="roles">
      <div className="min-h-full p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/40">
        {/* Header Principal */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 rounded-md">
                Control de Acceso RBAC
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {permisos.length} Permisos Atómicos Disponibles
              </span>
            </div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-950 bg-clip-text text-transparent">
              Matriz de Roles y Permisos Granulares
            </h1>
            <p className="text-sm text-slate-600">
              Configura permisos atómicos por módulo, diseña nuevos roles personalizados y controla los accesos del sistema.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all text-sm flex-shrink-0"
          >
            <Plus className="h-4 w-4" />
            Crear Nuevo Rol
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-80 bg-white/70 rounded-2xl border border-slate-200/60 shadow-xs">
            <Loader2 className="animate-spin h-10 w-10 text-blue-600 mb-3" />
            <p className="text-slate-600 font-medium text-sm">Cargando catálogo de roles y matriz de permisos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* ───────── Panel Izquierdo: Selector de Roles ───────── */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/80 p-4">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <h3 className="font-bold text-slate-900 text-sm">
                      Roles Registrados ({roles.length})
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Click para editar</span>
                </div>

                <div className="space-y-2.5">
                  {roles.map((rol) => {
                    const isSelected = selectedRol?.id === rol.id
                    const isProtected = PROTECTED_ROLES.includes(rol.nombre.toLowerCase())
                    const totalPerms = rol.permisos ? rol.permisos.length : 0

                    return (
                      <div
                        key={rol.id}
                        onClick={() => handleSelectRol(rol)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                          isSelected
                            ? "bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20 shadow-sm"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l" />
                        )}

                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-3 min-w-0">
                            <div
                              className={`p-2 rounded-lg flex-shrink-0 ${
                                rol.nombre === "admin"
                                  ? "bg-amber-100 text-amber-700"
                                  : isSelected
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {rol.nombre === "admin" ? (
                                <Sparkles className="h-4 w-4" />
                              ) : (
                                <Shield className="h-4 w-4" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-slate-900 text-sm capitalize truncate">
                                  {rol.nombre}
                                </p>
                                {isProtected ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                    <Lock className="w-2.5 h-2.5" />
                                    Sistema
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                                    <Sparkles className="w-2.5 h-2.5" />
                                    Custom
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                                {rol.descripcion || "Sin descripción funcional"}
                              </p>
                            </div>
                          </div>

                          {/* Acciones de rol */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono">
                              {rol.nombre === "admin" ? "TODOS" : `${totalPerms} perms`}
                            </span>

                            {!isProtected && (
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => handleOpenEditModal(rol, e)}
                                  title="Editar nombre y descripción"
                                  className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-700"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setRolToDelete(rol)
                                  }}
                                  title="Eliminar rol personalizado"
                                  className="p-1 hover:bg-red-100 rounded text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Guía Rápida RBAC */}
              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="h-5 w-5 text-indigo-400" />
                  <h4 className="font-bold text-sm">¿Cómo funciona el motor RBAC?</h4>
                </div>
                <p className="text-xs text-indigo-200 leading-relaxed">
                  Cada acción en el backend (crear encuestas, emitir auditorías, procesar OCR) valida el permiso atómico asignado al rol del usuario activo.
                </p>
              </div>
            </div>

            {/* ───────── Panel Derecho: Matriz Interactiva de Permisos ───────── */}
            <div className="lg:col-span-8">
              {selectedRol ? (
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col">
                  {/* Encabezado del Rol Seleccionado */}
                  <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/60">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h2 className="text-2xl font-black text-slate-900 capitalize">
                            {selectedRol.nombre}
                          </h2>
                          {selectedRol.nombre === "admin" ? (
                            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full border border-amber-300 inline-flex items-center gap-1.5">
                              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                              Superadministrador (Acceso Total Irrestricto)
                            </span>
                          ) : (
                            <span className="text-xs bg-blue-100 text-blue-900 font-bold px-3 py-1 rounded-full border border-blue-200">
                              {selectedPermisos.length} de {permisos.length} Permisos Asignados
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1">
                          {selectedRol.descripcion || "Permisos y privilegios asignados a este rol."}
                        </p>
                      </div>

                      {/* Botón Guardar Matriz */}
                      {selectedRol.nombre !== "admin" && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {hasUnsavedChanges && (
                            <button
                              type="button"
                              onClick={handleRevertChanges}
                              title="Descartar cambios no guardados"
                              className="px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition inline-flex items-center gap-1.5"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              Revertir
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={handleGuardarPermisos}
                            disabled={savingPermisos || !hasUnsavedChanges}
                            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 font-bold rounded-xl text-sm transition-all shadow-md ${
                              hasUnsavedChanges
                                ? "bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-blue-500/25 ring-2 ring-blue-400 ring-offset-2 animate-pulse"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                            }`}
                          >
                            {savingPermisos ? (
                              <Loader2 className="animate-spin h-4 w-4" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                            Guardar Matriz de Permisos
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Alerta de cambios sin guardar */}
                    {hasUnsavedChanges && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-amber-900 text-xs font-medium">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                          <span>Tienes cambios pendientes en la matriz. Recuerda hacer clic en <strong>Guardar Matriz de Permisos</strong>.</span>
                        </div>
                      </div>
                    )}

                    {/* Barra de Búsqueda y Acciones Rápidas */}
                    {selectedRol.nombre !== "admin" && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-200/80">
                        <div className="relative w-full sm:w-72">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Filtrar permisos o módulos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <button
                            type="button"
                            onClick={handleSelectAll}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition"
                          >
                            <CheckSquare className="h-3.5 w-3.5 text-blue-600" />
                            Seleccionar Todos
                          </button>
                          <button
                            type="button"
                            onClick={handleDeselectAll}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition"
                          >
                            <Square className="h-3.5 w-3.5 text-slate-400" />
                            Desmarcar Todos
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Matriz Grilla de Módulos y Permisos */}
                  <div className="p-4 sm:p-6 space-y-6 max-h-[640px] overflow-y-auto">
                    {selectedRol.nombre === "admin" && (
                      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl flex items-start gap-3">
                        <Info className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-amber-900 leading-relaxed">
                          <p className="font-bold text-sm mb-1">Rol Superadministrador Raíz</p>
                          Este rol tiene acceso total irrevocable a todos los módulos y operaciones del sistema. No requiere configuración manual de matriz de permisos.
                        </div>
                      </div>
                    )}

                    {Object.keys(modulosAgrupados).length === 0 ? (
                      <div className="p-12 text-center text-slate-500 text-sm">
                        No se encontraron permisos coincidentes con &quot;{searchTerm}&quot;.
                      </div>
                    ) : (
                      Object.entries(modulosAgrupados).map(([modulo, permisosModulo]) => {
                        const idsModulo = permisosModulo.map((p) => p.id)
                        const activosCount = idsModulo.filter((id) => selectedPermisos.includes(id)).length
                        const todosSeleccionados = idsModulo.length > 0 && activosCount === idsModulo.length

                        return (
                          <div
                            key={modulo}
                            className="border border-slate-200 rounded-2xl p-4 bg-slate-50/40 hover:bg-slate-50/70 transition-colors"
                          >
                            {/* Cabecera del Módulo */}
                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                              <div className="flex items-center gap-2.5">
                                <div className="p-1.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                                  {getModuleIcon(modulo)}
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-900 text-sm">{modulo}</h4>
                                  <p className="text-[11px] text-slate-500 font-medium">
                                    {activosCount} de {permisosModulo.length} permisos habilitados
                                  </p>
                                </div>
                              </div>

                              {selectedRol.nombre !== "admin" && (
                                <button
                                  type="button"
                                  onClick={() => handleToggleModulo(permisosModulo)}
                                  className={`text-xs font-bold px-2.5 py-1 rounded-md transition ${
                                    todosSeleccionados
                                      ? "text-red-700 bg-red-50 hover:bg-red-100"
                                      : "text-blue-700 bg-blue-50 hover:bg-blue-100"
                                  }`}
                                >
                                  {todosSeleccionados ? "Desmarcar Módulo" : "Habilitar Módulo"}
                                </button>
                              )}
                            </div>

                            {/* Items / Permisos del Módulo */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {permisosModulo.map((p) => {
                                const isChecked =
                                  selectedRol.nombre === "admin" || selectedPermisos.includes(p.id)

                                return (
                                  <label
                                    key={p.id}
                                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all select-none ${
                                      isChecked
                                        ? "bg-blue-50/60 border-blue-300 ring-1 ring-blue-400/20 shadow-2xs"
                                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                    } ${
                                      selectedRol.nombre === "admin"
                                        ? "cursor-default opacity-90"
                                        : "cursor-pointer active:scale-[0.99]"
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      disabled={selectedRol.nombre === "admin"}
                                      onChange={() => handleTogglePermiso(p.id)}
                                      className="mt-0.5 h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                                    />
                                    <div className="text-xs min-w-0 flex-1">
                                      <div className="flex items-center justify-between gap-2 mb-0.5">
                                        <p className="font-bold text-slate-900">{p.nombre}</p>
                                      </div>
                                      <p className="text-slate-500 text-[11px] leading-relaxed">
                                        {p.descripcion || "Permite ejecutar esta acción en el sistema"}
                                      </p>
                                    </div>
                                  </label>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 text-center text-slate-500">
                  <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="font-bold text-slate-700">Ningún rol seleccionado</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Selecciona un rol en el panel izquierdo para editar su matriz de permisos.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ───────── Modal Crear / Editar Rol ───────── */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {editingRol ? `Editar Rol: ${editingRol.nombre}` : "Crear Nuevo Rol Personalizado"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {editingRol
                        ? "Modifica el nombre y descripción del rol"
                        : "Define un nuevo perfil funcional con permisos a medida"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveRolForm} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nombre del Rol *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: auditor_calidad, supervisor_regional"
                    value={rolFormData.nombre}
                    onChange={(e) => setRolFormData({ ...rolFormData, nombre: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Se guardará en formato minúsculas identificador.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Descripción Funcional
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe los alcances y responsabilidades de este perfil..."
                    value={rolFormData.descripcion}
                    onChange={(e) => setRolFormData({ ...rolFormData, descripcion: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={savingRolForm}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl shadow-md transition disabled:opacity-50"
                  >
                    {savingRolForm ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                    {editingRol ? "Guardar Cambios" : "Crear Rol"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ───────── Modal Confirmar Eliminación de Rol ───────── */}
        {rolToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-red-200 w-full max-w-md p-6">
              <div className="flex items-center gap-3 text-red-600 mb-3">
                <div className="p-2.5 bg-red-50 rounded-xl">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">¿Eliminar Rol Personalizado?</h3>
              </div>

              <p className="text-sm text-slate-600 mb-6">
                Estás a punto de eliminar el rol <strong className="text-slate-900 capitalize">&quot;{rolToDelete.nombre}&quot;</strong>. Esta acción desvinculará sus permisos permanentemente.
              </p>

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setRolToDelete(null)}
                  disabled={deletingRol}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteRol}
                  disabled={deletingRol}
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {deletingRol ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                  Eliminar Rol
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}