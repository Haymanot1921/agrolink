import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ActorDashboardScreen } from '@navigation/ActorDashboardScreen';
import type { BuyerStackParamList } from '@navigation/types';

const Stack = createNativeStackNavigator<BuyerStackParamList>();

function BuyerDashboard(): React.ReactElement {
  return <ActorDashboardScreen roleName="Buyer" />;
}

export function BuyerStack(): React.ReactElement {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={BuyerDashboard} />
    </Stack.Navigator>
  );
}
