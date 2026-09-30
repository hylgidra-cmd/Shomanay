import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const objectsRouter = Router();

function parseObject(o: any) {
  return {
    id: o.id,
    name: o.name,
    type: o.type,
    mfyId: o.mfyId,
    address: o.address,
    coords: [o.coordsLat, o.coordsLng],
    responsibleOrg: o.responsibleOrg,
    curator: o.curator,
    status: o.status,
    source: o.source,
    updatedDate: o.updatedDate,
    description: o.description,
    photos: o.photos ? JSON.parse(o.photos) : [],
    documents: o.documents ? JSON.parse(o.documents) : [],
    capacity: o.capacity ? JSON.parse(o.capacity) : undefined,
    metrics: o.metrics ? JSON.parse(o.metrics) : undefined,
    relatedIssuesCount: o.relatedIssuesCount,
    relatedTasksCount: o.relatedTasksCount,
  };
}

// GET /api/objects
objectsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { mfyId, type, status } = req.query;
    const where: any = {};
    if (mfyId) where.mfyId = String(mfyId);
    if (type) where.type = String(type);
    if (status) where.status = String(status);

    const objects = await prisma.districtObject.findMany({
      where,
      orderBy: { name: 'asc' },
    });
    res.json(objects.map(parseObject));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/objects/:id
objectsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const object = await prisma.districtObject.findUnique({
      where: { id: req.params.id },
    });
    if (!object) return res.status(404).json({ error: 'Object not found' });
    res.json(parseObject(object));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
