// mobile/src/navigation/auth/RegisterScreen.tsx
// Registration with role + providerType (FR-AUTH-001, 002).

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

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Register'>;
type Route = RouteProp<AuthStackParamList, 'Register'>;

export function RegisterScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { t } = useTranslation('auth');
  const { signUp, isSigningUp, error } = useAuth();

  const { role, providerType } = route.params;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleRegister = async () => {
    setLocalError(null);
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setLocalError(t('validation:required', { field: 'All fields' }));
      return;
    }
    if (password !== confirmPassword) {
      setLocalError(t('validation:password.match'));
      return;
    }
    if (!agreeTerms) {
      setLocalError(t('validation:agreeTerms'));
      return;
    }

    try {
      await signUp({
        fullName,
        email,
        phone,
        password,
        role,
        providerType,
      });
      navigation.navigate('OtpVerification', {
        identifier: phone,
        purpose: 'registration',
      });
    } catch {
      // error surfaces via useAuth
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>{t('register.title')}</Text>
          <Text style={styles.subtitle}>{t('register.subtitle')}</Text>

          {(error || localError) && (
            <Alert type="error" message={localError ?? error?.message ?? ''} />
          )}

          <Input
            label={t('register.fullName')}
            placeholder={t('register.fullNamePlaceholder')}
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />

          <Input
            label={t('register.email')}
            placeholder={t('register.emailPlaceholder')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Input
            label={t('register.phone')}
            placeholder={t('register.phonePlaceholder')}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoComplete="tel"
          />

          <Input
            label={t('register.password')}
            placeholder={t('register.passwordPlaceholder')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="new-password"
          />
          <PasswordStrengthMeter password={password} />

          <Input
            label={t('register.confirmPassword')}
            placeholder={t('register.confirmPasswordPlaceholder')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoComplete="new-password"
          />

          <TouchableOpacity
            style={styles.checkRow}
            onPress={() => setAgreeTerms((v) => !v)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: agreeTerms }}
          >
            <View style={[styles.checkbox, agreeTerms && styles.checkboxOn]}>
              {agreeTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkLabel}>{t('register.agreeToTerms')}</Text>
          </TouchableOpacity>

          <Button
            title={isSigningUp ? t('register.registering') : t('register.submit')}
            onPress={handleRegister}
            loading={isSigningUp}
            disabled={isSigningUp}
            variant="primary"
            fullWidth
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('register.haveAccount')} </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>{t('register.login')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing['2xl'] },
  title: { fontSize: 26, fontWeight: '700', color: colors.text, marginTop: spacing.lg },
  subtitle: { fontSize: 15, color: colors.textMuted, marginBottom: spacing.lg },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.sm },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  checkboxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: '700' },
  checkLabel: { flex: 1, fontSize: 13, color: colors.textMuted },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  footerText: { color: colors.textMuted, fontSize: 14 },
  footerLink: { color: colors.primary, fontSize: 14, fontWeight: '600' },
});