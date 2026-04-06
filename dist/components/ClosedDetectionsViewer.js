import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import './ClosedDetectionsViewer.css';
export const ClosedDetectionsViewer = ({ detections, isLoading = false, error = null, onSort, }) => {
    const [sortColumn, setSortColumn] = useState('createdDate');
    const [sortDirection, setSortDirection] = useState('DESC');
    const handleColumnClick = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
        }
        else {
            setSortColumn(column);
            setSortDirection('DESC');
        }
        onSort?.(column, sortDirection);
    };
    const getRiskScoreColor = (score) => {
        if (score >= 80)
            return '#d32f2f'; // red
        if (score >= 60)
            return '#f57c00'; // orange
        if (score >= 40)
            return '#fbc02d'; // yellow
        return '#388e3c'; // green
    };
    if (error) {
        return (_jsx("div", { className: "closed-detections-error", children: _jsxs("p", { children: ["Error loading closed detections: ", error] }) }));
    }
    if (isLoading) {
        return (_jsx("div", { className: "closed-detections-loading", children: _jsx("p", { children: "Loading closed detections..." }) }));
    }
    return (_jsxs("div", { className: "closed-detections-viewer", children: [_jsxs("div", { className: "detections-summary", children: [_jsxs("p", { children: [_jsx("strong", { children: "Total Closed Detections:" }), " ", detections.length] }), _jsxs("p", { children: [_jsx("strong", { children: "Average Risk Score:" }), ' ', detections.length > 0
                                ? (detections.reduce((sum, d) => sum + d.riskScore, 0) / detections.length).toFixed(2)
                                : 'N/A'] })] }), _jsx("div", { className: "detections-table-wrapper", children: _jsxs("table", { className: "detections-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsxs("th", { onClick: () => handleColumnClick('createdDate'), children: ["Created Date ", sortColumn === 'createdDate' && (sortDirection === 'ASC' ? '↑' : '↓')] }), _jsxs("th", { onClick: () => handleColumnClick('daysOpen'), children: ["Days Open ", sortColumn === 'daysOpen' && (sortDirection === 'ASC' ? '↑' : '↓')] }), _jsxs("th", { onClick: () => handleColumnClick('riskScore'), children: ["Risk Score ", sortColumn === 'riskScore' && (sortDirection === 'ASC' ? '↑' : '↓')] }), _jsxs("th", { onClick: () => handleColumnClick('alertCount'), children: ["Alert Count ", sortColumn === 'alertCount' && (sortDirection === 'ASC' ? '↑' : '↓')] }), _jsx("th", { children: "Alert Types" }), _jsx("th", { children: "Ticket ID" })] }) }), _jsx("tbody", { children: detections.map((detection) => (_jsxs("tr", { className: "detection-row", children: [_jsxs("td", { className: "date-cell", children: [new Date(detection.createdDate).toLocaleDateString(), " ", new Date(detection.createdDate).toLocaleTimeString()] }), _jsxs("td", { className: "days-open-cell", children: [detection.daysOpen || 0, " days"] }), _jsx("td", { className: "risk-score-cell", children: _jsx("span", { className: "risk-score-badge", style: { backgroundColor: getRiskScoreColor(detection.riskScore) }, children: detection.riskScore }) }), _jsx("td", { className: "alert-count-cell", children: detection.alertCount }), _jsx("td", { className: "alert-types-cell", children: detection.alertTypes.map((type, idx) => (_jsx("span", { className: "alert-type-badge", children: type }, idx))) }), _jsx("td", { className: "ticket-id-cell", children: detection.ticketId || 'N/A' })] }, detection.id))) })] }) }), detections.length === 0 && (_jsx("div", { className: "no-detections", children: _jsx("p", { children: "No closed detections found." }) }))] }));
};
export default ClosedDetectionsViewer;
//# sourceMappingURL=ClosedDetectionsViewer.js.map