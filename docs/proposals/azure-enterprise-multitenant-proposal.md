# Proposal: Enterprise SecOps Platform on Azure (50-300 Tenants)

Date: 2026-05-13

## Executive Summary

The proposed SecOps platform integrates Spyglass MDR and SecOps services with the Blackpoint API and customer Microsoft Defender XDR tenants, replacing manual portal-checking with a unified case tracking, response, and AI-assisted triage surface. Delivery aligns with the SecOps App Revised model: Entra ID Application Proxy at the edge, private-only workload access, strict Dev and Prod separation, and ISO 27001:2022-aligned controls.

### Business Value

- API-driven case operations across Spyglass MDR and SecOps customers.
- Single-pane analyst experience across Blackpoint and Defender XDR context.
- Secure host for Copilot Studio and Cowork workflows for triage, response, evidence capture, and reporting.

### Strategic Outcomes

- Zero inbound public workload exposure through App Proxy connector outbound model.
- Reusable AI production framework for near-zero marginal onboarding cost for future applications.
- VRM service refinement through connector VM ownership, patching evidence, and SLA discipline.
- Audit-ready telemetry posture via Defender for Cloud and centralized diagnostics forwarding.

### Headline Economics

| Metric | Value |
| --- | --- |
| One-time build (AI-accelerated) | $9,360 (120 hours) |
| Recurring annual cost | $10,268/year |
| Annual labor savings (baseline) | $36,864/year |
| Build labor split (40/60 model) | Onshore $6,000 (50 hours) and Offshore $3,360 (70 hours) |
| Baseline labor savings split (40/60 model) | Onshore $23,040/year and Offshore $13,824/year |
| Payback period | ~4.2 months baseline |
| Year-1 ROI | ~88% baseline |
| Year-2+ ROI | ~259% baseline |

### Executive Decision Points

1. Confirm Spyglass VRM ownership for connector VM patching and evidence reporting.
1. Confirm Quisitive IT readiness for Event Hub log forwarding from both environments.
1. Approve POC port to App Service and Function Apps with production go-live window.

## Leadership Output Snapshot

| Leadership Output | Enterprise Proposal Position |
| --- | --- |
| Business value | API-driven workflows, reduced swivel-chair operations, and AI-assisted triage/reporting |
| Strategic outcomes | Zero public ingress, reusable AI framework, VRM service maturity, and audit evidence readiness |
| Headline economics | Baseline build $9,360, recurring annual baseline $10,268, plus explicit 40/60 onshore-offshore labor split economics |
| Operational target | Keep runtime below $5,000/month while scaling from 50 to 300 tenants |
| Decision outputs | VRM ownership confirmation, Event Hub ingestion readiness, and production cutover approval |

## Design Overview

This design is security-first and identity-centric. User access is published through Entra ID Application Proxy with pre-authentication controls before traffic enters Azure networking. Application services are private-only, secrets are centralized, and all critical data-plane services are constrained by Private Endpoints.

Key design properties:

- No inbound public endpoint to the application tier.
- Entra ID Conditional Access, MFA, and risk policies enforced at identity edge.
- Strict Dev and Prod separation by subscription, VNet, connector groups, and enterprise apps.
- Predictable outbound through hub NAT Gateway, with optional Firewall insertion point.
- PaaS-first operating model with policy, logging, and compliance evidence from day one.

## High-Level Architecture

### Logical Architecture Summary

- Identity Edge: Entra ID + App Proxy cloud service.
- Hub Layer: NAT Gateway, private DNS zones, shared networking controls.
- Spoke Layers: Dedicated Dev and Prod spokes with connector subnet and private workloads.
- Workloads: App Service, Function Apps, SQL or PostgreSQL, Blob Storage, Key Vault.
- Security and Monitoring: Defender for Cloud, Log Analytics, Application Insights, Event Hub forwarding.

### Traffic Flow

1. User requests published URL behind App Proxy.
1. Entra ID enforces authentication, Conditional Access, and risk policy checks.
1. App Proxy relays authenticated traffic to available connector over connector outbound session.
1. Connector forwards requests to App Service via Private Endpoint in spoke VNet.
1. Application calls data and automation services via managed identity and private endpoints.
1. Outbound traffic exits through hub NAT for predictable egress controls.

## Entra ID Application Proxy Design

### Connectors

- Windows Server 2022 connector hosts on B2ms baseline.
- Production uses connector pair for high availability; Dev uses single connector baseline.
- Connectors use outbound 443-only model with no inbound rule requirement.
- Connector VM patching is owned by Spyglass VRM and managed through standard patch workflow.

### Published Applications

- Separate applications per environment: Spyglass-Dev and Spyglass-Prod.
- Pre-authentication set to Entra ID only.
- Conditional Access includes MFA and compliant device baseline; Prod adds risk and location policies.
- SSO method supports header or OIDC mode based on app implementation path.

### App Service Hardening

