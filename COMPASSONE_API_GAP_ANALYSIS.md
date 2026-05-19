# CompassOne API v1.7.0 — Gap Analysis

> **Date:** 2025-05-19
> **Scope:** Compare current BP-API-integration codebase against the full CompassOne OpenAPI spec (v1.7.0)
> **Purpose:** Identify unused endpoints, missing UI capabilities, and risk-decision gaps

---

## Executive Summary

The current tool covers **~18%** of the CompassOne API surface. It uses the **Detections**, **Tenants**, **Reports**, and basic **Assets** endpoints well, but is missing **7 major API domains** that are critical for risk decisions:

| Domain | Endpoints Available | Endpoints Used | Coverage |
|--------|-------------------|----------------|----------|
| Detections (alert-groups) | 7 | **7** | 100% |
| Tenants | 3 | **2** | 67% |
| Reports | 4 | **4** | 100% |
| Assets | 3 | **1** (count only) | 33% |
| Accounts | 3 | **0** | 0% |
| Users | 9 | **0** | 0% |
| Security Posture (SPR) | 8 | **0** | 0% |
| Vulnerability Management | 25+ | **0** | 0% |
| Cloud MDR (M365/Cisco/Google) | 15+ | **0** | 0% |
| Cloud Posture (Managed Policies) | 7 | **0** | 0% |
| Event Signal (Notifications) | 14 | **0** | 0% |
| Collections | 5 | **0** | 0% |
| Contact Groups | 10 | **0** | 0% |

---

## CRITICAL GAPS (High Risk-Decision Impact)

### 1. Security Posture Rating (SPR) — ENTIRELY MISSING

**Why it matters:** SPR provides the quantified security health score per tenant. Without it, operators cannot make risk-informed prioritization decisions or track security improvement over time.

| Endpoint | Method | Description | Risk Decision |
|----------|--------|-------------|---------------|
| `/v1/security-posture/account/all-ratings` | GET | All tenant SPR scores | Which tenants are highest risk? |
| `/v1/security-posture/rating` | GET | Current tenant's SPR score + metric breakdown | What is actual security health? |
| `/v1/security-posture/rating/categories` | GET | Operational & NIST category breakdown | Where are the control gaps? |
| `/v1/security-posture/rating/history` | GET | SPR trend (1/6/12 months) | Is posture improving or degrading? |
| `/v1/security-posture/metric-attestation/all` | GET | All attestations | What has the MSP attested to? |
| `/v1/security-posture/metric-attestation` | POST | Create attestation | Mark metrics as met |
| `/v1/security-posture/metric-attestation/attestable-metrics` | GET | What can be attested | What's actionable? |
| `/v1/security-posture/metric-attestation/bulk` | POST/DELETE | Bulk attest/delete | Multi-tenant governance |

**UI Needed:**
- SPR Score card per tenant (with trend sparkline)
- Cross-tenant SPR leaderboard/heatmap
- NIST/Operational category breakdown radar chart
- Attestation management panel (view, create, bulk attest)

---

### 2. Vulnerability Management — ENTIRELY MISSING

**Why it matters:** This is a complete vulnerability scanner platform built into CompassOne. Without it, the tool cannot surface patch priorities, track remediation, or correlate detections with known vulnerabilities.

