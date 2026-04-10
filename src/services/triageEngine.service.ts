// ---------------------------------------------------------------------------
// Triage & Automation Recommendation Engine
// ---------------------------------------------------------------------------
// Consumes unified alerts from the tenant alert store and produces:
//   1. A prioritised triage queue for SOC responders
//   2. Automation recommendations (actions that can be executed via MCP)
//   3. Mitigation playbook suggestions based on MITRE ATT&CK category
//
// The engine is stateless — callers pass in the full set of active alerts
// and the engine returns the prioritised output.
// ---------------------------------------------------------------------------

import type { UnifiedAlert, UnifiedSeverity, AlertSource } from './tenantAlertStore.service';
import type { ResponseRecommendation } from './defenderMcp.service';

// ---------------------------------------------------------------------------
// Output types
// ---------------------------------------------------------------------------

export interface TriageItem {
  alert: UnifiedAlert;
  priorityScore: number;
  priorityLabel: 'P1-Critical' | 'P2-High' | 'P3-Medium' | 'P4-Low';
  suggestedOwner: string;
  suggestedActions: string[];
  relatedAlertCount: number;
  ageMinutes: number;
}

export interface MitigationPlaybook {
  category: string;
  title: string;
  steps: string[];
  automationHints: string[];
}

export interface TriageEngineResult {
  queue: TriageItem[];
  automationRecommendations: ResponseRecommendation[];
  playbooks: MitigationPlaybook[];
  summary: TriageEngineSummary;
}

export interface TriageEngineSummary {
  totalAlerts: number;
  p1Count: number;
  p2Count: number;
  p3Count: number;
  p4Count: number;
  averageAgeMinutes: number;
  sourceCoverage: Partial<Record<AlertSource, number>>;
  topCategory: string;
}

// ---------------------------------------------------------------------------
// Priority scoring
// ---------------------------------------------------------------------------

const SEVERITY_WEIGHT: Record<UnifiedSeverity, number> = {
  critical: 100,
  high: 60,
  medium: 30,
  low: 10,
  informational: 2
};

function ageMinutes(iso: string): number {
  return Math.max(0, (Date.now() - new Date(iso).getTime()) / 60000);
}

function computePriorityScore(alert: UnifiedAlert, relatedCount: number): number {
  const sevWeight = SEVERITY_WEIGHT[alert.severity] ?? 10;
  const age = ageMinutes(alert.createdAt);

  // Time-decay multiplier — older unresolved alerts gain urgency
  const ageFactor = 1 + Math.log2(1 + age / 60); // ~1 at 0h, ~4 at 8h, ~5.6 at 24h

  // Cross-source correlation bonus — if multiple sources report related alerts
  const correlationBonus = relatedCount * 15;

  // Source weight — Sentinel incidents and Defender MCP actions are higher signal
  const sourceBonus =
    alert.source === 'sentinel' ? 20
    : alert.source === 'defender-mcp' ? 15
    : alert.source === 'defender-xdr' ? 10
    : 0;

  return Math.round(sevWeight * ageFactor + correlationBonus + sourceBonus);
}

function priorityLabel(score: number): TriageItem['priorityLabel'] {
  if (score >= 200) return 'P1-Critical';
  if (score >= 100) return 'P2-High';
  if (score >= 40) return 'P3-Medium';
  return 'P4-Low';
}

// ---------------------------------------------------------------------------
// Owner suggestion
// ---------------------------------------------------------------------------

function suggestOwner(alert: UnifiedAlert): string {
  if (alert.source === 'blackpoint' || alert.source === 'defender-xdr') {
    if (alert.severity === 'critical') return 'Blackpoint MDR + Quisitive SecOps';
    return 'Blackpoint MDR';
  }
  if (alert.source === 'o365-email' || alert.source === 'o365-cloudapp') {
    return 'Quisitive SecOps';
  }
  if (alert.source === 'sentinel') {
    if (alert.severity === 'critical' || alert.severity === 'high') return 'Quisitive SecOps';
    return 'SOC Tier 1';
  }
  if (alert.source === 'defender-mcp') {
    return 'Blackpoint MDR';
  }
  if (alert.source === 'o365-endpoint') {
    return 'Blackpoint MDR + Customer IT';
  }
  if (alert.source === 'o365-identity') {
    return 'Quisitive SecOps + Customer IT';
  }
  return 'SOC Tier 1';
}

// ---------------------------------------------------------------------------
// Suggested actions based on category / tags
// ---------------------------------------------------------------------------

