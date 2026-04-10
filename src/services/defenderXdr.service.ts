export type DefenderSeverity = 'critical' | 'high' | 'medium' | 'low';

export type DefenderServiceSource =
  | 'endpoint'
  | 'identity'
  | 'email'
  | 'cloudApp'
  | 'cloudWorkload'
  | 'exposure'
  | 'posture';

export type WorkflowOwner =
  | 'Blackpoint MDR'
  | 'Shared'
  | 'Quisitive SecOps'
  | 'Customer IT';

export type BlackpointCoverage = 'covered' | 'partial' | 'gap';

export interface TenantLike {
  id: string;
  name: string;
  domain?: string | null;
}

export interface BlackpointGroupLike {
  id: string;
  groupKey: string;
  riskScore: number;
  alertCount: number;
  alertTypes: string[];
  status: 'OPEN' | 'RESOLVED';
  ticketId: string;
  created: string;
  updated?: string | null;
}

export interface DefenderIncident {
  id: string;
  title: string;
  serviceSource: DefenderServiceSource;
  category: string;
  severity: DefenderSeverity;
  status: 'active' | 'resolved';
  createdDate: string;
  recommendedAction: string;
  assignedTo?: string;
  tags: string[];
}

export interface DefenderTenantSnapshot {
  tenantId: string;
  generatedAt: string;
  source: 'api';
  incidents: DefenderIncident[];
}

export interface DefenderWorkItem {
  incident: DefenderIncident;
  owner: WorkflowOwner;
  blackpointCoverage: BlackpointCoverage;
  rationale: string;
  correlatedGroupId?: string;
  correlatedTicketId?: string;
}

export interface BlackpointManagedDetection {
  groupId: string;
  title: string;
  riskScore: number;
  status: 'OPEN' | 'RESOLVED';
  created: string;
  ticketId: string;
  correlationCount: number;
  ownership: 'Blackpoint MDR' | 'Shared';
}

export interface OwnershipSummary {
  blackpointHandled: number;
  sharedInvestigations: number;
  secOpsQueue: number;
  customerQueue: number;
  criticalGaps: number;
  correlatedItems: number;
}

export interface TenantOwnershipView {
  snapshot: DefenderTenantSnapshot;
  blackpointDetections: BlackpointManagedDetection[];
  workItems: DefenderWorkItem[];
  summary: OwnershipSummary;
  recommendations: string[];
}

function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2);
}

function keywordOverlap(left: string[], right: string[]): number {
  const rightSet = new Set(right);
  return left.reduce((count, token) => count + (rightSet.has(token) ? 1 : 0), 0);
}

