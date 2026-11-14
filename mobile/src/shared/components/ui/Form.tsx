import React from 'react';
import { View } from 'react-native';
import { spacing } from '@styles/spacing';

interface FormProps {
  children: React.ReactNode;
  onSubmit?: () => void;
}

export function Form({ children }: FormProps): React.ReactElement {
  return <View style={{ gap: spacing.md }}>{children}</View>;
}
