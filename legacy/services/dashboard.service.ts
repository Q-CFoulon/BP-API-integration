/**
 * Dashboard Service
 * Aggregates tenant data for monitoring
 */

import { BlackpointApiClient } from './blackpoint-api.service';
import { TenantService } from './tenant.service';
import { DashboardSummary } from '../types/blackpoint.types';

export class DashboardService {
  private tenantService: TenantService;

  constructor(private apiClient: BlackpointApiClient) {
    this.tenantService = new TenantService(apiClient);
  }

  /**
   * Get complete dashboard summary
   */
  async getDashboardSummary(): Promise<DashboardSummary> {
    try {
      const tenants = await this.tenantService.fetchAllTenants();

      return {
        totalTenants: tenants.length,
        tenants: tenants.sort((a, b) => a.name.localeCompare(b.name)),
      };
    } catch (error) {
      console.error('Failed to generate dashboard summary:', error);
      throw error;
    }
  }
}

export const createDashboardService = (apiClient: BlackpointApiClient): DashboardService => {
  return new DashboardService(apiClient);
};
