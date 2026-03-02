"use strict";
/**
 * Secure Logging Service
 * Redacts sensitive data before logging
 * For production, logs should be sent to a secure backend service
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecureLogger = void 0;
class SecureLogger {
    /**
     * Log informational message (info level only in non-production)
     */
    static info(message, data) {
        if (process.env.NODE_ENV === 'production')
            return;
        console.info(message, this.redact(data));
    }
    /**
     * Log warning message with redaction
     */
    static warn(message, data) {
        if (process.env.NODE_ENV === 'production') {
            this.sendToSecureBackend('warn', message, data);
            return;
        }
        console.warn(message, this.redact(data));
    }
    /**
     * Log error message with redaction
     * In production, send to secure backend instead of console
     */
    static error(message, error) {
        if (process.env.NODE_ENV === 'production') {
            this.sendToSecureBackend('error', message, error);
            return;
        }
        console.error(message, this.redactError(error));
    }
    /**
     * Log lifecycle event (for audit trail)
     * WARNING: Ensure sensitive data is already redacted before calling this
     */
    static lifecycle(message, data) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            message,
            data: this.redact(data),
        };
        if (process.env.NODE_ENV === 'production') {
            this.sendToSecureBackend('lifecycle', message, logEntry);
        }
        else {
            console.log('[LIFECYCLE]', logEntry);
        }
    }
    /**
     * Redact sensitive fields from object
     */
    static redact(obj) {
        if (!obj)
            return obj;
        if (typeof obj !== 'object')
            return obj;
        try {
            const redacted = { ...obj };
            for (const [key, value] of Object.entries(redacted)) {
                // Check if key matches sensitive patterns
                if (this.isSensitiveKey(key)) {
                    redacted[key] = '[REDACTED]';
                    continue;
                }
                // Check if value is a sensitive string (Bearer token, etc.)
                if (typeof value === 'string' && this.isSensitiveValue(value)) {
                    redacted[key] = '[REDACTED]';
                    continue;
                }
                // Recursively redact nested objects
                if (typeof value === 'object' && value !== null) {
                    redacted[key] = this.redact(value);
                }
            }
            return redacted;
        }
        catch {
            return '[ERROR_REDACTING]';
        }
    }
    /**
     * Redact error object
     */
    static redactError(error) {
        if (!error)
            return error;
        const redacted = {};
        if (error instanceof Error) {
            redacted.message = error.message;
            redacted.name = error.name;
            // Don't include stack trace in production logs
            if (process.env.NODE_ENV !== 'production') {
                redacted.stack = error.stack;
            }
        }
        else if (typeof error === 'object') {
            redacted.type = typeof error;
            redacted.message = error.message || String(error);
        }
        else {
            redacted.message = String(error);
        }
        return this.redact(redacted);
    }
    /**
     * Check if key contains sensitive patterns
     */
    static isSensitiveKey(key) {
        const keyLower = key.toLowerCase();
        return this.SENSITIVE_KEYS.some((k) => keyLower.includes(k));
    }
    /**
     * Check if value looks like sensitive data
     */
    static isSensitiveValue(value) {
        return (value.startsWith('Bearer ') ||
            value.length > 100 || // Long strings (likely tokens)
            /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/.test(value) // JWT format
        );
    }
    /**
     * Send log to secure backend (not to console)
     * Implement this to forward logs to your logging service
     * Example: Splunk, DataDog, ELK Stack, etc.
     */
    static sendToSecureBackend(level, message, data) {
        // TODO: Implement secure backend logging
        // Example:
        // fetch('/api/logs', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     level,
        //     message,
        //     timestamp: new Date().toISOString(),
        //     data: this.redact(data),
        //   }),
        // }).catch(() => {
        //   // Fail silently to avoid breaking app
        // });
    }
}
exports.SecureLogger = SecureLogger;
SecureLogger.SENSITIVE_KEYS = [
    'key',
    'token',
    'password',
    'api',
    'secret',
    'credential',
    'bearer',
    'authorization',
];
exports.default = SecureLogger;
//# sourceMappingURL=secure-logger.js.map