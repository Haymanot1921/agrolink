// mobile/src/pages/experts/PublicExpertsPageScreen.tsx
// Guest-accessible verified experts directory.
// SRS refs: §5.8 FR-CONSULT-001, §11.1, §11.7.
// ⚠️ §2.4 exclusion: human experts only — NO AI advisors.

import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { BaseScreen } from '@layouts/common/BaseScreen';
import { GuestExpertsFallback } from './_fallbacks/GuestExpertsFallback';
import type { PublicStackParamList } from '@navigation/types';

type Nav = NativeStackNavigationProp<PublicStackParamList, 'PublicExperts'>;

export function PublicExpertsPageScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();

  const handleRequireAuth = () => navigation.navigate('Login');

  return (
    <BaseScreen title="Agricultural Experts" showBack>
      <GuestExpertsFallback
        onOpenExpert={(expertId) =>
          navigation.navigate('PublicExpertDetails', { expertId })
        }
        onRequireAuth={handleRequireAuth}
      />
    </BaseScreen>
  );
}