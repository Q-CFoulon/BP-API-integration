/**
 * Blackpoint Cyber API Configuration
 */
export declare class BlackpointConfig {
    static readonly BASE_URL: string;
    static readonly API_KEY: string;
    static readonly API_VERSION = "v1";
    static getFullUrl(path: string): string;
    static validate(): {
        valid: boolean;
        errors: string[];
    };
}
/**
 * Known API endpoints (discovered from real API testing)
 */
export declare const BLACKPOINT_ENDPOINTS: {
    readonly TENANTS: "/tenants";
    readonly NOTIFICATIONS: "/notifications";
};
//# sourceMappingURL=blackpoint.config.d.ts.map