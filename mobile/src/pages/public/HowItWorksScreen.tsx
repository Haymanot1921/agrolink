// mobile/src/pages/public/HowItWorksScreen.tsx
import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { BaseScreen } from '@layouts/common/BaseScreen';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useTheme } from '@styles/useTheme';

export function HowItWorksScreen(): React.ReactElement {
  const { t } = useTranslation('public');
  const { colors, spacing } = useTheme();

  const actors = ['farmer', 'buyer', 'serviceProvider', 'supportAgent', 'administrator'] as const;

  return (
    <BaseScreen title={t('howItWorks.title')} showBack>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        {actors.map((actor, idx) => (
          <Text key={actor} style={[styles.h2, { color: colors.text }]}>
            {idx + 1}. {t(`howItWorks.${actor}Title`)}
          </Text>
        ))}
        {actors.map((actor) => (
          <Text key={`${actor}-body`} style={[styles.body, { color: colors.textMuted }]}>
            {t(`howItWorks.${actor}Body`)}
          </Text>
        ))}
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  h2: { fontSize: 16, fontWeight: '700', marginTop: 16, marginBottom: 4 },
  body: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
});