// ---------------------------------------------------------------------------
// Shared Types — XDR & Remediation
// ---------------------------------------------------------------------------
// Unified type definitions ported from SecOps-O365-Command-Dashboard/types.ts
// and extended for the unified SOC platform (BP + XDR correlation).
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Defender XDR Types
// ---------------------------------------------------------------------------

export type Workload =
  | 'DefenderForEndpoint'
  | 'DefenderForIdentity'
  | 'DefenderForOffice365'
  | 'DefenderForCloudApps'
  | 'DefenderXdr';

export type IncidentSeverity = 'Informational' | 'Low' | 'Medium' | 'High' | 'Critical';

export type IncidentStatus = 'Active' | 'InProgress' | 'Resolved' | 'Redirected';

export interface IncidentSummary {
  id: string;
  tenantAlias: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  assignedTo?: string;
  createdTime: string;
  lastUpdateTime: string;
  alertsCount: number;
  workloads: Workload[];
  classification?: string;
  determination?: string;
}

export interface CaseWritebackRequest {
  assignedTo?: string;
  status?: IncidentStatus;
  classification?: string;
  determination?: string;
  comment?: string;
  tags?: string[];
}

export interface IncidentEvidenceLink {
  label: string;
  url: string;
  source: string;
}

// ---------------------------------------------------------------------------
// Remediation Types
// ---------------------------------------------------------------------------

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type ProposalStatus = 'pending' | 'approved' | 'rejected' | 'executed' | 'failed';

export interface McpOperation {
  action: string;
  target: string;
  parameters: Record<string, unknown>;
}

export interface MitigationRecommendation {
  id: string;
  title: string;
  description: string;
  riskLevel: RiskLevel;
  mcpOperation?: McpOperation;
  manualSteps?: string[];
}

export interface RemediationProposal {
  proposalId: string;
  id: string;
  tenantAlias: string;
  incidentId: string;
  title: string;
  description: string;
  riskLevel: RiskLevel;
  status: ProposalStatus;
  mcpOperation?: McpOperation;
  manualSteps?: string[];
  createdAt: string;
  decidedAt?: string;
  decidedBy?: string;
  executionNote?: string;
}

export interface ApprovalDecision {
  approved: boolean;
  actor: string;
  reason?: string;
}

// ---------------------------------------------------------------------------
// Storage Types
// ---------------------------------------------------------------------------

export interface CaseRecord extends IncidentSummary {
  lastSyncedAt: string;
}

export interface AuditEvent {
  id: string;
  tenantAlias: string;
  incidentId: string;
  proposalId?: string;
  actor: string;
  action: string;
  details: Record<string, unknown>;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Blackpoint Detection Types (for correlation)
// ---------------------------------------------------------------------------

export interface BpDetection {
  id: string;
  tenantAlias: string;
  groupKey: string;
  title: string;
  severity: string;
  status: string;
  createdAt: string;
  alertCount: number;
  entities: string[];
}

export interface DetectionCorrelation {
  id: string;
  tenantAlias: string;
  bpDetectionId: string;
  xdrIncidentId: string;
  correlationType: 'entity' | 'temporal' | 'title' | 'analyst-confirmed';
  confidence: number;
  createdAt: string;
}

export interface CloseoutRecord {
  id: string;
  tenantAlias: string;
  bpDetectionId?: string;
  xdrIncidentId?: string;
  closedBy: string;
  closedAt: string;
  resolution: string;
  notes?: string;
}

// ---------------------------------------------------------------------------
// Alert Snapshot (cross-source)
// ---------------------------------------------------------------------------

export interface AlertSnapshot {
  id: string;
  tenantAlias: string;
  source: 'blackpoint' | 'defender-xdr';
  sourceId: string;
  title: string;
  severity: string;
  status: string;
  createdAt: string;
  snapshotAt: string;
}
