/**
 * Input Sanitization Service
 * Prevents XSS, injection attacks, and formula injection
 */

export class InputSanitizer {
  /**
   * Sanitize text for safe display in HTML/React
   * Escapes HTML characters and limits length
   */
  static sanitizeText(input: string | undefined | null, maxLength: number = 500): string {
    if (!input) return '';

    return String(input)
      .slice(0, maxLength)
      .replace(/[<>\"'&]/g, (char) => {
        const escapeMap: Record<string, string> = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;',
        };
        return escapeMap[char] || char;
      });
  }

  /**
   * Sanitize CSV field to prevent formula injection
   * Escapes leading special characters and quotes
   */
  static sanitizeCsvField(field: string | number | undefined | null): string {
    if (field === undefined || field === null) return '""';

    const str = String(field);

    // Prevent formula injection by escaping leading characters
    if (/^[=+\-@]/.test(str)) {
      return `"'${str}"`;
    }

    // Escape quotes by doubling them and wrap in quotes
    const escaped = str.replace(/"/g, '""');
    return `"${escaped}"`;
  }

  /**
   * Sanitize filename to prevent directory traversal
   */
  static sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9._\-]/g, '_')
      .replace(/\.{2,}/g, '.')
      .slice(0, 255);
  }

  /**
   * Validate alert status against allowed values
   */
  static validateAlertStatus(status: string): boolean {
    const validStatuses = ['open', 'outstanding', 'investigating', 'closed', 'resolved'];
    return validStatuses.includes(String(status).toLowerCase());
  }

  /**
   * Validate severity against allowed values
   */
  static validateSeverity(severity: string): boolean {
    const validSeverities = ['critical', 'high', 'medium', 'low', 'info'];
    return validSeverities.includes(String(severity).toLowerCase());
  }

  /**
   * Validate URL to prevent open redirect
   */
  static validateUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      // Only allow HTTPS and same-origin
      return parsed.protocol === 'https:' && parsed.hostname === window.location.hostname;
    } catch {
      return false;
    }
  }

  /**
   * Sanitize object for safe JSON serialization
   * Removes circular references and dangerous keys
   */
  static sanitizeObject(obj: any, depth: number = 5): any {
    if (depth === 0) return '[MAX_DEPTH]';
    if (obj === null) return null;

    if (typeof obj !== 'object') {
      if (typeof obj === 'string') {
        return this.sanitizeText(obj, 1000);
      }
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeObject(item, depth - 1)).slice(0, 100); // Max 100 items
    }

    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
      // Skip dangerous keys
      if (this.isDangerousKey(key)) {
        continue;
      }

      sanitized[key] = this.sanitizeObject(value, depth - 1);
    }

    return sanitized;
  }

  /**
   * Privacy-safe user identifier (remove domain if email)
   */
  static sanitizeUserIdentifier(user: string | undefined): string {
    if (!user) return 'Unknown';

    // Keep first part of email for privacy
    if (user.includes('@')) {
      const parts = user.split('@');
      return `${parts[0].substring(0, 1)}***`;
    }

    // Mask long usernames
    if (user.length > 10) {
      return `${user.substring(0, 1)}***`;
    }

    return user;
  }

  /**
   * Check if key is dangerous (could expose internals)
   */
  private static isDangerousKey(key: string): boolean {
    const dangerous = [
      '__proto__',
      'constructor',
      'prototype',
      'secret',
      'key',
      'token',
      'password',
      'api',
    ];
    return dangerous.includes(key.toLowerCase());
  }
}

export default InputSanitizer;
