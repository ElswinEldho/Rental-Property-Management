import { apiClient } from '@/lib/api/apiClient';

export const rentalUnitService = {
  /**
   * List rental units with search, filtering, and pagination
   */
  async listUnits(params = {}) {
    const query = new URLSearchParams();
    if (params.propertyId) query.set('propertyId', params.propertyId);
    if (params.unitType) query.set('unitType', params.unitType);
    if (params.occupancyStatus) query.set('occupancyStatus', params.occupancyStatus);
    if (params.search) query.set('search', params.search);
    if (params.floor !== undefined && params.floor !== null && params.floor !== '') {
      query.set('floor', params.floor.toString());
    }
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);

    const qs = query.toString();
    const endpoint = `/units${qs ? `?${qs}` : ''}`;
    return apiClient.get(endpoint);
  },

  /**
   * Get rental unit by ID
   */
  async getUnitById(id) {
    return apiClient.get(`/units/${id}`);
  },

  /**
   * Create a new rental unit under a property
   */
  async createUnit(data) {
    return apiClient.post('/units', data);
  },

  /**
   * Update rental unit details
   */
  async updateUnit(id, data) {
    return apiClient.put(`/units/${id}`, data);
  },

  /**
   * Update rental unit status specifically
   */
  async updateUnitStatus(id, occupancyStatus) {
    return apiClient.patch(`/units/${id}/status`, { occupancyStatus });
  },

  /**
   * Delete a rental unit (allowed only if no historical dependencies)
   */
  async deleteUnit(id) {
    return apiClient.delete(`/units/${id}`);
  },

  /**
   * Get aggregated unit statistics
   */
  async getUnitStats(propertyId = null) {
    const endpoint = `/units/stats${propertyId ? `?propertyId=${propertyId}` : ''}`;
    return apiClient.get(endpoint);
  },
};

