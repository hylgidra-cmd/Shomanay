import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const mfysRouter = Router();

// GET /api/mfys
mfysRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const mfys = await prisma.mFY.findMany();
    const result = mfys.map((m) => ({
      ...m,
      centerCoords: [m.centerLat, m.centerLng],
      polygon: [],
    }));
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
