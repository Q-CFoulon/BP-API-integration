import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import './DetectionReportingDashboard.css';
export const DetectionReportingDashboard = ({ tenantName, stats, topAlertTypes, riskScoreDistribution, recentClosed, reportGeneratedAt, isLoading = false, }) => {
    const [expandedSection, setExpandedSection] = useState('stats');
    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };
    const getResolutionRate = () => {
        if (stats.totalDetections === 0)
            return 0;
        return Math.round((stats.resolvedDetections / stats.totalDetections) * 100);
    };
    const getRiskScoreColor = (score) => {
        if (score >= 80)
            return '#d32f2f';
        if (score >= 60)
            return '#f57c00';
        if (score >= 40)
            return '#fbc02d';
        return '#388e3c';
    };
    if (isLoading) {
        return _jsx("div", { className: "dashboard-loading", children: "Loading report..." });
    }
    return (_jsxs("div", { className: "detection-reporting-dashboard", children: [_jsxs("div", { className: "report-header", children: [_jsxs("h2", { children: ["Detection Report: ", tenantName] }), _jsxs("p", { className: "report-generated", children: ["Generated: ", new Date(reportGeneratedAt).toLocaleString()] })] }), _jsxs("section", { className: "dashboard-section metrics-section", children: [_jsxs("div", { className: "section-header", onClick: () => toggleSection('stats'), children: [_jsx("h3", { children: "\uD83D\uDCCA Key Metrics" }), _jsx("span", { className: "expand-icon", children: expandedSection === 'stats' ? '−' : '+' })] }), expandedSection === 'stats' && (_jsxs("div", { className: "metrics-grid", children: [_jsxs("div", { className: "metric-card", children: [_jsx("div", { className: "metric-label", children: "Total Detections" }), _jsx("div", { className: "metric-value", children: stats.totalDetections }), _jsx("div", { className: "metric-subtext", children: "all time" })] }), _jsxs("div", { className: "metric-card alert", children: [_jsx("div", { className: "metric-label", children: "Open" }), _jsx("div", { className: "metric-value", children: stats.openDetections }), _jsx("div", { className: "metric-subtext", children: "active" })] }), _jsxs("div", { className: "metric-card success", children: [_jsx("div", { className: "metric-label", children: "Resolved" }), _jsx("div", { className: "metric-value", children: stats.resolvedDetections }), _jsxs("div", { className: "metric-subtext", children: [getResolutionRate(), "% resolved"] })] }), _jsxs("div", { className: "metric-card", children: [_jsx("div", { className: "metric-label", children: "Avg Risk Score" }), _jsx("div", { className: "metric-value", children: stats.averageRiskScore.toFixed(1) }), _jsxs("div", { className: "metric-subtext", children: [Math.round(stats.minRiskScore), "\u2013", Math.round(stats.maxRiskScore)] })] })] }))] }), _jsxs("section", { className: "dashboard-section distribution-section", children: [_jsxs("div", { className: "section-header", onClick: () => toggleSection('distribution'), children: [_jsx("h3", { children: "\uD83C\uDFAF Risk Score Distribution" }), _jsx("span", { className: "expand-icon", children: expandedSection === 'distribution' ? '−' : '+' })] }), expandedSection === 'distribution' && (_jsx("div", { className: "distribution-chart", children: riskScoreDistribution.map((item) => {
                            const maxCount = Math.max(...riskScoreDistribution.map((i) => i.count));
                            const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                            return (_jsxs("div", { className: "distribution-bar-container", children: [_jsx("div", { className: "distribution-label", children: item.range }), _jsx("div", { className: "distribution-bar-wrapper", children: _jsx("div", { className: "distribution-bar", style: { width: `${percentage}%` } }) }), _jsx("div", { className: "distribution-count", children: item.count })] }, item.range));
                        }) }))] }), _jsxs("section", { className: "dashboard-section alerts-section", children: [_jsxs("div", { className: "section-header", onClick: () => toggleSection('alerts'), children: [_jsx("h3", { children: "\u26A0\uFE0F Top Alert Types" }), _jsx("span", { className: "expand-icon", children: expandedSection === 'alerts' ? '−' : '+' })] }), expandedSection === 'alerts' && (_jsx("div", { className: "alert-types-list", children: topAlertTypes.map((item, idx) => {
                            const maxCount = Math.max(...topAlertTypes.map((a) => a.count));
                            const percentage = (item.count / maxCount) * 100;
                            return (_jsxs("div", { className: "alert-type-item", children: [_jsx("div", { className: "alert-type-name", children: item.type }), _jsx("div", { className: "alert-type-bar-wrapper", children: _jsx("div", { className: "alert-type-bar", style: { width: `${percentage}%` } }) }), _jsx("div", { className: "alert-type-count", children: item.count })] }, idx));
                        }) }))] }), _jsxs("section", { className: "dashboard-section recent-section", children: [_jsxs("div", { className: "section-header", onClick: () => toggleSection('recent'), children: [_jsx("h3", { children: "\uD83D\uDD0D Recent Closed Detections" }), _jsx("span", { className: "expand-icon", children: expandedSection === 'recent' ? '−' : '+' })] }), expandedSection === 'recent' && (_jsx("div", { className: "recent-detections", children: recentClosed.length > 0 ? (_jsx("div", { className: "recent-detections-list", children: recentClosed.map((detection) => (_jsxs("div", { className: "recent-detection-item", children: [_jsxs("div", { className: "detection-header", children: [_jsx("span", { className: "detection-risk-score", style: {
                                                    backgroundColor: getRiskScoreColor(detection.riskScore),
                                                }, children: detection.riskScore }), _jsxs("div", { className: "detection-info", children: [_jsx("div", { className: "detection-date", children: new Date(detection.createdDate).toLocaleDateString() }), _jsxs("div", { className: "detection-alerts", children: [detection.alertCount, " alerts"] })] }), _jsxs("div", { className: "detection-days-open", children: [detection.daysOpen || 0, "d"] })] }), _jsx("div", { className: "detection-types", children: detection.alertTypes.map((type, idx) => (_jsx("span", { className: "type-badge", children: type }, idx))) })] }, detection.id))) })) : (_jsx("div", { className: "no-recent", children: "No recent closed detections." })) }))] }), _jsxs("div", { className: "dashboard-actions", children: [_jsx("button", { className: "action-button", onClick: () => {
                            const reportData = {
                                tenantName,
                                stats,
                                topAlertTypes,
                                riskScoreDistribution,
                                reportGeneratedAt,
                            };
                            const dataStr = JSON.stringify(reportData, null, 2);
                            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
                            const exportFileDefaultName = `detection-report-${tenantName}-${Date.now()}.json`;
                            const linkElement = document.createElement('a');
                            linkElement.setAttribute('href', dataUri);
                            linkElement.setAttribute('download', exportFileDefaultName);
                            linkElement.click();
                        }, children: "\uD83D\uDCE5 Export as JSON" }), _jsx("button", { className: "action-button primary", onClick: () => window.print(), children: "\uD83D\uDDA8\uFE0F Print Report" })] })] }));
};
export default DetectionReportingDashboard;
//# sourceMappingURL=DetectionReportingDashboard.js.map