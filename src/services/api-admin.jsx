// src/services/api-admin.js
const API_BASE_URL = process.env.REACT_APP_API_URL || "https://surveys-backend-83d9.onrender.com"
const parseApiErrorMessage = (status, rawText) => {
  if (!rawText) {
    if (status === 400) return "Solicitud incorrecta o datos inválidos";
    if (status === 401) return "Sesión expirada o credenciales inválidas";
    if (status === 403) return "No tienes permisos para realizar esta acción";
    if (status === 404) return "El recurso solicitado no fue encontrado";
    if (status === 409) return "Conflicto: el registro ya existe";
    if (status === 422) return "Error de validación en los datos enviados";
    if (status >= 500) return "Error en el servidor. Por favor intenta más tarde";
    return `Error HTTP ${status}`;
  }

  try {
    const json = JSON.parse(rawText);
    if (typeof json.detail === "string") return json.detail;
    if (Array.isArray(json.detail)) {
      return json.detail.map((d) => d.msg || d.message || JSON.stringify(d)).join(", ");
    }
    if (json.message) return json.message;
    if (json.error) return json.error;
  } catch {}

  if (status === 403) return "No tienes permisos para realizar esta acción";
  if (status === 404) return "El recurso solicitado no fue encontrado";
  if (status >= 500) return "Error interno del servidor. Por favor intenta más tarde";
  return rawText;
};

const authFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("No hay token de autenticación")

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
      throw new Error("Sesión expirada")
    }
    const rawText = await response.text()
    const friendlyMsg = parseApiErrorMessage(response.status, rawText)
    throw new Error(friendlyMsg)
  }

  if (response.status === 204) return true
  return response.json()
}

// Roles & Permisos
export const listarRoles = () => authFetch("/catalogos/roles")
export const listarRolesDetalle = () => authFetch("/catalogos/roles-detalle")
export const listarPermisos = () => authFetch("/catalogos/permisos")
export const obtenerRol = (id) => authFetch(`/catalogos/roles/${id}`)
export const crearRol = (payload) =>
  authFetch("/catalogos/roles", { method: "POST", body: JSON.stringify(typeof payload === "string" ? { nombre: payload } : payload) })
export const actualizarRol = (id, payload) =>
  authFetch(`/catalogos/roles/${id}`, { method: "PUT", body: JSON.stringify(typeof payload === "string" ? { nombre: payload } : payload) })
export const asignarPermisosARol = (id, permisos_ids) =>
  authFetch(`/catalogos/roles/${id}/permisos`, { method: "POST", body: JSON.stringify({ permisos_ids }) })
export const eliminarRol = (id) => authFetch(`/catalogos/roles/${id}`, { method: "DELETE" })

// Estados Capaña
export const listarEstadosCampana = () => authFetch("/catalogos/estados-campana")
export const crearEstadoCampana = (nombre) =>
  authFetch("/catalogos/estados-campana", { method: "POST", body: JSON.stringify({ nombre }) })
export const actualizarEstadoCampana = (id, nombre) =>
  authFetch(`/catalogos/estados-campana/${id}`, { method: "PUT", body: JSON.stringify({ nombre }) })
export const eliminarEstadoCampana = (id) => authFetch(`/catalogos/estados-campana/${id}`, { method: "DELETE" })

// ESTADOS ENTREGA 
export const listarEstadosEntrega = () => authFetch("/catalogos/estados-entrega")
export const crearEstadoEntrega = (nombre) =>
  authFetch("/catalogos/estados-entrega", { method: "POST", body: JSON.stringify({ nombre }) })
export const actualizarEstadoEntrega = (id, nombre) =>
  authFetch(`/catalogos/estados-entrega/${id}`, { method: "PUT", body: JSON.stringify({ nombre }) })
export const eliminarEstadoEntrega = (id) =>
  authFetch(`/catalogos/estados-entrega/${id}`, { method: "DELETE" })

