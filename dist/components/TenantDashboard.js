"use strict";
/**
 * Blackpoint Tenant Monitoring Dashboard
 * Professional SOC Operations dashboard for tenant oversight
 *
 * Inspired by Quisitive Spyglass MDR design
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
exports.TenantDashboard = void 0;
const react_1 = __importStar(require("react"));
const TenantDashboard = ({ tenants, notifications, refreshInterval = 30000, onRefresh, }) => {
    const [lastUpdated, setLastUpdated] = (0, react_1.useState)(new Date());
    const [isRefreshing, setIsRefreshing] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const interval = setInterval(() => {
            setLastUpdated(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    (0, react_1.useEffect)(() => {
        if (!onRefresh)
            return;
        const interval = setInterval(async () => {
            setIsRefreshing(true);
            await onRefresh();
            setIsRefreshing(false);
            setLastUpdated(new Date());
        }, refreshInterval);
        return () => clearInterval(interval);
    }, [refreshInterval, onRefresh]);
    const handleManualRefresh = async () => {
        if (!onRefresh || isRefreshing)
            return;
        setIsRefreshing(true);
        await onRefresh();
        setIsRefreshing(false);
        setLastUpdated(new Date());
    };
    return (<div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroLogo}>
            <div style={styles.logoIcon}>🛡️</div>
            <div>
              <h1 style={styles.heroTitle}>Blackpoint Cyber Monitoring</h1>
              <p style={styles.heroSubtitle}>SOC Operations Dashboard</p>
            </div>
          </div>
          <div style={styles.heroStats}>
            <div style={styles.stat}>
              <div style={styles.statNumber}>{tenants.length}</div>
              <div style={styles.statLabel}>Protected Clients</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statNumber}>{notifications.length}</div>
              <div style={styles.statLabel}>Active Notifications</div>
            </div>
            <div style={styles.stat}>
              <div style={{ ...styles.statNumber, color: '#22c55e' }}>●</div>
              <div style={styles.statLabel}>System Status</div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div style={styles.controlBar}>
        <div style={styles.lastUpdated}>
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
        <button style={{
            ...styles.refreshButton,
            opacity: isRefreshing ? 0.6 : 1,
            cursor: isRefreshing ? 'not-allowed' : 'pointer',
        }} onClick={handleManualRefresh} disabled={isRefreshing}>
          {isRefreshing ? '⟳ Refreshing...' : '↻ Refresh Now'}
        </button>
      </div>

      {/* Notifications Banner */}
      {notifications.length > 0 && (<div style={styles.notificationsBanner}>
          <h3 style={styles.notificationsTitle}>
            📢 Active Notifications ({notifications.length})
          </h3>
          <div style={styles.notificationsList}>
            {notifications.map((notification, idx) => (<div key={notification.id || idx} style={styles.notificationItem}>
                <span style={styles.notificationTime}>
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
                <span style={styles.notificationMessage}>{notification.message}</span>
              </div>))}
          </div>
        </div>)}

      {/* Tenants Grid */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Client Monitoring Overview</h2>
        <div style={styles.tenantsGrid}>
          {tenants.map((tenant) => (<TenantCard key={tenant.id} tenant={tenant}/>))}
        </div>
      </div>
    </div>);
};
exports.TenantDashboard = TenantDashboard;
const TenantCard = ({ tenant }) => {
    const [expanded, setExpanded] = (0, react_1.useState)(false);
    const createdDate = new Date(tenant.created);
    const daysSinceCreated = Math.floor((new Date().getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    return (<div style={styles.tenantCard} onClick={() => setExpanded(!expanded)}>
      {/* Card Header */}
      <div style={styles.cardHeader}>
        <div style={styles.tenantLogo}>
          {tenant.name.substring(0, 2).toUpperCase()}
        </div>
        <div style={styles.cardHeaderInfo}>
          <h3 style={styles.tenantName}>{tenant.name}</h3>
          <p style={styles.tenantDomain}>{tenant.domain}</p>
        </div>
        <div style={styles.statusIndicator}>
          <span style={{ ...styles.statusDot, backgroundColor: '#22c55e' }} title="Active">●</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={styles.quickStats}>
        <div style={styles.quickStat}>
          <span style={styles.quickStatValue}>{daysSinceCreated}</span>
          <span style={styles.quickStatLabel}>Days Protected</span>
        </div>
        <div style={styles.quickStat}>
          <span style={{ ...styles.quickStatValue, color: tenant.enableDeliveryEmail ? '#22c55e' : '#9ca3af' }}>
            {tenant.enableDeliveryEmail ? '✓' : '✗'}
          </span>
          <span style={styles.quickStatLabel}>Email Delivery</span>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (<div style={styles.expandedSection}>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Tenant ID:</span>
            <span style={styles.detailValue}>{tenant.id}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Account ID:</span>
            <span style={styles.detailValue}>{tenant.accountId}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Created:</span>
            <span style={styles.detailValue}>{createdDate.toLocaleDateString()}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Contact Group:</span>
            <span style={styles.detailValue}>{tenant.contactGroupId.substring(0, 20)}...</span>
          </div>
          {tenant.description && (<div style={styles.detailRow}>
              <span style={styles.detailLabel}>Description:</span>
              <span style={styles.detailValue}>{tenant.description}</span>
            </div>)}
          {tenant.industryType && (<div style={styles.detailRow}>
              <span style={styles.detailLabel}>Industry:</span>
              <span style={styles.detailValue}>{tenant.industryType}</span>
            </div>)}
          <div style={styles.agentSection}>
            <span style={styles.detailLabel}>SNAP Agent:</span>
            <a href={tenant.snapAgentUrl} target="_blank" rel="noopener noreferrer" style={styles.agentLink} onClick={(e) => e.stopPropagation()}>
              Download Installer →
            </a>
          </div>
        </div>)}

      {/* Card Footer */}
      <div style={styles.cardFooter}>
        <button style={styles.expandToggle} onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
        }}>
          {expanded ? '↑ Show Less' : '↓ Show More'}
        </button>
      </div>
    </div>);
};
// Styles inspired by Quisitive Spyglass MDR design
const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        color: '#fff',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    hero: {
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: '60px 40px',
        borderBottom: '1px solid #334155',
    },
    heroContent: {
        maxWidth: '1400px',
        margin: '0 auto',
    },
    heroLogo: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '40px',
    },
    logoIcon: {
        fontSize: '48px',
    },
    heroTitle: {
        margin: 0,
        fontSize: '36px',
        fontWeight: '700',
        color: '#f8fafc',
    },
    heroSubtitle: {
        margin: '8px 0 0 0',
        fontSize: '18px',
        color: '#cbd5e1',
        fontWeight: '400',
    },
    heroStats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
    },
    stat: {
        backgroundColor: '#1e293b',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid #334155',
        textAlign: 'center',
    },
    statNumber: {
        fontSize: '42px',
        fontWeight: '700',
        color: '#3b82f6',
        marginBottom: '8px',
    },
    statLabel: {
        fontSize: '14px',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        fontWeight: '500',
    },
    controlBar: {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lastUpdated: {
        fontSize: '14px',
        color: '#94a3b8',
    },
    refreshButton: {
        padding: '10px 20px',
        backgroundColor: '#3b82f6',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    notificationsBanner: {
        maxWidth: '1400px',
        margin: '0 auto 32px',
        padding: '0 40px',
    },
    notificationsTitle: {
        margin: '0 0 16px 0',
        fontSize: '20px',
        fontWeight: '600',
        color: '#fbbf24',
    },
    notificationsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    notificationItem: {
        backgroundColor: '#1e293b',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #fbbf24',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
    },
    notificationTime: {
        fontSize: '12px',
        color: '#94a3b8',
        minWidth: '150px',
    },
    notificationMessage: {
        fontSize: '14px',
        color: '#f8fafc',
    },
    section: {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px',
    },
    sectionTitle: {
        margin: '0 0 32px 0',
        fontSize: '28px',
        fontWeight: '700',
        color: '#f8fafc',
    },
    tenantsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: '24px',
    },
    tenantCard: {
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '24px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        ':hover': {
            borderColor: '#3b82f6',
            transform: 'translateY(-2px)',
        },
    },
    cardHeader: {
        display: 'flex',
        gap: '16px',
        marginBottom: '20px',
        alignItems: 'flex-start',
    },
    tenantLogo: {
        width: '48px',
        height: '48px',
        borderRadius: '10px',
        backgroundColor: '#3b82f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        fontWeight: '700',
        color: '#fff',
        flexShrink: 0,
    },
    cardHeaderInfo: {
        flex: 1,
    },
    tenantName: {
        margin: '0 0 4px 0',
        fontSize: '18px',
        fontWeight: '600',
        color: '#f8fafc',
    },
    tenantDomain: {
        margin: 0,
        fontSize: '13px',
        color: '#94a3b8',
    },
    statusIndicator: {
        display: 'flex',
        alignItems: 'center',
    },
    statusDot: {
        fontSize: '20px',
        lineHeight: 1,
    },
    quickStats: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '16px',
        paddingBottom: '16px',
        borderBottom: '1px solid #334155',
    },
    quickStat: {
        textAlign: 'center',
    },
    quickStatValue: {
        display: 'block',
        fontSize: '24px',
        fontWeight: '700',
        color: '#3b82f6',
        marginBottom: '4px',
    },
    quickStatLabel: {
        display: 'block',
        fontSize: '12px',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    expandedSection: {
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid #334155',
    },
    detailRow: {
        display: 'flex',
        gap: '12px',
        marginBottom: '12px',
        fontSize: '13px',
    },
    detailLabel: {
        color: '#94a3b8',
        fontWeight: '500',
        minWidth: '120px',
    },
    detailValue: {
        color: '#cbd5e1',
        wordBreak: 'break-all',
    },
    agentSection: {
        display: 'flex',
        gap: '12px',
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid #334155',
        alignItems: 'center',
    },
    agentLink: {
        color: '#3b82f6',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: '600',
        transition: 'color 0.2s',
    },
    cardFooter: {
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid #334155',
        display: 'flex',
        justifyContent: 'center',
    },
    expandToggle: {
        padding: '8px 16px',
        backgroundColor: 'transparent',
        color: '#3b82f6',
        border: '1px solid #334155',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
};
exports.default = exports.TenantDashboard;
//# sourceMappingURL=TenantDashboard.js.map