// mobile/src/shared/services/microphoneService.ts
// Recording + playback primitives.
// SRS refs: §5.11 (voice messages), §5.8 (video consultations).

import { Audio } from 'expo-av';

export interface RecordedAudio {
  uri: string;
  durationSec: number;
}

export const microphoneService = {
  async requestPermission(): Promise<boolean> {
    const { status } = await Audio.requestPermissionsAsync();
    return status === 'granted';
  },

  async configureForRecording(): Promise<void> {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
  },

  async configureForPlayback(): Promise<void> {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: false,
    });
  },

  async createRecording(): Promise<Audio.Recording> {
    await this.configureForRecording();
    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY,
    );
    return recording;
  },

  async stopRecording(recording: Audio.Recording): Promise<RecordedAudio | null> {
    try {
      const status = await recording.getStatusAsync();
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (!uri) return null;
      const durationSec = status.isRecording ? (status.durationMillis ?? 0) / 1000 : 0;
      return { uri, durationSec };
    } catch {
      return null;
    }
  },

  async createPlayer(uri: string, onEnd?: () => void): Promise<Audio.Sound> {
    await this.configureForPlayback();
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true },
      (status) => {
        if (status.isLoaded && status.didJustFinish) onEnd?.();
      },
    );
    return sound;
  },
};