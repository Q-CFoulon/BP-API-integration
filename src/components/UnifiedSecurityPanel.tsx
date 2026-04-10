import React, { useEffect, useMemo, useState } from 'react';
import './UnifiedSecurityPanel.css';

import { fetchAllO365Alerts } from '../services/office365Connectors.service';
import { fetchSentinelFeed } from '../services/sentinel.service';
import { fetchDefenderMcpFeed, type DeviceHealthSummary, type ResponseRecommendation } from '../services/defenderMcp.service';
import {
  upsertAlerts,
  getAlerts,
  correlateAlerts,
  getTenantSummary,
  type UnifiedAlert,
  type AlertSource,
} from '../services/tenantAlertStore.service';
import { runTriageEngine, type TriageEngineResult, type TriageItem } from '../services/triageEngine.service';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface UnifiedSecurityPanelProps {
  tenantId: string;
  tenantName: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmt(iso: string): string {
  return new Date(iso).toLocaleString();
}

const SOURCE_LABELS: Record<AlertSource, string> = {
  'blackpoint': 'Blackpoint',
  'defender-xdr': 'Defender XDR',
  'sentinel': 'Sentinel',
  'o365-email': 'Email',
  'o365-identity': 'Identity',
  'o365-cloudapp': 'Cloud App',
  'o365-endpoint': 'Endpoint',
  'defender-mcp': 'Defender MCP'
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const UnifiedSecurityPanel: React.FC<UnifiedSecurityPanelProps> = ({
  tenantId,
  tenantName
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [triageResult, setTriageResult] = useState<TriageEngineResult | null>(null);
  const [deviceHealth, setDeviceHealth] = useState<DeviceHealthSummary[]>([]);
  const [mcpRecs, setMcpRecs] = useState<ResponseRecommendation[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showPlaybooks, setShowPlaybooks] = useState(false);
  const [showDevices, setShowDevices] = useState(false);

  // ---- Load all feeds in parallel, push into tenant store, then triage ----
  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    (async () => {
      try {
        const [o365, sentinel, defenderMcp] = await Promise.all([
          fetchAllO365Alerts(tenantId),
          fetchSentinelFeed(tenantId),
          fetchDefenderMcpFeed(tenantId)
        ]);

        if (!active) return;

        // Push all into tenant-segregated store
        upsertAlerts(tenantId, o365.all);
        upsertAlerts(tenantId, sentinel.alerts);
        upsertAlerts(tenantId, defenderMcp.alerts);

        // Run cross-source correlation
        correlateAlerts(tenantId);

        // Get full alert set and run triage engine
        const allAlerts = getAlerts(tenantId);
        const result = runTriageEngine(allAlerts, defenderMcp.recommendations);

        if (!active) return;

        setTriageResult(result);
        setDeviceHealth(defenderMcp.deviceHealth);
        setMcpRecs(defenderMcp.recommendations);
        setLastRefreshed(new Date().toISOString());
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => { active = false; };
  }, [tenantId, tenantName]);

  // ---- Toggle item expansion ----
  function toggleItem(id: string) {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // ---- Tenant summary from store ----
  const summary = useMemo(() => getTenantSummary(tenantId), [tenantId, triageResult]);

  // ---- Render ----

  if (loading) return <div className="usf-loading">Loading unified security feeds…</div>;
  if (error) return <div className="usf-error">Error: {error}</div>;
  if (!triageResult) return <div className="usf-empty">No security data available.</div>;

  const { queue, automationRecommendations, playbooks, summary: triageSummary } = triageResult;

  return (
    <div className="unified-security-panel">
      {/* Header */}
      <div className="usf-header">
        <div>
          <h2>Unified Security Feed</h2>
          <p>
            Aggregated alerts from O365, Sentinel, and Defender MCP — prioritised
            by the triage engine with automation recommendations and playbooks.
          </p>
        </div>
        <div className="usf-source-pills">
          {Object.entries(summary.bySource).map(([src, count]) => (
            <span key={src} className="usf-source-pill active">
              {SOURCE_LABELS[src as AlertSource] ?? src}: {count}
            </span>
          ))}
        </div>
      </div>

      {/* KPI strip */}
      <div className="usf-kpi-strip">
        <div className="usf-kpi">
          <div className="usf-kpi-value red">{triageSummary.p1Count}</div>
          <div className="usf-kpi-label">P1 Critical</div>
        </div>
        <div className="usf-kpi">
          <div className="usf-kpi-value orange">{triageSummary.p2Count}</div>
          <div className="usf-kpi-label">P2 High</div>
        </div>
        <div className="usf-kpi">
          <div className="usf-kpi-value yellow">{triageSummary.p3Count}</div>
          <div className="usf-kpi-label">P3 Medium</div>
        </div>
        <div className="usf-kpi">
          <div className="usf-kpi-value blue">{triageSummary.totalAlerts}</div>
          <div className="usf-kpi-label">Active Alerts</div>
        </div>
        <div className="usf-kpi">
          <div className="usf-kpi-value green">
            {triageSummary.averageAgeMinutes < 60
              ? `${triageSummary.averageAgeMinutes}m`
              : `${Math.round(triageSummary.averageAgeMinutes / 60)}h`}
          </div>
          <div className="usf-kpi-label">Avg Age</div>
        </div>
        <div className="usf-kpi">
          <div className="usf-kpi-value blue">{automationRecommendations.length}</div>
          <div className="usf-kpi-label">Auto Recs</div>
        </div>
      </div>

      {/* Triage Queue */}
      <section className="usf-section">
        <div className="usf-section-header">
          <h3>Prioritised Triage Queue</h3>
          <span>{queue.length} items • last refreshed {fmt(lastRefreshed)}</span>
        </div>

        {queue.length === 0 ? (
          <div className="usf-empty">No active alerts requiring triage.</div>
        ) : (
          queue.map((item: TriageItem) => {
            const isExpanded = expandedItems.has(item.alert.id);
            return (
              <div
                key={item.alert.id}
                className="usf-queue-item"
                data-priority={item.priorityLabel}
                onClick={() => toggleItem(item.alert.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="usf-queue-top">
                  <div>
                    <p className="usf-queue-title">{item.alert.title}</p>
                    <div className="usf-queue-meta">
                      <span>Score: {item.priorityScore}</span>
                      <span>Age: {item.ageMinutes < 60 ? `${item.ageMinutes}m` : `${Math.round(item.ageMinutes / 60)}h`}</span>
                      {item.relatedAlertCount > 0 && (
                        <span>{item.relatedAlertCount} correlated</span>
                      )}
                      <span className="usf-owner">→ {item.suggestedOwner}</span>
                    </div>
                  </div>
                  <div className="usf-queue-badges">
                    <span className={`usf-priority-badge ${item.priorityLabel}`}>
                      {item.priorityLabel}
                    </span>
                    <span className={`usf-sev-badge ${item.alert.severity}`}>
                      {item.alert.severity}
                    </span>
                    <span className="usf-source-badge">
                      {SOURCE_LABELS[item.alert.source] ?? item.alert.source}
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div onClick={(e) => e.stopPropagation()}>
                    {item.alert.description && (
                      <p style={{ fontSize: 12, color: '#94a3b8', margin: '8px 0 4px' }}>
                        {item.alert.description}
                      </p>
                    )}
                    <ul className="usf-actions-list">
                      {item.suggestedActions.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* Automation Recommendations */}
      {automationRecommendations.length > 0 && (
        <section className="usf-section">
          <div className="usf-section-header">
            <h3>Automation & Response Recommendations</h3>
            <span>{automationRecommendations.length} recommendations</span>
          </div>
          {automationRecommendations.map((rec, idx) => (
            <div key={idx} className="usf-rec-item" data-priority={rec.priority}>
              <div className="usf-rec-action">{rec.action}</div>
              <div className="usf-rec-rationale">{rec.rationale}</div>
              <div className="usf-rec-badges">
                <span className={`usf-priority-badge ${
                  rec.priority === 'immediate' ? 'P1-Critical'
                  : rec.priority === 'urgent' ? 'P2-High'
                  : 'P3-Medium'
                }`}>
                  {rec.priority}
                </span>
                {rec.automatable
                  ? <span className="usf-automatable">Automatable</span>
                  : <span className="usf-manual">Manual</span>}
                {rec.mcpAction && (
                  <span className="usf-source-badge">MCP: {rec.mcpAction}</span>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Device Health */}
      {deviceHealth.length > 0 && (
        <section className="usf-section">
          <div className="usf-section-header">
            <h3>Device Health Overview</h3>
            <button className="usf-toggle" onClick={() => setShowDevices(!showDevices)}>
              {showDevices ? 'Hide' : 'Show'} ({deviceHealth.length})
            </button>
          </div>
          {showDevices && (
            <div className="usf-device-grid">
              {deviceHealth.map((d) => (
                <div key={d.deviceId} className="usf-device-card" data-risk={d.riskScore}>
                  <div className="usf-device-name">
                    {d.computerDnsName}
                    {d.isIsolated && <span className="usf-isolated-badge" style={{ marginLeft: 8 }}>ISOLATED</span>}
                  </div>
                  <div className="usf-device-meta">
                    <span>Risk: {d.riskScore}</span>
                    <span>Exposure: {d.exposureLevel}</span>
                    <span>Health: {d.healthStatus}</span>
                    <span>Last seen: {fmt(d.lastSeen)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Mitigation Playbooks */}
      {playbooks.length > 0 && (
        <section className="usf-section">
          <div className="usf-section-header">
            <h3>Mitigation Playbooks</h3>
            <button className="usf-toggle" onClick={() => setShowPlaybooks(!showPlaybooks)}>
              {showPlaybooks ? 'Hide' : 'Show'} ({playbooks.length})
            </button>
          </div>
          {showPlaybooks && (
            playbooks.map((pb, idx) => (
              <div key={idx} className="usf-playbook">
                <h4>{pb.title}</h4>
                <ol>
                  {pb.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
                {pb.automationHints.length > 0 && (
                  <div className="usf-playbook-hints">
                    <strong>Automation notes:</strong>
                    {pb.automationHints.map((hint, i) => (
                      <span key={i}>• {hint}</span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </section>
      )}
    </div>
  );
};

export default UnifiedSecurityPanel;
