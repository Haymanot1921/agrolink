// mobile/src/pages/articles/PublicArticlesPageScreen.tsx
// Guest-accessible list of educational articles.
// SRS refs: §5.10 FR-ARTICLE-004, §11.1, §11.7.

import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { BaseScreen } from '@layouts/common/BaseScreen';
import { GuestArticlesFallback } from './_fallbacks/GuestArticlesFallback';
import type { PublicStackParamList } from '@navigation/types';

type Nav = NativeStackNavigationProp<PublicStackParamList, 'PublicArticles'>;

export function PublicArticlesPageScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();

  return (
    <BaseScreen title="Articles & Resources" showBack>
      <GuestArticlesFallback
        onOpenArticle={(articleId) =>
          navigation.navigate('PublicArticleDetails', { articleId })
        }
      />
    </BaseScreen>
  );
}