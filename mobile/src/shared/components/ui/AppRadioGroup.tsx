// mobile/src/shared/components/ui/AppRadioGroup.tsx
// Single-select radio group.

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';

export interface RadioOption<T extends string | number> {
  label: string;
  value: T;
  description?: string;
  disabled?: boolean;
}

export interface AppRadioGroupProps<T extends string | number> {
  label?: string;
  options: RadioOption<T>[];
  value?: T | null;
  onChange: (value: T) => void;
  error?: string;
  required?: boolean;
  direction?: 'vertical' | 'horizontal';
  style?: ViewStyle;
}

export function AppRadioGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
  error,
  required,
  direction = 'vertical',
  style,
}: AppRadioGroupProps<T>): React.ReactElement {
  const { language } = useLanguage();
  const bold = pickFontFamily(language, 'bold');
  const regular = pickFontFamily(language, 'regular');

  return (
    <View style={[styles.wrapper, style]}>
      {label ? (
        <Text style={[styles.label, { fontFamily: bold }]}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}

      <View style={direction === 'horizontal' ? styles.horizontal : styles.vertical}>
        {options.map((option) => {
          const isSelected = value === option.value;
          const isDisabled = Boolean(option.disabled);

          return (
            <TouchableOpacity
              key={String(option.value)}
              style={[
                styles.option,
                direction === 'horizontal' && styles.optionHorizontal,
                isDisabled && styles.disabled,
              ]}
              onPress={() => onChange(option.value)}
              disabled={isDisabled}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected, disabled: isDisabled }}
            >
              <View style={[styles.circle, isSelected && styles.circleSelected]}>
                {isSelected ? <View style={styles.dot} /> : null}
              </View>
              <View style={styles.text}>
                <Text style={[styles.optionLabel, { fontFamily: regular }]}>{option.label}</Text>
                {option.description ? (
                  <Text style={[styles.description, { fontFamily: regular }]}>
                    {option.description}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.sm },
  label: { fontSize: typography.sm, color: colors.text, marginBottom: spacing.xs },
  required: { color: colors.danger },
  vertical: { gap: spacing.sm },
  horizontal: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  option: { flexDirection: 'row', alignItems: 'flex-start' },
  optionHorizontal: { marginRight: spacing.md },
  disabled: { opacity: 0.5 },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 1,
  },
  circleSelected: { borderColor: colors.primary },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  text: { flex: 1 },
  optionLabel: { fontSize: typography.md, color: colors.text },
  description: { fontSize: typography.sm, color: colors.textMuted, marginTop: 2 },
  errorText: { fontSize: typography.xs + 1, color: colors.danger, marginTop: spacing.xs },
});