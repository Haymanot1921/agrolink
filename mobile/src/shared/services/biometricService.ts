// mobile/src/shared/services/biometricService.ts
// Face ID / Touch ID / fingerprint wrapper.
// SRS refs: FR-AUTH-011.

import * as LocalAuthentication from 'expo-local-authentication';

export interface BiometricAvailability {
  hasHardware: boolean;
  isEnrolled: boolean;
  types: LocalAuthentication.AuthenticationType[];
  hasPasscode: boolean;
}

export const biometricService = {
  async getAvailability(): Promise<BiometricAvailability> {
    const [hasHardware, isEnrolled, types, level] = await Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
      LocalAuthentication.supportedAuthenticationTypesAsync(),
      LocalAuthentication.getEnrolledLevelAsync(),
    ]);
    return {
      hasHardware,
      isEnrolled,
      types,
      hasPasscode: level !== LocalAuthentication.SecurityLevel.NONE,
    };
  },

  async authenticate(promptMessage = 'Log in to AgroLink'): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: 'Use passcode',
        disableDeviceFallback: false,
        cancelLabel: 'Cancel',
      });
      return result.success;
    } catch {
      return false;
    }
  },
};