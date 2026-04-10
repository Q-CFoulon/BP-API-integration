import React, { useEffect, useMemo, useState } from 'react';
import './TenantXdrOwnershipPanel.css';
import {
  BlackpointGroupLike,
  DefenderWorkItem,
  TenantLike,
  TenantOwnershipView,
  buildTenantOwnershipView,
  formatOwnerLabel,
  getServiceLabel,
  loadTenantDefenderSnapshot,
  ownerOrder,
  severityRank
} from '../services/defenderXdr.service';

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
  const [view, setView] = useState<TenantOwnershipView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    loadTenantDefenderSnapshot(tenant)
      .then((snapshot) => {
        if (!active) return;
        setView(buildTenantOwnershipView(blackpointGroups, snapshot));
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
  }, [tenant, blackpointGroups]);

  const queuedItems = useMemo(() => {
    if (!view) return [] as DefenderWorkItem[];
    return [...view.workItems].sort((left, right) => {
      const ownerCompare = ownerOrder(left.owner) - ownerOrder(right.owner);
      if (ownerCompare !== 0) return ownerCompare;
      return severityRank(right.incident.severity) - severityRank(left.incident.severity);
    });
  }, [view]);

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