// Estados de Pago
export const listarEstadosPago = () => authFetch("/catalogos/estados-pago")
export const crearEstadoPago = (nombre) =>
  authFetch("/catalogos/estados-pago", {method: "POST", body: JSON.stringify({ nombre }) })
export const actualizarEstadoPago = (id, nombre) =>
  authFetch(`/catalogos/estados-pago/${id}`, {method: "PUT", body: JSON.stringify({ nombre }) })
export const eliminarEstadoPago = (id) =>
  authFetch(`/catalogos/estados-pago/${id}`, {method: "DELETE" })

// Métodos de Pago
export const listarMetodosPago = () => authFetch("/catalogos/metodos-pago")
export const crearMetodoPago = (nombre) =>
  authFetch("/catalogos/metodos-pago", {method: "POST", body: JSON.stringify({ nombre }) })
export const actualizarMetodoPago = (id, nombre) =>
  authFetch(`/catalogos/metodos-pago/${id}`, {method: "PUT", body: JSON.stringify({ nombre }) })
export const eliminarMetodoPago = (id) =>
  authFetch(`/catalogos/metodos-pago/${id}`, {method: "DELETE" })

// Planes de Suscripción
export const listarPlanes = () => authFetch("/subscription/planes")
export const obtenerPlan = (id) => authFetch(`/subscription/planes/${id}`)
export const crearPlan = (dataOrNombre, precio_mensual, descripcion) => {
  const body =
    typeof dataOrNombre === "object"
      ? dataOrNombre
      : { nombre: dataOrNombre, precio_mensual, descripcion }
  return authFetch("/subscription/planes", { method: "POST", body: JSON.stringify(body) })
}
export const actualizarPlan = (id, dataOrNombre, precio_mensual, descripcion) => {
  const body =
    typeof dataOrNombre === "object"
      ? dataOrNombre
      : { nombre: dataOrNombre, precio_mensual, descripcion }
  return authFetch(`/subscription/planes/${id}`, { method: "PUT", body: JSON.stringify(body) })
}
export const eliminarPlan = (id) =>
  authFetch(`/subscription/planes/${id}`, { method: "DELETE" })

// Tipos de Pregunta
export const listarTiposPregunta = () => authFetch("/catalogos/tipos-pregunta")

export const crearTipoPregunta = (data) =>
  authFetch("/catalogos/tipos-pregunta", {
    method: "POST",
    body: JSON.stringify(data),
  })

