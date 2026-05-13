import {
  BlackpointGroupLike,
  CorrelationOverride,
  CorrelationOverrideMap,
  DefenderWorkItem,
  TenantLike,
  TenantOwnershipView,
} from './defenderXdr.service';

const CORRELATION_OVERRIDE_KEY_PREFIX = 'bp-xdr-correlation-overrides';

function getStorageKey(tenantId: string): string {
  return `${CORRELATION_OVERRIDE_KEY_PREFIX}:${tenantId}`;
}

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadCorrelationOverrides(tenantId: string): CorrelationOverrideMap {
  if (!canUseStorage()) return {};

  const raw = window.localStorage.getItem(getStorageKey(tenantId));
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as CorrelationOverrideMap;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function persistCorrelationOverrides(
  tenantId: string,
  overrides: CorrelationOverrideMap
): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(getStorageKey(tenantId), JSON.stringify(overrides));
}

export function upsertCorrelationOverride(
  tenantId: string,
  override: CorrelationOverride
): CorrelationOverrideMap {
  const current = loadCorrelationOverrides(tenantId);
  const next: CorrelationOverrideMap = {
    ...current,
    [override.incidentId]: override,
  };
  persistCorrelationOverrides(tenantId, next);
  return next;
}

export function removeCorrelationOverride(
  tenantId: string,
  incidentId: string
): CorrelationOverrideMap {
  const current = loadCorrelationOverrides(tenantId);
  const next: CorrelationOverrideMap = { ...current };
  delete next[incidentId];
  persistCorrelationOverrides(tenantId, next);
  return next;
}

export interface CloseoutGovernanceRow {
  tenantId: string;
  tenantName: string;
  xdrIncidentRef: string;
  xdrIncidentId: string;
  xdrStatus: string;
  bpTicketId: string;
  bpGroupId: string;
  bpStatus: string;
  reconciliationStatus: string;
  correlationMethod: string;
  correlationConfidence: string;
}

function getReconciliationStatus(
  item: DefenderWorkItem,
  group?: BlackpointGroupLike
): string {
  if (!group) return 'XDR_UNMATCHED';

  const bpResolved = group.status === 'RESOLVED';
  const xdrResolved = item.incident.status === 'resolved';

  if (bpResolved && xdrResolved) return 'CLOSED_BOTH';
  if (bpResolved && !xdrResolved) return 'XDR_ACTIVE_BP_CLOSED';
  if (!bpResolved && xdrResolved) return 'BP_ACTIVE_XDR_CLOSED';
  return 'ACTIVE_BOTH';
}

export function buildCloseoutGovernanceRows(
  tenant: TenantLike,
  groups: BlackpointGroupLike[],
  view: TenantOwnershipView
): CloseoutGovernanceRow[] {
  const groupById = new Map(groups.map((group) => [group.id, group]));
  const rows: CloseoutGovernanceRow[] = view.workItems.map((item) => {
    const group = item.correlatedGroupId
      ? groupById.get(item.correlatedGroupId)
      : undefined;

    const correlationMethod = item.overrideApplied
      ? item.overrideAction === 'match'
        ? 'analyst-confirmed-match'
        : 'analyst-confirmed-no-match'
      : group
        ? 'heuristic'
        : 'none';

    return {
      tenantId: tenant.id,
      tenantName: tenant.name,
      xdrIncidentRef: item.xdrIncidentRef,
      xdrIncidentId: item.incident.id,
      xdrStatus: item.incident.status,
      bpTicketId: group?.ticketId ?? '',
      bpGroupId: group?.id ?? '',
      bpStatus: group?.status ?? '',
      reconciliationStatus: getReconciliationStatus(item, group),
      correlationMethod,
      correlationConfidence: item.correlationConfidence ?? '',
    };
  });

  const matchedGroupIds = new Set(
    view.workItems
      .map((item) => item.correlatedGroupId)
      .filter((id): id is string => Boolean(id))
  );

  groups
    .filter((group) => !matchedGroupIds.has(group.id))
    .forEach((group) => {
      rows.push({
        tenantId: tenant.id,
        tenantName: tenant.name,
        xdrIncidentRef: '',
        xdrIncidentId: '',
        xdrStatus: '',
        bpTicketId: group.ticketId,
        bpGroupId: group.id,
        bpStatus: group.status,
        reconciliationStatus: 'BP_UNMATCHED',
        correlationMethod: 'none',
        correlationConfidence: '',
      });
    });

  return rows;
}

function escapeCsvValue(value: string): string {
  const normalized = value ?? '';
  if (normalized.includes(',') || normalized.includes('"') || normalized.includes('\n')) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
}

export function toCloseoutGovernanceCsv(rows: CloseoutGovernanceRow[]): string {
  const header = [
    'tenantId',
    'tenantName',
    'xdrIncidentRef',
    'xdrIncidentId',
    'xdrStatus',
    'bpTicketId',
    'bpGroupId',
    'bpStatus',
    'reconciliationStatus',
    'correlationMethod',
    'correlationConfidence',
  ];

  const lines = rows.map((row) =>
    [
      row.tenantId,
      row.tenantName,
      row.xdrIncidentRef,
      row.xdrIncidentId,
      row.xdrStatus,
      row.bpTicketId,
      row.bpGroupId,
      row.bpStatus,
      row.reconciliationStatus,
      row.correlationMethod,
      row.correlationConfidence,
    ]
      .map((value) => escapeCsvValue(String(value ?? '')))
      .join(',')
  );

  return [header.join(','), ...lines].join('\n');
}

export function downloadCloseoutGovernanceCsv(
  tenant: TenantLike,
  rows: CloseoutGovernanceRow[]
): void {
  if (typeof document === 'undefined') return;

  const csv = toCloseoutGovernanceCsv(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  const safeTenantName = tenant.name.replace(/[^a-z0-9-_]/gi, '_').toLowerCase();
  const fileName = `closeout-governance-${safeTenantName}-${Date.now()}.csv`;

  anchor.href = url;
  anchor.download = fileName;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
