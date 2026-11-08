// mobile/src/shared/components/navigation/DrawerItem.tsx
// A single row in a side drawer. Shows icon, label, active state, badge.
// SRS refs: §11.7 (role-based drawers for all 5 actors).

import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';
import { Badge } from '@components/ui/Badge';

export interface DrawerItemProps {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  active?: boolean;
  badge?: string | number;
  disabled?: boolean;
  style?: ViewStyle;
}

export function DrawerItem({
  label,
  icon,
  onPress,
  active = false,
  badge,
  disabled = false,
  style,
}: DrawerItemProps): React.ReactElement {
  const { language } = useLanguage();
  const fontFamily = pickFontFamily(language, active ? 'bold' : 'regular');

  return (
    <TouchableOpacity
      style={[styles.item, active && styles.itemActive, disabled && styles.itemDisabled, style]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected: active, disabled }}
      accessibilityLabel={label}
    >
      <View style={styles.icon}>{icon}</View>
      <Text
        style={[styles.label, { fontFamily, color: active ? colors.primary : colors.text }]}
        numberOfLines={1}
      >
        {label}
      </Text>
      {badge !== undefined ? <Badge label={badge} variant="danger" size="sm" /> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
    marginHorizontal: spacing.sm,
    marginBottom: 2,
  },
  itemActive: { backgroundColor: colors.primaryLight },
  itemDisabled: { opacity: 0.5 },
  icon: { width: 28, alignItems: 'center', marginRight: spacing.sm },
  label: { flex: 1, fontSize: typography.md },
});