export const actualizarTipoPregunta = (id, data) =>
  authFetch(`/catalogos/tipos-pregunta/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })

export const eliminarTipoPregunta = (id) =>
  authFetch(`/catalogos/tipos-pregunta/${id}`, {
    method: "DELETE",
  })

export const listarCanales = () => authFetch("/catalogos/canales")

export const crearCanal = (canalData) =>
  authFetch("/catalogos/canales", {
    method: "POST",
    body: JSON.stringify(canalData),
  })

export const actualizarCanal = (id, canalData) =>
  authFetch(`/catalogos/canales/${id}`, {
    method: "PUT",
    body: JSON.stringify(canalData),
  })

export const eliminarCanal = (id) =>
  authFetch(`/catalogos/canales/${id}`, {
    method: "DELETE",
  })

// Funciones para el perfil del admin
export async function updateAdmin(data) {
  const token = localStorage.getItem("token")
  try {
    const response = await fetch(`${API_BASE_URL}/auth/update/admin`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || "Error al actualizar el perfil del administrador")
    }

    return await response.json()
  } catch (error) {
    console.error("Error al actualizar administrador:", error)
    throw error
  }
}
export const listarEstadosDocumento = () =>
  authFetch("/catalogos/estados-documento")

export const crearEstadoDocumento = (nombre) =>
  authFetch("/catalogos/estados-documento", {
    method: "POST",
    body  : JSON.stringify({ nombre }),
  })

export const actualizarEstadoDocumento = (id, nombre) =>
  authFetch(`/catalogos/estados-documento/${id}`, {
    method: "PUT",
    body  : JSON.stringify({ nombre }),
  })

export const eliminarEstadoDocumento = (id) =>
  authFetch(`/catalogos/estados-documento/${id}`, { method: "DELETE" })

// Auditoría Global
export const listarAuditoria = (params = {}) => {
  const query = new URLSearchParams()
  if (params.modulo) query.append("modulo", params.modulo)
  if (params.accion) query.append("accion", params.accion)
  if (params.usuario) query.append("usuario", params.usuario)
  if (params.search) query.append("search", params.search)
  if (params.fecha_inicio) query.append("fecha_inicio", params.fecha_inicio)
  if (params.fecha_fin) query.append("fecha_fin", params.fecha_fin)
  if (params.limit) query.append("limit", params.limit)
  if (params.offset) query.append("offset", params.offset)
  const qs = query.toString()
  return authFetch(`/auditoria/logs${qs ? `?${qs}` : ""}`).catch(async () => {
    return authFetch(`/auditoria${qs ? `?${qs}` : ""}`).catch(async () => {
      return authFetch(`/admin/auditoria/logs${qs ? `?${qs}` : ""}`).catch(() => ({ items: [], total: 0 }))
    })
  })
}

export const obtenerFiltrosAuditoria = () => authFetch("/auditoria/filtros")

// Gestión de Suscriptores (Empresas) para SuperAdmin
export const listarSuscriptoresAdmin = (params = {}) => {
  const query = new URLSearchParams()
  if (params.search) query.append("search", params.search)
  if (params.estado) query.append("estado", params.estado)
  if (params.plan_id) query.append("plan_id", params.plan_id)
  const qs = query.toString()
  return authFetch(`/admin/suscriptores${qs ? `?${qs}` : ""}`).catch(async () => {
    // Fallback a ruta alternativa si el backend aún no migró
    return authFetch("/auth/suscriptores").catch(() => [])
  })
}

export const obtenerSuscriptorDetalleAdmin = (id) =>
  authFetch(`/admin/suscriptores/${id}`).catch(async () => {
    return authFetch(`/suscriptores/${id}`)
  })

export const obtenerPagosSuscriptorAdmin = (id) =>
  authFetch(`/admin/suscriptores/${id}/pagos`).catch(async () => {
    return authFetch(`/subscription/historial-pagos/${id}`).catch(() => [])
  })

export const obtenerOperadoresSuscriptorAdmin = (id) =>
  authFetch(`/admin/suscriptores/${id}/operadores`).catch(async () => {
    return authFetch(`/auth/operadores/${id}`).catch(() => [])
  })

export const actualizarEstadoSuscriptorAdmin = (id, estado) =>
  authFetch(`/admin/suscriptores/${id}/estado`, {
    method: "PUT",
    body: JSON.stringify({ estado }),
  })

export const asignarPlanSuscriptorAdmin = (id, plan_id) =>
  authFetch(`/admin/suscriptores/${id}/asignar-plan`, {
    method: "PUT",
    body: JSON.stringify({ plan_id }),
  })

export const impersonarSuscriptorAdmin = (suscriptorId) =>
  authFetch(`/admin/suscriptores/${suscriptorId}/impersonate`, {
    method: "POST",
  })

export const obtenerConsumoIASuscriptorAdmin = (suscriptorId) =>
  authFetch(`/admin/suscriptores/${suscriptorId}/consumo-ia`)

export const obtenerMetricasFinancierasAdmin = () =>
  authFetch("/admin/suscriptores/metrics/financieras")

// Gestión de Anuncios Globales
export const listarAnunciosAdmin = () =>
  authFetch("/admin/anuncios").catch(async () => {
    return authFetch("/anuncios/activos").catch(() => [])
  })

export const crearAnuncioAdmin = (data) =>
  authFetch("/admin/anuncios", {
    method: "POST",
    body: JSON.stringify(data),
  })

export const actualizarAnuncioAdmin = (id, data) =>
  authFetch(`/admin/anuncios/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })

export const eliminarAnuncioAdmin = (id) =>
  authFetch(`/admin/anuncios/${id}`, {
    method: "DELETE",
  })