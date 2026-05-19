/**
 * Risk Insights Service
 * 
 * Fetches non-detection risk data from CompassOne API v1.7.0:
 *   - Security Posture Rating (SPR)
 *   - Vulnerability Management statistics
 *   - Dark Web exposure scan data
 * 
 * IMPORTANT: These are NOT detections. They do not have Blackpoint case numbers
 * and should never be cross-correlated with detection ticket IDs. They represent
 * proactive risk posture data used for governance and risk-decision reporting.
 */

const API_KEY = process.env.REACT_APP_BLACKPOINT_API_KEY || '';

function getHeaders(tenantId?: string): HeadersInit {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${API_KEY}`,
    Accept: 'application/json',
  };
  if (tenantId) {
    headers['x-tenant-id'] = tenantId;
  }
  return headers;
}

async function apiFetch<T>(path: string, tenantId?: string): Promise<T> {
  const response = await fetch(path, { headers: getHeaders(tenantId) });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} - ${path}`);
  }
  return (await response.json()) as T;
}

// ---------------------------------------------------------------------------
// Security Posture Rating (SPR) Types — from RM_* schemas
// ---------------------------------------------------------------------------

export interface MetricCalculationResult {
  metricName: string;
  score: number;
  maxScore: number;
  deduction: number;
  passed: boolean;
}

export interface SprCategoryBreakdown {
  categoryName: string;
  score: number;
  maxScore: number;
  metrics: MetricCalculationResult[];
}

export interface SprCalculationRun {
  id: string;
  tenantId: string;
  score: number;
  maxScore: number;
  /** ISO 8601 date-time */
  created: string;
  metricResults?: MetricCalculationResult[];
  categoryBreakdown?: SprCategoryBreakdown[];
}

export interface SprRatingHistoryEntry {
  /** ISO 8601 date-time */
  date: string;
  score: number;
  maxScore: number;
}

export interface SprRatingHistory {
  history: SprRatingHistoryEntry[];
}

export interface AccountTenantSpr {
  tenantId: string;
  tenantName: string;
  score: number;
  maxScore: number;
  /** ISO 8601 date-time */
  lastCalculated: string;
}

export interface PaginatedAccountTenantSpr {
  data: AccountTenantSpr[];
  meta: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
}

// ---------------------------------------------------------------------------
// Vulnerability Management Types — from CR_* schemas
// ---------------------------------------------------------------------------

export interface VulnerabilityCountBySeverity {
  critical: number;
  high: number;
  medium: number;
  low: number;
  informational: number;
  total: number;
}

export interface VulnerabilityCountByTenantEntry {
  tenantId: string;
  tenantName?: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
}

export interface VulnerabilityCountByTenantResponse {
  data: VulnerabilityCountByTenantEntry[];
}

export interface DarkWebExposure {
  id: string;
  email?: string;
  username?: string;
  domain?: string;
  passwordExposed: boolean;
  usernameExposed: boolean;
  source?: string;
  /** ISO 8601 date-time */
  discoveredAt?: string;
}

