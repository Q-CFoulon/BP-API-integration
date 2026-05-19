/**
 * RiskInsightsPanel — NON-DETECTION risk posture reporting.
 *
 * IMPORTANT: This panel displays proactive risk data (SPR, vulnerabilities, dark web).
 * These items are NOT Blackpoint detections and do NOT have case/ticket numbers.
 * They exist to inform governance and risk-decision reporting only.
 */
import React, { useEffect, useState } from 'react';
import {
  loadRiskInsights,
  RiskInsightsData,
  SprCategoryBreakdown,
  fetchSecurityPostureCategories,
} from '../services/riskInsights.service';
import './RiskInsightsPanel.css';

interface RiskInsightsPanelProps {
  tenantId: string;
  tenantName: string;
}

const RiskInsightsPanel: React.FC<RiskInsightsPanelProps> = ({ tenantId, tenantName }) => {
  const [data, setData] = useState<RiskInsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<SprCategoryBreakdown[] | null>(null);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setData(null);
    setCategories(null);
    loadRiskInsights(tenantId)
      .then((result) => {
        if (active) setData(result);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [tenantId]);

  const handleLoadCategories = async () => {
    setCategoriesLoading(true);
    try {
      const cats = await fetchSecurityPostureCategories(tenantId);
      setCategories(cats);
    } catch {
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  if (loading) {
    return <div className="risk-panel loading-state">Loading Risk Insights…</div>;
  }

  if (!data) {
    return <div className="risk-panel error-message">Unable to load risk insights.</div>;
  }

  return (
    <div className="risk-panel">
      {/* Header Banner */}
      <div className="risk-panel-header">
        <h2 className="risk-panel-title">📈 Risk Insights — {tenantName}</h2>
        <p className="risk-panel-disclaimer">
          ⚠️ These are <strong>not detections</strong>. They do not have Blackpoint case numbers
          and should not be correlated with detection ticket IDs. This data represents proactive
          risk posture information for governance and risk-decision reporting.
        </p>
      </div>

      {/* Security Posture Rating */}
      <section className="risk-section">
        <h3 className="risk-section-title">🛡️ Security Posture Rating (SPR)</h3>
        {data.spr.error ? (
          <div className="risk-error">⚠ {data.spr.error}</div>
        ) : data.spr.rating ? (
          <div className="spr-content">
            <div className="spr-score-card">
              <div className="spr-score-value">
                {data.spr.rating.score}
                <span className="spr-score-max"> / {data.spr.rating.maxScore}</span>
              </div>
              <div className="spr-score-label">Current Score</div>
              <div className="spr-score-date">
                Last calculated: {new Date(data.spr.rating.created).toLocaleDateString()}
              </div>
              <div className="spr-score-bar">
                <div
                  className="spr-score-fill"
                  style={{ width: `${(data.spr.rating.score / data.spr.rating.maxScore) * 100}%` }}
                  data-level={
                    data.spr.rating.score / data.spr.rating.maxScore >= 0.8
                      ? 'good'
                      : data.spr.rating.score / data.spr.rating.maxScore >= 0.6
                      ? 'moderate'
                      : 'poor'
                  }
                />
              </div>
            </div>

            {/* History */}
            {data.spr.history && data.spr.history.history.length > 0 && (
              <div className="spr-history">
                <h4>Score History (6 Months)</h4>
                <div className="spr-history-list">
                  {data.spr.history.history.slice(0, 12).map((entry, i) => (
                    <div key={i} className="spr-history-entry">
                      <span className="spr-history-date">
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                      <span className="spr-history-score">
                        {entry.score} / {entry.maxScore}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category Breakdown */}
            {!categories && (
              <button
                className="btn-primary"
                style={{ marginTop: 12 }}
                disabled={categoriesLoading}
                onClick={handleLoadCategories}
              >
                {categoriesLoading ? 'Loading…' : 'View Category Breakdown'}
              </button>
            )}
            {categories && categories.length > 0 && (
              <div className="spr-categories">
                <h4>Category Breakdown</h4>
                {categories.map((cat, i) => (
                  <div key={i} className="spr-category-item">
                    <div className="spr-category-name">{cat.categoryName}</div>
                    <div className="spr-category-score">
                      {cat.score} / {cat.maxScore}
                    </div>
                    <div className="spr-score-bar small">
                      <div
                        className="spr-score-fill"
                        style={{ width: `${(cat.score / cat.maxScore) * 100}%` }}
                        data-level={
                          cat.score / cat.maxScore >= 0.8
                            ? 'good'
                            : cat.score / cat.maxScore >= 0.6
                            ? 'moderate'
                            : 'poor'
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="risk-empty">No Security Posture Rating available for this tenant.</div>
        )}
      </section>

      {/* Vulnerability Management */}
      <section className="risk-section">
        <h3 className="risk-section-title">🔓 Vulnerability Management</h3>
        {data.vulnerabilities.error ? (
          <div className="risk-error">⚠ {data.vulnerabilities.error}</div>
        ) : data.vulnerabilities.countBySeverity ? (
          <div className="vuln-content">
            <div className="vuln-severity-grid">
              <div className="vuln-severity-card" data-severity="critical">
                <div className="vuln-count">{data.vulnerabilities.countBySeverity.critical}</div>
                <div className="vuln-label">Critical</div>
              </div>
              <div className="vuln-severity-card" data-severity="high">
                <div className="vuln-count">{data.vulnerabilities.countBySeverity.high}</div>
                <div className="vuln-label">High</div>
              </div>
              <div className="vuln-severity-card" data-severity="medium">
                <div className="vuln-count">{data.vulnerabilities.countBySeverity.medium}</div>
                <div className="vuln-label">Medium</div>
              </div>
              <div className="vuln-severity-card" data-severity="low">
                <div className="vuln-count">{data.vulnerabilities.countBySeverity.low}</div>
                <div className="vuln-label">Low</div>
              </div>
              <div className="vuln-severity-card" data-severity="info">
                <div className="vuln-count">{data.vulnerabilities.countBySeverity.informational}</div>
                <div className="vuln-label">Info</div>
              </div>
            </div>
            <div className="vuln-total">
              Total Open Vulnerabilities: <strong>{data.vulnerabilities.countBySeverity.total}</strong>
            </div>
          </div>
        ) : (
          <div className="risk-empty">No vulnerability data available for this tenant.</div>
        )}
      </section>

      {/* Dark Web Exposures */}
      <section className="risk-section">
        <h3 className="risk-section-title">🌐 Dark Web Exposure Monitoring</h3>
        {data.darkWeb.error ? (
          <div className="risk-error">⚠ {data.darkWeb.error}</div>
        ) : data.darkWeb.report ? (
          <div className="darkweb-content">
            <div className="darkweb-summary-grid">
              <div className="darkweb-stat">
                <div className="darkweb-stat-value">{data.darkWeb.report.totalExposures}</div>
                <div className="darkweb-stat-label">Total Exposures</div>
              </div>
              <div className="darkweb-stat">
                <div className="darkweb-stat-value warning">
                  {data.darkWeb.report.passwordsExposed}
                </div>
                <div className="darkweb-stat-label">Passwords Exposed</div>
              </div>
              <div className="darkweb-stat">
                <div className="darkweb-stat-value">{data.darkWeb.report.usernamesExposed}</div>
                <div className="darkweb-stat-label">Usernames Exposed</div>
              </div>
              <div className="darkweb-stat">
                <div className="darkweb-stat-value">{data.darkWeb.report.domainsAffected}</div>
                <div className="darkweb-stat-label">Domains Affected</div>
              </div>
            </div>
            {data.darkWeb.report.lastScanDate && (
              <div className="darkweb-scan-date">
                Last scan: {new Date(data.darkWeb.report.lastScanDate).toLocaleDateString()}
              </div>
            )}

            {/* Exposures Table */}
            {data.darkWeb.exposures && data.darkWeb.exposures.length > 0 && (
              <div className="darkweb-exposures-table-wrapper">
                <h4>Recent Exposures ({data.darkWeb.exposuresMeta?.totalItems ?? data.darkWeb.exposures.length} total)</h4>
                <table className="darkweb-exposures-table">
                  <thead>
                    <tr>
                      <th>Email / Username</th>
                      <th>Domain</th>
                      <th>Password</th>
                      <th>Source</th>
                      <th>Discovered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.darkWeb.exposures.map((exp) => (
                      <tr key={exp.id}>
                        <td>{exp.email || exp.username || '—'}</td>
                        <td>{exp.domain || '—'}</td>
                        <td className={exp.passwordExposed ? 'danger' : ''}>
                          {exp.passwordExposed ? '⚠ YES' : 'No'}
                        </td>
                        <td>{exp.source || '—'}</td>
                        <td>
                          {exp.discoveredAt
                            ? new Date(exp.discoveredAt).toLocaleDateString()
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="risk-empty">No dark web scan data available for this tenant.</div>
        )}
      </section>
    </div>
  );
};

export default RiskInsightsPanel;
