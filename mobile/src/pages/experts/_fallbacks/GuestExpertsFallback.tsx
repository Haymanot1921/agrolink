// mobile/src/pages/experts/_fallbacks/GuestExpertsFallback.tsx
// Self-contained experts directory (guest).

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { api } from '@services/apiClient';
import { AppSearchBar } from '@components/ui/AppSearchBar';
import { AppFlatList } from '@components/ui/AppFlatList';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { ErrorState } from '@components/ui/ErrorState';
import { StarRating } from '@components/ui/StarRating';
import { useDebounce } from '@hooks/useDebounce';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useTheme } from '@styles/useTheme';

export interface GuestExpertsFallbackProps {
  onOpenExpert: (expertId: string) => void;
  onRequireAuth: () => void;
}

interface PublicExpert {
  id: string;
  full_name: string;
  avatar_url?: string;
  biography?: string;
  specializations?: string[];
  experience_years?: number;
  rating_avg?: number;
  rating_count?: number;
  languages?: string[];
}

const SPECIALIZATION_CHIPS = [
  { slug: 'all', labelEn: 'All', labelAm: 'ሁሉም' },
  { slug: 'crop_protection', labelEn: 'Crop Protection', labelAm: 'የሰብል ጥበቃ' },
  { slug: 'soil_fertility', labelEn: 'Soil Fertility', labelAm: 'የአፈር ለምነት' },
  { slug: 'irrigation', labelEn: 'Irrigation', labelAm: 'መስኖ' },
  { slug: 'livestock_health', labelEn: 'Livestock Health', labelAm: 'የእንስሳት ጤና' },
];

export function GuestExpertsFallback({
  onOpenExpert,
  onRequireAuth,
}: GuestExpertsFallbackProps): React.ReactElement {
  const { t, i18n } = useTranslation('buyer');
  const { colors, spacing } = useTheme();
  const isAmharic = i18n.language === 'am';
  const [query, setQuery] = React.useState('');
  const [specialization, setSpecialization] = React.useState('all');
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['public-experts', debouncedQuery, specialization],
    queryFn: () =>
      api.get<{ items: PublicExpert[] }>('/public/experts', {
        params: {
          q: debouncedQuery || undefined,
          specialization: specialization === 'all' ? undefined : specialization,
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
          placeholder={t('consultations.searchExperts', { defaultValue: 'Search experts…' })}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingTop: spacing.sm }}
        >
          {SPECIALIZATION_CHIPS.map((chip) => {
            const active = chip.slug === specialization;
            return (
              <TouchableOpacity
                key={chip.slug}
                onPress={() => setSpecialization(chip.slug)}
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
          keyExtractor={(e: PublicExpert) => e.id}
          emptyTitle={t('consultations.noExperts', { defaultValue: 'No experts available' })}
          onRefresh={refetch}
          refreshing={isRefetching}
          contentContainerStyle={{ padding: spacing.md }}
          renderItem={({ item }: { item: PublicExpert }) => (
            <TouchableOpacity
              style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}
              onPress={() => onOpenExpert(item.id)}
              accessibilityRole="button"
            >
              {item.avatar_url ? (
                <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarInitial}>E</Text>
                </View>
              )}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                  {item.full_name}
                </Text>
                {item.specializations?.length ? (
                  <Text style={[styles.specs, { color: colors.textMuted }]} numberOfLines={1}>
                    {item.specializations
                      .slice(0, 2)
                      .map((s) => s.replace(/_/g, ' '))
                      .join(' · ')}
                  </Text>
                ) : null}
                {item.experience_years ? (
                  <Text style={[styles.meta, { color: colors.textMuted }]}>
                    {item.experience_years} yrs experience
                  </Text>
                ) : null}
                {item.rating_avg ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <StarRating rating={item.rating_avg} size={12} />
                    <Text style={[styles.rating, { color: colors.textMuted }]}>
                      {' '}
                      {item.rating_avg.toFixed(1)} ({item.rating_count ?? 0})
                    </Text>
                  </View>
                ) : null}
              </View>
              <TouchableOpacity
                style={[styles.cta, { backgroundColor: colors.primary }]}
                onPress={onRequireAuth}
                accessibilityRole="button"
              >
                <Text style={styles.ctaText}>{t('consultations.request', { defaultValue: 'Request' })}</Text>
              </TouchableOpacity>
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
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    gap: 8,
  },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#eee' },
  avatarPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { color: '#555', fontSize: 20, fontWeight: '700' },
  name: { fontSize: 15, fontWeight: '700' },
  specs: { fontSize: 12, marginTop: 2, textTransform: 'capitalize' },
  meta: { fontSize: 11, marginTop: 2 },
  rating: { fontSize: 11 },
  cta: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  ctaText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});