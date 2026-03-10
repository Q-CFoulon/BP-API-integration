# Blackpoint Cyber API Limitations

## Overview

This document outlines the discovered limitations and available endpoints of the Blackpoint Cyber API based on real-world testing with production API keys.

## Testing Date

Last tested: **March 9, 2026** — comprehensive probe of 83 endpoints, including all known asset class variants.

## API Base URL

```text
https://api.blackpointcyber.com/v1
```

## Authentication

- **Method:** Bearer token
- **Header:** `Authorization: Bearer {api_key}`
- **Format:** API keys start with `bpc_`
- **Additional header (required by some endpoints):** `x-tenant-id: {tenantId}`

---

## ✅ Available Endpoints (Returning Real Data)

### GET /v1/tenants

**Status:** 200 OK — returns all 4 managed tenants.

**Response Format:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Company Name",
      "accountId": "uuid",
      "contactGroupId": "uuid",
      "created": "2025-11-18T21:19:39.746Z",
      "description": null,
      "enableDeliveryEmail": true,
      "domain": "https://example.com",
      "industryType": null,
      "snapAgentUrl": "https://installer.blackpointcyber.com/..."
    }
  ]
}
```

**Confirmed Tenants (Live):**

| Name | ID | Created |
|---|---|---|
| 4Refuel | `1b318c11-9fbf-4b2d-a12d-852c45c80e29` | 2025-11-18 |
| Heliene | `4fa09c2c-11f8-428c-b9e1-e3cb80794d15` | 2025-05-08 |
| NONIN Medical Inc | `3bc145e5-00bd-4be5-a9b2-76870f76860c` | 2025-11-18 |
| Quisitive Sandbox | `1ad02d21-1dc3-4ba7-98c5-c0f3348e3f62` | 2025-11-19 |

---

### GET /v1/assets

**Status:** 200 OK — confirmed returning real production data.

**IMPORTANT — Undocumented Requirements (discovered March 9, 2026):**

1. Requires `x-tenant-id` header — without it returns `400: x-tenant-id request header is required`
2. Requires `class[]` query parameter as an array — without it returns `400: class must be an array`

**Valid `class[]` enum values (4Refuel tenant):**

| Class | Description | Item Count | Has Data |
|---|---|---|---|
| `DEVICE` | Endpoints, servers, workstations | 331 | YES |
| `SOFTWARE` | Installed software inventory | 58,847 | YES |
| `USER` | User accounts (AD/M365) | 1,974 | YES |
| `SOURCE` | Data collection sources (agent, ZTAC, M365) | 5 | YES |
| `CONTAINER` | Containers | 0 | Empty |
| `FRAMEWORK` | Frameworks | 0 | Empty |
| `NETSTAT` | Network statistics | 0 | Empty |
| `PERSON` | Person records | 0 | Empty |
| `PROCESS` | Processes | 0 | Empty |
| `SERVICE` | Services | 0 | Empty |
| `SURVEY` | Survey data | 0 | Empty |

**Example request:**

```bash
GET /v1/assets?class[]=DEVICE&pageSize=50
x-tenant-id: 1b318c11-9fbf-4b2d-a12d-852c45c80e29
Authorization: Bearer bpc_...
```

**DEVICE response fields:**
`accountId`, `assetClass`, `createdOn`, `displayName`, `foundOn`, `id`, `lastSeenOn`, `model`, `name`, `production`, `tenantId`, `type`, `updatedOn`, `tags`, `agentLastSeenOn`, `agentVersion`, `firewallEnabled`, `fqdns`, `hardwareVendor`, `hostname`, `ips`, `macs`, `osDetails`, `osIsEol`, `osName`, `osUpdatesEnabled`, `osVersion`, `platform`, `publicIps`, `windowsDefenderEnabled`, `sources`

**USER response fields:**
`accountId`, `assetClass`, `displayName`, `email`, `emailDomain`, `username`, `active`, `admin`, `mfaExcluded`, `mfaRequired`, `sourceCreatedOn`, `sources`

**SOFTWARE response fields:**
`name`, `version`, `ports`, `urls`, `sources`, `lastSeenOn`, `foundOn`

**SOURCE types observed:** `AGENTENDPOINT`, `ZTAC`, `CLOUD_RESPONSE_M365`

**Pagination:** Supported via `pageSize` and `page` query params. Response includes `meta.totalItems`, `meta.totalPages`, `meta.currentPage`.

---

### GET /v1/notifications

**Status:** 200 OK — endpoint exists, currently returns empty array.

```json
{ "data": [] }
```

---

## 🔒 Access Denied — Endpoint Exists, Needs Role Permission Grant

These endpoints **exist** in the API (confirmed by 403 vs 404 response) but the current API key role does not have access:

| Endpoint | HTTP Status | Error Message | Action Required |
|---|---|---|---|
| `GET /v1/incidents` | 403 | `Forbidden resource` | Request `incidents:read` role from Blackpoint |
| `GET /v1/incidents?tenantId=...` | 403 | `Forbidden resource` | Same role-based restriction |
| `GET /v1/users` | 403 | `The current user does not have the roles required` | Request `users:read` role from Blackpoint |

**Note:** Adding the `x-tenant-id` header does **not** resolve the 403 on these endpoints — this is a server-side RBAC restriction on the API key's assigned role.

---

## ❌ Not Found — Endpoints Do Not Exist (404)

The following endpoints were probed and definitively do not exist in the current API:

**Alert / Detection / Threat endpoints (critical gap):**
- `GET /v1/alerts` (all variants including query params)
- `GET /v1/tickets`
- `GET /v1/cases`
- `GET /v1/detections`
- `GET /v1/threats`
- `GET /v1/security_events`
- `GET /v1/soc_alerts`
- `GET /v1/managed_detections`
- `GET /v1/investigations`
- `GET /v1/events`

**Per-tenant sub-routes (all 404):**
- `GET /v1/tenants/:tenantId` (individual tenant lookup)
- `GET /v1/tenants/:tenantId/alerts`
- `GET /v1/tenants/:tenantId/incidents`
- `GET /v1/tenants/:tenantId/tickets`
- `GET /v1/tenants/:tenantId/detections`
- `GET /v1/tenants/:tenantId/events`
- `GET /v1/tenants/:tenantId/devices`
- `GET /v1/tenants/:tenantId/users`
- `GET /v1/tenants/:tenantId/notifications`
- `GET /v1/tenants/:tenantId/reports`
- `GET /v1/tenants/:tenantId/summary`
- `GET /v1/tenants/:tenantId/status`

**Reporting / Analytics:**
- `GET /v1/reports`, `/reports/summary`, `/reports/alerts`
- `GET /v1/analytics`, `/dashboard`, `/metrics`, `/statistics`, `/scores`
- `GET /v1/health`, `/status`, `/version`

**Account / Identity:**
- `GET /v1/account`, `/me`, `/user`, `/profile`
- `GET /v1/organization`, `/org`, `/partner`, `/msp`

**Configuration:**
- `GET /v1/policies`, `/settings`, `/config`, `/rules`, `/playbooks`
- `GET /v1/integrations`, `/webhooks`, `/audit`, `/audit_logs`, `/logs`

**Agent / Device (legacy patterns):**
- `GET /v1/agents`, `/snap`, `/snap_agents`, `/devices`, `/endpoints`, `/machines`

**API Discovery:**
- `GET /v1/openapi`, `/swagger`, `/docs` — no public API spec available

---

## API Limitations Summary

### 1. No Alert or Incident Data via API

The most critical gap. No endpoints exist for `alerts`, `tickets`, `cases`, `detections`, `threats`, or `events`. The `/incidents` endpoint exists but is access-restricted (403). All SOC alert management must be done through the Blackpoint portal.

### 2. No Per-Tenant Lookup

Cannot fetch a single tenant by ID. Must fetch all tenants via `GET /v1/tenants` and filter client-side.

### 3. `/assets` Requires Undocumented Headers

The `/assets` endpoint requires both `x-tenant-id` header AND `class[]` array parameter — neither is documented in any available API reference. Discovered via 400 error introspection of the `ListAssetsQueryDto` validation schema.

### 4. Role-Based Access Blocks Incident Data

`/incidents` and `/users` exist server-side but return 403. The current API key role does not include read access to these resources. Requires Blackpoint to grant elevated API role permissions.

### 5. No API Documentation Available

- `GET /v1/openapi` — 404
- `GET /v1/swagger` — 404
- `GET /v1/docs` — 404

No public OpenAPI spec is available. All endpoint discovery was done via manual probing.

### 6. No Rate Limit Headers

API does not return `X-RateLimit-*` headers. Rate limits are unknown. Client currently uses conservative 60 requests/minute limit.

---

## Workarounds

### Tenant Details

```typescript
const tenants = await apiClient.get('/tenants');
const tenant = tenants.data.find(t => t.id === targetId);
```

### Device / Asset Inventory (now available)

```typescript
// Requires x-tenant-id header
GET /v1/assets?class[]=DEVICE&pageSize=100
x-tenant-id: {tenantId}
```

### Alert Monitoring

Until the `/incidents` role is granted:
- Use the Blackpoint Cyber web portal for alert management
- Export alerts manually
- Explore Blackpoint webhook/notification options

---

## Report to Blackpoint: API Access Request

**Date:** March 9, 2026
**Testing scope:** 83 endpoints probed against production API
**API key prefix:** `bpc_67ec14...`

### Access Needed

| Priority | Endpoint | Current Status | Requested |
|---|---|---|---|
| Critical | `GET /v1/incidents` | 403 Forbidden | Grant `incidents:read` role |
| Critical | Alert endpoints (`/alerts`, `/detections`, `/threats`) | 404 — does not exist | Request endpoint access or confirm alternative |
| High | `GET /v1/users` | 403 Forbidden | Grant `users:read` role |
| High | `GET /v1/tenants/:tenantId` | 404 | Confirm if individual tenant lookup is supported |
| Medium | OpenAPI/Swagger spec | 404 | Request API documentation |
| Low | Webhook/push notification for alerts | Unknown | Confirm if available and how to subscribe |

---

## Contact

For API access questions, contact Blackpoint Cyber support or your account representative.


- `GET /v1/alerts`
- `GET /v1/incidents`  
- `GET /v1/tickets`
- `GET /v1/cases`
- `GET /v1/tenants/:tenantId`
- `GET /v1/tenants/:tenantId/alerts`
- `GET /v1/tenants/:tenantId/tickets`
- `GET /v1/tenants/:tenantId/incidents`
- `GET /v1/alerts?tenant_id={id}`
- `GET /v1/detections`
- `GET /v1/events`
- `GET /v1/threats`
- `GET /v1/security_events`
- `GET /v1/soc_alerts`
- `GET /v1/managed_detections`
- `GET /v1/investigations`
- `GET /v1/tenants/:tenantId/detections`
- `GET /v1/tenants/:tenantId/events`
- `GET /v1/tenants/:tenantId/agents`
- `GET /v1/tenants/:tenantId/devices`
- `GET /v1/tenants/:tenantId/endpoints`

### ⚠️ 403 Forbidden

- `GET /v1/incidents` - Returns 403 (endpoint may exist but access is restricted)

## API Limitations

### 1. No Individual Tenant Details

- Cannot fetch details for a specific tenant by ID
- Must fetch all tenants and filter client-side
- Tenant list endpoint does not support filtering parameters

### 2. No Alert/Incident Data

- No access to alert or incident data through the API
- SOC alert management must be done through Blackpoint portal
- Cannot programmatically track alert lifecycle

### 3. No Device/Endpoint Information

- Cannot list protected endpoints per tenant
- No access to SNAP agent deployment status
- Cannot query device inventory

### 4. Limited Pagination

- Tenant endpoint does not appear to support pagination
- All tenants returned in single response
- May become issues with large tenant counts (100+)

### 5. No Search or Filtering

- No query parameters accepted for filtering
- All filtering must be done client-side
- Cannot search tenants by name or other criteria

### 6. No Rate Limit Headers

- API does not return `X-RateLimit-*` headers
- Rate limits unknown and must be tested carefully
- Implemented conservative 60 requests/minute in client

## Workarounds

### Tenant Details

Since individual tenant endpoints don't exist:

```typescript
// Fetch all tenants
const tenants = await apiClient.get('/tenants');

