// mobile/src/pages/errors/ServerErrorPageScreen.tsx
// 500 — unexpected server error.
// SRS refs: §15.2 (safe error handling).

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { BaseScreen } from '@layouts/common/BaseScreen';
import { AppButton } from '@components/ui/AppButton';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useTheme } from '@styles/useTheme';

export function ServerErrorPageScreen(): React.ReactElement {
  const navigation = useNavigation<any>();
  const { t } = useTranslation('common');
  const { colors, spacing } = useTheme();

  return (
    <BaseScreen showOfflineBanner={false}>
      <View style={[styles.center, { padding: spacing.xl }]}>
        <Text style={[styles.code, { color: colors.textMuted }]}>500</Text>
        <Text style={[styles.title, { color: colors.text }]}>{t('messages.serverError')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>
          We're working on it. Please try again in a moment.
        </Text>
        <View style={{ width: '100%', gap: spacing.sm }}>
          <AppButton
            title={t('actions.retry')}
            onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home'))}
            fullWidth
          />
          <AppButton
            title={t('labels.support')}
            variant="outline"
            onPress={() => navigation.navigate('HelpCenter')}
            fullWidth
          />
        </View>
      </View>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  code: { fontSize: 72, fontWeight: '800', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  body: { fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
});