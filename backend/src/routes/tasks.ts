import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const tasksRouter = Router();

function parseTask(t: any) {
  return {
    id: t.id,
    code: t.code,
    issueId: t.issueId || undefined,
    objectId: t.objectId || undefined,
    objectName: t.objectName || undefined,
    mfyId: t.mfyId,
    title: t.title,
    actionDescription: t.actionDescription,
    mainExecutorOrg: t.mainExecutorOrg,
    executorPerson: t.executorPerson,
    inspectorOrg: t.inspectorOrg,
    inspectorPerson: t.inspectorPerson,
    status: t.status,
    priority: t.priority,
    createdDate: t.createdDate,
    deadline: t.deadline,
    completedDate: t.completedDate || undefined,
    expectedResult: t.expectedResult,
    verificationMethod: t.verificationMethod,
    isOverdue: Boolean(t.isOverdue),
    evidence: t.evidence ? JSON.parse(t.evidence) : undefined,
    review: t.review ? JSON.parse(t.review) : undefined,
    extensions: t.extensions ? JSON.parse(t.extensions) : [],
    postExecutionMeasurement: t.postExecutionMeasurement
      ? JSON.parse(t.postExecutionMeasurement)
      : undefined,
  };
}

// GET /api/tasks
tasksRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { status, mfyId, priority } = req.query;
    const where: any = {};
    if (status) where.status = String(status);
    if (mfyId) where.mfyId = String(mfyId);
    if (priority) where.priority = String(priority);

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdDate: 'desc' },
    });
    res.json(tasks.map(parseTask));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tasks/:id
tasksRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id } });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(parseTask(task));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tasks
tasksRouter.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const created = await prisma.task.create({
      data: {
        id: body.id || `tsk-${Date.now()}`,
        code: body.code || `TAP-2026-${Math.floor(100 + Math.random() * 900)}`,
        issueId: body.issueId || null,
        objectId: body.objectId || null,
        objectName: body.objectName || null,
        mfyId: body.mfyId || 'mfy-1',
        title: body.title,
        actionDescription: body.actionDescription,
        mainExecutorOrg: body.mainExecutorOrg,
        executorPerson: body.executorPerson || 'Mas\'ul ijrochi',
        inspectorOrg: body.inspectorOrg || 'Ǵárezsiz Tekseriw Inspeksiyası',
        inspectorPerson: body.inspectorPerson || 'M. Torebaev',
        status: body.status || 'assigned',
        priority: body.priority || 'medium',
        createdDate: body.createdDate || new Date().toISOString().split('T')[0],
        deadline: body.deadline,
        completedDate: body.completedDate || null,
        expectedResult: body.expectedResult || '',
        verificationMethod: body.verificationMethod || 'Hújjet hám foto fiksaciya',
        isOverdue: false,
        evidence: body.evidence ? JSON.stringify(body.evidence) : null,
        review: body.review ? JSON.stringify(body.review) : null,
        extensions: JSON.stringify(body.extensions || []),
        postExecutionMeasurement: body.postExecutionMeasurement
          ? JSON.stringify(body.postExecutionMeasurement)
          : null,
      },
    });

    if (body.issueId) {
      await prisma.issue.update({
        where: { id: body.issueId },
        data: { status: 'assigned', assignedTaskId: created.id },
      }).catch(() => null);
    }

    res.status(201).json(parseTask(created));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/tasks/:id
tasksRouter.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const data: any = {};

    if (body.status !== undefined) data.status = body.status;
    if (body.title !== undefined) data.title = body.title;
    if (body.actionDescription !== undefined) data.actionDescription = body.actionDescription;
    if (body.deadline !== undefined) data.deadline = body.deadline;
    if (body.completedDate !== undefined) data.completedDate = body.completedDate;
    if (body.isOverdue !== undefined) data.isOverdue = body.isOverdue;
    if (body.priority !== undefined) data.priority = body.priority;
    if (body.evidence !== undefined) data.evidence = JSON.stringify(body.evidence);
    if (body.review !== undefined) data.review = JSON.stringify(body.review);
    if (body.extensions !== undefined) data.extensions = JSON.stringify(body.extensions);
    if (body.postExecutionMeasurement !== undefined) {
      data.postExecutionMeasurement = JSON.stringify(body.postExecutionMeasurement);
    }

    const updated = await prisma.task.update({
      where: { id },
      data,
    });

    if (body.status === 'accepted' && updated.issueId) {
      await prisma.issue.update({
        where: { id: updated.issueId },
        data: { status: 'resolved' },
      }).catch(() => null);
    } else if (body.status === 'under_review' && updated.issueId) {
      await prisma.issue.update({
        where: { id: updated.issueId },
        data: { status: 'under_review' },
      }).catch(() => null);
    }

    res.json(parseTask(updated));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/tasks/:id
tasksRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.task.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
