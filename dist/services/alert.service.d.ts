/**
 * Blackpoint Alert Service
 * Handles alert/incident fetching and filtering
 */
import { BlackpointApiClient } from './blackpoint-api.service';
import { Alert, AlertStatus } from '../types/blackpoint.types';
export interface AlertFetchOptions {
    page?: number;
    pageSize?: number;
    status?: AlertStatus[];
    tenantId?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
export declare class AlertService {
    private apiClient;
    private discoveredAlertEndpoint;
    constructor(apiClient: BlackpointApiClient);
    /**
     * Discover which endpoint to use for alerts
     */
    discoverAlertEndpoint(): Promise<string>;
    /**
     * Fetch outstanding/open alerts for all tenants
     */
    fetchOutstandingAlerts(): Promise<Alert[]>;
    /**
     * Fetch alerts for a specific tenant
     */
    fetchTenantAlerts(tenantId: string, options?: AlertFetchOptions): Promise<Alert[]>;
    /**
     * Fetch alerts with specific statuses
     */
    fetchAlertsByStatus(statuses: AlertStatus[]): Promise<Alert[]>;
    /**
     * Get single alert by ID
     */
    fetchAlert(alertId: string): Promise<Alert>;
}
export declare const createAlertService: (apiClient: BlackpointApiClient) => AlertService;
//# sourceMappingURL=alert.service.d.ts.map