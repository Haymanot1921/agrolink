// mobile/src/navigation/auth/ResetPasswordScreen.tsx
// Password reset step 2 — after OTP is verified (FR-AUTH-007).

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { useAuth } from '@hooks/useAuth';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { Alert } from '@components/feedback/Alert';
import { PasswordStrengthMeter } from '@components/ui/PasswordStrengthMeter';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import type { AuthStackParamList } from '@navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'ResetPassword'>;
type Route = RouteProp<AuthStackParamList, 'ResetPassword'>;

export function ResetPasswordScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { t } = useTranslation('auth');
  const { resetPassword, isResettingPassword, error } = useAuth();

  const { token } = route.params;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLocalError(null);
    if (!newPassword || !confirmPassword) {
      setLocalError(t('validation:required', { field: t('resetPassword.newPassword') }));
      return;
    }
    if (newPassword !== confirmPassword) {
      setLocalError(t('validation:password.match'));
      return;
    }
    try {
      await resetPassword({ token, newPassword });
      navigation.replace('Login');
    } catch {
      // error surfaced via useAuth
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{t('resetPassword.title')}</Text>
        <Text style={styles.subtitle}>{t('resetPassword.subtitle')}</Text>

        {(error || localError) && (
          <Alert type="error" message={localError ?? error?.message ?? ''} />
        )}

        <Input
          label={t('resetPassword.newPassword')}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          autoComplete="new-password"
        />
        <PasswordStrengthMeter password={newPassword} />

        <Input
          label={t('resetPassword.confirmPassword')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoComplete="new-password"
        />

        <Button
          title={isResettingPassword ? t('resetPassword.resetting') : t('resetPassword.submit')}
          onPress={handleSubmit}
          loading={isResettingPassword}
          disabled={isResettingPassword}
          variant="primary"
          fullWidth
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, gap: spacing.md },
  title: { fontSize: 26, fontWeight: '700', color: colors.text, marginTop: spacing.lg },
  subtitle: { fontSize: 15, color: colors.textMuted, marginBottom: spacing.lg },
});