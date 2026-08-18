// src/components/dashboard/roles.jsx
import { useEffect, useState } from "react"
import { Shield, Check, AlertCircle, Loader2, Plus, Edit2, Save, X, Layers } from "lucide-react"
import DashboardLayout from "../dashboard-layout"
import { listarRolesDetalle, listarPermisos, asignarPermisosARol, crearRol, actualizarRol } from "../../services/api-admin"

const RolesPage = () => {
  const [roles, setRoles] = useState([])
  const [permisos, setPermisos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRol, setSelectedRol] = useState(null)
  const [selectedPermisos, setSelectedPermisos] = useState([])
  const [saving, setSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)

  // Modal para nuevo/editar rol
  const [showModal, setShowModal] = useState(false)
  const [editingRol, setEditingRol] = useState(null)
  const [rolFormData, setRolFormData] = useState({ nombre: "", descripcion: "" })

  async function cargarDatos() {
    try {
      setLoading(true)
      const [rolesData, permisosData] = await Promise.all([
        listarRolesDetalle(),
        listarPermisos()
      ])
      setRoles(rolesData)
      setPermisos(permisosData)
      if (rolesData.length > 0) {
        const defaultRol = selectedRol 
          ? rolesData.find(r => r.id === selectedRol.id) || rolesData[0]
          : rolesData[0]
        setSelectedRol(defaultRol)
        setSelectedPermisos(defaultRol.permisos ? defaultRol.permisos.map(p => p.id) : [])
      }
    } catch (err) {
      console.error("Error al cargar roles y permisos:", err)
      setStatusMessage({ type: "error", text: "Error al cargar la información del servidor." })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarDatos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSelectRol = (rol) => {
    setSelectedRol(rol)
    setSelectedPermisos(rol.permisos ? rol.permisos.map(p => p.id) : [])
    setStatusMessage(null)
  }

  const handleTogglePermiso = (permisoId) => {
    if (selectedRol?.nombre === "admin") return // Admin siempre tiene todo
    setSelectedPermisos(prev =>
      prev.includes(permisoId)
        ? prev.filter(id => id !== permisoId)
        : [...prev, permisoId]
    )
  }

  const handleToggleModulo = (moduloNombre, moduloPermisos) => {
    if (selectedRol?.nombre === "admin") return
    const idsModulo = moduloPermisos.map(p => p.id)
    const todosSeleccionados = idsModulo.every(id => selectedPermisos.includes(id))

    if (todosSeleccionados) {
      setSelectedPermisos(prev => prev.filter(id => !idsModulo.includes(id)))
    } else {
      setSelectedPermisos(prev => Array.from(new Set([...prev, ...idsModulo])))
    }
  }

  const handleGuardarPermisos = async () => {
    if (!selectedRol) return
    try {
      setSaving(true)
      setStatusMessage(null)
      const updatedRol = await asignarPermisosARol(selectedRol.id, selectedPermisos)
      setStatusMessage({ type: "success", text: `Permisos actualizados con éxito para el rol '${selectedRol.nombre}'.` })
      setRoles(prev => prev.map(r => r.id === updatedRol.id ? updatedRol : r))
      setSelectedRol(updatedRol)
    } catch (err) {
      console.error("Error al guardar permisos:", err)
      setStatusMessage({ type: "error", text: "No se pudieron actualizar los permisos del rol." })
    } finally {
      setSaving(false)
    }
  }

  const handleOpenCreateModal = () => {
    setEditingRol(null)
    setRolFormData({ nombre: "", descripcion: "" })
    setShowModal(true)
  }

  const handleOpenEditModal = (rol, e) => {
    e.stopPropagation()
    setEditingRol(rol)
    setRolFormData({ nombre: rol.nombre, descripcion: rol.descripcion || "" })
    setShowModal(true)
  }

  const handleSaveRolForm = async (e) => {
    e.preventDefault()
    if (!rolFormData.nombre.trim()) return
    try {
      setSaving(true)
      if (editingRol) {
        await actualizarRol(editingRol.id, rolFormData)
      } else {
        await crearRol(rolFormData)
      }
      setShowModal(false)
      await cargarDatos()
    } catch (err) {
      console.error("Error al guardar rol:", err)
      alert("Error al guardar el rol. Verifica que no esté duplicado.")
    } finally {
      setSaving(false)
    }
  }

  // Agrupar permisos por módulo
  const modulosAgrupados = permisos.reduce((acc, p) => {
    if (!acc[p.modulo]) acc[p.modulo] = []
    acc[p.modulo].push(p)
    return acc
  }, {})

  return (
    <DashboardLayout activeSection="roles">
      <div className="min-h-full p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
              Gestión de Roles y Permisos
            </h1>
            <p className="text-slate-600">Administra los roles del sistema y configura la matriz de permisos granulares</p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            Nuevo Rol
          </button>
        </div>

        {/* Feedback Alert */}
        {statusMessage && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 border ${
            statusMessage.type === "success" 
              ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}>
            {statusMessage.type === "success" ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <p className="text-sm font-medium">{statusMessage.text}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Panel Izquierdo: Lista de Roles */}
            <div className="lg:col-span-4 space-y-3">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    Roles del Sistema ({roles.length})
                  </h3>
                  <span className="text-xs text-slate-500">Selecciona para editar</span>
                </div>

                <div className="space-y-2">
                  {roles.map((rol) => {
                    const isSelected = selectedRol?.id === rol.id
                    const totalPerms = rol.permisos ? rol.permisos.length : 0
                    return (
                      <div
                        key={rol.id}
                        onClick={() => handleSelectRol(rol)}
                        className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-blue-50/80 border-blue-400 shadow-sm"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                            <Shield className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 text-sm capitalize">{rol.nombre}</p>
                            <p className="text-xs text-slate-500 line-clamp-1">{rol.descripcion || "Sin descripción"}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {totalPerms} perm.
                          </span>
                          {!["admin", "empresa", "operator"].includes(rol.nombre) && (
                            <button
                              onClick={(e) => handleOpenEditModal(rol, e)}
                              className="p-1 hover:bg-slate-200 rounded text-slate-500"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Panel Derecho: Matriz de Permisos del Rol Seleccionado */}
            <div className="lg:col-span-8">
              {selectedRol ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  {/* Rol Header Bar */}
                  <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-slate-900 capitalize">
                          Permisos: {selectedRol.nombre}
                        </h2>
                        {selectedRol.nombre === "admin" && (
                          <span className="text-xs bg-amber-100 text-amber-800 font-medium px-2.5 py-0.5 rounded-full">
                            Superusuario (Todos los permisos)
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        {selectedRol.descripcion || "Configura los accesos habilitados para este perfil de usuario."}
                      </p>
                    </div>

                    <button
                      onClick={handleGuardarPermisos}
                      disabled={saving || selectedRol.nombre === "admin"}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg text-sm transition-all shadow-sm"
                    >
                      {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                      Guardar Permisos ({selectedPermisos.length})
                    </button>
                  </div>

                  {/* Permissions Checklist by Module */}
                  <div className="p-4 sm:p-6 space-y-6 max-h-[680px] overflow-y-auto">
                    {Object.entries(modulosAgrupados).map(([modulo, permisosModulo]) => {
                      const todosSeleccionados = permisosModulo.every(p => selectedPermisos.includes(p.id))
                      return (
                        <div key={modulo} className="border border-slate-200 rounded-lg p-4 bg-slate-50/30">
                          {/* Modulo Header */}
                          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                            <div className="flex items-center gap-2">
                              <Layers className="h-4 w-4 text-blue-600" />
                              <h4 className="font-semibold text-slate-800 text-sm">{modulo}</h4>
                              <span className="text-xs text-slate-500">({permisosModulo.length})</span>
                            </div>
                            {selectedRol.nombre !== "admin" && (
                              <button
                                type="button"
                                onClick={() => handleToggleModulo(modulo, permisosModulo)}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                              >
                                {todosSeleccionados ? "Desmarcar todo" : "Seleccionar todo"}
                              </button>
                            )}
                          </div>

                          {/* Items Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {permisosModulo.map((p) => {
                              const isChecked = selectedPermisos.includes(p.id) || selectedRol.nombre === "admin"
                              return (
                                <label
                                  key={p.id}
                                  className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all ${
                                    isChecked
                                      ? "bg-blue-50/50 border-blue-200"
                                      : "bg-white border-slate-200 hover:bg-slate-50"
                                  } ${selectedRol.nombre === "admin" ? "cursor-not-allowed opacity-90" : "cursor-pointer"}`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    disabled={selectedRol.nombre === "admin"}
                                    onChange={() => handleTogglePermiso(p.id)}
                                    className="mt-1 h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                  />
                                  <div className="text-xs">
                                    <p className="font-semibold text-slate-800">{p.nombre}</p>
                                    <p className="text-slate-500 mt-0.5">{p.descripcion || p.codigo}</p>
                                    <span className="inline-block mt-1 font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                      {p.codigo}
                                    </span>
                                  </div>
                                </label>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center text-slate-500">
                  Selecciona un rol para ver su matriz de permisos
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Crear / Editar Rol */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-lg font-bold text-slate-900">
                  {editingRol ? `Editar Rol: ${editingRol.nombre}` : "Crear Nuevo Rol"}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveRolForm} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre del Rol *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: analista, supervisor"
                    value={rolFormData.nombre}
                    onChange={(e) => setRolFormData({ ...rolFormData, nombre: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción</label>
                  <textarea
                    rows={3}
                    placeholder="Descripción funcional de este perfil..."
                    value={rolFormData.descripcion}
                    onChange={(e) => setRolFormData({ ...rolFormData, descripcion: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm"
                  >
                    {saving ? "Guardando..." : "Guardar Rol"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default RolesPage