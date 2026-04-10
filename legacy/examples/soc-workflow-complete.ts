/**
 * Blackpoint Tenant Monitoring Workflow
 * Demonstrates real-time tenant monitoring and system status
 */

import 'dotenv/config';
import { createApiClient } from '../services/blackpoint-api.service';
import { createDashboardService } from '../services/dashboard.service';

export async function socAlertWorkflow() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('     Blackpoint Tenant Monitor - Dashboard');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Initialize services
  const apiClient = createApiClient();
  const dashboardService = createDashboardService(apiClient);

  try {
    // ═─ Step 1: Test API Connection ─═
    console.log('Step 1: Testing API Connection...');
    console.log('  API URL:', process.env.BLACKPOINT_API_URL || 'https://api.blackpointcyber.com');
    console.log('  API Key set:', !!process.env.BLACKPOINT_API_KEY);
    const connected = await apiClient.testConnection();
    if (!connected) {
      console.error('  ✗ Failed to connect. Trying endpoint discovery...');
      const results = await apiClient.discoverEndpoints();
      console.error('  Probe results:', results);
      throw new Error('Failed to connect to Blackpoint API - check credentials and network');
    }
    console.log('✓ Connected to Blackpoint API\n');

    // ═─ Step 2: Fetch Dashboard Summary ─═
    console.log('Step 2: Fetching Dashboard Data...');
    const summary = await dashboardService.getDashboardSummary();

    console.log(`\n📊 DASHBOARD SUMMARY`);
    console.log(`├─ Total Clients: ${summary.totalTenants}`);
    console.log(`├─ Notifications: ${summary.notifications.length}`);
    console.log(`└─ Status: Active\n`);

    // ═─ Step 3: Display Tenants ─═
    console.log('═══════════════════════════════════════════════════════════');
    console.log('TENANT LIST');
    console.log('═══════════════════════════════════════════════════════════\n');

    summary.tenants.forEach((tenant, index) => {
      const createdDate = new Date(tenant.created).toLocaleDateString();
      console.log(`${index + 1}. ${tenant.name}`);
      console.log(`   ├─ ID: ${tenant.id}`);
      console.log(`   ├─ Domain: ${tenant.domain}`);
      console.log(`   ├─ Created: ${createdDate}`);
      console.log(`   └─ Email Delivery: ${tenant.enableDeliveryEmail ? 'Enabled' : 'Disabled'}\n`);
    });

    // ═─ Step 4: Display Notifications ─═
    if (summary.notifications.length > 0) {
      console.log('═══════════════════════════════════════════════════════════');
      console.log('RECENT NOTIFICATIONS');
      console.log('═══════════════════════════════════════════════════════════\n');

      summary.notifications.forEach((notification, index) => {
        console.log(`${index + 1}. ${notification.message}`);
        console.log(`   └─ Created: ${new Date(notification.createdAt).toLocaleString()}\n`);
      });
    } else {
      console.log('✓ No active notifications\n');
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log('Dashboard refresh complete!');
    console.log('═══════════════════════════════════════════════════════════');

  } catch (error) {
    console.error('\n❌ ERROR:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Please check your API credentials and network connection.');
    process.exit(1);
  }
}

// Run workflow only when executed directly
if (require.main === module) {
  socAlertWorkflow().catch(console.error);
}
