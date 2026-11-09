import React from 'react';
import { Image, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { AppButton } from '@components/ui/AppButton';
import { ErrorState } from '@components/ui/ErrorState';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { api } from '@services/apiClient';
import { useTheme } from '@styles/useTheme';
import type { PublicProduct } from './GuestProductListFallback';

interface GuestProductDetailsFallbackProps {
  productId?: string;
  onRequireAuth: () => void;
}

export function GuestProductDetailsFallback({
  productId,
  onRequireAuth,
}: GuestProductDetailsFallbackProps): React.ReactElement {
  const { colors, spacing } = useTheme();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['public-product', productId],
    queryFn: () => api.get<PublicProduct & { description?: string }>(`/public/products/${productId}`),
    enabled: Boolean(productId),
  });

  if (!productId) {
    return (
      <View style={{ padding: spacing.lg }}>
        <Text style={{ color: colors.textMuted }}>No product selected.</Text>
      </View>
    );
  }
  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error || !data) {
    return <ErrorState message={(error as Error)?.message} onRetry={refetch} />;
  }

  return (
    <View style={{ padding: spacing.md }}>
      {data.image_url ? (
        <Image
          source={{ uri: data.image_url }}
          style={{ width: '100%', height: 220, borderRadius: 12 }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            width: '100%',
            height: 220,
            borderRadius: 12,
            backgroundColor: colors.backgroundAlt,
          }}
        />
      )}
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700', marginTop: spacing.md }}>
        {data.name}
      </Text>
      <Text style={{ color: colors.primary, fontSize: 18, fontWeight: '700', marginTop: spacing.sm }}>
        ETB {data.price_etb}
        {data.unit ? ` / ${data.unit}` : ''}
      </Text>
      {data.description ? (
        <Text style={{ color: colors.textMuted, marginTop: spacing.md }}>
          {data.description}
        </Text>
      ) : null}
      <View style={{ marginTop: spacing.lg }}>
        <AppButton title="Sign in to contact the seller" onPress={onRequireAuth} fullWidth />
      </View>
    </View>
  );
}
