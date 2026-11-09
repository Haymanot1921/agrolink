// mobile/src/navigation/public/PublicDrawerNavigator.tsx
// Drawer for the "More" tab — Legal, Company, Support, Errors.
// SRS refs: §11.7 (mobile UX), §11.1.

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import type { PublicMoreStackParamList } from '@navigation/types';
import { useTheme } from '@styles/useTheme';
import { MoreStack } from './MoreStack';

const Drawer = createDrawerNavigator<PublicMoreStackParamList>();

export function PublicDrawerNavigator(): React.ReactElement {
  const { colors } = useTheme();

  return (
    <Drawer.Navigator
      initialRouteName="MoreMenu"
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.text,
        drawerStyle: { backgroundColor: colors.card },
      }}
    >
      <Drawer.Screen
        name="MoreMenu"
        component={MoreStack}
        options={{ title: 'More', drawerLabel: 'More' }}
      />
    </Drawer.Navigator>
  );
}