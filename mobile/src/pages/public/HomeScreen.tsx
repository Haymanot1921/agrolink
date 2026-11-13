// mobile/src/pages/public/HomeScreen.tsx
// Marketing home — guest-accessible. Mirrors web HomePage.jsx.
// SRS refs: §11.1, §11.7 (guest experience).

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { BaseScreen } from '@layouts/common/BaseScreen';
import { AppButton } from '@components/ui/AppButton';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useTheme } from '@styles/useTheme';
import type { PublicStackParamList } from '@navigation/types';

type Nav = NativeStackNavigationProp<PublicStackParamList, 'Home'>;

export function HomeScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const { t } = useTranslation('public');
  const { colors, spacing, typography } = useTheme();

  return (
    <BaseScreen showOfflineBanner noHeader>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { padding: spacing.lg, paddingBottom: spacing['2xl'], backgroundColor: colors.backgroundAlt },
        ]}
      >
        <View style={[styles.hero, { backgroundColor: colors.primaryDark }]}>
          <View style={[styles.logo, { backgroundColor: colors.card }]}>
            <Text style={[styles.logoText, { color: colors.primary }]}>A</Text>
          </View>
          <Text style={[styles.appName, { color: colors.textOnDark, fontSize: typography.fontSize['2xl'] }]}>
            {t('appName', { ns: 'common' })}
          </Text>
          <Text style={[styles.tagline, { color: colors.textOnDark, fontSize: typography.fontSize.md }]}>
            {t('home.tagline')}
          </Text>
          <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
          <AppButton title={t('home.ctaGetStarted')} onPress={() => navigation.navigate('Onboarding')} fullWidth />
            <AppButton title={t('home.ctaLogin')} variant="outline" onPress={() => navigation.navigate('Login')} fullWidth />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('home.featuresTitle')}
        </Text>
        {[
          { key: 'sell', icon: '🌾', title: t('home.featureSell'), body: t('home.featureSellBody') },
          { key: 'buy', icon: '🛒', title: t('home.featureBuy'), body: t('home.featureBuyBody') },
          { key: 'advice', icon: '👨‍🌾', title: t('home.featureAdvice'), body: t('home.featureAdviceBody') },
        ].map((f, index) => (
          <View
            key={f.key}
            style={[
              styles.featureCard,
              { backgroundColor: colors.card, borderColor: colors.border, borderTopColor: index === 1 ? colors.secondary : colors.primary },
            ]}
          >
            <View style={[styles.featureIcon, { backgroundColor: colors.primaryLight }]}>
              <Text style={styles.featureEmoji}>{f.icon}</Text>
            </View>
            <Text style={[styles.featureTitle, { color: colors.text }]}>{f.title}</Text>
            <Text style={[styles.featureBody, { color: colors.textMuted }]}>{f.body}</Text>
          </View>
        ))}

        <TouchableOpacity onPress={() => navigation.navigate('HowItWorks')} style={styles.linkWrap}>
          <Text style={[styles.link, { color: colors.primary }]}>{t('home.learnMore')}  →</Text>
        </TouchableOpacity>
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1 },
  hero: { padding: 24, borderRadius: 16, marginBottom: 32, overflow: 'hidden' },
  logo: {
    width: 56,
    height: 56,
    alignSelf: 'flex-start',
    marginBottom: 20,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontSize: 32, fontWeight: '700' },
  appName: { fontWeight: '700', marginBottom: 8 },
  tagline: { lineHeight: 24, marginBottom: 8 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  featureCard: { padding: 20, borderRadius: 12, borderWidth: 1, borderTopWidth: 3, marginBottom: 12 },
  featureIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  featureEmoji: { fontSize: 22 },
  featureTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  featureBody: { fontSize: 14, lineHeight: 21 },
  linkWrap: { alignItems: 'center', marginTop: 16, padding: 12 },
  link: { fontSize: 14, fontWeight: '600' },
});