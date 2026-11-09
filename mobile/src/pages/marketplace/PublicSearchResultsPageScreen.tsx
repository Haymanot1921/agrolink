// mobile/src/pages/marketplace/PublicSearchResultsPageScreen.tsx
// Guest-accessible search results.
// SRS refs: §11.1, §11.7, FR-SEARCH-001..009.

import React from 'react';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { BaseScreen } from '@layouts/common/BaseScreen';
import { GuestSearchFallback } from './_fallbacks/GuestSearchFallback';
import type { PublicStackParamList } from '@navigation/types';

type Nav = NativeStackNavigationProp<PublicStackParamList, 'PublicSearchResults'>;
type Route = RouteProp<PublicStackParamList, 'PublicSearchResults'>;

export function PublicSearchResultsPageScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const query = route.params?.query ?? '';

  const handleRequireAuth = () => {
    navigation.navigate('Login');
  };

  return (
    <BaseScreen title={`Search: ${query}`} showBack>
      <GuestSearchFallback initialQuery={query} onRequireAuth={handleRequireAuth} />
    </BaseScreen>
  );
}