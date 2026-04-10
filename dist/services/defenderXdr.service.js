function hashSeed(value) {
    return Array.from(value).reduce((seed, char) => seed + char.charCodeAt(0), 0);
}
function normalize(text) {
    return text
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((token) => token.length > 2);
}
function keywordOverlap(left, right) {
    const rightSet = new Set(right);
    return left.reduce((count, token) => count + (rightSet.has(token) ? 1 : 0), 0);
}
function findCorrelatedGroup(incident, groups) {
    const incidentTokens = normalize([incident.title, incident.category, incident.tags.join(' ')].join(' '));
    return groups
        .map((group) => {
        const groupTokens = normalize([group.groupKey, group.alertTypes.join(' ')].join(' '));
        return { group, score: keywordOverlap(incidentTokens, groupTokens) };
    })
        .filter((entry) => entry.score > 0)
        .sort((left, right) => right.score - left.score || right.group.riskScore - left.group.riskScore)[0]
        ?.group;
}
function classifyIncident(incident) {
    const category = incident.category.toLowerCase();
    if (incident.serviceSource === 'email') {
        return {
            owner: 'Quisitive SecOps',
            blackpointCoverage: 'gap',
            rationale: 'Email investigation and remediation are outside Blackpoint coverage, so SecOps needs to triage Defender for Office 365 findings.'
        };
    }
    if (incident.serviceSource === 'cloudApp') {
        return {
            owner: 'Quisitive SecOps',
            blackpointCoverage: 'gap',
            rationale: 'Cloud app and OAuth governance issues fall into Defender for Cloud Apps coverage, not Blackpoint MDR.'
        };
    }
    if (incident.serviceSource === 'cloudWorkload' || incident.serviceSource === 'posture') {
        return {
            owner: 'Customer IT',
            blackpointCoverage: 'gap',
            rationale: 'Cloud posture and workload misconfigurations require tenant remediation in the customer environment.'
        };
    }
    if (incident.serviceSource === 'exposure') {
        if (category.includes('advanced-hunting') ||
            category.includes('custom-detection') ||
            category.includes('soar')) {
            return {
                owner: 'Quisitive SecOps',
                blackpointCoverage: 'gap',
                rationale: 'Hunting, analytics, and custom detection engineering need SecOps ownership because Blackpoint does not expose those capabilities.'
            };
        }
        return {
            owner: 'Customer IT',
            blackpointCoverage: 'gap',
            rationale: 'Exposure management, attack surface reduction, and vulnerability remediation are customer-owned hardening tasks.'
        };
    }
    if (incident.serviceSource === 'endpoint') {
        if (category.includes('asr') || category.includes('tvm') || category.includes('vulnerability')) {
            return {
                owner: 'Customer IT',
                blackpointCoverage: 'gap',
                rationale: 'Endpoint hardening and vulnerability remediation remain with the customer even when Blackpoint monitors the environment.'
            };
        }
        return {
            owner: 'Shared',
            blackpointCoverage: 'partial',
            rationale: 'Blackpoint can triage and contain endpoint threats, but tenant or SecOps follow-through is still required for full mitigation and cleanup.'
        };
    }
    if (incident.serviceSource === 'identity') {
        if (category.includes('conditional-access') ||
            category.includes('governance') ||
            category.includes('pim')) {
            return {
                owner: 'Customer IT',
                blackpointCoverage: 'gap',
                rationale: 'Identity policy enforcement and privileged access controls need tenant-side configuration changes.'
            };
        }
        return {
            owner: 'Shared',
            blackpointCoverage: 'partial',
            rationale: 'Blackpoint can investigate risky sign-ins and account abuse signals, but remediation still requires tenant identity actions.'
        };
    }
    return {
        owner: 'Quisitive SecOps',
        blackpointCoverage: 'gap',
        rationale: 'This incident needs additional SecOps triage because it is not clearly covered by Blackpoint MDR.'
    };
}
function createMockIncidents(tenant) {
    const now = Date.now();
    const seed = hashSeed(tenant.name + (tenant.domain ?? ''));
    const suffix = tenant.domain ?? tenant.name.toLowerCase().replace(/\s+/g, '-');
    const incidents = [
        {
            id: `mdx-${tenant.id}-endpoint`,
            title: `Possible ransomware staging on ${suffix}`,
            serviceSource: 'endpoint',
            category: 'edr-ransomware',
            severity: seed % 2 === 0 ? 'critical' : 'high',
            status: 'active',
            createdDate: new Date(now - 1000 * 60 * (90 + (seed % 180))).toISOString(),
            recommendedAction: 'Validate containment, confirm host isolation, and complete post-incident remediation steps.',
            assignedTo: 'Blackpoint + customer',
            tags: ['endpoint', 'ransomware', 'containment']
        },
        {
            id: `mdx-${tenant.id}-identity`,
            title: `Risky sign-in sequence detected for privileged account in ${tenant.name}`,
            serviceSource: 'identity',
            category: 'risky-signin',
            severity: seed % 3 === 0 ? 'high' : 'medium',
            status: 'active',
            createdDate: new Date(now - 1000 * 60 * (45 + (seed % 90))).toISOString(),
            recommendedAction: 'Review MFA posture, revoke active sessions, and rotate credentials if compromise is confirmed.',
            assignedTo: 'Blackpoint + identity admin',
            tags: ['identity', 'risky-signin', 'credential']
        },
        {
            id: `mdx-${tenant.id}-email`,
            title: `User-targeted phishing campaign reached mailboxes for ${tenant.name}`,
            serviceSource: 'email',
            category: 'phishing',
            severity: 'high',
            status: 'active',
            createdDate: new Date(now - 1000 * 60 * (15 + (seed % 30))).toISOString(),
            recommendedAction: 'Run message trace, purge delivered messages, and confirm end-user impact across recipients.',
            assignedTo: 'Quisitive SecOps',
            tags: ['email', 'phishing', 'safe-links']
        },
        {
            id: `mdx-${tenant.id}-exposure`,
            title: `High-risk vulnerable devices detected in ${tenant.name}`,
            serviceSource: 'exposure',
            category: 'tvm-vulnerability',
            severity: seed % 5 === 0 ? 'critical' : 'medium',
            status: 'active',
            createdDate: new Date(now - 1000 * 60 * 60 * (12 + (seed % 24))).toISOString(),
            recommendedAction: 'Patch exposed devices, validate remediation windows, and track exceptions with the customer IT team.',
            assignedTo: 'Customer IT',
            tags: ['exposure', 'tvm', 'patching']
        },
        {
            id: `mdx-${tenant.id}-cloudapp`,
            title: `Suspicious OAuth consent activity detected for ${tenant.name}`,
            serviceSource: 'cloudApp',
            category: 'oauth-governance',
            severity: 'high',
            status: 'active',
            createdDate: new Date(now - 1000 * 60 * 60 * (4 + (seed % 18))).toISOString(),
            recommendedAction: 'Review app consent, revoke risky grants, and assess downstream SaaS exposure.',
            assignedTo: 'Quisitive SecOps',
            tags: ['cloudapp', 'oauth', 'governance']
        }
    ];
    if (seed % 2 === 1) {
        incidents.push({
            id: `mdx-${tenant.id}-posture`,
            title: `Conditional Access coverage gap identified for ${tenant.name}`,
            serviceSource: 'posture',
            category: 'conditional-access',
            severity: 'medium',
            status: 'active',
            createdDate: new Date(now - 1000 * 60 * 60 * (20 + (seed % 20))).toISOString(),
            recommendedAction: 'Define or tighten risk-based Conditional Access policies and validate break-glass accounts.',
            assignedTo: 'Customer IT',
            tags: ['identity', 'conditional-access', 'policy']
        });
    }
    return incidents;
}
export async function loadTenantDefenderSnapshot(tenant) {
    const endpoint = `/api/defender-xdr/tenants/${encodeURIComponent(tenant.id)}/summary`;
    try {
        const response = await fetch(endpoint, {
            headers: { Accept: 'application/json' }
        });
        if (response.ok) {
            const data = (await response.json());
            return {
                ...data,
                tenantId: data.tenantId || tenant.id,
                source: 'api'
            };
        }
    }
    catch {
        // Fall back to a deterministic mock snapshot until a secure backend is available.
    }
    return {
        tenantId: tenant.id,
        generatedAt: new Date().toISOString(),
        source: 'mock',
        incidents: createMockIncidents(tenant)
    };
}
export function buildTenantOwnershipView(groups, snapshot) {
    const workItems = snapshot.incidents.map((incident) => {
        const correlation = findCorrelatedGroup(incident, groups);
        const classification = classifyIncident(incident);
        return {
            incident,
            owner: classification.owner,
            blackpointCoverage: classification.blackpointCoverage,
            rationale: classification.rationale,
            correlatedGroupId: correlation?.id,
            correlatedTicketId: correlation?.ticketId
        };
    });
    const blackpointDetections = groups.map((group) => {
        const correlationCount = workItems.filter((item) => item.correlatedGroupId === group.id).length;
        const ownership = correlationCount > 0 ? 'Shared' : 'Blackpoint MDR';
        return {
            groupId: group.id,
            title: group.alertTypes.length > 0 ? group.alertTypes.join(', ') : group.groupKey,
            riskScore: group.riskScore,
            status: group.status,
            created: group.created,
            ticketId: group.ticketId,
            correlationCount,
            ownership
        };
    });
    const recommendations = Array.from(new Set(workItems
        .filter((item) => item.owner !== 'Blackpoint MDR')
        .sort((left, right) => {
        const rank = { critical: 4, high: 3, medium: 2, low: 1 };
        return rank[right.incident.severity] - rank[left.incident.severity];
    })
        .map((item) => item.incident.recommendedAction))).slice(0, 5);
    return {
        snapshot,
        blackpointDetections,
        workItems,
        summary: {
            blackpointHandled: blackpointDetections.length,
            sharedInvestigations: workItems.filter((item) => item.owner === 'Shared').length,
            secOpsQueue: workItems.filter((item) => item.owner === 'Quisitive SecOps').length,
            customerQueue: workItems.filter((item) => item.owner === 'Customer IT').length,
            criticalGaps: workItems.filter((item) => item.blackpointCoverage === 'gap' && item.incident.severity === 'critical').length,
            correlatedItems: workItems.filter((item) => item.correlatedGroupId).length
        },
        recommendations
    };
}
export function severityRank(severity) {
    return { critical: 4, high: 3, medium: 2, low: 1 }[severity];
}
export function ownerOrder(owner) {
    return {
        Shared: 0,
        'Quisitive SecOps': 1,
        'Customer IT': 2,
        'Blackpoint MDR': 3
    }[owner];
}
export function formatOwnerLabel(owner) {
    return owner;
}
export function getServiceLabel(source) {
    return {
        endpoint: 'Endpoint',
        identity: 'Identity',
        email: 'Email',
        cloudApp: 'Cloud App',
        cloudWorkload: 'Cloud Workload',
        exposure: 'Exposure Mgmt',
        posture: 'Posture'
    }[source];
}
//# sourceMappingURL=defenderXdr.service.js.map