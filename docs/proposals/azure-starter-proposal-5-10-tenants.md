# Starter Proposal: SecOps Platform on Azure (5-10 Tenants, 1K-10K Active Users)

Date: 2026-05-13

## Executive Summary

This starter proposal delivers the SecOps App Revised architecture at reduced initial scale while preserving the core security and governance model: Entra ID Application Proxy at the edge, private-only workload connectivity, Dev and Prod separation, and ISO-aligned controls. It is designed for fast launch, low complexity, and clear expansion to the enterprise blueprint.

### Business Value

- Replaces manual case and portal-check workflow with API-driven operations.
- Provides a unified analyst surface for Blackpoint and Defender XDR context.
- Enables secure AI-assisted triage and reporting from day one.

### Strategic Outcomes

- Zero inbound public exposure for core workloads.
- Private endpoint-based data and secret access with managed identities.
- Audit-ready telemetry forwarding to Quisitive IT using Event Hub.
- Direct upgrade path to enterprise scale without re-architecting identity and network edge patterns.

### Headline Economics

| Metric | Starter Value |
| --- | --- |
| One-time build target | $4,800-$6,200 |
| Recurring annual run-rate target | $9,120-$12,400 |
| Baseline labor savings estimate | ~$18,432/year |
| Pilot payback expectation | ~6-9 months, depending on realized automation throughput |

### Executive Decision Points

1. Confirm Spyglass VRM connector VM patching ownership and SLA.
1. Confirm Quisitive IT Event Hub ingestion readiness for starter telemetry.
1. Approve six-week pilot go-live window and promotion criteria.

## Leadership Output Snapshot

| Leadership Output | Starter Position |
| --- | --- |
| Business value | API workflows replace manual case portal-checking with a unified analyst view |
| Strategic outcomes | Zero inbound public exposure, private service access, and audit-ready monitoring baseline |
| Headline economics | One-time build target $4,800-$6,200 and recurring annual run-rate $9,120-$12,400 |
| Delivery objective | Six-week controlled launch with policy-first controls and Dev/Prod separation |
| Decision outputs | VRM ownership confirmation, Event Hub forwarding readiness, and pilot go-live approval |

## Design Overview

The starter model follows the same identity and security principles as enterprise, but scales connector count, compute sizing, and retention posture to 5-10 tenants and 1K-10K active users.

Key design properties:

- Entra ID pre-authentication before workload access.
- Outbound-only connector traffic to App Proxy cloud service.
- Private endpoint access to app, data, and secrets layers.
- Strict Dev and Prod separation from initial deployment.
- PaaS-first stack to minimize infrastructure overhead.

## High-Level Architecture

### Logical Architecture Summary

- Entra ID + App Proxy edge.
- Shared lightweight hub networking with NAT and private DNS.
- Dev and Prod spokes with separate connector groups.
- App Service + Function Apps for operations and automation.
- SQL or PostgreSQL, Blob Storage, Key Vault under private connectivity.
- Defender for Cloud, Log Analytics, App Insights, and Event Hub forwarding.

### Traffic Flow

1. User hits published App Proxy endpoint.
1. Entra ID applies authentication and Conditional Access policies.
1. App Proxy cloud relays authenticated request to available connector.
1. Connector forwards to private App Service endpoint in spoke.
1. App calls data and automation services over private endpoints and managed identity.
1. Outbound traffic exits through NAT egress path.

## Entra ID Application Proxy Design

### Connectors

- Dev: 1 connector VM baseline.
- Prod: 1-2 connectors based on concurrency and availability targets.
- Connector transport remains outbound 443 only.
- Spyglass VRM owns patch and evidence process.

### Published Applications

- Separate enterprise apps for Dev and Prod.
- Pre-authentication always set to Entra ID.
- MFA and compliant device baseline; Prod adds location and risk gating where required.

### App Service Hardening

