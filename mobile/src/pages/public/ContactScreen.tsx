// mobile/src/pages/public/ContactScreen.tsx
import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, Linking, Alert } from 'react-native';
import { BaseScreen } from '@layouts/common/BaseScreen';
import { AppInput } from '@components/ui/AppInput';
import { AppTextarea } from '@components/ui/AppTextarea';
import { AppButton } from '@components/ui/AppButton';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useTheme } from '@styles/useTheme';
import { PLATFORM } from '@constants/platform';

export function ContactScreen(): React.ReactElement {
  const { t } = useTranslation('public');
  const { colors, spacing } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const send = async () => {
    const mailto = `mailto:${PLATFORM.supportEmail}?subject=Contact%20from%20${encodeURIComponent(
      name,
    )}&body=${encodeURIComponent(message + '\n\nFrom: ' + email)}`;
    try {
      await Linking.openURL(mailto);
    } catch {
      Alert.alert('Could not open email app');
    }
  };

  return (
    <BaseScreen title={t('contact.title')} showBack>
      <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}>
        <Text style={[styles.body, { color: colors.textMuted }]}>{t('contact.subtitle')}</Text>
        <AppInput label={t('contact.name')} value={name} onChangeText={setName} required />
        <AppInput
          label={t('contact.email')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          required
        />
        <AppTextarea label={t('contact.message')} value={message} onChangeText={setMessage} rows={6} required />
        <AppButton title={t('contact.send')} onPress={send} fullWidth />
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  body: { fontSize: 14, lineHeight: 20 },
});