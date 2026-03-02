/**
 * Alert Lifecycle Tracking Service
 * Tracks alert lifecycle from creation to resolution with action logging
 */
import { AlertLifecycle, LifecycleLogEntry, AlertDurationStats } from '../types/lifecycle.types';
export declare class AlertLifecycleService {
    private lifecycles;
    private logs;
    /**
     * Initialize tracking for a new alert
     */
    initializeAlert(alertId: string, tenantName: string, title: string, severity: string): void;
    /**
     * Log an action taken on an alert
     */
    logAction(alertId: string, action: string, description: string, user?: string, details?: Record<string, unknown>): void;
    /**
     * Change alert status
     */
    changeStatus(alertId: string, newStatus: 'open' | 'outstanding' | 'investigating' | 'closed' | 'resolved', reason?: string): void;
    /**
     * Assign alert to user
     */
    assignAlert(alertId: string, user: string): void;
    /**
     * Add notes to alert
     */
    addNotes(alertId: string, notes: string, user?: string): void;
    /**
     * Get lifecycle for an alert
     */
    getLifecycle(alertId: string): AlertLifecycle | undefined;
    /**
     * Get all lifecycles (useful for dashboard)
     */
    getAllLifecycles(): AlertLifecycle[];
    /**
     * Get current duration for an open alert
     */
    getCurrentDuration(alertId: string): number | null;
    /**
     * Format duration in milliseconds to human readable string
     */
    formatDuration(ms: number): string;
    /**
     * Get statistics for an alert
     */
    getAlertStats(alertId: string): AlertDurationStats | null;
    /**
     * Export lifecycle log as JSON
     */
    exportLog(): LifecycleLogEntry[];
    /**
     * Export alert histories in CSV format for reporting
     * IMPORTANT: Uses sanitization to prevent formula injection and CSV attacks
     */
    exportAsCsv(): string;
    /**
     * Get alerts by duration (for metrics)
     */
    getAlertsByDuration(status?: string): AlertDurationStats[];
    /**
     * Private: Log internal event
     */
    private logEvent;
}
export declare const createLifecycleService: () => AlertLifecycleService;
//# sourceMappingURL=lifecycle.service.d.ts.map