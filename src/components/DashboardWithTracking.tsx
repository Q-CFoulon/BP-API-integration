/**
 * Dashboard with Lifecycle Tracking Example
 * Shows how to integrate the AlertDashboard component with lifecycle tracking
 */

import React, { useState, useEffect } from 'react';
import AlertDashboard from '../components/AlertDashboard';
import { createApiClient } from '../services/blackpoint-api.service';
import { createDashboardService } from '../services/dashboard.service';
import { createLifecycleService } from '../services/lifecycle.service';
import { Alert } from '../types/blackpoint.types';

export const DashboardWithTracking: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lifecycleService = React.useMemo(() => createLifecycleService(), []);

  // Initialize API clients
  const apiClient = React.useMemo(() => createApiClient(), []);
  const dashboardService = React.useMemo(() => createDashboardService(apiClient), [apiClient]);

  // Fetch alerts on mount and periodically
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const summary = await dashboardService.getDashboardSummary();

        // Flatten all alerts from all tenants
        const allAlerts: Alert[] = [];
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
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch alerts';
        console.error('Error fetching alerts:', errorMsg);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();

    // Refresh alerts every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, [dashboardService, lifecycleService]);

  const handleAlertClick = (alert: Alert) => {
    console.log('Alert clicked:', alert);
    // Show detail panel, open investigation, etc.
  };

  const handleActionOnAlert = (alertId: string, action: string, description: string) => {
    lifecycleService.logAction(alertId, action, description, 'SOC_Analyst');
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading alerts...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: '#dc2626', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <AlertDashboard
        alerts={alerts}
        alertLifecycleService={lifecycleService}
        onAlertClick={handleAlertClick}
        refreshInterval={1000}
      />

      {/* Quick Action Panel */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
        <div
          style={{
            backgroundColor: '#fff',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            width: '280px',
          }}
        >
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px' }}>Quick Actions</h4>

          <button
            style={{
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
            }}
            onClick={() => {
              const alertId = alerts[0]?.id;
              if (alertId) {
                handleActionOnAlert(alertId, 'acknowledged', 'SOC analyst acknowledged alert');
                lifecycleService.changeStatus(alertId, 'investigating', 'Investigating');
              }
            }}
          >
            Acknowledge Current Alert
          </button>

          <button
            style={{
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
            }}
            onClick={() => {
              const alertId = alerts[0]?.id;
              if (alertId) {
                handleActionOnAlert(alertId, 'resolved', 'Issue resolved and verified');
                lifecycleService.changeStatus(alertId, 'resolved', 'Resolved by SOC');
              }
            }}
          >
            Resolve Current Alert
          </button>

          <button
            style={{
              display: 'block',
              width: '100%',
              padding: '8px 12px',
              backgroundColor: '#666',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            onClick={() => {
              const csv = lifecycleService.exportAsCsv();
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `alert-report-${new Date().toISOString()}.csv`;
              a.click();
            }}
          >
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardWithTracking;
