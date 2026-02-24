# Security Review - Blackpoint Cyber Integration

## Summary
Found **6 critical/high security issues** that need remediation. Details below with recommended fixes.

---

## 🔴 CRITICAL ISSUES

### 1. Sensitive Data Exposure in Console Logs
**Severity:** CRITICAL  
**Location:** Multiple files  
**Issue:** API keys, alert details, and sensitive user data are logged to console

**Files:**
- `src/services/blackpoint-api.service.ts` (line 77)
- `src/services/lifecycle.service.ts` (lines 31, 63, 101, 115)
- `src/examples/soc-workflow-complete.ts` (throughout)

**Risk:** Console logs are visible in:
- Browser DevTools (can be exported/screenshotted)
- Browser history and memory
- Application logs if forwarded to external services
- Client-side source maps in production

**Current Code (blackpoint-api.service.ts):**
```typescript
catch (error) {
  console.error(`Request failed for ${method} ${url}:`, error);  // ❌ Logs full URL with API key
  throw error;
}
```

**Recommendation:** Use structured logging with redaction for sensitive data.

---

### 2. API Key Stored in Plain Memory
**Severity:** HIGH  
**Location:** `src/utils/blackpoint.config.ts` (line 7)  
**Issue:** API key loaded from environment variable but stored in-memory as plain text

**Current Code:**
```typescript
static readonly API_KEY = process.env.BLACKPOINT_API_KEY || '';
```

**Risk:** 
- Accessible to any code in the application
- Can be exposed through memory dumps
- No encryption at rest

**Recommendation:** Add environment validation and consider SSR-only API calls.

---

### 3. Insufficient Input Validation in Lifecycle Service
**Severity:** HIGH  
**Location:** `src/services/lifecycle.service.ts` (multiple methods)  
**Issue:** No input validation on user inputs (names, descriptions, notes)

**Current Code (line 138):**
```typescript
addNotes(alertId: string, notes: string, user?: string): void {
  // ... no validation on notes or user input
  lifecycle.notes = (lifecycle.notes || '') + `\n[${new Date().toISOString()}] ${user || 'Unknown'}: ${notes}`;
}
```

**Risk:**
- XSS if displayed in web UI without sanitization
- Injection attacks via user/notes fields
- Data corruption

---

### 4. CSV Export Without Data Sanitization
**Severity:** HIGH  
**Location:** `src/services/lifecycle.service.ts` (line 243-260)  
**Issue:** CSV export doesn't sanitize data; can contain formula injection, quotes not escaped

**Current Code:**
```typescript
csvRows.push(
  [
    row.alertId,
    `"${row.tenantName}"`,  // ❌ Unescaped content in quotes
    `"${row.title}"`,        // ❌ Unescaped content in quotes
    // ...
  ].join(',')
);
```

**Risk:**
- Formula injection: `=cmd|'/c calc'!A0`
- CSV injection attacks
- Data corruption in Excel/Google Sheets

---

### 5. No Error Handling for API Sensitive Data
**Severity:** MEDIUM-HIGH  
**Location:** `src/services/blackpoint-api.service.ts` (line 77)  
**Issue:** Error messages leak URL paths and may leak API responses

**Current Code:**
```typescript
if (!response.ok) {
  throw new Error(`API Error ${response.status}: ${response.statusText}`);
}
```

**Risk:** Error messages visible to users expose API structure.

---

### 6. Client-Side Lifecycle Tracking Exposes Sensitive Data
**Severity:** MEDIUM  
**Location:** `src/components/AlertDashboard.tsx`  
**Issue:** All alert details stored in React state; no encryption or access control

**Risk:**
- React DevTools can inspect component state
- Browser cache may store sensitive data
- No role-based access control

---

## 🟡 MEDIUM ISSUES

### 7. Unvalidated API Endpoint Discovery
**Severity:** MEDIUM  
**Location:** `src/services/blackpoint-api.service.ts` (line 95-125)  
**Issue:** Endpoint discovery doesn't validate discovered endpoints before use

**Risk:**
- Could be exploited to probe API structure
- SSRF vulnerability if API URL is untrusted

---

### 8. No Rate Limiting or Request Throttling
**Severity:** MEDIUM  
**Location:** All API client calls  
**Issue:** No built-in rate limiting, could cause DoS

