// mobile/src/pages/public/CookiesScreen.tsx
// Cookie Policy (adapted for mobile — explains local storage).
// SRS refs: §11.1, §14.5, NFR-SEC-007 (secure local storage).

import React from 'react';
import { ScrollView, Text, StyleSheet, View, TouchableOpacity, Linking } from 'react-native';

import { BaseScreen } from '@layouts/common/BaseScreen';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useTheme } from '@styles/useTheme';
import { PLATFORM } from '@constants/platform';

export function CookiesScreen(): React.ReactElement {
  const { t } = useTranslation('public');
  const { colors, spacing, typography } = useTheme();

  return (
    <BaseScreen title={t('cookies.title')} showBack>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing['2xl'] }}>
        <Text style={[styles.heading, { color: colors.text, fontSize: typography.fontSize['2xl'] }]}>
          {t('cookies.heading')}
        </Text>

        <Text style={[styles.updated, { color: colors.textSubtle }]}>
          {t('cookies.lastUpdated', { date: 'January 2025' })}
        </Text>

        <Text style={[styles.h2, { color: colors.text }]}>{t('cookies.introTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('cookies.introBody')}</Text>

        <Text style={[styles.h2, { color: colors.text }]}>{t('cookies.mobileTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('cookies.mobileBody')}</Text>

        <Text style={[styles.h2, { color: colors.text }]}>{t('cookies.essentialTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('cookies.essentialBody')}</Text>

        <Text style={[styles.h2, { color: colors.text }]}>{t('cookies.analyticsTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('cookies.analyticsBody')}</Text>

        <Text style={[styles.h2, { color: colors.text }]}>{t('cookies.manageTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('cookies.manageBody')}</Text>

        <View style={[styles.infoCard, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>{t('cookies.clearTitle')}</Text>
          <Text style={[styles.body, { color: colors.textMuted }]}>{t('cookies.clearBody')}</Text>
        </View>

        <TouchableOpacity
          onPress={() => Linking.openURL(`${PLATFORM.website}/cookies`)}
          accessibilityRole="link"
          style={{ marginTop: 20 }}
        >
          <Text style={[styles.link, { color: colors.primary }]}>{t('cookies.viewOnline')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  heading: { fontWeight: '700', marginBottom: 6 },
  updated: { fontSize: 12, marginBottom: 16 },
  h2: { fontSize: 15, fontWeight: '700', marginTop: 16, marginBottom: 6 },
  body: { fontSize: 14, lineHeight: 22 },
  infoCard: {
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  infoTitle: { fontSize: 14, fontWeight: '700' },
  link: { fontSize: 14, fontWeight: '600' },
});