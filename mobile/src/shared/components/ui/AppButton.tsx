// mobile/src/shared/components/ui/AppButton.tsx
// Primary call-to-action button. Supports variants, sizes, loading, icons.

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';

import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
  accessibilityLabel?: string;
}

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  testID,
  accessibilityLabel,
}: AppButtonProps): React.ReactElement {
  const { language } = useLanguage();
  const fontFamily = pickFontFamily(language, 'bold');

  const isDisabled = disabled || loading;
  const preset = VARIANTS[variant];
  const sizeStyles = SIZES[size];

  return (
    <TouchableOpacity
      style={[
        styles.base,
        sizeStyles.container,
        preset.container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={preset.indicatorColor} size="small" />
      ) : (
        <View style={styles.content}>
          {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
          <Text
            style={[
              styles.text,
              sizeStyles.text,
              { fontFamily, color: preset.textColor },
              textStyle,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
        </View>
      )}
    </TouchableOpacity>
  );
}

const VARIANTS: Record<
  ButtonVariant,
  { container: ViewStyle; textColor: string; indicatorColor: string }
> = {
  primary: {
    container: { backgroundColor: colors.primary, borderWidth: 1, borderColor: colors.primary },
    textColor: '#FFFFFF',
    indicatorColor: '#FFFFFF',
  },
  secondary: {
    container: { backgroundColor: colors.secondary, borderWidth: 1, borderColor: colors.secondary },
    textColor: '#FFFFFF',
    indicatorColor: '#FFFFFF',
  },
  outline: {
    container: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
    textColor: colors.primary,
    indicatorColor: colors.primary,
  },
  ghost: {
    container: { backgroundColor: 'transparent', borderWidth: 0 },
    textColor: colors.primary,
    indicatorColor: colors.primary,
  },
  danger: {
    container: { backgroundColor: colors.danger, borderWidth: 1, borderColor: colors.danger },
    textColor: '#FFFFFF',
    indicatorColor: '#FFFFFF',
  },
};

const SIZES: Record<ButtonSize, { container: ViewStyle; text: TextStyle }> = {
  sm: {
    container: { height: 36, paddingHorizontal: spacing.md, borderRadius: 8 },
    text: { fontSize: typography.sm },
  },
  md: {
    container: { height: 48, paddingHorizontal: spacing.lg, borderRadius: 10 },
    text: { fontSize: typography.md },
  },
  lg: {
    container: { height: 56, paddingHorizontal: spacing.xl, borderRadius: 12 },
    text: { fontSize: typography.lg },
  },
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  text: { fontWeight: '700' },
  icon: { marginHorizontal: spacing.xs },
});