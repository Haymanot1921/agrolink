// mobile/src/navigation/auth/LoginScreen.tsx
// Login with email/phone + password (FR-AUTH-004, FR-AUTH-010).

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { useAuth } from '@hooks/useAuth';
import { useBiometrics } from '@hooks/useBiometrics';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { Alert } from '@components/feedback/Alert';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import type { AuthStackParamList } from '@navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function LoginScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const { t } = useTranslation('auth');
  const { signIn, isSigningIn, error } = useAuth();
  const { isAvailable: biometricAvailable, authenticate: biometricAuth } = useBiometrics();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLocalError(null);
    if (!identifier || !password) {
      setLocalError(t('validation:required', { field: t('login.emailOrPhone') }));
      return;
    }
    try {
      await signIn({ identifier, password });
      // RootNavigator automatically switches to the correct actor stack.
    } catch {
      // error surfaces via useAuth
    }
  };

  const handleBiometric = async () => {
    const success = await biometricAuth();
    if (success) {
      // useAuth picks up the stored session
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>{t('login.title')}</Text>
          <Text style={styles.subtitle}>{t('login.subtitle')}</Text>

          {(error || localError) && <Alert type="error" message={localError ?? error?.message ?? ''} />}

          <Input
            label={t('login.emailOrPhone')}
            placeholder={t('login.emailOrPhonePlaceholder')}
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            autoComplete="username"
            keyboardType="email-address"
            textContentType="username"
          />

          <Input
            label={t('login.password')}
            placeholder={t('login.passwordPlaceholder')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            textContentType="password"
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotLink}
          >
            <Text style={styles.forgotText}>{t('login.forgotPassword')}</Text>
          </TouchableOpacity>

          <Button
            title={isSigningIn ? t('login.loggingIn') : t('login.submit')}
            onPress={handleLogin}
            loading={isSigningIn}
            disabled={isSigningIn}
            variant="primary"
            fullWidth
          />

          {biometricAvailable && (
            <Button
              title={t('login.biometricPrompt')}
              onPress={handleBiometric}
              variant="outline"
              fullWidth
            />
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('login.noAccount')} </Text>
            <TouchableOpacity onPress={() => navigation.navigate('RoleSelection')}>
              <Text style={styles.footerLink}>{t('login.signUp')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, gap: spacing.md },
  title: { fontSize: 26, fontWeight: '700', color: colors.text, marginTop: spacing.lg },
  subtitle: { fontSize: 15, color: colors.textMuted, marginBottom: spacing.lg },
  forgotLink: { alignSelf: 'flex-end', marginTop: -spacing.sm },
  forgotText: { color: colors.primary, fontSize: 14, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  footerText: { color: colors.textMuted, fontSize: 14 },
  footerLink: { color: colors.primary, fontSize: 14, fontWeight: '600' },
});