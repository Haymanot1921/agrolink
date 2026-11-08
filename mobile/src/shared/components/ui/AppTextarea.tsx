// mobile/src/shared/components/ui/AppTextarea.tsx
// Multi-line text input (notes, descriptions, consultation requests).

import React, { forwardRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';

import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';

export interface AppTextareaProps extends Omit<TextInputProps, 'style' | 'multiline'> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  showCounter?: boolean;
  containerStyle?: ViewStyle;
}

export const AppTextarea = forwardRef<TextInput, AppTextareaProps>(function AppTextarea(
  {
    label,
    error,
    hint,
    required = false,
    rows = 4,
    maxLength,
    showCounter = false,
    containerStyle,
    onFocus,
    onBlur,
    value,
    ...rest
  },
  ref,
): React.ReactElement {
  const { language } = useLanguage();
  const [focused, setFocused] = useState(false);

  const fontFamily = pickFontFamily(language, 'regular');
  const borderColor = error ? colors.danger : focused ? colors.primary : colors.border;
  const charCount = (value ?? '').length;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { fontFamily: pickFontFamily(language, 'bold') }]}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}

      <View style={[styles.textareaWrap, { borderColor }, focused && styles.focused]}>
        <TextInput
          ref={ref}
          multiline
          textAlignVertical="top"
          style={[styles.textarea, { fontFamily, minHeight: rows * 24 }]}
          placeholderTextColor={colors.textMuted}
          maxLength={maxLength}
          value={value}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
      </View>

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          {error ? (
            <Text style={[styles.helper, styles.errorText]}>{error}</Text>
          ) : hint ? (
            <Text style={styles.helper}>{hint}</Text>
          ) : null}
        </View>
        {showCounter && maxLength ? (
          <Text style={styles.counter}>
            {charCount}/{maxLength}
          </Text>
        ) : null}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  label: { fontSize: typography.sm, color: colors.text, marginBottom: spacing.xs },
  required: { color: colors.danger },
  textareaWrap: {
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  focused: { borderWidth: 2, paddingHorizontal: spacing.md - 1, paddingVertical: spacing.sm - 1 },
  textarea: { fontSize: typography.md, color: colors.text },
  row: { flexDirection: 'row', alignItems: 'center' },
  helper: { fontSize: typography.xs + 1, color: colors.textMuted },
  errorText: { color: colors.danger },
  counter: { fontSize: typography.xs, color: colors.textMuted },
});