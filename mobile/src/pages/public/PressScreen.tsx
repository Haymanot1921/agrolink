// mobile/src/pages/public/PressScreen.tsx
// Press / media kit page — brand assets + press contacts.
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

interface PressAsset {
  key: string;
  labelKey: string;
  url: string;
}

const PRESS_ASSETS: PressAsset[] = [
  { key: 'logo', labelKey: 'press.assetLogo', url: `${PLATFORM.website}/press/logo.zip` },
  { key: 'photos', labelKey: 'press.assetPhotos', url: `${PLATFORM.website}/press/photos.zip` },
  { key: 'factsheet', labelKey: 'press.assetFactSheet', url: `${PLATFORM.website}/press/fact-sheet.pdf` },
];

export function PressScreen(): React.ReactElement {
  const { t } = useTranslation('public');
  const { colors, spacing, typography } = useTheme();

  return (
    <BaseScreen title={t('press.title')} showBack>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing['2xl'] }}>
        <View style={styles.logoRow}>
          <Text style={[styles.logo, { color: colors.primary }]}>AgroLink</Text>
        </View>

        <Text style={[styles.heading, { color: colors.text, fontSize: typography.fontSize['2xl'] }]}>
          {t('press.heading')}
        </Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('press.intro')}</Text>

        <Text style={[styles.h2, { color: colors.text }]}>{t('press.aboutTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('press.aboutBody')}</Text>

        <Text style={[styles.h2, { color: colors.text }]}>{t('press.factsTitle')}</Text>
        {[1, 2, 3, 4].map((n) => (
          <View key={n} style={styles.bulletRow}>
            <Text style={[styles.bullet, { color: colors.primary }]}>•</Text>
            <Text style={[styles.bulletText, { color: colors.textMuted }]}>
              {t(`press.fact${n}`)}
            </Text>
          </View>
        ))}

        <Text style={[styles.h2, { color: colors.text }]}>{t('press.assetsTitle')}</Text>

        {PRESS_ASSETS.map((asset) => (
          <TouchableOpacity
            key={asset.key}
            onPress={() => Linking.openURL(asset.url)}
            style={[styles.assetCard, { borderColor: colors.border, backgroundColor: colors.card }]}
            accessibilityRole="link"
          >
            <Text style={[styles.assetLabel, { color: colors.text }]}>{t(asset.labelKey)}</Text>
            <Text style={[styles.assetDownload, { color: colors.primary }]}>
              {t('press.download')} ⬇
            </Text>
          </TouchableOpacity>
        ))}

        <Text style={[styles.h2, { color: colors.text }]}>{t('press.contactTitle')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('press.contactBody')}</Text>

        <View style={[styles.contactCard, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Text style={[styles.contactLine, { color: colors.text }]}>
            📧 press@agrolink.et
          </Text>
          <Text style={[styles.contactLine, { color: colors.text }]}>
            📞 {PLATFORM.supportPhone}
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL(`${PLATFORM.website}/press`)}
            accessibilityRole="link"
          >
            <Text style={[styles.contactLink, { color: colors.primary }]}>
              {t('press.viewOnline')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  logoRow: { alignItems: 'center', marginBottom: 16 },
  logo: { fontSize: 28, fontWeight: '700' },
  heading: { fontWeight: '700', marginBottom: 8 },
  h2: { fontSize: 16, fontWeight: '700', marginTop: 20, marginBottom: 8 },
  body: { fontSize: 14, lineHeight: 22 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  bullet: { fontSize: 16, marginRight: 8, lineHeight: 22 },
  bulletText: { flex: 1, fontSize: 14, lineHeight: 22 },
  assetCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  assetLabel: { fontSize: 14, fontWeight: '600' },
  assetDownload: { fontSize: 13, fontWeight: '700' },
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