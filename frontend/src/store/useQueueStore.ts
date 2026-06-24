import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'PATIENT' | 'RECEPTIONIST' | 'DOCTOR' | 'ADMIN';
}

interface Token {
  _id: string;
  tokenNumber: string;
  status: string;
  priorityScore: number;
  riskLevel: string;
  patientId: any;
  estimatedWaitTimeMinutes?: number;
  token?: string;
  name?: string;
  symptomsRaw?: string;
  aiRationale?: string;
  createdAt?: string;
}

interface QueueState {
  user: User | null;
  token: string | null;
  activeTokens: Token[];
  announcedToken: Token | null;
  undoBuffer: {
    tokenId: string;
    previousState: string;
    timeoutId: NodeJS.Timeout | null;
  } | null;
  setUser: (user: User, token: string) => void;
  logout: () => void;
  setActiveTokens: (tokens: Token[]) => void;
  setAnnouncedToken: (token: Token | null) => void;
  setUndoBuffer: (buffer: any) => void;
  clearUndoBuffer: () => void;
}

export const useQueueStore = create<QueueState>((set) => ({
  user: null,
  token: null, // JWT token
  activeTokens: [],
  announcedToken: null,
  undoBuffer: null,

  setUser: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
  setActiveTokens: (tokens) => set({ activeTokens: tokens }),
  setAnnouncedToken: (token) => set({ announcedToken: token }),
  setUndoBuffer: (buffer) => set({ undoBuffer: buffer }),
  clearUndoBuffer: () => set({ undoBuffer: null })
}));
