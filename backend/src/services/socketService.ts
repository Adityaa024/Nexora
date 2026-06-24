import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server } from 'http';
import Token from '../models/Token';
import ClinicMetrics from '../models/ClinicMetrics';
import { computeQueueWithEstimations } from './predictionService';

let io: SocketIOServer;

export const initializeSocket = (server: Server) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*', // For development. Adjust for production
      methods: ['GET', 'POST', 'PUT']
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join specific rooms based on role if needed
    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

export const emitQueueStateUpdate = async () => {
  try {
    const activeTokens = await computeQueueWithEstimations();

    if (io) {
      io.emit('QUEUE_STATE_BROADCAST', activeTokens);
    }
  } catch (error) {
    console.error('Error emitting queue state:', error);
  }
};

export const emitCriticalAlarm = (tokenData: any) => {
  if (io) {
    io.emit('CRITICAL_ALARM_TRIGGER', tokenData);
  }
};

export const emitAnnounceToken = (tokenData: any) => {
  if (io) {
    io.emit('ANNOUNCE_TOKEN', tokenData);
  }
};

export const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
