// mobile/src/pages/errors/UnauthorizedPageScreen.tsx
// 401 — user must log in.
// SRS refs: FR-AUTH-010 (safe error messages), §15.2.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { BaseScreen } from '@layouts/common/BaseScreen';
import { AppButton } from '@components/ui/AppButton';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useTheme } from '@styles/useTheme';

export function UnauthorizedPageScreen(): React.ReactElement {
  const navigation = useNavigation<any>();
  const { t } = useTranslation('auth');
  const { colors, spacing } = useTheme();

  return (
    <BaseScreen showOfflineBanner={false}>
      <View style={[styles.center, { padding: spacing.xl }]}>
        <Text style={[styles.code, { color: colors.danger }]}>401</Text>
        <Text style={[styles.title, { color: colors.text }]}>{t('errors.signInRequired')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>
          Your session has expired or you haven't signed in yet.
        </Text>
        <AppButton
          title={t('login.submit')}
          onPress={() => navigation.navigate('Login')}
          fullWidth
        />
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