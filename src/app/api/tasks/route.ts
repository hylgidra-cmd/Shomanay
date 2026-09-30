import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Task } from '@/types';

function parseTask(t: any): Task {
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
    status: t.status as any,
    priority: t.priority as any,
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const mfyId = searchParams.get('mfyId');
    const priority = searchParams.get('priority');

    const where: any = {};
    if (status) where.status = status;
    if (mfyId) where.mfyId = mfyId;
    if (priority) where.priority = priority;

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdDate: 'desc' },
    });

    return NextResponse.json(tasks.map(parseTask));
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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

    // If an issue was linked to this task, update issue status to assigned
    if (body.issueId) {
      await prisma.issue.update({
        where: { id: body.issueId },
        data: { status: 'assigned', assignedTaskId: created.id },
      }).catch(() => null);
    }

    return NextResponse.json(parseTask(created), { status: 201 });
  } catch (error: any) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
