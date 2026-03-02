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
 * Simple API response (actual Blackpoint API format)
 */
export interface ApiResponse<T> {
  data: T[];
}

/**
 * Tenant types (based on real API response)
 */
export interface Tenant {
  id: string;
  name: string;
  accountId: string;
  contactGroupId: string;
  created: string;
  description: string | null;
  enableDeliveryEmail: boolean;
  domain: string;
  industryType: string | null;
  snapAgentUrl: string;
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

/**
 * Notification type
 */
export interface Notification {
  id: string;
  message: string;
  createdAt: string;
  [key: string]: unknown;
}

export interface DashboardSummary {
  totalTenants: number;
  tenants: Tenant[];
  notifications: Notification[];
}

export interface ApiDiscoveryResult {
  endpoint: string;
  method: string;
  description: string;
  supported: boolean;
  error?: string;
}
