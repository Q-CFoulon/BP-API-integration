// ---------------------------------------------------------------------------
// Office 365 Multi-API Connectors
// ---------------------------------------------------------------------------
// Each connector targets a Microsoft Graph Security / M365 Defender workload
// and normalises the response into UnifiedAlert records that can be pushed
// into the tenant-segregated alert store.
//
// Connectors implemented:
//   1. Defender for Endpoint    — endpoint threats, EDR alerts
//   2. Defender for Office 365  — email / phishing / safe-links
//   3. Defender for Cloud Apps  — OAuth governance, CASB shadow-IT
//   4. Defender for Identity    — risky sign-ins, credential attacks
//
// Architecture:
//   • All connectors authenticate per-tenant via MSAL client-credentials
//     (client_id / client_secret / tenant_id).  The actual token acquisition
//     is done through a backend proxy — the frontend only calls relative
//     endpoints and the proxy attaches the bearer token.
//   • Each connector returns UnifiedAlert[] so the caller can push them
//     straight into tenantAlertStore.upsertAlerts().
// ---------------------------------------------------------------------------

import type { AlertSource, UnifiedAlert, UnifiedSeverity, UnifiedStatus } from './tenantAlertStore.service';

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function mapGraphSeverity(sev: string): UnifiedSeverity {
  const l = sev.toLowerCase();
  if (l === 'critical' || l === 'high' || l === 'medium' || l === 'low') return l;
  if (l === 'informational' || l === 'info') return 'informational';
  return 'medium';
}

function mapGraphStatus(status: string): UnifiedStatus {
  const l = status.toLowerCase();
  if (l === 'new' || l === 'newAlert') return 'new';
  if (l === 'inprogress' || l === 'in_progress') return 'in-progress';
  if (l === 'resolved') return 'resolved';
  if (l === 'closed' || l === 'dismissed') return 'closed';
  return 'active';
}

interface GraphAlertPayload {
  id: string;
  title: string;
  description?: string;
  severity: string;
  status: string;
  category?: string;
  createdDateTime: string;
  lastModifiedDateTime?: string;
  assignedTo?: string;
  [key: string]: unknown;
}

function graphAlertToUnified(
  tenantId: string,
  source: AlertSource,
  raw: GraphAlertPayload
): UnifiedAlert {
  return {
    id: `${source}:${raw.id}`,
    tenantId,
    source,
    sourceId: raw.id,
    title: raw.title || 'Untitled alert',
    description: String(raw.description ?? ''),
    severity: mapGraphSeverity(raw.severity),
    status: mapGraphStatus(raw.status),
    category: String(raw.category ?? 'unknown'),
    createdAt: raw.createdDateTime,
    updatedAt: raw.lastModifiedDateTime ?? raw.createdDateTime,
    assignedTo: raw.assignedTo,
    raw: raw as unknown as Record<string, unknown>,
    correlatedAlertIds: [],
    tags: [source]
  };
}

// ---------------------------------------------------------------------------
// Generic fetch helper — calls relative endpoints; backend proxy attaches
// the bearer token & routes to the Graph API.
// ---------------------------------------------------------------------------

async function graphFetch<T>(path: string): Promise<T> {
  const res = await fetch(path, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${path}`);
  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// 1. Defender for Endpoint connector
// ---------------------------------------------------------------------------

export async function fetchEndpointAlerts(
  tenantId: string
): Promise<UnifiedAlert[]> {
  const data = await graphFetch<{ value: GraphAlertPayload[] }>(
    `/api/o365/tenants/${encodeURIComponent(tenantId)}/endpoint/alerts`
  );
  return data.value.map((a) => graphAlertToUnified(tenantId, 'o365-endpoint', a));
}

// ---------------------------------------------------------------------------
// 2. Defender for Office 365 (email) connector
// ---------------------------------------------------------------------------

export async function fetchEmailAlerts(
  tenantId: string
): Promise<UnifiedAlert[]> {
  const data = await graphFetch<{ value: GraphAlertPayload[] }>(
    `/api/o365/tenants/${encodeURIComponent(tenantId)}/email/alerts`
  );
  return data.value.map((a) => graphAlertToUnified(tenantId, 'o365-email', a));
}

// ---------------------------------------------------------------------------
// 3. Defender for Cloud Apps connector
// ---------------------------------------------------------------------------

export async function fetchCloudAppAlerts(
  tenantId: string
): Promise<UnifiedAlert[]> {
  const data = await graphFetch<{ value: GraphAlertPayload[] }>(
    `/api/o365/tenants/${encodeURIComponent(tenantId)}/cloudapp/alerts`
  );
  return data.value.map((a) => graphAlertToUnified(tenantId, 'o365-cloudapp', a));
}

// ---------------------------------------------------------------------------
// 4. Defender for Identity connector
// ---------------------------------------------------------------------------

export async function fetchIdentityAlerts(
  tenantId: string
): Promise<UnifiedAlert[]> {
  const data = await graphFetch<{ value: GraphAlertPayload[] }>(
    `/api/o365/tenants/${encodeURIComponent(tenantId)}/identity/alerts`
  );
  return data.value.map((a) => graphAlertToUnified(tenantId, 'o365-identity', a));
}

// ---------------------------------------------------------------------------
// Aggregate: fetch all O365 connectors for a tenant in parallel
// ---------------------------------------------------------------------------

export interface O365ConnectorResults {
  endpoint: UnifiedAlert[];
  email: UnifiedAlert[];
  cloudApp: UnifiedAlert[];
  identity: UnifiedAlert[];
  all: UnifiedAlert[];
}

export async function fetchAllO365Alerts(
  tenantId: string
): Promise<O365ConnectorResults> {
  const [endpoint, email, cloudApp, identity] = await Promise.all([
    fetchEndpointAlerts(tenantId),
    fetchEmailAlerts(tenantId),
    fetchCloudAppAlerts(tenantId),
    fetchIdentityAlerts(tenantId)
  ]);

  return {
    endpoint,
    email,
    cloudApp,
    identity,
    all: [...endpoint, ...email, ...cloudApp, ...identity]
  };
}
