# Starter Proposal: SecOps Platform on Azure (5-10 Tenants, 1K-10K Active Users)

Date: 2026-05-13

## Objective

Deliver a smaller-scale launch aligned to the SecOps App Revised guidance, using the same security and delivery principles as enterprise while minimizing starter complexity and spend.

## Leadership Output Snapshot

| Leadership Output | Starter Position |
| --- | --- |
| Business value | Replace manual case portal-checking with API-driven workflows and unified analyst view |
| Strategic outcomes | Zero inbound public exposure, private service access, and audit-ready monitoring baseline |
| Headline economics | Starter one-time build target: $4,800-$6,200. Starter recurring annual run-rate: $9,120-$12,400 |
| Delivery objective | Six-week controlled launch with Dev and Prod separation and policy-first controls |
| Decision points | Confirm VRM patch ownership, Event Hub forwarding to Quisitive IT, and pilot go-live approval |

## Scope and Assumptions

- Tenant count: 5 to 10.
- Active users: 1,000 to 10,000.
- Region: East US, single-region deployment.
- Stack: React frontend, backend integration API, and automation functions.
- Security baseline: Entra App Proxy edge, private endpoints, Defender for Cloud, and centralized telemetry.

## SecOps Revised Starter Architecture

### Identity and Edge

- Entra ID Application Proxy publishes the app.
- Conditional Access, MFA, and Identity Protection are enforced before workload access.
- No inbound public application endpoint is required.

### Networking and Environment Separation

- Separate Dev and Prod subscriptions and spoke VNets.
- Shared lightweight hub networking with NAT Gateway for predictable outbound.
- One connector VM in Dev and two connectors in Prod for high availability when needed.

### Application and Data

- App Service hosts frontend and backend app components.
- Function Apps run response automation and scheduled enrichment.
- PostgreSQL (or Azure SQL) stores case data, state, and governance overrides.
- Blob Storage stores evidence and export artifacts.

### Security and Observability

- Key Vault with managed identities for secret access.
- Private Endpoints for App Service, database, Key Vault, and Storage.
- Defender for Cloud posture and workload protections enabled in both environments.
- Diagnostic Settings and Entra logs forwarded through Event Hub to Quisitive IT.

## Starter Resource Sizing

| Layer | Azure Service | Starter Recommendation | Scale Trigger |
| --- | --- | --- | --- |
| Identity edge | Entra App Proxy + connectors | 1 Dev connector, 1-2 Prod connectors | Add additional connector pair at sustained concurrency growth |
| Web and API | App Service Plan Linux | S1, 1 instance, shared plan | Scale to 2 instances or P1v3 at sustained CPU >65% |
| Automation | Function Apps (Windows + Linux) | Consumption | Move to Premium when execution pressure becomes sustained |
| Structured data | PostgreSQL Flexible Server | Burstable or small General Purpose | Scale at DB CPU >60% and IOPS pressure |
| Unstructured data | Blob Storage | Hot + lifecycle to Cool | Move older evidence to Archive at retention thresholds |
| Secrets | Key Vault | Standard, private endpoint | Enable purge protection in Prod |
| Security posture | Defender for Cloud | CSPM + workload protections | Keep parity across Dev and Prod |
| Telemetry | App Insights + Log Analytics + Event Hub | Workspace-based forwarding | Increase retention and archive with compliance demand |

## Starter Runtime Cost Estimate

Assumptions:

- East US pricing and 730-hour month.
- Runtime services only; one-time implementation labor excluded from monthly run-rate.
- Includes Entra App Proxy connector infrastructure, Defender plans, and Event Hub forwarding.

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

## Starter Delivery Plan (6 Weeks)

1. Week 1: create repository, CI and CD baseline, and environment guardrails.
1. Week 2: deploy hub and spoke networking, private DNS, and NAT egress.
1. Week 3: deploy data plane, Key Vault, and private endpoints.
1. Week 4: configure App Proxy applications, connectors, and Conditional Access.
1. Week 5: port POC workloads to App Service and Function Apps, then enable Defender and diagnostics forwarding.
1. Week 6: execute smoke tests, failover test, logging validation with Quisitive IT, and pilot go-live review.

## Exit Criteria to Enterprise Blueprint

Move to the enterprise architecture when one or more conditions are met:

- Tenant count exceeds 10.
- Active users consistently exceed 10,000.
- Regulatory requirements require stronger segmentation or tenant-dedicated compute and data.
- Sustained performance targets require larger connector pools and expanded app tiers.
- Broader SOC workload automation requires enterprise-scale framework onboarding.

## Decision Points for Leadership Approval

1. Confirm Spyglass VRM patching ownership and SLA for connector VMs.
1. Confirm Quisitive IT Event Hub ingestion readiness for starter telemetry feeds.
1. Approve pilot go-live window for the App Service and Function App production cutover.

## Recommendation

Adopt this starter proposal as the phase-one launch model because it preserves the SecOps Revised security and delivery architecture while limiting initial cost and complexity. This creates a clean, low-risk bridge to the enterprise blueprint once scale thresholds are reached.
