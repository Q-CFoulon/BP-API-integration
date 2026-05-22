// ---------------------------------------------------------------------------
// Unified Command Dashboard — Main View
// ---------------------------------------------------------------------------
// Combines Blackpoint detection metrics and Defender XDR incident status into
// a single SOC overview pane. Acts as the landing page for the unified app.
// ---------------------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import {
  bpAnalyticsCount,
  xdrIncidents,
  unifiedAlerts,
  unifiedCorrelations,
  type IncidentSummary,
  type AlertSnapshot,
  type DetectionCorrelation,
} from '../services/unifiedApi';
import './UnifiedCommandDashboard.css';

interface Props {
  tenantAlias: string;
}

interface BpCounts {
  open: number;
  resolved: number;
}

const UnifiedCommandDashboard: React.FC<Props> = ({ tenantAlias }) => {
  const [bpCounts, setBpCounts] = useState<BpCounts>({ open: 0, resolved: 0 });
  const [incidents, setIncidents] = useState<IncidentSummary[]>([]);
  const [alerts, setAlerts] = useState<AlertSnapshot[]>([]);
  const [correlations, setCorrelations] = useState<DetectionCorrelation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tenantAlias) return;
    setLoading(true);
    setError(null);

    Promise.all([
      bpAnalyticsCount(tenantAlias, 'OPEN'),
      bpAnalyticsCount(tenantAlias, 'RESOLVED'),
      xdrIncidents(tenantAlias, 20),
      unifiedAlerts(tenantAlias, 50),
      unifiedCorrelations(tenantAlias),
    ])
      .then(([openRes, resolvedRes, inc, al, cor]) => {
        setBpCounts({ open: openRes.count, resolved: resolvedRes.count });
        setIncidents(inc);
        setAlerts(al);
        setCorrelations(cor);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [tenantAlias]);

  if (loading) return <div className="ucd-loading">Loading unified dashboard…</div>;
  if (error) return <div className="ucd-error">Error: {error}</div>;

  const activeXdr = incidents.filter((i) => i.status === 'Active' || i.status === 'InProgress');
  const criticalXdr = incidents.filter((i) => i.severity === 'High' || i.severity === 'Critical');

  return (
    <div className="unified-command-dashboard">
      <h2>Unified SOC Command — {tenantAlias}</h2>

      {/* KPI Cards */}
      <div className="ucd-kpi-row">
        <div className="ucd-kpi-card bp-open">
          <span className="ucd-kpi-value">{bpCounts.open}</span>
          <span className="ucd-kpi-label">BP Open Detections</span>
        </div>
        <div className="ucd-kpi-card bp-resolved">
          <span className="ucd-kpi-value">{bpCounts.resolved}</span>
          <span className="ucd-kpi-label">BP Resolved</span>
        </div>
        <div className="ucd-kpi-card xdr-active">
          <span className="ucd-kpi-value">{activeXdr.length}</span>
          <span className="ucd-kpi-label">XDR Active Incidents</span>
        </div>
        <div className="ucd-kpi-card xdr-critical">
          <span className="ucd-kpi-value">{criticalXdr.length}</span>
          <span className="ucd-kpi-label">High/Critical XDR</span>
        </div>
        <div className="ucd-kpi-card correlations">
          <span className="ucd-kpi-value">{correlations.length}</span>
          <span className="ucd-kpi-label">Correlations</span>
        </div>
      </div>

      {/* Recent Unified Alert Timeline */}
      <section className="ucd-section">
        <h3>Recent Alert Timeline (Cross-Source)</h3>
        {alerts.length === 0 ? (
          <p className="ucd-empty">No alert snapshots recorded yet.</p>
        ) : (
          <table className="ucd-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Source</th>
                <th>Title</th>
                <th>Severity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {alerts.slice(0, 20).map((a) => (
                <tr key={a.id}>
                  <td>{new Date(a.createdAt).toLocaleString()}</td>
                  <td className={`ucd-source ucd-source-${a.source}`}>{a.source}</td>
                  <td>{a.title}</td>
                  <td>{a.severity}</td>
                  <td>{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* XDR Incidents Table */}
      <section className="ucd-section">
        <h3>Defender XDR Incidents</h3>
        <table className="ucd-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Assigned</th>
              <th>Alerts</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((inc) => (
              <tr key={inc.id} className={`ucd-sev-${inc.severity.toLowerCase()}`}>
                <td>{inc.id}</td>
                <td>{inc.title}</td>
                <td>{inc.severity}</td>
                <td>{inc.status}</td>
                <td>{inc.assignedTo || '—'}</td>
                <td>{inc.alertsCount}</td>
                <td>{new Date(inc.createdTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default UnifiedCommandDashboard;
