import cors from 'cors';
import express from 'express';
import { initDb } from './db';
import { errorMiddleware, notFoundHandler } from './lib/errors';
import studentRoutes from './routes/students';

export function createApp() {
  initDb();
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: Date.now() }));
  app.use('/api/students', studentRoutes);

  app.use(notFoundHandler);
  app.use(errorMiddleware);
  return app;
}
