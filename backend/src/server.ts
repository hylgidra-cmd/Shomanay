import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './lib/prisma';
import { tasksRouter } from './routes/tasks';
import { issuesRouter } from './routes/issues';
import { objectsRouter } from './routes/objects';
import { mfysRouter } from './routes/mfys';
import { indicatorsRouter } from './routes/indicators';
import { investmentsRouter } from './routes/investments';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Healthcheck
app.get('/api/health', async (_req, res) => {
  try {
    const taskCount = await prisma.task.count();
    const issueCount = await prisma.issue.count();
    const objectCount = await prisma.districtObject.count();
    const mfyCount = await prisma.mFY.count();

    res.json({
      status: 'ok',
      service: 'Shomanay Backend (Express.js)',
      port: PORT,
      database: 'connected (SQLite via Prisma)',
      dataSummary: {
        tasks: taskCount,
        issues: issueCount,
        objects: objectCount,
        mfys: mfyCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// Mount Routes
app.use('/api/tasks', tasksRouter);
app.use('/api/issues', issuesRouter);
app.use('/api/objects', objectsRouter);
app.use('/api/mfys', mfysRouter);
app.use('/api/indicators', indicatorsRouter);
app.use('/api/investments', investmentsRouter);

app.listen(PORT, () => {
  console.log(`🚀 Shomanay Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 Healthcheck available at http://localhost:${PORT}/api/health`);
});
