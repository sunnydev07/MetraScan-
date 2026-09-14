import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { config } from './server/config';
import { connectDb } from './server/db';
import { initSocket } from './server/socket';
import healthRouter from './server/routes/health';
import scansRouter from './server/routes/scans';
import chatRouter from './server/routes/chat';
import { seedDemoData } from './server/seed/demoData';

async function startServer() {
  const app = express();
  const httpServer = createServer(app);

  // Initialize Socket.IO
  initSocket(httpServer);

  // Standard middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // Connect database and seed initial demo scans
  await connectDb();
  await seedDemoData();

  // API Routes FIRST before any Vite or static middleware
  app.use('/api/health', healthRouter);
  app.use('/api/scans', scansRouter);
  app.use('/api/chat', chatRouter);

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(config.port, config.host, () => {
    console.log(`[Server] SIH26034 Compliance Scanner running on http://${config.host}:${config.port}`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
