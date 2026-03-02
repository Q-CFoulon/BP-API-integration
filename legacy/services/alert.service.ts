/**
 * Blackpoint Alert Service
 * Handles alert/incident fetching and filtering
 */

import { BlackpointApiClient } from './blackpoint-api.service';
import { Alert, AlertStatus, PaginatedResponse, DashboardSummary, TenantAlertSummary } from '../types/blackpoint.types';
import { BLACKPOINT_ENDPOINTS } from '../utils/blackpoint.config';

export interface AlertFetchOptions {
  page?: number;
  pageSize?: number;
  status?: AlertStatus[];
  tenantId?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export class AlertService {
  private discoveredAlertEndpoint: string | null = null;

  constructor(private apiClient: BlackpointApiClient) {}

  /**
   * Discover which endpoint to use for alerts
   */
  async discoverAlertEndpoint(): Promise<string> {
    if (this.discoveredAlertEndpoint) {
      return this.discoveredAlertEndpoint;
    }

    const endpointsToTry = [
      BLACKPOINT_ENDPOINTS.ALERTS,
      BLACKPOINT_ENDPOINTS.INCIDENTS,
      '/alerts',
      '/incidents',
      '/tickets',
    ];

    for (const endpoint of endpointsToTry) {
      try {
        const result = await this.apiClient.get<PaginatedResponse<Alert>>(endpoint, {
          pageSize: 1,
          page: 1,
        });

        if (result && result.data !== undefined) {
          this.discoveredAlertEndpoint = endpoint;
          console.log(`Discovered alert endpoint: ${endpoint}`);
          return endpoint;
        }
      } catch (error) {
        // Continue to next endpoint
      }
    }

    throw new Error('Could not discover alert endpoint from API');
  }

  /**
   * Fetch outstanding/open alerts for all tenants
   */
  async fetchOutstandingAlerts(): Promise<Alert[]> {
    const endpoint = await this.discoverAlertEndpoint();
    const allAlerts: Alert[] = [];
    let currentPage = 1;
    let totalPages = 1;

    while (currentPage <= totalPages) {
      const data = await this.apiClient.get<PaginatedResponse<Alert>>(endpoint, {
        page: currentPage,
        pageSize: 100,
        status: JSON.stringify(['open', 'outstanding']),
      });

      allAlerts.push(...data.data);
      totalPages = data.meta.totalPages;
      currentPage++;
    }

    return allAlerts;
  }

  /**
   * Fetch alerts for a specific tenant
   */
  async fetchTenantAlerts(
    tenantId: string,
    options: AlertFetchOptions = {}
  ): Promise<Alert[]> {
    const endpoint = await this.discoverAlertEndpoint();
    const allAlerts: Alert[] = [];
    let currentPage = options.page || 1;
    const pageSize = options.pageSize || 50;
    let totalPages = 1;

    while (currentPage <= totalPages) {
      const params: Record<string, string | number> = {
        page: currentPage,
        pageSize,
        tenantId,
      };

      if (options.status?.length) {
        params.status = JSON.stringify(options.status);
      }

      if (options.sortBy) {
        params.sortBy = options.sortBy;
      }

      if (options.sortOrder) {
        params.sortOrder = options.sortOrder;
      }

      const data = await this.apiClient.get<PaginatedResponse<Alert>>(endpoint, params);
      allAlerts.push(...data.data);
      totalPages = data.meta.totalPages;
      currentPage++;
    }

    return allAlerts;
  }

  /**
   * Fetch alerts with specific statuses
   */
  async fetchAlertsByStatus(statuses: AlertStatus[]): Promise<Alert[]> {
    const endpoint = await this.discoverAlertEndpoint();
    const allAlerts: Alert[] = [];
    let currentPage = 1;
    let totalPages = 1;

    while (currentPage <= totalPages) {
      const data = await this.apiClient.get<PaginatedResponse<Alert>>(endpoint, {
        page: currentPage,
        pageSize: 100,
        status: JSON.stringify(statuses),
      });

      allAlerts.push(...data.data);
      totalPages = data.meta.totalPages;
      currentPage++;
    }

    return allAlerts;
  }

  /**
   * Get single alert by ID
   */
  async fetchAlert(alertId: string): Promise<Alert> {
    const endpoint = await this.discoverAlertEndpoint();
    return this.apiClient.get<Alert>(`${endpoint}/${alertId}`);
  }
}

export const createAlertService = (apiClient: BlackpointApiClient): AlertService => {
  return new AlertService(apiClient);
};