// Filter client-side  
const tenant = tenants.data.find(t => t.id === targetId);
```

### Alert Monitoring

Since alert endpoints are unavailable:

- Use Blackpoint Cyber web portal for alert management
- Export alerts manually if needed
- Consider using Blackpoint webhooks if available

### Device Tracking

Since device endpoints are unavailable:

- Track SNAP agent deployments externally
- Use tenant `snapAgentUrl` for installer access
- Monitor via Blackpoint portal

## API Response Patterns

### Success Response

```json
{
  "data": [...]
}
```

### Error Response

```json
{
  "message": "Cannot GET /v1/endpoint",
  "error": "Not Found",
  "statusCode": 404
}
```

### Authentication Error

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## Recommendations

### For Blackpoint Cyber

1. **Add tenant detail endpoint** - `GET /v1/tenants/:id`
2. **Add alert/incident endpoints** - Enable programmatic alert access
3. **Add filtering parameters** - Support query parameters for tenant list
4. **Add pagination** - Support for large tenant counts
5. **Add device/endpoint endpoints** - Enable device inventory queries
6. **Document rate limits** - Provide clear rate limit information
7. **Add API documentation** - Public API reference documentation

### For Integration Developers

1. **Cache tenant data** - Reduce API calls by caching tenant list
2. **Implement conservative rate limiting** - Default to 60 req/min
3. **Use external alert tracking** - Don't rely on API for alerts
4. **Build tenant dashboard** - Focus on available tenant monitoring features
5. **Monitor API changes** - Periodically test for new endpoints

## Testing Methodology

Endpoints were discovered using:

```javascript
const endpoints = [/* list of common API endpoints */];

for (const endpoint of endpoints) {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  });
  console.log(`${response.status} - ${endpoint}`);
}
```

## Future Updates

This document will be updated as:

- New endpoints become available
- API changes are discovered
- Additional limitations are found
- Workarounds are developed

## Contact

For API access questions, contact Blackpoint Cyber support or your account representative.
