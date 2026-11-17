const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://surveys-backend-83d9.onrender.com";

const getToken = () => localStorage.getItem("token");

/**
 * Envía un mensaje al Copiloto Inteligente con arquitectura MCP para empresas suscriptoras.
 * Endpoint principal: POST /copilot/chat
 * Alias secundario: POST /agente/copilot
 */
export async function sendCopilotMessage({ message, history = [], campana_id = null }) {
  const token = getToken();

  const payload = {
    message: message.trim(),
    history: history.slice(-6).map((m) => ({
      sender: m.sender === "user" ? "user" : "assistant",
      text: m.text,
    })),
    ...(campana_id ? { campana_id } : {}),
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
      answer: data.answer || "No se obtuvo respuesta del Copiloto.",
      tools_used: data.tools_used || [],
      suggested_actions: data.suggested_actions || [],
    };
  } catch (err) {
    console.error("Error en sendCopilotMessage:", err);
    throw err;
  }
}
