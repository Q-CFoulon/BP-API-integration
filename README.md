# Blackpoint Cyber API Integration

SOC Operations Dashboard for monitoring Blackpoint Cyber protected clients.

## Features

- 🛡️ **Tenant Monitoring** - Real-time oversight of all protected clients
- 📊 **Professional Dashboard UI** - Inspired by Quisitive Spyglass MDR design
- 🔄 **Auto-Refresh** - Configurable refresh intervals for live data
- 📱 **Responsive Design** - Modern, clean interface for SOC analysts
- 🔒 **Secure API Integration** - Bearer token authentication with Blackpoint Cyber API

## Quick Start

### Prerequisites

- Node.js 16+ installed
- Blackpoint Cyber API key

### Installation

```bash
npm install
```

### Configuration

Set your API key as an environment variable:

```powershell
# PowerShell
$env:BLACKPOINT_API_KEY = "your-api-key-here"

# Or create a .env file
BLACKPOINT_API_KEY=your-api-key-here
BLACKPOINT_API_URL=https://api.blackpointcyber.com
```

### Running the Dashboard

**Terminal Dashboard:**

```bash
npm run dev
```

**Web Dashboard (React UI):**

```bash
npm run dashboard
```

**Quick API Test:**

```bash
npm run test-api
```

**Discover Available Endpoints:**

```bash
npm run discover
```

## Dashboard Features

### Tenant Monitoring

- View all protected clients
- Monitor protection status
- Track onboarding dates
- Access SNAP agent installers
- View tenant configurations

### System Status

- Real-time connection status
- Active notification tracking
- Last update timestamps
- Manual refresh capability

## API Endpoints

### Available Endpoints

✅ **GET /v1/tenants** - List all tenants
✅ **GET /v1/notifications** - Get notifications

### Tested But Unavailable

❌ /v1/alerts (404)
❌ /v1/incidents (403)
❌ /v1/tenants/:id (404)
❌ /v1/tenants/:id/alerts (404)

See [API_LIMITATIONS.md](API_LIMITATIONS.md) for details.

## Project Structure

```text
src/
├── components/
│   ├── TenantDashboard.tsx    # Modern SOC dashboard UI
│   └── AlertDashboard.tsx    # Legacy alert dashboard
├── services/
│   ├── blackpoint-api.service.ts   # API client
│   ├── tenant.service.ts           # Tenant operations
│   ├── dashboard.service.ts        # Dashboard data
│   └── lifecycle.service.ts        # Alert tracking
├── types/
│   └── blackpoint.types.ts    # TypeScript interfaces
├── utils/
│   ├── blackpoint.config.ts   # API configuration
│   ├── rate-limiter.ts        # Rate limiting
│   └── secure-logger.ts       # Secure logging
└── examples/
    ├── soc-workflow-complete.ts    # CLI example
    └── dashboard-app.tsx           # React dashboard app
```

## Development

**Build TypeScript:**

```bash
npm run build
```

**Watch Mode:**

```bash
npm run watch
```

**Type Check:**

```bash
npm run type-check
```

## Security

- API keys are never logged or exposed
- Secure logger redacts sensitive information
- Rate limiting prevents API abuse
- Input sanitization on all user inputs

See [SECURITY_SUMMARY.md](SECURITY_SUMMARY.md) for details.

## License

Proprietary - Quisitive
