// ---------------------------------------------------------------------------
// Microsoft Sentinel Feed Service
// ---------------------------------------------------------------------------
// Pulls Sentinel incidents and alerts (via Azure Monitor / Log Analytics)
// and normalises them into UnifiedAlert records for the tenant alert store.
//
// The backend proxy authenticates to the Sentinel workspace using Azure AD
// app credentials and forwards requests.
// ---------------------------------------------------------------------------

import type { UnifiedAlert, UnifiedSeverity, UnifiedStatus } from './tenantAlertStore.service';

// ---------------------------------------------------------------------------
// Sentinel-specific types
// ---------------------------------------------------------------------------

export type SentinelIncidentSeverity = 'High' | 'Medium' | 'Low' | 'Informational';
export type SentinelIncidentStatus = 'New' | 'Active' | 'Closed';

export interface SentinelIncident {
  id: string;
  title: string;
  description: string;
  severity: SentinelIncidentSeverity;
  status: SentinelIncidentStatus;
  classification?: 'TruePositive' | 'FalsePositive' | 'BenignPositive' | 'Undetermined';
  owner?: { assignedTo?: string };
  tactics: string[];
  alertProductNames: string[];
  createdTimeUtc: string;
  lastModifiedTimeUtc: string;
  incidentNumber: number;
  incidentUrl?: string;
}

export interface SentinelFeedResult {
  incidents: SentinelIncident[];
  alerts: UnifiedAlert[];
  lastRefreshed: string;
}

// ---------------------------------------------------------------------------
// Mapping helpers
// ---------------------------------------------------------------------------

function mapSeverity(sev: SentinelIncidentSeverity): UnifiedSeverity {
  const map: Record<SentinelIncidentSeverity, UnifiedSeverity> = {
    High: 'high', Medium: 'medium', Low: 'low', Informational: 'informational'
  };
  return map[sev] ?? 'medium';
}

function mapStatus(status: SentinelIncidentStatus): UnifiedStatus {
  const map: Record<SentinelIncidentStatus, UnifiedStatus> = {
    New: 'new', Active: 'active', Closed: 'closed'
  };
  return map[status] ?? 'active';
}

function incidentToUnified(tenantId: string, inc: SentinelIncident): UnifiedAlert {
  return {
    id: `sentinel:${inc.id}`,
    tenantId,
    source: 'sentinel',
    sourceId: inc.id,
    title: inc.title,
    description: inc.description,
    severity: mapSeverity(inc.severity),
    status: mapStatus(inc.status),
    category: inc.tactics.length > 0 ? inc.tactics[0] : 'unknown',
    createdAt: inc.createdTimeUtc,
    updatedAt: inc.lastModifiedTimeUtc,
    assignedTo: inc.owner?.assignedTo,
    raw: inc as unknown as Record<string, unknown>,
    correlatedAlertIds: [],
    tags: ['sentinel', ...inc.tactics, ...inc.alertProductNames]
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function fetchSentinelFeed(
  tenantId: string
): Promise<SentinelFeedResult> {
  const res = await fetch(
    `/api/sentinel/tenants/${encodeURIComponent(tenantId)}/incidents`,
    { headers: { Accept: 'application/json' } }
  );

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} — Sentinel incidents for ${tenantId}`);
  }

  const body = (await res.json()) as { value: SentinelIncident[] };
  const incidents = body.value;
  return {
    incidents,
    alerts: incidents.map((inc) => incidentToUnified(tenantId, inc)),
    lastRefreshed: new Date().toISOString()
  };
}
