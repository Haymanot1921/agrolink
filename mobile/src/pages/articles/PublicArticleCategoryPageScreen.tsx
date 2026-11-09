// mobile/src/pages/articles/PublicArticleCategoryPageScreen.tsx
// Guest-accessible articles filtered by category.
// SRS refs: §5.10 FR-ARTICLE-006.

import React from 'react';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { BaseScreen } from '@layouts/common/BaseScreen';
import { GuestArticleCategoryFallback } from './_fallbacks/GuestArticleCategoryFallback';
import type { PublicStackParamList } from '@navigation/types';

type Nav = NativeStackNavigationProp<PublicStackParamList, 'PublicArticleCategory'>;
type Route = RouteProp<PublicStackParamList, 'PublicArticleCategory'>;

export function PublicArticleCategoryPageScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { slug, title } = route.params ?? {};

  return (
    <BaseScreen title={title ?? 'Articles'} showBack>
      <GuestArticleCategoryFallback
        categorySlug={slug}
        onOpenArticle={(articleId) =>
          navigation.navigate('PublicArticleDetails', { articleId })
        }
      />
    </BaseScreen>
  );
}