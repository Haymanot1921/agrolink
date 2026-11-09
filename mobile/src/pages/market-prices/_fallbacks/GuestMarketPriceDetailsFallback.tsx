import React from 'react';
import { Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { ErrorState } from '@components/ui/ErrorState';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { api } from '@services/apiClient';
import { useTheme } from '@styles/useTheme';

interface PublicMarketPriceDetails {
  id: string;
  commodity_name: string;
  market_name: string;
  price_etb: number;
  unit?: string;
  recorded_at: string;
}

interface GuestMarketPriceDetailsFallbackProps {
  priceId?: string;
}

export function GuestMarketPriceDetailsFallback({
  priceId,
}: GuestMarketPriceDetailsFallbackProps): React.ReactElement {
  const { colors, spacing } = useTheme();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['public-market-price', priceId],
    queryFn: () => api.get<PublicMarketPriceDetails>(`/public/market-prices/${priceId}`),
    enabled: Boolean(priceId),
  });

  if (!priceId) {
    return (
      <View style={{ padding: spacing.lg }}>
        <Text style={{ color: colors.textMuted }}>No market price selected.</Text>
      </View>
    );
  }
  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error || !data) {
    return <ErrorState message={(error as Error)?.message} onRetry={refetch} />;
  }

  return (
    <View style={{ padding: spacing.md }}>
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700' }}>
        {data.commodity_name}
      </Text>
      <Text style={{ color: colors.textMuted, marginTop: spacing.sm }}>
        {data.market_name}
      </Text>
      <Text style={{ color: colors.primary, fontSize: 20, fontWeight: '700', marginTop: spacing.md }}>
        ETB {data.price_etb}
        {data.unit ? ` / ${data.unit}` : ''}
      </Text>
      <Text style={{ color: colors.textSubtle, marginTop: spacing.sm }}>
        Recorded {new Date(data.recorded_at).toLocaleDateString()}
      </Text>
      <Text style={{ color: colors.textMuted, marginTop: spacing.md }}>
        Market prices are informational and are not a seller&apos;s offer.
      </Text>
    </View>
  );
}
