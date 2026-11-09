// mobile/src/pages/articles/PublicArticleDetailsPageScreen.tsx
// Guest-accessible article detail.
// SRS refs: §5.10 FR-ARTICLE-004, FR-ARTICLE-007 (EN + AM).

import React from 'react';
import { useRoute, type RouteProp } from '@react-navigation/native';

import { BaseScreen } from '@layouts/common/BaseScreen';
import { GuestArticleDetailsFallback } from './_fallbacks/GuestArticleDetailsFallback';
import type { PublicStackParamList } from '@navigation/types';

type Route = RouteProp<PublicStackParamList, 'PublicArticleDetails'>;

export function PublicArticleDetailsPageScreen(): React.ReactElement {
  const route = useRoute<Route>();
  const articleId = route.params?.articleId;

  if (!articleId) {
    return (
      <BaseScreen title="Article" showBack>
        <GuestArticleDetailsFallback articleId={undefined} />
      </BaseScreen>
    );
  }

  return (
    <BaseScreen title="Article" showBack>
      <GuestArticleDetailsFallback articleId={articleId} />
    </BaseScreen>
  );
}