---

### 9. Missing CORS Configuration
**Severity:** MEDIUM  
**Location:** Browser-side API calls in React components  
**Issue:** No CORS handling; API calls made directly from browser

**Risk:** If Blackpoint API doesn't support CORS, calls will fail. If it does, browser may cache credentials.

---

## 🔵 LOW ISSUES

### 10. Weak Input Validation on Alert Status/Severity
**Severity:** LOW  
**Location:** `src/types/lifecycle.types.ts`  
**Issue:** Using string unions for validation but no enum runtime validation

---

## 📋 RECOMMENDED FIXES

### Fix 1: Add Secure Logging Service
Create `src/utils/secure-logger.ts`:

```typescript
export class SecureLogger {
  private static readonly SENSITIVE_KEYS = ['key', 'token', 'password', 'api', 'secret'];

  static info(message: string, data?: any): void {
    if (process.env.NODE_ENV === 'production') return;
    console.info(message, this.redact(data));
  }

  static error(message: string, error?: any): void {
    if (process.env.NODE_ENV === 'production') {
      // Send to secure logging service instead
      this.sendToSecureLogger(message, error);
      return;
    }
    console.error(message, this.redact(error));
  }

  private static redact(obj: any): any {
    if (!obj) return obj;
    if (typeof obj !== 'object') return obj;

    const redacted = { ...obj };
    for (const [key, value] of Object.entries(redacted)) {
      if (this.SENSITIVE_KEYS.some((k) => key.toLowerCase().includes(k))) {
        redacted[key] = '[REDACTED]';
      } else if (typeof value === 'string' && value.includes('Bearer')) {
        redacted[key] = '[REDACTED]';
      }
    }
    return redacted;
  }

  private static sendToSecureLogger(message: string, error: any): void {
    // Send to secure logging backend (not console)
    // Example: POST to /api/logs with hashed/encrypted data
  }
}
```

### Fix 2: Add Input Sanitization
Create `src/utils/input-sanitizer.ts`:

```typescript
export class InputSanitizer {
  static sanitizeText(input: string | undefined): string {
    if (!input) return '';
    return String(input)
      .replace(/[<>\"'&]/g, (char) => {
        const escapeMap: Record<string, string> = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;',
        };
        return escapeMap[char] || char;
      })
      .slice(0, 500); // Max length
  }

  static sanitizeCsvField(field: string | number | undefined): string {
    if (field === undefined || field === null) return '';
    
    const str = String(field);
    
    // Escape formula injection
    if (/^[=+\-@]/.test(str)) {
      return "'" + str;
    }
    
    // Escape quotes and return in quotes
    const escaped = str.replace(/"/g, '""');
    return `"${escaped}"`;
  }

  static validateAlertStatus(status: string): boolean {
    return ['open', 'outstanding', 'investigating', 'closed', 'resolved'].includes(status);
  }

  static validateSeverity(severity: string): boolean {
    return ['critical', 'high', 'medium', 'low', 'info'].includes(severity);
  }
}
```

### Fix 3: Update Lifecycle Service to Use Sanitization
```typescript
addNotes(alertId: string, notes: string, user?: string): void {
  const lifecycle = this.lifecycles.get(alertId);
  if (!lifecycle) {
    console.warn(`Alert not found: ${alertId}`);
    return;
  }

  // ✅ Sanitize inputs
  const sanitizedNotes = InputSanitizer.sanitizeText(notes);
  const sanitizedUser = InputSanitizer.sanitizeText(user);

  lifecycle.notes = 
    (lifecycle.notes || '') + 
    `\n[${new Date().toISOString()}] ${sanitizedUser || 'Unknown'}: ${sanitizedNotes}`;
}
```

