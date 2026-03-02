"use strict";
/**
 * Blackpoint Alert Service
 * Handles alert/incident fetching and filtering
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAlertService = exports.AlertService = void 0;
const blackpoint_config_1 = require("../utils/blackpoint.config");
class AlertService {
    constructor(apiClient) {
        this.apiClient = apiClient;
        this.discoveredAlertEndpoint = null;
    }
    /**
     * Discover which endpoint to use for alerts
     */
    async discoverAlertEndpoint() {
        if (this.discoveredAlertEndpoint) {
            return this.discoveredAlertEndpoint;
        }
        const endpointsToTry = [
            blackpoint_config_1.BLACKPOINT_ENDPOINTS.ALERTS,
            blackpoint_config_1.BLACKPOINT_ENDPOINTS.INCIDENTS,
            '/alerts',
            '/incidents',
            '/tickets',
        ];
        for (const endpoint of endpointsToTry) {
            try {
                const result = await this.apiClient.get(endpoint, {
                    pageSize: 1,
                    page: 1,
                });
                if (result && result.data !== undefined) {
                    this.discoveredAlertEndpoint = endpoint;
                    console.log(`Discovered alert endpoint: ${endpoint}`);
                    return endpoint;
                }
            }
            catch (error) {
                // Continue to next endpoint
            }
        }
        throw new Error('Could not discover alert endpoint from API');
    }
    /**
     * Fetch outstanding/open alerts for all tenants
     */
    async fetchOutstandingAlerts() {
        const endpoint = await this.discoverAlertEndpoint();
        const allAlerts = [];
        let currentPage = 1;
        let totalPages = 1;
        while (currentPage <= totalPages) {
            const data = await this.apiClient.get(endpoint, {
                page: currentPage,
                pageSize: 100,
                status: JSON.stringify(['open', 'outstanding']),
            });
            allAlerts.push(...data.data);
            totalPages = data.meta.totalPages;
            currentPage++;
        }
        return allAlerts;
    }
    /**
     * Fetch alerts for a specific tenant
     */
    async fetchTenantAlerts(tenantId, options = {}) {
        const endpoint = await this.discoverAlertEndpoint();
        const allAlerts = [];
        let currentPage = options.page || 1;
        const pageSize = options.pageSize || 50;
        let totalPages = 1;
        while (currentPage <= totalPages) {
            const params = {
                page: currentPage,
                pageSize,
                tenantId,
            };
            if (options.status?.length) {
                params.status = JSON.stringify(options.status);
            }
            if (options.sortBy) {
                params.sortBy = options.sortBy;
            }
            if (options.sortOrder) {
                params.sortOrder = options.sortOrder;
            }
            const data = await this.apiClient.get(endpoint, params);
            allAlerts.push(...data.data);
            totalPages = data.meta.totalPages;
            currentPage++;
        }
        return allAlerts;
    }
    /**
     * Fetch alerts with specific statuses
     */
    async fetchAlertsByStatus(statuses) {
        const endpoint = await this.discoverAlertEndpoint();
        const allAlerts = [];
        let currentPage = 1;
        let totalPages = 1;
        while (currentPage <= totalPages) {
            const data = await this.apiClient.get(endpoint, {
                page: currentPage,
                pageSize: 100,
                status: JSON.stringify(statuses),
            });
            allAlerts.push(...data.data);
            totalPages = data.meta.totalPages;
            currentPage++;
        }
        return allAlerts;
    }
    /**
     * Get single alert by ID
     */
    async fetchAlert(alertId) {
        const endpoint = await this.discoverAlertEndpoint();
        return this.apiClient.get(`${endpoint}/${alertId}`);
    }
}
exports.AlertService = AlertService;
const createAlertService = (apiClient) => {
    return new AlertService(apiClient);
};
exports.createAlertService = createAlertService;
//# sourceMappingURL=alert.service.js.map