// mobile/src/pages/marketplace/PublicCategoryPageScreen.tsx
// Guest-accessible products within a category.
// SRS refs: §11.1, FR-SEARCH-002 (filter by category).

import React from 'react';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { BaseScreen } from '@layouts/common/BaseScreen';
import { GuestCategoryFallback } from './_fallbacks/GuestCategoryFallback';
import type { PublicStackParamList } from '@navigation/types';

type Nav = NativeStackNavigationProp<PublicStackParamList, 'PublicCategory'>;
type Route = RouteProp<PublicStackParamList, 'PublicCategory'>;

export function PublicCategoryPageScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { categoryId, categoryName } = route.params ?? {};

  const handleRequireAuth = () => {
    navigation.navigate('Login');
  };

  return (
    <BaseScreen title={categoryName ?? 'Category'} showBack>
      <GuestCategoryFallback
        categoryId={categoryId}
        categoryName={categoryName}
        onRequireAuth={handleRequireAuth}
      />
    </BaseScreen>
  );
}