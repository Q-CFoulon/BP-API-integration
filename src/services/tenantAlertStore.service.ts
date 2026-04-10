// ---------------------------------------------------------------------------
// Tenant-Segregated Alert Store
// ---------------------------------------------------------------------------
// In-memory store keyed by tenant ID. Every alert from any source
// (Blackpoint, Defender XDR, Sentinel, Office 365 connectors) flows into
// a single per-tenant collection.  Cross-tenant read is intentionally
// forbidden so each customer's data stays isolated.
// ---------------------------------------------------------------------------

export type AlertSource =
  | 'blackpoint'
  | 'defender-xdr'
  | 'sentinel'
  | 'o365-email'
  | 'o365-identity'
  | 'o365-cloudapp'
  | 'o365-endpoint'
  | 'defender-mcp';

export type UnifiedSeverity = 'critical' | 'high' | 'medium' | 'low' | 'informational';

export type UnifiedStatus = 'new' | 'active' | 'in-progress' | 'resolved' | 'closed';

export interface UnifiedAlert {
  /** Globally unique — composite of source + source-native ID. */
  id: string;
  tenantId: string;
  source: AlertSource;
  sourceId: string;
  title: string;
  description: string;
  severity: UnifiedSeverity;
  status: UnifiedStatus;
  category: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  /** Source-specific payload for drill-down. */
  raw: Record<string, unknown>;
  /** IDs of correlated alerts across sources. */
  correlatedAlertIds: string[];
  /** Tags for filtering and triage. */
  tags: string[];
}

// ---------------------------------------------------------------------------
// Store implementation
// ---------------------------------------------------------------------------

/** Per-tenant bucket — never exposed directly. */
interface TenantBucket {
  tenantId: string;
  alerts: Map<string, UnifiedAlert>;
  lastUpdated: string;
}

const store = new Map<string, TenantBucket>();

function getBucket(tenantId: string): TenantBucket {
  let bucket = store.get(tenantId);
  if (!bucket) {
    bucket = { tenantId, alerts: new Map(), lastUpdated: new Date().toISOString() };
    store.set(tenantId, bucket);
  }
  return bucket;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Upsert a single unified alert. */
export function upsertAlert(alert: UnifiedAlert): void {
  if (alert.tenantId !== alert.tenantId.trim()) {
    throw new Error('Tenant ID must not contain leading/trailing whitespace');
  }
  const bucket = getBucket(alert.tenantId);
  bucket.alerts.set(alert.id, alert);
  bucket.lastUpdated = new Date().toISOString();
}

/** Upsert many alerts for a single tenant at once (batch ingest). */
export function upsertAlerts(tenantId: string, alerts: UnifiedAlert[]): void {
  const bucket = getBucket(tenantId);
  for (const alert of alerts) {
    if (alert.tenantId !== tenantId) {
      throw new Error(`Alert ${alert.id} belongs to tenant ${alert.tenantId}, not ${tenantId}`);
    }
    bucket.alerts.set(alert.id, alert);
  }
  bucket.lastUpdated = new Date().toISOString();
}

/** Read all alerts for one tenant. Never crosses tenant boundaries. */
export function getAlerts(tenantId: string): UnifiedAlert[] {
  const bucket = store.get(tenantId);
  if (!bucket) return [];
  return Array.from(bucket.alerts.values());
}

/** Read alerts filtered by source. */
export function getAlertsBySource(tenantId: string, source: AlertSource): UnifiedAlert[] {
  return getAlerts(tenantId).filter((a) => a.source === source);
}

/** Read alerts filtered by severity. */
export function getAlertsBySeverity(tenantId: string, severity: UnifiedSeverity): UnifiedAlert[] {
  return getAlerts(tenantId).filter((a) => a.severity === severity);
}

/** Read alerts that are not yet resolved or closed. */
export function getActiveAlerts(tenantId: string): UnifiedAlert[] {
  return getAlerts(tenantId).filter((a) => a.status !== 'resolved' && a.status !== 'closed');
}

/** Retrieve a single alert by composite ID, scoped to tenant. */
export function getAlert(tenantId: string, alertId: string): UnifiedAlert | undefined {
  return store.get(tenantId)?.alerts.get(alertId);
}

/** Remove a single alert. */
export function removeAlert(tenantId: string, alertId: string): boolean {
  const bucket = store.get(tenantId);
  if (!bucket) return false;
  return bucket.alerts.delete(alertId);
}

/** Clear all alerts for a tenant (useful for full refresh). */
export function clearTenant(tenantId: string): void {
  store.delete(tenantId);
}

/** List tenant IDs that have data. */
export function listTenants(): string[] {
  return Array.from(store.keys());
}

/** Summary stats for one tenant. */
export interface TenantAlertSummary {
  tenantId: string;
  total: number;
  bySeverity: Record<UnifiedSeverity, number>;
  bySource: Partial<Record<AlertSource, number>>;
  byStatus: Partial<Record<UnifiedStatus, number>>;
  lastUpdated: string;
}

export function getTenantSummary(tenantId: string): TenantAlertSummary {
  const alerts = getAlerts(tenantId);
  const bySeverity: Record<UnifiedSeverity, number> = {
    critical: 0, high: 0, medium: 0, low: 0, informational: 0
  };
  const bySource: Partial<Record<AlertSource, number>> = {};
  const byStatus: Partial<Record<UnifiedStatus, number>> = {};

  for (const a of alerts) {
    bySeverity[a.severity]++;
    bySource[a.source] = (bySource[a.source] ?? 0) + 1;
    byStatus[a.status] = (byStatus[a.status] ?? 0) + 1;
  }

  return {
    tenantId,
    total: alerts.length,
    bySeverity,
    bySource,
    byStatus,
    lastUpdated: store.get(tenantId)?.lastUpdated ?? new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Correlation helper — link alerts across sources by keyword overlap
// ---------------------------------------------------------------------------

function tokenize(text: string): string[] {
  return text.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 2);
}

export function correlateAlerts(tenantId: string): void {
  const alerts = getAlerts(tenantId);
  if (alerts.length < 2) return;

  const tokenMap = alerts.map((a) => ({
    id: a.id,
    tokens: new Set(tokenize([a.title, a.description, a.category, ...a.tags].join(' ')))
  }));

  for (let i = 0; i < tokenMap.length; i++) {
    for (let j = i + 1; j < tokenMap.length; j++) {
      let overlap = 0;
      for (const t of tokenMap[i].tokens) {
        if (tokenMap[j].tokens.has(t)) overlap++;
      }
      if (overlap >= 2) {
        const ai = alerts[i];
        const aj = alerts[j];
        if (!ai.correlatedAlertIds.includes(aj.id)) ai.correlatedAlertIds.push(aj.id);
        if (!aj.correlatedAlertIds.includes(ai.id)) aj.correlatedAlertIds.push(ai.id);
      }
    }
  }
}