| Endpoint | Method | Description | Risk Decision |
|----------|--------|-------------|---------------|
| `/v1/vulnerability-management/vulnerabilities` | GET | List all vulnerabilities (paginated, filterable) | What CVEs affect our tenants? |
| `/v1/vulnerability-management/vulnerabilities/{id}` | GET | Vulnerability detail | Full CVE context |
| `/v1/vulnerability-management/vulnerabilities/{id}/assets` | GET | Affected assets per CVE | Which devices are exposed? |
| `/v1/vulnerability-management/vulnerabilities/stats/count-by-severity` | GET | Severity distribution | How critical is the vuln backlog? |
| `/v1/vulnerability-management/vulnerabilities/stats/count-by-tenant` | GET | Per-tenant vuln counts | Which tenants are most exposed? |
| `/v1/vulnerability-management/vulnerabilities/{id}/update-status-for-devices` | PATCH | Update vuln status for specific devices | Track remediation progress |
| `/v1/vulnerability-management/vulnerabilities/bulk-actions/update` | PATCH | Bulk status update | Mass triage |
| `/v1/vulnerability-management/vulnerabilities/export` | POST | Export vuln data | Compliance reporting |
| `/v1/vulnerability-management/scans` | GET/POST | List/create scans | On-demand scanning |
| `/v1/vulnerability-management/scans/{id}` | GET/PATCH/DELETE | Manage scans | Scan lifecycle |
| `/v1/vulnerability-management/scans/{id}/cves` | GET | CVEs found in scan | Scan results |
| `/v1/vulnerability-management/scans/{id}/cancel` | PATCH | Cancel running scan | Operational control |
| `/v1/vulnerability-management/scan-schedules` | GET/POST | Scan schedules | Automation |
| `/v1/vulnerability-management/scan-schedules/{id}/run` | POST | Trigger scheduled scan | On-demand execution |
| `/v1/vulnerability-management/scans-and-schedules` | GET | Combined view | Full scan inventory |
| `/v1/vulnerability-management/scans-and-schedules/stats` | GET | Scan statistics | Coverage visibility |
| `/v1/vulnerability-management/cves/{id}` | GET | CVE detail | Research context |
| `/v1/vulnerability-management/cves/{id}/references` | GET | CVE references/links | Remediation guidance |
| `/v1/vulnerability-management/external/scan/exposures/{id}` | GET | External scan exposures | Internet-facing risk |
| `/v1/vulnerability-management/external/scan/report/{id}` | GET | External scan report | Perimeter assessment |
| `/v1/vulnerability-management/darkweb/scan/exposures` | GET | Dark web credential exposures | Credential leak risk |
| `/v1/vulnerability-management/darkweb/scan/report` | GET | Dark web scan report | Breach exposure summary |

**UI Needed:**
- Vulnerability dashboard (severity heatmap, count-by-tenant, trending)
- CVE detail drill-down (affected assets, references, remediation links)
- Scan management panel (create, schedule, monitor, cancel)
- Dark web exposure viewer (credential leaks with password/username flags)
- External attack surface panel (internet-facing exposures)
- Bulk vuln triage actions (accept risk, mark remediated, suppress)
- Export capabilities for compliance reporting

---

### 3. Cloud Posture (Managed Policies) — ENTIRELY MISSING

**Why it matters:** Controls the M365 security policy baselines pushed to tenants. Without this, the tool cannot show policy compliance, drift, or enforce baselines.

| Endpoint | Method | Description | Risk Decision |
|----------|--------|-------------|---------------|
| `/v1/cloud-posture/managed-policies/scope/{scopeType}/{scopeId}` | GET | Policies by scope | What policies apply where? |
| `/v1/cloud-posture/managed-policies/{id}` | GET/PUT/DELETE | CRUD policy | Manage baselines |
| `/v1/cloud-posture/managed-policies` | POST | Create policy | Enforce new controls |
| `/v1/cloud-posture/managed-policies/bulk-delete` | POST | Bulk delete | Cleanup |
| `/v1/cloud-posture/managed-policies/{id}/assignments` | POST | Assign to connections | Apply to tenants |
| `/v1/cloud-posture/managed-policies/{id}/save-as-template` | POST | Template creation | Standardize |

**UI Needed:**
- Policy inventory with assignment status
- Policy compliance dashboard (drift detection indicators)
- Assign/unassign policies to tenant connections
- Template management

---

### 4. Cloud MDR Connections (M365, Cisco, Google) — ENTIRELY MISSING

**Why it matters:** These endpoints manage the cloud tenant connections and user geo-fencing that drive Cloud MDR alerting. Without visibility here, operators cannot verify onboarding status, manage approved countries, or audit user access.

| Endpoint Group | Endpoints | Risk Decision |
|----------------|-----------|---------------|
| M365 Customer/Connections | `/v1/cloud/ms365/customer`, `/v1/cloud/ms365/connections/{id}` | Is Cloud MDR connected? |
| M365 ISO Country management | `.../iso-country` (GET/POST/DELETE) | Geo-fencing config |
| M365 Users + Active Countries | `.../users`, `.../active-countries` | Who is monitored? From where? |
| Cisco Onboardings | `/v1/cloud/cisco/onboardings` (CRUD + post-provision + complete) | Cisco integration status |
| Google Onboardings | `/v1/cloud/google/onboardings` | Google Workspace status |
| Generic Connection Users | `/v1/cloud/connections/{id}/users` | Cross-platform user visibility |
| Approved Countries (connection-level) | `/v1/cloud/connections/{id}/approved-countries` | Global geo-fence rules |
| User-level Approved Countries | `.../users/{userId}/approved-countries` | Per-user overrides |
| ISO Country reference | `/v1/cloud/iso-countries`, `/v1/cloud/iso-countries/{code}` | Reference data |

