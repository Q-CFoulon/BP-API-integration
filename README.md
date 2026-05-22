# Unified SOC Command Dashboard

Centralized Security Operations dashboard combining **Blackpoint Cyber (CompassOne)** and **Microsoft Defender XDR** into a single multi-tenant command surface. Built for Quisitive SecOps teams managing MDR-protected environments.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  React SPA (Vite)                                       │
│  ┌──────────┬──────────┬──────────┬───────────────────┐ │
│  │ Unified  │ Correla- │ Triage & │ Closeout          │ │
│  │ Dash     │ tions    │ Remediat.│ Governance        │ │
│  └──────────┴──────────┴──────────┴───────────────────┘ │
└───────────────────────────┬─────────────────────────────┘
                            │ HTTP /api/tenants/:alias/*
┌───────────────────────────┴─────────────────────────────┐
│  Express Backend (port 7071)                            │
│  ┌──────────┬──────────┬───────────────────────────────┐│
│  │ /bp/*    │ /xdr/*   │ /unified/*                    ││
│  │ Compass- │ Defender │ Correlations, Triage,         ││
│  │ One API  │ XDR API  │ Closeout, Audit               ││
│  └──────────┴──────────┴───────────────────────────────┘│
│  Middleware: Auth · RBAC · Tenant Isolation · Rate Limit│
│  Storage: Memory | PostgreSQL | Cosmos DB               │
└─────────────────────────────────────────────────────────┘
```

## Features

- **Multi-tenant architecture** — Per-tenant config with isolated API credentials and data scoping
- **Blackpoint CompassOne integration** — Detections, analytics, reports, and asset inventory
- **Microsoft Defender XDR integration** — Incidents, evidence links, writeback, and remediation
- **Cross-source correlation** — Link BP detections to XDR incidents (entity, temporal, title, or analyst-confirmed)
- **Learning Playbook Engine** — Adaptive triage recommendations with confidence scoring
- **Remediation proposals** — Human-in-the-loop approve/reject workflow with MCP bridge execution
- **Closeout governance** — Formal case closure with resolution taxonomy and audit trail
- **Full audit log** — Every action recorded with actor, timestamp, and context
- **Pluggable storage** — Memory (dev), PostgreSQL, or Cosmos DB backends

## Quick Start

### Prerequisites

- Node.js 20+
- npm 9+

### Install

```bash
npm install
```

### Configure Environment

```bash
# Required
COMPASSONE_API_KEY=your-blackpoint-api-key
COMPASSONE_API_URL=https://api.blackpointcyber.com

# Microsoft Defender XDR (per-tenant — configure in config/tenants.json)
# See config/tenants.example.json for full structure

# Optional storage (default: memory)
STORAGE_BACKEND=memory          # memory | postgres | cosmos
DATABASE_URL=postgresql://...   # for postgres
COSMOS_ENDPOINT=https://...     # for cosmos
COSMOS_KEY=...                  # for cosmos

# Auth (optional in dev)
AZURE_CLIENT_ID=...
AZURE_TENANT_ID=...
```

### Tenant Configuration

Copy and edit the tenant config:

```bash
cp config/tenants.example.json config/tenants.json
```

Each tenant entry includes:
- `alias` — URL-safe identifier used in all API paths
- `blackpoint` — customerId, apiKey override
- `microsoft` — tenantId, clientId, clientSecret, workloads array

### Run (Development)

```bash
npm run dev          # Starts both backend (tsx watch) + Vite dev server
```

Access:
- **Dashboard UI**: http://localhost:5173
- **API Health**: http://localhost:7071/health

### Build & Production

```bash
npm run build        # Builds client (Vite) + server (tsc)
npm start            # Runs compiled server serving SPA + API
```

### Docker

```bash
docker build -t soc-command .
docker run -p 7071:7071 --env-file .env soc-command
```

## API Reference

All tenant-scoped routes: `GET|POST|PATCH /api/tenants/:alias/...`

### Blackpoint (`/bp`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/bp/detections` | List detections (?status, ?skip, ?take) |
| GET | `/bp/detections/:id` | Get single detection |
| GET | `/bp/detections/:id/alerts` | Get alerts for detection |
| GET | `/bp/analytics/count` | Detection count (?status) |
| GET | `/bp/analytics/weekly-trends` | Weekly trend metrics |
| GET | `/bp/analytics/top-entities` | Top entities (?top) |
| GET | `/bp/analytics/top-threats` | Top threats (?top) |
| GET | `/bp/reports` | List reports (?reportType, ?page) |
| GET | `/bp/reports/:id/pdf` | Get signed PDF URL |
| GET | `/bp/reports/:id/json` | Get JSON report payload |
| GET | `/bp/assets` | List assets (?page, ?pageSize) |
| GET | `/bp/assets/count` | Asset count |

### Defender XDR (`/xdr`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/xdr/incidents` | List incidents (?top, ?filter) |
| GET | `/xdr/incidents/:id` | Get single incident |
| PATCH | `/xdr/incidents/:id` | Update incident (writeback) |
| GET | `/xdr/incidents/:id/case` | Get local case record |
| GET | `/xdr/evidence/:id` | Evidence links for incident |
| POST | `/xdr/remediation/plan` | Create remediation plan |
| GET | `/xdr/remediation/proposals` | List proposals (?incidentId) |
| GET | `/xdr/remediation/proposals/:id` | Get proposal |
| POST | `/xdr/remediation/proposals/:id/decide` | Approve/reject |

### Unified (`/unified`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/unified/alerts` | Cross-source alert timeline (?limit, ?source) |
| POST | `/unified/alerts` | Record alert snapshot |
| GET | `/unified/correlations` | List all correlations |
| POST | `/unified/correlations` | Create correlation link |
| GET | `/unified/correlations/by-detection/:id` | Correlations for BP detection |
| GET | `/unified/correlations/by-incident/:id` | Correlations for XDR incident |
| GET | `/unified/closeouts` | List closeout records (?limit) |
| POST | `/unified/closeouts` | Close a case |
| GET | `/unified/audit` | Audit event trail (?incidentId, ?actor) |
| GET | `/unified/audit/cases` | Local case records |
| GET | `/unified/audit/detections` | Local BP detections |
| POST | `/unified/triage/recommend` | Get playbook recommendations |
| GET | `/unified/triage/playbooks` | Export all playbooks |
| PUT | `/unified/triage/playbooks/:id` | Upsert playbook entry |
| POST | `/unified/triage/playbooks/:id/feedback` | Record feedback |

## Project Structure

```
src/
  backend/
    config/          # Tenant schema, loader, example JSON
    middleware/      # Auth, RBAC, rate limit, audit, tenant isolation
    routes/
      bp/            # Blackpoint CompassOne route handlers
      xdr/           # Defender XDR + remediation route handlers
      unified/       # Correlation, triage, closeout, audit
    services/        # API clients, playbook engine, MCP bridge
    storage/         # Repository interface + memory/postgres/cosmos
    server.ts        # Express entry point
  components/        # React UI panels
  services/          # Frontend API client (unifiedApi.ts)
  auth/              # MSAL config + React hooks
legacy/              # Original BP-only services (preserved)
config/              # tenants.json (gitignored), tenants.example.json
docs/                # Architecture proposals
grafana/             # Pre-built Grafana dashboards
```

## Development Scripts

```bash
npm run dev           # Full-stack dev (backend + Vite)
npm run dev:client    # Vite only
npm run dev:server    # Backend only (tsx watch)
npm run build         # Production build
npm run type-check    # TypeScript validation
npm run legacy:dev    # Legacy workflow sample
```

## Security

- API keys never logged (audit logger redacts sensitive fields)
- Per-tenant credential isolation — no cross-tenant data leakage
- Rate limiting per IP (100 req/15min default)
- Security headers via Helmet
- Input validation on all mutation endpoints
- MSAL PKCE for frontend auth, client_credentials for backend token acquisition

See [SECURITY_SUMMARY.md](SECURITY_SUMMARY.md) and [SECURITY_REVIEW.md](SECURITY_REVIEW.md).

## License

Proprietary — Quisitive
