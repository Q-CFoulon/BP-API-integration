/**
 * Blackpoint Tenant Monitoring Dashboard
 * Professional SOC Operations dashboard for tenant oversight
 *
 * Inspired by Quisitive Spyglass MDR design
 */
import React from 'react';
import { Tenant, Notification } from '../types/blackpoint.types';
interface TenantDashboardProps {
    tenants: Tenant[];
    notifications: Notification[];
    refreshInterval?: number;
    onRefresh?: () => Promise<void>;
}
export declare const TenantDashboard: React.FC<TenantDashboardProps>;
export default TenantDashboard;
//# sourceMappingURL=TenantDashboard.d.ts.map