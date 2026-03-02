/**
 * Backend API Layer (Recommended for Production)
 * This shows how to create a secure backend proxy for Blackpoint Cyber API
 *
 * This prevents:
 * - API key exposure in browser
 * - CORS issues
 * - Client-side API key theft
 * - Direct API enumeration
 *
 * Example using Next.js (recommended for Node.js)
 */
import { NextApiRequest, NextApiResponse } from 'next';
interface ApiError {
    error: string;
    status: number;
}
/**
 * Get outstanding alerts
 * GET /api/blackpoint/alerts?page=1&pageSize=20
 */
export default function handler(req: NextApiRequest, res: NextApiResponse<any | ApiError>): Promise<any>;
/**
 * ============================================
 * ENVIRONMENT VARIABLES (.env.local)
 * ============================================
 *
 * BLACKPOINT_API_URL=https://api.blackpointcyber.com
 * BLACKPOINT_API_KEY=<your-api-key>
 *
 * # Security
 * NEXT_PUBLIC_API_BASE=/api/blackpoint
 */
/**
 * ============================================
 * USAGE IN FRONTEND
 * ============================================
 *
 * // Instead of direct API calls, use backend proxy:
 * const response = await fetch('/api/blackpoint/alerts?page=1&pageSize=20');
 * const data = await response.json();
 *
 * // This way:
 * // 1. API key is never exposed to browser
 * // 2. Requests are rate-limited at backend
 * // 3. Sensitive errors are logged server-side
 * // 4. CORS is handled automatically
 */
/**
 * ============================================
 * EXPRESS.JS EXAMPLE
 * ============================================
 *
 * import express from 'express';
 * import SecureLogger from './src/utils/secure-logger';
 * import RateLimiter from './src/utils/rate-limiter';
 *
 * const app = express();
 * const rateLimiter = new RateLimiter();
 *
 * app.get('/api/blackpoint/alerts', async (req, res) => {
 *   try {
 *     // Rate limit
 *     const clientId = req.ip || 'unknown';
 *     await rateLimiter.checkLimit(clientId);
 *
 *     const response = await fetch(
 *       `${process.env.BLACKPOINT_API_URL}/v1/alerts`,
 *       {
 *         headers: {
 *           'Authorization': `Bearer ${process.env.BLACKPOINT_API_KEY}`,
 *         },
 *       }
 *     );
 *
 *     res.json(await response.json());
 *   } catch (error) {
 *     SecureLogger.error('API error', error);
 *     res.status(500).json({ error: 'Internal server error' });
 *   }
 * });
 *
 * app.listen(3000);
 */
export {};
//# sourceMappingURL=backend-api-layer.example.d.ts.map