function suggestActions(alert: UnifiedAlert): string[] {
  const cat = alert.category.toLowerCase();
  const tags = alert.tags.map((t) => t.toLowerCase());

  const actions: string[] = [];

  if (cat.includes('phishing') || tags.includes('phishing')) {
    actions.push('Run message trace to identify all affected recipients');
    actions.push('Purge delivered phishing messages via Content Search');
    actions.push('Reset credentials for users who clicked the link');
  }
  if (cat.includes('ransomware') || tags.includes('ransomware')) {
    actions.push('Isolate affected hosts immediately');
    actions.push('Collect investigation package for forensics');
    actions.push('Check for lateral movement indicators');
    actions.push('Validate backup integrity before considering recovery');
  }
  if (cat.includes('credential') || cat.includes('brute') || tags.includes('password-spray')) {
    actions.push('Block the source IP at the firewall/conditional access level');
    actions.push('Reset passwords for targeted accounts');
    actions.push('Verify MFA enrollment for all affected accounts');
  }
  if (cat.includes('lateral') || tags.includes('lateral-movement')) {
    actions.push('Map the lateral movement path using session logs');
    actions.push('Isolate the origin and destination hosts');
    actions.push('Rotate service account credentials used in the path');
  }
  if (cat.includes('exfiltration') || tags.includes('data-exfiltration')) {
    actions.push('Identify the scope of data accessed or transferred');
    actions.push('Block the external destination at the proxy/firewall');
    actions.push('Notify data governance team for impact assessment');
  }
  if (cat.includes('oauth') || tags.includes('oauth')) {
    actions.push('Review the app consent grant and revoke if unauthorized');
    actions.push('Check for other consents from the same user');
    actions.push('Enable admin consent workflow to prevent future shadow consents');
  }
  if (cat.includes('execution') || tags.includes('powershell')) {
    actions.push('Restrict code execution on the affected device');
    actions.push('Review the process tree and parent-child relationships');
    actions.push('Collect memory dump if active implant is suspected');
  }

  if (actions.length === 0) {
    actions.push('Review the alert details and determine scope');
    actions.push('Escalate to Tier 2 if initial triage is inconclusive');
  }

  return actions;
}

// ---------------------------------------------------------------------------
// Mitigation playbooks by category
// ---------------------------------------------------------------------------

const PLAYBOOKS: MitigationPlaybook[] = [
  {
    category: 'phishing',
    title: 'Phishing Response Playbook',
    steps: [
      '1. Identify all recipients via message trace',
      '2. Purge delivered messages using Content Search & Purge',
      '3. Block sender domain/IP in Exchange transport rules',
      '4. Reset credentials for users who interacted with the payload',
      '5. Check for forwarding rules created post-compromise',
      '6. Notify affected users and conduct awareness follow-up'
    ],
    automationHints: ['Message trace can be automated via Graph API', 'Content purge can be triggered via Security & Compliance PowerShell']
  },
  {
    category: 'credential-attack',
    title: 'Credential Attack Response Playbook',
    steps: [
      '1. Block source IPs in Conditional Access named locations',
      '2. Force password reset for targeted accounts',
      '3. Revoke active refresh tokens',
      '4. Verify MFA registration and enforce re-registration if compromised',
      '5. Review sign-in logs for successful authentications from the attacker',
      '6. Check for persistence mechanisms (app registrations, mail rules)'
    ],
    automationHints: ['IP blocking via Conditional Access API', 'Token revocation via Graph revokeSignInSessions']
  },
  {
    category: 'ransomware',
    title: 'Ransomware Containment Playbook',
    steps: [
      '1. Immediately isolate affected devices via Defender MCP',
      '2. Collect investigation packages for forensic analysis',
      '3. Identify the ransomware variant and check for decryptors',
      '4. Map lateral movement to identify all compromised hosts',
      '5. Validate backup integrity — ensure backups are not encrypted',
      '6. Coordinate with legal/IR for breach notification if needed',
      '7. Rebuild affected systems from clean images'
    ],
    automationHints: ['Device isolation via MCP Isolate action', 'Investigation package collection via MCP CollectInvestigationPackage']
  },
  {
    category: 'lateral-movement',
    title: 'Lateral Movement Containment Playbook',
    steps: [
      '1. Isolate the source and destination hosts',
      '2. Review authentication logs for credential reuse',
      '3. Rotate all service account passwords used in the path',
      '4. Check for golden ticket / pass-the-hash indicators',
      '5. Segment the network to limit further movement',
      '6. Deploy decoy accounts/honeypots to detect ongoing movement'
    ],
    automationHints: ['Host isolation via MCP', 'Service account rotation can be scripted via PowerShell']
  },
  {
    category: 'data-exfiltration',
    title: 'Data Exfiltration Response Playbook',
    steps: [
      '1. Block the external destination at proxy/firewall',
      '2. Identify all files accessed and transferred',
      '3. Determine data classification of exfiltrated content',
      '4. Revoke access for the compromised account',
      '5. Notify data governance / compliance team',
      '6. Assess regulatory notification requirements (GDPR, HIPAA, etc.)'
    ],
    automationHints: ['URL/IP blocking via Defender for Cloud Apps policy', 'File access audit via Graph Security API']
  },
  {
    category: 'oauth-governance',
    title: 'OAuth App Governance Playbook',
    steps: [
      '1. Review the consent grant details (permissions, scope)',
      '2. Revoke consent if unauthorized',
      '3. Disable the enterprise application in Azure AD',
      '4. Check for other shadow app consents from the same user',
      '5. Enable admin consent workflow organization-wide',
      '6. Audit historical app consent grants across the tenant'
    ],
    automationHints: ['App consent revocation via Graph API', 'Admin consent workflow via Azure AD portal settings']
  }
];

