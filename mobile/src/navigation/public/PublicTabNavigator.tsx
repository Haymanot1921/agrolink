// mobile/src/navigation/public/PublicTabNavigator.tsx
// Bottom tabs for guest browsing: Home | Market | Articles | Experts | More.
// SRS refs: §11.7 (mobile UX), §11.1 (public access).

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import type { PublicHomeTabParamList } from '@navigation/types';
import { TabBarIcon } from '@components/navigation/TabBarIcon';
import { useTheme } from '@styles/useTheme';
import { useTranslation } from '@i18n/hooks/useTranslation';

import { HomeScreen } from '@pages/public/HomeScreen';
import { PublicMarketplacePageScreen } from '@pages/marketplace';
import { PublicArticlesPageScreen } from '@pages/articles';
import { PublicExpertsPageScreen } from '@pages/experts';
import { PublicDrawerNavigator } from './PublicDrawerNavigator';

const Tab = createBottomTabNavigator<PublicHomeTabParamList>();

export function PublicTabNavigator(): React.ReactElement {
  const { colors } = useTheme();
  const { t } = useTranslation('public');

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.card,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t('tabs.home', { defaultValue: 'Home' }),
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              icon={<Icon name="home-outline" size={22} color={color} />}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Market"
        component={PublicMarketplacePageScreen}
        options={{
          tabBarLabel: t('tabs.market', { defaultValue: 'Market' }),
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              icon={<Icon name="storefront-outline" size={22} color={color} />}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Articles"
        component={PublicArticlesPageScreen}
        options={{
          tabBarLabel: t('tabs.articles', { defaultValue: 'Articles' }),
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              icon={<Icon name="book-open-page-variant-outline" size={22} color={color} />}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Experts"
        component={PublicExpertsPageScreen}
        options={{
          tabBarLabel: t('tabs.experts', { defaultValue: 'Experts' }),
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              icon={<Icon name="account-tie-outline" size={22} color={color} />}
            />
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={PublicDrawerNavigator}
        options={{
          tabBarLabel: t('tabs.more', { defaultValue: 'More' }),
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              icon={<Icon name="menu" size={22} color={color} />}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}