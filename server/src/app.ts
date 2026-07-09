import cors from 'cors';
import express from 'express';
import { getDb, initDb } from './db';
import { errorMiddleware, notFoundHandler } from './lib/errors';
import studentRoutes from './routes/students';
import { seed } from './seed';

function ensureSeeded() {
  const row = getDb().prepare('SELECT COUNT(*) AS n FROM students').get() as { n: number };
  if (row.n === 0) {
    seed();
    console.log('Database was empty — seeded fixture data.');
  }
}

export function createApp() {
  initDb();
  ensureSeeded();
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: Date.now() }));
  app.use('/api/students', studentRoutes);

  app.use(notFoundHandler);
  app.use(errorMiddleware);
  return app;
}
