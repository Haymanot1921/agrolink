import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ActorDashboardScreen } from '@navigation/ActorDashboardScreen';
import type { InputSupplierStackParamList } from '@navigation/types';

const Stack = createNativeStackNavigator<InputSupplierStackParamList>();

function SupplierDashboard(): React.ReactElement {
  return <ActorDashboardScreen roleName="Input Supplier" />;
}

export function InputSupplierStack(): React.ReactElement {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={SupplierDashboard} />
    </Stack.Navigator>
  );
}
