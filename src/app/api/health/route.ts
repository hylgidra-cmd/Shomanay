import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const taskCount = await prisma.task.count();
    const issueCount = await prisma.issue.count();
    const objectCount = await prisma.districtObject.count();
    const mfyCount = await prisma.mFY.count();

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      engine: 'Prisma + SQLite',
      dataSummary: {
        tasks: taskCount,
        issues: issueCount,
        objects: objectCount,
        mfys: mfyCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        database: 'disconnected',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
