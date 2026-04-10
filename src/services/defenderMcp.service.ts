// ---------------------------------------------------------------------------
// Defender Response MCP Feed Service
// ---------------------------------------------------------------------------
// Pulls Defender response-action data (machine actions, device isolation
// status, investigation packages) and translates them into actionable
// UnifiedAlert records plus a set of response recommendations.
//
// "MCP" here refers to the Microsoft Defender response toolset available
// through the MCP integration layer.  The backend proxy authenticates and
// forwards requests.
// ---------------------------------------------------------------------------

import type { UnifiedAlert, UnifiedSeverity } from './tenantAlertStore.service';

// ---------------------------------------------------------------------------
// MCP-specific types
// ---------------------------------------------------------------------------

export type MachineActionType =
  | 'RunAntiVirusScan'
  | 'Offboard'
  | 'LiveResponse'
  | 'CollectInvestigationPackage'
  | 'Isolate'
  | 'Unisolate'
  | 'StopAndQuarantineFile'
  | 'RestrictCodeExecution'
  | 'UnrestrictCodeExecution';

export type MachineActionStatus = 'Pending' | 'InProgress' | 'Succeeded' | 'Failed' | 'TimeOut' | 'Cancelled';

export interface MachineAction {
  id: string;
  type: MachineActionType;
  status: MachineActionStatus;
  machineId: string;
  computerDnsName: string;
  creationDateTimeUtc: string;
  lastUpdateDateTimeUtc: string;
  requestor: string;
  requestorComment?: string;
  error?: string;
}

export interface DeviceHealthSummary {
  deviceId: string;
  computerDnsName: string;
  riskScore: 'High' | 'Medium' | 'Low' | 'None';
  exposureLevel: 'High' | 'Medium' | 'Low' | 'None';
  healthStatus: 'Active' | 'Inactive' | 'ImpairedCommunication' | 'NoSensorData';
  onboardingStatus: 'Onboarded' | 'CanBeOnboarded' | 'Unsupported';
  isIsolated: boolean;
  lastSeen: string;
}

export interface ResponseRecommendation {
  priority: 'immediate' | 'urgent' | 'standard';
  action: string;
  rationale: string;
  automatable: boolean;
  mcpAction?: MachineActionType;
  targetDevice?: string;
}

