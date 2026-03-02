/**
 * Blackpoint Tenant Service
 * Handles tenant data fetching and management
 */

import { BlackpointApiClient } from './blackpoint-api.service';
import { Tenant, ApiResponse } from '../types/blackpoint.types';
import { BLACKPOINT_ENDPOINTS } from '../utils/blackpoint.config';

export class TenantService {
  constructor(private apiClient: BlackpointApiClient) {}

  /**
   * Fetch all tenants
   */
  async fetchAllTenants(): Promise<Tenant[]> {
    const response = await this.apiClient.get<ApiResponse<Tenant>>(
      BLACKPOINT_ENDPOINTS.TENANTS
    );
    return response.data;
  }

  /**
   * Get tenant by ID
   */
  async getTenantById(tenantId: string): Promise<Tenant | null> {
    const tenants = await this.fetchAllTenants();
    return tenants.find((t) => t.id === tenantId) || null;
  }

  /**
   * Get tenant by name
   */
  async getTenantByName(name: string): Promise<Tenant | null> {
    const tenants = await this.fetchAllTenants();
    return tenants.find((t) => t.name === name) || null;
  }
}

export const createTenantService = (apiClient: BlackpointApiClient): TenantService => {
  return new TenantService(apiClient);
};
