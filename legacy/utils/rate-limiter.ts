/**
 * Rate Limiter Service
 * Prevents DoS attacks and excessive API calls
 */

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

export class RateLimiter {
  private requestCounts: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.windowMs = config.windowMs || 60000; // Default: 1 minute
    this.maxRequests = config.maxRequests || 30; // Default: 30 requests per minute
  }

  /**
   * Check if request is allowed
   * Throws error if rate limit exceeded
   */
  async checkLimit(key: string): Promise<void> {
    const now = Date.now();
    const requests = this.requestCounts.get(key) || [];

    // Remove old requests outside the window
    const recentRequests = requests.filter((time) => now - time < this.windowMs);

    if (recentRequests.length >= this.maxRequests) {
      throw new Error(
        `Rate limit exceeded: ${this.maxRequests} requests per ${this.formatTime(this.windowMs)}`
      );
    }

    // Add current request
    recentRequests.push(now);
    this.requestCounts.set(key, recentRequests);
  }

  /**
   * Get remaining requests for key
   */
  getRemainingRequests(key: string): number {
    const now = Date.now();
    const requests = this.requestCounts.get(key) || [];
    const recentRequests = requests.filter((time) => now - time < this.windowMs);
    return Math.max(0, this.maxRequests - recentRequests.length);
  }

  /**
   * Get time until rate limit resets
   */
  getResetTime(key: string): number | null {
    const requests = this.requestCounts.get(key);
    if (!requests || requests.length === 0) return null;

    const now = Date.now();
    const oldest = Math.min(...requests);
    const resetTime = oldest + this.windowMs;

    return Math.max(0, resetTime - now);
  }

  /**
   * Create decorator for rate limiting
   */
  withRateLimit(key: string) {
    return async (fn: () => Promise<any>) => {
      await this.checkLimit(key);
      return fn();
    };
  }

  /**
   * Reset rate limit for key
   */
  reset(key?: string): void {
    if (key) {
      this.requestCounts.delete(key);
    } else {
      this.requestCounts.clear();
    }
  }

  /**
   * Format milliseconds to readable time
   */
  private formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);

    if (minutes > 0) return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
}

/**
 * Different rate limit presets
 */
export const RateLimitPresets = {
  STRICT: { windowMs: 60000, maxRequests: 10 }, // 10 per minute
  MODERATE: { windowMs: 60000, maxRequests: 30 }, // 30 per minute
  RELAXED: { windowMs: 60000, maxRequests: 100 }, // 100 per minute
  API_CALLS: { windowMs: 60000, maxRequests: 60 }, // 1 per second
  EXPENSIVE_OPERATION: { windowMs: 300000, maxRequests: 5 }, // 5 per 5 minutes
};

export default RateLimiter;
