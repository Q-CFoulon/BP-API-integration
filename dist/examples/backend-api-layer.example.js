"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const secure_logger_1 = __importDefault(require("../../../src/utils/secure-logger"));
/**
 * Get outstanding alerts
 * GET /api/blackpoint/alerts?page=1&pageSize=20
 */
async function handler(req, res) {
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
        const response = await fetch(`${process.env.BLACKPOINT_API_URL}/v1/alerts?page=${pageNum}&pageSize=${size}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.BLACKPOINT_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            secure_logger_1.default.error('Blackpoint API error', { status: response.status });
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
    }
    catch (error) {
        secure_logger_1.default.error('API error', error);
        return res.status(500).json({
            error: 'Internal server error',
            status: 500,
        });
    }
}
//# sourceMappingURL=backend-api-layer.example.js.map