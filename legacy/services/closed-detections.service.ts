/**
 * Closed Detections & Reporting Service
 * Handles after-the-fact review and reporting of resolved/closed detections.
 */

import { AlertService } from './alert.service';
import { TenantService } from './tenant.service';
import {
  AlertGroup,
  ClosedDetection,
  DetectionStats,
  DetectionTrendEntry,
  TenantDetectionReport,
} from '../types/blackpoint.types';

export interface ClosedDetectionFilters {
  /** ISO 8601 date-time — show detections created since this date (max 90 days ago) */
  since?: string;
  /** Minimum risk score (0-100) */
  minRiskScore?: number;
  /** Maximum risk score (0-100) */
  maxRiskScore?: number;
  /** Search by hostname or username */
  search?: string;
  /** Filter by alert type */
  alertType?: string;
}

export class ClosedDetectionsService {
  constructor(
    private alertService: AlertService,
    private tenantService: TenantService
  ) {}

  /**
   * Fetch all closed/resolved detections for a tenant.
   */
  async fetchClosedDetections(
    tenantId: string,
    filters: ClosedDetectionFilters = {}
  ): Promise<ClosedDetection[]> {
    const alertGroups = await this.alertService.fetchAllResolvedAlertGroups(
      tenantId,
      { since: filters.since }
    );

    return alertGroups
      .filter((group) => this.matchesFilters(group, filters))
      .map((group) => this.mapAlertGroupToClosedDetection(group, tenantId));
  }

  /**
   * Get statistics on closed detections for a tenant.
   */
  async getClosedDetectionStats(
    tenantId: string,
    options: { since?: string } = {}
  ): Promise<DetectionStats> {
    const allGroups = await this.alertService.fetchAllAlertGroups(tenantId, {
      since: options.since,
    });

    const openGroups = allGroups.filter((g) => g.status === 'OPEN');
    const resolvedGroups = allGroups.filter((g) => g.status === 'RESOLVED');

    const riskScores = allGroups.map((g) => g.riskScore);

    return {
      totalDetections: allGroups.length,
      openDetections: openGroups.length,
      resolvedDetections: resolvedGroups.length,
      averageRiskScore:
        riskScores.length > 0
          ? riskScores.reduce((a, b) => a + b, 0) / riskScores.length
          : 0,
      maxRiskScore: riskScores.length > 0 ? Math.max(...riskScores) : 0,
      minRiskScore: riskScores.length > 0 ? Math.min(...riskScores) : 0,
    };
  }

  /**
   * Get top alert types found in closed detections.
   */
  getTopAlertTypes(
    closedDetections: ClosedDetection[],
    limit: number = 10
  ): { type: string; count: number }[] {
    const typeCounts: Record<string, number> = {};

    closedDetections.forEach((detection) => {
      detection.alertTypes.forEach((type) => {
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });
    });

    return Object.entries(typeCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Get risk score distribution for closed detections.
   */
  getRiskScoreDistribution(
    closedDetections: ClosedDetection[]
  ): { range: string; count: number }[] {
    const ranges = [
      { range: '0-20', min: 0, max: 20, count: 0 },
      { range: '21-40', min: 21, max: 40, count: 0 },
      { range: '41-60', min: 41, max: 60, count: 0 },
      { range: '61-80', min: 61, max: 80, count: 0 },
      { range: '81-100', min: 81, max: 100, count: 0 },
    ];

    closedDetections.forEach((detection) => {
      const range = ranges.find(
        (r) => detection.riskScore >= r.min && detection.riskScore <= r.max
      );
      if (range) range.count++;
    });

    return ranges.map((r) => ({ range: r.range, count: r.count }));
  }

  /**
   * Generate a comprehensive report for a tenant's closed detections.
   */
  async generateTenantDetectionReport(
    tenantId: string,
    options: { since?: string; limit?: number } = {}
  ): Promise<TenantDetectionReport> {
    const tenant = await this.tenantService.getTenantById(tenantId);
    const tenantName = tenant?.name || 'Unknown Tenant';

    const stats = await this.getClosedDetectionStats(tenantId, {
      since: options.since,
    });

    const closedDetections = await this.fetchClosedDetections(tenantId, {
      since: options.since,
    });

    const topAlertTypes = this.getTopAlertTypes(
      closedDetections,
      options.limit || 10
    );
    const riskScoreDistribution = this.getRiskScoreDistribution(
      closedDetections
    );

    // Sort by date descending and limit
    const recentResolved = closedDetections
      .sort(
        (a, b) =>
          new Date(b.createdDate).getTime() -
          new Date(a.createdDate).getTime()
      )
      .slice(0, options.limit || 20)
      .map((cd) => ({
        id: cd.id,
        customerId: cd.tenantId,
        groupKey: cd.groupKey,
        status: 'RESOLVED' as const,
        alertCount: cd.alertCount,
        riskScore: cd.riskScore,
        alertTypes: cd.alertTypes,
        created: cd.createdDate,
        updated: cd.resolvedDate,
      })) as AlertGroup[];

    return {
      tenantId,
      tenantName,
      reportGeneratedAt: new Date().toISOString(),
      stats,
      recentResolved,
      topAlertTypes,
      riskScoreDistribution,
    };
  }

  /**
   * Generate reports for all tenants.
   */
  async generateAllTenantsDetectionReports(options: {
    since?: string;
    limit?: number;
  } = {}): Promise<TenantDetectionReport[]> {
    const tenants = await this.tenantService.fetchAllTenants();
    const reports: TenantDetectionReport[] = [];

    for (const tenant of tenants) {
      const report = await this.generateTenantDetectionReport(tenant.id, options);
      reports.push(report);
    }

    return reports;
  }

  /**
   * Calculate days a detection was open.
   */
  private calculateDaysOpen(
    createdDate: string,
    resolvedDate?: string
  ): number {
    const created = new Date(createdDate);
    const resolved = resolvedDate ? new Date(resolvedDate) : new Date();
    const diffTime = Math.abs(resolved.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Map AlertGroup to ClosedDetection.
   */
  private mapAlertGroupToClosedDetection(
    group: AlertGroup,
    tenantId: string
  ): ClosedDetection {
    return {
      id: group.id,
      tenantId,
      groupKey: group.groupKey,
      status: 'RESOLVED',
      alertCount: group.alertCount,
      riskScore: group.riskScore,
      alertTypes: group.alertTypes,
      createdDate: group.created,
      resolvedDate: group.updated,
      daysOpen: this.calculateDaysOpen(group.created, group.updated),
      ticketId: group.ticketId,
    };
  }

  /**
   * Filter alert groups based on provided filters.
   */
  private matchesFilters(group: AlertGroup, filters: ClosedDetectionFilters): boolean {
    if (filters.minRiskScore !== undefined && group.riskScore < filters.minRiskScore) {
      return false;
    }
    if (filters.maxRiskScore !== undefined && group.riskScore > filters.maxRiskScore) {
      return false;
    }
    if (filters.alertType && !group.alertTypes.includes(filters.alertType)) {
      return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const searchableText = [
        ...group.alertTypes,
      ].join(' ').toLowerCase();
      if (!searchableText.includes(searchLower)) {
        return false;
      }
    }
    return true;
  }
}

export const createClosedDetectionsService = (
  alertService: AlertService,
  tenantService: TenantService
): ClosedDetectionsService => {
  return new ClosedDetectionsService(alertService, tenantService);
};
