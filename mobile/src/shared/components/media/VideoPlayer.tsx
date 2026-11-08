// mobile/src/shared/components/media/VideoPlayer.tsx
// Full-screen-capable video player for consultation recordings / article media.
// SRS refs: §5.8 (consultation media), §5.10 (article media).

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';

export interface VideoPlayerProps {
  uri: string;
  /** Aspect ratio (default 16:9). */
  aspect?: number;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  style?: ViewStyle;
  /** Allow full-screen toggle (default: true). */
  allowFullscreen?: boolean;
}

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
}

export function VideoPlayer({
  uri,
  aspect = 16 / 9,
  autoPlay = false,
  loop = false,
  style,
  allowFullscreen = true,
}: VideoPlayerProps): React.ReactElement {
  const insets = useSafeAreaInsets();
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  const isPlaying = status && 'isPlaying' in status ? status.isPlaying : false;
  const positionMs = status && 'positionMillis' in status ? status.positionMillis : 0;
  const durationMs = status && 'durationMillis' in status ? status.durationMillis ?? 0 : 0;
  const progress = durationMs > 0 ? positionMs / durationMs : 0;

  const togglePlay = async () => {
    if (!videoRef.current) return;
    if (isPlaying) await videoRef.current.pauseAsync();
    else await videoRef.current.playAsync();
  };

  const renderPlayer = (fs: boolean) => (
    <View style={fs ? StyleSheet.absoluteFillObject : { width: '100%', aspectRatio: aspect, borderRadius: 12, overflow: 'hidden', backgroundColor: '#000' }}>
      <Video
        ref={videoRef}
        source={{ uri }}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={autoPlay}
        isLooping={loop}
        useNativeControls={false}
        onPlaybackStatusUpdate={setStatus}
        onLoad={() => setLoading(false)}
      />
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#fff" />
        </View>
      ) : null}

      {/* Bottom controls */}
      <View style={[styles.controls, { paddingBottom: fs ? insets.bottom + spacing.sm : spacing.sm }]}>
        <TouchableOpacity onPress={togglePlay} style={styles.ctrlBtn} accessibilityRole="button">
          <Text style={styles.ctrlIcon}>{isPlaying ? '❚❚' : '▶'}</Text>
        </TouchableOpacity>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.time}>
          {formatTime(positionMs)} / {formatTime(durationMs)}
        </Text>
        {allowFullscreen ? (
          <TouchableOpacity
            onPress={() => setFullscreen(!fs)}
            style={styles.ctrlBtn}
            accessibilityRole="button"
            accessibilityLabel={fs ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            <Text style={styles.ctrlIcon}>{fs ? '⤢' : '⛶'}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );

  return (
    <View style={style}>
      {renderPlayer(false)}
      {fullscreen ? (
        <Modal visible animationType="fade" onRequestClose={() => setFullscreen(false)}>
          <View style={styles.fullscreenBg}>{renderPlayer(true)}</View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  controls: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  ctrlBtn: { padding: spacing.xs },
  ctrlIcon: { color: '#fff', fontSize: 16 },
  progressTrack: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.primary },
  time: { color: '#fff', fontSize: 11, minWidth: 80, textAlign: 'right' },
  fullscreenBg: { flex: 1, backgroundColor: '#000' },
});