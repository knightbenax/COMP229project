import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.ts';
import borrowRequestRoutes from './routes/borrowRequestRoutes.ts';
import toolRoutes from './routes/toolRoutes.ts';

import { notFound, errorHandler } from './middleware/errorHandlers.ts';

export function createApp(): Express {
  const app = express();

  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(cors());
  app.use(express.json({ limit: '100kb' }));

  app.get('/healthz', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/borrow-requests', borrowRequestRoutes);
  app.use('/api/tools', toolRoutes);

  // Error handling must remain after the routes.
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
