"use strict";
/**
 * Blackpoint Tenant Service
 * Handles tenant data fetching and management
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTenantService = exports.TenantService = void 0;
const blackpoint_config_1 = require("../utils/blackpoint.config");
class TenantService {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }
    /**
     * Fetch all tenants
     */
    async fetchAllTenants() {
        const response = await this.apiClient.get(blackpoint_config_1.BLACKPOINT_ENDPOINTS.TENANTS);
        return response.data;
    }
    /**
     * Get tenant by ID
     */
    async getTenantById(tenantId) {
        const tenants = await this.fetchAllTenants();
        return tenants.find((t) => t.id === tenantId) || null;
    }
    /**
     * Get tenant by name
     */
    async getTenantByName(name) {
        const tenants = await this.fetchAllTenants();
        return tenants.find((t) => t.name === name) || null;
    }
}
exports.TenantService = TenantService;
const createTenantService = (apiClient) => {
    return new TenantService(apiClient);
};
exports.createTenantService = createTenantService;
//# sourceMappingURL=tenant.service.js.map