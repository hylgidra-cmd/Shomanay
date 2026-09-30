import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Issue } from '@/types';

function parseIssue(i: any): Issue {
  return {
    id: i.id,
    code: i.code,
    title: i.title,
    description: i.description,
    category: i.category as any,
    priority: i.priority as any,
    objectId: i.objectId || undefined,
    objectName: i.objectName || undefined,
    mfyId: i.mfyId,
    source: i.source as any,
    reportedDate: i.reportedDate,
    status: i.status as any,
    relatedIndicator: i.relatedIndicator || undefined,
    assignedTaskId: i.assignedTaskId || undefined,
    reportedBy: i.reportedBy,
    evidenceNotes: i.evidenceNotes || undefined,
  };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const issue = await prisma.issue.findUnique({ where: { id } });
    if (!issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }
    return NextResponse.json(parseIssue(issue));
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
    if (body.description !== undefined) data.description = body.description;
    if (body.priority !== undefined) data.priority = body.priority;
    if (body.assignedTaskId !== undefined) data.assignedTaskId = body.assignedTaskId;
    if (body.evidenceNotes !== undefined) data.evidenceNotes = body.evidenceNotes;

    const updated = await prisma.issue.update({
      where: { id },
      data,
    });

    return NextResponse.json(parseIssue(updated));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.issue.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