function findPlaybooks(alerts: UnifiedAlert[]): MitigationPlaybook[] {
  const categories = new Set<string>();
  for (const a of alerts) {
    const cat = a.category.toLowerCase();
    const tags = a.tags.map((t) => t.toLowerCase());

    if (cat.includes('phishing') || tags.includes('phishing')) categories.add('phishing');
    if (cat.includes('credential') || tags.includes('password-spray') || tags.includes('brute-force')) categories.add('credential-attack');
    if (cat.includes('ransomware') || tags.includes('ransomware')) categories.add('ransomware');
    if (cat.includes('lateral') || tags.includes('lateral-movement')) categories.add('lateral-movement');
    if (cat.includes('exfiltration') || tags.includes('data-exfiltration')) categories.add('data-exfiltration');
    if (cat.includes('oauth') || tags.includes('oauth')) categories.add('oauth-governance');
  }

  return PLAYBOOKS.filter((p) => categories.has(p.category));
}

// ---------------------------------------------------------------------------
// Automation recommendations from alert patterns
// ---------------------------------------------------------------------------

function buildAutomationRecommendations(alerts: UnifiedAlert[]): ResponseRecommendation[] {
  const recs: ResponseRecommendation[] = [];

  const criticalEndpoint = alerts.filter(
    (a) => (a.source === 'o365-endpoint' || a.source === 'defender-xdr') && a.severity === 'critical' && a.status !== 'resolved'
  );
  for (const a of criticalEndpoint) {
    recs.push({
      priority: 'immediate',
      action: `Auto-isolate device associated with alert "${a.title}"`,
      rationale: 'Critical endpoint alert requires immediate containment to prevent lateral spread.',
      automatable: true,
      mcpAction: 'Isolate'
    });
  }

  const identityAlerts = alerts.filter(
    (a) => (a.source === 'o365-identity' || a.source === 'sentinel') &&
           a.category.toLowerCase().includes('credential') &&
           a.status !== 'resolved'
  );
  if (identityAlerts.length > 0) {
    recs.push({
      priority: 'urgent',
      action: 'Force password reset and revoke sessions for all accounts targeted in credential attacks.',
      rationale: `${identityAlerts.length} active credential-based alert(s) detected across identity feeds.`,
      automatable: true
    });
  }

  const emailAlerts = alerts.filter(
    (a) => a.source === 'o365-email' && a.severity !== 'low' && a.status !== 'resolved'
  );
  if (emailAlerts.length > 0) {
    recs.push({
      priority: 'urgent',
      action: 'Trigger automated message trace and purge for active email threats.',
      rationale: `${emailAlerts.length} email threat(s) require rapid remediation to limit end-user exposure.`,
      automatable: true
    });
  }

  return recs.sort((a, b) => {
    const rank = { immediate: 0, urgent: 1, standard: 2 };
    return rank[a.priority] - rank[b.priority];
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function runTriageEngine(
  alerts: UnifiedAlert[],
  mcpRecommendations?: ResponseRecommendation[]
): TriageEngineResult {
  // Only triage non-resolved alerts
  const active = alerts.filter((a) => a.status !== 'resolved' && a.status !== 'closed');

  // Build triage queue
  const queue: TriageItem[] = active.map((alert) => {
    const relatedCount = alert.correlatedAlertIds.length;
    const score = computePriorityScore(alert, relatedCount);
    return {
      alert,
      priorityScore: score,
      priorityLabel: priorityLabel(score),
      suggestedOwner: suggestOwner(alert),
      suggestedActions: suggestActions(alert),
      relatedAlertCount: relatedCount,
      ageMinutes: Math.round(ageMinutes(alert.createdAt))
    };
  }).sort((a, b) => b.priorityScore - a.priorityScore);

  // Automation recommendations
  const automationRecs = [
    ...buildAutomationRecommendations(active),
    ...(mcpRecommendations ?? [])
  ];

  // Playbooks
  const playbooks = findPlaybooks(active);

  // Summary
  const sourceCoverage: Partial<Record<AlertSource, number>> = {};
  const categoryCounts: Record<string, number> = {};
  let totalAge = 0;
  for (const item of queue) {
    sourceCoverage[item.alert.source] = (sourceCoverage[item.alert.source] ?? 0) + 1;
    const cat = item.alert.category;
    categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1;
    totalAge += item.ageMinutes;
  }
  const topCategory = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] ?? 'none';

  return {
    queue,
    automationRecommendations: automationRecs,
    playbooks,
    summary: {
      totalAlerts: queue.length,
      p1Count: queue.filter((i) => i.priorityLabel === 'P1-Critical').length,
      p2Count: queue.filter((i) => i.priorityLabel === 'P2-High').length,
      p3Count: queue.filter((i) => i.priorityLabel === 'P3-Medium').length,
      p4Count: queue.filter((i) => i.priorityLabel === 'P4-Low').length,
      averageAgeMinutes: queue.length > 0 ? Math.round(totalAge / queue.length) : 0,
      sourceCoverage,
      topCategory
    }
  };
}
