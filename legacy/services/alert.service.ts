/**
 * Blackpoint Alert Groups Service
 * Uses the /v1/alert-groups endpoint (CompassOne API v1.7.0)
 *
 * Key API facts:
 *  - Pagination: take / skip  (not page / pageSize)
 *  - Sorting:    sortByColumn / sortDirection
 *  - Status:     'OPEN' | 'RESOLVED'  (uppercase)
 *  - Tenant:     x-tenant-id header   (not tenantId query param — deprecated)
 *  - Response:   { items, total, start, end }
 */

import { BlackpointApiClient } from './blackpoint-api.service';
import {
  AlertGroup,
  AlertStatus,
  AlertListResponse,
  AlertGroupsListResponse,
  AlertGroupsByWeekEntry,
  DetectionType,
  DetectionAlert,
  TopDetectionsByEntityEntry,
  TopDetectionsByThreatEntry,
} from '../types/blackpoint.types';
import { BLACKPOINT_ENDPOINTS } from '../utils/blackpoint.config';

export type AlertSortColumn =
  | 'alertCount'
  | 'alertTypes'
  | 'created'
  | 'hostname'
  | 'status'
  | 'username';

export interface AlertFetchOptions {
  /** Max items per page (default 100, max 100) */
  take?: number;
  /** Items to skip for pagination (default 0) */
  skip?: number;
  status?: AlertStatus[];
  /**
   * Detection type filter.
   * API v1.7 expects query param name `type` for /alert-groups list/count/by-week.
   */
  detectionType?: DetectionType;
  sortByColumn?: AlertSortColumn;
  sortDirection?: 'ASC' | 'DESC';
  /** ISO 8601 date-time — show groups created since this date (max 90 days ago) */
  since?: string;
  /** Search by alertTypes, username, and hostname */
  search?: string;
  /** Search by tunnel/proxy name */
  tunnelSearch?: string;
  /** Minimum alert count filter */
  minAlertsCount?: number;
  /** Maximum alert count filter */
  maxAlertsCount?: number;
}

export interface AlertListFetchOptions {
  take?: number;
  skip?: number;
  sortByColumn?: 'attacker' | 'created' | 'dataset' | 'target' | 'updated';
  sortDirection?: 'ASC' | 'DESC';
}

export class AlertService {
  constructor(private apiClient: BlackpointApiClient) {}

  /**
   * List alert groups for a tenant (single page).
   * Pass tenantId to set the x-tenant-id header.
   */
  async fetchAlertGroups(
    tenantId: string,
    options: AlertFetchOptions = {}
  ): Promise<AlertGroupsListResponse> {
    const params: Record<string, string | number | boolean | string[]> = {
      take: options.take ?? 100,
      skip: options.skip ?? 0,
    };

    if (options.status?.length) params.status = options.status;
    if (options.detectionType) params.type = options.detectionType;
    if (options.sortByColumn) params.sortByColumn = options.sortByColumn;
    if (options.sortDirection) params.sortDirection = options.sortDirection;
    if (options.since) params.since = options.since;
    if (options.search) params.search = options.search;
    if (options.tunnelSearch) params.tunnelSearch = options.tunnelSearch;
    if (options.minAlertsCount !== undefined) params.minAlertsCount = options.minAlertsCount;
    if (options.maxAlertsCount !== undefined) params.maxAlertsCount = options.maxAlertsCount;

    return this.apiClient.get<AlertGroupsListResponse>(
      BLACKPOINT_ENDPOINTS.ALERT_GROUPS,
      params,
      tenantId
    );
  }

  /**
   * Fetch all open alert groups for a tenant, auto-paginating through results.
   */
  async fetchAllOpenAlertGroups(tenantId: string): Promise<AlertGroup[]> {
    const allItems: AlertGroup[] = [];
    const take = 100;
    let skip = 0;

    while (true) {
      const page = await this.fetchAlertGroups(tenantId, {
        take,
        skip,
        status: ['OPEN'],
        sortByColumn: 'created',
        sortDirection: 'DESC',
      });

      allItems.push(...page.items);

      if (allItems.length >= page.total || page.items.length < take) break;
      skip += take;
    }

    return allItems;
  }

  /**
   * Get a single alert group by ID.
   */
  async fetchAlertGroup(alertGroupId: string): Promise<AlertGroup> {
    return this.apiClient.get<AlertGroup>(
      `${BLACKPOINT_ENDPOINTS.ALERT_GROUPS}/${alertGroupId}`
    );
  }

  /**
   * Get the total count of alert groups for a tenant.
   * Uses /v1/alert-groups/count
   */
  async fetchAlertGroupCount(
    tenantId: string,
    options: {
      startDate?: string;
      endDate?: string;
      status?: AlertStatus;
      detectionType?: DetectionType;
    } = {}
  ): Promise<{ count: number }> {
    const params: Record<string, string | number | boolean> = {};
    if (options.startDate) params.startDate = options.startDate;
    if (options.endDate) params.endDate = options.endDate;
    if (options.status) params.status = options.status;
    if (options.detectionType) params.type = options.detectionType;

    return this.apiClient.get<{ count: number }>(
      BLACKPOINT_ENDPOINTS.ALERT_GROUPS_COUNT,
      params,
      tenantId
    );
  }

  /**
   * Get alert group counts aggregated by week for a tenant.
   * Uses /v1/alert-groups/alert-groups-by-week
   */
  async fetchAlertGroupsByWeek(
    tenantId: string,
    options: {
      startDate?: string;
      endDate?: string;
      detectionType?: DetectionType;
    } = {}
  ): Promise<AlertGroupsByWeekEntry[]> {
    const params: Record<string, string | number | boolean> = {};
    if (options.startDate) params.startDate = options.startDate;
    if (options.endDate) params.endDate = options.endDate;
    if (options.detectionType) params.type = options.detectionType;

    return this.apiClient.get<AlertGroupsByWeekEntry[]>(
      BLACKPOINT_ENDPOINTS.ALERT_GROUPS_BY_WEEK,
      params,
      tenantId
    );
  }

