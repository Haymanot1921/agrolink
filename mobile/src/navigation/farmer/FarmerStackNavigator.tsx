import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ActorDashboardScreen } from '@navigation/ActorDashboardScreen';
import type { FarmerStackParamList } from '@navigation/types';

const Stack = createNativeStackNavigator<FarmerStackParamList>();

function FarmerDashboard(): React.ReactElement {
  return <ActorDashboardScreen roleName="Farmer" />;
}

export function FarmerStack(): React.ReactElement {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={FarmerDashboard} />
    </Stack.Navigator>
  );
}
