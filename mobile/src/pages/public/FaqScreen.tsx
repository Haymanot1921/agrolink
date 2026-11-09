// mobile/src/pages/public/FaqScreen.tsx
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { BaseScreen } from '@layouts/common/BaseScreen';
import { AppAccordion } from '@components/ui/AppAccordion';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useTheme } from '@styles/useTheme';

export function FaqScreen(): React.ReactElement {
  const { t } = useTranslation('public');
  const { spacing } = useTheme();

  const items = [1, 2, 3, 4, 5, 6].map((n) => ({
    key: `q${n}`,
    title: t(`faq.q${n}`),
    content: (
      <Text style={{ lineHeight: 20 }}>
        {t(`faq.a${n}`)}
      </Text>
    ),
  }));

  return (
    <BaseScreen title={t('faq.title')} showBack>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <AppAccordion items={items} />
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({});