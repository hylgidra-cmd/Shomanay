import { PrismaClient } from '@prisma/client';
import {
  mockMFYs,
  mockObjects,
  mockIssues,
  mockTasks,
  mockInvestments,
  mockIndicators,
} from '../src/lib/mockData';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SQLite database with Shomanay official datasets...');

  // 1. Clear existing records
  await prisma.task.deleteMany({});
  await prisma.issue.deleteMany({});
  await prisma.districtObject.deleteMany({});
  await prisma.mFY.deleteMany({});
  await prisma.indicator.deleteMany({});
  await prisma.investment.deleteMany({});

  // 2. Seed MFYs
  for (const m of mockMFYs) {
    await prisma.mFY.create({
      data: {
        id: m.id,
        name: m.name,
        code: m.code,
        population: m.population,
        areaSqKm: m.areaSqKm,
        centerLat: m.centerCoords[0],
        centerLng: m.centerCoords[1],
        leaderName: m.leaderName,
        phone: m.phone,
        activeProjectsCount: m.activeProjectsCount,
        openIssuesCount: m.openIssuesCount,
      },
    });
  }
  console.log(`✓ Seeded ${mockMFYs.length} MFYs`);

  // 3. Seed District Objects
  for (const o of mockObjects) {
    await prisma.districtObject.create({
      data: {
        id: o.id,
        name: o.name,
        type: o.type,
        mfyId: o.mfyId,
        address: o.address,
        coordsLat: o.coords[0],
        coordsLng: o.coords[1],
        responsibleOrg: o.responsibleOrg,
        curator: o.curator,
        status: o.status,
        source: o.source,
        updatedDate: o.updatedDate,
        description: o.description,
        photos: JSON.stringify(o.photos || []),
        documents: JSON.stringify(o.documents || []),
        capacity: o.capacity ? JSON.stringify(o.capacity) : null,
        metrics: o.metrics ? JSON.stringify(o.metrics) : null,
        relatedIssuesCount: o.relatedIssuesCount,
        relatedTasksCount: o.relatedTasksCount,
      },
    });
  }
  console.log(`✓ Seeded ${mockObjects.length} District Objects`);

  // 4. Seed Issues
  for (const i of mockIssues) {
    await prisma.issue.create({
      data: {
        id: i.id,
        code: i.code,
        title: i.title,
        description: i.description,
        category: i.category,
        priority: i.priority,
        objectId: i.objectId || null,
        objectName: i.objectName || null,
        mfyId: i.mfyId,
        source: i.source,
        reportedDate: i.reportedDate,
        status: i.status,
        relatedIndicator: i.relatedIndicator || null,
        assignedTaskId: i.assignedTaskId || null,
        reportedBy: i.reportedBy,
        evidenceNotes: i.evidenceNotes || null,
      },
    });
  }
  console.log(`✓ Seeded ${mockIssues.length} Issues`);

  // 5. Seed Tasks
  for (const t of mockTasks) {
    await prisma.task.create({
      data: {
        id: t.id,
        code: t.code,
        issueId: t.issueId || null,
        objectId: t.objectId || null,
        objectName: t.objectName || null,
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
        completedDate: t.completedDate || null,
        expectedResult: t.expectedResult,
        verificationMethod: t.verificationMethod,
        isOverdue: t.isOverdue || false,
        evidence: t.evidence ? JSON.stringify(t.evidence) : null,
        review: t.review ? JSON.stringify(t.review) : null,
        extensions: JSON.stringify(t.extensions || []),
        postExecutionMeasurement: t.postExecutionMeasurement ? JSON.stringify(t.postExecutionMeasurement) : null,
      },
    });
  }
  console.log(`✓ Seeded ${mockTasks.length} Tasks`);

  // 6. Seed Indicators
  for (const ind of mockIndicators) {
    const historical2026 = (ind.historical as any)?.['2026'] || 100;
    await prisma.indicator.create({
      data: {
        id: ind.id,
        name: ind.name.qq,
        category: ind.sectorKey,
        value: historical2026,
        unit: ind.unit,
        changePercent: ind.trendPercent,
        plan: historical2026 * 1.05,
        fact: historical2026,
        status: ind.isPositiveTrend ? 'positive' : 'warning',
        period: '2026',
      },
    });
  }
  console.log(`✓ Seeded ${mockIndicators.length} Sector Indicators`);

  // 7. Seed Investments
  for (const inv of mockInvestments) {
    await prisma.investment.create({
      data: {
        id: inv.id,
        projectName: inv.name,
        investor: inv.investorName,
        costMlnUzs: inv.totalCostMlnUzs,
        createdJobs: inv.plannedJobs,
        mfyId: inv.mfyId,
        stage: inv.stage,
        completionPercent: inv.physicalProgressPercent,
      },
    });
  }
  console.log(`✓ Seeded ${mockInvestments.length} Investments`);

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
