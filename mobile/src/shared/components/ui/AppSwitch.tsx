// mobile/src/shared/components/ui/AppSwitch.tsx
// Toggle switch with label + description.

import React from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';

import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';

export interface AppSwitchProps {
  value: boolean;
  onValueChange: (next: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export function AppSwitch({
  value,
  onValueChange,
  label,
  description,
  disabled,
  style,
}: AppSwitchProps): React.ReactElement {
  const { language } = useLanguage();
  const bold = pickFontFamily(language, 'bold');
  const regular = pickFontFamily(language, 'regular');

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.text}>
        {label ? <Text style={[styles.label, { fontFamily: bold }]}>{label}</Text> : null}
        {description ? (
          <Text style={[styles.description, { fontFamily: regular }]}>{description}</Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: colors.border, true: colors.primaryLight }}
        thumbColor={
          Platform.OS === 'android'
            ? value
              ? colors.primary
              : '#f4f3f4'
            : undefined
        }
        ios_backgroundColor={colors.border}
        accessibilityRole="switch"
        accessibilityLabel={label}
        accessibilityState={{ checked: value, disabled: Boolean(disabled) }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  text: { flex: 1, paddingRight: spacing.md },
  label: { fontSize: typography.md, color: colors.text },
  description: {
    fontSize: typography.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
});