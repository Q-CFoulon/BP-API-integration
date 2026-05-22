diff --git a/server.js b/server.js
--- server.js
+++ server.js
@@ -1,60 +1,119 @@
-require('dotenv').config({ path: require('path').join(__dirname, '.env') });
-const express = require('express');
-const path = require('path');
-const { createProxyMiddleware } = require('http-proxy-middleware');
-
-const app = express();
-const PORT = process.env.PORT || 4010;
-const BP_API_KEY = process.env.BLACKPOINT_API_KEY || '';
-
-// Proxy /v1 requests to the Blackpoint CompassOne API
-// Express strips the mount path, so target includes /v1
-const v1ProxyOptions = {
-  target: 'https://api.blackpointcyber.com/v1',
-  changeOrigin: true,
-};
-if (BP_API_KEY) {
-  v1ProxyOptions.headers = { Authorization: 'Bearer ' + BP_API_KEY };
-}
-app.use('/v1', createProxyMiddleware(v1ProxyOptions));
-
-// Optional backend proxies
-if (process.env.DEFENDER_XDR_PROXY_TARGET) {
-  app.use('/api/defender-xdr', createProxyMiddleware({
-    target: process.env.DEFENDER_XDR_PROXY_TARGET,
-    changeOrigin: true,
-  }));
-}
-if (process.env.O365_PROXY_TARGET) {
-  app.use('/api/o365', createProxyMiddleware({
-    target: process.env.O365_PROXY_TARGET,
-    changeOrigin: true,
-  }));
-}
-if (process.env.SENTINEL_PROXY_TARGET) {
-  app.use('/api/sentinel', createProxyMiddleware({
-    target: process.env.SENTINEL_PROXY_TARGET,
-    changeOrigin: true,
-  }));
-}
-if (process.env.DEFENDER_MCP_PROXY_TARGET) {
-  app.use('/api/defender-mcp', createProxyMiddleware({
-    target: process.env.DEFENDER_MCP_PROXY_TARGET,
-    changeOrigin: true,
-  }));
-}
-
-// Serve static files from the React build directory
-app.use(express.static(path.join(__dirname, 'build')));
-
-// SPA fallback
-app.use((req, res) => {
-  res.sendFile(path.join(__dirname, 'build', 'index.html'));
-});
-
-app.listen(PORT, () => {
-  console.log('Dashboard running on port ' + PORT);
-  if (!BP_API_KEY) {
-    console.warn('WARNING: BLACKPOINT_API_KEY not set - API calls will fail');
-  }
-});
\ No newline at end of file
+require('dotenv').config({ path: require('path').join(__dirname, '.env') });
+const express = require('express');
+const path = require('path');
+const { createProxyMiddleware } = require('http-proxy-middleware');
+
+<<<<<<< HEAD
+const app = express();
+const PORT = process.env.PORT || 4010;
+const BP_API_KEY = process.env.BLACKPOINT_API_KEY || '';
+
+// Proxy /v1 requests to the Blackpoint CompassOne API
+// Express strips the mount path, so target includes /v1
+const v1ProxyOptions = {
+  target: 'https://api.blackpointcyber.com/v1',
+  changeOrigin: true,
+};
+if (BP_API_KEY) {
+  v1ProxyOptions.headers = { Authorization: 'Bearer ' + BP_API_KEY };
+}
+app.use('/v1', createProxyMiddleware(v1ProxyOptions));
+
+// Optional backend proxies
+if (process.env.DEFENDER_XDR_PROXY_TARGET) {
+  app.use('/api/defender-xdr', createProxyMiddleware({
+    target: process.env.DEFENDER_XDR_PROXY_TARGET,
+    changeOrigin: true,
+  }));
+}
+if (process.env.O365_PROXY_TARGET) {
+  app.use('/api/o365', createProxyMiddleware({
+    target: process.env.O365_PROXY_TARGET,
+    changeOrigin: true,
+  }));
+}
+if (process.env.SENTINEL_PROXY_TARGET) {
+  app.use('/api/sentinel', createProxyMiddleware({
+    target: process.env.SENTINEL_PROXY_TARGET,
+    changeOrigin: true,
+  }));
+}
+if (process.env.DEFENDER_MCP_PROXY_TARGET) {
+  app.use('/api/defender-mcp', createProxyMiddleware({
+    target: process.env.DEFENDER_MCP_PROXY_TARGET,
+    changeOrigin: true,
+  }));
+}
+
+// Serve static files from the React build directory
+app.use(express.static(path.join(__dirname, 'build')));
+
+// SPA fallback
+app.use((req, res) => {
+  res.sendFile(path.join(__dirname, 'build', 'index.html'));
+});
+
+app.listen(PORT, () => {
+  console.log('Dashboard running on port ' + PORT);
+  if (!BP_API_KEY) {
+    console.warn('WARNING: BLACKPOINT_API_KEY not set - API calls will fail');
+  }
+});
+
+=======
+const app = express();
+const PORT = process.env.PORT || 4010;
+const BP_API_KEY = process.env.BLACKPOINT_API_KEY || '';
+
+// Proxy /v1 requests to the Blackpoint CompassOne API
+// Express strips the mount path, so target includes /v1
+const v1ProxyOptions = {
+  target: 'https://api.blackpointcyber.com/v1',
+  changeOrigin: true,
+};
+if (BP_API_KEY) {
+  v1ProxyOptions.headers = { Authorization: 'Bearer ' + BP_API_KEY };
+}
+app.use('/v1', createProxyMiddleware(v1ProxyOptions));
+
+// Optional backend proxies
+if (process.env.DEFENDER_XDR_PROXY_TARGET) {
+  app.use('/api/defender-xdr', createProxyMiddleware({
+    target: process.env.DEFENDER_XDR_PROXY_TARGET,
+    changeOrigin: true,
+  }));
+}
+if (process.env.O365_PROXY_TARGET) {
+  app.use('/api/o365', createProxyMiddleware({
+    target: process.env.O365_PROXY_TARGET,
+    changeOrigin: true,
+  }));
+}
+if (process.env.SENTINEL_PROXY_TARGET) {
+  app.use('/api/sentinel', createProxyMiddleware({
+    target: process.env.SENTINEL_PROXY_TARGET,
+    changeOrigin: true,
+  }));
+}
+if (process.env.DEFENDER_MCP_PROXY_TARGET) {
+  app.use('/api/defender-mcp', createProxyMiddleware({
+    target: process.env.DEFENDER_MCP_PROXY_TARGET,
+    changeOrigin: true,
+  }));
+}
+
+// Serve static files from the React build directory
+app.use(express.static(path.join(__dirname, 'build')));
+
+// SPA fallback
+app.use((req, res) => {
+  res.sendFile(path.join(__dirname, 'build', 'index.html'));
+});
+
+app.listen(PORT, () => {
+  console.log('Dashboard running on port ' + PORT);
+  if (!BP_API_KEY) {
+    console.warn('WARNING: BLACKPOINT_API_KEY not set - API calls will fail');
+  }
+});
+>>>>>>> e7473cead40f3314f532fd53ed5e94e0dd0ecbaf
\ No newline at end of file
diff --git a/package.json b/package.json
--- package.json
+++ package.json
@@ -1,39 +1,58 @@
 {
   "name": "bp-api-integration",
-  "version": "1.0.0",
-  "description": "Blackpoint Cyber API Integration - SOC Alert Dashboard with Lifecycle Tracking",
-  "main": "dist/index.js",
-  "types": "dist/index.d.ts",
+  "version": "2.0.0",
+  "type": "module",
+  "description": "Unified SOC Command Dashboard — Blackpoint + Microsoft Defender XDR Integration",
   "scripts": {
-    "dev": "npx ts-node --project tsconfig.legacy.json legacy/examples/soc-workflow-complete.ts",
-    "build": "npx tsc",
-    "watch": "npx tsc --watch",
-    "start": "npx node dist/examples/soc-workflow-complete.js",
-    "test-api": "npx node quick-test.js",
-    "discover": "npx node discover-api.js",
-    "dashboard": "npx react-scripts start",
-    "export": "npx ts-node -e \"import { createLifecycleService } from './src/services/lifecycle.service'; const svc = createLifecycleService(); console.log(svc.exportAsCsv());\"",
-    "type-check": "npx tsc --noEmit"
+    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
+    "dev:client": "vite",
+    "dev:server": "tsx watch src/backend/server.ts",
+    "build": "npm run build:client && npm run build:server",
+    "build:client": "vite build",
+    "build:server": "tsc -p tsconfig.server.json",
+    "start": "node dist-server/backend/server.js",
+    "preview": "vite preview",
+    "type-check": "tsc --noEmit && tsc -p tsconfig.server.json --noEmit",
+    "legacy:dev": "ts-node --project tsconfig.legacy.json legacy/examples/soc-workflow-complete.ts",
+    "legacy:serve": "node server.js"
   },
   "dependencies": {
+    "@azure/msal-browser": "^3.27.0",
+    "@azure/msal-react": "^2.1.0",
     "ajv": "^8.18.0",
+<<<<<<< HEAD
+    "ajv-formats": "^3.0.1",
+    "dotenv": "^16.4.0",
+    "express": "^4.21.0",
+    "helmet": "^8.0.0",
+    "http-proxy-middleware": "^3.0.0",
+    "jsonwebtoken": "^9.0.0",
+    "jwks-rsa": "^3.1.0",
+=======
     "dotenv": "^17.4.2",
     "express": "^5.2.1",
     "http-proxy-middleware": "^4.0.0",
+>>>>>>> e7473cead40f3314f532fd53ed5e94e0dd0ecbaf
     "react": "^18.2.0",
     "react-dom": "^18.2.0"
   },
   "devDependencies": {
+    "@types/express": "^5.0.0",
+    "@types/jsonwebtoken": "^9.0.0",
     "@types/node": "^20.0.0",
     "@types/react": "^18.0.0",
     "@types/react-dom": "^18.0.0",
+    "@vitejs/plugin-react": "^4.3.0",
+    "concurrently": "^9.0.0",
     "react-scripts": "5.0.1",
     "ts-node": "^10.9.0",
-    "typescript": "^5.0.0"
+    "tsx": "^4.19.0",
+    "typescript": "^5.0.0",
+    "vite": "^6.0.0"
   },
   "engines": {
-    "node": ">=16.0.0"
+    "node": ">=20.0.0"
   },
   "browserslist": {
     "production": [
       ">0.2%",
diff --git a/Dockerfile b/Dockerfile
new file mode 100644
--- /dev/null
+++ b/Dockerfile
@@ -0,0 +1,43 @@
+# ---------------------------------------------------------------------------
+# Multi-stage Dockerfile — Unified SOC Dashboard
+# ---------------------------------------------------------------------------
+# Stage 1: Build React SPA (Vite) + Backend (TypeScript)
+# Stage 2: Production runtime (Node.js only, no devDeps)
+# ---------------------------------------------------------------------------
+
+# ---- Build Stage ----
+FROM node:20-alpine AS builder
+
+WORKDIR /app
+
+COPY package.json package-lock.json* ./
+RUN npm ci
+
+COPY tsconfig.json tsconfig.server.json vite.config.ts index.html ./
+COPY public/ ./public/
+COPY src/ ./src/
+COPY config/ ./config/
+
+# Build frontend (Vite → dist/) and backend (tsc → dist-server/)
+RUN npm run build
+
+# ---- Production Stage ----
+FROM node:20-alpine
+
+WORKDIR /app
+
+COPY package.json package-lock.json* ./
+RUN npm ci --omit=dev
+
+# Copy build artifacts from builder
+COPY --from=builder /app/dist/ ./dist/
+COPY --from=builder /app/dist-server/ ./dist-server/
+COPY config/ ./config/
+
+# Legacy server preserved for backward compat
+COPY server.js ./
+COPY build/ ./build/
+
+EXPOSE 7071
+CMD ["node", "dist-server/backend/server.js"]
diff --git a/.env.example b/.env.example
--- .env.example
+++ .env.example
@@ -1,9 +1,9 @@
 # Blackpoint Cyber API Configuration (legacy Node scripts)
 BLACKPOINT_API_URL=https://api.blackpointcyber.com
-BLACKPOINT_API_KEY=bpc_67ec14a0594515aa7c75f2de54a9699898442e30c34a1397034776bf75d7dde0
+BLACKPOINT_API_KEY= 
 
 # React dashboard (REACT_APP_ prefix is required by Create React App)
 # Copy these into a .env file — DO NOT commit .env to source control.
-REACT_APP_BLACKPOINT_API_KEY=bpc_67ec14a0594515aa7c75f2de54a9699898442e30c34a1397034776bf75d7dde0
+REACT_APP_BLACKPOINT_API_KEY=
 # Optional: restrict dashboard to a single tenant. Leave blank to show all tenants.
 REACT_APP_BLACKPOINT_TENANT_ID=
diff --git a/.env b/.env
new file mode 100644
--- /dev/null
+++ b/.env
@@ -0,0 +1,10 @@
+# Blackpoint Cyber API Configuration (legacy Node scripts)
+BLACKPOINT_API_URL=https://api.blackpointcyber.com
+BLACKPOINT_API_KEY= bpc_67ec14a0594515aa7c75f2de54a9699898442e30c34a1397034776bf75d7dde0
+
+# React dashboard (REACT_APP_ prefix is required by Create React App)
+# Copy these into a .env file — DO NOT commit .env to source control.
+REACT_APP_BLACKPOINT_API_KEY=bpc_67ec14a0594515aa7c75f2de54a9699898442e30c34a1397034776bf75d7dde0
+# Optional: restrict dashboard to a single tenant. Leave blank to show all tenants.
+REACT_APP_BLACKPOINT_TENANT_ID=
diff --git a/src/backend/config/tenants.schema.ts b/src/backend/config/tenants.schema.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/config/tenants.schema.ts
@@ -0,0 +1,91 @@
+// ---------------------------------------------------------------------------
+// Unified Tenant Configuration Schema
+// ---------------------------------------------------------------------------
+// Each tenant entry combines Blackpoint CompassOne credentials with
+// Microsoft Entra ID / Defender XDR credentials in a single config object.
+// Secrets use ${ENV_VAR} interpolation resolved at load time from
+// environment variables or Azure Key Vault references.
+// ---------------------------------------------------------------------------
+
+export type DefenderWorkload =
+  | 'DefenderForEndpoint'
+  | 'DefenderForIdentity'
+  | 'DefenderForOffice365'
+  | 'DefenderForCloudApps'
+  | 'DefenderXdr';
+
+export interface BlackpointTenantConfig {
+  /** CompassOne customer/tenant ID (UUID from /v1/tenants) */
+  customerId: string;
+  /** Override base URL if customer is on a regional endpoint */
+  apiBaseUrl?: string;
+  /** Tenant-specific API key if not using account-level key */
+  apiKeyOverride?: string;
+}
+
+export interface MicrosoftTenantConfig {
+  /** Azure AD / Entra tenant ID */
+  tenantId: string;
+  /** Entra app registration client ID */
+  clientId: string;
+  /** Client secret (prefer cert in production) — resolved from env/KV */
+  clientSecret: string;
+  /** Override security API host for regional deployments */
+  securityApiHost?: string;
+  /** Which Defender workloads are enabled for this tenant */
+  enabledWorkloads: DefenderWorkload[];
+}
+
+export interface UnifiedTenantConfig {
+  /** Human-readable alias used in URLs and UI (e.g., "contoso") */
+  alias: string;
+  /** Customer display name */
+  displayName: string;
+
+  /** Blackpoint CompassOne configuration (optional — tenant may be BP-only or MS-only) */
+  blackpoint?: BlackpointTenantConfig;
+
+  /** Microsoft Defender XDR / Entra ID configuration */
+  microsoft?: MicrosoftTenantConfig;
+
+  /** Whether tenant is active */
+  enabled: boolean;
+  /** Tags for filtering/grouping (e.g., "tier-1", "healthcare") */
+  tags?: string[];
+  /** Primary SOC analyst assigned */
+  primaryAnalyst?: string;
+  /** Onboarding date */
+  onboardedAt?: string;
+}
+
+/** Tenant summary safe to return in API responses (no secrets) */
+export interface TenantSummary {
+  alias: string;
+  displayName: string;
+  enabled: boolean;
+  tags?: string[];
+  primaryAnalyst?: string;
+  onboardedAt?: string;
+  capabilities: {
+    blackpoint: boolean;
+    microsoft: boolean;
+    enabledWorkloads: DefenderWorkload[];
+  };
+}
+
+export function toTenantSummary(tenant: UnifiedTenantConfig): TenantSummary {
+  return {
+    alias: tenant.alias,
+    displayName: tenant.displayName,
+    enabled: tenant.enabled,
+    tags: tenant.tags,
+    primaryAnalyst: tenant.primaryAnalyst,
+    onboardedAt: tenant.onboardedAt,
+    capabilities: {
+      blackpoint: !!tenant.blackpoint,
+      microsoft: !!tenant.microsoft,
+      enabledWorkloads: tenant.microsoft?.enabledWorkloads ?? [],
+    },
+  };
+}
diff --git a/src/backend/config/loader.ts b/src/backend/config/loader.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/config/loader.ts
@@ -0,0 +1,104 @@
+// ---------------------------------------------------------------------------
+// Tenant Configuration Loader
+// ---------------------------------------------------------------------------
+// Loads tenant config from JSON file with environment variable interpolation
+// for secrets. Validates tenant aliases and provides lookup helpers.
+// ---------------------------------------------------------------------------
+
+import { readFile } from 'node:fs/promises';
+import path from 'node:path';
+import { UnifiedTenantConfig } from './tenants.schema.js';
+
+const DEFAULT_CONFIG_PATH = path.join(process.cwd(), 'config', 'tenants.json');
+
+/**
+ * Interpolate ${ENV_VAR} placeholders in string values with environment variables.
+ * Throws if a referenced env var is not set.
+ */
+function interpolateSecrets(obj: unknown): unknown {
+  if (typeof obj === 'string') {
+    return obj.replace(/\$\{([^}]+)\}/g, (_match, varName: string) => {
+      const value = process.env[varName];
+      if (value === undefined) {
+        throw new Error(`Environment variable ${varName} is not set (referenced in tenant config)`);
+      }
+      return value;
+    });
+  }
+
+  if (Array.isArray(obj)) {
+    return obj.map(interpolateSecrets);
+  }
+
+  if (obj !== null && typeof obj === 'object') {
+    const result: Record<string, unknown> = {};
+    for (const [key, value] of Object.entries(obj)) {
+      result[key] = interpolateSecrets(value);
+    }
+    return result;
+  }
+
+  return obj;
+}
+
+/**
+ * Validate a tenant alias format: lowercase alphanumeric + hyphens, 2-64 chars.
+ */
+function validateAlias(alias: string): boolean {
+  return /^[a-z0-9][a-z0-9-]{0,62}[a-z0-9]$/.test(alias) || /^[a-z0-9]{1,2}$/.test(alias);
+}
+
+/**
+ * Load all tenant configurations from disk.
+ * Interpolates secrets from environment variables.
+ */
+export async function loadTenants(configPath?: string): Promise<UnifiedTenantConfig[]> {
+  const filePath = configPath || DEFAULT_CONFIG_PATH;
+  const raw = await readFile(filePath, 'utf-8');
+  const parsed = JSON.parse(raw) as unknown[];
+
+  if (!Array.isArray(parsed)) {
+    throw new Error('Tenant config must be a JSON array');
+  }
+
+  const tenants = parsed.map(entry => interpolateSecrets(entry)) as UnifiedTenantConfig[];
+
+  // Validate aliases
+  const aliases = new Set<string>();
+  for (const tenant of tenants) {
+    if (!tenant.alias) {
+      throw new Error('Every tenant must have an alias');
+    }
+    if (!validateAlias(tenant.alias)) {
+      throw new Error(`Invalid tenant alias format: "${tenant.alias}" — must be lowercase alphanumeric + hyphens`);
+    }
+    if (aliases.has(tenant.alias)) {
+      throw new Error(`Duplicate tenant alias: "${tenant.alias}"`);
+    }
+    aliases.add(tenant.alias);
+  }
+
+  return tenants;
+}
+
+/**
+ * Build a lookup map from alias → tenant config.
+ */
+export function buildTenantRegistry(tenants: UnifiedTenantConfig[]): Map<string, UnifiedTenantConfig> {
+  const registry = new Map<string, UnifiedTenantConfig>();
+  for (const tenant of tenants) {
+    registry.set(tenant.alias, tenant);
+  }
+  return registry;
+}
+
+/**
+ * Find a tenant by alias from the loaded list.
+ */
+export function findTenantByAlias(
+  tenants: UnifiedTenantConfig[],
+  alias: string,
+): UnifiedTenantConfig | undefined {
+  return tenants.find(t => t.alias === alias);
+}
diff --git a/config/tenants.example.json b/config/tenants.example.json
new file mode 100644
--- /dev/null
+++ b/config/tenants.example.json
@@ -0,0 +1,32 @@
+[
+  {
+    "alias": "contoso",
+    "displayName": "Contoso Healthcare",
+    "blackpoint": {
+      "customerId": "bp-uuid-example-1234"
+    },
+    "microsoft": {
+      "tenantId": "${CONTOSO_ENTRA_TENANT_ID}",
+      "clientId": "${CONTOSO_ENTRA_CLIENT_ID}",
+      "clientSecret": "${CONTOSO_ENTRA_CLIENT_SECRET}",
+      "securityApiHost": "https://api.security.microsoft.com",
+      "enabledWorkloads": ["DefenderForEndpoint", "DefenderForOffice365", "DefenderXdr"]
+    },
+    "enabled": true,
+    "tags": ["tier-1", "healthcare"],
+    "primaryAnalyst": "analyst@company.com",
+    "onboardedAt": "2025-11-01T00:00:00Z"
+  },
+  {
+    "alias": "fabrikam",
+    "displayName": "Fabrikam Manufacturing",
+    "blackpoint": {
+      "customerId": "bp-uuid-example-5678"
+    },
+    "microsoft": null,
+    "enabled": true,
+    "tags": ["tier-2"],
+    "onboardedAt": "2026-01-15T00:00:00Z"
+  }
+]
diff --git a/src/backend/middleware/requestId.ts b/src/backend/middleware/requestId.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/middleware/requestId.ts
@@ -0,0 +1,27 @@
+// ---------------------------------------------------------------------------
+// Request ID Middleware
+// ---------------------------------------------------------------------------
+// Attaches a unique request ID to every incoming request for distributed
+// tracing and log correlation. Uses the client-provided X-Request-Id header
+// if present, otherwise generates a new UUID.
+// ---------------------------------------------------------------------------
+
+import { randomUUID } from 'node:crypto';
+import type { Request, Response, NextFunction } from 'express';
+
+declare global {
+  namespace Express {
+    interface Request {
+      requestId: string;
+    }
+  }
+}
+
+export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
+  const existing = req.headers['x-request-id'];
+  const id = (typeof existing === 'string' && existing.length > 0) ? existing : randomUUID();
+  req.requestId = id;
+  res.setHeader('X-Request-Id', id);
+  next();
+}
diff --git a/src/backend/middleware/securityHeaders.ts b/src/backend/middleware/securityHeaders.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/middleware/securityHeaders.ts
@@ -0,0 +1,41 @@
+// ---------------------------------------------------------------------------
+// Security Headers Middleware
+// ---------------------------------------------------------------------------
+// Applies HTTP security headers (CSP, HSTS, X-Frame-Options, etc.)
+// using the helmet package. Configured for a SOC dashboard that connects
+// to Blackpoint, Microsoft Security, and Graph APIs.
+// ---------------------------------------------------------------------------
+
+import helmet from 'helmet';
+
+export const securityHeaders = helmet({
+  contentSecurityPolicy: {
+    directives: {
+      defaultSrc: ["'self'"],
+      scriptSrc: ["'self'"],
+      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
+      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
+      imgSrc: ["'self'", 'data:'],
+      connectSrc: [
+        "'self'",
+        'https://api.blackpointcyber.com',
+        'https://api.security.microsoft.com',
+        'https://graph.microsoft.com',
+        'https://login.microsoftonline.com',
+      ],
+      frameSrc: ["'none'"],
+      objectSrc: ["'none'"],
+      baseUri: ["'self'"],
+    },
+  },
+  hsts: {
+    maxAge: 31536000,
+    includeSubDomains: true,
+    preload: true,
+  },
+  frameguard: { action: 'deny' },
+  noSniff: true,
+  xssFilter: true,
+  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
+});
diff --git a/src/backend/middleware/rateLimit.ts b/src/backend/middleware/rateLimit.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/middleware/rateLimit.ts
@@ -0,0 +1,133 @@
+// ---------------------------------------------------------------------------
+// Rate Limit Middleware
+// ---------------------------------------------------------------------------
+// Sliding-window rate limiter with three tiers:
+//   1. Per-IP — protects against DoS from a single source
+//   2. Per-tenant — protects upstream APIs from excessive tenant polling
+//   3. Per-user writes — prevents accidental bulk mutations
+//
+// Uses in-memory sliding window. For multi-instance deployments,
+// replace with Redis-backed implementation.
+// ---------------------------------------------------------------------------
+
+import type { Request, Response, NextFunction } from 'express';
+
+interface SlidingWindowEntry {
+  timestamps: number[];
+}
+
+const windows = new Map<string, SlidingWindowEntry>();
+
+// Periodic cleanup to prevent memory leak — run every 5 minutes
+const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
+setInterval(() => {
+  const now = Date.now();
+  const maxAge = 120_000; // Keep entries for 2 minutes max
+  for (const [key, entry] of windows) {
+    entry.timestamps = entry.timestamps.filter(t => now - t < maxAge);
+    if (entry.timestamps.length === 0) {
+      windows.delete(key);
+    }
+  }
+}, CLEANUP_INTERVAL_MS).unref();
+
+function getClientIp(req: Request): string {
+  const forwarded = req.headers['x-forwarded-for'];
+  if (typeof forwarded === 'string') {
+    return forwarded.split(',')[0].trim();
+  }
+  return req.socket.remoteAddress || 'unknown';
+}
+
+function checkWindow(
+  key: string,
+  maxRequests: number,
+  windowMs: number,
+): { allowed: boolean; remaining: number; retryAfterMs: number } {
+  const now = Date.now();
+  let entry = windows.get(key);
+  if (!entry) {
+    entry = { timestamps: [] };
+    windows.set(key, entry);
+  }
+
+  // Remove timestamps outside current window
+  entry.timestamps = entry.timestamps.filter(t => now - t < windowMs);
+
+  if (entry.timestamps.length >= maxRequests) {
+    const oldest = entry.timestamps[0];
+    const retryAfterMs = windowMs - (now - oldest);
+    return { allowed: false, remaining: 0, retryAfterMs };
+  }
+
+  entry.timestamps.push(now);
+  return {
+    allowed: true,
+    remaining: maxRequests - entry.timestamps.length,
+    retryAfterMs: 0,
+  };
+}
+
+export interface RateLimitOptions {
+  perIp: { max: number; windowMs: number };
+  perTenant: { max: number; windowMs: number };
+  perUserWrite: { max: number; windowMs: number };
+}
+
+const DEFAULT_OPTIONS: RateLimitOptions = {
+  perIp: { max: 100, windowMs: 60_000 },
+  perTenant: { max: 60, windowMs: 60_000 },
+  perUserWrite: { max: 30, windowMs: 60_000 },
+};
+
+export function rateLimitMiddleware(opts: Partial<RateLimitOptions> = {}) {
+  const config: RateLimitOptions = {
+    perIp: { ...DEFAULT_OPTIONS.perIp, ...opts.perIp },
+    perTenant: { ...DEFAULT_OPTIONS.perTenant, ...opts.perTenant },
+    perUserWrite: { ...DEFAULT_OPTIONS.perUserWrite, ...opts.perUserWrite },
+  };
+
+  return (req: Request, res: Response, next: NextFunction): void => {
+    // 1. Per-IP check
+    const ipKey = `ip:${getClientIp(req)}`;
+    const ipResult = checkWindow(ipKey, config.perIp.max, config.perIp.windowMs);
+    if (!ipResult.allowed) {
+      res.status(429);
+      res.setHeader('Retry-After', String(Math.ceil(ipResult.retryAfterMs / 1000)));
+      res.json({ error: 'Rate limit exceeded', scope: 'ip' });
+      return;
+    }
+
+    // 2. Per-tenant check (only for tenant-scoped routes)
+    const alias = req.params?.alias;
+    if (alias) {
+      const tenantKey = `tenant:${alias}`;
+      const tenantResult = checkWindow(tenantKey, config.perTenant.max, config.perTenant.windowMs);
+      if (!tenantResult.allowed) {
+        res.status(429);
+        res.setHeader('Retry-After', String(Math.ceil(tenantResult.retryAfterMs / 1000)));
+        res.json({ error: 'Rate limit exceeded', scope: 'tenant' });
+        return;
+      }
+    }
+
+    // 3. Per-user write check (POST/PATCH/PUT/DELETE)
+    const isWrite = ['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method);
+    const userId = (req as any).user?.oid;
+    if (isWrite && userId) {
+      const userWriteKey = `user-write:${userId}`;
+      const userResult = checkWindow(userWriteKey, config.perUserWrite.max, config.perUserWrite.windowMs);
+      if (!userResult.allowed) {
+        res.status(429);
+        res.setHeader('Retry-After', String(Math.ceil(userResult.retryAfterMs / 1000)));
+        res.json({ error: 'Rate limit exceeded', scope: 'user-write' });
+        return;
+      }
+    }
+
+    // Set informational header
+    res.setHeader('X-RateLimit-Remaining-IP', String(ipResult.remaining));
+    next();
+  };
+}
diff --git a/src/backend/middleware/authentication.ts b/src/backend/middleware/authentication.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/middleware/authentication.ts
@@ -0,0 +1,163 @@
+// ---------------------------------------------------------------------------
+// Authentication Middleware — Entra ID JWT Validation
+// ---------------------------------------------------------------------------
+// Validates Bearer tokens issued by Microsoft Entra ID using JWKS key
+// rotation. Extracts user identity, object ID, and app roles from the token.
+//
+// Requires environment variables:
+//   ENTRA_TENANT_ID  — Platform tenant ID (issuer)
+//   ENTRA_CLIENT_ID  — SPA app registration client ID (audience)
+// ---------------------------------------------------------------------------
+
+import type { Request, Response, NextFunction } from 'express';
+import jwt from 'jsonwebtoken';
+import jwksClient from 'jwks-rsa';
+
+// ---------------------------------------------------------------------------
+// Types
+// ---------------------------------------------------------------------------
+
+export interface AuthenticatedUser {
+  /** Entra Object ID (unique user identifier) */
+  oid: string;
+  /** User principal name / email */
+  preferredUsername: string;
+  /** Display name */
+  name: string;
+  /** App roles assigned in Entra (SOC.Admin, SOC.Analyst, SOC.Viewer) */
+  roles: string[];
+  /** Token issuer tenant ID (platform tenant) */
+  tid: string;
+}
+
+declare global {
+  namespace Express {
+    interface Request {
+      user?: AuthenticatedUser;
+    }
+  }
+}
+
+// ---------------------------------------------------------------------------
+// Configuration
+// ---------------------------------------------------------------------------
+
+function getConfig() {
+  const tenantId = process.env.ENTRA_TENANT_ID;
+  const clientId = process.env.ENTRA_CLIENT_ID;
+
+  if (!tenantId || !clientId) {
+    throw new Error(
+      'ENTRA_TENANT_ID and ENTRA_CLIENT_ID must be set for authentication',
+    );
+  }
+
+  return {
+    tenantId,
+    clientId,
+    issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`,
+    jwksUri: `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`,
+  };
+}
+
+// ---------------------------------------------------------------------------
+// JWKS Client (cached + rate-limited)
+// ---------------------------------------------------------------------------
+
+let cachedClient: jwksClient.JwksClient | null = null;
+
+function getJwksClient(): jwksClient.JwksClient {
+  if (!cachedClient) {
+    const config = getConfig();
+    cachedClient = jwksClient({
+      jwksUri: config.jwksUri,
+      cache: true,
+      cacheMaxAge: 600_000, // 10 minutes
+      rateLimit: true,
+      jwksRequestsPerMinute: 10,
+    });
+  }
+  return cachedClient;
+}
+
+function getSigningKey(header: jwt.JwtHeader): Promise<string> {
+  return new Promise((resolve, reject) => {
+    getJwksClient().getSigningKey(header.kid, (err, key) => {
+      if (err) return reject(err);
+      if (!key) return reject(new Error('No signing key found'));
+      resolve(key.getPublicKey());
+    });
+  });
+}
+
+// ---------------------------------------------------------------------------
+// Middleware
+// ---------------------------------------------------------------------------
+
+export function authenticationMiddleware(
+  req: Request,
+  res: Response,
+  next: NextFunction,
+): void {
+  const authHeader = req.headers.authorization;
+
+  if (!authHeader || !authHeader.startsWith('Bearer ')) {
+    res.status(401).json({ error: 'Missing or invalid Authorization header' });
+    return;
+  }
+
+  const token = authHeader.slice(7);
+
+  // Decode without verification first to get the key ID
+  const decoded = jwt.decode(token, { complete: true });
+  if (!decoded || typeof decoded === 'string' || !decoded.header.kid) {
+    res.status(401).json({ error: 'Invalid token structure' });
+    return;
+  }
+
+  const config = getConfig();
+
+  getSigningKey(decoded.header)
+    .then(signingKey => {
+      const payload = jwt.verify(token, signingKey, {
+        issuer: config.issuer,
+        audience: config.clientId,
+        algorithms: ['RS256'],
+      }) as jwt.JwtPayload;
+
+      req.user = {
+        oid: payload.oid || payload.sub || '',
+        preferredUsername: payload.preferred_username || payload.upn || '',
+        name: payload.name || '',
+        roles: Array.isArray(payload.roles) ? payload.roles : [],
+        tid: payload.tid || '',
+      };
+
+      next();
+    })
+    .catch(err => {
+      const message =
+        err instanceof jwt.TokenExpiredError
+          ? 'Token expired'
+          : err instanceof jwt.JsonWebTokenError
+            ? 'Token validation failed'
+            : 'Authentication error';
+
+      res.status(401).json({ error: message });
+    });
+}
+
+/**
+ * Skip authentication for specified path prefixes (e.g., /api/health).
+ * All other paths require valid JWT.
+ */
+export function optionalAuth(publicPaths: string[]) {
+  return (req: Request, res: Response, next: NextFunction): void => {
+    if (publicPaths.some(p => req.path === p || req.path.startsWith(p + '/'))) {
+      next();
+      return;
+    }
+    authenticationMiddleware(req, res, next);
+  };
+}
diff --git a/src/backend/middleware/authorization.ts b/src/backend/middleware/authorization.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/middleware/authorization.ts
@@ -0,0 +1,115 @@
+// ---------------------------------------------------------------------------
+// Authorization Middleware — Role-Based Access Control (RBAC)
+// ---------------------------------------------------------------------------
+// Maps Entra ID app roles to an internal permission model:
+//
+//   SOC.Admin   → admin   (full access: read, write, delete, manage)
+//   SOC.Analyst → analyst (read + write + limited management)
+//   (default)   → viewer  (read-only)
+//
+// Usage:
+//   router.post('/action', requirePermission('write'), handler);
+//   router.delete('/item', requirePermission('delete'), handler);
+// ---------------------------------------------------------------------------
+
+import type { Request, Response, NextFunction } from 'express';
+
+// ---------------------------------------------------------------------------
+// Types
+// ---------------------------------------------------------------------------
+
+export type InternalRole = 'admin' | 'analyst' | 'viewer';
+export type Permission = 'read' | 'write' | 'delete' | 'manage';
+
+const ROLE_PERMISSIONS: Record<InternalRole, Permission[]> = {
+  admin: ['read', 'write', 'delete', 'manage'],
+  analyst: ['read', 'write'],
+  viewer: ['read'],
+};
+
+const ENTRA_ROLE_MAP: Record<string, InternalRole> = {
+  'SOC.Admin': 'admin',
+  'SOC.Analyst': 'analyst',
+  'SOC.Viewer': 'viewer',
+};
+
+// ---------------------------------------------------------------------------
+// Helpers
+// ---------------------------------------------------------------------------
+
+/**
+ * Resolves the highest-privilege internal role from Entra app roles.
+ * If no recognized roles are present, defaults to 'viewer'.
+ */
+export function resolveRole(entraRoles: string[]): InternalRole {
+  const mapped = entraRoles
+    .map(r => ENTRA_ROLE_MAP[r])
+    .filter(Boolean) as InternalRole[];
+
+  if (mapped.includes('admin')) return 'admin';
+  if (mapped.includes('analyst')) return 'analyst';
+  return 'viewer';
+}
+
+/**
+ * Check if a role has a specific permission.
+ */
+export function hasPermission(role: InternalRole, permission: Permission): boolean {
+  return ROLE_PERMISSIONS[role].includes(permission);
+}
+
+// ---------------------------------------------------------------------------
+// Middleware
+// ---------------------------------------------------------------------------
+
+/**
+ * Express middleware factory that requires the authenticated user to have
+ * a specific permission. Must be placed AFTER authenticationMiddleware.
+ */
+export function requirePermission(permission: Permission) {
+  return (req: Request, res: Response, next: NextFunction): void => {
+    const user = req.user;
+    if (!user) {
+      res.status(401).json({ error: 'Authentication required' });
+      return;
+    }
+
+    const role = resolveRole(user.roles);
+    if (!hasPermission(role, permission)) {
+      res.status(403).json({
+        error: 'Insufficient permissions',
+        required: permission,
+        role,
+      });
+      return;
+    }
+
+    next();
+  };
+}
+
+/**
+ * Middleware that requires any of the specified roles.
+ */
+export function requireRole(...roles: InternalRole[]) {
+  return (req: Request, res: Response, next: NextFunction): void => {
+    const user = req.user;
+    if (!user) {
+      res.status(401).json({ error: 'Authentication required' });
+      return;
+    }
+
+    const userRole = resolveRole(user.roles);
+    if (!roles.includes(userRole)) {
+      res.status(403).json({
+        error: 'Insufficient role',
+        required: roles,
+        current: userRole,
+      });
+      return;
+    }
+
+    next();
+  };
+}
diff --git a/src/backend/middleware/tenantIsolation.ts b/src/backend/middleware/tenantIsolation.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/middleware/tenantIsolation.ts
@@ -0,0 +1,51 @@
+// ---------------------------------------------------------------------------
+// Tenant Isolation Middleware
+// ---------------------------------------------------------------------------
+// Resolves the tenant from the :alias route param and attaches the full
+// tenant config to the request. Rejects requests for disabled or unknown
+// tenants before they reach route handlers.
+// ---------------------------------------------------------------------------
+
+import type { Request, Response, NextFunction } from 'express';
+import type { UnifiedTenantConfig } from '../config/tenants.schema.js';
+
+declare global {
+  namespace Express {
+    interface Request {
+      tenant?: UnifiedTenantConfig;
+    }
+  }
+}
+
+export type TenantRegistry = Map<string, UnifiedTenantConfig>;
+
+/**
+ * Creates middleware that resolves the current tenant from the :alias param.
+ * The registry must be loaded at startup and passed in.
+ */
+export function tenantIsolationMiddleware(registry: TenantRegistry) {
+  return (req: Request, res: Response, next: NextFunction): void => {
+    const alias = req.params.alias;
+
+    if (!alias) {
+      // Route does not have a tenant param — skip isolation
+      next();
+      return;
+    }
+
+    const tenant = registry.get(alias);
+    if (!tenant) {
+      res.status(404).json({ error: 'Tenant not found', alias });
+      return;
+    }
+
+    if (!tenant.enabled) {
+      res.status(403).json({ error: 'Tenant is disabled', alias });
+      return;
+    }
+
+    req.tenant = tenant;
+    next();
+  };
+}
diff --git a/src/backend/middleware/audit.ts b/src/backend/middleware/audit.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/middleware/audit.ts
@@ -0,0 +1,55 @@
+// ---------------------------------------------------------------------------
+// Audit Logging Middleware
+// ---------------------------------------------------------------------------
+// Logs all mutating (write) operations for compliance and forensic analysis.
+// Captures: who, what, when, which tenant, and the request ID for correlation.
+//
+// In production this would forward to a SIEM / Log Analytics workspace.
+// For now, writes structured JSON to stdout for container log ingestion.
+// ---------------------------------------------------------------------------
+
+import type { Request, Response, NextFunction } from 'express';
+
+export interface AuditEntry {
+  timestamp: string;
+  requestId: string;
+  userId: string;
+  userName: string;
+  method: string;
+  path: string;
+  tenantAlias: string | null;
+  statusCode: number;
+  durationMs: number;
+}
+
+const AUDITABLE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
+
+export function auditMiddleware(req: Request, res: Response, next: NextFunction): void {
+  if (!AUDITABLE_METHODS.has(req.method)) {
+    next();
+    return;
+  }
+
+  const start = Date.now();
+
+  // Hook into response finish event
+  res.on('finish', () => {
+    const entry: AuditEntry = {
+      timestamp: new Date().toISOString(),
+      requestId: req.requestId || 'unknown',
+      userId: req.user?.oid || 'anonymous',
+      userName: req.user?.preferredUsername || 'anonymous',
+      method: req.method,
+      path: req.originalUrl,
+      tenantAlias: req.tenant?.alias || null,
+      statusCode: res.statusCode,
+      durationMs: Date.now() - start,
+    };
+
+    // Structured JSON log — picked up by container logging drivers
+    process.stdout.write(JSON.stringify({ level: 'audit', ...entry }) + '\n');
+  });
+
+  next();
+}
diff --git a/src/backend/middleware/inputValidation.ts b/src/backend/middleware/inputValidation.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/middleware/inputValidation.ts
@@ -0,0 +1,133 @@
+// ---------------------------------------------------------------------------
+// Input Validation Middleware
+// ---------------------------------------------------------------------------
+// AJV-based request body and query parameter validation.
+// Provides a factory that takes a JSON Schema and returns middleware
+// that validates incoming data before it reaches route handlers.
+// ---------------------------------------------------------------------------
+
+import Ajv, { type JSONSchemaType, type ValidateFunction } from 'ajv';
+import addFormats from 'ajv-formats';
+import type { Request, Response, NextFunction } from 'express';
+
+// ---------------------------------------------------------------------------
+// AJV Instance (singleton, compiled schemas are cached)
+// ---------------------------------------------------------------------------
+
+const ajv = new Ajv({
+  allErrors: true,
+  removeAdditional: 'all',  // Strip unknown properties (defense in depth)
+  coerceTypes: false,
+  useDefaults: true,
+});
+addFormats(ajv);
+
+// ---------------------------------------------------------------------------
+// Middleware Factories
+// ---------------------------------------------------------------------------
+
+/**
+ * Validates req.body against the provided JSON schema.
+ * Returns 400 with detailed error messages on failure.
+ */
+export function validateBody<T>(schema: JSONSchemaType<T> | object) {
+  const validate: ValidateFunction = ajv.compile(schema);
+
+  return (req: Request, res: Response, next: NextFunction): void => {
+    if (!req.body || Object.keys(req.body).length === 0) {
+      res.status(400).json({ error: 'Request body is required' });
+      return;
+    }
+
+    const valid = validate(req.body);
+    if (!valid) {
+      res.status(400).json({
+        error: 'Validation failed',
+        details: validate.errors?.map(e => ({
+          path: e.instancePath || '/',
+          message: e.message,
+          params: e.params,
+        })),
+      });
+      return;
+    }
+
+    next();
+  };
+}
+
+/**
+ * Validates req.query against the provided JSON schema.
+ * Returns 400 with detailed error messages on failure.
+ */
+export function validateQuery<T>(schema: JSONSchemaType<T> | object) {
+  const validate: ValidateFunction = ajv.compile(schema);
+
+  return (req: Request, res: Response, next: NextFunction): void => {
+    const valid = validate(req.query);
+    if (!valid) {
+      res.status(400).json({
+        error: 'Query validation failed',
+        details: validate.errors?.map(e => ({
+          path: e.instancePath || '/',
+          message: e.message,
+          params: e.params,
+        })),
+      });
+      return;
+    }
+
+    next();
+  };
+}
+
+/**
+ * Validates req.params against the provided JSON schema.
+ */
+export function validateParams<T>(schema: JSONSchemaType<T> | object) {
+  const validate: ValidateFunction = ajv.compile(schema);
+
+  return (req: Request, res: Response, next: NextFunction): void => {
+    const valid = validate(req.params);
+    if (!valid) {
+      res.status(400).json({
+        error: 'Path parameter validation failed',
+        details: validate.errors?.map(e => ({
+          path: e.instancePath || '/',
+          message: e.message,
+          params: e.params,
+        })),
+      });
+      return;
+    }
+
+    next();
+  };
+}
+
+// ---------------------------------------------------------------------------
+// Common Schemas (reusable across routes)
+// ---------------------------------------------------------------------------
+
+export const schemas = {
+  /** Validates that :alias is a safe slug */
+  tenantAlias: {
+    type: 'object',
+    properties: {
+      alias: { type: 'string', pattern: '^[a-z0-9][a-z0-9-]{0,62}[a-z0-9]$' },
+    },
+    required: ['alias'],
+    additionalProperties: true,
+  },
+
+  /** Pagination query params */
+  pagination: {
+    type: 'object',
+    properties: {
+      page: { type: 'string', pattern: '^[0-9]+$' },
+      limit: { type: 'string', pattern: '^[0-9]+$' },
+    },
+    additionalProperties: true,
+  },
+} as const;
diff --git a/src/backend/middleware/index.ts b/src/backend/middleware/index.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/middleware/index.ts
@@ -0,0 +1,13 @@
+// ---------------------------------------------------------------------------
+// Middleware barrel export
+// ---------------------------------------------------------------------------
+
+export { requestIdMiddleware } from './requestId.js';
+export { securityHeaders } from './securityHeaders.js';
+export { rateLimitMiddleware, type RateLimitOptions } from './rateLimit.js';
+export { authenticationMiddleware, optionalAuth, type AuthenticatedUser } from './authentication.js';
+export { requirePermission, requireRole, resolveRole, hasPermission, type InternalRole, type Permission } from './authorization.js';
+export { tenantIsolationMiddleware, type TenantRegistry } from './tenantIsolation.js';
+export { auditMiddleware, type AuditEntry } from './audit.js';
+export { validateBody, validateQuery, validateParams, schemas } from './inputValidation.js';
diff --git a/src/backend/server.ts b/src/backend/server.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/server.ts
@@ -0,0 +1,124 @@
+// ---------------------------------------------------------------------------
+// Unified Backend Server
+// ---------------------------------------------------------------------------
+// Express server that combines:
+//   - Blackpoint CompassOne API integration (proxied)
+//   - Microsoft Defender XDR / O365 API integration
+//   - Unified tenant configuration
+//   - Full middleware stack (security, auth, audit, rate limiting)
+//
+// Port: 7071 (matching SecOps-O365-Command-Dashboard convention)
+// ---------------------------------------------------------------------------
+
+import express from 'express';
+import path from 'node:path';
+import { fileURLToPath } from 'node:url';
+
+import { loadTenants, buildTenantRegistry } from './config/loader.js';
+import {
+  requestIdMiddleware,
+  securityHeaders,
+  rateLimitMiddleware,
+  optionalAuth,
+  auditMiddleware,
+  tenantIsolationMiddleware,
+} from './middleware/index.js';
+import { createRepository } from './storage/factory.js';
+import bpRoutes from './routes/bp/index.js';
+import xdrRoutes from './routes/xdr/index.js';
+import unifiedRoutes from './routes/unified/index.js';
+
+// ---------------------------------------------------------------------------
+// Constants
+// ---------------------------------------------------------------------------
+
+const PORT = parseInt(process.env.PORT || '7071', 10);
+const __dirname = path.dirname(fileURLToPath(import.meta.url));
+const STATIC_DIR = path.resolve(__dirname, '../../dist'); // Vite build output
+
+// ---------------------------------------------------------------------------
+// Bootstrap
+// ---------------------------------------------------------------------------
+
+async function main() {
+  const app = express();
+
+  // ---- Load tenant configuration ----
+  const tenants = await loadTenants();
+  const registry = buildTenantRegistry(tenants);
+  console.log(`[boot] Loaded ${registry.size} tenant(s)`);
+
+  // ---- Initialize storage backend ----
+  await createRepository();
+  console.log(`[boot] Storage backend ready (${process.env.STORAGE_BACKEND || 'memory'})`);
+
+  // ---- Global middleware (applied in order) ----
+  app.use(requestIdMiddleware);
+  app.use(securityHeaders);
+  app.use(rateLimitMiddleware());
+  app.use(express.json({ limit: '1mb' }));
+  app.use(express.urlencoded({ extended: false }));
+
+  // Authentication — public paths skip JWT validation
+  app.use(optionalAuth(['/api/health', '/api/ready']));
+
+  // Audit — logs all write operations
+  app.use(auditMiddleware);
+
+  // ---- Health / readiness (unauthenticated) ----
+  app.get('/api/health', (_req, res) => {
+    res.json({ status: 'ok', uptime: process.uptime() });
+  });
+
+  app.get('/api/ready', (_req, res) => {
+    res.json({ status: 'ready', tenants: registry.size });
+  });
+
+  // ---- Tenant-scoped routes ----
+  const tenantRouter = express.Router({ mergeParams: true });
+  tenantRouter.use(tenantIsolationMiddleware(registry));
+
+  // Blackpoint CompassOne API routes
+  tenantRouter.use('/bp', bpRoutes);
+
+  // Microsoft Defender XDR routes
+  tenantRouter.use('/xdr', xdrRoutes);
+
+  // Unified correlation, triage, closeout, and audit routes
+  tenantRouter.use('/unified', unifiedRoutes);
+
+  app.use('/api/tenants/:alias', tenantRouter);
+
+  // ---- Global API routes ----
+  app.get('/api/tenants', (_req, res) => {
+    // Return tenant summaries (no secrets)
+    const summaries = [...registry.values()].map(t => ({
+      alias: t.alias,
+      displayName: t.displayName,
+      enabled: t.enabled,
+      hasBlackpoint: !!t.blackpoint,
+      hasMicrosoft: !!t.microsoft,
+      tags: t.tags,
+    }));
+    res.json(summaries);
+  });
+
+  // ---- Serve React SPA (Vite build) ----
+  app.use(express.static(STATIC_DIR));
+
+  // SPA catch-all — return index.html for client-side routing
+  app.get('*', (_req, res) => {
+    res.sendFile(path.join(STATIC_DIR, 'index.html'));
+  });
+
+  // ---- Start ----
+  app.listen(PORT, () => {
+    console.log(`[server] Unified SOC Dashboard running on http://localhost:${PORT}`);
+  });
+}
+
+main().catch(err => {
+  console.error('[server] Fatal startup error:', err);
+  process.exit(1);
+});
diff --git a/vite.config.ts b/vite.config.ts
new file mode 100644
--- /dev/null
+++ b/vite.config.ts
@@ -0,0 +1,50 @@
+// ---------------------------------------------------------------------------
+// Vite Configuration — SOC Dashboard SPA
+// ---------------------------------------------------------------------------
+// Replaces Create React App (deprecated) with Vite for:
+//   - Faster HMR during development
+//   - Smaller, optimized production bundles
+//   - ESM-native build pipeline
+//   - Proxy configuration for backend API
+// ---------------------------------------------------------------------------
+
+import { defineConfig } from 'vite';
+import react from '@vitejs/plugin-react';
+import path from 'node:path';
+
+export default defineConfig({
+  plugins: [react()],
+
+  root: '.',
+  publicDir: 'public',
+
+  resolve: {
+    alias: {
+      '@': path.resolve(__dirname, 'src'),
+    },
+  },
+
+  server: {
+    port: 3000,
+    proxy: {
+      '/api': {
+        target: 'http://localhost:7071',
+        changeOrigin: true,
+      },
+    },
+  },
+
+  build: {
+    outDir: 'dist',
+    sourcemap: true,
+    rollupOptions: {
+      output: {
+        manualChunks: {
+          vendor: ['react', 'react-dom'],
+          msal: ['@azure/msal-browser', '@azure/msal-react'],
+        },
+      },
+    },
+  },
+});
diff --git a/index.html b/index.html
new file mode 100644
--- /dev/null
+++ b/index.html
@@ -0,0 +1,36 @@
+<!DOCTYPE html>
+<html lang="en">
+  <head>
+    <meta charset="UTF-8" />
+    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
+    <meta name="theme-color" content="#1a1a2e" />
+    <title>SOC Command Dashboard</title>
+    <style>
+      body {
+        margin: 0;
+        padding: 0;
+        background: #1a1a2e;
+        color: #e0e0e0;
+        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
+      }
+      #root {
+        min-height: 100vh;
+      }
+      .loading-spinner {
+        display: flex;
+        align-items: center;
+        justify-content: center;
+        min-height: 100vh;
+        font-size: 1.2rem;
+        color: #64b5f6;
+      }
+    </style>
+  </head>
+  <body>
+    <div id="root">
+      <div class="loading-spinner">Loading SOC Dashboard...</div>
+    </div>
+    <script type="module" src="/src/main.tsx"></script>
+  </body>
+</html>
diff --git a/src/main.tsx b/src/main.tsx
new file mode 100644
--- /dev/null
+++ b/src/main.tsx
@@ -0,0 +1,22 @@
+// ---------------------------------------------------------------------------
+// Vite SPA entry point (replaces CRA's src/index.tsx)
+// ---------------------------------------------------------------------------
+
+import React from 'react';
+import ReactDOM from 'react-dom/client';
+import { MsalProvider } from '@azure/msal-react';
+import { msalInstance } from './auth/msalConfig';
+import App from './App';
+
+const root = ReactDOM.createRoot(
+  document.getElementById('root') as HTMLElement,
+);
+
+root.render(
+  <React.StrictMode>
+    <MsalProvider instance={msalInstance}>
+      <App />
+    </MsalProvider>
+  </React.StrictMode>,
+);
diff --git a/src/auth/msalConfig.ts b/src/auth/msalConfig.ts
new file mode 100644
--- /dev/null
+++ b/src/auth/msalConfig.ts
@@ -0,0 +1,57 @@
+// ---------------------------------------------------------------------------
+// MSAL Configuration — Entra ID SPA Authentication
+// ---------------------------------------------------------------------------
+// Configures @azure/msal-browser for the React SPA using Authorization Code
+// Flow with PKCE. Uses sessionStorage (safer for SOC tools — no persistent
+// tokens if browser is left open).
+//
+// Required env vars (injected at build time via Vite):
+//   VITE_ENTRA_CLIENT_ID   — SPA app registration client ID
+//   VITE_ENTRA_TENANT_ID   — Platform tenant ID
+//   VITE_ENTRA_REDIRECT_URI — Redirect URI (defaults to window.location.origin)
+// ---------------------------------------------------------------------------
+
+import { PublicClientApplication, type Configuration, LogLevel } from '@azure/msal-browser';
+
+const clientId = import.meta.env.VITE_ENTRA_CLIENT_ID || '';
+const tenantId = import.meta.env.VITE_ENTRA_TENANT_ID || '';
+const redirectUri = import.meta.env.VITE_ENTRA_REDIRECT_URI || window.location.origin;
+
+const msalConfig: Configuration = {
+  auth: {
+    clientId,
+    authority: `https://login.microsoftonline.com/${tenantId}`,
+    redirectUri,
+    postLogoutRedirectUri: redirectUri,
+    navigateToLoginRequestUrl: true,
+  },
+  cache: {
+    cacheLocation: 'sessionStorage',
+    storeAuthStateInCookie: false,
+  },
+  system: {
+    loggerOptions: {
+      logLevel: LogLevel.Warning,
+      piiLoggingEnabled: false,
+    },
+  },
+};
+
+export const msalInstance = new PublicClientApplication(msalConfig);
+
+/**
+ * Scopes required for API access.
+ * The backend exposes an API with the app ID URI scope.
+ */
+export const apiScopes = {
+  /** Full API access scope — matches backend app registration */
+  default: [`api://${clientId}/access_as_user`],
+};
+
+/**
+ * Login request configuration.
+ */
+export const loginRequest = {
+  scopes: apiScopes.default,
+};
diff --git a/src/auth/AuthProvider.tsx b/src/auth/AuthProvider.tsx
new file mode 100644
--- /dev/null
+++ b/src/auth/AuthProvider.tsx
@@ -0,0 +1,53 @@
+// ---------------------------------------------------------------------------
+// AuthProvider — MSAL React authentication wrapper
+// ---------------------------------------------------------------------------
+// Wraps the app with authentication state. Provides:
+//   - Auto-redirect to login for unauthenticated users
+//   - Loading state while auth initializes
+//   - Access to current account info
+// ---------------------------------------------------------------------------
+
+import React from 'react';
+import {
+  AuthenticatedTemplate,
+  UnauthenticatedTemplate,
+  useMsal,
+} from '@azure/msal-react';
+import { InteractionStatus } from '@azure/msal-browser';
+import { loginRequest } from './msalConfig';
+
+interface AuthProviderProps {
+  children: React.ReactNode;
+}
+
+export function AuthProvider({ children }: AuthProviderProps) {
+  const { instance, inProgress } = useMsal();
+
+  // Auto-trigger login if no account and no interaction in progress
+  React.useEffect(() => {
+    const accounts = instance.getAllAccounts();
+    if (accounts.length === 0 && inProgress === InteractionStatus.None) {
+      instance.loginRedirect(loginRequest).catch(console.error);
+    }
+  }, [instance, inProgress]);
+
+  if (inProgress !== InteractionStatus.None) {
+    return (
+      <div className="loading-spinner">
+        Authenticating...
+      </div>
+    );
+  }
+
+  return (
+    <>
+      <AuthenticatedTemplate>{children}</AuthenticatedTemplate>
+      <UnauthenticatedTemplate>
+        <div className="loading-spinner">
+          Redirecting to login...
+        </div>
+      </UnauthenticatedTemplate>
+    </>
+  );
+}
diff --git a/src/auth/ProtectedRoute.tsx b/src/auth/ProtectedRoute.tsx
new file mode 100644
--- /dev/null
+++ b/src/auth/ProtectedRoute.tsx
@@ -0,0 +1,56 @@
+// ---------------------------------------------------------------------------
+// ProtectedRoute — Route guard for authenticated + authorized users
+// ---------------------------------------------------------------------------
+// Wraps route content and checks that the user has the required role.
+// Falls back to a "no access" message if the role is insufficient.
+// ---------------------------------------------------------------------------
+
+import React from 'react';
+import { useMsal } from '@azure/msal-react';
+import type { InternalRole } from '../backend/middleware/authorization';
+
+interface ProtectedRouteProps {
+  children: React.ReactNode;
+  requiredRole?: InternalRole;
+}
+
+function getRolesFromAccount(account: any): string[] {
+  return account?.idTokenClaims?.roles || [];
+}
+
+function resolveClientRole(entraRoles: string[]): InternalRole {
+  if (entraRoles.includes('SOC.Admin')) return 'admin';
+  if (entraRoles.includes('SOC.Analyst')) return 'analyst';
+  return 'viewer';
+}
+
+export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
+  const { accounts } = useMsal();
+  const account = accounts[0];
+
+  if (!account) {
+    return <div className="loading-spinner">Not authenticated</div>;
+  }
+
+  if (requiredRole) {
+    const roles = getRolesFromAccount(account);
+    const userRole = resolveClientRole(roles);
+
+    const roleHierarchy: InternalRole[] = ['admin', 'analyst', 'viewer'];
+    const userLevel = roleHierarchy.indexOf(userRole);
+    const requiredLevel = roleHierarchy.indexOf(requiredRole);
+
+    if (userLevel > requiredLevel) {
+      return (
+        <div style={{ padding: '2rem', textAlign: 'center', color: '#ef5350' }}>
+          <h2>Access Denied</h2>
+          <p>This page requires the <strong>{requiredRole}</strong> role.</p>
+          <p>Your current role: <strong>{userRole}</strong></p>
+        </div>
+      );
+    }
+  }
+
+  return <>{children}</>;
+}
diff --git a/src/auth/authenticatedFetch.ts b/src/auth/authenticatedFetch.ts
new file mode 100644
--- /dev/null
+++ b/src/auth/authenticatedFetch.ts
@@ -0,0 +1,53 @@
+// ---------------------------------------------------------------------------
+// Authenticated Fetch — Automatically attaches Bearer token to API calls
+// ---------------------------------------------------------------------------
+// Wraps the native fetch() to acquire a fresh access token from MSAL
+// before making requests to the backend API.
+// ---------------------------------------------------------------------------
+
+import { msalInstance, apiScopes } from './msalConfig';
+import { InteractionRequiredAuthError } from '@azure/msal-browser';
+
+/**
+ * Fetch wrapper that silently acquires a token and attaches it.
+ * Falls back to interactive login if silent acquisition fails.
+ */
+export async function authenticatedFetch(
+  url: string,
+  options: RequestInit = {},
+): Promise<Response> {
+  const accounts = msalInstance.getAllAccounts();
+  if (accounts.length === 0) {
+    throw new Error('No authenticated account. Please log in.');
+  }
+
+  let accessToken: string;
+
+  try {
+    const response = await msalInstance.acquireTokenSilent({
+      scopes: apiScopes.default,
+      account: accounts[0],
+    });
+    accessToken = response.accessToken;
+  } catch (error) {
+    if (error instanceof InteractionRequiredAuthError) {
+      // Token expired or consent needed — trigger interactive flow
+      const response = await msalInstance.acquireTokenPopup({
+        scopes: apiScopes.default,
+        account: accounts[0],
+      });
+      accessToken = response.accessToken;
+    } else {
+      throw error;
+    }
+  }
+
+  const headers = new Headers(options.headers);
+  headers.set('Authorization', `Bearer ${accessToken}`);
+
+  return fetch(url, {
+    ...options,
+    headers,
+  });
+}
diff --git a/tsconfig.server.json b/tsconfig.server.json
new file mode 100644
--- /dev/null
+++ b/tsconfig.server.json
@@ -0,0 +1,21 @@
+{
+  "compilerOptions": {
+    "target": "ES2022",
+    "module": "ESNext",
+    "moduleResolution": "node",
+    "outDir": "./dist-server",
+    "rootDir": "./src",
+    "strict": true,
+    "esModuleInterop": true,
+    "skipLibCheck": true,
+    "forceConsistentCasingInFileNames": true,
+    "resolveJsonModule": true,
+    "declaration": false,
+    "sourceMap": true,
+    "lib": ["ES2022"],
+    "types": ["node"]
+  },
+  "include": ["src/backend/**/*"],
+  "exclude": ["node_modules", "dist", "dist-server"]
+}
diff --git a/tsconfig.json b/tsconfig.json
--- tsconfig.json
+++ tsconfig.json
@@ -12,11 +12,14 @@
     "resolveJsonModule": true,
     "declaration": true,
     "declarationMap": true,
     "sourceMap": true,
