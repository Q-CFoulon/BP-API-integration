/**
 * Example usage of Blackpoint Cyber integration
 * This demonstrates how to use the services for SOC monitoring
 */

import { createApiClient } from './services/blackpoint-api.service';
import { createDashboardService } from './services/dashboard.service';
import { createTenantService } from './services/tenant.service';
import { createAlertService } from './services/alert.service';

/**
 * Main entry point for dashboard data collection
 */
export async function runDashboard() {
  try {
    // Initialize API client
    const apiClient = createApiClient();

    // Test connection and discover endpoints
    console.log('Testing API connection...');
    const connected = await apiClient.testConnection();
    if (!connected) {
      console.error('Failed to connect to Blackpoint API. Check credentials.');
      process.exit(1);
    }

    console.log('✓ Connected to Blackpoint API');

    // Discover available endpoints
    const endpoints = await apiClient.discoverEndpoints();
    console.log('\nDiscovered Endpoints:');
    endpoints.forEach((ep) => {
      const status = ep.supported ? '✓' : '✗';
      console.log(`  ${status} ${ep.method} ${ep.endpoint}`);
    });

    // Get dashboard service
    const dashboardService = createDashboardService(apiClient);

    // Fetch and display dashboard summary
    console.log('\n📊 Fetching Dashboard Summary...');
    const summary = await dashboardService.getDashboardSummary();

    console.log(`\n━━━━━━━━━━━━━━━━ BLACKPOINT SOC DASHBOARD ━━━━━━━━━━━━━━━━`);
    console.log(`Total Clients: ${summary.totalTenants}`);
    console.log(`Total Outstanding Alerts: ${summary.totalOutstandingAlerts}`);

    console.log(`\nAlerts by Severity:`);
    console.log(`  🔴 Critical: ${summary.alertsBySeverity.critical}`);
    console.log(`  🟠 High: ${summary.alertsBySeverity.high}`);
    console.log(`  🟡 Medium: ${summary.alertsBySeverity.medium}`);
    console.log(`  🔵 Low: ${summary.alertsBySeverity.low}`);
    console.log(`  ⚪ Info: ${summary.alertsBySeverity.info}`);

    // Display top 10 clients with most alerts
    console.log(`\n━━━━━━━━━━━━━━━━ TOP CLIENTS BY ALERT COUNT ━━━━━━━━━━━━━━━━`);
    summary.tenantAlerts.slice(0, 10).forEach((tenant, index) => {
      console.log(
        `${index + 1}. ${tenant.tenantName.padEnd(30)} ` +
        `Total: ${tenant.totalAlerts.toString().padEnd(4)} | ` +
        `Open: ${tenant.openAlerts} | Outstanding: ${tenant.outstandingAlerts}`
      );
    });

    // Fetch and display critical alerts
    console.log(`\n━━━━━━━━━━━━━━━━ CRITICAL ALERTS ━━━━━━━━━━━━━━━━`);
    const criticalAlerts = await dashboardService.getCriticalAlerts();
    if (criticalAlerts.length === 0) {
      console.log('✓ No critical alerts');
    } else {
      criticalAlerts.slice(0, 10).forEach((alert) => {
        const timestamp = new Date(alert.createdAt).toLocaleString();
        console.log(`  [${alert.severity}] ${alert.title}`);
        console.log(`      Client: ${alert.tenantName}`);
        console.log(`      Created: ${timestamp}`);
        console.log();
      });
    }

    console.log('✓ Dashboard refresh complete');
  } catch (error) {
    console.error('Dashboard error:', error);
    process.exit(1);
  }
}

/**
 * Example: Get detail view for a specific client
 */
export async function getClientDetails(clientName: string) {
  try {
    const apiClient = createApiClient();
    const dashboardService = createDashboardService(apiClient);

    const details = await dashboardService.getTenantAlertDetails(clientName);

    console.log(`\n━━━━━━━━━━━━━━━━ ${details.summary.tenantName.toUpperCase()} ━━━━━━━━━━━━━━━━`);
    console.log(`Total Alerts: ${details.summary.totalAlerts}`);
    console.log(`Open: ${details.summary.openAlerts}`);
    console.log(`Outstanding: ${details.summary.outstandingAlerts}`);
    console.log(`Most Recent: ${details.summary.mostRecentAlert || 'N/A'}`);

    console.log(`\nAlerts:`);
    details.alerts.forEach((alert) => {
      console.log(
        `  [${alert.severity}] ${alert.status.toUpperCase()}: ${alert.title} ` +
        `(${new Date(alert.createdAt).toLocaleDateString()})`
      );
    });
  } catch (error) {
    console.error('Error fetching client details:', error);
  }
}

/**
 * Example: Monitor for new alerts periodically
 */
export async function monitorAlerts(intervalSeconds: number = 300) {
  try {
    const apiClient = createApiClient();
    const dashboardService = createDashboardService(apiClient);

    console.log(
      `🔍 Starting alert monitor (refreshing every ${intervalSeconds} seconds)...\n`
    );

    setInterval(async () => {
      try {
        const summary = await dashboardService.getDashboardSummary();
        const criticalAlerts = await dashboardService.getCriticalAlerts();

        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] Outstanding Alerts: ${summary.totalOutstandingAlerts} | Critical: ${criticalAlerts.length}`);

        if (criticalAlerts.length > 0) {
          console.log('  ⚠️ Critical alerts detected:');
          criticalAlerts.slice(0, 3).forEach((alert) => {
            console.log(`    - ${alert.tenantName}: ${alert.title}`);
          });
        }
      } catch (error) {
        console.error(`[${timestamp}] Monitor error:`, error);
      }
    }, intervalSeconds * 1000);

    // Let it run
    process.on('SIGINT', () => {
      console.log('\n✓ Monitor stopped');
      process.exit(0);
    });
  } catch (error) {
    console.error('Monitor error:', error);
  }
}

// Main execution (uncomment to run)
// runDashboard().catch(console.error);
