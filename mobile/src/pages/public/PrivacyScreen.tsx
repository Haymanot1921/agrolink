// mobile/src/pages/public/PrivacyScreen.tsx
// Privacy Policy page (static legal content).
// SRS refs: §11.1, §14.5 (Data privacy), NFR-ACCESS-006.
//
// The same copy is available on the web at https://agrolink.et/privacy
// This screen mirrors it for users who never leave the app.

import React from 'react';
import { ScrollView, Text, StyleSheet, View, TouchableOpacity, Linking } from 'react-native';

import { BaseScreen } from '@layouts/common/BaseScreen';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useTheme } from '@styles/useTheme';
import { PLATFORM } from '@constants/platform';

export function PrivacyScreen(): React.ReactElement {
  const { t } = useTranslation('public');
  const { colors, spacing, typography } = useTheme();

  return (
    <BaseScreen title={t('privacy.title')} showBack>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing['2xl'] }}>
        <Text style={[styles.heading, { color: colors.text, fontSize: typography.fontSize['2xl'] }]}>
          {t('privacy.heading')}
        </Text>

        <Text style={[styles.updated, { color: colors.textSubtle }]}>
          {t('privacy.lastUpdated', { date: 'January 2025' })}
        </Text>

        <Text style={[styles.h2, { color: colors.text }]}>{t('privacy.introTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('privacy.introBody')}</Text>

        <Text style={[styles.h2, { color: colors.text }]}>{t('privacy.collectTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('privacy.collectBody')}</Text>

        <Text style={[styles.h2, { color: colors.text }]}>{t('privacy.useTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('privacy.useBody')}</Text>

        <Text style={[styles.h2, { color: colors.text }]}>{t('privacy.shareTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('privacy.shareBody')}</Text>

        <Text style={[styles.h2, { color: colors.text }]}>{t('privacy.assistedTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('privacy.assistedBody')}</Text>

        <Text style={[styles.h2, { color: colors.text }]}>{t('privacy.rightsTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('privacy.rightsBody')}</Text>

        <Text style={[styles.h2, { color: colors.text }]}>{t('privacy.securityTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('privacy.securityBody')}</Text>

        <Text style={[styles.h2, { color: colors.text }]}>{t('privacy.contactTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('privacy.contactBody')}</Text>

        <View style={[styles.contactCard, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Text style={[styles.contactLine, { color: colors.text }]}>
            📧 {PLATFORM.supportEmail}
          </Text>
          <Text style={[styles.contactLine, { color: colors.text }]}>
            📞 {PLATFORM.supportPhone}
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL(`${PLATFORM.website}/privacy`)}
            accessibilityRole="link"
          >
            <Text style={[styles.contactLink, { color: colors.primary }]}>
              {t('privacy.viewOnline')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  heading: { fontWeight: '700', marginBottom: 6 },
  updated: { fontSize: 12, marginBottom: 16 },
  h2: { fontSize: 15, fontWeight: '700', marginTop: 16, marginBottom: 6 },
  body: { fontSize: 14, lineHeight: 22 },
  contactCard: {
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  contactLine: { fontSize: 13 },
  contactLink: { fontSize: 13, fontWeight: '600', marginTop: 6 },
});