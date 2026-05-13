# Blackpoint Cyber API Capabilities and Limitations

## Overview

This document summarizes currently validated behavior of the Blackpoint CompassOne API for this integration.

## Validation Snapshot

- Primary validation window: March 2026
- Current implementation baseline: CompassOne OpenAPI v1.7.0
- Superseding note: older repository notes that classify `/v1/reports` as unavailable are obsolete

## API Base URL

```text
https://api.blackpointcyber.com/v1
```

## Authentication

- Method: Bearer token
- Header: `Authorization: Bearer {api_key}`
- Key format: typically starts with `bpc_`
- Tenant-scoped routes commonly require: `x-tenant-id: {tenantId}`

## Capability Summary

|Area|Status|Notes|
|---|---|---|
|Tenants|Available|`GET /v1/tenants` returns managed tenant records|
|Detections|Available|`/v1/alert-groups` and related analytics routes are available|
|Reporting|Available|`/v1/reports` plus `/url`, `/binary`, and `/json` are available in v1.7.0|
|Assets|Available with constraints|Requires `x-tenant-id` and at least one `class[]` query value|
|Incidents|Role-limited|`/v1/incidents` may return 403 without role grant|
|Users|Role-limited|`/v1/users` may return 403 without role grant|

## Detections Capabilities

### GET /v1/alert-groups

Status: Available

Purpose: Returns paginated detection groups, including resolved groups for after-the-fact review.

Common query parameters:

|Parameter|Type|Purpose|
|---|---|---|
|`take`|number|Page size|
|`skip`|number|Pagination offset|
|`status`|array|Filter by `OPEN` and `RESOLVED`|
|`type`|string|Detection type filter such as `CR` or `MDR`|
|`search`|string|Search by alert types, username, hostname|
|`tunnelSearch`|string|Search by tunnel or proxy names|
|`since`|date-time|Created since timestamp within API lookback limits|
|`minAlertsCount`|number|Minimum grouped alert count|
|`maxAlertsCount`|number|Maximum grouped alert count|
|`sortByColumn`|string|Sort field|
|`sortDirection`|string|`ASC` or `DESC`|

Example request:

```bash
GET /v1/alert-groups?status=RESOLVED&take=100&skip=0&sortByColumn=created&sortDirection=DESC
x-tenant-id: {tenantId}
Authorization: Bearer {api_key}
```

### Related detection endpoints

|Endpoint|Purpose|
|---|---|
|`GET /v1/alert-groups/{alertGroupId}`|Get one detection group by ID|
|`GET /v1/alert-groups/{alertGroupId}/alerts`|Get underlying alerts in the detection group|
|`GET /v1/alert-groups/count`|Get filtered count of detection groups|
|`GET /v1/alert-groups/alert-groups-by-week`|Get weekly grouped metrics|
|`GET /v1/alert-groups/top-detections-by-entity`|Get top detections by entity|
|`GET /v1/alert-groups/top-detections-by-threat`|Get top detections by threat|

## Reporting Capabilities

### GET /v1/reports

Status: Available in v1.7.0

Purpose: Lists report runs for the authenticated tenant, with sorting and report-type filtering.

Common query parameters:

|Parameter|Type|Purpose|
|---|---|---|
|`page`|number|1-indexed page number|
|`pageSize`|number|Result count per page|
|`sortBy`|string|Currently `intervalStart`|
|`sortOrder`|string|`asc` or `desc`|
|`reportType`|string|`Cloud`, `Executive`, or `MDR`|
|`startDate`|date|Date lower bound|
|`endDate`|date|Date upper bound|

### Report retrieval endpoints

|Endpoint|Purpose|
|---|---|
|`GET /v1/reports/{id}/url`|Get signed PDF URL for analyst consumption|
|`GET /v1/reports/{id}/binary`|Get base64-encoded PDF payload|
|`GET /v1/reports/{id}/json`|Get machine-readable report JSON payload|

## Assets Endpoint Constraints

### GET /v1/assets

Status: Available with required request shape

Required usage patterns:

1. Include `x-tenant-id` header.
2. Include at least one `class[]` query parameter.

Example request:

```bash
GET /v1/assets?class[]=DEVICE&pageSize=50
x-tenant-id: {tenantId}
Authorization: Bearer {api_key}
```

Common class values observed:

|Class|Typical meaning|
|---|---|
|`DEVICE`|Endpoints and servers|
|`USER`|User identity inventory|
|`SOFTWARE`|Installed software inventory|
|`SOURCE`|Data source connectors|

## Role-Limited Endpoints

These endpoints are present but may return 403 when the API key does not include required permissions.

|Endpoint|Typical result|Likely requirement|
|---|---|---|
|`GET /v1/incidents`|403|`incidents:read` or equivalent grant|
|`GET /v1/users`|403|`users:read` or equivalent grant|

## Historically Unavailable Endpoints

The following routes were observed as 404 during earlier probing. Re-validate against your current tenant role before treating as final.

- `/v1/alerts`
- `/v1/tickets`
- `/v1/cases`
- `/v1/threats`
- `/v1/security_events`
- `/v1/soc_alerts`
- `/v1/managed_detections`
- `/v1/investigations`
- `/v1/events`
- `/v1/openapi`
- `/v1/swagger`
- `/v1/docs`

## Practical Workarounds

### Tenant detail lookup

When single-tenant lookup behavior is inconsistent, fetch all tenants and filter client-side.

```typescript
const tenants = await apiClient.get('/tenants');
const tenant = tenants.data.find((t) => t.id === targetId);
```

### Incident and user role restrictions

- Use the Blackpoint portal for analyst workflow actions.
- Request role expansion from Blackpoint support.
- Keep automation resilient to 403 responses.

### Reporting operations

- Use `/v1/reports` for report inventory and filtering.
- Use `/v1/reports/{id}/json` for analytics and reconciliation workflows.
- Use `/v1/reports/{id}/url` for downloadable analyst artifacts.

## API Access Requests to Blackpoint

|Priority|Request|Reason|
|---|---|---|
|Critical|Grant incidents read access|Required for incident closeout automation|
|High|Grant users read access|Required for ownership enrichment and assignment checks|
|High|Publish role matrix for report routes|Required for deterministic report automation behavior|
|Medium|Publish explicit rate limits|Required for safe polling and bulk export operations|
|Medium|Clarify OpenAPI endpoint policy|Required for schema synchronization in CI|

## Contact

For API role grants, endpoint clarifications, or behavior changes, contact Blackpoint Cyber support or your account representative.
