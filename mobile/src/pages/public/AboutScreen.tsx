// mobile/src/pages/public/AboutScreen.tsx
import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { BaseScreen } from '@layouts/common/BaseScreen';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useTheme } from '@styles/useTheme';

export function AboutScreen(): React.ReactElement {
  const { t } = useTranslation('public');
  const { colors, spacing } = useTheme();

  return (
    <BaseScreen title={t('about.title')} showBack>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <Text style={[styles.h1, { color: colors.text }]}>{t('about.missionTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('about.missionBody')}</Text>

        <Text style={[styles.h2, { color: colors.text }]}>{t('about.storyTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('about.storyBody')}</Text>

        <Text style={[styles.h2, { color: colors.text }]}>{t('about.teamTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('about.teamBody')}</Text>

        <Text style={[styles.h2, { color: colors.text }]}>{t('about.contactTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('about.contactBody')}</Text>
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  h2: { fontSize: 17, fontWeight: '700', marginTop: 16, marginBottom: 6 },
  body: { fontSize: 15, lineHeight: 22 },
});