- Public network disabled.
- Private Endpoint only for application access.
- Access restrictions and TLS enforcement applied.

## Dev and Prod Environment Separation

| Layer | Dev | Prod |
| --- | --- | --- |
| Subscription | Dedicated Dev subscription | Dedicated Prod subscription |
| VNet | Dev spoke | Prod spoke |
| App Proxy app | Spyglass-Dev | Spyglass-Prod |
| Connector group | Dev connector group | Prod connector group |
| Connector count | 1 | 1-2 |
| Policy controls | Baseline policy + MFA | Baseline + strengthened risk/location controls |
| Release controls | Continuous Dev deploy | Manual approval gate for Prod |

## Security Best Practices Applied

- Entra ID-only authentication with Conditional Access.
- Managed identity for app and automation runtimes.
- Private Endpoints for app, DB, storage, and Key Vault.
- Defender CSPM and workload protections on both environments.
- Centralized diagnostics and Entra log forwarding to Event Hub.
- Azure Policy guardrails for private access, TLS, and tagging.

## ISO 27001:2022 Control Mapping (Starter Scope)

| Control | Title | Starter Contribution |
| --- | --- | --- |
| A.5.15 | Access control | Entra groups, RBAC scopes, and app assignment |
| A.5.17 | Authentication information | MFA and Conditional Access at identity edge |
| A.8.5 | Secure authentication | Entra pre-auth with no passthrough mode |
| A.8.15 | Logging | Diagnostics and Entra logs centralized for review |
| A.8.16 | Monitoring activities | Defender and monitor alerts with forwarding path |
| A.8.20 | Network security | Private endpoints and segmented network layers |
| A.8.31 | Separation of environments | Distinct Dev and Prod resources and release gates |

## Starter Resource Sizing

| Layer | Azure Service | Starter Recommendation | Scale Trigger |
| --- | --- | --- | --- |
| Identity edge | Entra App Proxy + connectors | 1 Dev connector, 1-2 Prod connectors | Add connector pair at sustained concurrency growth |
| Web and API | App Service Plan Linux | S1, single instance shared plan | Scale to 2 instances or P1v3 above sustained CPU 65% |
| Automation | Function Apps (Windows + Linux) | Consumption | Move to Premium when execution pressure becomes sustained |
| Structured data | PostgreSQL Flexible Server or Azure SQL | Burstable or small General Purpose | Scale above DB CPU 60% and IOPS pressure |
| Unstructured data | Blob Storage | Hot with lifecycle to Cool | Move older evidence to Archive at retention thresholds |
| Secrets | Key Vault | Standard + private endpoint | Enable purge protection in Prod |
| Security posture | Defender for Cloud | CSPM + workload protections | Keep parity across environments |
| Telemetry | App Insights + Log Analytics + Event Hub | Workspace-based forwarding | Increase retention and archive with compliance demand |

## Monthly Cost Estimate

Assumptions:

- East US list-pricing view.
- 730-hour equivalent month.
- Runtime services only; one-time labor excluded.

### Scenario Envelope

| Scenario | Tenant Count | Active Users | Estimated Monthly Runtime |
| --- | --- | --- | --- |
| Pilot | 5 | 1,000 | $520 |
| Growth Start | 8 | 5,000 | $980 |
| Upper Starter | 10 | 10,000 | $1,720 |

### Category Breakdown

| Category | Pilot | Growth Start | Upper Starter |
| --- | --- | --- | --- |
| App Proxy connectors and edge controls | $85 | $145 | $210 |
| App Service and Functions | $95 | $260 | $520 |
| Database and storage | $120 | $230 | $370 |
| Security and telemetry (Defender, Logs, Event Hub) | $150 | $250 | $430 |
| Network and overhead | $70 | $95 | $190 |
| Total | $520 | $980 | $1,720 |

## ROI Analysis

### One-Time Build Cost (Starter Target)

