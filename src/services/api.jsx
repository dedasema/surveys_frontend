import { addToOfflineQueue, isOnline, registerSync } from './offlineSync'
import { refreshAccessToken } from '../features/auth/apiClient'

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://surveys-backend-83d9.onrender.com"

export const parseApiErrorMessage = (status, rawText) => {
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

// Función para hacer requests autenticados
const authFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token")

  if (!token) {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
      window.location.replace("/login")
    }
    throw new Error("Sesión expirada")
  }

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  }

  // Para métodos que modifican datos (POST, PUT, PATCH, DELETE)
  if (!isOnline() && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method)) {
    console.log(`Dispositivo offline. Guardando ${options.method} ${endpoint} para sincronizar más tarde.`)
    
    // Extraer el body como un objeto para almacenar
    let data = null
    if (options.body) {
      try {
        data = typeof options.body === 'string' ? JSON.parse(options.body) : options.body
      } catch (e) {
        console.error('Error parsing request body:', e)
        data = options.body
      }
    }

    // Agregar a la cola offline
    await addToOfflineQueue(endpoint, options.method, data)
    
    // Registrar para background sync si está disponible
    await registerSync()

    if (options.method === 'DELETE') {
      return true
    }
    
    return {
      id: `offline_${new Date().getTime()}`,
      _offlineCreated: true,
      ...data,
      status: 'pending'
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      if (response.status === 401 || (response.status === 403 && (await response.clone().text()).toLowerCase().includes("token"))) {
        try {
          const newToken = await refreshAccessToken();
          config.headers.Authorization = `Bearer ${newToken}`;
          const retryRes = await fetch(`${API_BASE_URL}${endpoint}`, config);
          if (retryRes.ok) {
            if (retryRes.status === 204) return true;
            return retryRes.json();
          }
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
            window.location.replace("/login");
          }
          throw new Error("Sesión expirada");
        }
      }
      const rawText = await response.text()
      const friendlyMsg = parseApiErrorMessage(response.status, rawText)
      throw new Error(friendlyMsg)
    }

    if (response.status === 204) return true
    return response.json()
  } catch (error) {
    if (!isOnline() && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method)) {
      // Si hay un error de red, intentar guardar offline
      console.log(`Error de red. Guardando ${options.method} ${endpoint} para sincronizar después.`)
      
      let data = null
      if (options.body) {
        try {
          data = typeof options.body === 'string' ? JSON.parse(options.body) : options.body
        } catch (e) {
          data = options.body
        }
      }

      await addToOfflineQueue(endpoint, options.method, data)
      await registerSync()

      if (options.method === 'DELETE') {
        return true
      }
      
      return {
        id: `offline_${new Date().getTime()}`,
        _offlineCreated: true,
        ...data,
        status: 'pending'
      }
    }
    throw error
  }
}

// Plantillas
export const getPlantillas = () => authFetch("/plantillas")
export const getPlantilla = (id) => authFetch(`/plantillas/${id}`)
export const createPlantilla = (data) => authFetch("/plantillas", { method: "POST", body: JSON.stringify(data) })
export const updatePlantilla = (id, data) =>
  authFetch(`/plantillas/${id}`, { method: "PATCH", body: JSON.stringify(data) })
export const deletePlantilla = (id) => authFetch(`/plantillas/${id}`, { method: "DELETE" })

// Preguntas
export const getPreguntas = (plantillaId) => authFetch(`/plantillas/${plantillaId}/preguntas`)
export const createPregunta = (plantillaId, data) =>
  authFetch(`/plantillas/${plantillaId}/preguntas`, { method: "POST", body: JSON.stringify(data) })
export const updatePregunta = (plantillaId, preguntaId, data) =>
  authFetch(`/plantillas/${plantillaId}/preguntas/${preguntaId}`, { method: "PATCH", body: JSON.stringify(data) })
export const deletePregunta = (plantillaId, preguntaId) =>
  authFetch(`/plantillas/${plantillaId}/preguntas/${preguntaId}`, { method: "DELETE" })

// Opciones
// Obtener todas las opciones de una pregunta
export const getOpciones = (plantillaId, preguntaId) =>
  authFetch(`/plantillas/${plantillaId}/preguntas/${preguntaId}/opciones`)

// Crear una nueva opción
export const createOpcion = (plantillaId, preguntaId, data) =>
  authFetch(`/plantillas/${plantillaId}/preguntas/${preguntaId}/opciones`, {
    method: "POST",
    body: JSON.stringify(data),
  })

