// mobile/src/shared/components/navigation/TabBarIcon.tsx
// Icon + label for bottom tab bar with optional badge.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@styles/colors';
import { typography } from '@styles/typography';

export interface TabBarIconProps {
  icon: React.ReactNode;
  label?: string;
  focused: boolean;
  badgeCount?: number;
  color?: string;
}

export function TabBarIcon({
  icon,
  label,
  focused,
  badgeCount,
  color,
}: TabBarIconProps): React.ReactElement {
  const tint = color ?? (focused ? colors.primary : colors.textMuted);

  return (
    <View style={styles.wrap}>
      <View>
        {icon}
        {badgeCount !== undefined && badgeCount > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeCount > 99 ? '99+' : badgeCount}</Text>
          </View>
        ) : null}
      </View>
      {label ? (
        <Text
          style={[styles.label, { color: tint, fontWeight: focused ? '700' : '500' }]}
          numberOfLines={1}
        >
          {label}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 4 },
  label: { fontSize: typography.xs, marginTop: 2 },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.danger,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.card,
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
});