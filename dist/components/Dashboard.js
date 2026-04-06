import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import './Dashboard.css';
import ClosedDetectionsViewer from './ClosedDetectionsViewer';
import DetectionReportingDashboard from './DetectionReportingDashboard';
// ---------------------------------------------------------------------------
// API helpers  (proxy in src/setupProxy.js routes /v1/* → blackpointcyber.com)
// ---------------------------------------------------------------------------
const API_KEY = process.env.REACT_APP_BLACKPOINT_API_KEY || '';
function apiHeaders(tenantId) {
    const h = { Authorization: `Bearer ${API_KEY}` };
    if (tenantId)
        h['x-tenant-id'] = tenantId;
    return h;
}
async function apiFetch(path, tenantId) {
    const res = await fetch(path, { headers: apiHeaders(tenantId) });
    if (!res.ok)
        throw new Error(`${res.status} ${res.statusText} — ${path}`);
    return res.json();
}
async function loadTenants() {
    const data = await apiFetch('/v1/tenants?pageSize=50');
    return data.data;
}
async function loadAlertGroupPreview(tenantId) {
    const qs = new URLSearchParams({
        take: '10',
        sortByColumn: 'created',
        sortDirection: 'DESC',
    });
    // Send OPEN status twice — repeated query param for array
    return apiFetch(`/v1/alert-groups?${qs}&status=OPEN`, tenantId);
}
async function loadAllAlertGroups(tenantId) {
    const all = [];
    let skip = 0;
    const take = 100;
    while (true) {
        const qs = new URLSearchParams({ take: String(take), skip: String(skip), sortByColumn: 'created', sortDirection: 'DESC' });
        const data = await apiFetch(`/v1/alert-groups?${qs}`, tenantId);
        all.push(...data.items);
        if (all.length >= data.total || data.items.length < take)
            break;
        skip += take;
    }
    return all;
}
async function loadAssetCount(tenantId, cls) {
    try {
        const data = await apiFetch(`/v1/assets?class[]=${cls}&pageSize=1`, tenantId);
        return data.meta?.totalItems ?? 0;
    }
    catch {
        return 0;
    }
}
// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------
function riskToSeverity(score) {
    if (score >= 80)
        return 'critical';
    if (score >= 60)
        return 'high';
    if (score >= 40)
        return 'medium';
    return 'low';
}
function getAlertAge(iso) {
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    const text = days > 0 ? `${days}d ${hours % 24}h` : hours > 0 ? `${hours}h` : `${mins}m`;
    const ageCategory = hours >= 72 ? 'overdue' : hours >= 24 ? 'delayed' : hours >= 4 ? 'warning' : 'good';
    return { hours, text, ageCategory };
}
function priorityScore(openGroups) {
    return openGroups.reduce((sum, ag) => {
        const { hours } = getAlertAge(ag.created);
        const sev = riskToSeverity(ag.riskScore);
        const m = sev === 'critical' ? 4 : sev === 'high' ? 3 : sev === 'medium' ? 2 : 1;
        return sum + (hours + 1) * m;
    }, 0);
}
function fmt(iso) {
    if (!iso)
        return '—';
    return new Date(iso).toLocaleString();
}
function fmtDate(iso) {
    if (!iso)
        return '—';
    return new Date(iso).toLocaleDateString();
}
const TenantDetailPage = ({ tenant, onBack }) => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(null);
    const [activeTab, setActiveTab] = useState('open');
    const [closedDetections, setClosedDetections] = useState([]);
    const [closedLoading, setClosedLoading] = useState(false);
    const [closedError, setClosedError] = useState(null);
    const [reportData, setReportData] = useState(null);
    const [reportLoading, setReportLoading] = useState(false);
    const [reportError, setReportError] = useState(null);
    useEffect(() => {
        setLoading(true);
        loadAllAlertGroups(tenant.id)
            .then(setGroups)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [tenant.id]);
    // Fetch closed detections when 'closed' tab is opened
    useEffect(() => {
        if (activeTab === 'closed' && closedDetections.length === 0) {
            setClosedLoading(true);
            (async () => {
                try {
                    const all = [];
                    const take = 100;
                    for (let skip = 0;; skip += take) {
                        const qs = new URLSearchParams({
                            take: String(take),
                            skip: String(skip),
                            status: 'RESOLVED',
                            sortByColumn: 'created',
                            sortDirection: 'DESC'
                        });
                        const data = await apiFetch(`/v1/alert-groups?${qs}`, tenant.id);
                        all.push(...data.items);
                        if (data.items.length < take)
                            break;
                    }
                    setClosedDetections(all);
                }
                catch (err) {
                    setClosedError(err instanceof Error ? err.message : 'Unknown error');
                }
                finally {
                    setClosedLoading(false);
                }
            })();
        }
    }, [activeTab, tenant.id, closedDetections.length]);
    // Generate report data when 'report' tab is opened
    useEffect(() => {
        if (activeTab === 'report' && !reportData) {
            setReportLoading(true);
            (async () => {
                try {
                    const all = [];
                    const take = 100;
                    for (let skip = 0;; skip += take) {
                        const qs = new URLSearchParams({
                            take: String(take),
                            skip: String(skip),
                            sortByColumn: 'created',
                            sortDirection: 'DESC'
                        });
                        const data = await apiFetch(`/v1/alert-groups?${qs}`, tenant.id);
                        all.push(...data.items);
                        if (data.items.length < take)
                            break;
                    }
                    const openGroups = all.filter(g => g.status === 'OPEN');
                    const resolvedGroups = all.filter(g => g.status === 'RESOLVED');
                    const riskScores = all.map(g => g.riskScore);
                    // Calculate risk distribution
                    const distribution = [
                        { range: '0-20', count: all.filter(g => g.riskScore >= 0 && g.riskScore <= 20).length },
                        { range: '21-40', count: all.filter(g => g.riskScore >= 21 && g.riskScore <= 40).length },
                        { range: '41-60', count: all.filter(g => g.riskScore >= 41 && g.riskScore <= 60).length },
                        { range: '61-80', count: all.filter(g => g.riskScore >= 61 && g.riskScore <= 80).length },
                        { range: '81-100', count: all.filter(g => g.riskScore >= 81 && g.riskScore <= 100).length }
                    ];
                    // Calculate top alert types
                    const typeCounts = {};
                    all.forEach(g => {
                        g.alertTypes.forEach(t => {
                            typeCounts[t] = (typeCounts[t] || 0) + 1;
                        });
                    });
                    const topAlertTypes = Object.entries(typeCounts)
                        .map(([type, count]) => ({ type, count }))
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 10);
                    // Get recent closed detections
                    const recentClosed = all
                        .filter(g => g.status === 'RESOLVED')
                        .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
                        .slice(0, 20);
                    setReportData({
                        tenantName: tenant.name,
                        stats: {
                            totalDetections: all.length,
                            openDetections: openGroups.length,
                            resolvedDetections: resolvedGroups.length,
                            averageRiskScore: riskScores.length > 0 ? riskScores.reduce((a, b) => a + b, 0) / riskScores.length : 0,
                            maxRiskScore: riskScores.length > 0 ? Math.max(...riskScores) : 0,
                            minRiskScore: riskScores.length > 0 ? Math.min(...riskScores) : 0
                        },
                        topAlertTypes,
                        riskScoreDistribution: distribution,
                        recentClosed,
                        reportGeneratedAt: new Date().toISOString()
                    });
                }
                catch (err) {
                    setReportError(err instanceof Error ? err.message : 'Unknown error');
                }
                finally {
                    setReportLoading(false);
                }
            })();
        }
    }, [activeTab, tenant.id, reportData]);
    const openGroups = groups.filter(g => g.status === 'OPEN');
    const resolvedGroups = groups.filter(g => g.status === 'RESOLVED');
    const criticalGroups = groups.filter(g => riskToSeverity(g.riskScore) === 'critical');
    return (_jsx("div", { className: "detail-container", children: _jsxs("div", { className: "detail-content", children: [_jsx("button", { onClick: onBack, className: "btn-primary btn-back", children: "\u2190 Back to Dashboard" }), _jsxs("div", { className: "detail-header-card", children: [_jsxs("div", { className: "card-header", children: [_jsx("div", { className: "tenant-avatar large", children: tenant.name.substring(0, 2) }), _jsxs("div", { children: [_jsx("h1", { className: "detail-title", children: tenant.name }), tenant.domain && _jsx("p", { className: "detail-subtitle", children: tenant.domain }), _jsxs("div", { className: "meta-grid", children: [_jsxs("div", { className: "meta-item", children: [_jsx("span", { className: "meta-label", children: "Tenant ID" }), _jsx("div", { className: "meta-value mono", children: tenant.id })] }), _jsxs("div", { className: "meta-item", children: [_jsx("span", { className: "meta-label", children: "Status" }), _jsx("div", { className: "meta-value green", children: tenant.status })] }), _jsxs("div", { className: "meta-item", children: [_jsx("span", { className: "meta-label", children: "Created" }), _jsx("div", { className: "meta-value", children: fmtDate(tenant.created) })] }), _jsxs("div", { className: "meta-item", children: [_jsx("span", { className: "meta-label", children: "Email Delivery" }), _jsx("div", { className: `meta-value ${tenant.enableDeliveryEmail ? 'green' : 'red'}`, children: tenant.enableDeliveryEmail ? '✓ Enabled' : '✗ Disabled' })] }), tenant.industryType && (_jsxs("div", { className: "meta-item", children: [_jsx("span", { className: "meta-label", children: "Industry" }), _jsx("div", { className: "meta-value", children: tenant.industryType })] }))] })] })] }), _jsxs("div", { className: "metrics-grid", children: [_jsxs("div", { className: "metric-item", children: [_jsx("div", { className: "metric-value blue", children: groups.length }), _jsx("div", { className: "metric-label", children: "Total Groups" })] }), _jsxs("div", { className: "metric-item", children: [_jsx("div", { className: "metric-value red", children: openGroups.length }), _jsx("div", { className: "metric-label", children: "Open" })] }), _jsxs("div", { className: "metric-item", children: [_jsx("div", { className: "metric-value critical", children: criticalGroups.length }), _jsx("div", { className: "metric-label", children: "Critical Risk" })] }), _jsxs("div", { className: "metric-item", children: [_jsx("div", { className: "metric-value green", children: resolvedGroups.length }), _jsx("div", { className: "metric-label", children: "Resolved" })] })] })] }), loading && _jsx("div", { className: "loading-state", children: "Loading alert groups\u2026" }), error && _jsxs("div", { className: "error-message", children: ["\u26A0 ", error] }), !loading && !error && (_jsxs("div", { children: [_jsxs("div", { className: "tab-navigation", children: [_jsxs("button", { className: `tab-button ${activeTab === 'open' ? 'active' : ''}`, onClick: () => setActiveTab('open'), children: ["\uD83D\uDCCB Open Detections (", groups.filter(g => g.status === 'OPEN').length, ")"] }), _jsxs("button", { className: `tab-button ${activeTab === 'closed' ? 'active' : ''}`, onClick: () => setActiveTab('closed'), children: ["\u2713 Closed Detections (", groups.filter(g => g.status === 'RESOLVED').length, ")"] }), _jsx("button", { className: `tab-button ${activeTab === 'report' ? 'active' : ''}`, onClick: () => setActiveTab('report'), children: "\uD83D\uDCCA Detection Report" })] }), activeTab === 'open' && (_jsxs("div", { children: [_jsxs("h2", { className: "section-title large", children: ["Detection Groups (", groups.length, ")"] }), groups.length === 0 ? (_jsx("div", { className: "empty-state", children: "No detection groups for this tenant" })) : (_jsx("div", { className: "alerts-list", children: groups.map(group => {
                                        const severity = riskToSeverity(group.riskScore);
                                        const age = getAlertAge(group.created);
                                        const isOpen = group.status === 'OPEN';
                                        return (_jsx("div", { onClick: () => setExpanded(expanded === group.id ? null : group.id), className: "alert-card", "data-severity": severity, children: _jsxs("div", { className: "alert-card-header", children: [_jsxs("div", { className: "alert-card-content", children: [_jsxs("div", { className: "alert-title-row", "data-severity": severity, "data-status": isOpen ? 'open' : 'resolved', children: [_jsx("div", { className: "severity-dot" }), _jsx("span", { className: "alert-title", children: group.alertTypes.length > 0
                                                                            ? group.alertTypes.join(', ')
                                                                            : group.groupKey }), _jsx("span", { className: "status-badge", children: group.status }), _jsxs("span", { className: "risk-badge", children: ["Risk: ", group.riskScore, "/100"] })] }), _jsxs("div", { className: "alert-meta", children: [fmt(group.created), " \u2022 ", group.alertCount, " alert", group.alertCount !== 1 ? 's' : '', " \u2022 Age:", ' ', age.text] }), expanded === group.id && (_jsxs("div", { className: "alert-expanded", onClick: e => e.stopPropagation(), children: [_jsxs("div", { className: "alert-section", children: [_jsx("div", { className: "alert-section-title", children: "DETECTION DETAILS" }), _jsxs("div", { className: "detail-list", children: [_jsxs("div", { children: [_jsx("span", { className: "label", children: "Group ID:" }), " ", _jsx("span", { className: "value-mono blue", children: group.id })] }), _jsxs("div", { children: [_jsx("span", { className: "label", children: "Group Key:" }), " ", _jsx("span", { className: "value-mono", children: group.groupKey })] }), _jsxs("div", { children: [_jsx("span", { className: "label", children: "Ticket ID:" }), " ", _jsx("span", { className: "value-mono orange", children: group.ticketId || '—' })] }), _jsxs("div", { children: [_jsx("span", { className: "label", children: "Alert Count:" }), " ", group.alertCount] }), _jsxs("div", { children: [_jsx("span", { className: "label", children: "Risk Score:" }), _jsx("span", { style: { marginLeft: 8 }, children: _jsxs("span", { className: `severity-badge ${severity}`, children: [severity.toUpperCase(), " (", group.riskScore, ")"] }) })] }), _jsxs("div", { children: [_jsx("span", { className: "label", children: "Created:" }), " ", fmt(group.created)] }), group.updated && _jsxs("div", { children: [_jsx("span", { className: "label", children: "Updated:" }), " ", fmt(group.updated)] })] }), _jsxs("div", { style: { marginTop: 12 }, children: [_jsx("div", { style: { fontSize: 11, color: '#94a3b8', marginBottom: 4 }, children: "RISK SCORE" }), _jsx("div", { className: "score-bar", style: { height: 10 }, children: _jsx("div", { className: `score-fill ${severity}`, style: { width: `${group.riskScore}%` } }) })] })] }), group.alertTypes.length > 0 && (_jsxs("div", { className: "alert-section", children: [_jsxs("div", { className: "alert-section-title", children: [_jsx("span", { className: "section-icon", children: "\uD83C\uDFAF" }), " ALERT TYPES"] }), _jsx("div", { className: "ioc-tags", children: group.alertTypes.map((t, i) => (_jsx("span", { className: "ioc-tag", children: t }, i))) })] })), group.alert && Object.keys(group.alert).length > 0 && (_jsxs("div", { className: "alert-section", children: [_jsxs("div", { className: "alert-section-title", children: [_jsx("span", { className: "section-icon", children: "\uD83D\uDDA5\uFE0F" }), " DETECTION DATA"] }), _jsx("div", { className: "detail-list", children: Object.entries(group.alert)
                                                                                    .filter(([, v]) => v !== null && v !== undefined && v !== '')
                                                                                    .map(([k, v]) => (_jsxs("div", { children: [_jsxs("span", { className: "label", children: [k, ":"] }), ' ', _jsx("span", { className: "value-mono", children: typeof v === 'object' ? JSON.stringify(v) : String(v) })] }, k))) })] })), group.ticket && Object.keys(group.ticket).length > 0 && (_jsxs("div", { className: "alert-section", children: [_jsxs("div", { className: "alert-section-title", children: [_jsx("span", { className: "section-icon", children: "\uD83C\uDFAB" }), " TICKET"] }), _jsx("div", { className: "detail-list", children: Object.entries(group.ticket)
                                                                                    .filter(([, v]) => v !== null && v !== undefined && v !== '')
                                                                                    .map(([k, v]) => (_jsxs("div", { children: [_jsxs("span", { className: "label", children: [k, ":"] }), ' ', _jsx("span", { className: "value-mono", children: typeof v === 'object' ? JSON.stringify(v) : String(v) })] }, k))) })] }))] }))] }), _jsx("span", { className: "alert-expand-icon", children: expanded === group.id ? '▼' : '▶' })] }) }, group.id));
                                    }) }))] })), activeTab === 'closed' && (_jsxs("div", { children: [_jsxs("h2", { className: "section-title large", children: ["Closed Detections (", closedDetections.length, ")"] }), _jsx(ClosedDetectionsViewer, { detections: closedDetections.map(g => ({
                                        id: g.id,
                                        tenantId: g.customerId,
                                        groupKey: g.groupKey,
                                        status: 'RESOLVED',
                                        alertCount: g.alertCount,
                                        riskScore: g.riskScore,
                                        alertTypes: g.alertTypes,
                                        createdDate: g.created,
                                        resolvedDate: g.updated || undefined,
                                        daysOpen: g.updated ? Math.ceil((new Date(g.updated).getTime() - new Date(g.created).getTime()) / (1000 * 60 * 60 * 24)) : undefined,
                                        ticketId: g.ticketId
                                    })), isLoading: closedLoading, error: closedError })] })), activeTab === 'report' && (_jsx("div", { children: reportData ? (_jsx(DetectionReportingDashboard, { tenantName: reportData.tenantName, stats: reportData.stats, topAlertTypes: reportData.topAlertTypes, riskScoreDistribution: reportData.riskScoreDistribution, recentClosed: reportData.recentClosed, reportGeneratedAt: reportData.reportGeneratedAt, isLoading: reportLoading })) : (_jsx("div", { children: reportLoading ? 'Loading report...' : reportError ? `Error: ${reportError}` : 'No report data' })) }))] }))] }) }));
};
const DetectionsView = ({ tenants, tenantData }) => {
    const [selectedTenantId, setSelectedTenantId] = useState('all');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [severityFilter, setSeverityFilter] = useState('ALL');
    const [searchText, setSearchText] = useState('');
    const [tenantGroups, setTenantGroups] = useState([]);
    const [tenantLoading, setTenantLoading] = useState(false);
    const [tenantError, setTenantError] = useState(null);
    const [expanded, setExpanded] = useState(null);
    const [sortCol, setSortCol] = useState('created');
    const [sortDir, setSortDir] = useState('desc');
    useEffect(() => {
        if (selectedTenantId === 'all') {
            setTenantGroups([]);
            return;
        }
        setTenantLoading(true);
        setTenantError(null);
        setExpanded(null);
        loadAllAlertGroups(selectedTenantId)
            .then(setTenantGroups)
            .catch((e) => setTenantError(e.message))
            .finally(() => setTenantLoading(false));
    }, [selectedTenantId]);
    let groups;
    if (selectedTenantId === 'all') {
        groups = [];
        for (const [tid, data] of tenantData) {
            const ten = tenants.find(t => t.id === tid);
            data.openGroups.forEach(g => groups.push({ ...g, tenantName: ten?.name ?? tid }));
        }
    }
    else {
        const ten = tenants.find(t => t.id === selectedTenantId);
        groups = tenantGroups.map(g => ({ ...g, tenantName: ten?.name ?? selectedTenantId }));
    }
    if (statusFilter !== 'ALL')
        groups = groups.filter(g => g.status === statusFilter);
    if (severityFilter !== 'ALL')
        groups = groups.filter(g => riskToSeverity(g.riskScore) === severityFilter);
    if (searchText.trim()) {
        const q = searchText.toLowerCase();
        groups = groups.filter(g => g.alertTypes.some(t => t.toLowerCase().includes(q)) ||
            g.groupKey.toLowerCase().includes(q) ||
            g.tenantName.toLowerCase().includes(q));
    }
    const sorted = [...groups].sort((a, b) => {
        let cmp = 0;
        if (sortCol === 'created')
            cmp = new Date(a.created).getTime() - new Date(b.created).getTime();
        else if (sortCol === 'riskScore')
            cmp = a.riskScore - b.riskScore;
        else
            cmp = a.alertCount - b.alertCount;
        return sortDir === 'desc' ? -cmp : cmp;
    });
    function toggleSort(col) {
        if (sortCol === col)
            setSortDir(d => (d === 'desc' ? 'asc' : 'desc'));
        else {
            setSortCol(col);
            setSortDir('desc');
        }
    }
    const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 };
    groups.forEach(g => { severityCounts[riskToSeverity(g.riskScore)]++; });
    return (_jsxs("div", { children: [_jsx("div", { className: "severity-summary", children: ['critical', 'high', 'medium', 'low'].map(sev => (_jsxs("button", { className: `sev-pill ${sev}${severityFilter === sev ? ' active' : ''}`, onClick: () => setSeverityFilter(severityFilter === sev ? 'ALL' : sev), children: [_jsx("span", { className: "sev-count", children: severityCounts[sev] }), _jsx("span", { className: "sev-label", children: sev })] }, sev))) }), _jsxs("div", { className: "filter-bar", children: [_jsxs("select", { value: selectedTenantId, onChange: e => { setSelectedTenantId(e.target.value); setExpanded(null); }, className: "filter-select", children: [_jsx("option", { value: "all", children: "All Tenants (open preview)" }), tenants.map(t => _jsx("option", { value: t.id, children: t.name }, t.id))] }), _jsxs("select", { value: statusFilter, onChange: e => setStatusFilter(e.target.value), className: "filter-select", children: [_jsx("option", { value: "ALL", children: "All Statuses" }), _jsx("option", { value: "OPEN", children: "Open" }), _jsx("option", { value: "RESOLVED", children: "Resolved" })] }), _jsx("input", { className: "filter-input", type: "text", placeholder: "Search alert types, tenants\u2026", value: searchText, onChange: e => setSearchText(e.target.value) }), searchText && (_jsx("button", { className: "filter-clear", onClick: () => setSearchText(''), children: "\u2715" }))] }), _jsxs("div", { className: "detections-header", children: [_jsxs("span", { className: "detections-count", children: [sorted.length, " detection ", sorted.length === 1 ? 'group' : 'groups', selectedTenantId === 'all' && (_jsx("span", { className: "preview-note", children: " \u2014 open preview only; select a tenant to load full history" }))] }), _jsxs("div", { className: "sort-controls", children: [_jsx("span", { children: "Sort:" }), ['created', 'riskScore', 'alertCount'].map(col => (_jsxs("button", { className: `sort-btn${sortCol === col ? ' active' : ''}`, onClick: () => toggleSort(col), children: [col === 'created' ? 'Date' : col === 'riskScore' ? 'Risk' : 'Alerts', sortCol === col && _jsx("span", { children: sortDir === 'desc' ? ' ↓' : ' ↑' })] }, col)))] })] }), tenantLoading && _jsx("div", { className: "loading-state", children: "Loading detection groups\u2026" }), tenantError && _jsxs("div", { className: "error-message", children: ["\u26A0 ", tenantError] }), sorted.length === 0 && !tenantLoading && (_jsx("div", { className: "empty-state", children: "No detection groups match the current filters." })), _jsx("div", { className: "detections-list", children: sorted.map(group => {
                    const severity = riskToSeverity(group.riskScore);
                    const age = getAlertAge(group.created);
                    const isOpen = group.status === 'OPEN';
                    const isExpanded = expanded === group.id;
                    return (_jsxs("div", { className: `detection-row${isExpanded ? ' expanded' : ''}`, "data-severity": severity, onClick: () => setExpanded(isExpanded ? null : group.id), children: [_jsxs("div", { className: "detection-row-main", children: [_jsx("div", { className: "severity-indicator", "data-severity": severity }), _jsxs("div", { className: "detection-info", children: [_jsx("div", { className: "detection-title", children: group.alertTypes.length > 0 ? group.alertTypes.join(', ') : group.groupKey }), _jsxs("div", { className: "detection-meta", children: [_jsx("span", { className: "tenant-tag", children: group.tenantName }), _jsx("span", { className: "meta-sep", children: "\u2022" }), _jsx("span", { children: fmt(group.created) }), _jsx("span", { className: "meta-sep", children: "\u2022" }), _jsxs("span", { children: [group.alertCount, " alert", group.alertCount !== 1 ? 's' : ''] })] })] }), _jsxs("div", { className: "detection-badges", children: [_jsx("span", { className: `severity-badge ${severity}`, children: severity }), _jsx("span", { className: `status-pill ${isOpen ? 'open' : 'resolved'}`, children: group.status }), _jsx("span", { className: "age-chip", "data-age": age.ageCategory, children: age.text }), _jsxs("span", { className: "risk-chip", children: ["\u26A1 ", group.riskScore] })] }), _jsx("span", { className: "expand-arrow", children: isExpanded ? '▼' : '▶' })] }), isExpanded && (_jsx("div", { className: "detection-expanded", onClick: e => e.stopPropagation(), children: _jsxs("div", { className: "expanded-cols", children: [_jsxs("div", { className: "expanded-col", children: [_jsx("div", { className: "exp-section-title", children: "DETECTION DETAILS" }), _jsxs("div", { className: "exp-row", children: [_jsx("span", { className: "exp-label", children: "Group ID" }), _jsx("span", { className: "exp-value mono blue", children: group.id })] }), _jsxs("div", { className: "exp-row", children: [_jsx("span", { className: "exp-label", children: "Group Key" }), _jsx("span", { className: "exp-value mono", children: group.groupKey })] }), _jsxs("div", { className: "exp-row", children: [_jsx("span", { className: "exp-label", children: "Ticket ID" }), _jsx("span", { className: "exp-value mono orange", children: group.ticketId || '—' })] }), _jsxs("div", { className: "exp-row", children: [_jsx("span", { className: "exp-label", children: "Alert Count" }), _jsx("span", { className: "exp-value", children: group.alertCount })] }), _jsxs("div", { className: "exp-row", children: [_jsx("span", { className: "exp-label", children: "Tenant" }), _jsx("span", { className: "exp-value", children: group.tenantName })] }), _jsxs("div", { className: "exp-row", children: [_jsx("span", { className: "exp-label", children: "Created" }), _jsx("span", { className: "exp-value", children: fmt(group.created) })] }), group.updated && (_jsxs("div", { className: "exp-row", children: [_jsx("span", { className: "exp-label", children: "Updated" }), _jsx("span", { className: "exp-value", children: fmt(group.updated) })] }))] }), _jsxs("div", { className: "expanded-col", children: [_jsx("div", { className: "exp-section-title", children: "RISK SCORE" }), _jsxs("div", { className: "risk-score-display", children: [_jsx("span", { className: `severity-badge ${severity}`, children: severity.toUpperCase() }), _jsxs("span", { className: "risk-number", children: [group.riskScore, "/100"] })] }), _jsx("div", { className: "score-bar-lg", children: _jsx("div", { className: `score-fill ${severity}`, style: { width: `${group.riskScore}%` } }) }), group.alertTypes.length > 0 && (_jsxs(_Fragment, { children: [_jsx("div", { className: "exp-section-title", style: { marginTop: 16 }, children: "ALERT TYPES" }), _jsx("div", { className: "ioc-tags", children: group.alertTypes.map((t, i) => (_jsx("span", { className: "ioc-tag", children: t }, i))) })] }))] }), group.alert && Object.keys(group.alert).length > 0 && (_jsxs("div", { className: "expanded-col", children: [_jsx("div", { className: "exp-section-title", children: "\uD83D\uDDA5\uFE0F DETECTION DATA" }), Object.entries(group.alert)
                                                    .filter(([, v]) => v !== null && v !== undefined && v !== '')
                                                    .map(([k, v]) => (_jsxs("div", { className: "exp-row", children: [_jsx("span", { className: "exp-label", children: k }), _jsx("span", { className: "exp-value mono", children: typeof v === 'object' ? JSON.stringify(v) : String(v) })] }, k)))] }))] }) }))] }, group.id));
                }) })] }));
};
// ---------------------------------------------------------------------------
// Main Dashboard
// ---------------------------------------------------------------------------
const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedTenant, setSelectedTenant] = useState(null);
    const [tenants, setTenants] = useState([]);
    const [tenantData, setTenantData] = useState(new Map());
    const [assetData, setAssetData] = useState(new Map());
    const [tenantsLoading, setTenantsLoading] = useState(true);
    const [tenantsError, setTenantsError] = useState(null);
    const assetsLoadedRef = useRef(false);
    const noApiKey = !API_KEY;
    // Load tenants + alert previews on mount
    useEffect(() => {
        if (noApiKey)
            return;
        loadTenants()
            .then(list => {
            setTenants(list);
            // Kick off alert group previews for each tenant
            list.forEach(t => {
                setTenantData(prev => {
                    const next = new Map(prev);
                    next.set(t.id, { tenant: t, openGroups: [], totalOpen: 0, loading: true, error: null });
                    return next;
                });
                loadAlertGroupPreview(t.id)
                    .then(resp => {
                    setTenantData(prev => {
                        const next = new Map(prev);
                        next.set(t.id, {
                            tenant: t,
                            openGroups: resp.items,
                            totalOpen: resp.total,
                            loading: false,
                            error: null,
                        });
                        return next;
                    });
                })
                    .catch((e) => {
                    setTenantData(prev => {
                        const next = new Map(prev);
                        next.set(t.id, { tenant: t, openGroups: [], totalOpen: 0, loading: false, error: e.message });
                        return next;
                    });
                });
            });
        })
            .catch((e) => setTenantsError(e.message))
            .finally(() => setTenantsLoading(false));
    }, [noApiKey]);
    // Lazy-load asset counts when Tenants tab is first opened
    useEffect(() => {
        if (activeTab !== 'tenants' || assetsLoadedRef.current || tenants.length === 0)
            return;
        assetsLoadedRef.current = true;
        tenants.forEach(t => {
            setAssetData(prev => {
                const next = new Map(prev);
                next.set(t.id, { devices: 0, users: 0, loading: true });
                return next;
            });
            Promise.all([loadAssetCount(t.id, 'DEVICE'), loadAssetCount(t.id, 'USER')])
                .then(([devices, users]) => {
                setAssetData(prev => {
                    const next = new Map(prev);
                    next.set(t.id, { devices, users, loading: false });
                    return next;
                });
            })
                .catch(() => {
                setAssetData(prev => {
                    const next = new Map(prev);
                    next.set(t.id, { devices: 0, users: 0, loading: false });
                    return next;
                });
            });
        });
    }, [activeTab, tenants]);
    if (selectedTenant) {
        return _jsx(TenantDetailPage, { tenant: selectedTenant, onBack: () => setSelectedTenant(null) });
    }
    // Computed values for KPI strip
    const allTenantData = Array.from(tenantData.values());
    const totalTenants = tenants.length;
    const totalOpen = allTenantData.reduce((s, d) => s + d.totalOpen, 0);
    const criticalCount = allTenantData.reduce((s, d) => s + d.openGroups.filter(g => riskToSeverity(g.riskScore) === 'critical').length, 0);
    const allOpenGroups = allTenantData.flatMap(d => d.openGroups);
    const oldestGroup = allOpenGroups.length
        ? allOpenGroups.reduce((oldest, g) => new Date(g.created) < new Date(oldest.created) ? g : oldest)
        : null;
    const oldestAge = oldestGroup ? getAlertAge(oldestGroup.created) : null;
    const oldestTenant = oldestGroup ? tenants.find(t => t.id === oldestGroup.customerId) : null;
    const sortedTenants = [...tenants].sort((a, b) => {
        const aData = tenantData.get(a.id);
        const bData = tenantData.get(b.id);
        return priorityScore(bData?.openGroups ?? []) - priorityScore(aData?.openGroups ?? []);
    });
    return (_jsxs("div", { className: "dashboard-container", children: [_jsx("div", { className: "dashboard-header", children: _jsxs("div", { className: "dashboard-header-content", children: [_jsxs("div", { className: "header-top", children: [_jsx("h1", { className: "dashboard-title", children: "\uD83D\uDEE1\uFE0F Blackpoint SOC Monitor" }), _jsx("span", { className: `header-status ${tenantsLoading ? 'loading' : tenantsError ? 'error' : 'ok'}`, children: tenantsLoading ? 'Connecting…' : tenantsError ? '⚠ API Error' : '● Live' })] }), noApiKey && (_jsxs("div", { className: "error-message", style: { marginTop: 12 }, children: ["\u26A0 No API key found. Add ", _jsx("code", { children: "REACT_APP_BLACKPOINT_API_KEY" }), " to a", ' ', _jsx("code", { children: ".env" }), " file and restart the dev server."] })), _jsx("nav", { className: "tab-nav", children: [
                                { id: 'overview', label: '📊 Overview' },
                                { id: 'detections', label: '🚨 Detections' },
                                { id: 'tenants', label: '🏢 Tenants' },
                            ].map(tab => (_jsx("button", { className: `tab-btn${activeTab === tab.id ? ' active' : ''}`, onClick: () => setActiveTab(tab.id), children: tab.label }, tab.id))) })] }) }), _jsxs("div", { className: "dashboard-content", children: [activeTab === 'overview' && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "kpi-grid", children: [_jsxs("div", { className: "kpi-card", children: [_jsx("div", { className: "kpi-label", children: "Monitored Tenants" }), _jsx("div", { className: "kpi-value green", children: tenantsLoading ? '…' : totalTenants })] }), _jsxs("div", { className: "kpi-card", children: [_jsx("div", { className: "kpi-label", children: "Open Detections" }), _jsx("div", { className: "kpi-value orange", children: totalOpen })] }), _jsxs("div", { className: "kpi-card", children: [_jsx("div", { className: "kpi-label", children: "Critical Risk" }), _jsx("div", { className: "kpi-value red", children: criticalCount })] }), _jsxs("div", { className: `kpi-card ${oldestAge && oldestAge.hours >= 24 ? 'highlight' : ''}`, children: [_jsx("div", { className: "kpi-label", children: "Oldest Open (preview)" }), _jsx("div", { className: "kpi-value", "data-age": oldestAge?.ageCategory || 'good', children: oldestAge ? oldestAge.text : '—' }), oldestTenant && _jsx("div", { className: "kpi-subtitle", children: oldestTenant.name })] })] }), tenantsLoading && _jsx("div", { className: "loading-state", children: "Loading tenants\u2026" }), tenantsError && _jsxs("div", { className: "error-message", children: ["\u26A0 ", tenantsError] }), sortedTenants.some(t => (tenantData.get(t.id)?.totalOpen ?? 0) > 0) && (_jsxs("div", { className: "priority-section", children: [_jsxs("h2", { className: "section-title", children: ["\uD83D\uDEA8 Remediation Priority Queue", _jsx("span", { className: "section-subtitle", children: "(sorted by urgency)" })] }), _jsx("div", { className: "table-container", children: _jsxs("table", { className: "priority-table", children: [_jsx("thead", { children: _jsxs("tr", { className: "table-header-row", children: [_jsx("th", { className: "table-header", children: "PRIORITY" }), _jsx("th", { className: "table-header", children: "CLIENT" }), _jsx("th", { className: "table-header", children: "OLDEST (PREVIEW)" }), _jsx("th", { className: "table-header", children: "SEVERITY" }), _jsx("th", { className: "table-header", children: "OPEN DETECTIONS" }), _jsx("th", { className: "table-header", children: "PRIORITY SCORE" }), _jsx("th", { className: "table-header text-right", children: "ACTION" })] }) }), _jsx("tbody", { children: sortedTenants.map((tenant, index) => {
                                                        const data = tenantData.get(tenant.id);
                                                        const open = data?.totalOpen ?? 0;
                                                        if (open === 0)
                                                            return null;
                                                        const openGroups = data?.openGroups ?? [];
                                                        const oldest = openGroups.length
                                                            ? openGroups.reduce((o, g) => new Date(g.created) < new Date(o.created) ? g : o)
                                                            : null;
                                                        const age = oldest ? getAlertAge(oldest.created) : null;
                                                        const topSeverity = oldest ? riskToSeverity(oldest.riskScore) : 'low';
                                                        const score = priorityScore(openGroups);
                                                        const criticalCnt = openGroups.filter(g => riskToSeverity(g.riskScore) === 'critical').length;
                                                        return (_jsxs("tr", { className: `table-row ${index === 0 ? 'top-priority' : ''}`, onClick: () => setSelectedTenant(tenant), children: [_jsx("td", { className: "table-cell", children: _jsx("div", { className: `priority-badge ${index === 0 ? 'first' : index === 1 ? 'second' : 'default'}`, children: index + 1 }) }), _jsxs("td", { className: "table-cell", children: [_jsx("div", { className: "client-name", children: tenant.name }), tenant.domain && _jsx("div", { className: "client-domain", children: tenant.domain })] }), _jsx("td", { className: "table-cell", "data-age": age?.ageCategory, children: age ? (_jsxs("div", { className: "age-display", children: [_jsx("span", { className: "age-value", children: age.text }), age.hours >= 24 && _jsx("span", { className: "overdue-badge", children: "OVERDUE" })] })) : data?.loading ? '…' : '—' }), _jsx("td", { className: "table-cell", children: oldest && (_jsx("span", { className: `severity-badge ${topSeverity}`, children: topSeverity })) }), _jsx("td", { className: "table-cell", children: _jsxs("div", { className: "alerts-count", children: [_jsx("span", { className: "count-value", children: open }), criticalCnt > 0 && (_jsxs("span", { className: "critical-note", children: ["(", criticalCnt, " critical)"] }))] }) }), _jsx("td", { className: "table-cell", children: _jsxs("div", { className: "score-display", children: [_jsx("div", { className: "score-bar", children: _jsx("div", { className: `score-fill ${score > 300 ? 'critical' : score > 150 ? 'high' : 'medium'}`, style: { width: `${Math.min(100, score / 5)}%` } }) }), _jsx("span", { className: "score-value", children: score })] }) }), _jsx("td", { className: "table-cell text-right", children: _jsx("button", { onClick: e => { e.stopPropagation(); setSelectedTenant(tenant); }, className: "btn-primary", children: "Investigate \u2192" }) })] }, tenant.id));
                                                    }) })] }) })] })), !tenantsLoading && totalOpen === 0 && tenants.length > 0 && (_jsx("div", { className: "empty-state large", children: "\u2713 No open detections across all tenants" }))] })), activeTab === 'detections' && (_jsxs(_Fragment, { children: [_jsx("h2", { className: "section-title large", children: "\uD83D\uDEA8 Detection Groups" }), _jsx(DetectionsView, { tenants: tenants, tenantData: tenantData })] })), activeTab === 'tenants' && (_jsxs(_Fragment, { children: [_jsx("h2", { className: "section-title large", children: "\uD83C\uDFE2 Monitored Tenants" }), tenantsLoading && _jsx("div", { className: "loading-state", children: "Loading tenants\u2026" }), tenantsError && _jsxs("div", { className: "error-message", children: ["\u26A0 ", tenantsError] }), !tenantsLoading && tenants.length > 0 && (_jsx("div", { className: "tenant-grid", children: tenants.map(tenant => {
                                    const data = tenantData.get(tenant.id);
                                    const assets = assetData.get(tenant.id);
                                    const openGroups = data?.openGroups ?? [];
                                    const tenantTotalOpen = data?.totalOpen ?? 0;
                                    const criticalGroups = openGroups.filter(g => riskToSeverity(g.riskScore) === 'critical');
                                    const oldest = openGroups.length
                                        ? openGroups.reduce((o, g) => new Date(g.created) < new Date(o.created) ? g : o)
                                        : null;
                                    const oldestAge = oldest ? getAlertAge(oldest.created) : null;
                                    return (_jsxs("div", { onClick: () => setSelectedTenant(tenant), className: `tenant-card ${criticalGroups.length > 0 ? 'critical' : tenantTotalOpen > 0 ? 'warning' : ''}`, children: [!data?.loading && tenantTotalOpen > 0 && (_jsx("div", { className: `card-alert-badge ${criticalGroups.length > 0 ? 'critical' : 'warning'}`, children: tenantTotalOpen })), _jsxs("div", { className: "card-header", children: [_jsx("div", { className: "tenant-avatar", children: tenant.name.substring(0, 2) }), _jsxs("div", { className: "tenant-info", children: [_jsx("h3", { className: "tenant-name", children: tenant.name }), tenant.domain && _jsx("p", { className: "tenant-domain", children: tenant.domain })] })] }), _jsxs("div", { className: "card-stats-grid", children: [_jsxs("div", { className: "stat-item", children: [_jsx("div", { className: "stat-label", children: "Status" }), _jsxs("div", { className: "stat-value green", children: ["\u25CF ", tenant.status] })] }), _jsxs("div", { className: "stat-item", children: [_jsx("div", { className: "stat-label", children: "Open" }), _jsx("div", { className: `stat-value bold ${tenantTotalOpen > 0 ? 'orange' : 'green'}`, children: data?.loading ? '…' : tenantTotalOpen })] }), _jsxs("div", { className: "stat-item", children: [_jsx("div", { className: "stat-label", children: "Critical" }), _jsx("div", { className: `stat-value bold ${criticalGroups.length > 0 ? 'red' : 'green'}`, children: data?.loading ? '…' : criticalGroups.length })] })] }), _jsxs("div", { className: "asset-counts", children: [_jsxs("div", { className: "asset-item", children: [_jsx("span", { className: "asset-icon", children: "\uD83D\uDDA5\uFE0F" }), _jsx("span", { className: "asset-value", children: assets?.loading ? '…' : assets ? assets.devices.toLocaleString() : '—' }), _jsx("span", { className: "asset-label", children: "devices" })] }), _jsx("div", { className: "asset-sep" }), _jsxs("div", { className: "asset-item", children: [_jsx("span", { className: "asset-icon", children: "\uD83D\uDC64" }), _jsx("span", { className: "asset-value", children: assets?.loading ? '…' : assets ? assets.users.toLocaleString() : '—' }), _jsx("span", { className: "asset-label", children: "users" })] })] }), !data?.loading && oldestAge && oldest && (_jsxs("div", { className: `oldest-ticket-box ${oldestAge.hours >= 24 ? 'overdue' : ''}`, "data-age": oldestAge.ageCategory, children: [_jsx("div", { className: "oldest-ticket-label", children: "OLDEST OPEN DETECTION" }), _jsxs("div", { className: "oldest-ticket-content", children: [_jsxs("div", { children: [_jsx("span", { className: "oldest-ticket-age", children: oldestAge.text }), oldestAge.hours >= 24 && (_jsx("span", { className: "overdue-badge small", children: "OVERDUE" }))] }), _jsx("span", { className: `severity-badge-small ${riskToSeverity(oldest.riskScore)}`, children: riskToSeverity(oldest.riskScore) })] }), _jsx("div", { className: "oldest-ticket-title", children: oldest.alertTypes.length > 0 ? oldest.alertTypes.join(', ') : oldest.groupKey })] })), !data?.loading && !oldest && (_jsx("div", { className: "oldest-ticket-box clear", children: _jsx("span", { className: "clear-text", children: "\u2713 No open detections" }) })), data?.loading && (_jsx("div", { className: "oldest-ticket-box clear", children: _jsx("span", { className: "clear-text", children: "Loading\u2026" }) })), data?.error && (_jsx("div", { className: "oldest-ticket-box", style: { borderColor: '#f97316' }, children: _jsxs("span", { style: { color: '#f97316', fontSize: 12 }, children: ["\u26A0 ", data.error] }) })), _jsxs("div", { className: "card-footer", children: ["Created: ", fmtDate(tenant.created)] }), _jsx("button", { onClick: e => { e.stopPropagation(); setSelectedTenant(tenant); }, className: "btn-primary full-width", children: "View Details \u2192" })] }, tenant.id));
                                }) }))] }))] })] }));
};
export default Dashboard;
//# sourceMappingURL=Dashboard.js.map