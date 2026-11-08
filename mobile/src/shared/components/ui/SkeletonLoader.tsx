// mobile/src/shared/components/ui/SkeletonLoader.tsx
// Animated shimmer placeholder. Presets for common shapes.

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import { colors } from '@styles/colors';

export interface SkeletonLoaderProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonLoader({
  width = '100%',
  height = 16,
  borderRadius = 4,
  style,
}: SkeletonLoaderProps): React.ReactElement {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.border,
          opacity,
        },
        style,
      ]}
    />
  );
}

// Preset layouts
export function SkeletonText({ lines = 3 }: { lines?: number }): React.ReactElement {
  return (
    <View style={{ gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLoader key={i} height={14} width={i === lines - 1 ? '60%' : '100%'} />
      ))}
    </View>
  );
}

export function SkeletonCard(): React.ReactElement {
  return (
    <View style={styles.card}>
      <SkeletonLoader width={80} height={80} borderRadius={8} />
      <View style={{ flex: 1, gap: 8 }}>
        <SkeletonLoader height={16} width="70%" />
        <SkeletonLoader height={12} width="50%" />
        <SkeletonLoader height={12} width="40%" />
      </View>
    </View>
  );
}

export function SkeletonList({ count = 5 }: { count?: number }): React.ReactElement {
  return (
    <View style={{ gap: 12 }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
});