export type DefenderSeverity = 'critical' | 'high' | 'medium' | 'low';
export type DefenderServiceSource = 'endpoint' | 'identity' | 'email' | 'cloudApp' | 'cloudWorkload' | 'exposure' | 'posture';
export type WorkflowOwner = 'Blackpoint MDR' | 'Shared' | 'Quisitive SecOps' | 'Customer IT';
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
    source: 'api' | 'mock';
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
export declare function loadTenantDefenderSnapshot(tenant: TenantLike): Promise<DefenderTenantSnapshot>;
export declare function buildTenantOwnershipView(groups: BlackpointGroupLike[], snapshot: DefenderTenantSnapshot): TenantOwnershipView;
export declare function severityRank(severity: DefenderSeverity): number;
export declare function ownerOrder(owner: WorkflowOwner): number;
export declare function formatOwnerLabel(owner: WorkflowOwner): string;
export declare function getServiceLabel(source: DefenderServiceSource): string;
//# sourceMappingURL=defenderXdr.service.d.ts.map