### Fix 4: Update CSV Export with Sanitization
```typescript
exportAsCsv(): string {
  const headers = ['AlertID', 'Tenant', 'Title', 'Severity', 'Status', 'Created', 'Opened', 'Closed', 'Duration', 'Actions'];
  const rows = this.lifecycles.values();

  const csvRows = [headers.join(',')];

  for (const row of rows) {
    const duration = row.closedAt
      ? this.formatDuration(row.durationMs || 0)
      : this.formatDuration(new Date().getTime() - new Date(row.openedAt).getTime());

    csvRows.push(
      [
        InputSanitizer.sanitizeCsvField(row.alertId),
        InputSanitizer.sanitizeCsvField(row.tenantName),
        InputSanitizer.sanitizeCsvField(row.title),
        InputSanitizer.sanitizeCsvField(row.severity),
        InputSanitizer.sanitizeCsvField(row.status),
        InputSanitizer.sanitizeCsvField(row.createdAt),
        InputSanitizer.sanitizeCsvField(row.openedAt),
        InputSanitizer.sanitizeCsvField(row.closedAt || 'N/A'),
        InputSanitizer.sanitizeCsvField(duration),
        InputSanitizer.sanitizeCsvField(row.actions.length),
      ].join(',')
    );
  }

  return csvRows.join('\n');
}
```

### Fix 5: Update API Client Error Handling
```typescript
private async request<T>(url: string, method: string, body?: unknown): Promise<T> {
  try {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      // ✅ Don't expose URL/API structure in error
      const error: any = new Error('API request failed');
      error.status = response.status;
      
      if (process.env.NODE_ENV !== 'production') {
        console.error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      throw error;
    }

    return (await response.json()) as T;
  } catch (error) {
    // ✅ Use secure logger instead of console.error
    SecureLogger.error('Request failed', error);
    throw error;
  }
}
```

### Fix 6: Add Request Rate Limiting
Create `src/utils/rate-limiter.ts`:

```typescript
export class RateLimiter {
  private requestCounts: Map<string, number[]> = new Map();
  private readonly windowMs = 60000; // 1 minute
  private readonly maxRequests = 30; // 30 requests per minute

  async limit(key: string): Promise<void> {
    const now = Date.now();
    const requests = this.requestCounts.get(key) || [];
    
    // Remove old requests outside window
    const recentRequests = requests.filter((time) => now - time < this.windowMs);
    
    if (recentRequests.length >= this.maxRequests) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    recentRequests.push(now);
    this.requestCounts.set(key, recentRequests);
  }
}
```

### Fix 7: Add Server-Side API Layer
For production, move API calls to backend:

```typescript
// Create: src/pages/api/blackpoint/[...path].ts (Next.js example)
export async function handle(req: NextApiRequest, res: NextApiResponse) {
  // ✅ All API calls made from backend
  // ✅ API key stored in backend only
  // ✅ Frontend calls /api/blackpoint instead of direct API
  
  const response = await fetch(`https://api.blackpointcyber.com${req.query.path}`, {
    headers: {
      'Authorization': `Bearer ${process.env.BLACKPOINT_API_KEY}`,
    },
  });
  
  return res.json(await response.json());
}
```

---

## ✅ IMPLEMENTATION CHECKLIST

- [ ] Create `InputSanitizer` utility
- [ ] Create `SecureLogger` utility  
- [ ] Update `AlertLifecycleService` with sanitization
- [ ] Update `BlackpointApiClient` error handling
- [ ] Update CSV export with sanitization
- [ ] Add rate limiting
- [ ] Remove all sensitive console.logs
- [ ] Move API calls to backend (recommended for production)
- [ ] Add Content Security Policy (CSP) headers
- [ ] Add XSS protection headers (X-Content-Type-Options)
- [ ] Implement row-level access control for alerts
- [ ] Add audit logging for all actions
- [ ] Implement API key rotation
- [ ] Add HTTPS enforcement
- [ ] Test with OWASP ZAP/Burp Suite

---

## 🔐 Security Best Practices for SOC Dashboard

1. **Backend API Layer:** Move all API calls to backend for production
2. **Authentication:** Implement OAuth 2.0 or SAML for SOC team
3. **Authorization:** Add role-based access control (RBAC) per analyst
4. **Encryption:** Encrypt sensitive data in transit (HTTPS) and at rest
5. **Audit Logging:** Log all actions to immutable ledger
6. **Data Retention:** Implement automatic purge of old lifecycle data
7. **Monitoring:** Alert on suspicious activity (rapid escalation of alerts, etc.)
8. **Testing:** Regular security testing and penetration testing

---

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [CSV Injection](https://owasp.org/www-community/attacks/CSV_Injection)
- [Secure Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
