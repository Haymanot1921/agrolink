// mobile/src/pages/market-prices/PublicMarketPricesPageScreen.tsx
// Guest-accessible market prices.
// SRS refs: §5.9 FR-PRICE-001..008, §11.1, §11.7.
//
// ⚠️ SRS FR-PRICE-005: every price record MUST display its date.
// ⚠️ SRS FR-PRICE-006: market prices are informational — NOT a seller's offer.

import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { BaseScreen } from '@layouts/common/BaseScreen';
import { GuestMarketPricesFallback } from './_fallbacks/GuestMarketPricesFallback';
import type { PublicStackParamList } from '@navigation/types';

type Nav = NativeStackNavigationProp<PublicStackParamList, 'PublicMarketPrices'>;

export function PublicMarketPricesPageScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();

  return (
    <BaseScreen title="Market Prices" showBack>
      <GuestMarketPricesFallback
        onOpenPrice={(priceId) =>
          navigation.navigate('PublicMarketPriceDetails', { priceId })
        }
      />
    </BaseScreen>
  );
}