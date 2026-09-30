import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DistrictObject } from '@/types';

function parseObject(o: any): DistrictObject {
  return {
    id: o.id,
    name: o.name,
    type: o.type as any,
    mfyId: o.mfyId,
    address: o.address,
    coords: [o.coordsLat, o.coordsLng],
    responsibleOrg: o.responsibleOrg,
    curator: o.curator,
    status: o.status as any,
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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const object = await prisma.districtObject.findUnique({ where: { id } });
    if (!object) {
      return NextResponse.json({ error: 'Object not found' }, { status: 404 });
    }
    return NextResponse.json(parseObject(object));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
