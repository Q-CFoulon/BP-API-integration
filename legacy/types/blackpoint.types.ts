/**
 * Blackpoint Cyber API Types
 * Based on CompassOne API v1.4.0 OpenAPI spec
 */

// ---------------------------------------------------------------------------
// Shared pagination
// ---------------------------------------------------------------------------

/** Pagination metadata returned by tenant/asset list endpoints */
export interface PageMeta {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  totalPages: number;
}

/** Generic paginated list (data + meta) used by tenant/asset endpoints */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PageMeta;
}

// ---------------------------------------------------------------------------
// Tenant  (TE_V1TenantDto)
// ---------------------------------------------------------------------------

export type TenantStatus = 'Active' | 'Trial' | 'Unknown';
export type SnapCustomerType = string; // extend as values become known

/** Tenant (/v1/tenants) — matches TE_V1TenantDto */
export interface Tenant {
  id: string;
  name: string;
  description: string | null;
  accountId: string | null;
  type: SnapCustomerType;
  snapAgentUrl: string | null;
  industryType: string;
  enableDeliveryEmail: boolean;
  contactGroupId: string | null;
  domain: string | null;
  /** ISO 8601 date-time */
  created: string;
  status: TenantStatus;
  contactGroup?: unknown;
  informationalAlertsEmails: string[];
  mdrReportsEmails: string[];
  darkWebAlertsEmails: string[];
}

/** Response from GET /v1/tenants */
export interface TenantListResponse extends PaginatedResponse<Tenant> {}

// ---------------------------------------------------------------------------
// Alert Groups / Detections  (AM_* schemas)
// ---------------------------------------------------------------------------

/** AM_AlertStatus — values returned by the API */
export type AlertStatus = 'OPEN' | 'RESOLVED';

/** AM_DetectionType */
export type DetectionType = 'CR' | 'MDR';

/** AM_V1AlertGroupDto — one alert group returned in /v1/alert-groups */
export interface AlertGroup {
  id: string;
  customerId: string;
  groupKey: string;
  riskScore: number;
  alertCount: number;
  alertTypes: string[];
  status: AlertStatus;
  ticketId: string;
  ticket?: unknown;
  alert?: unknown;
  /** ISO 8601 date-time */
  created: string;
  /** ISO 8601 date-time */
  updated?: string | null;
  // Runtime-enriched fields (not from API)
  tenantName?: string;
  hostname?: string;
  username?: string;
}

/** AM_ListAlertGroupPaginatedResponseDto — response from GET /v1/alert-groups */
export interface AlertGroupsListResponse {
  items: AlertGroup[];
  total: number;
  start: number;
  end: number;
  /** take value used for the request */
  take?: number;
  /** skip value used for the request */
  skip?: number;
}

// ---------------------------------------------------------------------------
// Event-signal / Notifications  (channel schemas)
// ---------------------------------------------------------------------------

export interface NotificationChannel {
  id: string;
  name: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Dashboard summary (application-level, not an API type)
// ---------------------------------------------------------------------------

export interface DashboardSummary {
  totalTenants: number;
  tenants: Tenant[];
}

export interface ApiDiscoveryResult {
  endpoint: string;
  method: string;
  description: string;
  supported: boolean;
  error?: string;
}

// ---------------------------------------------------------------------------
// Detection Report (application-level reporting)
// ---------------------------------------------------------------------------

/** Statistics for a single detection/alert group */
export interface DetectionStats {
  totalDetections: number;
  openDetections: number;
  resolvedDetections: number;
  averageRiskScore: number;
  maxRiskScore: number;
  minRiskScore: number;
}

/** Detection trend data aggregated by week */
export interface DetectionTrendEntry {
  week: string;
  date: string;
  detectionCount: number;
  resolvedCount: number;
  openCount: number;
}

/** Historical reporting summary for a tenant */
export interface TenantDetectionReport {
  tenantId: string;
  tenantName: string;
  reportGeneratedAt: string;
  stats: DetectionStats;
  recentResolved: AlertGroup[];
  trends?: DetectionTrendEntry[];
  topAlertTypes?: { type: string; count: number }[];
  riskScoreDistribution?: { range: string; count: number }[];
}

/** Closed/Resolved detection for after-the-fact review */
export interface ClosedDetection {
  id: string;
  tenantId: string;
  tenantName?: string;
  groupKey: string;
  status: 'RESOLVED';
  alertCount: number;
  riskScore: number;
  alertTypes: string[];
  hostname?: string;
  username?: string;
  createdDate: string;
  resolvedDate?: string;
  daysOpen?: number;
  ticketId?: string;
}

