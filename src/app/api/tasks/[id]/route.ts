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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json(parseTask(task));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

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

    // If accepted or under_review, update linked issue status
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

    return NextResponse.json(parseTask(updated));
  } catch (error: any) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
