/**
 * Rate Limiter Service
 * Prevents DoS attacks and excessive API calls
 */
export interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
}
export declare class RateLimiter {
    private requestCounts;
    private readonly windowMs;
    private readonly maxRequests;
    constructor(config?: Partial<RateLimitConfig>);
    /**
     * Check if request is allowed
     * Throws error if rate limit exceeded
     */
    checkLimit(key: string): Promise<void>;
    /**
     * Get remaining requests for key
     */
    getRemainingRequests(key: string): number;
    /**
     * Get time until rate limit resets
     */
    getResetTime(key: string): number | null;
    /**
     * Create decorator for rate limiting
     */
    withRateLimit(key: string): (fn: () => Promise<any>) => Promise<any>;
    /**
     * Reset rate limit for key
     */
    reset(key?: string): void;
    /**
     * Format milliseconds to readable time
     */
    private formatTime;
}
/**
 * Different rate limit presets
 */
export declare const RateLimitPresets: {
    STRICT: {
        windowMs: number;
        maxRequests: number;
    };
    MODERATE: {
        windowMs: number;
        maxRequests: number;
    };
    RELAXED: {
        windowMs: number;
        maxRequests: number;
    };
    API_CALLS: {
        windowMs: number;
        maxRequests: number;
    };
    EXPENSIVE_OPERATION: {
        windowMs: number;
        maxRequests: number;
    };
};
export default RateLimiter;
//# sourceMappingURL=rate-limiter.d.ts.map