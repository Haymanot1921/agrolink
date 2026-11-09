import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ActorDashboardScreen } from '@navigation/ActorDashboardScreen';
import type { ExpertStackParamList } from '@navigation/types';

const Stack = createNativeStackNavigator<ExpertStackParamList>();

function ExpertDashboard(): React.ReactElement {
  return <ActorDashboardScreen roleName="Agricultural Expert" />;
}

export function ExpertStack(): React.ReactElement {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={ExpertDashboard} />
    </Stack.Navigator>
  );
}
