/**
 * Blackpoint Cyber API Client
 * Handles authentication and HTTP requests
 */
import { ApiDiscoveryResult } from '../types/blackpoint.types';
export declare class BlackpointApiClient {
    private baseUrl;
    private apiKey;
    private rateLimiter;
    constructor();
    /**
     * Make an authenticated GET request to the API
     */
    get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T>;
    /**
     * Make an authenticated POST request to the API
     */
    post<T>(endpoint: string, body?: unknown): Promise<T>;
    /**
     * Build full URL with query parameters
     */
    private buildUrl;
    /**
     * Execute HTTP request with error handling
     */
    private request;
    /**
     * Probe API to discover available endpoints
     */
    discoverEndpoints(): Promise<ApiDiscoveryResult[]>;
    /**
     * Test connection to API
     */
    testConnection(): Promise<boolean>;
}
export declare const createApiClient: () => BlackpointApiClient;
//# sourceMappingURL=blackpoint-api.service.d.ts.map