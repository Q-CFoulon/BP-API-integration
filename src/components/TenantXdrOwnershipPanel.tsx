import React, { useEffect, useMemo, useState } from 'react';
import './TenantXdrOwnershipPanel.css';
import {
  BlackpointGroupLike,
  CorrelationOverride,
  CorrelationOverrideMap,
  DefenderWorkItem,
  DefenderTenantSnapshot,
  TenantLike,
  TenantOwnershipView,
  buildTenantOwnershipView,
  formatOwnerLabel,
  getServiceLabel,
  loadTenantDefenderSnapshot,
  ownerOrder,
  severityRank
} from '../services/defenderXdr.service';
import {
  CloseoutGovernanceRow,
  buildCloseoutGovernanceRows,
  downloadCloseoutGovernanceCsv,
  loadCorrelationOverrides,
  removeCorrelationOverride,
  upsertCorrelationOverride,
} from '../services/closeoutGovernance.service';

interface TenantXdrOwnershipPanelProps {
  tenant: TenantLike;
  blackpointGroups: BlackpointGroupLike[];
}

function fmt(iso: string): string {
  return new Date(iso).toLocaleString();
}

function ownerClass(owner: string): string {
  return owner.toLowerCase().replace(/\s+/g, '-');
}

function severityClass(severity: string): string {
  return severity.toLowerCase();
}

