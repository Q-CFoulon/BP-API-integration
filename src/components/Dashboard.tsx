import React, { useState, useEffect, useCallback } from 'react';
import './Dashboard.css';

// ---------------------------------------------------------------------------
// Types — matching CompassOne API v1.4.0 spec
// ---------------------------------------------------------------------------

interface Tenant {
  id: string;
  name: string;
  domain: string | null;
  created: string;
  status: string;
  enableDeliveryEmail: boolean;
  description: string | null;
  accountId: string | null;
  industryType: string;
  informationalAlertsEmails: string[];
  mdrReportsEmails: string[];
  darkWebAlertsEmails: string[];
}

interface AlertGroup {
  id: string;
  customerId: string;
  groupKey: string;
  riskScore: number;
  alertCount: number;
  alertTypes: string[];
  status: 'OPEN' | 'RESOLVED';
  ticketId: string;
  created: string;
  updated?: string | null;
  ticket?: Record<string, unknown> | null;
  alert?: Record<string, unknown> | null;
}

interface AlertGroupsResponse {
  items: AlertGroup[];
  total: number;
  start: number;
  end: number;
}

// ---------------------------------------------------------------------------
// API helpers  (proxy in src/setupProxy.js routes /v1/* → blackpointcyber.com)
// ---------------------------------------------------------------------------

const API_KEY = process.env.REACT_APP_BLACKPOINT_API_KEY || '';

function apiHeaders(tenantId?: string): HeadersInit {
  const h: Record<string, string> = { Authorization: `Bearer ${API_KEY}` };
  if (tenantId) h['x-tenant-id'] = tenantId;
  return h;
}

