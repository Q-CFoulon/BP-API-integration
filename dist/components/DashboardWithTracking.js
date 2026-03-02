"use strict";
/**
 * Dashboard with Lifecycle Tracking Example
 * Shows how to integrate the AlertDashboard component with lifecycle tracking
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardWithTracking = void 0;
const react_1 = __importStar(require("react"));
const AlertDashboard_1 = __importDefault(require("../components/AlertDashboard"));
const blackpoint_api_service_1 = require("../services/blackpoint-api.service");
const dashboard_service_1 = require("../services/dashboard.service");
const lifecycle_service_1 = require("../services/lifecycle.service");
const DashboardWithTracking = () => {
    const [alerts, setAlerts] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const lifecycleService = react_1.default.useMemo(() => (0, lifecycle_service_1.createLifecycleService)(), []);
    // Initialize API clients
    const apiClient = react_1.default.useMemo(() => (0, blackpoint_api_service_1.createApiClient)(), []);
    const dashboardService = react_1.default.useMemo(() => (0, dashboard_service_1.createDashboardService)(apiClient), [apiClient]);
    // Fetch alerts on mount and periodically
    (0, react_1.useEffect)(() => {
        const fetchAlerts = async () => {
            try {
                setLoading(true);
                const summary = await dashboardService.getDashboardSummary();
                // Flatten all alerts from all tenants
                const allAlerts = [];
                summary.tenantAlerts.forEach((tenantSummary) => {
                    // Note: In real usage, you'd fetch actual alerts from API
                    // This is simplified for demonstration
                });
                // Track new alerts in lifecycle service
                allAlerts.forEach((alert) => {
                    if (!lifecycleService.getLifecycle(alert.id)) {
                        lifecycleService.initializeAlert(alert.id, alert.tenantName || '', alert.title, alert.severity);
                    }
                });
                setAlerts(allAlerts);
                setError(null);
            }
            catch (err) {
                const errorMsg = err instanceof Error ? err.message : 'Failed to fetch alerts';
                console.error('Error fetching alerts:', errorMsg);
                setError(errorMsg);
            }
            finally {
                setLoading(false);
            }
        };
        fetchAlerts();
        // Refresh alerts every 30 seconds
        const interval = setInterval(fetchAlerts, 30000);
        return () => clearInterval(interval);
    }, [dashboardService, lifecycleService]);
    const handleAlertClick = (alert) => {
        console.log('Alert clicked:', alert);
        // Show detail panel, open investigation, etc.
    };
    const handleActionOnAlert = (alertId, action, description) => {
        lifecycleService.logAction(alertId, action, description, 'SOC_Analyst');
    };
    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading alerts...</div>;
    }
    if (error) {
        return (<div style={{ padding: '20px', color: '#dc2626', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
        Error: {error}
      </div>);
    }
    return (<div>
      <AlertDashboard_1.default alerts={alerts} alertLifecycleService={lifecycleService} onAlertClick={handleAlertClick} refreshInterval={1000}/>

      {/* Quick Action Panel */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
        <div style={{
            backgroundColor: '#fff',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            width: '280px',
        }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px' }}>Quick Actions</h4>

          <button style={{
            display: 'block',
            width: '100%',
            padding: '8px 12px',
            marginBottom: '8px',
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
        }} onClick={() => {
            const alertId = alerts[0]?.id;
            if (alertId) {
                handleActionOnAlert(alertId, 'acknowledged', 'SOC analyst acknowledged alert');
                lifecycleService.changeStatus(alertId, 'investigating', 'Investigating');
            }
        }}>
            Acknowledge Current Alert
          </button>

          <button style={{
            display: 'block',
            width: '100%',
            padding: '8px 12px',
            marginBottom: '8px',
            backgroundColor: '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
        }} onClick={() => {
            const alertId = alerts[0]?.id;
            if (alertId) {
                handleActionOnAlert(alertId, 'resolved', 'Issue resolved and verified');
                lifecycleService.changeStatus(alertId, 'resolved', 'Resolved by SOC');
            }
        }}>
            Resolve Current Alert
          </button>

          <button style={{
            display: 'block',
            width: '100%',
            padding: '8px 12px',
            backgroundColor: '#666',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
        }} onClick={() => {
            const csv = lifecycleService.exportAsCsv();
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `alert-report-${new Date().toISOString()}.csv`;
            a.click();
        }}>
            Export Report
          </button>
        </div>
      </div>
    </div>);
};
exports.DashboardWithTracking = DashboardWithTracking;
exports.default = exports.DashboardWithTracking;
//# sourceMappingURL=DashboardWithTracking.js.map