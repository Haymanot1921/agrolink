// mobile/src/shared/store/callStore.ts
// Active video-consultation call state.
// SRS refs: §5.8 (video consultations with human experts).
// ⚠️ NOT delivery tracking — consultation calls only (SRS §2.4).

import { create } from 'zustand';

export type CallStatus = 'idle' | 'connecting' | 'active' | 'ended' | 'failed';

export interface ActiveCall {
  consultationId: string;
  channelId: string;
  token: string;
  uid: number;
  role: 'host' | 'guest';
  peerName: string;
  peerAvatarUrl?: string;
  startedAt: number;
  expiresAt: number;
}

interface CallState {
  status: CallStatus;
  call: ActiveCall | null;
  isMuted: boolean;
  isCameraOff: boolean;
  isSpeakerOn: boolean;
  error: string | null;
}

interface CallActions {
  startConnecting: (call: ActiveCall) => void;
  setActive: () => void;
  setEnded: () => void;
  setFailed: (error: string) => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  toggleSpeaker: () => void;
  reset: () => void;
}

const initialState: CallState = {
  status: 'idle',
  call: null,
  isMuted: false,
  isCameraOff: false,
  isSpeakerOn: true,
  error: null,
};

export const useCallStore = create<CallState & CallActions>((set) => ({
  ...initialState,

  startConnecting: (call) =>
    set({
      status: 'connecting',
      call,
      isMuted: false,
      isCameraOff: false,
      isSpeakerOn: true,
      error: null,
    }),

  setActive: () => set({ status: 'active' }),

  setEnded: () => set({ status: 'ended' }),

  setFailed: (error) => set({ status: 'failed', error }),

  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),

  toggleCamera: () => set((s) => ({ isCameraOff: !s.isCameraOff })),

  toggleSpeaker: () => set((s) => ({ isSpeakerOn: !s.isSpeakerOn })),

  reset: () => set(initialState),
}));