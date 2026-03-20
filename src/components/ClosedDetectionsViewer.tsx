import React, { useState, useEffect } from 'react';
import './ClosedDetectionsViewer.css';

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

interface ClosedDetectionsViewerProps {
  detections: ClosedDetection[];
  isLoading?: boolean;
  error?: string | null;
  onSort?: (column: string, direction: 'ASC' | 'DESC') => void;
}

export const ClosedDetectionsViewer: React.FC<ClosedDetectionsViewerProps> = ({
  detections,
  isLoading = false,
  error = null,
  onSort,
}) => {
  const [sortColumn, setSortColumn] = useState<string>('createdDate');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');

  const handleColumnClick = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortColumn(column);
      setSortDirection('DESC');
    }
    onSort?.(column, sortDirection);
  };

  const getRiskScoreColor = (score: number): string => {
    if (score >= 80) return '#d32f2f'; // red
    if (score >= 60) return '#f57c00'; // orange
    if (score >= 40) return '#fbc02d'; // yellow
    return '#388e3c'; // green
  };

  if (error) {
    return (
      <div className="closed-detections-error">
        <p>Error loading closed detections: {error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="closed-detections-loading">
        <p>Loading closed detections...</p>
      </div>
    );
  }

  return (
    <div className="closed-detections-viewer">
      <div className="detections-summary">
        <p>
          <strong>Total Closed Detections:</strong> {detections.length}
        </p>
        <p>
          <strong>Average Risk Score:</strong>{' '}
          {detections.length > 0
            ? (detections.reduce((sum, d) => sum + d.riskScore, 0) / detections.length).toFixed(2)
            : 'N/A'}
        </p>
      </div>

      <div className="detections-table-wrapper">
        <table className="detections-table">
          <thead>
            <tr>
              <th onClick={() => handleColumnClick('createdDate')}>
                Created Date {sortColumn === 'createdDate' && (sortDirection === 'ASC' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleColumnClick('daysOpen')}>
                Days Open {sortColumn === 'daysOpen' && (sortDirection === 'ASC' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleColumnClick('riskScore')}>
                Risk Score {sortColumn === 'riskScore' && (sortDirection === 'ASC' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleColumnClick('alertCount')}>
                Alert Count {sortColumn === 'alertCount' && (sortDirection === 'ASC' ? '↑' : '↓')}
              </th>
              <th>Alert Types</th>
              <th>Ticket ID</th>
            </tr>
          </thead>
          <tbody>
            {detections.map((detection) => (
              <tr key={detection.id} className="detection-row">
                <td className="date-cell">
                  {new Date(detection.createdDate).toLocaleDateString()} {new Date(detection.createdDate).toLocaleTimeString()}
                </td>
                <td className="days-open-cell">{detection.daysOpen || 0} days</td>
                <td className="risk-score-cell">
                  <span
                    className="risk-score-badge"
                    style={{ backgroundColor: getRiskScoreColor(detection.riskScore) }}
                  >
                    {detection.riskScore}
                  </span>
                </td>
                <td className="alert-count-cell">{detection.alertCount}</td>
                <td className="alert-types-cell">
                  {detection.alertTypes.map((type, idx) => (
                    <span key={idx} className="alert-type-badge">
                      {type}
                    </span>
                  ))}
                </td>
                <td className="ticket-id-cell">{detection.ticketId || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detections.length === 0 && (
        <div className="no-detections">
          <p>No closed detections found.</p>
        </div>
      )}
    </div>
  );
};

export default ClosedDetectionsViewer;
