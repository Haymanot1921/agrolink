// mobile/src/pages/public/AccessibilityScreen.tsx
// Accessibility statement — WCAG 2.1 AA commitment + known limitations.
// SRS refs: §11.1, NFR-ACCESS-001..007.

import React from 'react';
import { ScrollView, Text, StyleSheet, View, TouchableOpacity, Linking } from 'react-native';

import { BaseScreen } from '@layouts/common/BaseScreen';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useTheme } from '@styles/useTheme';
import { PLATFORM } from '@constants/platform';

export function AccessibilityScreen(): React.ReactElement {
  const { t } = useTranslation('public');
  const { colors, spacing, typography } = useTheme();

  return (
    <BaseScreen title={t('accessibility.title')} showBack>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing['2xl'] }}>
        <Text style={[styles.heading, { color: colors.text, fontSize: typography.fontSize['2xl'] }]}>
          {t('accessibility.heading')}
        </Text>

        <Text style={[styles.updated, { color: colors.textSubtle }]}>
          {t('accessibility.lastUpdated', { date: 'January 2025' })}
        </Text>

        <Text style={[styles.h2, { color: colors.text }]}>{t('accessibility.commitmentTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('accessibility.commitmentBody')}</Text>

        <Text style={[styles.h2, { color: colors.text }]}>{t('accessibility.featuresTitle')}</Text>
        {[1, 2, 3, 4, 5].map((n) => (
          <View key={n} style={styles.bulletRow}>
            <Text style={[styles.bullet, { color: colors.primary }]}>•</Text>
            <Text style={[styles.bulletText, { color: colors.textMuted }]}>
              {t(`accessibility.feature${n}`)}
            </Text>
          </View>
        ))}

        <Text style={[styles.h2, { color: colors.text }]}>{t('accessibility.languageTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('accessibility.languageBody')}</Text>

        <Text style={[styles.h2, { color: colors.text }]}>{t('accessibility.assistedTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('accessibility.assistedBody')}</Text>

        <Text style={[styles.h2, { color: colors.text }]}>{t('accessibility.limitationsTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('accessibility.limitationsBody')}</Text>

        <Text style={[styles.h2, { color: colors.text }]}>{t('accessibility.feedbackTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('accessibility.feedbackBody')}</Text>

        <View style={[styles.contactCard, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Text style={[styles.contactLine, { color: colors.text }]}>
            📧 {PLATFORM.supportEmail}
          </Text>
          <Text style={[styles.contactLine, { color: colors.text }]}>
            📞 {PLATFORM.supportPhone}
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL(`${PLATFORM.website}/accessibility`)}
            accessibilityRole="link"
          >
            <Text style={[styles.contactLink, { color: colors.primary }]}>
              {t('accessibility.viewOnline')}
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
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  bullet: { fontSize: 16, marginRight: 8, lineHeight: 22 },
  bulletText: { flex: 1, fontSize: 14, lineHeight: 22 },
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