import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ActorDashboardScreen } from '@navigation/ActorDashboardScreen';
import type { AdministratorStackParamList } from '@navigation/types';

const Stack = createNativeStackNavigator<AdministratorStackParamList>();

function AdministratorDashboard(): React.ReactElement {
  return <ActorDashboardScreen roleName="Administrator" />;
}

export function AdministratorStack(): React.ReactElement {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={AdministratorDashboard} />
    </Stack.Navigator>
  );
}
