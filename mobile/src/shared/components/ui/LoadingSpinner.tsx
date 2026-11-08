// mobile/src/shared/components/ui/LoadingSpinner.tsx
// Centered activity indicator with optional caption.

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';

export interface LoadingSpinnerProps {
  caption?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
  style?: ViewStyle;
}

export function LoadingSpinner({
  caption,
  size = 'large',
  fullScreen = false,
  style,
}: LoadingSpinnerProps): React.ReactElement {
  const { language } = useLanguage();

  return (
    <View style={[fullScreen ? styles.fullScreen : styles.inline, style]}>
      <ActivityIndicator size={size} color={colors.primary} />
      {caption ? (
        <Text style={[styles.caption, { fontFamily: pickFontFamily(language, 'regular') }]}>
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inline: { paddingVertical: spacing.lg, alignItems: 'center' },
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  caption: {
    marginTop: spacing.md,
    fontSize: typography.md,
    color: colors.textMuted,
  },
});