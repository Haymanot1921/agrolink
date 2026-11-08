// mobile/src/shared/components/media/VoiceNoteRecorder.tsx
// Press-and-hold to record a voice message.
// SRS refs: §5.11 FR-MESSAGE-002.

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ViewStyle,
} from 'react-native';
import { Audio } from 'expo-av';
import { AudioIndicator } from './AudioIndicator';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useTranslation } from '@i18n/hooks/useTranslation';

export interface RecordedNote {
  uri: string;
  durationSec: number;
}

export interface VoiceNoteRecorderProps {
  onRecorded: (note: RecordedNote) => void;
  onCancel?: () => void;
  maxDurationSec?: number;
  style?: ViewStyle;
}

export function VoiceNoteRecorder({
  onRecorded,
  onCancel,
  maxDurationSec = 120,
  style,
}: VoiceNoteRecorderProps): React.ReactElement {
  const { t } = useTranslation('common');
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = async () => {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission required', 'Microphone access is required.');
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: rec } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      recordingRef.current = rec;
      setRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((d) => {
          if (d + 1 >= maxDurationSec) {
            stopRecording();
            return maxDurationSec;
          }
          return d + 1;
        });
      }, 1000);
    } catch {
      Alert.alert('Error', t('messages.tryAgain'));
    }
  };

  const stopRecording = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (!recordingRef.current) return;
    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;
      setRecording(false);
      if (uri && duration > 0) {
        onRecorded({ uri, durationSec: duration });
      } else if (onCancel) {
        onCancel();
      }
    } catch {
      setRecording(false);
    }
  };

  const cancelRecording = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recordingRef.current) {
      await recordingRef.current.stopAndUnloadAsync().catch(() => {});
      recordingRef.current = null;
    }
    setRecording(false);
    setDuration(0);
    onCancel?.();
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <View style={[styles.wrap, style]}>
      {recording ? (
        <>
          <TouchableOpacity onPress={cancelRecording} accessibilityRole="button">
            <Text style={styles.cancel}>✕</Text>
          </TouchableOpacity>
          <View style={styles.recordingBar}>
            <AudioIndicator mode="recording" bars={14} height={22} />
            <Text style={styles.timer}>{formatTime(duration)}</Text>
          </View>
          <TouchableOpacity
            onPress={stopRecording}
            style={styles.stopBtn}
            accessibilityRole="button"
            accessibilityLabel="Stop and send"
          >
            <Text style={styles.stopIcon}>■</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          onPress={startRecording}
          style={styles.micBtn}
          accessibilityRole="button"
          accessibilityLabel="Record voice message"
        >
          <Text style={styles.micIcon}>🎤</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 24,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  micBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
  micIcon: { fontSize: 20 },
  cancel: { fontSize: 18, color: colors.danger, paddingHorizontal: spacing.sm },
  recordingBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  timer: {
    fontSize: typography.sm,
    color: colors.danger,
    fontWeight: '700',
    minWidth: 40,
  },
  stopBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopIcon: { color: '#fff', fontSize: 14 },
});