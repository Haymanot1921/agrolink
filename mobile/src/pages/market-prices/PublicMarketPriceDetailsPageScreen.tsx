// mobile/src/pages/market-prices/PublicMarketPriceDetailsPageScreen.tsx
// Guest-accessible market price detail.
// SRS refs: §5.9 FR-PRICE-002, 005, 006.

import React from 'react';
import { useRoute, type RouteProp } from '@react-navigation/native';

import { BaseScreen } from '@layouts/common/BaseScreen';
import { GuestMarketPriceDetailsFallback } from './_fallbacks/GuestMarketPriceDetailsFallback';
import type { PublicStackParamList } from '@navigation/types';

type Route = RouteProp<PublicStackParamList, 'PublicMarketPriceDetails'>;

export function PublicMarketPriceDetailsPageScreen(): React.ReactElement {
  const route = useRoute<Route>();
  const priceId = route.params?.priceId;

  if (!priceId) {
    return (
      <BaseScreen title="Market Price" showBack>
        <GuestMarketPriceDetailsFallback priceId={undefined} />
      </BaseScreen>
    );
  }

  return (
    <BaseScreen title="Market Price" showBack>
      <GuestMarketPriceDetailsFallback priceId={priceId} />
    </BaseScreen>
  );
}