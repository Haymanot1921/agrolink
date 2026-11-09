// mobile/src/navigation/public/MoreStack.tsx
// Stack inside the "More" drawer tab.
// Groups About / Legal / Company / Contact / FAQ in one place.
// SRS refs: §11.1 (public pages).

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import type { PublicMoreStackParamList } from '@navigation/types';

// Pages
import {
  AboutScreen,
  HowItWorksScreen,
  PricingScreen,
  FaqScreen,
  ContactScreen,
  HelpCenterScreen,
  TermsScreen,
  PrivacyScreen,
  CookiesScreen,
  AccessibilityScreen,
  CareersScreen,
  PressScreen,
  BlogScreen,
} from '@pages/public';

import { MoreMenuScreen } from './MoreMenuScreen';

const Stack = createNativeStackNavigator<PublicMoreStackParamList>();

export function MoreStack(): React.ReactElement {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="MoreMenu" component={MoreMenuScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="HowItWorks" component={HowItWorksScreen} />
      <Stack.Screen name="Pricing" component={PricingScreen} />
      <Stack.Screen name="Faq" component={FaqScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="Cookies" component={CookiesScreen} />
      <Stack.Screen name="Accessibility" component={AccessibilityScreen} />
      <Stack.Screen name="Careers" component={CareersScreen} />
      <Stack.Screen name="Press" component={PressScreen} />
      <Stack.Screen name="Blog" component={BlogScreen} />
    </Stack.Navigator>
  );
}