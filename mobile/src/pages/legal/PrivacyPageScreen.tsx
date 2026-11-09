// mobile/src/pages/legal/PrivacyPageScreen.tsx
// Privacy Policy (legal namespace).
// SRS refs: §11.1, §14.5.

import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';

import { BaseScreen } from '@layouts/common/BaseScreen';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useTheme } from '@styles/useTheme';

export function PrivacyPageScreen(): React.ReactElement {
  const { t } = useTranslation('public');
  const { colors, spacing } = useTheme();

  return (
    <BaseScreen title={t('privacy.title')} showBack>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing['2xl'] }}>
        <Text style={[styles.heading, { color: colors.text }]}>{t('privacy.heading')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('privacy.introBody')}</Text>
        <Text style={[styles.h2, { color: colors.text }]}>{t('privacy.collectTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('privacy.collectBody')}</Text>
        <Text style={[styles.h2, { color: colors.text }]}>{t('privacy.rightsTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('privacy.rightsBody')}</Text>
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  h2: { fontSize: 15, fontWeight: '700', marginTop: 16, marginBottom: 6 },
  body: { fontSize: 14, lineHeight: 22 },
});