- Public network access disabled.
- Access via Private Endpoint and private DNS resolution only.
- Access restrictions scoped to connector subnet as defense in depth.
- HTTPS-only and TLS minimum enforced.

## Dev and Prod Environment Separation

| Layer | Dev | Prod |
| --- | --- | --- |
| Subscription | Dedicated Dev subscription | Dedicated Prod subscription |
| VNet | Dev spoke VNet | Prod spoke VNet |
| App Proxy app | Spyglass-Dev | Spyglass-Prod |
| Connector group | Spyglass-Dev-Connectors | Spyglass-Prod-Connectors |
| Connector count | 1 | 2 |
| Access controls | MFA + compliant device | MFA + compliant device + risk and location gating |
| Key Vault mode | Private endpoint + RBAC | Private endpoint + RBAC + purge protection |
| Deployment controls | Automated Dev deploys | Approval gate and change control required |

## Security Best Practices Applied

- Entra ID-only authentication with no local or shared credential model.
- Managed identity for App Service and Function Apps.
- Private Endpoints for app, database, storage, and secrets plane.
- Defender for Cloud CSPM plus workload protections in both environments.
- Diagnostic Settings on resources plus Entra logs forwarded through Event Hub.
- Azure Policy initiative for private access, TLS, tagging, and security posture controls.
- Backup and recovery controls for database, app artifacts, and key recovery.

## ISO 27001:2022 Control Mapping

| Control | Title | Architecture Contribution |
| --- | --- | --- |
| A.5.15 | Access control | Entra ID groups, App assignments, RBAC boundaries |
| A.5.17 | Authentication information | MFA and Conditional Access enforced at edge |
| A.8.5 | Secure authentication | Entra pre-auth through App Proxy, legacy auth blocked |
| A.8.9 | Configuration management | IaC plus Azure Policy initiative controls |
| A.8.15 | Logging | Central diagnostics to Log Analytics and Event Hub |
| A.8.16 | Monitoring activities | Defender alerts plus monitor alerting and forwarding |
| A.8.20 | Network security | Hub-spoke segmentation, NSGs, private DNS, no public ingress |
| A.8.22 | Segregation of networks | Separate Dev and Prod subscriptions, VNets, and connector groups |
| A.8.31 | Separation of environments | Distinct environments, identities, and deployment gates |

## Monthly Cost Estimate

Assumptions:

- East US pricing model.
- 730-hour month equivalent.
- List pricing estimate without reservation or negotiated discounts.

### User and Load Assumptions

- **Platform users (application consumers):** 25-75 concurrent analysts within the Quisitive SecOps team, split between onshore (US) and offshore (India) staff. These are the only users placing direct load on application services (App Service, Function Apps, dashboards).
- **Monitored tenant end-users:** Each managed tenant contains 1K-10K end-users generating logs, alerts, and security activity. These users do not interact with the platform directly; their activity is ingested via API polling and event-driven pipelines without creating application-tier session pressure.
- **Scaling model:** As the number of managed tenants grows, the Quisitive SecOps team scales onshore and offshore headcount proportionally to match operational demand. Platform user count remains bounded to the analyst team size, not the monitored user population.
- **Load implication:** Application compute, session, and concurrency sizing targets 25-75 simultaneous users. Ingestion and data-plane sizing targets the aggregate log and alert volume from monitored tenants (driven by tenant count and per-tenant user activity, not by platform user sessions).

### Production Baseline Estimate

| Component Group | Monthly Cost |
| --- | --- |
| App, functions, and data baseline | $119 |
| Security, logs, and monitoring | $114 |
| Network and private connectivity | $64 |
| App Proxy connectors (2x B2ms) | $120 |
| Event Hub forwarding | $15 |
| Production subtotal | $441 |

### Dev Baseline Estimate

| Component Group | Monthly Cost |
| --- | --- |
| App, functions, and data baseline | $63 |
| Security, logs, and monitoring | $77 |
| Network and private connectivity | $29 |
| App Proxy connector (1x B2ms) | $60 |
| Event Hub forwarding | $11 |
| Dev subtotal | $248 |

### Combined Baseline

| Metric | Value |
| --- | --- |
| Combined monthly run-rate (Dev + Prod) | $689/month |
| Combined annual Azure consumption | $8,268/year |
| Recurring annual operating model (with maintenance) | $10,268/year |

### Enterprise Runtime Envelope (50-300 Tenants)

| Scenario | Tenant Count | Monitored End-Users (log sources) | Platform Users (SecOps analysts) | Monthly Runtime Estimate |
| --- | --- | --- | --- | --- |
| Low | 50 | 5,000 | 25-35 | $1,450 |
| Target | 150 | 20,000 | 40-55 | $3,250 |
| Upper Growth | 300 | 50,000 | 55-75 | $4,900 |

Note: Monitored end-users generate ingested telemetry and alerts but do not consume application sessions. Platform users (Quisitive SecOps onshore US and offshore India) are the sole consumers of application compute and UI resources.

