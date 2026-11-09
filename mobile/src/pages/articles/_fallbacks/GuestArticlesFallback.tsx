// mobile/src/pages/articles/_fallbacks/GuestArticlesFallback.tsx
// Self-contained articles list (guest).

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { api } from '@services/apiClient';
import { AppSearchBar } from '@components/ui/AppSearchBar';
import { AppFlatList } from '@components/ui/AppFlatList';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { ErrorState } from '@components/ui/ErrorState';
import { useDebounce } from '@hooks/useDebounce';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useTheme } from '@styles/useTheme';

export interface GuestArticlesFallbackProps {
  onOpenArticle: (articleId: string) => void;
}

interface PublicArticle {
  id: string;
  title_en: string;
  title_am?: string;
  excerpt_en?: string;
  cover_image_url?: string;
  category?: { slug: string; name_en: string; name_am?: string };
  published_at?: string;
  read_time_minutes?: number;
}

const CATEGORY_CHIPS = [
  { slug: 'all', labelEn: 'All', labelAm: 'ሁሉም' },
  { slug: 'best-practices', labelEn: 'Best Practices', labelAm: 'ምርጥ ልምዶች' },
  { slug: 'pest-control', labelEn: 'Pest Control', labelAm: 'የተባይ ቁጥጥር' },
  { slug: 'market-trends', labelEn: 'Market Trends', labelAm: 'የገበያ አዝማሚያ' },
];

export function GuestArticlesFallback({
  onOpenArticle,
}: GuestArticlesFallbackProps): React.ReactElement {
  const { t, i18n } = useTranslation('buyer');
  const { colors, spacing } = useTheme();
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState('all');
  const debouncedQuery = useDebounce(query, 300);
  const isAmharic = i18n.language === 'am';

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['public-articles', debouncedQuery, category],
    queryFn: () =>
      api.get<{ items: PublicArticle[] }>('/public/articles', {
        params: {
          q: debouncedQuery || undefined,
          category: category === 'all' ? undefined : category,
          page: 1,
          perPage: 20,
        },
      }),
  });

  const items = data?.items ?? [];

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: spacing.md }}>
        <AppSearchBar
          value={query}
          onChangeText={setQuery}
          placeholder={t('articles.searchPlaceholder', { defaultValue: 'Search articles…' })}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingTop: spacing.sm }}
        >
          {CATEGORY_CHIPS.map((chip) => {
            const active = chip.slug === category;
            return (
              <TouchableOpacity
                key={chip.slug}
                onPress={() => setCategory(chip.slug)}
                style={[
                  styles.chip,
                  {
                    borderColor: active ? colors.primary : colors.border,
                    backgroundColor: active ? colors.primaryLight : colors.card,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: active ? colors.primary : colors.text },
                  ]}
                >
                  {isAmharic ? chip.labelAm : chip.labelEn}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {isLoading ? (
        <LoadingSpinner fullScreen />
      ) : error ? (
        <ErrorState message={(error as Error).message} onRetry={refetch} />
      ) : (
        <AppFlatList
          data={items}
          keyExtractor={(a: PublicArticle) => a.id}
          emptyTitle={t('articles.empty', { defaultValue: 'No articles yet' })}
          onRefresh={refetch}
          refreshing={isRefetching}
          contentContainerStyle={{ padding: spacing.md }}
          renderItem={({ item }: { item: PublicArticle }) => (
            <TouchableOpacity
              style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}
              onPress={() => onOpenArticle(item.id)}
              accessibilityRole="button"
            >
              {item.cover_image_url ? (
                <Image source={{ uri: item.cover_image_url }} style={styles.thumb} />
              ) : (
                <View style={[styles.thumb, styles.thumbPlaceholder]} />
              )}
              <View style={{ flex: 1, padding: spacing.sm }}>
                {item.category ? (
                  <Text style={[styles.cat, { color: colors.primary }]}>
                    {isAmharic
                      ? item.category.name_am ?? item.category.name_en
                      : item.category.name_en}
                  </Text>
                ) : null}
                <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
                  {isAmharic ? item.title_am ?? item.title_en : item.title_en}
                </Text>
                {item.excerpt_en ? (
                  <Text
                    style={[styles.excerpt, { color: colors.textMuted }]}
                    numberOfLines={2}
                  >
                    {item.excerpt_en}
                  </Text>
                ) : null}
                {item.read_time_minutes ? (
                  <Text style={[styles.readTime, { color: colors.textSubtle }]}>
                    {item.read_time_minutes} min read
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: { fontSize: 12, fontWeight: '600' },
  card: {
    flexDirection: 'row',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    gap: 8,
  },
  thumb: { width: 88, height: 88, borderRadius: 8, backgroundColor: '#eee' },
  thumbPlaceholder: { opacity: 0.35 },
  cat: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  title: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  excerpt: { fontSize: 12, marginTop: 4 },
  readTime: { fontSize: 11, marginTop: 4 },
});