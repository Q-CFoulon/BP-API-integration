/**
 * Input Sanitization Service
 * Prevents XSS, injection attacks, and formula injection
 */
export declare class InputSanitizer {
    /**
     * Sanitize text for safe display in HTML/React
     * Escapes HTML characters and limits length
     */
    static sanitizeText(input: string | undefined | null, maxLength?: number): string;
    /**
     * Sanitize CSV field to prevent formula injection
     * Escapes leading special characters and quotes
     */
    static sanitizeCsvField(field: string | number | undefined | null): string;
    /**
     * Sanitize filename to prevent directory traversal
     */
    static sanitizeFilename(filename: string): string;
    /**
     * Validate alert status against allowed values
     */
    static validateAlertStatus(status: string): boolean;
    /**
     * Validate severity against allowed values
     */
    static validateSeverity(severity: string): boolean;
    /**
     * Validate URL to prevent open redirect
     */
    static validateUrl(url: string): boolean;
    /**
     * Sanitize object for safe JSON serialization
     * Removes circular references and dangerous keys
     */
    static sanitizeObject(obj: any, depth?: number): any;
    /**
     * Privacy-safe user identifier (remove domain if email)
     */
    static sanitizeUserIdentifier(user: string | undefined): string;
    /**
     * Check if key is dangerous (could expose internals)
     */
    private static isDangerousKey;
}
export default InputSanitizer;
//# sourceMappingURL=input-sanitizer.d.ts.map