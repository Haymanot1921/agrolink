// mobile/src/pages/public/BlogScreen.tsx
// Public blog — reuses the article service.
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BaseScreen } from '@layouts/common/BaseScreen';
import { AppFlatList } from '@components/ui/AppFlatList';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useTheme } from '@styles/useTheme';
import { useQuery } from '@tanstack/react-query';
import { api } from '@services/apiClient';
import type { PublicStackParamList } from '@navigation/types';

interface PublicArticle {
  id: string;
  title_en: string;
  cover_image_url?: string;
  excerpt_en?: string;
  published_at?: string;
}

export function BlogScreen(): React.ReactElement {
  const { t } = useTranslation('public');
  const { colors, spacing } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<PublicStackParamList, 'Blog'>>();
  const { data, isLoading, error } = useQuery({
    queryKey: ['public-articles'],
    queryFn: () => api.get<{ items: PublicArticle[] }>('/public/articles'),
  });

  return (
    <BaseScreen title={t('blog.title')} showBack>
      <AppFlatList
        data={data?.items ?? []}
        keyExtractor={(item: PublicArticle) => item.id}
        loading={isLoading}
        error={error ? (error as Error).message : null}
        emptyTitle={t('blog.empty')}
        renderItem={({ item }: { item: PublicArticle }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('PublicArticleDetails', { articleId: item.id })
            }
            accessibilityRole="button"
            style={{
              flexDirection: 'row',
              padding: spacing.sm,
              marginBottom: spacing.sm,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.card,
            }}
          >
            {item.cover_image_url ? (
              <Image
                source={{ uri: item.cover_image_url }}
                style={{ width: 84, height: 84, borderRadius: 8 }}
              />
            ) : null}
            <View style={{ flex: 1, paddingHorizontal: spacing.sm }}>
              <Text style={{ color: colors.text, fontWeight: '700' }}>{item.title_en}</Text>
              {item.excerpt_en ? (
                <Text style={{ color: colors.textMuted, marginTop: 4 }} numberOfLines={2}>
                  {item.excerpt_en}
                </Text>
              ) : null}
              {item.published_at ? (
                <Text style={{ color: colors.textSubtle, marginTop: 4 }}>
                  {new Date(item.published_at).toLocaleDateString()}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: spacing.md }}
      />
    </BaseScreen>
  );
}