async function apiFetch<T>(path: string, tenantId?: string): Promise<T> {
  const res = await fetch(path, { headers: apiHeaders(tenantId) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${path}`);
  return res.json() as Promise<T>;
}

async function loadTenants(): Promise<Tenant[]> {
  const data = await apiFetch<{ data: Tenant[]; meta: unknown }>('/v1/tenants?pageSize=50');
  return data.data;
}

async function loadAlertGroupPreview(tenantId: string): Promise<AlertGroupsResponse> {
  const qs = new URLSearchParams({
    take: '10',
    sortByColumn: 'created',
    sortDirection: 'DESC',
  });
  // Send OPEN status twice — repeated query param for array
  return apiFetch<AlertGroupsResponse>(`/v1/alert-groups?${qs}&status=OPEN`, tenantId);
}

async function loadAllAlertGroups(tenantId: string): Promise<AlertGroup[]> {
  const all: AlertGroup[] = [];
  let skip = 0;
  const take = 100;
  while (true) {
    const qs = new URLSearchParams({ take: String(take), skip: String(skip), sortByColumn: 'created', sortDirection: 'DESC' });
    const data = await apiFetch<AlertGroupsResponse>(`/v1/alert-groups?${qs}`, tenantId);
    all.push(...data.items);
    if (all.length >= data.total || data.items.length < take) break;
    skip += take;
  }
  return all;
}

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

function riskToSeverity(score: number): 'critical' | 'high' | 'medium' | 'low' {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

function getAlertAge(iso: string): { hours: number; text: string; ageCategory: string } {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const text = days > 0 ? `${days}d ${hours % 24}h` : hours > 0 ? `${hours}h` : `${mins}m`;
  const ageCategory = hours >= 72 ? 'overdue' : hours >= 24 ? 'delayed' : hours >= 4 ? 'warning' : 'good';
  return { hours, text, ageCategory };
}

function priorityScore(openGroups: AlertGroup[]): number {
  return openGroups.reduce((sum, ag) => {
    const { hours } = getAlertAge(ag.created);
    const sev = riskToSeverity(ag.riskScore);
    const m = sev === 'critical' ? 4 : sev === 'high' ? 3 : sev === 'medium' ? 2 : 1;
    return sum + (hours + 1) * m;
  }, 0);
}

function fmt(iso?: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString();
}

function fmtDate(iso?: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString();
}

// ---------------------------------------------------------------------------
// Tenant Detail Page
// ---------------------------------------------------------------------------

interface TenantDetailProps {
  tenant: Tenant;
  onBack: () => void;
}

const TenantDetailPage: React.FC<TenantDetailProps> = ({ tenant, onBack }) => {
  const [groups, setGroups] = useState<AlertGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    loadAllAlertGroups(tenant.id)
      .then(setGroups)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [tenant.id]);

  const openGroups = groups.filter(g => g.status === 'OPEN');
  const resolvedGroups = groups.filter(g => g.status === 'RESOLVED');
  const criticalGroups = groups.filter(g => riskToSeverity(g.riskScore) === 'critical');

  return (
    <div className="detail-container">
      <div className="detail-content">
        <button onClick={onBack} className="btn-primary btn-back">
          ← Back to Dashboard
        </button>

        {/* Tenant Header */}
        <div className="detail-header-card">
          <div className="card-header">
            <div className="tenant-avatar large">{tenant.name.substring(0, 2)}</div>
            <div>
              <h1 className="detail-title">{tenant.name}</h1>
              {tenant.domain && <p className="detail-subtitle">{tenant.domain}</p>}
              <div className="meta-grid">
                <div className="meta-item">
                  <span className="meta-label">Tenant ID</span>
                  <div className="meta-value mono">{tenant.id}</div>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Status</span>
                  <div className="meta-value green">{tenant.status}</div>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Created</span>
                  <div className="meta-value">{fmtDate(tenant.created)}</div>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Email Delivery</span>
                  <div className={`meta-value ${tenant.enableDeliveryEmail ? 'green' : 'red'}`}>
                    {tenant.enableDeliveryEmail ? '✓ Enabled' : '✗ Disabled'}
                  </div>
                </div>
                {tenant.industryType && (
                  <div className="meta-item">
                    <span className="meta-label">Industry</span>
                    <div className="meta-value">{tenant.industryType}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="metrics-grid">
            <div className="metric-item">
              <div className="metric-value blue">{groups.length}</div>
              <div className="metric-label">Total Groups</div>
            </div>
            <div className="metric-item">
              <div className="metric-value red">{openGroups.length}</div>
              <div className="metric-label">Open</div>
            </div>
            <div className="metric-item">
              <div className="metric-value critical">{criticalGroups.length}</div>
              <div className="metric-label">Critical Risk</div>
            </div>
            <div className="metric-item">
              <div className="metric-value green">{resolvedGroups.length}</div>
              <div className="metric-label">Resolved</div>
            </div>
          </div>
        </div>

        {/* Alert Groups */}
        {loading && <div className="loading-state">Loading alert groups…</div>}
        {error && <div className="error-message">⚠ {error}</div>}

        {!loading && !error && (
          <div>
            <h2 className="section-title large">Detection Groups ({groups.length})</h2>
            {groups.length === 0 ? (
              <div className="empty-state">No detection groups for this tenant</div>
            ) : (
              <div className="alerts-list">
                {groups.map(group => {
                  const severity = riskToSeverity(group.riskScore);
                  const age = getAlertAge(group.created);
                  const isOpen = group.status === 'OPEN';

                  return (
                    <div
                      key={group.id}
                      onClick={() => setExpanded(expanded === group.id ? null : group.id)}
                      className="alert-card"
                      data-severity={severity}
                    >
                      <div className="alert-card-header">
                        <div className="alert-card-content">
                          <div
                            className="alert-title-row"
                            data-severity={severity}
                            data-status={isOpen ? 'open' : 'resolved'}
                          >
                            <div className="severity-dot"></div>
                            <span className="alert-title">
                              {group.alertTypes.length > 0
                                ? group.alertTypes.join(', ')
                                : group.groupKey}
                            </span>
                            <span className="status-badge">{group.status}</span>
                            <span className="risk-badge">Risk: {group.riskScore}/100</span>
                          </div>
                          <div className="alert-meta">
                            {fmt(group.created)} &bull; {group.alertCount} alert
                            {group.alertCount !== 1 ? 's' : ''} &bull; Age:{' '}
                            {age.text}
                          </div>

                          {expanded === group.id && (
                            <div className="alert-expanded" onClick={e => e.stopPropagation()}>

                              {/* Overview */}
                              <div className="alert-section">
                                <div className="alert-section-title">DETECTION DETAILS</div>
                                <div className="detail-list">
                                  <div><span className="label">Group ID:</span> <span className="value-mono blue">{group.id}</span></div>
                                  <div><span className="label">Group Key:</span> <span className="value-mono">{group.groupKey}</span></div>
                                  <div><span className="label">Ticket ID:</span> <span className="value-mono orange">{group.ticketId || '—'}</span></div>
                                  <div><span className="label">Alert Count:</span> {group.alertCount}</div>
                                  <div><span className="label">Risk Score:</span>
                                    <span style={{ marginLeft: 8 }}>
                                      <span className={`severity-badge ${severity}`}>{severity.toUpperCase()} ({group.riskScore})</span>
                                    </span>
                                  </div>
                                  <div><span className="label">Created:</span> {fmt(group.created)}</div>
                                  {group.updated && <div><span className="label">Updated:</span> {fmt(group.updated)}</div>}
                                </div>

                                {/* Risk progress bar */}
                                <div style={{ marginTop: 12 }}>
                                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>RISK SCORE</div>
                                  <div className="score-bar" style={{ height: 10 }}>
                                    <div
                                      className={`score-fill ${severity}`}
                                      style={{ width: `${group.riskScore}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>

                              {/* Alert Types */}
                              {group.alertTypes.length > 0 && (
                                <div className="alert-section">
                                  <div className="alert-section-title">
                                    <span className="section-icon">🎯</span> ALERT TYPES
                                  </div>
                                  <div className="ioc-tags">
                                    {group.alertTypes.map((t, i) => (
                                      <span key={i} className="ioc-tag">{t}</span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Detection alert object (hostname, username, etc.) */}
                              {group.alert && Object.keys(group.alert).length > 0 && (
                                <div className="alert-section">
                                  <div className="alert-section-title">
                                    <span className="section-icon">🖥️</span> DETECTION DATA
                                  </div>
                                  <div className="detail-list">
                                    {Object.entries(group.alert)
                                      .filter(([, v]) => v !== null && v !== undefined && v !== '')
                                      .map(([k, v]) => (
                                        <div key={k}>
                                          <span className="label">{k}:</span>{' '}
                                          <span className="value-mono">
                                            {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                                          </span>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}

                              {/* Ticket info */}
                              {group.ticket && Object.keys(group.ticket).length > 0 && (
                                <div className="alert-section">
                                  <div className="alert-section-title">
                                    <span className="section-icon">🎫</span> TICKET
                                  </div>
                                  <div className="detail-list">
                                    {Object.entries(group.ticket)
                                      .filter(([, v]) => v !== null && v !== undefined && v !== '')
                                      .map(([k, v]) => (
                                        <div key={k}>
                                          <span className="label">{k}:</span>{' '}
                                          <span className="value-mono">
                                            {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                                          </span>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <span className="alert-expand-icon">
                          {expanded === group.id ? '▼' : '▶'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Tenant card data (main view)
// ---------------------------------------------------------------------------

interface TenantCardData {
  tenant: Tenant;
  openGroups: AlertGroup[];
  totalOpen: number;
  loading: boolean;
  error: string | null;
}

// ---------------------------------------------------------------------------
// Main Dashboard
// ---------------------------------------------------------------------------

const Dashboard: React.FC = () => {
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tenantData, setTenantData] = useState<Map<string, TenantCardData>>(new Map());
  const [tenantsLoading, setTenantsLoading] = useState(true);
  const [tenantsError, setTenantsError] = useState<string | null>(null);

  const noApiKey = !API_KEY;

  // Load tenants on mount
  useEffect(() => {
    if (noApiKey) return;
    loadTenants()
      .then(list => {
        setTenants(list);
        // Kick off alert group previews for each tenant
        list.forEach(t => {
          setTenantData(prev => {
            const next = new Map(prev);
            next.set(t.id, { tenant: t, openGroups: [], totalOpen: 0, loading: true, error: null });
            return next;
          });
          loadAlertGroupPreview(t.id)
            .then(resp => {
              setTenantData(prev => {
                const next = new Map(prev);
                next.set(t.id, {
                  tenant: t,
                  openGroups: resp.items,
                  totalOpen: resp.total,
                  loading: false,
                  error: null,
                });
                return next;
              });
            })
            .catch((e: Error) => {
              setTenantData(prev => {
                const next = new Map(prev);
                next.set(t.id, { tenant: t, openGroups: [], totalOpen: 0, loading: false, error: e.message });
                return next;
              });
            });
        });
      })
      .catch((e: Error) => setTenantsError(e.message))
      .finally(() => setTenantsLoading(false));
  }, [noApiKey]);

  if (selectedTenant) {
    return (
      <TenantDetailPage
        tenant={selectedTenant}
        onBack={() => setSelectedTenant(null)}
      />
    );
  }

  // --- KPI calculations ---
  const totalTenants = tenants.length;
  const allTenantData = Array.from(tenantData.values());
  const totalOpen = allTenantData.reduce((s, d) => s + d.totalOpen, 0);
  const criticalCount = allTenantData.reduce(
    (s, d) => s + d.openGroups.filter(g => riskToSeverity(g.riskScore) === 'critical').length,
    0
  );

  // Oldest open alert across all tenants
  const allOpenGroups = allTenantData.flatMap(d => d.openGroups);
  const oldestGroup = allOpenGroups.length
    ? allOpenGroups.reduce((oldest, g) =>
        new Date(g.created) < new Date(oldest.created) ? g : oldest
      )
    : null;
  const oldestAge = oldestGroup ? getAlertAge(oldestGroup.created) : null;
  const oldestTenant = oldestGroup
    ? tenants.find(t => t.id === oldestGroup.customerId)
    : null;

  // Sort tenants by priority score (highest first)
  const sortedTenants = [...tenants].sort((a, b) => {
    const aData = tenantData.get(a.id);
    const bData = tenantData.get(b.id);
    return priorityScore(bData?.openGroups ?? []) - priorityScore(aData?.openGroups ?? []);
  });

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">🛡️ Blackpoint Tenant Monitor</h1>

          {noApiKey && (
            <div className="error-message" style={{ marginTop: 12 }}>
              ⚠ No API key found. Add <code>REACT_APP_BLACKPOINT_API_KEY</code> to a{' '}
              <code>.env</code> file and restart the dev server.
            </div>
          )}

          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-label">Monitored Tenants</div>
              <div className="kpi-value green">
                {tenantsLoading ? '…' : totalTenants}
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Open Detections</div>
              <div className="kpi-value orange">{totalOpen}</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Critical Risk</div>
              <div className="kpi-value red">{criticalCount}</div>
            </div>
            <div className={`kpi-card ${oldestAge && oldestAge.hours >= 24 ? 'highlight' : ''}`}>
              <div className="kpi-label">Oldest Open (preview)</div>
              <div className="kpi-value" data-age={oldestAge?.ageCategory || 'good'}>
                {oldestAge ? oldestAge.text : '—'}
              </div>
              {oldestTenant && (
                <div className="kpi-subtitle">{oldestTenant.name}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {tenantsLoading && <div className="loading-state">Loading tenants…</div>}
        {tenantsError && <div className="error-message">⚠ {tenantsError}</div>}

        {/* Priority Queue */}
        {sortedTenants.some(t => (tenantData.get(t.id)?.totalOpen ?? 0) > 0) && (
          <div className="priority-section">
            <h2 className="section-title">
              🚨 Remediation Priority Queue
              <span className="section-subtitle">(sorted by urgency)</span>
            </h2>
            <div className="table-container">
              <table className="priority-table">
                <thead>
                  <tr className="table-header-row">
                    <th className="table-header">PRIORITY</th>
                    <th className="table-header">CLIENT</th>
                    <th className="table-header">OLDEST (PREVIEW)</th>
                    <th className="table-header">SEVERITY</th>
                    <th className="table-header">OPEN DETECTIONS</th>
                    <th className="table-header">PRIORITY SCORE</th>
                    <th className="table-header text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTenants.map((tenant, index) => {
                    const data = tenantData.get(tenant.id);
                    const open = data?.totalOpen ?? 0;
                    if (open === 0) return null;

                    const openGroups = data?.openGroups ?? [];
                    const oldest = openGroups.length
                      ? openGroups.reduce((o, g) =>
                          new Date(g.created) < new Date(o.created) ? g : o
                        )
                      : null;
                    const age = oldest ? getAlertAge(oldest.created) : null;
                    const topSeverity = oldest ? riskToSeverity(oldest.riskScore) : 'low';
                    const score = priorityScore(openGroups);
                    const criticalCnt = openGroups.filter(g => riskToSeverity(g.riskScore) === 'critical').length;

                    return (
                      <tr
                        key={tenant.id}
                        className={`table-row ${index === 0 ? 'top-priority' : ''}`}
                        onClick={() => setSelectedTenant(tenant)}
                      >
                        <td className="table-cell">
                          <div className={`priority-badge ${index === 0 ? 'first' : index === 1 ? 'second' : 'default'}`}>
                            {index + 1}
                          </div>
                        </td>
                        <td className="table-cell">
                          <div className="client-name">{tenant.name}</div>
                          {tenant.domain && <div className="client-domain">{tenant.domain}</div>}
                        </td>
                        <td className="table-cell" data-age={age?.ageCategory}>
                          {age ? (
                            <div className="age-display">
                              <span className="age-value">{age.text}</span>
                              {age.hours >= 24 && <span className="overdue-badge">OVERDUE</span>}
                            </div>
                          ) : data?.loading ? '…' : '—'}
                        </td>
                        <td className="table-cell">
                          {oldest && (
                            <span className={`severity-badge ${topSeverity}`}>{topSeverity}</span>
                          )}
                        </td>
                        <td className="table-cell">
                          <div className="alerts-count">
                            <span className="count-value">{open}</span>
                            {criticalCnt > 0 && (
                              <span className="critical-note">({criticalCnt} critical)</span>
                            )}
                          </div>
                        </td>
                        <td className="table-cell">
                          <div className="score-display">
                            <div className="score-bar">
                              <div
                                className={`score-fill ${score > 300 ? 'critical' : score > 150 ? 'high' : 'medium'}`}
                                style={{ width: `${Math.min(100, score / 5)}%` }}
                              ></div>
                            </div>
                            <span className="score-value">{score}</span>
                          </div>
                        </td>
                        <td className="table-cell text-right">
                          <button
                            onClick={e => { e.stopPropagation(); setSelectedTenant(tenant); }}
                            className="btn-primary"
                          >
                            Investigate →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tenant Grid */}
        {!tenantsLoading && tenants.length > 0 && (
          <>
            <h2 className="section-title large">Monitored Tenants</h2>
            <div className="tenant-grid">
              {tenants.map(tenant => {
                const data = tenantData.get(tenant.id);
                const openGroups = data?.openGroups ?? [];
                const totalOpen = data?.totalOpen ?? 0;
                const criticalGroups = openGroups.filter(g => riskToSeverity(g.riskScore) === 'critical');
                const oldest = openGroups.length
                  ? openGroups.reduce((o, g) =>
                      new Date(g.created) < new Date(o.created) ? g : o
                    )
                  : null;
                const oldestAge = oldest ? getAlertAge(oldest.created) : null;

                return (
                  <div
                    key={tenant.id}
                    onClick={() => setSelectedTenant(tenant)}
                    className={`tenant-card ${criticalGroups.length > 0 ? 'critical' : totalOpen > 0 ? 'warning' : ''}`}
                  >
                    {!data?.loading && totalOpen > 0 && (
                      <div className={`card-alert-badge ${criticalGroups.length > 0 ? 'critical' : 'warning'}`}>
                        {totalOpen}
                      </div>
                    )}

                    <div className="card-header">
                      <div className="tenant-avatar">{tenant.name.substring(0, 2)}</div>
                      <div className="tenant-info">
                        <h3 className="tenant-name">{tenant.name}</h3>
                        {tenant.domain && <p className="tenant-domain">{tenant.domain}</p>}
                      </div>
                    </div>

                    <div className="card-stats-grid">
                      <div className="stat-item">
                        <div className="stat-label">Status</div>
                        <div className="stat-value green">● {tenant.status}</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-label">Open</div>
                        <div className={`stat-value bold ${totalOpen > 0 ? 'orange' : 'green'}`}>
                          {data?.loading ? '…' : totalOpen}
                        </div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-label">Critical</div>
                        <div className={`stat-value bold ${criticalGroups.length > 0 ? 'red' : 'green'}`}>
                          {data?.loading ? '…' : criticalGroups.length}
                        </div>
                      </div>
                    </div>

                    {!data?.loading && oldestAge && oldest && (
                      <div
                        className={`oldest-ticket-box ${oldestAge.hours >= 24 ? 'overdue' : ''}`}
                        data-age={oldestAge.ageCategory}
                      >
                        <div className="oldest-ticket-label">OLDEST OPEN DETECTION</div>
                        <div className="oldest-ticket-content">
                          <div>
                            <span className="oldest-ticket-age">{oldestAge.text}</span>
                            {oldestAge.hours >= 24 && (
                              <span className="overdue-badge small">OVERDUE</span>
                            )}
                          </div>
                          <span className={`severity-badge-small ${riskToSeverity(oldest.riskScore)}`}>
                            {riskToSeverity(oldest.riskScore)}
                          </span>
                        </div>
                        <div className="oldest-ticket-title">
                          {oldest.alertTypes.length > 0 ? oldest.alertTypes.join(', ') : oldest.groupKey}
                        </div>
                      </div>
                    )}

                    {!data?.loading && !oldest && (
                      <div className="oldest-ticket-box clear">
                        <span className="clear-text">✓ No open detections</span>
                      </div>
                    )}

                    {data?.loading && (
                      <div className="oldest-ticket-box clear">
                        <span className="clear-text">Loading…</span>
                      </div>
                    )}

                    {data?.error && (
                      <div className="oldest-ticket-box" style={{ borderColor: '#f97316' }}>
                        <span style={{ color: '#f97316', fontSize: 12 }}>⚠ {data.error}</span>
                      </div>
                    )}

                    <div className="card-footer">
                      Created: {fmtDate(tenant.created)}
                    </div>

                    <button
                      onClick={e => { e.stopPropagation(); setSelectedTenant(tenant); }}
                      className="btn-primary full-width"
                    >
                      View Details →
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

