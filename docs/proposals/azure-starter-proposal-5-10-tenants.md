# Starter Proposal: Azure Multi-Tenant React Platform (5-10 Tenants, 1K-10K Active Users)

Date: 2026-05-13

## Objective

Provide a practical launch proposal for a smaller initial footprint while preserving a clear path to the full enterprise architecture.

## Scope and Assumptions

- Tenant count: 5 to 10.
- Active users: 1,000 to 10,000.
- Region: East US, single-region deployment.
- Stack: React frontend with a backend integration API.
- Goal: production-ready baseline with controlled cost and low operational complexity.

## Recommended Starter Architecture

### Core Design

- Keep the frontend in React and move all external security integrations to a backend API.
- Start with a shared tenant model using tenant_id partitioning and strict tenant-scoped authorization.
- Use one App Service plan for both frontend and backend apps at launch.
- Use PostgreSQL Flexible Server for structured records and Blob Storage for evidence and exports.
- Use Entra ID, app roles, and Key Vault from day one to avoid a security refactor later.

### Service Topology (Starter)

- App Service Plan Linux hosting:
  - Frontend Web App
  - Backend Integration API
- Azure Database for PostgreSQL Flexible Server
- Azure Blob Storage (Hot plus lifecycle to Cool)
- Application Insights and Log Analytics
- Azure Key Vault
- Optional at growth stage: Front Door Standard plus WAF, Redis cache

## Starter Resource Sizing

| Layer | Azure Service | Starter Recommendation | Scale Trigger |
| --- | --- | --- | --- |
| Edge | App Service managed endpoint | Start without Front Door in pilot | Add Front Door + WAF at 5K+ active users or external exposure requirements |
| Web and API | App Service Plan Linux | S1, 1 instance, 2 apps on same plan | Move to 2 instances or P1v3 when p95 latency rises or CPU stays above 65 percent |
| Structured data | PostgreSQL Flexible Server | Burstable or small General Purpose | Scale vCores and IOPS at sustained DB CPU above 60 percent |
| Unstructured data | Blob Storage | Hot tier with lifecycle policy | Move older evidence to Cool/Archive at 30 to 90 days |
| Cache | Redis | Not required at pilot | Add C1 when repeated reads or dashboard aggregation latency appears |
| Secrets | Key Vault | Standard | Keep per-environment vaults as environments expand |
| Monitoring | App Insights + Log Analytics | Workspace-based telemetry | Increase retention and reduce sampling as incident/compliance needs grow |

## Monthly Runtime Cost Estimate

Assumptions:

- East US pricing and 730-hour month.
- Runtime services only, excluding one-time implementation labor.
- Cost includes contingency for normal telemetry and egress variation.

### Scenario Cost Envelope

| Scenario | Tenant Count | Active Users | Estimated Monthly Runtime |
| --- | --- | --- | --- |
| Pilot | 5 | 1,000 | $320 |
| Growth Start | 8 | 5,000 | $760 |
| Upper Starter | 10 | 10,000 | $1,460 |

### Cost Breakdown by Category

| Category | Pilot | Growth Start | Upper Starter |
| --- | --- | --- | --- |
| Front Door and WAF | $0 | $90 | $160 |
| App Service (frontend + API) | $70 | $220 | $460 |
| PostgreSQL Flexible Server | $100 | $180 | $320 |
| Blob Storage | $10 | $20 | $45 |
| Redis Cache | $0 | $55 | $120 |
| Monitoring and logs | $90 | $140 | $250 |
| Key Vault and network overhead | $50 | $55 | $105 |
| Total | $320 | $760 | $1,460 |

## Delivery Plan (6 Weeks)

1. Week 1: baseline environment, CI/CD pipeline, App Service and PostgreSQL provisioning.
2. Weeks 2 to 3: backend integration API extraction from browser-side service calls.
3. Week 4: Entra ID authentication, role mapping, and tenant-scoped authorization checks.
4. Week 5: observability setup, alerting, and light performance testing.
5. Week 6: pilot tenant rollout, runbook handoff, and production readiness review.

## Exit Criteria to Move to the Enterprise Blueprint

Adopt the full enterprise architecture when one or more of the following are true:

- Tenant count exceeds 10.
- Active users consistently exceed 10,000.
- Regulatory or customer requirements require stronger edge controls and tenant isolation tiers.
- Sustained performance or availability targets require dedicated scaling tiers.
- Security governance requires centralized edge policy and stronger segmentation.

## Recommendation

Start with this smaller-scale proposal to reduce launch time and runtime cost while preserving compatibility with the larger enterprise plan. This gives a controlled entry point and avoids rework when scaling into 50+ tenants later.
