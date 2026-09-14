import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: SocketIOServer | null = null;

export function initSocket(server: HttpServer): SocketIOServer {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket: Socket) => {
    // Client joins a specific scan room
    socket.on('scan:join', ({ scanId }: { scanId: string }) => {
      if (scanId) {
        socket.join(`scan:${scanId}`);
      }
    });

    // Client joins officer dashboard room
    socket.on('dashboard:join', () => {
      socket.join('dashboard:officer');
    });

    socket.on('scan:cancel', ({ scanId }: { scanId: string }) => {
      if (scanId) {
        io?.to(`scan:${scanId}`).emit('scan:error', {
          scanId,
          stage: 'cancelled',
          message: 'Scan was cancelled by user',
        });
      }
    });

    socket.on('scan:retake', ({ scanId, reason }: { scanId: string; reason?: string }) => {
      if (scanId) {
        io?.to(`scan:${scanId}`).emit('scan:progress', {
          scanId,
          stage: 'retake_requested',
          progress: 0,
          message: reason || 'Retake requested',
        });
      }
    });
  });

  return io;
}

export function getIO(): SocketIOServer | null {
  return io;
}

export function emitScanProgress(scanId: string, payload: {
  scanId: string;
  stage: string;
  progress: number;
  message?: string;
  fields?: any;
  missing?: string[];
  fieldChecks?: any;
  complianceStatus?: string;
  complianceScore?: number;
  summary?: string;
  status?: string;
}) {
  if (!io) return;
  io.to(`scan:${scanId}`).emit('scan:progress', payload);

  // If specific stages, emit dedicated events too
  if (payload.stage === 'ocr_started') {
    io.to(`scan:${scanId}`).emit('ocr:started', payload);
  } else if (payload.stage === 'fields_extracted') {
    io.to(`scan:${scanId}`).emit('fields:extracted', payload);
  } else if (payload.stage === 'rules_checked') {
    io.to(`scan:${scanId}`).emit('rules:checked', payload);
  } else if (payload.stage === 'completed') {
    io.to(`scan:${scanId}`).emit('scan:completed', payload);
  } else if (payload.stage === 'failed') {
    io.to(`scan:${scanId}`).emit('scan:error', payload);
  }
}

export function emitDashboardUpdate(payload: {
  scanId: string;
  productName: string;
  complianceStatus: string;
  complianceScore: number;
  missing: string[];
  createdAt: string;
}) {
  if (!io) return;
  io.to('dashboard:officer').emit('dashboard:new_scan', payload);
}

export function emitAgentEvent(scanId: string, eventType: string, payload: any) {
  if (!io) return;
  io.to(`scan:${scanId}`).emit(eventType, payload);
}
