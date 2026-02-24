/**
 * Dashboard Service
 * Aggregates tenant and alert data for SOC monitoring
 */

import { BlackpointApiClient } from './blackpoint-api.service';
import { TenantService } from './tenant.service';
import { AlertService } from './alert.service';
import { DashboardSummary, TenantAlertSummary, Alert, AlertSeverity } from '../types/blackpoint.types';

export class DashboardService {
  private tenantService: TenantService;
  private alertService: AlertService;

  constructor(apiClient: BlackpointApiClient) {
    this.tenantService = new TenantService(apiClient);
    this.alertService = new AlertService(apiClient);
  }

  /**
   * Get complete dashboard summary for SOC team
   */
  async getDashboardSummary(): Promise<DashboardSummary> {
    try {
      const [tenants, outstandingAlerts] = await Promise.all([
        this.tenantService.fetchAllTenants(),
        this.alertService.fetchOutstandingAlerts(),
      ]);

      const tenantAlerts = tenants.map((tenant) => this.buildTenantAlertSummary(tenant.name, outstandingAlerts));

      const alertsBySeverity = this.aggregateAlertsBySeverity(outstandingAlerts);

      return {
        totalTenants: tenants.length,
        totalOutstandingAlerts: outstandingAlerts.length,
        alertsBySeverity,
        tenantAlerts: tenantAlerts.sort((a, b) => b.totalAlerts - a.totalAlerts),
      };
    } catch (error) {
      console.error('Failed to generate dashboard summary:', error);
      throw error;
    }
  }

  /**
   * Get alerts for a specific tenant
   */
  async getTenantAlertDetails(tenantName: string): Promise<{
    summary: TenantAlertSummary;
    alerts: Alert[];
  }> {
    const tenant = await this.tenantService.getTenantByName(tenantName);
    if (!tenant) {
      throw new Error(`Tenant not found: ${tenantName}`);
    }

    const alerts = await this.alertService.fetchTenantAlerts(tenant.name);
    const summary = this.buildTenantAlertSummary(tenant.name, alerts);

    return {
      summary,
      alerts,
    };
  }

  /**
   * Get recent critical and high severity alerts across all tenants
   */
  async getCriticalAlerts(): Promise<Alert[]> {
    const allAlerts = await this.alertService.fetchOutstandingAlerts();
    return allAlerts
      .filter((a) => a.severity === 'critical' || a.severity === 'high')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Build summary for a specific tenant
   */
  private buildTenantAlertSummary(tenantName: string, alerts: Alert[]): TenantAlertSummary {
    const tenantAlerts = alerts.filter((a) => a.tenantName === tenantName || a.tenantId === tenantName);

    const openAlerts = tenantAlerts.filter((a) => a.status === 'open').length;
    const outstandingAlerts = tenantAlerts.filter((a) => a.status === 'outstanding').length;

    const sortedByDate = [...tenantAlerts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      tenantId: tenantName,
      tenantName,
      openAlerts,
      outstandingAlerts,
      totalAlerts: tenantAlerts.length,
      mostRecentAlert: sortedByDate[0]?.createdAt || null,
    };
  }

  /**
   * Aggregate alerts by severity
   */
  private aggregateAlertsBySeverity(alerts: Alert[]): Record<AlertSeverity, number> {
    const severities: Record<AlertSeverity, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
    };

    alerts.forEach((alert) => {
      if (alert.severity in severities) {
        severities[alert.severity as AlertSeverity]++;
      }
    });

    return severities;
  }

  /**
   * Get alerts by status across all tenants
   */
  async getAlertsByStatus(status: 'open' | 'outstanding' | 'closed' | 'resolved'): Promise<Alert[]> {
    const allAlerts = await this.alertService.fetchOutstandingAlerts();
    return allAlerts.filter((a) => a.status === status);
  }
}

export const createDashboardService = (apiClient: BlackpointApiClient): DashboardService => {
  return new DashboardService(apiClient);
};
