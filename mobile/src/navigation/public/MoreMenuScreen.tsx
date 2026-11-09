// mobile/src/navigation/public/MoreMenuScreen.tsx
// The "More" landing page — list of links to About, Legal, Help, etc.

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { BaseScreen } from '@layouts/common/BaseScreen';
import { useTheme } from '@styles/useTheme';
import { useTranslation } from '@i18n/hooks/useTranslation';

interface LinkItem {
  key: keyof import('@navigation/types').PublicMoreStackParamList | 'login' | 'register';
  labelKey: string;
  icon: string;
}

const LINK_GROUPS: { titleKey: string; items: LinkItem[] }[] = [
  {
    titleKey: 'more.aboutGroup',
    items: [
      { key: 'About', labelKey: 'about.title', icon: 'information-outline' },
      { key: 'HowItWorks', labelKey: 'howItWorks.title', icon: 'help-circle-outline' },
      { key: 'Pricing', labelKey: 'pricing.title', icon: 'tag-outline' },
      { key: 'Blog', labelKey: 'blog.title', icon: 'newspaper-variant-outline' },
    ],
  },
  {
    titleKey: 'more.companyGroup',
    items: [
      { key: 'Careers', labelKey: 'careers.title', icon: 'briefcase-outline' },
      { key: 'Press', labelKey: 'press.title', icon: 'microphone-outline' },
    ],
  },
  {
    titleKey: 'more.supportGroup',
    items: [
      { key: 'HelpCenter', labelKey: 'helpCenter.title', icon: 'lifebuoy' },
      { key: 'Faq', labelKey: 'faq.title', icon: 'comment-question-outline' },
      { key: 'Contact', labelKey: 'contact.title', icon: 'email-outline' },
    ],
  },
  {
    titleKey: 'more.legalGroup',
    items: [
      { key: 'Terms', labelKey: 'terms.title', icon: 'file-document-outline' },
      { key: 'Privacy', labelKey: 'privacy.title', icon: 'shield-lock-outline' },
      { key: 'Cookies', labelKey: 'cookies.title', icon: 'cookie-outline' },
      { key: 'Accessibility', labelKey: 'accessibility.title', icon: 'human' },
    ],
  },
];

export function MoreMenuScreen(): React.ReactElement {
  const navigation = useNavigation<any>();
  const { colors, spacing } = useTheme();
  const { t } = useTranslation('public');

  return (
    <BaseScreen title={t('more.title', { defaultValue: 'More' })} noHeader={false}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing['2xl'] }}>
        {/* Auth actions at top */}
        <View style={styles.authRow}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={[styles.authBtn, { backgroundColor: colors.primary }]}
            accessibilityRole="button"
          >
            <Text style={styles.authBtnText}>{t('actions.login', { ns: 'common' })}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register', { role: 'farmer' })}
            style={[styles.authBtn, { backgroundColor: colors.card, borderColor: colors.primary, borderWidth: 1 }]}
            accessibilityRole="button"
          >
            <Text style={[styles.authBtnText, { color: colors.primary }]}>
              {t('actions.signUp', { ns: 'common' })}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Link groups */}
        {LINK_GROUPS.map((group) => (
          <View key={group.titleKey} style={{ marginTop: spacing.lg }}>
            <Text style={[styles.groupTitle, { color: colors.textMuted }]}>
              {t(group.titleKey)}
            </Text>
            <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
              {group.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => navigation.navigate(item.key)}
                  style={[
                    styles.row,
                    idx < group.items.length - 1 && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: colors.border,
                    },
                  ]}
                  accessibilityRole="button"
                >
                  <Icon name={item.icon} size={20} color={colors.primary} />
                  <Text style={[styles.rowLabel, { color: colors.text }]}>
                    {t(item.labelKey)}
                  </Text>
                  <Icon name="chevron-right" size={20} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  authRow: { flexDirection: 'row', gap: 10 },
  authBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  groupTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  card: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  rowLabel: { flex: 1, fontSize: 15 },
});