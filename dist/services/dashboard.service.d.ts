/**
 * Dashboard Service
 * Aggregates tenant and notification data for monitoring
 */
import { BlackpointApiClient } from './blackpoint-api.service';
import { DashboardSummary } from '../types/blackpoint.types';
export declare class DashboardService {
    private apiClient;
    private tenantService;
    constructor(apiClient: BlackpointApiClient);
    /**
     * Get complete dashboard summary
     */
    getDashboardSummary(): Promise<DashboardSummary>;
    /**
     * Fetch notifications
     */
    private fetchNotifications;
}
export declare const createDashboardService: (apiClient: BlackpointApiClient) => DashboardService;
//# sourceMappingURL=dashboard.service.d.ts.map