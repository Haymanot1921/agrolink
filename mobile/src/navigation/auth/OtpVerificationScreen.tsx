// mobile/src/navigation/auth/OtpVerificationScreen.tsx
// OTP verification for registration OR password reset (FR-AUTH-001, FR-AUTH-007).

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { useAuth } from '@hooks/useAuth';
import { Button } from '@components/ui/Button';
import { Alert } from '@components/feedback/Alert';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import type { AuthStackParamList } from '@navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'OtpVerification'>;
type Route = RouteProp<AuthStackParamList, 'OtpVerification'>;

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export function OtpVerificationScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { t } = useTranslation('auth');
  const { verifyOtp, resendOtp, isVerifying, error } = useAuth();

  const { identifier, purpose } = route.params;
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [localError, setLocalError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const inputsRef = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const handleChange = (text: string, idx: number) => {
    const next = [...digits];
    next[idx] = text.replace(/\D/g, '').slice(-1);
    setDigits(next);
    if (next[idx] && idx < OTP_LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, idx: number) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    setLocalError(null);
    const code = digits.join('');
    if (code.length !== OTP_LENGTH) {
      setLocalError(t('otp.submit') + ' — ' + OTP_LENGTH + ' digits');
      return;
    }
    try {
      await verifyOtp({ identifier, code, purpose });
      // After successful verification → RootNavigator switches to actor stack.
    } catch {
      // error surfaced via useAuth
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    await resendOtp({ identifier, purpose });
    setCooldown(RESEND_COOLDOWN);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{t('otp.title')}</Text>
        <Text style={styles.subtitle}>{t('otp.subtitle', { identifier })}</Text>

        {(error || localError) && (
          <Alert type="error" message={localError ?? error?.message ?? ''} />
        )}

        <View style={styles.otpRow}>
          {digits.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={(r) => {
                inputsRef.current[idx] = r;
              }}
              value={digit}
              onChangeText={(text) => handleChange(text, idx)}
              onKeyPress={(e) => handleKeyPress(e, idx)}
              keyboardType="number-pad"
              maxLength={1}
              style={styles.otpBox}
              textAlign="center"
              accessibilityLabel={`OTP digit ${idx + 1}`}
            />
          ))}
        </View>

        <Button
          title={isVerifying ? t('otp.verifying') : t('otp.submit')}
          onPress={handleSubmit}
          loading={isVerifying}
          disabled={isVerifying}
          variant="primary"
          fullWidth
        />

        <View style={styles.resendRow}>
          <Text style={styles.resendText}>{t('otp.resend')} </Text>
          {cooldown > 0 ? (
            <Text style={styles.resendDisabled}>
              {t('otp.resendIn', { seconds: cooldown })}
            </Text>
          ) : (
            <Text onPress={handleResend} style={styles.resendLink}>
              {t('otp.resendAction')}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, gap: spacing.md },
  title: { fontSize: 26, fontWeight: '700', color: colors.text, marginTop: spacing.lg },
  subtitle: { fontSize: 15, color: colors.textMuted, marginBottom: spacing.lg },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.lg,
    gap: spacing.sm,
  },
  otpBox: {
    flex: 1,
    height: 56,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
    backgroundColor: colors.card,
  },
  resendRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.md },
  resendText: { fontSize: 14, color: colors.textMuted },
  resendLink: { fontSize: 14, color: colors.primary, fontWeight: '600' },
  resendDisabled: { fontSize: 14, color: colors.textMuted },
});