// ---------------------------------------------------------------------------
// Routes — Blackpoint Analytics
// ---------------------------------------------------------------------------

import { Router } from 'express';
import type { Request, Response } from 'express';
import { CompassOneClient } from '../../services/compassOneClient.js';
import type { UnifiedTenantConfig } from '../../config/tenants.schema.js';

const router = Router({ mergeParams: true });
const client = new CompassOneClient();

/**
 * GET /api/tenants/:alias/bp/analytics/count
 * Detection count. Optional ?status=OPEN|RESOLVED
 */
router.get('/count', async (req: Request, res: Response) => {
  const tenant = req.tenant as UnifiedTenantConfig;
  const status = req.query.status as 'OPEN' | 'RESOLVED' | undefined;

  try {
    const count = await client.getDetectionCount(tenant, status);
    res.json({ count });
  } catch (err) {
    res.status(502).json({ error: 'Failed to fetch detection count', detail: (err as Error).message });
  }
});

/**
 * GET /api/tenants/:alias/bp/analytics/weekly-trends
 * Alert groups aggregated by week
 */
router.get('/weekly-trends', async (req: Request, res: Response) => {
  const tenant = req.tenant as UnifiedTenantConfig;

  try {
    const data = await client.getWeeklyTrends(tenant);
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: 'Failed to fetch weekly trends', detail: (err as Error).message });
  }
});

/**
 * GET /api/tenants/:alias/bp/analytics/top-entities
 * Top detections by entity. Optional ?top=10
 */
router.get('/top-entities', async (req: Request, res: Response) => {
  const tenant = req.tenant as UnifiedTenantConfig;
  const top = req.query.top ? Number(req.query.top) : undefined;

  try {
    const data = await client.getTopEntities(tenant, { top });
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: 'Failed to fetch top entities', detail: (err as Error).message });
  }
});

/**
 * GET /api/tenants/:alias/bp/analytics/top-threats
 * Top detections by threat. Optional ?top=10
 */
router.get('/top-threats', async (req: Request, res: Response) => {
  const tenant = req.tenant as UnifiedTenantConfig;
  const top = req.query.top ? Number(req.query.top) : undefined;

  try {
    const data = await client.getTopThreats(tenant, { top });
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: 'Failed to fetch top threats', detail: (err as Error).message });
  }
});

export default router;
