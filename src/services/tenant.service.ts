/**
 * Blackpoint Tenant Service
 * Handles tenant data fetching and management
 */

import { BlackpointApiClient } from './blackpoint-api.service';
import { Tenant, PaginatedResponse } from '../types/blackpoint.types';
import { BLACKPOINT_ENDPOINTS } from '../utils/blackpoint.config';

export interface TenantFetchOptions {
  page?: number;
  pageSize?: number;
  sortBy?: 'name' | 'created';
  sortOrder?: 'ASC' | 'DESC';
}

export class TenantService {
  constructor(private apiClient: BlackpointApiClient) {}

  /**
   * Fetch all tenants with pagination support
   */
  async fetchAllTenants(options: TenantFetchOptions = {}): Promise<Tenant[]> {
    const allTenants: Tenant[] = [];
    let currentPage = options.page || 1;
    const pageSize = options.pageSize || 20;
    let totalPages = 1;

    while (currentPage <= totalPages) {
      const data = await this.fetchTenantsPage(currentPage, pageSize, options);
      allTenants.push(...data.data);
      totalPages = data.meta.totalPages;
      currentPage++;
    }

    return allTenants;
  }

  /**
   * Fetch a single page of tenants
   */
  async fetchTenantsPage(
    page: number = 1,
    pageSize: number = 20,
    options: TenantFetchOptions = {}
  ): Promise<PaginatedResponse<Tenant>> {
    const params: Record<string, string | number> = {
      page,
      pageSize,
    };

    if (options.sortBy) {
      params.sortBy = options.sortBy;
    }

    if (options.sortOrder) {
      params.sortOrder = options.sortOrder;
    }

    return this.apiClient.get<PaginatedResponse<Tenant>>(
      BLACKPOINT_ENDPOINTS.TENANTS,
      params
    );
  }

  /**
   * Fetch a specific tenant by ID
   */
  async fetchTenant(tenantId: string): Promise<Tenant> {
    const endpoint = BLACKPOINT_ENDPOINTS.TENANT_DETAIL.replace(':tenantId', tenantId);
    return this.apiClient.get<Tenant>(endpoint);
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
