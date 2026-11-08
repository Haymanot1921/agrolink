// mobile/src/shared/components/ui/AppIconButton.tsx
// Circular/rounded icon-only button (back arrow, close, favorites, etc.).

import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';

import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';

export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface AppIconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: IconButtonSize;
  variant?: 'solid' | 'ghost' | 'surface';
  disabled?: boolean;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function AppIconButton({
  icon,
  onPress,
  size = 'md',
  variant = 'ghost',
  disabled = false,
  accessibilityLabel,
  style,
  testID,
}: AppIconButtonProps): React.ReactElement {
  const preset = SIZES[size];

  return (
    <TouchableOpacity
      style={[
        styles.base,
        preset.container,
        VARIANT_STYLES[variant],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      testID={testID}
      activeOpacity={0.7}
    >
      {icon}
    </TouchableOpacity>
  );
}

const SIZES: Record<IconButtonSize, { container: ViewStyle }> = {
  sm: { container: { width: 32, height: 32 } },
  md: { container: { width: 44, height: 44 } },
  lg: { container: { width: 56, height: 56 } },
};

const VARIANT_STYLES: Record<NonNullable<AppIconButtonProps['variant']>, ViewStyle> = {
  solid: { backgroundColor: colors.primary },
  ghost: { backgroundColor: 'transparent' },
  surface: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  disabled: { opacity: 0.5 },
});