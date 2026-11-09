import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { PublicStackParamList } from '@navigation/types';
import { GuestProductListFallback } from './GuestProductListFallback';

interface GuestMarketplaceFallbackProps {
  onRequireAuth: () => void;
}

export function GuestMarketplaceFallback({
  onRequireAuth,
}: GuestMarketplaceFallbackProps): React.ReactElement {
  const navigation =
    useNavigation<NativeStackNavigationProp<PublicStackParamList, 'PublicMarketplace'>>();

  return (
    <GuestProductListFallback
      queryKey={['public-products']}
      onRequireAuth={onRequireAuth}
      onOpenProduct={(productId) =>
        navigation.navigate('PublicProductDetails', { productId })
      }
    />
  );
}
