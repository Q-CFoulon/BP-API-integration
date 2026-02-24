/**
 * Blackpoint Cyber API Types
 */

export interface PaginationMeta {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Tenant types
 */
export interface Tenant {
  id: string;
  name: string;
  created: string;
  [key: string]: unknown;
}

/**
 * Alert/Ticket types
 */
export type AlertStatus = 'open' | 'outstanding' | 'closed' | 'resolved';
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface Alert {
  id: string;
  title: string;
  status: AlertStatus;
  severity: AlertSeverity;
  createdAt: string;
  tenantId?: string;
  tenantName?: string;
  [key: string]: unknown;
}

export interface DashboardSummary {
  totalTenants: number;
  totalOutstandingAlerts: number;
  alertsBySeverity: Record<AlertSeverity, number>;
  tenantAlerts: TenantAlertSummary[];
}

export interface TenantAlertSummary {
  tenantId: string;
  tenantName: string;
  openAlerts: number;
  outstandingAlerts: number;
  totalAlerts: number;
  mostRecentAlert: string | null;
}

export interface ApiDiscoveryResult {
  endpoint: string;
  method: string;
  description: string;
  supported: boolean;
  error?: string;
}
