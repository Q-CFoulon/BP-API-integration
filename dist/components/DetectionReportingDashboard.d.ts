import React from 'react';
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
export declare const DetectionReportingDashboard: React.FC<DetectionReportingDashboardProps>;
export default DetectionReportingDashboard;
//# sourceMappingURL=DetectionReportingDashboard.d.ts.map