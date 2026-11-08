// mobile/src/shared/components/ui/Avatar.tsx
// Circular avatar with image or initials + online indicator.

import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@styles/colors';
import { typography } from '@styles/typography';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: AvatarSize;
  showOnline?: boolean;
  isOnline?: boolean;
  style?: ViewStyle;
}

const SIZES: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 44,
  lg: 64,
  xl: 96,
};

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]?.slice(0, 2).toUpperCase() ?? '?';
  return ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase();
}

function hashColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const palette = ['#2E7D32', '#7B1FA2', '#C2185B', '#1976D2', '#F57C00', '#00796B'];
  return palette[Math.abs(hash) % palette.length];
}

export function Avatar({
  uri,
  name,
  size = 'md',
  showOnline = false,
  isOnline = false,
  style,
}: AvatarProps): React.ReactElement {
  const dimension = SIZES[size];
  const fontSize = dimension * 0.4;
  const bg = hashColor(name ?? 'AG');

  return (
    <View style={[{ width: dimension, height: dimension }, style]}>
      <View
        style={[
          styles.avatar,
          {
            width: dimension,
            height: dimension,
            borderRadius: dimension / 2,
            backgroundColor: uri ? '#eee' : bg,
          },
        ]}
      >
        {uri ? (
          <Image
            source={{ uri }}
            style={{ width: dimension, height: dimension, borderRadius: dimension / 2 }}
          />
        ) : (
          <Text style={[styles.initials, { fontSize }]} numberOfLines={1}>
            {getInitials(name)}
          </Text>
        )}
      </View>
      {showOnline ? (
        <View
          style={[
            styles.online,
            {
              width: dimension * 0.28,
              height: dimension * 0.28,
              borderRadius: dimension * 0.14,
              backgroundColor: isOnline ? colors.success : colors.textMuted,
              borderWidth: dimension > 40 ? 3 : 2,
            },
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initials: { color: '#fff', fontWeight: '700' },
  online: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderColor: colors.background,
  },
});