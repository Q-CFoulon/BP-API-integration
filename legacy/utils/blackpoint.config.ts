/**
 * Blackpoint Cyber API Configuration
 */

export class BlackpointConfig {
  static readonly BASE_URL = process.env.BLACKPOINT_API_URL || 'https://api.blackpointcyber.com';
  static readonly API_KEY = process.env.BLACKPOINT_API_KEY || '';
  static readonly API_VERSION = 'v1';

  static getFullUrl(path: string): string {
    return `${this.BASE_URL}/${this.API_VERSION}${path}`;
  }

  static validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.API_KEY) {
      errors.push('BLACKPOINT_API_KEY environment variable not set');
    }

    if (!this.BASE_URL) {
      errors.push('BLACKPOINT_API_URL environment variable not set (using default)');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

/**
 * API endpoints from CompassOne API v1.4.0 spec
 */
export const BLACKPOINT_ENDPOINTS = {
  // Tenants
  TENANTS: '/tenants',

  // Alert Groups (Detections) — use x-tenant-id header to scope by tenant
  ALERT_GROUPS: '/alert-groups',
  ALERT_GROUPS_BY_WEEK: '/alert-groups/alert-groups-by-week',
  ALERT_GROUPS_COUNT: '/alert-groups/count',
  TOP_DETECTIONS_BY_ENTITY: '/alert-groups/top-detections-by-entity',
  TOP_DETECTIONS_BY_THREAT: '/alert-groups/top-detections-by-threat',

  // Assets
  ASSETS: '/assets',

  // Accounts & Users
  ACCOUNTS: '/accounts',
  USERS: '/users',

  // Notification channels (event-signal)
  EVENT_SIGNAL_CHANNELS: '/event-signal/channels/list',
  EVENT_SIGNAL_EMAIL_CHANNELS: '/event-signal/email-channels',
  EVENT_SIGNAL_WEBHOOK_CHANNELS: '/event-signal/webhook-channels',
} as const;
