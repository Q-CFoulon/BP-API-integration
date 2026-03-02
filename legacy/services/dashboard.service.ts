/**
 * Dashboard Service
 * Aggregates tenant and notification data for monitoring
 */

import { BlackpointApiClient } from './blackpoint-api.service';
import { TenantService } from './tenant.service';
import { DashboardSummary, Notification, ApiResponse } from '../types/blackpoint.types';

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
      const [tenants, notifications] = await Promise.all([
        this.tenantService.fetchAllTenants(),
        this.fetchNotifications(),
      ]);

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

  /**
   * Fetch notifications
   */
  private async fetchNotifications(): Promise<Notification[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<Notification>>('/notifications');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return [];
    }
  }
}

export const createDashboardService = (apiClient: BlackpointApiClient): DashboardService => {
  return new DashboardService(apiClient);
};
