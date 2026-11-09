// mobile/src/navigation/public/PublicStack.tsx
// Public navigation stack — registers every screen from src/pages/.
// Guests land here; logged-in users can also open these via deep links.
// SRS refs: §11.1, §11.7.

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { PublicStackParamList } from '@navigation/types';

// ─────────────────────────────────────────────────────────────
// Page imports (from src/pages/)
// ─────────────────────────────────────────────────────────────

// Home tab (contains its own tab navigator)
import { PublicTabNavigator } from './PublicTabNavigator';

// Marketplace
import {
  PublicMarketplacePageScreen,
  PublicProductDetailsPageScreen,
  PublicCategoryPageScreen,
  PublicSearchResultsPageScreen,
} from '@pages/marketplace';

// Articles
import {
  PublicArticlesPageScreen,
  PublicArticleDetailsPageScreen,
  PublicArticleCategoryPageScreen,
} from '@pages/articles';

// Market prices
import {
  PublicMarketPricesPageScreen,
  PublicMarketPriceDetailsPageScreen,
} from '@pages/market-prices';

// Experts
import {
  PublicExpertsPageScreen,
  PublicExpertDetailsPageScreen,
} from '@pages/experts';

// Legal + public informational pages
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
  NotFoundScreen,
} from '@pages/public';

// Errors
import {
  UnauthorizedPageScreen,
  ForbiddenPageScreen,
  ServerErrorPageScreen,
  MaintenancePageScreen,
} from '@pages/errors';

// Auth (cross-navigated from within public)
import { LoginScreen } from '@navigation/auth/LoginScreen';
import { RegisterScreen } from '@navigation/auth/RegisterScreen';
import { RoleSelectionScreen } from '@navigation/auth/RoleSelectionScreen';
import { ForgotPasswordScreen } from '@navigation/auth/ForgotPasswordScreen';
import { ResetPasswordScreen } from '@navigation/auth/ResetPasswordScreen';
import { OtpVerificationScreen } from '@navigation/auth/OtpVerificationScreen';
import { OnboardingScreen } from '@navigation/auth/OnboardingScreen';

const Stack = createNativeStackNavigator<PublicStackParamList>();

export function PublicStack(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {/* ─────────── Main tabs ─────────── */}
      <Stack.Screen name="HomeTab" component={PublicTabNavigator} />

      {/* ─────────── About / marketing ─────────── */}
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="HowItWorks" component={HowItWorksScreen} />
      <Stack.Screen name="Pricing" component={PricingScreen} />
      <Stack.Screen name="Faq" component={FaqScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />

      {/* ─────────── Legal ─────────── */}
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="Cookies" component={CookiesScreen} />
      <Stack.Screen name="Accessibility" component={AccessibilityScreen} />

      {/* ─────────── Company ─────────── */}
      <Stack.Screen name="Careers" component={CareersScreen} />
      <Stack.Screen name="Press" component={PressScreen} />
      <Stack.Screen name="Blog" component={BlogScreen} />

      {/* ─────────── Marketplace ─────────── */}
      <Stack.Screen name="PublicMarketplace" component={PublicMarketplacePageScreen} />
      <Stack.Screen
        name="PublicProductDetails"
        component={PublicProductDetailsPageScreen}
      />
      <Stack.Screen name="PublicCategory" component={PublicCategoryPageScreen} />
      <Stack.Screen
        name="PublicSearchResults"
        component={PublicSearchResultsPageScreen}
      />

      {/* ─────────── Articles ─────────── */}
      <Stack.Screen name="PublicArticles" component={PublicArticlesPageScreen} />
      <Stack.Screen
        name="PublicArticleDetails"
        component={PublicArticleDetailsPageScreen}
      />
      <Stack.Screen
        name="PublicArticleCategory"
        component={PublicArticleCategoryPageScreen}
      />

      {/* ─────────── Market prices ─────────── */}
      <Stack.Screen
        name="PublicMarketPrices"
        component={PublicMarketPricesPageScreen}
      />
      <Stack.Screen
        name="PublicMarketPriceDetails"
        component={PublicMarketPriceDetailsPageScreen}
      />

      {/* ─────────── Experts ─────────── */}
      <Stack.Screen name="PublicExperts" component={PublicExpertsPageScreen} />
      <Stack.Screen
        name="PublicExpertDetails"
        component={PublicExpertDetailsPageScreen}
      />

      {/* ─────────── Auth (reachable from public) ─────────── */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="RoleSelection"
        component={RoleSelectionScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="OtpVerification"
        component={OtpVerificationScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ animation: 'fade' }}
      />

      {/* ─────────── Errors ─────────── */}
      <Stack.Screen name="Unauthorized" component={UnauthorizedPageScreen} />
      <Stack.Screen name="Forbidden" component={ForbiddenPageScreen} />
      <Stack.Screen name="ServerError" component={ServerErrorPageScreen} />
      <Stack.Screen name="Maintenance" component={MaintenancePageScreen} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} />
    </Stack.Navigator>
  );
}