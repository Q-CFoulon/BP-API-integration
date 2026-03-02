"use strict";
/**
 * Alert Lifecycle Tracking Service
 * Tracks alert lifecycle from creation to resolution with action logging
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLifecycleService = exports.AlertLifecycleService = void 0;
const input_sanitizer_1 = __importDefault(require("../utils/input-sanitizer"));
const secure_logger_1 = __importDefault(require("../utils/secure-logger"));
class AlertLifecycleService {
    constructor() {
        this.lifecycles = new Map();
        this.logs = [];
    }
    /**
     * Initialize tracking for a new alert
     */
    initializeAlert(alertId, tenantName, title, severity) {
        const now = new Date().toISOString();
        const lifecycle = {
            alertId,
            tenantName,
            title,
            status: 'open',
            severity: severity,
            createdAt: now,
            openedAt: now,
            actions: [],
        };
        this.lifecycles.set(alertId, lifecycle);
        this.logEvent('created', alertId, {
            tenantName,
            title,
            severity,
        });
        console.log(`[LIFECYCLE] Alert created: ${alertId} - ${title}`);
    }
    /**
     * Log an action taken on an alert
     */
    logAction(alertId, action, description, user, details) {
        const lifecycle = this.lifecycles.get(alertId);
        if (!lifecycle) {
            console.warn(`[LIFECYCLE] Alert not found: ${alertId}`);
            return;
        }
        const actionEntry = {
            timestamp: new Date().toISOString(),
            action,
            description,
            user,
            details,
        };
        lifecycle.actions.push(actionEntry);
        this.logEvent('action', alertId, {
            action,
            description,
            user,
            actionCount: lifecycle.actions.length,
        });
        console.log(`[LIFECYCLE] Action logged on ${alertId}: ${action} - ${description}${user ? ` (by ${user})` : ''}`);
    }
    /**
     * Change alert status
     */
    changeStatus(alertId, newStatus, reason) {
        const lifecycle = this.lifecycles.get(alertId);
        if (!lifecycle) {
            console.warn(`[LIFECYCLE] Alert not found: ${alertId}`);
            return;
        }
        const oldStatus = lifecycle.status;
        lifecycle.status = newStatus;
        this.logEvent('status_change', alertId, {
            fromStatus: oldStatus,
            toStatus: newStatus,
            reason,
        });
        console.log(`[LIFECYCLE] Status changed for ${alertId}: ${oldStatus} → ${newStatus}${reason ? ` (${reason})` : ''}`);
        // If transitioning to closed or resolved, record duration
        if ((newStatus === 'closed' || newStatus === 'resolved') && !lifecycle.closedAt) {
            lifecycle.closedAt = new Date().toISOString();
            lifecycle.durationMs =
                new Date(lifecycle.closedAt).getTime() - new Date(lifecycle.openedAt).getTime();
            this.logEvent('closed', alertId, {
                durationMs: lifecycle.durationMs,
                durationFormatted: this.formatDuration(lifecycle.durationMs),
            });
            console.log(`[LIFECYCLE] Alert closed: ${alertId} (Duration: ${this.formatDuration(lifecycle.durationMs)})`);
        }
    }
    /**
     * Assign alert to user
     */
    assignAlert(alertId, user) {
        const lifecycle = this.lifecycles.get(alertId);
        if (!lifecycle) {
            console.warn(`[LIFECYCLE] Alert not found: ${alertId}`);
            return;
        }
        lifecycle.assignedTo = user;
        this.logAction(alertId, 'assigned', `Alert assigned to ${user}`, 'system');
        console.log(`[LIFECYCLE] Alert assigned: ${alertId} → ${user}`);
    }
    /**
     * Add notes to alert
     */
    addNotes(alertId, notes, user) {
        const lifecycle = this.lifecycles.get(alertId);
        if (!lifecycle) {
            secure_logger_1.default.warn('Alert not found', { alertId });
            return;
        }
        // Sanitize inputs to prevent XSS
        const sanitizedNotes = input_sanitizer_1.default.sanitizeText(notes);
        const sanitizedUser = input_sanitizer_1.default.sanitizeText(user);
        lifecycle.notes = (lifecycle.notes || '') + `\n[${new Date().toISOString()}] ${sanitizedUser || 'Unknown'}: ${sanitizedNotes}`;
        this.logAction(alertId, 'note', sanitizedNotes, sanitizedUser);
        secure_logger_1.default.lifecycle('Note added to alert', { alertId });
    }
    /**
     * Get lifecycle for an alert
     */
    getLifecycle(alertId) {
        return this.lifecycles.get(alertId);
    }
    /**
     * Get all lifecycles (useful for dashboard)
     */
    getAllLifecycles() {
        return Array.from(this.lifecycles.values());
    }
    /**
     * Get current duration for an open alert
     */
    getCurrentDuration(alertId) {
        const lifecycle = this.lifecycles.get(alertId);
        if (!lifecycle)
            return null;
        if (lifecycle.closedAt) {
            return lifecycle.durationMs || 0;
        }
        // Calculate duration since opened
        return new Date().getTime() - new Date(lifecycle.openedAt).getTime();
    }
    /**
     * Format duration in milliseconds to human readable string
     */
    formatDuration(ms) {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));
        const parts = [];
        if (days > 0)
            parts.push(`${days}d`);
        if (hours > 0)
            parts.push(`${hours}h`);
        if (minutes > 0)
            parts.push(`${minutes}m`);
        if (seconds > 0)
            parts.push(`${seconds}s`);
        return parts.length > 0 ? parts.join(' ') : '0s';
    }
    /**
     * Get statistics for an alert
     */
    getAlertStats(alertId) {
        const lifecycle = this.lifecycles.get(alertId);
        if (!lifecycle)
            return null;
        const durationMs = lifecycle.closedAt
            ? lifecycle.durationMs || 0
            : new Date().getTime() - new Date(lifecycle.openedAt).getTime();
        return {
            alertId,
            totalDuration: durationMs,
            totalDurationFormatted: this.formatDuration(durationMs),
            status: lifecycle.status,
        };
    }
    /**
     * Export lifecycle log as JSON
     */
    exportLog() {
        return [...this.logs];
    }
    /**
     * Export alert histories in CSV format for reporting
     * IMPORTANT: Uses sanitization to prevent formula injection and CSV attacks
     */
    exportAsCsv() {
        const headers = ['AlertID', 'Tenant', 'Title', 'Severity', 'Status', 'Created', 'Opened', 'Closed', 'Duration', 'Actions'];
        const rows = this.lifecycles.values();
        const csvRows = [headers.join(',')];
        for (const row of rows) {
            const duration = row.closedAt
                ? this.formatDuration(row.durationMs || 0)
                : this.formatDuration(new Date().getTime() - new Date(row.openedAt).getTime());
            csvRows.push([
                input_sanitizer_1.default.sanitizeCsvField(row.alertId),
                input_sanitizer_1.default.sanitizeCsvField(row.tenantName),
                input_sanitizer_1.default.sanitizeCsvField(row.title),
                input_sanitizer_1.default.sanitizeCsvField(row.severity),
                input_sanitizer_1.default.sanitizeCsvField(row.status),
                input_sanitizer_1.default.sanitizeCsvField(row.createdAt),
                input_sanitizer_1.default.sanitizeCsvField(row.openedAt),
                input_sanitizer_1.default.sanitizeCsvField(row.closedAt || 'N/A'),
                input_sanitizer_1.default.sanitizeCsvField(duration),
                input_sanitizer_1.default.sanitizeCsvField(row.actions.length),
            ].join(','));
        }
        return csvRows.join('\n');
    }
    /**
     * Get alerts by duration (for metrics)
     */
    getAlertsByDuration(status) {
        return this.lifecycles
            .values()
            .toArray()
            .filter((l) => !status || l.status === status)
            .map((l) => this.getAlertStats(l.alertId))
            .sort((a, b) => b.totalDuration - a.totalDuration);
    }
    /**
     * Private: Log internal event
     */
    logEvent(eventType, alertId, eventData) {
        this.logs.push({
            timestamp: new Date().toISOString(),
            alertId,
            eventType,
            eventData,
        });
    }
}
exports.AlertLifecycleService = AlertLifecycleService;
const createLifecycleService = () => {
    return new AlertLifecycleService();
};
exports.createLifecycleService = createLifecycleService;
//# sourceMappingURL=lifecycle.service.js.map