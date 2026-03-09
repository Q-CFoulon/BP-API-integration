/**
 * Blackpoint Tenant Service
 * Uses /v1/tenants — paginated response: { data: Tenant[], meta: PageMeta }
 */

import { BlackpointApiClient } from './blackpoint-api.service';
import { Tenant, TenantListResponse } from '../types/blackpoint.types';
import { BLACKPOINT_ENDPOINTS } from '../utils/blackpoint.config';

export class TenantService {
  constructor(private apiClient: BlackpointApiClient) {}

  /**
   * Fetch a single page of tenants.
   */
  async fetchTenants(options: {
    page?: number;
    pageSize?: number;
    search?: string;
    accountId?: string;
    sortBy?: 'id' | 'name' | 'created' | 'type' | 'description' | 'domain';
    sortOrder?: 'ASC' | 'DESC';
  } = {}): Promise<TenantListResponse> {
    const params: Record<string, string | number | boolean> = {
      page: options.page ?? 1,
      pageSize: options.pageSize ?? 50,
    };

    if (options.search) params.search = options.search;
    if (options.accountId) params.accountId = options.accountId;
    if (options.sortBy) params.sortBy = options.sortBy;
    if (options.sortOrder) params.sortOrder = options.sortOrder;

    return this.apiClient.get<TenantListResponse>(BLACKPOINT_ENDPOINTS.TENANTS, params);
  }

  /**
   * Fetch all tenants, auto-paginating through every page.
   */
  async fetchAllTenants(): Promise<Tenant[]> {
    const allTenants: Tenant[] = [];
    let page = 1;

    while (true) {
      const response = await this.fetchTenants({ page, pageSize: 50 });
      allTenants.push(...response.data);

      if (page >= response.meta.totalPages) break;
      page++;
    }

    return allTenants;
  }

  /**
   * Get tenant by ID (fetches all tenants and searches locally).
   */
  async getTenantById(tenantId: string): Promise<Tenant | null> {
    const tenants = await this.fetchAllTenants();
    return tenants.find((t) => t.id === tenantId) ?? null;
  }

  /**
   * Get tenant by name (fetches all tenants and searches locally).
   */
  async getTenantByName(name: string): Promise<Tenant | null> {
    const response = await this.fetchTenants({ search: name, pageSize: 10 });
    return response.data.find((t) => t.name === name) ?? null;
  }
}

export const createTenantService = (apiClient: BlackpointApiClient): TenantService => {
  return new TenantService(apiClient);
};