const TenantXdrOwnershipPanel: React.FC<TenantXdrOwnershipPanelProps> = ({
  tenant,
  blackpointGroups
}) => {
  const [snapshot, setSnapshot] = useState<DefenderTenantSnapshot | null>(null);
  const [view, setView] = useState<TenantOwnershipView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<CorrelationOverrideMap>({});
  const [overrideSelection, setOverrideSelection] = useState<Record<string, string>>({});
  const [overrideMessage, setOverrideMessage] = useState<string | null>(null);

  useEffect(() => {
    setOverrides(loadCorrelationOverrides(tenant.id));
    setOverrideSelection({});
    setOverrideMessage(null);
  }, [tenant.id]);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    loadTenantDefenderSnapshot(tenant)
      .then((nextSnapshot) => {
        if (!active) return;
        setSnapshot(nextSnapshot);
      })
      .catch((err: Error) => {
        if (!active) return;
        setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [tenant]);

  useEffect(() => {
    if (!snapshot) {
      setView(null);
      return;
    }

    setView(buildTenantOwnershipView(blackpointGroups, snapshot, overrides));
  }, [snapshot, blackpointGroups, overrides]);

  const applyOverride = (override: CorrelationOverride): void => {
    const next = upsertCorrelationOverride(tenant.id, override);
    setOverrides(next);
  };

  const handleConfirmMatch = (incidentId: string): void => {
    const selectedGroupId =
      overrideSelection[incidentId] ??
      view?.workItems.find((item) => item.incident.id === incidentId)?.correlatedGroupId;
    if (!selectedGroupId) return;

    applyOverride({
      incidentId,
      action: 'match',
      groupId: selectedGroupId,
      updatedAt: new Date().toISOString(),
    });

    setOverrideMessage(`Saved analyst match for incident ${incidentId}.`);
  };

  const handleMarkNoMatch = (incidentId: string): void => {
    applyOverride({
      incidentId,
      action: 'no-match',
      updatedAt: new Date().toISOString(),
    });

    setOverrideMessage(`Marked incident ${incidentId} as no Blackpoint match.`);
  };

  const handleClearOverride = (incidentId: string): void => {
    const next = removeCorrelationOverride(tenant.id, incidentId);
    setOverrides(next);
    setOverrideMessage(`Cleared override for incident ${incidentId}.`);
  };

  const queuedItems = useMemo(() => {
    if (!view) return [] as DefenderWorkItem[];
    return [...view.workItems].sort((left, right) => {
      const ownerCompare = ownerOrder(left.owner) - ownerOrder(right.owner);
      if (ownerCompare !== 0) return ownerCompare;
      return severityRank(right.incident.severity) - severityRank(left.incident.severity);
    });
  }, [view]);

  const closeoutRows = useMemo(() => {
    if (!view) return [] as CloseoutGovernanceRow[];
    return buildCloseoutGovernanceRows(tenant, blackpointGroups, view);
  }, [tenant, blackpointGroups, view]);

  if (loading) {
    return <div className="xdr-panel-loading">Loading Defender XDR ownership view...</div>;
  }

  if (error) {
    return <div className="xdr-panel-error">Error loading Defender XDR ownership view: {error}</div>;
  }

  if (!view) {
    return <div className="xdr-panel-empty">No Defender XDR data available for this tenant.</div>;
  }

  return (
    <div className="tenant-xdr-panel">
      <div className="xdr-header-card">
        <div>
          <h2 className="xdr-title">Microsoft Defender XDR Ownership View</h2>
          <p className="xdr-subtitle">
            Correlates Blackpoint detections with Defender XDR incidents so the team can see
            what Blackpoint owns versus what stays with Quisitive SecOps or the customer.
          </p>
        </div>
        <div className="xdr-source-badge api">
          Backend connected
        </div>
      </div>

      <div className="xdr-summary-grid">
        <div className="xdr-summary-card blackpoint">
          <div className="xdr-summary-label">Blackpoint-Handled Detections</div>
          <div className="xdr-summary-value">{view.summary.blackpointHandled}</div>
          <div className="xdr-summary-note">Open or resolved BP tickets in this tenant context</div>
        </div>
        <div className="xdr-summary-card shared">
          <div className="xdr-summary-label">Shared Investigations</div>
          <div className="xdr-summary-value">{view.summary.sharedInvestigations}</div>
          <div className="xdr-summary-note">Blackpoint triage plus follow-through from tenant teams</div>
        </div>
        <div className="xdr-summary-card secops">
          <div className="xdr-summary-label">Quisitive SecOps Queue</div>
          <div className="xdr-summary-value">{view.summary.secOpsQueue}</div>
          <div className="xdr-summary-note">Email, cloud app, and detection engineering work</div>
        </div>
        <div className="xdr-summary-card customer">
          <div className="xdr-summary-label">Customer Remediation Queue</div>
          <div className="xdr-summary-value">{view.summary.customerQueue}</div>
          <div className="xdr-summary-note">Hardening, patching, posture, and policy changes</div>
        </div>
      </div>

      <div className="xdr-meta-row">
        <span>Generated: {fmt(view.snapshot.generatedAt)}</span>
        <span>Correlated with Blackpoint: {view.summary.correlatedItems}</span>
        <span>Critical uncovered gaps: {view.summary.criticalGaps}</span>
      </div>

      {overrideMessage && (
        <div className="xdr-override-message">{overrideMessage}</div>
      )}

      <section className="xdr-section" style={{ marginTop: 16 }}>
        <div className="xdr-section-header">
          <h3>Closeout Reconciliation</h3>
          <span>Blackpoint vs Office365 XDR</span>
        </div>
        <div className="xdr-summary-grid">
          <div className="xdr-summary-card blackpoint">
            <div className="xdr-summary-label">Both Closed</div>
            <div className="xdr-summary-value">{view.closeout.bpResolvedAndXdrResolved}</div>
            <div className="xdr-summary-note">BP resolved and XDR resolved</div>
          </div>
          <div className="xdr-summary-card secops">
            <div className="xdr-summary-label">Needs XDR Closeout</div>
            <div className="xdr-summary-value">{view.closeout.bpResolvedXdrActive}</div>
            <div className="xdr-summary-note">BP resolved but XDR still active</div>
          </div>
          <div className="xdr-summary-card shared">
            <div className="xdr-summary-label">Needs BP Closeout</div>
            <div className="xdr-summary-value">{view.closeout.bpOpenXdrResolved}</div>
            <div className="xdr-summary-note">XDR resolved while BP remains open</div>
          </div>
          <div className="xdr-summary-card customer">
            <div className="xdr-summary-label">Unmatched Items</div>
            <div className="xdr-summary-value">
              {view.closeout.unmatchedXdr} / {view.closeout.unmatchedBp}
            </div>
            <div className="xdr-summary-note">Unmatched XDR incidents / BP detections</div>
          </div>
        </div>
      </section>

      <section className="xdr-section">
        <div className="xdr-section-header">
          <h3>Closeout Governance Export View</h3>
          <button
            className="xdr-export-btn"
            onClick={() => downloadCloseoutGovernanceCsv(tenant, closeoutRows)}
            disabled={closeoutRows.length === 0}
          >
            Export CSV
          </button>
        </div>
        {closeoutRows.length === 0 ? (
          <div className="xdr-empty-box">No closeout rows to export for this tenant.</div>
        ) : (
          <>
            <div className="xdr-table-wrap">
              <table className="xdr-table">
                <thead>
                  <tr>
                    <th>XDR Incident</th>
                    <th>BP Ticket</th>
                    <th>Reconciliation Status</th>
                    <th>Confidence</th>
                    <th>Method</th>
                  </tr>
                </thead>
                <tbody>
                  {closeoutRows.slice(0, 20).map((row, idx) => (
                    <tr key={`${row.xdrIncidentId || 'bp'}-${row.bpGroupId || idx}`}>
                      <td>{row.xdrIncidentRef || '—'}</td>
                      <td>{row.bpTicketId || '—'}</td>
                      <td>{row.reconciliationStatus}</td>
                      <td>{row.correlationConfidence || '—'}</td>
                      <td>{row.correlationMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="xdr-table-footnote">
              Showing first {Math.min(20, closeoutRows.length)} of {closeoutRows.length} rows.
            </div>
          </>
        )}
      </section>

      <div className="xdr-sections-grid">
        <section className="xdr-section">
          <div className="xdr-section-header">
            <h3>Blackpoint-Managed Detections</h3>
            <span>{view.blackpointDetections.length}</span>
          </div>
          {view.blackpointDetections.length === 0 ? (
            <div className="xdr-empty-box">No Blackpoint detections loaded for this tenant.</div>
          ) : (
            <div className="xdr-list">
              {view.blackpointDetections.map((detection) => (
                <article key={detection.groupId} className="xdr-item blackpoint-item">
                  <div className="xdr-item-top">
                    <div>
                      <div className="xdr-item-title">{detection.title}</div>
                      <div className="xdr-item-meta">
                        <span>Ticket: {detection.ticketId || 'N/A'}</span>
                        <span>Created: {fmt(detection.created)}</span>
                      </div>
                    </div>
                    <div className="xdr-item-badges">
                      <span className={`owner-badge ${ownerClass(detection.ownership)}`}>
                        {detection.ownership}
                      </span>
                      <span className={`severity-badge-xdr ${severityClass(
                        detection.riskScore >= 80
                          ? 'critical'
                          : detection.riskScore >= 60
                            ? 'high'
                            : detection.riskScore >= 40
                              ? 'medium'
                              : 'low'
                      )}`}>
                        Risk {detection.riskScore}
                      </span>
                    </div>
                  </div>
                  <div className="xdr-item-body">
                    {detection.correlationCount > 0
                      ? `${detection.correlationCount} Defender XDR item(s) map back to this Blackpoint detection, so follow-on mitigation is shared.`
                      : 'Blackpoint owns the frontline triage for this detection based on the current data.'}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="xdr-section">
          <div className="xdr-section-header">
            <h3>Defender XDR Triage Queue</h3>
            <span>{queuedItems.length}</span>
          </div>
          {queuedItems.length === 0 ? (
            <div className="xdr-empty-box">No Defender XDR incidents loaded for this tenant.</div>
          ) : (
            <div className="xdr-list">
              {queuedItems.map((item) => (
                <article key={item.incident.id} className="xdr-item queue-item">
                  <div className="xdr-item-top">
                    <div>
                      <div className="xdr-item-title">{item.incident.title}</div>
                      <div className="xdr-item-meta">
                        <span>XDR Incident: {item.xdrIncidentRef}</span>
                        <span>{getServiceLabel(item.incident.serviceSource)}</span>
                        <span>{fmt(item.incident.createdDate)}</span>
                        {item.correlatedTicketId && <span>BP Ticket: {item.correlatedTicketId}</span>}
                      </div>
                    </div>
                    <div className="xdr-item-badges">
                      <span className={`owner-badge ${ownerClass(item.owner)}`}>
                        {formatOwnerLabel(item.owner)}
                      </span>
                      <span className={`coverage-badge ${item.blackpointCoverage}`}>
                        {item.blackpointCoverage === 'covered'
                          ? 'Covered'
                          : item.blackpointCoverage === 'partial'
                            ? 'Partial'
                            : 'Gap'}
                      </span>
                      {item.correlationConfidence && (
                        <span className={`coverage-badge ${item.correlationConfidence === 'analyst-confirmed' || item.correlationConfidence === 'high' ? 'covered' : item.correlationConfidence === 'medium' ? 'partial' : 'gap'}`}>
                          Correlation: {item.correlationConfidence}
                        </span>
                      )}
                      <span className={`severity-badge-xdr ${severityClass(item.incident.severity)}`}>
                        {item.incident.severity}
                      </span>
                    </div>
                  </div>
                  <div className="xdr-item-body">
                    <p>{item.rationale}</p>
                    <p>
                      <strong>Recommended action:</strong> {item.incident.recommendedAction}
                    </p>
                    {(item.correlationConfidence === 'low' || item.overrideApplied) && (
                      <div className="xdr-override-panel">
                        <div className="xdr-override-title">Analyst Correlation Review</div>
                        <p className="xdr-override-text">
                          {item.overrideApplied
                            ? item.overrideAction === 'match'
                              ? 'Analyst override is active and will be reused for this incident.'
                              : 'Analyst override marks this incident as having no Blackpoint match.'
                            : 'Low-confidence match detected. Confirm once and the decision will be reused automatically.'}
                        </p>
                        <div className="xdr-override-controls">
                          <select
                            className="xdr-override-select"
                            value={overrideSelection[item.incident.id] ?? item.correlatedGroupId ?? ''}
                            onChange={(event) =>
                              setOverrideSelection((prev) => ({
                                ...prev,
                                [item.incident.id]: event.target.value,
                              }))
                            }
                          >
                            <option value="">Select Blackpoint detection</option>
                            {blackpointGroups.map((group) => (
                              <option key={group.id} value={group.id}>
                                {group.ticketId || group.id} - {group.alertTypes[0] || group.groupKey}
                              </option>
                            ))}
                          </select>
                          <button
                            className="xdr-action-btn"
                            onClick={() => handleConfirmMatch(item.incident.id)}
                            disabled={!Boolean(overrideSelection[item.incident.id] ?? item.correlatedGroupId)}
                          >
                            Confirm Match
                          </button>
                          <button
                            className="xdr-action-btn warn"
                            onClick={() => handleMarkNoMatch(item.incident.id)}
                          >
                            Mark No Match
                          </button>
                          {item.overrideApplied && (
                            <button
                              className="xdr-action-btn ghost"
                              onClick={() => handleClearOverride(item.incident.id)}
                            >
                              Clear Override
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="xdr-section recommendations-section">
        <div className="xdr-section-header">
          <h3>Recommended Next Actions</h3>
          <span>{view.recommendations.length}</span>
        </div>
        {view.recommendations.length === 0 ? (
          <div className="xdr-empty-box">No additional actions identified.</div>
        ) : (
          <ol className="recommendation-list">
            {view.recommendations.map((recommendation) => (
              <li key={recommendation}>{recommendation}</li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
};

export default TenantXdrOwnershipPanel;