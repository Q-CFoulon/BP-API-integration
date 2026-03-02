"use strict";
/**
 * SOC Alert Dashboard Component
 * React component displaying alerts with live timers, prioritized by severity
 *
 * Usage:
 * <AlertDashboard alerts={alerts} alertLifecycleService={lifecycleService} />
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertDashboard = void 0;
const react_1 = __importStar(require("react"));
const SeverityOrder = {
    critical: 1,
    high: 2,
    medium: 3,
    low: 4,
    info: 5,
};
const SeverityColors = {
    critical: '#dc2626', // Red
    high: '#ea580c', // Orange
    medium: '#eab308', // Yellow
    low: '#3b82f6', // Blue
    info: '#8b5cf6', // Purple
};
const StatusBadgeColors = {
    open: '#ef4444',
    outstanding: '#f97316',
    investigating: '#eab308',
    closed: '#22c55e',
    resolved: '#10b981',
};
const AlertDashboard = ({ alerts, alertLifecycleService, onAlertClick, refreshInterval = 1000, }) => {
    const [displayAlerts, setDisplayAlerts] = (0, react_1.useState)([]);
    const [timers, setTimers] = (0, react_1.useState)({});
    // Sort alerts by severity (high first) and filter by status
    const sortedAlerts = [...alerts]
        .filter((a) => a.status !== 'closed' && a.status !== 'resolved')
        .sort((a, b) => {
        const severityDiff = (SeverityOrder[a.severity] || 99) - (SeverityOrder[b.severity] || 99);
        if (severityDiff !== 0)
            return severityDiff;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
        .map((a) => ({
        ...a,
        openedAt: a.createdAt,
    }));
    // Update timers
    (0, react_1.useEffect)(() => {
        const interval = setInterval(() => {
            const newTimers = {};
            sortedAlerts.forEach((alert) => {
                const durationMs = alertLifecycleService.getCurrentDuration(alert.id);
                if (durationMs !== null) {
                    newTimers[alert.id] = formatDuration(durationMs);
                }
            });
            setTimers(newTimers);
        }, refreshInterval);
        return () => clearInterval(interval);
    }, [sortedAlerts, alertLifecycleService, refreshInterval]);
    (0, react_1.useEffect)(() => {
        setDisplayAlerts(sortedAlerts);
    }, [alerts]);
    return (<div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🔴 SOC Alert Dashboard</h1>
        <div style={styles.summary}>
          <span>Total Alerts: {displayAlerts.length}</span>
          <span style={{ marginLeft: '20px' }}>
            Critical: <strong>{displayAlerts.filter((a) => a.severity === 'critical').length}</strong>
          </span>
          <span style={{ marginLeft: '20px' }}>
            High: <strong>{displayAlerts.filter((a) => a.severity === 'high').length}</strong>
          </span>
        </div>
      </div>

      <div style={styles.alertsContainer}>
        {displayAlerts.length === 0 ? (<div style={styles.emptyState}>
            <p>✓ No outstanding alerts</p>
          </div>) : (displayAlerts.map((alert) => (<AlertCard key={alert.id} alert={alert} duration={timers[alert.id] || '0s'} onClick={() => onAlertClick?.(alert)} lifecycle={alertLifecycleService.getLifecycle(alert.id)}/>)))}
      </div>
    </div>);
};
exports.AlertDashboard = AlertDashboard;
const AlertCard = ({ alert, duration, onClick, lifecycle }) => {
    const [expanded, setExpanded] = (0, react_1.useState)(false);
    return (<div style={{
            ...styles.alertCard,
            borderLeftColor: SeverityColors[alert.severity] || '#666',
            backgroundColor: alert.severity === 'critical' ? '#fef2f2' : '#fafafa',
        }} onClick={() => setExpanded(!expanded)}>
      <div style={styles.alertHeader}>
        <div style={styles.alertTitleSection}>
          <div style={styles.severityBadge}>
            <span style={{
            ...styles.severityDot,
            backgroundColor: SeverityColors[alert.severity],
        }}>
              ●
            </span>
            <span style={styles.severityText}>{alert.severity.toUpperCase()}</span>
          </div>
          <h3 style={styles.alertTitle}>{alert.title}</h3>
        </div>

        <div style={styles.alertMeta}>
          <span style={{
            ...styles.statusBadge,
            backgroundColor: StatusBadgeColors[alert.status] || '#999',
        }}>
            {alert.status}
          </span>
          <div style={styles.timerDisplay}>
            <span style={styles.timerLabel}>Open for:</span>
            <span style={styles.timerValue}>{duration}</span>
          </div>
        </div>
      </div>

      <div style={styles.alertBody}>
        <div style={styles.metaRow}>
          <span style={styles.metaLabel}>Client:</span>
          <span style={styles.metaValue}>{alert.tenantName || 'N/A'}</span>
        </div>
        <div style={styles.metaRow}>
          <span style={styles.metaLabel}>Created:</span>
          <span style={styles.metaValue}>{new Date(alert.createdAt).toLocaleString()}</span>
        </div>
      </div>

      {expanded && lifecycle && (<div style={styles.expandedDetails}>
          <div style={styles.detailsHeader}>
            <h4>Alert History</h4>
          </div>

          {lifecycle.assignedTo && (<div style={styles.detailRow}>
              <span style={styles.detailLabel}>Assigned to:</span>
              <span>{lifecycle.assignedTo}</span>
            </div>)}

          <div style={styles.actionsSection}>
            <h5>Actions Taken ({lifecycle.actions?.length || 0})</h5>
            {lifecycle.actions && lifecycle.actions.length > 0 ? (<div style={styles.actionsList}>
                {lifecycle.actions.slice(-5).map((action, idx) => (<div key={idx} style={styles.actionItem}>
                    <span style={styles.actionTime}>
                      {new Date(action.timestamp).toLocaleTimeString()}
                    </span>
                    <span style={styles.actionText}>
                      {action.action} - {action.description}
                      {action.user && <span style={styles.actionUser}>(by {action.user})</span>}
                    </span>
                  </div>))}
              </div>) : (<p style={styles.noActions}>No actions recorded</p>)}
          </div>

          {lifecycle.notes && (<div style={styles.notesSection}>
              <h5>Notes</h5>
              <p style={styles.notesText}>{lifecycle.notes}</p>
            </div>)}
        </div>)}

      <div style={styles.cardFooter}>
        <button style={styles.expandButton} onClick={() => setExpanded(!expanded)}>
          {expanded ? '↑ Collapse' : '↓ Expand'}
        </button>
      </div>
    </div>);
};
function formatDuration(ms) {
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
    if (seconds > 0 || parts.length === 0)
        parts.push(`${seconds}s`);
    return parts.join(' ');
}
// Style definitions
const styles = {
    container: {
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu'",
    },
    header: {
        marginBottom: '30px',
    },
    title: {
        margin: '0 0 10px 0',
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#1f2937',
    },
    summary: {
        display: 'flex',
        gap: '20px',
        fontSize: '14px',
        color: '#6b7280',
        backgroundColor: '#fff',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    alertsContainer: {
        display: 'grid',
        gap: '16px',
    },
    emptyState: {
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '8px',
        textAlign: 'center',
        color: '#22c55e',
        fontSize: '18px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    alertCard: {
        backgroundColor: '#fff',
        borderLeft: '4px solid #dc2626',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
    },
    alertHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px',
    },
    alertTitleSection: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    severityBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#666',
        whiteSpace: 'nowrap',
    },
    severityDot: {
        fontSize: '16px',
        lineHeight: 1,
    },
    severityText: {
        fontSize: '11px',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    alertTitle: {
        margin: 0,
        fontSize: '16px',
        fontWeight: '600',
        color: '#1f2937',
    },
    alertMeta: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    statusBadge: {
        padding: '4px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '600',
        color: '#fff',
        textTransform: 'uppercase',
    },
    timerDisplay: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        backgroundColor: '#f0f0f0',
        padding: '8px 12px',
        borderRadius: '6px',
    },
    timerLabel: {
        fontSize: '11px',
        color: '#666',
    },
    timerValue: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#dc2626',
    },
    alertBody: {
        marginBottom: '12px',
        paddingBottom: '12px',
        borderBottom: '1px solid #e5e7eb',
    },
    metaRow: {
        display: 'flex',
        gap: '12px',
        fontSize: '13px',
        marginBottom: '6px',
    },
    metaLabel: {
        color: '#6b7280',
        fontWeight: '500',
        minWidth: '80px',
    },
    metaValue: {
        color: '#1f2937',
    },
    expandedDetails: {
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '1px solid #e5e7eb',
    },
    detailsHeader: {
        marginBottom: '12px',
    },
    detailRow: {
        display: 'flex',
        gap: '12px',
        fontSize: '13px',
        marginBottom: '8px',
    },
    detailLabel: {
        color: '#6b7280',
        fontWeight: '500',
        minWidth: '120px',
    },
    actionsSection: {
        marginTop: '12px',
    },
    actionsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        marginTop: '6px',
        fontSize: '12px',
    },
    actionItem: {
        display: 'flex',
        gap: '8px',
        padding: '6px 8px',
        backgroundColor: '#f3f4f6',
        borderRadius: '4px',
    },
    actionTime: {
        color: '#6b7280',
        fontWeight: '600',
        minWidth: '70px',
    },
    actionText: {
        color: '#1f2937',
        flex: 1,
    },
    actionUser: {
        color: '#9ca3af',
        marginLeft: '4px',
        fontSize: '11px',
    },
    noActions: {
        color: '#9ca3af',
        fontSize: '12px',
        margin: '6px 0',
    },
    notesSection: {
        marginTop: '12px',
        padding: '8px 12px',
        backgroundColor: '#fffbeb',
        borderRadius: '4px',
    },
    notesText: {
        margin: '6px 0 0 0',
        fontSize: '12px',
        color: '#78350f',
        whiteSpace: 'pre-wrap',
    },
    cardFooter: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '1px solid #e5e7eb',
    },
    expandButton: {
        padding: '6px 12px',
        fontSize: '12px',
        backgroundColor: '#f3f4f6',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '500',
    },
};
exports.default = exports.AlertDashboard;
//# sourceMappingURL=AlertDashboard.js.map