| Build Resource | Estimated Cost Range |
| --- | --- |
| Delivery and platform engineering | $2,200-$2,900 |
| Security and architecture review | $1,600-$2,100 |
| Program management and rollout coordination | $1,000-$1,200 |
| One-time build total | $4,800-$6,200 |

### Recurring Annual Cost

| Recurring Component | Annual Range |
| --- | --- |
| Azure runtime services | $7,120-$10,400 |
| Maintenance and tuning | $2,000 |
| Recurring total | $9,120-$12,400 |

### Labor Savings (Starter Estimate)

| Scenario | Annual Savings Estimate |
| --- | --- |
| Baseline starter load | ~$18,432/year |
| +3 customer growth | ~$33,178/year |
| +5 customer growth | ~$46,080/year |

### ROI Summary (Indicative)

| Metric | Conservative | Accelerated |
| --- | --- | --- |
| Year-1 ROI | ~4% | ~38% |
| Year-2+ ROI | ~49% | ~126% |
| Payback period | ~9 months | ~6 months |

### Strategic Value: Foundation Before Scale

The starter release establishes the same secure identity and networking perimeter used by enterprise. As tenant and user volume grows, the organization scales connector pools, app tiers, and data capacity instead of redesigning the platform.

### Strategic Value: VRM Ownership and Operational Maturity

Assigning connector patching to VRM in the pilot phase ensures production disciplines are embedded early, reducing transition risk when promoting to enterprise scope.

## Starter Delivery Plan (6 Weeks)

1. Week 1: repository controls, CI and CD baseline, and environment guardrails.
1. Week 2: hub and spoke networking, private DNS, and NAT egress.
1. Week 3: data plane, Key Vault, and private endpoint deployment.
1. Week 4: App Proxy apps, connectors, and Conditional Access policies.
1. Week 5: workload port to App Service and Function Apps; enable Defender and telemetry forwarding.
1. Week 6: smoke testing, failover checks, Quisitive IT validation, and pilot go-live review.

## Implementation Steps

1. Confirm named owners for VRM, SecOps engineering, and Quisitive IT integration.
1. Deploy baseline IaC and Azure Policy controls for Dev and Prod starter environments.
1. Stand up App Proxy connectors and publish environment-specific enterprise apps.
1. Deploy app and automation workloads with managed identity integrations.
1. Validate log forwarding, alerting, and access governance controls.
1. Execute pilot go-live and begin 30-day stabilization period.

## Risks and Next Steps

- Connector VM patch ownership: confirm SLA coverage and escalation path before go-live.
- Logging ingestion drift: monitor Event Hub and Log Analytics usage in first 60 days.
- Scope creep risk: preserve starter boundaries until exit criteria are met.
- Capacity spikes: watch app and connector thresholds and pre-stage upgrade actions.

Next actions:

1. Approve starter decision points and pilot start date.
1. Confirm target pilot tenant cohort and success metrics.
1. Begin implementation sprint sequence.

## Exit Criteria to Enterprise Blueprint

Move to enterprise architecture when one or more conditions are met:

- Tenant count exceeds 10.
- Active users consistently exceed 10,000.
- Regulatory obligations require stronger segmentation or dedicated stacks.
- Performance needs require larger connector pools and app tier expansion.
- SOC automation scope requires enterprise framework onboarding.

## Scope Boundaries

### Included

- Starter deployment aligned to SecOps Revised identity, network, and governance controls.
- Full leadership-context narrative across design, security, economics, implementation, and risk.
- Pilot-to-enterprise transition criteria.

### Excluded

- Full enterprise-scale dedicated tenant isolation build-out.
- Active-active multi-region architecture in phase one.
- Detailed implementation code and final runbook package.

## Recommendation

Adopt this starter model as phase one. It preserves the SecOps Revised architecture and governance posture while limiting initial cost and complexity, and it provides a controlled path to enterprise scale once growth and compliance thresholds are reached.
