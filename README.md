# Blackpoint Cyber API Integration

SOC operations dashboard for monitoring Blackpoint-protected tenants, correlating Defender XDR ownership, and supporting closeout governance.

## Latest Changes

- Updated detections integration to CompassOne v1.7.0 semantics, including list/count/by-week alignment and expanded filters.
- Added native report endpoint integration for list, PDF URL, binary payload, and JSON payload retrieval.
- Added tenant closeout reconciliation metrics between Blackpoint detections and Office365 Defender XDR incidents.
- Added closeout governance export view with CSV output fields for BP ticket ID, XDR incident reference, and reconciliation status.
- Added analyst-confirmed correlation overrides that persist per tenant and are reused on future loads.

## Features

- Multi-tenant monitoring dashboard.
- Detection lifecycle visibility for OPEN and RESOLVED alert groups.
- Detection reporting tab with aggregate stats, risk distribution, and recent closed detections.
- Native report inventory and drill-down actions.
- Microsoft Defender XDR ownership and triage queue view.
- Closeout governance export and analyst override workflow.

## Quick Start

### Prerequisites

- Node.js 16+
- Blackpoint API key

### Install

```bash
npm install
```

### Configure Environment

```powershell
# Legacy TypeScript services and scripts
$env:BLACKPOINT_API_KEY = "your-api-key-here"
$env:BLACKPOINT_API_URL = "https://api.blackpointcyber.com"

# React dashboard service calls
$env:REACT_APP_BLACKPOINT_API_KEY = "your-api-key-here"
```

### Run

```bash
npm run dev        # legacy workflow sample
npm run dashboard  # React UI
npm run test-api   # quick API check
npm run discover   # endpoint probe utility
```

## Functioning Detections Endpoints

All detections endpoints below are implemented and used in the current integration. Tenant-scoped requests should include `x-tenant-id`.

|Endpoint|Status|Primary use in this repo|
|---|---|---|
|`GET /v1/alert-groups`|Functioning|List OPEN and RESOLVED detections with filtering and pagination|
|`GET /v1/alert-groups/{alertGroupId}`|Functioning|Fetch one detection group by ID|
|`GET /v1/alert-groups/{alertGroupId}/alerts`|Functioning|Fetch underlying alerts for a detection group|
|`GET /v1/alert-groups/count`|Functioning|Count detections by filter set|
|`GET /v1/alert-groups/alert-groups-by-week`|Functioning|Weekly detection trend metrics|
|`GET /v1/alert-groups/top-detections-by-entity`|Functioning|Top detections grouped by entity|
|`GET /v1/alert-groups/top-detections-by-threat`|Functioning|Top detections grouped by threat|

Validated list filtering on `/v1/alert-groups` includes:

- `status` (`OPEN`, `RESOLVED`)
- `type` (`CR`, `MDR`)
- `search`
- `tunnelSearch`
- `since`
- `minAlertsCount`
- `maxAlertsCount`
- `sortByColumn`
- `sortDirection`
- `take`
- `skip`

## Functioning Reports Endpoints

All report endpoints below are integrated in the current frontend service layer.

|Endpoint|Status|Primary use in this repo|
|---|---|---|
|`GET /v1/reports`|Functioning|List tenant report runs with paging and filtering|
|`GET /v1/reports/{id}/url`|Functioning|Open signed PDF URL for analyst consumption|
|`GET /v1/reports/{id}/binary`|Functioning|Retrieve base64 report payload for binary workflows|
|`GET /v1/reports/{id}/json`|Functioning|Retrieve machine-readable JSON report payload|

Current report filtering options wired in the service:

- `page`
- `pageSize`
- `sortBy=intervalStart`
- `sortOrder`
- `reportType` (`Cloud`, `Executive`, `MDR`)
- `startDate`
- `endDate`

Report run parsing also supports `VulnerabilityManagement` values when returned in API payloads.

## XDR Closeout Governance

The tenant ownership panel now includes:

- Closeout reconciliation summary counters:
- `CLOSED_BOTH`
- `XDR_ACTIVE_BP_CLOSED`
- `BP_ACTIVE_XDR_CLOSED`
- unmatched counts for XDR and BP
- CSV export with correlation method and confidence metadata
- Analyst override actions:
- Confirm Match
- Mark No Match
- Clear Override

## Role-Limited or Historically Unavailable Routes

Some routes may still be role-limited or unavailable depending on API key permissions and tenant configuration.

- `/v1/incidents` can return 403 without role grant.
- `/v1/users` can return 403 without role grant.
- Historical 404 families include `/v1/alerts`, `/v1/tickets`, `/v1/cases`, and others.

See [API_LIMITATIONS.md](API_LIMITATIONS.md) for the full compatibility matrix and request guidance.

## Project Structure

```text
src/
  components/
    Dashboard.tsx
    DetectionReportingDashboard.tsx
    TenantXdrOwnershipPanel.tsx
  services/
    blackpointReports.service.ts
    defenderXdr.service.ts
    closeoutGovernance.service.ts
legacy/
  services/
    alert.service.ts
  types/
    blackpoint.types.ts
  utils/
    blackpoint.config.ts
```

## Development Scripts

```bash
npm run build
npm run watch
npm run type-check
```

## Security Notes

- API keys are not logged.
- Rate limiting and sanitization utilities are included.
- Security documentation is maintained in repository markdown files.

See [SECURITY_SUMMARY.md](SECURITY_SUMMARY.md) and [SECURITY_REVIEW.md](SECURITY_REVIEW.md).

## License

Proprietary - Quisitive
