/**
 * Tenant Monitoring Dashboard Example
 * Demonstrates real-time tenant monitoring UI
 */

import { createApiClient } from '../services/blackpoint-api.service';
import { createDashboardService } from '../services/dashboard.service';
import TenantDashboard from '../components/TenantDashboard';
import React from 'react';
import ReactDOM from 'react-dom/client';

async function loadDashboardData() {
  const apiClient = createApiClient();
  const dashboardService = createDashboardService(apiClient);

  try {
    // Test connection
    const connected = await apiClient.testConnection();
    if (!connected) {
      throw new Error('Failed to connect to Blackpoint API');
    }

    // Fetch dashboard data
    const summary = await dashboardService.getDashboardSummary();
    return summary;
  } catch (error) {
    console.error('Error loading dashboard:', error);
    throw error;
  }
}

// React App Component
function App() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const summary = await loadDashboardData();
      setData(summary);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  if (loading && !data) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px'
      }}>
        Loading Blackpoint Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        color: '#ef4444',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
        padding: '40px'
      }}>
        <h1>⚠️ Error Loading Dashboard</h1>
        <p>{error}</p>
        <button 
          onClick={loadData}
          style={{
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <TenantDashboard
      tenants={data.tenants}
      notifications={data.notifications}
      refreshInterval={30000}
      onRefresh={loadData}
    />
  );
}

// Mount the app
export function renderDashboard(containerId: string = 'root') {
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Container ${containerId} not found`);
  }

  const root = ReactDOM.createRoot(container);
  root.render(<App />);
}

// Auto-render if running in browser
if (typeof window !== 'undefined' && document.getElementById('root')) {
  renderDashboard();
}
