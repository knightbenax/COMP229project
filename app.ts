import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.ts';
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

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
