# Proposal: Azure Enterprise Multi-Tenant React Web Platform on Azure

Date: 2026-05-13

## Executive Summary

- Retain React and TypeScript for the frontend and avoid a near-term Blazor rewrite to reduce delivery risk and timeline.
- Introduce a dedicated backend integration API so third-party security integrations no longer run in the browser.
- Deploy a hybrid multi-tenant model: shared application platform for all tenants, with optional dedicated data isolation for high-sensitivity tenants.
- Use Azure PaaS-first services to meet enterprise security, scale, and governance expectations while targeting a monthly runtime cost below $5,000.

## Goals and Constraints

- Tenants: 50 to 300.
- Daily active users: 5,000 to 50,000.
- Primary region: East US, single-region initial deployment.
- Budget target: under $5,000 per month for runtime services.
- Enterprise requirements: strong identity and RBAC, tenant isolation controls, auditability, observability, and CI/CD governance.

## Recommended Architecture

### Edge and Access Layer

- Azure Front Door Standard with WAF policy and managed rule sets.
- Single public entry point with TLS termination, routing, and basic global performance optimization.

### Application Layer

- App Service (Linux) for frontend web app.
- Separate App Service (Linux) for backend integration API.
- Managed identity enabled for service-to-service authentication.

### Data Layer

- Azure Database for PostgreSQL Flexible Server for structured tenant and workflow data.
- Azure Blob Storage for evidence, report exports, and archived artifacts.
- Optional Azure Cache for Redis for hot-path session and aggregation caching.

### Security and Secrets

- Microsoft Entra ID for authentication (OIDC).
- App roles and tenant-scoped authorization claims.
- Azure Key Vault for secrets, certificates, and key material.

### Observability and Operations

- Application Insights and Log Analytics workspace for telemetry, alerting, and diagnostics.
- Cost Management budgets and alerts with service-level guardrails.

## Multi-Tenancy Strategy

### Shared Tenant Model (Default)

- All tenants share app services.
- Tenant context enforced from identity claims and API middleware.
- Data partitioned by tenant_id with strict query enforcement and role checks.

### Isolated Tenant Model (Premium or Regulated Tenants)

- Dedicated PostgreSQL database or dedicated compute tier per selected tenant.
- Optional dedicated storage account container namespace and encryption policy set.
- Same application code path with tenant policy-driven routing.

## Recommended Azure Resources

| Layer | Azure Service | Baseline Recommendation | Scale Guidance |
| --- | --- | --- | --- |
| Edge | Front Door Standard + WAF | 1 profile, 1 endpoint, WAF managed rules | Add custom rules per tenant risk profile |
| Web frontend | App Service Plan Linux | P1v3, 2 instances | Scale to 4 to 8 instances based on CPU and request latency |
| Backend API | App Service Plan Linux | P1v3, 2 instances | Scale to 6 to 10 instances for ingestion spikes |
| Structured data | PostgreSQL Flexible Server | General Purpose, 2 to 4 vCores | Scale to 8+ vCores, tune storage IOPS and backups |
| Unstructured data | Blob Storage | Hot tier for active data, Cool tier for aging data | Lifecycle rules for cost control |
| Cache | Azure Cache for Redis | Standard C1 | Scale to C2 or C3 based on hit ratio and latency |
| Secrets | Key Vault | Standard | Separate vault per environment |
| Monitoring | App Insights + Log Analytics | Workspace-based telemetry | Increase sampling and retention controls with load |

## Enterprise Landing Zone and Organization Structure

### Management Group Structure

- Root
- Platform
- Security
- Production
- NonProduction

### Subscription Model

- Shared-Platform subscription: Front Door, DNS, shared network, shared monitoring workspace.
- Identity-Security subscription: Key Vault governance, policy, and identity controls.
- App-Prod subscription: production app services, production database, production storage.
- App-NonProd subscription: dev and stage environments.

### Governance Controls

- Azure Policy initiative for tagging, TLS minimums, private endpoint policies, and diagnostic settings.
- Role assignment by Entra groups, not direct user assignments.
- Mandatory budget alerts at 60 percent, 80 percent, and 95 percent.

## Security and Compliance Controls

- Entra ID with conditional access and MFA for administrative access.
- Role-based and tenant-scoped authorization checks in backend API.
- Secrets removed from client code and centralized in Key Vault.
- End-to-end audit events for tenant actions, override decisions, and analyst workflows.
- WAF and API rate limiting for abuse and burst protection.
- Retention policy matrix for operational logs, audit logs, and evidence artifacts.

## Cost Proposal (Monthly Runtime Estimate)

Assumptions:

- East US pricing.
- Single region, no active-active DR.
- Costs include runtime infrastructure and monitoring, exclude one-time engineering labor.

| Scenario | Tenant Count | DAU | Estimated Monthly Cost |
| --- | --- | --- | --- |
| Low | 50 | 5,000 | $1,100 |
| Target | 150 | 20,000 | $2,600 |
| Upper Growth | 300 | 50,000 | $4,800 |

Cost breakdown by category:

| Category | Low | Target | Upper Growth |
| --- | --- | --- | --- |
| Front Door and WAF | $90 | $170 | $320 |
| App Service (frontend + API) | $360 | $820 | $1,500 |
| PostgreSQL Flexible Server | $120 | $360 | $760 |
| Blob Storage | $40 | $130 | $320 |
| Redis Cache | $60 | $180 | $380 |
| Monitoring and logs | $100 | $320 | $700 |
| Key Vault and security ops | $40 | $70 | $120 |
| Network egress and misc platform overhead | $290 | $550 | $700 |
| Total | $1,100 | $2,600 | $4,800 |

Pricing reference notes used in planning:

- App Service sample rates: B1 $0.017/hour, S1 $0.095/hour, P1v3 $0.155/hour.
- Front Door Standard base fee includes fixed monthly profile cost plus request and transfer meters.
- Blob hot storage planning rate around $0.0208 to $0.021 per GB-month.
- Application Insights ingestion overage around $2.30 per GB.

## Delivery Roadmap

1. Phase 1 (Weeks 1 to 2): platform design sign-off, subscription and policy setup, CI/CD baseline.
1. Phase 2 (Weeks 3 to 5): backend integration API extraction from browser services.
1. Phase 3 (Weeks 6 to 8): Entra ID, RBAC, tenant policy enforcement, and data persistence migration.
1. Phase 4 (Weeks 9 to 10): observability hardening, load tests, and cost guardrail tuning.
1. Phase 5 (Weeks 11 to 12): pilot tenant rollout, operational handoff, and production cutover.

## Scope Boundaries

### Included

- Azure architecture recommendation.
- Tenant strategy and enterprise governance structure.
- Runtime cost envelope and scaling guidance.
- Delivery phases and readiness criteria.

### Excluded

- Full implementation code changes.
- Final Bicep templates and deployment execution.
- Multi-region disaster recovery build-out.

## Final Recommendation

Proceed with React plus backend API modernization, deploy on App Service with Front Door and WAF, enforce Entra ID and tenant-scoped authorization, and adopt PostgreSQL plus Blob Storage under a hybrid multi-tenant data policy. This path provides the fastest enterprise-ready outcome while staying within the stated budget target when cost guardrails are applied.
