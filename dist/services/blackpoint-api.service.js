"use strict";
/**
 * Blackpoint Cyber API Client
 * Handles authentication and HTTP requests
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiClient = exports.BlackpointApiClient = void 0;
const blackpoint_config_1 = require("../utils/blackpoint.config");
const secure_logger_1 = __importDefault(require("../utils/secure-logger"));
const rate_limiter_1 = __importDefault(require("../utils/rate-limiter"));
class BlackpointApiClient {
    constructor() {
        this.baseUrl = blackpoint_config_1.BlackpointConfig.BASE_URL;
        this.apiKey = blackpoint_config_1.BlackpointConfig.API_KEY;
        this.rateLimiter = new rate_limiter_1.default({ windowMs: 60000, maxRequests: 60 });
        const validation = blackpoint_config_1.BlackpointConfig.validate();
        if (!validation.valid) {
            secure_logger_1.default.warn('API Configuration Issues', { errors: validation.errors });
        }
    }
    /**
     * Make an authenticated GET request to the API
     */
    async get(endpoint, params) {
        const url = this.buildUrl(endpoint, params);
        return this.request(url, 'GET');
    }
    /**
     * Make an authenticated POST request to the API
     */
    async post(endpoint, body) {
        const url = this.buildUrl(endpoint);
        return this.request(url, 'POST', body);
    }
    /**
     * Build full URL with query parameters
     */
    buildUrl(endpoint, params) {
        const fullUrl = blackpoint_config_1.BlackpointConfig.getFullUrl(endpoint);
        if (!params)
            return fullUrl;
        const queryString = Object.entries(params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
        return queryString ? `${fullUrl}?${queryString}` : fullUrl;
    }
    /**
     * Execute HTTP request with error handling
     */
    async request(url, method, body) {
        try {
            // Check rate limit
            await this.rateLimiter.checkLimit('api_requests');
            const headers = {
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
                secure_logger_1.default.info(`API returned status ${response.status}`);
                throw new Error(`API request failed with status ${response.status}`);
            }
            return (await response.json());
        }
        catch (error) {
            // Use secure logger - redacts sensitive data
            secure_logger_1.default.error('API request failed', error);
            throw error;
        }
    }
    /**
     * Probe API to discover available endpoints
     */
    async discoverEndpoints() {
        const endpointsToProbe = [
            { endpoint: blackpoint_config_1.BLACKPOINT_ENDPOINTS.TENANTS, method: 'GET' },
            { endpoint: blackpoint_config_1.BLACKPOINT_ENDPOINTS.ALERTS, method: 'GET' },
            { endpoint: blackpoint_config_1.BLACKPOINT_ENDPOINTS.INCIDENTS, method: 'GET' },
            { endpoint: '/health', method: 'GET' },
            { endpoint: '/status', method: 'GET' },
        ];
        const results = [];
        for (const probe of endpointsToProbe) {
            try {
                const url = blackpoint_config_1.BlackpointConfig.getFullUrl(probe.endpoint);
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
            }
            catch (error) {
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
    async testConnection() {
        try {
            const results = await this.discoverEndpoints();
            const supported = results.filter((r) => r.supported);
            return supported.length > 0;
        }
        catch {
            return false;
        }
    }
}
exports.BlackpointApiClient = BlackpointApiClient;
const createApiClient = () => {
    return new BlackpointApiClient();
};
exports.createApiClient = createApiClient;
//# sourceMappingURL=blackpoint-api.service.js.map