'use client';

import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useQueueStore } from '../store/useQueueStore';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`;

export default function SocketClient() {
  const { setActiveTokens, setAnnouncedToken } = useQueueStore();

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

    socket.on('ALL_TOKENS_BROADCAST', (data) => {
      console.log('Received live all tokens update:', data);
      const normalized = data.map((t: any) => ({
        ...t,
        id: t._id,
        token: t.tokenNumber,
        name: t.patientId?.name || 'Unknown',
        patientId: t.patientId?._id || t.patientId || null,
      }));
      useQueueStore.getState().setAllTokens(normalized);
    });

    socket.on('CRITICAL_ALARM_TRIGGER', (tokenData) => {
      console.error('CRITICAL ALARM RECEIVED FOR TOKEN:', tokenData.tokenNumber);
      // In a real app, you would dispatch a global toast or modal here
    });

    socket.on('ANNOUNCE_TOKEN', (tokenData) => {
      console.log('Announce token received:', tokenData);
      setAnnouncedToken(tokenData);
    });

    return () => {
      socket.disconnect();
    };
  }, [setActiveTokens, setAnnouncedToken]);

  return null; // This is a headless component
}
