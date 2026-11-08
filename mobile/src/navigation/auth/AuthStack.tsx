// mobile/src/navigation/auth/AuthStack.tsx
// Auth flow navigator — Onboarding → RoleSelection → Register/Login → OTP
// Wrapped with GuestOnly guard so logged-in users never see it.

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { GuestOnly } from '@app/routeGuards';
import type { AuthStackParamList } from '@navigation/types';

import { OnboardingScreen } from './OnboardingScreen';
import { RoleSelectionScreen } from './RoleSelectionScreen';
import { ServiceProviderTypeScreen } from './ServiceProviderTypeScreen';
import { LoginScreen } from './LoginScreen';
import { RegisterScreen } from './RegisterScreen';
import { ForgotPasswordScreen } from './ForgotPasswordScreen';
import { OtpVerificationScreen } from './OtpVerificationScreen';
import { ResetPasswordScreen } from './ResetPasswordScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack(): React.ReactElement {
  return (
    <GuestOnly>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="ServiceProviderType" component={ServiceProviderTypeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
      </Stack.Navigator>
    </GuestOnly>
  );
}