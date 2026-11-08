// mobile/src/shared/components/ui/ErrorState.tsx
// Standard error display with retry.

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';
import { AppButton } from './AppButton';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  style?: ViewStyle;
}

export function ErrorState({
  title,
  message,
  onRetry,
  style,
}: ErrorStateProps): React.ReactElement {
  const { t } = useTranslation('common');
  const { language } = useLanguage();
  const bold = pickFontFamily(language, 'bold');
  const regular = pickFontFamily(language, 'regular');

  return (
    <View style={[styles.wrap, style]}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={[styles.title, { fontFamily: bold }]}>
        {title ?? t('messages.serverError')}
      </Text>
      {message ? (
        <Text style={[styles.message, { fontFamily: regular }]}>{message}</Text>
      ) : null}
      {onRetry ? (
        <View style={styles.action}>
          <AppButton title={t('actions.retry')} onPress={onRetry} variant="primary" />
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
  icon: { fontSize: 48, marginBottom: spacing.md },
  title: {
    fontSize: typography.lg,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: typography.md,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  action: { marginTop: spacing.sm },
});