function findCorrelatedGroup(
  incident: DefenderIncident,
  groups: BlackpointGroupLike[]
): BlackpointGroupLike | undefined {
  const incidentTokens = normalize(
    [incident.title, incident.category, incident.tags.join(' ')].join(' ')
  );

  return groups
    .map((group) => {
      const groupTokens = normalize([group.groupKey, group.alertTypes.join(' ')].join(' '));
      return { group, score: keywordOverlap(incidentTokens, groupTokens) };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || right.group.riskScore - left.group.riskScore)[0]
    ?.group;
}

function classifyIncident(incident: DefenderIncident): {
  owner: WorkflowOwner;
  blackpointCoverage: BlackpointCoverage;
  rationale: string;
} {
  const category = incident.category.toLowerCase();

  if (incident.serviceSource === 'email') {
    return {
      owner: 'Quisitive SecOps',
      blackpointCoverage: 'gap',
      rationale:
        'Email investigation and remediation are outside Blackpoint coverage, so SecOps needs to triage Defender for Office 365 findings.'
    };
  }

  if (incident.serviceSource === 'cloudApp') {
    return {
      owner: 'Quisitive SecOps',
      blackpointCoverage: 'gap',
      rationale:
        'Cloud app and OAuth governance issues fall into Defender for Cloud Apps coverage, not Blackpoint MDR.'
    };
  }

  if (incident.serviceSource === 'cloudWorkload' || incident.serviceSource === 'posture') {
    return {
      owner: 'Customer IT',
      blackpointCoverage: 'gap',
      rationale:
        'Cloud posture and workload misconfigurations require tenant remediation in the customer environment.'
    };
  }

  if (incident.serviceSource === 'exposure') {
    if (
      category.includes('advanced-hunting') ||
      category.includes('custom-detection') ||
      category.includes('soar')
    ) {
      return {
        owner: 'Quisitive SecOps',
        blackpointCoverage: 'gap',
        rationale:
          'Hunting, analytics, and custom detection engineering need SecOps ownership because Blackpoint does not expose those capabilities.'
      };
    }

    return {
      owner: 'Customer IT',
      blackpointCoverage: 'gap',
      rationale:
        'Exposure management, attack surface reduction, and vulnerability remediation are customer-owned hardening tasks.'
    };
  }

  if (incident.serviceSource === 'endpoint') {
    if (category.includes('asr') || category.includes('tvm') || category.includes('vulnerability')) {
      return {
        owner: 'Customer IT',
        blackpointCoverage: 'gap',
        rationale:
          'Endpoint hardening and vulnerability remediation remain with the customer even when Blackpoint monitors the environment.'
      };
    }

    return {
      owner: 'Shared',
      blackpointCoverage: 'partial',
      rationale:
        'Blackpoint can triage and contain endpoint threats, but tenant or SecOps follow-through is still required for full mitigation and cleanup.'
    };
  }

  if (incident.serviceSource === 'identity') {
    if (
      category.includes('conditional-access') ||
      category.includes('governance') ||
      category.includes('pim')
    ) {
      return {
        owner: 'Customer IT',
        blackpointCoverage: 'gap',
        rationale:
          'Identity policy enforcement and privileged access controls need tenant-side configuration changes.'
      };
    }

    return {
      owner: 'Shared',
      blackpointCoverage: 'partial',
      rationale:
        'Blackpoint can investigate risky sign-ins and account abuse signals, but remediation still requires tenant identity actions.'
    };
  }

  return {
    owner: 'Quisitive SecOps',
    blackpointCoverage: 'gap',
    rationale: 'This incident needs additional SecOps triage because it is not clearly covered by Blackpoint MDR.'
  };
}

export async function loadTenantDefenderSnapshot(
  tenant: TenantLike
): Promise<DefenderTenantSnapshot> {
  const endpoint = `/api/defender-xdr/tenants/${encodeURIComponent(tenant.id)}/summary`;

  const response = await fetch(endpoint, {
    headers: { Accept: 'application/json' }
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} — ${endpoint}`);
  }

  const data = (await response.json()) as DefenderTenantSnapshot;
  return {
    ...data,
    tenantId: data.tenantId || tenant.id,
    source: 'api'
  };
}

export function buildTenantOwnershipView(
  groups: BlackpointGroupLike[],
  snapshot: DefenderTenantSnapshot
): TenantOwnershipView {
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

  const blackpointDetections: BlackpointManagedDetection[] = groups.map((group) => {
    const correlationCount = workItems.filter((item) => item.correlatedGroupId === group.id).length;
    const ownership: BlackpointManagedDetection['ownership'] =
      correlationCount > 0 ? 'Shared' : 'Blackpoint MDR';

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

  const recommendations = Array.from(
    new Set(
      workItems
        .filter((item) => item.owner !== 'Blackpoint MDR')
        .sort((left, right) => {
          const rank = { critical: 4, high: 3, medium: 2, low: 1 };
          return rank[right.incident.severity] - rank[left.incident.severity];
        })
        .map((item) => item.incident.recommendedAction)
    )
  ).slice(0, 5);

  return {
    snapshot,
    blackpointDetections,
    workItems,
    summary: {
      blackpointHandled: blackpointDetections.length,
      sharedInvestigations: workItems.filter((item) => item.owner === 'Shared').length,
      secOpsQueue: workItems.filter((item) => item.owner === 'Quisitive SecOps').length,
      customerQueue: workItems.filter((item) => item.owner === 'Customer IT').length,
      criticalGaps: workItems.filter(
        (item) => item.blackpointCoverage === 'gap' && item.incident.severity === 'critical'
      ).length,
      correlatedItems: workItems.filter((item) => item.correlatedGroupId).length
    },
    recommendations
  };
}

export function severityRank(severity: DefenderSeverity): number {
  return { critical: 4, high: 3, medium: 2, low: 1 }[severity];
}

export function ownerOrder(owner: WorkflowOwner): number {
  return {
    Shared: 0,
    'Quisitive SecOps': 1,
    'Customer IT': 2,
    'Blackpoint MDR': 3
  }[owner];
}

export function formatOwnerLabel(owner: WorkflowOwner): string {
  return owner;
}

export function getServiceLabel(source: DefenderServiceSource): string {
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