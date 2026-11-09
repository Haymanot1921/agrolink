// mobile/src/pages/public/NotFoundScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BaseScreen } from '@layouts/common/BaseScreen';
import { AppButton } from '@components/ui/AppButton';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useTheme } from '@styles/useTheme';

export function NotFoundScreen(): React.ReactElement {
  const navigation = useNavigation<any>();
  const { t } = useTranslation('public');
  const { colors, spacing } = useTheme();

  return (
    <BaseScreen showBack>
      <View style={[styles.center, { padding: spacing.xl }]}>
        <Text style={[styles.code, { color: colors.primary }]}>404</Text>
        <Text style={[styles.title, { color: colors.text }]}>{t('notFound.title')}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('notFound.body')}</Text>
        <AppButton
          title={t('notFound.goHome', { ns: 'common' })}
          onPress={() => navigation.navigate('Home')}
          fullWidth
        />
      </View>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  code: { fontSize: 64, fontWeight: '800', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  body: { fontSize: 14, textAlign: 'center', marginBottom: 24 },
});