/**
 * Blackpoint Tenant Service
 * Handles tenant data fetching and management
 */
import { BlackpointApiClient } from './blackpoint-api.service';
import { Tenant } from '../types/blackpoint.types';
export declare class TenantService {
    private apiClient;
    constructor(apiClient: BlackpointApiClient);
    /**
     * Fetch all tenants
     */
    fetchAllTenants(): Promise<Tenant[]>;
    /**
     * Get tenant by ID
     */
    getTenantById(tenantId: string): Promise<Tenant | null>;
    /**
     * Get tenant by name
     */
    getTenantByName(name: string): Promise<Tenant | null>;
}
export declare const createTenantService: (apiClient: BlackpointApiClient) => TenantService;
//# sourceMappingURL=tenant.service.d.ts.map