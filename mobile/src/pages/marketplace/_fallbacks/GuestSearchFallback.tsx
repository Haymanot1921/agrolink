import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { PublicStackParamList } from '@navigation/types';
import { GuestProductListFallback } from './GuestProductListFallback';

interface GuestSearchFallbackProps {
  initialQuery: string;
  onRequireAuth: () => void;
}

export function GuestSearchFallback({
  initialQuery,
  onRequireAuth,
}: GuestSearchFallbackProps): React.ReactElement {
  const navigation =
    useNavigation<NativeStackNavigationProp<PublicStackParamList, 'PublicSearchResults'>>();

  return (
    <GuestProductListFallback
      queryKey={['public-products', 'search', initialQuery]}
      params={{ q: initialQuery }}
      onRequireAuth={onRequireAuth}
      emptyTitle="No matching products"
      onOpenProduct={(productId) =>
        navigation.navigate('PublicProductDetails', { productId })
      }
    />
  );
}
