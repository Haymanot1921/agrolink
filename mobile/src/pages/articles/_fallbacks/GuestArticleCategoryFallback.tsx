import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { AppFlatList } from '@components/ui/AppFlatList';
import { ErrorState } from '@components/ui/ErrorState';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { api } from '@services/apiClient';
import { useTheme } from '@styles/useTheme';

interface PublicArticle {
  id: string;
  title_en: string;
  title_am?: string;
  excerpt_en?: string;
}

interface GuestArticleCategoryFallbackProps {
  categorySlug?: string;
  onOpenArticle: (articleId: string) => void;
}

export function GuestArticleCategoryFallback({
  categorySlug,
  onOpenArticle,
}: GuestArticleCategoryFallbackProps): React.ReactElement {
  const { colors, spacing } = useTheme();
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['public-articles', 'category', categorySlug],
    queryFn: () =>
      api.get<{ items: PublicArticle[] }>('/public/articles', {
        params: { category: categorySlug, page: 1, perPage: 20 },
      }),
    enabled: Boolean(categorySlug),
  });

  if (!categorySlug) {
    return (
      <View style={{ padding: spacing.lg }}>
        <Text style={{ color: colors.textMuted }}>No article category selected.</Text>
      </View>
    );
  }
  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorState message={(error as Error).message} onRetry={refetch} />;

  return (
    <AppFlatList
      data={data?.items ?? []}
      keyExtractor={(item: PublicArticle) => item.id}
      emptyTitle="No articles in this category"
      onRefresh={refetch}
      refreshing={isRefetching}
      contentContainerStyle={{ padding: spacing.md }}
      renderItem={({ item }: { item: PublicArticle }) => (
        <TouchableOpacity
          onPress={() => onOpenArticle(item.id)}
          accessibilityRole="button"
          style={{
            padding: spacing.md,
            marginBottom: spacing.sm,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.card,
          }}
        >
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>
            {item.title_en}
          </Text>
          {item.excerpt_en ? (
            <Text style={{ color: colors.textMuted, marginTop: spacing.xs }}>
              {item.excerpt_en}
            </Text>
          ) : null}
        </TouchableOpacity>
      )}
    />
  );
}