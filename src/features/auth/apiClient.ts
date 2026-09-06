import { tokenStorage } from './tokenStorage';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://surveys-backend-83d9.onrender.com';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    tokenStorage.clearTokens();
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      tokenStorage.clearTokens();
      throw new Error('Refresh token expired or revoked');
    }

    const data = await response.json();
    const newAccessToken = data.access_token || data.token;
    const newRefreshToken = data.refresh_token || refreshToken;

    tokenStorage.setTokens({
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    });

    return newAccessToken;
  } catch (err) {
    tokenStorage.clearTokens();
    throw err;
  }
}

export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  let token = tokenStorage.getAccessToken();

  // Si el access token ya está expirado antes de enviar, renovar proactivamente
  if (token && tokenStorage.isTokenExpired(token)) {
    try {
      token = await refreshAccessToken();
    } catch {
      // Si falla proactivo, continuar para que el servidor responda o redirija
    }
  }

  const headers = new Headers(options.headers || {});
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  let response = await fetch(url, { ...options, headers });

  // Si responde 401, activar ciclo de auto-refresh
  if (response.status === 401) {
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        headers.set('Authorization', `Bearer ${newToken}`);
        return fetch(url, { ...options, headers });
      });
    }

    isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();
      processQueue(null, newToken);
      headers.set('Authorization', `Bearer ${newToken}`);
      return await fetch(url, { ...options, headers });
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      tokenStorage.clearTokens();
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
      throw refreshErr;
    } finally {
      isRefreshing = false;
    }
  }

  return response;
}

export const apiClient = {
  get: (endpoint: string, options: RequestInit = {}) =>
    authenticatedFetch(endpoint, { ...options, method: 'GET' }),

  post: (endpoint: string, body?: any, options: RequestInit = {}) =>
    authenticatedFetch(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: (endpoint: string, body?: any, options: RequestInit = {}) =>
    authenticatedFetch(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: (endpoint: string, options: RequestInit = {}) =>
    authenticatedFetch(endpoint, { ...options, method: 'DELETE' }),
};
