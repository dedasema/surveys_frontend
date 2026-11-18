const API_URL = process.env.REACT_APP_API_URL || "https://surveys-backend-83d9.onrender.com"

export async function registerSuscriptor(userData) {
  try {
    const response = await fetch(`${API_URL}/auth/register/suscriptor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || "Error al registrar suscriptor")
    }

    return await response.json()
  } catch (error) {
    console.error("Error en registro:", error)
    throw error
  }
}

export async function login(credentials) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    console.log("Respuesta login:", data);

    if (!response.ok) {
      throw new Error(data.detail || "Credenciales inválidas");
    }

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
    }
    if (data.refresh_token) {
      localStorage.setItem("refresh_token", data.refresh_token);
    }

    const userInfo = await getCurrentUser();
    console.log("Info de usuario:", userInfo);

    localStorage.setItem("user", JSON.stringify(userInfo));

    if (userInfo.rol === "admin") {
      window.location.href = "/dashboard/suscriptores";
    } else if (userInfo.tipo === "suscriptor") {
      window.location.href = "/dashboard-suscriptor/plantillas";
    } else if (userInfo.tipo === "operator") {
      window.location.href = "/dashboard-operador/plantillas";
    }

    return { ...data, user: userInfo };
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
}

export async function logout() {
  const refreshToken = localStorage.getItem("refresh_token") || localStorage.getItem("token");
  try {
    if (refreshToken) {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    }
  } catch (err) {
    console.warn("Error revocando sesión en servidor:", err);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("last_user_id");
  }
}


export function isTokenExpired(token) {
  if (!token || typeof token !== "string") return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    let payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (payload.length % 4 !== 0) {
      payload += "=";
    }
    const decodedStr = decodeURIComponent(
      atob(payload)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const decoded = JSON.parse(decodedStr);
    if (!decoded.exp) return false;
    return Date.now() >= (decoded.exp * 1000) - 5000;
  } catch {
    try {
      let payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      while (payload.length % 4 !== 0) {
        payload += "=";
      }
      const decoded = JSON.parse(atob(payload));
      if (!decoded.exp) return false;
      return Date.now() >= (decoded.exp * 1000) - 5000;
    } catch {
      return false;
    }
  }
}

export async function getCurrentUser() {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
      window.location.replace("/login");
    }
    throw new Error("Sesión expirada");
  }

  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
          window.location.replace("/login");
        }
        throw new Error("Sesión expirada");
      }
      throw new Error("Error al obtener información del usuario");
    }

    const userData = await response.json();
    const tipo = userData.rol === "empresa" ? "suscriptor" : userData.rol;

    // Actualiza la caché local
    localStorage.setItem("user", JSON.stringify(userData));

    return {
      ...userData,
      tipo,
    };
  } catch (error) {
    if (error.message === "Sesión expirada") {
      throw error;
    }

    // Solo en caso de corte real de red (offline) se consulta la caché
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      const cachedUser = localStorage.getItem("user");
      if (cachedUser) {
        const userData = JSON.parse(cachedUser);
        const tipo = userData.rol === "empresa" ? "suscriptor" : userData.rol;
        return {
          ...userData,
          tipo,
        };
      }
    }

    throw error;
  }
}

export function isAuthenticated() {
  const token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) {
    if (token) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return false;
  }
  return true;
}

export function getAuthToken() {
  const token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) {
    return null;
  }
  return token;
}

export function redirectBasedOnRole(user) {
  if (user.rol === "admin") {
    return "/dashboard/suscriptores";
  } else if (user.tipo === "suscriptor") {
    return "/dashboard-suscriptor/plantillas";
  } else if (user.tipo === "operator") {
    return "/dashboard-operador/plantillas";
  }
  return "/login";
}

export async function checkRouteAccess(requiredType) {
  try {
    if (!isAuthenticated()) {
      return { hasAccess: false, redirectTo: "/login" };
    }
    const user = await getCurrentUser();
    let hasAccess = false;

    if (requiredType === "admin" && user.rol === "admin") {
      hasAccess = true;
    } else if (requiredType === "suscriptor" && user.tipo === "suscriptor") {
      hasAccess = true;
    } else if (requiredType === "operator" && user.tipo === "operator") {
      hasAccess = true;
    }

    if (!hasAccess) {
      const correctRoute = redirectBasedOnRole(user);
      return { hasAccess: false, redirectTo: correctRoute };
    }

    return { hasAccess: true, user };
  } catch (error) {
    return { hasAccess: false, redirectTo: "/login" };
  }
}

export async function verifyRegistrationRequest(token) {
  try {
    const response = await fetch(`${API_URL}/auth/verify-registration?token=${token}`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error al verificar la cuenta");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en verificación de cuenta:", error);
    throw error;
  }
}

export async function requestVerificationEmail(email) {
  try {
    const response = await fetch(`${API_URL}/auth/request-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error al solicitar reenvío de verificación");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en solicitud de verificación:", error);
    throw error;
  }
}

export async function requestRegistration(userData) {
  try {
    const response = await fetch(`${API_URL}/auth/request-registration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error al solicitar registro");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en solicitud de registro:", error);
    throw error;
  }
}

export async function requestPasswordReset(email) {
  try {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error al solicitar restablecimiento de contraseña");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al solicitar restablecimiento:", error);
    throw error;
  }
}

export async function resetPassword(token, newPassword) {
  try {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, new_password: newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error al cambiar la contraseña");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al restablecer contraseña:", error);
    throw error;
  }
}

export const getAvatarUrl = (foto_url) => {
  if (!foto_url) return null;
  if (
    foto_url.startsWith("http://") ||
    foto_url.startsWith("https://") ||
    foto_url.startsWith("blob:") ||
    foto_url.startsWith("data:")
  ) {
    return foto_url;
  }
  const cleanPath = foto_url.startsWith("/") ? foto_url : `/${foto_url}`;
  return `${API_URL}${cleanPath}`;
};

export async function subirFotoPerfil(file) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No hay token de autenticación");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/auth/perfil/foto`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || "Error al subir la foto de perfil");
    }

    const data = await response.json();

    // Actualizar usuario en localStorage
    const cached = localStorage.getItem("user");
    if (cached) {
      try {
        const u = JSON.parse(cached);
        u.foto_url = data.foto_url;
        localStorage.setItem("user", JSON.stringify(u));
      } catch (e) {
        console.error(e);
      }
    }

    return data;
  } catch (error) {
    console.error("Error al subir foto de perfil:", error);
    throw error;
  }
}
