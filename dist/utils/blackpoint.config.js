"use strict";
/**
 * Blackpoint Cyber API Configuration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BLACKPOINT_ENDPOINTS = exports.BlackpointConfig = void 0;
class BlackpointConfig {
    static getFullUrl(path) {
        return `${this.BASE_URL}/${this.API_VERSION}${path}`;
    }
    static validate() {
        const errors = [];
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
exports.BlackpointConfig = BlackpointConfig;
BlackpointConfig.BASE_URL = process.env.BLACKPOINT_API_URL || 'https://api.blackpointcyber.com';
BlackpointConfig.API_KEY = process.env.BLACKPOINT_API_KEY || '';
BlackpointConfig.API_VERSION = 'v1';
/**
 * Known API endpoints (discovered from real API testing)
 */
exports.BLACKPOINT_ENDPOINTS = {
    // Working endpoints
    TENANTS: '/tenants',
    NOTIFICATIONS: '/notifications',
    // Note: The following endpoints were tested and are NOT available:
    // - /alerts (404)
    // - /incidents (403)
    // - /tenants/:tenantId/alerts (404)
    // - /tenants/:tenantId (404)
};
//# sourceMappingURL=blackpoint.config.js.map