// mobile/src/pages/errors/ForbiddenPageScreen.tsx
// 403 — user is logged in but lacks permission.
// SRS refs: FR-AUTH-008 (RBAC), §15.2.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { BaseScreen } from '@layouts/common/BaseScreen';
import { AppButton } from '@components/ui/AppButton';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useTheme } from '@styles/useTheme';

export function ForbiddenPageScreen(): React.ReactElement {
  const navigation = useNavigation<any>();
  const { t } = useTranslation('auth');
  const { colors, spacing } = useTheme();

  return (
    <BaseScreen showOfflineBanner={false}>
      <View style={[styles.center, { padding: spacing.xl }]}>
        <Text style={[styles.code, { color: colors.warning }]}>403</Text>
        <Text style={[styles.title, { color: colors.text }]}>{t('errors.permissionDenied')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>
          You don't have access to this section. Contact support if you believe this is a mistake.
        </Text>
        <AppButton
          title="Go back"
          variant="outline"
          onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home'))}
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