export interface DarkWebExposuresResponse {
  data: DarkWebExposure[];
  meta: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface DarkWebReportSummary {
  totalExposures: number;
  passwordsExposed: number;
  usernamesExposed: number;
  domainsAffected: number;
  /** ISO 8601 date-time */
  lastScanDate?: string;
}

export interface ExternalScanExposure {
  id: string;
  [key: string]: unknown;
}

export interface ExternalScanReport {
  id: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Combined Risk Insights Response
// ---------------------------------------------------------------------------

export interface RiskInsightsData {
  /** Security Posture Rating — overall score and breakdown */
  spr: {
    loaded: boolean;
    error?: string;
    rating?: SprCalculationRun;
    history?: SprRatingHistory;
    allTenantRatings?: PaginatedAccountTenantSpr;
  };
  /** Vulnerability Management — severity stats */
  vulnerabilities: {
    loaded: boolean;
    error?: string;
    countBySeverity?: VulnerabilityCountBySeverity;
    countByTenant?: VulnerabilityCountByTenantEntry[];
  };
  /** Dark Web — credential exposure data */
  darkWeb: {
    loaded: boolean;
    error?: string;
    report?: DarkWebReportSummary;
    exposures?: DarkWebExposure[];
    exposuresMeta?: { totalItems: number; currentPage: number; totalPages: number };
  };
}

// ---------------------------------------------------------------------------
// API Functions — Security Posture Rating
// ---------------------------------------------------------------------------

/**
 * Get the current SPR score for a tenant.
 * Endpoint: GET /v1/security-posture/rating
 */
export async function fetchSecurityPostureRating(
  tenantId: string
): Promise<SprCalculationRun> {
  return apiFetch<SprCalculationRun>('/v1/security-posture/rating', tenantId);
}

/**
 * Get SPR score history for a tenant.
 * Endpoint: GET /v1/security-posture/rating/history
 */
export async function fetchSecurityPostureHistory(
  tenantId: string,
  historyRange: 'months_1' | 'months_6' | 'months_12' = 'months_6'
): Promise<SprRatingHistory> {
  return apiFetch<SprRatingHistory>(
    `/v1/security-posture/rating/history?historyRange=${historyRange}`,
    tenantId
  );
}

/**
 * Get SPR category breakdown (Operational and NIST categories).
 * Endpoint: GET /v1/security-posture/rating/categories
 */
export async function fetchSecurityPostureCategories(
  tenantId: string
): Promise<SprCategoryBreakdown[]> {
  return apiFetch<SprCategoryBreakdown[]>(
    '/v1/security-posture/rating/categories',
    tenantId
  );
}

/**
 * Get SPR scores for ALL tenants in the account.
 * Endpoint: GET /v1/security-posture/account/all-ratings
 */
export async function fetchAllTenantSecurityRatings(
  options: { page?: number; pageSize?: number; sortBy?: 'score' | 'tenantId'; sortOrder?: 'ASC' | 'DESC' } = {}
): Promise<PaginatedAccountTenantSpr> {
  const params = new URLSearchParams();
  if (options.page) params.set('page', String(options.page));
  if (options.pageSize) params.set('pageSize', String(options.pageSize));
  if (options.sortBy) params.set('sortBy', options.sortBy);
  if (options.sortOrder) params.set('sortOrder', options.sortOrder);

  const query = params.toString();
  return apiFetch<PaginatedAccountTenantSpr>(
    `/v1/security-posture/account/all-ratings${query ? `?${query}` : ''}`
  );
}

// ---------------------------------------------------------------------------
// API Functions — Vulnerability Management Statistics
// ---------------------------------------------------------------------------

/**
 * Get vulnerability count by severity.
 * Endpoint: GET /v1/vulnerability-management/vulnerabilities/stats/count-by-severity
 */
export async function fetchVulnerabilityCountBySeverity(
  tenantId: string,
  options: { hideResolvedVulnerabilities?: boolean } = {}
): Promise<VulnerabilityCountBySeverity> {
  const params = new URLSearchParams();
  if (options.hideResolvedVulnerabilities !== undefined) {
    params.set('hideResolvedVulnerabilities', String(options.hideResolvedVulnerabilities));
  }
  const query = params.toString();
  return apiFetch<VulnerabilityCountBySeverity>(
    `/v1/vulnerability-management/vulnerabilities/stats/count-by-severity${query ? `?${query}` : ''}`,
    tenantId
  );
}

/**
 * Get vulnerability count by tenant across the account.
 * Endpoint: GET /v1/vulnerability-management/vulnerabilities/stats/count-by-tenant
 */
export async function fetchVulnerabilityCountByTenant(
  options: { hideResolvedVulnerabilities?: boolean; severity?: string[] } = {}
): Promise<VulnerabilityCountByTenantEntry[]> {
  const params = new URLSearchParams();
  if (options.hideResolvedVulnerabilities !== undefined) {
    params.set('hideResolvedVulnerabilities', String(options.hideResolvedVulnerabilities));
  }
  if (options.severity?.length) {
    options.severity.forEach(s => params.append('severity', s));
  }
  const query = params.toString();
  const response = await apiFetch<{ data: VulnerabilityCountByTenantEntry[] }>(
    `/v1/vulnerability-management/vulnerabilities/stats/count-by-tenant${query ? `?${query}` : ''}`
  );
  return response.data ?? response as unknown as VulnerabilityCountByTenantEntry[];
}

// ---------------------------------------------------------------------------
// API Functions — Dark Web Scans
// ---------------------------------------------------------------------------

/**
 * Get dark web scan exposures for a tenant.
 * Endpoint: GET /v1/vulnerability-management/darkweb/scan/exposures
 */
export async function fetchDarkWebExposures(
  tenantId: string,
  options: { page?: number; pageSize?: number; passwordExposed?: boolean } = {}
): Promise<DarkWebExposuresResponse> {
  const params = new URLSearchParams();
  if (options.page) params.set('page', String(options.page));
  if (options.pageSize) params.set('pageSize', String(options.pageSize));
  if (options.passwordExposed !== undefined) {
    params.set('passwordExposed', String(options.passwordExposed));
  }
  const query = params.toString();
  return apiFetch<DarkWebExposuresResponse>(
    `/v1/vulnerability-management/darkweb/scan/exposures${query ? `?${query}` : ''}`,
    tenantId
  );
}

/**
 * Get dark web scan summary report for a tenant.
 * Endpoint: GET /v1/vulnerability-management/darkweb/scan/report
 */
export async function fetchDarkWebReport(
  tenantId: string
): Promise<DarkWebReportSummary> {
  return apiFetch<DarkWebReportSummary>(
    '/v1/vulnerability-management/darkweb/scan/report',
    tenantId
  );
}

// ---------------------------------------------------------------------------
// Aggregated loader — fetches all risk insight data for a tenant
// ---------------------------------------------------------------------------

/**
 * Load all risk insights for a given tenant. Each section loads independently
 * so partial failures don't block the entire panel.
 */
export async function loadRiskInsights(tenantId: string): Promise<RiskInsightsData> {
  const result: RiskInsightsData = {
    spr: { loaded: false },
    vulnerabilities: { loaded: false },
    darkWeb: { loaded: false },
  };

  // SPR
  try {
    const [rating, history] = await Promise.all([
      fetchSecurityPostureRating(tenantId),
      fetchSecurityPostureHistory(tenantId, 'months_6'),
    ]);
    result.spr = { loaded: true, rating, history };
  } catch (err) {
    result.spr = {
      loaded: true,
      error: err instanceof Error ? err.message : 'Failed to load Security Posture Rating',
    };
  }

  // Vulnerabilities
  try {
    const countBySeverity = await fetchVulnerabilityCountBySeverity(tenantId, {
      hideResolvedVulnerabilities: true,
    });
    result.vulnerabilities = { loaded: true, countBySeverity };
  } catch (err) {
    result.vulnerabilities = {
      loaded: true,
      error: err instanceof Error ? err.message : 'Failed to load vulnerability data',
    };
  }

  // Dark Web
  try {
    const [report, exposuresResponse] = await Promise.all([
      fetchDarkWebReport(tenantId),
      fetchDarkWebExposures(tenantId, { page: 1, pageSize: 25 }),
    ]);
    result.darkWeb = {
      loaded: true,
      report,
      exposures: exposuresResponse.data,
      exposuresMeta: exposuresResponse.meta,
    };
  } catch (err) {
    result.darkWeb = {
      loaded: true,
      error: err instanceof Error ? err.message : 'Failed to load dark web data',
    };
  }

  return result;
}

/**
 * Load cross-tenant risk overview (account-level, not tenant-scoped).
 * Used for the overview/dashboard to compare all tenants.
 */
export async function loadAccountRiskOverview(): Promise<{
  allTenantRatings?: PaginatedAccountTenantSpr;
  vulnByTenant?: VulnerabilityCountByTenantEntry[];
  errors: string[];
}> {
  const errors: string[] = [];
  let allTenantRatings: PaginatedAccountTenantSpr | undefined;
  let vulnByTenant: VulnerabilityCountByTenantEntry[] | undefined;

  try {
    allTenantRatings = await fetchAllTenantSecurityRatings({
      pageSize: 100,
      sortBy: 'score',
      sortOrder: 'ASC',
    });
  } catch (err) {
    errors.push(err instanceof Error ? err.message : 'Failed to load tenant SPR scores');
  }

  try {
    vulnByTenant = await fetchVulnerabilityCountByTenant({
      hideResolvedVulnerabilities: true,
    });
  } catch (err) {
    errors.push(err instanceof Error ? err.message : 'Failed to load vuln-by-tenant stats');
  }

  return { allTenantRatings, vulnByTenant, errors };
}
