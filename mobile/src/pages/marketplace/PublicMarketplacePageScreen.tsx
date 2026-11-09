// mobile/src/pages/marketplace/PublicMarketplacePageScreen.tsx
// Guest-accessible marketplace listing.
// SRS refs: §11.1, §11.7, FR-MARKET-007.

import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { BaseScreen } from '@layouts/common/BaseScreen';
import { GuestMarketplaceFallback } from './_fallbacks/GuestMarketplaceFallback';
import type { PublicStackParamList } from '@navigation/types';

type Nav = NativeStackNavigationProp<PublicStackParamList, 'PublicMarketplace'>;

export function PublicMarketplacePageScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();

  const handleRequireAuth = () => {
    navigation.navigate('Login');
  };

  return (
    <BaseScreen title="Marketplace" showBack>
      <GuestMarketplaceFallback onRequireAuth={handleRequireAuth} />
    </BaseScreen>
  );
}