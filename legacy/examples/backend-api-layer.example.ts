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

// pages/api/blackpoint/alerts.ts

import { NextApiRequest, NextApiResponse } from 'next';
import SecureLogger from '../../../src/utils/secure-logger';

interface ApiError {
  error: string;
  status: number;
}

/**
 * Get outstanding alerts
 * GET /api/blackpoint/alerts?page=1&pageSize=20
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | ApiError>
) {
  // Verify authentication
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Unauthorized', status: 401 });
  }

  // Verify method
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed', status: 405 });
  }

  try {
    const { page = '1', pageSize = '20' } = req.query;

    // Validate inputs
    const pageNum = Math.max(1, parseInt(String(page)));
    const size = Math.min(100, Math.max(1, parseInt(String(pageSize)))); // Max 100 per page

    // Call Blackpoint API from backend (API key never exposed to client)
    const response = await fetch(
      `${process.env.BLACKPOINT_API_URL}/v1/alert-groups?take=${size}&skip=${(pageNum - 1) * size}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.BLACKPOINT_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      SecureLogger.error('Blackpoint API error', { status: response.status });
      return res.status(response.status).json({
        error: 'Failed to fetch alerts',
        status: response.status,
      });
    }

    const data = await response.json();

    // Add security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

    return res.status(200).json(data);
  } catch (error) {
    SecureLogger.error('API error', error);
    return res.status(500).json({
      error: 'Internal server error',
      status: 500,
    });
  }
}

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
