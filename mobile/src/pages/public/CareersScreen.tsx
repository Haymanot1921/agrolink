// mobile/src/pages/public/CareersScreen.tsx
// Careers page — open roles + apply instructions.
// SRS refs: §11.1 (public marketing content).

import React from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
} from 'react-native';

import { BaseScreen } from '@layouts/common/BaseScreen';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useTheme } from '@styles/useTheme';
import { PLATFORM } from '@constants/platform';

interface Role {
  id: string;
  title: string;
  location: string;
  type: string;
}

const OPEN_ROLES: Role[] = [
  { id: 'eng', title: 'Software Engineer (Full-stack)', location: 'Addis Ababa / Remote', type: 'Full-time' },
  { id: 'design', title: 'UI/UX Designer', location: 'Addis Ababa', type: 'Full-time' },
  { id: 'agent', title: 'Support Agent (Regional)', location: 'Multiple regions', type: 'Full-time' },
  { id: 'expert', title: 'Agricultural Expert (Consultant)', location: 'Remote', type: 'Contract' },
];

export function CareersScreen(): React.ReactElement {
  const { t } = useTranslation('public');
  const { colors, spacing, typography } = useTheme();

  const applyFor = async (roleTitle: string) => {
    const subject = encodeURIComponent(`Application: ${roleTitle}`);
    await Linking.openURL(`mailto:careers@agrolink.et?subject=${subject}`);
  };

  return (
    <BaseScreen title={t('careers.title')} showBack>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing['2xl'] }}>
        <Text style={[styles.heading, { color: colors.text, fontSize: typography.fontSize['2xl'] }]}>
          {t('careers.heading')}
        </Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('careers.intro')}</Text>

        <Text style={[styles.h2, { color: colors.text }]}>{t('careers.valuesTitle')}</Text>
        {[1, 2, 3].map((n) => (
          <View key={n} style={styles.bulletRow}>
            <Text style={[styles.bullet, { color: colors.primary }]}>•</Text>
            <Text style={[styles.bulletText, { color: colors.textMuted }]}>
              {t(`careers.value${n}`)}
            </Text>
          </View>
        ))}

        <Text style={[styles.h2, { color: colors.text }]}>{t('careers.openRolesTitle')}</Text>

        {OPEN_ROLES.map((role) => (
          <View
            key={role.id}
            style={[styles.roleCard, { borderColor: colors.border, backgroundColor: colors.card }]}
          >
            <Text style={[styles.roleTitle, { color: colors.text }]}>{role.title}</Text>
            <Text style={[styles.roleMeta, { color: colors.textMuted }]}>
              📍 {role.location} · {role.type}
            </Text>
            <TouchableOpacity
              onPress={() => applyFor(role.title)}
              style={styles.applyBtn}
              accessibilityRole="button"
            >
              <Text style={[styles.applyText, { color: colors.primary }]}>
                {t('careers.apply')} →
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <Text style={[styles.h2, { color: colors.text }]}>{t('careers.howToApplyTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('careers.howToApplyBody')}</Text>

        <View style={[styles.contactCard, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Text style={[styles.contactLine, { color: colors.text }]}>
            📧 careers@agrolink.et
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL(`${PLATFORM.website}/careers`)}
            accessibilityRole="link"
          >
            <Text style={[styles.contactLink, { color: colors.primary }]}>
              {t('careers.viewOnline')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  heading: { fontWeight: '700', marginBottom: 8 },
  h2: { fontSize: 16, fontWeight: '700', marginTop: 20, marginBottom: 8 },
  body: { fontSize: 14, lineHeight: 22 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  bullet: { fontSize: 16, marginRight: 8, lineHeight: 22 },
  bulletText: { flex: 1, fontSize: 14, lineHeight: 22 },
  roleCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    gap: 6,
  },
  roleTitle: { fontSize: 15, fontWeight: '700' },
  roleMeta: { fontSize: 12 },
  applyBtn: { alignSelf: 'flex-start', paddingVertical: 4, marginTop: 4 },
  applyText: { fontSize: 13, fontWeight: '700' },
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