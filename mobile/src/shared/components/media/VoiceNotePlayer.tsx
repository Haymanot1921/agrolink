// mobile/src/shared/components/media/VoiceNotePlayer.tsx
// Playback control for a voice message (chat bubbles).
// SRS refs: §5.11 FR-MESSAGE-002.

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { AudioIndicator } from './AudioIndicator';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';

export interface VoiceNotePlayerProps {
  uri: string;
  /** Known duration (seconds) — improves initial UI. */
  durationSec?: number;
  color?: string;
  style?: ViewStyle;
}

function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

export function VoiceNotePlayer({
  uri,
  durationSec,
  color = colors.primary,
  style,
}: VoiceNotePlayerProps): React.ReactElement {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(durationSec ?? 0);

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, []);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    setPosition(status.positionMillis / 1000);
    if (status.durationMillis) setDuration(status.durationMillis / 1000);
    setPlaying(status.isPlaying);
    if (status.didJustFinish) {
      setPlaying(false);
      setPosition(0);
      soundRef.current?.setPositionAsync(0).catch(() => {});
    }
  };

  const togglePlay = async () => {
    if (!soundRef.current) {
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        onPlaybackStatusUpdate,
      );
      soundRef.current = sound;
      setPlaying(true);
      return;
    }
    if (playing) await soundRef.current.pauseAsync();
    else await soundRef.current.playAsync();
  };

  const progress = duration > 0 ? position / duration : 0;

  return (
    <View style={[styles.wrap, style]}>
      <TouchableOpacity
        style={[styles.playBtn, { backgroundColor: color }]}
        onPress={togglePlay}
        accessibilityRole="button"
        accessibilityLabel={playing ? 'Pause voice message' : 'Play voice message'}
      >
        <Text style={styles.playIcon}>{playing ? '❚❚' : '▶'}</Text>
      </TouchableOpacity>

      <AudioIndicator mode={playing ? 'playing' : 'idle'} color={color} bars={12} height={20} />

      <View style={styles.progressTrack}>
        <View
          style={[styles.progressFill, { backgroundColor: color, width: `${progress * 100}%` }]}
        />
      </View>

      <Text style={styles.time}>{formatDuration(playing ? position : duration)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: 280,
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: { color: '#fff', fontSize: 14, fontWeight: '700' },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 2 },
  time: { fontSize: typography.xs, color: colors.textMuted, minWidth: 32, textAlign: 'right' },
});