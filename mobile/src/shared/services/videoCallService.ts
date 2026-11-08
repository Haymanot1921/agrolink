// mobile/src/shared/services/videoCallService.ts
// Abstraction over the video-call provider (Agora or similar).
// SRS refs: §5.8 (human video consultations).
// ⚠️ NOT delivery tracking — consultation calls only (SRS §2.4).

export interface VideoCallSession {
  channelId: string;
  token: string;
  uid: number;
  role: 'host' | 'guest';
  expiresAt: number;
}

export interface VideoCallProvider {
  createToken(consultationId: string, role: 'host' | 'guest'): Promise<VideoCallSession>;
  join(session: VideoCallSession): Promise<void>;
  leave(): Promise<void>;
}

// Default no-op provider — the actual provider (e.g. Agora) is plugged in
// by the environment-specific implementation (prod builds only).
let provider: VideoCallProvider | null = null;

export function registerVideoCallProvider(p: VideoCallProvider): void {
  provider = p;
}

function requireProvider(): VideoCallProvider {
  if (!provider) {
    throw new Error('Video call provider not registered');
  }
  return provider;
}

export const videoCallService = {
  createToken(consultationId: string, role: 'host' | 'guest'): Promise<VideoCallSession> {
    return requireProvider().createToken(consultationId, role);
  },
  join(session: VideoCallSession): Promise<void> {
    return requireProvider().join(session);
  },
  leave(): Promise<void> {
    return requireProvider().leave();
  },
};