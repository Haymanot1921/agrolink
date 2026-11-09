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
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing['2xl'] }}>
        <View style={[styles.logo, { backgroundColor: colors.primary }]}>
          <Text style={styles.logoText}>A</Text>
        </View>
        <Text style={[styles.appName, { color: colors.primary, fontSize: typography.fontSize['2xl'] }]}>
          {t('appName', { ns: 'common' })}
        </Text>
        <Text style={[styles.tagline, { color: colors.textMuted, fontSize: typography.fontSize.md }]}>
          {t('home.tagline')}
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('home.featuresTitle')}
        </Text>

        {[
          { key: 'sell', title: t('home.featureSell'), body: t('home.featureSellBody') },
          { key: 'buy', title: t('home.featureBuy'), body: t('home.featureBuyBody') },
          { key: 'advice', title: t('home.featureAdvice'), body: t('home.featureAdviceBody') },
        ].map((f) => (
          <View
            key={f.key}
            style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Text style={[styles.featureTitle, { color: colors.text }]}>{f.title}</Text>
            <Text style={[styles.featureBody, { color: colors.textMuted }]}>{f.body}</Text>
          </View>
        ))}

        <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
          <AppButton title={t('home.ctaGetStarted')} onPress={() => navigation.navigate('Onboarding')} fullWidth />
          <AppButton title={t('home.ctaLogin')} variant="outline" onPress={() => navigation.navigate('Login')} fullWidth />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('HowItWorks')} style={styles.linkWrap}>
          <Text style={[styles.link, { color: colors.primary }]}>{t('home.learnMore')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginTop: 24,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { color: '#FFFFFF', fontSize: 44, fontWeight: '700' },
  appName: { textAlign: 'center', fontWeight: '700', marginTop: 8 },
  tagline: { textAlign: 'center', marginTop: 8, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  featureCard: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 10 },
  featureTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  featureBody: { fontSize: 13, lineHeight: 18 },
  linkWrap: { alignItems: 'center', marginTop: 24 },
  link: { fontSize: 14, fontWeight: '600' },
});