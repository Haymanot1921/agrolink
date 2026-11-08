// mobile/src/shared/components/ui/PullToRefresh.tsx
// Wraps a ScrollView with native pull-to-refresh.

import React from 'react';
import { ScrollView, RefreshControl, StyleSheet, ViewStyle, ScrollViewProps } from 'react-native';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';

export interface PullToRefreshProps extends Omit<ScrollViewProps, 'refreshControl'> {
  refreshing: boolean;
  onRefresh: () => void;
  children: React.ReactNode;
  contentContainerStyle?: ViewStyle;
}

export function PullToRefresh({
  refreshing,
  onRefresh,
  children,
  contentContainerStyle,
  ...scrollProps
}: PullToRefreshProps): React.ReactElement {
  return (
    <ScrollView
      contentContainerStyle={[styles.content, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
      {...scrollProps}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, padding: spacing.md },
});