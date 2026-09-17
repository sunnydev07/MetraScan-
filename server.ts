import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { config } from './server/config';
import { connectDb } from './server/db';
import { initSocket } from './server/socket';
import healthRouter from './server/routes/health';
import scansRouter from './server/routes/scans';
import chatRouter from './server/routes/chat';
import regulationsRouter from './server/routes/regulations';
import { seedDemoData } from './server/seed/demoData';
import mongoose from 'mongoose';

async function startServer() {
  const app = express();
  const httpServer = createServer(app);

  // Initialize Socket.IO
  initSocket(httpServer);

  // Standard middleware
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));

  // CORS headers — restricted to configured client origin
  const allowedOrigins = [
    config.clientUrl,
    `http://localhost:${config.port}`,
    `http://127.0.0.1:${config.port}`,
  ].filter(Boolean);

  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    } else if (!origin) {
      // Allow same-origin requests (no Origin header)
      res.header('Access-Control-Allow-Origin', config.clientUrl);
    }
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
  app.use('/api/regulations', regulationsRouter);

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

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`[Server] Received ${signal}. Shutting down gracefully...`);
    httpServer.close(() => {
      console.log('[Server] HTTP server closed.');
    });
    try {
      await mongoose.connection.close();
      console.log('[Server] MongoDB connection closed.');
    } catch (err) {
      // Ignore — connection may not exist
    }
    setTimeout(() => process.exit(0), 3000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
