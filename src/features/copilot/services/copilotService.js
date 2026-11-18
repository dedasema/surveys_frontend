const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://surveys-backend-83d9.onrender.com";

const getToken = () => localStorage.getItem("token");

/**
 * Obtiene la lista de sesiones del Copiloto Inteligente desde el backend.
 * Endpoint: GET /copilot/sessions
 * @returns {Promise<Array<{id: string, title: string, campana_id: string|null, created_at: string, updated_at: string, message_count: number}>>}
 */
export async function getCopilotSessions() {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const res = await fetch(`${API_BASE_URL}/copilot/sessions`, {
      method: "GET",
      headers,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error al obtener sesiones (${res.status})`);
    }
    return await res.json();
  } catch (err) {
    console.error("Error en getCopilotSessions:", err);
    throw err;
  }
}

/**
 * Crea una nueva sesión en el backend.
 * Endpoint: POST /copilot/sessions
 * @param {{ title?: string, campana_id?: string|null }} params
 * @returns {Promise<Object>}
 */
export async function createCopilotSession({ title = "Nueva conversación", campana_id = null } = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const payload = {
    title: title || "Nueva conversación",
    campana_id: campana_id || null,
  };

  try {
    const res = await fetch(`${API_BASE_URL}/copilot/sessions`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error al crear sesión (${res.status})`);
    }
    return await res.json();
  } catch (err) {
    console.error("Error en createCopilotSession:", err);
    throw err;
  }
}

/**
 * Obtiene los mensajes cronológicos de una sesión dada.
 * Endpoint: GET /copilot/sessions/{session_id}/messages
 * @param {string} sessionId
 * @returns {Promise<Array<Object>>}
 */
export async function getCopilotSessionMessages(sessionId) {
  if (!sessionId) return [];
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const res = await fetch(`${API_BASE_URL}/copilot/sessions/${sessionId}/messages`, {
      method: "GET",
      headers,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error al obtener mensajes (${res.status})`);
    }
    return await res.json();
  } catch (err) {
    console.error(`Error en getCopilotSessionMessages para ${sessionId}:`, err);
    throw err;
  }
}

/**
 * Elimina una sesión del backend.
 * Endpoint: DELETE /copilot/sessions/{session_id}
 * @param {string} sessionId
 * @returns {Promise<Object>}
 */
export async function deleteCopilotSession(sessionId) {
  if (!sessionId) return { success: false };
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const res = await fetch(`${API_BASE_URL}/copilot/sessions/${sessionId}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error al eliminar sesión (${res.status})`);
    }
    return await res.json();
  } catch (err) {
    console.error(`Error en deleteCopilotSession para ${sessionId}:`, err);
    throw err;
  }
}

/**
 * Envía un mensaje al Copiloto Inteligente con arquitectura MCP para empresas suscriptoras y administradores.
 * Endpoint principal: POST /copilot/chat
 * Alias secundario: POST /agente/copilot
 * @param {import('../types').CopilotChatPayload} params
 * @returns {Promise<import('../types').CopilotChatResponse>}
 */
export async function sendCopilotMessage({ message, history = [], campana_id = null, session_id = null }) {
  const token = getToken();

  const payload = {
    message: message.trim(),
    ...(session_id ? { session_id } : {}),
    ...(campana_id ? { campana_id } : {}),
    ...(history && history.length
      ? {
          history: history.slice(-6).map((m) => ({
            sender: m.sender === "user" ? "user" : "assistant",
            text: m.text,
          })),
        }
      : {}),
  };

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    let res = await fetch(`${API_BASE_URL}/copilot/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // Intentar con el endpoint alias
      res = await fetch(`${API_BASE_URL}/agente/copilot`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
    }

    if (!res.ok) {
      // Si ambos fallan, intentar con el endpoint legacy /chat
      res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: payload.message,
          context: {
            route: typeof window !== "undefined" ? window.location.pathname : "",
            campana_id,
            session_id,
          },
        }),
      });
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Error de conexión con el Copiloto (${res.status})`
      );
    }

    const data = await res.json();
    return {
      answer: data.answer || data.respuesta || "No se obtuvo respuesta del Copiloto.",
      tools_used: data.tools_used || [],
      suggested_actions: data.suggested_actions || [],
      fuentes_citadas: data.fuentes_citadas || [],
      session_id: data.session_id || session_id,
    };
  } catch (err) {
    console.error("Error en sendCopilotMessage:", err);
    throw err;
  }
}
