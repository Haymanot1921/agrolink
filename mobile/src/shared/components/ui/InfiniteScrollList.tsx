// mobile/src/shared/components/ui/InfiniteScrollList.tsx
// FlatList with automatic pagination — fires onEndReached → onLoadMore.

import React, { useCallback } from 'react';
import {
  FlatList,
  FlatListProps,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';

import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { AppFlatList } from './AppFlatList';

export interface InfiniteScrollListProps<ItemT>
  extends Omit<AppFlatListProps<ItemT>, 'onEndReached'> {
  /** Called when list scrolls near the end. */
  onLoadMore: () => void;
  /** Is a "load more" request in flight? */
  loadingMore?: boolean;
  /** Has all data been loaded? Stops further fetches. */
  hasReachedEnd?: boolean;
  /** Distance from bottom (px) to trigger load more. */
  threshold?: number;
}

export function InfiniteScrollList<ItemT>({
  onLoadMore,
  loadingMore = false,
  hasReachedEnd = false,
  threshold = 300,
  data,
  ...rest
}: InfiniteScrollListProps<ItemT>): React.ReactElement {
  const { t } = useTranslation('common');

  const handleEndReached = useCallback(() => {
    if (!loadingMore && !hasReachedEnd && (data ?? []).length > 0) {
      onLoadMore();
    }
  }, [loadingMore, hasReachedEnd, data, onLoadMore]);

  return (
    <AppFlatList
      {...rest}
      data={data}
      onEndReached={handleEndReached}
      onEndReachedThreshold={threshold / 500}
      ListFooterComponent={
        loadingMore ? (
          <View style={styles.footer}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : hasReachedEnd && (data ?? []).length > 0 ? (
          <View style={styles.footer}>
            <Text style={styles.endText}>{t('messages.noResults')}</Text>
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endText: {
    fontSize: typography.sm,
    color: colors.textMuted,
  },
});