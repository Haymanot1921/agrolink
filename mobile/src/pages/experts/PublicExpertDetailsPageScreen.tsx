// mobile/src/pages/experts/PublicExpertDetailsPageScreen.tsx
// Guest-accessible expert profile.
// SRS refs: §5.8 FR-CONSULT-002 (permitted professional info only).

import React from 'react';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { BaseScreen } from '@layouts/common/BaseScreen';
import { GuestExpertDetailsFallback } from './_fallbacks/GuestExpertDetailsFallback';
import type { PublicStackParamList } from '@navigation/types';

type Nav = NativeStackNavigationProp<PublicStackParamList, 'PublicExpertDetails'>;
type Route = RouteProp<PublicStackParamList, 'PublicExpertDetails'>;

export function PublicExpertDetailsPageScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const expertId = route.params?.expertId;

  const handleRequireAuth = () => navigation.navigate('Login');

  if (!expertId) {
    return (
      <BaseScreen title="Expert" showBack>
        <GuestExpertDetailsFallback expertId={undefined} onRequireAuth={handleRequireAuth} />
      </BaseScreen>
    );
  }

  return (
    <BaseScreen title="Expert" showBack>
      <GuestExpertDetailsFallback expertId={expertId} onRequireAuth={handleRequireAuth} />
    </BaseScreen>
  );
}