import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const issuesRouter = Router();

function parseIssue(i: any) {
  return {
    id: i.id,
    code: i.code,
    title: i.title,
    description: i.description,
    category: i.category,
    priority: i.priority,
    objectId: i.objectId || undefined,
    objectName: i.objectName || undefined,
    mfyId: i.mfyId,
    source: i.source,
    reportedDate: i.reportedDate,
    status: i.status,
    relatedIndicator: i.relatedIndicator || undefined,
    assignedTaskId: i.assignedTaskId || undefined,
    reportedBy: i.reportedBy,
    evidenceNotes: i.evidenceNotes || undefined,
  };
}

// GET /api/issues
issuesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { category, priority, status } = req.query;
    const where: any = {};
    if (category) where.category = String(category);
    if (priority) where.priority = String(priority);
    if (status) where.status = String(status);

    const issues = await prisma.issue.findMany({
      where,
      orderBy: { reportedDate: 'desc' },
    });
    res.json(issues.map(parseIssue));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/issues/:id
issuesRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const issue = await prisma.issue.findUnique({ where: { id: req.params.id } });
    if (!issue) return res.status(404).json({ error: 'Issue not found' });
    res.json(parseIssue(issue));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/issues
issuesRouter.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const created = await prisma.issue.create({
      data: {
        id: body.id || `iss-${Date.now()}`,
        code: body.code || `MSH-2026-${Math.floor(100 + Math.random() * 900)}`,
        title: body.title,
        description: body.description,
        category: body.category,
        priority: body.priority || 'medium',
        objectId: body.objectId || null,
        objectName: body.objectName || null,
        mfyId: body.mfyId || 'mfy-1',
        source: body.source || 'manual',
        reportedDate: body.reportedDate || new Date().toISOString().split('T')[0],
        status: body.status || 'open',
        relatedIndicator: body.relatedIndicator || null,
        assignedTaskId: body.assignedTaskId || null,
        reportedBy: body.reportedBy || 'Mas\'ul xodim',
        evidenceNotes: body.evidenceNotes || null,
      },
    });
    res.status(201).json(parseIssue(created));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/issues/:id
issuesRouter.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const data: any = {};

    if (body.status !== undefined) data.status = body.status;
    if (body.title !== undefined) data.title = body.title;
    if (body.description !== undefined) data.description = body.description;
    if (body.priority !== undefined) data.priority = body.priority;
    if (body.assignedTaskId !== undefined) data.assignedTaskId = body.assignedTaskId;
    if (body.evidenceNotes !== undefined) data.evidenceNotes = body.evidenceNotes;

    const updated = await prisma.issue.update({
      where: { id },
      data,
    });
    res.json(parseIssue(updated));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/issues/:id
issuesRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.issue.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