// Actualizar una opción existente
export const updateOpcion = (plantillaId, preguntaId, opcionId, data) =>
  authFetch(`/plantillas/${plantillaId}/preguntas/${preguntaId}/opciones/${opcionId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })

// Eliminar una opción
export const deleteOpcion = (plantillaId, preguntaId, opcionId) =>
  authFetch(`/plantillas/${plantillaId}/preguntas/${preguntaId}/opciones/${opcionId}`, { method: "DELETE" })

// Destinatarios
export const getDestinatarios = () => authFetch("/destinatarios")
export const createDestinatario = (data) => authFetch("/destinatarios", { method: "POST", body: JSON.stringify(data) })
export const updateDestinatario = (id, data) =>
  authFetch(`/destinatarios/${id}`, { method: "PATCH", body: JSON.stringify(data) })
export const deleteDestinatario = (id) => authFetch(`/destinatarios/${id}`, { method: "DELETE" })
//Operadores
export const registerOperator = (data) =>
  authFetch("/auth/register/usuario", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const listOperadores = (suscriptorId) =>
  authFetch(suscriptorId ? `/auth/operadores/${suscriptorId}` : "/auth/operadores");
export const obtenerOperadores = listOperadores;

// Campañas
export const getCampanas = () => authFetch("/campanas")
export const getCampana = (id) => authFetch(`/campanas/${id}`)
export const getCampanaFullDetail = (id) => authFetch(`/campanas/${id}/full-detail`)
export const createCampana = (data) => {
  // Limpiar campos vacíos antes de enviar
  const cleanData = Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== "" && value !== null))
  return authFetch("/campanas", { method: "POST", body: JSON.stringify(cleanData) })
}
export const updateCampana = (id, data) => {
  // Limpiar campos vacíos antes de enviar
  const cleanData = Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== "" && value !== null))
  return authFetch(`/campanas/${id}`, { method: "PATCH", body: JSON.stringify(cleanData) })
}
export const deleteCampana = (id) => authFetch(`/campanas/${id}`, { method: "DELETE" })

// Entregas
export const getEntregasByCampana = (campanaId, skip = 0, limit = 1000) =>
  authFetch(`/campanas/${campanaId}/entregas?skip=${skip}&limit=${limit}`)

export const createEntrega = (campanaId, data) =>
  authFetch(`/campanas/${campanaId}/entregas`, { method: "POST", body: JSON.stringify(data) })

export const getEntrega = (campanaId, entregaId) => authFetch(`/campanas/${campanaId}/entregas/${entregaId}`)

export const updateEntrega = (campanaId, entregaId, data) =>
  authFetch(`/campanas/${campanaId}/entregas/${entregaId}`, { method: "PATCH", body: JSON.stringify(data) })

export const deleteEntrega = (campanaId, entregaId) =>
  authFetch(`/campanas/${campanaId}/entregas/${entregaId}`, { method: "DELETE" })

export const markEntregaAsSent = (campanaId, entregaId) =>
  authFetch(`/campanas/${campanaId}/entregas/${entregaId}/mark-sent`, { method: "POST" })

export const markEntregaAsResponded = (campanaId, entregaId) =>
  authFetch(`/campanas/${campanaId}/entregas/${entregaId}/mark-responded`, { method: "POST" })

// Respuestas
export const getRespuestas = (campanId = null) => {
  const endpoint = campanId ? `/respuestas?campana_id=${campanId}` : "/respuestas"
  return authFetch(endpoint)
}

// Dashboard API
export const getDashboardData = async () => {
  return authFetch('/analytics/dashboard')
}

// Planes
export const obtenerPlanesPublicos = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/subscription/planes`);
    if (!res.ok) throw new Error("Error al obtener planes");
    const data = await res.json();
    return Array.isArray(data) ? data.filter((p) => p.activo !== false) : [];
  } catch (err) {
    console.warn("Error al obtener planes públicos:", err);
    return null;
  }
};

export const listPlanes = () => authFetch("/subscription/planes");

export const getPlan = (id) => authFetch(`/subscription/planes/${id}`);

export const createPlan = (data) =>
  authFetch("/subscription/planes", { method: "POST", body: JSON.stringify(data) });

export const updatePlan = (id, data) =>
  authFetch(`/subscription/planes/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deletePlan = (id) =>
  authFetch(`/subscription/planes/${id}`, { method: "DELETE" });

// Suscripciones
export const getMiSuscripcion = () => authFetch("/subscription/actual");

export const getHistorialPagos = () => authFetch("/subscription/historial-pagos");

export const obtenerPortalCliente = async () => {
  return authFetch("/subscription/portal-cliente", { method: "POST" })
}

export const obtenerAnunciosActivos = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/anuncios/activos`)
    if (!res.ok) return []
    return await res.json()
  } catch (err) {
    console.error("Error al obtener anuncios activos:", err)
    return []
  }
}

export const iniciarStripeCheckout = (suscriptorId, planId) =>
  authFetch(`/subscription/stripe-checkout?suscriptor_id=${suscriptorId}&plan_id=${planId}`, {
    method: "POST",
  });

