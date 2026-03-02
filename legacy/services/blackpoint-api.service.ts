/**
 * Blackpoint Cyber API Client
 * Handles authentication and HTTP requests
 */

import { BlackpointConfig, BLACKPOINT_ENDPOINTS } from '../utils/blackpoint.config';
import { PaginatedResponse, ApiDiscoveryResult } from '../types/blackpoint.types';
import SecureLogger from '../utils/secure-logger';
import RateLimiter from '../utils/rate-limiter';

export class BlackpointApiClient {
  private baseUrl: string;
  private apiKey: string;
  private rateLimiter: RateLimiter;

  constructor() {
    this.baseUrl = BlackpointConfig.BASE_URL;
    this.apiKey = BlackpointConfig.API_KEY;
    this.rateLimiter = new RateLimiter({ windowMs: 60000, maxRequests: 60 });

    const validation = BlackpointConfig.validate();
    if (!validation.valid) {
      SecureLogger.warn('API Configuration Issues', { errors: validation.errors });
    }
  }

  /**
   * Make an authenticated GET request to the API
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    return this.request<T>(url, 'GET');
  }

  /**
   * Make an authenticated POST request to the API
   */
  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    const url = this.buildUrl(endpoint);
    return this.request<T>(url, 'POST', body);
  }

  /**
   * Build full URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const fullUrl = BlackpointConfig.getFullUrl(endpoint);
    if (!params) return fullUrl;

    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    return queryString ? `${fullUrl}?${queryString}` : fullUrl;
  }

  /**
   * Execute HTTP request with error handling
   */
  private async request<T>(url: string, method: string, body?: unknown): Promise<T> {
    try {
      // Check rate limit
      await this.rateLimiter.checkLimit('api_requests');

      const headers: Record<string, string> = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        // Don't expose internal URL structure in error message
        SecureLogger.info(`API returned status ${response.status}`);
        throw new Error(`API request failed with status ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      // Use secure logger - redacts sensitive data
      SecureLogger.error('API request failed', error);
      throw error;
    }
  }

  /**
   * Probe API to discover available endpoints
   */
  async discoverEndpoints(): Promise<ApiDiscoveryResult[]> {
    const endpointsToProbe = [
      { endpoint: BLACKPOINT_ENDPOINTS.TENANTS, method: 'GET' },
      { endpoint: BLACKPOINT_ENDPOINTS.NOTIFICATIONS, method: 'GET' },
    ];

    const results: ApiDiscoveryResult[] = [];

    for (const probe of endpointsToProbe) {
      try {
        const url = BlackpointConfig.getFullUrl(probe.endpoint);
        const headers = {
          'Authorization': `Bearer ${this.apiKey}`,
        };

        const response = await fetch(url, {
          method: probe.method,
          headers,
        });

        results.push({
          endpoint: probe.endpoint,
          method: probe.method,
          description: `Endpoint ${probe.endpoint}`,
          supported: response.ok || response.status === 400, // 400 means endpoint exists but request is incomplete
        });
      } catch (error) {
        results.push({
          endpoint: probe.endpoint,
          method: probe.method,
          description: `Endpoint ${probe.endpoint}`,
          supported: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  /**
   * Test connection to API
   */
  async testConnection(): Promise<boolean> {
    try {
      const results = await this.discoverEndpoints();
      const supported = results.filter((r) => r.supported);
      return supported.length > 0;
    } catch {
      return false;
    }
  }
}

export const createApiClient = (): BlackpointApiClient => {
  return new BlackpointApiClient();
};
