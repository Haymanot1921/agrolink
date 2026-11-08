// mobile/src/shared/components/ui/AppCheckbox.tsx
// Single checkbox with optional label + description.

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

export interface AppCheckboxProps {
  checked: boolean;
  onToggle: (next: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  error?: string;
  style?: ViewStyle;
}

export function AppCheckbox({
  checked,
  onToggle,
  label,
  description,
  disabled,
  error,
  style,
}: AppCheckboxProps): React.ReactElement {
  const { language } = useLanguage();
  const fontFamily = pickFontFamily(language, 'regular');
  const bold = pickFontFamily(language, 'bold');

  return (
    <View style={style}>
      <TouchableOpacity
        onPress={() => onToggle(!checked)}
        disabled={disabled}
        style={[styles.row, disabled && styles.disabled]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked, disabled }}
        accessibilityLabel={label}
      >
        <View
          style={[
            styles.box,
            checked && styles.boxChecked,
            error ? styles.boxError : null,
          ]}
        >
          {checked ? <Text style={styles.tick}>✓</Text> : null}
        </View>
        <View style={styles.labels}>
          {label ? (
            <Text style={[styles.label, { fontFamily: bold }]}>{label}</Text>
          ) : null}
          {description ? (
            <Text style={[styles.description, { fontFamily }]}>{description}</Text>
          ) : null}
        </View>
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  disabled: { opacity: 0.5 },
  box: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  boxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  boxError: { borderColor: colors.danger },
  tick: { color: '#fff', fontSize: 14, fontWeight: '700', lineHeight: 16 },
  labels: { flex: 1 },
  label: { fontSize: typography.md, color: colors.text },
  description: {
    fontSize: typography.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  errorText: {
    fontSize: typography.xs + 1,
    color: colors.danger,
    marginTop: spacing.xs,
  },
});