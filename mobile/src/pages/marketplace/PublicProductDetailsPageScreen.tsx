// mobile/src/pages/marketplace/PublicProductDetailsPageScreen.tsx
// Guest-accessible product details.
// SRS refs: §11.1, §11.7, FR-MARKET-010, FR-MARKET-015 (report listing).

import React from 'react';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { BaseScreen } from '@layouts/common/BaseScreen';
import { GuestProductDetailsFallback } from './_fallbacks/GuestProductDetailsFallback';
import type { PublicStackParamList } from '@navigation/types';

type Nav = NativeStackNavigationProp<PublicStackParamList, 'PublicProductDetails'>;
type Route = RouteProp<PublicStackParamList, 'PublicProductDetails'>;

export function PublicProductDetailsPageScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const productId = route.params?.productId;

  const handleRequireAuth = () => {
    navigation.navigate('Login');
  };

  if (!productId) {
    return (
      <BaseScreen title="Product" showBack>
        <GuestProductDetailsFallback
          productId={undefined}
          onRequireAuth={handleRequireAuth}
        />
      </BaseScreen>
    );
  }

  return (
    <BaseScreen title="Product Details" showBack>
      <GuestProductDetailsFallback productId={productId} onRequireAuth={handleRequireAuth} />
    </BaseScreen>
  );
}