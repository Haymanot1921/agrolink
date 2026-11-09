import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useQuery, type QueryKey } from '@tanstack/react-query';

import { AppFlatList } from '@components/ui/AppFlatList';
import { AppButton } from '@components/ui/AppButton';
import { ErrorState } from '@components/ui/ErrorState';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { api } from '@services/apiClient';
import { useTheme } from '@styles/useTheme';

export interface PublicProduct {
  id: string;
  name: string;
  price_etb: number;
  unit?: string;
  image_url?: string;
  category_name?: string;
}

interface GuestProductListFallbackProps {
  queryKey: QueryKey;
  params?: Record<string, string | number | undefined>;
  onOpenProduct: (productId: string) => void;
  onRequireAuth?: () => void;
  emptyTitle?: string;
}

export function GuestProductListFallback({
  queryKey,
  params,
  onOpenProduct,
  onRequireAuth,
  emptyTitle = 'No products available',
}: GuestProductListFallbackProps): React.ReactElement {
  const { colors, spacing } = useTheme();
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey,
    queryFn: () => api.get<{ items: PublicProduct[] }>('/public/products', { params }),
  });

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorState message={(error as Error).message} onRetry={refetch} />;

  return (
    <AppFlatList
      data={data?.items ?? []}
      keyExtractor={(item: PublicProduct) => item.id}
      emptyTitle={emptyTitle}
      onRefresh={refetch}
      refreshing={isRefetching}
      contentContainerStyle={{ padding: spacing.md }}
      ListHeaderComponent={
        onRequireAuth ? (
          <View style={{ marginBottom: spacing.md }}>
            <AppButton title="Sign in" onPress={onRequireAuth} />
          </View>
        ) : null
      }
      renderItem={({ item }: { item: PublicProduct }) => (
        <TouchableOpacity
          onPress={() => onOpenProduct(item.id)}
          accessibilityRole="button"
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: spacing.sm,
            marginBottom: spacing.sm,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.card,
          }}
        >
          {item.image_url ? (
            <Image source={{ uri: item.image_url }} style={{ width: 72, height: 72, borderRadius: 8 }} />
          ) : (
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 8,
                backgroundColor: colors.backgroundAlt,
              }}
            />
          )}
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{item.name}</Text>
            {item.category_name ? (
              <Text style={{ color: colors.textMuted, marginTop: 4 }}>{item.category_name}</Text>
            ) : null}
            <Text style={{ color: colors.primary, marginTop: 4 }}>
              ETB {item.price_etb}
              {item.unit ? ` / ${item.unit}` : ''}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
