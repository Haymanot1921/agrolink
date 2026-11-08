// mobile/src/shared/components/ui/AppSelect.tsx
// Select/dropdown. Tapping opens a BottomSheet with options.

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ViewStyle,
} from 'react-native';

import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';
import { BottomSheet } from './BottomSheet';

export interface SelectOption<T extends string | number> {
  label: string;
  value: T;
}

export interface AppSelectProps<T extends string | number> {
  label?: string;
  placeholder?: string;
  options: SelectOption<T>[];
  value?: T | null;
  onChange: (value: T) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  containerStyle?: ViewStyle;
}

export function AppSelect<T extends string | number>({
  label,
  placeholder = 'Select…',
  options,
  value,
  onChange,
  error,
  required,
  disabled,
  containerStyle,
}: AppSelectProps<T>): React.ReactElement {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { fontFamily: pickFontFamily(language, 'bold') }]}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}

      <TouchableOpacity
        style={[
          styles.trigger,
          error && styles.triggerError,
          disabled && styles.disabled,
        ]}
        onPress={() => setOpen(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: open }}
      >
        <Text
          style={[
            styles.value,
            { fontFamily: pickFontFamily(language, 'regular') },
            !selected && styles.placeholder,
          ]}
          numberOfLines={1}
        >
          {selected?.label ?? placeholder}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <BottomSheet visible={open} onClose={() => setOpen(false)}>
        <Text style={[styles.sheetTitle, { fontFamily: pickFontFamily(language, 'bold') }]}>
          {label ?? placeholder}
        </Text>
        <FlatList
          data={options}
          keyExtractor={(item) => String(item.value)}
          renderItem={({ item }) => {
            const isSelected = item.value === value;
            return (
              <TouchableOpacity
                style={[styles.optionRow, isSelected && styles.optionSelected]}
                onPress={() => {
                  onChange(item.value);
                  setOpen(false);
                }}
              >
                <Text
                  style={[styles.optionText, { fontFamily: pickFontFamily(language, 'regular') }]}
                >
                  {item.label}
                </Text>
                {isSelected ? <Text style={styles.check}>✓</Text> : null}
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{ paddingBottom: spacing.lg }}
        />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  label: { fontSize: typography.sm, color: colors.text, marginBottom: spacing.xs },
  required: { color: colors.danger },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  triggerError: { borderColor: colors.danger },
  disabled: { opacity: 0.5 },
  value: { flex: 1, fontSize: typography.md, color: colors.text },
  placeholder: { color: colors.textMuted },
  chevron: { fontSize: 14, color: colors.textMuted },
  errorText: { fontSize: typography.xs + 1, color: colors.danger },
  sheetTitle: {
    fontSize: typography.lg,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  optionSelected: { backgroundColor: colors.primaryLight },
  optionText: { flex: 1, fontSize: typography.md, color: colors.text },
  check: { color: colors.primary, fontWeight: '700', fontSize: 16 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
});