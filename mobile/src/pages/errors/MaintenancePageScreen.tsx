// mobile/src/pages/errors/MaintenancePageScreen.tsx
// 503 — maintenance mode (server-side platform setting).
// SRS refs: §15.2.

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { BaseScreen } from '@layouts/common/BaseScreen';
import { AppButton } from '@components/ui/AppButton';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useTheme } from '@styles/useTheme';
import { PLATFORM } from '@constants/platform';

export function MaintenancePageScreen(): React.ReactElement {
  const { t } = useTranslation('mobile');
  const { colors, spacing } = useTheme();
  const [retryCount, setRetryCount] = useState(0);

  // Optional: auto-check for maintenance status every 30s
  useEffect(() => {
    const id = setInterval(() => setRetryCount((c) => c + 1), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <BaseScreen showOfflineBanner={false}>
      <View style={[styles.center, { padding: spacing.xl }]}>
        <Text style={styles.icon}>🔧</Text>
        <Text style={[styles.title, { color: colors.text }]}>{t('updates.maintenance')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>
          AgroLink is undergoing scheduled maintenance. We'll be back online soon.
        </Text>
        <Text style={[styles.contact, { color: colors.textSubtle }]}>
          Need urgent help? Contact {PLATFORM.supportEmail}
        </Text>
        <AppButton
          title={t('actions.refresh', { ns: 'common' })}
          onPress={() => setRetryCount((c) => c + 1)}
          fullWidth
        />
      </View>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 72, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  body: { fontSize: 14, textAlign: 'center', marginBottom: 12, lineHeight: 20 },
  contact: { fontSize: 12, marginBottom: 24 },
});