  /**
   * List alerts for a specific alert group.
   * Uses /v1/alert-groups/{alertGroupId}/alerts.
   */
  async fetchAlertsForAlertGroup(
    tenantId: string,
    alertGroupId: string,
    options: AlertListFetchOptions = {}
  ): Promise<AlertListResponse> {
    const params: Record<string, string | number | boolean> = {
      take: options.take ?? 100,
      skip: options.skip ?? 0,
    };

    if (options.sortByColumn) params.sortByColumn = options.sortByColumn;
    if (options.sortDirection) params.sortDirection = options.sortDirection;

    return this.apiClient.get<AlertListResponse>(
      `${BLACKPOINT_ENDPOINTS.ALERT_GROUPS}/${alertGroupId}${BLACKPOINT_ENDPOINTS.ALERT_GROUPS_ALERTS_SUFFIX}`,
      params,
      tenantId
    );
  }

  /**
   * Convenience helper to fetch all alerts for an alert group with pagination.
   */
  async fetchAllAlertsForAlertGroup(
    tenantId: string,
    alertGroupId: string
  ): Promise<DetectionAlert[]> {
    const allItems: DetectionAlert[] = [];
    const take = 100;
    let skip = 0;

    while (true) {
      const page = await this.fetchAlertsForAlertGroup(tenantId, alertGroupId, {
        take,
        skip,
        sortByColumn: 'created',
        sortDirection: 'DESC',
      });

      allItems.push(...page.items);

      if (allItems.length >= page.total || page.items.length < take) break;
      skip += take;
    }

    return allItems;
  }

  /**
   * Returns top detections grouped by entity.
   */
  async fetchTopDetectionsByEntity(
    tenantId: string,
    options: {
      startDate?: string;
      endDate?: string;
      detectionType?: DetectionType;
      entityName?: string;
      limit?: number;
    } = {}
  ): Promise<TopDetectionsByEntityEntry[]> {
    const params: Record<string, string | number | boolean> = {};
    if (options.startDate) params.startDate = options.startDate;
    if (options.endDate) params.endDate = options.endDate;
    if (options.detectionType) params.detectionType = options.detectionType;
    if (options.entityName) params.entityName = options.entityName;
    if (options.limit !== undefined) params.limit = options.limit;

    const result = await this.apiClient.get<
      TopDetectionsByEntityEntry | TopDetectionsByEntityEntry[]
    >(BLACKPOINT_ENDPOINTS.TOP_DETECTIONS_BY_ENTITY, params, tenantId);

    return Array.isArray(result) ? result : [result];
  }

  /**
   * Returns top detections grouped by threat type.
   */
  async fetchTopDetectionsByThreat(
    tenantId: string,
    options: {
      startDate?: string;
      endDate?: string;
      detectionType?: DetectionType;
      limit?: number;
    } = {}
  ): Promise<TopDetectionsByThreatEntry[]> {
    const params: Record<string, string | number | boolean> = {};
    if (options.startDate) params.startDate = options.startDate;
    if (options.endDate) params.endDate = options.endDate;
    if (options.detectionType) params.detectionType = options.detectionType;
    if (options.limit !== undefined) params.limit = options.limit;

    const result = await this.apiClient.get<
      TopDetectionsByThreatEntry | TopDetectionsByThreatEntry[]
    >(BLACKPOINT_ENDPOINTS.TOP_DETECTIONS_BY_THREAT, params, tenantId);

    return Array.isArray(result) ? result : [result];
  }

  /**
   * Fetch all resolved/closed alert groups for a tenant, auto-paginating.
   * Useful for after-the-fact review and reporting.
   */
  async fetchAllResolvedAlertGroups(
    tenantId: string,
    options: { since?: string } = {}
  ): Promise<AlertGroup[]> {
    const allItems: AlertGroup[] = [];
    const take = 100;
    let skip = 0;

    while (true) {
      const page = await this.fetchAlertGroups(tenantId, {
        take,
        skip,
        status: ['RESOLVED'],
        sortByColumn: 'created',
        sortDirection: 'DESC',
        since: options.since,
      });

      allItems.push(...page.items);

      if (allItems.length >= page.total || page.items.length < take) break;
      skip += take;
    }

    return allItems;
  }

  /**
   * Fetch both open and resolved alert groups for a tenant (all statuses).
   * Useful for comprehensive reporting.
   */
  async fetchAllAlertGroups(
    tenantId: string,
    options: { since?: string } = {}
  ): Promise<AlertGroup[]> {
    const allItems: AlertGroup[] = [];
    const take = 100;
    let skip = 0;

    while (true) {
      const page = await this.fetchAlertGroups(tenantId, {
        take,
        skip,
        sortByColumn: 'created',
        sortDirection: 'DESC',
        since: options.since,
      });

      allItems.push(...page.items);

      if (allItems.length >= page.total || page.items.length < take) break;
      skip += take;
    }

    return allItems;
  }

  /**
   * Get the count of resolved alert groups for a tenant.
   */
  async fetchResolvedAlertGroupCount(
    tenantId: string,
    options: {
      startDate?: string;
      endDate?: string;
      detectionType?: DetectionType;
    } = {}
  ): Promise<{ count: number }> {
    return this.fetchAlertGroupCount(tenantId, {
      ...options,
      status: 'RESOLVED',
    });
  }
}

export const createAlertService = (apiClient: BlackpointApiClient): AlertService => {
  return new AlertService(apiClient);
};

