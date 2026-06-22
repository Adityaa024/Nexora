'use client';

import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useQueueStore } from '../store/useQueueStore';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export default function SocketClient() {
  const { setActiveTokens } = useQueueStore();

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      console.log('Connected to WebSocket server:', socket.id);
    });

    socket.on('QUEUE_STATE_BROADCAST', (data) => {
      console.log('Received live queue updates:', data);
      const normalized = data.map((t: any) => ({
        id: t._id,
        token: t.tokenNumber,
        name: t.patientId?.name || 'Unknown',
        patientId: t.patientId?._id || t.patientId || null,
        status: t.status,
        priorityScore: t.priorityScore,
        riskLevel: t.riskLevel,
        estimatedWaitTimeMinutes: t.estimatedWaitTimeMinutes
      }));
      setActiveTokens(normalized);
    });

    socket.on('CRITICAL_ALARM_TRIGGER', (tokenData) => {
      console.error('CRITICAL ALARM RECEIVED FOR TOKEN:', tokenData.tokenNumber);
      // In a real app, you would dispatch a global toast or modal here
    });

    return () => {
      socket.disconnect();
    };
  }, [setActiveTokens]);

  return null; // This is a headless component
}
