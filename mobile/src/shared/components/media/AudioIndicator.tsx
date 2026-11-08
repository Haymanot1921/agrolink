// mobile/src/shared/components/media/AudioIndicator.tsx
// Small animated waveform used while recording or playing voice messages.
// SRS refs: §5.11 (voice messages), FR-MESSAGE-002.

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@styles/colors';

export interface AudioIndicatorProps {
  /** 'recording' | 'playing' | 'idle' */
  mode?: 'recording' | 'playing' | 'idle';
  color?: string;
  bars?: number;
  height?: number;
  style?: ViewStyle;
}

export function AudioIndicator({
  mode = 'idle',
  color = colors.primary,
  bars = 5,
  height = 24,
  style,
}: AudioIndicatorProps): React.ReactElement {
  const anims = useRef(
    Array.from({ length: bars }, () => new Animated.Value(0.3)),
  ).current;

  useEffect(() => {
    const active = mode !== 'idle';

    const animations = anims.map((anim, idx) => {
      if (!active) return Animated.timing(anim, { toValue: 0.3, duration: 200, useNativeDriver: true });
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 300 + idx * 60,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 300 + idx * 60,
            useNativeDriver: true,
          }),
        ]),
      );
    });

    animations.forEach((a) => a.start());
    return () => animations.forEach((a) => a.stop());
  }, [mode, anims]);

  const tint = mode === 'recording' ? colors.danger : mode === 'playing' ? color : colors.textMuted;

  return (
    <View style={[styles.row, { height }, style]}>
      {anims.map((anim, idx) => (
        <Animated.View
          key={idx}
          style={{
            width: 4,
            height: '100%',
            borderRadius: 2,
            backgroundColor: tint,
            transform: [{ scaleY: anim }],
            marginRight: idx === bars - 1 ? 0 : 3,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});