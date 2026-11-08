// mobile/src/navigation/auth/ForgotPasswordScreen.tsx
// Password recovery step 1 (FR-AUTH-007).

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { useAuth } from '@hooks/useAuth';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { Alert } from '@components/feedback/Alert';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import type { AuthStackParamList } from '@navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const { t } = useTranslation('auth');
  const { requestPasswordReset, isRequestingReset, error } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    setLocalError(null);
    if (!identifier) {
      setLocalError(t('validation:required', { field: t('forgotPassword.emailOrPhone') }));
      return;
    }
    try {
      await requestPasswordReset({ identifier });
      setSent(true);
      navigation.navigate('OtpVerification', {
        identifier,
        purpose: 'reset',
      });
    } catch {
      // error surfaced via useAuth
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{t('forgotPassword.title')}</Text>
        <Text style={styles.subtitle}>{t('forgotPassword.subtitle')}</Text>

        {(error || localError) && (
          <Alert type="error" message={localError ?? error?.message ?? ''} />
        )}

        {sent && <Alert type="success" message={t('forgotPassword.sending')} />}

        <Input
          label={t('forgotPassword.emailOrPhone')}
          placeholder={t('login.emailOrPhonePlaceholder')}
          value={identifier}
          onChangeText={setIdentifier}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Button
          title={isRequestingReset ? t('forgotPassword.sending') : t('forgotPassword.submit')}
          onPress={handleSubmit}
          loading={isRequestingReset}
          disabled={isRequestingReset}
          variant="primary"
          fullWidth
        />

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backLink}
        >
          <Text style={styles.backText}>{t('forgotPassword.backToLogin')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, gap: spacing.md },
  title: { fontSize: 26, fontWeight: '700', color: colors.text, marginTop: spacing.lg },
  subtitle: { fontSize: 15, color: colors.textMuted, marginBottom: spacing.lg },
  backLink: { alignItems: 'center', marginTop: spacing.lg },
  backText: { color: colors.primary, fontSize: 14, fontWeight: '600' },
});