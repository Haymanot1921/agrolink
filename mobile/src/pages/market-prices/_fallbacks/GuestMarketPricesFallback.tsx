import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { AppFlatList } from '@components/ui/AppFlatList';
import { ErrorState } from '@components/ui/ErrorState';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { api } from '@services/apiClient';
import { useTheme } from '@styles/useTheme';

interface PublicMarketPrice {
  id: string;
  commodity_name: string;
  market_name: string;
  price_etb: number;
  unit?: string;
  recorded_at: string;
}

interface GuestMarketPricesFallbackProps {
  onOpenPrice: (priceId: string) => void;
}

export function GuestMarketPricesFallback({
  onOpenPrice,
}: GuestMarketPricesFallbackProps): React.ReactElement {
  const { colors, spacing } = useTheme();
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['public-market-prices'],
    queryFn: () => api.get<{ items: PublicMarketPrice[] }>('/public/market-prices'),
  });

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorState message={(error as Error).message} onRetry={refetch} />;

  return (
    <AppFlatList
      data={data?.items ?? []}
      keyExtractor={(item: PublicMarketPrice) => item.id}
      emptyTitle="No market prices available"
      onRefresh={refetch}
      refreshing={isRefetching}
      contentContainerStyle={{ padding: spacing.md }}
      renderItem={({ item }: { item: PublicMarketPrice }) => (
        <TouchableOpacity
          onPress={() => onOpenPrice(item.id)}
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
            {item.commodity_name}
          </Text>
          <Text style={{ color: colors.textMuted, marginTop: 4 }}>
            {item.market_name} · ETB {item.price_etb}
            {item.unit ? ` / ${item.unit}` : ''}
          </Text>
          <Text style={{ color: colors.textSubtle, marginTop: 4 }}>
            Updated {new Date(item.recorded_at).toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}
