"use strict";
/**
 * Tenant Monitoring Dashboard Example
 * Demonstrates real-time tenant monitoring UI
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderDashboard = renderDashboard;
const blackpoint_api_service_1 = require("../services/blackpoint-api.service");
const dashboard_service_1 = require("../services/dashboard.service");
const TenantDashboard_1 = __importDefault(require("../components/TenantDashboard"));
const react_1 = __importDefault(require("react"));
const client_1 = __importDefault(require("react-dom/client"));
async function loadDashboardData() {
    const apiClient = (0, blackpoint_api_service_1.createApiClient)();
    const dashboardService = (0, dashboard_service_1.createDashboardService)(apiClient);
    try {
        // Test connection
        const connected = await apiClient.testConnection();
        if (!connected) {
            throw new Error('Failed to connect to Blackpoint API');
        }
        // Fetch dashboard data
        const summary = await dashboardService.getDashboardSummary();
        return summary;
    }
    catch (error) {
        console.error('Error loading dashboard:', error);
        throw error;
    }
}
// React App Component
function App() {
    const [data, setData] = react_1.default.useState(null);
    const [loading, setLoading] = react_1.default.useState(true);
    const [error, setError] = react_1.default.useState(null);
    const loadData = async () => {
        try {
            setLoading(true);
            const summary = await loadDashboardData();
            setData(summary);
            setError(null);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
        finally {
            setLoading(false);
        }
    };
    react_1.default.useEffect(() => {
        loadData();
    }, []);
    if (loading && !data) {
        return (<div style={{
                minHeight: '100vh',
                backgroundColor: '#0f172a',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
            }}>
        Loading Blackpoint Dashboard...
      </div>);
    }
    if (error) {
        return (<div style={{
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
        <button onClick={loadData} style={{
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer'
            }}>
          Retry
        </button>
      </div>);
    }
    return (<TenantDashboard_1.default tenants={data.tenants} notifications={data.notifications} refreshInterval={30000} onRefresh={loadData}/>);
}
// Mount the app
function renderDashboard(containerId = 'root') {
    const container = document.getElementById(containerId);
    if (!container) {
        throw new Error(`Container ${containerId} not found`);
    }
    const root = client_1.default.createRoot(container);
    root.render(<App />);
}
// Auto-render if running in browser
if (typeof window !== 'undefined' && document.getElementById('root')) {
    renderDashboard();
}
//# sourceMappingURL=dashboard-app.js.map