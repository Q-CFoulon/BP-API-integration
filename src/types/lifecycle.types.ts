/**
 * Alert Lifecycle and Tracking Types
 */

export interface AlertAction {
  timestamp: string;
  action: string;
  description: string;
  user?: string;
  details?: Record<string, unknown>;
}

export interface AlertLifecycle {
  alertId: string;
  tenantName: string;
  title: string;
  status: 'open' | 'outstanding' | 'investigating' | 'closed' | 'resolved';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  createdAt: string;
  openedAt: string;
  closedAt?: string;
  durationMs?: number; // Time from open to closed in milliseconds
  actions: AlertAction[];
  assignedTo?: string;
  notes?: string;
}

export interface AlertDurationStats {
  alertId: string;
  totalDuration: number; // in milliseconds
  totalDurationFormatted: string; // Human readable: "2h 30m 45s"
  status: string;
}

export interface LifecycleLogEntry {
  timestamp: string;
  alertId: string;
  eventType: 'created' | 'opened' | 'action' | 'status_change' | 'closed' | 'resolved';
  eventData: Record<string, unknown>;
}
