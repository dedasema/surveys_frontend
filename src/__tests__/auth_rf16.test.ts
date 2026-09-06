import { describe, it, expect, beforeEach, vi } from 'vitest';
import { tokenStorage } from '../features/auth/tokenStorage';
import { refreshAccessToken, authenticatedFetch } from '../features/auth/apiClient';

describe('RF16 - Token Storage & Session Management', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('stores and retrieves access and refresh tokens correctly', () => {
    tokenStorage.setTokens({
      access_token: 'access_abc_123',
      refresh_token: 'refresh_xyz_789',
    });

    expect(tokenStorage.getAccessToken()).toBe('access_abc_123');
    expect(tokenStorage.getRefreshToken()).toBe('refresh_xyz_789');
  });

  it('clears all session keys on logout', () => {
    tokenStorage.setTokens({
      access_token: 'access_abc_123',
      refresh_token: 'refresh_xyz_789',
    });
    localStorage.setItem('user', JSON.stringify({ id: 1 }));

    tokenStorage.clearTokens();

    expect(tokenStorage.getAccessToken()).toBeNull();
    expect(tokenStorage.getRefreshToken()).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('detects an expired JWT payload correctly', () => {
    // Generar un payload con exp en el pasado
    const pastExp = Math.floor(Date.now() / 1000) - 60;
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ sub: 1, exp: pastExp, permisos: ['admin'] }));
    const dummyJwt = `${header}.${payload}.fake_signature`;

    expect(tokenStorage.isTokenExpired(dummyJwt)).toBe(true);
  });

  it('detects a valid, non-expired JWT payload correctly', () => {
    // Generar un payload con exp a 1 hora en el futuro
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ sub: 1, exp: futureExp, permisos: ['encuestas'] }));
    const dummyJwt = `${header}.${payload}.fake_signature`;

    expect(tokenStorage.isTokenExpired(dummyJwt)).toBe(false);
  });

  it('successfully refreshes token with POST /auth/refresh on 401', async () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ sub: 1, exp: futureExp, permisos: ['encuestas'] }));
    const validJwt = `${header}.${payload}.fake_signature`;

    tokenStorage.setTokens({
      access_token: validJwt,
      refresh_token: 'valid_refresh_token',
    });

    // Mock global fetch
    const mockFetch = vi.fn();
    global.fetch = mockFetch;

    // 1ra llamada a /api/data da 401
    // 2da llamada a /auth/refresh devuelve nuevo access_token y refresh_token
    // 3ra llamada (reintento) a /api/data devuelve 200 con { success: true }
    mockFetch
      .mockResolvedValueOnce({
        status: 401,
        ok: false,
      })
      .mockResolvedValueOnce({
        status: 200,
        ok: true,
        json: async () => ({
          access_token: 'new_fresh_token',
          refresh_token: 'new_fresh_refresh_token',
        }),
      })
      .mockResolvedValueOnce({
        status: 200,
        ok: true,
        json: async () => ({ success: true }),
      });

    const res = await authenticatedFetch('https://surveys-backend-83d9.onrender.com/api/data');
    const data = await res.json();

    expect(data.success).toBe(true);
    expect(tokenStorage.getAccessToken()).toBe('new_fresh_token');
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });
});