**UI Needed:**
- Cloud MDR connection health dashboard (M365, Cisco, Google statuses)
- Geo-fencing management (approved countries per connection and per user)
- User monitoring list with active country visualization
- Onboarding workflow status tracker

---

### 5. Asset Management (Deep) — MOSTLY MISSING

**Why it matters:** The current tool only fetches asset _counts_. The full API provides searchable, filterable, relationship-mapped asset inventory across 11 classes (DEVICE, USER, SOFTWARE, SERVICE, etc.)

| Endpoint | Currently Used | Missing Capability |
|----------|---------------|-------------------|
| `/v1/assets` | Count only (`class[]=DEVICE\|USER`) | Full asset search, filtering by platform/type/source/status, pagination |
| `/v1/assets/{id}` | Not used | Asset detail (device specs, user info, software inventory) |
| `/v1/assets/{id}/relationships` | Not used | Asset relationship graph (device→user, device→software, device→vulnerability) |

**UI Needed:**
- Full asset inventory browser (searchable, filterable by class/platform/type)
- Asset detail panel (properties, tags, sources, last seen, decommission status)
- Relationship graph visualization (which users use which devices, what software is installed)
- Windows Defender status filtering (wdStatus parameter)
- Decommissioned asset tracking

---

### 6. Account & User Management — ENTIRELY MISSING

**Why it matters:** Multi-tenant MSP governance requires visibility into who has access to what. Currently zero visibility into CompassOne user access.

| Endpoint | Method | Risk Decision |
|----------|--------|---------------|
| `/v1/accounts` | GET | Which accounts exist? |
| `/v1/accounts/{id}` | GET | Account detail + branding |
| `/v1/accounts/{id}/users` | GET/POST | Who has access? Invite new users |
| `/v1/users` | GET | All users across accounts |
| `/v1/users/{id}` | DELETE | Remove access |
| `/v1/users/{id}/reset-password` | POST | Force password reset (incident response) |
| `/v1/accounts/{id}/users/{userId}` | PUT/DELETE | Update roles, remove users |
| `/v1/accounts/{id}/tenants/{tenantId}/users` | GET/POST/DELETE | Tenant-level access control |
| `/v1/accounts/{id}/tenants/{tenantId}/unassigned-users` | GET | Who hasn't been assigned? |

**UI Needed:**
- Account overview panel
- User access matrix (who can see which tenants)
- User invite/removal workflow
- Password reset trigger (for incident response)
- Role management (assign/change RBAC roles)

---

### 7. Event Signal / Notification Channels — ENTIRELY MISSING

**Why it matters:** Controls how alerts are delivered (email, webhook). Without this, operators cannot configure or audit alert routing.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/event-signal/channels/list` | POST | List all notification channels |
| `/v1/event-signal/email-channels` | POST (create) | Create email channel |
| `/v1/event-signal/email-channels/{id}` | GET/PATCH/DELETE | Manage email channel |
| `/v1/event-signal/email-channels/{id}/duplicate` | POST | Clone channel |
| `/v1/event-signal/email-channels/{id}/test` | POST | Send test notification |
| `/v1/event-signal/email-channels/list` | POST | List email channels |
| `/v1/event-signal/webhook-channels` | POST (create) | Create webhook |
| `/v1/event-signal/webhook-channels/{id}` | GET/PATCH/DELETE | Manage webhook |
| `/v1/event-signal/webhook-channels/{id}/duplicate` | POST | Clone webhook |
| `/v1/event-signal/webhook-channels/{id}/test` | POST | Test webhook delivery |
| `/v1/event-signal/webhook-channels/list` | POST | List webhooks |
| `/v1/event-signal/blocklist` | POST/DELETE | Block specific signals |
| `/v1/event-signal/blocklist/check` | GET | Check if signal is blocked |

**UI Needed:**
- Notification channel inventory (email + webhook)
- Channel health status (test results)
- Create/edit/duplicate channel workflow
- Blocklist management
- Test notification trigger buttons

---

### 8. Contact Groups — ENTIRELY MISSING

**Why it matters:** Contact groups define escalation paths and notification routing per tenant. Essential for incident response governance.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/accounts/{id}/contact-groups` | GET/POST/DELETE | List, create, bulk delete groups |
| `/v1/accounts/{id}/contact-groups/{groupId}` | GET/PUT/DELETE | Manage individual group |
| `.../contact-groups/{groupId}/tenants` | GET/POST | Assign tenants to contact group |
| `.../contact-groups/{groupId}/unassigned-tenants` | GET | Which tenants lack this group? |
| `.../contact-groups/{groupId}/members` | GET/POST | Manage group members |
| `.../contact-groups/{groupId}/members/{memberId}` | GET/DELETE | Individual member CRUD |

