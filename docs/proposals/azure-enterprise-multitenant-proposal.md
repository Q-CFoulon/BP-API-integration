# Proposal: Enterprise SecOps Platform on Azure (50-300 Tenants)

Date: 2026-05-13

## Executive Summary

This enterprise proposal adopts the SecOps App Revised model as the target production pattern: Entra ID Application Proxy at the identity edge, private-only application hosting, strict Dev and Prod segregation, and ISO 27001:2022-aligned controls. The platform unifies Blackpoint API case operations, Defender XDR context, and AI-assisted triage in one operational surface, while preserving a reusable framework for future AI workload onboarding.

## Leadership Output Snapshot

| Leadership Output | Enterprise Proposal Position |
| --- | --- |
| Business value | API-driven case workflows replacing portal-checking, single-pane analyst view, and AI-assisted triage and reporting |
| Strategic outcomes | Zero inbound public exposure, reusable AI production framework, VRM-owned connector patching model, and audit-ready telemetry |
| Headline economics | One-time build baseline: $9,360 (120 hours). Recurring annual baseline from revised guidance: $10,268/year before tenant-scale uplift |
| Operational target | Maintain runtime below $5,000/month at 50-300 tenants via phased scale triggers and budget guardrails |
| Decision points | VRM patch ownership, Event Hub forwarding to Quisitive IT, and go-live approval for POC port to App Service and Function Apps |

## Goals and Constraints

- Tenants: 50 to 300.
- Daily active users: 5,000 to 50,000.
- Region: East US primary, single-region initial deployment with resilience controls.
- Security posture: zero-trust identity edge, private endpoints, and ISO 27001:2022-aligned control mapping.
- Budget target: remain below $5,000/month runtime through staged scale triggers.

## SecOps Revised Architecture Alignment

### Identity and Access Perimeter

- Entra ID Application Proxy is the front door for user access.
- Pre-authentication, Conditional Access, MFA, and Identity Protection are enforced before requests reach Azure workloads.
- No public inbound application surface is exposed.

### Network and Environment Topology

- Hub-spoke virtual network model with NAT Gateway egress.
- Separate Dev and Prod subscriptions, VNets, connector groups, and Entra enterprise applications.
- App Proxy connectors run on dedicated Windows Server VMs (B2ms class), outbound 443 only.

### Application and Integration Layer

- App Service hosts the unified web platform.
- Function Apps (Windows PowerShell and Linux Python) run integration and automation workloads.
- Existing POC capabilities are ported to managed Azure runtime targets.

### Data, Secrets, and Private Connectivity

- Azure SQL or PostgreSQL for case and correlation data.
- Blob Storage for evidence and reporting artifacts.
- Key Vault with managed identity access.
- Private Endpoints for App Service, database, Key Vault, and Storage.

### Monitoring, Security, and Audit

- Defender for Cloud enabled with CSPM Standard and workload protections.
- Diagnostic Settings and Entra logs forwarded through Event Hub to Quisitive IT.
- Central Log Analytics and Application Insights with retention and archive policy.

## Multi-Tenancy Strategy

### Shared Tenant Model (Default)

- Shared app tier with tenant_id partitioning and strict policy enforcement.
- Unified case and triage views across customer tenants.
- Least-privilege RBAC and tenant-scoped authorization checks in all API paths.

### Isolated Tenant Model (Premium or Regulated)

- Dedicated data tier for selected tenants (database and storage segmentation).
- Optional dedicated compute pool for high-sensitivity workloads.
- Same control plane and observability model to preserve operational consistency.

## Recommended Enterprise Resources

| Layer | Azure Service | Enterprise Baseline | Scale Guidance |
| --- | --- | --- | --- |
| Identity edge | Entra ID App Proxy | 2 Prod connectors + 1 Dev connector | Add connector pair per significant concurrency growth |
| Hub network | Hub VNet + NAT Gateway + Private DNS | Shared egress and private resolution | Introduce Azure Firewall Basic if FQDN egress controls are required |
| Web and API | App Service Plan Linux | P1v3, 2 instances | Scale to 4-8 instances by CPU and p95 latency |
| Automation | Function Apps (Windows + Linux) | Consumption baseline | Move heavy jobs to Premium plans as execution pressure grows |
| Structured data | PostgreSQL Flexible Server or Azure SQL | General Purpose / S-tier baseline | Scale vCores and IOPS at sustained >60% utilization |
| Unstructured data | Blob Storage | Hot + lifecycle to Cool/Archive | Add immutable policies for audit containers |
| Secrets | Key Vault | RBAC mode + private endpoint | Enforce purge protection in Prod |
| Security posture | Defender for Cloud | CSPM + workload protections | Keep parity between Dev and Prod allocations |
| Telemetry | App Insights + Log Analytics + Event Hub | Centralized diagnostics forwarding | Increase retention and archive periods for compliance demand |

