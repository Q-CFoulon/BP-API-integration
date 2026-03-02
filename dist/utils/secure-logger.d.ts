/**
 * Secure Logging Service
 * Redacts sensitive data before logging
 * For production, logs should be sent to a secure backend service
 */
export declare class SecureLogger {
    private static readonly SENSITIVE_KEYS;
    /**
     * Log informational message (info level only in non-production)
     */
    static info(message: string, data?: any): void;
    /**
     * Log warning message with redaction
     */
    static warn(message: string, data?: any): void;
    /**
     * Log error message with redaction
     * In production, send to secure backend instead of console
     */
    static error(message: string, error?: any): void;
    /**
     * Log lifecycle event (for audit trail)
     * WARNING: Ensure sensitive data is already redacted before calling this
     */
    static lifecycle(message: string, data?: any): void;
    /**
     * Redact sensitive fields from object
     */
    private static redact;
    /**
     * Redact error object
     */
    private static redactError;
    /**
     * Check if key contains sensitive patterns
     */
    private static isSensitiveKey;
    /**
     * Check if value looks like sensitive data
     */
    private static isSensitiveValue;
    /**
     * Send log to secure backend (not to console)
     * Implement this to forward logs to your logging service
     * Example: Splunk, DataDog, ELK Stack, etc.
     */
    private static sendToSecureBackend;
}
export default SecureLogger;
//# sourceMappingURL=secure-logger.d.ts.map