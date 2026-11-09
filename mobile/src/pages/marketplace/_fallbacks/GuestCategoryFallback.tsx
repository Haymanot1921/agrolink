import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { PublicStackParamList } from '@navigation/types';
import { GuestProductListFallback } from './GuestProductListFallback';

interface GuestCategoryFallbackProps {
  categoryId?: number;
  categoryName?: string;
  onRequireAuth: () => void;
}

export function GuestCategoryFallback({
  categoryId,
  categoryName,
  onRequireAuth,
}: GuestCategoryFallbackProps): React.ReactElement {
  const navigation =
    useNavigation<NativeStackNavigationProp<PublicStackParamList, 'PublicCategory'>>();

  return (
    <GuestProductListFallback
      queryKey={['public-products', 'category', categoryId]}
      params={{ categoryId }}
      onRequireAuth={onRequireAuth}
      emptyTitle={categoryName ? `No products in ${categoryName}` : 'No products in this category'}
      onOpenProduct={(productId) =>
        navigation.navigate('PublicProductDetails', { productId })
      }
    />
  );
}
