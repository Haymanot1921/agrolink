import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';

interface PasswordStrengthMeterProps {
  password?: string;
}

export function PasswordStrengthMeter({
  password = '',
}: PasswordStrengthMeterProps): React.ReactElement {
  const checks = [
    password.length >= 8,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const strength = checks.filter(Boolean).length;
  const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <View accessibilityLabel={`Password strength: ${labels[strength]}`}>
      <View style={styles.track}>
        {checks.map((_, index) => (
          <View
            key={index}
            style={[
              styles.segment,
              index < strength && { backgroundColor: strength >= 3 ? colors.primary : colors.danger },
            ]}
          />
        ))}
      </View>
      <Text style={styles.label}>{labels[strength]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});