## Enterprise Delivery Model (SecOps Revised)

1. Platform foundation: create repository structure, environment gates, and policy baseline.
1. AI-assisted IaC and policy authoring: generate, review, and harden Bicep or Terraform plus Azure Policy initiative.
1. Hub-spoke deployment: establish hub networking, spoke VNets, peering, UDRs, NAT, and Private DNS.
1. Data and secret plane: deploy database, storage, Key Vault, and Private Endpoints with public access disabled.
1. App Proxy deployment: provision connector VMs, install connectors, and bind environment-specific connector groups.
1. Entra publish and access controls: configure App Proxy enterprise applications, Conditional Access, and risk policies.
1. Workload deployment: deploy App Service and Function Apps; port POC logic to managed runtime.
1. Observability and governance: enable Defender plans, Diagnostic Settings, Event Hub forwarding, and alerting.
1. CI and CD hardening: enforce Dev auto-deploy, Prod approval gates, and smoke testing.
1. Readiness and cutover: perform tabletop security tests, failover tests, and go-live approval.

## Leadership Economics View

### Baseline Financial Outputs from SecOps Revised Guidance

| Metric | Baseline Value |
| --- | --- |
| One-time build | $9,360 |
| Recurring annual cost | $10,268/year |
| Annual labor savings (current load) | $36,864/year |
| Payback period | ~4.2 months baseline |
| Year-1 ROI | ~88% baseline |
| Year-2+ ROI | ~259% baseline |

### Enterprise Runtime Envelope (50-300 Tenants)

| Scenario | Tenant Count | DAU | Monthly Runtime Estimate |
| --- | --- | --- | --- |
| Low | 50 | 5,000 | $1,450 |
| Target | 150 | 20,000 | $3,250 |
| Upper Growth | 300 | 50,000 | $4,900 |

| Category | Low | Target | Upper Growth |
| --- | --- | --- | --- |
| Entra App Proxy connectors and edge controls | $210 | $360 | $520 |
| App Service and Functions | $430 | $1,150 | $1,780 |
| Database and storage | $210 | $620 | $960 |
| Security and telemetry (Defender, Logs, Event Hub) | $330 | $760 | $1,140 |
| Network and platform overhead | $270 | $360 | $500 |
| Total | $1,450 | $3,250 | $4,900 |

## Governance, Security, and ISO Alignment

- Entra ID-only authentication with Conditional Access and MFA.
- No public inbound application access; connector outbound 443 model.
- Managed identities and Key Vault for secret hygiene.
- Private endpoint access for all critical data plane services.
- Defender CSPM and workload protections enabled in both environments.
- Diagnostic forwarding to Quisitive IT for centralized monitoring.
- Direct support for ISO-aligned controls including access control, secure authentication, logging, monitoring, network segregation, and Dev/Prod separation.

## Decision Points for Leadership Approval

1. Confirm Spyglass VRM team ownership of App Proxy connector VM patching and evidence reporting.
1. Confirm Quisitive IT Event Hub integration readiness for Dev and Prod telemetry.
1. Approve POC migration timeline to App Service and Function Apps with production go-live window.

## Scope Boundaries

### Included

- SecOps revised architecture alignment for identity edge, private networking, and telemetry.
- Enterprise delivery sequence and operating model.
- Leadership-oriented output package: economics, ROI baseline, and decision points.

### Excluded

- Full implementation code and IaC module artifacts.
- Multi-region active-active disaster recovery build-out.
- Final production runbooks and incident playbooks.

## Final Recommendation

Proceed with the SecOps Revised architecture as the enterprise target state: Entra App Proxy identity edge, private-only service connectivity, strict Dev and Prod segregation, and reusable AI production framework controls. This delivers the leadership outputs requested while preserving a practical cost envelope for 50-300 tenant growth.
