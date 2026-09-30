import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const investmentsRouter = Router();

// GET /api/investments
investmentsRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const investments = await prisma.investment.findMany();
    res.json(investments);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
