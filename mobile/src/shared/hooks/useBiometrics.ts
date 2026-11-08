// mobile/src/shared/hooks/useBiometrics.ts
// Check + authenticate with Face ID / Touch ID / fingerprint.
// SRS refs: FR-AUTH-011 (secure re-auth).

import { useCallback, useEffect, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

export interface UseBiometricsResult {
  isAvailable: boolean;
  isEnrolled: boolean;
  supportedTypes: LocalAuthentication.AuthenticationType[];
  /** Prompt the user — returns true if authenticated. */
  authenticate: (promptMessage?: string) => Promise<boolean>;
}

export function useBiometrics(): UseBiometricsResult {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [supportedTypes, setSupportedTypes] = useState<
    LocalAuthentication.AuthenticationType[]
  >([]);

  useEffect(() => {
    (async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      setIsAvailable(hasHardware);
      setIsEnrolled(enrolled);
      setSupportedTypes(types);
    })();
  }, []);

  const authenticate = useCallback(
    async (promptMessage = 'Log in to AgroLink') => {
      if (!isAvailable || !isEnrolled) return false;
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: 'Use passcode',
        disableDeviceFallback: false,
        cancelLabel: 'Cancel',
      });
      return result.success;
    },
    [isAvailable, isEnrolled],
  );

  return { isAvailable, isEnrolled, supportedTypes, authenticate };
}