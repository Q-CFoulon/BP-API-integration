import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import './TenantXdrOwnershipPanel.css';
import { buildTenantOwnershipView, formatOwnerLabel, getServiceLabel, loadTenantDefenderSnapshot, ownerOrder, severityRank } from '../services/defenderXdr.service';
function fmt(iso) {
    return new Date(iso).toLocaleString();
}
function ownerClass(owner) {
    return owner.toLowerCase().replace(/\s+/g, '-');
}
function severityClass(severity) {
    return severity.toLowerCase();
}
const TenantXdrOwnershipPanel = ({ tenant, blackpointGroups }) => {
    const [view, setView] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        let active = true;
        setLoading(true);
        setError(null);
        loadTenantDefenderSnapshot(tenant)
            .then((snapshot) => {
            if (!active)
                return;
            setView(buildTenantOwnershipView(blackpointGroups, snapshot));
        })
            .catch((err) => {
            if (!active)
                return;
            setError(err.message);
        })
            .finally(() => {
            if (active)
                setLoading(false);
        });
        return () => {
            active = false;
        };
    }, [tenant, blackpointGroups]);
    const queuedItems = useMemo(() => {
        if (!view)
            return [];
        return [...view.workItems].sort((left, right) => {
            const ownerCompare = ownerOrder(left.owner) - ownerOrder(right.owner);
            if (ownerCompare !== 0)
                return ownerCompare;
            return severityRank(right.incident.severity) - severityRank(left.incident.severity);
        });
    }, [view]);
    if (loading) {
        return _jsx("div", { className: "xdr-panel-loading", children: "Loading Defender XDR ownership view..." });
    }
    if (error) {
        return _jsxs("div", { className: "xdr-panel-error", children: ["Error loading Defender XDR ownership view: ", error] });
    }
    if (!view) {
        return _jsx("div", { className: "xdr-panel-empty", children: "No Defender XDR data available for this tenant." });
    }
    return (_jsxs("div", { className: "tenant-xdr-panel", children: [_jsxs("div", { className: "xdr-header-card", children: [_jsxs("div", { children: [_jsx("h2", { className: "xdr-title", children: "Microsoft Defender XDR Ownership View" }), _jsx("p", { className: "xdr-subtitle", children: "Correlates Blackpoint detections with Defender XDR incidents so the team can see what Blackpoint owns versus what stays with Quisitive SecOps or the customer." })] }), _jsx("div", { className: `xdr-source-badge ${view.snapshot.source}`, children: view.snapshot.source === 'api' ? 'Backend connected' : 'Mock fallback' })] }), _jsxs("div", { className: "xdr-summary-grid", children: [_jsxs("div", { className: "xdr-summary-card blackpoint", children: [_jsx("div", { className: "xdr-summary-label", children: "Blackpoint-Handled Detections" }), _jsx("div", { className: "xdr-summary-value", children: view.summary.blackpointHandled }), _jsx("div", { className: "xdr-summary-note", children: "Open or resolved BP tickets in this tenant context" })] }), _jsxs("div", { className: "xdr-summary-card shared", children: [_jsx("div", { className: "xdr-summary-label", children: "Shared Investigations" }), _jsx("div", { className: "xdr-summary-value", children: view.summary.sharedInvestigations }), _jsx("div", { className: "xdr-summary-note", children: "Blackpoint triage plus follow-through from tenant teams" })] }), _jsxs("div", { className: "xdr-summary-card secops", children: [_jsx("div", { className: "xdr-summary-label", children: "Quisitive SecOps Queue" }), _jsx("div", { className: "xdr-summary-value", children: view.summary.secOpsQueue }), _jsx("div", { className: "xdr-summary-note", children: "Email, cloud app, and detection engineering work" })] }), _jsxs("div", { className: "xdr-summary-card customer", children: [_jsx("div", { className: "xdr-summary-label", children: "Customer Remediation Queue" }), _jsx("div", { className: "xdr-summary-value", children: view.summary.customerQueue }), _jsx("div", { className: "xdr-summary-note", children: "Hardening, patching, posture, and policy changes" })] })] }), _jsxs("div", { className: "xdr-meta-row", children: [_jsxs("span", { children: ["Generated: ", fmt(view.snapshot.generatedAt)] }), _jsxs("span", { children: ["Correlated with Blackpoint: ", view.summary.correlatedItems] }), _jsxs("span", { children: ["Critical uncovered gaps: ", view.summary.criticalGaps] })] }), _jsxs("div", { className: "xdr-sections-grid", children: [_jsxs("section", { className: "xdr-section", children: [_jsxs("div", { className: "xdr-section-header", children: [_jsx("h3", { children: "Blackpoint-Managed Detections" }), _jsx("span", { children: view.blackpointDetections.length })] }), view.blackpointDetections.length === 0 ? (_jsx("div", { className: "xdr-empty-box", children: "No Blackpoint detections loaded for this tenant." })) : (_jsx("div", { className: "xdr-list", children: view.blackpointDetections.map((detection) => (_jsxs("article", { className: "xdr-item blackpoint-item", children: [_jsxs("div", { className: "xdr-item-top", children: [_jsxs("div", { children: [_jsx("div", { className: "xdr-item-title", children: detection.title }), _jsxs("div", { className: "xdr-item-meta", children: [_jsxs("span", { children: ["Ticket: ", detection.ticketId || 'N/A'] }), _jsxs("span", { children: ["Created: ", fmt(detection.created)] })] })] }), _jsxs("div", { className: "xdr-item-badges", children: [_jsx("span", { className: `owner-badge ${ownerClass(detection.ownership)}`, children: detection.ownership }), _jsxs("span", { className: `severity-badge-xdr ${severityClass(detection.riskScore >= 80
                                                                ? 'critical'
                                                                : detection.riskScore >= 60
                                                                    ? 'high'
                                                                    : detection.riskScore >= 40
                                                                        ? 'medium'
                                                                        : 'low')}`, children: ["Risk ", detection.riskScore] })] })] }), _jsx("div", { className: "xdr-item-body", children: detection.correlationCount > 0
                                                ? `${detection.correlationCount} Defender XDR item(s) map back to this Blackpoint detection, so follow-on mitigation is shared.`
                                                : 'Blackpoint owns the frontline triage for this detection based on the current data.' })] }, detection.groupId))) }))] }), _jsxs("section", { className: "xdr-section", children: [_jsxs("div", { className: "xdr-section-header", children: [_jsx("h3", { children: "Defender XDR Triage Queue" }), _jsx("span", { children: queuedItems.length })] }), queuedItems.length === 0 ? (_jsx("div", { className: "xdr-empty-box", children: "No Defender XDR incidents loaded for this tenant." })) : (_jsx("div", { className: "xdr-list", children: queuedItems.map((item) => (_jsxs("article", { className: "xdr-item queue-item", children: [_jsxs("div", { className: "xdr-item-top", children: [_jsxs("div", { children: [_jsx("div", { className: "xdr-item-title", children: item.incident.title }), _jsxs("div", { className: "xdr-item-meta", children: [_jsx("span", { children: getServiceLabel(item.incident.serviceSource) }), _jsx("span", { children: fmt(item.incident.createdDate) }), item.correlatedTicketId && _jsxs("span", { children: ["BP Ticket: ", item.correlatedTicketId] })] })] }), _jsxs("div", { className: "xdr-item-badges", children: [_jsx("span", { className: `owner-badge ${ownerClass(item.owner)}`, children: formatOwnerLabel(item.owner) }), _jsx("span", { className: `coverage-badge ${item.blackpointCoverage}`, children: item.blackpointCoverage === 'covered'
                                                                ? 'Covered'
                                                                : item.blackpointCoverage === 'partial'
                                                                    ? 'Partial'
                                                                    : 'Gap' }), _jsx("span", { className: `severity-badge-xdr ${severityClass(item.incident.severity)}`, children: item.incident.severity })] })] }), _jsxs("div", { className: "xdr-item-body", children: [_jsx("p", { children: item.rationale }), _jsxs("p", { children: [_jsx("strong", { children: "Recommended action:" }), " ", item.incident.recommendedAction] })] })] }, item.incident.id))) }))] })] }), _jsxs("section", { className: "xdr-section recommendations-section", children: [_jsxs("div", { className: "xdr-section-header", children: [_jsx("h3", { children: "Recommended Next Actions" }), _jsx("span", { children: view.recommendations.length })] }), view.recommendations.length === 0 ? (_jsx("div", { className: "xdr-empty-box", children: "No additional actions identified." })) : (_jsx("ol", { className: "recommendation-list", children: view.recommendations.map((recommendation) => (_jsx("li", { children: recommendation }, recommendation))) }))] })] }));
};
export default TenantXdrOwnershipPanel;
//# sourceMappingURL=TenantXdrOwnershipPanel.js.map