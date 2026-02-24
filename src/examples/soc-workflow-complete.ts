/**
 * Complete SOC Alert Management Workflow Example
 * Demonstrates full lifecycle: fetching, tracking, investigating, and resolving alerts
 */

import { createApiClient } from '../services/blackpoint-api.service';
import { createDashboardService } from '../services/dashboard.service';
import { createLifecycleService } from '../services/lifecycle.service';
import { Alert } from '../types/blackpoint.types';

export async function socAlertWorkflow() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('     SOC Alert Management System - Complete Workflow');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Initialize services
  const apiClient = createApiClient();
  const dashboardService = createDashboardService(apiClient);
  const lifecycleService = createLifecycleService();

  try {
    // ═─ Step 1: Test API Connection ─═
    console.log('Step 1: Testing API Connection...');
    if (process.env.NODE_ENV !== 'production') {
      console.log('  API URL:', process.env.BLACKPOINT_API_URL || 'https://api.blackpointcyber.com');
      console.log('  API Key set:', !!process.env.BLACKPOINT_API_KEY);
    }
    const connected = await apiClient.testConnection();
    if (!connected) {
      console.error('  ✗ Failed to connect. Trying endpoint discovery...');
      const results = await apiClient.discoverEndpoints();
      console.error('  Probe results:', results);
      throw new Error('Failed to connect to Blackpoint API - check credentials and network');
    }
    console.log('✓ Connected to Blackpoint API\n');

    // ═─ Step 2: Fetch Dashboard Summary ─═
    console.log('Step 2: Fetching Outstanding Alerts...');
    const summary = await dashboardService.getDashboardSummary();

    console.log(`\n📊 DASHBOARD SUMMARY`);
    console.log(`├─ Total Clients: ${summary.totalTenants}`);
    console.log(`├─ Outstanding Alerts: ${summary.totalOutstandingAlerts}`);
    console.log(`└─ Alerts by Severity:`);
    console.log(`   ├─ 🔴 Critical: ${summary.alertsBySeverity.critical}`);
    console.log(`   ├─ 🟠 High: ${summary.alertsBySeverity.high}`);
    console.log(`   ├─ 🟡 Medium: ${summary.alertsBySeverity.medium}`);
    console.log(`   ├─ 🔵 Low: ${summary.alertsBySeverity.low}`);
    console.log(`   └─ ⚪ Info: ${summary.alertsBySeverity.info}\n`);

    // ═─ Step 3: Get Critical Alerts ─═
    console.log('Step 3: Fetching Critical Alerts...');
    const criticalAlerts = await dashboardService.getCriticalAlerts();

    if (criticalAlerts.length > 0) {
      console.log(`\n🔴 CRITICAL ALERTS (${criticalAlerts.length} total)\n`);

      criticalAlerts.slice(0, 5).forEach((alert, index) => {
        const createdAt = new Date(alert.createdAt);
        const now = new Date();
        const durationMs = now.getTime() - createdAt.getTime();
        const duration = formatDuration(durationMs);

        console.log(`${index + 1}. [${alert.severity.toUpperCase()}] ${alert.title}`);
        console.log(`   ├─ Client: ${alert.tenantName}`);
        console.log(`   ├─ Status: ${alert.status}`);
        console.log(`   ├─ Created: ${createdAt.toLocaleString()}`);
        console.log(`   ├─ Open for: ${duration}`);
        console.log(`   └─ ID: ${alert.id}\n`);

        // Initialize lifecycle tracking for this alert
        lifecycleService.initializeAlert(alert.id, alert.tenantName || '', alert.title, alert.severity);
      });
    } else {
      console.log('✓ No critical alerts detected\n');
    }

    // ═─ Step 4: Simulate SOC Workflow ─═
    if (criticalAlerts.length > 0) {
      console.log('═══════════════════════════════════════════════════════════');
      console.log('Step 4: Simulating SOC Analyst Workflow');
      console.log('═══════════════════════════════════════════════════════════\n');

      const alert = criticalAlerts[0];
      const alertId = alert.id;

      // Action 1: Acknowledge alert
      console.log(`📌 TIMELINE FOR ALERT: ${alert.title}`);
      console.log(`   Time 0s: Alert created\n`);

      lifecycleService.logAction(
        alertId,
        'acknowledged',
        'Alert acknowledged in SOC dashboard',
        'john.doe@company.com'
      );
      console.log(`   ✓ Alert acknowledged by SOC analyst (John Doe)\n`);

      // Action 2: Change status to investigating
      lifecycleService.changeStatus(alertId, 'investigating', 'Beginning investigation');
      console.log(`   ✓ Status changed to: INVESTIGATING\n`);

      // Action 3: Assign to analyst
      lifecycleService.assignAlert(alertId, 'sarah.smith@company.com');
      console.log(`   ✓ Alert assigned to: Sarah Smith\n`);

      // Action 4: Add investigation notes
      lifecycleService.addNotes(
        alertId,
        'correlates with user working from temporary location. Checking against known IPs.',
        'sarah.smith@company.com'
      );
      console.log(`   ✓ Investigation notes added\n`);

      // Action 5: Additional context
      lifecycleService.logAction(
        alertId,
        'verified_context',
        'Connected with client - confirmed legitimate remote access',
        'sarah.smith@company.com',
        { clientConfirmed: true, reason: 'WFH approval on file' }
      );
      console.log(`   ✓ Client context verified\n`);

      // Action 6: Resolve
      lifecycleService.changeStatus(alertId, 'resolved', 'Verified as legitimate activity');
      console.log(`   ✓ Alert RESOLVED\n`);

      // Get final statistics
      const stats = lifecycleService.getAlertStats(alertId);
      const lifecycle = lifecycleService.getLifecycle(alertId);

      console.log('═══════════════════════════════════════════════════════════');
      console.log('ALERT RESOLUTION SUMMARY');
      console.log('═══════════════════════════════════════════════════════════\n');

      if (stats) {
        console.log(`Alert ID: ${stats.alertId}`);
        console.log(`Status: ${stats.status}`);
        console.log(`Total Duration: ${stats.totalDurationFormatted}`);
        console.log(`Total Time (ms): ${stats.totalDuration}\n`);
      }

      if (lifecycle) {
        console.log(`Client: ${lifecycle.tenantName}`);
        console.log(`Severity: ${lifecycle.severity}`);
        console.log(`Assigned To: ${lifecycle.assignedTo}`);
        console.log(`Created: ${new Date(lifecycle.createdAt).toLocaleString()}`);
        console.log(`Closed: ${lifecycle.closedAt ? new Date(lifecycle.closedAt).toLocaleString() : 'N/A'}`);

        console.log(`\nActions Taken (${lifecycle.actions.length}):`);
        lifecycle.actions.forEach((action, idx) => {
          const time = new Date(action.timestamp).toLocaleTimeString();
          console.log(`  ${idx + 1}. [${time}] ${action.action} - ${action.description}`);
          if (action.user) console.log(`     └─ By: ${action.user}`);
        });

        if (lifecycle.notes) {
          console.log(`\nNotes:\n${lifecycle.notes}`);
        }
      }
    }

    // ═─ Step 5: Export Report ─═
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('Step 5: Generating Reports');
    console.log('═══════════════════════════════════════════════════════════\n');

    const csv = lifecycleService.exportAsCsv();
    console.log('CSV Export Preview (first 500 chars):');
    console.log(csv.substring(0, 500));
    console.log('...\n');

    // ═─ Step 6: Performance Metrics ─═
    console.log('═══════════════════════════════════════════════════════════');
    console.log('SOC PERFORMANCE METRICS');
    console.log('═══════════════════════════════════════════════════════════\n');

    const allLifecycles = lifecycleService.getAllLifecycles();
    const resolvedAlerts = allLifecycles.filter((l) => l.status === 'resolved' || l.status === 'closed');

    if (resolvedAlerts.length > 0) {
      const totalDuration = resolvedAlerts.reduce((sum, l) => sum + (l.durationMs || 0), 0);
      const avgDuration = totalDuration / resolvedAlerts.length;

      console.log(`Total Alerts Processed: ${allLifecycles.length}`);
      console.log(`Resolved: ${resolvedAlerts.length}`);
      console.log(`Outstanding: ${allLifecycles.filter((l) => l.status === 'open' || l.status === 'outstanding').length}`);
      console.log(`\nAverage Resolution Time: ${lifecycleService.formatDuration(avgDuration)}`);
      console.log(`Fastest: ${lifecycleService.formatDuration(Math.min(...resolvedAlerts.map((l) => l.durationMs || 0)))}`);
      console.log(`Slowest: ${lifecycleService.formatDuration(Math.max(...resolvedAlerts.map((l) => l.durationMs || 0)))}`);
    }

    // ═─ Complete ─═
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('✓ SOC Alert Management Workflow Complete');
    console.log('═══════════════════════════════════════════════════════════\n');
  } catch (error) {
    console.error('\n❌ Error in SOC workflow:', error);
    process.exit(1);
  }
}

function formatDuration(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(' ');
}

// Run workflow only when executed directly
if (require.main === module) {
  socAlertWorkflow().catch(console.error);
}
