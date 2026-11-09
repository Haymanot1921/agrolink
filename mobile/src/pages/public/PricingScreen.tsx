// mobile/src/pages/public/PricingScreen.tsx
import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { BaseScreen } from '@layouts/common/BaseScreen';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useTheme } from '@styles/useTheme';
import { PLATFORM } from '@constants/platform';

export function PricingScreen(): React.ReactElement {
  const { t } = useTranslation('public');
  const { colors, spacing } = useTheme();

  return (
    <BaseScreen title={t('pricing.title')} showBack>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <Text style={[styles.h1, { color: colors.text }]}>{t('pricing.headline')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('pricing.description')}</Text>
        <Text style={[styles.h2, { color: colors.text }]}>{t('pricing.freeTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('pricing.freeBody')}</Text>
        <Text style={[styles.h2, { color: colors.text }]}>{t('pricing.feesTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('pricing.feesBody')}</Text>
        <Text style={[styles.footnote, { color: colors.textSubtle }]}>
          {t('pricing.note', { version: PLATFORM.appVersion })}
        </Text>
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  h2: { fontSize: 16, fontWeight: '700', marginTop: 16, marginBottom: 4 },
  body: { fontSize: 14, lineHeight: 22 },
  footnote: { fontSize: 12, marginTop: 24 },
});