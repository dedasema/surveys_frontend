export interface User {
  id: number | string;
  email: string;
  nombre?: string;
  rol?: string;
  tipo?: 'admin' | 'suscriptor' | 'operator' | string;
  permisos: string[];
  [key: string]: any;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type?: string;
  expires_in?: number;
}

export interface JWTPayload {
  sub: string | number;
  rol?: string;
  permisos?: string[];
  exp: number;
  [key: string]: any;
}

export interface LoginCredentials {
  email?: string;
  username?: string;
  password?: string;
  [key: string]: any;
}