## ROI Analysis

### One-Time Build Cost

| Build Resource | Effort | Loaded Rate | Cost |
| --- | --- | --- | --- |
| India global delivery team | ~70 hours | $48/hour | $3,360 |
| Onshore security SMEs | ~30 hours | $120/hour | $3,600 |
| Program management | ~20 hours | $120/hour | $2,400 |
| One-time build total | 120 hours | Blended | $9,360 |

### Onshore vs Offshore Labor Cost Split (Build)

| Labor Segment | Effort | Loaded Rate | Cost | Share |
| --- | --- | --- | --- | --- |
| Offshore delivery engineering | ~70 hours | $48/hour | $3,360 | 35.9% |
| Onshore security and program roles | ~50 hours | $120/hour | $6,000 | 64.1% |
| Total | 120 hours | Blended | $9,360 | 100% |

### Recurring Annual Cost

| Recurring Component | Annual Cost |
| --- | --- |
| Azure consumption (Dev + Prod) | $8,268/year |
| Entra ID P2 incremental | $0/year (already licensed) |
| Maintenance and tuning | $2,000/year |
| Recurring total | $10,268/year |

### Labor Savings (Time Avoidance)

| Scenario | Annual Savings |
| --- | --- |
| Current load baseline | $36,864/year |
| +1 additional customer | $46,080/year equivalent uplift trajectory |
| +3 additional customers | $64,512/year equivalent uplift trajectory |
| +5 additional customers | $82,944/year |

### Onshore vs Offshore Labor Savings Split (40/60 Hours)

| Scenario | Onshore Labor Savings (40% hours @ $120/hour) | Offshore Labor Savings (60% hours @ $48/hour) | Total Annual Savings |
| --- | --- | --- | --- |
| Baseline load (40 hours/month) | $23,040/year | $13,824/year | $36,864/year |
| +5 customer growth total (90 hours/month) | $51,840/year | $31,104/year | $82,944/year |

### ROI Summary

| Metric | Current Load | +5 Customers |
| --- | --- | --- |
| Annual labor savings | $36,864 | $82,944 |
| Annual recurring cost | $10,268 | $10,268 |
| Annual net benefit | $26,596 | $72,676 |
| Payback period | ~4.2 months | ~1.5 months |
| Year-1 ROI | ~88% | ~323% |
| Year-2+ ROI | ~259% | ~708% |

### Strategic Value: AI Production Framework

The platform is the first workload on a reusable security and operations framework. Future applications inherit identity perimeter, private networking, centralized secrets, policy controls, and audit telemetry without rebuilding those capabilities. This reduces marginal per-application cost and accelerates secure promotion from POC to production.

### Strategic Value: VRM Service Refinement

Making VRM the connector patch owner creates a compounding benefit: the platform receives enterprise patch governance while VRM gains internal production workloads to harden automation, SLA evidence, and change procedures before broader customer rollout.

## Implementation Steps

1. Stand up repository controls, branch protection, and environment approval gates.
1. Draft IaC and policy artifacts with AI assistance, then complete SME hardening review.
1. Deploy management and network baseline (hub, spokes, NAT, private DNS, UDRs).
1. Deploy data and secret plane with private access and public network disabled.
1. Deploy App Service and Function Apps with managed identity integration.
1. Provision connector VMs, register connector groups, and hand patching ownership to VRM.
1. Configure App Proxy enterprise apps and Conditional Access policies by environment.
1. Enable Defender plans, diagnostics, and Event Hub forwarding to Quisitive IT.
1. Port existing POC runtime dependencies to managed Azure service targets.
1. Enforce CI and CD promotion controls and run readiness exercises before go-live.

## Risks and Next Steps

- Entra ID and App Proxy dependency: include this in BCP and continuity planning.
- Connector patch ownership transition: finalize VRM service catalog and SLA commitments.
- Telemetry forwarding coordination: validate ingestion and alert routing with Quisitive IT before production cutover.
- Cost drift risk: monitor ingestion and workload growth against budget guardrails monthly.

Next actions:

1. Confirm the three executive decision points.
1. Freeze implementation wave plan and named owners.
1. Begin phased implementation and readiness testing timeline.

## Scope Boundaries

### Included

- SecOps Revised architecture alignment for identity edge, private networking, and telemetry governance.
- Full leadership-context narrative for design, cost, ROI, controls, implementation, and risk.
- Enterprise operating model for 50-300 tenant trajectory.

### Excluded

- Detailed IaC module code and deployment pipeline implementation artifacts.
- Full active-active multi-region disaster recovery build-out in phase one.
- Final production incident response playbooks and detailed runbook procedures.

## Final Recommendation

Proceed with the SecOps Revised enterprise architecture as the target state. This delivers full executive context for deployment design, security controls, operational governance, and quantifiable cost savings while maintaining a practical runtime envelope through tenant growth.