-    "moduleResolution": "node",
+    "moduleResolution": "bundler",
     "jsx": "react-jsx",
-    "allowJs": true
+    "allowJs": true,
+    "paths": {
+      "@/*": ["./src/*"]
+    }
   },
-  "include": ["src/**/*"],
-  "exclude": ["node_modules", "dist"]
+  "include": ["src/**/*", "vite.config.ts"],
+  "exclude": ["node_modules", "dist", "dist-server", "src/backend"]
 }
diff --git a/src/vite-env.d.ts b/src/vite-env.d.ts
new file mode 100644
--- /dev/null
+++ b/src/vite-env.d.ts
@@ -0,0 +1,12 @@
+/// <reference types="vite/client" />
+
+interface ImportMetaEnv {
+  readonly VITE_ENTRA_CLIENT_ID: string;
+  readonly VITE_ENTRA_TENANT_ID: string;
+  readonly VITE_ENTRA_REDIRECT_URI: string;
+}
+
+interface ImportMeta {
+  readonly env: ImportMetaEnv;
+}
diff --git a/src/backend/types.ts b/src/backend/types.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/types.ts
@@ -0,0 +1,169 @@
+// ---------------------------------------------------------------------------
+// Shared Types — XDR & Remediation
+// ---------------------------------------------------------------------------
+// Unified type definitions ported from SecOps-O365-Command-Dashboard/types.ts
+// and extended for the unified SOC platform (BP + XDR correlation).
+// ---------------------------------------------------------------------------
+
+// ---------------------------------------------------------------------------
+// Defender XDR Types
+// ---------------------------------------------------------------------------
+
+export type Workload =
+  | 'DefenderForEndpoint'
+  | 'DefenderForIdentity'
+  | 'DefenderForOffice365'
+  | 'DefenderForCloudApps'
+  | 'DefenderXdr';
+
+export type IncidentSeverity = 'Informational' | 'Low' | 'Medium' | 'High' | 'Critical';
+
+export type IncidentStatus = 'Active' | 'InProgress' | 'Resolved' | 'Redirected';
+
+export interface IncidentSummary {
+  id: string;
+  tenantAlias: string;
+  title: string;
+  severity: IncidentSeverity;
+  status: IncidentStatus;
+  assignedTo?: string;
+  createdTime: string;
+  lastUpdateTime: string;
+  alertsCount: number;
+  workloads: Workload[];
+  classification?: string;
+  determination?: string;
+}
+
+export interface CaseWritebackRequest {
+  assignedTo?: string;
+  status?: IncidentStatus;
+  classification?: string;
+  determination?: string;
+  comment?: string;
+  tags?: string[];
+}
+
+export interface IncidentEvidenceLink {
+  label: string;
+  url: string;
+  source: string;
+}
+
+// ---------------------------------------------------------------------------
+// Remediation Types
+// ---------------------------------------------------------------------------
+
+export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
+export type ProposalStatus = 'pending' | 'approved' | 'rejected' | 'executed' | 'failed';
+
+export interface McpOperation {
+  action: string;
+  target: string;
+  parameters: Record<string, unknown>;
+}
+
+export interface MitigationRecommendation {
+  id: string;
+  title: string;
+  description: string;
+  riskLevel: RiskLevel;
+  mcpOperation?: McpOperation;
+  manualSteps?: string[];
+}
+
+export interface RemediationProposal {
+  proposalId: string;
+  id: string;
+  tenantAlias: string;
+  incidentId: string;
+  title: string;
+  description: string;
+  riskLevel: RiskLevel;
+  status: ProposalStatus;
+  mcpOperation?: McpOperation;
+  manualSteps?: string[];
+  createdAt: string;
+  decidedAt?: string;
+  decidedBy?: string;
+  executionNote?: string;
+}
+
+export interface ApprovalDecision {
+  approved: boolean;
+  actor: string;
+  reason?: string;
+}
+
+// ---------------------------------------------------------------------------
+// Storage Types
+// ---------------------------------------------------------------------------
+
+export interface CaseRecord extends IncidentSummary {
+  lastSyncedAt: string;
+}
+
+export interface AuditEvent {
+  id: string;
+  tenantAlias: string;
+  incidentId: string;
+  proposalId?: string;
+  actor: string;
+  action: string;
+  details: Record<string, unknown>;
+  createdAt: string;
+}
+
+// ---------------------------------------------------------------------------
+// Blackpoint Detection Types (for correlation)
+// ---------------------------------------------------------------------------
+
+export interface BpDetection {
+  id: string;
+  tenantAlias: string;
+  groupKey: string;
+  title: string;
+  severity: string;
+  status: string;
+  createdAt: string;
+  alertCount: number;
+  entities: string[];
+}
+
+export interface DetectionCorrelation {
+  id: string;
+  tenantAlias: string;
+  bpDetectionId: string;
+  xdrIncidentId: string;
+  correlationType: 'entity' | 'temporal' | 'title' | 'analyst-confirmed';
+  confidence: number;
+  createdAt: string;
+}
+
+export interface CloseoutRecord {
+  id: string;
+  tenantAlias: string;
+  bpDetectionId?: string;
+  xdrIncidentId?: string;
+  closedBy: string;
+  closedAt: string;
+  resolution: string;
+  notes?: string;
+}
+
+// ---------------------------------------------------------------------------
+// Alert Snapshot (cross-source)
+// ---------------------------------------------------------------------------
+
+export interface AlertSnapshot {
+  id: string;
+  tenantAlias: string;
+  source: 'blackpoint' | 'defender-xdr';
+  sourceId: string;
+  title: string;
+  severity: string;
+  status: string;
+  createdAt: string;
+  snapshotAt: string;
+}
diff --git a/src/backend/services/compassOneClient.ts b/src/backend/services/compassOneClient.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/services/compassOneClient.ts
@@ -0,0 +1,295 @@
+// ---------------------------------------------------------------------------
+// CompassOne API Client — Blackpoint Cyber v1.7.0
+// ---------------------------------------------------------------------------
+// Typed HTTP client for the CompassOne REST API. Uses per-tenant customerId
+// from UnifiedTenantConfig.blackpoint to scope requests via x-tenant-id header.
+// Auth: Bearer token from COMPASSONE_API_KEY env var (account-level) or the
+// tenant-specific apiKeyOverride.
+// ---------------------------------------------------------------------------
+
+import type { UnifiedTenantConfig } from '../config/tenants.schema.js';
+
+// ---------------------------------------------------------------------------
+// Types (mirrors legacy/types/blackpoint.types.ts relevant subsets)
+// ---------------------------------------------------------------------------
+
+export type AlertStatus = 'OPEN' | 'RESOLVED';
+
+export interface AlertGroup {
+  id: string;
+  customerId: string;
+  groupKey: string;
+  riskScore: number;
+  alertCount: number;
+  alertTypes: string[];
+  status: AlertStatus;
+  ticketId: string;
+  ticket?: { status: string; created: string };
+  alert?: { id: string; hostname?: string; username?: string } | null;
+  created: string;
+  updated?: string | null;
+}
+
+export interface AlertGroupsListResponse {
+  items: AlertGroup[];
+  total: number;
+  start: number;
+  end: number;
+  take?: number;
+  skip?: number;
+}
+
+export interface DetectionAlert {
+  id: string;
+  customerId: string;
+  documentId: string;
+  alertGroupId: string;
+  riskScore: number;
+  hostname?: string | null;
+  username?: string | null;
+  ruleName?: string | null;
+  created: string;
+  updated?: string | null;
+}
+
+export interface AlertListResponse {
+  items: DetectionAlert[];
+  total: number;
+  start: number;
+  end: number;
+}
+
+export interface AlertGroupsByWeekEntry {
+  date: string;
+  count: number;
+}
+
+export interface TopDetectionsByEntityEntry {
+  name: string;
+  count: number;
+}
+
+export interface TopDetectionsByThreatEntry {
+  name: string;
+  count: number;
+  percentage: number;
+}
+
+export interface ReportRun {
+  id: string;
+  reportType: string;
+  intervalStart: string;
+  intervalEnd: string;
+  created: string;
+  updated: string | null;
+}
+
+export interface ReportRunListResponse {
+  data: ReportRun[];
+  meta: { currentPage: number; pageSize: number; totalPages: number; totalItems: number };
+}
+
+export interface AssetPageMeta {
+  currentPage: number;
+  totalItems: number;
+  pageSize: number;
+  totalPages: number;
+}
+
+export interface Asset {
+  id: string;
+  hostname: string;
+  os?: string;
+  lastSeen?: string;
+  [key: string]: unknown;
+}
+
+export interface AssetListResponse {
+  data: Asset[];
+  meta: AssetPageMeta;
+}
+
+// ---------------------------------------------------------------------------
+// Client
+// ---------------------------------------------------------------------------
+
+export interface CompassOneClientOptions {
+  baseUrl?: string;
+  apiKey?: string;
+}
+
+export class CompassOneClient {
+  private readonly baseUrl: string;
+  private readonly apiKey: string;
+
+  constructor(opts?: CompassOneClientOptions) {
+    this.baseUrl = opts?.baseUrl || process.env.COMPASSONE_API_URL || 'https://api.blackpointcyber.com';
+    this.apiKey = opts?.apiKey || process.env.COMPASSONE_API_KEY || '';
+  }
+
+  // -------------------------------------------------------------------------
+  // Alert Groups (Detections)
+  // -------------------------------------------------------------------------
+
+  async listDetections(
+    tenant: UnifiedTenantConfig,
+    params?: { status?: AlertStatus[]; skip?: number; take?: number },
+  ): Promise<AlertGroupsListResponse> {
+    const qs = new URLSearchParams();
+    if (params?.skip != null) qs.set('skip', String(params.skip));
+    if (params?.take != null) qs.set('take', String(params.take));
+    if (params?.status) {
+      for (const s of params.status) qs.append('status', s);
+    }
+    return this.get<AlertGroupsListResponse>(tenant, '/alert-groups', qs);
+  }
+
+  async getDetection(tenant: UnifiedTenantConfig, alertGroupId: string): Promise<AlertGroup> {
+    return this.get<AlertGroup>(tenant, `/alert-groups/${encodeURIComponent(alertGroupId)}`);
+  }
+
+  async getAlerts(
+    tenant: UnifiedTenantConfig,
+    alertGroupId: string,
+    params?: { skip?: number; take?: number },
+  ): Promise<AlertListResponse> {
+    const qs = new URLSearchParams();
+    if (params?.skip != null) qs.set('skip', String(params.skip));
+    if (params?.take != null) qs.set('take', String(params.take));
+    return this.get<AlertListResponse>(
+      tenant,
+      `/alert-groups/${encodeURIComponent(alertGroupId)}/alerts`,
+      qs,
+    );
+  }
+
+  async getDetectionCount(tenant: UnifiedTenantConfig, status?: AlertStatus): Promise<number> {
+    const qs = new URLSearchParams();
+    if (status) qs.set('status', status);
+    const res = await this.get<{ count: number }>(tenant, '/alert-groups/count', qs);
+    return res.count;
+  }
+
+  async getWeeklyTrends(tenant: UnifiedTenantConfig): Promise<AlertGroupsByWeekEntry[]> {
+    return this.get<AlertGroupsByWeekEntry[]>(tenant, '/alert-groups/alert-groups-by-week');
+  }
+
+  async getTopEntities(
+    tenant: UnifiedTenantConfig,
+    params?: { top?: number },
+  ): Promise<TopDetectionsByEntityEntry[]> {
+    const qs = new URLSearchParams();
+    if (params?.top != null) qs.set('top', String(params.top));
+    return this.get<TopDetectionsByEntityEntry[]>(tenant, '/alert-groups/top-detections-by-entity', qs);
+  }
+
+  async getTopThreats(
+    tenant: UnifiedTenantConfig,
+    params?: { top?: number },
+  ): Promise<TopDetectionsByThreatEntry[]> {
+    const qs = new URLSearchParams();
+    if (params?.top != null) qs.set('top', String(params.top));
+    return this.get<TopDetectionsByThreatEntry[]>(tenant, '/alert-groups/top-detections-by-threat', qs);
+  }
+
+  // -------------------------------------------------------------------------
+  // Reports
+  // -------------------------------------------------------------------------
+
+  async listReports(
+    tenant: UnifiedTenantConfig,
+    params?: { reportType?: string; page?: number; pageSize?: number },
+  ): Promise<ReportRunListResponse> {
+    const qs = new URLSearchParams();
+    if (params?.reportType) qs.set('reportType', params.reportType);
+    if (params?.page != null) qs.set('page', String(params.page));
+    if (params?.pageSize != null) qs.set('pageSize', String(params.pageSize));
+    return this.get<ReportRunListResponse>(tenant, '/reports', qs);
+  }
+
+  async getReportPdfUrl(tenant: UnifiedTenantConfig, reportId: string): Promise<string> {
+    const res = await this.get<{ data: { url: string } }>(
+      tenant,
+      `/reports/${encodeURIComponent(reportId)}/url`,
+    );
+    return res.data.url;
+  }
+
+  async getReportJson(tenant: UnifiedTenantConfig, reportId: string): Promise<Record<string, unknown>> {
+    const res = await this.get<{ data: { report: Record<string, unknown> } }>(
+      tenant,
+      `/reports/${encodeURIComponent(reportId)}/json`,
+    );
+    return res.data.report;
+  }
+
+  // -------------------------------------------------------------------------
+  // Assets
+  // -------------------------------------------------------------------------
+
+  async listAssets(
+    tenant: UnifiedTenantConfig,
+    params?: { page?: number; pageSize?: number },
+  ): Promise<AssetListResponse> {
+    const qs = new URLSearchParams();
+    if (params?.page != null) qs.set('page', String(params.page));
+    if (params?.pageSize != null) qs.set('pageSize', String(params.pageSize));
+    return this.get<AssetListResponse>(tenant, '/assets', qs);
+  }
+
+  async getAssetCount(tenant: UnifiedTenantConfig): Promise<number> {
+    const res = await this.listAssets(tenant, { page: 1, pageSize: 1 });
+    return res.meta.totalItems;
+  }
+
+  // -------------------------------------------------------------------------
+  // Internal HTTP helpers
+  // -------------------------------------------------------------------------
+
+  private resolveApiKey(tenant: UnifiedTenantConfig): string {
+    return tenant.blackpoint?.apiKeyOverride || this.apiKey;
+  }
+
+  private resolveBaseUrl(tenant: UnifiedTenantConfig): string {
+    return tenant.blackpoint?.apiBaseUrl || this.baseUrl;
+  }
+
+  private async get<T>(
+    tenant: UnifiedTenantConfig,
+    path: string,
+    qs?: URLSearchParams,
+  ): Promise<T> {
+    const base = this.resolveBaseUrl(tenant);
+    const key = this.resolveApiKey(tenant);
+    const customerId = tenant.blackpoint?.customerId;
+
+    if (!customerId) {
+      throw new Error(`Tenant "${tenant.alias}" has no Blackpoint customerId configured`);
+    }
+    if (!key) {
+      throw new Error('CompassOne API key is not configured');
+    }
+
+    let url = `${base}/v1${path}`;
+    if (qs && qs.toString()) {
+      url += `?${qs.toString()}`;
+    }
+
+    const headers: Record<string, string> = {
+      Authorization: `Bearer ${key}`,
+      'Content-Type': 'application/json',
+      'x-tenant-id': customerId,
+    };
+
+    const response = await fetch(url, { method: 'GET', headers });
+
+    if (!response.ok) {
+      throw new Error(
+        `CompassOne API error: ${response.status} ${response.statusText} on GET ${path}`,
+      );
+    }
+
+    return (await response.json()) as T;
+  }
+}
diff --git a/src/backend/services/defenderApi.ts b/src/backend/services/defenderApi.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/services/defenderApi.ts
@@ -0,0 +1,296 @@
+// ---------------------------------------------------------------------------
+// Defender XDR API Client
+// ---------------------------------------------------------------------------
+// Ported from SecOps-O365-Command-Dashboard/defenderApi.ts and adapted for
+// the unified tenant config schema. Acquires tokens per-tenant using MSAL
+// confidential client flow (client_credentials grant).
+// ---------------------------------------------------------------------------
+
+import { ConfidentialClientApplication } from '@azure/msal-node';
+import type { UnifiedTenantConfig, MicrosoftTenantConfig } from '../config/tenants.schema.js';
+import type {
+  IncidentSummary,
+  IncidentStatus,
+  IncidentSeverity,
+  Workload,
+  CaseWritebackRequest,
+  IncidentEvidenceLink,
+} from '../types.js';
+
+// ---------------------------------------------------------------------------
+// Token Cache (per tenant)
+// ---------------------------------------------------------------------------
+
+interface CachedToken {
+  accessToken: string;
+  expiresAt: number;
+}
+
+const tokenCache = new Map<string, CachedToken>();
+
+async function acquireToken(ms: MicrosoftTenantConfig, scope: string): Promise<string> {
+  const cacheKey = `${ms.tenantId}:${scope}`;
+  const cached = tokenCache.get(cacheKey);
+  if (cached && cached.expiresAt > Date.now() + 60_000) {
+    return cached.accessToken;
+  }
+
+  const cca = new ConfidentialClientApplication({
+    auth: {
+      clientId: ms.clientId,
+      clientSecret: ms.clientSecret,
+      authority: `https://login.microsoftonline.com/${ms.tenantId}`,
+    },
+  });
+
+  const result = await cca.acquireTokenByClientCredential({ scopes: [scope] });
+  if (!result?.accessToken) {
+    throw new Error(`Failed to acquire token for tenant ${ms.tenantId}, scope ${scope}`);
+  }
+
+  tokenCache.set(cacheKey, {
+    accessToken: result.accessToken,
+    expiresAt: Date.now() + (result.expiresOn ? result.expiresOn.getTime() - Date.now() : 3500_000),
+  });
+
+  return result.accessToken;
+}
+
+// ---------------------------------------------------------------------------
+// API Client
+// ---------------------------------------------------------------------------
+
+const GRAPH_SECURITY_BASE = 'https://graph.microsoft.com/v1.0/security';
+
+export class DefenderApiClient {
+  // -------------------------------------------------------------------------
+  // Incidents
+  // -------------------------------------------------------------------------
+
+  async listIncidents(
+    tenant: UnifiedTenantConfig,
+    params?: { top?: number; filter?: string },
+  ): Promise<IncidentSummary[]> {
+    const ms = this.requireMicrosoft(tenant);
+    const qs = new URLSearchParams();
+    if (params?.top) qs.set('$top', String(params.top));
+    if (params?.filter) qs.set('$filter', params.filter);
+
+    const url = `${this.securityApiBase(ms)}/incidents${qs.toString() ? '?' + qs.toString() : ''}`;
+    const data = await this.requestSecurityApi<{ value: RawIncident[] }>(ms, url);
+    return (data.value || []).map((i) => this.mapIncident(tenant.alias, i));
+  }
+
+  async getIncident(tenant: UnifiedTenantConfig, incidentId: string): Promise<IncidentSummary> {
+    const ms = this.requireMicrosoft(tenant);
+    const url = `${this.securityApiBase(ms)}/incidents/${encodeURIComponent(incidentId)}`;
+    const raw = await this.requestSecurityApi<RawIncident>(ms, url);
+    return this.mapIncident(tenant.alias, raw);
+  }
+
+  async updateIncident(
+    tenant: UnifiedTenantConfig,
+    incidentId: string,
+    update: CaseWritebackRequest,
+  ): Promise<void> {
+    const ms = this.requireMicrosoft(tenant);
+    const url = `${this.securityApiBase(ms)}/incidents/${encodeURIComponent(incidentId)}`;
+    const body: Record<string, unknown> = {};
+    if (update.assignedTo !== undefined) body.assignedTo = update.assignedTo;
+    if (update.status !== undefined) body.status = this.mapStatusToApi(update.status);
+    if (update.classification !== undefined) body.classification = update.classification;
+    if (update.determination !== undefined) body.determination = update.determination;
+    if (update.tags !== undefined) body.customTags = update.tags;
+
+    await this.requestSecurityApi<unknown>(ms, url, {
+      method: 'PATCH',
+      body: JSON.stringify(body),
+    });
+  }
+
+  // -------------------------------------------------------------------------
+  // Evidence Links (deep-link URLs for portal navigation)
+  // -------------------------------------------------------------------------
+
+  async getIncidentEvidenceLinks(
+    tenant: UnifiedTenantConfig,
+    incidentId: string,
+  ): Promise<IncidentEvidenceLink[]> {
+    const ms = this.requireMicrosoft(tenant);
+    const portalBase = `https://security.microsoft.com/tenants/${ms.tenantId}`;
+
+    const links: IncidentEvidenceLink[] = [
+      {
+        label: 'Incident in M365 Defender',
+        url: `${portalBase}/incidents/${incidentId}`,
+        source: 'defender-portal',
+      },
+    ];
+
+    // Fetch alerts for additional deep links
+    const alertsUrl = `${GRAPH_SECURITY_BASE}/incidents/${encodeURIComponent(incidentId)}/alerts`;
+    try {
+      const alertData = await this.requestGraphApi<{ value: RawAlert[] }>(ms, alertsUrl);
+      for (const alert of alertData.value || []) {
+        links.push({
+          label: `Alert: ${alert.title || alert.id}`,
+          url: `${portalBase}/alerts/${alert.id}`,
+          source: 'defender-alert',
+        });
+      }
+    } catch {
+      // Non-fatal: portal link is still useful
+    }
+
+    return links;
+  }
+
+  // -------------------------------------------------------------------------
+  // Internals
+  // -------------------------------------------------------------------------
+
+  private requireMicrosoft(tenant: UnifiedTenantConfig): MicrosoftTenantConfig {
+    if (!tenant.microsoft) {
+      throw new Error(`Tenant "${tenant.alias}" has no Microsoft configuration`);
+    }
+    return tenant.microsoft;
+  }
+
+  private securityApiBase(ms: MicrosoftTenantConfig): string {
+    return ms.securityApiHost
+      ? `${ms.securityApiHost}/api`
+      : `${GRAPH_SECURITY_BASE}`;
+  }
+
+  private async requestSecurityApi<T>(
+    ms: MicrosoftTenantConfig,
+    url: string,
+    init?: RequestInit,
+  ): Promise<T> {
+    const scope = ms.securityApiHost
+      ? `${ms.securityApiHost}/.default`
+      : 'https://graph.microsoft.com/.default';
+    const token = await acquireToken(ms, scope);
+
+    const response = await fetch(url, {
+      ...init,
+      headers: {
+        Authorization: `Bearer ${token}`,
+        'Content-Type': 'application/json',
+        ...(init?.headers as Record<string, string> | undefined),
+      },
+    });
+
+    if (!response.ok) {
+      throw new Error(`Defender API error: ${response.status} on ${init?.method || 'GET'} ${url}`);
+    }
+
+    return (await response.json()) as T;
+  }
+
+  private async requestGraphApi<T>(ms: MicrosoftTenantConfig, url: string): Promise<T> {
+    const token = await acquireToken(ms, 'https://graph.microsoft.com/.default');
+
+    const response = await fetch(url, {
+      headers: {
+        Authorization: `Bearer ${token}`,
+        'Content-Type': 'application/json',
+      },
+    });
+
+    if (!response.ok) {
+      throw new Error(`Graph API error: ${response.status} on GET ${url}`);
+    }
+
+    return (await response.json()) as T;
+  }
+
+  private mapIncident(tenantAlias: string, raw: RawIncident): IncidentSummary {
+    return {
+      id: String(raw.id),
+      tenantAlias,
+      title: raw.displayName || raw.incidentName || '',
+      severity: this.normalizeSeverity(raw.severity),
+      status: this.normalizeStatus(raw.status),
+      assignedTo: raw.assignedTo || undefined,
+      createdTime: raw.createdDateTime || '',
+      lastUpdateTime: raw.lastUpdateDateTime || raw.lastModifiedDateTime || '',
+      alertsCount: raw.alerts?.length ?? 0,
+      workloads: this.inferWorkloads(raw),
+      classification: raw.classification || undefined,
+      determination: raw.determination || undefined,
+    };
+  }
+
+  private normalizeSeverity(raw?: string): IncidentSeverity {
+    const map: Record<string, IncidentSeverity> = {
+      informational: 'Informational',
+      low: 'Low',
+      medium: 'Medium',
+      high: 'High',
+      critical: 'Critical',
+    };
+    return map[(raw || '').toLowerCase()] || 'Medium';
+  }
+
+  private normalizeStatus(raw?: string): IncidentStatus {
+    const map: Record<string, IncidentStatus> = {
+      active: 'Active',
+      inprogress: 'InProgress',
+      in_progress: 'InProgress',
+      resolved: 'Resolved',
+      redirected: 'Redirected',
+    };
+    return map[(raw || '').toLowerCase().replace(/\s/g, '')] || 'Active';
+  }
+
+  private mapStatusToApi(status: IncidentStatus): string {
+    const map: Record<IncidentStatus, string> = {
+      Active: 'active',
+      InProgress: 'inProgress',
+      Resolved: 'resolved',
+      Redirected: 'redirected',
+    };
+    return map[status] || 'active';
+  }
+
+  private inferWorkloads(raw: RawIncident): Workload[] {
+    const workloads = new Set<Workload>();
+    for (const alert of raw.alerts || []) {
+      const source = (alert.serviceSource || alert.detectionSource || '').toLowerCase();
+      if (source.includes('endpoint')) workloads.add('DefenderForEndpoint');
+      else if (source.includes('identity')) workloads.add('DefenderForIdentity');
+      else if (source.includes('office')) workloads.add('DefenderForOffice365');
+      else if (source.includes('cloud') || source.includes('app')) workloads.add('DefenderForCloudApps');
+      else workloads.add('DefenderXdr');
+    }
+    return workloads.size > 0 ? [...workloads] : ['DefenderXdr'];
+  }
+}
+
+// ---------------------------------------------------------------------------
+// Raw API response shapes
+// ---------------------------------------------------------------------------
+
+interface RawIncident {
+  id: string | number;
+  displayName?: string;
+  incidentName?: string;
+  severity?: string;
+  status?: string;
+  assignedTo?: string;
+  createdDateTime?: string;
+  lastUpdateDateTime?: string;
+  lastModifiedDateTime?: string;
+  classification?: string;
+  determination?: string;
+  alerts?: RawAlert[];
+}
+
+interface RawAlert {
+  id: string;
+  title?: string;
+  serviceSource?: string;
+  detectionSource?: string;
+}
diff --git a/src/backend/services/remediationService.ts b/src/backend/services/remediationService.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/services/remediationService.ts
@@ -0,0 +1,166 @@
+// ---------------------------------------------------------------------------
+// Remediation Service
+// ---------------------------------------------------------------------------
+// Ported from SecOps-O365-Command-Dashboard/remediationService.ts.
+// Manages remediation proposal lifecycle: creation → approval → execution.
+// Depends on a CaseRepository (storage) and RemediationExecutor (MCP bridge).
+// ---------------------------------------------------------------------------
+
+import { randomUUID } from 'node:crypto';
+import type {
+  IncidentSummary,
+  MitigationRecommendation,
+  RemediationProposal,
+  ApprovalDecision,
+  AuditEvent,
+  ProposalStatus,
+} from '../types.js';
+
+// ---------------------------------------------------------------------------
+// Interfaces for dependency injection
+// ---------------------------------------------------------------------------
+
+export interface ProposalRepository {
+  saveProposal(proposal: RemediationProposal): Promise<void>;
+  getProposal(proposalId: string): Promise<RemediationProposal | null>;
+  listProposals(tenantAlias: string, incidentId?: string): Promise<RemediationProposal[]>;
+  addAuditEvent(event: AuditEvent): Promise<void>;
+}
+
+export interface RemediationExecutor {
+  execute(proposal: RemediationProposal): Promise<{ note: string }>;
+}
+
+// ---------------------------------------------------------------------------
+// Service
+// ---------------------------------------------------------------------------
+
+export class RemediationService {
+  constructor(
+    private readonly repository: ProposalRepository,
+    private readonly executor: RemediationExecutor,
+  ) {}
+
+  /**
+   * Create remediation proposals for an incident based on recommendations.
+   */
+  async createPlan(
+    actor: string,
+    tenantAlias: string,
+    incident: IncidentSummary,
+    recommendations: MitigationRecommendation[],
+  ): Promise<RemediationProposal[]> {
+    const proposals: RemediationProposal[] = [];
+
+    for (const rec of recommendations) {
+      const proposal: RemediationProposal = {
+        proposalId: randomUUID(),
+        id: rec.id,
+        tenantAlias,
+        incidentId: incident.id,
+        title: rec.title,
+        description: rec.description,
+        riskLevel: rec.riskLevel,
+        status: 'pending',
+        mcpOperation: rec.mcpOperation,
+        manualSteps: rec.manualSteps,
+        createdAt: new Date().toISOString(),
+      };
+
+      await this.repository.saveProposal(proposal);
+      proposals.push(proposal);
+
+      await this.repository.addAuditEvent(newAuditEvent({
+        tenantAlias,
+        incidentId: incident.id,
+        proposalId: proposal.proposalId,
+        actor,
+        action: 'proposal.created',
+        details: { title: rec.title, riskLevel: rec.riskLevel },
+      }));
+    }
+
+    return proposals;
+  }
+
+  /**
+   * Retrieve a single proposal by ID.
+   */
+  async getProposal(proposalId: string): Promise<RemediationProposal | null> {
+    return this.repository.getProposal(proposalId);
+  }
+
+  /**
+   * List proposals for a tenant, optionally filtered by incident.
+   */
+  async listProposals(tenantAlias: string, incidentId?: string): Promise<RemediationProposal[]> {
+    return this.repository.listProposals(tenantAlias, incidentId);
+  }
+
+  /**
+   * Apply an approval or rejection decision to a proposal.
+   * If approved and executor is available, execute immediately.
+   */
+  async applyApprovalDecision(
+    proposalId: string,
+    decision: ApprovalDecision,
+  ): Promise<RemediationProposal> {
+    const proposal = await this.repository.getProposal(proposalId);
+    if (!proposal) {
+      throw new Error(`Proposal not found: ${proposalId}`);
+    }
+    if (proposal.status !== 'pending') {
+      throw new Error(`Proposal ${proposalId} is not pending (current: ${proposal.status})`);
+    }
+
+    const newStatus: ProposalStatus = decision.approved ? 'approved' : 'rejected';
+    proposal.status = newStatus;
+    proposal.decidedAt = new Date().toISOString();
+    proposal.decidedBy = decision.actor;
+
+    await this.repository.addAuditEvent(newAuditEvent({
+      tenantAlias: proposal.tenantAlias,
+      incidentId: proposal.incidentId,
+      proposalId: proposal.proposalId,
+      actor: decision.actor,
+      action: decision.approved ? 'proposal.approved' : 'proposal.rejected',
+      details: { reason: decision.reason },
+    }));
+
+    if (decision.approved) {
+      try {
+        const result = await this.executor.execute(proposal);
+        proposal.status = 'executed';
+        proposal.executionNote = result.note;
+      } catch (err) {
+        proposal.status = 'failed';
+        proposal.executionNote = err instanceof Error ? err.message : 'Execution failed';
+      }
+
+      await this.repository.addAuditEvent(newAuditEvent({
+        tenantAlias: proposal.tenantAlias,
+        incidentId: proposal.incidentId,
+        proposalId: proposal.proposalId,
+        actor: 'system',
+        action: proposal.status === 'executed' ? 'proposal.executed' : 'proposal.execution-failed',
+        details: { note: proposal.executionNote },
+      }));
+    }
+
+    await this.repository.saveProposal(proposal);
+    return proposal;
+  }
+}
+
+// ---------------------------------------------------------------------------
+// Helpers
+// ---------------------------------------------------------------------------
+
+function newAuditEvent(input: Omit<AuditEvent, 'id' | 'createdAt'>): AuditEvent {
+  return {
+    ...input,
+    id: randomUUID(),
+    createdAt: new Date().toISOString(),
+  };
+}
diff --git a/src/backend/services/mcpBridge.ts b/src/backend/services/mcpBridge.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/services/mcpBridge.ts
@@ -0,0 +1,101 @@
+// ---------------------------------------------------------------------------
+// MCP Bridge — Defender Response Automation
+// ---------------------------------------------------------------------------
+// Ported from SecOps-O365-Command-Dashboard/defenderResponseMcpExecutor.ts.
+// Dispatches approved remediation proposals to the Defender Response MCP
+// gateway via a signed webhook. Implements the RemediationExecutor interface
+// consumed by RemediationService.
+// ---------------------------------------------------------------------------
+
+import { createHmac } from 'node:crypto';
+import type { RemediationProposal } from '../types.js';
+import type { RemediationExecutor } from './remediationService.js';
+
+// ---------------------------------------------------------------------------
+// Payload builder
+// ---------------------------------------------------------------------------
+
+export interface McpDispatchPayload {
+  proposalId: string;
+  tenantAlias: string;
+  incidentId: string;
+  action: string;
+  target: string;
+  parameters: Record<string, unknown>;
+  timestamp: string;
+}
+
+function buildDispatchPayload(proposal: RemediationProposal): McpDispatchPayload {
+  if (!proposal.mcpOperation) {
+    throw new Error('Cannot build dispatch payload without mcpOperation');
+  }
+  return {
+    proposalId: proposal.proposalId,
+    tenantAlias: proposal.tenantAlias,
+    incidentId: proposal.incidentId,
+    action: proposal.mcpOperation.action,
+    target: proposal.mcpOperation.target,
+    parameters: proposal.mcpOperation.parameters,
+    timestamp: new Date().toISOString(),
+  };
+}
+
+// ---------------------------------------------------------------------------
+// Executor
+// ---------------------------------------------------------------------------
+
+export class McpBridgeExecutor implements RemediationExecutor {
+  private readonly webhookUrl: string | undefined;
+  private readonly webhookSecret: string | undefined;
+
+  constructor() {
+    this.webhookUrl = process.env.MCP_AUTOMATION_WEBHOOK_URL;
+    this.webhookSecret = process.env.MCP_AUTOMATION_WEBHOOK_SECRET;
+  }
+
+  async execute(proposal: RemediationProposal): Promise<{ note: string }> {
+    if (!proposal.mcpOperation) {
+      return {
+        note: 'No automation mapping exists for this recommendation. Follow the manual steps.',
+      };
+    }
+
+    if (!this.webhookUrl) {
+      return {
+        note: `Prepared ${proposal.mcpOperation.action}. Set MCP_AUTOMATION_WEBHOOK_URL to dispatch this action to your Defender Response MCP gateway.`,
+      };
+    }
+
+    const payload = buildDispatchPayload(proposal);
+    const bodyString = JSON.stringify(payload);
+
+    const headers: Record<string, string> = {
+      'Content-Type': 'application/json',
+    };
+
+    if (this.webhookSecret) {
+      headers['X-SecOps-Signature'] = createHmac('sha256', this.webhookSecret)
+        .update(bodyString)
+        .digest('hex');
+    }
+
+    const response = await fetch(this.webhookUrl, {
+      method: 'POST',
+      headers,
+      body: bodyString,
+    });
+
+    if (!response.ok) {
+      const text = await response.text();
+      throw new Error(
+        `Failed to execute MCP automation: ${response.status} ${text}`,
+      );
+    }
+
+    const suffix = this.webhookSecret ? ' with signed payload' : '';
+    return {
+      note: `Executed ${proposal.mcpOperation.action} through Defender Response MCP bridge${suffix}.`,
+    };
+  }
+}
diff --git a/src/backend/services/learningPlaybook.ts b/src/backend/services/learningPlaybook.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/services/learningPlaybook.ts
@@ -0,0 +1,197 @@
+// ---------------------------------------------------------------------------
+// Learning Playbook — ACE Recommendation Engine
+// ---------------------------------------------------------------------------
+// Ingests playbook definitions and applies heuristic scoring to generate
+// ranked mitigation recommendations for a given incident or detection.
+// Designed to integrate with the Adaptive Confidence Engine (ACE) pipeline
+// from the O365 Command Dashboard for continuous learning.
+// ---------------------------------------------------------------------------
+
+import type { MitigationRecommendation, RiskLevel, McpOperation } from '../types.js';
+
+// ---------------------------------------------------------------------------
+// Playbook Schema
+// ---------------------------------------------------------------------------
+
+export interface PlaybookEntry {
+  id: string;
+  title: string;
+  description: string;
+  /** Workload/source patterns this playbook applies to */
+  matchPatterns: MatchPattern[];
+  /** Risk level of the remediation action */
+  riskLevel: RiskLevel;
+  /** Optional MCP automation action */
+  mcpOperation?: McpOperation;
+  /** Manual steps if no automation */
+  manualSteps?: string[];
+  /** ACE confidence score (0-1). Updated by feedback loop. */
+  confidence: number;
+  /** How many times this playbook has been applied */
+  appliedCount: number;
+  /** How many times it was approved after being proposed */
+  approvedCount: number;
+  /** Enabled flag — disable entries that consistently fail */
+  enabled: boolean;
+}
+
+export interface MatchPattern {
+  /** Match field: 'title', 'workload', 'severity', 'entity', 'alertType' */
+  field: string;
+  /** Regex or exact match value */
+  value: string;
+  /** Whether value is a regex */
+  isRegex?: boolean;
+}
+
+// ---------------------------------------------------------------------------
+// Incident Context (passed into recommend())
+// ---------------------------------------------------------------------------
+
+export interface IncidentContext {
+  title: string;
+  severity: string;
+  workloads: string[];
+  alertTypes?: string[];
+  entities?: string[];
+}
+
+// ---------------------------------------------------------------------------
+// Engine
+// ---------------------------------------------------------------------------
+
+export class LearningPlaybookEngine {
+  private playbooks: PlaybookEntry[] = [];
+
+  /**
+   * Load playbooks from a JSON array (file or database).
+   */
+  loadPlaybooks(entries: PlaybookEntry[]): void {
+    this.playbooks = entries.filter((e) => e.enabled);
+  }
+
+  /**
+   * Add or update a playbook entry.
+   */
+  upsertPlaybook(entry: PlaybookEntry): void {
+    const idx = this.playbooks.findIndex((p) => p.id === entry.id);
+    if (idx >= 0) {
+      this.playbooks[idx] = entry;
+    } else if (entry.enabled) {
+      this.playbooks.push(entry);
+    }
+  }
+
+  /**
+   * Generate ranked recommendations for an incident context.
+   * Returns top N (default 5) matching playbooks ordered by score.
+   */
+  recommend(context: IncidentContext, maxResults = 5): MitigationRecommendation[] {
+    const scored: Array<{ entry: PlaybookEntry; score: number }> = [];
+
+    for (const entry of this.playbooks) {
+      const matchScore = this.computeMatchScore(entry, context);
+      if (matchScore <= 0) continue;
+
+      // Final score: pattern match strength × ACE confidence × approval rate
+      const approvalRate = entry.appliedCount > 0
+        ? entry.approvedCount / entry.appliedCount
+        : 0.5; // neutral for new entries
+      const score = matchScore * entry.confidence * (0.5 + 0.5 * approvalRate);
+      scored.push({ entry, score });
+    }
+
+    scored.sort((a, b) => b.score - a.score);
+
+    return scored.slice(0, maxResults).map(({ entry }) => ({
+      id: entry.id,
+      title: entry.title,
+      description: entry.description,
+      riskLevel: entry.riskLevel,
+      mcpOperation: entry.mcpOperation,
+      manualSteps: entry.manualSteps,
+    }));
+  }
+
+  /**
+   * Record feedback: increment applied/approved counts and adjust confidence.
+   */
+  recordFeedback(playbookId: string, wasApproved: boolean): void {
+    const entry = this.playbooks.find((p) => p.id === playbookId);
+    if (!entry) return;
+
+    entry.appliedCount += 1;
+    if (wasApproved) {
+      entry.approvedCount += 1;
+    }
+
+    // Exponential moving average on confidence
+    const feedback = wasApproved ? 1 : 0;
+    const alpha = 0.1;
+    entry.confidence = entry.confidence * (1 - alpha) + feedback * alpha;
+
+    // Disable consistently rejected entries
+    if (entry.appliedCount >= 10 && entry.approvedCount / entry.appliedCount < 0.1) {
+      entry.enabled = false;
+    }
+  }
+
+  /**
+   * Export current playbooks (for persistence/serialization).
+   */
+  exportPlaybooks(): PlaybookEntry[] {
+    return [...this.playbooks];
+  }
+
+  // -------------------------------------------------------------------------
+  // Pattern Matching
+  // -------------------------------------------------------------------------
+
+  private computeMatchScore(entry: PlaybookEntry, context: IncidentContext): number {
+    let totalScore = 0;
+    let matchedPatterns = 0;
+
+    for (const pattern of entry.matchPatterns) {
+      const fieldValue = this.getFieldValue(context, pattern.field);
+      if (!fieldValue) continue;
+
+      const values = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
+      const matched = values.some((v) => this.matchesPattern(v, pattern));
+
+      if (matched) {
+        matchedPatterns += 1;
+        totalScore += 1;
+      }
+    }
+
+    // All patterns must match for the entry to qualify
+    if (matchedPatterns < entry.matchPatterns.length) {
+      return 0;
+    }
+
+    return totalScore / entry.matchPatterns.length;
+  }
+
+  private getFieldValue(context: IncidentContext, field: string): string | string[] | undefined {
+    switch (field) {
+      case 'title': return context.title;
+      case 'severity': return context.severity;
+      case 'workload': return context.workloads;
+      case 'alertType': return context.alertTypes;
+      case 'entity': return context.entities;
+      default: return undefined;
+    }
+  }
+
+  private matchesPattern(value: string, pattern: MatchPattern): boolean {
+    if (pattern.isRegex) {
+      try {
+        return new RegExp(pattern.value, 'i').test(value);
+      } catch {
+        return false;
+      }
+    }
+    return value.toLowerCase() === pattern.value.toLowerCase();
+  }
+}
diff --git a/src/backend/services/index.ts b/src/backend/services/index.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/services/index.ts
@@ -0,0 +1,30 @@
+// ---------------------------------------------------------------------------
+// Services — Barrel Export
+// ---------------------------------------------------------------------------
+
+export { CompassOneClient } from './compassOneClient.js';
+export type {
+  AlertGroup,
+  AlertGroupsListResponse,
+  DetectionAlert,
+  AlertListResponse,
+  AlertGroupsByWeekEntry,
+  TopDetectionsByEntityEntry,
+  TopDetectionsByThreatEntry,
+  ReportRun,
+  ReportRunListResponse,
+  Asset,
+  AssetListResponse,
+} from './compassOneClient.js';
+
+export { DefenderApiClient } from './defenderApi.js';
+
+export { RemediationService } from './remediationService.js';
+export type { ProposalRepository, RemediationExecutor } from './remediationService.js';
+
+export { McpBridgeExecutor } from './mcpBridge.js';
+export type { McpDispatchPayload } from './mcpBridge.js';
+
+export { LearningPlaybookEngine } from './learningPlaybook.js';
+export type { PlaybookEntry, MatchPattern, IncidentContext } from './learningPlaybook.js';
diff --git a/src/backend/storage/repository.ts b/src/backend/storage/repository.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/storage/repository.ts
@@ -0,0 +1,82 @@
+// ---------------------------------------------------------------------------
+// Storage — Repository Interface
+// ---------------------------------------------------------------------------
+// Defines the CaseRepository contract for persisting XDR incidents, BP
+// detections, remediation proposals, audit events, and cross-source
+// correlation records. Extends the original O365 Dashboard pattern with
+// Blackpoint correlation and closeout governance methods.
+// ---------------------------------------------------------------------------
+
+import { randomUUID } from 'node:crypto';
+import type {
+  CaseRecord,
+  IncidentSummary,
+  RemediationProposal,
+  AuditEvent,
+  BpDetection,
+  DetectionCorrelation,
+  CloseoutRecord,
+  AlertSnapshot,
+} from '../types.js';
+
+// ---------------------------------------------------------------------------
+// Core Interface
+// ---------------------------------------------------------------------------
+
+export interface CaseRepository {
+  /** Initialize connection / ensure tables exist */
+  init(): Promise<void>;
+
+  // -- XDR Incidents (Cases) ------------------------------------------------
+  upsertCaseFromIncident(incident: IncidentSummary): Promise<CaseRecord>;
+  listCases(tenantAlias: string, limit?: number): Promise<CaseRecord[]>;
+  getCase(tenantAlias: string, incidentId: string): Promise<CaseRecord | null>;
+
+  // -- Remediation Proposals ------------------------------------------------
+  saveProposal(proposal: RemediationProposal): Promise<void>;
+  getProposal(proposalId: string): Promise<RemediationProposal | null>;
+  listProposals(tenantAlias: string, incidentId?: string): Promise<RemediationProposal[]>;
+
+  // -- Audit Events ---------------------------------------------------------
+  addAuditEvent(event: AuditEvent): Promise<void>;
+  listAuditEvents(tenantAlias: string, incidentId?: string): Promise<AuditEvent[]>;
+
+  // -- Blackpoint Detections ------------------------------------------------
+  upsertDetection(detection: BpDetection): Promise<void>;
+  listDetections(tenantAlias: string, limit?: number): Promise<BpDetection[]>;
+  getDetection(tenantAlias: string, detectionId: string): Promise<BpDetection | null>;
+
+  // -- Cross-Source Correlation ---------------------------------------------
+  saveCorrelation(correlation: DetectionCorrelation): Promise<void>;
+  listCorrelations(tenantAlias: string): Promise<DetectionCorrelation[]>;
+  getCorrelationsByDetection(detectionId: string): Promise<DetectionCorrelation[]>;
+  getCorrelationsByIncident(incidentId: string): Promise<DetectionCorrelation[]>;
+
+  // -- Closeout Governance --------------------------------------------------
+  saveCloseout(record: CloseoutRecord): Promise<void>;
+  listCloseouts(tenantAlias: string, limit?: number): Promise<CloseoutRecord[]>;
+
+  // -- Alert Snapshots (cross-source timeline) ------------------------------
+  saveAlertSnapshot(snapshot: AlertSnapshot): Promise<void>;
+  listAlertSnapshots(tenantAlias: string, limit?: number): Promise<AlertSnapshot[]>;
+}
+
+// ---------------------------------------------------------------------------
+// Helpers
+// ---------------------------------------------------------------------------
+
+export function toCaseRecord(incident: IncidentSummary): CaseRecord {
+  return {
+    ...incident,
+    lastSyncedAt: new Date().toISOString(),
+  };
+}
+
+export function newAuditEvent(input: Omit<AuditEvent, 'id' | 'createdAt'>): AuditEvent {
+  return {
+    ...input,
+    id: randomUUID(),
+    createdAt: new Date().toISOString(),
+  };
+}
diff --git a/src/backend/storage/memory.ts b/src/backend/storage/memory.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/storage/memory.ts
@@ -0,0 +1,155 @@
+// ---------------------------------------------------------------------------
+// Storage — In-Memory Implementation
+// ---------------------------------------------------------------------------
+// Default storage backend for development and testing. All data lives in
+// process memory and is lost on restart.
+// ---------------------------------------------------------------------------
+
+import type {
+  CaseRecord,
+  IncidentSummary,
+  RemediationProposal,
+  AuditEvent,
+  BpDetection,
+  DetectionCorrelation,
+  CloseoutRecord,
+  AlertSnapshot,
+} from '../types.js';
+import type { CaseRepository } from './repository.js';
+import { toCaseRecord } from './repository.js';
+
+export class InMemoryCaseRepository implements CaseRepository {
+  private cases = new Map<string, CaseRecord>();
+  private proposals = new Map<string, RemediationProposal>();
+  private auditEvents: AuditEvent[] = [];
+  private detections = new Map<string, BpDetection>();
+  private correlations: DetectionCorrelation[] = [];
+  private closeouts: CloseoutRecord[] = [];
+  private alertSnapshots: AlertSnapshot[] = [];
+
+  async init(): Promise<void> {
+    // No-op for in-memory
+  }
+
+  // -- XDR Incidents --------------------------------------------------------
+
+  async upsertCaseFromIncident(incident: IncidentSummary): Promise<CaseRecord> {
+    const key = `${incident.tenantAlias}:${incident.id}`;
+    const record = toCaseRecord(incident);
+    this.cases.set(key, record);
+    return record;
+  }
+
+  async listCases(tenantAlias: string, limit = 100): Promise<CaseRecord[]> {
+    const results: CaseRecord[] = [];
+    for (const record of this.cases.values()) {
+      if (record.tenantAlias === tenantAlias) {
+        results.push(record);
+        if (results.length >= limit) break;
+      }
+    }
+    return results;
+  }
+
+  async getCase(tenantAlias: string, incidentId: string): Promise<CaseRecord | null> {
+    return this.cases.get(`${tenantAlias}:${incidentId}`) ?? null;
+  }
+
+  // -- Remediation Proposals ------------------------------------------------
+
+  async saveProposal(proposal: RemediationProposal): Promise<void> {
+    this.proposals.set(proposal.proposalId, proposal);
+  }
+
+  async getProposal(proposalId: string): Promise<RemediationProposal | null> {
+    return this.proposals.get(proposalId) ?? null;
+  }
+
+  async listProposals(tenantAlias: string, incidentId?: string): Promise<RemediationProposal[]> {
+    const results: RemediationProposal[] = [];
+    for (const p of this.proposals.values()) {
+      if (p.tenantAlias !== tenantAlias) continue;
+      if (incidentId && p.incidentId !== incidentId) continue;
+      results.push(p);
+    }
+    return results;
+  }
+
+  // -- Audit Events ---------------------------------------------------------
+
+  async addAuditEvent(event: AuditEvent): Promise<void> {
+    this.auditEvents.push(event);
+  }
+
+  async listAuditEvents(tenantAlias: string, incidentId?: string): Promise<AuditEvent[]> {
+    return this.auditEvents.filter((e) => {
+      if (e.tenantAlias !== tenantAlias) return false;
+      if (incidentId && e.incidentId !== incidentId) return false;
+      return true;
+    });
+  }
+
+  // -- Blackpoint Detections ------------------------------------------------
+
+  async upsertDetection(detection: BpDetection): Promise<void> {
+    this.detections.set(`${detection.tenantAlias}:${detection.id}`, detection);
+  }
+
+  async listDetections(tenantAlias: string, limit = 100): Promise<BpDetection[]> {
+    const results: BpDetection[] = [];
+    for (const d of this.detections.values()) {
+      if (d.tenantAlias === tenantAlias) {
+        results.push(d);
+        if (results.length >= limit) break;
+      }
+    }
+    return results;
+  }
+
+  async getDetection(tenantAlias: string, detectionId: string): Promise<BpDetection | null> {
+    return this.detections.get(`${tenantAlias}:${detectionId}`) ?? null;
+  }
+
+  // -- Cross-Source Correlation ---------------------------------------------
+
+  async saveCorrelation(correlation: DetectionCorrelation): Promise<void> {
+    this.correlations.push(correlation);
+  }
+
+  async listCorrelations(tenantAlias: string): Promise<DetectionCorrelation[]> {
+    return this.correlations.filter((c) => c.tenantAlias === tenantAlias);
+  }
+
+  async getCorrelationsByDetection(detectionId: string): Promise<DetectionCorrelation[]> {
+    return this.correlations.filter((c) => c.bpDetectionId === detectionId);
+  }
+
+  async getCorrelationsByIncident(incidentId: string): Promise<DetectionCorrelation[]> {
+    return this.correlations.filter((c) => c.xdrIncidentId === incidentId);
+  }
+
+  // -- Closeout Governance --------------------------------------------------
+
+  async saveCloseout(record: CloseoutRecord): Promise<void> {
+    this.closeouts.push(record);
+  }
+
+  async listCloseouts(tenantAlias: string, limit = 100): Promise<CloseoutRecord[]> {
+    return this.closeouts
+      .filter((c) => c.tenantAlias === tenantAlias)
+      .slice(0, limit);
+  }
+
+  // -- Alert Snapshots ------------------------------------------------------
+
+  async saveAlertSnapshot(snapshot: AlertSnapshot): Promise<void> {
+    this.alertSnapshots.push(snapshot);
+  }
+
+  async listAlertSnapshots(tenantAlias: string, limit = 100): Promise<AlertSnapshot[]> {
+    return this.alertSnapshots
+      .filter((s) => s.tenantAlias === tenantAlias)
+      .slice(0, limit);
+  }
+}
diff --git a/src/backend/storage/postgres.ts b/src/backend/storage/postgres.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/storage/postgres.ts
@@ -0,0 +1,289 @@
+// ---------------------------------------------------------------------------
+// Storage — PostgreSQL Implementation
+// ---------------------------------------------------------------------------
+// Production-grade storage using node-postgres (pg). Tables are auto-created
+// on init(). Uses parameterized queries exclusively (SQL injection safe).
+// ---------------------------------------------------------------------------
+
+import pg from 'pg';
+import type {
+  CaseRecord,
+  IncidentSummary,
+  RemediationProposal,
+  AuditEvent,
+  BpDetection,
+  DetectionCorrelation,
+  CloseoutRecord,
+  AlertSnapshot,
+} from '../types.js';
+import type { CaseRepository } from './repository.js';
+import { toCaseRecord } from './repository.js';
+
+const { Pool } = pg;
+
+export class PostgresCaseRepository implements CaseRepository {
+  private pool: pg.Pool;
+
+  constructor(connectionString?: string) {
+    this.pool = new Pool({
+      connectionString: connectionString || process.env.DATABASE_URL,
+      max: 20,
+      idleTimeoutMillis: 30_000,
+    });
+  }
+
+  async init(): Promise<void> {
+    await this.pool.query(`
+      CREATE TABLE IF NOT EXISTS cases (
+        tenant_alias TEXT NOT NULL,
+        incident_id TEXT NOT NULL,
+        data JSONB NOT NULL,
+        last_synced_at TIMESTAMPTZ DEFAULT NOW(),
+        PRIMARY KEY (tenant_alias, incident_id)
+      );
+
+      CREATE TABLE IF NOT EXISTS proposals (
+        proposal_id TEXT PRIMARY KEY,
+        tenant_alias TEXT NOT NULL,
+        incident_id TEXT NOT NULL,
+        data JSONB NOT NULL,
+        created_at TIMESTAMPTZ DEFAULT NOW()
+      );
+
+      CREATE TABLE IF NOT EXISTS audit_events (
+        id TEXT PRIMARY KEY,
+        tenant_alias TEXT NOT NULL,
+        incident_id TEXT NOT NULL,
+        data JSONB NOT NULL,
+        created_at TIMESTAMPTZ DEFAULT NOW()
+      );
+
+      CREATE TABLE IF NOT EXISTS bp_detections (
+        tenant_alias TEXT NOT NULL,
+        detection_id TEXT NOT NULL,
+        data JSONB NOT NULL,
+        PRIMARY KEY (tenant_alias, detection_id)
+      );
+
+      CREATE TABLE IF NOT EXISTS correlations (
+        id TEXT PRIMARY KEY,
+        tenant_alias TEXT NOT NULL,
+        bp_detection_id TEXT NOT NULL,
+        xdr_incident_id TEXT NOT NULL,
+        data JSONB NOT NULL,
+        created_at TIMESTAMPTZ DEFAULT NOW()
+      );
+
+      CREATE TABLE IF NOT EXISTS closeouts (
+        id TEXT PRIMARY KEY,
+        tenant_alias TEXT NOT NULL,
+        data JSONB NOT NULL,
+        closed_at TIMESTAMPTZ DEFAULT NOW()
+      );
+
+      CREATE TABLE IF NOT EXISTS alert_snapshots (
+        id TEXT PRIMARY KEY,
+        tenant_alias TEXT NOT NULL,
+        source TEXT NOT NULL,
+        data JSONB NOT NULL,
+        snapshot_at TIMESTAMPTZ DEFAULT NOW()
+      );
+
+      CREATE INDEX IF NOT EXISTS idx_proposals_tenant ON proposals(tenant_alias, incident_id);
+      CREATE INDEX IF NOT EXISTS idx_audit_tenant ON audit_events(tenant_alias, incident_id);
+      CREATE INDEX IF NOT EXISTS idx_correlations_detection ON correlations(bp_detection_id);
+      CREATE INDEX IF NOT EXISTS idx_correlations_incident ON correlations(xdr_incident_id);
+      CREATE INDEX IF NOT EXISTS idx_snapshots_tenant ON alert_snapshots(tenant_alias);
+    `);
+  }
+
+  // -- XDR Incidents --------------------------------------------------------
+
+  async upsertCaseFromIncident(incident: IncidentSummary): Promise<CaseRecord> {
+    const record = toCaseRecord(incident);
+    await this.pool.query(
+      `INSERT INTO cases (tenant_alias, incident_id, data, last_synced_at)
+       VALUES ($1, $2, $3, NOW())
+       ON CONFLICT (tenant_alias, incident_id)
+       DO UPDATE SET data = $3, last_synced_at = NOW()`,
+      [record.tenantAlias, record.id, JSON.stringify(record)],
+    );
+    return record;
+  }
+
+  async listCases(tenantAlias: string, limit = 100): Promise<CaseRecord[]> {
+    const { rows } = await this.pool.query(
+      `SELECT data FROM cases WHERE tenant_alias = $1 ORDER BY last_synced_at DESC LIMIT $2`,
+      [tenantAlias, limit],
+    );
+    return rows.map((r) => r.data as CaseRecord);
+  }
+
+  async getCase(tenantAlias: string, incidentId: string): Promise<CaseRecord | null> {
+    const { rows } = await this.pool.query(
+      `SELECT data FROM cases WHERE tenant_alias = $1 AND incident_id = $2`,
+      [tenantAlias, incidentId],
+    );
+    return rows.length > 0 ? (rows[0].data as CaseRecord) : null;
+  }
+
+  // -- Remediation Proposals ------------------------------------------------
+
+  async saveProposal(proposal: RemediationProposal): Promise<void> {
+    await this.pool.query(
+      `INSERT INTO proposals (proposal_id, tenant_alias, incident_id, data, created_at)
+       VALUES ($1, $2, $3, $4, $5)
+       ON CONFLICT (proposal_id)
+       DO UPDATE SET data = $4`,
+      [proposal.proposalId, proposal.tenantAlias, proposal.incidentId, JSON.stringify(proposal), proposal.createdAt],
+    );
+  }
+
+  async getProposal(proposalId: string): Promise<RemediationProposal | null> {
+    const { rows } = await this.pool.query(
+      `SELECT data FROM proposals WHERE proposal_id = $1`,
+      [proposalId],
+    );
+    return rows.length > 0 ? (rows[0].data as RemediationProposal) : null;
+  }
+
+  async listProposals(tenantAlias: string, incidentId?: string): Promise<RemediationProposal[]> {
+    if (incidentId) {
+      const { rows } = await this.pool.query(
+        `SELECT data FROM proposals WHERE tenant_alias = $1 AND incident_id = $2 ORDER BY created_at DESC`,
+        [tenantAlias, incidentId],
+      );
+      return rows.map((r) => r.data as RemediationProposal);
+    }
+    const { rows } = await this.pool.query(
+      `SELECT data FROM proposals WHERE tenant_alias = $1 ORDER BY created_at DESC`,
+      [tenantAlias],
+    );
+    return rows.map((r) => r.data as RemediationProposal);
+  }
+
+  // -- Audit Events ---------------------------------------------------------
+
+  async addAuditEvent(event: AuditEvent): Promise<void> {
+    await this.pool.query(
+      `INSERT INTO audit_events (id, tenant_alias, incident_id, data, created_at)
+       VALUES ($1, $2, $3, $4, $5)`,
+      [event.id, event.tenantAlias, event.incidentId, JSON.stringify(event), event.createdAt],
+    );
+  }
+
+  async listAuditEvents(tenantAlias: string, incidentId?: string): Promise<AuditEvent[]> {
+    if (incidentId) {
+      const { rows } = await this.pool.query(
+        `SELECT data FROM audit_events WHERE tenant_alias = $1 AND incident_id = $2 ORDER BY created_at DESC`,
+        [tenantAlias, incidentId],
+      );
+      return rows.map((r) => r.data as AuditEvent);
+    }
+    const { rows } = await this.pool.query(
+      `SELECT data FROM audit_events WHERE tenant_alias = $1 ORDER BY created_at DESC LIMIT 500`,
+      [tenantAlias],
+    );
+    return rows.map((r) => r.data as AuditEvent);
+  }
+
+  // -- Blackpoint Detections ------------------------------------------------
+
+  async upsertDetection(detection: BpDetection): Promise<void> {
+    await this.pool.query(
+      `INSERT INTO bp_detections (tenant_alias, detection_id, data)
+       VALUES ($1, $2, $3)
+       ON CONFLICT (tenant_alias, detection_id)
+       DO UPDATE SET data = $3`,
+      [detection.tenantAlias, detection.id, JSON.stringify(detection)],
+    );
+  }
+
+  async listDetections(tenantAlias: string, limit = 100): Promise<BpDetection[]> {
+    const { rows } = await this.pool.query(
+      `SELECT data FROM bp_detections WHERE tenant_alias = $1 LIMIT $2`,
+      [tenantAlias, limit],
+    );
+    return rows.map((r) => r.data as BpDetection);
+  }
+
+  async getDetection(tenantAlias: string, detectionId: string): Promise<BpDetection | null> {
+    const { rows } = await this.pool.query(
+      `SELECT data FROM bp_detections WHERE tenant_alias = $1 AND detection_id = $2`,
+      [tenantAlias, detectionId],
+    );
+    return rows.length > 0 ? (rows[0].data as BpDetection) : null;
+  }
+
+  // -- Cross-Source Correlation ---------------------------------------------
+
+  async saveCorrelation(correlation: DetectionCorrelation): Promise<void> {
+    await this.pool.query(
+      `INSERT INTO correlations (id, tenant_alias, bp_detection_id, xdr_incident_id, data, created_at)
+       VALUES ($1, $2, $3, $4, $5, $6)
+       ON CONFLICT (id) DO UPDATE SET data = $5`,
+      [correlation.id, correlation.tenantAlias, correlation.bpDetectionId, correlation.xdrIncidentId, JSON.stringify(correlation), correlation.createdAt],
+    );
+  }
+
+  async listCorrelations(tenantAlias: string): Promise<DetectionCorrelation[]> {
+    const { rows } = await this.pool.query(
+      `SELECT data FROM correlations WHERE tenant_alias = $1 ORDER BY created_at DESC`,
+      [tenantAlias],
+    );
+    return rows.map((r) => r.data as DetectionCorrelation);
+  }
+
+  async getCorrelationsByDetection(detectionId: string): Promise<DetectionCorrelation[]> {
+    const { rows } = await this.pool.query(
+      `SELECT data FROM correlations WHERE bp_detection_id = $1`,
+      [detectionId],
+    );
+    return rows.map((r) => r.data as DetectionCorrelation);
+  }
+
+  async getCorrelationsByIncident(incidentId: string): Promise<DetectionCorrelation[]> {
+    const { rows } = await this.pool.query(
+      `SELECT data FROM correlations WHERE xdr_incident_id = $1`,
+      [incidentId],
+    );
+    return rows.map((r) => r.data as DetectionCorrelation);
+  }
+
+  // -- Closeout Governance --------------------------------------------------
+
+  async saveCloseout(record: CloseoutRecord): Promise<void> {
+    await this.pool.query(
+      `INSERT INTO closeouts (id, tenant_alias, data, closed_at)
+       VALUES ($1, $2, $3, $4)`,
+      [record.id, record.tenantAlias, JSON.stringify(record), record.closedAt],
+    );
+  }
+
+  async listCloseouts(tenantAlias: string, limit = 100): Promise<CloseoutRecord[]> {
+    const { rows } = await this.pool.query(
+      `SELECT data FROM closeouts WHERE tenant_alias = $1 ORDER BY closed_at DESC LIMIT $2`,
+      [tenantAlias, limit],
+    );
+    return rows.map((r) => r.data as CloseoutRecord);
+  }
+
+  // -- Alert Snapshots ------------------------------------------------------
+
+  async saveAlertSnapshot(snapshot: AlertSnapshot): Promise<void> {
+    await this.pool.query(
+      `INSERT INTO alert_snapshots (id, tenant_alias, source, data, snapshot_at)
+       VALUES ($1, $2, $3, $4, $5)`,
+      [snapshot.id, snapshot.tenantAlias, snapshot.source, JSON.stringify(snapshot), snapshot.snapshotAt],
+    );
+  }
+
+  async listAlertSnapshots(tenantAlias: string, limit = 100): Promise<AlertSnapshot[]> {
+    const { rows } = await this.pool.query(
+      `SELECT data FROM alert_snapshots WHERE tenant_alias = $1 ORDER BY snapshot_at DESC LIMIT $2`,
+      [tenantAlias, limit],
+    );
+    return rows.map((r) => r.data as AlertSnapshot);
+  }
+}
diff --git a/src/backend/storage/cosmos.ts b/src/backend/storage/cosmos.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/storage/cosmos.ts
@@ -0,0 +1,265 @@
+// ---------------------------------------------------------------------------
+// Storage — Azure Cosmos DB Implementation
+// ---------------------------------------------------------------------------
+// Uses @azure/cosmos SDK with a single database and per-entity containers.
+// Partition key is /tenantAlias for all containers (optimal for tenant-scoped
+// queries). Falls back to DATABASE_URL connection string or explicit env vars.
+// ---------------------------------------------------------------------------
+
+import { CosmosClient, Container, Database } from '@azure/cosmos';
+import type {
+  CaseRecord,
+  IncidentSummary,
+  RemediationProposal,
+  AuditEvent,
+  BpDetection,
+  DetectionCorrelation,
+  CloseoutRecord,
+  AlertSnapshot,
+} from '../types.js';
+import type { CaseRepository } from './repository.js';
+import { toCaseRecord } from './repository.js';
+
+const CONTAINERS = [
+  'cases',
+  'proposals',
+  'auditEvents',
+  'bpDetections',
+  'correlations',
+  'closeouts',
+  'alertSnapshots',
+] as const;
+
+export class CosmosCaseRepository implements CaseRepository {
+  private client: CosmosClient;
+  private db!: Database;
+  private containers = new Map<string, Container>();
+
+  constructor(connectionString?: string) {
+    const cs = connectionString || process.env.COSMOS_CONNECTION_STRING;
+    if (!cs) {
+      throw new Error('COSMOS_CONNECTION_STRING environment variable required');
+    }
+    this.client = new CosmosClient(cs);
+  }
+
+  async init(): Promise<void> {
+    const dbName = process.env.COSMOS_DATABASE || 'secops-unified';
+    const { database } = await this.client.databases.createIfNotExists({ id: dbName });
+    this.db = database;
+
+    for (const name of CONTAINERS) {
+      const { container } = await this.db.containers.createIfNotExists({
+        id: name,
+        partitionKey: { paths: ['/tenantAlias'] },
+      });
+      this.containers.set(name, container);
+    }
+  }
+
+  // -- XDR Incidents --------------------------------------------------------
+
+  async upsertCaseFromIncident(incident: IncidentSummary): Promise<CaseRecord> {
+    const record = toCaseRecord(incident);
+    const container = this.container('cases');
+    await container.items.upsert({ ...record, id: record.id });
+    return record;
+  }
+
+  async listCases(tenantAlias: string, limit = 100): Promise<CaseRecord[]> {
+    const container = this.container('cases');
+    const { resources } = await container.items
+      .query({
+        query: 'SELECT * FROM c WHERE c.tenantAlias = @t ORDER BY c.lastSyncedAt DESC OFFSET 0 LIMIT @l',
+        parameters: [
+          { name: '@t', value: tenantAlias },
+          { name: '@l', value: limit },
+        ],
+      })
+      .fetchAll();
+    return resources as CaseRecord[];
+  }
+
+  async getCase(tenantAlias: string, incidentId: string): Promise<CaseRecord | null> {
+    const container = this.container('cases');
+    try {
+      const { resource } = await container.item(incidentId, tenantAlias).read();
+      return (resource as CaseRecord) ?? null;
+    } catch {
+      return null;
+    }
+  }
+
+  // -- Remediation Proposals ------------------------------------------------
+
+  async saveProposal(proposal: RemediationProposal): Promise<void> {
+    const container = this.container('proposals');
+    await container.items.upsert({ ...proposal, id: proposal.proposalId });
+  }
+
+  async getProposal(proposalId: string): Promise<RemediationProposal | null> {
+    const container = this.container('proposals');
+    const { resources } = await container.items
+      .query({
+        query: 'SELECT * FROM c WHERE c.proposalId = @id',
+        parameters: [{ name: '@id', value: proposalId }],
+      })
+      .fetchAll();
+    return resources.length > 0 ? (resources[0] as RemediationProposal) : null;
+  }
+
+  async listProposals(tenantAlias: string, incidentId?: string): Promise<RemediationProposal[]> {
+    const container = this.container('proposals');
+    let query = 'SELECT * FROM c WHERE c.tenantAlias = @t';
+    const params: Array<{ name: string; value: unknown }> = [{ name: '@t', value: tenantAlias }];
+    if (incidentId) {
+      query += ' AND c.incidentId = @i';
+      params.push({ name: '@i', value: incidentId });
+    }
+    query += ' ORDER BY c.createdAt DESC';
+    const { resources } = await container.items.query({ query, parameters: params }).fetchAll();
+    return resources as RemediationProposal[];
+  }
+
+  // -- Audit Events ---------------------------------------------------------
+
+  async addAuditEvent(event: AuditEvent): Promise<void> {
+    const container = this.container('auditEvents');
+    await container.items.create({ ...event });
+  }
+
+  async listAuditEvents(tenantAlias: string, incidentId?: string): Promise<AuditEvent[]> {
+    const container = this.container('auditEvents');
+    let query = 'SELECT * FROM c WHERE c.tenantAlias = @t';
+    const params: Array<{ name: string; value: unknown }> = [{ name: '@t', value: tenantAlias }];
+    if (incidentId) {
+      query += ' AND c.incidentId = @i';
+      params.push({ name: '@i', value: incidentId });
+    }
+    query += ' ORDER BY c.createdAt DESC';
+    const { resources } = await container.items.query({ query, parameters: params }).fetchAll();
+    return resources as AuditEvent[];
+  }
+
+  // -- Blackpoint Detections ------------------------------------------------
+
+  async upsertDetection(detection: BpDetection): Promise<void> {
+    const container = this.container('bpDetections');
+    await container.items.upsert({ ...detection, id: detection.id });
+  }
+
+  async listDetections(tenantAlias: string, limit = 100): Promise<BpDetection[]> {
+    const container = this.container('bpDetections');
+    const { resources } = await container.items
+      .query({
+        query: 'SELECT * FROM c WHERE c.tenantAlias = @t OFFSET 0 LIMIT @l',
+        parameters: [
+          { name: '@t', value: tenantAlias },
+          { name: '@l', value: limit },
+        ],
+      })
+      .fetchAll();
+    return resources as BpDetection[];
+  }
+
+  async getDetection(tenantAlias: string, detectionId: string): Promise<BpDetection | null> {
+    const container = this.container('bpDetections');
+    try {
+      const { resource } = await container.item(detectionId, tenantAlias).read();
+      return (resource as BpDetection) ?? null;
+    } catch {
+      return null;
+    }
+  }
+
+  // -- Cross-Source Correlation ---------------------------------------------
+
+  async saveCorrelation(correlation: DetectionCorrelation): Promise<void> {
+    const container = this.container('correlations');
+    await container.items.upsert({ ...correlation });
+  }
+
+  async listCorrelations(tenantAlias: string): Promise<DetectionCorrelation[]> {
+    const container = this.container('correlations');
+    const { resources } = await container.items
+      .query({
+        query: 'SELECT * FROM c WHERE c.tenantAlias = @t ORDER BY c.createdAt DESC',
+        parameters: [{ name: '@t', value: tenantAlias }],
+      })
+      .fetchAll();
+    return resources as DetectionCorrelation[];
+  }
+
+  async getCorrelationsByDetection(detectionId: string): Promise<DetectionCorrelation[]> {
+    const container = this.container('correlations');
+    const { resources } = await container.items
+      .query({
+        query: 'SELECT * FROM c WHERE c.bpDetectionId = @id',
+        parameters: [{ name: '@id', value: detectionId }],
+      })
+      .fetchAll();
+    return resources as DetectionCorrelation[];
+  }
+
+  async getCorrelationsByIncident(incidentId: string): Promise<DetectionCorrelation[]> {
+    const container = this.container('correlations');
+    const { resources } = await container.items
+      .query({
+        query: 'SELECT * FROM c WHERE c.xdrIncidentId = @id',
+        parameters: [{ name: '@id', value: incidentId }],
+      })
+      .fetchAll();
+    return resources as DetectionCorrelation[];
+  }
+
+  // -- Closeout Governance --------------------------------------------------
+
+  async saveCloseout(record: CloseoutRecord): Promise<void> {
+    const container = this.container('closeouts');
+    await container.items.create({ ...record });
+  }
+
+  async listCloseouts(tenantAlias: string, limit = 100): Promise<CloseoutRecord[]> {
+    const container = this.container('closeouts');
+    const { resources } = await container.items
+      .query({
+        query: 'SELECT * FROM c WHERE c.tenantAlias = @t ORDER BY c.closedAt DESC OFFSET 0 LIMIT @l',
+        parameters: [
+          { name: '@t', value: tenantAlias },
+          { name: '@l', value: limit },
+        ],
+      })
+      .fetchAll();
+    return resources as CloseoutRecord[];
+  }
+
+  // -- Alert Snapshots ------------------------------------------------------
+
+  async saveAlertSnapshot(snapshot: AlertSnapshot): Promise<void> {
+    const container = this.container('alertSnapshots');
+    await container.items.create({ ...snapshot });
+  }
+
+  async listAlertSnapshots(tenantAlias: string, limit = 100): Promise<AlertSnapshot[]> {
+    const container = this.container('alertSnapshots');
+    const { resources } = await container.items
+      .query({
+        query: 'SELECT * FROM c WHERE c.tenantAlias = @t ORDER BY c.snapshotAt DESC OFFSET 0 LIMIT @l',
+        parameters: [
+          { name: '@t', value: tenantAlias },
+          { name: '@l', value: limit },
+        ],
+      })
+      .fetchAll();
+    return resources as AlertSnapshot[];
+  }
+
+  // -- Internal -------------------------------------------------------------
+
+  private container(name: string): Container {
+    const c = this.containers.get(name);
+    if (!c) throw new Error(`Container "${name}" not initialized. Call init() first.`);
+    return c;
+  }
+}
diff --git a/src/backend/storage/factory.ts b/src/backend/storage/factory.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/storage/factory.ts
@@ -0,0 +1,59 @@
+// ---------------------------------------------------------------------------
+// Storage — Repository Factory
+// ---------------------------------------------------------------------------
+// Creates the appropriate CaseRepository implementation based on the
+// STORAGE_BACKEND environment variable. Defaults to 'memory' for local dev.
+//
+// STORAGE_BACKEND values:
+//   'memory'   — InMemoryCaseRepository (default, dev only)
+//   'postgres' — PostgresCaseRepository (requires DATABASE_URL)
+//   'cosmos'   — CosmosCaseRepository (requires COSMOS_CONNECTION_STRING)
+// ---------------------------------------------------------------------------
+
+import type { CaseRepository } from './repository.js';
+import { InMemoryCaseRepository } from './memory.js';
+import { PostgresCaseRepository } from './postgres.js';
+import { CosmosCaseRepository } from './cosmos.js';
+
+export type StorageBackend = 'memory' | 'postgres' | 'cosmos';
+
+let instance: CaseRepository | null = null;
+
+/**
+ * Create and initialize a CaseRepository. Caches the singleton.
+ * Call once at server startup.
+ */
+export async function createRepository(
+  backend?: StorageBackend,
+): Promise<CaseRepository> {
+  if (instance) return instance;
+
+  const resolved = backend || (process.env.STORAGE_BACKEND as StorageBackend) || 'memory';
+
+  switch (resolved) {
+    case 'postgres':
+      instance = new PostgresCaseRepository();
+      break;
+    case 'cosmos':
+      instance = new CosmosCaseRepository();
+      break;
+    case 'memory':
+    default:
+      instance = new InMemoryCaseRepository();
+      break;
+  }
+
+  await instance.init();
+  return instance;
+}
+
+/**
+ * Get the cached repository instance. Throws if createRepository hasn't been called.
+ */
+export function getRepository(): CaseRepository {
+  if (!instance) {
+    throw new Error('Repository not initialized. Call createRepository() at startup.');
+  }
+  return instance;
+}
diff --git a/src/backend/storage/index.ts b/src/backend/storage/index.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/storage/index.ts
@@ -0,0 +1,14 @@
+// ---------------------------------------------------------------------------
+// Storage — Barrel Export
+// ---------------------------------------------------------------------------
+
+export type { CaseRepository } from './repository.js';
+export { toCaseRecord, newAuditEvent } from './repository.js';
+
+export { InMemoryCaseRepository } from './memory.js';
+export { PostgresCaseRepository } from './postgres.js';
+export { CosmosCaseRepository } from './cosmos.js';
+
+export { createRepository, getRepository } from './factory.js';
+export type { StorageBackend } from './factory.js';
diff --git a/src/backend/routes/bp/detections.ts b/src/backend/routes/bp/detections.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/routes/bp/detections.ts
@@ -0,0 +1,69 @@
+// ---------------------------------------------------------------------------
+// Routes — Blackpoint Detections (Alert Groups)
+// ---------------------------------------------------------------------------
+
+import { Router } from 'express';
+import type { Request, Response } from 'express';
+import { CompassOneClient } from '../../services/compassOneClient.js';
+import type { UnifiedTenantConfig } from '../../config/tenants.schema.js';
+
+const router = Router({ mergeParams: true });
+const client = new CompassOneClient();
+
+/**
+ * GET /api/tenants/:alias/bp/detections
+ * List alert groups (detections). Supports ?status=OPEN|RESOLVED&skip=0&take=50
+ */
+router.get('/', async (req: Request, res: Response) => {
+  const tenant = req.tenant as UnifiedTenantConfig;
+  const status = req.query.status
+    ? (Array.isArray(req.query.status) ? req.query.status as string[] : [req.query.status as string])
+    : undefined;
+  const skip = req.query.skip ? Number(req.query.skip) : undefined;
+  const take = req.query.take ? Number(req.query.take) : undefined;
+
+  try {
+    const data = await client.listDetections(tenant, {
+      status: status as Array<'OPEN' | 'RESOLVED'> | undefined,
+      skip,
+      take,
+    });
+    res.json(data);
+  } catch (err) {
+    res.status(502).json({ error: 'Failed to fetch detections from CompassOne', detail: (err as Error).message });
+  }
+});
+
+/**
+ * GET /api/tenants/:alias/bp/detections/:detectionId
+ * Get a single alert group by ID
+ */
+router.get('/:detectionId', async (req: Request, res: Response) => {
+  const tenant = req.tenant as UnifiedTenantConfig;
+  try {
+    const data = await client.getDetection(tenant, req.params.detectionId);
+    res.json(data);
+  } catch (err) {
+    res.status(502).json({ error: 'Failed to fetch detection', detail: (err as Error).message });
+  }
+});
+
+/**
+ * GET /api/tenants/:alias/bp/detections/:detectionId/alerts
+ * List individual alerts within an alert group
+ */
+router.get('/:detectionId/alerts', async (req: Request, res: Response) => {
+  const tenant = req.tenant as UnifiedTenantConfig;
+  const skip = req.query.skip ? Number(req.query.skip) : undefined;
+  const take = req.query.take ? Number(req.query.take) : undefined;
+
+  try {
+    const data = await client.getAlerts(tenant, req.params.detectionId, { skip, take });
+    res.json(data);
+  } catch (err) {
+    res.status(502).json({ error: 'Failed to fetch alerts', detail: (err as Error).message });
+  }
+});
+
+export default router;
diff --git a/src/backend/routes/bp/analytics.ts b/src/backend/routes/bp/analytics.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/routes/bp/analytics.ts
@@ -0,0 +1,77 @@
+// ---------------------------------------------------------------------------
+// Routes — Blackpoint Analytics
+// ---------------------------------------------------------------------------
+
+import { Router } from 'express';
+import type { Request, Response } from 'express';
+import { CompassOneClient } from '../../services/compassOneClient.js';
+import type { UnifiedTenantConfig } from '../../config/tenants.schema.js';
+
+const router = Router({ mergeParams: true });
+const client = new CompassOneClient();
+
+/**
+ * GET /api/tenants/:alias/bp/analytics/count
+ * Detection count. Optional ?status=OPEN|RESOLVED
+ */
+router.get('/count', async (req: Request, res: Response) => {
+  const tenant = req.tenant as UnifiedTenantConfig;
+  const status = req.query.status as 'OPEN' | 'RESOLVED' | undefined;
+
+  try {
+    const count = await client.getDetectionCount(tenant, status);
+    res.json({ count });
+  } catch (err) {
+    res.status(502).json({ error: 'Failed to fetch detection count', detail: (err as Error).message });
+  }
+});
+
+/**
+ * GET /api/tenants/:alias/bp/analytics/weekly-trends
+ * Alert groups aggregated by week
+ */
+router.get('/weekly-trends', async (req: Request, res: Response) => {
+  const tenant = req.tenant as UnifiedTenantConfig;
+
+  try {
+    const data = await client.getWeeklyTrends(tenant);
+    res.json(data);
+  } catch (err) {
+    res.status(502).json({ error: 'Failed to fetch weekly trends', detail: (err as Error).message });
+  }
+});
+
+/**
+ * GET /api/tenants/:alias/bp/analytics/top-entities
+ * Top detections by entity. Optional ?top=10
+ */
+router.get('/top-entities', async (req: Request, res: Response) => {
+  const tenant = req.tenant as UnifiedTenantConfig;
+  const top = req.query.top ? Number(req.query.top) : undefined;
+
+  try {
+    const data = await client.getTopEntities(tenant, { top });
+    res.json(data);
+  } catch (err) {
+    res.status(502).json({ error: 'Failed to fetch top entities', detail: (err as Error).message });
+  }
+});
+
+/**
+ * GET /api/tenants/:alias/bp/analytics/top-threats
+ * Top detections by threat. Optional ?top=10
+ */
+router.get('/top-threats', async (req: Request, res: Response) => {
+  const tenant = req.tenant as UnifiedTenantConfig;
+  const top = req.query.top ? Number(req.query.top) : undefined;
+
+  try {
+    const data = await client.getTopThreats(tenant, { top });
+    res.json(data);
+  } catch (err) {
+    res.status(502).json({ error: 'Failed to fetch top threats', detail: (err as Error).message });
+  }
+});
+
+export default router;
diff --git a/src/backend/routes/bp/reports.ts b/src/backend/routes/bp/reports.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/routes/bp/reports.ts
@@ -0,0 +1,62 @@
+// ---------------------------------------------------------------------------
+// Routes — Blackpoint Reports
+// ---------------------------------------------------------------------------
+
+import { Router } from 'express';
+import type { Request, Response } from 'express';
+import { CompassOneClient } from '../../services/compassOneClient.js';
+import type { UnifiedTenantConfig } from '../../config/tenants.schema.js';
+
+const router = Router({ mergeParams: true });
+const client = new CompassOneClient();
+
+/**
+ * GET /api/tenants/:alias/bp/reports
+ * List report runs. Optional ?reportType=MDR|Executive|Cloud&page=1&pageSize=20
+ */
+router.get('/', async (req: Request, res: Response) => {
+  const tenant = req.tenant as UnifiedTenantConfig;
+  const reportType = req.query.reportType as string | undefined;
+  const page = req.query.page ? Number(req.query.page) : undefined;
+  const pageSize = req.query.pageSize ? Number(req.query.pageSize) : undefined;
+
+  try {
+    const data = await client.listReports(tenant, { reportType, page, pageSize });
+    res.json(data);
+  } catch (err) {
+    res.status(502).json({ error: 'Failed to fetch reports', detail: (err as Error).message });
+  }
+});
+
+/**
+ * GET /api/tenants/:alias/bp/reports/:reportId/pdf
+ * Get a signed PDF download URL for a report
+ */
+router.get('/:reportId/pdf', async (req: Request, res: Response) => {
+  const tenant = req.tenant as UnifiedTenantConfig;
+
+  try {
+    const url = await client.getReportPdfUrl(tenant, req.params.reportId);
+    res.json({ url });
+  } catch (err) {
+    res.status(502).json({ error: 'Failed to fetch report PDF URL', detail: (err as Error).message });
+  }
+});
+
+/**
+ * GET /api/tenants/:alias/bp/reports/:reportId/json
+ * Get report data as JSON
+ */
+router.get('/:reportId/json', async (req: Request, res: Response) => {
+  const tenant = req.tenant as UnifiedTenantConfig;
+
+  try {
+    const data = await client.getReportJson(tenant, req.params.reportId);
+    res.json(data);
+  } catch (err) {
+    res.status(502).json({ error: 'Failed to fetch report JSON', detail: (err as Error).message });
+  }
+});
+
+export default router;
diff --git a/src/backend/routes/bp/assets.ts b/src/backend/routes/bp/assets.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/routes/bp/assets.ts
@@ -0,0 +1,46 @@
+// ---------------------------------------------------------------------------
+// Routes — Blackpoint Assets
+// ---------------------------------------------------------------------------
+
+import { Router } from 'express';
+import type { Request, Response } from 'express';
+import { CompassOneClient } from '../../services/compassOneClient.js';
+import type { UnifiedTenantConfig } from '../../config/tenants.schema.js';
+
+const router = Router({ mergeParams: true });
+const client = new CompassOneClient();
+
+/**
+ * GET /api/tenants/:alias/bp/assets
+ * List assets. Optional ?page=1&pageSize=50
+ */
+router.get('/', async (req: Request, res: Response) => {
+  const tenant = req.tenant as UnifiedTenantConfig;
+  const page = req.query.page ? Number(req.query.page) : undefined;
+  const pageSize = req.query.pageSize ? Number(req.query.pageSize) : undefined;
+
+  try {
+    const data = await client.listAssets(tenant, { page, pageSize });
+    res.json(data);
+  } catch (err) {
+    res.status(502).json({ error: 'Failed to fetch assets', detail: (err as Error).message });
+  }
+});
+
+/**
+ * GET /api/tenants/:alias/bp/assets/count
+ * Get total asset count for the tenant
+ */
+router.get('/count', async (req: Request, res: Response) => {
+  const tenant = req.tenant as UnifiedTenantConfig;
+
+  try {
+    const count = await client.getAssetCount(tenant);
+    res.json({ count });
+  } catch (err) {
+    res.status(502).json({ error: 'Failed to fetch asset count', detail: (err as Error).message });
+  }
+});
+
+export default router;
diff --git a/src/backend/routes/bp/index.ts b/src/backend/routes/bp/index.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/routes/bp/index.ts
@@ -0,0 +1,20 @@
+// ---------------------------------------------------------------------------
+// Routes — Blackpoint Barrel Export
+// ---------------------------------------------------------------------------
+// Mounts all BP sub-routers under /api/tenants/:alias/bp/*
+
+import { Router } from 'express';
+import detectionsRouter from './detections.js';
+import analyticsRouter from './analytics.js';
+import reportsRouter from './reports.js';
+import assetsRouter from './assets.js';
+
+const router = Router({ mergeParams: true });
+
+router.use('/detections', detectionsRouter);
+router.use('/analytics', analyticsRouter);
+router.use('/reports', reportsRouter);
+router.use('/assets', assetsRouter);
+
+export default router;
diff --git a/src/backend/routes/xdr/incidents.ts b/src/backend/routes/xdr/incidents.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/routes/xdr/incidents.ts
@@ -0,0 +1,91 @@
+// ---------------------------------------------------------------------------
+// Routes — Defender XDR Incidents
+// ---------------------------------------------------------------------------
+
+import { Router } from 'express';
+import type { Request, Response } from 'express';
+import { DefenderApiClient } from '../../services/defenderApi.js';
+import { getRepository } from '../../storage/factory.js';
+import type { UnifiedTenantConfig } from '../../config/tenants.schema.js';
+import type { CaseWritebackRequest } from '../../types.js';
+
+const router = Router({ mergeParams: true });
+const defender = new DefenderApiClient();
+
+/**
+ * GET /api/tenants/:alias/xdr/incidents
+ * List incidents from Defender XDR. Optional ?top=50&filter=...
+ */
+router.get('/', async (req: Request, res: Response) => {
+  const tenant = req.tenant as UnifiedTenantConfig;
+  const top = req.query.top ? Number(req.query.top) : undefined;
+  const filter = req.query.filter as string | undefined;
+
+  try {
+    const incidents = await defender.listIncidents(tenant, { top, filter });
+
+    // Sync to local storage
+    const repo = getRepository();
+    for (const incident of incidents) {
+      await repo.upsertCaseFromIncident(incident);
+    }
+
+    res.json(incidents);
+  } catch (err) {
+    res.status(502).json({ error: 'Failed to fetch incidents from Defender XDR', detail: (err as Error).message });
+  }
+});
+
+/**
+ * GET /api/tenants/:alias/xdr/incidents/:incidentId
+ * Get a single incident
+ */
+router.get('/:incidentId', async (req: Request, res: Response) => {
+  const tenant = req.tenant as UnifiedTenantConfig;
+
+  try {
+    const incident = await defender.getIncident(tenant, req.params.incidentId);
+    await getRepository().upsertCaseFromIncident(incident);
+    res.json(incident);
+  } catch (err) {
+    res.status(502).json({ error: 'Failed to fetch incident', detail: (err as Error).message });
+  }
+});
+
+/**
+ * PATCH /api/tenants/:alias/xdr/incidents/:incidentId
+ * Update incident (writeback to Defender)
+ */
+router.patch('/:incidentId', async (req: Request, res: Response) => {
+  const tenant = req.tenant as UnifiedTenantConfig;
+  const update: CaseWritebackRequest = req.body;
+
+  try {
+    await defender.updateIncident(tenant, req.params.incidentId, update);
+    res.json({ success: true, incidentId: req.params.incidentId });
+  } catch (err) {
+    res.status(502).json({ error: 'Failed to update incident', detail: (err as Error).message });
+  }
+});
+
+/**
+ * GET /api/tenants/:alias/xdr/incidents/:incidentId/cases
+ * Get local case record (from storage)
+ */
+router.get('/:incidentId/case', async (req: Request, res: Response) => {
+  const tenant = req.tenant as UnifiedTenantConfig;
+
+  try {
+    const record = await getRepository().getCase(tenant.alias, req.params.incidentId);
+    if (!record) {
+      res.status(404).json({ error: 'Case not found locally' });
+      return;
+    }
+    res.json(record);
+  } catch (err) {
+    res.status(500).json({ error: 'Storage error', detail: (err as Error).message });
+  }
+});
+
+export default router;
diff --git a/src/backend/routes/xdr/evidence.ts b/src/backend/routes/xdr/evidence.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/routes/xdr/evidence.ts
@@ -0,0 +1,29 @@
+// ---------------------------------------------------------------------------
+// Routes — Defender XDR Evidence
+// ---------------------------------------------------------------------------
+
+import { Router } from 'express';
+import type { Request, Response } from 'express';
+import { DefenderApiClient } from '../../services/defenderApi.js';
+import type { UnifiedTenantConfig } from '../../config/tenants.schema.js';
+
+const router = Router({ mergeParams: true });
+const defender = new DefenderApiClient();
+
+/**
+ * GET /api/tenants/:alias/xdr/evidence/:incidentId
+ * Get evidence links (deep-link URLs) for an incident
+ */
+router.get('/:incidentId', async (req: Request, res: Response) => {
+  const tenant = req.tenant as UnifiedTenantConfig;
+
+  try {
+    const links = await defender.getIncidentEvidenceLinks(tenant, req.params.incidentId);
+    res.json(links);
+  } catch (err) {
+    res.status(502).json({ error: 'Failed to fetch evidence links', detail: (err as Error).message });
+  }
+});
+
+export default router;
diff --git a/src/backend/routes/xdr/remediation.ts b/src/backend/routes/xdr/remediation.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/routes/xdr/remediation.ts
@@ -0,0 +1,134 @@
+// ---------------------------------------------------------------------------
+// Routes — Defender XDR Remediation
+// ---------------------------------------------------------------------------
+
+import { Router } from 'express';
+import type { Request, Response } from 'express';
+import { RemediationService } from '../../services/remediationService.js';
+import { McpBridgeExecutor } from '../../services/mcpBridge.js';
+import { LearningPlaybookEngine } from '../../services/learningPlaybook.js';
+import { getRepository } from '../../storage/factory.js';
+import type { UnifiedTenantConfig } from '../../config/tenants.schema.js';
+import type { ApprovalDecision, MitigationRecommendation } from '../../types.js';
+
+const router = Router({ mergeParams: true });
+const executor = new McpBridgeExecutor();
+const playbookEngine = new LearningPlaybookEngine();
+
+// Lazy-init remediation service (needs repo to be ready)
+let remediationService: RemediationService | null = null;
+function getRemediationService(): RemediationService {
+  if (!remediationService) {
+    remediationService = new RemediationService(getRepository(), executor);
+  }
+  return remediationService;
+}
+
+/**
+ * POST /api/tenants/:alias/xdr/remediation/plan
+ * Create a remediation plan for an incident.
+ * Body: { incidentId, recommendations?: MitigationRecommendation[] }
+ */
+router.post('/plan', async (req: Request, res: Response) => {
+  const tenant = req.tenant as UnifiedTenantConfig;
+  const { incidentId, recommendations } = req.body as {
+    incidentId: string;
+    recommendations?: MitigationRecommendation[];
+  };
+
+  if (!incidentId) {
+    res.status(400).json({ error: 'incidentId is required' });
+    return;
+  }
+
+  try {
+    const repo = getRepository();
+    const caseRecord = await repo.getCase(tenant.alias, incidentId);
+    if (!caseRecord) {
+      res.status(404).json({ error: 'Incident case not found. Sync incidents first.' });
+      return;
+    }
+
+    // Use provided recommendations or auto-generate from playbook engine
+    const recs = recommendations ?? playbookEngine.recommend({
+      title: caseRecord.title,
+      severity: caseRecord.severity,
+      workloads: caseRecord.workloads,
+    });
+
+    const actor = (req as unknown as { user?: { name?: string } }).user?.name || 'system';
+    const proposals = await getRemediationService().createPlan(actor, tenant.alias, caseRecord, recs);
+    res.status(201).json(proposals);
+  } catch (err) {
+    res.status(500).json({ error: 'Failed to create remediation plan', detail: (err as Error).message });
+  }
+});
+
+/**
+ * GET /api/tenants/:alias/xdr/remediation/proposals
+ * List proposals. Optional ?incidentId=...
+ */
+router.get('/proposals', async (req: Request, res: Response) => {
+  const tenant = req.tenant as UnifiedTenantConfig;
+  const incidentId = req.query.incidentId as string | undefined;
+
+  try {
+    const proposals = await getRemediationService().listProposals(tenant.alias, incidentId);
+    res.json(proposals);
+  } catch (err) {
+    res.status(500).json({ error: 'Failed to list proposals', detail: (err as Error).message });
+  }
+});
+
+/**
+ * GET /api/tenants/:alias/xdr/remediation/proposals/:proposalId
+ * Get a single proposal
+ */
+router.get('/proposals/:proposalId', async (req: Request, res: Response) => {
+  try {
+    const proposal = await getRemediationService().getProposal(req.params.proposalId);
+    if (!proposal) {
+      res.status(404).json({ error: 'Proposal not found' });
+      return;
+    }
+    res.json(proposal);
+  } catch (err) {
+    res.status(500).json({ error: 'Failed to fetch proposal', detail: (err as Error).message });
+  }
+});
+
+/**
+ * POST /api/tenants/:alias/xdr/remediation/proposals/:proposalId/decide
+ * Approve or reject a proposal.
+ * Body: { approved: boolean, reason?: string }
+ */
+router.post('/proposals/:proposalId/decide', async (req: Request, res: Response) => {
+  const { approved, reason } = req.body as { approved: boolean; reason?: string };
+
+  if (typeof approved !== 'boolean') {
+    res.status(400).json({ error: 'approved (boolean) is required' });
+    return;
+  }
+
+  const actor = (req as unknown as { user?: { name?: string } }).user?.name || 'system';
+  const decision: ApprovalDecision = { approved, actor, reason };
+
+  try {
+    const result = await getRemediationService().applyApprovalDecision(
+      req.params.proposalId,
+      decision,
+    );
+
+    // Feed back to playbook engine
+    playbookEngine.recordFeedback(result.id, approved);
+
+    res.json(result);
+  } catch (err) {
+    const msg = (err as Error).message;
+    const status = msg.includes('not found') ? 404 : msg.includes('not pending') ? 409 : 500;
+    res.status(status).json({ error: msg });
+  }
+});
+
+export default router;
diff --git a/src/backend/routes/xdr/index.ts b/src/backend/routes/xdr/index.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/routes/xdr/index.ts
@@ -0,0 +1,18 @@
+// ---------------------------------------------------------------------------
+// Routes — XDR Barrel Export
+// ---------------------------------------------------------------------------
+// Mounts all XDR sub-routers under /api/tenants/:alias/xdr/*
+
+import { Router } from 'express';
+import incidentsRouter from './incidents.js';
+import evidenceRouter from './evidence.js';
+import remediationRouter from './remediation.js';
+
+const router = Router({ mergeParams: true });
+
+router.use('/incidents', incidentsRouter);
+router.use('/evidence', evidenceRouter);
+router.use('/remediation', remediationRouter);
+
+export default router;
diff --git a/src/backend/routes/unified/alerts.ts b/src/backend/routes/unified/alerts.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/routes/unified/alerts.ts
@@ -0,0 +1,73 @@
+// ---------------------------------------------------------------------------
+// Routes — Unified Alert Snapshots
+// ---------------------------------------------------------------------------
+// Provides a cross-source alert timeline combining Blackpoint and Defender XDR
+// alerts into a single chronological view per tenant.
+// ---------------------------------------------------------------------------
+
+import { Router } from 'express';
+import type { Request, Response } from 'express';
+import { getRepository } from '../../storage/factory.js';
+import type { UnifiedTenantConfig } from '../../config/tenants.schema.js';
+import type { AlertSnapshot } from '../../types.js';
+
+const router = Router({ mergeParams: true });
+
+/**
+ * GET /api/tenants/:alias/unified/alerts
+ * List all alert snapshots (cross-source timeline). ?limit=100&source=blackpoint|defender-xdr
+ */
+router.get('/', async (req: Request, res: Response) => {
+  const tenant = req.tenant as UnifiedTenantConfig;
+  const limit = req.query.limit ? Number(req.query.limit) : 100;
+  const source = req.query.source as 'blackpoint' | 'defender-xdr' | undefined;
+
+  try {
+    let snapshots = await getRepository().listAlertSnapshots(tenant.alias, limit);
+
+    if (source) {
+      snapshots = snapshots.filter((s) => s.source === source);
+    }
+
+    res.json(snapshots);
+  } catch (err) {
+    res.status(500).json({ error: 'Failed to list alert snapshots', detail: (err as Error).message });
+  }
+});
+
+/**
+ * POST /api/tenants/:alias/unified/alerts
+ * Record an alert snapshot manually (e.g. from a webhook or sync job).
+ * Body: AlertSnapshot (minus id and snapshotAt, which are generated)
+ */
+router.post('/', async (req: Request, res: Response) => {
+  const tenant = req.tenant as UnifiedTenantConfig;
+  const { source, sourceId, title, severity, status, createdAt } = req.body;
+
+  if (!source || !sourceId || !title) {
+    res.status(400).json({ error: 'source, sourceId, and title are required' });
+    return;
+  }
+
+  const snapshot: AlertSnapshot = {
+    id: crypto.randomUUID(),
+    tenantAlias: tenant.alias,
+    source,
+    sourceId,
+    title,
+    severity: severity || 'Unknown',
+    status: status || 'Active',
+    createdAt: createdAt || new Date().toISOString(),
+    snapshotAt: new Date().toISOString(),
+  };
+
+  try {
+    await getRepository().saveAlertSnapshot(snapshot);
+    res.status(201).json(snapshot);
+  } catch (err) {
+    res.status(500).json({ error: 'Failed to save alert snapshot', detail: (err as Error).message });
+  }
+});
+
+export default router;
diff --git a/src/backend/routes/unified/triage.ts b/src/backend/routes/unified/triage.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/routes/unified/triage.ts
@@ -0,0 +1,86 @@
+// ---------------------------------------------------------------------------
+// Routes — Triage Engine
+// ---------------------------------------------------------------------------
+// Exposes the Learning Playbook Engine for recommendation scoring and
+// playbook management. Used by SOC analysts for decision support.
+// ---------------------------------------------------------------------------
+
+import { Router } from 'express';
+import type { Request, Response } from 'express';
+import { LearningPlaybookEngine } from '../../services/learningPlaybook.js';
+import type { UnifiedTenantConfig } from '../../config/tenants.schema.js';
+import type { IncidentContext } from '../../services/learningPlaybook.js';
+
+const router = Router({ mergeParams: true });
+const playbookEngine = new LearningPlaybookEngine();
+
+/**
+ * POST /api/tenants/:alias/unified/triage/recommend
+ * Get playbook recommendations for an incident context.
+ * Body: IncidentContext { title, severity, workloads, alertTypes?, entities? }
+ */
+router.post('/recommend', async (req: Request, res: Response) => {
+  const context: IncidentContext = req.body;
+
+  if (!context.title || !context.severity || !context.workloads) {
+    res.status(400).json({ error: 'title, severity, and workloads are required' });
+    return;
+  }
+
+  try {
+    const recommendations = playbookEngine.recommend(context);
+    res.json(recommendations);
+  } catch (err) {
+    res.status(500).json({ error: 'Triage recommendation failed', detail: (err as Error).message });
+  }
+});
+
+/**
+ * GET /api/tenants/:alias/unified/triage/playbooks
+ * Export all playbook entries
+ */
+router.get('/playbooks', async (_req: Request, res: Response) => {
+  try {
+    const playbooks = playbookEngine.exportPlaybooks();
+    res.json(playbooks);
+  } catch (err) {
+    res.status(500).json({ error: 'Failed to export playbooks', detail: (err as Error).message });
+  }
+});
+
+/**
+ * PUT /api/tenants/:alias/unified/triage/playbooks/:playbookId
+ * Create or update a playbook entry
+ */
+router.put('/playbooks/:playbookId', async (req: Request, res: Response) => {
+  try {
+    const entry = { ...req.body, id: req.params.playbookId };
+    playbookEngine.upsertPlaybook(entry);
+    res.json({ success: true, id: req.params.playbookId });
+  } catch (err) {
+    res.status(500).json({ error: 'Failed to upsert playbook', detail: (err as Error).message });
+  }
+});
+
+/**
+ * POST /api/tenants/:alias/unified/triage/playbooks/:playbookId/feedback
+ * Record approval/rejection feedback. Body: { approved: boolean }
+ */
+router.post('/playbooks/:playbookId/feedback', async (req: Request, res: Response) => {
+  const { approved } = req.body as { approved: boolean };
+
+  if (typeof approved !== 'boolean') {
+    res.status(400).json({ error: 'approved (boolean) is required' });
+    return;
+  }
+
+  try {
+    playbookEngine.recordFeedback(req.params.playbookId, approved);
+    res.json({ success: true });
+  } catch (err) {
+    res.status(500).json({ error: 'Failed to record feedback', detail: (err as Error).message });
+  }
+});
+
+export default router;
diff --git a/src/backend/routes/unified/correlations.ts b/src/backend/routes/unified/correlations.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/routes/unified/correlations.ts
@@ -0,0 +1,91 @@
+// ---------------------------------------------------------------------------
+// Routes — Cross-Source Correlation
+// ---------------------------------------------------------------------------
+// Manages correlation records linking Blackpoint detections to Defender XDR
+// incidents. Supports manual analyst-confirmed links and automated entity/
+// temporal/title-based correlations.
+// ---------------------------------------------------------------------------
+
+import { Router } from 'express';
+import type { Request, Response } from 'express';
+import { getRepository } from '../../storage/factory.js';
+import type { UnifiedTenantConfig } from '../../config/tenants.schema.js';
+import type { DetectionCorrelation } from '../../types.js';
+
+const router = Router({ mergeParams: true });
+
+/**
+ * GET /api/tenants/:alias/unified/correlations
+ * List all correlations for this tenant
+ */
+router.get('/', async (req: Request, res: Response) => {
+  const tenant = req.tenant as UnifiedTenantConfig;
+
+  try {
+    const correlations = await getRepository().listCorrelations(tenant.alias);
+    res.json(correlations);
+  } catch (err) {
+    res.status(500).json({ error: 'Failed to list correlations', detail: (err as Error).message });
+  }
+});
+
+/**
+ * POST /api/tenants/:alias/unified/correlations
+ * Create a new correlation link.
+ * Body: { bpDetectionId, xdrIncidentId, correlationType, confidence }
+ */
+router.post('/', async (req: Request, res: Response) => {
+  const tenant = req.tenant as UnifiedTenantConfig;
+  const { bpDetectionId, xdrIncidentId, correlationType, confidence } = req.body;
+
+  if (!bpDetectionId || !xdrIncidentId || !correlationType) {
+    res.status(400).json({ error: 'bpDetectionId, xdrIncidentId, and correlationType are required' });
+    return;
+  }
+
+  const correlation: DetectionCorrelation = {
+    id: crypto.randomUUID(),
+    tenantAlias: tenant.alias,
+    bpDetectionId,
+    xdrIncidentId,
+    correlationType,
+    confidence: confidence ?? 0.5,
+    createdAt: new Date().toISOString(),
+  };
+
+  try {
+    await getRepository().saveCorrelation(correlation);
+    res.status(201).json(correlation);
+  } catch (err) {
+    res.status(500).json({ error: 'Failed to save correlation', detail: (err as Error).message });
+  }
+});
+
+/**
+ * GET /api/tenants/:alias/unified/correlations/by-detection/:detectionId
+ * Get correlations linked to a specific BP detection
+ */
+router.get('/by-detection/:detectionId', async (req: Request, res: Response) => {
+  try {
+    const correlations = await getRepository().getCorrelationsByDetection(req.params.detectionId);
+    res.json(correlations);
+  } catch (err) {
+    res.status(500).json({ error: 'Failed to fetch correlations', detail: (err as Error).message });
+  }
+});
+
+/**
+ * GET /api/tenants/:alias/unified/correlations/by-incident/:incidentId
+ * Get correlations linked to a specific XDR incident
+ */
+router.get('/by-incident/:incidentId', async (req: Request, res: Response) => {
+  try {
+    const correlations = await getRepository().getCorrelationsByIncident(req.params.incidentId);
+    res.json(correlations);
+  } catch (err) {
+    res.status(500).json({ error: 'Failed to fetch correlations', detail: (err as Error).message });
+  }
+});
+
+export default router;
diff --git a/src/backend/routes/unified/closeouts.ts b/src/backend/routes/unified/closeouts.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/routes/unified/closeouts.ts
@@ -0,0 +1,85 @@
+// ---------------------------------------------------------------------------
+// Routes — Closeout Governance
+// ---------------------------------------------------------------------------
+// Records and queries case closeout decisions. Links to either a BP detection
+// or an XDR incident (or both via correlation). Provides governance trail
+// for when cases are formally closed.
+// ---------------------------------------------------------------------------
+
+import { Router } from 'express';
+import type { Request, Response } from 'express';
+import { getRepository } from '../../storage/factory.js';
+import { newAuditEvent } from '../../storage/repository.js';
+import type { UnifiedTenantConfig } from '../../config/tenants.schema.js';
+import type { CloseoutRecord } from '../../types.js';
+
+const router = Router({ mergeParams: true });
+
+/**
+ * GET /api/tenants/:alias/unified/closeouts
+ * List closeout records. ?limit=50
+ */
+router.get('/', async (req: Request, res: Response) => {
+  const tenant = req.tenant as UnifiedTenantConfig;
+  const limit = req.query.limit ? Number(req.query.limit) : 50;
+
+  try {
+    const closeouts = await getRepository().listCloseouts(tenant.alias, limit);
+    res.json(closeouts);
+  } catch (err) {
+    res.status(500).json({ error: 'Failed to list closeouts', detail: (err as Error).message });
+  }
+});
+
+/**
+ * POST /api/tenants/:alias/unified/closeouts
+ * Create a closeout record.
+ * Body: { bpDetectionId?, xdrIncidentId?, resolution, notes?, closedBy }
+ */
+router.post('/', async (req: Request, res: Response) => {
+  const tenant = req.tenant as UnifiedTenantConfig;
+  const { bpDetectionId, xdrIncidentId, resolution, notes, closedBy } = req.body;
+
+  if (!resolution || !closedBy) {
+    res.status(400).json({ error: 'resolution and closedBy are required' });
+    return;
+  }
+
+  if (!bpDetectionId && !xdrIncidentId) {
+    res.status(400).json({ error: 'At least one of bpDetectionId or xdrIncidentId is required' });
+    return;
+  }
+
+  const closeout: CloseoutRecord = {
+    id: crypto.randomUUID(),
+    tenantAlias: tenant.alias,
+    bpDetectionId,
+    xdrIncidentId,
+    closedBy,
+    closedAt: new Date().toISOString(),
+    resolution,
+    notes,
+  };
+
+  try {
+    const repo = getRepository();
+    await repo.saveCloseout(closeout);
+
+    // Emit audit event
+    const auditEvent = newAuditEvent({
+      tenantAlias: tenant.alias,
+      incidentId: xdrIncidentId || bpDetectionId,
+      actor: closedBy,
+      action: 'closeout',
+      details: { resolution, bpDetectionId, xdrIncidentId, notes },
+    });
+    await repo.addAuditEvent(auditEvent);
+
+    res.status(201).json(closeout);
+  } catch (err) {
+    res.status(500).json({ error: 'Failed to save closeout', detail: (err as Error).message });
+  }
+});
+
+export default router;
diff --git a/src/backend/routes/unified/audit.ts b/src/backend/routes/unified/audit.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/routes/unified/audit.ts
@@ -0,0 +1,71 @@
+// ---------------------------------------------------------------------------
+// Routes — Audit Review
+// ---------------------------------------------------------------------------
+// Provides read access to the audit trail for SOC governance and compliance.
+// Supports filtering by incident, proposal, actor, and time range.
+// ---------------------------------------------------------------------------
+
+import { Router } from 'express';
+import type { Request, Response } from 'express';
+import { getRepository } from '../../storage/factory.js';
+import type { UnifiedTenantConfig } from '../../config/tenants.schema.js';
+
+const router = Router({ mergeParams: true });
+
+/**
+ * GET /api/tenants/:alias/unified/audit
+ * List audit events. ?incidentId=...&actor=...&limit=100
+ */
+router.get('/', async (req: Request, res: Response) => {
+  const tenant = req.tenant as UnifiedTenantConfig;
+  const incidentId = req.query.incidentId as string | undefined;
+  const actor = req.query.actor as string | undefined;
+  const limit = req.query.limit ? Number(req.query.limit) : 100;
+
+  try {
+    let events = await getRepository().listAuditEvents(tenant.alias, incidentId);
+
+    if (actor) {
+      events = events.filter((e) => e.actor === actor);
+    }
+
+    res.json(events.slice(0, limit));
+  } catch (err) {
+    res.status(500).json({ error: 'Failed to list audit events', detail: (err as Error).message });
+  }
+});
+
+/**
+ * GET /api/tenants/:alias/unified/audit/cases
+ * List local case records (synced incidents). ?limit=50
+ */
+router.get('/cases', async (req: Request, res: Response) => {
+  const tenant = req.tenant as UnifiedTenantConfig;
+  const limit = req.query.limit ? Number(req.query.limit) : 50;
+
+  try {
+    const cases = await getRepository().listCases(tenant.alias, limit);
+    res.json(cases);
+  } catch (err) {
+    res.status(500).json({ error: 'Failed to list cases', detail: (err as Error).message });
+  }
+});
+
+/**
+ * GET /api/tenants/:alias/unified/audit/detections
+ * List locally-stored BP detections. ?limit=50
+ */
+router.get('/detections', async (req: Request, res: Response) => {
+  const tenant = req.tenant as UnifiedTenantConfig;
+  const limit = req.query.limit ? Number(req.query.limit) : 50;
+
+  try {
+    const detections = await getRepository().listDetections(tenant.alias, limit);
+    res.json(detections);
+  } catch (err) {
+    res.status(500).json({ error: 'Failed to list detections', detail: (err as Error).message });
+  }
+});
+
+export default router;
diff --git a/src/backend/routes/unified/index.ts b/src/backend/routes/unified/index.ts
new file mode 100644
--- /dev/null
+++ b/src/backend/routes/unified/index.ts
@@ -0,0 +1,23 @@
+// ---------------------------------------------------------------------------
+// Routes — Unified Barrel Export
+// ---------------------------------------------------------------------------
+// Mounts all unified correlation sub-routers under
+// /api/tenants/:alias/unified/*
+
+import { Router } from 'express';
+import alertsRouter from './alerts.js';
+import triageRouter from './triage.js';
+import correlationsRouter from './correlations.js';
+import closeoutsRouter from './closeouts.js';
+import auditRouter from './audit.js';
+
+const router = Router({ mergeParams: true });
+
+router.use('/alerts', alertsRouter);
+router.use('/triage', triageRouter);
+router.use('/correlations', correlationsRouter);
+router.use('/closeouts', closeoutsRouter);
+router.use('/audit', auditRouter);
+
+export default router;
diff --git a/src/services/unifiedApi.ts b/src/services/unifiedApi.ts
new file mode 100644
--- /dev/null
+++ b/src/services/unifiedApi.ts
@@ -0,0 +1,204 @@
+// ---------------------------------------------------------------------------
+// API Client — Unified Backend Hooks
+// ---------------------------------------------------------------------------
+// Central fetch utilities for the unified backend API. All calls target
+// /api/tenants/:alias/* and handle auth headers from MSAL.
+// ---------------------------------------------------------------------------
+
+const BASE = '/api/tenants';
+
+async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
+  const res = await fetch(path, {
+    headers: {
+      'Content-Type': 'application/json',
+      ...options?.headers,
+    },
+    ...options,
+  });
+
+  if (!res.ok) {
+    const body = await res.json().catch(() => ({ error: res.statusText }));
+    throw new Error(body.error || `HTTP ${res.status}`);
+  }
+
+  return res.json();
+}
+
+// ---------------------------------------------------------------------------
+// Blackpoint (BP) API
+// ---------------------------------------------------------------------------
+
+export function bpDetections(alias: string, params?: Record<string, string>) {
+  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
+  return apiFetch<unknown[]>(`${BASE}/${alias}/bp/detections${qs}`);
+}
+
+export function bpAnalyticsCount(alias: string, status?: string) {
+  const qs = status ? `?status=${status}` : '';
+  return apiFetch<{ count: number }>(`${BASE}/${alias}/bp/analytics/count${qs}`);
+}
+
+export function bpWeeklyTrends(alias: string) {
+  return apiFetch<unknown[]>(`${BASE}/${alias}/bp/analytics/weekly-trends`);
+}
+
+export function bpTopEntities(alias: string, top = 10) {
+  return apiFetch<unknown[]>(`${BASE}/${alias}/bp/analytics/top-entities?top=${top}`);
+}
+
+export function bpTopThreats(alias: string, top = 10) {
+  return apiFetch<unknown[]>(`${BASE}/${alias}/bp/analytics/top-threats?top=${top}`);
+}
+
+export function bpReports(alias: string) {
+  return apiFetch<unknown[]>(`${BASE}/${alias}/bp/reports`);
+}
+
+export function bpAssets(alias: string) {
+  return apiFetch<unknown[]>(`${BASE}/${alias}/bp/assets`);
+}
+
+// ---------------------------------------------------------------------------
+// Defender XDR API
+// ---------------------------------------------------------------------------
+
+export interface IncidentSummary {
+  id: string;
+  tenantAlias: string;
+  title: string;
+  severity: string;
+  status: string;
+  assignedTo?: string;
+  createdTime: string;
+  lastUpdateTime: string;
+  alertsCount: number;
+  workloads: string[];
+}
+
+export function xdrIncidents(alias: string, top = 50) {
+  return apiFetch<IncidentSummary[]>(`${BASE}/${alias}/xdr/incidents?top=${top}`);
+}
+
+export function xdrIncident(alias: string, incidentId: string) {
+  return apiFetch<IncidentSummary>(`${BASE}/${alias}/xdr/incidents/${incidentId}`);
+}
+
+export function xdrEvidence(alias: string, incidentId: string) {
+  return apiFetch<{ label: string; url: string; source: string }[]>(
+    `${BASE}/${alias}/xdr/evidence/${incidentId}`,
+  );
+}
+
+export function xdrCreatePlan(alias: string, incidentId: string) {
+  return apiFetch<unknown[]>(`${BASE}/${alias}/xdr/remediation/plan`, {
+    method: 'POST',
+    body: JSON.stringify({ incidentId }),
+  });
+}
+
+export function xdrProposals(alias: string, incidentId?: string) {
+  const qs = incidentId ? `?incidentId=${incidentId}` : '';
+  return apiFetch<unknown[]>(`${BASE}/${alias}/xdr/remediation/proposals${qs}`);
+}
+
+export function xdrDecideProposal(alias: string, proposalId: string, approved: boolean, reason?: string) {
+  return apiFetch<unknown>(`${BASE}/${alias}/xdr/remediation/proposals/${proposalId}/decide`, {
+    method: 'POST',
+    body: JSON.stringify({ approved, reason }),
+  });
+}
+
+// ---------------------------------------------------------------------------
+// Unified (Correlation, Triage, Closeout, Audit)
+// ---------------------------------------------------------------------------
+
+export interface AlertSnapshot {
+  id: string;
+  tenantAlias: string;
+  source: 'blackpoint' | 'defender-xdr';
+  sourceId: string;
+  title: string;
+  severity: string;
+  status: string;
+  createdAt: string;
+  snapshotAt: string;
+}
+
+export interface DetectionCorrelation {
+  id: string;
+  tenantAlias: string;
+  bpDetectionId: string;
+  xdrIncidentId: string;
+  correlationType: string;
+  confidence: number;
+  createdAt: string;
+}
+
+export interface CloseoutRecord {
+  id: string;
+  tenantAlias: string;
+  bpDetectionId?: string;
+  xdrIncidentId?: string;
+  closedBy: string;
+  closedAt: string;
+  resolution: string;
+  notes?: string;
+}
+
+export interface AuditEvent {
+  id: string;
+  tenantAlias: string;
+  incidentId: string;
+  actor: string;
+  action: string;
+  details: Record<string, unknown>;
+  createdAt: string;
+}
+
+export function unifiedAlerts(alias: string, limit = 100) {
+  return apiFetch<AlertSnapshot[]>(`${BASE}/${alias}/unified/alerts?limit=${limit}`);
+}
+
+export function unifiedCorrelations(alias: string) {
+  return apiFetch<DetectionCorrelation[]>(`${BASE}/${alias}/unified/correlations`);
+}
+
+export function createCorrelation(
+  alias: string,
+  bpDetectionId: string,
+  xdrIncidentId: string,
+  correlationType: string,
+  confidence: number,
+) {
+  return apiFetch<DetectionCorrelation>(`${BASE}/${alias}/unified/correlations`, {
+    method: 'POST',
+    body: JSON.stringify({ bpDetectionId, xdrIncidentId, correlationType, confidence }),
+  });
+}
+
+export function unifiedCloseouts(alias: string, limit = 50) {
+  return apiFetch<CloseoutRecord[]>(`${BASE}/${alias}/unified/closeouts?limit=${limit}`);
+}
+
+export function createCloseout(
+  alias: string,
+  data: { bpDetectionId?: string; xdrIncidentId?: string; resolution: string; notes?: string; closedBy: string },
+) {
+  return apiFetch<CloseoutRecord>(`${BASE}/${alias}/unified/closeouts`, {
+    method: 'POST',
+    body: JSON.stringify(data),
+  });
+}
+
+export function unifiedAudit(alias: string, incidentId?: string) {
+  const qs = incidentId ? `?incidentId=${incidentId}` : '';
+  return apiFetch<AuditEvent[]>(`${BASE}/${alias}/unified/audit${qs}`);
+}
+
+export function triageRecommend(alias: string, context: { title: string; severity: string; workloads: string[] }) {
+  return apiFetch<unknown[]>(`${BASE}/${alias}/unified/triage/recommend`, {
+    method: 'POST',
+    body: JSON.stringify(context),
+  });
+}
diff --git a/src/components/UnifiedCommandDashboard.tsx b/src/components/UnifiedCommandDashboard.tsx
new file mode 100644
--- /dev/null
+++ b/src/components/UnifiedCommandDashboard.tsx
@@ -0,0 +1,159 @@
+// ---------------------------------------------------------------------------
+// Unified Command Dashboard — Main View
+// ---------------------------------------------------------------------------
+// Combines Blackpoint detection metrics and Defender XDR incident status into
+// a single SOC overview pane. Acts as the landing page for the unified app.
+// ---------------------------------------------------------------------------
+
+import React, { useEffect, useState } from 'react';
+import {
+  bpAnalyticsCount,
+  xdrIncidents,
+  unifiedAlerts,
+  unifiedCorrelations,
+  type IncidentSummary,
+  type AlertSnapshot,
+  type DetectionCorrelation,
+} from '../services/unifiedApi';
+import './UnifiedCommandDashboard.css';
+
+interface Props {
+  tenantAlias: string;
+}
+
+interface BpCounts {
+  open: number;
+  resolved: number;
+}
+
+const UnifiedCommandDashboard: React.FC<Props> = ({ tenantAlias }) => {
+  const [bpCounts, setBpCounts] = useState<BpCounts>({ open: 0, resolved: 0 });
+  const [incidents, setIncidents] = useState<IncidentSummary[]>([]);
+  const [alerts, setAlerts] = useState<AlertSnapshot[]>([]);
+  const [correlations, setCorrelations] = useState<DetectionCorrelation[]>([]);
+  const [loading, setLoading] = useState(true);
+  const [error, setError] = useState<string | null>(null);
+
+  useEffect(() => {
+    if (!tenantAlias) return;
+    setLoading(true);
+    setError(null);
+
+    Promise.all([
+      bpAnalyticsCount(tenantAlias, 'OPEN'),
+      bpAnalyticsCount(tenantAlias, 'RESOLVED'),
+      xdrIncidents(tenantAlias, 20),
+      unifiedAlerts(tenantAlias, 50),
+      unifiedCorrelations(tenantAlias),
+    ])
+      .then(([openRes, resolvedRes, inc, al, cor]) => {
+        setBpCounts({ open: openRes.count, resolved: resolvedRes.count });
+        setIncidents(inc);
+        setAlerts(al);
+        setCorrelations(cor);
+      })
+      .catch((err) => setError(err.message))
+      .finally(() => setLoading(false));
+  }, [tenantAlias]);
+
+  if (loading) return <div className="ucd-loading">Loading unified dashboard…</div>;
+  if (error) return <div className="ucd-error">Error: {error}</div>;
+
+  const activeXdr = incidents.filter((i) => i.status === 'Active' || i.status === 'InProgress');
+  const criticalXdr = incidents.filter((i) => i.severity === 'High' || i.severity === 'Critical');
+
+  return (
+    <div className="unified-command-dashboard">
+      <h2>Unified SOC Command — {tenantAlias}</h2>
+
+      {/* KPI Cards */}
+      <div className="ucd-kpi-row">
+        <div className="ucd-kpi-card bp-open">
+          <span className="ucd-kpi-value">{bpCounts.open}</span>
+          <span className="ucd-kpi-label">BP Open Detections</span>
+        </div>
+        <div className="ucd-kpi-card bp-resolved">
+          <span className="ucd-kpi-value">{bpCounts.resolved}</span>
+          <span className="ucd-kpi-label">BP Resolved</span>
+        </div>
+        <div className="ucd-kpi-card xdr-active">
+          <span className="ucd-kpi-value">{activeXdr.length}</span>
+          <span className="ucd-kpi-label">XDR Active Incidents</span>
+        </div>
+        <div className="ucd-kpi-card xdr-critical">
+          <span className="ucd-kpi-value">{criticalXdr.length}</span>
+          <span className="ucd-kpi-label">High/Critical XDR</span>
+        </div>
+        <div className="ucd-kpi-card correlations">
+          <span className="ucd-kpi-value">{correlations.length}</span>
+          <span className="ucd-kpi-label">Correlations</span>
+        </div>
+      </div>
+
+      {/* Recent Unified Alert Timeline */}
+      <section className="ucd-section">
+        <h3>Recent Alert Timeline (Cross-Source)</h3>
+        {alerts.length === 0 ? (
+          <p className="ucd-empty">No alert snapshots recorded yet.</p>
+        ) : (
+          <table className="ucd-table">
+            <thead>
+              <tr>
+                <th>Time</th>
+                <th>Source</th>
+                <th>Title</th>
+                <th>Severity</th>
+                <th>Status</th>
+              </tr>
+            </thead>
+            <tbody>
+              {alerts.slice(0, 20).map((a) => (
+                <tr key={a.id}>
+                  <td>{new Date(a.createdAt).toLocaleString()}</td>
+                  <td className={`ucd-source ucd-source-${a.source}`}>{a.source}</td>
+                  <td>{a.title}</td>
+                  <td>{a.severity}</td>
+                  <td>{a.status}</td>
+                </tr>
+              ))}
+            </tbody>
+          </table>
+        )}
+      </section>
+
+      {/* XDR Incidents Table */}
+      <section className="ucd-section">
+        <h3>Defender XDR Incidents</h3>
+        <table className="ucd-table">
+          <thead>
+            <tr>
+              <th>ID</th>
+              <th>Title</th>
+              <th>Severity</th>
+              <th>Status</th>
+              <th>Assigned</th>
+              <th>Alerts</th>
+              <th>Created</th>
+            </tr>
+          </thead>
+          <tbody>
+            {incidents.map((inc) => (
+              <tr key={inc.id} className={`ucd-sev-${inc.severity.toLowerCase()}`}>
+                <td>{inc.id}</td>
+                <td>{inc.title}</td>
+                <td>{inc.severity}</td>
+                <td>{inc.status}</td>
+                <td>{inc.assignedTo || '—'}</td>
+                <td>{inc.alertsCount}</td>
+                <td>{new Date(inc.createdTime).toLocaleString()}</td>
+              </tr>
+            ))}
+          </tbody>
+        </table>
+      </section>
+    </div>
+  );
+};
+
+export default UnifiedCommandDashboard;
diff --git a/src/components/UnifiedCommandDashboard.css b/src/components/UnifiedCommandDashboard.css
new file mode 100644
--- /dev/null
+++ b/src/components/UnifiedCommandDashboard.css
@@ -0,0 +1,99 @@
+.unified-command-dashboard {
+  padding: 1.5rem;
+  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
+}
+
+.ucd-loading,
+.ucd-error {
+  padding: 2rem;
+  text-align: center;
+  font-size: 1.1rem;
+}
+.ucd-error { color: #c0392b; }
+
+/* KPI Row */
+.ucd-kpi-row {
+  display: flex;
+  gap: 1rem;
+  flex-wrap: wrap;
+  margin-bottom: 2rem;
+}
+.ucd-kpi-card {
+  flex: 1;
+  min-width: 140px;
+  padding: 1rem;
+  border-radius: 8px;
+  text-align: center;
+  background: #f8f9fa;
+  border: 1px solid #dee2e6;
+}
+.ucd-kpi-value {
+  display: block;
+  font-size: 2rem;
+  font-weight: 700;
+}
+.ucd-kpi-label {
+  display: block;
+  font-size: 0.8rem;
+  text-transform: uppercase;
+  color: #6c757d;
+  margin-top: 0.25rem;
+}
+.ucd-kpi-card.bp-open { border-left: 4px solid #e67e22; }
+.ucd-kpi-card.bp-resolved { border-left: 4px solid #27ae60; }
+.ucd-kpi-card.xdr-active { border-left: 4px solid #2980b9; }
+.ucd-kpi-card.xdr-critical { border-left: 4px solid #c0392b; }
+.ucd-kpi-card.correlations { border-left: 4px solid #8e44ad; }
+
+/* Sections */
+.ucd-section {
+  margin-bottom: 2rem;
+}
+.ucd-section h3 {
+  margin-bottom: 0.75rem;
+  color: #2c3e50;
+}
+.ucd-empty {
+  color: #6c757d;
+  font-style: italic;
+}
+
+/* Tables */
+.ucd-table {
+  width: 100%;
+  border-collapse: collapse;
+  font-size: 0.875rem;
+}
+.ucd-table th,
+.ucd-table td {
+  padding: 0.5rem 0.75rem;
+  border-bottom: 1px solid #dee2e6;
+  text-align: left;
+}
+.ucd-table th {
+  background: #f1f3f5;
+  font-weight: 600;
+  text-transform: uppercase;
+  font-size: 0.75rem;
+  color: #495057;
+}
+.ucd-table tbody tr:hover {
+  background: #f8f9fa;
+}
+
+/* Source badges */
+.ucd-source {
+  font-size: 0.75rem;
+  font-weight: 600;
+  padding: 0.15rem 0.5rem;
+  border-radius: 4px;
+}
+.ucd-source-blackpoint { background: #ffeaa7; color: #6c5b00; }
+.ucd-source-defender-xdr { background: #dfe6e9; color: #2d3436; }
+
+/* Severity row highlights */
+.ucd-sev-critical { border-left: 3px solid #c0392b; }
+.ucd-sev-high { border-left: 3px solid #e67e22; }
+.ucd-sev-medium { border-left: 3px solid #f1c40f; }
+.ucd-sev-low { border-left: 3px solid #27ae60; }
diff --git a/src/components/CorrelationPanel.tsx b/src/components/CorrelationPanel.tsx
new file mode 100644
--- /dev/null
+++ b/src/components/CorrelationPanel.tsx
@@ -0,0 +1,131 @@
+// ---------------------------------------------------------------------------
+// Correlation Panel — Cross-Source Link Management
+// ---------------------------------------------------------------------------
+// Displays existing BP↔XDR correlations and allows analysts to create new
+// manual (analyst-confirmed) correlations between detection sources.
+// ---------------------------------------------------------------------------
+
+import React, { useEffect, useState } from 'react';
+import {
+  unifiedCorrelations,
+  createCorrelation,
+  type DetectionCorrelation,
+} from '../services/unifiedApi';
+import './CorrelationPanel.css';
+
+interface Props {
+  tenantAlias: string;
+}
+
+const CorrelationPanel: React.FC<Props> = ({ tenantAlias }) => {
+  const [correlations, setCorrelations] = useState<DetectionCorrelation[]>([]);
+  const [loading, setLoading] = useState(true);
+  const [error, setError] = useState<string | null>(null);
+
+  // Form state
+  const [bpId, setBpId] = useState('');
+  const [xdrId, setXdrId] = useState('');
+  const [type, setType] = useState<string>('analyst-confirmed');
+  const [confidence, setConfidence] = useState(0.9);
+  const [submitting, setSubmitting] = useState(false);
+
+  const load = () => {
+    setLoading(true);
+    unifiedCorrelations(tenantAlias)
+      .then(setCorrelations)
+      .catch((e) => setError(e.message))
+      .finally(() => setLoading(false));
+  };
+
+  useEffect(() => { load(); }, [tenantAlias]);
+
+  const handleCreate = async (e: React.FormEvent) => {
+    e.preventDefault();
+    if (!bpId || !xdrId) return;
+    setSubmitting(true);
+    try {
+      await createCorrelation(tenantAlias, bpId, xdrId, type, confidence);
+      setBpId('');
+      setXdrId('');
+      load();
+    } catch (err) {
+      setError((err as Error).message);
+    } finally {
+      setSubmitting(false);
+    }
+  };
+
+  if (loading) return <div className="cp-loading">Loading correlations…</div>;
+
+  return (
+    <div className="correlation-panel">
+      <h3>Cross-Source Correlations</h3>
+      {error && <div className="cp-error">{error}</div>}
+
+      {/* Create form */}
+      <form className="cp-form" onSubmit={handleCreate}>
+        <input
+          placeholder="BP Detection ID"
+          value={bpId}
+          onChange={(e) => setBpId(e.target.value)}
+          required
+        />
+        <input
+          placeholder="XDR Incident ID"
+          value={xdrId}
+          onChange={(e) => setXdrId(e.target.value)}
+          required
+        />
+        <select value={type} onChange={(e) => setType(e.target.value)}>
+          <option value="analyst-confirmed">Analyst Confirmed</option>
+          <option value="entity">Entity Match</option>
+          <option value="temporal">Temporal</option>
+          <option value="title">Title Match</option>
+        </select>
+        <input
+          type="number"
+          min={0}
+          max={1}
+          step={0.05}
+          value={confidence}
+          onChange={(e) => setConfidence(Number(e.target.value))}
+          title="Confidence (0-1)"
+        />
+        <button type="submit" disabled={submitting}>
+          {submitting ? 'Linking…' : 'Link'}
+        </button>
+      </form>
+
+      {/* Table */}
+      {correlations.length === 0 ? (
+        <p className="cp-empty">No correlations recorded for this tenant.</p>
+      ) : (
+        <table className="cp-table">
+          <thead>
+            <tr>
+              <th>BP Detection</th>
+              <th>XDR Incident</th>
+              <th>Type</th>
+              <th>Confidence</th>
+              <th>Created</th>
+            </tr>
+          </thead>
+          <tbody>
+            {correlations.map((c) => (
+              <tr key={c.id}>
+                <td className="cp-mono">{c.bpDetectionId}</td>
+                <td className="cp-mono">{c.xdrIncidentId}</td>
+                <td>{c.correlationType}</td>
+                <td>{(c.confidence * 100).toFixed(0)}%</td>
+                <td>{new Date(c.createdAt).toLocaleString()}</td>
+              </tr>
+            ))}
+          </tbody>
+        </table>
+      )}
+    </div>
+  );
+};
+
+export default CorrelationPanel;
diff --git a/src/components/CorrelationPanel.css b/src/components/CorrelationPanel.css
new file mode 100644
--- /dev/null
+++ b/src/components/CorrelationPanel.css
@@ -0,0 +1,51 @@
+.correlation-panel {
+  padding: 1rem;
+}
+.cp-loading { padding: 2rem; text-align: center; }
+.cp-error { color: #c0392b; margin-bottom: 1rem; padding: 0.5rem; background: #fdecea; border-radius: 4px; }
+.cp-empty { color: #6c757d; font-style: italic; }
+
+.cp-form {
+  display: flex;
+  gap: 0.5rem;
+  flex-wrap: wrap;
+  margin-bottom: 1.5rem;
+  align-items: center;
+}
+.cp-form input,
+.cp-form select {
+  padding: 0.4rem 0.6rem;
+  border: 1px solid #ced4da;
+  border-radius: 4px;
+  font-size: 0.85rem;
+}
+.cp-form input[type="number"] { width: 70px; }
+.cp-form button {
+  padding: 0.4rem 1rem;
+  background: #8e44ad;
+  color: #fff;
+  border: none;
+  border-radius: 4px;
+  cursor: pointer;
+  font-weight: 600;
+}
+.cp-form button:disabled { opacity: 0.6; cursor: not-allowed; }
+
+.cp-table {
+  width: 100%;
+  border-collapse: collapse;
+  font-size: 0.85rem;
+}
+.cp-table th, .cp-table td {
+  padding: 0.5rem 0.75rem;
+  border-bottom: 1px solid #dee2e6;
+  text-align: left;
+}
+.cp-table th {
+  background: #f1f3f5;
+  font-weight: 600;
+  text-transform: uppercase;
+  font-size: 0.75rem;
+}
+.cp-mono { font-family: monospace; font-size: 0.8rem; }
diff --git a/src/components/TriageRemediationPanel.tsx b/src/components/TriageRemediationPanel.tsx
new file mode 100644
--- /dev/null
+++ b/src/components/TriageRemediationPanel.tsx
@@ -0,0 +1,180 @@
+// ---------------------------------------------------------------------------
+// Triage & Remediation Panel
+// ---------------------------------------------------------------------------
+// Lets SOC analysts trigger playbook recommendations for an incident,
+// view proposals, and approve/reject remediation actions.
+// ---------------------------------------------------------------------------
+
+import React, { useState } from 'react';
+import {
+  triageRecommend,
+  xdrCreatePlan,
+  xdrProposals,
+  xdrDecideProposal,
+} from '../services/unifiedApi';
+import './TriageRemediationPanel.css';
+
+interface Props {
+  tenantAlias: string;
+  incidentId?: string;
+  incidentTitle?: string;
+  incidentSeverity?: string;
+  incidentWorkloads?: string[];
+}
+
+interface Proposal {
+  proposalId: string;
+  id: string;
+  title: string;
+  riskLevel: string;
+  status: string;
+  description: string;
+}
+
+const TriageRemediationPanel: React.FC<Props> = ({
+  tenantAlias,
+  incidentId,
+  incidentTitle,
+  incidentSeverity,
+  incidentWorkloads,
+}) => {
+  const [recommendations, setRecommendations] = useState<unknown[]>([]);
+  const [proposals, setProposals] = useState<Proposal[]>([]);
+  const [loading, setLoading] = useState(false);
+  const [error, setError] = useState<string | null>(null);
+  const [phase, setPhase] = useState<'idle' | 'recommended' | 'planned'>('idle');
+
+  const handleRecommend = async () => {
+    if (!incidentTitle || !incidentSeverity || !incidentWorkloads) return;
+    setLoading(true);
+    setError(null);
+    try {
+      const recs = await triageRecommend(tenantAlias, {
+        title: incidentTitle,
+        severity: incidentSeverity,
+        workloads: incidentWorkloads,
+      });
+      setRecommendations(recs);
+      setPhase('recommended');
+    } catch (err) {
+      setError((err as Error).message);
+    } finally {
+      setLoading(false);
+    }
+  };
+
+  const handleCreatePlan = async () => {
+    if (!incidentId) return;
+    setLoading(true);
+    setError(null);
+    try {
+      await xdrCreatePlan(tenantAlias, incidentId);
+      const p = (await xdrProposals(tenantAlias, incidentId)) as Proposal[];
+      setProposals(p);
+      setPhase('planned');
+    } catch (err) {
+      setError((err as Error).message);
+    } finally {
+      setLoading(false);
+    }
+  };
+
+  const handleDecide = async (proposalId: string, approved: boolean) => {
+    setLoading(true);
+    try {
+      await xdrDecideProposal(tenantAlias, proposalId, approved);
+      // Refresh proposals
+      const p = (await xdrProposals(tenantAlias, incidentId)) as Proposal[];
+      setProposals(p);
+    } catch (err) {
+      setError((err as Error).message);
+    } finally {
+      setLoading(false);
+    }
+  };
+
+  return (
+    <div className="triage-remediation-panel">
+      <h3>Triage & Remediation</h3>
+      {error && <div className="trp-error">{error}</div>}
+
+      {!incidentId && (
+        <p className="trp-hint">Select an incident to begin triage.</p>
+      )}
+
+      {incidentId && phase === 'idle' && (
+        <div className="trp-actions">
+          <button onClick={handleRecommend} disabled={loading}>
+            Get Playbook Recommendations
+          </button>
+        </div>
+      )}
+
+      {phase === 'recommended' && (
+        <div className="trp-recommendations">
+          <h4>Recommendations ({recommendations.length})</h4>
+          <ul>
+            {recommendations.map((r: any, i) => (
+              <li key={i}>
+                <strong>{r.title}</strong> — {r.description}
+                <span className={`trp-risk trp-risk-${r.riskLevel}`}>{r.riskLevel}</span>
+              </li>
+            ))}
+          </ul>
+          <button onClick={handleCreatePlan} disabled={loading}>
+            Create Remediation Plan
+          </button>
+        </div>
+      )}
+
+      {phase === 'planned' && (
+        <div className="trp-proposals">
+          <h4>Remediation Proposals</h4>
+          <table className="trp-table">
+            <thead>
+              <tr>
+                <th>Title</th>
+                <th>Risk</th>
+                <th>Status</th>
+                <th>Actions</th>
+              </tr>
+            </thead>
+            <tbody>
+              {proposals.map((p) => (
+                <tr key={p.proposalId}>
+                  <td>{p.title}</td>
+                  <td className={`trp-risk trp-risk-${p.riskLevel}`}>{p.riskLevel}</td>
+                  <td>{p.status}</td>
+                  <td>
+                    {p.status === 'pending' && (
+                      <>
+                        <button
+                          className="trp-approve"
+                          onClick={() => handleDecide(p.proposalId, true)}
+                          disabled={loading}
+                        >
+                          Approve
+                        </button>
+                        <button
+                          className="trp-reject"
+                          onClick={() => handleDecide(p.proposalId, false)}
+                          disabled={loading}
+                        >
+                          Reject
+                        </button>
+                      </>
+                    )}
+                    {p.status !== 'pending' && <span>{p.status}</span>}
+                  </td>
+                </tr>
+              ))}
+            </tbody>
+          </table>
+        </div>
+      )}
+    </div>
+  );
+};
+
+export default TriageRemediationPanel;
diff --git a/src/components/TriageRemediationPanel.css b/src/components/TriageRemediationPanel.css
new file mode 100644
--- /dev/null
+++ b/src/components/TriageRemediationPanel.css
@@ -0,0 +1,74 @@
+.triage-remediation-panel {
+  padding: 1rem;
+}
+.trp-error { color: #c0392b; padding: 0.5rem; background: #fdecea; border-radius: 4px; margin-bottom: 1rem; }
+.trp-hint { color: #6c757d; font-style: italic; }
+
+.trp-actions button,
+.trp-recommendations button {
+  padding: 0.5rem 1rem;
+  background: #2980b9;
+  color: #fff;
+  border: none;
+  border-radius: 4px;
+  cursor: pointer;
+  font-weight: 600;
+  margin-top: 0.75rem;
+}
+.trp-actions button:disabled,
+.trp-recommendations button:disabled { opacity: 0.6; }
+
+.trp-recommendations ul {
+  list-style: none;
+  padding: 0;
+}
+.trp-recommendations li {
+  padding: 0.5rem 0;
+  border-bottom: 1px solid #eee;
+}
+
+.trp-risk {
+  display: inline-block;
+  font-size: 0.7rem;
+  font-weight: 700;
+  padding: 0.1rem 0.4rem;
+  border-radius: 3px;
+  margin-left: 0.5rem;
+  text-transform: uppercase;
+}
+.trp-risk-critical { background: #c0392b; color: #fff; }
+.trp-risk-high { background: #e67e22; color: #fff; }
+.trp-risk-medium { background: #f1c40f; color: #333; }
+.trp-risk-low { background: #27ae60; color: #fff; }
+
+.trp-table {
+  width: 100%;
+  border-collapse: collapse;
+  font-size: 0.85rem;
+  margin-top: 0.75rem;
+}
+.trp-table th, .trp-table td {
+  padding: 0.5rem 0.75rem;
+  border-bottom: 1px solid #dee2e6;
+  text-align: left;
+}
+.trp-table th { background: #f1f3f5; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; }
+
+.trp-approve {
+  padding: 0.25rem 0.6rem;
+  background: #27ae60;
+  color: #fff;
+  border: none;
+  border-radius: 3px;
+  cursor: pointer;
+  margin-right: 0.25rem;
+}
+.trp-reject {
+  padding: 0.25rem 0.6rem;
+  background: #c0392b;
+  color: #fff;
+  border: none;
+  border-radius: 3px;
+  cursor: pointer;
+}
diff --git a/src/components/CloseoutGovernancePanel.tsx b/src/components/CloseoutGovernancePanel.tsx
new file mode 100644
--- /dev/null
+++ b/src/components/CloseoutGovernancePanel.tsx
@@ -0,0 +1,187 @@
+// ---------------------------------------------------------------------------
+// Closeout Governance Panel
+// ---------------------------------------------------------------------------
+// Lists prior closeout records and provides a form for formally closing a
+// case with resolution notes and governance metadata.
+// ---------------------------------------------------------------------------
+
+import React, { useEffect, useState } from 'react';
+import {
+  unifiedCloseouts,
+  createCloseout,
+  unifiedAudit,
+  type CloseoutRecord,
+  type AuditEvent,
+} from '../services/unifiedApi';
+import './CloseoutGovernancePanel.css';
+
+interface Props {
+  tenantAlias: string;
+  /** Pre-fill form with this BP detection ID */
+  bpDetectionId?: string;
+  /** Pre-fill form with this XDR incident ID */
+  xdrIncidentId?: string;
+  /** Current operator name (from auth context) */
+  currentUser?: string;
+}
+
+const CloseoutGovernancePanel: React.FC<Props> = ({
+  tenantAlias,
+  bpDetectionId: prefillBp,
+  xdrIncidentId: prefillXdr,
+  currentUser = 'analyst',
+}) => {
+  const [closeouts, setCloseouts] = useState<CloseoutRecord[]>([]);
+  const [audit, setAudit] = useState<AuditEvent[]>([]);
+  const [loading, setLoading] = useState(true);
+  const [error, setError] = useState<string | null>(null);
+  const [tab, setTab] = useState<'closeouts' | 'audit'>('closeouts');
+
+  // Form
+  const [bpId, setBpId] = useState(prefillBp || '');
+  const [xdrId, setXdrId] = useState(prefillXdr || '');
+  const [resolution, setResolution] = useState('');
+  const [notes, setNotes] = useState('');
+  const [submitting, setSubmitting] = useState(false);
+
+  const load = async () => {
+    setLoading(true);
+    try {
+      const [c, a] = await Promise.all([
+        unifiedCloseouts(tenantAlias),
+        unifiedAudit(tenantAlias),
+      ]);
+      setCloseouts(c);
+      setAudit(a);
+    } catch (e) {
+      setError((e as Error).message);
+    } finally {
+      setLoading(false);
+    }
+  };
+
+  useEffect(() => { load(); }, [tenantAlias]);
+
+  const handleClose = async (e: React.FormEvent) => {
+    e.preventDefault();
+    if (!resolution || (!bpId && !xdrId)) return;
+    setSubmitting(true);
+    setError(null);
+    try {
+      await createCloseout(tenantAlias, {
+        bpDetectionId: bpId || undefined,
+        xdrIncidentId: xdrId || undefined,
+        resolution,
+        notes: notes || undefined,
+        closedBy: currentUser,
+      });
+      setResolution('');
+      setNotes('');
+      load();
+    } catch (err) {
+      setError((err as Error).message);
+    } finally {
+      setSubmitting(false);
+    }
+  };
+
+  if (loading) return <div className="cgp-loading">Loading governance data…</div>;
+
+  return (
+    <div className="closeout-governance-panel">
+      <h3>Closeout Governance</h3>
+      {error && <div className="cgp-error">{error}</div>}
+
+      {/* Close case form */}
+      <form className="cgp-form" onSubmit={handleClose}>
+        <div className="cgp-form-row">
+          <input placeholder="BP Detection ID" value={bpId} onChange={(e) => setBpId(e.target.value)} />
+          <input placeholder="XDR Incident ID" value={xdrId} onChange={(e) => setXdrId(e.target.value)} />
+        </div>
+        <select value={resolution} onChange={(e) => setResolution(e.target.value)} required>
+          <option value="">— Select Resolution —</option>
+          <option value="true-positive-remediated">True Positive — Remediated</option>
+          <option value="true-positive-no-action">True Positive — No Action Needed</option>
+          <option value="false-positive">False Positive</option>
+          <option value="benign-positive">Benign Positive</option>
+          <option value="duplicate">Duplicate</option>
+          <option value="informational">Informational Only</option>
+        </select>
+        <textarea
+          placeholder="Analyst notes (optional)"
+          value={notes}
+          onChange={(e) => setNotes(e.target.value)}
+          rows={2}
+        />
+        <button type="submit" disabled={submitting || (!bpId && !xdrId) || !resolution}>
+          {submitting ? 'Closing…' : 'Close Case'}
+        </button>
+      </form>
+
+      {/* Tabs */}
+      <div className="cgp-tabs">
+        <button className={tab === 'closeouts' ? 'active' : ''} onClick={() => setTab('closeouts')}>
+          Closeouts ({closeouts.length})
+        </button>
+        <button className={tab === 'audit' ? 'active' : ''} onClick={() => setTab('audit')}>
+          Audit Trail ({audit.length})
+        </button>
+      </div>
+
+      {tab === 'closeouts' && (
+        <table className="cgp-table">
+          <thead>
+            <tr>
+              <th>Closed At</th>
+              <th>By</th>
+              <th>Resolution</th>
+              <th>BP ID</th>
+              <th>XDR ID</th>
+              <th>Notes</th>
+            </tr>
+          </thead>
+          <tbody>
+            {closeouts.map((c) => (
+              <tr key={c.id}>
+                <td>{new Date(c.closedAt).toLocaleString()}</td>
+                <td>{c.closedBy}</td>
+                <td>{c.resolution}</td>
+                <td className="cgp-mono">{c.bpDetectionId || '—'}</td>
+                <td className="cgp-mono">{c.xdrIncidentId || '—'}</td>
+                <td>{c.notes || '—'}</td>
+              </tr>
+            ))}
+          </tbody>
+        </table>
+      )}
+
+      {tab === 'audit' && (
+        <table className="cgp-table">
+          <thead>
+            <tr>
+              <th>Time</th>
+              <th>Actor</th>
+              <th>Action</th>
+              <th>Incident</th>
+              <th>Details</th>
+            </tr>
+          </thead>
+          <tbody>
+            {audit.map((a) => (
+              <tr key={a.id}>
+                <td>{new Date(a.createdAt).toLocaleString()}</td>
+                <td>{a.actor}</td>
+                <td>{a.action}</td>
+                <td className="cgp-mono">{a.incidentId}</td>
+                <td className="cgp-details">{JSON.stringify(a.details)}</td>
+              </tr>
+            ))}
+          </tbody>
+        </table>
+      )}
+    </div>
+  );
+};
+
+export default CloseoutGovernancePanel;
diff --git a/src/components/CloseoutGovernancePanel.css b/src/components/CloseoutGovernancePanel.css
new file mode 100644
--- /dev/null
+++ b/src/components/CloseoutGovernancePanel.css
@@ -0,0 +1,75 @@
+.closeout-governance-panel {
+  padding: 1rem;
+}
+.cgp-loading { padding: 2rem; text-align: center; }
+.cgp-error { color: #c0392b; padding: 0.5rem; background: #fdecea; border-radius: 4px; margin-bottom: 1rem; }
+
+.cgp-form {
+  display: flex;
+  flex-direction: column;
+  gap: 0.5rem;
+  margin-bottom: 1.5rem;
+  max-width: 600px;
+}
+.cgp-form-row {
+  display: flex;
+  gap: 0.5rem;
+}
+.cgp-form input,
+.cgp-form select,
+.cgp-form textarea {
+  padding: 0.4rem 0.6rem;
+  border: 1px solid #ced4da;
+  border-radius: 4px;
+  font-size: 0.85rem;
+  width: 100%;
+}
+.cgp-form button {
+  padding: 0.5rem 1rem;
+  background: #27ae60;
+  color: #fff;
+  border: none;
+  border-radius: 4px;
+  cursor: pointer;
+  font-weight: 600;
+  align-self: flex-start;
+}
+.cgp-form button:disabled { opacity: 0.6; cursor: not-allowed; }
+
+/* Tabs */
+.cgp-tabs {
+  display: flex;
+  gap: 0;
+  margin-bottom: 1rem;
+  border-bottom: 2px solid #dee2e6;
+}
+.cgp-tabs button {
+  padding: 0.5rem 1rem;
+  border: none;
+  background: transparent;
+  cursor: pointer;
+  font-weight: 600;
+  color: #6c757d;
+  border-bottom: 2px solid transparent;
+  margin-bottom: -2px;
+}
+.cgp-tabs button.active {
+  color: #2c3e50;
+  border-bottom-color: #2980b9;
+}
+
+/* Table */
+.cgp-table {
+  width: 100%;
+  border-collapse: collapse;
+  font-size: 0.85rem;
+}
+.cgp-table th, .cgp-table td {
+  padding: 0.5rem 0.75rem;
+  border-bottom: 1px solid #dee2e6;
+  text-align: left;
+}
+.cgp-table th { background: #f1f3f5; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; }
+.cgp-mono { font-family: monospace; font-size: 0.8rem; }
+.cgp-details { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; color: #6c757d; }
diff --git a/src/App.tsx b/src/App.tsx
--- src/App.tsx
+++ src/App.tsx
@@ -1,12 +1,62 @@
-import React from 'react';
+import React, { useState } from 'react';
 import Dashboard from './components/Dashboard';
+import UnifiedCommandDashboard from './components/UnifiedCommandDashboard';
+import CorrelationPanel from './components/CorrelationPanel';
+import TriageRemediationPanel from './components/TriageRemediationPanel';
+import CloseoutGovernancePanel from './components/CloseoutGovernancePanel';
 import './App.css';
 
+type View = 'legacy' | 'unified' | 'correlations' | 'triage' | 'closeout';
+
 function App() {
+  const [view, setView] = useState<View>('unified');
+  const [tenantAlias, setTenantAlias] = useState('');
+
   return (
     <div className="App">
-      <Dashboard />
+      {/* Navigation Bar */}
+      <nav className="app-nav">
+        <span className="app-nav-brand">SOC Command Center</span>
+        <div className="app-nav-links">
+          <button className={view === 'unified' ? 'active' : ''} onClick={() => setView('unified')}>
+            Unified Dashboard
+          </button>
+          <button className={view === 'correlations' ? 'active' : ''} onClick={() => setView('correlations')}>
+            Correlations
+          </button>
+          <button className={view === 'triage' ? 'active' : ''} onClick={() => setView('triage')}>
+            Triage & Remediation
+          </button>
+          <button className={view === 'closeout' ? 'active' : ''} onClick={() => setView('closeout')}>
+            Closeout Governance
+          </button>
+          <button className={view === 'legacy' ? 'active' : ''} onClick={() => setView('legacy')}>
+            Legacy BP Dashboard
+          </button>
+        </div>
+        <div className="app-nav-tenant">
+          <label>Tenant:</label>
+          <input
+            placeholder="alias (e.g. contoso)"
+            value={tenantAlias}
+            onChange={(e) => setTenantAlias(e.target.value)}
+          />
+        </div>
+      </nav>
+
+      {/* Main Content */}
+      <main className="app-main">
+        {!tenantAlias && view !== 'legacy' && (
+          <div className="app-prompt">Enter a tenant alias above to begin.</div>
+        )}
+
+        {view === 'legacy' && <Dashboard />}
+        {view === 'unified' && tenantAlias && <UnifiedCommandDashboard tenantAlias={tenantAlias} />}
+        {view === 'correlations' && tenantAlias && <CorrelationPanel tenantAlias={tenantAlias} />}
+        {view === 'triage' && tenantAlias && <TriageRemediationPanel tenantAlias={tenantAlias} />}
+        {view === 'closeout' && tenantAlias && <CloseoutGovernancePanel tenantAlias={tenantAlias} currentUser="analyst" />}
+      </main>
     </div>
   );
 }
 
diff --git a/src/App.css b/src/App.css
--- src/App.css
+++ src/App.css
@@ -16,4 +16,72 @@
   background: #0f172a;
   min-height: 100vh;
   color: #e2e8f0;
 }
+
+/* Navigation */
+.app-nav {
+  display: flex;
+  align-items: center;
+  gap: 1rem;
+  padding: 0.75rem 1.5rem;
+  background: #1e293b;
+  border-bottom: 1px solid #334155;
+  flex-wrap: wrap;
+}
+.app-nav-brand {
+  font-weight: 700;
+  font-size: 1.1rem;
+  color: #38bdf8;
+  white-space: nowrap;
+}
+.app-nav-links {
+  display: flex;
+  gap: 0.25rem;
+  flex-wrap: wrap;
+}
+.app-nav-links button {
+  padding: 0.4rem 0.75rem;
+  background: transparent;
+  color: #94a3b8;
+  border: 1px solid transparent;
+  border-radius: 4px;
+  cursor: pointer;
+  font-size: 0.85rem;
+  font-weight: 500;
+}
+.app-nav-links button:hover { color: #e2e8f0; }
+.app-nav-links button.active {
+  color: #fff;
+  background: #334155;
+  border-color: #475569;
+}
+.app-nav-tenant {
+  margin-left: auto;
+  display: flex;
+  align-items: center;
+  gap: 0.4rem;
+}
+.app-nav-tenant label {
+  font-size: 0.8rem;
+  color: #94a3b8;
+}
+.app-nav-tenant input {
+  padding: 0.3rem 0.5rem;
+  border: 1px solid #475569;
+  border-radius: 4px;
+  background: #0f172a;
+  color: #e2e8f0;
+  font-size: 0.85rem;
+  width: 160px;
+}
+
+/* Main area */
+.app-main {
+  padding: 1rem;
+}
+.app-prompt {
+  text-align: center;
+  padding: 4rem;
+  color: #64748b;
+  font-size: 1.1rem;
+}
diff --git a/README.md b/README.md
--- README.md
+++ README.md
@@ -1,31 +1,49 @@
-# Blackpoint Cyber API Integration
+# Unified SOC Command Dashboard
 
-SOC operations dashboard for monitoring Blackpoint-protected tenants, correlating Defender XDR ownership, and supporting closeout governance.
+Centralized Security Operations dashboard combining **Blackpoint Cyber (CompassOne)** and **Microsoft Defender XDR** into a single multi-tenant command surface. Built for Quisitive SecOps teams managing MDR-protected environments.
 
-## Latest Changes
+## Architecture
 
-- Updated detections integration to CompassOne v1.7.0 semantics, including list/count/by-week alignment and expanded filters.
-- Added native report endpoint integration for list, PDF URL, binary payload, and JSON payload retrieval.
-- Added tenant closeout reconciliation metrics between Blackpoint detections and Office365 Defender XDR incidents.
-- Added closeout governance export view with CSV output fields for BP ticket ID, XDR incident reference, and reconciliation status.
-- Added analyst-confirmed correlation overrides that persist per tenant and are reused on future loads.
+```
+┌─────────────────────────────────────────────────────────┐
+│  React SPA (Vite)                                       │
+│  ┌──────────┬──────────┬──────────┬───────────────────┐ │
+│  │ Unified  │ Correla- │ Triage & │ Closeout          │ │
+│  │ Dash     │ tions    │ Remediat.│ Governance        │ │
+│  └──────────┴──────────┴──────────┴───────────────────┘ │
+└───────────────────────────┬─────────────────────────────┘
+                            │ HTTP /api/tenants/:alias/*
+┌───────────────────────────┴─────────────────────────────┐
+│  Express Backend (port 7071)                            │
+│  ┌──────────┬──────────┬───────────────────────────────┐│
+│  │ /bp/*    │ /xdr/*   │ /unified/*                    ││
+│  │ Compass- │ Defender │ Correlations, Triage,         ││
+│  │ One API  │ XDR API  │ Closeout, Audit               ││
+│  └──────────┴──────────┴───────────────────────────────┘│
+│  Middleware: Auth · RBAC · Tenant Isolation · Rate Limit│
+│  Storage: Memory | PostgreSQL | Cosmos DB               │
+└─────────────────────────────────────────────────────────┘
+```
 
 ## Features
 
-- Multi-tenant monitoring dashboard.
-- Detection lifecycle visibility for OPEN and RESOLVED alert groups.
-- Detection reporting tab with aggregate stats, risk distribution, and recent closed detections.
-- Native report inventory and drill-down actions.
-- Microsoft Defender XDR ownership and triage queue view.
-- Closeout governance export and analyst override workflow.
+- **Multi-tenant architecture** — Per-tenant config with isolated API credentials and data scoping
+- **Blackpoint CompassOne integration** — Detections, analytics, reports, and asset inventory
+- **Microsoft Defender XDR integration** — Incidents, evidence links, writeback, and remediation
+- **Cross-source correlation** — Link BP detections to XDR incidents (entity, temporal, title, or analyst-confirmed)
+- **Learning Playbook Engine** — Adaptive triage recommendations with confidence scoring
+- **Remediation proposals** — Human-in-the-loop approve/reject workflow with MCP bridge execution
+- **Closeout governance** — Formal case closure with resolution taxonomy and audit trail
+- **Full audit log** — Every action recorded with actor, timestamp, and context
+- **Pluggable storage** — Memory (dev), PostgreSQL, or Cosmos DB backends
 
 ## Quick Start
 
 ### Prerequisites
 
-- Node.js 16+
-- Blackpoint API key
+- Node.js 20+
+- npm 9+
 
 ### Install
 
 ```bash
@@ -33,138 +51,163 @@
 ```
 
 ### Configure Environment
 
-```powershell
-# Legacy TypeScript services and scripts
-$env:BLACKPOINT_API_KEY = "your-api-key-here"
-$env:BLACKPOINT_API_URL = "https://api.blackpointcyber.com"
+```bash
+# Required
+COMPASSONE_API_KEY=your-blackpoint-api-key
+COMPASSONE_API_URL=https://api.blackpointcyber.com
 
-# React dashboard service calls
-$env:REACT_APP_BLACKPOINT_API_KEY = "your-api-key-here"
+# Microsoft Defender XDR (per-tenant — configure in config/tenants.json)
+# See config/tenants.example.json for full structure
+
+# Optional storage (default: memory)
+STORAGE_BACKEND=memory          # memory | postgres | cosmos
+DATABASE_URL=postgresql://...   # for postgres
+COSMOS_ENDPOINT=https://...     # for cosmos
+COSMOS_KEY=...                  # for cosmos
+
+# Auth (optional in dev)
+AZURE_CLIENT_ID=...
+AZURE_TENANT_ID=...
 ```
 
-### Run
+### Tenant Configuration
 
+Copy and edit the tenant config:
+
 ```bash
-npm run dev        # legacy workflow sample
-npm run dashboard  # React UI
-npm run test-api   # quick API check
-npm run discover   # endpoint probe utility
+cp config/tenants.example.json config/tenants.json
 ```
 
-## Functioning Detections Endpoints
+Each tenant entry includes:
+- `alias` — URL-safe identifier used in all API paths
+- `blackpoint` — customerId, apiKey override
+- `microsoft` — tenantId, clientId, clientSecret, workloads array
 
-All detections endpoints below are implemented and used in the current integration. Tenant-scoped requests should include `x-tenant-id`.
+### Run (Development)
 
-|Endpoint|Status|Primary use in this repo|
-|---|---|---|
-|`GET /v1/alert-groups`|Functioning|List OPEN and RESOLVED detections with filtering and pagination|
-|`GET /v1/alert-groups/{alertGroupId}`|Functioning|Fetch one detection group by ID|
-|`GET /v1/alert-groups/{alertGroupId}/alerts`|Functioning|Fetch underlying alerts for a detection group|
-|`GET /v1/alert-groups/count`|Functioning|Count detections by filter set|
-|`GET /v1/alert-groups/alert-groups-by-week`|Functioning|Weekly detection trend metrics|
-|`GET /v1/alert-groups/top-detections-by-entity`|Functioning|Top detections grouped by entity|
-|`GET /v1/alert-groups/top-detections-by-threat`|Functioning|Top detections grouped by threat|
+```bash
+npm run dev          # Starts both backend (tsx watch) + Vite dev server
+```
 
-Validated list filtering on `/v1/alert-groups` includes:
+Access:
+- **Dashboard UI**: http://localhost:5173
+- **API Health**: http://localhost:7071/health
 
-- `status` (`OPEN`, `RESOLVED`)
-- `type` (`CR`, `MDR`)
-- `search`
-- `tunnelSearch`
-- `since`
-- `minAlertsCount`
-- `maxAlertsCount`
-- `sortByColumn`
-- `sortDirection`
-- `take`
-- `skip`
+### Build & Production
 
-## Functioning Reports Endpoints
+```bash
+npm run build        # Builds client (Vite) + server (tsc)
+npm start            # Runs compiled server serving SPA + API
+```
 
-All report endpoints below are integrated in the current frontend service layer.
+### Docker
 
-|Endpoint|Status|Primary use in this repo|
-|---|---|---|
-|`GET /v1/reports`|Functioning|List tenant report runs with paging and filtering|
-|`GET /v1/reports/{id}/url`|Functioning|Open signed PDF URL for analyst consumption|
-|`GET /v1/reports/{id}/binary`|Functioning|Retrieve base64 report payload for binary workflows|
-|`GET /v1/reports/{id}/json`|Functioning|Retrieve machine-readable JSON report payload|
+```bash
+docker build -t soc-command .
+docker run -p 7071:7071 --env-file .env soc-command
+```
 
-Current report filtering options wired in the service:
+## API Reference
 
-- `page`
-- `pageSize`
-- `sortBy=intervalStart`
-- `sortOrder`
-- `reportType` (`Cloud`, `Executive`, `MDR`)
-- `startDate`
-- `endDate`
+All tenant-scoped routes: `GET|POST|PATCH /api/tenants/:alias/...`
 
-Report run parsing also supports `VulnerabilityManagement` values when returned in API payloads.
+### Blackpoint (`/bp`)
 
-## XDR Closeout Governance
+| Method | Path | Description |
+|--------|------|-------------|
+| GET | `/bp/detections` | List detections (?status, ?skip, ?take) |
+| GET | `/bp/detections/:id` | Get single detection |
+| GET | `/bp/detections/:id/alerts` | Get alerts for detection |
+| GET | `/bp/analytics/count` | Detection count (?status) |
+| GET | `/bp/analytics/weekly-trends` | Weekly trend metrics |
+| GET | `/bp/analytics/top-entities` | Top entities (?top) |
+| GET | `/bp/analytics/top-threats` | Top threats (?top) |
+| GET | `/bp/reports` | List reports (?reportType, ?page) |
+| GET | `/bp/reports/:id/pdf` | Get signed PDF URL |
+| GET | `/bp/reports/:id/json` | Get JSON report payload |
+| GET | `/bp/assets` | List assets (?page, ?pageSize) |
+| GET | `/bp/assets/count` | Asset count |
 
-The tenant ownership panel now includes:
+### Defender XDR (`/xdr`)
 
-- Closeout reconciliation summary counters:
-- `CLOSED_BOTH`
-- `XDR_ACTIVE_BP_CLOSED`
-- `BP_ACTIVE_XDR_CLOSED`
-- unmatched counts for XDR and BP
-- CSV export with correlation method and confidence metadata
-- Analyst override actions:
-- Confirm Match
-- Mark No Match
-- Clear Override
+| Method | Path | Description |
+|--------|------|-------------|
+| GET | `/xdr/incidents` | List incidents (?top, ?filter) |
+| GET | `/xdr/incidents/:id` | Get single incident |
+| PATCH | `/xdr/incidents/:id` | Update incident (writeback) |
+| GET | `/xdr/incidents/:id/case` | Get local case record |
+| GET | `/xdr/evidence/:id` | Evidence links for incident |
+| POST | `/xdr/remediation/plan` | Create remediation plan |
+| GET | `/xdr/remediation/proposals` | List proposals (?incidentId) |
+| GET | `/xdr/remediation/proposals/:id` | Get proposal |
+| POST | `/xdr/remediation/proposals/:id/decide` | Approve/reject |
 
-## Role-Limited or Historically Unavailable Routes
+### Unified (`/unified`)
 
-Some routes may still be role-limited or unavailable depending on API key permissions and tenant configuration.
+| Method | Path | Description |
+|--------|------|-------------|
+| GET | `/unified/alerts` | Cross-source alert timeline (?limit, ?source) |
+| POST | `/unified/alerts` | Record alert snapshot |
+| GET | `/unified/correlations` | List all correlations |
+| POST | `/unified/correlations` | Create correlation link |
+| GET | `/unified/correlations/by-detection/:id` | Correlations for BP detection |
+| GET | `/unified/correlations/by-incident/:id` | Correlations for XDR incident |
+| GET | `/unified/closeouts` | List closeout records (?limit) |
+| POST | `/unified/closeouts` | Close a case |
+| GET | `/unified/audit` | Audit event trail (?incidentId, ?actor) |
+| GET | `/unified/audit/cases` | Local case records |
+| GET | `/unified/audit/detections` | Local BP detections |
+| POST | `/unified/triage/recommend` | Get playbook recommendations |
+| GET | `/unified/triage/playbooks` | Export all playbooks |
+| PUT | `/unified/triage/playbooks/:id` | Upsert playbook entry |
+| POST | `/unified/triage/playbooks/:id/feedback` | Record feedback |
 
-- `/v1/incidents` can return 403 without role grant.
-- `/v1/users` can return 403 without role grant.
-- Historical 404 families include `/v1/alerts`, `/v1/tickets`, `/v1/cases`, and others.
-
-See [API_LIMITATIONS.md](API_LIMITATIONS.md) for the full compatibility matrix and request guidance.
-
 ## Project Structure
 
-```text
+```
 src/
-  components/
-    Dashboard.tsx
-    DetectionReportingDashboard.tsx
-    TenantXdrOwnershipPanel.tsx
-  services/
-    blackpointReports.service.ts
-    defenderXdr.service.ts
-    closeoutGovernance.service.ts
-legacy/
-  services/
-    alert.service.ts
-  types/
-    blackpoint.types.ts
-  utils/
-    blackpoint.config.ts
+  backend/
+    config/          # Tenant schema, loader, example JSON
+    middleware/      # Auth, RBAC, rate limit, audit, tenant isolation
+    routes/
+      bp/            # Blackpoint CompassOne route handlers
+      xdr/           # Defender XDR + remediation route handlers
+      unified/       # Correlation, triage, closeout, audit
+    services/        # API clients, playbook engine, MCP bridge
+    storage/         # Repository interface + memory/postgres/cosmos
+    server.ts        # Express entry point
+  components/        # React UI panels
+  services/          # Frontend API client (unifiedApi.ts)
+  auth/              # MSAL config + React hooks
+legacy/              # Original BP-only services (preserved)
+config/              # tenants.json (gitignored), tenants.example.json
+docs/                # Architecture proposals
+grafana/             # Pre-built Grafana dashboards
 ```
 
 ## Development Scripts
 
 ```bash
-npm run build
-npm run watch
-npm run type-check
+npm run dev           # Full-stack dev (backend + Vite)
+npm run dev:client    # Vite only
+npm run dev:server    # Backend only (tsx watch)
+npm run build         # Production build
+npm run type-check    # TypeScript validation
+npm run legacy:dev    # Legacy workflow sample
 ```
 
-## Security Notes
+## Security
 
-- API keys are not logged.
-- Rate limiting and sanitization utilities are included.
-- Security documentation is maintained in repository markdown files.
+- API keys never logged (audit logger redacts sensitive fields)
+- Per-tenant credential isolation — no cross-tenant data leakage
+- Rate limiting per IP (100 req/15min default)
+- Security headers via Helmet
+- Input validation on all mutation endpoints
+- MSAL PKCE for frontend auth, client_credentials for backend token acquisition
 
 See [SECURITY_SUMMARY.md](SECURITY_SUMMARY.md) and [SECURITY_REVIEW.md](SECURITY_REVIEW.md).
 
 ## License
 
-Proprietary - Quisitive
+Proprietary — Quisitive
diff --git a/SECOPS_OPERATIONS_GUIDE.md b/SECOPS_OPERATIONS_GUIDE.md
new file mode 100644
--- /dev/null
+++ b/SECOPS_OPERATIONS_GUIDE.md
@@ -0,0 +1,246 @@
+# SecOps Operations Guide — Unified SOC Command Dashboard
+
+## Purpose
+
+This guide is for Quisitive SecOps analysts and SOC operators who use the Unified SOC Command Dashboard daily. It covers common workflows, operational procedures, and troubleshooting.
+
+---
+
+## 1. Accessing the Dashboard
+
+1. Navigate to the dashboard URL (default: `http://localhost:5173` in dev, or your deployed URL)
+2. Sign in with your organizational Microsoft account (Entra ID SSO)
+3. Enter your **tenant alias** in the top-right input (e.g., `contoso`, `fabrikam`)
+4. The Unified Dashboard loads automatically with cross-source KPIs
+
+---
+
+## 2. Daily SOC Workflow
+
+### 2.1 Morning Triage
+
+1. Open **Unified Dashboard** tab
+2. Review the KPI cards:
+   - **BP Open Detections** — New Blackpoint alerts needing attention
+   - **XDR Active Incidents** — Microsoft Defender incidents in progress
+   - **High/Critical XDR** — Escalated items needing immediate response
+   - **Correlations** — Linked cross-source events
+3. Scan the **Recent Alert Timeline** for new entries from both sources
+4. Prioritize: High/Critical XDR incidents first, then open BP detections
+
+### 2.2 Incident Investigation
+
+1. Click an incident in the **Defender XDR Incidents** table
+2. Navigate to **Triage & Remediation** tab
+3. Click **Get Playbook Recommendations** — the engine suggests actions based on learned patterns
+4. Review recommendations (risk-tagged as Low/Medium/High/Critical)
+5. Click **Create Remediation Plan** to generate formal proposals
+6. **Approve** actions you want executed, or **Reject** with a reason
+
+### 2.3 Cross-Source Correlation
+
+When a Blackpoint detection appears related to an XDR incident:
+
+1. Go to **Correlations** tab
+2. Enter the BP Detection ID and XDR Incident ID
+3. Select correlation type:
+   - **Analyst Confirmed** — You've verified the link manually
+   - **Entity Match** — Same host/user involved
+   - **Temporal** — Events occurred within the same time window
+   - **Title Match** — Similar alert descriptions
+4. Set confidence (0.5–1.0) and click **Link**
+5. The correlation appears in both the Correlations table and the Unified Dashboard KPIs
+
+### 2.4 Case Closeout
+
+When an investigation is complete:
+
+1. Go to **Closeout Governance** tab
+2. Enter the BP Detection ID and/or XDR Incident ID
+3. Select a resolution:
+   - **True Positive — Remediated** (threat confirmed and fixed)
+   - **True Positive — No Action Needed** (self-resolved or accepted risk)
+   - **False Positive** (not a real threat)
+   - **Benign Positive** (real activity, not malicious)
+   - **Duplicate** (already tracked elsewhere)
+   - **Informational Only** (noted but not actionable)
+4. Add analyst notes explaining your reasoning
+5. Click **Close Case**
+6. The closure is recorded with your identity and a full audit trail
+
+---
+
+## 3. API Endpoints (For Automation & Scripting)
+
+All endpoints require tenant alias in the path: `/api/tenants/{alias}/...`
+
+### Quick Reference
+
+```bash
+# List open BP detections
+curl http://localhost:7071/api/tenants/contoso/bp/detections?status=OPEN
+
+# List XDR incidents (top 20)
+curl http://localhost:7071/api/tenants/contoso/xdr/incidents?top=20
+
+# Get correlations
+curl http://localhost:7071/api/tenants/contoso/unified/correlations
+
+# Create a closeout
+curl -X POST http://localhost:7071/api/tenants/contoso/unified/closeouts \
+  -H "Content-Type: application/json" \
+  -d '{"xdrIncidentId":"inc-123","resolution":"true-positive-remediated","closedBy":"jsmith","notes":"Phishing campaign contained"}'
+
+# Get audit trail
+curl http://localhost:7071/api/tenants/contoso/unified/audit
+```
+
+---
+
+## 4. Tenant Configuration
+
+### Adding a New Tenant
+
+1. Edit `config/tenants.json`
+2. Add an entry following this structure:
+
+```json
+{
+  "alias": "newtenant",
+  "displayName": "New Tenant Corp",
+  "blackpoint": {
+    "customerId": "bp-customer-uuid",
+    "apiKeyOverride": null
+  },
+  "microsoft": {
+    "tenantId": "azure-ad-tenant-id",
+    "clientId": "app-registration-client-id",
+    "clientSecret": "app-registration-secret",
+    "workloads": ["DefenderForEndpoint", "DefenderForOffice365"]
+  }
+}
+```
+
+3. Restart the server — the tenant is immediately available at `/api/tenants/newtenant/...`
+
+### Removing a Tenant
+
+Remove the entry from `config/tenants.json` and restart. Historical data remains in storage.
+
+---
+
+## 5. Storage Backends
+
+| Backend | Use Case | Config |
+|---------|----------|--------|
+| `memory` | Development, testing | Default — no setup needed |
+| `postgres` | Production with SQL-based tooling | Set `DATABASE_URL` env var |
+| `cosmos` | Azure-native, global distribution | Set `COSMOS_ENDPOINT` + `COSMOS_KEY` |
+
+Switch backends by setting `STORAGE_BACKEND` environment variable.
+
+---
+
+## 6. Understanding Correlations
+
+### Correlation Types
+
+| Type | Meaning | Typical Confidence |
+|------|---------|-------------------|
+| `analyst-confirmed` | Human verified the link | 0.9–1.0 |
+| `entity` | Same host, user, or IP in both sources | 0.6–0.8 |
+| `temporal` | Events within ±15 min window | 0.4–0.6 |
+| `title` | Similar alert title keywords | 0.3–0.5 |
+
+### Best Practices
+
+- Always confirm automated correlations before closing cases
+- Use `analyst-confirmed` when you've validated the link
+- Low-confidence correlations (< 0.5) should be treated as leads, not facts
+
+---
+
+## 7. Remediation Proposals
+
+### Lifecycle
+
+```
+Recommendation → Proposal (pending) → Approved / Rejected → Executed / Failed
+```
+
+### Risk Levels
+
+| Level | Auto-Execute? | Requires |
+|-------|---------------|----------|
+| `low` | No | Analyst approval |
+| `medium` | No | Analyst approval |
+| `high` | No | Senior analyst approval |
+| `critical` | No | SOC lead approval + documented reason |
+
+All proposals require human approval. No automated execution occurs without explicit approval.
+
+### MCP Bridge
+
+When a proposal is approved and has an `mcpOperation`, the system dispatches it via the MCP Bridge (HMAC-signed webhook). If no webhook is configured, the proposal is marked as requiring manual execution with steps listed in the UI.
+
+---
+
+## 8. Audit Trail
+
+Every significant action is logged:
+
+- Incident syncs from both sources
+- Correlation creates
+- Remediation proposals (create, approve, reject, execute)
+- Case closeouts
+
+Access via:
+- **UI**: Closeout Governance → Audit Trail tab
+- **API**: `GET /api/tenants/:alias/unified/audit`
+
+Filter by `?incidentId=` or `?actor=` to narrow results.
+
+---
+
+## 9. Troubleshooting
+
+| Symptom | Cause | Fix |
+|---------|-------|-----|
+| "Failed to fetch incidents from Defender XDR" | Microsoft token expired or misconfigured | Check `microsoft.clientSecret` in tenants.json |
+| 502 on BP endpoints | CompassOne API key invalid or rate-limited | Verify `COMPASSONE_API_KEY`, wait for rate limit reset |
+| Empty correlations after linking | Storage not initialized | Check server logs for `[boot] Storage backend ready` |
+| KPI shows 0 for everything | Tenant alias mismatch | Ensure the alias in the URL matches `config/tenants.json` |
+| "Tenant not found" 404 | Alias not in registry | Add tenant to config and restart |
+
+### Checking Server Health
+
+```bash
+curl http://localhost:7071/health
+# Returns: { "status": "ok", "tenants": 2, "uptime": ... }
+```
+
+---
+
+## 10. Security Responsibilities
+
+- **Never share API keys** in chat, tickets, or public channels
+- **Use SSO** — do not bypass authentication in production
+- **Review audit logs** weekly for unexpected activity
+- **Report** any 403/401 errors that shouldn't occur to the platform team
+- **Rotate credentials** quarterly (BP API keys, Entra app secrets)
+
+See [SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md) for the full pre-deployment security checklist.
+
+---
+
+## 11. Legacy Dashboard
+
+The original Blackpoint-only dashboard is still accessible via the **Legacy BP Dashboard** nav tab. It operates independently using `REACT_APP_BLACKPOINT_API_KEY` environment variable and direct browser-side API calls. Use the unified backend routes (`/bp/*`) for new integrations.
+
+---
+
+## Contact
+
+- Platform issues: File in this repository's Issues tab
+- Urgent SOC matters: Quisitive SecOps Slack channel
diff --git a/BLACKPOINT_INTEGRATION.md b/BLACKPOINT_INTEGRATION.md
--- BLACKPOINT_INTEGRATION.md
+++ BLACKPOINT_INTEGRATION.md
@@ -1,6 +1,10 @@
 # Blackpoint Cyber Integration
 
+> **Note**: This document covers the legacy direct-client usage. For the current unified backend,
+> see [SECOPS_OPERATIONS_GUIDE.md](SECOPS_OPERATIONS_GUIDE.md) and the `/bp/*` routes
+> in the [README](README.md#blackpoint-bp).
+
 Environment variables needed for Blackpoint Cyber API integration:
 
 ```bash
 # Blackpoint Cyber API Configuration
diff --git a/DASHBOARD_TRACKING.md b/DASHBOARD_TRACKING.md
--- DASHBOARD_TRACKING.md
+++ DASHBOARD_TRACKING.md
@@ -1,6 +1,11 @@
 # SOC Alert Dashboard with Lifecycle Tracking
 
+> **Note**: This document describes the legacy Blackpoint-only alert dashboard.
+> The unified platform now provides cross-source triage, correlation, and closeout
+> governance. See [SECOPS_OPERATIONS_GUIDE.md](SECOPS_OPERATIONS_GUIDE.md) for
+> current operational procedures.
+
 Visual dashboard for monitoring Blackpoint Cyber alerts with real-time timers, prioritized by severity, and comprehensive lifecycle tracking for SOC analysts.
 
 ## Features
 
diff --git a/CLOSED_DETECTIONS_GUIDE.md b/CLOSED_DETECTIONS_GUIDE.md
--- CLOSED_DETECTIONS_GUIDE.md
+++ CLOSED_DETECTIONS_GUIDE.md
@@ -1,6 +1,10 @@
 # Closed Detections & Reporting Dashboard - Integration Guide
 
+> **Note**: This guide covers the legacy component-level integration.
+> For the current unified closeout workflow with governance and audit trail,
+> see [SECOPS_OPERATIONS_GUIDE.md](SECOPS_OPERATIONS_GUIDE.md#24-case-closeout).
+
 ## Overview
 
 This update adds comprehensive support for **reviewing closed/resolved detections after-the-fact** and generating detailed **detection reports** directly in the application UI.
 
