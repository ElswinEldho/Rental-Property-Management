/**
 * Centralized API Client for Rental Property Management Frontend
 * Automatically enforces credentials: 'include' for secure HttpOnly cookie authentication
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export class ApiError extends Error {
  constructor(message, statusCode, code, details = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  /**
   * Dispatches an HTTP request with automatic JSON and Cookie transmission
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

      // Handle unauthenticated session
      if (response.status === 401 && !options._retry && !endpoint.includes('/auth/login')) {
        options._retry = true;
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.href = '/login?session_expired=true';
          return;
        }
      }

      // 204 No Content
      if (response.status === 204) {
        return null;
      }

      const payload = await response.json();

      if (!response.ok) {
        throw new ApiError(
          payload?.error?.message || payload?.message || `HTTP ${response.status}: Request failed`,
          response.status,
          payload?.error?.code || 'UNKNOWN_ERROR',
          payload?.error?.details || null
        );
      }

      return payload;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(error.message || 'Network request failed', 0, 'NETWORK_ERROR');
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;

