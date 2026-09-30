import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const indicatorsRouter = Router();

// GET /api/indicators
indicatorsRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const indicators = await prisma.indicator.findMany();
    res.json(indicators);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
