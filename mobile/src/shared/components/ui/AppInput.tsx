// mobile/src/shared/components/ui/AppInput.tsx
// Text input with label, error, icon, password toggle, focus state.

import React, { forwardRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';

import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';
import { useTranslation } from '@i18n/hooks/useTranslation';

export interface AppInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const AppInput = forwardRef<TextInput, AppInputProps>(function AppInput(
  {
    label,
    error,
    hint,
    required = false,
    leftIcon,
    rightIcon,
    containerStyle,
    secureTextEntry,
    onFocus,
    onBlur,
    ...rest
  },
  ref,
): React.ReactElement {
  const { language } = useLanguage();
  const { t } = useTranslation('validation');
  const [focused, setFocused] = useState(false);
  const [secure, setSecure] = useState(Boolean(secureTextEntry));

  const fontFamily = pickFontFamily(language, 'regular');
  const borderColor = error ? colors.danger : focused ? colors.primary : colors.border;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { fontFamily: pickFontFamily(language, 'bold') }]}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}

      <View
        style={[
          styles.inputWrap,
          { borderColor },
          focused && styles.inputWrapFocused,
        ]}
      >
        {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}

        <TextInput
          ref={ref}
          style={[styles.input, { fontFamily }]}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={secure}
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

        {secureTextEntry ? (
          <TouchableOpacity
            onPress={() => setSecure((s) => !s)}
            style={styles.eyeBtn}
            accessibilityRole="button"
            accessibilityLabel={secure ? 'Show password' : 'Hide password'}
          >
            <Text style={styles.eyeIcon}>{secure ? '👁' : '🙈'}</Text>
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.iconRight}>{rightIcon}</View>
        ) : null}
      </View>

      {error ? (
        <Text style={[styles.helper, styles.errorText]}>{error}</Text>
      ) : hint ? (
        <Text style={styles.helper}>{hint}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  label: {
    fontSize: typography.sm,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  required: { color: colors.danger },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: colors.card,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  inputWrapFocused: {
    borderWidth: 2,
    paddingHorizontal: spacing.md - 1,
  },
  input: {
    flex: 1,
    fontSize: typography.md,
    color: colors.text,
    paddingVertical: spacing.sm,
  },
  iconLeft: { marginRight: spacing.sm },
  iconRight: { marginLeft: spacing.sm },
  eyeBtn: { paddingHorizontal: spacing.xs },
  eyeIcon: { fontSize: 18 },
  helper: {
    fontSize: typography.xs + 1,
    color: colors.textMuted,
    marginTop: 2,
  },
  errorText: { color: colors.danger },
});