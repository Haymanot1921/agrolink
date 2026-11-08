// mobile/src/shared/components/ui/SafeAreaWrapper.tsx
// Consistent safe-area wrapper with configurable edges + background.

import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { colors } from '@styles/colors';

export interface SafeAreaWrapperProps {
  children: React.ReactNode;
  edges?: Edge[];
  backgroundColor?: string;
  style?: ViewStyle;
}

export function SafeAreaWrapper({
  children,
  edges = ['top', 'left', 'right', 'bottom'],
  backgroundColor = colors.background,
  style,
}: SafeAreaWrapperProps): React.ReactElement {
  return (
    <SafeAreaView
      edges={edges}
      style={[styles.container, { backgroundColor }, style]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});