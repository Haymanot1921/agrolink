// mobile/src/pages/public/TermsScreen.tsx
import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { BaseScreen } from '@layouts/common/BaseScreen';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useTheme } from '@styles/useTheme';

export function TermsScreen(): React.ReactElement {
  const { t } = useTranslation('public');
  const { colors, spacing } = useTheme();
  return (
    <BaseScreen title={t('terms.title')} showBack>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <Text style={[styles.h1, { color: colors.text }]}>{t('terms.heading')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('terms.body')}</Text>
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  body: { fontSize: 14, lineHeight: 22 },
});