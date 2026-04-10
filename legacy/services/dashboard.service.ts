/**
 * Dashboard Service
 * Aggregates tenant data for monitoring
 */

import { BlackpointApiClient } from './blackpoint-api.service';
import { TenantService } from './tenant.service';
import { DashboardSummary, Notification } from '../types/blackpoint.types';
import { BLACKPOINT_ENDPOINTS } from '../utils/blackpoint.config';

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

      let notifications: Notification[] = [];
      try {
        const response = await this.apiClient.get<{ data: Notification[] }>(
          BLACKPOINT_ENDPOINTS.NOTIFICATIONS
        );
        notifications = response.data;
      } catch {
        // Notifications endpoint may return empty or fail — non-critical
        notifications = [];
      }

      return {
        totalTenants: tenants.length,
        tenants: tenants.sort((a, b) => a.name.localeCompare(b.name)),
        notifications,
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
