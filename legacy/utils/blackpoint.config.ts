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
 * Known API endpoints (discovered from real API testing)
 */
export const BLACKPOINT_ENDPOINTS = {
  // Working endpoints
  TENANTS: '/tenants',
  NOTIFICATIONS: '/notifications',
  
  // Note: The following endpoints were tested and are NOT available:
  // - /alerts (404)
  // - /incidents (403)
  // - /tenants/:tenantId/alerts (404)
  // - /tenants/:tenantId (404)
} as const;