export interface DefenderMcpFeedResult {
  machineActions: MachineAction[];
  deviceHealth: DeviceHealthSummary[];
  recommendations: ResponseRecommendation[];
  alerts: UnifiedAlert[];
  lastRefreshed: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function actionSeverity(action: MachineAction): UnifiedSeverity {
  if (action.type === 'Isolate' || action.type === 'StopAndQuarantineFile') return 'critical';
  if (action.type === 'RestrictCodeExecution' || action.type === 'CollectInvestigationPackage') return 'high';
  return 'medium';
}

function actionToUnified(tenantId: string, action: MachineAction): UnifiedAlert {
  return {
    id: `defender-mcp:${action.id}`,
    tenantId,
    source: 'defender-mcp',
    sourceId: action.id,
    title: `${action.type} — ${action.computerDnsName}`,
    description: action.requestorComment ?? `${action.type} action on device ${action.computerDnsName}`,
    severity: actionSeverity(action),
    status: action.status === 'Succeeded' ? 'resolved'
      : action.status === 'Failed' || action.status === 'Cancelled' || action.status === 'TimeOut' ? 'closed'
      : 'in-progress',
    category: 'response-action',
    createdAt: action.creationDateTimeUtc,
    updatedAt: action.lastUpdateDateTimeUtc,
    assignedTo: action.requestor,
    raw: action as unknown as Record<string, unknown>,
    correlatedAlertIds: [],
    tags: ['defender-mcp', action.type.toLowerCase(), action.status.toLowerCase()]
  };
}

// ---------------------------------------------------------------------------
// Recommendation engine (analyses live action + device data)
// ---------------------------------------------------------------------------

function buildRecommendations(
  actions: MachineAction[],
  devices: DeviceHealthSummary[]
): ResponseRecommendation[] {
  const recs: ResponseRecommendation[] = [];

  // Build lookup sets for quick membership checks
  const succeededIsolations = new Set(
    actions
      .filter((a) => a.type === 'Isolate' && a.status === 'Succeeded')
      .map((a) => a.machineId)
  );
  const investigationCollected = new Set(
    actions
      .filter((a) => a.type === 'CollectInvestigationPackage' && a.status === 'Succeeded')
      .map((a) => a.machineId)
  );
  const scannedDevices = new Set(
    actions
      .filter((a) => a.type === 'RunAntiVirusScan' && a.status === 'Succeeded')
      .map((a) => a.machineId)
  );
  const restrictedDevices = new Set(
    actions
      .filter((a) => a.type === 'RestrictCodeExecution' && a.status === 'Succeeded')
      .map((a) => a.machineId)
  );

  // 1. Suggest unisolation when isolation + investigation both succeeded
  for (const machineId of succeededIsolations) {
    if (investigationCollected.has(machineId)) {
      const device = devices.find((d) => d.deviceId === machineId);
      recs.push({
        priority: 'standard',
        action: `Unisolate ${device?.computerDnsName ?? machineId}`,
        rationale:
          'Device was isolated and investigation package collected successfully — consider releasing isolation.',
        automatable: true,
        mcpAction: 'Unisolate',
        targetDevice: machineId
      });
    }
  }

  // 2. Recommend AV scan on high-risk devices not yet scanned
  for (const device of devices) {
    if (
      (device.riskScore === 'High' || device.exposureLevel === 'High') &&
      !scannedDevices.has(device.deviceId)
    ) {
      recs.push({
        priority: 'urgent',
        action: `Run AV scan on ${device.computerDnsName}`,
        rationale: `Device risk=${device.riskScore}, exposure=${device.exposureLevel} — no recent AV scan recorded.`,
        automatable: true,
        mcpAction: 'RunAntiVirusScan',
        targetDevice: device.deviceId
      });
    }
  }

  // 3. Flag pending actions that may be stuck (>15 min)
  const fifteenMinAgo = Date.now() - 15 * 60 * 1000;
  for (const action of actions) {
    if (
      (action.status === 'Pending' || action.status === 'InProgress') &&
      new Date(action.lastUpdateDateTimeUtc).getTime() < fifteenMinAgo
    ) {
      recs.push({
        priority: 'immediate',
        action: `Investigate stalled ${action.type} on ${action.computerDnsName}`,
        rationale: `Action has been ${action.status} for over 15 minutes — may need manual intervention.`,
        automatable: false,
        targetDevice: action.machineId
      });
    }
  }

  // 4. Suggest restricting code execution on isolated devices without it
  for (const machineId of succeededIsolations) {
    if (!restrictedDevices.has(machineId)) {
      const device = devices.find((d) => d.deviceId === machineId);
      recs.push({
        priority: 'urgent',
        action: `Restrict code execution on ${device?.computerDnsName ?? machineId}`,
        rationale:
          'Device is isolated but code execution is not restricted — attacker processes may still run.',
        automatable: true,
        mcpAction: 'RestrictCodeExecution',
        targetDevice: machineId
      });
    }
  }

  // Sort by priority rank: immediate → urgent → standard
  const rank: Record<string, number> = { immediate: 0, urgent: 1, standard: 2 };
  recs.sort((a, b) => rank[a.priority] - rank[b.priority]);

  return recs;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function fetchDefenderMcpFeed(
  tenantId: string
): Promise<DefenderMcpFeedResult> {
  const res = await fetch(
    `/api/defender-mcp/tenants/${encodeURIComponent(tenantId)}/actions`,
    { headers: { Accept: 'application/json' } }
  );

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} — Defender MCP actions for ${tenantId}`);
  }

  const body = (await res.json()) as {
    machineActions: MachineAction[];
    deviceHealth: DeviceHealthSummary[];
  };
  const recommendations = buildRecommendations(body.machineActions, body.deviceHealth);
  return {
    machineActions: body.machineActions,
    deviceHealth: body.deviceHealth,
    recommendations,
    alerts: body.machineActions.map((a) => actionToUnified(tenantId, a)),
    lastRefreshed: new Date().toISOString()
  };
}
