// mobile/src/pages/articles/_fallbacks/GuestArticleDetailsFallback.tsx

import React from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  Image,
  View,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { api } from '@services/apiClient';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { ErrorState } from '@components/ui/ErrorState';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useTheme } from '@styles/useTheme';

export interface GuestArticleDetailsFallbackProps {
  articleId?: string;
}

interface PublicArticleDetails {
  id: string;
  title_en: string;
  title_am?: string;
  content_en: string;
  content_am?: string;
  cover_image_url?: string;
  category?: { slug: string; name_en: string; name_am?: string };
  author_name?: string;
  published_at?: string;
  read_time_minutes?: number;
}

export function GuestArticleDetailsFallback({
  articleId,
}: GuestArticleDetailsFallbackProps): React.ReactElement {
  const { t, i18n } = useTranslation('buyer');
  const { colors, spacing } = useTheme();
  const isAmharic = i18n.language === 'am';

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['public-article', articleId],
    queryFn: () => api.get<PublicArticleDetails>(`/public/articles/${articleId}`),
    enabled: Boolean(articleId),
  });

  if (!articleId) {
    return (
      <View style={{ padding: spacing.lg }}>
        <Text style={{ color: colors.textMuted }}>
          {t('articles.empty', { defaultValue: 'No article selected' })}
        </Text>
      </View>
    );
  }
  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error || !data) {
    return <ErrorState message={(error as Error)?.message} onRetry={refetch} />;
  }

  const title = isAmharic ? data.title_am ?? data.title_en : data.title_en;
  const content = isAmharic ? data.content_am ?? data.content_en : data.content_en;

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing['2xl'] }}>
      {data.cover_image_url ? (
        <Image source={{ uri: data.cover_image_url }} style={styles.hero} />
      ) : (
        <View style={[styles.hero, styles.heroPlaceholder]} />
      )}

      {data.category ? (
        <Text style={[styles.category, { color: colors.primary }]}>
          {isAmharic ? data.category.name_am ?? data.category.name_en : data.category.name_en}
        </Text>
      ) : null}

      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

      <View style={styles.meta}>
        {data.author_name ? (
          <Text style={[styles.metaText, { color: colors.textMuted }]}>
            {data.author_name}
          </Text>
        ) : null}
        {data.read_time_minutes ? (
          <Text style={[styles.metaText, { color: colors.textMuted }]}>
            {' • '}
            {data.read_time_minutes} min read
          </Text>
        ) : null}
      </View>

      <View style={styles.divider} />

      <Text style={[styles.body, { color: colors.text }]}>{content}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: { width: '100%', height: 220, borderRadius: 12, marginBottom: 16 },
  heroPlaceholder: { backgroundColor: '#eee' },
  category: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 6 },
  title: { fontSize: 24, fontWeight: '800', lineHeight: 30, marginBottom: 8 },
  meta: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  metaText: { fontSize: 12 },
  divider: { height: 1, backgroundColor: '#e0e0e0', marginBottom: 16 },
  body: { fontSize: 15, lineHeight: 24 },
});