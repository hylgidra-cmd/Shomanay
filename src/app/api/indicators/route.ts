import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mockIndicators } from '@/lib/mockData';

export async function GET() {
  try {
    const dbIndicators = await prisma.indicator.findMany();
    // Return rich indicators with multilingual and historical data
    return NextResponse.json({
      dbSummary: dbIndicators,
      fullIndicators: mockIndicators,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
