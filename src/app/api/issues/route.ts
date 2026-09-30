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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const status = searchParams.get('status');

    const where: any = {};
    if (category) where.category = category;
    if (priority) where.priority = priority;
    if (status) where.status = status;

    const issues = await prisma.issue.findMany({
      where,
      orderBy: { reportedDate: 'desc' },
    });

    return NextResponse.json(issues.map(parseIssue));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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

    return NextResponse.json(parseIssue(created), { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
