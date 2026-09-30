import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mockInvestments } from '@/lib/mockData';

export async function GET() {
  try {
    const dbInvestments = await prisma.investment.findMany();
    return NextResponse.json({
      dbInvestments,
      fullInvestments: mockInvestments,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
