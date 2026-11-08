// mobile/src/shared/components/ui/AppFlatList.tsx
// FlatList wrapper with built-in empty / loading / error / pull-to-refresh.

import React from 'react';
import {
  FlatList,
  FlatListProps,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  ViewStyle,
} from 'react-native';

import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';
import { useTranslation } from '@i18n/hooks/useTranslation';

export interface AppFlatListProps<ItemT> extends Omit<FlatListProps<ItemT>, 'style'> {
  /** Loading state (shows spinner). */
  loading?: boolean;
  /** Error message (shows error text). */
  error?: string | null;
  /** Empty state message. */
  emptyTitle?: string;
  emptySubtitle?: string;
  /** Pull-to-refresh handler. */
  onRefresh?: () => void;
  refreshing?: boolean;
  /** Container style override. */
  containerStyle?: ViewStyle;
  /** Content container style override. */
  contentContainerStyle?: FlatListProps<ItemT>['contentContainerStyle'];
}

export function AppFlatList<ItemT>({
  loading,
  error,
  emptyTitle,
  emptySubtitle,
  onRefresh,
  refreshing = false,
  containerStyle,
  contentContainerStyle,
  ...rest
}: AppFlatListProps<ItemT>): React.ReactElement {
  const { language } = useLanguage();
  const { t } = useTranslation('common');
  const bold = pickFontFamily(language, 'bold');
  const regular = pickFontFamily(language, 'regular');

  if (loading) {
    return (
      <View style={[styles.centered, containerStyle]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.message, { fontFamily: regular }]}>
          {t('messages.loading')}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, containerStyle]}>
        <Text style={[styles.errorText, { fontFamily: bold }]}>{error}</Text>
        <Text style={[styles.message, { fontFamily: regular }]}>
          {t('messages.tryAgain')}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      {...rest}
      style={containerStyle}
      contentContainerStyle={[
        (rest.data ?? []).length === 0 ? styles.emptyContent : styles.content,
        contentContainerStyle,
      ]}
      ListEmptyComponent={
        <View style={styles.emptyWrap}>
          <Text style={[styles.emptyTitle, { fontFamily: bold }]}>
            {emptyTitle ?? t('messages.noResults')}
          </Text>
          {emptySubtitle ? (
            <Text style={[styles.emptySubtitle, { fontFamily: regular }]}>
              {emptySubtitle}
            </Text>
          ) : null}
        </View>
      }
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.md },
  emptyContent: { flexGrow: 1, justifyContent: 'center' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  message: { marginTop: spacing.md, color: colors.textMuted, fontSize: typography.md },
  errorText: { color: colors.danger, fontSize: typography.lg, textAlign: 'center' },
  emptyWrap: { alignItems: 'center', padding: spacing.xl },
  emptyTitle: {
    fontSize: typography.lg,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: typography.md,
    color: colors.textMuted,
    textAlign: 'center',
  },
});