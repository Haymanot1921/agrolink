import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BaseScreen } from '@layouts/common/BaseScreen';
import { useTheme } from '@styles/useTheme';

interface ActorDashboardScreenProps {
  roleName: string;
}

export function ActorDashboardScreen({
  roleName,
}: ActorDashboardScreenProps): React.ReactElement {
  const { colors, spacing, typography } = useTheme();

  return (
    <BaseScreen title={`${roleName} Dashboard`}>
      <View style={[styles.content, { padding: spacing.lg }]}>
        <Text style={[typography.textStyles.h2, { color: colors.text }]}>
          Welcome to AgroLink
        </Text>
        <Text style={[typography.textStyles.body, styles.description, { color: colors.textMuted }]}>
          Your {roleName.toLowerCase()} workspace is ready.
        </Text>
      </View>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    marginTop: 8,
    textAlign: 'center',
  },
});
