/**
 * Centralized API Client for Rental Property Management Frontend
 * Automatically enforces credentials: 'include' for secure HttpOnly cookie authentication
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  /**
   * Dispatches an HTTP request with JSON / Cookie transmission
   * @param {string} endpoint - Relative path (e.g. '/health')
   * @param {RequestInit} [options={}] - Standard Fetch options
   * @returns {Promise<any>}
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

    const headers = {
      Accept: 'application/json',
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Automatically sends HttpOnly auth cookies
      });

      // Handle session expiration
      if (response.status === 401 && !options._retry && !endpoint.includes('/auth/refresh')) {
        options._retry = true;
        const refreshed = await this.refreshToken();
        if (refreshed) {
          return this.request(endpoint, options);
        } else if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.href = '/login?session_expired=true';
          return;
        }
      }

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error?.message || `HTTP ${response.status}: Request failed`);
      }

      return payload;
    } catch (error) {
      console.error(`[API Client Error] ${options.method || 'GET'} ${endpoint}:`, error.message);
      throw error;
    }
  }

  async refreshToken() {
    try {
      const res = await fetch(`${this.baseUrl}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    const target = query ? `${endpoint}?${query}` : endpoint;
    return this.request(target, { method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

