// mobile/src/shared/hooks/useCallKeep.ts
// Thin wrapper over the app's video consultation state.
// SRS refs: §5.8 (video consultations with human experts).
//
// ⚠️ Not delivery/dispatch "call keep" — this is consultation call state only.

import { useCallback, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';

export interface CallState {
  isActive: boolean;
  isMuted: boolean;
  isSpeakerOn: boolean;
  isVideoEnabled: boolean;
  startedAt: number | null;
}

export interface UseCallKeepResult extends CallState {
  start: () => Promise<void>;
  end: () => Promise<void>;
  toggleMute: () => void;
  toggleSpeaker: () => void;
  toggleVideo: () => void;
  durationSec: number;
}

export function useCallKeep(): UseCallKeepResult {
  const [state, setState] = useState<CallState>({
    isActive: false,
    isMuted: false,
    isSpeakerOn: true,
    isVideoEnabled: true,
    startedAt: null,
  });
  const [durationSec, setDurationSec] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!state.isActive || !state.startedAt) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }
    intervalRef.current = setInterval(() => {
      setDurationSec(Math.floor((Date.now() - state.startedAt!) / 1000));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isActive, state.startedAt]);

  const start = useCallback(async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
    setState({
      isActive: true,
      isMuted: false,
      isSpeakerOn: true,
      isVideoEnabled: true,
      startedAt: Date.now(),
    });
    setDurationSec(0);
  }, []);

  const end = useCallback(async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: false,
    }).catch(() => {});
    setState({
      isActive: false,
      isMuted: false,
      isSpeakerOn: true,
      isVideoEnabled: true,
      startedAt: null,
    });
    setDurationSec(0);
  }, []);

  return {
    ...state,
    durationSec,
    start,
    end,
    toggleMute: () => setState((s) => ({ ...s, isMuted: !s.isMuted })),
    toggleSpeaker: () => setState((s) => ({ ...s, isSpeakerOn: !s.isSpeakerOn })),
    toggleVideo: () => setState((s) => ({ ...s, isVideoEnabled: !s.isVideoEnabled })),
  };
}