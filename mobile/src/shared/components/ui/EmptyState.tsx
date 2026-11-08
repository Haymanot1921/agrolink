// mobile/src/shared/components/ui/EmptyState.tsx
// Standard empty state with illustration, title, subtitle, CTA.

import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';
import { AppButton } from './AppButton';

export interface EmptyStateProps {
  title: string;
  subtitle?: string;
  image?: number;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function EmptyState({
  title,
  subtitle,
  image,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps): React.ReactElement {
  const { language } = useLanguage();
  const bold = pickFontFamily(language, 'bold');
  const regular = pickFontFamily(language, 'regular');

  return (
    <View style={[styles.wrap, style]}>
      {image ? <Image source={image} style={styles.image} resizeMode="contain" /> : null}
      <Text style={[styles.title, { fontFamily: bold }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { fontFamily: regular }]}>{subtitle}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <AppButton title={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  image: { width: 160, height: 160, marginBottom: spacing.lg },
  title: {
    fontSize: typography.lg,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.md,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  action: { marginTop: spacing.sm },
});