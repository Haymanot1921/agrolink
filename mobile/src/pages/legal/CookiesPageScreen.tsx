// mobile/src/pages/legal/CookiesPageScreen.tsx
// Cookies / Local Storage Policy (legal namespace).
// SRS refs: §11.1.

import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';

import { BaseScreen } from '@layouts/common/BaseScreen';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useTheme } from '@styles/useTheme';

export function CookiesPageScreen(): React.ReactElement {
  const { t } = useTranslation('public');
  const { colors, spacing } = useTheme();

  return (
    <BaseScreen title={t('cookies.title')} showBack>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing['2xl'] }}>
        <Text style={[styles.heading, { color: colors.text }]}>{t('cookies.heading')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('cookies.introBody')}</Text>
        <Text style={[styles.h2, { color: colors.text }]}>{t('cookies.mobileTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('cookies.mobileBody')}</Text>
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  h2: { fontSize: 15, fontWeight: '700', marginTop: 16, marginBottom: 6 },
  body: { fontSize: 14, lineHeight: 22 },
});