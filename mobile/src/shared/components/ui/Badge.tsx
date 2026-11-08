// mobile/src/shared/components/ui/Badge.tsx
// Small status / count / label pill.

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  label: string | number;
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Render as a dot only (no text). */
  dot?: boolean;
  style?: StyleProp<ViewStyle>;
}

const VARIANTS: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: '#E5E7EB', text: '#374151' },
  primary: { bg: colors.primaryLight, text: colors.primary },
  success: { bg: '#DCFCE7', text: '#166534' },
  warning: { bg: '#FEF3C7', text: '#92400E' },
  danger: { bg: '#FEE2E2', text: '#991B1B' },
  info: { bg: '#DBEAFE', text: '#1E40AF' },
};

export function Badge({
  label,
  variant = 'default',
  size = 'md',
  dot = false,
  style,
}: BadgeProps): React.ReactElement {
  const { bg, text } = VARIANTS[variant];
  const dim = size === 'sm' ? 8 : 10;

  if (dot) {
    return (
      <View style={[{ width: dim, height: dim, borderRadius: dim / 2, backgroundColor: text }, style]} />
    );
  }

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          paddingHorizontal: size === 'sm' ? 6 : 8,
          paddingVertical: size === 'sm' ? 2 : 3,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: text,
            fontSize: size === 'sm' ? typography.xs : typography.xs + 1,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderRadius: 999, alignSelf: 'flex-start' },
  text: { fontWeight: '700' },
});