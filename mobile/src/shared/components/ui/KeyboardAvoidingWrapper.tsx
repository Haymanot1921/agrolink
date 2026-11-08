// mobile/src/shared/components/ui/KeyboardAvoidingWrapper.tsx
// Convenience wrapper for keyboard-avoiding scrollable content.

import React from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  ViewStyle,
  ScrollViewProps,
} from 'react-native';
import { spacing } from '@styles/spacing';

export interface KeyboardAvoidingWrapperProps extends Omit<ScrollViewProps, 'style'> {
  children: React.ReactNode;
  contentContainerStyle?: ViewStyle;
  /** Vertical offset — use header height on iOS. */
  offset?: number;
  /** Enable scroll (default: true). */
  scrollable?: boolean;
}

export function KeyboardAvoidingWrapper({
  children,
  contentContainerStyle,
  offset = 0,
  scrollable = true,
  ...scrollProps
}: KeyboardAvoidingWrapperProps): React.ReactElement {
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={offset}
    >
      {scrollable ? (
        <ScrollView
          contentContainerStyle={[styles.content, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          {...scrollProps}
        >
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, padding: spacing.md },
});