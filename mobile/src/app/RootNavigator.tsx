// mobile/src/app/RootNavigator.tsx
// Root navigator — switches between public, auth, and 5 actor stacks.
//
// New behaviour (SRS §11.1):
//   - Unauthenticated users land on `Public` (guest browsing enabled)
//   - They can navigate into Auth when they tap Login/Register
//   - Logged-in users land in their actor stack
//   - Public screens remain reachable from any stack via deep links

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { navigationRef } from './navigationRef';
import { linkingConfig } from './linking';
import { useAuth } from '@hooks/useAuth';
import { useTheme } from '@styles/useTheme';

import { PublicStack } from '@navigation/public/PublicStack';
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

  if (isBootstrapping) return null;

  // ⚠️ If not logged in → land on Public (guest mode)
  //     Only go to Auth when the user explicitly taps Login.
  const initialRoute: keyof RootStackParamList = !user ? 'Public' : resolveActorRoute(user);

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
      <RootStack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        <RootStack.Screen name="Public" component={PublicStack} />
        <RootStack.Screen name="Auth" component={AuthStack} />
        <RootStack.Screen name="Farmer" component={FarmerStack} />
        <RootStack.Screen name="Buyer" component={BuyerStack} />
        <RootStack.Screen name="InputSupplier" component={InputSupplierStack} />
        <RootStack.Screen name="AgriculturalExpert" component={ExpertStack} />
        <RootStack.Screen name="SupportAgent" component={SupportAgentStack} />
        <RootStack.Screen name="Administrator" component={AdministratorStack} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

function resolveActorRoute(user: {
  role: string;
  providerType?: string | null;
}): keyof RootStackParamList {
  if (user.role === 'farmer') return 'Farmer';
  if (user.role === 'buyer') return 'Buyer';
  if (user.role === 'service_provider' && user.providerType === 'input_supplier') {
    return 'InputSupplier';
  }
  if (user.role === 'service_provider' && user.providerType === 'agricultural_expert') {
    return 'AgriculturalExpert';
  }
  if (user.role === 'support_agent') return 'SupportAgent';
  if (user.role === 'administrator') return 'Administrator';
  return 'Public';
}