**UI Needed:**
- Contact group directory with member counts
- Group-to-tenant assignment matrix
- Member management (add/remove, availability settings)
- Escalation path visualization

---

### 9. Collections — ENTIRELY MISSING

**Why it matters:** Collections allow grouping assets for targeted analysis, reporting, and policy application.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/collections` | GET/POST | List and create collections |
| `/v1/collections/{id}` | GET/PATCH/DELETE | Manage collections |

**UI Needed:**
- Collection browser with asset counts
- Create/edit collection UI
- Add/remove assets from collections

---

## MODERATE GAPS (Currently Partially Covered)

### Tenants

| Endpoint | Status | Gap |
|----------|--------|-----|
| `/v1/tenants` | ✅ Used | — |
| `/v1/accounts/{accountId}/tenants/{tenantId}` | ❌ Not used | Cannot get detailed tenant info (with account context) |

### Assets

| Endpoint | Status | Gap |
|----------|--------|-----|
| `/v1/assets` (full query) | ⚠️ Partial | Only uses `class[]` for count; missing search, filter, sort, pagination |
| `/v1/assets/{id}` | ❌ Not used | No asset detail drill-down |
| `/v1/assets/{id}/relationships` | ❌ Not used | No asset graph |

---

## RISK DECISION IMPACT MATRIX

| Risk Decision | Required API Domain | Currently Possible? |
|---------------|--------------------|--------------------|
| "Which tenant is most at risk?" | SPR + Vuln Stats + Detections | ⚠️ Partial (detections only) |
| "What CVEs affect our environment?" | Vulnerability Management | ❌ No |
| "Are credentials leaked on dark web?" | VM Dark Web Scans | ❌ No |
| "What is our external attack surface?" | VM External Scans | ❌ No |
| "Are security policies in compliance?" | Cloud Posture | ❌ No |
| "Is Cloud MDR properly onboarded?" | Cloud MDR Connections | ❌ No |
| "Who has access to what?" | Users + Accounts | ❌ No |
| "How will alerts be delivered?" | Event Signal Channels | ❌ No |
| "Who gets called during an incident?" | Contact Groups | ❌ No |
| "Is security posture improving?" | SPR History | ❌ No |
| "What assets are unmanaged?" | Assets (full query) | ❌ No |
| "What software is installed?" | Assets (SOFTWARE class) | ❌ No |
| "Which devices lack Windows Defender?" | Assets (wdStatus filter) | ❌ No |
| "Can we force a password reset?" | Users reset-password | ❌ No |
| "Can we trigger a vulnerability scan?" | VM Scans POST/Schedule | ❌ No |

---

## RECOMMENDED IMPLEMENTATION PRIORITY

### Phase 1 — Immediate (Risk Visibility)

1. **Security Posture Rating** — Provides the single most important risk metric
2. **Vulnerability Management (read-only)** — Vuln counts by severity/tenant, CVE details, dark web exposures
3. **Asset Inventory (full)** — Replace count-only with searchable inventory + relationships

### Phase 2 — Short-term (Operational Control)

4. **Cloud MDR Connection Status** — Onboarding verification and geo-fence visibility
5. **Cloud Posture / Managed Policies** — Policy compliance and drift detection
6. **Event Signal Channels** — Alert delivery audit and configuration

### Phase 3 — Governance & Access

7. **Account & User Management** — Access control visibility and incident response actions
8. **Contact Groups** — Escalation path management
9. **Collections** — Asset grouping for policy/reporting

### Phase 4 — Advanced Operations

10. **Vulnerability Management (write)** — Scan creation, scheduling, bulk triage
11. **Metric Attestation** — SPR attestation workflow
12. **Full Cloud MDR management** — User-level approved countries, onboarding workflows

---

## CURRENT STRENGTHS

The tool excels at:
- ✅ Full detection lifecycle (open → closed, with risk scores and alert types)
- ✅ Native report integration (PDF, JSON, binary)
- ✅ Multi-source correlation (Blackpoint ↔ Defender XDR ↔ Sentinel ↔ O365)
- ✅ Prioritized triage engine with automation recommendations
- ✅ Analyst override workflow for correlation decisions
- ✅ Closeout governance and reconciliation tracking
- ✅ Mitigation playbooks
- ✅ Device health from Defender MCP

These remain solid. The gaps are in **proactive risk posture** (SPR, vulns, policies, assets) and **administrative governance** (users, contacts, channels).
