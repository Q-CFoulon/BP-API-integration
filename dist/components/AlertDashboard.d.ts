/**
 * SOC Alert Dashboard Component
 * React component displaying alerts with live timers, prioritized by severity
 *
 * Usage:
 * <AlertDashboard alerts={alerts} alertLifecycleService={lifecycleService} />
 */
import React from 'react';
import { Alert } from '../types/blackpoint.types';
import { AlertLifecycleService } from '../services/lifecycle.service';
interface AlertDashboardProps {
    alerts: Alert[];
    alertLifecycleService: AlertLifecycleService;
    onAlertClick?: (alert: Alert) => void;
    refreshInterval?: number;
}
export declare const AlertDashboard: React.FC<AlertDashboardProps>;
export default AlertDashboard;
//# sourceMappingURL=AlertDashboard.d.ts.map