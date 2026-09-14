import { Router, Request, Response } from 'express';
import { isDbConnected } from '../db';
import { config } from '../config';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    demoMode: config.demoMode,
    ocrProvider: config.ocrProvider,
    database: isDbConnected() ? 'connected' : 'in-memory-fallback',
    timestamp: new Date().toISOString(),
  });
});

export default router;
