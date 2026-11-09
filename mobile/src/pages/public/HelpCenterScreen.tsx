// mobile/src/pages/public/HelpCenterScreen.tsx
import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { BaseScreen } from '@layouts/common/BaseScreen';
import { AppSearchBar } from '@components/ui/AppSearchBar';
import { AppAccordion } from '@components/ui/AppAccordion';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useTheme } from '@styles/useTheme';

const CATEGORIES = ['account', 'orders', 'payments', 'consultations', 'technical'];

export function HelpCenterScreen(): React.ReactElement {
  const { t } = useTranslation('public');
  const { colors, spacing } = useTheme();
  const [query, setQuery] = useState('');

  return (
    <BaseScreen title={t('helpCenter.title')} showBack>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <AppSearchBar value={query} onChangeText={setQuery} placeholder={t('helpCenter.searchPlaceholder')} />

        {CATEGORIES.map((cat) => (
          <View key={cat} style={{ marginTop: 24 }}>
            <Text style={[styles.h2, { color: colors.text }]}>{t(`helpCenter.${cat}Title`)}</Text>
            <AppAccordion
              items={[1, 2, 3].map((n) => ({
                key: `${cat}-${n}`,
                title: t(`helpCenter.${cat}Q${n}`),
                content: <Text style={{ lineHeight: 20 }}>{t(`helpCenter.${cat}A${n}`)}</Text>,
              }))}
            />
          </View>
        ))}
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  h2: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
});