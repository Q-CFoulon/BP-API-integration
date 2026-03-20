import React, { useState } from 'react';
import './DetectionReportingDashboard.css';

export interface DetectionStats {
  totalDetections: number;
  openDetections: number;
  resolvedDetections: number;
  averageRiskScore: number;
  maxRiskScore: number;
  minRiskScore: number;
}

export interface TopAlertType {
  type: string;
  count: number;
}

export interface RiskScoreRange {
  range: string;
  count: number;
}

export interface ClosedDetection {
  id: string;
  tenantId: string;
  tenantName?: string;
  groupKey: string;
  status: 'RESOLVED';
  alertCount: number;
  riskScore: number;
  alertTypes: string[];
  createdDate: string;
  resolvedDate?: string;
  daysOpen?: number;
  ticketId?: string;
}

interface DetectionReportingDashboardProps {
  tenantName: string;
  stats: DetectionStats;
  topAlertTypes: TopAlertType[];
  riskScoreDistribution: RiskScoreRange[];
  recentClosed: ClosedDetection[];
  reportGeneratedAt: string;
  isLoading?: boolean;
}

export const DetectionReportingDashboard: React.FC<DetectionReportingDashboardProps> = ({
  tenantName,
  stats,
  topAlertTypes,
  riskScoreDistribution,
  recentClosed,
  reportGeneratedAt,
  isLoading = false,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('stats');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getResolutionRate = (): number => {
    if (stats.totalDetections === 0) return 0;
    return Math.round((stats.resolvedDetections / stats.totalDetections) * 100);
  };

  const getRiskScoreColor = (score: number): string => {
    if (score >= 80) return '#d32f2f';
    if (score >= 60) return '#f57c00';
    if (score >= 40) return '#fbc02d';
    return '#388e3c';
  };

  if (isLoading) {
    return <div className="dashboard-loading">Loading report...</div>;
  }

  return (
    <div className="detection-reporting-dashboard">
      <div className="report-header">
        <h2>Detection Report: {tenantName}</h2>
        <p className="report-generated">
          Generated: {new Date(reportGeneratedAt).toLocaleString()}
        </p>
      </div>

      {/* Key Metrics */}
      <section className="dashboard-section metrics-section">
        <div className="section-header" onClick={() => toggleSection('stats')}>
          <h3>📊 Key Metrics</h3>
          <span className="expand-icon">{expandedSection === 'stats' ? '−' : '+'}</span>
        </div>
        {expandedSection === 'stats' && (
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-label">Total Detections</div>
              <div className="metric-value">{stats.totalDetections}</div>
              <div className="metric-subtext">all time</div>
            </div>
            <div className="metric-card alert">
              <div className="metric-label">Open</div>
              <div className="metric-value">{stats.openDetections}</div>
              <div className="metric-subtext">active</div>
            </div>
            <div className="metric-card success">
              <div className="metric-label">Resolved</div>
              <div className="metric-value">{stats.resolvedDetections}</div>
              <div className="metric-subtext">{getResolutionRate()}% resolved</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Avg Risk Score</div>
              <div className="metric-value">{stats.averageRiskScore.toFixed(1)}</div>
              <div className="metric-subtext">
                {Math.round(stats.minRiskScore)}–{Math.round(stats.maxRiskScore)}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Risk Score Distribution */}
      <section className="dashboard-section distribution-section">
        <div className="section-header" onClick={() => toggleSection('distribution')}>
          <h3>🎯 Risk Score Distribution</h3>
          <span className="expand-icon">{expandedSection === 'distribution' ? '−' : '+'}</span>
        </div>
        {expandedSection === 'distribution' && (
          <div className="distribution-chart">
            {riskScoreDistribution.map((item) => {
              const maxCount = Math.max(...riskScoreDistribution.map((i) => i.count));
              const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
              return (
                <div key={item.range} className="distribution-bar-container">
                  <div className="distribution-label">{item.range}</div>
                  <div className="distribution-bar-wrapper">
                    <div
                      className="distribution-bar"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="distribution-count">{item.count}</div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Top Alert Types */}
      <section className="dashboard-section alerts-section">
        <div className="section-header" onClick={() => toggleSection('alerts')}>
          <h3>⚠️ Top Alert Types</h3>
          <span className="expand-icon">{expandedSection === 'alerts' ? '−' : '+'}</span>
        </div>
        {expandedSection === 'alerts' && (
          <div className="alert-types-list">
            {topAlertTypes.map((item, idx) => {
              const maxCount = Math.max(...topAlertTypes.map((a) => a.count));
              const percentage = (item.count / maxCount) * 100;
              return (
                <div key={idx} className="alert-type-item">
                  <div className="alert-type-name">{item.type}</div>
                  <div className="alert-type-bar-wrapper">
                    <div
                      className="alert-type-bar"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="alert-type-count">{item.count}</div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Recent Closed Detections */}
      <section className="dashboard-section recent-section">
        <div className="section-header" onClick={() => toggleSection('recent')}>
          <h3>🔍 Recent Closed Detections</h3>
          <span className="expand-icon">{expandedSection === 'recent' ? '−' : '+'}</span>
        </div>
        {expandedSection === 'recent' && (
          <div className="recent-detections">
            {recentClosed.length > 0 ? (
              <div className="recent-detections-list">
                {recentClosed.map((detection) => (
                  <div key={detection.id} className="recent-detection-item">
                    <div className="detection-header">
                      <span
                        className="detection-risk-score"
                        style={{
                          backgroundColor: getRiskScoreColor(detection.riskScore),
                        }}
                      >
                        {detection.riskScore}
                      </span>
                      <div className="detection-info">
                        <div className="detection-date">
                          {new Date(detection.createdDate).toLocaleDateString()}
                        </div>
                        <div className="detection-alerts">
                          {detection.alertCount} alerts
                        </div>
                      </div>
                      <div className="detection-days-open">
                        {detection.daysOpen || 0}d
                      </div>
                    </div>
                    <div className="detection-types">
                      {detection.alertTypes.map((type, idx) => (
                        <span key={idx} className="type-badge">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-recent">No recent closed detections.</div>
            )}
          </div>
        )}
      </section>

      {/* Export/Actions */}
      <div className="dashboard-actions">
        <button
          className="action-button"
          onClick={() => {
            const reportData = {
              tenantName,
              stats,
              topAlertTypes,
              riskScoreDistribution,
              reportGeneratedAt,
            };
            const dataStr = JSON.stringify(reportData, null, 2);
            const dataUri =
              'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            const exportFileDefaultName = `detection-report-${tenantName}-${Date.now()}.json`;
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
          }}
        >
          📥 Export as JSON
        </button>
        <button
          className="action-button primary"
          onClick={() => window.print()}
        >
          🖨️ Print Report
        </button>
      </div>
    </div>
  );
};

export default DetectionReportingDashboard;
