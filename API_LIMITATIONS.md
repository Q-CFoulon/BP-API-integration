# Blackpoint Cyber API Limitations

## Overview

This document outlines the discovered limitations and available endpoints of the Blackpoint Cyber API based on real-world testing with production API keys.

## Testing Date

Last tested: March 2, 2026

## API Base URL

```text
https://api.blackpointcyber.com/v1
```

## Authentication

- **Method:** Bearer token
- **Header:** `Authorization: Bearer {api_key}`
- **Format:** API keys start with `bpc_`

## Available Endpoints

### ✅ Working Endpoints

#### GET /v1/tenants

**Status:** 200 OK

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
      "description": null | "string",
      "enableDeliveryEmail": boolean,
      "domain": "https://example.com",
      "industryType": null | "string",
      "snapAgentUrl": "https://installer.blackpointcyber.com/..."
    }
  ]
}
```

**Use Cases:**

- List all protected tenants
- Monitor client onboarding
- Access SNAP agent installers
- Track tenant configurations

#### GET /v1/notifications

**Status:** 200 OK

**Response Format:**

```json
{
  "data": []
}
```

**Notes:**

- Returns empty array in current testing
- Endpoint exists and is accessible
- Likely used for system notifications or alerts

## Unavailable Endpoints

### ❌ 404 Not Found

The following endpoints were tested and returned 404:

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
