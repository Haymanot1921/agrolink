// mobile/src/pages/legal/TermsPageScreen.tsx
// Terms of Service (legal namespace).
// SRS refs: §11.1.

import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';

import { BaseScreen } from '@layouts/common/BaseScreen';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useTheme } from '@styles/useTheme';

export function TermsPageScreen(): React.ReactElement {
  const { t } = useTranslation('public');
  const { colors, spacing } = useTheme();

  return (
    <BaseScreen title={t('terms.title')} showBack>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing['2xl'] }}>
        <Text style={[styles.heading, { color: colors.text }]}>{t('terms.heading')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('terms.body')}</Text>
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  body: { fontSize: 14, lineHeight: 22 },
});