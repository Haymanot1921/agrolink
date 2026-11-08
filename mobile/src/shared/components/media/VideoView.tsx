// mobile/src/shared/components/media/VideoView.tsx
// Inline video player for article media, case attachments, verification clips.
// SRS refs: §5.10 (article media), §5.8 (case attachments).

import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';

export interface VideoViewProps {
  uri: string;
  width?: number | string;
  height?: number;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  showControls?: boolean;
  resizeMode?: ResizeMode;
  style?: ViewStyle;
}

export function VideoView({
  uri,
  width = '100%',
  height = 220,
  autoPlay = false,
  loop = false,
  muted = false,
  showControls = true,
  resizeMode = ResizeMode.CONTAIN,
  style,
}: VideoViewProps): React.ReactElement {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const isPlaying = status && 'isPlaying' in status ? status.isPlaying : false;

  const togglePlay = async () => {
    if (!videoRef.current) return;
    if (isPlaying) await videoRef.current.pauseAsync();
    else await videoRef.current.playAsync();
  };

  return (
    <View style={[styles.wrap, { width, height }, style]}>
      <Video
        ref={videoRef}
        source={{ uri }}
        style={StyleSheet.absoluteFill}
        resizeMode={resizeMode}
        shouldPlay={autoPlay}
        isLooping={loop}
        isMuted={muted}
        useNativeControls={false}
        onPlaybackStatusUpdate={(s) => setStatus(s)}
        onLoad={() => setLoading(false)}
      />
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#fff" />
        </View>
      ) : null}
      {showControls ? (
        <TouchableOpacity
          style={styles.controls}
          onPress={togglePlay}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
        >
          <View style={styles.playBtn}>
            <Text style={styles.playIcon}>{isPlaying ? '❚❚' : '▶'}</Text>
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  center: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  controls: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  playBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: { color: '#fff', fontSize: 22 },
});