// mobile/src/shared/hooks/useMicrophone.ts
// Permission + simple recording/playback state (voice messages, video calls).
// SRS refs: §5.11 (voice messages), §5.8 (video consultations).

import { useCallback, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';

export interface UseMicrophoneResult {
  permissionGranted: boolean | null;
  requestPermission: () => Promise<boolean>;
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<{ uri: string; durationSec: number } | null>;
  isPlaying: boolean;
  playUri: (uri: string) => Promise<void>;
  stopPlayback: () => Promise<void>;
  error: string | null;
}

export function useMicrophone(): UseMicrophoneResult {
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const startedAtRef = useRef<number>(0);

  useEffect(() => {
    (async () => {
      const { status } = await Audio.getPermissionsAsync();
      setPermissionGranted(status === 'granted');
    })();
    return () => {
      recordingRef.current?.stopAndUnloadAsync().catch(() => {});
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, []);

  const requestPermission = useCallback(async () => {
    const { status } = await Audio.requestPermissionsAsync();
    const granted = status === 'granted';
    setPermissionGranted(granted);
    return granted;
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      if (permissionGranted !== true) {
        const ok = await requestPermission();
        if (!ok) {
          setError('Microphone permission not granted');
          return;
        }
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      recordingRef.current = recording;
      startedAtRef.current = Date.now();
      setIsRecording(true);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [permissionGranted, requestPermission]);

  const stopRecording = useCallback(async () => {
    if (!recordingRef.current) return null;
    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      const durationSec = (Date.now() - startedAtRef.current) / 1000;
      recordingRef.current = null;
      setIsRecording(false);
      return uri ? { uri, durationSec } : null;
    } catch (e) {
      setError((e as Error).message);
      setIsRecording(false);
      return null;
    }
  }, []);

  const playUri = useCallback(async (uri: string) => {
    try {
      await soundRef.current?.unloadAsync();
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
          }
        },
      );
      soundRef.current = sound;
      setIsPlaying(true);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  const stopPlayback = useCallback(async () => {
    await soundRef.current?.stopAsync().catch(() => {});
    await soundRef.current?.unloadAsync().catch(() => {});
    soundRef.current = null;
    setIsPlaying(false);
  }, []);

  return {
    permissionGranted,
    requestPermission,
    isRecording,
    startRecording,
    stopRecording,
    isPlaying,
    playUri,
    stopPlayback,
    error,
  };
}