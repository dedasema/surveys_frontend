import { JWTPayload, TokenPair } from './types';

const ACCESS_TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';

export const tokenStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setTokens({ access_token, refresh_token }: Partial<TokenPair>): void {
    if (access_token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
    }
    if (refresh_token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
    }
  },

  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('last_user_id');
  },

  decodeToken(token: string): JWTPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4 !== 0) {
        base64 += '=';
      }

      const decoded = decodeURIComponent(
        Array.prototype.map
          .call(atob(base64), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  },

  isTokenExpired(token: string | null): boolean {
    if (!token) return true;
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) return true;

    // Margen de 10 segundos para anticipar latencia de red
    return payload.exp * 1000 < Date.now() + 10000;
  },
};
