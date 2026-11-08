// mobile/src/app/RootNavigator.tsx
// Root navigator — switches between Auth stack and the correct actor
// stack based on the authenticated user's role + provider_type
// (SRS §4.1, §4.1.3 — Service Provider has 2 types).

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { navigationRef } from './navigationRef';
import { linkingConfig } from './linking';
import { useAuth } from '@hooks/useAuth';
import { useTheme } from '@styles/useTheme';

import { AuthStack } from '@navigation/auth/AuthStack';
import { FarmerStack } from '@navigation/farmer/FarmerStackNavigator';
import { BuyerStack } from '@navigation/buyer/BuyerStackNavigator';
import { InputSupplierStack } from '@navigation/input-supplier/InputSupplierStackNavigator';
import { ExpertStack } from '@navigation/agricultural-expert/ExpertStackNavigator';
import { SupportAgentStack } from '@navigation/support-agent/SupportAgentStackNavigator';
import { AdministratorStack } from '@navigation/administrator/AdministratorStackNavigator';

import type { RootStackParamList } from '@navigation/types';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator(): React.ReactElement | null {
  const { user, isBootstrapping } = useAuth();
  const theme = useTheme();

  // Keep splash visible until auth bootstrap completes
  if (isBootstrapping) return null;

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linkingConfig}
      theme={{
        dark: theme.isDark,
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.card,
          text: theme.colors.text,
          border: theme.colors.border,
          notification: theme.colors.notification,
        },
      }}
    >
      <RootStack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {!user ? (
          <RootStack.Screen name="Auth" component={AuthStack} />
        ) : user.role === 'farmer' ? (
          <RootStack.Screen name="Farmer" component={FarmerStack} />
        ) : user.role === 'buyer' ? (
          <RootStack.Screen name="Buyer" component={BuyerStack} />
        ) : user.role === 'service_provider' && user.providerType === 'input_supplier' ? (
          <RootStack.Screen name="InputSupplier" component={InputSupplierStack} />
        ) : user.role === 'service_provider' && user.providerType === 'agricultural_expert' ? (
          <RootStack.Screen name="AgriculturalExpert" component={ExpertStack} />
        ) : user.role === 'support_agent' ? (
          <RootStack.Screen name="SupportAgent" component={SupportAgentStack} />
        ) : user.role === 'administrator' ? (
          <RootStack.Screen name="Administrator" component={AdministratorStack} />
        ) : (
          // Fallback — unknown role/provider → force auth
          <RootStack.Screen name="Auth" component={AuthStack} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}