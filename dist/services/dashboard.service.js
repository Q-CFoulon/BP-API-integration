"use strict";
/**
 * Dashboard Service
 * Aggregates tenant and notification data for monitoring
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDashboardService = exports.DashboardService = void 0;
const tenant_service_1 = require("./tenant.service");
class DashboardService {
    constructor(apiClient) {
        this.apiClient = apiClient;
        this.tenantService = new tenant_service_1.TenantService(apiClient);
    }
    /**
     * Get complete dashboard summary
     */
    async getDashboardSummary() {
        try {
            const [tenants, notifications] = await Promise.all([
                this.tenantService.fetchAllTenants(),
                this.fetchNotifications(),
            ]);
            return {
                totalTenants: tenants.length,
                tenants: tenants.sort((a, b) => a.name.localeCompare(b.name)),
                notifications,
            };
        }
        catch (error) {
            console.error('Failed to generate dashboard summary:', error);
            throw error;
        }
    }
    /**
     * Fetch notifications
     */
    async fetchNotifications() {
        try {
            const response = await this.apiClient.get('/notifications');
            return response.data;
        }
        catch (error) {
            console.error('Failed to fetch notifications:', error);
            return [];
        }
    }
}
exports.DashboardService = DashboardService;
const createDashboardService = (apiClient) => {
    return new DashboardService(apiClient);
};
exports.createDashboardService = createDashboardService;
//# sourceMappingURL=dashboard.service.js.map