// Tipo de Cambio Oficial (USD a BOB - Banco Central de Bolivia)
export const obtenerTipoCambioOficial = async () => {
  try {
    let res = await fetch(`${API_BASE_URL}/pagofacil/tipo-cambio`);
    if (!res.ok) {
      res = await fetch(`${API_BASE_URL}/subscription/pagofacil/tipo-cambio`);
    }
    if (res.ok) {
      return await res.json();
    }
    return {
      valor: 7.0,
      fuente: "Fallback Local",
      moneda: "USD/BOB",
      fecha: new Date().toISOString().slice(0, 10),
      es_fallback: true,
    };
  } catch (err) {
    console.warn("Error obteniendo tipo de cambio oficial, usando fallback:", err);
    return {
      valor: 7.0,
      fuente: "Fallback Local",
      moneda: "USD/BOB",
      fecha: new Date().toISOString().slice(0, 10),
      es_fallback: true,
    };
  }
};

// PagoFácil QR (Bolivia en Bs.)
export const generarPagoFacilQR = async (payload) => {
  return authFetch("/pagofacil/generar-qr", {
    method: "POST",
    body: JSON.stringify(payload),
  }).catch(async () => {
    return authFetch("/subscription/pagofacil/generar-qr", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  });
};

export const consultarPagoFacilEstado = async (paymentNumber) => {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  let res = await fetch(`${API_BASE_URL}/pagofacil/estado/${paymentNumber}`, {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
  if (!res.ok) {
    res = await fetch(`${API_BASE_URL}/subscription/pagofacil/estado/${paymentNumber}`, {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });
  }
  if (!res.ok) {
    res = await fetch(`${API_BASE_URL}/pagofacil/consultar/${paymentNumber}`, {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });
  }
  if (!res.ok) {
    res = await fetch(`${API_BASE_URL}/subscription/pagofacil/consultar/${paymentNumber}`, {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });
  }
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Error al consultar estado (${res.status})`);
  }
  return await res.json();
};

// Auth
export const getMe = () => authFetch("/auth/me");

// Entregas por Papel (Bulk)
export const createBulkEntregas = (campanaId, cantidad) =>
  authFetch(`/campanas/${campanaId}/entregas/bulk?cantidad=${cantidad}`, { method: "POST", body: "" })

// Descargar formulario PDF individual
export const downloadFormularioPdf = async (campanaId) => {
  const token = localStorage.getItem("token")

  if (!token) {
    throw new Error("No hay token de autenticación")
  }

  const endpoints = [
    `${API_BASE_URL}/entregas/campanas/${campanaId}/formularios.pdf`,
    `${API_BASE_URL}/campanas/${campanaId}/formularios.pdf`,
    `${API_BASE_URL}/campanas/${campanaId}/pdf`,
  ]

  let lastError = null

  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/pdf, application/json",
        },
      })

      if (response.ok) {
        return await response.blob()
      }

      if (response.status === 401) {
        localStorage.removeItem("token")
        window.location.href = "/login"
        throw new Error("Sesión expirada")
      }

      lastError = `Error ${response.status}: ${response.statusText}`
    } catch (err) {
      lastError = err.message
    }
  }

  throw new Error(
    lastError || "No se encontró el endpoint del PDF en el backend (404). Asegurate de que el endpoint esté activo en el servidor."
  )
}

// Funciones para el perfil del suscriptor
export async function updateSuscriptor(data) {
  console.log('data', data)
  const token = localStorage.getItem("token")
  try {
    const response = await fetch(`${API_BASE_URL}/auth/update/suscriptor`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || "Error al actualizar el perfil del suscriptor")
    }

    return await response.json()
  } catch (error) {
    console.error("Error al actualizar suscriptor:", error)
    throw error
  }
}

// Funciones para el perfil del operador
export async function updateOperator(data) {
  const token = localStorage.getItem("token")
  try {
    const response = await fetch(`${API_BASE_URL}/auth/update/operator`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || "Error al actualizar el perfil del operador")
    }

    return await response.json()
  } catch (error) {
    console.error("Error al actualizar operador:", error)
    throw error
  }
}


// Entregas por Audio (Bulk)
export const createBulkAudioEntregas = (campanaId, cantidad) =>
  authFetch(`/campanas/${campanaId}/entregas/bulk-audio?cantidad=${cantidad}`, { method: "POST", body: "" })

// Exportación a Excel de Respuestas
export async function exportarRespuestasExcel(campanaId, nombreCampana = "campana") {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("No hay token de autenticación")

  const response = await fetch(`${API_BASE_URL}/campanas/${campanaId}/exportar-excel`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Error al exportar a Excel (${response.status})`)
  }

  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `respuestas_${nombreCampana.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.xlsx`
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
  return true
}