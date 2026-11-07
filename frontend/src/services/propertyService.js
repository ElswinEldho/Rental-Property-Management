import { apiClient } from '@/lib/api/apiClient';

export const propertyService = {
  /**
   * List properties with optional search, filters, and pagination
   */
  async listProperties(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.city) query.set('city', params.city);
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);

    const qs = query.toString();
    const endpoint = `/properties${qs ? `?${qs}` : ''}`;
    return apiClient.get(endpoint);
  },

  /**
   * Get property details by ID (including unit breakdown)
   */
  async getPropertyById(id) {
    return apiClient.get(`/properties/${id}`);
  },

  /**
   * Create a new property
   */
  async createProperty(data) {
    return apiClient.post('/properties', data);
  },

  /**
   * Update property details
   */
  async updateProperty(id, data) {
    return apiClient.put(`/properties/${id}`, data);
  },

  /**
   * Delete a property
   */
  async deleteProperty(id) {
    return apiClient.delete(`/properties/${id}`);
  },

  /**
   * Get portfolio statistics summary
   */
  async getPortfolioSummary() {
    return apiClient.get('/properties/summary');
  },
};

