import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ActorDashboardScreen } from '@navigation/ActorDashboardScreen';
import type { SupportAgentStackParamList } from '@navigation/types';

const Stack = createNativeStackNavigator<SupportAgentStackParamList>();

function SupportAgentDashboard(): React.ReactElement {
  return <ActorDashboardScreen roleName="Support Agent" />;
}

export function SupportAgentStack(): React.ReactElement {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={SupportAgentDashboard} />
    </Stack.Navigator>
  );
}
